import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const hashLinks = [
  { href: '#mission', label: 'Mission' },
  { href: '#why-tnr', label: 'Why TNR?' },
  { href: '#services', label: 'Services' },
  { href: '#gallery', label: 'Gallery' },
  { href: '#faq', label: 'FAQ' },
  { href: '#donate', label: 'Donate' },
  { href: '#contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  // Close menu on route change
  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <nav className="fixed top-0 left-0 right-0 bg-rust text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="https://i.postimg.cc/QMwhWTWV/Logo-tipped-ear-transparent-with-text.png"
            alt="Sam's TNR Logo"
            className="h-10"
          />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-4 items-center">
          {hashLinks.map(l => (
            isHome ? (
              <a key={l.href} href={l.href} className="hover:text-gray-brand transition-colors text-sm font-medium">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} to={`/${l.href}`} className="hover:text-gray-brand transition-colors text-sm font-medium">
                {l.label}
              </Link>
            )
          ))}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-2xl" aria-label="Menu">
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-rust-dark px-4 pb-4 max-h-[80vh] overflow-y-auto">
          {hashLinks.map(l => (
            isHome ? (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-gray-brand transition-colors"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={`/${l.href}`}
                onClick={() => setOpen(false)}
                className="block py-2 hover:text-gray-brand transition-colors"
              >
                {l.label}
              </Link>
            )
          ))}
        </div>
      )}
    </nav>
  )
}
