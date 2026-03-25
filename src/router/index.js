import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // 用户端路由
  { path: '/', redirect: '/login' },
  { path: '/login', component: () => import('../views/Login.vue') },
  { path: '/register', component: () => import('../views/Register.vue') },
  { path: '/home', component: () => import('../views/Home.vue'), meta: { requiresAuth: true } },
  { path: '/books', component: () => import('../views/Books.vue'), meta: { requiresAuth: true } },
  { path: '/reading', component: () => import('../views/Reading.vue'), meta: { requiresAuth: true } },
  { path: '/recommend', component: () => import('../views/Recommend.vue'), meta: { requiresAuth: true } },
  { path: '/profile', component: () => import('../views/UserProfile.vue'), meta: { requiresAuth: true } },
  { path: '/borrow', component: () => import('../views/BorrowList.vue'), meta: { requiresAuth: true } },
  { path: '/collect', component: () => import('../views/CollectList.vue'), meta: { requiresAuth: true } },
  { path: '/reviews', component: () => import('../views/MyReviews.vue'), meta: { requiresAuth: true } },
  { path: '/customer', component: () => import('../views/CustomerService.vue'), meta: { requiresAuth: true } },
  { path: '/announcements', component: () => import('../views/Announcements.vue'), meta: { requiresAuth: true } },
  { path: '/notes', component: () => import('../views/BookNotes.vue'), meta: { requiresAuth: true } },
  
  // 员工端路由
  { path: '/staff/home', component: () => import('../views/staff/Home.vue'), meta: { requiresAuth: true, role: 1 } },
  { path: '/staff/books', component: () => import('../views/staff/Books.vue'), meta: { requiresAuth: true, role: 1 } },
  { path: '/staff/borrow', component: () => import('../views/staff/BorrowManage.vue'), meta: { requiresAuth: true, role: 1 } },
  { path: '/staff/return', component: () => import('../views/staff/ReturnManage.vue'), meta: { requiresAuth: true, role: 1 } },
  { path: '/staff/review', component: () => import('../views/staff/ReviewManage.vue'), meta: { requiresAuth: true, role: 1 } },
  { path: '/staff/customer', component: () => import('../views/staff/CustomerManage.vue'), meta: { requiresAuth: true, role: 1 } },
  
  // 管理端路由
  { path: '/admin/home', component: () => import('../views/admin/Home.vue'), meta: { requiresAuth: true, role: 2 } },
  { path: '/admin/announcement', component: () => import('../views/admin/AnnouncementManage.vue'), meta: { requiresAuth: true, role: 2 } },
  { path: '/admin/user', component: () => import('../views/admin/UserManage.vue'), meta: { requiresAuth: true, role: 2 } },
  { path: '/admin/books', component: () => import('../views/admin/Books.vue'), meta: { requiresAuth: true, role: 2 } },
  { path: '/admin/borrow', component: () => import('../views/admin/BorrowManage.vue'), meta: { requiresAuth: true, role: 2 } },
  { path: '/admin/return', component: () => import('../views/admin/ReturnManage.vue'), meta: { requiresAuth: true, role: 2 } },
  { path: '/admin/review', component: () => import('../views/admin/ReviewManage.vue'), meta: { requiresAuth: true, role: 2 } },
  { path: '/admin/statistics', component: () => import('../views/admin/Statistics.vue'), meta: { requiresAuth: true, role: 2 } },
  { path: '/admin/customer', component: () => import('../views/admin/CustomerManage.vue'), meta: { requiresAuth: true, role: 2 } }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userStr = localStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  const userRole = user ? user.role : 0
  
  // 检查是否需要登录
  if (to.meta.requiresAuth && !token) {
    next('/login')
    return
  }
  
  // 检查角色权限
  if (to.meta.role !== undefined && userRole !== to.meta.role) {
    // 无权限访问，根据角色跳转
    if (userRole === 1) {
      next('/staff/home')
    } else if (userRole === 2) {
      next('/admin/home')
    } else {
      next('/home')
    }
    return
  }
  
  next()
})

export default router