import { useNavigate } from 'react-router-dom'
import { Bell, Lock, Unlink, Download, MessageCircle, ChevronRight } from 'lucide-react'
import TopAppBar from '../components/TopAppBar'

const ROWS = [
  { Icon: Bell, label: '알림 설정' },
  { Icon: Lock, label: '비밀번호 변경' },
  { Icon: Unlink, label: '커플 연결 해제' },
  { Icon: Download, label: '데이터 백업' },
  { Icon: MessageCircle, label: '문의하기' },
]

export default function Settings() {
  const navigate = useNavigate()
  return (
    <div className="screen">
      <TopAppBar title="설정" onBack={() => navigate('/my')} />
      <div className="card" style={{ margin: '4px 20px', width: 'auto', padding: 0, overflow: 'hidden' }}>
        {ROWS.map(({ Icon, label }) => (
          <button key={label} className="menu-row" style={{ width: '100%', background: 'none', textAlign: 'left' }}>
            <Icon size={18} color="var(--main)" />
            <span className="menu-row-label">{label}</span>
            <ChevronRight size={16} className="menu-row-chevron" />
          </button>
        ))}
      </div>
    </div>
  )
}
