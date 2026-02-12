import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const navLinks = [
  { id: 'mission', label: 'Mission' },
  { id: 'why-tnr', label: 'Why TNR?' },
  { id: 'services', label: 'Services' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'faq', label: 'FAQ' },
  { id: 'donate', label: 'Donate' },
  { id: 'contact', label: 'Contact' },
]

function scrollToSection(id) {
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const handleClick = (e, id) => {
    e.preventDefault()
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/')
      // Wait for home page to render then scroll
      setTimeout(() => scrollToSection(id), 100)
    } else {
      scrollToSection(id)
    }
  }

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
          {navLinks.map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => handleClick(e, l.id)}
              className="hover:text-gray-brand transition-colors text-sm font-medium"
            >
              {l.label}
            </a>
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
          {navLinks.map(l => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={(e) => handleClick(e, l.id)}
              className="block py-2 hover:text-gray-brand transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
