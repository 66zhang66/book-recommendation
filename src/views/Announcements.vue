<template>
  <div>
    <div class="content">
      <h2>系统公告</h2>
      <div v-if="loading" class="loading">加载中...</div>
      <div v-else>
        <div class="announcement-list">
          <div v-for="item in list" :key="item.id" class="announcement-card" @click="viewDetail(item)">
            <h3>{{ item.title }}</h3>
            <p class="preview">{{ item.content.substring(0, 100) }}...</p>
            <p class="time">{{ formatDate(item.createdAt) }}</p>
          </div>
        </div>
        <div v-if="list.length === 0" class="empty-tip">暂无公告</div>
      </div>
    </div>
    
    <div v-if="showDetail" class="modal" @click="showDetail = false">
      <div class="modal-content" @click.stop>
        <h3>{{ currentAnnouncement.title }}</h3>
        <p class="time">{{ formatDate(currentAnnouncement.createdAt) }}</p>
        <div class="content-text">{{ currentAnnouncement.content }}</div>
        <button @click="showDetail = false">关闭</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getAnnouncements } from '../api/index.js'

const loading = ref(true)
const list = ref([])
const showDetail = ref(false)
const currentAnnouncement = ref({})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString()
}

const loadAnnouncements = async () => {
  loading.value = true
  try {
    const res = await getAnnouncements()
    if (res.code === 200) {
      list.value = res.data
    }
  } catch (error) {
    console.error('加载公告失败', error)
  } finally {
    loading.value = false
  }
}

const viewDetail = (item) => {
  currentAnnouncement.value = item
  showDetail.value = true
}

onMounted(() => {
  loadAnnouncements()
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
.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.announcement-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: all 0.2s;
}
.announcement-card:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.announcement-card h3 {
  margin-bottom: 10px;
  color: #333;
}
.preview {
  color: #666;
  margin-bottom: 10px;
  line-height: 1.5;
}
.time {
  color: #999;
  font-size: 12px;
}
.empty-tip {
  text-align: center;
  padding: 60px;
  color: #999;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 30px;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}
.modal-content h3 {
  margin-bottom: 10px;
  color: #333;
}
.modal-content .time {
  margin-bottom: 20px;
}
.modal-content .content-text {
  line-height: 1.6;
  color: #666;
  margin-bottom: 20px;
  white-space: pre-wrap;
}
.modal-content button {
  width: 100%;
  padding: 10px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>