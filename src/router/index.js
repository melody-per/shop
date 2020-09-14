import Vue from 'vue'
import VueRouter from 'vue-router'
//导入登录组件
import login from '../components/login.vue'
import home from '../components/home.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: login },
  { path: '/home', component: home }
]

const router = new VueRouter({
  routes
});

//导航守卫
router.beforeEach((to, from, next) => {
  // 如果是访问login页面  直接放行
  //to表示将要去的路由地址对象
  //from表示从何处来的路由地址对象
  //next是一个方法
  if(to.path == '/login'){
    next();
  } else {
  const token=sessionStorage.getItem('token');
  // if(token){
  //   next()
  // }else{
  //   next('/login')
  //   }
  if(!token) return next('/login');
  next();
  }
})

export default router
