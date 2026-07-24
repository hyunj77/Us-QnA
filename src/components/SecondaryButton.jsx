export default function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button className={`btn-secondary ${className}`} {...props}>
      {children}
    </button>
  )
}
