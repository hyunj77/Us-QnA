import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { checkTodayAnniversary } from './lib/anniversaryNotify'
import { getSession } from './lib/auth'
import { ensureProfile } from './lib/coupleStore'
import { refreshCoupleState } from './lib/coupleState'
import { subscribePokes } from './lib/pokeStore'
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

  // 로그인 세션이 있으면 앱을 어느 경로로 열었든 프로필/커플 캐시를 채우고 찌르기 구독을 건다.
  // 스플래시('/')로 들어온 경우에만 프로필/커플 연결 여부에 따라 알맞은 화면으로 자동 이동시킨다.
  useEffect(() => {
    getSession().then(async (session) => {
      if (!session) return
      const profile = await ensureProfile(session.user)
      await refreshCoupleState()
      if (profile?.couple_id) subscribePokes()
      if (location.pathname === '/') {
        navigate(profile?.couple_id ? '/home' : '/couple-connect', { replace: true })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
