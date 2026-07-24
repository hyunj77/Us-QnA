import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Star, FileText, Mail, MessageCircle, ChevronRight, Sparkles, Bell, ShieldOff, Package } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import AdBanner from '../components/AdBanner'
import { MOCK_PROFILE } from '../data/mock'
import { getAnsweredCount, getStreakDays } from '../lib/answersStore'
import { getAvatar, saveAvatarPhoto } from '../lib/profileStore'
import { getLikedCount } from '../lib/reactionsStore'
import { getTogetherDays, getTopCategory, getAvgAnswerLength } from '../lib/statsUtils'
import { resizeImageFile } from '../lib/imageUtils'
import { isLoggedIn } from '../lib/authState'
import { getCachedCouple } from '../lib/coupleState'
import { getUnreadCount } from '../lib/notificationsStore'

export default function MyPage() {
  const navigate = useNavigate()
  const unreadCount = getUnreadCount()
  const answeredCount = getAnsweredCount()
  const streak = getStreakDays()
  const likesReceived = getLikedCount('mine')
  const togetherDays = getTogetherDays()
  const topCategory = getTopCategory()
  const avgLength = getAvgAnswerLength()
  const startDateLabel = isLoggedIn()
    ? (getCachedCouple()?.start_date ? getCachedCouple().start_date.replaceAll('-', '.') : null)
    : MOCK_PROFILE.startDate
  const [mineAvatar, setMineAvatar] = useState(() => getAvatar('mine'))
  const [partnerAvatar, setPartnerAvatar] = useState(() => getAvatar('partner'))

  const handleAvatarUpload = (who, setAvatar) => async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const dataUrl = await resizeImageFile(file, { maxDim: 400, quality: 0.8 })
    setAvatar(saveAvatarPhoto(who, dataUrl))
  }

  return (
    <div className="screen">
      <div className="topbar" style={{ justifyContent: 'flex-end' }}>
        <button className="topbar-icon-btn" onClick={() => navigate('/settings')}><Settings size={20} /></button>
      </div>

      <div className="profile-head">
        <div className="profile-avatars">
          <label className="profile-avatar-upload">
            {mineAvatar.type === 'photo' ? <img src={mineAvatar.image} alt="" /> : <span>{mineAvatar.image}</span>}
            <input type="file" accept="image/*" onChange={handleAvatarUpload('mine', setMineAvatar)} style={{ display: 'none' }} />
          </label>
          <label className="profile-avatar-upload">
            {partnerAvatar.type === 'photo' ? <img src={partnerAvatar.image} alt="" /> : <span>{partnerAvatar.image}</span>}
            <input type="file" accept="image/*" onChange={handleAvatarUpload('partner', setPartnerAvatar)} style={{ display: 'none' }} />
          </label>
        </div>
        {togetherDays != null ? (
          <div className="profile-title">우리, {togetherDays}일째 💕</div>
        ) : (
          <button type="button" className="profile-title-cta" onClick={() => navigate('/couple-connect')}>
            커플 코드 연결하기 →
          </button>
        )}
        {startDateLabel && <div className="profile-since">{startDateLabel} ~</div>}
      </div>

      <div className="card stat-row" style={{ margin: '0 20px 20px', width: 'auto' }}>
        <div className="stat-row-item">
          <div className="stat-row-value">{answeredCount}</div>
          <div className="stat-row-label">답변한 질문</div>
        </div>
        <div className="stat-row-item">
          <div className="stat-row-value">{streak}일</div>
          <div className="stat-row-label">연속 참여</div>
        </div>
        <div className="stat-row-item">
          <div className="stat-row-value">{likesReceived}</div>
          <div className="stat-row-label">받은 좋아요</div>
        </div>
      </div>

      <div className="card" style={{ margin: '0 20px 16px', width: 'auto', padding: 0, overflow: 'hidden' }}>
        <MenuRow Icon={Bell} label="알림" badge={unreadCount > 0} onClick={() => navigate('/notifications')} />
      </div>

      <button className="card couple-stats-card" style={{ margin: '0 20px 16px', width: 'auto', textAlign: 'left' }} onClick={() => navigate('/us')}>
        <div className="couple-stats-title">우리의 문답 스타일</div>
        <div className="couple-stats-row">
          <div className="couple-stats-item">
            <div className="couple-stats-value">{topCategory ? topCategory.label : '-'}</div>
            <div className="couple-stats-label">가장 많이 답한 카테고리</div>
          </div>
          <div className="couple-stats-item">
            <div className="couple-stats-value">{avgLength}자</div>
            <div className="couple-stats-label">평균 답변 길이</div>
          </div>
        </div>
      </button>

      <div className="card" style={{ margin: '0 20px 16px', width: 'auto', padding: 0, overflow: 'hidden' }}>
        <MenuRow Icon={Sparkles} label="우리 통계" onClick={() => navigate('/us')} />
        <MenuRow Icon={Star} label="즐겨찾기" onClick={() => navigate('/bookmarks')} />
        <MenuRow Icon={FileText} label="내 답변 모아보기" desc={`${answeredCount}개 작성함`} onClick={() => navigate('/answers/mine')} />
        <MenuRow Icon={Mail} label="상대 답변 모아보기" onClick={() => navigate('/answers/partner')} />
      </div>

      <div className="card" style={{ margin: '0 20px 16px', width: 'auto', padding: 0, overflow: 'hidden' }}>
        <MenuRow Icon={ShieldOff} label="광고 제거" desc="3,900원" onClick={() => navigate('/settings/remove-ads')} />
        <MenuRow Icon={Package} label="우리의 책 인쇄 주문" onClick={() => navigate('/settings/book-print')} />
      </div>

      <div className="card" style={{ margin: '0 20px 16px', width: 'auto', padding: 0, overflow: 'hidden' }}>
        <MenuRow Icon={Settings} label="설정" onClick={() => navigate('/settings')} />
        <MenuRow Icon={MessageCircle} label="문의하기" />
      </div>

      <div style={{ margin: '0 20px 16px' }}>
        <AdBanner />
      </div>

      <BottomNav />
    </div>
  )
}

function MenuRow({ Icon, label, desc, badge, onClick }) {
  return (
    <button className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }} onClick={onClick}>
      <Icon size={18} color="var(--main)" />
      <span className="menu-row-label">{label}</span>
      {badge && <span className="menu-row-badge-dot" />}
      {desc && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</span>}
      <ChevronRight size={16} className="menu-row-chevron" />
    </button>
  )
}
