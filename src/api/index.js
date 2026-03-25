import request from '../utils/request.js'

export const login = (data) => request.post('/user/login', data)
export const register = (data) => request.post('/user/register', data)

export const getBookList = () => request.get('/book/list')
export const getBookDetail = (id) => request.get(`/book/${id}`)
export const addBook = (data) => request.post('/book/add', data)
export const updateBook = (data) => request.put('/book/update', data)
export const deleteBook = (id) => request.delete(`/book/${id}`)
export const searchBooks = (keyword) => request.get(`/book/search?keyword=${keyword}`)

export const saveReading = (data) => request.post('/reading/save', data)
export const getReadingList = () => request.get('/reading/list')
export const getReadingBooks = () => request.get('/reading/reading')
export const getReadingStatus = (bookId) => request.get(`/reading/status?bookId=${bookId}`)
export const deleteReading = (bookId) => request.delete(`/reading/delete?bookId=${bookId}`)

export const getPersonalRecommend = (limit = 10) => request.get(`/recommend/personal?limit=${limit}`)
export const getHotRecommend = (limit = 10) => request.get(`/recommend/hot?limit=${limit}`)
// 新鲜推荐
export const getFreshRecommend = (limit = 10) => request.get(`/recommend/fresh?limit=${limit}`)
// 在文件末尾添加以下代码（如果还没有）

// 检查图书借阅状态
export const checkBorrowStatus = (bookId) => request.get(`/borrow/check/${bookId}`)

// 归还图书
export const returnBorrowBook = (borrowId) => request.put(`/borrow/return/${borrowId}`)
// 收藏相关
export const collectBook = (bookId) => request.post(`/book/collect/${bookId}`)
export const uncollectBook = (bookId) => request.delete(`/book/collect/${bookId}`)
export const getCollectedBooks = () => request.get('/book/collect/list')

// 评价相关
export const getMyReviews = () => request.get('/review/my')
export const getBookReviews = (bookId) => request.get(`/review/list/${bookId}`)

// 客服相关
export const sendMessage = (data) => request.post('/customer/send', data)
export const getMessages = () => request.get('/customer/list')

// 公告相关
export const getAnnouncements = () => request.get('/announcement/list')
export const getAnnouncementDetail = (id) => request.get(`/announcement/${id}`)
// 用户个人中心
export const getUserInfo = () => request.get('/user/info')
export const updateUserInfo = (data) => request.put('/user/info', data)
export const changePassword = (data) => request.put('/user/password', data)
// 借阅相关
export const borrowBook = (data) => request.post('/borrow/add', data)
export const returnBook = (borrowId) => request.put(`/borrow/return/${borrowId}`)
export const getBorrowList = () => request.get('/borrow/list')
// 点赞相关
export const likeBook = (bookId) => request.post(`/book/like/${bookId}`)
export const unlikeBook = (bookId) => request.delete(`/book/like/${bookId}`)
export const checkLiked = (bookId) => request.get(`/book/like/check/${bookId}`)
export const getLikeCount = (bookId) => request.get(`/book/like/count/${bookId}`)
// 笔记相关
// 获取所有笔记
export const getAllNotes = () => request.get('/note/list')
export const getBookNotes = (bookId) => request.get(`/note/book/${bookId}`)
export const addNote = (data) => request.post('/note/add', data)
export const updateNote = (data) => request.put('/note/update', data)
export const deleteNote = (id) => request.delete(`/note/${id}`)

// 管理端用户管理
export const getAllUsers = () => request.get('/admin/user/list')
export const updateUserRole = (userId, role) => request.put(`/admin/user/role?userId=${userId}&role=${role}`)
export const updateUserStatus = (userId, status) => request.put(`/admin/user/status?userId=${userId}&status=${status}`)
export const deleteUser = (id) => request.delete(`/admin/user/${id}`)

// 管理端公告管理
export const getAllAnnouncements = () => request.get('/admin/announcement/list')
export const addAnnouncement = (data) => request.post('/admin/announcement/add', data)
export const updateAnnouncement = (data) => request.put('/admin/announcement/update', data)
export const deleteAnnouncement = (id) => request.delete(`/admin/announcement/${id}`)

// 管理端数据统计
export const getDailyBorrowStats = (days) => request.get(`/admin/statistics/borrow/daily?days=${days}`)
export const getUserActivity = () => request.get('/admin/statistics/user/activity')
export const getHotBooks = (limit) => request.get(`/admin/statistics/book/hot?limit=${limit}`)
// 管理端借阅管理
export const getAllBorrowRecords = () => request.get('/admin/borrow/list')
export const approveBorrow = (borrowId) => request.put(`/admin/borrow/approve/${borrowId}`)
export const rejectBorrow = (borrowId) => request.put(`/admin/borrow/reject/${borrowId}`)
export const confirmReturn = (borrowId) => request.put(`/admin/borrow/confirm/${borrowId}`)

// 管理端评论管理
export const getAllReviews = () => request.get('/admin/review/list')
export const replyReview = (data) => request.post('/admin/review/reply', data)

// 管理端客服管理
export const getAllCustomerMessages = () => request.get('/admin/customer/list')
export const replyCustomerMessage = (data) => request.post('/admin/customer/reply', data)

// 管理端归还管理
export const getReturnList = () => request.get('/admin/return/list')
export const confirmReturnBook = (borrowId) => request.put(`/admin/return/confirm/${borrowId}`)
// ... 你现有的代码 ...

// ==================== 员工端 API ====================

// 员工端借阅管理
export const getStaffBorrowList = () => request.get('/staff/borrow/list')
export const staffApproveBorrow = (borrowId) => request.put(`/staff/borrow/approve/${borrowId}`)
export const staffRejectBorrow = (borrowId) => request.put(`/staff/borrow/reject/${borrowId}`)

// 员工端归还管理
export const getStaffReturnList = () => request.get('/staff/return/list')
export const staffConfirmReturn = (borrowId) => request.put(`/staff/return/confirm/${borrowId}`)

// 员工端评论管理
export const getPendingReviews = () => request.get('/staff/review/pending')
export const staffReplyReview = (data) => request.post('/staff/review/reply', data)

// 员工端客服管理
export const getUnrepliedMessages = () => request.get('/staff/customer/unreplied')
export const staffReplyCustomerMessage = (data) => request.post('/staff/customer/reply', data)
// 员工端图书管理
export const getStaffBookList = () => request.get('/staff/books/list')
export const staffAddBook = (data) => request.post('/staff/books/add', data)
export const staffUpdateBook = (data) => request.put('/staff/books/update', data)
export const staffDeleteBook = (id) => request.delete(`/staff/books/${id}`)
export const staffSearchBooks = (keyword) => request.get(`/staff/books/search?keyword=${keyword}`)
// 私有图书相关
export const addPrivateBookAndRecord = (data) => request.post('/reading/add-private', data)
