<template>
  <div>
    
    <div class="content">
      <h2>我的借阅记录</h2>
      
      <div class="tabs">
        <button :class="{ active: activeTab === 'all' }" @click="activeTab = 'all'">全部</button>
        <button :class="{ active: activeTab === 'pending' }" @click="activeTab = 'pending'">待审核</button>
        <button :class="{ active: activeTab === 'borrowing' }" @click="activeTab = 'borrowing'">借阅中</button>
        <button :class="{ active: activeTab === 'returned' }" @click="activeTab = 'returned'">已归还</button>
        <button :class="{ active: activeTab === 'rejected' }" @click="activeTab = 'rejected'">已拒绝</button>
      </div>
      
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else class="borrow-list">
        <div v-for="item in filteredList" :key="item.id" class="borrow-card">
          <div class="book-info">
            <h3>{{ getBookTitle(item.bookId) }}</h3>
            <p>借阅日期：{{ item.borrowDate }}</p>
            <p>应还日期：{{ item.dueDate }}</p>
            <p v-if="item.returnDate">归还日期：{{ item.returnDate }}</p>
            <p><strong>状态：</strong> 
              <span :class="getStatusClass(item.status)">
                {{ getStatusText(item.status) }}
              </span>
            </p>
          </div>
          <div class="borrow-info">
            <button v-if="item.status === 1" @click="returnBook(item.id)" class="return-btn">归还图书</button>
            <button v-if="item.status === 0" class="pending-btn" disabled>等待审核</button>
            <button v-if="item.status === 3" class="rejected-btn" disabled>已拒绝</button>
            <button v-if="item.status === 2" class="returned-btn" disabled>已归还</button>
          </div>
        </div>
        <div v-if="filteredList.length === 0" class="empty-tip">暂无借阅记录</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getBorrowList, returnBook as apiReturnBook, getBookList } from '../api/index.js'

const router = useRouter()
const loading = ref(true)
const borrowList = ref([])
const books = ref([])
const activeTab = ref('all')

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
}

// 状态映射文字
const getStatusText = (status) => {
  const map = { 
    0: '待审核', 
    1: '借阅中', 
    2: '已归还', 
    3: '已拒绝' 
  }
  return map[status] || '未知'
}

// 状态映射样式类
const getStatusClass = (status) => {
  const map = { 
    0: 'pending', 
    1: 'borrowing', 
    2: 'returned', 
    3: 'rejected' 
  }
  return map[status] || ''
}

// 筛选借阅记录
const filteredList = computed(() => {
  if (activeTab.value === 'all') {
    return borrowList.value
  } else if (activeTab.value === 'pending') {
    return borrowList.value.filter(item => item.status === 0)
  } else if (activeTab.value === 'borrowing') {
    return borrowList.value.filter(item => item.status === 1)
  } else if (activeTab.value === 'returned') {
    return borrowList.value.filter(item => item.status === 2)
  } else if (activeTab.value === 'rejected') {
    return borrowList.value.filter(item => item.status === 3)
  }
  return borrowList.value
})

const getBookTitle = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  return book ? book.title : '未知图书'
}

const loadData = async () => {
  loading.value = true
  try {
    const booksRes = await getBookList()
    if (booksRes.code === 200) {
      books.value = booksRes.data
    }
    
    const borrowRes = await getBorrowList()
    if (borrowRes.code === 200) {
      borrowList.value = borrowRes.data
    }
  } catch (error) {
    console.error('加载数据失败', error)
  } finally {
    loading.value = false
  }
}

const returnBook = async (borrowId) => {
  if (confirm('确定要归还这本书吗？')) {
    try {
      const res = await apiReturnBook(borrowId)
      if (res.code === 200) {
        alert('归还成功')
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
.navbar {
  background: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  flex-wrap: wrap;
}
.nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}
.nav-links a {
  text-decoration: none;
  color: #666;
}
.nav-links a:hover {
  color: #667eea;
}
.content {
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
}
h2 {
  margin-bottom: 20px;
}
.tabs {
  margin: 20px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
.tabs button {
  padding: 8px 20px;
  border: none;
  background: #b793f9ff;
  cursor: pointer;
  border-radius: 20px;
}
.tabs button.active {
  background: #667eea;
  color: white;
}
.borrow-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.borrow-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
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
.borrow-info {
  text-align: right;
}
.pending { color: #e6a23c; }
.borrowing { color: #409eff; }
.returned { color: #67c23a; }
.rejected { color: #f56c6c; }
.return-btn {
  background: #409eff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.pending-btn {
  background: #e6a23c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: not-allowed;
}
.rejected-btn {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: not-allowed;
}
.returned-btn {
  background: #67c23a;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: not-allowed;
}
.empty-tip, .loading {
  text-align: center;
  color: #999;
  padding: 60px;
}
</style>