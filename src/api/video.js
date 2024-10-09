import http from '@/utils/http'

export const queryVideoTag = () => {
  return http.request('/serve/video/getVideoTag').then((res) => res.tags)
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
    timeout: 1800000,
    onUploadProgress,
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

export const getChatHistoryList = () => {
  return http.request('/serve/video/getHisChatList')
}

export const getChatDetail = (sessionId) => {
  return http.request('/serve/video/queryHisChatMsg?sessionId=' + sessionId, {
    method: 'post',
  })
}
