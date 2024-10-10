import request from '@/utils/http'

export const queryVideoTag = () => {
  return request.getData('serve/video/getVideoTag').then((res) => res.tags)
}

export const queryVideoList = (data) => {
  return request.getData('serve/video/search', {
    method: 'post',
    json: data,
  })
}

export const delVidoe = (data) => {
  return request.getData('serve/video/delete', {
    method: 'post',
    json: data,
  })
}

export const upload = (data, onUploadProgress) => {
  return request.upload('/backend/serve/video/upload', data, { onUploadProgress })
}

export const uploadUrl = (data) => {
  return request.getData('serve/video/videoUrlUpload', {
    data,
    method: 'post',
  })
}

export const send = (data) => {
  return request.getData('serve/video/question', {
    data,
    method: 'post',
  })
}

export const getChatHistoryList = () => {
  return request.getData('serve/video/getHisChatList')
}

export const getChatDetail = (sessionId) => {
  return request.getData('serve/video/queryHisChatMsg?sessionId=' + sessionId, {
    method: 'post',
  })
}
