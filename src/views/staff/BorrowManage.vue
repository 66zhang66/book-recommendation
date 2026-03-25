<template>
  <div class="staff-borrow">
    <h2>借阅审核</h2>
    <div class="borrow-list">
      <div v-for="item in borrowList" :key="item.id" class="borrow-card">
        <div class="info">
          <p><strong>用户名:</strong> {{ getUserName(item.userId) }}</p>
          <p><strong>书名:</strong> {{ getBookTitle(item.bookId) }}</p>
          <p><strong>借阅日期:</strong> {{ item.borrowDate }}</p>
          <p><strong>应还日期:</strong> {{ item.dueDate }}</p>
          <p><strong>状态:</strong> 
            <span :class="item.status === 0 ? 'pending' : item.status === 1 ? 'approved' : 'rejected'">
              {{ item.status === 0 ? '待审核' : item.status === 1 ? '已通过' : '已拒绝' }}
            </span>
          </p>
        </div>
        <div class="actions" v-if="item.status === 0">
          <button @click="handleApprove(item.id)" class="approve">通过</button>
          <button @click="handleReject(item.id)" class="reject">拒绝</button>
        </div>
      </div>
      <div v-if="borrowList.length === 0" class="empty">暂无借阅申请</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getStaffBorrowList, approveBorrow, rejectBorrow } from '../../api/index.js'
import { getBookList, getAllUsers } from '../../api/index.js'

const borrowList = ref([])
const books = ref([])
const users = ref([])

const getBookTitle = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  return book ? book.title : '未知图书'
}

const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.username : '未知用户'
}

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
    
    const res = await getStaffBorrowList()
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
.staff-borrow {
  padding: 30px;
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
.approved { color: #67c23a; }
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