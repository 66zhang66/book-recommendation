<template>
  <div class="admin-review">
    <h2>评论管理</h2>
    <div class="review-list">
      <div v-for="item in reviews" :key="item.id" class="review-card">
        <div class="info">
          <p><strong>用户名:</strong> {{ getUserName(item.userId) }}</p>
          <p><strong>书名:</strong> {{ getBookTitle(item.bookId) }}</p>
          <p><strong>评分:</strong> {{ item.rating }}⭐</p>
          <p><strong>评价:</strong> {{ item.content }}</p>
          <p><strong>时间:</strong> {{ formatDate(item.createdAt) }}</p>
        </div>
        <div class="reply-area" v-if="!item.reply">
          <textarea v-model="replyContent[item.id]" placeholder="输入回复..."></textarea>
          <button @click="handleReply(item.id)">回复</button>
        </div>
        <div class="reply" v-else>
          <p><strong>已回复:</strong> {{ item.reply }}</p>
        </div>
      </div>
      <div v-if="reviews.length === 0" class="empty">暂无评价</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllReviews, replyReview, getAllUsers, getBookList } from '../../api/index.js'

const reviews = ref([])
const users = ref([])
const books = ref([])  // 存储图书列表
const replyContent = ref({})

// 获取用户名
const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.username : `用户${userId}`
}

// 获取书名
const getBookTitle = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  return book ? book.title : `图书${bookId}`
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

// 获取所有用户信息
const loadUsers = async () => {
  try {
    const res = await getAllUsers()
    if (res.code === 200) {
      users.value = res.data
    }
  } catch (error) {
    console.error('获取用户列表失败', error)
  }
}

// 获取所有图书信息
const loadBooks = async () => {
  try {
    const res = await getBookList()
    if (res.code === 200) {
      books.value = res.data
    }
  } catch (error) {
    console.error('获取图书列表失败', error)
  }
}

const loadData = async () => {
  try {
    const res = await getAllReviews()
    if (res.code === 200) {
      reviews.value = res.data
    }
  } catch (error) {
    console.error('加载失败', error)
  }
}

const handleReply = async (id) => {
  if (!replyContent.value[id]) {
    alert('请输入回复内容')
    return
  }
  try {
    const res = await replyReview({ reviewId: id, reply: replyContent.value[id] })
    if (res.code === 200) {
      alert('回复成功')
      loadData()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('操作失败')
  }
}

onMounted(async () => {
  await loadUsers()
  await loadBooks()  // 加载图书列表
  await loadData()
})
</script>

<style scoped>
.admin-review {
  padding: 30px;
}
.review-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 15px;
}
.info p {
  margin: 5px 0;
  color: #666;
}
.reply-area {
  margin-top: 15px;
}
.reply-area textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
}
.reply-area button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.reply {
  margin-top: 15px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 6px;
}
.empty {
  text-align: center;
  padding: 60px;
  color: #999;
}
</style>