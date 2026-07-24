const KEY = 'us-qna-avatars'
const DEFAULT_EMOJI = { mine: '🧑', partner: '👩' }

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

export function getAvatar(who) {
  const all = readAll()
  return all[who] || { type: 'emoji', image: DEFAULT_EMOJI[who] }
}

export function saveAvatarPhoto(who, dataUrl) {
  const all = readAll()
  all[who] = { type: 'photo', image: dataUrl }
  writeAll(all)
  return all[who]
}
