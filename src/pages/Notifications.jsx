import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import NotificationItem from '../components/NotificationItem'
import { NOTIF_KIND_LABEL } from '../data/mock'
import { getTodayQuestion } from '../lib/questions'
import { getNotifications, markAllRead as persistMarkAllRead, markRead } from '../lib/notificationsStore'

export default function Notifications() {
  const navigate = useNavigate()
  const [items, setItems] = useState(getNotifications)

  const markAllRead = () => setItems(persistMarkAllRead())

  const handleClick = (n) => {
    setItems(markRead(n.id))
    if (n.kind === 'today' || n.kind === 'partner') {
      const today = getTodayQuestion()
      navigate(`/qna/${today.categoryId}/${today.id}`)
    } else if (n.kind === 'new') {
      navigate('/qna')
    } else if (n.kind === 'letter') {
      navigate('/letters')
    } else if (n.kind === 'poke') {
      navigate('/home')
    } else {
      navigate('/my')
    }
  }

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title" style={{ fontSize: 20 }}>알림</div>
        <button className="btn-text" onClick={markAllRead}>모두 읽음</button>
      </div>

      {items.length > 0 ? (
        <div>
          {items.map((n) => {
            const kind = NOTIF_KIND_LABEL[n.kind]
            return (
              <NotificationItem
                key={n.id}
                emoji={n.emoji}
                iconBg={n.bg}
                title={n.title}
                sub={n.sub}
                time={n.time}
                unread={n.unread}
                kindLabel={kind?.label}
                kindColor={kind?.color}
                onClick={() => handleClick(n)}
              />
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-emoji">🔔</div>
          <div className="empty-state-title">아직 알림이 없어요.</div>
          <div className="empty-state-desc">새로운 소식이 오면 여기에 알려드릴게요!</div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
