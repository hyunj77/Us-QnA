import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Settings, Star, FileText, Mail, MessageCircle, ChevronRight } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { MOCK_PROFILE } from '../data/mock'
import { getAnsweredCount } from '../lib/answersStore'
import { getAvatar, saveAvatarPhoto } from '../lib/profileStore'

export default function MyPage() {
  const navigate = useNavigate()
  const answeredCount = getAnsweredCount()
  const [mineAvatar, setMineAvatar] = useState(() => getAvatar('mine'))
  const [partnerAvatar, setPartnerAvatar] = useState(() => getAvatar('partner'))

  const handleAvatarUpload = (who, setAvatar) => (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(saveAvatarPhoto(who, reader.result))
    reader.readAsDataURL(file)
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
        <div className="profile-title">우리, {MOCK_PROFILE.daysTogether}일째 💕</div>
        <div className="profile-since">{MOCK_PROFILE.startDate} ~</div>
      </div>

      <div className="card stat-row" style={{ margin: '0 20px 20px', width: 'auto' }}>
        <div className="stat-row-item">
          <div className="stat-row-value">{answeredCount}</div>
          <div className="stat-row-label">답변한 질문</div>
        </div>
        <div className="stat-row-item">
          <div className="stat-row-value">23일</div>
          <div className="stat-row-label">연속 참여</div>
        </div>
        <div className="stat-row-item">
          <div className="stat-row-value">{MOCK_PROFILE.likesReceived}</div>
          <div className="stat-row-label">받은 좋아요</div>
        </div>
      </div>

      <div className="card couple-stats-card" style={{ margin: '0 20px 16px', width: 'auto' }}>
        <div className="couple-stats-title">우리의 문답 스타일</div>
        <div className="couple-stats-row">
          <div className="couple-stats-item">
            <div className="couple-stats-value">{MOCK_PROFILE.topCategory}</div>
            <div className="couple-stats-label">가장 많이 답한 카테고리</div>
          </div>
          <div className="couple-stats-item">
            <div className="couple-stats-value">{MOCK_PROFILE.avgAnswerLength}자</div>
            <div className="couple-stats-label">평균 답변 길이</div>
          </div>
        </div>
      </div>

      <div className="card" style={{ margin: '0 20px 16px', width: 'auto', padding: 0, overflow: 'hidden' }}>
        <MenuRow Icon={Star} label="즐겨찾기" />
        <MenuRow Icon={FileText} label="내 답변 모아보기" desc={`${answeredCount}개 작성함`} />
        <MenuRow Icon={Mail} label="상대 답변 모아보기" />
      </div>

      <div className="card" style={{ margin: '0 20px', width: 'auto', padding: 0, overflow: 'hidden' }}>
        <MenuRow Icon={Settings} label="설정" onClick={() => navigate('/settings')} />
        <MenuRow Icon={MessageCircle} label="문의하기" />
      </div>

      <BottomNav />
    </div>
  )
}

function MenuRow({ Icon, label, desc, onClick }) {
  return (
    <button className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }} onClick={onClick}>
      <Icon size={18} color="var(--main)" />
      <span className="menu-row-label">{label}</span>
      {desc && <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{desc}</span>}
      <ChevronRight size={16} className="menu-row-chevron" />
    </button>
  )
}
