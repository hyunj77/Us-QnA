import categoriesData from '../data/categories.json'
import questionsData from '../data/questions.json'

// 현재는 로컬 JSON 파일이 소스지만, 이후 Supabase의 categories/questions 테이블로
// 그대로 옮길 수 있도록 필드 구조(id, category, sub, type, title, options)를 맞춰뒀다.
export const CATEGORIES = [...categoriesData].sort((a, b) => a.order - b.order)
export const QUESTIONS = questionsData

export function getCategories() {
  return CATEGORIES
}

export function findCategory(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId) || null
}

export function getQuestionsByCategory(categoryId) {
  return QUESTIONS.filter((q) => q.category === categoryId)
}

export function findQuestion(questionId) {
  return QUESTIONS.find((q) => q.id === questionId) || null
}

export function getSubGroups(categoryId) {
  const seen = new Set()
  const groups = []
  for (const q of getQuestionsByCategory(categoryId)) {
    const key = q.sub || '__none__'
    if (!seen.has(key)) {
      seen.add(key)
      groups.push(q.sub)
    }
  }
  return groups
}

export function searchQuestions(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return QUESTIONS.filter((item) => item.title.toLowerCase().includes(q))
}

export function getRandomQuestion(categoryId) {
  const pool = categoryId ? getQuestionsByCategory(categoryId) : QUESTIONS
  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

// 날짜 기반으로 결정적으로 하나를 골라, 같은 날엔 항상 같은 "오늘의 질문"이 나오게 한다.
export function getTodayQuestion(dateStr = new Date().toISOString().slice(0, 10)) {
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0
  }
  return QUESTIONS[hash % QUESTIONS.length]
}

export function filterQuestions(categoryId, { answeredIds = new Set(), filter = 'all', search = '' } = {}) {
  let list = getQuestionsByCategory(categoryId)
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter((item) => item.title.toLowerCase().includes(q))
  }
  if (filter === 'answered') list = list.filter((item) => answeredIds.has(item.id))
  if (filter === 'unanswered') list = list.filter((item) => !answeredIds.has(item.id))
  return list
}
