const KEY = 'us-qna-adult-verified'

export function isAdultVerified() {
  return sessionStorage.getItem(KEY) === 'true'
}

export function setAdultVerified() {
  sessionStorage.setItem(KEY, 'true')
}
