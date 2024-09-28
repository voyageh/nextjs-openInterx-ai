import { auth } from '@/auth'

export default async function UserInfo() {
  const session = await auth()
  
  return <div>{session?.user?.name}</div>
}
