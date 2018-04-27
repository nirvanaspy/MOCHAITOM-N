import request from '../utils/request'

export function compList() {
  return request({
    url: '/components',
    method: 'get',
    params: {
      isShowHistory: false
    },
    auth: {
      username: 'admin',
      password: 'admin'
    }
  })
}
