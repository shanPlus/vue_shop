import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('./../components/Login') },
  { path: '/home', component: () => import('./../components/Home') }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫控制访问页面的需求
router.beforeEach((to, from, next) => {
  console.log(to)
  if (to.path === '/login') return next()
  // 从sessionStorage中获取保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
  // 退出就是清除客户端的token就可以了, window,sessionStorage.clear()
})
export default router
