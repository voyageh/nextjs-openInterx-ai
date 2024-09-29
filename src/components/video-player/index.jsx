import { useState, useRef, useReducer, useEffect } from 'react'
import ReactPlayer from 'react-player'
import { Spin, Slider } from 'antd'
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
}

function reducer(state, action) {
  switch (action.type) {
    case 'setPlaying':
      return { ...state, playing: action.payload }
    case 'setDuration':
      return { ...state, duration: action.payload }
    case 'setProgress':
      return { ...state, ...action.payload }
    case 'setFull':
      return { ...state, isFull: action.payload }
    case 'setPip':
      return { ...state, pip: action.payload }
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

export default function VideoPlayer({ url, getVideoInfo, controls = true }) {
  const playerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const listener = () => {
      if (screenfull.isFullscreen) {
        dispatch({ type: 'setFull', payload: true })
      } else {
        dispatch({ type: 'setFull', payload: false })
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
      getVideoInfo({ url, videoName, duration, type })
    }
  }
  const handlePlayPause = (v) => {
    dispatch({ type: 'setPlaying', payload: v === void 0 ? !state.playing : v })
  }

  const handleProgress = (data) => {
    dispatch({ type: 'setProgress', payload: data })
  }

  const handleDuration = (duration) => {
    dispatch({ type: 'setDuration', payload: duration })
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
    dispatch({ type: 'setPip', payload: !state.pip })
  }

  // 全屏
  const handleFullscreen = () => {
    if (!screenfull.isEnabled) {
      return
    }
    screenfull.toggle(document.querySelector('.video-player'))
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
          <div className="timeline-container" style={{ '--preview-position': 0, '--progress-position': state.played }}>
            <div className="timeline">
              <img className="preview-img" />
              <div className="thumb-indicator"></div>
            </div>
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
                  <Slider vertical min={0} max={1} value={state.volume} step={0.01} tooltip={{ formatter: null }} onChange={handleVolumeChange} />
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
