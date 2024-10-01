import http from '@/utils/http'

export const queryVideoTag = () => {
  return http.request('/serve/video/getVideoTag')
}

export const queryVideoList = (data) => {
  return http.request('/serve/video/search', {
    method: 'POST',
    data,
  })
}

export const delVidoe = (data) => {
  return http.request('/serve/video/delete', {
    method: 'POST',
    data,
  })
}

export const upload = (data, onUploadProgress) => {
  return http.request('/serve/video/upload', {
    data,
    method: 'post',
    timeout: 60000,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const uploadUrl = (data) => {
  return http.request('/serve/video/videoUrlUpload', {
    data,
    method: 'post',
  })
}

export const send = (data) => {
  return http.request('/serve/video/question', {
    data,
    method: 'post',
  })
}

export const getChatHistory = () => {
  return http.request('/serve/video/getChatHistory', {
    method: 'post',
  })
}
