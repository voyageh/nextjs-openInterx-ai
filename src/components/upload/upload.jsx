import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Tabs, Tab, TextField, InputAdornment, IconButton } from '@mui/material'
import LinkIcon from '@mui/icons-material/Link'
import VideoFileIcon from '@mui/icons-material/VideoFile'
import CloseIcon from '@mui/icons-material/Close'
import { OverlayScrollbarsComponent } from 'overlayscrollbars-react'
import VideoPlayer from '@/components/video-player'

import './style/upload.scss'

export default function UploadVideo() {
  const [tab, setTab] = useState('1')
  const [files, setFiles] = useState([])
  const [urls, setUrls] = useState([])

  const onDrop = useCallback((acceptedFiles) => {
    setFiles([...files, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // accept: {
    //   'video/*': [],
    // },
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
    console.log(info)
  }
  return (
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
            <span className="sub-tips">If there was an error downloading the video, please try again. Each analysis time varies from 1-10s</span>
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
  )
}
