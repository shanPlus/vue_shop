import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugin/element'
import axios from 'axios'
// 这个插件用于商品分类的下拉菜单,然后全局注册
import TreeTable from 'vue-table-with-tree-grid'
// 富文本编辑器， 也就是写信的那个东西
import QuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
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
// 注册为全局可用组件
Vue.component('zk-table', TreeTable)
// 将富文本注册为全局可用的组件
Vue.use(QuillEditor)
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
