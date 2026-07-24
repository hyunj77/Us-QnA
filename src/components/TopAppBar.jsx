import { ArrowLeft } from 'lucide-react'

export default function TopAppBar({ title, onBack, right }) {
  return (
    <div className="topbar">
      <div className="topbar-side">
        {onBack && (
          <button className="topbar-icon-btn" onClick={onBack} aria-label="뒤로가기">
            <ArrowLeft size={20} />
          </button>
        )}
      </div>
      <div className="topbar-title">{title}</div>
      <div className="topbar-side" style={{ justifyContent: 'flex-end', gap: 4 }}>
        {right}
      </div>
    </div>
  )
}
