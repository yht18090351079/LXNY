# 评论系统 Node.js 服务器

## 🚀 快速开始

### 1. 安装依赖
```bash
cd comment-component
npm install
```

### 2. 启动服务器
```bash
npm start
```

或者使用开发模式（自动重启）：
```bash
npm run dev
```

### 3. 访问应用
打开浏览器访问：`http://localhost:3000/demo.html`

## 📁 文件结构
```
comment-component/
├── server.js              # Node.js服务器
├── package.json           # 项目依赖
├── comments-data.json     # 评论数据文件
├── comment-system.js      # 前端评论系统
├── comment-system.css     # 样式文件
├── demo.html              # 演示页面
└── README-nodejs.md       # 本文档
```

## 🔧 API 接口

### GET /api/comments
获取所有评论数据

**响应示例：**
```json
{
  "comments": [...],
  "commentCounter": 5,
  "timestamp": "2024-01-15T10:00:00.000Z",
  "version": "1.0.0"
}
```

### POST /api/comments
保存评论数据

**请求体：**
```json
{
  "comments": [...],
  "commentCounter": 5
}
```

**响应示例：**
```json
{
  "success": true,
  "message": "评论数据已保存",
  "timestamp": "2024-01-15T10:00:00.000Z",
  "comments_count": 5
}
```

### POST /api/comments/backup
创建评论数据备份

**响应示例：**
```json
{
  "success": true,
  "message": "备份已创建",
  "backup_file": "./comments-backup-2024-01-15T10-00-00-000Z.json"
}
```

## ✨ 功能特点

### 🔄 自动保存
- 新增、编辑、删除评论时自动保存到服务器
- 无需手动点击保存按钮
- 实时同步到 `comments-data.json` 文件

### 🛡️ 容错机制
- 服务器连接失败时自动保存到本地缓存
- 支持离线模式，数据不丢失
- 服务器恢复后可手动同步

### 📊 实时反馈
- 控制台显示详细的保存状态
- 自动备份功能
- 错误处理和日志记录

## 🔧 配置选项

在前端代码中可以自定义API地址：
```javascript
const commentSystem = new CommentSystem({
    apiBaseUrl: 'http://localhost:3000/api', // API服务器地址
    defaultAuthor: '您的姓名',
    autoSave: true
});
```

## 📝 使用流程

1. **启动服务器**：`npm start`
2. **打开页面**：访问 `http://localhost:3000/demo.html`
3. **添加评论**：
   - 点击"评论模式"按钮
   - 在页面任意位置点击添加评论
   - 评论会自动保存到服务器
4. **查看评论**：点击评论标记查看详情
5. **数据持久化**：所有数据自动保存到 `comments-data.json`

## 🐛 故障排除

### 服务器无法启动
- 检查端口3000是否被占用
- 确保Node.js版本 >= 14.0.0
- 运行 `npm install` 安装依赖

### 评论无法保存
- 检查控制台错误信息
- 确认服务器正在运行
- 查看网络连接状态

### 数据丢失
- 检查 `comments-data.json` 文件
- 查看备份文件：`comments-backup-*.json`
- 使用备份API恢复数据

## 🔒 安全说明

- 本服务器仅用于开发和原型设计
- 生产环境请添加身份验证
- 建议使用HTTPS协议
- 定期备份重要数据

## 📋 待办事项

- [ ] 添加用户身份验证
- [ ] 实现数据库存储
- [ ] 添加评论权限管理
- [ ] 支持文件上传
- [ ] 添加实时协作功能