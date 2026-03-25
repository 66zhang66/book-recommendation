<template>
  <div class="reading">
    <div class="content">
      <div class="header">
        <h2>我的阅读</h2>
        <button class="add-btn" @click="openAddDialog">+ 添加阅读记录</button>
      </div>
      
      <div class="tabs">
        <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">全部</button>
        <button :class="{ active: activeTab === 'reading' }" @click="activeTab = 'reading'">在读</button>
        <button :class="{ active: activeTab === 'finished' }" @click="activeTab = 'finished'">已读完</button>
        <button :class="{ active: activeTab === 'want' }" @click="activeTab = 'want'">想读</button>
      </div>
      
      <div class="reading-list">
        <div v-for="item in filteredList" :key="item.id" class="reading-card">
          <div class="book-info">
            <h3>{{ item.bookTitle }}</h3>
            <p>作者：{{ item.bookAuthor || '未知' }}</p>
            <p>分类：{{ item.bookCategory || '未分类' }}</p>
            <p v-if="item.bookType === 1" class="private-tag">📘 私人藏书</p>
          </div>
          <div class="reading-info">
            <p>状态：
              <span :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </span>
            </p>
            <p>进度：{{ item.progress || 0 }} / {{ item.bookTotalPages || 0 }} 页</p>
            <p v-if="item.rating">评分：{{ item.rating }}⭐</p>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: getProgressPercent(item) + '%' }"></div>
            </div>
            <div class="actions">
              <button v-if="item.status !== 2" @click="updateProgress(item)">更新进度</button>
              <button v-if="item.status !== 2" @click="markFinished(item)">标记读完</button>
              <button @click="deleteReading(item)">删除</button>
            </div>
          </div>
        </div>
        <div v-if="filteredList.length === 0" class="empty-tip">暂无阅读记录，点击"添加阅读记录"开始记录吧~</div>
      </div>
    </div>
    
    <!-- 添加阅读记录弹窗 -->
    <div v-if="showAddDialog" class="modal" @click.self="closeAddDialog">
      <div class="modal-content">
        <h3>添加阅读记录</h3>
        
        <div class="form-group">
          <label>选择方式</label>
          <div class="radio-group">
            <label>
              <input type="radio" v-model="addType" value="existing"> 从已有图书选择
            </label>
            <label>
              <input type="radio" v-model="addType" value="new"> 新建私人藏书
            </label>
          </div>
        </div>
        
        <div v-if="addType === 'existing'">
          <div class="form-group">
            <label>选择图书</label>
            <select v-model="selectedBookId" class="book-select">
              <option value="">请选择图书</option>
              <option v-for="book in availableBooks" :key="book.id" :value="book.id">
                {{ book.title }} - {{ book.author || '未知作者' }}
              </option>
            </select>
          </div>
        </div>
        
        <div v-if="addType === 'new'">
          <div class="form-group">
            <label>书名 <span class="required">*</span></label>
            <input type="text" v-model="newBook.title" placeholder="请输入书名">
          </div>
          <div class="form-group">
            <label>作者</label>
            <input type="text" v-model="newBook.author" placeholder="请输入作者">
          </div>
          <div class="form-group">
            <label>分类</label>
            <input type="text" v-model="newBook.category" placeholder="请输入分类">
          </div>
          <div class="form-group">
            <label>总页数</label>
            <input type="number" v-model="newBook.totalPages" placeholder="请输入总页数">
          </div>
        </div>
        
        <div class="form-group">
          <label>阅读状态</label>
          <select v-model="newRecord.status">
            <option value="0">想读</option>
            <option value="1">在读</option>
            <option value="2">已读完</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>当前进度（页数）</label>
          <input type="number" v-model="newRecord.progress" placeholder="0" min="0">
        </div>
        
        <div class="form-group">
          <label>评分（1-5分）</label>
          <div class="rating-input">
            <input type="number" v-model="newRecord.rating" placeholder="0-5" min="0" max="5" step="0.1">
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ active: i <= Math.round(newRecord.rating) }">★</span>
            </div>
          </div>
        </div>
        
        <div class="form-group">
          <label>书评</label>
          <textarea v-model="newRecord.review" placeholder="写下你的读书感想..." rows="3"></textarea>
        </div>
        
        <div class="modal-actions">
          <button @click="addReadingRecord" :disabled="submitting">{{ submitting ? '保存中...' : '保存' }}</button>
          <button @click="closeAddDialog">取消</button>
        </div>
      </div>
    </div>
    
    <!-- 更新进度弹窗 -->
    <div v-if="showProgressDialog" class="modal" @click.self="closeProgressDialog">
      <div class="modal-content">
        <h3>更新阅读进度</h3>
        <div class="form-group">
          <label>当前页数</label>
          <input type="number" v-model="progressValue" placeholder="当前页数" min="0">
        </div>
        <div class="form-group">
          <label>评分（1-5分）</label>
          <div class="rating-input">
            <input type="number" v-model="ratingValue" placeholder="0-5" min="0" max="5" step="0.1">
            <div class="stars">
              <span v-for="i in 5" :key="i" class="star" :class="{ active: i <= Math.round(ratingValue) }">★</span>
            </div>
          </div>
        </div>
        <div class="modal-actions">
          <button @click="saveProgress">保存</button>
          <button @click="closeProgressDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getReadingList, getBookList, saveReading, deleteReading as apiDeleteReading, addPrivateBookAndRecord, checkBorrowStatus } from '../api/index.js'

