export default function CoupleStatisticsCard({ agreementRate, topKeyword, topTravel, topFood, topEmotion }) {
  const minis = [
    { label: '자주 나온 키워드', value: topKeyword },
    { label: '많이 언급한 여행지', value: topTravel },
    { label: '많이 언급한 음식', value: topFood },
    { label: '가장 많이 나온 감정', value: topEmotion },
  ].filter((m) => m.value)

  return (
    <div className="card report-card">
      <div className="report-card-head">
        <span className="report-card-emoji">📊</span>
        <span className="report-card-title">우리 통계</span>
      </div>

      <div className="report-progress-row">
        <div className="report-progress-label">
          <span>답변 일치율</span>
          <span>{agreementRate != null ? `${agreementRate}%` : '-'}</span>
        </div>
        <div className="report-progress-track">
          <div className="report-progress-fill" style={{ width: `${agreementRate ?? 0}%` }} />
        </div>
      </div>

      {minis.length > 0 ? (
        <div className="report-mini-grid">
          {minis.map((m) => (
            <div key={m.label} className="report-mini-item">
              <div className="report-mini-label">{m.label}</div>
              <div className="report-mini-value">{m.value}</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="report-empty-hint">답변이 더 쌓이면 우리만의 키워드가 보여요.</p>
      )}
    </div>
  )
}
