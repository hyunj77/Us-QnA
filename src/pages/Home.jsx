import { useNavigate } from 'react-router-dom'
import { Gift, Bell, ChevronRight, Lock } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import PrimaryButton from '../components/PrimaryButton'
import { getTodayQuestion, getRandomQuestions, findQuestion, findCategory, QUESTIONS } from '../lib/questions'
import { getAnsweredCount, getRecentAnswers, getStreakDays } from '../lib/answersStore'
import { MOCK_PARTNER_RECENT } from '../data/mock'
import { BOOK_ENTRIES, getBookProgress } from '../lib/bookUtils'
import { getBookConfig } from '../lib/bookStore'
import { isAdultVerified } from '../lib/adultGate'
import { getNextAnniversary } from '../lib/anniversary'

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return '방금 답변 완료'
  if (min < 60) return `${min}분 전 답변 완료`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전 답변 완료`
  return `${Math.floor(hr / 24)}일 전 답변 완료`
}

export default function Home() {
  const navigate = useNavigate()
  const today = getTodayQuestion()
  const answeredCount = getAnsweredCount()
  // 전체 500문항 기준 진행률. 답변이 1개라도 있으면 반올림으로 0%가 되어 "0%"와 "n개"가
  // 모순처럼 보이지 않도록 최소 1%는 보장한다.
  const pct = answeredCount === 0 ? 0 : Math.max(1, Math.round((answeredCount / QUESTIONS.length) * 100))
  const streak = getStreakDays()
  const nextAnniv = getNextAnniversary()

  const recent = getRecentAnswers(2)
    .map((r) => ({ ...r, q: findQuestion(r.questionId) }))
    .filter((r) => r.q)

  const goRandom = () => {
    const [q] = getRandomQuestions(1, { excludeAdult: true })
    navigate(`/qna/${q.categoryId}/${q.id}`)
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div className="home-greeting">오늘도 우리,<br />더 알아가는 하루 💕</div>
        <div className="topbar-side" style={{ gap: 4 }}>
          <button className="topbar-icon-btn"><Gift size={20} /></button>
          <button className="topbar-icon-btn" onClick={() => navigate('/notifications')}><Bell size={20} /></button>
        </div>
      </div>

      <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="today-q-card">
          <div className="today-q-head">
            <span className="today-q-label">💗 오늘의 질문</span>
            <span className="today-q-dday">{nextAnniv.label} D-{nextAnniv.daysLeft}</span>
          </div>
          <div className="today-q-title">{today.question}</div>
          <PrimaryButton onClick={() => navigate(`/qna/${today.categoryId}/${today.id}`)}>답변하기</PrimaryButton>
          <div className="today-q-hint">
            <span className="avatar-pair"><span>🧑</span><span>👩</span></span>
            오늘의 답변을 완료하면 서로의 답변을 볼 수 있어요!
          </div>
        </div>

        <div className="card stat-row">
          <div className="stat-row-item">
            <div className="stat-row-value">{pct}%</div>
            <div className="stat-row-label">문답 진행률</div>
          </div>
          <div className="stat-row-item">
            <div className="stat-row-value">{answeredCount}개</div>
            <div className="stat-row-label">답변한 질문</div>
          </div>
          <div className="stat-row-item">
            <div className="stat-row-value">{streak}일{streak > 0 ? '🔥' : ''}</div>
            <div className="stat-row-label">연속 참여일</div>
          </div>
        </div>

        <div>
          <div className="section-head">
            <span className="section-title">우리의 책</span>
            <button className="btn-text" onClick={() => navigate('/memories')}>더보기 <ChevronRight size={12} /></button>
          </div>
          <div className="bookshelf-row">
            {BOOK_ENTRIES.map((entry) => {
              const category = findCategory(entry.categoryId)
              if (!category) return null
              const config = getBookConfig(entry.bookId, entry.who)
              const { done, total } = getBookProgress(entry.categoryId, entry.who)
              const locked = category.isAdult && !isAdultVerified()
              const title = entry.who === 'shared' ? '우리 사용 설명서' : `${config.nickname} 사용 설명서`
              return (
                <button key={entry.bookId} className="bookshelf-item" onClick={() => navigate(`/book/${entry.bookId}`)}>
                  <div className="bookshelf-cover">
                    {locked ? (
                      <Lock size={20} />
                    ) : config.coverType === 'photo' && config.coverImage ? (
                      <img src={config.coverImage} alt="" />
                    ) : (
                      <span>{config.coverImage}</span>
                    )}
                    <span className="bookshelf-progress">{done}/{total}</span>
                  </div>
                  <div className="bookshelf-title">{title}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="card partner-activity-card">
          <div className="partner-activity-head">
            <span className="icon-badge" style={{ background: 'var(--sub)' }}>💌</span>
            <div>
              <div className="partner-activity-title">상대방의 최근 활동</div>
              <div className="partner-activity-time">{MOCK_PARTNER_RECENT.time}</div>
            </div>
          </div>
          <div className="partner-activity-body">
            <Lock size={13} /> {MOCK_PARTNER_RECENT.question}
          </div>
          <div className="partner-activity-hint">내가 이 질문에 답하면 상대방 답변을 볼 수 있어요</div>
        </div>

        <div>
          <div className="section-head">
            <span className="section-title">최근 답변</span>
            {recent.length > 0 && (
              <button className="btn-text" onClick={() => navigate('/qna')}>더보기 <ChevronRight size={12} /></button>
            )}
          </div>
          {recent.length > 0 ? (
            <div className="card">
              {recent.map(({ q, createdAt }) => (
                <div key={q.id} className="recent-item">
                  <span className="icon-badge" style={{ background: 'var(--sub)' }}>💗</span>
                  <div>
                    <div className="recent-item-title">{q.question}</div>
                    <div className="recent-item-time">{timeAgo(createdAt)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
                아직 답변한 질문이 없어요.
              </p>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>
                첫 번째 질문을 시작해 보세요!
              </p>
              <PrimaryButton onClick={() => navigate(`/qna/${today.categoryId}/${today.id}`)}>답변 시작</PrimaryButton>
            </div>
          )}
        </div>

        <button className="random-q-card" style={{ width: '100%' }} onClick={goRandom}>
          <span className="random-q-badge"><span>?</span></span>
          <div>
            <div className="random-q-title">랜덤 질문</div>
            <div className="random-q-text">랜덤으로 질문을 뽑아보세요!</div>
          </div>
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
