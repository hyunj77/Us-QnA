export default function NotificationItem({ emoji, iconBg, title, sub, time, unread, kindLabel, kindColor, onClick }) {
  return (
    <button className="notif-item" style={{ width: '100%', textAlign: 'left', background: 'none' }} onClick={onClick}>
      {unread && <span className="notif-dot" />}
      <span className="icon-badge" style={{ background: iconBg || 'var(--sub)' }}>{emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="notif-title">{title}</div>
        <div className="notif-sub">{sub}</div>
        {kindLabel && (
          <span className="notif-kind-tag" style={{ background: `${kindColor}1A`, color: kindColor }}>
            {kindLabel}
          </span>
        )}
      </div>
      <div className="notif-time">{time}</div>
    </button>
  )
}
