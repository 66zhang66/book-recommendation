<template>
  <div class="staff-books">
    <h2>图书管理</h2>
    <div class="header">
      <button class="add-btn" @click="openAddDialog">+ 添加图书</button>
    </div>
    
    <div class="search-bar">
      <input type="text" v-model="keyword" placeholder="搜索书名或作者" @keyup.enter="handleSearch">
      <button @click="handleSearch">搜索</button>
      <button @click="loadBooks">全部</button>
    </div>
    
    <div class="book-grid">
      <div v-for="book in books" :key="book.id" class="book-card">
        <h3>{{ book.title }}</h3>
        <p>作者：{{ book.author || '未知' }}</p>
        <p>分类：{{ book.category || '未分类' }}</p>
        <p>页数：{{ book.totalPages || 0 }}页</p>
        <p>评分：{{ book.averageRating || 0 }}⭐</p>
        <div class="actions">
          <button class="edit-btn" @click="openEditDialog(book)">编辑</button>
          <button class="delete-btn" @click="handleDeleteBook(book.id)">删除</button>
        </div>
      </div>
    </div>
    
    <!-- 添加/编辑弹窗 -->
    <div v-if="showDialog" class="modal" @click.self="closeDialog">
      <div class="modal-content">
        <h3>{{ isEdit ? '编辑图书' : '添加图书' }}</h3>
        <input v-model="form.title" placeholder="书名" required>
        <input v-model="form.author" placeholder="作者">
        <input v-model="form.category" placeholder="分类">
        <input v-model="form.totalPages" placeholder="页数" type="number">
        <div class="form-group">
          <label>评分 (0-5分)</label>
          <div class="rating-input">
            <input type="number" v-model="form.averageRating" placeholder="0-5" min="0" max="5" step="0.1">
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ active: i <= Math.round(form.averageRating) }">★</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="saveBook">保存</button>
          <button @click="closeDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStaffBookList, staffAddBook, staffUpdateBook, staffDeleteBook, staffSearchBooks } from '../../api/index.js'

const books = ref([])
const keyword = ref('')
const showDialog = ref(false)
const isEdit = ref(false)
const form = ref({ 
  id: null, 
  title: '', 
  author: '', 
  category: '', 
  totalPages: 0,
  averageRating: 0
})

const loadBooks = async () => {
  try {
    const res = await getStaffBookList()
    if (res.code === 200) {
      books.value = res.data
    }
  } catch (error) {
    console.error('加载失败', error)
  }
}

const handleSearch = async () => {
  if (!keyword.value.trim()) {
    loadBooks()
    return
  }
  try {
    const res = await staffSearchBooks(keyword.value)
    if (res.code === 200) {
      books.value = res.data
    }
  } catch (error) {
    console.error('搜索失败', error)
  }
}

const openAddDialog = () => {
  form.value = { id: null, title: '', author: '', category: '', totalPages: 0, averageRating: 0 }
  isEdit.value = false
  showDialog.value = true
}

const openEditDialog = (book) => {
  form.value = { ...book }
  isEdit.value = true
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const saveBook = async () => {
  if (!form.value.title) {
    alert('请输入书名')
    return
  }
  if (form.value.averageRating < 0 || form.value.averageRating > 5) {
    alert('评分必须在0-5之间')
    return
  }
  try {
    let res
    if (isEdit.value) {
      res = await staffUpdateBook(form.value)
    } else {
      res = await staffAddBook(form.value)
    }
    if (res.code === 200) {
      alert(isEdit.value ? '更新成功' : '添加成功')
      closeDialog()
      loadBooks()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('操作失败')
  }
}

const handleDeleteBook = async (id) => {
  if (confirm('确定删除这本书吗？')) {
    try {
      const res = await staffDeleteBook(id)
      if (res.code === 200) {
        alert('删除成功')
        loadBooks()
      } else {
        alert(res.message)
      }
    } catch (error) {
      alert('操作失败')
    }
  }
}

onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
.staff-books {
  padding: 30px;
}
.header {
  margin-bottom: 20px;
}
.add-btn {
  background: #67c23a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.search-bar {
  margin-bottom: 20px;
}
.search-bar input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 250px;
  margin-right: 10px;
}
.search-bar button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 10px;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}
.book-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.book-card h3 {
  margin-bottom: 10px;
  color: #333;
}
.book-card p {
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}
.actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}
.edit-btn {
  background: #409eff;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.delete-btn {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
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
  width: 400px;
}
.modal-content input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}
.rating-input {
  display: flex;
  align-items: center;
  gap: 10px;
}
.rating-input input {
  width: 80px;
  margin-bottom: 0;
}
.stars {
  display: flex;
  gap: 5px;
}
.star {
  font-size: 20px;
  color: #ddd;
}
.star.active {
  color: #ffc107;
}
.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
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