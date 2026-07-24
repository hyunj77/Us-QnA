// 규칙 기반 심리 테스트 데이터. 각 문항의 선택지는 result type(A/B/C/D) 중 하나에 점수를 준다.
// 가장 많이 선택된 타입이 최종 결과가 된다.
export const PSYCH_TESTS = [
  {
    id: 'dating-style',
    emoji: '💘',
    title: '나의 연애 성향 테스트',
    desc: '나는 연애할 때 어떤 사람일까?',
    questions: [
      {
        text: '기념일을 준비할 때 나는?',
        options: [
          { label: '편지와 이벤트로 마음을 듬뿍 표현해요', type: 'A' },
          { label: '실용적인 선물을 미리 계획해서 준비해요', type: 'B' },
          { label: '그날 기분 따라 즉흥적으로 움직여요', type: 'C' },
          { label: '상대방이 부담스러워할까 봐 조심스러워요', type: 'D' },
        ],
      },
      {
        text: '연락이 뜸해지면?',
        options: [
          { label: '서운한 마음을 솔직하게 바로 표현해요', type: 'A' },
          { label: '이유가 있겠지 하고 이해하려고 해요', type: 'B' },
          { label: '나도 바쁘니까 크게 신경 안 써요', type: 'C' },
          { label: '괜히 눈치를 보게 돼요', type: 'D' },
        ],
      },
      {
        text: '데이트 코스를 정할 때 나는?',
        options: [
          { label: '분위기 좋은 곳으로 로맨틱하게 준비해요', type: 'A' },
          { label: '동선과 예산을 꼼꼼히 계획해요', type: 'B' },
          { label: '그때그때 끌리는 대로 정해요', type: 'C' },
          { label: '상대방이 좋아할 만한 곳을 먼저 물어봐요', type: 'D' },
        ],
      },
      {
        text: '다툼이 생기면 나는?',
        options: [
          { label: '감정을 솔직하게 표현하고 바로 풀어요', type: 'A' },
          { label: '차분히 원인을 정리해서 대화해요', type: 'B' },
          { label: '시간이 지나면 자연스레 풀린다고 생각해요', type: 'C' },
          { label: '먼저 다가가기가 어려워서 눈치를 봐요', type: 'D' },
        ],
      },
      {
        text: '애정 표현 방식은?',
        options: [
          { label: '"사랑해" 같은 말을 자주 해요', type: 'A' },
          { label: '행동과 배려로 챙겨줘요', type: 'B' },
          { label: '장난스럽게 스킨십으로 표현해요', type: 'C' },
          { label: '표현은 서툴지만 마음은 진심이에요', type: 'D' },
        ],
      },
      {
        text: '연애에서 가장 중요하게 생각하는 것은?',
        options: [
          { label: '설렘과 로맨틱한 분위기', type: 'A' },
          { label: '안정감과 신뢰', type: 'B' },
          { label: '자유롭고 편안한 관계', type: 'C' },
          { label: '서로에 대한 배려', type: 'D' },
        ],
      },
    ],
    results: {
      A: { title: '로맨티스트', emoji: '🌹', desc: '사랑 표현에 솔직하고 적극적인 로맨티스트예요. 이벤트와 다정한 말 한마디로 상대방을 설레게 만드는 재주가 있어요.' },
      B: { title: '든든한 플래너', emoji: '🧭', desc: '꼼꼼하게 챙기고 계획하는 안정형이에요. 화려하진 않아도 곁에 있으면 믿음이 가는 사람이에요.' },
      C: { title: '자유로운 영혼', emoji: '🍃', desc: '즉흥적이고 편안한 연애를 추구해요. 서로에게 숨 쉴 틈을 주는 자유로운 관계를 좋아해요.' },
      D: { title: '조심스러운 배려파', emoji: '🌷', desc: '상대방을 먼저 살피는 배려심 많은 스타일이에요. 표현이 서툴러도 진심은 누구보다 깊어요.' },
    },
  },
  {
    id: 'stress-relief',
    emoji: '🧘',
    title: '나의 스트레스 해소 유형 테스트',
    desc: '나는 스트레스를 어떻게 풀까?',
    questions: [
      {
        text: '주말에 스트레스가 쌓이면?',
        options: [
          { label: '운동이나 액티비티로 몸을 움직여요', type: 'A' },
          { label: '집에서 푹 쉬면서 아무것도 안 해요', type: 'B' },
          { label: '친구에게 털어놓고 수다를 떨어요', type: 'C' },
          { label: '일단 그 상황을 피하고 미뤄둬요', type: 'D' },
        ],
      },
      {
        text: '화가 날 때 나는?',
        options: [
          { label: '몸을 움직이거나 청소하면서 풀어요', type: 'A' },
          { label: '혼자 조용히 시간을 보내며 가라앉혀요', type: 'B' },
          { label: '누군가에게 바로 이야기해요', type: 'C' },
          { label: '일단 그 자리를 피하고 나중에 생각해요', type: 'D' },
        ],
      },
      {
        text: '기분 전환이 필요할 때?',
        options: [
          { label: '여행이나 새로운 활동을 시도해요', type: 'A' },
          { label: '좋아하는 공간에서 힐링해요', type: 'B' },
          { label: '사람들을 만나서 에너지를 얻어요', type: 'C' },
          { label: '혼자만의 시간을 가지며 잊으려 해요', type: 'D' },
        ],
      },
      {
        text: '스트레스의 원인을 마주할 때?',
        options: [
          { label: '바로 해결하려고 움직여요', type: 'A' },
          { label: '천천히 마음을 정리한 뒤 대응해요', type: 'B' },
          { label: '주변 사람과 상의해서 풀어요', type: 'C' },
          { label: '되도록 마주치지 않으려 해요', type: 'D' },
        ],
      },
      {
        text: '나에게 힐링이란?',
        options: [
          { label: '땀 흘리고 나서의 개운함', type: 'A' },
          { label: '조용하고 아늑한 나만의 공간', type: 'B' },
          { label: '마음이 통하는 사람과의 대화', type: 'C' },
          { label: '아무 생각 없이 흘려보내는 시간', type: 'D' },
        ],
      },
    ],
    results: {
      A: { title: '활동파', emoji: '🏃', desc: '몸을 움직이며 스트레스를 날리는 활동파예요. 가만히 있는 것보다 뭔가에 몰입할 때 에너지가 채워져요.' },
      B: { title: '휴식파', emoji: '🛋️', desc: '조용한 나만의 공간에서 재충전하는 휴식파예요. 혼자만의 시간이 무엇보다 소중해요.' },
      C: { title: '표현파', emoji: '💬', desc: '누군가에게 털어놓으며 마음을 풀어내는 표현파예요. 대화 속에서 위로를 찾는 편이에요.' },
      D: { title: '회피파', emoji: '🌫️', desc: '일단 거리를 두고 시간이 해결해주길 기다리는 편이에요. 잠시 피하는 것도 나만의 방식이에요.' },
    },
  },
]

export function findPsychTest(testId) {
  return PSYCH_TESTS.find((t) => t.id === testId) || null
}

export function computePsychResult(test, answers) {
  const counts = {}
  for (const type of answers) counts[type] = (counts[type] || 0) + 1
  const [topType] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  return { type: topType, ...test.results[topType] }
}
