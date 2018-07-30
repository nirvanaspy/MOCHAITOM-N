import request from '@/utils/request'

export function UserList(userData) {
  return request({
    url: 'admin/users',
    method: 'get',
    auth: {
      username: userData.username,
      password: userData.password
    }
  })
}
export function updateUser(data, id, userData) {
  return request({
    url: 'admin/users/' + id + '/changepassword',
    data,
    method: 'patch',
    auth: {
      username: userData.username,
      password: userData.password
    }
    /* auth:{
      username: 'admin',
      password: 'admin'
    }*/
  })
}
export function deleteUser(id, userData) {
  return request({
    url: 'admin/users/' + id,
    method: 'delete',
    auth: {
      username: userData.username,
      password: userData.password
    }
    /* auth:{
      username: 'admin',
      password: 'admin'
    }*/
  })
}
export function addUser(data, userData) {
  return request({
    url: 'users',
    method: 'post',
    params: { // get请求在第二个位置，post在第三个位置
      isAdmin: false
    },
    /* auth: {
      username: userData.username,
      password: userData.password
    },*/
    data
  })
}
