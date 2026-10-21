import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import * as opportunityService from '../services/opportunityService'
import * as savedService from '../services/savedService'
import * as joinRequestService from '../services/joinRequestService'
import * as profileService from '../services/profileService'
import * as teamService from '../services/teamService'
import * as messageService from '../services/messageService'
import * as notificationService from '../services/notificationService'

// APP DATA lives here (opportunities, profile, saved items, messages...).
// Pages call these actions; the actions call the services. Pages never import sample data.
// UI-only state (open menus, filters) stays inside the components that use it.
const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
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
        notificationService.getNotifications(),
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
    load()
  }, [load])

  const pushNotification = async (data) => {
    const note = await notificationService.addNotification(data)
    setNotifications((prev) => [note, ...prev])
  }

  // ----- opportunities -----
  const addOpportunity = async (payload) => {
    const created = await opportunityService.createOpportunity(payload, profile)
    setOpportunities((prev) => [created, ...prev])
    await pushNotification({ type: 'match', title: 'Your opportunity is live (demo)', body: `“${created.title}” now appears on Discover for this session.`, link: `/opportunities/${created.id}` })
    return created
  }

  const removeOpportunity = async (id) => {
    await opportunityService.deleteOpportunity(id)
    setOpportunities((prev) => prev.filter((o) => o.id !== id))
    setSavedIds((prev) => prev.filter((x) => x !== id))
    setJoinRequests((prev) => prev.filter((r) => r.opportunityId !== id))
  }

  // ----- saved -----
  const toggleSave = async (id) => setSavedIds(await savedService.toggleSaved(id))
  const clearSaved = async () => setSavedIds(await savedService.clearSaved())

  // ----- join requests -----
  const requestToJoin = async (opportunityId, message) => {
    const request = await joinRequestService.createJoinRequest({ opportunityId, applicantId: profile.id, message })
    setJoinRequests((prev) => [request, ...prev])
    const opp = opportunities.find((o) => o.id === opportunityId)
    await pushNotification({
      type: 'request',
      title: 'Join request saved (demo)',
      body: `Your request for “${opp?.title}” is stored in this session only. Nobody was notified.`,
      link: `/opportunities/${opportunityId}`,
    })
    return request
  }

  const withdrawRequest = async (id) => {
    await joinRequestService.withdrawJoinRequest(id)
    setJoinRequests((prev) => prev.filter((r) => r.id !== id))
  }

  // ----- profile -----
  const saveProfile = async (values) => setProfile(await profileService.updateProfile(values))

  // ----- teams -----
  const toggleMilestone = async (teamId, milestoneId) => {
    const updated = await teamService.toggleMilestone(teamId, milestoneId)
    setTeams((prev) => prev.map((t) => (t.id === teamId ? updated : t)))
  }
  const leaveTeam = async (teamId) => {
    await teamService.leaveTeam(teamId)
    setTeams((prev) => prev.filter((t) => t.id !== teamId))
  }

  // ----- messages -----
  const sendMessage = async (conversationId, text) => {
    const updated = await messageService.sendMessage(conversationId, text)
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? updated : c)))
  }
  const markConversationRead = async (conversationId) => {
    const updated = await messageService.markConversationRead(conversationId)
    setConversations((prev) => prev.map((c) => (c.id === conversationId ? updated : c)))
  }

  // ----- notifications -----
  const markNotificationRead = async (id) => {
    await notificationService.markNotificationRead(id)
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }
  const markAllNotificationsRead = async () => {
    await notificationService.markAllNotificationsRead()
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const value = {
    loading, error, reload: load,
    opportunities, savedIds, joinRequests, profile, teams, conversations, notifications,
    unreadMessages: conversations.reduce((sum, c) => sum + c.unread, 0),
    unreadNotifications: notifications.filter((n) => !n.read).length,
    addOpportunity, removeOpportunity, toggleSave, clearSaved, requestToJoin, withdrawRequest,
    saveProfile, toggleMilestone, leaveTeam, sendMessage, markConversationRead,
    markNotificationRead, markAllNotificationsRead,
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>')
  return ctx
}
