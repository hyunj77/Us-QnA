export default function MemoryCard({ date, title, onClick }) {
  return (
    <button className="memory-item" style={{ width: '100%', textAlign: 'left', background: 'none' }} onClick={onClick}>
      <span className="memory-date">{date}</span>
      <span className="memory-title">{title}</span>
      <span className="avatar-pair">
        <span>💛</span>
        <span>💙</span>
      </span>
    </button>
  )
}
