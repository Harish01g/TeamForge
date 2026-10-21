import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Discover from './pages/Discover'
import OpportunityDetail from './pages/OpportunityDetail'
import CreateOpportunity from './pages/CreateOpportunity'
import MyTeams from './pages/MyTeams'
import TeamDetail from './pages/TeamDetail'
import Saved from './pages/Saved'
import Messages from './pages/Messages'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import AuthPage from './pages/AuthPage'
import Students from './pages/Students'
import StudentProfile from './pages/StudentProfile'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <div className="grid min-h-screen place-items-center bg-cream-100 text-ink-soft">Loading TeamForge…</div>
  if (!user) {
    return (
      <Routes>
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    )
  }
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Discover />} />
        <Route path="students" element={<Students />} />
        <Route path="students/:id" element={<StudentProfile />} />
        <Route path="opportunities/new" element={<CreateOpportunity />} />
        <Route path="opportunities/:id/edit" element={<CreateOpportunity />} />
        <Route path="opportunities/:id" element={<OpportunityDetail />} />
        <Route path="teams" element={<MyTeams />} />
        <Route path="teams/:id" element={<TeamDetail />} />
        <Route path="saved" element={<Saved />} />
        <Route path="messages" element={<Messages />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
