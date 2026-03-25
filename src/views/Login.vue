<template>
  <div class="login-container">
    <div class="login-card">
      <h2>图书管理与推荐系统</h2>
      <p class="subtitle">个性化图书管理与推荐</p>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <input type="text" v-model="form.username" placeholder="用户名" required>
        </div>
        <div class="form-group">
          <input type="password" v-model="form.password" placeholder="密码" required>
        </div>
        <button type="submit" :disabled="loading">{{ loading ? '登录中...' : '登录' }}</button>
      </form>
      <p class="register-link">还没有账号？<a href="#" @click.prevent="$router.push('/register')">立即注册</a></p>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { login } from '../api/index.js'

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const form = reactive({ username: '', password: '' })

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const res = await login(form)
    if (res.code === 200) {
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify({
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        role: res.data.role || 0
      }))
      
      // 根据角色跳转到不同首页
      const role = res.data.role || 0
      if (role === 0) {
        router.push('/home')
      } else if (role === 1) {
        router.push('/staff/home')
      } else if (role === 2) {
        router.push('/admin/home')
      } else {
        router.push('/home')
      }
    } else {
      errorMsg.value = res.message
    }
  } catch (error) {
    errorMsg.value = '登录失败，请稍后重试'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  width: 100%;
  max-width: 400px;
}
h2 { text-align: center; color: #333; margin-bottom: 10px; }
.subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 14px; }
.form-group { margin-bottom: 20px; }
input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
input:focus { border-color: #667eea; }
button {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.register-link { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }
.register-link a { color: #667eea; text-decoration: none; }
.error { color: #f56c6c; text-align: center; margin-top: 15px; }
</style>