import { List, ListItem, ListItemButton, ListItemText, Skeleton, Stack } from '@mui/material'
import Empty from '@/components/empty'
import { useQuery } from '@tanstack/react-query'
import { getChatHistoryList } from '@/api/video'

const SkeletonList = () => {
  return (
    <Stack spacing="1rem" sx={{ margin: '1rem' }}>
      <Skeleton variant="rounded" height="2rem" />
      <Skeleton variant="rounded" height="2rem" />
      <Skeleton variant="rounded" height="2rem" />
      <Skeleton variant="rounded" height="2rem" />
    </Stack>
  )
}
export default function ChatHistoryList({ onClick }) {
  const { isFetching, data } = useQuery({
    queryKey: ['video-history-list'],
    queryFn: () => getChatHistoryList(),
    initialData: {
      chatTitleResponseList: [],
    },
    initialDataUpdatedAt: 0,
    staleTime: 60 * 1000,
  })

  const handleClick = (item) => {
    onClick && onClick(item)
  }

  return (
    <List className="popover-scroll__list">
      {isFetching ? <SkeletonList /> : data?.chatTitleResponseList?.length === 0 && <Empty describe="No history data" />}
      {data?.chatTitleResponseList?.map((item, index) => (
        <ListItem key={index} disablePadding onClick={() => handleClick(item)}>
          <ListItemButton>
            <ListItemText primary={item.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  )
}
