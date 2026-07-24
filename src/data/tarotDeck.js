// 규칙 기반 타로 카드 덱(메이저 아르카나 22장) + 정방향/역방향 해석 문구.
// 실제 AI 호출 없이, 카드와 해석을 미리 정의해두고 랜덤으로 뽑아 보여준다.
export const TAROT_DECK = [
  { id: 'fool', name: '바보', emoji: '🃏', upright: '새로운 시작과 순수한 설렘의 기운이에요. 두려움 없이 마음을 열어보세요.', reversed: '즉흥적인 선택이 후회로 이어질 수 있어요. 조금 더 신중해질 때예요.' },
  { id: 'magician', name: '마법사', emoji: '🎩', upright: '원하는 것을 이룰 수 있는 능력과 기회가 갖춰졌어요. 자신감을 가지세요.', reversed: '능력을 다 발휘하지 못하고 있어요. 준비가 조금 더 필요해요.' },
  { id: 'high-priestess', name: '여사제', emoji: '🌙', upright: '직관을 믿어야 할 때예요. 말보다 마음으로 느껴지는 게 정답일 수 있어요.', reversed: '숨기고 있는 감정이 있어요. 솔직해질 필요가 있어요.' },
  { id: 'empress', name: '여황제', emoji: '🌸', upright: '풍요롭고 다정한 기운이 감돌아요. 서로를 아끼는 마음이 커지는 시기예요.', reversed: '너무 많은 걸 챙기려다 지칠 수 있어요. 나를 먼저 돌보세요.' },
  { id: 'emperor', name: '황제', emoji: '👑', upright: '안정감과 책임감이 관계를 단단하게 만들어줘요.', reversed: '고집이 관계에 부담을 줄 수 있어요. 유연함이 필요해요.' },
  { id: 'lovers', name: '연인', emoji: '💞', upright: '서로에 대한 애정과 신뢰가 깊어지는 시기예요. 솔직한 대화가 관계를 더 단단하게 만들어요.', reversed: '가치관 차이로 갈등이 생길 수 있어요. 대화로 좁혀가세요.' },
  { id: 'chariot', name: '전차', emoji: '🏇', upright: '목표를 향해 함께 나아갈 힘이 있어요. 팀워크가 좋은 시기예요.', reversed: '방향이 서로 다르게 느껴질 수 있어요. 목표를 다시 맞춰보세요.' },
  { id: 'strength', name: '힘', emoji: '🦁', upright: '부드러운 마음이 오히려 관계를 강하게 만들어요. 인내심을 가지세요.', reversed: '자신감이 흔들리고 있어요. 스스로를 믿는 게 먼저예요.' },
  { id: 'hermit', name: '은둔자', emoji: '🕯️', upright: '혼자만의 시간이 필요한 때예요. 잠시 거리를 두는 것도 괜찮아요.', reversed: '너무 거리를 두면 오해가 생길 수 있어요. 다시 다가가 보세요.' },
  { id: 'wheel', name: '운명의 수레바퀴', emoji: '🎡', upright: '좋은 변화가 찾아올 타이밍이에요. 흐름에 몸을 맡겨보세요.', reversed: '예상치 못한 변수가 생길 수 있어요. 마음의 여유를 가지세요.' },
  { id: 'justice', name: '정의', emoji: '⚖️', upright: '공평하고 솔직한 대화가 관계를 더 건강하게 만들어요.', reversed: '한쪽으로 치우친 마음이 오해를 부를 수 있어요. 균형을 맞춰보세요.' },
  { id: 'hanged-man', name: '매달린 사람', emoji: '🙃', upright: '잠시 멈춰서 다른 시각으로 바라볼 때예요. 조급해하지 마세요.', reversed: '변화 없는 정체가 답답하게 느껴질 수 있어요. 작은 시도가 필요해요.' },
  { id: 'death', name: '죽음', emoji: '🌑', upright: '낡은 습관이나 방식을 끝내고 새로운 국면으로 넘어가는 시기예요.', reversed: '변화를 두려워하고 있어요. 놓아줘야 할 것을 붙잡고 있진 않은지 살펴보세요.' },
  { id: 'temperance', name: '절제', emoji: '🌈', upright: '조화와 균형이 관계를 편안하게 만들어줘요. 서두르지 않아도 괜찮아요.', reversed: '균형이 무너져 있어요. 서로에게 맞추는 시간이 필요해요.' },
  { id: 'devil', name: '악마', emoji: '🖤', upright: '집착이나 불안한 감정을 조심하세요. 스스로를 옭아매고 있진 않은지 돌아보세요.', reversed: '얽매여 있던 것에서 벗어날 용기가 생기고 있어요.' },
  { id: 'tower', name: '탑', emoji: '⚡', upright: '갑작스러운 변화나 갈등이 있을 수 있어요. 하지만 그만큼 확실하게 정리될 거예요.', reversed: '작은 균열을 방치하고 있진 않은지 살펴볼 때예요.' },
  { id: 'star', name: '별', emoji: '⭐', upright: '희망적인 기운이 가득해요. 서로에 대한 믿음이 관계를 밝게 비춰줘요.', reversed: '지쳐서 희망을 잃어가고 있어요. 잠시 쉬어가도 괜찮아요.' },
  { id: 'moon', name: '달', emoji: '🌕', upright: '불안한 감정이 있다면 그건 오해에서 비롯됐을 확률이 높아요. 대화로 풀어보세요.', reversed: '숨겨왔던 진심이 서서히 드러나는 시기예요.' },
  { id: 'sun', name: '태양', emoji: '☀️', upright: '밝고 긍정적인 에너지가 가득한 시기예요. 함께 있으면 즐거운 일이 많아질 거예요.', reversed: '작은 오해로 분위기가 가라앉을 수 있어요. 밝게 다가가 보세요.' },
  { id: 'judgement', name: '심판', emoji: '📯', upright: '지난 일을 정리하고 관계를 다시 돌아보게 되는 시기예요.', reversed: '과거에 얽매여 앞으로 나아가지 못하고 있어요.' },
  { id: 'world', name: '세계', emoji: '🌍', upright: '하나의 완성을 이루는 시기예요. 서로 노력한 만큼 좋은 결실을 맺어요.', reversed: '마무리가 조금 더디게 느껴질 수 있어요. 조급해하지 마세요.' },
  { id: 'ace-cups', name: '컵의 에이스', emoji: '🍷', upright: '새로운 감정과 설렘이 시작돼요. 마음을 열어보세요.', reversed: '감정 표현이 서툴러 마음이 잘 전달되지 않고 있어요.' },
]

export function drawTarotCards(count = 1) {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count).map((card) => ({ ...card, reversed: Math.random() < 0.5 }))
}
