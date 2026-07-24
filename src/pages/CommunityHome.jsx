import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine, Search } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import CommunityPostCard from '../components/CommunityPostCard'
import { getPosts } from '../lib/communityStore'
import { isLoggedIn } from '../lib/authState'
import { MAIN_TABS } from '../data/communityCategories'

const ENTRIES = [
  { to: '/community/tests', emoji: '🧠', title: '심리 테스트', bg: 'var(--purple-light)' },
  { to: '/community/tarot', emoji: '🔮', title: 'AI 타로 보기', bg: 'var(--sub)' },
  { to: '/community/love-fortune', emoji: '💘', title: '나의 연애운 보기', bg: '#FFE1EC' },
  { to: '/community/compatibility', emoji: '🔗', title: 'AI 궁합 보기', bg: '#DFF5EC' },
  { to: '/community/daily-fortune', emoji: '🍀', title: '오늘의 운세보기', bg: '#FFF3D0' },
  { to: '/community/saju', emoji: '☯️', title: 'AI 사주', bg: '#ECEAFB' },
]

function reactionTotal(post) {
  return Object.values(post.reactions || {}).reduce((sum, n) => sum + n, 0)
}

export default function CommunityHome() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let list = posts
    const tab = MAIN_TABS.find((t) => t.key === activeTab)
    if (tab?.type === 'category') {
      const values = Array.isArray(tab.value) ? tab.value : [tab.value]
      list = list.filter((p) => values.includes(p.category))
    } else if (tab?.type === 'tag') {
      const values = Array.isArray(tab.value) ? tab.value : [tab.value]
      list = list.filter((p) => values.some((v) => p.tags?.includes(v)))
    } else if (tab?.type === 'popular') {
      list = [...list].sort((a, b) => reactionTotal(b) - reactionTotal(a))
    }

    const q = search.trim().replace(/^#/, '')
    if (q) {
      list = list.filter((p) => p.title.includes(q) || p.body.includes(q) || p.tags?.some((t) => t.replace('#', '').includes(q)))
    }
    return list
  }, [posts, activeTab, search])

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title" style={{ fontSize: 20 }}>커뮤니티</div>
      </div>

      <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {ENTRIES.map((item) => (
            <button key={item.to} className="card" style={{ textAlign: 'center', padding: '16px 8px' }} onClick={() => navigate(item.to)}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{item.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', lineHeight: 1.3 }}>{item.title}</div>
            </button>
          ))}
        </div>

        <div>
          <div className="section-head" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 4 }}>
            <span className="section-title">💬 연애 고민상담</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>⚖️ 글마다 AI 판사에게 판결을 받아볼 수 있어요</span>
          </div>

          <div style={{ position: 'relative', margin: '12px 0 14px' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input
              className="field"
              style={{ paddingLeft: 38 }}
              placeholder="태그나 키워드로 검색해보세요 (예: #읽씹)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 14, paddingBottom: 2 }}>
            {MAIN_TABS.map((tab) => (
              <button
                key={tab.key}
                className={`chip ${activeTab === tab.key ? 'chip-active' : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.emoji} {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 40 }}>불러오는 중...</p>
          ) : filtered.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {filtered.map((post) => (
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
