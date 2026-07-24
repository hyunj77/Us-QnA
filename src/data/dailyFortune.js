import { hashString, todayKey } from '../lib/fortuneUtils'

// 오늘의 운세: 날짜(+선택한 항목) 기준으로 결정적으로 뽑혀서, 같은 날 다시 봐도
// 같은 결과가 나온다 (규칙 기반, API 비용 없음).
const CATEGORIES = [
  {
    key: 'overall',
    label: '종합운',
    emoji: '🍀',
    tiers: [
      ['오늘은 전체적으로 흐름이 좋은 하루예요. 하고 싶었던 일을 시도해보기 좋아요.', '무엇을 하든 순조롭게 풀리는 기운이 감돌아요.', '작은 행운이 곳곳에서 따라오는 날이에요.'],
      ['평범하지만 안정적인 하루예요. 무리하지 않고 페이스대로 움직이면 돼요.', '특별한 일은 없지만 잔잔하게 좋은 하루가 될 거예요.', '무난한 흐름 속에서 나만의 리듬을 찾아보세요.'],
      ['오늘은 조금 신중하게 움직이는 게 좋아요. 서두르면 실수하기 쉬워요.', '컨디션 관리가 필요한 날이에요. 무리한 일정은 피해보세요.', '작은 걸림돌이 있을 수 있지만 금방 지나갈 거예요.'],
    ],
  },
  {
    key: 'love',
    label: '애정운',
    emoji: '💕',
    tiers: [
      ['상대방과의 케미가 좋은 날이에요. 솔직한 마음을 표현해보세요.', '설렘 가득한 하루가 될 확률이 높아요.', '작은 이벤트가 큰 감동으로 돌아올 수 있어요.'],
      ['평소처럼 다정하게 대하면 충분히 좋은 하루예요.', '무난한 흐름이지만 대화는 잘 통하는 편이에요.', '함께 있는 시간 자체가 힘이 되는 날이에요.'],
      ['사소한 오해가 생기기 쉬우니 말을 한 번 더 생각해서 전해보세요.', '감정 기복이 있을 수 있는 날이에요. 여유를 가지세요.', '오늘은 나를 먼저 돌보는 게 관계에도 도움이 돼요.'],
    ],
  },
  {
    key: 'money',
    label: '금전운',
    emoji: '💰',
    tiers: [
      ['예상치 못한 좋은 소식이 있을 수 있어요.', '알뜰하게 쓰면 여유가 생기는 하루예요.', '작은 행운이 지갑을 채워줄 수 있어요.'],
      ['무난한 지출 관리가 필요한 날이에요.', '큰 변화는 없지만 안정적인 흐름이에요.', '계획한 만큼만 쓰면 문제없는 하루예요.'],
      ['충동적인 소비는 피하는 게 좋아요.', '지출을 한 번 더 점검해보세요.', '급한 결정보다는 신중함이 필요한 날이에요.'],
    ],
  },
  {
    key: 'health',
    label: '건강운',
    emoji: '🌿',
    tiers: [
      ['컨디션이 좋은 하루예요. 활기차게 움직여보세요.', '몸도 마음도 가벼운 날이에요.', '운동하기 딱 좋은 컨디션이에요.'],
      ['평소 페이스를 유지하면 괜찮은 하루예요.', '무리하지 않으면 문제없는 컨디션이에요.', '가벼운 스트레칭 정도가 딱 좋은 날이에요.'],
      ['충분한 휴식이 필요한 날이에요.', '무리한 일정은 피하고 컨디션을 챙기세요.', '몸이 보내는 신호에 조금 더 귀 기울여보세요.'],
    ],
  },
]

export function getTodayFortune() {
  const dateKey = todayKey()
  return CATEGORIES.map((cat) => {
    const tierHash = hashString(`${dateKey}-${cat.key}-tier`)
    const tierIndex = tierHash % cat.tiers.length
    const messages = cat.tiers[tierIndex]
    const msgHash = hashString(`${dateKey}-${cat.key}-msg`)
    const message = messages[msgHash % messages.length]
    // 점수: tier 0(좋음)=75~95, tier 1(보통)=50~74, tier 2(주의)=25~49
    const scoreBase = [75, 50, 25][tierIndex]
    const scoreJitter = hashString(`${dateKey}-${cat.key}-score`) % 20
    return { ...cat, score: scoreBase + scoreJitter, message }
  })
}
