import request from '../utils/request'

export function projectList() {
  return request({
    url: '/projects',
    method: 'get',
    auth: {
      username: 'admin',
      password: 'admin'
    }
  })
}
