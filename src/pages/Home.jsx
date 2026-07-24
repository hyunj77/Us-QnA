import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gift, Bell, ChevronRight, Lock, Hand } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import PrimaryButton from '../components/PrimaryButton'
import { getTodayQuestion, findQuestion, findCategory, QUESTIONS } from '../lib/questions'
import { getAnsweredCount, getRecentAnswers, getStreakDays } from '../lib/answersStore'
import { MOCK_PARTNER_RECENT } from '../data/mock'
import { BOOK_ENTRIES, getBookProgress } from '../lib/bookUtils'
import { getBookConfig } from '../lib/bookStore'
import { isAdultVerified } from '../lib/adultGate'
import { getNextAnniversary } from '../lib/anniversary'
import { isLoggedIn } from '../lib/authState'
import { isCoupleConnected } from '../lib/coupleState'
import { canPoke, sendPoke } from '../lib/pokeStore'
import { getUnreadCount } from '../lib/notificationsStore'

const POKE_COOLDOWN_MS = 60000
const POKE_KEY = 'us-qna-last-poke-at'

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
  const [poking, setPoking] = useState(false)
  const [pokeToast, setPokeToast] = useState('')
  const today = getTodayQuestion()
  const answeredCount = getAnsweredCount()
  // 전체 500문항 기준 진행률. 답변이 1개라도 있으면 반올림으로 0%가 되어 "0%"와 "n개"가
  // 모순처럼 보이지 않도록 최소 1%는 보장한다.
  const pct = answeredCount === 0 ? 0 : Math.max(1, Math.round((answeredCount / QUESTIONS.length) * 100))
  const streak = getStreakDays()
  const nextAnniv = getNextAnniversary()

  const unreadCount = getUnreadCount()

  const recent = getRecentAnswers(2)
    .map((r) => ({ ...r, q: findQuestion(r.questionId) }))
    .filter((r) => r.q)

  const handlePoke = async () => {
    const lastAt = Number(localStorage.getItem(POKE_KEY) || 0)
    if (Date.now() - lastAt < POKE_COOLDOWN_MS) {
      setPokeToast('잠시 후 다시 찔러보세요 👋')
      setTimeout(() => setPokeToast(''), 1800)
      return
    }
    setPoking(true)
    try {
      await sendPoke()
      localStorage.setItem(POKE_KEY, String(Date.now()))
      setPokeToast('콕! 상대방에게 알림을 보냈어요')
    } catch {
      setPokeToast('찌르기에 실패했어요')
    } finally {
      setPoking(false)
      setTimeout(() => setPokeToast(''), 1800)
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div className="home-greeting">오늘도 우리,<br />더 알아가는 하루 💕</div>
        <div className="topbar-side" style={{ gap: 4 }}>
          <button className="topbar-icon-btn"><Gift size={20} /></button>
          <button className="topbar-icon-btn" onClick={() => navigate('/notifications')}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notif-badge-dot" />}
          </button>
        </div>
      </div>

      <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {isLoggedIn() && !isCoupleConnected() && (
          <button className="couple-cta-card" onClick={() => navigate('/couple-connect')}>
            <span className="couple-cta-emoji">💌</span>
            <div className="couple-cta-body">
              <div className="couple-cta-title">아직 커플 연결 전이에요</div>
              <div className="couple-cta-desc">코드를 만들거나 입력해서 상대방과 연결해보세요</div>
            </div>
            <ChevronRight size={18} color="var(--main)" />
          </button>
        )}

        <div className="card dday-card">
          <span className="dday-card-label">📅 다음 기념일</span>
          <span className="dday-card-value">
            {nextAnniv.daysLeft == null ? nextAnniv.label : `${nextAnniv.label} D-${nextAnniv.daysLeft}`}
          </span>
        </div>

        <div className="today-q-card">
          <div className="today-q-head">
            <span className="today-q-label">💗 오늘의 질문</span>
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

        {isLoggedIn() && canPoke() && (
          <button className="poke-card" onClick={handlePoke} disabled={poking}>
            <span className="icon-badge" style={{ background: 'var(--sub)' }}><Hand size={18} color="var(--main)" /></span>
            <div className="poke-card-body">
              <div className="poke-card-title">상대방 콕 찌르기</div>
              <div className="poke-card-desc">답장을 기다리거나, 화해하고 싶을 때 눌러보세요</div>
            </div>
          </button>
        )}

        {isLoggedIn() ? (
          canPoke() && (
            <div className="card partner-activity-card">
              <div className="partner-activity-head">
                <span className="icon-badge" style={{ background: 'var(--sub)' }}>💌</span>
                <div>
                  <div className="partner-activity-title">상대방의 최근 활동</div>
                </div>
              </div>
              <div className="partner-activity-hint">상대방이 답변을 남기면 여기에 표시돼요</div>
            </div>
          )
        ) : (
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
        )}

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

      </div>

      {pokeToast && <div className="toast">{pokeToast}</div>}

      <BottomNav />
    </div>
  )
}
