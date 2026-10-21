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

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Discover />} />
        <Route path="opportunities/new" element={<CreateOpportunity />} />
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
