import Vue from 'vue'
import uploader from 'vue-simple-uploader'
/* eslint-disable */
Vue.use(uploader)

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'

import i18n from './lang' // Internationalization
import './icons' // icon
import './errorLog'// error log
import './permission' // permission control
import './mock' // simulation data

import '@/ztree/js/jquery-1.4.4.min.js'
import '@/ztree/js/jquery.ztree.core.js'
import '@/ztree/js/jquery.ztree.exedit.js'
import '@/ztree/js/jquery.ztree.exhide.js'

import * as filters from './filters' // global filters

Vue.use(Element, {
  size: 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  template: '<App/>',
  components: { App }
})
