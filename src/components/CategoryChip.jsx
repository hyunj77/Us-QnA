export default function CategoryChip({ label, active, onClick }) {
  return (
    <button className={`chip ${active ? 'chip-active' : ''}`} onClick={onClick}>
      {label}
    </button>
  )
}
