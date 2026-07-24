-- 우리 사용 설명서 - Supabase 스키마
-- Supabase 대시보드 → SQL Editor 에 이 파일 전체를 붙여넣고 실행하세요.
-- auth.users는 Supabase Auth가 자동으로 관리하므로 별도 테이블이 필요 없습니다.

create extension if not exists "pgcrypto";

-- ── couples: 커플 페어링 (6자리 초대 코드로 연결) ──────────────────────────
create table couples (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null,
  member_a uuid references auth.users(id) on delete set null,
  member_b uuid references auth.users(id) on delete set null,
  start_date date,
  created_at timestamptz not null default now()
);

-- ── profiles: auth.users 1:1 확장 (닉네임, 아바타, 소속 커플) ──────────────
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text,
  avatar_url text,
  birthday date,
  couple_id uuid references couples(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── answers: 문답 답변 (질문은 questions.json이 그대로 소스, question_id로만 연결) ──
create table answers (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  body text not null,
  photos text[] not null default '{}',
  history jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create table bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, question_id)
);

create table reactions (
  id uuid primary key default gen_random_uuid(),
  question_id text not null,
  liked_by uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (question_id, liked_by)
);

create table custom_anniversaries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  date date not null,
  label text not null,
  created_at timestamptz not null default now()
);

create table book_configs (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references couples(id) on delete cascade,
  book_id text not null,
  user_id uuid references auth.users(id) on delete cascade, -- null = 커플 공유 책(couple)
  nickname text,
  cover_type text not null default 'illust',
  cover_image text,
  created_at timestamptz not null default now(),
  unique (couple_id, book_id, user_id)
);

create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  kind text not null,
  emoji text,
  bg text,
  title text not null,
  sub text,
  unread boolean not null default true,
  created_at timestamptz not null default now()
);

-- ── 같은 커플인지 확인하는 헬퍼 함수 (RLS에서 재사용) ──────────────────────
create or replace function my_couple_id()
returns uuid
language sql
security definer
stable
as $$
  select couple_id from profiles where id = auth.uid();
$$;

-- ── RLS 활성화 ──────────────────────────────────────────────────────────
alter table couples enable row level security;
alter table profiles enable row level security;
alter table answers enable row level security;
alter table bookmarks enable row level security;
alter table reactions enable row level security;
alter table custom_anniversaries enable row level security;
alter table book_configs enable row level security;
alter table notifications enable row level security;

-- couples: 내가 속한 커플만 조회 가능
create policy "couples: select own" on couples
  for select using (member_a = auth.uid() or member_b = auth.uid());
create policy "couples: insert own" on couples
  for insert with check (member_a = auth.uid());
create policy "couples: update own" on couples
  for update using (member_a = auth.uid() or member_b = auth.uid());

-- profiles: 내 프로필 + 파트너 프로필 조회, 내 프로필만 수정
create policy "profiles: select self or partner" on profiles
  for select using (id = auth.uid() or couple_id = my_couple_id());
create policy "profiles: insert self" on profiles
  for insert with check (id = auth.uid());
create policy "profiles: update self" on profiles
  for update using (id = auth.uid());

-- answers: 같은 커플이면 서로의 답변을 읽을 수 있고, 쓰기는 본인 것만
create policy "answers: select same couple" on answers
  for select using (couple_id = my_couple_id());
create policy "answers: write own" on answers
  for insert with check (user_id = auth.uid() and couple_id = my_couple_id());
create policy "answers: update own" on answers
  for update using (user_id = auth.uid());
create policy "answers: delete own" on answers
  for delete using (user_id = auth.uid());

-- bookmarks: 본인 것만 읽고 쓰기 (개인 즐겨찾기)
create policy "bookmarks: own only" on bookmarks
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- reactions: 같은 커플 답변에 대한 반응은 서로 볼 수 있음, 쓰기는 본인만
create policy "reactions: select same couple" on reactions
  for select using (
    liked_by = auth.uid()
    or liked_by in (select id from profiles where couple_id = my_couple_id())
  );
create policy "reactions: write own" on reactions
  for all using (liked_by = auth.uid()) with check (liked_by = auth.uid());

-- custom_anniversaries, book_configs: 같은 커플이면 함께 읽고 쓰기
create policy "anniversaries: same couple" on custom_anniversaries
  for all using (couple_id = my_couple_id()) with check (couple_id = my_couple_id());
