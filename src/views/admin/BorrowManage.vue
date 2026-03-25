<template>
  <div class="admin-borrow">
    <h2>借阅管理</h2>
    <div class="filters">
      <select v-model="statusFilter">
        <option value="all">全部</option>
        <option value="0">待审核</option>
        <option value="1">借阅中</option>
        <option value="2">已归还</option>
        <option value="3">已拒绝</option>
      </select>
    </div>
    
    <div class="borrow-list">
      <div v-for="item in filteredList" :key="item.id" class="borrow-card">
        <div class="info">
          <p><strong>用户名:</strong> {{ getUserName(item.userId) }}</p>
          <p><strong>书名:</strong> {{ getBookTitle(item.bookId) }}</p>
          <p><strong>借阅日期:</strong> {{ item.borrowDate }}</p>
          <p><strong>应还日期:</strong> {{ item.dueDate }}</p>
          <p v-if="item.returnDate"><strong>归还日期:</strong> {{ item.returnDate }}</p>
          <p><strong>状态:</strong> 
            <span :class="getStatusClass(item.status)">
              {{ getStatusText(item.status) }}
            </span>
          </p>
        </div>
        <div class="actions" v-if="item.status === 0">
          <button @click="handleApprove(item.id)" class="approve">通过</button>
          <button @click="handleReject(item.id)" class="reject">拒绝</button>
        </div>
      </div>
      <div v-if="filteredList.length === 0" class="empty">暂无借阅记录</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getAllBorrowRecords, approveBorrow, rejectBorrow } from '../../api/index.js'
import { getBookList, getAllUsers } from '../../api/index.js'

const borrowList = ref([])
const books = ref([])
const users = ref([])
const statusFilter = ref('all')

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

// 获取书名
const getBookTitle = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  return book ? book.title : '未知图书'
}

// 获取用户名
const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.username : '未知用户'
}

// 筛选借阅记录
const filteredList = computed(() => {
  if (statusFilter.value === 'all') return borrowList.value
  return borrowList.value.filter(item => item.status === parseInt(statusFilter.value))
})

const loadData = async () => {
  try {
    const booksRes = await getBookList()
    if (booksRes.code === 200) {
      books.value = booksRes.data
    }
    
    const usersRes = await getAllUsers()
    if (usersRes.code === 200) {
      users.value = usersRes.data
    }
    
    const res = await getAllBorrowRecords()
    if (res.code === 200) {
      borrowList.value = res.data
    }
  } catch (error) {
    console.error('加载失败', error)
  }
}

const handleApprove = async (id) => {
  try {
    const res = await approveBorrow(id)
    if (res.code === 200) {
      alert('审核通过')
      loadData()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('操作失败')
  }
}

const handleReject = async (id) => {
  try {
    const res = await rejectBorrow(id)
    if (res.code === 200) {
      alert('已拒绝')
      loadData()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('操作失败')
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-borrow {
  padding: 30px;
}
.filters {
  margin-bottom: 20px;
}
.filters select {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}
.borrow-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.info p {
  margin: 5px 0;
  color: #666;
}
.pending { color: #e6a23c; }
.borrowing { color: #409eff; }
.returned { color: #67c23a; }
.rejected { color: #f56c6c; }
.actions button {
  padding: 8px 16px;
  margin-left: 10px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.approve {
  background: #67c23a;
  color: white;
}
.reject {
  background: #f56c6c;
  color: white;
}
.empty {
  text-align: center;
  padding: 60px;
  color: #999;
}
</style>