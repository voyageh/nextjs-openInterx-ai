import { useState, forwardRef, useImperativeHandle } from 'react'
import { Modal } from 'antd'
import VideoPlayer from '.'
import './style/modal.scss'

export default forwardRef(function VideoModal(_, ref) {
  const [show, setShow] = useState(false)
  const [url, setUrl] = useState('')
  const open = (v) => {
    setShow(true)
    setUrl(v)
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
    <Modal className="video-modal" width="60%" footer={null} centered closable={false} open={show} onCancel={close}>
      <div style={{ width: '100%', height: '34vw' }}>
        <VideoPlayer url={url} />
      </div>
    </Modal>
  )
})
