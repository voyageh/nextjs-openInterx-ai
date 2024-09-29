import { Tooltip } from '@mui/material'
import { auth, signOut } from '@/auth'

export default async function UserSetting() {
  const session = await auth()

  return (
    <Tooltip title="User settings" placement="right" arrow>
      <img src={session?.user?.image || 'user.svg'} />
    </Tooltip>
  )
}
