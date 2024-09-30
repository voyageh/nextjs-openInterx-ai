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
  const openPlayer = (item) => {
    videoRef.current.open(item.videoUrl, item.timeStamp)
  }

  return (
    <div className={clsx('chat-item', { mine: data.role === 'USER' })}>
      <div className="msg-content">
        <div> {message}</div>
        {data.role === 'ASSISTANT' &&
          data?.response?.videoKeyFrameList?.map((item) => <img key={item.keyFrame} src={item.keyFrame} onClick={() => openPlayer(item)} />)}
      </div>

      <VideoModal ref={videoRef} />
    </div>
  )
}

export default ChatItem
