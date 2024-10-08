'use client'

import { useRef, useReducer, useCallback } from 'react'
import {
  Autocomplete,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Tooltip,
  Skeleton,
  Grid2 as Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  Popover,
} from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import SearchIcon from '@mui/icons-material/Search'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import GridViewIcon from '@mui/icons-material/GridView'
import NewChatIcon from '@/assets/images/new-chat.svg'
import { useResizeDetector } from 'react-resize-detector'
import VirtualList from '@/components/virtual-list'
import { useQuery } from '@tanstack/react-query'
import { useUniversalStore } from '@/store/universal'
import { useShallow } from 'zustand/react/shallow'
import Upload from '@/components/upload'
import VideoModal from '@/components/video-player/modal'
import Checkbox from '@/components/checkbox'
import { enqueueSnackbar } from 'notistack'
import { queryVideoTag, queryVideoList, delVidoe } from '@/api/video'
import { formatDuration } from '@/utils'

import 'swiper/css'
import './style/video-list.scss'

const calcSize = (width, type) => {
  let size = 3
  switch (true) {
    case width < 330 || type === 'list':
      size = 1
      break
    case width < 660:
      size = 2
      break
    case width < 990:
      size = 3
      break
    default:
      size = 4
  }
  return size
}

const initialState = {
  value: '',
  options: [],
  type: 'KEYCLIP',
  selectedTag: 'All',
  isAll: false,
  indeterminate: false,
  checkedList: {},
  listType: 'card',
  sort: 'DESC',
  sortFileds: ['modifyTime'],
  width: 0,
  size: 3,
  span: 0,
  showDel: false,
  currentItem: null,
  anchorPosition: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'setState': {
      return { ...state, ...action.payload }
    }
    case 'setCheckedList':
      const { value, flag, total } = action.payload
      let checkedList = {}

      if (flag) {
        checkedList = value
      } else if (state.checkedList[value.id]) {
        const { [value.id]: _, ...rest } = state.checkedList
        checkedList = rest
      } else {
        checkedList = { ...state.checkedList, [value.id]: value }
      }
      const isAll = Object.keys(checkedList).length === total
      const indeterminate = !!Object.keys(checkedList).length && !isAll
      return { ...state, checkedList, indeterminate, isAll }
    case 'setListType':
      let listType = action.payload
      const size = calcSize(state.width, listType)
      const span = 24 / size
      return { ...state, listType, size, span }
    default:
      return state
  }
}

