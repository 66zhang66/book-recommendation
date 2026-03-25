<template>
  <div id="app">
    <nav v-if="showNavbar" class="navbar">
      <h2>📚 图书管理与推荐系统</h2>
      <div class="nav-links">
        <!-- 普通用户菜单 (role = 0) -->
        <template v-if="userRole === 0">
          <router-link to="/home">首页</router-link>
          <router-link to="/books">图书馆</router-link>
          <router-link to="/reading">我的阅读</router-link>
          <router-link to="/notes">读书笔记</router-link>
          <router-link to="/recommend">推荐</router-link>
          <router-link to="/profile">个人中心</router-link>
          <router-link to="/borrow">借阅记录</router-link>
          <router-link to="/collect">我的收藏</router-link>
          <router-link to="/reviews">我的评价</router-link>
          <router-link to="/customer">在线客服</router-link>
          <router-link to="/announcements">系统公告</router-link>
          <a href="#" @click.prevent="logout">退出</a>
        </template>
        
        <!-- 员工菜单 (role = 1) -->
        <template v-if="userRole === 1">
          <router-link to="/staff/home">首页</router-link>
          <router-link to="/staff/books">图书管理</router-link>
          <router-link to="/staff/borrow">借阅审核</router-link>
          <router-link to="/staff/return">归还审核</router-link>
          <router-link to="/staff/review">评论管理</router-link>
          <router-link to="/staff/customer">客服管理</router-link>
          <router-link to="/profile">个人中心</router-link>
          <a href="#" @click.prevent="logout">退出</a>
        </template>
        
        <!-- 管理员菜单 (role = 2) -->
        <template v-if="userRole === 2">
          <router-link to="/admin/home">首页</router-link>
          <router-link to="/admin/user">用户管理</router-link>
          <router-link to="/admin/announcement">公告管理</router-link>
          <router-link to="/admin/books">图书管理</router-link>
          <router-link to="/admin/borrow">借阅管理</router-link>
          <router-link to="/admin/return">归还管理</router-link>
          <router-link to="/admin/review">评论管理</router-link>
          <router-link to="/admin/statistics">数据统计</router-link>
          <router-link to="/admin/customer">客服管理</router-link>
          <router-link to="/profile">个人中心</router-link>
          <a href="#" @click.prevent="logout">退出</a>
        </template>
      </div>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const router = useRouter()
const route = useRoute()
const showNavbar = ref(false)
const userRole = ref(0)

// 更新主题样式
const updateTheme = (role) => {
  document.body.classList.remove('user-theme', 'staff-theme', 'admin-theme')
  if (role === 0) {
    document.body.classList.add('user-theme')
  } else if (role === 1) {
    document.body.classList.add('staff-theme')
  } else if (role === 2) {
    document.body.classList.add('admin-theme')
  }
}

const getUserRole = () => {
  const userStr = localStorage.getItem('user')
  if (userStr) {
    const user = JSON.parse(userStr)
    userRole.value = user.role || 0
    updateTheme(userRole.value)
  }
}

const checkNavbar = () => {
  const token = localStorage.getItem('token')
  const hidePaths = ['/login', '/register']
  showNavbar.value = token && !hidePaths.includes(route.path)
  if (token) {
    getUserRole()
  }
}

watch(() => route.path, () => {
  checkNavbar()
}, { immediate: true })

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  router.push('/login')
  checkNavbar()
  updateTheme(0)
}

checkNavbar()
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', 'Helvetica Neue', 'Inter', system-ui, sans-serif;
  transition: background 0.3s ease;
}

/* ==================== 用户端 - 小清新风格 ==================== */
body.user-theme {
  background: #f0f7f0;
  color: #2c5a2e;
}

body.user-theme .navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #d4e8d4;
  box-shadow: 0 2px 12px rgba(100, 120, 100, 0.05);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

body.user-theme .navbar h2 {
  color: #5a9e5e;
  font-size: 1.5rem;
  font-weight: 600;
}

body.user-theme .nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

body.user-theme .nav-links a {
  text-decoration: none;
  color: #6b8c6e;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 4px 0;
}

body.user-theme .nav-links a:hover,
body.user-theme .nav-links a.router-link-active {
  color: #5a9e5e;
  border-bottom: 2px solid #5a9e5e;
}

body.user-theme .book-card,
body.user-theme .reading-card,
body.user-theme .borrow-card,
body.user-theme .review-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #e2f0e2;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  padding: 20px;
}

body.user-theme .book-card:hover,
body.user-theme .reading-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(90, 158, 94, 0.1);
  border-color: #c8e0c8;
}

