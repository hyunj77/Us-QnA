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

export function getRecentAnswers(limit = 3) {
  const all = readAll()
  return Object.entries(all)
    .map(([questionId, entry]) => ({ questionId, ...entry }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit)
}

function toDayKey(iso) {
  const d = new Date(iso)
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

// 답변을 남긴 날짜들을 기준으로 연속 참여일을 센다.
// 오늘 아직 답변을 안 했어도 어제까지 이어져 있으면 스트릭이 끊기지 않은 것으로 본다.
export function getStreakDays() {
  const all = readAll()
  const days = new Set(Object.values(all).map((entry) => toDayKey(entry.createdAt)))
  if (days.size === 0) return 0

  const cursor = new Date()
  if (!days.has(toDayKey(cursor.toISOString()))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!days.has(toDayKey(cursor.toISOString()))) return 0
  }

  let streak = 0
  while (days.has(toDayKey(cursor.toISOString()))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}
