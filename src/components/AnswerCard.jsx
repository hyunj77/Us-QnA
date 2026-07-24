import { Heart } from 'lucide-react'

export default function AnswerCard({ name, time, body, photos = [], liked, onToggleLike }) {
  return (
    <div className="card answer-card">
      <div className="answer-card-head">
        <span className="icon-badge" style={{ width: 30, height: 30, fontSize: 14, background: 'var(--sub)' }}>💗</span>
        <span className="answer-card-name">{name}</span>
        <span className="answer-card-time">{time}</span>
      </div>
      <p className="answer-card-body">{body}</p>
      {photos.length > 0 && (
        <div className="answer-card-photos">
          {photos.map((src, idx) => (
            <img key={idx} src={src} alt="" />
          ))}
        </div>
      )}
      <div className="answer-card-foot">
        {onToggleLike && (
          <button
            type="button"
            className={`answer-card-like ${liked ? 'answer-card-like-active' : ''}`}
            onClick={onToggleLike}
          >
            <Heart size={15} fill={liked ? '#FF5C93' : 'none'} />
          </button>
        )}
      </div>
    </div>
  )
}
