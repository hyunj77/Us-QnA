import { getQuestionsByCategory } from './questions'
import { getAnswer } from './answersStore'
import { getMockPartnerAnswer } from '../data/mock'

export const BOOK_CATEGORIES = ['guide', 'couple', 'nineteen']

const PAGE_EMOJIS = ['🌷', '💌', '🎈', '🍀', '⭐', '🎨', '🐰', '🎵', '🌙', '🍯', '🕊️', '🫶']
function pickPageEmoji(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return PAGE_EMOJIS[hash % PAGE_EMOJIS.length]
}

// 답변 완료한 질문만 페이지로 변환. 커플 문답은 내 페이지/상대 페이지를 번갈아 배치한다.
export function buildBookPages(categoryId) {
  const questions = getQuestionsByCategory(categoryId)
  const pages = []
  let pageNumber = 1

  for (const q of questions) {
    const mine = getAnswer(q.id)
    if (!mine) continue

    const emoji = pickPageEmoji(q.id)
    pages.push({
      questionId: q.id,
      questionText: q.question,
      subcategory: q.subcategory,
      pageNumber: pageNumber++,
      who: 'mine',
      answer: mine,
      illustEmoji: emoji,
    })

    if (categoryId === 'couple') {
      const partnerBody = getMockPartnerAnswer(q)
      pages.push({
        questionId: q.id,
        questionText: q.question,
        subcategory: q.subcategory,
        pageNumber: pageNumber++,
        who: 'partner',
        answer: partnerBody ? { body: partnerBody } : null,
        illustEmoji: emoji,
      })
    }
  }

  return pages
}

export function getBookProgress(categoryId) {
  const questions = getQuestionsByCategory(categoryId)
  const done = questions.filter((q) => getAnswer(q.id)).length
  return { done, total: questions.length }
}
