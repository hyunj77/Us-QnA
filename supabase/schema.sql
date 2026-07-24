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
