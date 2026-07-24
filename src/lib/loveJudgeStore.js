import { supabase } from './supabaseClient'

// AI 연애 판사 기능은 Supabase Edge Function(love-judge)이 실제 AI API를 호출해서
// 판결문을 생성한다. Edge Function이 아직 배포/연동되지 않은 동안에는
// invoke가 실패하며, 이 경우 notConfigured 플래그를 달아 던져서
// 화면에서 "아직 준비 중이에요"로 보여줄 수 있게 한다.
export async function getJudgment(postId) {
  if (!supabase) return null
  const { data, error } = await supabase.from('community_judgments').select('*').eq('post_id', postId).maybeSingle()
  if (error) return null
  return data
}

export async function requestJudgment(postId, judgeStyle) {
  if (!supabase) {
    const err = new Error('AI 판결 기능은 아직 준비 중이에요.')
    err.notConfigured = true
    throw err
  }
  const { data, error } = await supabase.functions.invoke('love-judge', { body: { postId, judgeStyle } })
  if (error || !data) {
    const err = new Error('AI 판결 기능은 아직 준비 중이에요.')
    err.notConfigured = true
    throw err
  }
  return data
}
