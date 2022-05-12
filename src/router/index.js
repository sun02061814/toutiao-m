import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path:'/login',
    component:()=>import('@/views/login')
    // 这里是路由懒加载的写法
    // 默认情况下，vue脚手架打包会将所有的vue文件打包到一个文件中，那么此时访问/login,就会把打包之后的总文件加载到内存中，这样做浪费内存空间，访问页面效率也比较低
    // 路由懒加载处理之后，就不会合并打包，默认一个vue文件，打包一个对应的文件
  }
]

const router = new VueRouter({
  routes
})

export default router
