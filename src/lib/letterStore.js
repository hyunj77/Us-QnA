import { supabase } from './supabaseClient'
import { getCachedCouple, getCachedProfile } from './coupleState'

function getPartnerId() {
  const couple = getCachedCouple()
  const profile = getCachedProfile()
  if (!couple || !profile) return null
  const partnerId = couple.member_a === profile.id ? couple.member_b : couple.member_a
  return partnerId || null
}

export function canWriteLetter() {
  return !!getPartnerId()
}

// 편지를 보낸다. letters 테이블에 본문을 저장하고, 동시에 notifications 테이블에도
// 알림을 남겨서 기존 콕 찌르기와 같은 실시간/휴대폰 알림 통로를 그대로 재사용한다.
export async function sendLetter(body) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')
  const trimmed = body.trim()
  if (!trimmed) throw new Error('편지 내용을 입력해주세요.')

  const partnerId = getPartnerId()
  if (!partnerId) throw new Error('아직 커플 연결이 안 됐어요.')

  const profile = getCachedProfile()
  const couple = getCachedCouple()
  const myName = profile?.nickname || '상대방'

  const { error } = await supabase.from('letters').insert({
    couple_id: couple.id,
    sender_id: profile.id,
    receiver_id: partnerId,
    body: trimmed,
  })
  if (error) throw error

  await supabase.from('notifications').insert({
    user_id: partnerId,
    kind: 'letter',
    emoji: '💌',
    bg: '#FFE1EC',
    title: `${myName}님이 편지를 보냈어요`,
    sub: '추억 탭 편지함에서 확인해보세요',
    unread: true,
  })
}

// 받은 편지 + 보낸 편지를 합쳐서 최신순으로 반환한다.
export async function getAllLetters(limit = 100) {
  if (!supabase) return []
  const profile = getCachedProfile()
  if (!profile) return []

  const { data, error } = await supabase
    .from('letters')
    .select('*')
    .or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error || !data) return []

  return data.map((row) => ({ ...row, direction: row.sender_id === profile.id ? 'sent' : 'received' }))
}

export async function markLetterRead(id) {
  if (!supabase) return
  await supabase.from('letters').update({ read: true }).eq('id', id)
}
