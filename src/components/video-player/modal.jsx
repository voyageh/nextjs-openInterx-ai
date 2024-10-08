import { useState, forwardRef, useImperativeHandle } from 'react'
import { Dialog, DialogContent } from '@mui/material'
import VideoPlayer from '.'
import './style/modal.scss'

export default forwardRef(function VideoModal(_, ref) {
  const [show, setShow] = useState(false)
  const [url, setUrl] = useState('')
  const [seekTo, setSeekTo] = useState()
  const open = (v, seek) => {
    setShow(true)
    setUrl(v)
    setSeekTo(seek)
  }
  const close = () => setShow(false)

  useImperativeHandle(
    ref,
    () => {
      return {
        open,
        close,
      }
    },
    []
  )

  return (
    <Dialog className="video-modal" open={show} maxWidth={false} onClose={close} disableRestoreFocus>
      <DialogContent>
        <VideoPlayer url={url} seekTo={seekTo} />
      </DialogContent>
    </Dialog>
  )
})
