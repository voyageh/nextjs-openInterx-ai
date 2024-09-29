import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import VideoModal from '@/components/video-player/modal'
import './style/chat-item.scss'

const ChatItem = ({ data }) => {
  const [message, setMessage] = useState('') // 当前显示的消息

  useEffect(() => {
    if (data.role === 'USER') {
      setMessage(data.response?.message || '')
      return
    }

    // 如果需要逐字显示
    const messageText = data.response?.message || ''
    setMessage(messageText.charAt(0))
    let index = 1

    const intervalId = setInterval(() => {
      if (index < messageText.length) {
        setMessage((prev) => prev + messageText.charAt(index))
        index++
      } else {
        clearInterval(intervalId) // 消息输出完成后清除定时器
      }
    }, 50)

    return () => clearInterval(intervalId) // 组件卸载时清除定时器
  }, [data])

  const videoRef = useRef(null)
  const openPlayer = () => {
    videoRef.current.open('https://www.youtube.com/watch?v=rrtoHpJA1nQ')
  }

  return (
    <div className={clsx('chat-item', { mine: data.role === 'USER' })}>
      <div className="msg-content">
        <div> {message}</div>
        {data.role === 'USER2222' && (
          <img
            src="https://images.stockcake.com/public/0/1/b/01b9e21e-c60f-4f91-abe8-482ecb30045d/family-picnic-day-stockcake.jpg"
            onClick={openPlayer}
          />
        )}
      </div>

      <VideoModal ref={videoRef} />
    </div>
  )
}

export default ChatItem
