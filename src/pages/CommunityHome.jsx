import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import BottomNav from '../components/BottomNav'

const ITEMS = [
  { to: '/community/tests', emoji: '🧠', title: '심리 테스트', desc: '나는 어떤 사람일까? 재미있는 심리 테스트를 해보세요', bg: 'var(--purple-light)' },
  { to: '/community/tarot', emoji: '🔮', title: 'AI 타로 보기', desc: '오늘 우리의 기운을 타로 카드로 확인해보세요', bg: 'var(--sub)' },
  { to: '/community/board', emoji: '💬', title: '연애 커뮤니티', desc: '다른 커플들과 고민과 이야기를 나눠보세요', bg: '#DFF5EC' },
]

export default function CommunityHome() {
  const navigate = useNavigate()

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title" style={{ fontSize: 20 }}>커뮤니티</div>
      </div>

      <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {ITEMS.map((item) => (
          <button key={item.to} className="poke-card" onClick={() => navigate(item.to)}>
            <span className="icon-badge" style={{ background: item.bg, fontSize: 20 }}>{item.emoji}</span>
            <div className="poke-card-body">
              <div className="poke-card-title" style={{ fontSize: 15 }}>{item.title}</div>
              <div className="poke-card-desc">{item.desc}</div>
            </div>
            <ChevronRight size={18} color="#C9C9CD" />
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
