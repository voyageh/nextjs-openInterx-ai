import { useState, useEffect, useRef } from 'react'
import clsx from 'clsx'
import VideoModal from '@/components/video-player/modal'
import { styled } from '@mui/system'
import './style/chat-item.scss'

const Dot = styled('span')(({ theme }) => ({
  display: 'inline-block',
  width: '0.4rem',
  height: '0.4rem',
  margin: '0 2px',
  backgroundColor: theme.palette.text.primary,
  borderRadius: '50%',
  animation: 'dot-blink 1.4s infinite both',

  '&:nth-of-type(1)': {
    animationDelay: '0s',
  },
  '&:nth-of-type(2)': {
    animationDelay: '0.2s',
  },
  '&:nth-of-type(3)': {
    animationDelay: '0.4s',
  },

  '@keyframes dot-blink': {
    '0%': { opacity: 0.2 },
    '20%': { opacity: 1 },
    '100%': { opacity: 0.2 },
  },
}))

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
        <div>
          {data.loading ? (
            <>
              <Dot /> <Dot /> <Dot />
            </>
          ) : (
            message
          )}
        </div>
        {data.role === 'ASSISTANT' &&
          data?.response?.videoKeyFrameList?.map((item) => <img key={item.keyFrame} src={item.keyFrame} onClick={() => openPlayer(item)} />)}
      </div>
      <VideoModal ref={videoRef} />
    </div>
  )
}

export default ChatItem
