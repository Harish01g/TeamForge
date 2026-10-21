import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as opportunityService from '../services/opportunityService'
import * as savedService from '../services/savedService'
import * as joinRequestService from '../services/joinRequestService'
import * as profileService from '../services/profileService'
import * as teamService from '../services/teamService'
import * as messageService from '../services/messageService'
import * as notificationService from '../services/notificationService'
import { useAuth } from './AuthContext'

// APP DATA lives here (opportunities, profile, saved items, messages...).
// Pages call these actions; the actions call the services. Pages never import sample data.
// UI-only state (open menus, filters) stays inside the components that use it.
const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [opportunities, setOpportunities] = useState([])
  const [savedIds, setSavedIds] = useState([])
  const [joinRequests, setJoinRequests] = useState([])
  const [profile, setProfile] = useState(null)
  const [teams, setTeams] = useState([])
  const [conversations, setConversations] = useState([])
  const [notifications, setNotifications] = useState([])

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [opps, saved, requests, me, myTeams, convos, notes] = await Promise.all([
        opportunityService.getOpportunities(),
        savedService.getSavedIds(),
        joinRequestService.getJoinRequests(),
        profileService.getProfile(),
        teamService.getTeams(),
        messageService.getConversations(),
        notificationService.getNotifications().catch(() => []),
      ])
      setOpportunities(opps)
      setSavedIds(saved)
      setJoinRequests(requests)
      setProfile(me)
      setTeams(myTeams)
      setConversations(convos)
      setNotifications(notes)
    } catch {
      setError('We could not load TeamForge. Check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authLoading) return
    if (user) {
      load()
      return
    }
    setLoading(false)
    setOpportunities([])
    setSavedIds([])
    setJoinRequests([])
    setProfile(null)
    setTeams([])
    setConversations([])
    setNotifications([])
  }, [load, authLoading, user])

  // ----- opportunities -----
  const addOpportunity = async (payload) => {
    const created = await opportunityService.createOpportunity(payload, profile)
    setOpportunities((prev) => [created, ...prev])
    setTeams((prev) => [{
      id: created.id, name: created.title, description: created.description, status: 'Planning', myRole: 'Team lead',
      members: created.members || [], milestones: created.milestones || [], resources: [],
    }, ...prev.filter((team) => team.id !== created.id)])
    return created
  }

  const updateOpportunity = async (id, payload) => {
    const updated = await opportunityService.updateOpportunity(id, payload)
    setOpportunities((prev) => prev.map((opportunity) => opportunity.id === id ? updated : opportunity))
    setTeams((prev) => prev.map((team) => team.id === id ? { ...team, name: updated.title, description: updated.description } : team))
    return updated
  }

  const removeOpportunity = async (id) => {
    await opportunityService.deleteOpportunity(id)
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
    setSavedIds((prev) => prev.filter((x) => x !== id))
    setJoinRequests((prev) => prev.filter((r) => r.opportunityId !== id))
  }

  // ----- saved -----
  const toggleSave = async (id) => {
    const saved = savedIds.includes(id)
    setSavedIds(await savedService.setSaved(id, !saved))
  }
  const clearSaved = async () => setSavedIds(await savedService.clearSaved())

  // ----- join requests -----
  const requestToJoin = async (opportunityId, message) => {
    const request = await joinRequestService.createJoinRequest({ opportunityId, message })
    setJoinRequests((prev) => [request, ...prev.filter((item) => item.id !== request.id)])
    return request
  }

  const withdrawRequest = async (id) => {
    const result = await joinRequestService.updateJoinRequest(id, 'Withdrawn')
    setJoinRequests((prev) => prev.map((r) => r.id === id ? result.request : r))
  }

  const reviewJoinRequest = async (id, status) => {
    const result = await joinRequestService.updateJoinRequest(id, status)
    if (result.opportunity) {
      setOpportunities((prev) => prev.map((o) => o.id === result.opportunity.id ? result.opportunity : o))
      setTeams((prev) => prev.map((team) => team.id === result.opportunity.id ? {
        ...team,
        members: result.opportunity.members || team.members,
        status: (result.opportunity.members || []).length > 1 ? 'Active' : 'Planning',
      } : team))
    }
    setJoinRequests((prev) => prev.map((r) => {
      if (r.id === id) return result.request
      if (status === 'Accepted' && result.opportunity?.openSpots === 0 && r.opportunityId === result.request.opportunityId && r.status === 'Pending') {
        return { ...r, status: 'Declined' }
      }
      return r
    }))
    return result.request
  }

  // ----- profile -----
  const saveProfile = async (values) => setProfile(await profileService.updateProfile(values))

  // ----- teams -----
  const addMilestone = async (teamId, values) => {
    const milestone = await teamService.addMilestone(teamId, values)
    setTeams((prev) => prev.map((team) => team.id === teamId ? { ...team, milestones: [...team.milestones, milestone] } : team))
    return milestone
  }
  const toggleMilestone = async (teamId, milestoneId, done) => {
    const milestone = await teamService.updateMilestone(teamId, milestoneId, done)
    setTeams((prev) => prev.map((team) => team.id === teamId
      ? { ...team, milestones: team.milestones.map((item) => item.id === milestoneId ? milestone : item) }
      : team))
  }
  const leaveTeam = async (teamId) => {
    await teamService.leaveTeam(teamId)
    setTeams((prev) => prev.filter((t) => t.id !== teamId))
    setOpportunities((prev) => prev.map((opportunity) => opportunity.id === teamId ? {
      ...opportunity,
      members: (opportunity.members || []).filter((member) => member.id !== profile?.id),
      openSpots: opportunity.openSpots + 1,
    } : opportunity))
    setJoinRequests((prev) => prev.map((request) => request.opportunityId === teamId && request.applicantId === profile?.id && request.status === 'Accepted'
      ? { ...request, status: 'Withdrawn' }
      : request))
    setConversations((prev) => prev.filter((conversation) => conversation.opportunityId !== teamId))
  }

  // ----- messages -----
  const sendMessage = useCallback(async (conversationId, text) => {
    const message = await messageService.sendMessage(conversationId, text)
    setConversations((prev) => prev.map((c) => (c.id === conversationId
      ? { ...c, messages: [...c.messages.filter((item) => item.id !== message.id), message], lastMessageAt: message.sentAt }
      : c)))
  }, [])
  const markConversationRead = useCallback(async (conversationId) => {
    const result = await messageService.markConversationRead(conversationId)
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? { ...c, unread: result.unread } : c)))
  }, [])
  const refreshConversations = useCallback(async () => {
    const updated = await messageService.getConversations()
    setConversations(updated)
    return updated
  }, [])

  // ----- notifications -----
  const markNotificationRead = async (id) => {
    await notificationService.markNotificationRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }
  const markAllNotificationsRead = async () => {
    await notificationService.markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }
  const refreshNotifications = useCallback(async () => {
    const updated = await notificationService.getNotifications()
    setNotifications(updated)
    return updated
  }, [])

  const value = {
    loading, error, reload: load,
    opportunities, savedIds, joinRequests, profile, teams, conversations, notifications,
    unreadMessages: conversations.reduce((sum, c) => sum + c.unread, 0),
    unreadNotifications: notifications.filter((n) => !n.read).length,
    addOpportunity, updateOpportunity, removeOpportunity, toggleSave, clearSaved, requestToJoin, withdrawRequest, reviewJoinRequest,
    saveProfile, addMilestone, toggleMilestone, leaveTeam, sendMessage, markConversationRead,
    markNotificationRead, markAllNotificationsRead, refreshNotifications, refreshConversations,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>')
  return ctx
}
