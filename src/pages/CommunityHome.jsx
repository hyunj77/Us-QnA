import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import CommunityPostCard from '../components/CommunityPostCard'
import { getPosts } from '../lib/communityStore'
import { isLoggedIn } from '../lib/authState'

const ENTRIES = [
  { to: '/community/tests', emoji: '🧠', title: '심리 테스트', bg: 'var(--purple-light)' },
  { to: '/community/tarot', emoji: '🔮', title: 'AI 타로 보기', bg: 'var(--sub)' },
]

const SORTS = [
  { value: 'new', label: '새로운' },
  { value: 'popular', label: '인기 있는' },
]

function reactionTotal(post) {
  return Object.values(post.reactions || {}).reduce((sum, n) => sum + n, 0)
}

export default function CommunityHome() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sort, setSort] = useState('new')

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  const sorted = useMemo(() => {
    if (sort === 'popular') return [...posts].sort((a, b) => reactionTotal(b) - reactionTotal(a))
    return posts
  }, [posts, sort])

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title" style={{ fontSize: 20 }}>커뮤니티</div>
      </div>

      <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          {ENTRIES.map((item) => (
            <button key={item.to} className="card" style={{ flex: 1, textAlign: 'center', padding: '18px 12px' }} onClick={() => navigate(item.to)}>
              <div style={{ fontSize: 26, marginBottom: 6 }}>{item.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{item.title}</div>
            </button>
          ))}
        </div>

        <div>
          <div className="section-head">
            <span className="section-title">💬 연애 커뮤니티</span>
          </div>

          <div className="community-sort-row" style={{ marginBottom: 14 }}>
            {SORTS.map((s) => (
              <button
                key={s.value}
                className={`chip ${sort === s.value ? 'chip-active' : ''}`}
                onClick={() => setSort(s.value)}
              >
                {s.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 40 }}>불러오는 중...</p>
          ) : sorted.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {sorted.map((post) => (
                <CommunityPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-emoji">💬</div>
              <div className="empty-state-title">아직 올라온 고민이 없어요.</div>
              <div className="empty-state-desc">
                {isLoggedIn() ? '익명으로 첫 고민을 올려보세요!' : '로그인하면 익명으로 고민을 나눌 수 있어요.'}
              </div>
            </div>
          )}
        </div>
      </div>

      {isLoggedIn() && (
        <button className="community-fab" onClick={() => navigate('/community/board/new')} aria-label="고민 글쓰기">
          <PenLine size={22} />
        </button>
      )}

      <BottomNav />
    </div>
  )
}
