import { supabase } from './supabaseClient'
import { getCachedCouple, getCachedProfile } from './coupleState'
import { addNotification, mergeServerNotifications } from './notificationsStore'
import { firePhoneNotification } from './pushNotify'

function getPartnerId() {
  const couple = getCachedCouple()
  const profile = getCachedProfile()
  if (!couple || !profile) return null
  const partnerId = couple.member_a === profile.id ? couple.member_b : couple.member_a
  return partnerId || null
}

export function canPoke() {
  return !!getPartnerId()
}

// 상대방에게 "콕 찔렀어요" 알림을 보낸다. notifications 테이블에 상대방 user_id로
// 행을 넣으면, 상대방 기기에서 Realtime 구독이 그걸 받아 알림함 + 휴대폰 알림을 띄운다.
export async function sendPoke() {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')
  const partnerId = getPartnerId()
  if (!partnerId) throw new Error('아직 커플 연결이 안 됐어요.')

  const profile = getCachedProfile()
  const myName = profile?.nickname || '상대방'

  const { error } = await supabase.from('notifications').insert({
    user_id: partnerId,
    kind: 'poke',
    emoji: '👉',
    bg: '#FFE1EC',
    title: `${myName}님이 당신을 콕! 찔렀어요`,
    sub: '답장을 기다리고 있어요 💌',
    unread: true,
  })
  if (error) throw error
}

// 앱을 여는 시점마다 호출: 그동안(앱이 닫혀있던 사이) 서버에 쌓인 알림을 로컬 알림함으로
// 가져온다. 실시간 구독은 "지금 앱이 켜져있을 때"만 잡아내므로, 이게 있어야 나중에
// 웹링크로 다시 들어왔을 때도 놓친 알림(콕 찌르기 포함)을 확인할 수 있다.
export async function syncMissedNotifications() {
  if (!supabase) return
  const profile = getCachedProfile()
  if (!profile) return
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(30)
  if (error || !data) return
  mergeServerNotifications(data)
}

let subscribed = false

// 로그인 + 커플 연결된 사용자에 대해 한 번만 구독을 건다.
// 내 user_id로 들어오는 새 notifications 행을 실시간으로 받아 로컬 알림함에 반영하고
// 휴대폰 알림도 띄운다.
export function subscribePokes() {
  if (subscribed || !supabase) return
  const profile = getCachedProfile()
  if (!profile) return
  subscribed = true

  supabase
    .channel('notifications-inbox')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${profile.id}` },
      (payload) => {
        const row = payload.new
        addNotification({
          id: row.id,
          emoji: row.emoji,
          bg: row.bg,
          title: row.title,
          sub: row.sub,
          kind: row.kind,
        })
        firePhoneNotification(row.title, row.sub || '우리 사용 설명서에서 확인해보세요.', row.kind)
      }
    )
    .subscribe()
}
