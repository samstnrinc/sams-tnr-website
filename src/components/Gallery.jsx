import { useState, useEffect, useCallback } from 'react'

const base = import.meta.env.BASE_URL || '/'
const images = [
  `${base}gallery/cat1.jpg`,
  `${base}gallery/cat2.jpg`,
  `${base}gallery/cat3.jpg`,
  `${base}gallery/cat4.jpg`,
  `${base}gallery/cat5.jpg`,
  `${base}gallery/cat6.jpg`,
  `${base}gallery/cat7.jpg`,
  `${base}gallery/cat8.jpg`,
  `${base}gallery/cat9.jpg`,
  `${base}gallery/cat10.avif`,
  `${base}gallery/cat11.png`,
]

export default function Gallery() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [fade, setFade] = useState(true)

  const goTo = useCallback((i) => {
    setFade(false)
    setTimeout(() => {
      setIdx(i)
      setFade(true)
    }, 300)
  }, [])

  const prev = () => goTo(idx === 0 ? images.length - 1 : idx - 1)
  const next = useCallback(() => goTo(idx === images.length - 1 ? 0 : idx + 1), [idx, goTo])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 4000)
    return () => clearInterval(timer)
  }, [paused, next])

  return (
    <section id="gallery" className="py-20 bg-gray-300">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-rust text-center mb-12">Gallery</h2>
        <div
          className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden">
            <img
              src={images[idx]}
              alt={`Gallery image ${idx + 1}`}
              className="w-full h-full object-contain transition-opacity duration-300"
              style={{ opacity: fade ? 1 : 0 }}
            />
          </div>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-rust/80 hover:bg-rust text-white w-10 h-10 rounded-full text-xl"
          >
            ‹
          </button>
          <button
            onClick={() => next()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-rust/80 hover:bg-rust text-white w-10 h-10 rounded-full text-xl"
          >
            ›
          </button>
        </div>
        <div className="flex justify-center items-center gap-2 mt-4">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-3 h-3 rounded-full transition-colors ${i === idx ? 'bg-rust' : 'bg-gray-400'}`}
            />
          ))}
          <button
            onClick={() => setPaused(!paused)}
            className="ml-3 text-sm text-gray-500 hover:text-rust transition-colors"
            title={paused ? 'Play' : 'Pause'}
          >
            {paused ? '▶' : '⏸'}
          </button>
        </div>
      </div>
    </section>
  )
}
