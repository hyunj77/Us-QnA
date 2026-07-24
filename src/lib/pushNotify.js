// 휴대폰 상단바(OS 알림)에 로컬 알림을 띄운다. 서비스워커가 있으면 그걸 통해 띄우고
// (안드로이드 Chrome은 이 방식이 필요), 없으면 Notification 생성자로 대체한다.
// 앱/브라우저가 완전히 꺼진 상태에서 서버가 대신 깨워 보내는 "진짜 푸시"는 아니며,
// 이 함수가 호출되는 시점(예: 앱이 열려 있거나 Realtime 이벤트를 받은 시점)에만 동작한다.
export async function firePhoneNotification(title, body, tag = 'default') {
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
      reg.showNotification(title, { body, icon, tag })
      return
    }
    // eslint-disable-next-line no-new
    new Notification(title, { body, icon })
  } catch {
    // 알림 권한/환경이 지원되지 않으면 앱 내 알림함 기록만 남긴다
  }
}
