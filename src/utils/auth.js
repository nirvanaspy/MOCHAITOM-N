import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
export function getIp() {
  return Cookies.get('ip')
}

export function getPort() {
  return Cookies.get('port')
}

export function removeProID() {
  return Cookies.remove('projectId')
}

export function removeProName() {
  return Cookies.remove('projectName')
}

export function removeProExist() {
  return Cookies.remove('projectExist')
}

export function removeUser() {
  return Cookies.remove('username')
}

export function removePass() {
  return Cookies.remove('password')
}
