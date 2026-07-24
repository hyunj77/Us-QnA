import { JUDGE_STYLES } from '../data/communityCategories'

function formatDateTime(iso) {
  return new Date(iso).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function LoveJudgmentCard({ judgment }) {
  const style = JUDGE_STYLES.find((s) => s.id === judgment.judge_style)
  const faultAuthor = judgment.fault_author ?? 50
  const faultOpponent = judgment.fault_opponent ?? 50

  return (
    <div className="judge-card">
      <div className="judge-card-head">
        <div className="judge-card-title">⚖️ AI 연애 판결서</div>
        <div className="judge-card-meta">
          사건번호 {judgment.case_number} {style ? `· ${style.emoji} ${style.label}` : ''}
          <br />
          판결시간 {formatDateTime(judgment.created_at)}
        </div>
      </div>

      <div>
        <div className="judge-section-title">① 사건 요약</div>
        <p className="judge-section-body">{judgment.summary}</p>
      </div>

      <div>
        <div className="judge-section-title">② 양측 입장 분석</div>
        <p className="judge-section-body">
          👤 작성자 입장 — 감정: {judgment.author_view?.emotion} · 의도: {judgment.author_view?.intent}
          <br />장점: {judgment.author_view?.pros} · 아쉬운 점: {judgment.author_view?.cons}
        </p>
        <p className="judge-section-body" style={{ marginTop: 8 }}>
          👤 상대방 입장 — 감정: {judgment.opponent_view?.emotion} · 의도: {judgment.opponent_view?.intent}
          <br />가능성: {judgment.opponent_view?.possibility} · 오해 요소: {judgment.opponent_view?.misunderstanding}
        </p>
      </div>

      <div>
        <div className="judge-section-title">③ 쟁점 분석</div>
        <p className="judge-section-body">{(judgment.issues || []).map((i) => `✔ ${i}`).join('  ')}</p>
      </div>

      <div>
        <div className="judge-section-title">④ 증거 분석</div>
        <p className="judge-section-body">
          긍정적 근거: {(judgment.evidence?.positive || []).join(', ') || '-'}
          <br />부정적 근거: {(judgment.evidence?.negative || []).join(', ') || '-'}
          <br />추측: {(judgment.evidence?.guesses || []).join(', ') || '-'}
          <br />팩트: {(judgment.evidence?.facts || []).join(', ') || '-'}
        </p>
      </div>

      <div>
        <div className="judge-section-title">⑤ AI 판결</div>
        <p className="judge-section-body">{judgment.verdict}</p>
      </div>

      <div>
        <div className="judge-section-title">⑥ 판결 점수 (잘못 비율)</div>
        <div className="judge-fault-row">
          <div
            className="judge-fault-chart"
            style={{ background: `conic-gradient(#E6C875 0 ${faultAuthor}%, #4C7BF4 ${faultAuthor}% 100%)` }}
          />
          <div className="judge-fault-legend">
            <span>🟡 작성자 {faultAuthor}%</span>
            <span>🔵 상대방 {faultOpponent}%</span>
          </div>
        </div>
      </div>

      <div>
        <div className="judge-section-title">⑦ AI 추천 행동</div>
        {(judgment.recommended_actions || []).map((a, i) => (
          <p key={i} className="judge-section-body">· {a.action} — {a.reason}</p>
        ))}
      </div>

      <div>
        <div className="judge-section-title">⑧ 판결 한줄</div>
        <p className="judge-section-body">"{judgment.one_liner}"</p>
      </div>

      <div className="judge-card-meta" style={{ textAlign: 'left' }}>
        AI 분석 신뢰도 {judgment.confidence}% · 이 판결은 법률 상담이 아닌 AI의 참고 의견이에요.
      </div>
    </div>
  )
}
