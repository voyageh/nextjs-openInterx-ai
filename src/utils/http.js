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
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest()
    xhr.open('post', '/backend/' + url, true)
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')
    xhr.timeout = 1800000

    if (config) {
      if (config.onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentCompleted = Math.round((event.loaded * 100) / event.total)
            config.onProgress(percentCompleted)
          }
        }
      }
      if (config.onCancel) {
        config.onCancel(() => {
          xhr.abort()
        })
      }
    }

    const handleError = (msg) => {
      config.onStatus && config.onStatus(msg)
    }

    xhr.onload = () => {
      if (xhr.status === 200) {
        handleError('success')
        resolve(xhr.response)
      } else {
        handleError('Failed')
        resolve(`Upload failed with status: ${xhr.status}`)
      }
    }

    xhr.onabort = () => {
      handleError('Canceled')
      resolve('Upload aborted by the user.')
    }

    xhr.ontimeout = () => {
      handleError('Timeout')
      resolve('Upload timed out.')
    }

    xhr.onerror = () => {
      handleError('Failed')
      resolve('Upload failed due to a network error.')
    }

    xhr.send(data)
  })
}

export default request