body.user-theme button {
  background: #5a9e5e;
  border: none;
  color: white;
  border-radius: 30px;
  padding: 8px 24px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

body.user-theme button:hover {
  background: #488a4c;
  transform: scale(0.98);
}

body.user-theme .add-btn {
  background: #5a9e5e;
  box-shadow: 0 2px 8px rgba(90, 158, 94, 0.2);
}

body.user-theme .welcome-card {
  background: linear-gradient(135deg, #e8f5e8 0%, #ffffff 100%);
  border-radius: 28px;
  padding: 40px;
  border: 1px solid #d4e8d4;
}

body.user-theme .welcome-card h1 {
  color: #2c5a2e;
  font-size: 2rem;
}

body.user-theme .progress-bar {
  background: #e8f0e8;
  border-radius: 10px;
  height: 6px;
  overflow: hidden;
}

body.user-theme .progress-fill {
  background: #5a9e5e;
  border-radius: 10px;
  height: 100%;
}

body.user-theme .stat-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

body.user-theme .stat-card h3 {
  color: #5a9e5e;
  font-size: 28px;
}

/* ==================== 用户端 - 按钮样式 ==================== */

/* 用户端通用按钮 - 默认状态（未悬停时） */
body.user-theme button {
  background: #5a9e5e;         /* 默认背景：薄荷绿，与主题色呼应 */
  border: none;                /* 无边框 */
  color: white;                /* 默认文字：白色 */
  border-radius: 30px;         /* 圆角胶囊形状，更柔和 */
  padding: 8px 24px;           /* 内边距 */
  font-weight: 500;            /* 中等加粗 */
  cursor: pointer;             /* 手型光标 */
  transition: all 0.2s ease;   /* 过渡动画 */
  box-shadow: 0 2px 4px rgba(90, 158, 94, 0.2); /* 轻微阴影，增加质感 */
}

/* 用户端通用按钮悬停效果 - 按上去时变色 */
body.user-theme button:hover {
  background: #488a4c;         /* 悬停背景：深一点薄荷绿 */
  color: white;                /* 悬停文字：白色 */
  transform: translateY(-2px); /* 轻微上浮效果 */
  box-shadow: 0 4px 12px rgba(90, 158, 94, 0.3); /* 阴影加深 */
}

/* 用户端添加按钮（主要操作按钮） */
body.user-theme .add-btn {
  background: #5a9e5e;         /* 默认背景：薄荷绿 */
  color: white;                /* 默认文字：白色 */
  font-weight: 600;            /* 加粗 */
  box-shadow: 0 2px 8px rgba(90, 158, 94, 0.25); /* 稍明显的阴影 */
}

/* 添加按钮悬停效果 */
body.user-theme .add-btn:hover {
  background: #3e7a42;         /* 悬停背景：更深薄荷绿 */
  color: white;                /* 悬停文字：白色 */
  transform: translateY(-2px); /* 轻微上浮 */
  box-shadow: 0 6px 16px rgba(90, 158, 94, 0.4); /* 阴影更明显 */
}

/* 用户端次要按钮（如取消、返回等） */
body.user-theme .secondary-btn {
  background: #e8f0e8;         /* 默认背景：浅绿色，更柔和 */
  color: #5a9e5e;              /* 默认文字：薄荷绿 */
  border: 1px solid #c8e0c8;   /* 浅色边框 */
}

/* 次要按钮悬停效果 */
body.user-theme .secondary-btn:hover {
  background: #d4e8d4;         /* 悬停背景：稍深 */
  color: #3e7a42;              /* 悬停文字：更深薄荷绿 */
  transform: translateY(-1px); /* 轻微上浮 */
}

/* 用户端危险按钮（删除等操作） */
body.user-theme .danger-btn {
  background: #f5f0f0;         /* 默认背景：浅粉色 */
  color: #e67e22;              /* 默认文字：橙色警告色 */
  border: 1px solid #ffd9d9;
}

/* 危险按钮悬停效果 */
body.user-theme .danger-btn:hover {
  background: #ffe5e5;         /* 悬停背景：浅红色 */
  color: #e67e22;              /* 悬停文字：橙色 */
  transform: translateY(-1px);
}

/* ==================== 员工端 - 商务风格 ==================== */
body.staff-theme {
  background: #f5f7fc;
  color: #1e2a3e;
}

body.staff-theme .navbar {
  background: white;
  border-bottom: 1px solid #e4e9f0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

body.staff-theme .navbar h2 {
  color: #1e4a6e;
  font-size: 1.4rem;
  font-weight: 600;
}

body.staff-theme .nav-links {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

body.staff-theme .nav-links a {
  text-decoration: none;
  color: #4a5b6e;
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 4px 0;
}

body.staff-theme .nav-links a:hover,
body.staff-theme .nav-links a.router-link-active {
  color: #1e4a6e;
  border-bottom: 2px solid #1e4a6e;
}

body.staff-theme .book-card,
body.staff-theme .borrow-card,
body.staff-theme .review-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e4e9f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  padding: 20px;
}

body.staff-theme .book-card:hover,
body.staff-theme .borrow-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #cbd5e1;
}

body.staff-theme button {
  background: #1e4a6e;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 8px 20px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

body.staff-theme button:hover {
  background: #0f3a58;
}

body.staff-theme table {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e4e9f0;
  width: 100%;
  border-collapse: collapse;
}

body.staff-theme th {
  background: #f8fafc;
  color: #1e2a3e;
  font-weight: 600;
  padding: 12px 16px;
  border-bottom: 1px solid #e4e9f0;
  text-align: left;
}

body.staff-theme td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f2f5;
}

body.staff-theme .pending {
  color: #e67e22;
  font-weight: 500;
}

body.staff-theme .approved {
  color: #27ae60;
  font-weight: 500;
}

body.staff-theme .rejected {
  color: #e74c3c;
  font-weight: 500;
}

body.staff-theme .stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  border: 1px solid #e4e9f0;
}

body.staff-theme .stat-card h3 {
  color: #1e4a6e;
  font-size: 28px;
}

/* ==================== 管理端 - 统一深灰风格 ==================== */

/* 管理端全局样式 - 应用于所有管理端页面 */
body.admin-theme {
  background: #121826;         /* 最外层背景：深灰蓝色，沉稳专业 */
  color: #eef2f8;              /* 全局文字颜色：浅灰白，保证基础可读性 */
}

/* ==================== 导航栏样式 ==================== */

/* 导航栏容器 */
body.admin-theme .navbar {
  background: #0e131f;         /* 导航栏背景：比主背景稍深，形成层次 */
  border-bottom: 1px solid #2a3343;  /* 底部边框线，区分导航和内容区 */
  padding: 15px 30px;          /* 内边距，让内容不拥挤 */
  display: flex;               /* 弹性布局 */
  justify-content: space-between; /* 左右两端对齐 */
  align-items: center;         /* 垂直居中 */
  flex-wrap: wrap;             /* 小屏幕时自动换行 */
}

/* 系统标题 */
body.admin-theme .navbar h2 {
  color: #ffd966;              /* 标题金色，品牌色突出 */
  font-size: 1.4rem;          /* 字体大小 */
  font-weight: 600;            /* 加粗 */
}

/* 导航链接容器 */
body.admin-theme .nav-links {
  display: flex;               /* 弹性布局 */
  flex-wrap: wrap;             /* 小屏幕换行 */
  gap: 15px;                   /* 链接间距 */
  align-items: center;         /* 垂直居中 */
}

/* 导航链接样式 */
body.admin-theme .nav-links a {
  text-decoration: none;       /* 去除下划线 */
  color: #a8bbd9;              /* 链接文字：淡蓝色，柔和 */
  font-weight: 500;            /* 中等加粗 */
  transition: all 0.2s ease;   /* 过渡动画 */
}

/* 导航链接悬停及激活状态 */
body.admin-theme .nav-links a:hover,
body.admin-theme .nav-links a.router-link-active {
  color: #ffd966;              /* 悬停/激活时变为金色 */
}

/* ==================== 用户管理模块字体增强 ==================== */

/* 用户管理表格整体容器 */
body.admin-theme .user-table {
  background: #1a212f;         /* 表格背景：比主背景稍亮，区分层次 */
  border-radius: 12px;         /* 圆角边框 */
  overflow: hidden;            /* 隐藏溢出，保持圆角效果 */
  width: 100%;                 /* 宽度100% */
  border-collapse: collapse;   /* 合并表格边框 */
}

/* 表格表头单元格 */
body.admin-theme .user-table th {
  background: #222b3a;         /* 表头背景略深，形成对比 */
  color: #ffd966;              /* 表头文字金色，醒目突出 */
  font-weight: 600;            /* 加粗 */
  padding: 14px 16px;          /* 内边距 */
  text-align: left;            /* 文字左对齐 */
  border-bottom: 1px solid #2f3a4a; /* 底部边框线 */
  font-size: 15px;             /* 字体大小 */
}

/* 表格数据单元格 */
body.admin-theme .user-table td {
  padding: 14px 16px;          /* 内边距 */
  border-bottom: 1px solid #2a3343; /* 行间分隔线 */
  color: #f0f4fc;              /* 文字浅灰白，清晰可见 */
  font-weight: 400;            /* 正常字重 */
  font-size: 14px;             /* 字体大小 */
}

/* 用户名和邮箱列 - 重点信息加亮显示 */
body.admin-theme .user-table td:nth-child(2),  /* 第2列：用户名 */
body.admin-theme .user-table td:nth-child(3) { /* 第3列：邮箱 */
  color: #ffffff;              /* 纯白色，更醒目 */
  font-weight: 500;            /* 中等加粗 */
}

/* 角色下拉菜单 */
body.admin-theme .user-table select {
  background: #2a3548;         /* 下拉框背景深色 */
  color: #ffd966;              /* 选中文字金色 */
  border: 1px solid #3e4a60;   /* 边框颜色 */
  border-radius: 6px;          /* 小圆角 */
  padding: 6px 10px;           /* 内边距 */
  font-weight: 500;            /* 加粗 */
  cursor: pointer;             /* 手型光标 */
}

/* 下拉菜单选项样式 */
body.admin-theme .user-table select option {
  background: #1a212f;         /* 选项背景深色 */
  color: #eef2f8;              /* 选项文字浅色 */
}

/* 正常状态标签 - 用户状态为启用 */
body.admin-theme .user-table .active {
  color: #88ffaa;              /* 亮绿色，表示正常 */
  font-weight: 600;            /* 加粗 */
  padding: 4px 12px;           /* 内边距 */
  display: inline-block;       /* 行内块级 */
}

/* 禁用状态标签 - 用户状态为禁用 */
body.admin-theme .user-table .disabled {
  color: #ff8888;              /* 亮红色，表示禁用 */
  font-weight: 600;            /* 加粗 */
  background: rgba(255, 136, 136, 0.15); /* 半透明红色背景 */
  padding: 4px 12px;           /* 内边距 */
  border-radius: 20px;         /* 圆角胶囊形状 */
  display: inline-block;       /* 行内块级 */
}

/* 禁用按钮 - 将用户状态设为禁用 */
body.admin-theme .user-table .disable {
  background: #e67e22;         /* 橙色背景，警示色 */
  color: white;               /* 白色文字 */
  border: none;               /* 无边框 */
  padding: 5px 12px;          /* 内边距 */
  border-radius: 4px;         /* 小圆角 */
  cursor: pointer;            /* 手型光标 */
  font-weight: 500;           /* 加粗 */
  margin-right: 5px;          /* 右侧间距 */
  transition: all 0.2s ease;  /* 过渡动画 */
}

/* 禁用按钮悬停效果 */
body.admin-theme .user-table .disable:hover {
  background: #f39c12;         /* 悬停变亮橙色 */
}

/* 启用按钮 - 将用户状态设为启用 */
body.admin-theme .user-table .enable {
  background: #27ae60;         /* 绿色背景 */
  color: white;               /* 白色文字 */
  border: none;               /* 无边框 */
  padding: 5px 12px;          /* 内边距 */
  border-radius: 4px;         /* 小圆角 */
  cursor: pointer;            /* 手型光标 */
  font-weight: 500;           /* 加粗 */
  margin-right: 5px;          /* 右侧间距 */
  transition: all 0.2s ease;  /* 过渡动画 */
}

/* 启用按钮悬停效果 */
body.admin-theme .user-table .enable:hover {
  background: #2ecc71;         /* 悬停变亮绿色 */
}

/* 删除按钮 - 删除用户 */
body.admin-theme .user-table .delete {
  background: #c0392b;         /* 深红色背景 */
  color: white;               /* 白色文字 */
  border: none;               /* 无边框 */
  padding: 5px 12px;          /* 内边距 */
  border-radius: 4px;         /* 小圆角 */
  cursor: pointer;            /* 手型光标 */
  font-weight: 500;           /* 加粗 */
  transition: all 0.2s ease;  /* 过渡动画 */
}

/* 删除按钮悬停效果 */
body.admin-theme .user-table .delete:hover {
  background: #e74c3c;         /* 悬停变亮红色 */
}

/* 表格行悬停效果 - 鼠标悬停时行背景变化，便于定位 */
body.admin-theme .user-table tr:hover td {
  background: #232b3c;         /* 悬停时背景变亮一点 */
}

/* ==================== 卡片通用样式 ==================== */

/* 各类卡片容器 - 图书卡片、借阅卡片、评价卡片、统计卡片 */
body.admin-theme .book-card,
body.admin-theme .borrow-card,
body.admin-theme .review-card,
body.admin-theme .stat-card {
  background: #1a212f;         /* 卡片背景深色 */
  border-radius: 12px;         /* 圆角 */
  border: 1px solid #2a3343;   /* 边框 */
  padding: 20px;               /* 内边距 */
  color: #eef2f8;              /* 文字颜色 */
  transition: all 0.2s ease;   /* 过渡动画 */
}

/* 卡片标题 */
body.admin-theme .book-card h3,
body.admin-theme .borrow-card h3 {
  color: #ffd966;              /* 标题金色 */
  margin-bottom: 12px;         /* 下边距 */
  font-weight: 600;            /* 加粗 */
}

/* 卡片内容文字 */
body.admin-theme .book-card p,
body.admin-theme .borrow-card p {
  color: #cbdbe5;              /* 浅灰蓝色，清晰 */
  line-height: 1.5;            /* 行高，增加可读性 */
}

/* 卡片悬停效果 */
body.admin-theme .book-card:hover,
body.admin-theme .borrow-card:hover {
  border-color: #ffd966;       /* 悬停边框变金色 */
  transform: translateY(-2px); /* 轻微上浮效果 */
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3); /* 阴影增强层次感 */
}

