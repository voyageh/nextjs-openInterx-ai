export async function GET(request) {
  const { searchParams } = new URL(request.url) // 获取URL中的查询参数
  const page = searchParams.get('page') // 获取param1
  const pageSize = searchParams.get('pageSize') // 获取param2

  const r = await fetch('https://apifoxmock.com/m1/5110074-4772873-default/api/videos?page=' + page + '&pageSize=' + pageSize)
  const data = await r.json()

  return Response.json(data)
}
