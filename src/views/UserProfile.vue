<template>
  <div>
    <div class="content">
      <div class="profile-card">
        <h2>个人中心</h2>
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="userInfo.username" disabled>
        </div>
        <div class="form-group">
          <label>昵称</label>
          <input type="text" v-model="userInfo.nickname" placeholder="请输入昵称">
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input type="email" v-model="userInfo.email" placeholder="请输入邮箱">
        </div>
        <div class="form-group">
          <label>手机号</label>
          <input type="tel" v-model="userInfo.phone" placeholder="请输入手机号">
        </div>
        <div class="form-group">
          <label>性别</label>
          <select v-model="userInfo.gender">
            <option value="0">未知</option>
            <option value="1">男</option>
            <option value="2">女</option>
          </select>
        </div>
        <button @click="updateProfile" :disabled="loading">
          {{ loading ? '保存中...' : '保存修改' }}
        </button>
        <p v-if="successMsg" class="success">{{ successMsg }}</p>
        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
      </div>
      
      <div class="change-pwd">
        <h3>修改密码</h3>
        <div class="form-group">
          <input type="password" v-model="pwdForm.oldPassword" placeholder="原密码">
        </div>
        <div class="form-group">
          <input type="password" v-model="pwdForm.newPassword" placeholder="新密码">
        </div>
        <div class="form-group">
          <input type="password" v-model="pwdForm.confirmPassword" placeholder="确认新密码">
        </div>
        <button @click="handleChangePassword">修改密码</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUserInfo, updateUserInfo, changePassword } from '../api/index.js'

const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')
const userInfo = ref({
  username: '',
  nickname: '',
  email: '',
  phone: '',
  gender: 0
})
const pwdForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const loadUserInfo = async () => {
  try {
    const res = await getUserInfo()
    if (res.code === 200) {
      userInfo.value = res.data
    }
  } catch (error) {
    console.error('加载用户信息失败', error)
  }
}

const updateProfile = async () => {
  loading.value = true
  successMsg.value = ''
  errorMsg.value = ''
  try {
    const res = await updateUserInfo(userInfo.value)
    if (res.code === 200) {
      successMsg.value = '保存成功'
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.nickname = userInfo.value.nickname
      user.email = userInfo.value.email
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      errorMsg.value = res.message
    }
  } catch (error) {
    errorMsg.value = '保存失败'
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  if (pwdForm.value.newPassword !== pwdForm.value.confirmPassword) {
    errorMsg.value = '两次输入的新密码不一致'
    return
  }
  loading.value = true
  errorMsg.value = ''
  try {
    const res = await changePassword({
      oldPassword: pwdForm.value.oldPassword,
      newPassword: pwdForm.value.newPassword
    })
    if (res.code === 200) {
      successMsg.value = '密码修改成功，请重新登录'
      setTimeout(() => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }, 2000)
    } else {
      errorMsg.value = res.message
    }
  } catch (error) {
    errorMsg.value = '修改失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserInfo()
})
</script>

<style scoped>
.content {
  padding: 30px;
  max-width: 600px;
  margin: 0 auto;
}
.profile-card, .change-pwd {
  background: white;
  padding: 30px;
  border-radius: 16px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
h2, h3 {
  margin-bottom: 20px;
  color: #333;
}
.form-group {
  margin-bottom: 20px;
}
label {
  display: block;
  margin-bottom: 8px;
  color: #666;
}
input, select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
input:focus, select:focus {
  border-color: #667eea;
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
.success {
  color: #67c23a;
  text-align: center;
  margin-top: 15px;
}
.error {
  color: #f56c6c;
  text-align: center;
  margin-top: 15px;
}
</style>