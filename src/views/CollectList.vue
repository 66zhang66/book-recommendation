<template>
  <div>
    <div class="content">
      <h2>我的收藏</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else>
        <div class="book-grid">
          <div v-for="book in books" :key="book.id" class="book-card">
            <div class="book-cover">
              <span class="book-icon">📖</span>
            </div>
            <div class="book-info">
              <h3>{{ book.title }}</h3>
              <p class="author">作者：{{ book.author || '未知' }}</p>
              <p class="category">分类：{{ book.category || '未分类' }}</p>
              <p class="pages">页数：{{ book.totalPages || 0 }}页</p>
            </div>
            <div class="book-actions">
              <button class="like-btn" :class="{ liked: likedBooks[book.id] }" @click="toggleLike(book.id)">
                {{ likedBooks[book.id] ? '❤️ 已赞' : '🤍 点赞' }}
              </button>
              <button class="read-btn" @click="addToReading(book.id)">开始阅读</button>
              <button class="uncollect-btn" @click="uncollect(book.id)">取消收藏</button>
            </div>
          </div>
        </div>
        <div v-if="books.length === 0" class="empty-tip">
          <p>📭 暂无收藏图书</p>
          <p>去<a href="#" @click.prevent="$router.push('/books')">图书馆</a>添加收藏吧~</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCollectedBooks, uncollectBook, getBookList, saveReading, likeBook, unlikeBook, checkLiked } from '../api/index.js'

const router = useRouter()
const loading = ref(true)
const books = ref([])
const collectedIds = ref([])
const likedBooks = ref({})

const loadCollect = async () => {
  loading.value = true
  try {
    const res = await getCollectedBooks()
    if (res.code === 200) {
      collectedIds.value = res.data
      const allBooksRes = await getBookList()
      if (allBooksRes.code === 200) {
        books.value = allBooksRes.data.filter(b => collectedIds.value.includes(b.id))
        // 检查每本书的点赞状态
        for (const book of books.value) {
          const checkRes = await checkLiked(book.id)
          if (checkRes.code === 200) {
            likedBooks.value[book.id] = checkRes.data
          }
        }
      }
    }
  } catch (error) {
    console.error('加载收藏失败', error)
  } finally {
    loading.value = false
  }
}

const uncollect = async (bookId) => {
  if (confirm('确定取消收藏吗？')) {
    try {
      const res = await uncollectBook(bookId)
      if (res.code === 200) {
        alert('取消收藏成功')
        loadCollect()
      } else {
        alert(res.message)
      }
    } catch (error) {
      alert('操作失败')
    }
  }
}

const addToReading = async (bookId) => {
  try {
    const res = await saveReading({ bookId, status: 1, progress: 0 })
    if (res.code === 200) {
      alert('已添加到阅读列表')
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('操作失败')
  }
}

const toggleLike = async (bookId) => {
  try {
    if (likedBooks.value[bookId]) {
      const res = await unlikeBook(bookId)
      if (res.code === 200) {
        likedBooks.value[bookId] = false
        alert('取消点赞成功')
      } else {
        alert(res.message)
      }
    } else {
      const res = await likeBook(bookId)
      if (res.code === 200) {
        likedBooks.value[bookId] = true
        alert('点赞成功')
      } else {
        alert(res.message)
      }
    }
  } catch (error) {
    alert('操作失败')
  }
}

onMounted(() => {
  loadCollect()
})
</script>

<style scoped>
.content {
  padding: 30px;
  max-width: 1200px;
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
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}
.book-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  transition: transform 0.3s;
  display: flex;
  gap: 15px;
}
.book-card:hover {
  transform: translateY(-4px);
}
.book-cover {
  flex-shrink: 0;
}
.book-icon {
  font-size: 48px;
}
.book-info {
  flex: 1;
}
.book-info h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 8px;
}
.book-info p {
  color: #666;
  font-size: 13px;
  margin-bottom: 5px;
}
.author { color: #409eff; }
.category { color: #67c23a; }
.pages { color: #999; }
.book-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  justify-content: center;
}
.like-btn {
  background: #f0f0f0;
  color: #666;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.like-btn.liked {
  background: #ff4d4d;
  color: white;
}
.read-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
}
.uncollect-btn {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
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