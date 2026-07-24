import { useNavigate, useLocation } from 'react-router-dom'
import { House, Heart, Calendar, Users, User } from 'lucide-react'

const ITEMS = [
  { to: '/home', label: '홈', Icon: House },
  { to: '/qna', label: '문답', Icon: Heart },
  { to: '/memories', label: '추억', Icon: Calendar },
  { to: '/community', label: '커뮤니티', Icon: Users },
  { to: '/my', label: 'MY', Icon: User },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="bottom-nav">
      {ITEMS.map(({ to, label, Icon }) => {
        const active = location.pathname.startsWith(to)
        return (
          <button
            key={to}
            className={`bottom-nav-item ${active ? 'bottom-nav-item-active' : ''}`}
            onClick={() => navigate(to)}
          >
            <Icon size={22} strokeWidth={active ? 2.4 : 2} fill={active && (label === '문답') ? 'currentColor' : 'none'} />
            {label}
          </button>
        )
      })}
    </nav>
  )
}