const VideoList = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const uploadRef = useRef(null)
  const videoRef = useRef(null)

  const { isFetching: tagsLoading, data: tags } = useQuery({
    queryKey: ['video-tags'],
    queryFn: () => queryVideoTag(),
    initialData: [],
  })

  const { isFetching, data, refetch } = useQuery({
    queryKey: ['video-list', state.value, state.selectedTag, state.type, state.sortFileds, state.sort],
    queryFn: () =>
      queryVideoList({
        searchValue: state.value,
        type: state.type,
        tagNames: state.selectedTag === 'All' ? '' : state.selectedTag,
        sortFileds: state.sortFileds,
        sort: state.sort,
      }),
    initialData: {
      videoResponseList: [],
      total: 0,
    },
    initialDataUpdatedAt: 0,
    staleTime: 60 * 1000,
  })

  const handleChangeSearchType = (e) => {
    dispatch({ type: 'setState', payload: { type: e.target.value } })
  }

  const handleSearch = (_, newValue) => {
    const obj = { value: newValue }

    if (!newValue) {
      dispatch({ type: 'setListType', payload: 'card' })
    } else if (state.type === 'KEYCLIP') {
      dispatch({ type: 'setListType', payload: 'list' })
    }
    dispatch({ type: 'setState', payload: obj })
  }

  const hanldeQuerySug = (_, newValue) => {
    // 输入时查询搜索建议
  }

  const handleSelectTag = (tag) => {
    const nextSelectedTag = state.selectedTag === tag ? 'All' : tag
    dispatch({ type: 'setState', payload: { selectedTag: nextSelectedTag } })
  }

  const handleSort = (key) => {
    const sort = state.sort === 'DESC' ? 'ASC' : 'DESC'
    const sortFileds = [key]
    dispatch({ type: 'setState', payload: { sort, sortFileds } })
  }

  const openUploadModal = () => {
    uploadRef.current?.open()
  }

  const selectLen = Object.keys(state.checkedList).length
  const handleCheckboxClick = (e) => {
    // 阻止事件冒泡
    e.stopPropagation()
  }

  const onSelectVideo = (item) => {
    dispatch({
      type: 'setCheckedList',
      payload: {
        value: item,
        total: data.total,
      },
    })
  }

  const onSelectAll = (e) => {
    const list = data.videoResponseList.reduce((pre, next) => {
      pre[next.id] = next
      return pre
    }, {})

    dispatch({
      type: 'setCheckedList',
      payload: {
        value: e.target.checked ? list : {},
        flag: true,
        total: data.total,
      },
    })
  }

  const switchList = () => {
    const listType = state.listType === 'card' ? 'list' : 'card'
    dispatch({ type: 'setListType', payload: listType })
  }

  const onResize = useCallback(({ width }) => {
    const size = calcSize(width, state.listType)
    const span = 24 / size
    dispatch({ type: 'setState', payload: { width, size, span } })
  }, [])

  const { ref: listRef } = useResizeDetector({
    handleHeight: false,
    onResize,
  })

  const [setDrag, setSelectedVideos] = useUniversalStore(useShallow((state) => [state.setDrag, state.setSelectedVideos]))

  const onDragStart = (e, itemData) => {
    const dragData = []
    if (selectLen === 0) {
      dragData.push(itemData)
    } else {
      dragData.push(...Object.values(state.checkedList))
    }

    const dragPreview = document.createElement('div')
    dragPreview.classList.add('drag-preview')
    const img = document.createElement('img')
    img.src = dragData[0]?.videoCoverImgUrl
    dragPreview.appendChild(img)
    const span = document.createElement('span')
    span.classList.add('count')
    span.innerText = selectLen || 1
    dragPreview.appendChild(span)
    document.body.appendChild(dragPreview)
    e.dataTransfer.setDragImage(dragPreview, 50, 50)
    e.dataTransfer.setData('application/json', JSON.stringify(dragData))
    setDrag('start')

    setTimeout(() => {
      document.body.removeChild(dragPreview)
    }, 0)
  }

  const startConversation = (e, v) => {
    e.stopPropagation()

    let sVideos = [v]
    if (!v) {
      sVideos = Object.values(state.checkedList)
      dispatch({
        type: 'setCheckedList',
        payload: {
          value: {},
          flag: true,
          total: data.total,
        },
      })
    }

    setSelectedVideos(sVideos, true)
  }

  const openOperation = (e, v) => {
    e.stopPropagation()
    const { x, y, height } = e.target.getBoundingClientRect()
    dispatch({ type: 'setState', payload: { currentItem: v, anchorPosition: { left: x, top: y + height } } })
  }

  const closeOperation = () => {
    dispatch({ type: 'setState', payload: { currentItem: null, anchorPosition: null } })
  }

  const onDragEnd = (e) => {
    e.preventDefault()
    setDrag('')
    dispatch({
      type: 'setCheckedList',
      payload: {
        value: {},
        flag: true,
        total: data.total,
      },
    })
  }

  const playerVideo = (url, seekTo) => {
    videoRef.current.open(url, seekTo)
  }

  const openDelModal = () => {
    dispatch({ type: 'setState', payload: { showDel: true, anchorPosition: null } })
  }

  const closeDelModal = () => {
    dispatch({ type: 'setState', payload: { showDel: false } })
  }

  const confirmDelete = async () => {
    let ids = []
    if (state.currentItem) {
      ids = [state.currentItem.id]
    } else {
      ids = Object.keys(state.checkedList)
    }
    await delVidoe(ids)

    enqueueSnackbar('Delete successfully!', { variant: 'success' })

    dispatch({
      type: 'setCheckedList',
      payload: {
        flag: true,
        value: {},
        total: data.total,
      },
    })
    refetch()
    closeDelModal()
  }

  const renderItem = useCallback(
    (item) => (
      <Grid className="video-item" size={state.span} draggable onDragStart={(e) => onDragStart(e, item)} onDragEnd={onDragEnd}>
        <div
          className="video-cover"
          style={{ backgroundImage: `url(${item.videoCoverImgUrl || '1.png'})` }}
          onClick={() => playerVideo(item.videoUrl)}
        >
          <div className="video-cover__mask text">{formatDuration(item.duration)}</div>

          <Checkbox
            checked={!!state.checkedList[item.id]}
            value={item.id}
            size="large"
            className="checkbox-video cover-checkbox"
            onClick={handleCheckboxClick}
            onChange={() => onSelectVideo(item)}
          />
        </div>
        <div className="video-info">
          <div className="video-basic">
            <div className="video-name ellipsis-2-lines">{item.videoName}</div>
            {state.listType === 'list' && <div className="text">{formatDuration(item.duration)}</div>}
            <div className="video-date-wrapper">
              <div className="video-date">{item.createTime.replace(/\s\d{2}:\d{2}:\d{2}$/, '')}</div>
              <div>
                <IconButton size="small" onClick={(e) => startConversation(e, item)}>
                  <NewChatIcon />
                </IconButton>
                <IconButton size="small" onClick={(e) => openOperation(e, item)}>
                  <MoreHorizIcon fontSize="inherit" />
                </IconButton>
              </div>
            </div>
          </div>
          {state.listType === 'list' && item.keyframes && (
            <div className="video-progress">
              {item.keyframes?.map((keyframe, i) => (
                <Tooltip
                  classes={{
                    tooltip: 'video-keyclip-thumb',
                  }}
                  key={i}
                  title={
                    <div className="video-keyclip-thumb-content">
                      <img src={keyframe.keyframesImgUrl} />
                      <div className="mask text">{formatDuration(keyframe.index)}</div>
                    </div>
                  }
                  placement="top"
                >
                  <div
                    className="progress-keyClip"
                    style={{ left: `${keyframe.keyframesLocation * 100}%` }}
                    onClick={() => playerVideo(item.videoUrl, keyframe.keyframesLocation)}
                  />
                </Tooltip>
              ))}
            </div>
          )}
        </div>
      </Grid>
    ),
    [state.span, state.checkedList]
  )

  return (
    <div className="video-list">
      <div className="video-list__search">
        <div className="search-input">
          <Autocomplete
            onChange={handleSearch}
            onInputChange={hanldeQuerySug}
            freeSolo
            options={top100Films.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search keyclip"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
          <Select value={state.type} onChange={handleChangeSearchType}>
            <MenuItem value="KEYCLIP">KeyClips</MenuItem>
            <MenuItem value="GLOBAL">Global</MenuItem>
          </Select>
        </div>
        <Upload ref={uploadRef} />
      </div>
      <div className="video-list__filter">
        <Swiper
          slidesPerView="auto"
          freeMode={true}
          navigation={{
            prevEl: '.icon-left',
            nextEl: '.icon-right',
            disabledClass: 'hide',
          }}
          modules={[Navigation]}
        >
          {tags.map((tag) => (
            <SwiperSlide key={tag} style={{ width: 'auto' }}>
              <div className={`video-tag ${tag === state.selectedTag ? 'active' : ''}`} onClick={() => handleSelectTag(tag)}>
                {tag}
              </div>
            </SwiperSlide>
          ))}
          {/* <div style={{ display: 'flex', gap: '0.6rem' }}>
            <Skeleton variant="rounded" width="5rem" height="1.7rem" />
            <Skeleton variant="rounded" width="5rem" height="1.7rem" />
            <Skeleton variant="rounded" width="5rem" height="1.7rem" />
            <Skeleton variant="rounded" width="5rem" height="1.7rem" />
            <Skeleton variant="rounded" width="5rem" height="1.7rem" />
            <Skeleton variant="rounded" width="5rem" height="1.7rem" />
          </div> */}
        </Swiper>
        <div className="icon-left">
          <div>
            <Tooltip title="Previous" arrow>
              <IconButton>
                <KeyboardArrowLeftIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="icon-right">
          <div>
            <Tooltip title="Next" arrow>
              <IconButton>
                <KeyboardArrowRightIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="video-list__sort">
        <div className="select-all">
          <Checkbox checked={state.isAll} indeterminate={state.indeterminate} size="small" onChange={onSelectAll} /> all videos {data.total} total
          {selectLen > 0 && <span>{selectLen} selected</span>}
        </div>
        <div>
          {selectLen > 0 && (
            <IconButton color="secondary" size="small" onClick={openDelModal}>
              <DeleteForeverIcon fontSize="inherit" />
            </IconButton>
          )}
          <Button
            size="small"
            variant="text"
            color="inherit"
            endIcon={state.sort === 'ASC' ? <ArrowUpwardIcon fontSize="inherit" /> : <ArrowDownwardIcon fontSize="inherit" />}
            onClick={() => handleSort('modifyTime')}
          >
            Upload Date
          </Button>
          <IconButton size="small" onClick={switchList}>
            {state.listType ? <GridViewIcon fontSize="inherit" /> : <FormatListBulletedIcon fontSize="inherit" />}
          </IconButton>
        </div>
      </div>
      <div className="video-list__content" ref={listRef}>
        <VirtualList
          size={state.size}
          loading={isFetching}
          data={data.videoResponseList}
          estimateSize={220}
          rowClass={`video-row ${state.listType}`}
          wrapper={({ children, ...rest }) => (
            <Grid {...rest} container columns={24}>
              {children}
            </Grid>
          )}
          itemContent={renderItem}
          loader={() => (
            <Grid className="video-item" size={state.span}>
              <Skeleton className="video-cover" variant="rounded" />
              <Skeleton variant="text" />
              <Skeleton width="60%" />
            </Grid>
          )}
          empty={
            <>
              <p className="text">There are no videos in the library yet, upload your video now!</p>
              <Button variant="contained" onClick={openUploadModal}>
                Upload Video
              </Button>
            </>
          }
        />
      </div>

      <VideoModal ref={videoRef} />

      {selectLen > 0 && (
        <div className="video-list__action">
          <Button className="btn start-btn" onClick={startConversation}>
            Start a new conversation
          </Button>
        </div>
      )}

      <Dialog maxWidth="xs" open={state.showDel} onClose={closeDelModal}>
        <DialogTitle>Delete videos？</DialogTitle>
        <DialogContent>
          <p>Once deleted, the video will be permanently removed and cannot be recovered.</p>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" fullWidth size="small" onClick={closeDelModal}>
            Cancel
          </Button>
          <Button variant="contained" fullWidth size="small" color="secondary" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Popover anchorReference="anchorPosition" anchorPosition={state.anchorPosition} open={Boolean(state.anchorPosition)} onClose={closeOperation}>
        <MenuItem>Download</MenuItem>
        <MenuItem>Rename</MenuItem>
        <MenuItem onClick={openDelModal}>Delete</MenuItem>
      </Popover>
    </div>
  )
}

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 },
  {
    title: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
]

export default VideoList
