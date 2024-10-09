import request from '@/utils/http'

const login = (token, baseURL) => {
  return request.extended('auth/customer/login?token=' + token, {
    prefixUrl: baseURL,
  })
}

const getUser = () => {
  return request.getData('auth/customer/getCustomerInfo')
}

const loginout = (params) => {
  return request.getData('auth/customer/loginOut', {
    params,
  })
}

export { login, getUser, loginout }
