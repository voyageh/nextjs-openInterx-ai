import http from '@/utils/http'

const login = (token, baseURL) => {
  return http.request('/auth/customer/login', {
    params: { token },
    baseURL,
  })
}

const getUser = () => {
  return http.request('/auth/customer/getCustomerInfo')
}

const loginout = (params) => {
  return http.request('/auth/customer/loginOut', {
    params,
  })
}

export { login, getUser, loginout }
