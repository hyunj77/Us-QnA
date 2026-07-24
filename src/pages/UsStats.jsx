import { useNavigate } from 'react-router-dom'
import TopAppBar from '../components/TopAppBar'
import { QUESTIONS } from '../lib/questions'
import { getAnsweredCount, getStreakDays } from '../lib/answersStore'
import {
  getTogetherDays,
  getCompletionRate,
  getBalanceAgreementRate,
  getTopCategory,
  getAvgAnswerLength,
  getTopWords,
} from '../lib/statsUtils'

export default function UsStats() {
  const navigate = useNavigate()
  const answeredCount = getAnsweredCount()
  const togetherDays = getTogetherDays()
  const completionRate = getCompletionRate()
  const agreement = getBalanceAgreementRate()
  const topCategory = getTopCategory()
  const avgLength = getAvgAnswerLength()
  const topWords = getTopWords()
  const streak = getStreakDays()

  return (
    <div className="screen">
      <TopAppBar title="우리" onBack={() => navigate('/my')} />

      <div style={{ padding: '4px 20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="card us-hero-card">
          <div className="us-hero-emoji">💕</div>
          {togetherDays != null ? (
            <div className="us-hero-days">함께한 지 {togetherDays}일째</div>
          ) : (
            <button type="button" className="profile-title-cta" onClick={() => navigate('/couple-connect')}>
              커플 코드 연결하기 →
            </button>
          )}
          <div className="us-hero-sub">답변 {answeredCount}개 · 연속 참여 {streak}일</div>
        </div>

        <div className="card stat-row">
          <div className="stat-row-item">
            <div className="stat-row-value">{completionRate}%</div>
            <div className="stat-row-label">전체 완료율</div>
          </div>
          <div className="stat-row-item">
            <div className="stat-row-value">{answeredCount}/{QUESTIONS.length}</div>
            <div className="stat-row-label">답변한 질문</div>
          </div>
          <div className="stat-row-item">
            <div className="stat-row-value">{agreement ? `${agreement.rate}%` : '-'}</div>
            <div className="stat-row-label">밸런스 일치율</div>
          </div>
        </div>

        {answeredCount > 0 ? (
          <>
            <div className="card couple-stats-card">
              <div className="couple-stats-title">우리의 문답 스타일</div>
              <div className="couple-stats-row">
                <div className="couple-stats-item">
                  <div className="couple-stats-value">{topCategory ? topCategory.label : '-'}</div>
                  <div className="couple-stats-label">가장 많이 답한 카테고리</div>
                </div>
                <div className="couple-stats-item">
                  <div className="couple-stats-value">{avgLength}자</div>
                  <div className="couple-stats-label">평균 답변 길이</div>
                </div>
              </div>
            </div>

            {topWords.length > 0 && (
              <div>
                <div className="section-head">
                  <span className="section-title">우리 답변 속 자주 쓴 단어</span>
                </div>
                <div className="us-word-chips">
                  {topWords.map(({ word, count }) => (
                    <span key={word} className="us-word-chip">
                      {word} <span className="us-word-count">{count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <div className="empty-state-emoji">📊</div>
            <div className="empty-state-title">아직 통계를 보여줄 답변이 없어요.</div>
            <div className="empty-state-desc">문답에 답변을 남기면 우리만의 통계가 쌓여요!</div>
          </div>
        )}
      </div>
    </div>
  )
}
