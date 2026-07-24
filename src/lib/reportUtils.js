import { QUESTIONS, getCategories } from './questions'
import { getAllAnswers, getAnsweredCount, getStreakDays } from './answersStore'
import { getTogetherDays, getCompletionRate, getBalanceAgreementRate } from './statsUtils'
import { isAdultVerified } from './adultGate'

const Q_MAP = new Map(QUESTIONS.map((q) => [q.id, q]))

const TRAVEL_WORDS = [
  '제주', '부산', '강릉', '여수', '전주', '경주', '속초', '통영', '남해', '거제',
  '오사카', '도쿄', '후쿠오카', '삿포로', '오키나와', '다낭', '나트랑', '방콕', '치앙마이',
  '파리', '런던', '로마', '뉴욕', '하와이', '발리', '괌', '사이판', '홍콩', '싱가포르',
  '유럽', '바다', '섬', '해외여행', '여행',
]

const FOOD_WORDS = [
  '치킨', '피자', '삼겹살', '회', '초밥', '파스타', '떡볶이', '라면', '마라탕',
  '스테이크', '케이크', '커피', '와인', '국밥', '냉면', '짜장면', '짬뽕', '곱창',
  '고기', '빵', '디저트', '샐러드', '쌀국수', '족발', '보쌈', '탕수육',
]

const EMOTION_WORDS = [
  '행복', '설렘', '사랑', '편안', '고마움', '걱정', '그리움', '즐거움', '뿌듯함', '안심', '불안', '서운함', '미안함',
]

const PERSONALITY_DIMENSIONS = [
  { key: 'values', label: '가치관', emoji: '💭', match: (q) => q.categoryId === 'balance' && q.subcategory === '가치관' || q.categoryId === 'guide' && q.subcategory === '연애 가치관' },
  { key: 'consumption', label: '소비 성향', emoji: '💳', keywords: ['돈', '소비', '쇼핑', '저축', '아껴', '가성비', '명품'] },
  { key: 'dating', label: '데이트 스타일', emoji: '💐', match: (q) => q.categoryId === 'couple' && q.subcategory === '데이트' },
  { key: 'travel', label: '여행 스타일', emoji: '✈️', keywords: TRAVEL_WORDS },
  { key: 'expression', label: '사랑 표현 방식', emoji: '💌', match: (q) => q.categoryId === 'guide' && q.subcategory === '사랑 표현' },
  { key: 'conflict', label: '갈등 해결 방식', emoji: '🕊️', match: (q) => q.categoryId === 'couple' && q.subcategory === '갈등과 서운함' },
  { key: 'contact', label: '연락 스타일', emoji: '📱', keywords: ['연락', '전화', '문자', '카톡', '답장'] },
  { key: 'planning', label: '계획형 · 즉흥형', emoji: '🗓️', match: (q) => (q.categoryId === 'balance' && q.subcategory === '극한의 선택') || (q.categoryId === 'ifonly' && q.subcategory === '상상과 극단') },
]

function countKeywordHits(text, words) {
  const counts = {}
  for (const word of words) {
    const hits = text.split(word).length - 1
    if (hits > 0) counts[word] = hits
  }
  return counts
}

function topWord(counts) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return entries.length ? entries[0][0] : null
}

function answeredTextEntries() {
  const all = getAllAnswers()
  return Object.entries(all)
    .map(([questionId, entry]) => ({ questionId, question: Q_MAP.get(questionId), ...entry }))
    .filter((e) => e.question && e.question.type !== 'balance' && e.question.type !== 'choice' && e.body)
}

// 1. 함께한 기록
export function getTogetherStats() {
  return {
    togetherDays: getTogetherDays(),
    answeredCount: getAnsweredCount(),
    totalCount: QUESTIONS.length,
    completionPct: getCompletionRate(),
    streak: getStreakDays(),
  }
}

// 2. 우리 통계 (일치율 + 키워드/여행지/음식/감정)
export function getCoupleStatistics() {
  const entries = answeredTextEntries()
  const fullText = entries.map((e) => e.body).join(' ')
  const agreement = getBalanceAgreementRate()

  return {
    agreementRate: agreement ? agreement.rate : null,
    topKeyword: entries.length > 0 ? topKeywordFromFreeText(fullText) : null,
    topTravel: topWord(countKeywordHits(fullText, TRAVEL_WORDS)),
    topFood: topWord(countKeywordHits(fullText, FOOD_WORDS)),
    topEmotion: topWord(countKeywordHits(fullText, EMOTION_WORDS)),
  }
}

const STOPWORDS = new Set(['그리고', '하지만', '그래서', '정말', '진짜', '너무', '그냥', '우리', '나는', '너는', '나의', '너의'])

function topKeywordFromFreeText(text) {
  const words = text
    .replace(/[.,!?~^()'"…\-_/]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !STOPWORDS.has(w))
  const freq = {}
  for (const w of words) freq[w] = (freq[w] || 0) + 1
  return topWord(freq)
}

// 3. AI 성향 분석 (규칙 기반 요약 — 답변 데이터에서 대표 답변을 골라 보여준다)
export function getPersonalityInsights() {
  const entries = answeredTextEntries()
  const insights = []

  for (const dim of PERSONALITY_DIMENSIONS) {
    let candidates = entries
    if (dim.match) {
      candidates = entries.filter((e) => dim.match(e.question))
    } else if (dim.keywords) {
      candidates = entries.filter((e) => dim.keywords.some((w) => e.body.includes(w)))
    }
    if (candidates.length === 0) continue
    const best = candidates.reduce((a, b) => (b.body.length > a.body.length ? b : a))
    const snippet = best.body.length > 46 ? `${best.body.slice(0, 46)}…` : best.body
    insights.push({ key: dim.key, label: dim.label, emoji: dim.emoji, snippet })
  }

  return insights
}

// 4. AI 추천 질문 (아직 덜 채워진 소분류에서 3~5개 추천)
export function getRecommendedQuestions(limit = 4) {
  const answeredIds = new Set(Object.keys(getAllAnswers()))
  const categories = getCategories().filter((c) => !c.isAdult || isAdultVerified())

  const groups = new Map()
  for (const q of QUESTIONS) {
    const category = categories.find((c) => c.id === q.categoryId)
    if (!category) continue
    const key = `${q.categoryId}::${q.subcategory || ''}`
    if (!groups.has(key)) {
      groups.set(key, { categoryId: q.categoryId, subcategory: q.subcategory, categoryLabel: category.label, total: 0, answered: 0, unanswered: [] })
    }
    const group = groups.get(key)
    group.total += 1
    if (answeredIds.has(q.id)) group.answered += 1
    else group.unanswered.push(q)
  }

  const candidates = [...groups.values()]
    .filter((g) => g.unanswered.length > 0 && g.answered > 0)
    .sort((a, b) => a.answered / a.total - b.answered / b.total)

  if (candidates.length === 0) return { lead: null, questions: [] }

  const target = candidates[0]
  const label = target.subcategory ? `${target.categoryLabel} · ${target.subcategory}` : target.categoryLabel
  return {
    lead: `아직 "${label}"에 대한 질문이 부족해요.`,
    questions: target.unanswered.slice(0, limit).map((q) => ({ id: q.id, categoryId: q.categoryId, question: q.question })),
  }
}
