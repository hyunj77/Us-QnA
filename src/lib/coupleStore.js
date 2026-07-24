import { supabase } from './supabaseClient'
import { resetNotifications, addNotification } from './notificationsStore'

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 헷갈리는 0/O, 1/I 제외

function randomCode() {
  let code = ''
  for (let i = 0; i < 6; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
  return code
}

// 로그인 직후 한 번 호출: profiles 테이블에 내 행이 없으면 만든다.
export async function ensureProfile(user) {
  if (!supabase || !user) return null
  const { data: existing } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  if (existing) return existing

  const nickname = user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.nickname || '나'
  const avatar_url = user.user_metadata?.avatar_url || user.user_metadata?.picture || null
  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: user.id, nickname, avatar_url })
    .select()
    .single()
  if (error) throw error

  // 첫 로그인이므로 이전에 둘러본 데모 알림을 지우고 환영 알림으로 시작한다.
  resetNotifications([{
    id: Date.now(),
    emoji: '💌',
    bg: 'var(--sub)',
    title: `${nickname}님, 우리 사용 설명서에 오신 걸 환영해요!`,
    sub: '문답에 답변하고 커플 코드로 상대방과 연결해보세요.',
    kind: 'today',
    unread: true,
    time: '방금',
  }])

  return data
}

export async function getMyProfile() {
  if (!supabase) return null
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
  return data
}

export async function createInviteCode() {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요해요.')

  const invite_code = randomCode()
  const { data: couple, error } = await supabase
    .from('couples')
    .insert({ invite_code, member_a: user.id, start_date: new Date().toISOString().slice(0, 10) })
    .select()
    .single()
  if (error) throw error

  const { error: profileError } = await supabase.from('profiles').update({ couple_id: couple.id }).eq('id', user.id)
  if (profileError) throw profileError
  return couple
}

// 캘린더에서 "첫 만남" 기념일을 지정하면 커플의 공식 시작일(며칠째 계산 기준)을 이 날짜로 갱신한다.
export async function updateStartDate(dateStr) {
  if (!supabase) return null
  const profile = await getMyProfile()
  if (!profile?.couple_id) return null
  const { error } = await supabase.from('couples').update({ start_date: dateStr }).eq('id', profile.couple_id)
  if (error) throw error
  return true
}

export async function joinByCode(code) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요해요.')

  const { data: couple, error } = await supabase
    .from('couples')
    .select('*')
    .eq('invite_code', code.trim().toUpperCase())
    .is('member_b', null)
    .maybeSingle()
  if (error) throw error
  if (!couple) throw new Error('코드를 찾을 수 없거나 이미 연결이 끝난 코드예요.')
  if (couple.member_a === user.id) throw new Error('본인이 만든 코드는 사용할 수 없어요.')

  const { error: updateError } = await supabase.from('couples').update({ member_b: user.id }).eq('id', couple.id)
  if (updateError) throw updateError

  const { error: profileError } = await supabase.from('profiles').update({ couple_id: couple.id }).eq('id', user.id)
  if (profileError) throw profileError

  const { data: myProfile } = await supabase.from('profiles').select('nickname').eq('id', user.id).maybeSingle()
  const myName = myProfile?.nickname || '상대방'

  // 코드를 만든 사람(member_a)에게 연결 완료를 알린다. 그 사람 기기가 지금 앱을 열어
  // 실시간 구독 중이면 바로 뜨고, 아니라면 다음에 열 때 알림함에 남아있는다.
  await supabase.from('notifications').insert({
    user_id: couple.member_a,
    kind: 'partner',
    emoji: '🎉',
    bg: '#E3F5E0',
    title: `${myName}님과 커플로 연결됐어요!`,
    sub: '이제 서로의 답변을 확인할 수 있어요.',
    unread: true,
  })

  // 코드를 입력한 나에게도 로컬로 바로 확인 알림을 남긴다.
  addNotification({
    emoji: '🎉',
    bg: '#E3F5E0',
    title: '커플 연결이 완료됐어요!',
    sub: '이제 서로의 답변을 확인할 수 있어요.',
    kind: 'partner',
  })

  return couple
}
