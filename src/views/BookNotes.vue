<template>
  <div class="book-notes">
    <div class="header">
      <h2>📖 我的读书笔记</h2>
      <button class="add-btn" @click="openAddDialog">+ 写笔记</button>
    </div>
    
    <!-- 筛选和排序 -->
    <div class="filters">
      <div class="filter-group">
        <label>筛选图书：</label>
        <select v-model="selectedBookId" @change="loadNotes">
          <option value="">全部图书</option>
          <option v-for="book in books" :key="book.id" :value="book.id">
            {{ book.title }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>排序方式：</label>
        <select v-model="sortType" @change="sortNotes">
          <option value="newest">最新优先</option>
          <option value="oldest">最早优先</option>
          <option value="page">按页码排序</option>
        </select>
      </div>
    </div>
    
    <!-- 统计信息 -->
    <div class="stats" v-if="notes.length > 0">
      <span>共 {{ notes.length }} 条笔记</span>
      <span v-if="selectedBookId"> - 《{{ getBookTitle(selectedBookId) }}》</span>
    </div>
    
    <!-- 笔记列表 -->
    <div v-if="notes.length > 0" class="notes-list">
      <div v-for="note in sortedNotes" :key="note.id" class="note-card">
        <div class="note-header">
          <div class="note-title-section">
            <h3>{{ note.title || '无标题' }}</h3>
            <span class="book-tag">{{ getBookTitle(note.bookId) }}</span>
          </div>
          <div class="note-actions">
            <button class="edit-btn" @click="openEditDialog(note)">编辑</button>
            <button class="delete-btn" @click="handleDeleteNote(note.id)">删除</button>
          </div>
        </div>
        <p class="note-page" v-if="note.page">📍 第 {{ note.page }} 页</p>
        <p class="note-content">{{ note.content }}</p>
        <div class="note-footer">
          <span class="note-time">{{ formatDate(note.createdAt) }}</span>
          <span v-if="note.updatedAt !== note.createdAt" class="note-updated">(更新于 {{ formatDate(note.updatedAt) }})</span>
        </div>
      </div>
    </div>
    <div v-else class="empty-tip">
      <p>✍️ 暂无笔记</p>
      <p>点击"写笔记"开始记录你的阅读感悟吧~</p>
    </div>
    
    <!-- 添加/编辑笔记弹窗 -->
    <div v-if="showDialog" class="modal-overlay" @click.self="closeDialog">
      <div class="modal-container">
        <div class="modal-header">
          <h3>{{ isEdit ? '✏️ 编辑笔记' : '📝 写笔记' }}</h3>
          <button class="close-btn" @click="closeDialog">×</button>
        </div>
        <div class="modal-body">
          <div class="form-item">
            <label>选择图书 <span class="required">*</span></label>
            <select v-model="form.bookId" :disabled="isEdit" class="form-select">
              <option value="">请选择图书</option>
              <option v-for="book in books" :key="book.id" :value="book.id">
                {{ book.title }}
              </option>
            </select>
          </div>
          <div class="form-item">
            <label>笔记标题</label>
            <input type="text" v-model="form.title" placeholder="给笔记起个标题" class="form-input">
          </div>
          <div class="form-item">
            <label>页码</label>
            <input type="number" v-model="form.page" placeholder="可选" class="form-input">
          </div>
          <div class="form-item">
            <label>笔记内容 <span class="required">*</span></label>
            <textarea v-model="form.content" placeholder="写下你的阅读感悟..." rows="6" class="form-textarea"></textarea>
          </div>
          <div class="form-item checkbox">
            <label>
              <input type="checkbox" v-model="form.isPrivate"> 🔒 私密笔记（仅自己可见）
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeDialog">取消</button>
          <button class="btn-save" @click="saveNote" :disabled="submitting">{{ submitting ? '保存中...' : '保存笔记' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getBookList, getBookNotes, addNote, updateNote, deleteNote, getAllNotes } from '../api/index.js'

const books = ref([])
const notes = ref([])
const allNotes = ref([])  // 存储所有笔记
const selectedBookId = ref('')
const sortType = ref('newest')
const showDialog = ref(false)
const isEdit = ref(false)
const submitting = ref(false)
const form = ref({
  id: null,
  bookId: '',
  title: '',
  content: '',
  page: null,
  isPrivate: 1
})

// 获取书名
const getBookTitle = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  return book ? book.title : '未知图书'
}

// 排序后的笔记
const sortedNotes = computed(() => {
  let result = [...notes.value]
  if (sortType.value === 'newest') {
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  } else if (sortType.value === 'oldest') {
    result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  } else if (sortType.value === 'page') {
    result.sort((a, b) => (a.page || 0) - (b.page || 0))
  }
  return result
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('zh-CN')
}

// 加载所有图书
const loadBooks = async () => {
  try {
    const res = await getBookList()
    if (res.code === 200) {
      books.value = res.data
    }
  } catch (error) {
    console.error('加载图书失败', error)
  }
}

// 加载笔记
const loadNotes = async () => {
  try {
    let res
    if (selectedBookId.value) {
      // 按图书筛选
      res = await getBookNotes(selectedBookId.value)
    } else {
      // 获取全部笔记
      res = await getAllNotes()
    }
    if (res.code === 200) {
      notes.value = res.data
    }
  } catch (error) {
    console.error('加载笔记失败', error)
  }
}

const openAddDialog = () => {
  form.value = {
    id: null,
    bookId: selectedBookId.value || '',
    title: '',
    content: '',
    page: null,
    isPrivate: 1
  }
  isEdit.value = false
  showDialog.value = true
}

const openEditDialog = (note) => {
  form.value = { ...note }
  isEdit.value = true
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
}

const saveNote = async () => {
  if (!form.value.bookId) {
    alert('请选择图书')
    return
  }
  if (!form.value.content || !form.value.content.trim()) {
    alert('请输入笔记内容')
    return
  }
  
  submitting.value = true
  try {
    let res
    const noteData = {
      bookId: form.value.bookId,
      title: form.value.title || '',
      content: form.value.content,
      page: form.value.page || 0,
      isPrivate: form.value.isPrivate ? 1 : 0
    }
    
    if (isEdit.value) {
      noteData.id = form.value.id
      res = await updateNote(noteData)
    } else {
      res = await addNote(noteData)
    }
    
    if (res.code === 200) {
      alert(isEdit.value ? '更新成功' : '添加成功')
      closeDialog()
      loadNotes()
    } else {
      alert(res.message || '操作失败')
    }
  } catch (error) {
    console.error('保存失败', error)
    alert('操作失败，请稍后重试')
  } finally {
    submitting.value = false
  }
}

const handleDeleteNote = async (id) => {
  if (confirm('确定删除这条笔记吗？')) {
    try {
      const res = await deleteNote(id)
      if (res.code === 200) {
        alert('删除成功')
        loadNotes()
      } else {
        alert(res.message || '删除失败')
      }
    } catch (error) {
      alert('操作失败')
    }
  }
}

const sortNotes = () => {
  // 触发排序（computed 会自动响应）
}

onMounted(() => {
  loadBooks()
  loadNotes()
})
</script>

<style scoped>
.book-notes {
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 15px;
}

.header h2 {
  color: #2c5a2e;
  font-size: 1.8rem;
}

.add-btn {
  background: #5a9e5e;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 10px 24px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #488a4c;
  transform: translateY(-2px);
}

.filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  background: white;
  padding: 15px 20px;
  border-radius: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  color: #666;
  font-size: 14px;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.stats {
  margin-bottom: 20px;
  padding: 10px 0;
  color: #888;
  font-size: 13px;
  border-bottom: 1px solid #eee;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.note-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: all 0.2s;
}

.note-card:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}

.note-title-section {
  flex: 1;
}

.note-title-section h3 {
  color: #2c5a2e;
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 6px;
}

.book-tag {
  display: inline-block;
  background: #e8f0e8;
  color: #5a9e5e;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
}

.note-actions {
  display: flex;
  gap: 10px;
}

.note-actions button {
  padding: 5px 14px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.edit-btn {
  background: #e8f0e8;
  color: #5a9e5e;
}

.edit-btn:hover {
  background: #5a9e5e;
  color: white;
}

.delete-btn {
  background: #ffe5e5;
  color: #e67e22;
}

.delete-btn:hover {
  background: #e67e22;
  color: white;
}

.note-page {
  color: #999;
  font-size: 12px;
  margin-bottom: 12px;
}

.note-content {
  color: #333;
  line-height: 1.7;
  margin-bottom: 12px;
  white-space: pre-wrap;
  word-break: break-word;
}

.note-footer {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.note-time {
  color: #bbb;
  font-size: 11px;
}

.note-updated {
  color: #ccc;
  font-size: 10px;
}

.empty-tip {
  text-align: center;
  padding: 80px 20px;
  color: #999;
  font-size: 15px;
}

.empty-tip p:first-child {
  font-size: 48px;
  margin-bottom: 16px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-container {
  background: white;
  border-radius: 24px;
  width: 550px;
  max-width: 90%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #eee;
  background: #f9fafb;
}

.modal-header h3 {
  color: #2c5a2e;
  font-size: 1.3rem;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #666;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.form-item {
  margin-bottom: 20px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
  font-size: 14px;
}

.required {
  color: #e67e22;
}

.form-select,
.form-input,
.form-textarea {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  transition: all 0.2s;
  font-family: inherit;
}

.form-select:focus,
.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #5a9e5e;
  box-shadow: 0 0 0 3px rgba(90, 158, 94, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.checkbox {
  display: flex;
  align-items: center;
}

.checkbox label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-bottom: 0;
}

.checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #eee;
  background: #f9fafb;
}

.modal-footer button {
  padding: 10px 24px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-save {
  background: #5a9e5e;
  color: white;
}

.btn-save:hover {
  background: #488a4c;
  transform: translateY(-1px);
}

.btn-save:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
</style>