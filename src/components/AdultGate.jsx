import PrimaryButton from './PrimaryButton'
import { setAdultVerified } from '../lib/adultGate'

export default function AdultGate({ onVerified, onBack }) {
  return (
    <div className="adult-gate">
      <div className="adult-gate-emoji">🔞</div>
      <div className="adult-gate-title">성인 인증이 필요해요</div>
      <div className="adult-gate-desc">19금 문답은 만 19세 이상만 이용할 수 있어요.</div>
      <PrimaryButton onClick={() => { setAdultVerified(); onVerified() }}>만 19세 이상입니다</PrimaryButton>
      <button className="btn-text" onClick={onBack}>돌아가기</button>
    </div>
  )
}
