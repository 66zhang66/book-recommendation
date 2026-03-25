<template>
  <div class="home">
    <div class="content">
      <div class="welcome-card">
        <h1>欢迎回来，{{ username }}！</h1>
        <p>探索你的个性化阅读世界</p>
      </div>
      
      <div class="stats">
        <div class="stat-card">
          <h3>{{ bookCount }}</h3>
          <p>总藏书</p>
        </div>
        <div class="stat-card">
          <h3>{{ readingCount }}</h3>
          <p>在读图书</p>
        </div>
        <div class="stat-card">
          <h3>{{ finishedCount }}</h3>
          <p>已读完</p>
        </div>
      </div>
      
      <div class="recommend-section">
        <h3>为你推荐</h3>
        <div class="book-grid">
          <div v-for="book in displayBooks" :key="book.id" class="book-card">
            <h4>{{ book.title }}</h4>
            <p>{{ book.author || '未知作者' }}</p>
            <p class="category">{{ book.category || '未分类' }}</p>
          </div>
          <div v-if="displayBooks.length === 0 && !loading" class="empty-tip">暂无推荐，先去添加一些阅读记录吧~</div>
          <div v-if="loading" class="loading">加载中...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getPersonalRecommend, getHotRecommend, getBookList, getReadingBooks } from '../api/index.js'

const username = ref('')
const bookCount = ref(0)
const readingCount = ref(0)
const finishedCount = ref(0)
const personalBooks = ref([])
const hotBooks = ref([])
const loading = ref(false)

// 合并推荐：优先显示智能推荐，不足时用热门推荐补充
const displayBooks = computed(() => {
  const result = [...personalBooks.value]
  if (result.length < 4) {
    const need = 4 - result.length
    const hot = hotBooks.value.slice(0, need)
    for (const book of hot) {
      if (!result.some(b => b.id === book.id)) {
        result.push(book)
      }
    }
  }
  return result.slice(0, 4)
})

onMounted(async () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    username.value = user.username || '用户'
  }
  
  try {
    const booksRes = await getBookList()
    if (booksRes.code === 200) {
      bookCount.value = booksRes.data.length
    }
    
    const readingRes = await getReadingBooks()
    if (readingRes.code === 200) {
      readingCount.value = readingRes.data.length
    }
    
    loading.value = true
    // 获取智能推荐
    const personalRes = await getPersonalRecommend(10)
    if (personalRes.code === 200) {
      personalBooks.value = personalRes.data
    }
    // 获取热门推荐作为补充
    const hotRes = await getHotRecommend(10)
    if (hotRes.code === 200) {
      hotBooks.value = hotRes.data
    }
  } catch (error) {
    console.error('加载数据失败', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.content {
  padding: 30px;
}
.welcome-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%);
  border-radius: 28px;
  padding: 40px;
  margin-bottom: 30px;
  border: 1px solid #d4e8d4;
}
.welcome-card h1 {
  color: #2c5a2e;
  font-size: 2rem;
  margin-bottom: 10px;
}
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
}
.stat-card h3 {
  font-size: 32px;
  color: #5a9e5e;
  margin-bottom: 8px;
}
.recommend-section h3 {
  margin-bottom: 20px;
  color: #2c5a2e;
  font-size: 1.3rem;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}
.book-card {
  background: white;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  transition: all 0.2s;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}
.book-card h4 {
  margin-bottom: 8px;
  color: #333;
  font-size: 1rem;
}
.book-card p {
  color: #666;
  font-size: 13px;
  margin-bottom: 4px;
}
.category {
  color: #5a9e5e;
  font-size: 11px;
}
.empty-tip, .loading {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>