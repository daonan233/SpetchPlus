import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login/index.vue'
import Home from '@/views/Home/index.vue'
import Selfpage from '@/views/Selfpage/index.vue';
import Chat from '@/views/Chat/index.vue';
import Choose from '@/views/Choose/index.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
   },
    {
      path: '/user',
      name: 'user',
      component: Selfpage,
      //meta: { requiresAuth: true },
    },
	//语音页面
	{
	  path: '/chat',
	  name: 'chat',
	  component: Chat,
	},
	{
	  path: '/choose',
	  name: 'choose',
	  component: Choose,
	},
  {
    path: '/test',
    name: 'test',
    component: () => import('@/views/ScenesChat/index.vue'),
  },
  {
    path: '/test2',
    name: 'test2',
    component: () => import('@/views/Test/index.vue'),
  }
  ]
})


// 创建全局路由守卫
router.beforeEach((to, from, next) => {
  // 1、获取token
  const token = localStorage.getItem('token')
  // 2、判断是否需要登录权限
  if (to.meta.requiresAuth) {
    // 需要登录权限
    if (token) {
      next()
    } else {
      next({
        path: '/login',
        // 保存了用户原本要进入的url，当用户登录后跳转到该url
        query: { redirect: to.fullPath }
      })
    }
  } else {
    // 不需要登录权限，直接进入
    next()
  }
})

export default router
