import { getAnniversaryLabel } from './anniversary'
import { getAllCustomAnniversaries, dateKey } from './customAnniversaries'
import { addNotification } from './notificationsStore'

const NOTIFIED_KEY = 'us-qna-notified-dates'

function alreadyNotified(key) {
  try {
    const list = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]')
    return list.includes(key)
  } catch {
    return false
  }
}

function markNotified(key) {
  try {
    const list = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]')
    list.push(key)
    localStorage.setItem(NOTIFIED_KEY, JSON.stringify(list.slice(-60)))
  } catch {
    // localStorage unavailable, skip persisting
  }
}

async function firePhoneNotification(title, body) {
  if (!('Notification' in window)) return
  if (Notification.permission === 'default') {
    try {
      await Notification.requestPermission()
    } catch {
      return
    }
  }
  if (Notification.permission !== 'granted') return

  const icon = `${import.meta.env.BASE_URL}favicon.svg`
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready
      reg.showNotification(title, { body, icon, tag: 'anniversary' })
      return
    }
    // eslint-disable-next-line no-new
    new Notification(title, { body, icon })
  } catch {
    // 알림 권한/환경이 지원되지 않으면 앱 내 알림함 기록만 남긴다
  }
}

// 오늘 날짜가 자동 계산된 기념일(일 단위 마일스톤/주년) 또는
// 사용자가 캘린더에서 직접 추가한 기념일과 일치하면
// 앱 내 알림함에 기록하고, 권한이 있으면 휴대폰 알림도 함께 띄운다.
// 실제 앱이 꺼져 있는 상태에서 자정에 정확히 울리려면 푸시 서버가 필요해,
// 이 체크는 앱을 여는 시점(그날 최초 실행)마다 수행된다.
export function checkTodayAnniversary() {
  const today = new Date()
  const key = dateKey(today)
  if (alreadyNotified(key)) return

  const auto = getAnniversaryLabel(today)
  const custom = getAllCustomAnniversaries()[key]

  if (auto) {
    const title = `오늘은 ${auto} 기념일이에요! 🎉`
    addNotification({ emoji: '🎉', bg: '#FFF3D6', title, sub: '특별한 하루를 보내보세요.', kind: 'anniversary' })
    firePhoneNotification(title, '우리 사용 설명서에서 확인해보세요.')
    markNotified(key)
  } else if (custom) {
    const title = `오늘은 ${custom.label}이에요! 💗`
    addNotification({ emoji: '💗', bg: 'var(--sub)', title, sub: '오늘을 기억해주세요.', kind: 'anniversary' })
    firePhoneNotification(title, '우리 사용 설명서에서 확인해보세요.')
    markNotified(key)
  }
}
