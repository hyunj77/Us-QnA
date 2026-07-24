export const COMMUNITY_CATEGORIES = [
  { key: '썸', emoji: '💘' },
  { key: '연애', emoji: '❤️' },
  { key: '이별', emoji: '💔' },
  { key: '재회', emoji: '🔄' },
  { key: '결혼', emoji: '💍' },
  { key: '부부', emoji: '👨‍👩‍👧' },
  { key: '짝사랑', emoji: '🌈' },
  { key: '고백', emoji: '💌' },
  { key: '연락', emoji: '📱' },
  { key: '인간관계', emoji: '🤝' },
]

// 글쓰기에서 고를 수 있는 상황/감정/일상 태그 (그룹별로 묶어서 보여준다)
export const TAG_GROUPS = [
  {
    group: '만남',
    tags: ['#소개팅', '#미팅', '#데이트', '#첫만남', '#고백', '#썸탐'],
  },
  {
    group: '연락',
    tags: ['#읽씹', '#안읽씹', '#답장', '#연락텀', '#전화', '#잠수', '#차단', '#SNS'],
  },
  {
    group: '갈등',
    tags: ['#싸움', '#오해', '#권태기', '#신뢰', '#거짓말', '#약속', '#소통', '#거리두기'],
  },
  {
    group: '이별',
    tags: ['#이별통보', '#환승연애', '#바람', '#재회', '#미련', '#차임', '#잠수이별'],
  },
  {
    group: '장거리',
    tags: ['#장거리연애', '#군대', '#해외연애'],
  },
  {
    group: '결혼',
    tags: ['#결혼준비', '#상견례', '#신혼', '#시댁', '#처가', '#육아'],
  },
  {
    group: '고민',
    tags: ['#이게맞나요', '#조언부탁', '#AI판결', '#누구잘못', '#심리분석', '#남자심리', '#여자심리', '#연애상담', '#결정장애', '#도와주세요'],
  },
  {
    group: '감정',
    tags: ['#설렘', '#행복', '#서운함', '#질투', '#불안', '#외로움', '#후회', '#분노', '#감동', '#고민'],
  },
  {
    group: '일상',
    tags: ['#데이트코스', '#선물추천', '#기념일', '#커플룩', '#여행', '#맛집', '#취미', '#일상', '#사진'],
  },
  {
    group: '참여',
    tags: ['#투표', '#밸런스게임', '#실화', '#썰', '#경험담', '#익명', '#베스트글', '#공감', '#웃김', '#충격'],
  },
]

// 커뮤니티 상단 메인 탭. category(관계 카테고리) 또는 tag(태그 포함 여부) 기준으로 피드를 거른다.
export const MAIN_TABS = [
  { key: 'all', emoji: '❤️', label: '전체', type: 'all' },
  { key: '썸', emoji: '💘', label: '썸', type: 'category', value: '썸' },
  { key: '연애', emoji: '💕', label: '연애', type: 'category', value: '연애' },
  { key: '이별', emoji: '💔', label: '이별', type: 'category', value: '이별' },
  { key: '재회', emoji: '🔄', label: '재회', type: 'category', value: '재회' },
  { key: '연락', emoji: '📱', label: '연락', type: 'category', value: '연락' },
  { key: '고민상담', emoji: '😥', label: '고민상담', type: 'all' },
  { key: 'AI판결', emoji: '⚖️', label: 'AI 판결', type: 'tag', value: '#AI판결' },
  { key: '투표', emoji: '🗳️', label: '투표', type: 'tag', value: '#투표' },
  { key: '썰', emoji: '📖', label: '썰·경험담', type: 'tag', value: ['#썰', '#경험담'] },
  { key: '결혼부부', emoji: '💍', label: '결혼·부부', type: 'category', value: ['결혼', '부부'] },
  { key: '인기', emoji: '🔥', label: '인기', type: 'popular' },
]

export const CATEGORY_GRADIENT = {
  '썸': 'linear-gradient(160deg, #FFB6C1, #FF8FA3)',
  '연애': 'linear-gradient(160deg, #FF9FB2, #FF5C93)',
  '이별': 'linear-gradient(160deg, #B8B9FA, #7C6FE0)',
  '재회': 'linear-gradient(160deg, #FFD3A5, #FD9853)',
  '결혼': 'linear-gradient(160deg, #FFE1EC, #F06595)',
  '부부': 'linear-gradient(160deg, #FFD9E6, #E64980)',
  '짝사랑': 'linear-gradient(160deg, #FFE29A, #FFB020)',
  '고백': 'linear-gradient(160deg, #FFC1D9, #FF5C93)',
  '연락': 'linear-gradient(160deg, #A5C8FF, #5C8DFF)',
  '인간관계': 'linear-gradient(160deg, #DDE6FF, #6C8CFF)',
}

export const JUDGE_STYLES = [
  { id: 'warm', label: '따뜻한 판사', emoji: '🤗', desc: '다정하고 공감 어린 어조로 판결해요' },
  { id: 'cold', label: '냉철한 판사', emoji: '🧊', desc: '감정보다 논리로 냉정하게 판단해요' },
  { id: 'realist', label: '현실주의 판사', emoji: '🧭', desc: '현실적인 조언 위주로 판결해요' },
  { id: 'tsundere', label: '츤데레 판사', emoji: '😤', desc: '까칠하지만 결국은 다정한 판결이에요' },
  { id: 'friend', label: '친구처럼 말하는 판사', emoji: '🙋', desc: '편한 반말로 친구처럼 이야기해줘요' },
  { id: 'lawyer', label: '변호사 스타일', emoji: '💼', desc: '논리적이고 전문적인 어조예요' },
  { id: 'counselor', label: '심리상담사 스타일', emoji: '🫶', desc: '감정을 깊이 들여다보는 상담 톤이에요' },
]

export const REACTIONS = [
  { kind: 'like', emoji: '👍', label: '공감' },
  { kind: 'funny', emoji: '😂', label: '웃김' },
  { kind: 'sad', emoji: '😭', label: '안타까움' },
  { kind: 'angry', emoji: '😡', label: '화남' },
  { kind: 'judge_agree', emoji: '⚖️', label: 'AI 판결 공감' },
]
