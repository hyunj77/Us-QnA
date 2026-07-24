import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import CategoryChip from '../components/CategoryChip'
import QuestionCard from '../components/QuestionCard'
import AdultGate from '../components/AdultGate'
import { findCategory, getQuestionsByCategory, getSubGroups } from '../lib/questions'
import { getAnswer, getAnsweredIds, saveAnswer } from '../lib/answersStore'
import { getMockPartnerChoice } from '../data/mock'
import { isAdultVerified } from '../lib/adultGate'

const ROW_ICONS = ['❤️', '💫', '🎬', '🍴', '⭐', '🎨', '🐰', '🎵', '💌', '🌙']
function pickIcon(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return ROW_ICONS[hash % ROW_ICONS.length]
}

function BalanceRow({ question, selected, onSelect }) {
  const partnerChoice = selected ? getMockPartnerChoice(question) : null
  return (
    <div className="balance-row">
      <div className="balance-row-title">{question.question.replace(/\?$/, '').replace(/\s*(vs|VS)\s*/, ' vs ')}</div>
      <div className="balance-choice-row">
        {question.options.map((opt) => (
          <button
            key={opt}
            className={`balance-choice-btn ${selected === opt ? 'balance-choice-btn-active' : ''}`}
            onClick={() => onSelect(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      {selected && (
        <div className="balance-who-row">
          {question.options.map((opt) => (
            <div key={opt} className="balance-who-cell">
              {selected === opt && <span className="balance-who-tag">🧑 나</span>}
              {partnerChoice === opt && <span className="balance-who-tag balance-who-tag-partner">💛 상대</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function QnAQuestionList() {
  const { categoryId } = useParams()
  const navigate = useNavigate()
  const category = findCategory(categoryId)
  const [activeSub, setActiveSub] = useState('전체')
  const [answeredIds, setAnsweredIds] = useState(() => getAnsweredIds())
  const [verified, setVerified] = useState(isAdultVerified())

  const subGroups = useMemo(() => getSubGroups(categoryId).filter(Boolean), [categoryId])
  const questions = getQuestionsByCategory(categoryId)
  const shown = activeSub === '전체' ? questions : questions.filter((q) => q.subcategory === activeSub)

  if (!category) return <div className="page-center"><p>존재하지 않는 카테고리예요.</p></div>

  if (category.isAdult && !verified) {
    return (
      <div className="screen">
        <TopAppBar title={category.label} onBack={() => navigate('/qna')} />
        <AdultGate onVerified={() => setVerified(true)} onBack={() => navigate('/qna')} />
      </div>
    )
  }

  const handleBalanceSelect = (question, option) => {
    saveAnswer(question.id, option)
    setAnsweredIds(getAnsweredIds())
  }

  return (
    <div className="screen">
      <TopAppBar
        title={category.label}
        onBack={() => navigate('/qna')}
        right={<button className="topbar-icon-btn" onClick={() => navigate('/qna/search')}><Search size={20} /></button>}
      />

      {subGroups.length > 0 && (
        <div style={{ display: 'flex', gap: 8, padding: '0 20px 16px', overflowX: 'auto' }}>
          <CategoryChip label="전체" active={activeSub === '전체'} onClick={() => setActiveSub('전체')} />
          {subGroups.map((sub) => (
            <CategoryChip key={sub} label={sub} active={activeSub === sub} onClick={() => setActiveSub(sub)} />
          ))}
        </div>
      )}

      <div className="q-list-meta" style={{ padding: '0 20px 8px' }}>
        <span>{shown.length}개의 질문</span>
        <span>최신순</span>
      </div>

      <div style={{ padding: '0 20px' }}>
        {shown.map((q) =>
          q.type === 'balance' ? (
            <BalanceRow
              key={q.id}
              question={q}
              selected={getAnswer(q.id)?.body}
              onSelect={(opt) => handleBalanceSelect(q, opt)}
            />
          ) : (
            <QuestionCard
              key={q.id}
              emoji={pickIcon(q.id)}
              title={q.question}
              desc={q.subcategory}
              done={answeredIds.has(q.id)}
              onClick={() => navigate(`/qna/${categoryId}/${q.id}`)}
            />
          )
        )}
      </div>

      <BottomNav />
    </div>
  )
}
