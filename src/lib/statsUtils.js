import { QUESTIONS, findCategory } from './questions'
import { getAllAnswers } from './answersStore'
import { getMockPartnerChoice } from '../data/mock'
import { getEffectiveStartDate } from './coupleState'

const Q_MAP = new Map(QUESTIONS.map((q) => [q.id, q]))

const STOPWORDS = new Set([
  '그리고', '하지만', '그래서', '정말', '진짜', '너무', '그냥', '그런', '이런', '저런',
  '때문에', '같아', '같이', '에서', '에게', '으로', '한테', '이야', '거야', '이건', '저건',
  '우리', '나는', '너는', '나의', '너의', '그거', '이거', '것도', '없어', '있어', '했어',
])

function tokenize(text) {
  return (text || '')
    .replace(/[.,!?~^()'"…\-_/]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w))
}

export function getTogetherDays() {
  const start = getEffectiveStartDate()
  if (!start) return null
  const today = new Date()
  const startMid = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const todayMid = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  return Math.max(0, Math.round((todayMid - startMid) / 86400000)) + 1
}

export function getCompletionRate() {
  if (QUESTIONS.length === 0) return 0
  const answered = Object.keys(getAllAnswers()).length
  return Math.round((answered / QUESTIONS.length) * 100)
}

// 밸런스 게임에서 상대방(목업)과 같은 선택을 한 비율
export function getBalanceAgreementRate() {
  const all = getAllAnswers()
  const balanceQs = QUESTIONS.filter((q) => q.type === 'balance' && all[q.id])
  if (balanceQs.length === 0) return null
  const matches = balanceQs.filter((q) => getMockPartnerChoice(q) === all[q.id].body).length
  return { rate: Math.round((matches / balanceQs.length) * 100), total: balanceQs.length }
}

export function getTopCategory() {
  const all = getAllAnswers()
  const counts = {}
  for (const id of Object.keys(all)) {
    const q = Q_MAP.get(id)
    if (!q) continue
    counts[q.categoryId] = (counts[q.categoryId] || 0) + 1
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  if (entries.length === 0) return null
  const category = findCategory(entries[0][0])
  return category ? { label: category.label, count: entries[0][1] } : null
}

export function getAvgAnswerLength() {
  const all = getAllAnswers()
  const bodies = Object.entries(all)
    .filter(([id]) => Q_MAP.get(id)?.type !== 'balance')
    .map(([, a]) => a.body)
    .filter(Boolean)
  if (bodies.length === 0) return 0
  return Math.round(bodies.reduce((sum, b) => sum + b.length, 0) / bodies.length)
}

export function getTopWords(limit = 6) {
  const all = getAllAnswers()
  const freq = {}
  for (const [id, a] of Object.entries(all)) {
    const q = Q_MAP.get(id)
    if (!q || q.type === 'balance') continue
    for (const w of tokenize(a.body)) {
      freq[w] = (freq[w] || 0) + 1
    }
  }
  return Object.entries(freq)
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }))
}
