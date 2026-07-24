import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import TogetherStatsCard from './TogetherStatsCard'
import CoupleStatisticsCard from './CoupleStatisticsCard'
import AIPersonalityReportCard from './AIPersonalityReportCard'
import AIQuestionRecommendationCard from './AIQuestionRecommendationCard'
import { getTogetherStats, getCoupleStatistics, getPersonalityInsights, getRecommendedQuestions } from '../lib/reportUtils'

export default function OurReportSection() {
  const navigate = useNavigate()
  const together = getTogetherStats()
  const statistics = getCoupleStatistics()
  const insights = getPersonalityInsights()
  const recommendation = getRecommendedQuestions()

  return (
    <div className="memory-section">
      <div className="section-head" style={{ padding: '0 20px' }}>
        <span className="section-title">📊 우리 리포트</span>
        <button className="btn-text" onClick={() => navigate('/us')}>자세히 보기 <ChevronRight size={12} /></button>
      </div>
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TogetherStatsCard {...together} />
        <CoupleStatisticsCard {...statistics} />
        <AIPersonalityReportCard insights={insights} />
        <AIQuestionRecommendationCard lead={recommendation.lead} questions={recommendation.questions} />
      </div>
    </div>
  )
}
