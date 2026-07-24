import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Lock, PartyPopper, Share2, History, X, Copy } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'
import PrimaryButton from '../components/PrimaryButton'
import AnswerCard from '../components/AnswerCard'
import { findCategory, findQuestion, getQuestionsByCategory } from '../lib/questions'
import { getAnswer } from '../lib/answersStore'
import { getMockPartnerAnswer } from '../data/mock'
import { isLiked, toggleLike } from '../lib/reactionsStore'

function formatDate(iso) {
  return new Date(iso).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function AnswerResult() {
  const { categoryId, questionId } = useParams()
  const navigate = useNavigate()
  const [likeVersion, setLikeVersion] = useState(0)
  const [showHistory, setShowHistory] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [toast, setToast] = useState('')
  const category = findCategory(categoryId)
  const question = findQuestion(questionId)
  const myAnswer = getAnswer(questionId)

  if (!category || !question || !myAnswer) return <div className="page-center"><p>아직 답변이 없어요.</p></div>

  const partnerAnswer = getMockPartnerAnswer(question)
  const bothDone = !!partnerAnswer

  const questions = getQuestionsByCategory(categoryId)
  const idx = questions.findIndex((q) => q.id === questionId)
  const next = questions[idx + 1]
  const history = myAnswer.history || []

  const handleLike = (who) => {
    toggleLike(questionId, who)
    setLikeVersion((v) => v + 1)
  }

  const shareText = `[우리 사용 설명서]\nQ. ${question.question}\nA. ${myAnswer.body}`

  const flashToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: '우리 사용 설명서', text: shareText })
      } catch {
        // 사용자가 공유를 취소한 경우 조용히 무시
      }
      setShowShare(false)
      return
    }
    try {
      await navigator.clipboard.writeText(shareText)
      flashToast('📋 답변이 클립보드에 복사되었어요')
    } catch {
      flashToast('복사에 실패했어요')
    }
    setShowShare(false)
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      flashToast('📋 답변이 클립보드에 복사되었어요')
    } catch {
      flashToast('복사에 실패했어요')
    }
    setShowShare(false)
  }

  return (
    <div className="screen">
      <TopAppBar
        title="답변 결과"
        onBack={() => navigate(`/qna/${categoryId}/${questionId}`)}
        right={<button className="topbar-icon-btn" onClick={() => setShowShare(true)}><Share2 size={19} /></button>}
      />

      <div className="result-banner">
        <PartyPopper size={22} color="var(--main)" />
        <div className="result-banner-title" style={{ marginTop: 6 }}>
          {bothDone ? '둘 다 답변을 완료했어요!' : '내 답변을 저장했어요!'}
        </div>
        <div className="result-banner-sub">
          {bothDone ? '서로의 답변을 확인해보세요!' : '상대방이 답변하면 서로의 답변을 볼 수 있어요.'}
        </div>
      </div>

      <AnswerCard
        key={`mine-${likeVersion}`}
        name="내가 쓴 답변"
        time={new Date(myAnswer.createdAt).toLocaleString('ko-KR', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
        body={myAnswer.body}
        photos={myAnswer.photos || []}
        liked={isLiked(questionId, 'mine')}
        onToggleLike={() => handleLike('mine')}
      />

      {history.length > 0 && (
        <div style={{ padding: '0 20px 4px' }}>
          <button type="button" className="answer-history-toggle" onClick={() => setShowHistory((v) => !v)}>
            <History size={14} /> 수정 기록 {history.length}개 · 이전 답변 {showHistory ? '숨기기' : '보기'}
          </button>
          {showHistory && (
            <div className="answer-history-list">
              {history.map((h, i) => (
                <div key={i} className="answer-history-item">
                  <div className="answer-history-time">{formatDate(h.createdAt)}</div>
                  <div className="answer-history-body">{h.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {bothDone ? (
        <AnswerCard
          key={`theirs-${likeVersion}`}
          name="상대가 쓴 답변"
          time="방금"
          body={partnerAnswer}
          liked={isLiked(questionId, 'theirs')}
          onToggleLike={() => handleLike('theirs')}
        />
      ) : (
        <div className="card answer-card answer-card-locked">
          <Lock size={22} />
          <div className="answer-card-locked-title">상대방이 아직 답변하지 않았어요</div>
          <div className="answer-card-locked-desc">상대방이 답변을 완료하면 바로 확인할 수 있어요</div>
        </div>
      )}

      <div style={{ padding: 20, marginTop: 'auto' }}>
        <PrimaryButton
          onClick={() => next ? navigate(`/qna/${categoryId}/${next.id}`) : navigate(`/qna/${categoryId}`)}
        >
          다음 질문 보기 →
        </PrimaryButton>
      </div>

      {toast && <div className="toast">{toast}</div>}

      {showShare && (
        <div className="sheet-overlay" onClick={() => setShowShare(false)}>
          <div className="sheet-card" onClick={(e) => e.stopPropagation()}>
            <div className="sheet-head">
              <span className="sheet-title">공유하기</span>
              <button className="topbar-icon-btn" onClick={() => setShowShare(false)}><X size={18} /></button>
            </div>
            <button type="button" className="btn-secondary share-sheet-btn" onClick={handleShare}>
              <Share2 size={16} /> {navigator.share ? '공유하기' : '텍스트 공유'}
            </button>
            <button type="button" className="btn-secondary share-sheet-btn" onClick={handleCopy}>
              <Copy size={16} /> 텍스트 복사하기
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
