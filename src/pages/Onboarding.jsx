import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SLIDES = [
  { emoji: '💑', title: '커플과 함께 문답하기', desc: '연인과 함께 다양한 주제로\n서로를 더 깊이 알아가요' },
  { emoji: '📅', title: '하루 하나 질문', desc: '매일 새로운 질문으로\n대화의 물꼬를 터보세요' },
  { emoji: '🔍', title: '서로 답변 비교', desc: '둘 다 답변을 마치면\n동시에 공개되는 재미' },
  { emoji: '📸', title: '추억 저장', desc: '주고받은 문답을\n소중한 추억으로 차곡차곡' },
]

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const isLast = step === SLIDES.length - 1
  const slide = SLIDES[step]

  const handleNext = () => {
    if (isLast) navigate('/signup')
    else setStep((s) => s + 1)
  }

  return (
    <div className="onboard-wrap">
      <button className="onboard-skip" onClick={() => navigate('/signup')}>건너뛰기</button>

      <div className="onboard-body">
        <div className="onboard-emoji">{slide.emoji}</div>
        <div className="onboard-title">{slide.title}</div>
        <div className="onboard-desc">{slide.desc}</div>
      </div>

      <div className="onboard-footer">
        <div className="onboard-dots">
          {SLIDES.map((_, i) => (
            <span key={i} className={`onboard-dot ${i === step ? 'onboard-dot-active' : ''}`} />
          ))}
        </div>
        <button className="btn-primary" onClick={handleNext}>{isLast ? '시작하기' : '다음'}</button>
      </div>
    </div>
  )
}
