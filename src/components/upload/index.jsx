import { useReducer, forwardRef, useImperativeHandle } from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, TabPanel, TextField, InputAdornment, Fab } from '@mui/material'
import UploadVideo from './upload'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import Icon from '@/components/icon'
import VideoPlayer from '@/components/video-player'
import UploadIcon from '@/assets/images/upload/upload.svg'
import { upload, uploadUrl } from '@/api/video'
import { chunkArray } from '@/utils/array'
import pLimit from 'p-limit'

import './index.scss'

const limit = pLimit(5)

let urlInfoList = {}

const initData = {
  open: false,
  tab: '1',
  fileList: [],
  urlList: [],
  loading: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'init':
      return { ...initData }
    case 'setOpen':
      return { ...state, open: action.payload }
    case 'setTab':
      return { ...state, tab: action.payload }
    case 'setFile':
      return { ...state, fileList: [...state.fileList, action.payload] }
    case 'setFileList':
      return { ...state, fileList: action.payload }
    case 'setUrlList':
      return { ...state, urlList: action.payload }
    case 'setLoading':
      return { ...state, loading: action.payload }
    default:
      return state
  }
}

export default forwardRef(function Upload(_, ref) {
  const [state, dispatch] = useReducer(reducer, initData)

  const onChange = (_, key) => {
    dispatch({
      type: 'setTab',
      payload: key,
    })
  }
  const handleClose = () => {
    dispatch({
      type: 'setOpen',
      payload: false,
    })
  }

  const handleOpen = () => {
    dispatch({
      type: 'setOpen',
      payload: true,
    })
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

  const delFile = (e, index) => {
    e.stopPropagation()
    const newFileList = state.fileList.slice()
    newFileList.splice(index, 1)
    dispatch({ type: 'setFileList', payload: newFileList })
  }

  const uploadProps = {
    showUploadList: false,
    beforeUpload: (file) => {
      dispatch({ type: 'setFile', payload: file })
      return false
    },

    fileList: state.fileList,
    multiple: true,
  }
  const handleVideoUrl = (e) => {
    if (e.key === 'Enter') {
      const url = e.target.value
      if (!state.urlList.includes(url)) {
        dispatch({ type: 'setUrlList', payload: [...state.urlList, url] })
      }
    }
  }

  const getVideoInfo = (info) => {
    urlInfoList[info.url] = { ...info }
  }

  const confirmUpload = () => {
    dispatch({ type: 'setLoading', payload: true })
    handleClose()
    handleUpload()
  }

  const handleUpload = async () => {
    // const requestList = []
    // state.urlList.forEach((url) => {
    //   requestList.push(
    //     limit(() =>
    //     )
    //   )
    // })
    // if (state.urlList.length > 0) {
    //   await uploadUrl(
    //     state.urlList.map((url) => {
    //       const info = urlInfoList[url]
    //       return {
    //         videoName: info.videoName,
    //         videoUrl: url,
    //         duration: info.duration,
    //         type: info.type,
    //       }
    //     })
    //   )
    // }
    // const requestList = state.fileList.map((file) => {
    //   const formData = new FormData()
    //   formData.append('file', file)
    //   return upload(formData)
    // })
    // const newList = chunkArray(requestList, 5)
    // const uploadChunks = async () => {
    //   for (const chunk of newList) {
    //     await Promise.all(chunk) // 同时发送当前块的请求
    //   }
    // }
    // await uploadChunks()
    // dispatch({ type: 'init' })
  }

  return (
    <>
      <Dialog open={state.open} onClose={handleClose} disableRestoreFocus className="upload-dialog" maxWidth="xl">
        <DialogTitle>Upload Video</DialogTitle>
        <DialogContent sx={{ overflow: 'hidden' }}>
          <UploadVideo />

          {/* <Upload /> */}

          {/* <div className="upload-content">
            {state.tab === '1' ? (
              <Dragger {...uploadProps}>
                {state.fileList.length === 0 ? (
                  <div className="upload-tips-warpper">
                    <div className="upload-tips">Drag the video file here or click to browse the local file</div>
                    <div className="upload-tips-sub">Ultrices odio tempus adipiscing ornare euismod posuere vitae etiam tempor.</div>
                    <div className="upload-tips-sub">Please upload no more than 2 gigabytes of video</div>
                  </div>
                ) : (
                  <OverlayScrollbarsComponent className="preview-list-warpper" defer>
                    <div className="preview-list">
                      {state.fileList.map((file, index) => (
                        <div key={file.uid} className="preview-item">
                          <Icon name="FileIcon" />
                          <div className="file-info">
                            <div className="ellipsis-2-lines file-info__name ">{file.name}</div>
                            <div className="file-info__size">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                          </div>
                          <Icon name="DeleteIcon" className="del-icon" onClick={(e) => delFile(e, index)} />
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
                    {state.urlList?.map((url) => (
                      <div key={url} className="preview-item">
                        <VideoPlayer url={url} controls={false} getVideoInfo={getVideoInfo} />
                      </div>
                    ))}
                  </div>
                </OverlayScrollbarsComponent>
              </>
            )}
          </div> */}
        </DialogContent>

        <DialogActions>
          <Button color="inherit" fullWidth size="small" variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="contained" fullWidth size="small" onClick={confirmUpload}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
      {state.loading && (
        <Fab variant="extended" color="success" sx={{ position: 'fixed', bottom: '5%', left: '40%' }}>
          <UploadIcon /> <span>{state.fileList.length} Videos Uploading</span>
        </Fab>
      )}
    </>
  )
})
