// 지금은 localStorage 기반. 이후 Supabase의 answers 테이블(id, user_id, question_id, body, photos, created_at)로
// 그대로 교체할 수 있도록 함수 시그니처를 미리 맞춰뒀다.
const KEY = 'us-qna-answers'

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

export function getAnswer(questionId) {
  return readAll()[questionId] || null
}

export function saveAnswer(questionId, body) {
  const all = readAll()
  all[questionId] = { body, createdAt: new Date().toISOString() }
  writeAll(all)
}

export function getAnsweredIds() {
  return new Set(Object.keys(readAll()))
}

export function getAnsweredCount() {
  return Object.keys(readAll()).length
}
