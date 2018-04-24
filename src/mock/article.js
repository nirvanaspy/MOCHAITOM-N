import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const List = []
const count = 100
const deployList = []

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    author: '@first',
    reviewer: '@first',
    title: '@title(5, 10)',
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft', 'deleted'],
    display_time: '@datetime',
    pageviews: '@integer(300, 5000)',
    username: /^[a-zA-Z0-9]{6,}$/,
    password: /^[a-zA-Z0-9]{8,12}$/,
    projectName: /^[a-zA-Z0-9]{6,}$/,
    deviceName: /^[a-zA-Z0-9]{6,}$/,
    deviceIP: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
    devicePath: /^([a-zA-Z]:(\\))([a-zA-Z]*)|(\/([a-zA-Z]+))*\/$/,
    'deviceState|1': ['在线', '离线'],
    progress: '@integer(1, 100)',
    compName: /^[a-zA-Z0-9]{6,12}$/,
    deployFileName: /^[a-zA-Z0-9]{6,12}$/,
    'deployState|1': ['部署成功', '部署失败']
  }))
}

for (let i = 0; i < count; i++) {
  deployList.push(Mock.mock({
    id: '@increment',
    compName: /^[a-zA-Z0-9]{6,12}$/,
    deployFileName: /^[a-zA-Z0-9]{6,12}$/,
    'deployState|1': ['部署成功', '部署失败']
  }))
}

export default {
  getList: config => {
    const { importance, type, title, page = 1, limit = 20, sort, username, projectName, deviceName, compName } = param2Obj(config.url)

    let mockList = List.filter(item => {
      if (importance && item.importance !== +importance) return false
      if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      if (username && item.username.indexOf(username) < 0) return false
      if (projectName && item.projectName.indexOf(projectName) < 0) return false
      if (deviceName && item.deviceName.indexOf(deviceName) < 0) return false
      if (compName && item.compName.indexOf(compName) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }

    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      total: mockList.length,
      items: pageList
    }
  },
  getPv: () => ({
    pvData: [{ key: 'PC', pv: 1024 }, { key: 'mobile', pv: 1024 }, { key: 'ios', pv: 1024 }, { key: 'android', pv: 1024 }]
  }),
  getArticle: () => ({
    id: 120000000001,
    author: { key: 'mockPan' },
    source_name: '原创作者',
    category_item: [{ key: 'global', name: '全球' }],
    comment_disabled: true,
    content: '<p>我是测试数据我是测试数据</p><p><img class="wscnph" src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943" data-wscntype="image" data-wscnh="300" data-wscnw="400" data-mce-src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>"',
    content_short: '我是测试数据',
    display_time: +new Date(),
    image_uri: 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3',
    platforms: ['a-platform'],
    source_uri: 'https://github.com/PanJiaChen/vue-element-admin',
    status: 'published',
    tags: [],
    title: 'vue-element-admin'
  }),
  createArticle: () => ({
    data: 'success'
  }),
  updateArticle: () => ({
    data: 'success'
  })
}
