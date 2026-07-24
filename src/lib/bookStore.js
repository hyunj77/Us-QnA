// 책 표지 설정(애칭/커버 이미지)을 카테고리별로 저장. 지금은 localStorage, 이후 Supabase로 교체 예정.
const KEY = 'us-qna-book-config'

const DEFAULTS = {
  guide: { nickname: '나의', coverType: 'illust', coverImage: '🌷' },
  couple: { nickname: '우리', coverType: 'illust', coverImage: '💌' },
  nineteen: { nickname: '나의', coverType: 'illust', coverImage: '🔥' },
}

export const COVER_ILLUSTRATIONS = ['🌷', '💌', '🔥', '🌙', '✨', '🎀', '🍀', '🫶', '🧸', '🕊️', '🍯', '🌊']

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

export function getBookConfig(categoryId) {
  const all = readAll()
  return all[categoryId] || { ...DEFAULTS[categoryId], createdAt: new Date().toISOString() }
}

export function saveBookConfig(categoryId, patch) {
  const all = readAll()
  const current = all[categoryId] || { ...DEFAULTS[categoryId], createdAt: new Date().toISOString() }
  all[categoryId] = { ...current, ...patch }
  writeAll(all)
  return all[categoryId]
}
