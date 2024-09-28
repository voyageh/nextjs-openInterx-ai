import { useState } from 'react'
import { Empty } from 'antd'
import { IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import Icon from '@/components/icon'
import ChatItem from './chat-item'
import { useUniversalStore } from '@/store/universal'
import './style/chat.scss'

const msg = [
  {
    text: 'How many houses are there in the picture?',
    isMine: true,
  },
  {
    text: 'There are three houses in the picture.',
    isMine: false,
  },
  {
    text: 'Give me a link to the football video',
    isMine: true,
  },
]
export default function ChatWindow() {
  const [show, setShow] = useState(false)
  const [selecteds, setSelecteds] = useState([{}, {}])
  const [drag, setDrag] = useUniversalStore((state) => [state.drag, state.setDrag])

  const onDragLeave = (e) => {
    e.preventDefault()
    const dropZone = e.currentTarget // 获取放置区域
    const relatedTarget = e.relatedTarget // 获取与事件相关的目标
    if (!dropZone.contains(relatedTarget)) {
      setDrag('start')
    }
  }
  const onDragEnter = (e) => {
    e.preventDefault()
    setDrag('enter')
  }

  const onDrop = (e) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    const obj = JSON.parse(data)
    setSelecteds([...selecteds, {}])
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="selected-video">
          <div className="selected-video__count" onClick={() => setShow(!show)}>
            <span className="text">{selecteds.length} videos</span> <Icon name="DownIcon" />
          </div>
          <List className={`selected-video__list ${show ? 'show' : ''}`}>
            {selecteds.map((item, index) => (
              <ListItemButton key={index} className="selected-video__list__item">
                <div className="cover" style={{ background: 'url(2.png) lightgray 50% / cover no-repeat' }} />
                <ListItemText secondary="Jan 9, 2014" />
              </ListItemButton>
            ))}
          </List>
        </div>
        <div className="chat-title">
          <Input defaultValue="Unnamed session" disableUnderline />
        </div>
        <div className="chat-icon">
          <IconButton>
            <Icon name="NewChatIcon" />
          </IconButton>
        </div>
      </div>
      <div className="chat-content">
        {msg.map((item, index) => (
          <ChatItem key={index} {...item} />
        ))}
      </div>
      <div className="chat-footer">
        <Input
          className="chat-input"
          placeholder="Paste video link here to upload quickly"
          disableUnderline
          startAdornment={
            <InputAdornment position="start">
              <Icon name="Attachment" className="attachment-icon" />
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="start">
              <Icon name="SendIcon" className="send-icon" />
            </InputAdornment>
          }
        />
      </div>
      <div className={`chat-drag ${drag}`} onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
        <div className="drag-text">Drag the video here</div>
        <div className="drag-tips">Please drag the video into this area. A new conversation will begin once the drag is complete</div>
      </div>
    </div>
  )
}
