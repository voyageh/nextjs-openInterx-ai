import { useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useDropzone } from 'react-dropzone'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, TextField, InputAdornment, IconButton, Fab } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import VideoFileIcon from '@mui/icons-material/VideoFile'
import CloseIcon from '@mui/icons-material/Close'
import UploadIcon from '@mui/icons-material/Upload'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import VideoPlayer from '@/components/video-player'
import pLimit from 'p-limit'
import { upload, uploadUrl } from '@/api/video'
import { enqueueSnackbar } from 'notistack'
import { useQueryClient } from '@tanstack/react-query'

import './style/index.scss'

const limit = pLimit(5)

let urlInfo = {}
const UploadVideo = (_, ref) => {
  const [tab, setTab] = useState('1')
  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const queryClient = useQueryClient()

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

  const onDrop = useCallback((acceptedFiles) => {
    setFiles([...files, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'video/*': [],
    },
    maxSize: 1 * 1024 * 1024 * 1024,
  })

  const onTabChange = (_, key) => {
    setTab(key)
  }

  const handleVideoUrl = (e) => {
    if (e.key === 'Enter') {
      const url = e.target.value
      if (!files.includes(url)) {
        setUrls([...urls, url])
      }
    }
  }

  const delFile = (e, index) => {
    e.stopPropagation()
    setFiles(files.filter((_, i) => i !== index))
  }

  const getVideoInfo = (info) => {
    urlInfo[info.url] = info
  }

  const handleUpload = async () => {
    const requestList = []

    files.forEach((file) => {
      requestList.push(
        limit(() => {
          const formData = new FormData()
          formData.append('file', file)
          return upload(formData)
        })
      )
    })

    urls.forEach((url) => {
      requestList.push(
        limit(() =>
          uploadUrl({
            ...urlInfoList[url],
          })
        )
      )
    })

    setOpen(false)
    setLoading(true)
    await Promise.all(requestList)
    enqueueSnackbar('Upload successfully!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    queryClient.invalidateQueries(['video-list'])
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} disableRestoreFocus className="upload-dialog" maxWidth="xl">
        <DialogTitle>Upload Video</DialogTitle>
        <DialogContent sx={{ overflow: 'hidden' }}>
          <div className="upload-video">
            <Tabs value={tab} centered={true} onChange={onTabChange}>
              <Tab label="Local Upload" value="1" />
              <Tab label="Upload via URL" value="2" />
            </Tabs>
            <div className="upload-video__content">
              {tab === '1' ? (
                <div {...getRootProps()} className="drag-upload">
                  <input {...getInputProps()} />
                  {files.length === 0 ? (
                    <div className="drag-upload__tips">
                      <div className="tips">Drag the video file here or click to browse the local file</div>
                      <div className="sub-tips">Ultrices odio tempus adipiscing ornare euismod posuere vitae etiam tempor.</div>
                      <div className="sub-tips">Please upload no more than 2 gigabytes of video</div>
                    </div>
                  ) : (
                    <OverlayScrollbarsComponent className="preview-list-warpper" defer>
                      <div className="preview-list">
                        {files.map((file, index) => (
                          <div key={index} className="preview-item">
                            <VideoFileIcon color="success" sx={{ fontSize: '2.6rem', color: '#BFBAFF' }} />
                            <div className="file-info">
                              <div className="ellipsis-2-lines file-info__name ">{file.name}</div>
                              <div className="file-info__size">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                            </div>
                            <IconButton className="del-btn" aria-label="delete" size="small" disableRipple={true}>
                              <CloseIcon fontSize="inherit" onClick={(e) => delFile(e, index)} />
                            </IconButton>
                          </div>
                        ))}
                      </div>
                    </OverlayScrollbarsComponent>
                  )}
                </div>
              ) : (
                <div className="url-upload">
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
                            <LinkIcon />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <span className="sub-tips">
                    If there was an error downloading the video, please try again. Each analysis time varies from 1-10s
                  </span>
                  <OverlayScrollbarsComponent className="preview-list-warpper" defer>
                    <div className="preview-list url-preview">
                      {urls?.map((url) => (
                        <div key={url} className="preview-item">
                          <VideoPlayer url={url} controls={false} getVideoInfo={getVideoInfo} />
                        </div>
                      ))}
                    </div>
                  </OverlayScrollbarsComponent>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" fullWidth size="small" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" fullWidth size="small" onClick={handleUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      {loading && (
        <Fab variant="extended" color="success" sx={{ position: 'fixed', bottom: '5%', left: '40%' }}>
          <UploadIcon color="inherit" /> <span>Videos Uploading</span>
        </Fab>
      )}
    </>
  )
}

export default forwardRef(UploadVideo)
