import request from '../utils/request'

export function deployplanList(projectId) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesigns',
    method: 'get',
    auth: {
      username: 'admin',
      password: 'admin'
    }
  })
}

export function createDeployplan(data, projectId) {
  return request({
    url: 'projects/' + projectId + '/deploymentdesigns',
    method: 'post',
    auth: {
      username: 'admin',
      password: 'admin'
    },
    data
  })
}

