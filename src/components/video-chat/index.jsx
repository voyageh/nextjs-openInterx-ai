'use client'
import { Resizable } from 're-resizable'
import { useUserStore } from '@/store/user'
import ChatWindow from './chat'
import VideoList from './video-list'

import './style/index.scss'

export default function VideoChat() {
  const { width, changeWidth } = useUserStore()

  const onResizeStop = (_e, _direction, ref, _d) => {
    changeWidth(ref.style.width)
  }

  return (
    <div className="video-chat">
      <div className="video-chat__list hidden-sm-and-down">
        <VideoList />
      </div>
      <Resizable
        className="video-chat__chat"
        handleClasses={{ left: 'resize-box' }}
        defaultSize={{ width }}
        enable={{ top: false, right: false, bottom: false, left: true, topRight: false, bottomRight: false, bottomLeft: false, topLeft: false }}
        onResizeStop={onResizeStop}
      >
        <ChatWindow />
      </Resizable>
    </div>
  )
}
