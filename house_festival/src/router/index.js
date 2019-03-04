import Vue from 'vue'
import Router from 'vue-router'
import routes from './routesList'

Vue.use(Router)

const router = new Router({
  routes
})

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  // document.title = to.meta.title
  // to.meta.metaList.forEach((item, index) => {
  //   document.querySelector(`meta[name="${item.name}"]`).content = item.content
  // })
  next()
})

// router.afterEach((to, from) => {
//   window.scrollTo(0, 0)
// })

export default router
