import { MOCK_NOTIFICATIONS } from '../data/mock'
import { isLoggedIn } from './authState'

const KEY = 'us-qna-notifications'
const MOCK_IDS = new Set(MOCK_NOTIFICATIONS.map((n) => n.id))

function read() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function getNotifications() {
  const stored = read()
  if (stored) {
    // 로그인 전 데모로 둘러볼 때 저장된 목업 알림이 실제 로그인 후에도 남아있으면 정리한다.
    if (isLoggedIn() && stored.length > 0 && stored.every((n) => MOCK_IDS.has(n.id))) {
      write([])
      return []
    }
    return stored
  }
  // 실제 로그인한 사용자는 진짜 알림이 쌓이기 전까지 빈 목록으로 시작한다.
  const initial = isLoggedIn() ? [] : MOCK_NOTIFICATIONS
  write(initial)
  return initial
}

export function resetNotifications(initial = []) {
  write(initial)
  return initial
}

export function addNotification(notification) {
  const list = getNotifications()
  const withId = { id: Date.now(), unread: true, time: '방금', ...notification }
  const next = [withId, ...list]
  write(next)
  return next
}

export function markAllRead() {
  const next = getNotifications().map((n) => ({ ...n, unread: false }))
  write(next)
  return next
}

export function markRead(id) {
  const next = getNotifications().map((n) => (n.id === id ? { ...n, unread: false } : n))
  write(next)
  return next
}

export function getUnreadCount() {
  return getNotifications().filter((n) => n.unread).length
}

function timeAgoLabel(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return '방금'
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  return `${Math.floor(hr / 24)}일 전`
}

// 앱이 닫혀있는 동안 서버(Supabase)에 쌓인 알림을 로컬 알림함으로 가져온다.
// 이미 들어와 있는 항목(같은 서버 id)은 중복 추가하지 않는다.
export function mergeServerNotifications(rows) {
  if (!rows || rows.length === 0) return getNotifications()
  const existing = getNotifications()
  const existingIds = new Set(existing.map((n) => n.id))
  const newOnes = rows
    .filter((r) => !existingIds.has(r.id))
    .map((r) => ({
      id: r.id,
      emoji: r.emoji,
      bg: r.bg,
      title: r.title,
      sub: r.sub,
      kind: r.kind,
      unread: r.unread,
      time: timeAgoLabel(r.created_at),
    }))
  if (newOnes.length === 0) return existing
  const merged = [...newOnes, ...existing]
  write(merged)
  return merged
}
