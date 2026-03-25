<template>
  <div class="admin-home">
    <div class="welcome-card">
      <h1>欢迎回来，{{ username }}！</h1>
      <p>欢迎使用图书推荐系统管理后台</p>
    </div>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>{{ userCount }}</h3>
        <p>总用户数</p>
      </div>
      <div class="stat-card">
        <h3>{{ bookCount }}</h3>
        <p>总藏书数</p>
      </div>
      <div class="stat-card">
        <h3>{{ borrowCount }}</h3>
        <p>总借阅次数</p>
      </div>
      <div class="stat-card">
        <h3>{{ reviewCount }}</h3>
        <p>总评价数</p>
      </div>
    </div>
    
    <div class="quick-actions">
      <h3>快捷操作</h3>
      <div class="action-buttons">
        <router-link to="/admin/user" class="action-btn">
          <span>👥</span>
          <p>用户管理</p>
        </router-link>
        <router-link to="/admin/books" class="action-btn">
          <span>📚</span>
          <p>图书管理</p>
        </router-link>
        <router-link to="/admin/announcement" class="action-btn">
          <span>📢</span>
          <p>发布公告</p>
        </router-link>
        <router-link to="/admin/statistics" class="action-btn">
          <span>📊</span>
          <p>数据统计</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAllUsers, getBookList, getAllBorrowRecords, getAllReviews } from '../../api/index.js'

const username = ref('')
const userCount = ref(0)
const bookCount = ref(0)
const borrowCount = ref(0)
const reviewCount = ref(0)

onMounted(async () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    username.value = user.username || '管理员'
  }
  
  try {
    const usersRes = await getAllUsers()
    if (usersRes.code === 200) {
      userCount.value = usersRes.data.length
    }
    
    const booksRes = await getBookList()
    if (booksRes.code === 200) {
      bookCount.value = booksRes.data.length
    }
    
    const borrowRes = await getAllBorrowRecords()
    if (borrowRes.code === 200) {
      borrowCount.value = borrowRes.data.length
    }
    
    const reviewRes = await getAllReviews()
    if (reviewRes.code === 200) {
      reviewCount.value = reviewRes.data.length
    }
  } catch (error) {
    console.error('加载数据失败', error)
  }
})
</script>

<style scoped>
.admin-home {
  padding: 30px;
}

.welcome-card {
  background: linear-gradient(135deg, #ffd966 0%, #e6c34d 100%);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 30px;
  color: #1a2634;
}

.welcome-card h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.welcome-card p {
  font-size: 1rem;
  opacity: 0.9;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #1a212f;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 1px solid #2a3343;
  transition: all 0.2s ease;
}

.stat-card:hover {
  border-color: #ffd966;
  transform: translateY(-2px);
}

.stat-card h3 {
  color: #ffd966;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-card p {
  color: #a8bbd9;
  font-size: 14px;
}

.quick-actions {
  background: #1a212f;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #2a3343;
}

.quick-actions h3 {
  color: #ffd966;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.action-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.action-btn {
  flex: 1;
  min-width: 120px;
  background: #2a3343;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #ffd966;
  transform: translateY(-2px);
}

.action-btn span {
  font-size: 32px;
  display: block;
  margin-bottom: 10px;
}

.action-btn p {
  color: #eef2f8;
  font-size: 14px;
  font-weight: 500;
}

.action-btn:hover p {
  color: #1a2634;
}
</style>