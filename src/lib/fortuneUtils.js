// 운세류 기능(오늘의 운세/AI 궁합)에서 같은 입력이면 항상 같은 결과가 나오도록 쓰는
// 결정적 해시. 실제 AI 호출 없이 규칙 기반으로 "그럴듯한" 결과를 만든다.
export function hashString(str) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = (hash * 31 + str.charCodeAt(i)) >>> 0
  return hash
}

export function pickByHash(hash, list) {
  return list[hash % list.length]
}

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}
