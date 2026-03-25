<template>
  <div class="admin-announcement">
    <h2>公告管理</h2>
    <button class="add-btn" @click="openAddDialog">+ 添加公告</button>
    
    <div class="announcement-list">
      <div v-for="item in list" :key="item.id" class="announcement-card">
        <div class="info">
          <h3>{{ item.title }}</h3>
          <p>{{ item.content }}</p>
          <p class="time">{{ formatDate(item.createdAt) }}</p>
        </div>
        <div class="actions">
          <button @click="openEditDialog(item)" class="edit">编辑</button>
          <button @click="handleDelete(item.id)" class="delete">删除</button>
        </div>
      </div>
    </div>
    
    <div v-if="showDialog" class="modal" @click.self="closeDialog">
      <div class="modal-content">
        <h3>{{ isEdit ? '编辑公告' : '添加公告' }}</h3>
        <input v-model="form.title" placeholder="标题">
        <textarea v-model="form.content" placeholder="内容" rows="5"></textarea>
        <div class="modal-actions">
          <button @click="save">保存</button>
          <button @click="closeDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../api/index.js'

const list = ref([])
const showDialog = ref(false)
const isEdit = ref(false)
const form = ref({ id: null, title: '', content: '', status: 1 })

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const loadData = async () => {
  try {
    const res = await getAllAnnouncements()
    if (res.code === 200) {
      list.value = res.data
    }
  } catch (error) {
    console.error('加载失败', error)
  }
}

const openAddDialog = () => {
  form.value = { id: null, title: '', content: '', status: 1 }
  isEdit.value = false
  showDialog.value = true
}

const openEditDialog = (item) => {
  form.value = { ...item }
  isEdit.value = true
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const save = async () => {
  if (!form.value.title) {
    alert('请输入标题')
    return
  }
  try {
    let res
    if (isEdit.value) {
      res = await updateAnnouncement(form.value)
    } else {
      res = await addAnnouncement(form.value)
    }
    if (res.code === 200) {
      alert(isEdit.value ? '更新成功' : '添加成功')
      closeDialog()
      loadData()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('操作失败')
  }
}

const handleDelete = async (id) => {
  if (confirm('确定删除该公告吗？')) {
    try {
      const res = await deleteAnnouncement(id)
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
.admin-announcement {
  padding: 30px;
}
.add-btn {
  margin-bottom: 20px;
  padding: 10px 20px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.announcement-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.info {
  flex: 1;
}
.info h3 {
  margin-bottom: 10px;
  color: #333;
}
.info p {
  color: #666;
  margin: 5px 0;
}
.time {
  font-size: 12px;
  color: #999;
}
.actions button {
  padding: 6px 12px;
  margin-left: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.edit {
  background: #409eff;
  color: white;
}
.delete {
  background: #f56c6c;
  color: white;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 500px;
}
.modal-content input, .modal-content textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}
.modal-actions button {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.modal-actions button:first-child {
  background: #409eff;
  color: white;
}
.modal-actions button:last-child {
  background: #909399;
  color: white;
}
</style>