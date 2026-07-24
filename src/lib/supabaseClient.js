import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// URL/키가 아직 설정되지 않은 동안(로컬 개발, 마이그레이션 이전)에는 null로 두고,
// 이걸 쓰는 코드 쪽에서 supabase가 없으면 localStorage로 동작하도록 분기한다.
export const supabase = url && anonKey ? createClient(url, anonKey) : null

export const isSupabaseConfigured = !!supabase
