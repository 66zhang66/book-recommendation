<template>
  <div class="admin-user">
    <h2>用户管理</h2>
    <table class="user-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>用户名</th>
          <th>邮箱</th>
          <th>角色</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in userList" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>
            <select v-model="user.role" @change="updateRole(user.id, user.role)">
              <option :value="0">普通用户</option>
              <option :value="1">员工</option>
              <option :value="2">管理员</option>
            </select>
          </td>
          <td>
            <span :class="user.status === 1 ? 'active' : 'disabled'">
              {{ user.status === 1 ? '正常' : '禁用' }}
            </span>
          </td>
          <td>
            <button v-if="user.status === 1" @click="toggleStatus(user.id, 0)" class="disable">禁用</button>
            <button v-else @click="toggleStatus(user.id, 1)" class="enable">启用</button>
            <button @click="handleDelete(user.id)" class="delete">删除</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllUsers, updateUserRole, updateUserStatus, deleteUser } from '../../api/index.js'

const userList = ref([])

const loadData = async () => {
  try {
    const res = await getAllUsers()
    if (res.code === 200) {
      userList.value = res.data
    }
  } catch (error) {
    console.error('加载失败', error)
  }
}

const updateRole = async (id, role) => {
  try {
    const res = await updateUserRole(id, role)
    if (res.code === 200) {
      alert('角色更新成功')
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('操作失败')
  }
}

const toggleStatus = async (id, status) => {
  try {
    const res = await updateUserStatus(id, status)
    if (res.code === 200) {
      alert('状态更新成功')
      loadData()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('操作失败')
  }
}

const handleDelete = async (id) => {
  if (confirm('确定删除该用户吗？')) {
    try {
      const res = await deleteUser(id)
      if (res.code === 200) {
        alert('删除成功')
        loadData()
      } else {
        alert(res.message)
      }
    } catch (error) {
      alert('操作失败')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-user {
  padding: 30px;
}
.user-table {
  width: 100%;
  background: white;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;
}
.user-table th, .user-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.user-table th {
  background: #f5f5f5;
  font-weight: 600;
}
.active {
  color: #67c23a;
}
.disabled {
  color: #f56c6c;
}
select {
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
button {
  padding: 4px 8px;
  margin-right: 5px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.disable {
  background: #e6a23c;
  color: white;
}
.enable {
  background: #67c23a;
  color: white;
}
.delete {
  background: #f56c6c;
  color: white;
}
</style>