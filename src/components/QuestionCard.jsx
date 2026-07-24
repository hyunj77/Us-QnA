import { Check } from 'lucide-react'

export default function QuestionCard({ emoji, iconBg, title, desc, done, onClick }) {
  return (
    <button className="question-row" style={{ width: '100%', textAlign: 'left', background: 'none' }} onClick={onClick}>
      <span className="icon-badge" style={{ background: iconBg || '#FFF0F5' }}>{emoji}</span>
      <div className="question-row-body">
        <div className="question-row-title">{title}</div>
        {desc && <div className="question-row-desc">{desc}</div>}
      </div>
      <span className={`question-check ${done ? 'question-check-done' : ''}`}>
        {done && <Check size={14} strokeWidth={3} />}
      </span>
    </button>
  )
}