/* ==================== 按钮通用样式 ==================== */

/* 通用按钮样式 */
body.admin-theme button {
  background: #2a3343;         /* 按钮背景深色 */
  border: none;               /* 无边框 */
  color: #eef2f8;              /* 文字浅色 */
  border-radius: 6px;          /* 小圆角 */
  padding: 8px 20px;           /* 内边距 */
  font-weight: 500;            /* 加粗 */
  cursor: pointer;             /* 手型光标 */
  transition: all 0.2s ease;   /* 过渡动画 */
}

/* 按钮悬停效果 */
body.admin-theme button:hover {
  background: #ffd966;         /* 悬停背景变金色 */
  color: #121826;              /* 文字变深色，形成对比 */
}

/* 添加按钮 - 主要操作按钮 */
body.admin-theme .add-btn {
  background: #ffd966;         /* 金色背景，突出主要操作 */
  color: #121826;              /* 深色文字 */
  font-weight: 600;            /* 加粗 */
}

/* 添加按钮悬停效果 */
body.admin-theme .add-btn:hover {
  background: #e6c34d;         /* 悬停稍暗 */
  color: #121826;              /* 保持深色文字 */
}

/* ==================== 表格通用样式 ==================== */

/* 通用表格容器 */
body.admin-theme table {
  background: #1a212f;         /* 表格背景深色 */
  border-radius: 12px;         /* 圆角 */
  overflow: hidden;            /* 隐藏溢出，保持圆角 */
  width: 100%;                 /* 宽度100% */
  border-collapse: collapse;   /* 合并边框 */
  color: #eef2f8;              /* 文字颜色 */
}

