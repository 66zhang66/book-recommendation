<template>
  <div class="register-container">
    <div class="register-card">
      <h2>注册账号</h2>
      <p class="subtitle">加入图书推荐系统</p>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <input type="text" v-model="form.username" placeholder="用户名" required>
        </div>
        <div class="form-group">
          <input type="password" v-model="form.password" placeholder="密码" required>
        </div>
        <div class="form-group">
          <input type="email" v-model="form.email" placeholder="邮箱" required>
        </div>
        <button type="submit" :disabled="loading">{{ loading ? '注册中...' : '注册' }}</button>
      </form>
      <p class="login-link">已有账号？<a href="#" @click.prevent="$router.push('/login')">立即登录</a></p>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      <p v-if="successMsg" class="success">{{ successMsg }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '../api/index.js'  // 改这里：login → register

const router = useRouter()
const loading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const form = reactive({ username: '', password: '', email: '' })

const handleRegister = async () => {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const res = await register(form)  // 改这里：login → register
    if (res.code === 200) {
      successMsg.value = res.data
      setTimeout(() => router.push('/login'), 1500)
    } else {
      errorMsg.value = res.message
    }
  } catch (error) {
    errorMsg.value = '注册失败'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.register-card {
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
.login-link { text-align: center; margin-top: 20px; font-size: 14px; color: #666; }
.login-link a { color: #667eea; text-decoration: none; }
.error { color: #f56c6c; text-align: center; margin-top: 15px; }
.success { color: #67c23a; text-align: center; margin-top: 15px; }
</style>