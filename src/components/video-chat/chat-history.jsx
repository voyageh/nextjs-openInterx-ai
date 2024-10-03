import { useState, forwardRef, useImperativeHandle } from 'react'
import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import { useUniversalStore } from '@/store/universal'
import { useQuery } from '@tanstack/react-query'
import { getChatHistory } from '@/api/video'

export default forwardRef(function (_, ref) {
  const selectedVideos = useUniversalStore((state) => state.selectedVideos)
  const ids = selectedVideos.map((video) => video.id)
  const [open, setOpen] = useState(false)

  const { data } = useQuery({
    queryKey: ['video-list', selectedVideos],
    queryFn: () => getChatHistory(ids),
    initialData: {
      chatResponseList: [],
      total: 0,
    },
    initialDataUpdatedAt: 0,
    staleTime: 60 * 1000,
  })

  useImperativeHandle(
    ref,
    () => {
      return {
        toggleDrawer,
      }
    },
    []
  )

  return (
    <List>
      {data?.chatResponseList?.map((item, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton>
            <ListItemText primary={'jjnsdlklk'} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
})
