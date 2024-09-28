import clsx from 'clsx'
import './style/chat-item.scss'

const ChatItem = ({ isMine, text }) => {
  return (
    <div className={clsx('chat-item', { mine: isMine })}>
      <div className="msg-content">{text}</div>
    </div>
  )
}

export default ChatItem