/* 表格表头 */
body.admin-theme th {
  background: #222b3a;         /* 表头背景略深 */
  color: #ffd966;              /* 表头文字金色 */
  font-weight: 600;            /* 加粗 */
  padding: 12px 16px;          /* 内边距 */
  text-align: left;            /* 左对齐 */
  border-bottom: 1px solid #2f3a4a; /* 底部边框 */
}

/* 表格数据单元格 */
body.admin-theme td {
  padding: 12px 16px;          /* 内边距 */
  border-bottom: 1px solid #2a3343; /* 行间分隔线 */
  color: #d0d8ec;              /* 文字浅灰蓝 */
}

/* ==================== 统计卡片样式 ==================== */

/* 统计卡片容器 */
body.admin-theme .stat-card {
  text-align: center;          /* 文字居中 */
  background: #1a212f;         /* 背景深色 */
}

/* 统计数字 */
body.admin-theme .stat-card h3 {
  color: #ffd966;              /* 数字金色 */
  font-size: 32px;             /* 大号字体突出数据 */
  margin-bottom: 8px;          /* 下边距 */
}

/* 统计卡片描述文字 */
body.admin-theme .stat-card p {
  color: #a8bbd9;              /* 描述文字淡蓝色 */
}

/* ==================== 图表容器样式 ==================== */

