import ky from 'ky'

const request = ky.create({
  prefixUrl: '/backend',
  timeout: 10000,
  retry: 0,
})

request.getData = async (...params) => {
  const response = await request(...params)
  const data = await response.json()
  if (response.ok && data.code === '0000') {
    return data.data
  } else {
    return Promise.reject(data)
  }
}

request.extended = request.extend()

export default request
