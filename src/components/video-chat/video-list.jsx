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

import { queryVideoList } from '@/api/video'

import 'swiper/css'
import './style/video-list.scss'

const tagsData = [
  'All',
  'Gaming',
  'Baseball',
  'Swimming',
  'Badminton',
  'Badminton1',
  'Badminton2',
  'Badminton3',
  'Badminton4',
  'Badminton5',
  'Badminton6',
  'Badminton7',
]

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
    case 'setSelectedTags':
      return { ...state, selectedTag: action.payload }
    case 'setWidth':
      return { ...state, ...action.payload }
    case 'setCheckedList':
      return { ...state, checkedList: action.payload }
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

const VideoList = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const uploadRef = useRef(null)
  const videoRef = useRef(null)

  const openUploadModal = () => {
    uploadRef.current.open()
  }

  const handleSelectTag = (tag) => {
    const nextSelectedTag = state.selectedTag === tag ? 'All' : tag
    dispatch({ type: 'setSelectedTags', payload: nextSelectedTag })
  }

  const selectLen = Object.values(state.checkedList).filter(Boolean).length
  const indeterminate = selectLen > 0 && selectLen < 11

  const onSelectVideo = (e) => {
    dispatch({
      type: 'setCheckedList',
      payload: {
        ...state.checkedList,
        [e.target.value]: e.target.checked,
      },
    })
  }

  const onSelectAll = (e) => {
    dispatch({
      type: 'setCheckedList',
      payload: e.target.checked ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] : [],
    })
  }

  const switchList = () => {
    dispatch({ type: 'setListType' })
  }

  const { isFetching, data } = useQuery({
    queryKey: ['video'],
    queryFn: () => queryVideoList({ page: 1, pageSize: 100 }),
    initialData: {
      list: [],
      total: 0,
    },
    initialDataUpdatedAt: 0,
    staleTime: 60 * 1000,
  })

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

  const onDragStart = (e) => {
    const dragPreview = document.createElement('div')
    dragPreview.classList.add('drag-preview')
    const img = document.createElement('img')
    img.src = '1.png'
    dragPreview.appendChild(img)
    const span = document.createElement('span')
    span.classList.add('count')
    span.innerText = state.checkedList.length || 1
    dragPreview.appendChild(span)

    document.body.appendChild(dragPreview)
    e.dataTransfer.setDragImage(dragPreview, 30, 30)
    e.dataTransfer.setData('application/json', JSON.stringify(data))
    setDrag('start')

    setTimeout(() => {
      document.body.removeChild(dragPreview)
    }, 0)
  }

  const onDragEnd = (e) => {
    e.preventDefault()
    setDrag('')
  }

  const openDelModal = () => {
    dispatch({ type: 'setShowDel', payload: true })
  }

  const closeDelModal = () => {
    dispatch({ type: 'setShowDel', payload: false })
  }

  const renderItem = useCallback(
    (item) => (
      <Grid className="video-item" size={state.span} draggable onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="video-cover" style={{ backgroundImage: `url(${item.cover})` }}>
          <div className="video-cover__mask text">{item.duration}</div>
          <Checkbox
            checked={state.checkedList[item.id]}
            value={item.id}
            size="large"
            className="checkbox-video cover-checkbox"
            onChange={onSelectVideo}
          />
        </div>
        <div className="video-name ellipsis-2-lines">{item.name}</div>
        {state.listType === 'list' && <div className="text">{item.duration}</div>}
        <div className="video-date">{item.date}</div>
      </Grid>
    ),
    [state.span, state.checkedList]
  )

  return (
    <div className="video-list">
      <div className="video-list__search">
        <div className="search-input">
          <Autocomplete
            size="small"
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

          {/* {!state.value && (
            <Select defaultValue="1" size="large">
              <Select.Option value="1">KeyClips</Select.Option>
              <Select.Option value="2">Global</Select.Option>
            </Select>
          )} */}
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
          {tagsData.map((tag) => (
            <SwiperSlide key={tag} style={{ width: 'auto' }}>
              <div className={`video-tag ${tag === state.selectedTag ? 'active' : ''}`} onClick={() => handleSelectTag(tag)}>
                {tag}
              </div>
            </SwiperSlide>
          ))}
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
          <Checkbox size="small" /> all videos {data.total} total {selectLen > 0 && <span>{selectLen} selected</span>}
        </div>
        <div>
          {selectLen > 0 && (
            <IconButton color="secondary" onClick={openDelModal}>
              <Icon name={'DeleteIcon'} />
            </IconButton>
          )}
          <Button variant="text" color="inherit" endIcon={<Icon name={'ArrowDown'} />}>
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
          data={data.list}
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
          <Button className="btn start-btn">Start a new conversation</Button>
        </div>
      )}

      <Dialog maxWidth="xs" open={state.showDel} onClose={closeDelModal} centered>
        <DialogTitle>Delete videos？</DialogTitle>
        <DialogContent>
          <p>Once deleted, the video will be permanently removed and cannot be recovered.</p>
        </DialogContent>
        <DialogActions>
          <Button color="inherit" fullWidth size="small" onClick={closeDelModal}>
            Cancel
          </Button>
          <Button variant="contained" fullWidth size="small" color="secondary" onClick={closeDelModal}>
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
