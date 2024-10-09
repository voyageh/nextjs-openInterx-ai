import { List, ListItem, ListItemText, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Empty from '@/components/empty'
import { useUniversalStore } from '@/store/universal'

export default function SelectedList() {
  const [selectedVideos, setSelectedVideos] = useUniversalStore((state) => [state.selectedVideos, state.setSelectedVideos])

  const onDelete = (id) => {
    const newArr = selectedVideos.filter((item) => item.id !== id)
    setSelectedVideos([...newArr])
  }

  return (
    <List className="popover-scroll__list">
      {selectedVideos.length === 0 && <Empty describe="No video data" />}
      {selectedVideos.map((item) => (
        <ListItem
          key={item.id}
          className="popover-scroll__list__item"
          secondaryAction={
            <IconButton size="small" edge="end" aria-label="delete" onClick={() => onDelete(item.id)}>
              <CloseIcon fontSize="inherit" color="inherit" />
            </IconButton>
          }
        >
          <div className="cover" style={{ background: `url(${item.videoCoverImgUrl}) var(--bg-color-0) 50% / cover no-repeat` }} />
          <ListItemText className="ellipsis-2-lines" secondary={item.videoName} />
        </ListItem>
      ))}
    </List>
  )
}
