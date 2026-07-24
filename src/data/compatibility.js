import { hashString } from '../lib/fortuneUtils'

// AI 궁합 보기: 두 사람의 이름+생년월일을 시드로 결정적인 점수/코멘트를 뽑는다.
// 같은 입력이면 항상 같은 결과가 나온다 (규칙 기반, API 비용 없음).
const DIMENSIONS = [
  {
    key: 'values',
    label: '가치관 궁합',
    emoji: '💭',
    tiers: [
      ['인생에서 중요하게 생각하는 것들이 참 많이 닮아있어요.', '큰 방향성이 비슷해서 함께할수록 편안함을 느낄 거예요.'],
      ['다른 부분도 있지만 서로 존중하면 충분히 잘 맞춰갈 수 있어요.', '가치관 차이가 대화의 재료가 될 수 있는 조합이에요.'],
      ['생각의 결이 꽤 다른 편이라 대화를 통한 이해가 중요해요.', '서로 다른 시선이 오히려 새로운 자극이 될 수 있어요.'],
    ],
  },
  {
    key: 'communication',
    label: '소통 궁합',
    emoji: '💬',
    tiers: [
      ['말하지 않아도 통하는 순간이 많은 조합이에요.', '대화가 술술 풀리는 편안한 케미예요.'],
      ['조금만 노력하면 훨씬 더 잘 통하는 사이가 될 수 있어요.', '가끔 오해가 생겨도 금방 풀리는 편이에요.'],
      ['표현 방식이 달라 오해가 생기기 쉬우니 조금 더 자세히 설명해주는 게 좋아요.', '말보다 행동으로 마음을 확인하는 게 도움이 될 조합이에요.'],
    ],
  },
  {
    key: 'affection',
    label: '애정표현 궁합',
    emoji: '💗',
    tiers: [
      ['서로에게 애정을 표현하는 방식이 잘 맞아요.', '스킨십과 말 표현의 온도가 비슷해서 편안해요.'],
      ['표현 방식은 다르지만 마음은 비슷한 곳을 향하고 있어요.', '조금씩 맞춰가다 보면 표현의 결도 닮아갈 거예요.'],
      ['애정 표현 스타일이 꽤 달라 서운함이 쌓이기 쉬워요.', '서로가 원하는 표현 방식을 직접 물어보는 게 좋아요.'],
    ],
  },
  {
    key: 'future',
    label: '미래 전망',
    emoji: '🌱',
    tiers: [
      ['함께 그리는 미래의 그림이 비슷한 조합이에요.', '장기적으로 안정적인 관계를 만들어갈 힘이 있어요.'],
      ['조율이 좀 필요하지만 함께 맞춰갈 여지가 충분해요.', '서로의 계획을 자주 공유하면 방향이 더 선명해질 거예요.'],
      ['서로 그리는 미래상이 달라 대화가 꼭 필요한 조합이에요.', '지금부터 자주 미래 이야기를 나눠보는 게 좋아요.'],
    ],
  },
]

const OVERALL_MESSAGES = [
  { min: 85, text: '환상의 궁합이에요! 서로에게 좋은 영향을 주고받는 사이예요.' },
  { min: 70, text: '전반적으로 잘 맞는 편이에요. 지금처럼만 서로를 아껴주세요.' },
  { min: 55, text: '무난한 궁합이에요. 조금씩 맞춰가면 더 단단해질 관계예요.' },
  { min: 0, text: '다른 점이 많은 조합이지만, 서로를 이해하려는 노력이 관계를 더 특별하게 만들어줄 거예요.' },
]

function tierIndexFromScore(score) {
  if (score >= 80) return 0
  if (score >= 55) return 1
  return 2
}

export function computeCompatibility(nameA, birthA, nameB, birthB) {
  const seed = `${nameA.trim()}|${birthA}|${nameB.trim()}|${birthB}`
  const overallScore = 45 + (hashString(`${seed}-overall`) % 55)
  const overallMsg = OVERALL_MESSAGES.find((m) => overallScore >= m.min).text

  const dimensions = DIMENSIONS.map((dim) => {
    const score = 40 + (hashString(`${seed}-${dim.key}`) % 60)
    const tier = dim.tiers[tierIndexFromScore(score)]
    const message = tier[hashString(`${seed}-${dim.key}-msg`) % tier.length]
    return { key: dim.key, label: dim.label, emoji: dim.emoji, score, message }
  })

  return { score: overallScore, message: overallMsg, dimensions }
}
