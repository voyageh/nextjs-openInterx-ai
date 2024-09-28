import { forwardRef } from 'react'
import clsx from 'clsx'
import Logo from '@/assets/images/root/logo.svg'
import MyVideo from '@/assets/images/root/my-video.svg'
import SampleVideo from '@/assets/images/root/sample-video.svg'
import LightIcon from '@/assets/images/root/light.svg'
import DarkIcon from '@/assets/images/root/dark.svg'

// video icon
import SearchIcon from '@/assets/images/video/search.svg'
import AddVideo from '@/assets/images/video/add-video.svg'
import DeleteIcon from '@/assets/images/video/delete.svg'
import ArrowDown from '@/assets/images/video/arrow-down.svg'
import ArrowUp from '@/assets/images/video/arrow-up.svg'
import ListIcon from '@/assets/images/video/list.svg'
import CardIcon from '@/assets/images/video/card.svg'
import DownloadIcon from '@/assets/images/video/download.svg'
import RightIcon from '@/assets/images/video/right.svg'
import LeftIcon from '@/assets/images/video/left.svg'
import CloseIcon from '@/assets/images/video/close.svg'

//player
import PlayIcon from '@/assets/images/player/play.svg'
import PauseIcon from '@/assets/images/player/pause.svg'
import SoundIcon from '@/assets/images/player/sound.svg'
import MuteIcon from '@/assets/images/player/mute.svg'
import FloatIcon from '@/assets/images/player/float.svg'
import FullScreen from '@/assets/images/player/fullscreen.svg'
import CloseFull from '@/assets/images/player/close-full.svg'

//chat
import DownIcon from '@/assets/images/chat/down.svg'
import UpIcon from '@/assets/images/chat/up.svg'
import NewChatIcon from '@/assets/images/chat/new-chat.svg'
import SendIcon from '@/assets/images/chat/send.svg'
import Attachment from '@/assets/images/chat/attachment.svg'

// upload
import UrlIcon from '@/assets/images/upload/url.svg'
import FileIcon from '@/assets/images/upload/file.svg'

import './index.scss'

const icons = {
  //root
  Logo,
  MyVideo,
  SampleVideo,
  light: DarkIcon,
  dark: LightIcon,

  //video
  SearchIcon,
  AddVideo,
  DeleteIcon,
  ArrowDown,
  ArrowUp,
  ListIcon,
  CardIcon,
  DownloadIcon,
  RightIcon,
  LeftIcon,
  CloseIcon,

  //player
  PlayIcon,
  PauseIcon,
  SoundIcon,
  MuteIcon,
  FloatIcon,
  FullScreen,
  CloseFull,

  //chat
  DownIcon,
  UpIcon,
  NewChatIcon,
  SendIcon,
  Attachment,

  // upload
  UrlIcon,
  FileIcon,
}

export const Icon = forwardRef(({ name, className, ...props }, ref) => {
  const Icon = icons[name]
  return (
    <span ref={ref} className={clsx('icon-wrapper', className)} {...props}>
      <Icon />
    </span>
  )
})
export default Icon
