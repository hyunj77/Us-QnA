export default function TextField({ className = '', ...props }) {
  return <input className={`field ${className}`} {...props} />
}
