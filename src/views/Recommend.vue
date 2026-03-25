<template>
  <div class="recommend">
    <div class="content">
      <div class="header">
        <h2>✨ 为你推荐</h2>
        <div class="tabs">
          <button :class="{ active: activeTab === 'personal' }" @click="activeTab = 'personal'">
            🎯 智能推荐
          </button>
          <button :class="{ active: activeTab === 'hot' }" @click="activeTab = 'hot'">
            🔥 热门图书
          </button>
          <button :class="{ active: activeTab === 'fresh' }" @click="activeTab = 'fresh'">
            🎲 新鲜发现
          </button>
        </div>
      </div>
      
      <div class="recommend-tip" v-if="activeTab === 'personal' && recommendationReason">
        <div class="tip-content">
          <span class="tip-icon">💡</span>
          <span>{{ recommendationReason }}</span>
        </div>
      </div>
      
      <div class="book-grid">
        <div v-for="book in displayBooks" :key="book.id" class="book-card">
          <div class="book-cover">
            <span class="book-icon">📖</span>
          </div>
          <div class="book-info">
            <h3>{{ book.title }}</h3>
            <p>作者：{{ book.author || '未知' }}</p>
            <p>分类：{{ book.category || '未分类' }}</p>
            <p>页数：{{ book.totalPages || 0 }}页</p>
            <div class="reason-tag" v-if="book.recommendReason">
              <span class="tag">{{ book.recommendReason }}</span>
            </div>
          </div>
          <div class="actions">
            <button class="read-btn" @click="addToReading(book.id)">开始阅读</button>
          </div>
        </div>
        <div v-if="displayBooks.length === 0 && !loading" class="empty-tip">
          {{ activeTab === 'personal' ? '暂无推荐，请先添加一些阅读记录吧~' : 
             activeTab === 'hot' ? '暂无热门图书' : '暂无新鲜图书' }}
        </div>
        <div v-if="loading" class="loading">加载中...</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { getPersonalRecommend, getHotRecommend, getFreshRecommend, saveReading } from '../api/index.js'

const router = useRouter()
const personalBooks = ref([])
const hotBooks = ref([])
const freshBooks = ref([])
const activeTab = ref('personal')
const loading = ref(false)
const recommendationReason = ref('')

const displayBooks = computed(() => {
  if (activeTab.value === 'personal') return personalBooks.value
  if (activeTab.value === 'hot') return hotBooks.value
  return freshBooks.value
})

const loadPersonalRecommend = async () => {
  loading.value = true
  recommendationReason.value = ''
  try {
    const res = await getPersonalRecommend(10)
    if (res.code === 200) {
      personalBooks.value = res.data
      // 根据推荐结果生成推荐理由
      if (personalBooks.value.length > 0) {
        const firstBook = personalBooks.value[0]
        if (firstBook.category) {
          recommendationReason.value = `根据你阅读过的书籍，发现你对「${firstBook.category}」类书籍特别感兴趣，为你推荐以下图书`
        } else if (firstBook.author) {
          recommendationReason.value = `你似乎喜欢「${firstBook.author}」的作品，为你推荐以下相关书籍`
        } else {
          recommendationReason.value = `根据你的阅读偏好，为你精心挑选了以下书籍`
        }
      }
    }
  } catch (error) {
    console.error('加载推荐失败', error)
  } finally {
    loading.value = false
  }
}

const loadHotRecommend = async () => {
  loading.value = true
  try {
    const res = await getHotRecommend(10)
    if (res.code === 200) {
      hotBooks.value = res.data
    }
  } catch (error) {
    console.error('加载热门失败', error)
  } finally {
    loading.value = false
  }
}

const loadFreshRecommend = async () => {
  loading.value = true
  try {
    const res = await getFreshRecommend(10)
    if (res.code === 200) {
      freshBooks.value = res.data
    }
  } catch (error) {
    console.error('加载新鲜推荐失败', error)
  } finally {
    loading.value = false
  }
}

const addToReading = async (bookId) => {
  try {
    const res = await saveReading({ bookId, status: 1, progress: 0 })
    if (res.code === 200) {
      alert('已添加到阅读列表')
      // 添加后刷新智能推荐
      if (activeTab.value === 'personal') {
        await loadPersonalRecommend()
      }
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('操作失败')
  }
}

// 触发推荐更新的事件处理函数
const handleReadingUpdate = () => {
  console.log('检测到阅读记录更新，刷新智能推荐')
  if (activeTab.value === 'personal') {
    loadPersonalRecommend()
  }
}

onMounted(() => {
  loadPersonalRecommend()
  loadHotRecommend()
  loadFreshRecommend()
  
  // 监听阅读记录更新事件
  window.addEventListener('reading-updated', handleReadingUpdate)
})

onUnmounted(() => {
  window.removeEventListener('reading-updated', handleReadingUpdate)
})
</script>

<style scoped>
.recommend {
  padding: 30px;
}
.content {
  max-width: 1200px;
  margin: 0 auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}
.header h2 {
  color: #2c5a2e;
  font-size: 1.8rem;
}
.tabs {
  display: flex;
  gap: 10px;
}
.tabs button {
  padding: 8px 20px;
  border: none;
  background: #cce3c7ff;
  cursor: pointer;
  border-radius: 30px;
  transition: all 0.2s;
  font-size: 14px;
}
.tabs button.active {
  background: #5a9e5e;
  color: white;
}
.recommend-tip {
  background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%);
  border-radius: 16px;
  padding: 16px 20px;
  margin-bottom: 24px;
  border-left: 4px solid #5a9e5e;
}
.tip-content {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #2c5a2e;
}
.tip-icon {
  font-size: 24px;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}
.book-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.book-cover {
  text-align: center;
  margin-bottom: 16px;
}
.book-icon {
  font-size: 48px;
}
.book-info h3 {
  margin-bottom: 10px;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}
.book-info p {
  color: #666;
  font-size: 13px;
  margin-bottom: 6px;
}
.reason-tag {
  margin-top: 8px;
}
.tag {
  display: inline-block;
  background: #e8f0e8;
  color: #5a9e5e;
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 20px;
}
.actions {
  margin-top: 16px;
}
.read-btn {
  width: 100%;
  padding: 10px;
  background: #5a9e5e;
  color: white;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}
.read-btn:hover {
  background: #488a4c;
  transform: scale(0.98);
}
.empty-tip, .loading {
  text-align: center;
  padding: 60px;
  color: #999;
}
</style>