import { getQuestionsByCategory, getCategories } from './questions'
import { getAnswer } from './answersStore'
import { getMockPartnerAnswer } from '../data/mock'

// 라벨이 이미 "나의 ~"로 시작하는 카테고리는 그대로 쓰고, 아니면 "나의/상대의"를 붙인다.
const LABEL_OVERRIDE = {
  heartpairing: { mine: '나의 하트페어링 북', partner: '상대의 하트페어링 북' },
}

function personalLabels(category) {
  if (LABEL_OVERRIDE[category.id]) return LABEL_OVERRIDE[category.id]
  if (category.label.startsWith('나의')) {
    return { mine: category.label, partner: `상대의 ${category.label.replace(/^나의\s*/, '')}` }
  }
  return { mine: `나의 ${category.label}`, partner: `상대의 ${category.label}` }
}

// 문답 섹션(카테고리)마다 자동으로 책이 생긴다. "커플 문답"만 둘이 함께 쓰는 책 1권이고,
// 나머지는 각자 답변하는 카테고리라 내 책/상대 책 2권씩 생긴다.
// 새 카테고리를 추가하면 코드를 더 손대지 않아도 여기서 자동으로 책이 만들어진다.
export const BOOK_ENTRIES = getCategories().flatMap((category) => {
  if (category.id === 'couple') {
    return [{ bookId: 'couple', categoryId: 'couple', who: 'shared', label: category.label }]
  }
  const { mine, partner } = personalLabels(category)
  return [
    { bookId: `${category.id}-mine`, categoryId: category.id, who: 'mine', label: mine },
    { bookId: `${category.id}-partner`, categoryId: category.id, who: 'partner', label: partner },
  ]
})

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