const readingList = ref([])
const books = ref([])
const activeTab = ref('all')
const showAddDialog = ref(false)
const showProgressDialog = ref(false)
const currentItem = ref(null)
const progressValue = ref(0)
const ratingValue = ref(0)
const submitting = ref(false)
const addType = ref('existing')
const selectedBookId = ref('')

// 新增记录表单
const newRecord = ref({
  status: 1,
  progress: 0,
  rating: 0,
  review: ''
})

// 新建图书表单
const newBook = ref({
  title: '',
  author: '',
  category: '',
  totalPages: 0
})

// 可添加的图书
const availableBooks = computed(() => {
  const existingBookIds = readingList.value.map(item => item.bookId)
  return books.value.filter(book => !existingBookIds.includes(book.id))
})

const filteredList = computed(() => {
  if (activeTab.value === 'reading') {
    return readingList.value.filter(item => item.status === 1)
  } else if (activeTab.value === 'finished') {
    return readingList.value.filter(item => item.status === 2)
  } else if (activeTab.value === 'want') {
    return readingList.value.filter(item => item.status === 0)
  }
  return readingList.value
})

const getStatusText = (status) => {
  const map = { 0: '想读', 1: '在读', 2: '已读完' }
  return map[status] || '未知'
}

const getStatusClass = (status) => {
  const map = { 0: 'want', 1: 'reading', 2: 'finished' }
  return map[status] || ''
}

const getProgressPercent = (item) => {
  const total = item.bookTotalPages || 0
  if (total === 0) return 0
  return (item.progress / total) * 100
}

// 触发推荐更新事件
const triggerRecommendUpdate = () => {
  window.dispatchEvent(new Event('reading-updated'))
}

const loadData = async () => {
  try {
    const booksRes = await getBookList()
    if (booksRes.code === 200) {
      books.value = booksRes.data
    }
    
    const readingRes = await getReadingList()
    if (readingRes.code === 200) {
      readingList.value = readingRes.data
    }
  } catch (error) {
    console.error('加载数据失败', error)
  }
}

const openAddDialog = () => {
  addType.value = 'existing'
  selectedBookId.value = ''
  newRecord.value = {
    status: 1,
    progress: 0,
    rating: 0,
    review: ''
  }
  newBook.value = {
    title: '',
    author: '',
    category: '',
    totalPages: 0
  }
  showAddDialog.value = true
}

const closeAddDialog = () => {
  showAddDialog.value = false
}