/* 图表容器 */
body.admin-theme .chart-container {
  background: #1a212f;         /* 背景深色 */
  border-radius: 12px;         /* 圆角 */
  padding: 20px;               /* 内边距 */
  border: 1px solid #2a3343;   /* 边框 */
}

/* 图表标题 */
body.admin-theme .chart-container h3 {
  color: #ffd966;              /* 标题金色 */
  margin-bottom: 15px;         /* 下边距 */
}

/* ==================== 状态标签样式 ==================== */

/* 待审核状态 */
body.admin-theme .pending {
  color: #ffaa66;              /* 橙色 */
  font-weight: 500;            /* 加粗 */
}

/* 已通过/已批准状态 */
body.admin-theme .approved {
  color: #88ffaa;              /* 亮绿色 */
  font-weight: 500;            /* 加粗 */
}

/* 已拒绝状态 */
body.admin-theme .rejected {
  color: #ff8888;              /* 亮红色 */
  font-weight: 500;            /* 加粗 */
}

/* ==================== 弹窗样式 ==================== */

/* 弹窗容器 */
body.admin-theme .modal-content {
  background: #1a212f;         /* 弹窗背景深色 */
  border: 1px solid #ffd966;   /* 金色边框，突出弹窗 */
  border-radius: 12px;         /* 圆角 */
  color: #eef2f8;              /* 文字颜色 */
}

/* 弹窗标题 */
body.admin-theme .modal-content h3 {
  color: #ffd966;              /* 标题金色 */
  margin-bottom: 20px;         /* 下边距 */
}

/* 弹窗输入框、文本域、下拉框 */
body.admin-theme .modal-content input,
body.admin-theme .modal-content textarea,
body.admin-theme .modal-content select {
  background: #2a3343;         /* 输入框背景略亮 */
  border: 1px solid #3a4558;   /* 边框 */
  color: #ffffff;              /* 输入文字白色 */
  border-radius: 6px;          /* 圆角 */
  padding: 10px;               /* 内边距 */
  width: 100%;                 /* 宽度100% */
}

/* 弹窗输入框占位符 */
body.admin-theme .modal-content input::placeholder,
body.admin-theme .modal-content textarea::placeholder {
  color: #7f8fa8;              /* 占位符灰色 */
}

/* 弹窗输入框聚焦效果 */
body.admin-theme .modal-content input:focus,
body.admin-theme .modal-content textarea:focus,
body.admin-theme .modal-content select:focus {
  outline: none;               /* 去除默认轮廓 */
  border-color: #ffd966;       /* 聚焦时边框变金色 */
}

/* ==================== 空状态提示 ==================== */

/* 空状态提示文字（暂无数据时显示） */
body.admin-theme .empty-tip {
  color: #7f8fa8;              /* 灰色，不抢眼 */
  text-align: center;          /* 居中 */
  padding: 60px;               /* 大内边距，占据空间 */
}

/* ==================== 进度条样式 ==================== */

/* 进度条背景 */
body.admin-theme .progress-bar {
  background: #2a3343;         /* 进度条背景深色 */
  border-radius: 10px;         /* 圆角 */
  height: 6px;                 /* 高度 */
  overflow: hidden;            /* 隐藏溢出 */
}

/* 进度条填充 */
body.admin-theme .progress-fill {
  background: #ffd966;         /* 填充部分金色 */
  border-radius: 10px;         /* 圆角 */
  height: 100%;                /* 高度100% */
}

/* ==================== 搜索框样式 ==================== */

/* 搜索框输入框 */
body.admin-theme .search-bar input {
  background: #1a212f;         /* 输入框背景深色 */
  border: 1px solid #2a3343;   /* 边框 */
  color: #ffffff;              /* 输入文字白色 */
  border-radius: 6px;          /* 圆角 */
  padding: 8px 12px;           /* 内边距 */
}

/* 搜索框占位符 */
body.admin-theme .search-bar input::placeholder {
  color: #7f8fa8;              /* 占位符灰色 */
}

/* 搜索框聚焦效果 */
body.admin-theme .search-bar input:focus {
  outline: none;               /* 去除默认轮廓 */
  border-color: #ffd966;       /* 聚焦边框变金色 */
}

/* 搜索框按钮 */
body.admin-theme .search-bar button {
  background: #2a3343;         /* 按钮背景深色 */
  color: #eef2f8;              /* 文字浅色 */
}

/* 搜索框按钮悬停效果 */
body.admin-theme .search-bar button:hover {
  background: #ffd966;         /* 悬停背景变金色 */
  color: #121826;              /* 文字变深色 */
}

/* ==================== 欢迎卡片样式 ==================== */

/* 欢迎卡片容器 */
body.admin-theme .welcome-card {
  background: #1a212f;         /* 背景深色 */
  border-radius: 16px;         /* 圆角 */
  padding: 30px;               /* 内边距 */
  border: 1px solid #2a3343;   /* 边框 */
}

/* 欢迎卡片标题 */
body.admin-theme .welcome-card h1 {
  color: #ffd966;              /* 标题金色 */
  margin-bottom: 10px;         /* 下边距 */
}

/* 欢迎卡片描述文字 */
body.admin-theme .welcome-card p {
  color: #a8bbd9;              /* 描述文字淡蓝色 */
}

/* ==================== 选项卡按钮样式 ==================== */

