import { Camera } from 'lucide-react'

export default function AnswerCard({ name, time, body, photoCount = 0 }) {
  return (
    <div className="card answer-card">
      <div className="answer-card-head">
        <span className="icon-badge" style={{ width: 30, height: 30, fontSize: 14, background: 'var(--sub)' }}>💗</span>
        <span className="answer-card-name">{name}</span>
        <span className="answer-card-time">{time}</span>
      </div>
      <p className="answer-card-body">{body}</p>
      {photoCount > 0 && (
        <div className="answer-card-photo">
          <Camera size={13} /> 사진 {photoCount}장
        </div>
      )}
    </div>
  )
}
