import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import BottomNav from '../components/BottomNav'
import { PSYCH_TESTS } from '../data/psychTests'

export default function PsychTestList() {
  const navigate = useNavigate()

  return (
    <div className="screen">
      <TopAppBar title="심리 테스트" onBack={() => navigate('/community')} />

      <div style={{ padding: '4px 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {PSYCH_TESTS.map((test) => (
          <button key={test.id} className="poke-card" onClick={() => navigate(`/community/tests/${test.id}`)}>
            <span className="icon-badge" style={{ background: 'var(--purple-light)', fontSize: 20 }}>{test.emoji}</span>
            <div className="poke-card-body">
              <div className="poke-card-title" style={{ fontSize: 15 }}>{test.title}</div>
              <div className="poke-card-desc">{test.desc} · 질문 {test.questions.length}개</div>
            </div>
            <ChevronRight size={18} color="#C9C9CD" />
          </button>
        ))}
      </div>

      <BottomNav />
    </div>
  )
}
