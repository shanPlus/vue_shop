import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugin/element'
import axios from 'axios'
Vue.config.productionTip = false
// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 请求拦截器
axios.interceptors.request.use(config => {
  // 为请求头对象添加Token验证Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
