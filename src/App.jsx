import { HashRouter, Routes, Route } from 'react-router-dom'
import Splash from './pages/Splash'
import Onboarding from './pages/Onboarding'
import Signup from './pages/Signup'
import Home from './pages/Home'
import QnACategories from './pages/QnACategories'
import QnAQuestionList from './pages/QnAQuestionList'
import QnASearch from './pages/QnASearch'
import QuestionDetail from './pages/QuestionDetail'
import AnswerCompose from './pages/AnswerCompose'
import AnswerResult from './pages/AnswerResult'
import Memories from './pages/Memories'
import Notifications from './pages/Notifications'
import MyPage from './pages/MyPage'
import Settings from './pages/Settings'
import BookViewer from './pages/BookViewer'

export default function App() {
  return (
    <HashRouter>
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/home" element={<Home />} />
          <Route path="/qna" element={<QnACategories />} />
          <Route path="/qna/search" element={<QnASearch />} />
          <Route path="/qna/:categoryId" element={<QnAQuestionList />} />
          <Route path="/qna/:categoryId/:questionId" element={<QuestionDetail />} />
          <Route path="/qna/:categoryId/:questionId/answer" element={<AnswerCompose />} />
          <Route path="/qna/:categoryId/:questionId/result" element={<AnswerResult />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/book/:bookId" element={<BookViewer />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/my" element={<MyPage />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </HashRouter>
  )
}
