'use client'

import { useRef, useReducer, useCallback, useEffect } from 'react'
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
} from '@mui/material'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import Icon from '@/components/icon'
import { useResizeDetector } from 'react-resize-detector'
import VirtualList from '@/components/virtual-list'
import { useQuery } from '@tanstack/react-query'
import { useUniversalStore } from '@/store/universal'
import Upload from '@/components/upload'
import VideoModal from '@/components/video-player/modal'
import Checkbox from '@/components/checkbox'
import { enqueueSnackbar } from 'notistack'

import { queryVideoTag, queryVideoList, delVidoe } from '@/api/video'

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
  tags: [],
  tagLoading: true,
  selectedTag: 'All',
  width: 0,
  size: 3,
  span: 0,
  checkedList: {},
  listType: '',
  showDel: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'setValue':
      return { ...state, value: action.payload }
    case 'setOptions':
      return { ...state, options: action.payload }
    case 'setTags':
      return { ...state, tags: action.payload }
    case 'setSelectedTags':
      return { ...state, selectedTag: action.payload }
    case 'setWidth':
      return { ...state, ...action.payload }
    case 'setCheckedList':
      if (action.flag) {
        return { ...state, checkedList: action.payload }
      }
      if (state.checkedList[action.payload.id]) {
        const { [action.payload.id]: _, ...checkedList } = state.checkedList
        return { ...state, checkedList }
      }
      return { ...state, checkedList: { ...state.checkedList, [action.payload.id]: action.payload } }
    case 'setListType':
      let listType = state.listType === '' ? 'list' : ''
      const size = calcSize(state.width, listType)
      const span = 24 / size
      return { ...state, listType, size, span }
    case 'setShowDel':
      return { ...state, showDel: action.payload }
    default:
      return state
  }
}

const VideoList = () => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const uploadRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    queryVideoTag().then((r) => {
      dispatch({ type: 'setTags', payload: ['All', ...r.tags] })
    })
  }, [])

  const { isFetching, data, refetch } = useQuery({
    queryKey: ['video', state.selectedTag, state.value],
    queryFn: () =>
      queryVideoList({
        searchValue: state.value,
        tagNames: state.selectedTag === 'All' ? '' : state.selectedTag,
        sortFileds: ['modifyTime'],
        sort: 'ASC',
      }),
    initialData: {
      videoResponseList: [],
      total: 0,
    },
    initialDataUpdatedAt: 0,
    staleTime: 60 * 1000,
  })

  const handleSearch = (_, newValue) => {
    dispatch({ type: 'setValue', payload: newValue })
  }

  const hanldeQuerySug = (_, newValue) => {
    console.log(newValue)
  }

  const openUploadModal = () => {
    uploadRef.current.open()
  }

  const handleSelectTag = (tag) => {
    const nextSelectedTag = state.selectedTag === tag ? 'All' : tag
    dispatch({ type: 'setSelectedTags', payload: nextSelectedTag })
  }

  const selectLen = Object.keys(state.checkedList).length
  const indeterminate = selectLen > 0 && selectLen < 11

  const handleCheckboxClick = (e) => {
    // 阻止事件冒泡
    e.stopPropagation()
  }

  const onSelectVideo = (item) => {
    dispatch({
      type: 'setCheckedList',
      payload: item,
    })
  }

  const onSelectAll = (e) => {
    const list = data.videoResponseList.reduce((pre, next) => {
      pre[next.id] = next // 将 id 作为 key，item 作为 value
      return pre
    }, {})

    dispatch({
      type: 'setCheckedList',
      flag: true,
      payload: e.target.checked ? list : {},
    })
  }

  const switchList = () => {
    dispatch({ type: 'setListType' })
  }

  const onResize = useCallback(({ width }) => {
    const size = calcSize(width, state.listType)
    const span = 24 / size
    dispatch({ type: 'setWidth', payload: { width, size, span } })
  }, [])

  const { ref: listRef } = useResizeDetector({
    handleHeight: false,
    onResize,
  })

  const setDrag = useUniversalStore((state) => state.setDrag)

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
    e.dataTransfer.setDragImage(dragPreview, 30, 30)
    e.dataTransfer.setData('application/json', JSON.stringify(dragData))
    setDrag('start')

    setTimeout(() => {
      document.body.removeChild(dragPreview)
    }, 0)
  }

  const startConversation = () => {
    // setSelectedVideos([...Object.values(state.checkedList)], true)
  }

  const onDragEnd = (e) => {
    e.preventDefault()
    setDrag('')
  }

  const playerVideo = (url) => {
    videoRef.current.open(url)
  }

  const openDelModal = () => {
    dispatch({ type: 'setShowDel', payload: true })
  }

  const closeDelModal = () => {
    dispatch({ type: 'setShowDel', payload: false })
  }

  const confirmDelete = async () => {
    await delVidoe(Object.keys(state.checkedList))
    enqueueSnackbar('Delete successfully!', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'center' } })
    dispatch({ type: 'setCheckedList', flag: true, payload: {} })
    refetch()
    dispatch({ type: 'setShowDel', payload: false })
  }

  const renderItem = useCallback(
    (item) => (
      <Grid
        className="video-item"
        size={state.span}
        draggable
        onDragStart={(e) => onDragStart(e, item)}
        onDragEnd={onDragEnd}
        onClick={() => playerVideo(item.videoUrl)}
      >
        <div className="video-cover" style={{ backgroundImage: `url(${item.videoCoverImgUrl || '1.png'})` }}>
          <div className="video-cover__mask text">{item.duration}</div>
          <Checkbox
            checked={!!state.checkedList[item.id]}
            value={item.id}
            size="large"
            className="checkbox-video cover-checkbox"
            onClick={handleCheckboxClick}
            onChange={() => onSelectVideo(item)}
          />
        </div>
        <div className="video-name ellipsis-2-lines">{item.videoName}</div>
        {state.listType === 'list' && <div className="text">{item.videoTime}</div>}
        <div className="video-date">{item.createTime}</div>
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
            size="small"
            freeSolo
            options={top100Films.map((option) => option.title)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search keyclip22"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <Icon name="SearchIcon" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            )}
          />
          <Select defaultValue={'1'} size="small">
            <MenuItem value="1">KeyClips</MenuItem>
            <MenuItem value="2">Global</MenuItem>
          </Select>
        </div>
        <Tooltip title="upload" arrow>
          <IconButton onClick={openUploadModal}>
            <Icon name="AddVideo" />
          </IconButton>
        </Tooltip>
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
          {state.tags.map((tag) => (
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
                <Icon name="LeftIcon" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        <div className="icon-right">
          <div>
            <Tooltip title="Next" arrow>
              <IconButton>
                <Icon name="RightIcon" />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="video-list__sort">
        <div className="select-all">
          <Checkbox size="small" onChange={onSelectAll} /> all videos {data.total} total {selectLen > 0 && <span>{selectLen} selected</span>}
        </div>
        <div>
          {selectLen > 0 && (
            <IconButton color="secondary" onClick={openDelModal}>
              <Icon name={'DeleteIcon'} />
            </IconButton>
          )}
          <Button className="btn" variant="text" color="inherit" endIcon={<Icon name={'ArrowDown'} />}>
            Upload Date
          </Button>
          <IconButton className="btn change-btn" onClick={switchList}>
            <Icon name={state.listType ? 'CardIcon' : 'ListIcon'} />
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

      <Upload ref={uploadRef} />

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