/* 选项卡按钮容器 */
body.admin-theme .tabs button {
  background: #2a3343;         /* 未选中背景深色 */
  color: #a8bbd9;              /* 未选中文字淡蓝色 */
  border: none;                /* 无边框 */
  padding: 8px 20px;           /* 内边距 */
  border-radius: 20px;         /* 圆角胶囊形状 */
}

/* 选项卡激活状态 */
body.admin-theme .tabs button.active {
  background: #ffd966;         /* 激活状态背景金色 */
  color: #121826;              /* 激活状态文字深色 */
}

/* 选项卡悬停效果（非激活状态） */
body.admin-theme .tabs button:hover:not(.active) {
  background: #3a4558;         /* 悬停背景稍亮 */
  color: #eef2f8;              /* 悬停文字变亮 */
}

/* ==================== 管理端 - 评论管理字体增强 ==================== */

/* 评论卡片容器 */
body.admin-theme .review-card {
  background: #1a212f;         /* 卡片深色背景 */
  border: 1px solid #2a3343;   /* 边框 */
  border-radius: 12px;         /* 圆角 */
  padding: 20px;               /* 内边距 */
  margin-bottom: 15px;         /* 下边距 */
  transition: all 0.2s ease;   /* 过渡动画 */
}

/* 评论卡片悬停效果 */
body.admin-theme .review-card:hover {
  border-color: #ffd966;       /* 悬停边框变金色 */
}

/* 评论卡片中的信息文字 */
body.admin-theme .review-card .info p {
  color: #e8edf5;              /* 文字浅灰白，清晰可见 */
  margin: 8px 0;               /* 上下边距 */
  line-height: 1.5;            /* 行高，增加可读性 */
  font-size: 14px;             /* 字体大小 */
}

/* 评论卡片中的加粗标签（用户ID、图书ID等） */
body.admin-theme .review-card .info strong {
  color: #ffd966;              /* 标签文字金色，醒目 */
  font-weight: 600;            /* 加粗 */
  margin-right: 5px;           /* 右侧间距 */
}

/* 评分数字 */
body.admin-theme .review-card .info p strong + span {
  color: #ffd966;              /* 评分数字金色 */
  font-weight: 600;
}

/* 评价内容文字 */
body.admin-theme .review-card .info p:nth-child(4) {
  color: #ffffff;              /* 评价内容白色，最突出 */
  background: #2a3548;         /* 浅色背景突出显示 */
  padding: 8px 12px;           /* 内边距 */
  border-radius: 8px;          /* 圆角 */
  margin-top: 10px;            /* 上边距 */
}

/* 评价时间文字 */
body.admin-theme .review-card .info p:last-child {
  color: #9aaec9;              /* 时间文字稍淡，但依然可读 */
  font-size: 12px;             /* 小字体 */
}

/* 回复区域 - 输入框 */
body.admin-theme .review-card .reply-area {
  margin-top: 15px;            /* 上边距 */
}

body.admin-theme .review-card .reply-area textarea {
  background: #2a3548;         /* 输入框背景深色 */
  border: 1px solid #3e4a60;   /* 边框 */
  color: #ffffff;              /* 输入文字白色 */
  border-radius: 8px;          /* 圆角 */
  padding: 10px;               /* 内边距 */
  width: 100%;                 /* 宽度100% */
  font-size: 14px;             /* 字体大小 */
  resize: vertical;            /* 允许垂直调整大小 */
}

/* 回复区域输入框占位符 */
body.admin-theme .review-card .reply-area textarea::placeholder {
  color: #8a9bb5;              /* 占位符灰色 */
}

/* 回复区域输入框聚焦效果 */
body.admin-theme .review-card .reply-area textarea:focus {
  outline: none;               /* 去除默认轮廓 */
  border-color: #ffd966;       /* 聚焦边框变金色 */
}

/* 回复按钮 */
body.admin-theme .review-card .reply-area button {
  background: #ffd966;         /* 按钮背景金色 */
  color: #1a212f;              /* 文字深色 */
  border: none;                /* 无边框 */
  border-radius: 6px;          /* 圆角 */
  padding: 8px 20px;           /* 内边距 */
  margin-top: 10px;            /* 上边距 */
  font-weight: 500;            /* 加粗 */
  cursor: pointer;             /* 手型光标 */
  transition: all 0.2s ease;   /* 过渡动画 */
}

/* 回复按钮悬停效果 */
body.admin-theme .review-card .reply-area button:hover {
  background: #e6c34d;         /* 悬停稍暗 */
  transform: scale(0.98);      /* 轻微缩小效果 */
}

/* 已回复内容区域 */
body.admin-theme .review-card .reply {
  background: #2a3548;         /* 回复区域背景略亮 */
  border-radius: 8px;          /* 圆角 */
  padding: 12px;               /* 内边距 */
  margin-top: 12px;            /* 上边距 */
  color: #e8edf5;              /* 文字浅色 */
  border-left: 3px solid #ffd966; /* 左侧金色装饰条 */
}

/* 回复内容中的加粗文字 */
body.admin-theme .review-card .reply strong {
  color: #ffd966;              /* 金色 */
  margin-right: 8px;           /* 右侧间距 */
}

/* ==================== 管理端 - 客服管理字体增强 ==================== */

/* 客服消息卡片容器 */
body.admin-theme .message-card {
  background: #1a212f;         /* 卡片深色背景 */
  border: 1px solid #2a3343;   /* 边框 */
  border-radius: 12px;         /* 圆角 */
  padding: 20px;               /* 内边距 */
  margin-bottom: 15px;         /* 下边距 */
  transition: all 0.2s ease;   /* 过渡动画 */
}

