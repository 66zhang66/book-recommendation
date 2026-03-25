<template>
  <div class="books">
    <div class="content">
      <div class="header">
        <h2>图书管理</h2>
      </div>
      
      <div class="search-bar">
        <input type="text" v-model="keyword" placeholder="搜索书名或作者" @keyup.enter="searchBooks">
        <select v-model="selectedCategory" class="category-select">
          <option value="">全部分类</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <button @click="searchBooks">搜索</button>
        <button @click="loadBooks">全部</button>
      </div>
      
      <div class="book-grid">
        <div v-for="book in displayBooks" :key="book.id" class="book-card">
          <h3>{{ book.title }}</h3>
          <p>作者：{{ book.author || '未知' }}</p>
          <p>分类：{{ book.category || '未分类' }}</p>
          <p>页数：{{ book.totalPages || 0 }}页</p>
          <div class="rating" v-if="book.averageRating">
            <span>评分：{{ book.averageRating }}⭐</span>
          </div>
          <div class="actions">
            <button class="collect-btn" :class="{ collected: collectedBooks[book.id] }" @click="toggleCollect(book.id)">
              {{ collectedBooks[book.id] ? '❤️ 已收藏' : '🤍 收藏' }}
            </button>
            <button class="borrow-btn" @click="applyBorrow(book.id)" :disabled="borrowing[book.id]">
              {{ borrowing[book.id] ? '申请中...' : '申请借阅' }}
            </button>
          </div>
        </div>
      </div>
      <div v-if="displayBooks.length === 0" class="empty-tip">暂无图书</div>
    </div>
    
    <div v-if="showDialog" class="modal" @click.self="closeDialog">
      <div class="modal-content">
        <h3>借阅申请</h3>
        <p><strong>书名：</strong> {{ currentBook?.title }}</p>
        <div class="form-group">
          <label>借阅天数</label>
          <input type="number" v-model="borrowDays" min="1" max="30">
        </div>
        <div class="modal-actions">
          <button @click="submitBorrow" :disabled="submitting">提交申请</button>
          <button @click="closeDialog">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getBookList, searchBooks as apiSearch, borrowBook, collectBook, uncollectBook, getCollectedBooks } from '../api/index.js'

const books = ref([])
const keyword = ref('')
const selectedCategory = ref('')
const categories = ref([])
const showDialog = ref(false)
const currentBook = ref(null)
const borrowDays = ref(7)
const submitting = ref(false)
const borrowing = ref({})
const collectedBooks = ref({})

const displayBooks = computed(() => {
  let result = books.value
  if (keyword.value.trim()) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(book => 
      book.title.toLowerCase().includes(kw) || 
      (book.author && book.author.toLowerCase().includes(kw))
    )
  }
  if (selectedCategory.value) {
    result = result.filter(book => book.category === selectedCategory.value)
  }
  return result
})

const loadCollectedStatus = async () => {
  try {
    const res = await getCollectedBooks()
    if (res.code === 200) {
      const ids = res.data
      ids.forEach(id => {
        collectedBooks.value[id] = true
      })
    }
  } catch (error) {
    console.error('加载收藏失败', error)
  }
}

const toggleCollect = async (bookId) => {
  try {
    if (collectedBooks.value[bookId]) {
      const res = await uncollectBook(bookId)
      if (res.code === 200) {
        collectedBooks.value[bookId] = false
        alert('取消收藏成功')
      }
    } else {
      const res = await collectBook(bookId)
      if (res.code === 200) {
        collectedBooks.value[bookId] = true
        alert('收藏成功')
      }
    }
  } catch (error) {
    alert('操作失败')
  }
}

const loadBooks = async () => {
  try {
    const res = await getBookList()
    if (res.code === 200) {
      books.value = res.data
      const cats = [...new Set(books.value.map(b => b.category).filter(c => c))]
      categories.value = cats
    }
  } catch (error) {
    console.error('加载图书失败', error)
  }
}

const searchBooks = async () => {
  if (keyword.value.trim()) {
    try {
      const res = await apiSearch(keyword.value)
      if (res.code === 200) {
        books.value = res.data
        const cats = [...new Set(books.value.map(b => b.category).filter(c => c))]
        categories.value = cats
      }
    } catch (error) {
      console.error('搜索失败', error)
    }
  } else {
    loadBooks()
  }
}

const applyBorrow = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  currentBook.value = book
  borrowDays.value = 7
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  currentBook.value = null
}

const submitBorrow = async () => {
  if (!borrowDays.value || borrowDays.value < 1 || borrowDays.value > 30) {
    alert('请填写有效的借阅天数(1-30天)')
    return
  }
  
  submitting.value = true
  borrowing.value[currentBook.value.id] = true
  
  try {
    const res = await borrowBook({
      bookId: currentBook.value.id,
      days: borrowDays.value
    })
    if (res.code === 200) {
      alert('借阅申请已提交，请等待审核')
      closeDialog()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('申请失败')
  } finally {
    submitting.value = false
    borrowing.value[currentBook.value.id] = false
  }
}

onMounted(() => {
  loadBooks()
  loadCollectedStatus()
})
</script>

<style scoped>
.books {
  padding: 30px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.search-bar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.search-bar input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  width: 200px;
}
.category-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}
.search-bar button {
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
.rating {
  margin: 10px 0;
  color: #ffc107;
}
.actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}
.collect-btn {
  flex: 1;
  padding: 8px;
  background: #a8caa8ff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.collect-btn.collected {
  background: #ff4d4d;
  color: white;
}
.borrow-btn {
  flex: 1;
  padding: 8px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.borrow-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}
.empty-tip {
  text-align: center;
  padding: 60px;
  color: #999;
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
.modal-content h3 {
  margin-bottom: 20px;
}
.modal-content p {
  margin-bottom: 15px;
}
.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}
.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
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
  background: #909990ff;
  color: white;
}
@media (max-width: 768px) {
  .book-grid {
    grid-template-columns: 1fr;
  }
}
</style>