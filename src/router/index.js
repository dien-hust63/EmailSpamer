import Vue from 'vue'
import VueRouter from 'vue-router'
// import routerCustomer from './customer/index.js'
import routerManagement from './management/index'
Vue.use(VueRouter)

const routes = [
  ...routerManagement,
  // ...routerCustomer
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // const publicPages = ['/login', '/register', '/home'];
  // const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('user');

  // trying to access a restricted page + not logged in
  // redirect to login page
  if (!loggedIn && to.path !== '/management/login' && to.path.includes("management")) {
    next('/management/login');
  } else {
    next();
  }
});

export default router
