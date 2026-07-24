import { getQuestionsByCategory } from './questions'
import { getAnswer } from './answersStore'
import { getMockPartnerAnswer } from '../data/mock'

// 커플 문답은 둘이 함께 쓰는 책 1권, 나머지 개인 카테고리는 내 책/상대 책 2권씩 나온다.
export const BOOK_ENTRIES = [
  { bookId: 'guide-mine', categoryId: 'guide', who: 'mine', label: '나의 연애 안내서' },
  { bookId: 'guide-partner', categoryId: 'guide', who: 'partner', label: '상대의 연애 안내서' },
  { bookId: 'couple', categoryId: 'couple', who: 'shared', label: '커플 문답' },
  { bookId: 'nineteen-mine', categoryId: 'nineteen', who: 'mine', label: '나의 19금 문답' },
  { bookId: 'nineteen-partner', categoryId: 'nineteen', who: 'partner', label: '상대의 19금 문답' },
]

export function findBookEntry(bookId) {
  return BOOK_ENTRIES.find((b) => b.bookId === bookId) || null
}

const PAGE_EMOJIS = ['🌷', '💌', '🎈', '🍀', '⭐', '🎨', '🐰', '🎵', '🌙', '🍯', '🕊️', '🫶']
function pickPageEmoji(id) {
  let hash = 0
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  return PAGE_EMOJIS[hash % PAGE_EMOJIS.length]
}

// 답변 완료한 질문만 페이지로 변환.
// - 커플 문답(shared): 내 페이지/상대 페이지를 번갈아 배치
// - 개인 카테고리 mine/partner: 각각 내 답변만, 또는 상대(목업) 답변만
export function buildBookPages(categoryId, who) {
  const questions = getQuestionsByCategory(categoryId)
  const pages = []
  let pageNumber = 1

  for (const q of questions) {
    const emoji = pickPageEmoji(q.id)

    if (who === 'shared') {
      const mine = getAnswer(q.id)
      if (!mine) continue
      const partnerBody = getMockPartnerAnswer(q)
      pages.push({
        questionId: q.id,
        questionText: q.question,
        subcategory: q.subcategory,
        pageNumber: pageNumber++,
        who: 'shared',
        mine,
        partner: partnerBody ? { body: partnerBody } : null,
        illustEmoji: emoji,
      })
      continue
    }

    if (who === 'mine') {
      const mine = getAnswer(q.id)
      if (!mine) continue
      pages.push({ questionId: q.id, questionText: q.question, subcategory: q.subcategory, pageNumber: pageNumber++, who: 'mine', answer: mine, illustEmoji: emoji })
    } else {
      const partnerBody = getMockPartnerAnswer(q)
      if (!partnerBody) continue
      pages.push({ questionId: q.id, questionText: q.question, subcategory: q.subcategory, pageNumber: pageNumber++, who: 'partner', answer: { body: partnerBody }, illustEmoji: emoji })
    }
  }

  return pages
}

export function getBookProgress(categoryId, who) {
  const questions = getQuestionsByCategory(categoryId)
  if (who === 'partner') {
    const done = questions.filter((q) => getMockPartnerAnswer(q)).length
    return { done, total: questions.length }
  }
  const done = questions.filter((q) => getAnswer(q.id)).length
  return { done, total: questions.length }
}
