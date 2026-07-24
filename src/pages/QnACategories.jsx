import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import ProgressCard from '../components/ProgressCard'
import { getCategories, getQuestionsByCategory, getSubGroups } from '../lib/questions'
import { getAnsweredIds } from '../lib/answersStore'

const CATEGORY_STYLE = {
  guide: { bg: '#FFE1EC', iconBg: 'rgba(255,255,255,0.75)' },
  couple: { bg: '#ECEAFB', iconBg: 'rgba(255,255,255,0.75)' },
  nineteen: { bg: '#FFE1D2', iconBg: 'rgba(255,255,255,0.75)' },
  ifonly: { bg: '#DFF5EC', iconBg: 'rgba(255,255,255,0.75)' },
  balance: { bg: '#FFF3D0', iconBg: 'rgba(255,255,255,0.75)' },
}

const CATEGORY_DESC = {
  guide: '나의 가치관, 성격, 연애스타일을 알아가는 질문들',
  couple: '우리 서로를 더 깊이 알아가는 커플 전용 질문',
  nineteen: '더 솔직하고 과감한 질문들 (19세 이상 이용가능)',
  ifonly: '만약에 ~한다면? 재미있는 상상 질문들',
  balance: '두 가지 중 하나만 선택한다면? 밸런스 게임 질문들',
}

export default function QnACategories() {
  const navigate = useNavigate()
  const categories = getCategories()
  const answeredIds = getAnsweredIds()

  return (
    <div className="screen">
      <div className="qna-float-search">
        <button className="topbar-icon-btn" onClick={() => navigate('/qna/search')}>
          <Search size={20} />
        </button>
      </div>

      <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {categories.map((c) => {
          const questions = getQuestionsByCategory(c.id)
          const done = questions.filter((q) => answeredIds.has(q.id)).length
          const subCount = getSubGroups(c.id).filter(Boolean).length
          const style = CATEGORY_STYLE[c.id] || {}
          return (
            <ProgressCard
              key={c.id}
              emoji={c.emoji}
              title={c.label}
              desc={`${CATEGORY_DESC[c.id]} · ${subCount}개 소분류`}
              done={done}
              total={questions.length}
              bg={style.bg}
              iconBg={style.iconBg}
              onClick={() => navigate(`/qna/${c.id}`)}
            />
          )
        })}
      </div>

      <BottomNav />
    </div>
  )
}
