import request from '../utils/request'

export function getCabins(userData) {
  return request({
    url: '/cabins',
    method: 'get',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function addCabins(data, proId, userData) {
  return request({
    url: '/cabins',
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    data
  })
}

export function updateCabins(data, id, userData) {
  return request({
    url: '/cabins/' + id,
    method: 'patch',
    auth: {
      username: userData.username,
      password: userData.password
    },
    data
  })
}

export function deleteCabins(id, userData) {
  return request({
    url: '/cabins/' + id,
    method: 'delete',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function getCabinsDetail(id, userData) {
  return request({
    url: '/cabins/' + id,
    method: 'get',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}

export function putDevices(cabinId, deviceId, userData, data) {
  return request({
    url: '/cabins/' + cabinId + '/device/' + deviceId,
    method: 'post',
    auth: {
      username: userData.username,
      password: userData.password
    },
    data
  })
}

export function deleteBindDevice(cabinId, deviceId, userData) {
  return request({
    url: '/cabins/' + cabinId + '/device/' + deviceId,
    method: 'delete',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}
