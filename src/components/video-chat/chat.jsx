import { useState } from 'react'
import { IconButton, Input, InputAdornment, List, ListItem, ListItemText } from '@mui/material'
import { useUniversalStore } from '@/store/universal'
import Icon from '@/components/icon'
import ChatItem from './chat-item'
import { send } from '@/api/video'
import './style/chat.scss'

export default function ChatWindow() {
  const [show, setShow] = useState(false)
  const [selecteds, setSelecteds] = useState([])
  const [drag, setDrag] = useUniversalStore((state) => [state.drag, state.setDrag])
  const [msg, setMsg] = useState('')
  const [msgList, setMsgList] = useState([])

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
    setSelecteds([...selecteds, ...list])
  }

  const onDelete = (id) => {
    const newArr = selecteds.filter((item) => item.id !== id)
    setSelecteds([...newArr])
  }

  const onChangeMsg = (e) => {
    setMsg(e.target.value)
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
      const r = await send({
        msg,
        videoNoList: selecteds.map((item) => item.id),
      })

      setMsgList((pre) => {
        console.log(pre)

        return [
          ...pre,
          r,
        ]
      })
    }
  }

  return (
    <div className="chat-wrapper">
      <div className="chat-header">
        <div className="selected-video">
          <div className="selected-video__count" onClick={() => setShow(!show)}>
            <span className="text">{selecteds.length} videos</span> <Icon name="DownIcon" />
          </div>
          <List className={`selected-video__list ${show ? 'show' : ''}`}>
            {selecteds.map((item) => (
              <ListItem
                key={item.id}
                className="selected-video__list__item"
                secondaryAction={
                  <IconButton edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
                    <Icon name={'DeleteIcon'} />
                  </IconButton>
                }
              >
                <div className="cover" style={{ background: `url(${item.videoCoverImgUrl}) lightgray 50% / cover no-repeat` }} />
                <ListItemText className="ellipsis-2-lines" secondary={item.videoName} />
              </ListItem>
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
        {msgList.map((item, index) => (
          <ChatItem key={index} data={item} />
        ))}
      </div>
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
