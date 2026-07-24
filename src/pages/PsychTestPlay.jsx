import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import SecondaryButton from '../components/SecondaryButton'
import { findPsychTest, computePsychResult } from '../data/psychTests'

export default function PsychTestPlay() {
  const { testId } = useParams()
  const navigate = useNavigate()
  const test = findPsychTest(testId)
  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState([])

  if (!test) return <div className="page-center"><p>존재하지 않는 테스트예요.</p></div>

  const result = answers.length === test.questions.length ? computePsychResult(test, answers) : null

  const handleSelect = (type) => {
    const next = [...answers, type]
    setAnswers(next)
    setStepIndex((i) => i + 1)
  }

  const handleRestart = () => {
    setAnswers([])
    setStepIndex(0)
  }

  if (result) {
    return (
      <div className="screen">
        <TopAppBar title={test.title} onBack={() => navigate('/community/tests')} />
        <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
          <div style={{ fontSize: 56 }}>{result.emoji}</div>
          <div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>당신은</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text)', marginTop: 4 }}>{result.title}</div>
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{result.desc}</p>

          <div style={{ display: 'flex', gap: 8, width: '100%', marginTop: 12 }}>
            <SecondaryButton style={{ flex: 1 }} onClick={handleRestart}>다시 하기</SecondaryButton>
            <PrimaryButton style={{ flex: 1 }} onClick={() => navigate('/community/tests')}>다른 테스트 보기</PrimaryButton>
          </div>
        </div>
      </div>
    )
  }

  const question = test.questions[stepIndex]

  return (
    <div className="screen">
      <TopAppBar title={`${stepIndex + 1}/${test.questions.length}`} onBack={() => navigate('/community/tests')} />

      <div className="progress-track" style={{ margin: '0 20px 20px', background: 'var(--divider)' }}>
        <div className="progress-fill" style={{ width: `${((stepIndex) / test.questions.length) * 100}%` }} />
      </div>

      <div className="detail-title" style={{ padding: '0 20px' }}>{question.text}</div>

      <div className="choice-list" style={{ padding: '20px 20px' }}>
        {question.options.map((opt) => (
          <button key={opt.label} type="button" className="choice-option-btn" onClick={() => handleSelect(opt.type)}>
            <span className="choice-option-text">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
