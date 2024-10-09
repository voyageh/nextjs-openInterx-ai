// import http from '@/utils/http'

const login = (token, baseURL) => {
  return fetch(baseURL + '/auth/customer/login?token=' + token)
}

// const getUser = () => {
//   return http.request('/auth/customer/getCustomerInfo')
// }

// const loginout = (params) => {
//   return http.request('/auth/customer/loginOut', {
//     params,
//   })
// }

export { login }
