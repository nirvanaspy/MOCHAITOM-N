import request from '../utils/request'

export function logList() {
  return request({
    url: '/deploylogs',
    method: 'get',
    auth: {
      username: 'admin',
      password: 'admin'
    }
  })
}
