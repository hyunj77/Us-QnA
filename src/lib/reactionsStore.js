// 답변에 대한 하트(좋아요) 반응. localStorage 기반, 이후 Supabase reactions 테이블로 교체 예정.
const KEY = 'us-qna-liked-answers'

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {}
  } catch {
    return {}
  }
}

function writeAll(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function isLiked(questionId, who) {
  return !!readAll()[`${questionId}:${who}`]
}

export function toggleLike(questionId, who) {
  const all = readAll()
  const key = `${questionId}:${who}`
  all[key] = !all[key]
  writeAll(all)
  return all[key]
}

// who: 'mine'이면 "내가 쓴 답변" 카드에 눌린 하트 수 = 내가 받은 좋아요
export function getLikedCount(who) {
  const all = readAll()
  return Object.entries(all).filter(([key, liked]) => liked && key.endsWith(`:${who}`)).length
}
