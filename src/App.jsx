import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { checkTodayAnniversary } from './lib/anniversaryNotify'
import { getSession, onAuthStateChange } from './lib/auth'
import { ensureProfile } from './lib/coupleStore'
import { refreshCoupleState } from './lib/coupleState'
import { subscribePokes, syncMissedNotifications } from './lib/pokeStore'
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
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    checkTodayAnniversary()
  }, [])

  // 로그인 세션이 있으면 앱을 어느 경로로 열었든 프로필/커플 캐시를 채우고 찌르기 구독을 건다.
  // 커플 연결은 더 이상 강제 단계가 아니라, 홈 화면 상단 배너에서 원할 때 하도록 유도한다.
  useEffect(() => {
    const setupLoggedInUser = async (session) => {
      const profile = await ensureProfile(session.user)
      await refreshCoupleState()
      await syncMissedNotifications()
      if (profile?.couple_id) subscribePokes()
      return profile
    }

    // 이미 세션이 남아있는 재방문: 커플/프로필 캐시가 다 채워지기 전까지는 화면을 그리지 않는다.
    // (캐시는 새로고침마다 초기화되는 메모리 값이라, 이 체크가 끝나기 전에 홈 화면이 먼저
    // 그려지면 "아직 커플 연결 전이에요" 같은 잘못된 상태가 잠깐 보였다가 사라지는 문제가 있었다.)
    getSession().then(async (session) => {
      if (session) {
        await setupLoggedInUser(session)
      }
      setAuthReady(true)
      if (session && location.pathname === '/') {
        navigate('/home', { replace: true })
      }
    })

    // 카카오/구글 로그인 리다이렉트로 돌아온 직후에는 세션이 조금 늦게(비동기로) 잡혀서
    // 위 getSession() 체크 시점엔 아직 null일 수 있다. 실제 로그인이 완료되는 순간을
    // 여기서 별도로 감지해 확실히 홈으로 넘어가게 한다.
    const unsubscribe = onAuthStateChange(async (session, event) => {
      if (event !== 'SIGNED_IN' || !session) return
      await setupLoggedInUser(session)
      setAuthReady(true)
      navigate('/home', { replace: true })
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!authReady) {
    return (
      <div className="splash-wrap">
        <div className="splash-logo">💌</div>
      </div>
    )
  }

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
