import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('./../components/Login') },
  {
    path: '/home',
    component: () => import('./../components/Home'),
    redirect: '/users',
    children: [
      { path: '/users', component: () => import('../view/User/User') },
      { path: '/rights', component: () => import('../view/Authority/Rights') },
      { path: '/roles', component: () => import('../view/Authority/Roles') },
      { path: '/goods', component: () => import('../view/Shop/Goods') },
      { path: '/categories', component: () => import('../view/Shop/Categories') },
      { path: '/params', component: () => import('../view/Shop/Params') },
      { path: '/orders', component: () => import('../view/Order/Orders') },
      { path: '/reports', component: () => import('../view/Data/Reports') }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫控制访问页面的需求
router.beforeEach((to, from, next) => {
  // 从sessionStorage中获取保存的token值
  const tokenStr = window.sessionStorage.getItem('token')
  // 注意不能直接单独判断段tokenStr,然后在里面做逻辑操作，这样会死循环
  if (to.path === '/login' && !tokenStr) return next()
  if (!tokenStr) return next('/login')
  if (to.path === '/login' && tokenStr) return next(from.path)
  next()
})
export default router
