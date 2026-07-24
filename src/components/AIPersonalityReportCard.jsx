export default function AIPersonalityReportCard({ insights }) {
  return (
    <div className="card report-card">
      <div className="report-card-head">
        <span className="report-card-emoji">🧠</span>
        <span className="report-card-title">AI 성향 분석</span>
      </div>

      {insights.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {insights.map((item) => (
            <div key={item.key} className="report-personality-item">
              <div className="report-personality-head">
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </div>
              <div className="report-personality-snippet">"{item.snippet}"</div>
            </div>
          ))}
        </div>
      ) : (
        <p className="report-empty-hint">답변을 더 남기면 AI가 우리의 성향을 분석해드려요.</p>
      )}
    </div>
  )
}
