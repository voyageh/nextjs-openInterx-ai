import { useState, useCallback, forwardRef, useImperativeHandle } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  IconButton,
  Fab,
  LinearProgress,
  Tooltip,
} from '@mui/material'
import AddVideoIcon from '@/assets/images/add-video.svg'
import LinkIcon from '@mui/icons-material/Link'
import VideoFileIcon from '@/assets/images/video-file.svg'
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

  const [uploadList, setUploadList] = useState([])

  const [open2, setOpen2] = useState(false)

  const queryClient = useQueryClient()

  const handleClose = () => {
    setOpen(false)
  }

  const handleClose2 = () => {
    setOpen2(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleOpen2 = () => {
    setOpen2(true)
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
      // 'video/*': [],
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

  const handleUploadProgress = (i, v) => {
    setUploadList((prev) => {
      const newArr = [...prev]
      newArr[i].progress = v
      return newArr
    })
  }

  const handleUpload = async () => {
    const requestList = []

    files.forEach((file, i) => {
      requestList.push(
        limit(() => {
          const formData = new FormData()
          formData.append('file', file)
          return upload(formData, (v) => handleUploadProgress(i, v))
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
    setUploadList([...files])
    setFiles([])
    setUrls([])
    await Promise.all(requestList)
    setLoading(false)
    enqueueSnackbar('Upload successfully!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    queryClient.invalidateQueries(['video-list'])
  }

  return (
    <>
      <div className="upload-operate-wrapper">
        {loading && (
          <Button className="uploading-btn" variant="outlined" color="success" startIcon={<UploadIcon />} onClick={handleOpen2}>
            {uploadList.length}
          </Button>
        )}

        <Tooltip title="upload" arrow>
          <IconButton size="medium" onClick={handleOpen}>
            <AddVideoIcon />
          </IconButton>
        </Tooltip>
      </div>

      <Dialog className="upload-dialog" open={open} onClose={handleClose} disableRestoreFocus maxWidth={false}>
        <DialogTitle>Upload Video</DialogTitle>

        <DialogContent>
          <div className="upload-content">
            <Tabs value={tab} centered={true} onChange={onTabChange}>
              <Tab label="Local Upload" value="1" />
              <Tab label="Upload via URL" value="2" />
            </Tabs>
            <div className="upload-content-main">
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
                            <VideoFileIcon className="preview-item__icon" />
                            <div className="preview-item__info">
                              <div className="preview-item__info__name ellipsis-1-lines">{file.name}</div>
                              <div className="preview-item__info__size">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
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

      <Dialog className="upload-dialog" open={open2} onClose={handleClose2} disableRestoreFocus maxWidth={false}>
        <DialogTitle>{uploadList.length} Videos Uploading</DialogTitle>
        <DialogContent>
          <OverlayScrollbarsComponent className="uploading-list-scroll" defer>
            <div className="uploading-list">
              {uploadList.map((file, index) => (
                <div key={index} className="uploading-list__item">
                  <VideoFileIcon className="uploading-list__item__icon" />
                  <div className="uploading-list__item__info">
                    <div className="file-info">
                      <div className="file-info__name ellipsis-1-lines">{file.name}</div>
                      <div className="file-info__size">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                    </div>
                    <div className="uploading-list__item__progress">
                      <LinearProgress variant="determinate" color="success" value={file.progress} />
                    </div>
                  </div>
                  <IconButton className="del-btn" aria-label="delete" size="small" disableRipple={true}>
                    <CloseIcon fontSize="inherit" onClick={(e) => delFile(e, index)} />
                  </IconButton>
                </div>
              ))}
            </div>
          </OverlayScrollbarsComponent>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" fullWidth variant="outlined" onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default forwardRef(UploadVideo)
