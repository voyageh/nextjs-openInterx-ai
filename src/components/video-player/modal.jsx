import { useState, forwardRef, useImperativeHandle } from 'react'
import { Modal } from 'antd'
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
    <Modal className="video-modal" width="60%" footer={null} centered={true} closable={false} open={show} onCancel={close} destroyOnClose={true}>
      <div style={{ width: '100%', height: '34vw' }}>
        <VideoPlayer url={url} seekTo={seekTo} />
      </div>
    </Modal>
  )
})
