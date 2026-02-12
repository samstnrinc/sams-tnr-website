import { useState, useEffect, useCallback, useRef } from 'react'

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
  // Two-layer approach: layer A and layer B alternate who's on top
  const [layerA, setLayerA] = useState(0)
  const [layerB, setLayerB] = useState(0)
  const [showA, setShowA] = useState(true) // true = A is visible on top
  const [paused, setPaused] = useState(false)
  const transitioning = useRef(false)

  const activeIdx = showA ? layerA : layerB

  const goTo = useCallback((i) => {
    if (i === activeIdx || transitioning.current) return
    transitioning.current = true
    // Load the new image into the hidden layer, then fade it in
    if (showA) {
      setLayerB(i)
      // Small delay to ensure the hidden layer has the new src before fading
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowA(false)
          setTimeout(() => { transitioning.current = false }, 700)
        })
      })
    } else {
      setLayerA(i)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setShowA(true)
          setTimeout(() => { transitioning.current = false }, 700)
        })
      })
    }
  }, [activeIdx, showA])

  const prev = () => goTo(activeIdx === 0 ? images.length - 1 : activeIdx - 1)
  const next = useCallback(() => goTo(activeIdx === images.length - 1 ? 0 : activeIdx + 1), [activeIdx, goTo])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 5000)
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
          <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden relative">
            {/* Layer A */}
            <img
              src={images[layerA]}
              alt={`Gallery image ${layerA + 1}`}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out"
              style={{ opacity: showA ? 1 : 0, zIndex: showA ? 2 : 1 }}
            />
            {/* Layer B */}
            <img
              src={images[layerB]}
              alt={`Gallery image ${layerB + 1}`}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-700 ease-in-out"
              style={{ opacity: showA ? 0 : 1, zIndex: showA ? 1 : 2 }}
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
              className={`w-3 h-3 rounded-full transition-colors ${i === activeIdx ? 'bg-rust' : 'bg-gray-400'}`}
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
