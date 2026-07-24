import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Lock } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import { BOOK_ENTRIES, getBookProgress } from '../lib/bookUtils'
import { getBookConfig } from '../lib/bookStore'
import { findCategory } from '../lib/questions'
import { isAdultVerified } from '../lib/adultGate'

export default function BookPrintPage() {
  const navigate = useNavigate()
  const [toast, setToast] = useState('')

  const handleOrder = (title) => {
    setToast(`"${title}" 인쇄 주문 기능은 아직 준비 중이에요.`)
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="screen">
      <TopAppBar title="우리의 책 인쇄 주문" onBack={() => navigate('/my')} />

      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
          답변으로 채운 우리만의 책을 실물 책자로 인쇄해서 받아보세요. 소프트커버 기준 한 권에 19,800원부터예요.
        </p>

        {BOOK_ENTRIES.map((entry) => {
          const category = findCategory(entry.categoryId)
          if (!category) return null
          const config = getBookConfig(entry.bookId, entry.who)
          const { done, total } = getBookProgress(entry.categoryId, entry.who)
          const locked = category.isAdult && !isAdultVerified()
          const title = entry.who === 'shared' ? '우리 사용 설명서' : `${config.nickname} 사용 설명서`
          return (
            <div key={entry.bookId} className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="icon-badge" style={{ background: 'var(--sub)', width: 48, height: 48, fontSize: 22, borderRadius: 'var(--r-md)', overflow: 'hidden' }}>
                {locked ? (
                  <Lock size={18} />
                ) : config.coverType === 'photo' && config.coverImage ? (
                  <img src={config.coverImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{config.coverImage}</span>
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{done}/{total}개 답변 완료</div>
              </div>
              <button
                className="btn-secondary"
                style={{ width: 'auto', height: 36, padding: '0 14px', fontSize: 12, flexShrink: 0 }}
                onClick={() => handleOrder(title)}
              >
                <Package size={13} style={{ marginRight: 4, verticalAlign: -2 }} /> 주문하기
              </button>
            </div>
          )
        })}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
