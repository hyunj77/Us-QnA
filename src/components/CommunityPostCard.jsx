import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle } from 'lucide-react'
import { CATEGORY_GRADIENT } from '../data/communityCategories'

function timeAgo(iso) {
  const diffMs = Date.now() - new Date(iso).getTime()
  const min = Math.floor(diffMs / 60000)
  if (min < 1) return '방금'
  if (min < 60) return `${min}분 전`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}시간 전`
  return `${Math.floor(hr / 24)}일 전`
}

export default function CommunityPostCard({ post }) {
  const navigate = useNavigate()
  const baseLayer = post.photo_url ? `url(${post.photo_url})` : CATEGORY_GRADIENT[post.category] || CATEGORY_GRADIENT['연애']

  return (
    <button
      className="community-feed-card"
      style={{ backgroundImage: `linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0) 55%), ${baseLayer}` }}
      onClick={() => navigate(`/community/board/${post.id}`)}
    >
      <span className="community-feed-card-category">{post.category}</span>

      <div className="community-feed-card-bottom">
        <div className="community-feed-card-title">{post.title}</div>
        <p className="community-feed-card-preview">{post.body}</p>
        <div className="community-feed-card-meta">
          <span><Heart size={13} fill="#fff" /> {post.reactions?.like || 0}</span>
          <span><MessageCircle size={13} /> {post.comments_count || 0}</span>
          <span className="community-feed-card-time">{timeAgo(post.created_at)}</span>
        </div>
      </div>
    </button>
  )
}
