import http from '@/utils/http'

const login = (params) => {
  return http.request('/auth/customer/login', {
    params,
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
