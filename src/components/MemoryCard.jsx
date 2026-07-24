export default function MemoryCard({ date, title, preview, onClick }) {
  return (
    <button className="memory-item" style={{ width: '100%', textAlign: 'left', background: 'none' }} onClick={onClick}>
      <span className="memory-date">{date}</span>
      <div className="memory-body">
        <div className="memory-title">{title}</div>
        {preview && <div className="memory-preview">{preview}</div>}
      </div>
      <span className="memory-who-row">
        <span className="memory-who-tag">💛 나</span>
        <span className="memory-who-tag">💙 상대</span>
      </span>
    </button>
  )
}
