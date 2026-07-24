import { getEffectiveStartDate } from './coupleState'

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
  const startDate = getEffectiveStartDate()
  if (!startDate) return null
  const diffDays = Math.round((atMidnight(date) - atMidnight(startDate)) / 86400000)
  if (diffDays > 0 && isDayMilestone(diffDays)) return `${diffDays}일`
  if (
    diffDays > 0 &&
    date.getMonth() === startDate.getMonth() &&
    date.getDate() === startDate.getDate()
  ) {
    return `${date.getFullYear() - startDate.getFullYear()}주년`
  }
  return null
}

// 다음으로 다가오는 자동 기념일까지 남은 일수 (홈/MY 화면 등에서 활용 가능)
// 커플 시작일 정보가 아직 없으면(로그인은 했지만 커플 연결 전 등) label만 안내 문구로 반환한다.
export function getNextAnniversary(from = new Date()) {
  const startDate = getEffectiveStartDate()
  if (!startDate) return { label: '커플 연결 후 표시', daysLeft: null }

  const diffDays = Math.round((atMidnight(from) - atMidnight(startDate)) / 86400000)
  const upcoming = DAY_MILESTONES.filter((d) => d > diffDays)
  let nextDayMilestone = upcoming[0]
  if (nextDayMilestone === undefined) {
    nextDayMilestone = Math.ceil((diffDays + 1) / 500) * 500
    if (nextDayMilestone <= 1000) nextDayMilestone = 1500
  }
  const yearsPassed = from.getFullYear() - startDate.getFullYear()
  let nextYearDate = new Date(startDate.getFullYear() + yearsPassed, startDate.getMonth(), startDate.getDate())
  if (atMidnight(nextYearDate) <= atMidnight(from)) {
    nextYearDate = new Date(startDate.getFullYear() + yearsPassed + 1, startDate.getMonth(), startDate.getDate())
  }
  const nextYearDiff = Math.round((atMidnight(nextYearDate) - atMidnight(from)) / 86400000)
  const nextDayDiff = nextDayMilestone - diffDays

  if (nextDayDiff <= nextYearDiff) {
    return { label: `${nextDayMilestone}일`, daysLeft: nextDayDiff }
  }
  return { label: `${nextYearDate.getFullYear() - startDate.getFullYear()}주년`, daysLeft: nextYearDiff }
}
