import { useReducer, useCallback, forwardRef, useImperativeHandle } from 'react'
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
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import AddVideoIcon from '@/assets/images/add-video.svg'
import LinkIcon from '@mui/icons-material/Link'
import VideoFileIcon from '@/assets/images/video-file.svg'
import CloseIcon from '@mui/icons-material/Close'
import UploadIcon from '@mui/icons-material/Upload'
import CancelIcon from '@mui/icons-material/Cancel'
import VideoPlayer from '@/components/video-player'
import pLimit from 'p-limit'
import { upload, uploadUrl } from '@/api/video'
import { enqueueSnackbar } from 'notistack'
import { useQueryClient } from '@tanstack/react-query'

import './style/index.scss'

const limit = pLimit(5)

let urlInfo = {}

const initialState = {
  tab: '1',
  files: [],
  urls: [],
  open: '',
  loading: false,
  uploadList: [],
}

function reducer(state, action) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.payload }
    case 'setUploadList':
      const { index, key, value } = action.payload
      const newArr = [...state.uploadList]
      if (key === 'status') {
        if (value === 'success') {
          newArr[index][key] = value
          newArr[index].message = 'Uploaded'
        } else {
          newArr[index][key] = 'error'
          newArr[index].message = value
        }
      } else {
        newArr[index][key] = value
      }
      return { ...state, uploadList: newArr }

    default:
      return state
  }
}

const UploadVideo = (_, ref) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const onDrop = useCallback((acceptedFiles) => {
    dispatch({ type: 'setState', payload: { files: [...state.files, ...acceptedFiles] } })
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'video/*': [],
    },
    maxSize: 1 * 1024 * 1024 * 1024,
  })

  const queryClient = useQueryClient()

  const changeTab = (_, tab) => {
    dispatch({ type: 'setState', payload: { tab } })
  }

  const handleOpen = (type) => () => {
    dispatch({ type: 'setState', payload: { open: type } })
  }

  const handleClose = () => {
    dispatch({ type: 'setState', payload: { open: '' } })
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        open: handleOpen('upload'),
        close: handleClose,
      }
    },
    []
  )

  const handleVideoUrl = (e) => {
    if (e.key === 'Enter') {
      const url = e.target.value
      if (!state.urls.includes(url)) {
        dispatch({ type: 'setState', payload: { urls: [...state.urls, url] } })
      }
    }
  }

  const delFile = (e, index) => {
    e.stopPropagation()
    const newArr = files.filter((_, i) => i !== index)
    dispatch({ type: 'setState', payload: { files: newArr } })
  }

  const delUpload = (index) => {
    state.uploadList[index]?.abort()
  }

  const getVideoInfo = (info) => {
    urlInfo[info.url] = info
  }

  const handleUploadProgress = (index, value) => {
    dispatch({
      type: 'setUploadList',
      payload: {
        index,
        key: 'progress',
        value,
      },
    })
  }

  const handleUploadStatus = (index, status) => {
    dispatch({
      type: 'setUploadList',
      payload: {
        index,
        key: 'status',
        value: status,
      },
    })
  }

  const handleUploadCancel = (index, fnc) => {
    dispatch({
      type: 'setUploadList',
      payload: {
        index,
        key: 'abort',
        value: fnc,
      },
    })
  }

  const handleUpload = async () => {
    const requestList = []

    state.files.forEach((file, i) => {
      requestList.push(
        limit(() => {
          const formData = new FormData()
          formData.append('file', file)
          return upload(formData, {
            onProgress: (v) => {
              handleUploadProgress(i, v)
            },
            onStatus: (v) => {
              handleUploadStatus(i, v)
            },
            onCancel: (fnc) => {
              handleUploadCancel(i, fnc)
            },
          })
        })
      )
    })

    state.urls.forEach((url) => {
      requestList.push(
        limit(() =>
          uploadUrl({
            ...urlInfoList[url],
          })
        )
      )
    })

    dispatch({ type: 'setState', payload: { ...initialState, loading: true, open: 'uploaded', uploadList: [...state.files] } })
    await Promise.all(requestList)
    dispatch({ type: 'setState', payload: { loading: false } })
    enqueueSnackbar('Upload completed!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    queryClient.invalidateQueries(['video-list'])
  }

  return (
    <>
      <div className="upload-operate-wrapper">
        {state.loading && (
          <Button className="uploading-btn" variant="outlined" color="success" startIcon={<UploadIcon />} onClick={handleOpen('uploaded')}>
            {state.uploadList.length}
          </Button>
        )}

        <Tooltip title="upload" arrow>
          <IconButton size="medium" onClick={handleOpen('upload')}>
            <AddVideoIcon />
          </IconButton>
        </Tooltip>
      </div>

      <Dialog className="upload-dialog" open={state.open === 'upload'} onClose={handleClose} disableRestoreFocus maxWidth={false}>
        <DialogTitle>Upload Video</DialogTitle>

        <DialogContent>
          <div className="upload-content">
            <Tabs value={state.tab} centered={true} onChange={changeTab}>
              <Tab label="Local Upload" value="1" />
              <Tab label="Upload via URL" value="2" />
            </Tabs>
            <div className="upload-content-main">
              {state.tab === '1' ? (
                <div {...getRootProps()} className="drag-upload">
                  <input {...getInputProps()} />
                  {state.files.length === 0 ? (
                    <div className="drag-upload__tips">
                      <div className="tips">Drag the video file here or click to browse the local file</div>
                      <div className="sub-tips">Ultrices odio tempus adipiscing ornare euismod posuere vitae etiam tempor.</div>
                      <div className="sub-tips">Please upload no more than 2 gigabytes of video</div>
                    </div>
                  ) : (
                    <OverlayScrollbarsComponent className="preview-list-warpper" defer>
                      <div className="preview-list">
                        {state.files.map((file, index) => (
                          <div key={index} className="preview-item">
                            <VideoFileIcon className="preview-item__icon" />
                            <div className="preview-item__info">
                              <div className="preview-item__info__name ellipsis-1-lines">{file.name}</div>
                              <div className="preview-item__info__size">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                            </div>
                            <IconButton className="del-btn" aria-label="delete" disableRipple={true}>
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

      <Dialog className="upload-dialog" open={state.open === 'uploaded'} onClose={handleClose} disableRestoreFocus maxWidth={false}>
        <DialogTitle>{state.uploadList.length} Videos Uploading</DialogTitle>
        <DialogContent>
          <OverlayScrollbarsComponent className="uploading-list-scroll" defer>
            <div className="uploading-list">
              {state.uploadList.map((file, index) => (
                <div key={index} className="uploading-list__item">
                  <VideoFileIcon className="uploading-list__item__icon" />
                  <div className="uploading-list__item__info">
                    <div className="file-info">
                      <div className="file-info__name ellipsis-1-lines">{file.name}</div>
                      {file.status ? (
                        <div className={`file-info__status ${file.status}`}>
                          <CancelIcon fontSize="small" color={file.status} />
                          {file.message}
                        </div>
                      ) : (
                        <div className="file-info__size">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                      )}
                    </div>
                    <div className="uploading-list__item__progress">
                      <LinearProgress variant="determinate" color="success" value={file.progress || 0} />
                    </div>
                  </div>
                  <IconButton className="del-btn" aria-label="delete" disableRipple={true}>
                    <CloseIcon fontSize="inherit" onClick={() => delUpload(index)} />
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
