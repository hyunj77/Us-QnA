import { supabase } from './supabaseClient'
import { getCachedProfile } from './coupleState'
import { isLoggedIn } from './authState'

const REACTED_KEY = 'us-qna-community-reacted'

function getReactedMap() {
  try {
    return JSON.parse(localStorage.getItem(REACTED_KEY)) || {}
  } catch {
    return {}
  }
}

function saveReactedMap(map) {
  localStorage.setItem(REACTED_KEY, JSON.stringify(map))
}

export function canPost() {
  return isLoggedIn() && !!getCachedProfile()
}

// 이 브라우저에서 이미 누른 반응인지(중복 방지, 간단한 MVP 방식)
export function hasReacted(postId, kind) {
  const map = getReactedMap()
  return !!map[`${postId}:${kind}`]
}

export async function getPosts(limit = 50) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error || !data) return []
  return data
}

export async function getPost(id) {
  if (!supabase) return null
  const { data, error } = await supabase.from('community_posts').select('*').eq('id', id).maybeSingle()
  if (error) return null
  return data
}

// 연애 고민상담은 익명 게시판이라 실제 닉네임을 저장하지 않는다.
export async function createPost({ category, title, body, opponentView, question, photoDataUrl }) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')
  const profile = getCachedProfile()
  if (!profile) throw new Error('로그인이 필요해요.')
  const trimmedTitle = title.trim()
  const trimmedBody = body.trim()
  if (!trimmedTitle || !trimmedBody) throw new Error('제목과 상황 설명을 입력해주세요.')

  const { data, error } = await supabase
    .from('community_posts')
    .insert({
      author_id: profile.id,
      author_nickname: '익명',
      category: category || '연애',
      title: trimmedTitle,
      body: trimmedBody,
      opponent_view: opponentView?.trim() || null,
      question: question?.trim() || null,
      photo_url: photoDataUrl || null,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getComments(postId) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('community_comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  if (error || !data) return []
  return data
}

export async function addComment(postId, body) {
  if (!supabase) throw new Error('Supabase가 설정되지 않았어요.')
  const profile = getCachedProfile()
  if (!profile) throw new Error('로그인이 필요해요.')
  const trimmed = body.trim()
  if (!trimmed) throw new Error('댓글 내용을 입력해주세요.')

  const { error } = await supabase.from('community_comments').insert({
    post_id: postId,
    author_id: profile.id,
    author_nickname: '익명',
    body: trimmed,
  })
  if (error) throw error

  await supabase.rpc('increment_comment_count', { p_post_id: postId })
}

// 반응 토글: 이 브라우저 기준으로만 누른 여부를 기억하는 간단한 MVP 방식이고,
// 실제 카운트 증감은 Supabase 함수(toggle_post_reaction)로 안전하게 처리한다.
export async function toggleReaction(postId, kind, currentReactions) {
  if (!supabase) return currentReactions
  const map = getReactedMap()
  const key = `${postId}:${kind}`
  const already = !!map[key]
  const delta = already ? -1 : 1

  if (already) delete map[key]
  else map[key] = true
  saveReactedMap(map)

  await supabase.rpc('toggle_post_reaction', { p_post_id: postId, p_kind: kind, p_delta: delta })

  const current = currentReactions?.[kind] || 0
  return { ...currentReactions, [kind]: Math.max(0, current + delta) }
}
