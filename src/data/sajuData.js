import { hashString } from '../lib/fortuneUtils'

// AI 사주: 생년월일(+선택 시간)을 시드로 결정적인 오행 분포/성격/올해의 운세를 뽑는다.
// 실제 명리학 계산이 아닌, 같은 입력이면 항상 같은 결과가 나오는 규칙 기반 재미 콘텐츠.
const OHAENG = [
  { key: 'wood', label: '목(木)', emoji: '🌳', trait: '성장을 추구하고 진취적인 기운이 강해요. 새로운 시작을 두려워하지 않는 편이에요.' },
  { key: 'fire', label: '화(火)', emoji: '🔥', trait: '열정적이고 표현이 풍부해요. 주변 분위기를 밝게 만드는 힘이 있어요.' },
  { key: 'earth', label: '토(土)', emoji: '⛰️', trait: '안정감 있고 신뢰가 가는 사람이에요. 주변 사람을 든든하게 챙기는 편이에요.' },
  { key: 'metal', label: '금(金)', emoji: '⚙️', trait: '원칙적이고 결단력이 있어요. 한번 정한 목표는 끝까지 밀고 나가요.' },
  { key: 'water', label: '수(水)', emoji: '💧', trait: '유연하고 사려 깊어요. 상황에 맞춰 지혜롭게 대처하는 편이에요.' },
]

const SUMMARY_MESSAGES = [
  { min: 80, text: '타고난 기운이 매우 조화로운 사주예요. 스스로의 힘으로 원하는 것을 이뤄낼 저력이 있어요.' },
  { min: 60, text: '전반적으로 안정적인 흐름을 가진 사주예요. 꾸준함이 큰 무기가 될 거예요.' },
  { min: 40, text: '기복이 있을 수 있지만 그만큼 다채로운 경험을 하게 되는 사주예요.' },
  { min: 0, text: '변화가 많은 사주지만, 그 변화 속에서 스스로를 단단하게 만들어가는 힘이 있어요.' },
]

const LIFE_AREAS = [
  {
    key: 'love', label: '연애운', emoji: '💕',
    tiers: [
      ['따뜻한 인연이 다가올 가능성이 높은 시기예요.', '지금의 인연과 더 깊어질 기운이 감돌아요.'],
      ['꾸준히 마음을 표현하면 좋은 결실이 있을 거예요.', '무리하지 않는 편안한 관계가 어울리는 시기예요.'],
      ['서두르지 않고 천천히 다가가는 게 좋은 시기예요.', '스스로를 먼저 돌보는 시간이 필요해요.'],
    ],
  },
  {
    key: 'wealth', label: '재물운', emoji: '💰',
    tiers: [
      ['노력한 만큼 결실을 얻을 수 있는 기운이에요.', '뜻밖의 좋은 기회가 찾아올 수 있어요.'],
      ['안정적인 흐름 속에서 차근차근 모아가기 좋아요.', '무리한 투자보다는 계획적인 관리가 어울려요.'],
      ['지출 관리에 조금 더 신경 쓰는 게 좋은 시기예요.', '큰 결정은 신중하게 내리는 게 좋아요.'],
    ],
  },
  {
    key: 'health', label: '건강운', emoji: '🌿',
    tiers: [
      ['활력이 넘치는 시기예요. 몸을 움직이기 좋은 때예요.', '컨디션이 전반적으로 좋은 흐름이에요.'],
      ['평소 페이스를 유지하면 무난한 시기예요.', '가벼운 운동과 규칙적인 습관이 도움이 돼요.'],
      ['휴식이 필요한 시기예요. 무리하지 않도록 하세요.', '몸이 보내는 신호를 잘 살펴보세요.'],
    ],
  },
  {
    key: 'career', label: '직업운', emoji: '💼',
    tiers: [
      ['노력이 인정받고 좋은 성과로 이어지는 시기예요.', '새로운 기회가 열릴 가능성이 높아요.'],
      ['꾸준함이 빛을 발하는 시기예요. 지금처럼만 하면 돼요.', '협업 속에서 좋은 결과가 나올 수 있어요.'],
      ['서두르기보다 내실을 다지는 게 좋은 시기예요.', '무리한 확장보다 정리가 필요한 때예요.'],
    ],
  },
]

const ADVICE_POOL = [
  '오늘 하루도 스스로를 믿고 한 걸음씩 나아가 보세요.',
  '조급함을 내려놓으면 더 좋은 흐름이 찾아올 거예요.',
  '주변 사람들과의 관계 속에서 좋은 기운을 얻게 될 거예요.',
  '작은 습관 하나가 앞으로의 흐름을 크게 바꿔줄 수 있어요.',
  '지금의 노력은 반드시 좋은 결과로 돌아올 거예요.',
]

function tierIndexFromScore(score) {
  if (score >= 75) return 0
  if (score >= 50) return 1
  return 2
}

export function computeSaju(birthDate, birthTime) {
  const seed = `${birthDate}|${birthTime || ''}`

  // 오행 분포: 5개 값을 해시로 만들고 정규화해서 합이 100이 되게 한다.
  const raw = OHAENG.map((o) => 5 + (hashString(`${seed}-${o.key}`) % 30))
  const total = raw.reduce((a, b) => a + b, 0)
  const distribution = OHAENG.map((o, i) => ({ ...o, percent: Math.round((raw[i] / total) * 100) }))
  const dominant = [...distribution].sort((a, b) => b.percent - a.percent)[0]

  const summaryScore = 30 + (hashString(`${seed}-summary`) % 70)
  const summary = SUMMARY_MESSAGES.find((m) => summaryScore >= m.min).text

  const lifeAreas = LIFE_AREAS.map((area) => {
    const score = 35 + (hashString(`${seed}-${area.key}`) % 65)
    const tier = area.tiers[tierIndexFromScore(score)]
    const message = tier[hashString(`${seed}-${area.key}-msg`) % tier.length]
    return { key: area.key, label: area.label, emoji: area.emoji, score, message }
  })

  const advice = ADVICE_POOL[hashString(`${seed}-advice`) % ADVICE_POOL.length]

  return { distribution, dominant, summaryScore, summary, lifeAreas, advice }
}