/* 消息卡片悬停效果 */
body.admin-theme .message-card:hover {
  border-color: #ffd966;       /* 悬停边框变金色 */
}

/* 消息卡片中的信息文字 */
body.admin-theme .message-card .info p {
  color: #e8edf5;              /* 文字浅灰白，清晰可见 */
  margin: 8px 0;               /* 上下边距 */
  line-height: 1.5;            /* 行高 */
  font-size: 14px;             /* 字体大小 */
}

/* 消息卡片中的加粗标签（用户ID等） */
body.admin-theme .message-card .info strong {
  color: #ffd966;              /* 标签文字金色 */
  font-weight: 600;            /* 加粗 */
  margin-right: 5px;           /* 右侧间距 */
}

/* 消息内容文字 */
body.admin-theme .message-card .info p:nth-child(2) {
  color: #ffffff;              /* 消息内容白色，最突出 */
  background: #2a3548;         /* 浅色背景突出显示 */
  padding: 8px 12px;           /* 内边距 */
  border-radius: 8px;          /* 圆角 */
  margin-top: 8px;             /* 上边距 */
  margin-bottom: 8px;          /* 下边距 */
}

/* 消息时间文字 */
body.admin-theme .message-card .info p:last-child {
  color: #9aaec9;              /* 时间文字稍淡 */
  font-size: 12px;             /* 小字体 */
}

/* 回复区域 - 输入框 */
body.admin-theme .message-card .reply-area {
  margin-top: 15px;            /* 上边距 */
}

body.admin-theme .message-card .reply-area textarea {
  background: #2a3548;         /* 输入框背景深色 */
  border: 1px solid #3e4a60;   /* 边框 */
  color: #ffffff;              /* 输入文字白色 */
  border-radius: 8px;          /* 圆角 */
  padding: 10px;               /* 内边距 */
  width: 100%;                 /* 宽度100% */
  font-size: 14px;             /* 字体大小 */
  resize: vertical;            /* 允许垂直调整大小 */
}

/* 回复区域输入框占位符 */
body.admin-theme .message-card .reply-area textarea::placeholder {
  color: #8a9bb5;              /* 占位符灰色 */
}

/* 回复区域输入框聚焦效果 */
body.admin-theme .message-card .reply-area textarea:focus {
  outline: none;               /* 去除默认轮廓 */
  border-color: #ffd966;       /* 聚焦边框变金色 */
}

/* 回复按钮 */
body.admin-theme .message-card .reply-area button {
  background: #ffd966;         /* 按钮背景金色 */
  color: #1a212f;              /* 文字深色 */
  border: none;                /* 无边框 */
  border-radius: 6px;          /* 圆角 */
  padding: 8px 20px;           /* 内边距 */
  margin-top: 10px;            /* 上边距 */
  font-weight: 500;            /* 加粗 */
  cursor: pointer;             /* 手型光标 */
  transition: all 0.2s ease;   /* 过渡动画 */
}

/* 回复按钮悬停效果 */
body.admin-theme .message-card .reply-area button:hover {
  background: #e6c34d;         /* 悬停稍暗 */
  transform: scale(0.98);      /* 轻微缩小效果 */
}

/* 已回复内容区域 */
body.admin-theme .message-card .reply {
  background: #2a3548;         /* 回复区域背景略亮 */
  border-radius: 8px;          /* 圆角 */
  padding: 12px;               /* 内边距 */
  margin-top: 12px;            /* 上边距 */
  color: #e8edf5;              /* 文字浅色 */
  border-left: 3px solid #ffd966; /* 左侧金色装饰条 */
}

/* 回复内容中的加粗文字 */
body.admin-theme .message-card .reply strong {
  color: #ffd966;              /* 金色 */
  margin-right: 8px;           /* 右侧间距 */
}

/* 空状态提示 - 无数据时显示 */
body.admin-theme .review-list .empty-tip,
body.admin-theme .message-list .empty-tip {
  color: #9aaec9;              /* 提示文字浅灰蓝 */
  text-align: center;          /* 居中 */
  padding: 60px;               /* 大内边距 */
  font-size: 14px;             /* 字体大小 */
}

/* ==================== 管理端 - 数据统计字体增强 ==================== */

/* 数据统计页面整体容器 */
body.admin-theme .admin-statistics {
  color: #eef2f8;              /* 整体文字颜色 */
}

/* 页面标题 */
body.admin-theme .admin-statistics h2 {
  color: #ffd966;              /* 标题金色 */
  font-weight: 600;
  margin-bottom: 30px;
  font-size: 1.6rem;
}

/* 统计卡片区域标题 */
body.admin-theme .admin-statistics .stats-cards h3 {
  color: #ffd966;              /* 卡片标题金色 */
  font-size: 1.2rem;
  margin-bottom: 15px;
}

/* 统计卡片容器 - 修复布局 */
body.admin-theme .admin-statistics .stats-cards {
  display: flex;               /* 弹性布局 */
  flex-wrap: wrap;             /* 小屏幕换行 */
  gap: 20px;                   /* 卡片间距 */
  margin-bottom: 30px;         /* 下边距 */
}

/* 统计卡片 */
body.admin-theme .admin-statistics .stat-card {
  flex: 1;                     /* 平均分配宽度 */
  min-width: 150px;            /* 最小宽度 */
  background: #1a212f;         /* 卡片背景深色 */
  border-radius: 16px;         /* 圆角 */
  padding: 24px;               /* 内边距 */
  text-align: center;          /* 文字居中 */
  border: 1px solid #2a3343;   /* 边框 */
  transition: all 0.2s ease;   /* 过渡动画 */
}

