import request from '../utils/request'

export function bindDetailList(deployplanId, userData) {
  return request({
    url: 'deploymentdesigns/' + deployplanId + '/deploymentdesigndetails',
    method: 'get',
    auth: {
      username: userData.username,
      password: userData.password
    }
    /* auth: {
      username: 'admin',
      password: 'admin'
    }*/
  })
}
