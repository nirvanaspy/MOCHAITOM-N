import request from '../utils/request'

export function logList(userData) {
  return request({
    url: '/deploylogs',
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

export function logSearchList(searchObj, userData) {
  return request({
    url: '/deploylogs',
    params: searchObj,
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
