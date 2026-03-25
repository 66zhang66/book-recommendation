<template>
  <div class="staff-customer">
    <h2>客服管理</h2>
    <div class="message-list">
      <div v-for="item in messages" :key="item.id" class="message-card">
        <div class="info">
          <p><strong>用户ID:</strong> {{ item.userId }}</p>
          <p><strong>消息:</strong> {{ item.message }}</p>
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
      <div v-if="messages.length === 0" class="empty">暂无未回复消息</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUnrepliedMessages, replyCustomerMessage } from '../../api/index.js'

const messages = ref([])
const replyContent = ref({})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString()
}

const loadData = async () => {
  try {
    const res = await getUnrepliedMessages()
    if (res.code === 200) {
      messages.value = res.data
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
    const res = await replyCustomerMessage({ messageId: id, reply: replyContent.value[id] })
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

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.staff-customer {
  padding: 30px;
}
.message-card {
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