<template>
  <div>
    <div class="content">
      <h2>我的评价</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else>
        <div class="review-list">
          <div v-for="item in reviews" :key="item.id" class="review-card">
            <div class="review-header">
              <h3>{{ getBookTitle(item.bookId) }}</h3>
              <div class="rating">
                <span v-for="i in 5" :key="i" class="star" :class="{ active: i <= item.rating }">★</span>
              </div>
            </div>
            <p class="content">{{ item.content }}</p>
            <p class="time">{{ formatDate(item.createdAt) }}</p>
            <div v-if="item.reply" class="reply">
              <strong>管理员回复：</strong>{{ item.reply }}
            </div>
          </div>
        </div>
        <div v-if="reviews.length === 0" class="empty-tip">
          <p>📝 暂无评价</p>
          <p>去<a href="#" @click.prevent="$router.push('/books')">图书馆</a>给喜欢的书打个分吧~</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getMyReviews, getBookList } from '../api/index.js'

const router = useRouter()
const loading = ref(true)
const reviews = ref([])
const books = ref([])

const getBookTitle = (bookId) => {
  const book = books.value.find(b => b.id === bookId)
  return book ? book.title : '未知图书'
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

const loadData = async () => {
  loading.value = true
  try {
    const booksRes = await getBookList()
    if (booksRes.code === 200) {
      books.value = booksRes.data
    }
    
    const reviewsRes = await getMyReviews()
    if (reviewsRes.code === 200) {
      reviews.value = reviewsRes.data
    }
  } catch (error) {
    console.error('加载数据失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.content {
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
}
h2 {
  margin-bottom: 30px;
  border-left: 4px solid #667eea;
  padding-left: 15px;
}
.loading {
  text-align: center;
  padding: 60px;
  color: #666;
}
.review-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.review-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}
.review-header h3 {
  color: #333;
  font-size: 16px;
}
.rating {
  color: #ddd;
  font-size: 16px;
}
.star.active {
  color: #ffc107;
}
.content {
  color: #666;
  line-height: 1.5;
  margin-bottom: 10px;
}
.time {
  color: #999;
  font-size: 12px;
}
.reply {
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  font-size: 14px;
  color: #666;
}
.empty-tip {
  text-align: center;
  padding: 80px;
  background: white;
  border-radius: 16px;
}
.empty-tip p {
  color: #999;
  font-size: 16px;
  margin-bottom: 10px;
}
.empty-tip a {
  color: #667eea;
  text-decoration: none;
}
</style>