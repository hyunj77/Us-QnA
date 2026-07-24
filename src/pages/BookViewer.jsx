import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ChevronLeft, ChevronRight, Lock, Pencil, X } from 'lucide-react'
import AdultGate from '../components/AdultGate'
import { findCategory } from '../lib/questions'
import { findBookEntry, buildBookPages } from '../lib/bookUtils'
import { getBookConfig, saveBookConfig, COVER_ILLUSTRATIONS } from '../lib/bookStore'
import { isAdultVerified } from '../lib/adultGate'
import { resizeImageFile } from '../lib/imageUtils'

const BY_LABEL = { mine: 'by 나', partner: 'by 상대', shared: 'by 우리 둘' }

export default function BookViewer() {
  const { bookId } = useParams()
  const navigate = useNavigate()
  const entry = findBookEntry(bookId)
  const category = entry ? findCategory(entry.categoryId) : null
  const [config, setConfig] = useState(() => entry ? getBookConfig(entry.bookId, entry.who) : null)
  const [view, setView] = useState('cover') // 'cover' | page index (number)
  const [editing, setEditing] = useState(false)
  const [verified, setVerified] = useState(isAdultVerified())

  const pages = useMemo(() => entry ? buildBookPages(entry.categoryId, entry.who) : [], [entry])

  if (!entry || !category) return <div className="page-center"><p>존재하지 않는 책이에요.</p></div>

  if (category.isAdult && !verified) {
    return (
      <div className="screen">
        <div className="topbar">
          <button className="topbar-icon-btn" onClick={() => navigate('/memories')}><ArrowLeft size={20} /></button>
        </div>
        <AdultGate onVerified={() => setVerified(true)} onBack={() => navigate('/memories')} />
      </div>
    )
  }

  const title = entry.who === 'shared' ? '우리 사용 설명서' : `${config.nickname} 사용 설명서`
  const byLine = BY_LABEL[entry.who]

  const handleSaveCover = (patch) => {
    setConfig(saveBookConfig(entry.bookId, entry.who, patch))
  }

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    const dataUrl = await resizeImageFile(file, { maxDim: 700, quality: 0.8 })
    handleSaveCover({ coverType: 'photo', coverImage: dataUrl })
  }

  if (view === 'cover') {
    return (
      <div className="screen book-screen">
        <div className="topbar">
          <button className="topbar-icon-btn" onClick={() => navigate('/memories')}><ArrowLeft size={20} /></button>
          {entry.who !== 'shared' && (
            <button className="topbar-icon-btn" onClick={() => setEditing(true)}><Pencil size={18} /></button>
          )}
        </div>

        <div className="book-cover">
          <div className="book-cover-category">{entry.label}</div>
          <div className="book-cover-title">{title}</div>
          <div className="book-cover-by">{byLine}</div>
          <div className="book-cover-image">
            {config.coverType === 'photo' && config.coverImage ? (
              <img src={config.coverImage} alt="" />
            ) : (
              <span>{config.coverImage}</span>
            )}
          </div>
          <div className="book-cover-count">{pages.length}개의 이야기</div>

          {pages.length > 0 ? (
            <button className="btn-primary book-open-btn" onClick={() => setView(0)}>책 열어보기</button>
          ) : (
            <p className="book-empty-hint">
              {entry.who === 'partner' ? '상대방이 아직 답변하지 않았어요.' : '아직 답변한 질문이 없어요. 문답에 답변하면 페이지가 쌓여요!'}
            </p>
          )}
        </div>

        {editing && (
          <CoverEditSheet
            config={config}
            onChangeNickname={(nickname) => handleSaveCover({ nickname })}
            onChangeIllust={(emoji) => handleSaveCover({ coverType: 'illust', coverImage: emoji })}
            onUpload={handlePhotoUpload}
            onClose={() => setEditing(false)}
          />
        )}
      </div>
    )
  }

  const page = pages[view]
  const isLockedPartnerPage = page.who === 'partner' && !page.answer

  return (
    <div className="screen book-screen book-page-screen">
      <div className="topbar">
        <button className="topbar-icon-btn" onClick={() => setView('cover')}><ArrowLeft size={20} /></button>
      </div>

      <div className="book-page">
        <div className="book-page-meta">
          {page.subcategory}{page.who !== 'shared' ? ` · ${page.who === 'partner' ? '상대의 이야기' : '나의 이야기'}` : ''}
        </div>
        <div className="book-page-emoji">{page.illustEmoji}</div>
        <div className="book-page-question">{page.questionText}</div>
        <div className="book-page-divider" />
        {page.who === 'shared' ? (
          <div className="book-page-answers">
            <div className="book-page-answer-block">
              <div className="book-page-answer-who">🧑 나</div>
              <div className="book-page-answer">{page.mine.body}</div>
            </div>
            <div className="book-page-answer-block">
              <div className="book-page-answer-who">💛 상대</div>
              {page.partner ? (
                <div className="book-page-answer">{page.partner.body}</div>
              ) : (
                <div className="book-page-locked">
                  <Lock size={16} />
                  <span>아직 작성 중이에요</span>
                </div>
              )}
            </div>
          </div>
        ) : isLockedPartnerPage ? (
          <div className="book-page-locked">
            <Lock size={18} />
            <span>아직 작성 중이에요</span>
          </div>
        ) : (
          <div className="book-page-answer">{page.answer.body}</div>
        )}
      </div>

      <div className="book-nav">
        <button className="book-nav-btn" disabled={view === 0} onClick={() => setView((v) => v - 1)}>
          <ChevronLeft size={18} />
        </button>
        <span className="book-nav-count">{view + 1} / {pages.length} 페이지</span>
        <button className="book-nav-btn" disabled={view === pages.length - 1} onClick={() => setView((v) => v + 1)}>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

function CoverEditSheet({ config, onChangeNickname, onChangeIllust, onUpload, onClose }) {
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-head">
          <span className="sheet-title">표지 편집</span>
          <button className="topbar-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <label className="sheet-field-label">애칭</label>
        <input
          className="field"
          value={config.nickname}
          onChange={(e) => onChangeNickname(e.target.value)}
          maxLength={10}
        />

        <label className="sheet-field-label" style={{ marginTop: 16 }}>대표 이미지</label>
        <div className="cover-illust-grid">
          {COVER_ILLUSTRATIONS.map((emoji) => (
            <button
              key={emoji}
              className={`cover-illust-btn ${config.coverType === 'illust' && config.coverImage === emoji ? 'cover-illust-btn-active' : ''}`}
              onClick={() => onChangeIllust(emoji)}
            >
              {emoji}
            </button>
          ))}
        </div>

        <label className="btn-secondary sheet-upload-btn">
          사진으로 선택하기
          <input type="file" accept="image/*" onChange={onUpload} style={{ display: 'none' }} />
        </label>
      </div>
    </div>
  )
}
