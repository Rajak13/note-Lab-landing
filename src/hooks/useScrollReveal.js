import { useEffect, useRef, useState } from 'react'

/**
 * Observes an element and returns whether it has entered the viewport.
 * Once visible, the observer disconnects — elements never re-hide on scroll back.
 *
 * @param {{ threshold?: number, rootMargin?: string }} options
 * @returns {{ ref: React.RefObject, isVisible: boolean }}
 */
export function useScrollReveal({
  threshold = 0.15,
  rootMargin = '-50px',
} = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // If the browser honours prefers-reduced-motion, reveal immediately
    // so the element is never invisible (matches Hero.module.css behaviour).
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (prefersReduced) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // fire once only
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible }
}
