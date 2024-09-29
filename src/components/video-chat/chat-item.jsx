import { useState, useEffect } from 'react'
import clsx from 'clsx'
import './style/chat-item.scss'

const ChatItem = ({ data }) => {
  const [message, setMessage] = useState('') // 当前显示的消息

  useEffect(() => {
    if (data.role === 'USER') {
      setMessage(data.response?.message || '')
      return
    }

    // 如果需要逐字显示
    let index = 0
    const messageText = data.response?.message || ''

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

  return (
    <div className={clsx('chat-item', { mine: data.role === 'USER' })}>
      <div className="msg-content">{message}</div>
    </div>
  )
}

export default ChatItem
