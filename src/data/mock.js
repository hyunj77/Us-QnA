// Supabase 연동 전까지 화면 확인용 샘플 데이터
export const MOCK_NOTIFICATIONS = [
  { id: 1, emoji: '💌', bg: 'var(--sub)', title: '오늘의 문답이 도착했어요!', sub: '"애인이 가장 보고싶었던 순간은?"', time: '방금', unread: true, kind: 'today' },
  { id: 2, emoji: '💚', bg: '#E3F5E0', title: '상대방이 답변을 완료했어요!', sub: '서로의 답변을 확인해보세요.', time: '10분 전', unread: true, kind: 'partner' },
  { id: 3, emoji: '🎉', bg: '#FFF3D6', title: '100일 기념일이 3일 남았어요!', sub: '특별한 하루를 준비해보세요.', time: '2시간 전', unread: false, kind: 'anniversary' },
  { id: 4, emoji: '📝', bg: '#E7EBFC', title: '새로운 질문이 추가되었어요!', sub: '새로운 질문을 확인해보세요.', time: '1일 전', unread: false, kind: 'new' },
]

export const NOTIF_KIND_LABEL = {
  today: { label: '오늘의 문답', color: '#FF5C93' },
  partner: { label: '상대방', color: '#4CAF50' },
  anniversary: { label: '기념일', color: '#D9A400' },
  new: { label: '새 질문', color: '#5C7CFA' },
}

export const MOCK_MEMORIES = [
  { id: 1, month: '2024년 5월', date: '5.20', title: '애인이 가장 보고싶었던 순간은?', preview: '퇴근하고 집에 가는 길에 문득 너무 보고싶을 때!' },
  { id: 2, month: '2024년 5월', date: '5.18', title: '가장 기억에 남는 우리의 데이트는?', preview: '한강에서 자전거 타고 치킨 먹었던 날이 제일 기억에 남아' },
  { id: 3, month: '2024년 4월', date: '4.30', title: '우리의 첫 키스 장소는?', preview: '영화관 앞 골목이었나, 아직도 생생해' },
  { id: 4, month: '2024년 4월', date: '4.25', title: '내가 반하게 된 애인의 모습은?', preview: '힘든 순간에도 웃으면서 넘기는 모습이 제일 멋있었어' },
]

// 커플 연결 기능이 붙기 전까지, 밸런스 게임에서 상대방이 고른 선택지를 데모용으로 결정적으로 흉내낸다.
export function getMockPartnerChoice(question) {
  let hash = 0
  for (let i = 0; i < question.id.length; i++) hash = (hash * 31 + question.id.charCodeAt(i)) >>> 0
  return question.options[hash % question.options.length]
}

const PARTNER_ANSWER_TEMPLATES = [
  '음... 나도 비슷하게 생각했어!',
  '나는 조금 다르게 생각하는데, 이따 얘기해줄게 😊',
  '이건 진짜 솔직히 말하면...',
  '너랑 똑같은 마음이야 ❤️',
  '그건 비밀이야 😳',
  '생각해본 적 없는데 재밌는 질문이다!',
]

// 커플 연결 기능이 붙기 전까지, 상대방의 답변 완료 여부/내용을 데모용으로 결정적으로 흉내낸다.
// 약 40%는 "아직 답변 전(잠금)" 상태로 나오게 해서 두 UI 상태를 모두 확인할 수 있게 한다.
export function getMockPartnerAnswer(question) {
  let hash = 0
  for (let i = 0; i < question.id.length; i++) hash = (hash * 31 + question.id.charCodeAt(i)) >>> 0
  if (hash % 10 < 4) return null
  return PARTNER_ANSWER_TEMPLATES[hash % PARTNER_ANSWER_TEMPLATES.length]
}

export const MOCK_PARTNER_RECENT = {
  question: '가장 기억에 남는 우리의 데이트는?',
  time: '1시간 전',
}

export const MOCK_PROFILE = {
  startDate: '2024.01.17',
  daysTogether: 123,
  likesReceived: 56,
  topCategory: '커플 문답',
  avgAnswerLength: 42,
}
