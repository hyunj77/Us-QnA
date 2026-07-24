// Supabase 연동 전까지 화면 확인용 샘플 데이터
export const MOCK_NOTIFICATIONS = [
  { id: 1, emoji: '💌', bg: 'var(--sub)', title: '오늘의 문답이 도착했어요!', sub: '"애인이 가장 보고싶었던 순간은?"', time: '방금', unread: true },
  { id: 2, emoji: '💚', bg: '#E3F5E0', title: '상대방이 답변을 완료했어요!', sub: '서로의 답변을 확인해보세요.', time: '10분 전', unread: true },
  { id: 3, emoji: '🎉', bg: '#FFF3D6', title: '100일 기념일이 3일 남았어요!', sub: '특별한 하루를 준비해보세요.', time: '2시간 전', unread: false },
  { id: 4, emoji: '📝', bg: '#E7EBFC', title: '새로운 질문이 추가되었어요!', sub: '새로운 질문을 확인해보세요.', time: '1일 전', unread: false },
]

export const MOCK_MEMORIES = [
  { id: 1, month: '2024년 5월', date: '5.20', title: '애인이 가장 보고싶었던 순간은?' },
  { id: 2, month: '2024년 5월', date: '5.18', title: '가장 기억에 남는 우리의 데이트는?' },
  { id: 3, month: '2024년 4월', date: '4.30', title: '우리의 첫 키스 장소는?' },
  { id: 4, month: '2024년 4월', date: '4.25', title: '내가 반하게 된 애인의 모습은?' },
]

// 커플 연결 기능이 붙기 전까지, 밸런스 게임에서 상대방이 고른 선택지를 데모용으로 결정적으로 흉내낸다.
export function getMockPartnerChoice(question) {
  let hash = 0
  for (let i = 0; i < question.id.length; i++) hash = (hash * 31 + question.id.charCodeAt(i)) >>> 0
  return question.options[hash % question.options.length]
}

export const MOCK_PROFILE = {
  startDate: '2024.01.17',
  daysTogether: 123,
  likesReceived: 56,
}
