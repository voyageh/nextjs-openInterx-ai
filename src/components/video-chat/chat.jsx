import { useState } from 'react'
import { IconButton, Input, InputAdornment, List, ListItem, ListItemText, Tooltip } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { useUniversalStore } from '@/store/universal'
import Icon from '@/components/icon'
import ChatItem from './chat-item'
import { send } from '@/api/video'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import { uniqueArray } from '@/utils/array'
import './style/chat.scss'

export default function ChatWindow() {
  const [show, setShow] = useState(false)
  const [selectedVideos, setSelectedVideos, drag, setDrag] = useUniversalStore((state) => [
    state.selectedVideos,
    state.setSelectedVideos,
    state.drag,
    state.setDrag,
  ])
  const [msg, setMsg] = useState('')
  const [msgList, setMsgList] = useState([])
  const { scrollRef, messagesRef, visibilityRef } = useScrollAnchor()

  const onDragEnter = (e) => {
    e.preventDefault()
    setDrag('enter')
  }

  const onDragOver = (e) => {
    e.preventDefault()
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    const dropZone = e.currentTarget // 获取放置区域
    const relatedTarget = e.relatedTarget // 获取与事件相关的目标
    if (!dropZone.contains(relatedTarget)) {
      setDrag('start')
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    const data = e.dataTransfer.getData('application/json')
    const list = JSON.parse(data)
    const newList = uniqueArray([...selectedVideos, ...list], 'id')
    setSelectedVideos(newList)
    setShow(true)
  }

  const showList = () => {
    setShow(!show)
  }

  const onDelete = (id) => {
    const newArr = selectedVideos.filter((item) => item.id !== id)
    setSelectedVideos([...newArr])
  }

  const onChangeMsg = (e) => {
    setMsg(e.target.value)
  }

  const newChat = () => {
    setMsgList([])
  }

  const sendMsg = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      setMsgList([
        ...msgList,
        {
          role: 'USER',
          response: {
            message: msg,
          },
        },
      ])
      setMsg('')
      setMsgList((pre) => {
        return [
          ...pre,
          {
            loading: true,
          },
        ]
      })
      const r = await send({
        msg,
        videoNoList: selectedVideos.map((item) => item.id),
      })

      setMsgList((pre) => {
        const newMsgList = pre.slice(0, -1)
        return [...newMsgList, r]
      })
    }
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="selected-video">
          <div className="selected-video__count" onClick={showList}>
            <span className="text">{selectedVideos.length} videos</span> <KeyboardArrowDownIcon color="inherit" fontSize="small" />
          </div>
          <List className={`selected-video__list ${show ? 'show' : ''}`}>
            {selectedVideos.map((item) => (
              <ListItem
                key={item.id}
                className="selected-video__list__item"
                secondaryAction={
                  <IconButton size="small" edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                    <CloseIcon fontSize="inherit" color="inherit" />
                  </IconButton>
                }
              >
                <div className="cover" style={{ background: `url(${item.videoCoverImgUrl}) var(--bg-color-0) 50% / cover no-repeat` }} />
                <ListItemText className="ellipsis-2-lines" secondary={item.videoName} />
              </ListItem>
            ))}
          </List>
        </div>
        <div className="chat-title">
          <Input defaultValue="Unnamed session" disableUnderline />
        </div>
        <Tooltip title="start conversation" arrow>
          <IconButton onClick={newChat}>
            <Icon name="NewChatIcon" />
          </IconButton>
        </Tooltip>
      </div>
      <OverlayScrollbarsComponent ref={scrollRef} className="chat-content" defer options={{ scrollbars: { autoHide: 'leave' } }}>
        <div ref={messagesRef}>
          {msgList.map((item, index) => (
            <ChatItem key={index} data={item} />
          ))}
          <div className="visibility-line" ref={visibilityRef} />
        </div>
      </OverlayScrollbarsComponent>

      <div className="chat-footer">
        <Input
          value={msg}
          onChange={onChangeMsg}
          onKeyDown={sendMsg}
          className="chat-input"
          placeholder="Paste video link here to upload quickly"
          disableUnderline
          startAdornment={
            <InputAdornment position="start">
              <IconButton disableRipple>
                <Icon name="Attachment" className="attachment-icon" />
              </IconButton>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="start">
              <IconButton disableRipple onClick={sendMsg}>
                <Icon name="SendIcon" className="send-icon" />
              </IconButton>
            </InputAdornment>
          }
        />
      </div>
      <div className={`chat-drag ${drag}`} onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver}>
        <div className="drag-text">Drag the video here</div>
        <div className="drag-tips">Please drag the video into this area. A new conversation will begin once the drag is complete</div>
      </div>
    </div>
  )
}
