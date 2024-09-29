import http from '@/utils/http'

const login = (token) => {
  return http.request('http://192.168.1.103:8081/auth/customer/login', {
    params: { token },
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
