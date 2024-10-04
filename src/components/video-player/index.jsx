import { useState, useRef, useReducer, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Spin, Slider as Slider2 } from 'antd'
import { Slider } from '@mui/material'
import { LoadingOutlined } from '@ant-design/icons'
import screenfull from 'screenfull'
import Icon from '@/components/icon'

import './style/index.scss'

const initialState = {
  playing: false,
  pip: false,
  duration: 0,
  loaded: 0,
  loadedSeconds: 0,
  played: 0,
  playedSeconds: 0,
  isFull: false,
  playbackRate: 1.0,
  volume: 0.5,
  oldVolume: 0.5,
  muted: false,
  seeking: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'setState':
      return { ...state, ...action.payload }
    case 'setVolume':
      const muted = action.payload > 0 ? false : true
      return { ...state, volume: action.payload, oldVolume: action.payload, muted }
    case 'setMuted':
      const volume = action.payload ? 0 : state.oldVolume
      return { ...state, muted: action.payload, volume }
    default:
      return state
  }
}

export default function VideoPlayer({ url, getVideoInfo, seekTo, controls = true }) {
  const playerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [show, setShow] = useState(false)
  const [isSeeked, setIsSeeked] = useState(false) // 控制是否已跳转

  useEffect(() => {
    const listener = () => {
      if (screenfull.isFullscreen) {
        dispatch({ type: 'setState', payload: { isFull: true } })
      } else {
        dispatch({ type: 'setState', payload: { isFull: false } })
      }
    }
    if (screenfull.isEnabled) {
      screenfull.on('change', listener)
    }
    return () => {
      if (screenfull.isEnabled) {
        screenfull.off('change', listener)
      }
    }
  }, [])

  const onReady = (e) => {
    setLoading(false)
    if (getVideoInfo) {
      const videoName = e?.player?.player?.player?.videoTitle
      const duration = e?.player?.player?.player?.getDuration()
      const type = e?.player?.player.constructor?.name?.toUpperCase()
      getVideoInfo({ videoUrl: url, videoName, duration, type })
    }
    if (!isSeeked && seekTo) {
      playerRef.current.seekTo(seekTo)
      setIsSeeked(true) // 标记为已跳转
    }
  }
  const handlePlayPause = (v) => {
    const playing = v === void 0 ? !state.playing : v
    dispatch({ type: 'setState', payload: { playing } })
  }

  const handleProgress = (data) => {
    dispatch({ type: 'setState', payload: data })
  }

  // 获取视频时长
  const handleDuration = (duration) => {
    dispatch({ type: 'setState', payload: { duration } })
  }

  // 静音
  const handleToggleMuted = () => {
    dispatch({ type: 'setMuted', payload: !state.muted })
  }

  // 调节音量
  const handleVolumeChange = (value) => {
    if (isNaN(value)) {
      return
    }
    dispatch({ type: 'setVolume', payload: value })
  }

  //画中画
  const handlePIP = () => {
    const pip = !state.pip
    dispatch({ type: 'setState', payload: { pip } })
  }

  // 全屏
  const handleFullscreen = () => {
    if (!screenfull.isEnabled) {
      return
    }
    screenfull.toggle(document.querySelector('.video-player'))
  }

  const changeTimeline = (_, value) => {
    dispatch({ type: 'setState', payload: { playedSeconds: value } })
  }
  const jumpTo = (_, value) => {
    playerRef.current.seekTo(value, 'seconds')
  }

  return (
    <div className="video-player">
      <ReactPlayer
        ref={playerRef}
        width="100%"
        height="100%"
        url={url}
        playing={state.playing}
        pip={state.pip}
        playbackRate={state.playbackRate}
        volume={state.volume}
        onReady={onReady}
        onPlay={() => handlePlayPause(true)}
        onPause={() => handlePlayPause(false)}
        onProgress={handleProgress}
        onDuration={handleDuration}
      />
      {controls && (
        <div className="video-player__control-wrapper">
          <div className="timeline-container">
            <Slider
              value={state.playedSeconds}
              className="timeline"
              aria-label="time-indicator"
              size="small"
              min={0}
              step={1}
              max={state.duration}
              onChange={changeTimeline}
              onChangeCommitted={jumpTo}
              sx={(t) => ({
                height: 4,
                '& .MuiSlider-thumb': {
                  width: 8,
                  height: 8,
                  transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
                  '&::before': {
                    boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
                  },
                  '&:hover, &.Mui-focusVisible': {
                    boxShadow: `0px 0px 0px 8px ${'rgb(0 0 0 / 16%)'}`,
                    ...t.applyStyles('dark', {
                      boxShadow: `0px 0px 0px 8px ${'rgb(255 255 255 / 16%)'}`,
                    }),
                  },
                  '&.Mui-active': {
                    width: 20,
                    height: 20,
                  },
                },
                '& .MuiSlider-rail': {
                  opacity: 0.28,
                },
              })}
            />
          </div>

          <div className="video-controls">
            <div className="video-controls__box">
              <div className="video-btn play" onClick={() => handlePlayPause()}>
                {state.playing ? <Icon name="PauseIcon" /> : <Icon name="PlayIcon" />}
              </div>
              <div className="video-time">
                {formatDuration(state.playedSeconds)}
                <span>/</span>
                {formatDuration(state.duration)}
              </div>
              <div className="video-btn">
                <Icon name="DownloadIcon" />
              </div>
              <div className="video-btn" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
                <div onClick={handleToggleMuted}>{!state.muted ? <Icon name="SoundIcon" /> : <Icon name="MuteIcon" />}</div>
                <div className={`volume-slider ${show ? 'show' : ''}`}>
                  <div className="volume-value">{Math.round(state.volume * 100)}</div>
                  <Slider2 vertical min={0} max={1} value={state.volume} step={0.01} tooltip={{ formatter: null }} onChange={handleVolumeChange} />
                </div>
              </div>
              <div className="video-btn" onClick={handlePIP}>
                <Icon name="FloatIcon" />
              </div>
              <div className="video-btn" onClick={handleFullscreen}>
                {state.isFull ? <Icon name="CloseFull" /> : <Icon name="FullScreen" />}
              </div>
            </div>
          </div>
        </div>
      )}
      <Spin className="video-player__loading" indicator={<LoadingOutlined />} spinning={loading} />
    </div>
  )
}

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
})

function formatDuration(time) {
  const seconds = Math.floor(time % 60)
  const minutes = Math.floor(time / 60) % 60
  const hours = Math.floor(time / 3600)
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`
  } else {
    return `${hours}:${leadingZeroFormatter.format(minutes)}:${leadingZeroFormatter.format(seconds)}`
  }
}
