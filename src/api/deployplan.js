import request from '../utils/request'

export function deployplanList(projectId, userData) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesigns',
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

export function createDeployplan(data, projectId, userData) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesigns',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    /* auth: {
      username: 'admin',
      password: 'admin'
    },*/
    data
  })
}

export function updateDeployplan(data, id, userData) {
  return request({
    url: 'deploymentdesigns/' + id,
    method: 'patch',
    auth: {
      username: userData.username,
      password: userData.password
    },
    /* auth: {
      username: 'admin',
      password: 'admin'
    },*/
    data
  })
}

export function deleteDeployplan(id, userData) {
  return request({
    url: 'deploymentdesigns/' + id,
    method: 'delete',
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

