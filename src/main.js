import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'

// 导入样式
import './styles/user.css'
import './styles/staff.css'
import './styles/admin.css'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)

// 根据用户角色动态切换主题
const userStr = localStorage.getItem('user')
const user = userStr ? JSON.parse(userStr) : null
const role = user ? user.role : 0

if (role === 0) {
  document.body.classList.add('user-theme')
} else if (role === 1) {
  document.body.classList.add('staff-theme')
} else if (role === 2) {
  document.body.classList.add('admin-theme')
}

app.mount('#app')