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

request.upload = (url, data, config) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('post', url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

    if (config && config.onUploadProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentCompleted = Math.round((event.loaded * 100) / event.total)
          config.onUploadProgress(percentCompleted)
        }
      })
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`))
      }
    }

    xhr.onerror = () => {
      reject(new Error('Upload failed due to a network error.'))
    }
    
    xhr.send(data)
  })
}

export default request
