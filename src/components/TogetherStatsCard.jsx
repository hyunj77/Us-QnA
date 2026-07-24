export default function TogetherStatsCard({ togetherDays, answeredCount, totalCount, completionPct, streak }) {
  return (
    <div className="card report-card">
      <div className="report-card-head">
        <span className="report-card-emoji">📅</span>
        <span className="report-card-title">함께한 기록</span>
      </div>

      <div className="report-stat-grid">
        <div className="report-stat-item">
          <div className="report-stat-value">{togetherDays != null ? `D+${togetherDays}` : '-'}</div>
          <div className="report-stat-label">함께한 날짜</div>
        </div>
        <div className="report-stat-item">
          <div className="report-stat-value">{answeredCount}개</div>
          <div className="report-stat-label">총 답변</div>
        </div>
        <div className="report-stat-item">
          <div className="report-stat-value">{streak}일{streak > 0 ? ' 🔥' : ''}</div>
          <div className="report-stat-label">연속 참여일</div>
        </div>
      </div>

      <div className="report-progress-row">
        <div className="report-progress-label">
          <span>질문 완료율</span>
          <span>{completionPct}% ({answeredCount}/{totalCount})</span>
        </div>
        <div className="report-progress-track">
          <div className="report-progress-fill" style={{ width: `${completionPct}%` }} />
        </div>
      </div>
    </div>
  )
}
