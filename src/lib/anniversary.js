import { MOCK_PROFILE } from '../data/mock'

const START_DATE = new Date(MOCK_PROFILE.startDate.replace(/\./g, '-'))

function atMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

// 사귄 날짜 기준으로 100일 단위 기념일, N주년을 자동 계산해서 라벨을 붙인다.
export function getAnniversaryLabel(date) {
  const diffDays = Math.round((atMidnight(date) - atMidnight(START_DATE)) / 86400000)
  if (diffDays > 0 && diffDays % 100 === 0) return `${diffDays}일`
  if (
    diffDays > 0 &&
    date.getMonth() === START_DATE.getMonth() &&
    date.getDate() === START_DATE.getDate()
  ) {
    return `${date.getFullYear() - START_DATE.getFullYear()}주년`
  }
  return null
}