const addReadingRecord = async () => {
  // 新建私人藏书
  if (addType.value === 'new') {
    if (!newBook.value.title) {
      alert('请输入书名')
      return
    }
    
    submitting.value = true
    try {
      const res = await addPrivateBookAndRecord({
        book: {
          title: newBook.value.title,
          author: newBook.value.author,
          category: newBook.value.category,
          totalPages: newBook.value.totalPages
        },
        record: {
          status: newRecord.value.status,
          progress: newRecord.value.progress,
          rating: newRecord.value.rating,
          review: newRecord.value.review
        }
      })
      if (res.code === 200) {
        alert('添加成功')
        triggerRecommendUpdate()
        closeAddDialog()
        loadData()
      } else {
        alert(res.message)
      }
    } catch (error) {
      alert('添加失败')
    } finally {
      submitting.value = false
    }
    return
  }
  
  // 选择已有图书
  if (!selectedBookId.value) {
    alert('请选择图书')
    return
  }
  
  submitting.value = true
  try {
    const res = await saveReading({
      bookId: selectedBookId.value,
      status: newRecord.value.status,
      progress: newRecord.value.progress,
      rating: newRecord.value.rating,
      review: newRecord.value.review
    })
    if (res.code === 200) {
      alert('添加成功')
      triggerRecommendUpdate()
      closeAddDialog()
      loadData()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('添加失败')
  } finally {
    submitting.value = false
  }
}

const updateProgress = (item) => {
  currentItem.value = item
  progressValue.value = item.progress || 0
  ratingValue.value = item.rating || 0
  showProgressDialog.value = true
}

const closeProgressDialog = () => {
  showProgressDialog.value = false
  currentItem.value = null
}

const saveProgress = async () => {
  if (!currentItem.value) return
  
  try {
    const res = await saveReading({
      bookId: currentItem.value.bookId,
      status: currentItem.value.status,
      progress: progressValue.value,
      rating: ratingValue.value,
      review: currentItem.value.review
    })
    if (res.code === 200) {
      alert('更新成功')
      triggerRecommendUpdate()
      closeProgressDialog()
      loadData()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('更新失败')
  }
}

const markFinished = async (item) => {
  if (confirm('确定标记为已读完吗？')) {
    try {
      const res = await saveReading({
        bookId: item.bookId,
        status: 2,
        progress: item.bookTotalPages || 0,
        rating: item.rating || 5,
        review: item.review
      })
      if (res.code === 200) {
        alert('标记成功')
        triggerRecommendUpdate()
        loadData()
      } else {
        alert(res.message)
      }
    } catch (error) {
      alert('操作失败')
    }
  }
}

const deleteReading = async (item) => {
  const bookId = item.bookId
  const title = item.bookTitle || '这本书'
  
  console.log('删除的书:', title, 'bookId:', bookId)
  
  try {
    const borrowRes = await checkBorrowStatus(bookId)
    console.log('借阅状态返回:', borrowRes)
    
    if (borrowRes.code === 200 && borrowRes.data && borrowRes.data.status === 1) {
      if (confirm(`「${title}」正在借阅中，删除阅读记录会自动归还图书。确定删除吗？`)) {
        const res = await apiDeleteReading(bookId)
        if (res.code === 200) {
          alert('已归还并删除成功')
          triggerRecommendUpdate()
          loadData()
        } else {
          alert(res.message)
        }
      }
    } else {
      if (confirm(`确定删除「${title}」的阅读记录吗？`)) {
        const res = await apiDeleteReading(bookId)
        if (res.code === 200) {
          alert('删除成功')
          triggerRecommendUpdate()
          loadData()
        } else {
          alert(res.message)
        }
      }
    }
  } catch (error) {
    console.error('检查借阅状态失败:', error)
    if (confirm(`确定删除「${title}」的阅读记录吗？`)) {
      const res = await apiDeleteReading(bookId)
      if (res.code === 200) {
        alert('删除成功')
        triggerRecommendUpdate()
        loadData()
      } else {
        alert(res.message)
      }
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.reading {
  padding: 30px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.add-btn {
  background: #5a9e5e;
  color: white;
  border: none;
  border-radius: 30px;
  padding: 8px 20px;
  cursor: pointer;
}
.tabs {
  margin: 20px 0;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.tabs button {
  padding: 8px 20px;
  border: none;
  background: #cce3c7ff;
  cursor: pointer;
  border-radius: 20px;
}
.tabs button.active {
  background: #5a9e5e;
  color: white;
}
.reading-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.reading-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.book-info h3 {
  margin-bottom: 8px;
  color: #333;
}
.book-info p {
  color: #666;
  font-size: 14px;
  margin-bottom: 5px;
}
.private-tag {
  font-size: 12px;
  color: #e6a23c;
  margin-top: 5px;
}
.reading-info {
  text-align: right;
  min-width: 200px;
}
.reading-info p {
  margin-bottom: 8px;
}
.progress-bar {
  width: 150px;
  height: 6px;
  background: #eee;
  border-radius: 10px;
  margin: 10px 0;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: #5a9e5e;
  transition: width 0.3s;
}
.want { color: #909399; }
.reading { color: #409eff; }
.finished { color: #67c23a; }
.actions button {
  margin-left: 10px;
  padding: 5px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: #cce3c7ff;
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
  border-radius: 16px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-content h3 {
  margin-bottom: 20px;
  color: #2c5a2e;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
  font-weight: 500;
}
.required {
  color: #e67e22;
}
.radio-group {
  display: flex;
  gap: 20px;
}
.radio-group label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
  cursor: pointer;
}
.form-group select,
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
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
  background: #5a9e5e;
  color: white;
}
.modal-actions button:last-child {
  background: #909399;
  color: white;
}
.empty-tip {
  text-align: center;
  padding: 60px;
  color: #999;
}
</style>