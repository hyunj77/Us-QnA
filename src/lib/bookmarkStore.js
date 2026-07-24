const KEY = 'us-qna-bookmarks'

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

export function isBookmarked(questionId) {
  return !!readAll()[questionId]
}

export function toggleBookmark(questionId) {
  const all = readAll()
  if (all[questionId]) delete all[questionId]
  else all[questionId] = { createdAt: new Date().toISOString() }
  writeAll(all)
  return !!all[questionId]
}

export function getBookmarkedIds() {
  const all = readAll()
  return Object.entries(all)
    .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt))
    .map(([questionId]) => questionId)
}