/* 统计卡片悬停效果 */
body.admin-theme .admin-statistics .stat-card:hover {
  border-color: #ffd966;       /* 悬停边框变金色 */
  transform: translateY(-2px); /* 轻微上浮 */
}

/* 统计数字 */
body.admin-theme .admin-statistics .stat-card h3 {
  color: #ffd966;              /* 数字金色 */
  font-size: 32px;             /* 大号字体 */
  font-weight: 700;            /* 加粗 */
  margin-bottom: 8px;          /* 下边距 */
}

/* 统计卡片描述文字 */
body.admin-theme .admin-statistics .stat-card p {
  color: #a8bbd9;              /* 描述文字淡蓝色 */
  font-size: 14px;             /* 字体大小 */
}

/* ==================== 图表容器样式修复 ==================== */

/* 图表容器 - 修复位移问题 */
body.admin-theme .admin-statistics .chart-container {
  background: #1a212f;         /* 背景深色 */
  border-radius: 16px;         /* 圆角 */
  padding: 24px;               /* 内边距 */
  margin-bottom: 30px;         /* 下边距 */
  border: 1px solid #2a3343;   /* 边框 */
  overflow-x: auto;            /* 水平滚动，防止图表溢出 */
  overflow-y: hidden;          /* 垂直隐藏溢出 */
}

/* 图表容器标题 */
body.admin-theme .admin-statistics .chart-container h3 {
  color: #ffd966;              /* 标题金色 */
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;         /* 下边距 */
}

/* Canvas 图表 - 修复位置 */
body.admin-theme .admin-statistics canvas {
  display: block;              /* 块级显示 */
  margin: 0 auto;              /* 水平居中 */
  max-width: 100%;             /* 最大宽度100%，防止溢出 */
  height: auto;               /* 高度自适应 */
}

/* ==================== 热门图书排行表格样式 ==================== */

/* 热门图书容器 */
body.admin-theme .admin-statistics .hot-books {
  background: #1a212f;         /* 背景深色 */
  border-radius: 16px;         /* 圆角 */
  padding: 24px;               /* 内边距 */
  border: 1px solid #2a3343;   /* 边框 */
}

/* 热门图书标题 */
body.admin-theme .admin-statistics .hot-books h3 {
  color: #ffd966;              /* 标题金色 */
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 20px;         /* 下边距 */
}

/* 热门图书表格 */
body.admin-theme .admin-statistics .hot-table {
  width: 100%;                 /* 宽度100% */
  border-collapse: collapse;   /* 合并边框 */
  color: #eef2f8;              /* 文字颜色 */
}

/* 表格表头 */
body.admin-theme .admin-statistics .hot-table th {
  background: #222b3a;         /* 表头背景略深 */
  color: #ffd966;              /* 表头文字金色 */
  font-weight: 600;            /* 加粗 */
  padding: 12px 16px;          /* 内边距 */
  text-align: left;            /* 左对齐 */
  border-bottom: 1px solid #2f3a4a; /* 底部边框 */
}

/* 表格数据单元格 */
body.admin-theme .admin-statistics .hot-table td {
  padding: 12px 16px;          /* 内边距 */
  border-bottom: 1px solid #2a3343; /* 行间分隔线 */
  color: #d0d8ec;              /* 文字浅灰蓝 */
}

/* 表格行悬停效果 */
body.admin-theme .admin-statistics .hot-table tr:hover td {
  background: #232b3c;         /* 悬停背景变亮 */
}

/* 排名列 - 前三名特殊样式 */
body.admin-theme .admin-statistics .hot-table td:first-child {
  font-weight: 600;            /* 加粗 */
  color: #ffd966;              /* 金色 */
}

/* ==================== 图表内文字样式 ==================== */

/* Canvas 图表轴标签文字 */
body.admin-theme .admin-statistics canvas + .chart-labels {
  color: #eef2f8;              /* 轴标签文字颜色 */
}

/* 注意：Canvas 内的文字颜色需要通过 JavaScript 设置，以下是 canvas 周围元素的样式 */
body.admin-theme .admin-statistics .chart-container canvas {
  background: transparent;      /* 透明背景 */
}

/* 图表提示信息 */
body.admin-theme .admin-statistics .chart-tooltip {
  background: #1a212f;          /* 工具提示背景 */
  border: 1px solid #ffd966;    /* 金色边框 */
  color: #eef2f8;               /* 文字颜色 */
  border-radius: 6px;           /* 圆角 */
  padding: 8px 12px;            /* 内边距 */
  font-size: 12px;              /* 字体大小 */
}

/* 图表加载状态 */
body.admin-theme .admin-statistics .loading {
  color: #a8bbd9;               /* 加载文字颜色 */
  text-align: center;           /* 居中 */
  padding: 60px;                /* 大内边距 */
}

/* 空状态提示 */
body.admin-theme .admin-statistics .empty-tip {
  color: #8a9bb5;               /* 提示文字颜色 */
  text-align: center;           /* 居中 */
  padding: 60px;                /* 内边距 */
}

/* 通用样式 */
.content {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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

body.user-theme .modal-content {
  background: white;
  border: 1px solid #e2f0e2;
}

body.staff-theme .modal-content {
  background: white;
  border: 1px solid #e4e9f0;
}

body.admin-theme .modal-content {
  background: #1f2e3c;
  border: 1px solid #2d3e4e;
  color: #e8eef2;
}

.empty-tip {
  text-align: center;
  padding: 60px;
  color: #999;
}
</style>