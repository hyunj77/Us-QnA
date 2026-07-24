export const COMMUNITY_CATEGORIES = ['썸', '연애', '장거리', '이별', '재회', '결혼', '부부', '가족', '친구', '인간관계']

export const JUDGE_STYLES = [
  { id: 'warm', label: '따뜻한 판사', emoji: '🤗', desc: '다정하고 공감 어린 어조로 판결해요' },
  { id: 'cold', label: '냉철한 판사', emoji: '🧊', desc: '감정보다 논리로 냉정하게 판단해요' },
  { id: 'realist', label: '현실주의 판사', emoji: '🧭', desc: '현실적인 조언 위주로 판결해요' },
  { id: 'tsundere', label: '츤데레 판사', emoji: '😤', desc: '까칠하지만 결국은 다정한 판결이에요' },
  { id: 'friend', label: '친구처럼 말하는 판사', emoji: '🙋', desc: '편한 반말로 친구처럼 이야기해줘요' },
  { id: 'lawyer', label: '변호사 스타일', emoji: '💼', desc: '논리적이고 전문적인 어조예요' },
  { id: 'counselor', label: '심리상담사 스타일', emoji: '🫶', desc: '감정을 깊이 들여다보는 상담 톤이에요' },
]

export const CATEGORY_GRADIENT = {
  '썸': 'linear-gradient(160deg, #FFB6C1, #FF8FA3)',
  '연애': 'linear-gradient(160deg, #FF9FB2, #FF5C93)',
  '장거리': 'linear-gradient(160deg, #A5C8FF, #5C8DFF)',
  '이별': 'linear-gradient(160deg, #B8B9FA, #7C6FE0)',
  '재회': 'linear-gradient(160deg, #FFD3A5, #FD9853)',
  '결혼': 'linear-gradient(160deg, #FFE1EC, #F06595)',
  '부부': 'linear-gradient(160deg, #FFD9E6, #E64980)',
  '가족': 'linear-gradient(160deg, #C7F0DB, #37C99A)',
  '친구': 'linear-gradient(160deg, #FFF3D0, #FFB020)',
  '인간관계': 'linear-gradient(160deg, #DDE6FF, #6C8CFF)',
}

export const REACTIONS = [
  { kind: 'like', emoji: '👍', label: '공감' },
  { kind: 'funny', emoji: '😂', label: '웃김' },
  { kind: 'sad', emoji: '😭', label: '안타까움' },
  { kind: 'angry', emoji: '😡', label: '화남' },
  { kind: 'judge_agree', emoji: '⚖️', label: 'AI 판결 공감' },
]
