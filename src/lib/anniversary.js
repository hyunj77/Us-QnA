import { MOCK_PROFILE } from '../data/mock'

const START_DATE = new Date(MOCK_PROFILE.startDate.replace(/\./g, '-'))

// 실제 커플들이 가장 많이 챙기는 일(day) 단위 기념일. 1000일 이후로는 500일 단위로만 표시.
const DAY_MILESTONES = [30, 50, 100, 200, 300, 500, 700, 1000]

function atMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function isDayMilestone(diffDays) {
  if (DAY_MILESTONES.includes(diffDays)) return true
  return diffDays > 1000 && diffDays % 500 === 0
}

// 사귄 날짜 기준으로 일(day) 단위 기념일, N주년을 자동 계산해서 라벨을 붙인다.
export function getAnniversaryLabel(date) {
  const diffDays = Math.round((atMidnight(date) - atMidnight(START_DATE)) / 86400000)
  if (diffDays > 0 && isDayMilestone(diffDays)) return `${diffDays}일`
  if (
    diffDays > 0 &&
    date.getMonth() === START_DATE.getMonth() &&
    date.getDate() === START_DATE.getDate()
  ) {
    return `${date.getFullYear() - START_DATE.getFullYear()}주년`
  }
  return null
}

// 다음으로 다가오는 자동 기념일까지 남은 일수 (홈/MY 화면 등에서 활용 가능)
export function getNextAnniversary(from = new Date()) {
  const diffDays = Math.round((atMidnight(from) - atMidnight(START_DATE)) / 86400000)
  const upcoming = DAY_MILESTONES.filter((d) => d > diffDays)
  let nextDayMilestone = upcoming[0]
  if (nextDayMilestone === undefined) {
    nextDayMilestone = Math.ceil((diffDays + 1) / 500) * 500
    if (nextDayMilestone <= 1000) nextDayMilestone = 1500
  }
  const yearsPassed = from.getFullYear() - START_DATE.getFullYear()
  let nextYearDate = new Date(START_DATE.getFullYear() + yearsPassed, START_DATE.getMonth(), START_DATE.getDate())
  if (atMidnight(nextYearDate) <= atMidnight(from)) {
    nextYearDate = new Date(START_DATE.getFullYear() + yearsPassed + 1, START_DATE.getMonth(), START_DATE.getDate())
  }
  const nextYearDiff = Math.round((atMidnight(nextYearDate) - atMidnight(from)) / 86400000)
  const nextDayDiff = nextDayMilestone - diffDays

  if (nextDayDiff <= nextYearDiff) {
    return { label: `${nextDayMilestone}일`, daysLeft: nextDayDiff }
  }
  return { label: `${nextYearDate.getFullYear() - START_DATE.getFullYear()}주년`, daysLeft: nextYearDiff }
}
