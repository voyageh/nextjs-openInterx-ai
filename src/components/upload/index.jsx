import { useState, forwardRef, useImperativeHandle } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, TextField, InputAdornment, Fab } from '@mui/material'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import Icon from '@/components/icon'
import VideoPlayer from '@/components/video-player'
import { Upload } from 'antd'
import UploadIcon from '@/assets/images/upload/upload.svg'

import './index.scss'

const { Dragger } = Upload

let urlInfoList = {}

export default forwardRef(function Upload(_, ref) {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('1')
  const [fileList, setFileList] = useState([])
  const [urlList, setUrlList] = useState([])

  const onChange = (_, key) => {
    setTab(key)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        open: handleOpen,
        close: handleClose,
      }
    },
    []
  )

  const uploadProps = {
    showUploadList: false,
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])
      return false
    },
    fileList,
    multiple: true,
  }
  const handleVideoUrl = (e) => {
    if (e.key === 'Enter') {
      const url = e.target.value
      if (!urlList.includes(url)) {
        setUrlList([...urlList, url])
      }
    }
  }

  const getVideoInfo = (info) => {
    urlInfoList[info.url] = { ...info }
  }

  const handleUpload = () => {
    // const formData = new FormData()
    // formData.append('file', fileList[0])
    console.log(urlInfoList)
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} className="upload-dialog" maxWidth="xl">
        <DialogTitle>Upload Video</DialogTitle>
        <DialogContent sx={{ overflow: 'hidden' }}>
          <Tabs value={tab} centered onChange={onChange}>
            <Tab label="Local Upload" value="1" />
            <Tab label="Upload via URL" value="2" />
          </Tabs>

          <div className="upload-content">
            {tab === '1' ? (
              <Dragger {...uploadProps}>
                {fileList.length === 0 ? (
                  <div className="upload-tips-warpper">
                    <div className="upload-tips">Drag the video file here or click to browse the local file</div>
                    <div className="upload-tips-sub">Ultrices odio tempus adipiscing ornare euismod posuere vitae etiam tempor.</div>
                    <div className="upload-tips-sub">Please upload no more than 2 gigabytes of video</div>
                  </div>
                ) : (
                  <OverlayScrollbarsComponent className="preview-list-warpper" defer>
                    <div className="preview-list">
                      {fileList.map((file) => (
                        <div key={file.uid} className="preview-item">
                          <Icon name="FileIcon" />
                          <div className="file-info">
                            <div className="file-info__name">{file.name}</div>
                            <div className="file-info__size">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </OverlayScrollbarsComponent>
                )}
              </Dragger>
            ) : (
              <>
                <TextField
                  fullWidth={true}
                  label="Paste your url link here"
                  variant="outlined"
                  size="small"
                  onKeyDown={handleVideoUrl}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Icon name="UrlIcon" />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
                <span className="upload-tips-sub">
                  If there was an error downloading the video, please try again. Each analysis time varies from 1-10s
                </span>
                <OverlayScrollbarsComponent className="preview-list-warpper" defer>
                  <div className="preview-list url-preview">
                    {urlList.map((url) => (
                      <div key={url} className="preview-item">
                        <VideoPlayer url={url} controls={false} getVideoInfo={getVideoInfo} />
                      </div>
                    ))}
                  </div>
                </OverlayScrollbarsComponent>
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" fullWidth size="small" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" fullWidth size="small" onClick={handleUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      {
        <Fab variant="extended" color="success" sx={{ position: 'fixed', bottom: '5%', left: '40%' }}>
          <UploadIcon /> <span>5 Videos Uploading</span>
        </Fab>
      }
    </>
  )
})
