<template>
  <div class="staff-home">
    <div class="welcome-card">
      <h1>欢迎回来，{{ username }}！</h1>
      <p>欢迎使用图书推荐系统员工后台</p>
    </div>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>{{ bookCount }}</h3>
        <p>总藏书数</p>
      </div>
      <div class="stat-card">
        <h3>{{ pendingBorrowCount }}</h3>
        <p>待审核借阅</p>
      </div>
      <div class="stat-card">
        <h3>{{ pendingReviewCount }}</h3>
        <p>待回复评价</p>
      </div>
      <div class="stat-card">
        <h3>{{ pendingMessageCount }}</h3>
        <p>待回复客服</p>
      </div>
    </div>
    
    <div class="quick-actions">
      <h3>快捷操作</h3>
      <div class="action-buttons">
        <router-link to="/staff/books" class="action-btn">
          <span>📚</span>
          <p>图书管理</p>
        </router-link>
        <router-link to="/staff/borrow" class="action-btn">
          <span>📋</span>
          <p>借阅审核</p>
        </router-link>
        <router-link to="/staff/return" class="action-btn">
          <span>↩️</span>
          <p>归还审核</p>
        </router-link>
        <router-link to="/staff/review" class="action-btn">
          <span>💬</span>
          <p>评论管理</p>
        </router-link>
        <router-link to="/staff/customer" class="action-btn">
          <span>🎧</span>
          <p>客服管理</p>
        </router-link>
      </div>
    </div>
    
    <div class="recent-activities">
      <h3>最近动态</h3>
      <div class="activity-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="activity-item">
          <span class="activity-time">{{ activity.time }}</span>
          <span class="activity-content">{{ activity.content }}</span>
        </div>
        <div v-if="recentActivities.length === 0" class="empty-tip">暂无最近动态</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getBookList, getStaffBorrowList, getPendingReviews, getUnrepliedMessages, getAllUsers } from '../../api/index.js'

const username = ref('')
const bookCount = ref(0)
const pendingBorrowCount = ref(0)
const pendingReviewCount = ref(0)
const pendingMessageCount = ref(0)
const recentActivities = ref([])
const users = ref([])  // 存储所有用户信息

// 获取用户名
const getUserName = (userId) => {
  const user = users.value.find(u => u.id === userId)
  return user ? user.username : `用户${userId}`
}

// 格式化时间
const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  return `${days}天前`
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

// 获取最近动态
const loadRecentActivities = async () => {
  const activities = []
  
  try {
    // 获取待审核借阅
    const borrowRes = await getStaffBorrowList()
    if (borrowRes.code === 200) {
      const pendingBorrows = borrowRes.data.filter(item => item.status === 0)
      pendingBorrowCount.value = pendingBorrows.length
      pendingBorrows.forEach(item => {
        activities.push({
          id: `borrow-${item.id}`,
          time: formatTime(item.createdAt),
          type: 'borrow',
          content: `${getUserName(item.userId)} 提交了借阅申请`
        })
      })
    }
    
    // 获取待回复评价
    const reviewRes = await getPendingReviews()
    if (reviewRes.code === 200) {
      pendingReviewCount.value = reviewRes.data.length
      reviewRes.data.forEach(item => {
        activities.push({
          id: `review-${item.id}`,
          time: formatTime(item.createdAt),
          type: 'review',
          content: `${getUserName(item.userId)} 发布了新评价`
        })
      })
    }
    
    // 获取未回复客服消息
    const msgRes = await getUnrepliedMessages()
    if (msgRes.code === 200) {
      pendingMessageCount.value = msgRes.data.length
      msgRes.data.forEach(item => {
        activities.push({
          id: `msg-${item.id}`,
          time: formatTime(item.createdAt),
          type: 'message',
          content: `${getUserName(item.userId)} 咨询了客服`
        })
      })
    }
    
    // 按时间排序（使用原始时间戳排序）
    activities.sort((a, b) => {
      // 简单按时间字符串排序
      const getMinutes = (timeStr) => {
        if (timeStr === '刚刚') return 0
        const num = parseInt(timeStr)
        if (timeStr.includes('分钟')) return num
        if (timeStr.includes('小时')) return num * 60
        if (timeStr.includes('天')) return num * 1440
        return 9999
      }
      return getMinutes(a.time) - getMinutes(b.time)
    })
    
    // 只显示最近10条
    recentActivities.value = activities.slice(0, 10)
    
  } catch (error) {
    console.error('加载动态失败', error)
  }
}

onMounted(async () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    username.value = user.username || '员工'
  }
  
  try {
    // 先加载用户列表
    await loadUsers()
    
    const booksRes = await getBookList()
    if (booksRes.code === 200) {
      bookCount.value = booksRes.data.length
    }
    
    await loadRecentActivities()
    
  } catch (error) {
    console.error('加载数据失败', error)
  }
})
</script>

<style scoped>
.staff-home {
  padding: 30px;
}

.welcome-card {
  background: linear-gradient(135deg, #1e4a6e 0%, #0f3a58 100%);
  border-radius: 24px;
  padding: 40px;
  margin-bottom: 30px;
  color: white;
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
  background: white;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  border: 1px solid #e4e9f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.stat-card h3 {
  color: #1e4a6e;
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-card p {
  color: #6c7a8a;
  font-size: 14px;
}

.quick-actions {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 30px;
  border: 1px solid #e4e9f0;
}

.quick-actions h3 {
  color: #1e4a6e;
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
  min-width: 100px;
  background: #f5f7fc;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid #e4e9f0;
}

.action-btn:hover {
  background: #1e4a6e;
  transform: translateY(-2px);
}

.action-btn span {
  font-size: 28px;
  display: block;
  margin-bottom: 8px;
}

.action-btn p {
  color: #1e2a3e;
  font-size: 13px;
  font-weight: 500;
}

.action-btn:hover p {
  color: white;
}

.recent-activities {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e4e9f0;
}

.recent-activities h3 {
  color: #1e4a6e;
  margin-bottom: 20px;
  font-size: 1.2rem;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 10px 0;
  border-bottom: 1px solid #f0f2f5;
}

.activity-time {
  font-size: 12px;
  color: #9aaebf;
  min-width: 60px;
}

.activity-content {
  color: #2c3e50;
  font-size: 14px;
}

.empty-tip {
  text-align: center;
  color: #9aaebf;
  padding: 30px;
}
</style>