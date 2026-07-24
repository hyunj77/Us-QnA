// 책 표지 설정(애칭/커버 이미지)을 책 단위(bookId)로 저장. 지금은 localStorage, 이후 Supabase로 교체 예정.
const KEY = 'us-qna-book-config'

const DEFAULT_NICKNAME = { mine: '나', partner: '상대', shared: '우리' }
const DEFAULT_ILLUST = { 'guide-mine': '🌷', 'guide-partner': '🌼', couple: '💌', 'nineteen-mine': '🔥', 'nineteen-partner': '🌙' }

function defaultsFor(bookId, who) {
  return {
    nickname: DEFAULT_NICKNAME[who] || '나',
    coverType: 'illust',
    coverImage: DEFAULT_ILLUST[bookId] || '🌷',
    createdAt: new Date().toISOString(),
  }
}

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

export function getBookConfig(bookId, who) {
  const all = readAll()
  return all[bookId] || defaultsFor(bookId, who)
}

export function saveBookConfig(bookId, who, patch) {
  const all = readAll()
  const current = all[bookId] || defaultsFor(bookId, who)
  all[bookId] = { ...current, ...patch }
  writeAll(all)
  return all[bookId]
}

export const COVER_ILLUSTRATIONS = ['🌷', '💌', '🔥', '🌙', '✨', '🎀', '🍀', '🫶', '🧸', '🕊️', '🍯', '🌊']
