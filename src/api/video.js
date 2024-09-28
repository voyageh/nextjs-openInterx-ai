import http from '@/utils/http'

export const queryVideoList = (params) => {
  return http.request('/api/videos', {
    params,
    baseURL: 'https://apifoxmock.com/m1/5110074-4772873-default',
  })
}

export const upload = (data) => {
  return http.request('/serve/video/upload', {
    data,
    method: 'post',
    contentType: 'multipart/form-data',
  })
}
