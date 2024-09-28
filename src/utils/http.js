import axios from "axios"
// import { cookies } from "next/headers"

export class Http {
  constructor(baseURL, config) {
    this.config = config || {
      baseURL,
      timeout: 60000,
      method: "GET",
      responseType: "json",
      headers: {
        "Content-Type": "application/json"
      }
    }
    this.instance = axios.create(this.config)

    this.instance.interceptors.request.use(
      config => this.handleRequest(config),
      this.handleError
    )

    this.instance.interceptors.response.use(
      this.handleResponse,
      this.handleError
    )
  }

  handleRequest(config) {
    // const token = cookies().get("OPENINTERX-TOKEN")
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }

    if (typeof this.config.beforeRequest === "function") {
      this.config.beforeRequest(config)
    }

    return config
  }

  handleResponse(response) {
    const data = response.data

    if (data instanceof Blob) {
      return response
    } else if (data.code === "0000") {
      return data.data
    } else {
      return data
    }
  }

  handleError(error) {
    if (error.response) {
      if (error.response.status === 401) {
        window.location.href = "/login"
      }
    }
    return Promise.reject(error.response ? error.response.data : error)
  }

  async request(url, config = {}) {
    config.url = url
    return this.instance.request(config)
  }
}

export default new Http("http://192.168.1.101:8081")
