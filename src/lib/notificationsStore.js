import { MOCK_NOTIFICATIONS } from '../data/mock'
import { isLoggedIn } from './authState'

const KEY = 'us-qna-notifications'

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
  if (stored) return stored
  // 실제 로그인한 사용자는 진짜 알림이 쌓이기 전까지 빈 목록으로 시작한다.
  const initial = isLoggedIn() ? [] : MOCK_NOTIFICATIONS
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
