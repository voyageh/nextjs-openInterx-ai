import { useCallback, useEffect, useRef, useState } from 'react'

export const useScrollAnchor = () => {
  const messagesRef = useRef(null)
  const scrollRef = useRef(null)
  const visibilityRef = useRef(null)

  const [isAtBottom, setIsAtBottom] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  const scrollToBottom = useCallback(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({
        block: 'end',
        behavior: 'smooth',
      })
    }
  }, [])

  useEffect(() => {
    if (messagesRef.current) {
      if (isAtBottom && !isVisible) {
        messagesRef.current.scrollIntoView({
          block: 'end',
        })
      }
    }
  }, [isAtBottom, isVisible])

  useEffect(() => {
    const { current } = scrollRef
    const osInstance = current?.osInstance()

    if (!osInstance) {
      return
    }

    const { scrollOffsetElement } = osInstance.elements()
    const handleScroll = (event) => {
      const target = event.target
      const offset = 50
      const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - offset
      setIsAtBottom(isAtBottom)
    }

    scrollOffsetElement.addEventListener('scroll', handleScroll, {
      passive: true,
    })

    return () => {
      scrollOffsetElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    if (visibilityRef.current) {
      let observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          } else {
            setIsVisible(false)
          }
        })
      })

      observer.observe(visibilityRef.current)

      return () => {
        observer.disconnect()
      }
    }
  }, [])

  return {
    messagesRef,
    scrollRef,
    visibilityRef,
    scrollToBottom,
    isAtBottom,
    isVisible,
  }
}
