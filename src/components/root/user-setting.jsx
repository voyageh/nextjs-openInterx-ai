import { Tooltip } from 'antd'
import { auth, signOut } from '@/auth'

export default async function UserSetting() {
  const session = await auth()

  return (
    <Tooltip title="User settings" placement="right">
      <img src={session?.user?.image || 'user.svg'} width={24} height={24} />
    </Tooltip>
  )
}
