<template>
  <div>
    <div class="content">
      <div class="chat-container">
        <div class="chat-header">
          <h2>在线客服</h2>
          <p>工作时间：9:00-18:00</p>
        </div>
        
        <div class="chat-messages" ref="messagesContainer">
          <div v-if="loading" class="loading">加载中...</div>
          <div v-else>
            <div v-for="msg in messages" :key="msg.id" class="message" :class="msg.userId === userId ? 'user' : 'admin'">
              <div class="message-content">
                <p>{{ msg.message }}</p>
                <span class="time">{{ formatTime(msg.createdAt) }}</span>
              </div>
              <div v-if="msg.reply" class="reply-message">
                <strong>客服回复：</strong>{{ msg.reply }}
              </div>
            </div>
          </div>
          <div v-if="messages.length === 0 && !loading" class="empty-tip">暂无消息，发送消息开始咨询</div>
        </div>
        
        <div class="chat-input">
          <textarea v-model="newMessage" placeholder="请输入您的问题..." rows="3" @keydown.ctrl.enter="sendMessage"></textarea>
          <button @click="sendMessage" :disabled="sending">{{ sending ? '发送中...' : '发送' }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { sendMessage as apiSend, getMessages } from '../api/index.js'

const messages = ref([])
const newMessage = ref('')
const sending = ref(false)
const loading = ref(true)
const userId = ref(0)
const messagesContainer = ref(null)

const formatTime = (time) => {
  if (!time) return ''
  return new Date(time).toLocaleString()
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

const loadMessages = async () => {
  loading.value = true
  try {
    const res = await getMessages()
    if (res.code === 200) {
      messages.value = res.data
      scrollToBottom()
    }
  } catch (error) {
    console.error('加载消息失败', error)
  } finally {
    loading.value = false
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) {
    alert('请输入消息内容')
    return
  }
  sending.value = true
  try {
    const res = await apiSend({ message: newMessage.value })
    if (res.code === 200) {
      newMessage.value = ''
      await loadMessages()
    } else {
      alert(res.message)
    }
  } catch (error) {
    alert('发送失败')
  } finally {
    sending.value = false
  }
}

onMounted(() => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  userId.value = user.id || 0
  loadMessages()
})
</script>

<style scoped>
.content {
  padding: 30px;
  max-width: 800px;
  margin: 0 auto;
}
.chat-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
  overflow: hidden;
}
.chat-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}
.chat-header h2 {
  margin-bottom: 5px;
}
.chat-header p {
  font-size: 12px;
  opacity: 0.8;
}
.chat-messages {
  height: 400px;
  overflow-y: auto;
  padding: 20px;
  background: #f9f9f9;
}
.message {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}
.message.user {
  align-items: flex-end;
}
.message.user .message-content {
  background: #667eea;
  color: white;
}
.message.admin .message-content {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}
.message-content {
  max-width: 70%;
  padding: 10px 15px;
  border-radius: 18px;
}
.message-content p {
  margin-bottom: 5px;
  word-break: break-word;
}
.time {
  font-size: 10px;
  opacity: 0.7;
  display: block;
  text-align: right;
}
.reply-message {
  margin-top: 8px;
  padding: 8px 12px;
  background: #f0f0f0;
  border-radius: 12px;
  font-size: 13px;
  max-width: 70%;
}
.chat-input {
  padding: 20px;
  border-top: 1px solid #eee;
  background: white;
}
.chat-input textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
  font-family: inherit;
}
.chat-input textarea:focus {
  outline: none;
  border-color: #667eea;
}
.chat-input button {
  margin-top: 10px;
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}
.loading, .empty-tip {
  text-align: center;
  color: #999;
  padding: 40px;
}
</style>