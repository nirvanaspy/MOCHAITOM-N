import request from '../utils/request'

export function doDeployBind(deployPlanId, data) {
  return request({
    url: 'deploymentdesigns/' + deployPlanId + '/deploymentdesigndetails',
    method: 'post',
    auth: {
      username: 'admin',
      password: 'admin'
    },
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data
  })
}
