import categoriesData from '../data/categories.json'
import questionsData from '../data/questions.json'

// 지금은 로컬 JSON 파일이 소스지만, 이후 Supabase의 categories/questions 테이블로
// 그대로 옮길 수 있도록 필드 구조를 맞춰뒀다.
// question 필드: { id, category(숫자 1~5), categoryId(문자열 슬러그), categoryName,
//                  subcategory, question, type(normal/adult/balance), difficulty, isAdult, options? }
export const CATEGORIES = [...categoriesData].sort((a, b) => a.order - b.order)
export const QUESTIONS = questionsData

export function getCategories() {
  return CATEGORIES
}

export function findCategory(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId) || null
}

// 전체 불러오기
export function getAllQuestions() {
  return QUESTIONS
}

// 특정 카테고리만 불러오기 (categoryId: 'guide' | 'couple' | 'nineteen' | 'ifonly' | 'balance')
export function getQuestionsByCategory(categoryId) {
  return QUESTIONS.filter((q) => q.categoryId === categoryId)
}

// 특정 소분류만 불러오기
export function getQuestionsBySubcategory(categoryId, subcategory) {
  return QUESTIONS.filter((q) => q.categoryId === categoryId && q.subcategory === subcategory)
}

export function findQuestion(questionId) {
  return QUESTIONS.find((q) => q.id === questionId) || null
}

export function getSubGroups(categoryId) {
  const seen = new Set()
  const groups = []
  for (const q of getQuestionsByCategory(categoryId)) {
    const key = q.subcategory || '__none__'
    if (!seen.has(key)) {
      seen.add(key)
      groups.push(q.subcategory)
    }
  }
  return groups
}

export function searchQuestions(query) {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return QUESTIONS.filter((item) => item.question.toLowerCase().includes(q))
}

// 랜덤 N개 뽑기
export function getRandomQuestions(n = 1, { categoryId, excludeAdult = false } = {}) {
  let pool = categoryId ? getQuestionsByCategory(categoryId) : QUESTIONS
  if (excludeAdult) pool = pool.filter((q) => !q.isAdult)
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export function getRandomQuestion(categoryId) {
  return getRandomQuestions(1, { categoryId })[0] || null
}

// 19금 필터링 (isAdult 기준)
export function getAdultQuestions() {
  return QUESTIONS.filter((q) => q.isAdult)
}

export function getNonAdultQuestions() {
  return QUESTIONS.filter((q) => !q.isAdult)
}

// 날짜 기반으로 결정적으로 하나를 골라, 같은 날엔 항상 같은 "오늘의 질문"이 나오게 한다. (19금 제외)
export function getTodayQuestion(dateStr = new Date().toISOString().slice(0, 10)) {
  const pool = getNonAdultQuestions()
  let hash = 0
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) >>> 0
  }
  return pool[hash % pool.length]
}

export function filterQuestions(categoryId, { answeredIds = new Set(), filter = 'all', search = '' } = {}) {
  let list = getQuestionsByCategory(categoryId)
  if (search.trim()) {
    const q = search.trim().toLowerCase()
    list = list.filter((item) => item.question.toLowerCase().includes(q))
  }
  if (filter === 'answered') list = list.filter((item) => answeredIds.has(item.id))
  if (filter === 'unanswered') list = list.filter((item) => !answeredIds.has(item.id))
  return list
}
