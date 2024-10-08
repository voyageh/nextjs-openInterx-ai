import { useRef } from 'react'
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
            data.response?.message
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
