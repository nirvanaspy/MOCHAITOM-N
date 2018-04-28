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

export function createProject(data) {
  return request({
    url: '/projects',
    method: 'post',
    auth: {
      username: 'admin',
      password: 'admin'
    },
    data
  })
}

export function updateProject(data, id) {
  return request({
    url: '/projects/' + id,
    method: 'patch',
    auth: {
      username: 'admin',
      password: 'admin'
    },
    data
  })
}

export function deleteProject(id) {
  return request({
    url: '/projects/' + id,
    method: 'delete',
    auth: {
      username: 'admin',
      password: 'admin'
    }
  })
}
