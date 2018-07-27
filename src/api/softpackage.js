import request from '../utils/request'

export function getSoftPackage(userData) {
  return request({
    url: '/componentpackages',
    method: 'get',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function addSoftPackage(data, userData) {
  return request({
    url: '/componentpackages',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data
  })
}

export function updateSoftPackage(id, data, userData) {
  return request({
    url: '/componentpackages/' + id,
    method: 'PATCH',
    auth: {
      username: userData.username,
      password: userData.password
    },
    data
  })
}

export function deletePackage(id, userData) {
  return request({
    url: '/componentpackages/' + id,
    method: 'delete',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}