create policy "book_configs: same couple" on book_configs
  for all using (couple_id = my_couple_id()) with check (couple_id = my_couple_id());

-- notifications: 본인 것만
create policy "notifications: own only" on notifications
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ══════════════════════════════════════════════════════════════════════
-- 커뮤니티 탭: 연애 커뮤니티 게시판 + AI 연애 판사
-- (아래 블록은 커뮤니티 탭 추가 시점에 새로 실행한 SQL)
-- ══════════════════════════════════════════════════════════════════════

create table community_posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  author_nickname text not null default '익명',
  category text not null default '연애',
  title text not null,
  body text not null,           -- 상황 설명
  opponent_view text,           -- 상대방 입장 (선택)
  question text,                -- 내가 궁금한 점 (선택)
  reactions jsonb not null default '{"like":0,"funny":0,"sad":0,"angry":0,"judge_agree":0}'::jsonb,
  comments_count int not null default 0,
  created_at timestamptz not null default now()
);

create table community_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  author_nickname text not null default '익명',
  body text not null,
  is_ai boolean not null default false,
  created_at timestamptz not null default now()
);

-- AI 연애 판사 결과. Edge Function(love-judge)이 서비스 롤로 직접 써넣는다.
create table community_judgments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references community_posts(id) on delete cascade unique,
  case_number text not null,
  judge_style text not null,
  summary text,
  author_view jsonb,       -- { emotion, intent, pros, cons }
  opponent_view jsonb,     -- { emotion, intent, possibility, misunderstanding }
  issues jsonb,            -- string[]
  evidence jsonb,          -- { positive: string[], negative: string[], guesses: string[], facts: string[] }
  verdict text,
  fault_author int,
  fault_opponent int,
  recommended_actions jsonb, -- { action, reason }[]
  one_liner text,
  confidence int,
  created_at timestamptz not null default now()
);

alter table community_posts enable row level security;
alter table community_comments enable row level security;
alter table community_judgments enable row level security;

create policy "community_posts: select all" on community_posts for select using (auth.uid() is not null);
create policy "community_posts: insert own" on community_posts for insert with check (author_id = auth.uid());
create policy "community_posts: update own" on community_posts for update using (author_id = auth.uid());
create policy "community_posts: delete own" on community_posts for delete using (author_id = auth.uid());

create policy "community_comments: select all" on community_comments for select using (auth.uid() is not null);
create policy "community_comments: insert own" on community_comments for insert with check (author_id = auth.uid());
create policy "community_comments: delete own" on community_comments for delete using (author_id = auth.uid());

-- 판결 생성은 Edge Function이 서비스 롤 키로 수행하므로 클라이언트용 insert 정책은 두지 않고, 조회만 허용한다.
create policy "community_judgments: select all" on community_judgments for select using (auth.uid() is not null);

-- 좋아요/공감 등 반응 카운트를 다른 사람 글에도 안전하게 증감시키기 위한 함수(컬럼 단위 제한).
create or replace function toggle_post_reaction(p_post_id uuid, p_kind text, p_delta int)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update community_posts
  set reactions = jsonb_set(
    reactions,
    array[p_kind],
    to_jsonb(greatest(0, coalesce((reactions->>p_kind)::int, 0) + p_delta))
  )
  where id = p_post_id;
end;
$$;
grant execute on function toggle_post_reaction(uuid, text, int) to authenticated;

create or replace function increment_comment_count(p_post_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update community_posts set comments_count = comments_count + 1 where id = p_post_id;
$$;
grant execute on function increment_comment_count(uuid) to authenticated;

-- 연애 커뮤니티 피드가 카드형(사진 배경)으로 바뀌면서 게시글에 사진 첨부를 지원.
alter table community_posts add column photo_url text;

-- 게시글 태그(해시태그) 기능. 태그로 검색/필터할 수 있게 배열 컬럼 + GIN 인덱스.
alter table community_posts add column tags text[] not null default '{}';
create index community_posts_tags_idx on community_posts using gin (tags);

-- ── AI 연애 판사 Edge Function 배포 (비용 발생하니 나중에 연결) ──────────────
-- 1) supabase/functions/love-judge 폴더의 함수를 배포:
--      supabase functions deploy love-judge
-- 2) Anthropic API 키를 시크릿으로 등록:
--      supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
-- 이 두 단계를 하기 전까지 "AI 판결 받기" 버튼은 "아직 준비 중이에요"로 표시된다.
