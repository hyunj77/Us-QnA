export default function ProgressCard({ emoji, title, desc, done, total, bg, iconBg, onClick }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0
  return (
    <button className="category-card" style={{ background: bg, textAlign: 'left', width: '100%' }} onClick={onClick}>
      <div className="category-card-top">
        <span className="icon-badge" style={{ background: iconBg || 'rgba(255,255,255,0.7)' }}>{emoji}</span>
        <div className="category-card-body">
          <div className="category-card-title">{title}</div>
          <div className="category-card-desc">{desc}</div>
        </div>
        <div className="category-card-count">{done} / {total}</div>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </button>
  )
}
