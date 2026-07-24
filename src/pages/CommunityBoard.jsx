import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PenLine } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import { getPosts, canPost } from '../lib/communityStore'
import { isLoggedIn } from '../lib/authState'

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return '방금'
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  return `${Math.floor(hr / 24)}일 전`
}

export default function CommunityBoard() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="screen">
      <TopAppBar
        title="연애 커뮤니티"
        onBack={() => navigate('/community')}
        right={
          canPost() && (
            <button className="topbar-icon-btn" onClick={() => navigate('/community/board/new')}>
              <PenLine size={19} />
            </button>
          )
        }
      />

      <div style={{ padding: '4px 20px 20px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: 40 }}>불러오는 중...</p>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <button key={post.id} className="card" style={{ width: '100%', textAlign: 'left', marginBottom: 12, display: 'block' }} onClick={() => navigate(`/community/board/${post.id}`)}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>{post.title}</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                {post.body}
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 10, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span>{post.author_nickname}</span>
                <span>· {timeAgo(post.created_at)}</span>
                <span>· 좋아요 {post.likes_count}</span>
                <span>· 댓글 {post.comments_count}</span>
              </div>
            </button>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-state-emoji">💬</div>
            <div className="empty-state-title">아직 게시글이 없어요.</div>
            <div className="empty-state-desc">
              {isLoggedIn() ? '첫 번째 이야기를 남겨보세요!' : '로그인하면 다른 커플들과 이야기를 나눌 수 있어요.'}
            </div>
            {canPost() && (
              <PrimaryButton onClick={() => navigate('/community/board/new')} style={{ marginTop: 16 }}>글쓰기</PrimaryButton>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
