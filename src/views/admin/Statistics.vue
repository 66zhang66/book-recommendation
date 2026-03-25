<template>
  <div class="admin-statistics">
    <h2>数据统计</h2>
    
    <div class="stats-cards">
      <div class="stat-card">
        <h3>{{ stats.totalUsers || 0 }}</h3>
        <p>总用户数</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.activeUsers || 0 }}</h3>
        <p>活跃用户</p>
      </div>
      <div class="stat-card">
        <h3>{{ stats.inactiveUsers || 0 }}</h3>
        <p>非活跃用户</p>
      </div>
    </div>
    
    <div class="chart-container">
      <h3>近7天借阅统计</h3>
      <canvas ref="chartCanvas" width="800" height="400"></canvas>
    </div>
    
    <div class="hot-books">
      <h3>热门图书排行</h3>
      <table class="hot-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>书名</th>
            <th>作者</th>
            <th>借阅次数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in hotBooks" :key="book.id">
            <td>{{ index + 1 }}</td>
            <td>{{ book.title }}</td>
            <td>{{ book.author }}</td>
            <td>{{ book.borrowCount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getDailyBorrowStats, getUserActivity, getHotBooks } from '../../api/index.js'

const stats = ref({})
const hotBooks = ref([])
const chartCanvas = ref(null)

const loadData = async () => {
  try {
    const activityRes = await getUserActivity()
    if (activityRes.code === 200) {
      stats.value = activityRes.data
    }
    
    const hotRes = await getHotBooks(10)
    if (hotRes.code === 200) {
      hotBooks.value = hotRes.data
    }
    
    const dailyRes = await getDailyBorrowStats(7)
    if (dailyRes.code === 200) {
      drawChart(dailyRes.data.dates, dailyRes.data.counts)
    }
  } catch (error) {
    console.error('加载失败', error)
  }
}

const drawChart = (dates, counts) => {
  const canvas = chartCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  
  // 设置画布大小，固定宽度，防止位移
  canvas.width = 800
  canvas.height = 400
  ctx.clearRect(0, 0, 800, 400)
  
  const width = 60
  const startX = 50
  const maxCount = Math.max(...counts, 1)
  
  // 绘制柱状图 - 使用金色
  ctx.fillStyle = '#ffd966'
  for (let i = 0; i < dates.length; i++) {
    const height = (counts[i] / maxCount) * 300
    const x = startX + i * (width + 20)
    const y = 350 - height
    ctx.fillRect(x, y, width, height)
  }
  
  // 绘制文字 - 使用浅色，清晰可见
  ctx.fillStyle = '#eef2f8'
  ctx.font = '12px "Segoe UI", system-ui'
  ctx.textAlign = 'center'
  
  for (let i = 0; i < dates.length; i++) {
    const x = startX + i * (width + 20) + width / 2
    const y = 370
    
    // 绘制日期（只显示月/日）
    const dateStr = dates[i].slice(5)
    ctx.fillText(dateStr, x, y)
    
    // 绘制数值
    const valueY = 350 - (counts[i] / maxCount) * 300 - 8
    ctx.fillStyle = '#ffd966'
    ctx.fillText(counts[i], x, valueY)
    ctx.fillStyle = '#eef2f8'
  }
  
  // 绘制坐标轴
  ctx.beginPath()
  ctx.strokeStyle = '#3e4a60'
  ctx.lineWidth = 1
  ctx.moveTo(30, 20)
  ctx.lineTo(30, 360)
  ctx.lineTo(780, 360)
  ctx.stroke()
  
  // Y轴标签
  ctx.fillStyle = '#a8bbd9'
  ctx.font = '10px "Segoe UI", system-ui'
  ctx.textAlign = 'right'
  for (let i = 0; i <= 4; i++) {
    const value = Math.round(maxCount * i / 4)
    const y = 360 - (value / maxCount) * 300
    ctx.fillText(value, 25, y)
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-statistics {
  padding: 30px;
}
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}
.stat-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.stat-card h3 {
  font-size: 32px;
  color: #667eea;
}
.chart-container {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}
.hot-books {
  background: white;
  padding: 20px;
  border-radius: 12px;
}
.hot-table {
  width: 100%;
  margin-top: 15px;
  border-collapse: collapse;
}
.hot-table th, .hot-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #eee;
}
.hot-table th {
  background: #f5f5f5;
}
</style>