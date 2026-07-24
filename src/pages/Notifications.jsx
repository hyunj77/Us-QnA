import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import NotificationItem from '../components/NotificationItem'
import { MOCK_NOTIFICATIONS } from '../data/mock'

export default function Notifications() {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS)

  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, unread: false })))

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title" style={{ fontSize: 20 }}>알림</div>
        <button className="btn-text" onClick={markAllRead}>모두 읽음</button>
      </div>

      <div>
        {items.map((n) => (
          <NotificationItem key={n.id} emoji={n.emoji} iconBg={n.bg} title={n.title} sub={n.sub} time={n.time} unread={n.unread} />
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
