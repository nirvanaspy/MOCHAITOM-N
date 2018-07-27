import request from '../utils/request'

export function saveDeploymentDesignSnapshots(id, data, userData) {
  return request({
    url: '/deploymentdesigns/' + id + '/deploymentdesignsnapshots',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function getDeploymentDesignSnapshots(userData) {
  return request({
    url: '/deploymentdesignsnapshots',
    method: 'get',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function deleteDeploymentDesignSnapshots(id, userData) {
  return request({
    url: '/deploymentdesignsnapshots/' + id,
    method: 'delete',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function deployDeploymentDesignSnapshots(id, userData) {
  return request({
    url: '/deploymentdesignsnapshots/' + id + '/deploy',
    method: 'put',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}
