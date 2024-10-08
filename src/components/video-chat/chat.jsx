import { useState } from 'react'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import { IconButton, Input, InputAdornment, List, ListItem, ListItemText, Tooltip, Popover } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import HistoryIcon from '@mui/icons-material/History'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import SendIcon from '@mui/icons-material/Send'
import NewChatIcon from '@/assets/images/new-chat.svg'
import { useUniversalStore } from '@/store/universal'
import { SvgIcon } from '@mui/material'
import ChatItem from './chat-item'
import { send } from '@/api/video'
import { useScrollAnchor } from '@/hooks/use-scroll-anchor'
import { uniqueArray } from '@/utils/array'
import ChatHistory from './chat-history'
import './style/chat.scss'

export default function ChatWindow() {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgList, setMsgList] = useState([])
  const [anchorEl, setAnchorEl] = useState(null)
  const open2 = Boolean(anchorEl)
  
  const [selectedVideos, setSelectedVideos, drag, setDrag] = useUniversalStore((state) => [
    state.selectedVideos,
    state.setSelectedVideos,
    state.drag,
    state.setDrag,
  ])
  const { scrollRef, messagesRef, visibilityRef } = useScrollAnchor()
  const enableSend = msg && !loading

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
  }

  const showList = (e) => {
    setAnchorEl(e.currentTarget)
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
    setSelectedVideos([])
  }

  const sendMsg = async (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      setLoading(true)
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
      setLoading(false)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }


  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="selected-video">
          <div className="selected-video__count" onClick={showList}>
            <span className="text">{selectedVideos.length} videos</span> <KeyboardArrowDownIcon color="inherit" fontSize="small" />
          </div>
        </div>
        <div className="chat-title">
          <Input defaultValue="Unnamed session" disableUnderline />
        </div>

        <div>
          <Tooltip title="history" arrow>
            <IconButton onClick={showList}>
              <HistoryIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="start conversation" arrow>
            <IconButton onClick={newChat}>
              <NewChatIcon />
            </IconButton>
          </Tooltip>
        </div>
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
              <IconButton disableRipple size="medium">
                <AttachFileIcon fontSize="inherit" />
              </IconButton>
            </InputAdornment>
          }
          endAdornment={
            <InputAdornment position="start">
              <IconButton className="send-icon" disableRipple onClick={sendMsg}>
                <SvgIcon>
                  <defs>
                    <linearGradient id="send-color" x1="4" y1="6.49951" x2="36.5" y2="18.9995" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#7F72DB" />
                      <stop offset="1" stopColor="#5DF3FC" />
                    </linearGradient>
                  </defs>
                  <SendIcon sx={{ fill: enableSend ? 'url(#send-color)' : 'currentcolor' }} />
                </SvgIcon>
              </IconButton>
            </InputAdornment>
          }
        />
      </div>

      <div className={`chat-drag ${drag}`} onDrop={onDrop} onDragEnter={onDragEnter} onDragLeave={onDragLeave} onDragOver={onDragOver}>
        <div className="drag-text">Drag the video here</div>
        <div className="drag-tips">Please drag the video into this area. A new conversation will begin once the drag is complete</div>
      </div>

      <Popover
        open={open2}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        sx={{
          marginTop: '0.5rem',
        }}
      >
        <OverlayScrollbarsComponent className="selected-video-thumb-scroll">
          <List className="selected-video-thumb">
            {selectedVideos.map((item) => (
              <ListItem
                key={item.id}
                className="selected-video-thumb__item"
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
        </OverlayScrollbarsComponent>
      </Popover>
    </div>
  )
}
