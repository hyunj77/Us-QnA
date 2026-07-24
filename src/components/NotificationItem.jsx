export default function NotificationItem({ emoji, iconBg, title, sub, time, unread }) {
  return (
    <div className="notif-item">
      {unread && <span className="notif-dot" />}
      <span className="icon-badge" style={{ background: iconBg || 'var(--sub)' }}>{emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="notif-title">{title}</div>
        <div className="notif-sub">{sub}</div>
      </div>
      <div className="notif-time">{time}</div>
    </div>
  )
}
