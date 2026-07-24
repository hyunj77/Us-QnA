import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { checkTodayAnniversary } from './lib/anniversaryNotify'
import { getSession } from './lib/auth'
import { ensureProfile } from './lib/coupleStore'
import { refreshCoupleState } from './lib/coupleState'
import Splash from './pages/Splash'
import Onboarding from './pages/Onboarding'
import Signup from './pages/Signup'
import Home from './pages/Home'
import QnACategories from './pages/QnACategories'
import QnAQuestionList from './pages/QnAQuestionList'
import QnASearch from './pages/QnASearch'
import QuestionDetail from './pages/QuestionDetail'
import AnswerResult from './pages/AnswerResult'
import Memories from './pages/Memories'
import Notifications from './pages/Notifications'
import MyPage from './pages/MyPage'
import Settings from './pages/Settings'
import BookViewer from './pages/BookViewer'
import BookList from './pages/BookList'
import BookmarksList from './pages/BookmarksList'
import AnswersList from './pages/AnswersList'
import UsStats from './pages/UsStats'
import CoupleConnect from './pages/CoupleConnect'

function AppRoutes() {
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    checkTodayAnniversary()
  }, [])

  // 카카오/구글 로그인 후 돌아왔을 때(또는 세션이 남아있는 재방문 시) 스플래시를 건너뛴다.
  // 프로필이 없으면 만들고, 아직 커플 연결 전이면 연결 화면으로, 연결됐으면 바로 홈으로 보낸다.
  useEffect(() => {
    if (location.pathname !== '/') return
    getSession().then(async (session) => {
      if (!session) return
      const profile = await ensureProfile(session.user)
      await refreshCoupleState()
      navigate(profile?.couple_id ? '/home' : '/couple-connect', { replace: true })
    })
  }, [location.pathname, navigate])

  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/couple-connect" element={<CoupleConnect />} />

        <Route path="/home" element={<Home />} />
        <Route path="/qna" element={<QnACategories />} />
        <Route path="/qna/search" element={<QnASearch />} />
        <Route path="/qna/:categoryId" element={<QnAQuestionList />} />
        <Route path="/qna/:categoryId/:questionId" element={<QuestionDetail />} />
        <Route path="/qna/:categoryId/:questionId/result" element={<AnswerResult />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/books" element={<BookList />} />
        <Route path="/book/:bookId" element={<BookViewer />} />
        <Route path="/bookmarks" element={<BookmarksList />} />
        <Route path="/answers/:who" element={<AnswersList />} />
        <Route path="/us" element={<UsStats />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AppRoutes />
    </HashRouter>
  )
}
