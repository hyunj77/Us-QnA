// 사용자가 직접 캘린더에서 체크한 기념일. localStorage 기반.
const KEY = 'us-qna-custom-anniversaries'

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

export function dateKey(date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
}

export function getCustomAnniversary(date) {
  return readAll()[dateKey(date)] || null
}

export function toggleCustomAnniversary(date, label = '기념일') {
  const all = readAll()
  const key = dateKey(date)
  if (all[key]) delete all[key]
  else all[key] = { label }
  writeAll(all)
  return all[key] || null
}

export function getAllCustomAnniversaries() {
  return readAll()
}
