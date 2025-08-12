# 评论系统组件

一个类似 Axure / 墨刀 的评论功能组件，支持在页面任意位置添加评论标记，提供完整的评论管理功能。

## 🎯 功能特点

### 核心功能
- ✅ **点击添加评论** - 在页面任意位置点击添加评论标记
- ✅ **评论标记** - 带编号的圆形标记，支持不同优先级颜色
- ✅ **评论管理** - 添加、编辑、删除、回复评论
- ✅ **状态管理** - 未解决/已解决状态切换
- ✅ **优先级** - 低/普通/高/紧急四个优先级
- ✅ **评论面板** - 侧边栏评论列表管理
- ✅ **评论弹窗** - 点击标记显示详细信息
- ✅ **本地存储** - 自动保存评论数据到 localStorage

### 交互功能
- ✅ **评论模式切换** - 开启/关闭评论添加模式
- ✅ **显示/隐藏** - 控制评论标记的可见性
- ✅ **ESC键关闭** - 按ESC键关闭弹窗
- ✅ **响应式设计** - 移动端适配
- ✅ **数据导入导出** - JSON 格式数据交换

## 📁 文件结构

```
comment-component/
├── comment-system.html     # 基础组件页面
├── comment-system.css      # 样式文件
├── comment-system.js       # 核心功能脚本
├── demo.html              # 演示页面
└── README.md              # 说明文档
```

## 🚀 快速开始

### 1. 基础使用

直接打开 `demo.html` 查看完整演示：

```bash
# 在浏览器中打开演示页面
open demo.html
```

### 2. 集成到现有项目

在您的 HTML 页面中引入组件：

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="comment-system.css">
</head>
<body>
    <!-- 您的页面内容 -->
    
    <!-- 评论系统组件 -->
    <div id="comment-system">
        <!-- 工具栏 -->
        <div class="comment-toolbar">
            <button id="toggle-comment-mode" class="toolbar-btn">
                <span class="btn-icon">💬</span>
                <span class="btn-text">评论模式</span>
            </button>
            <button id="toggle-comments-visibility" class="toolbar-btn">
                <span class="btn-icon">👁️</span>
                <span class="btn-text">显示评论</span>
            </button>
            <div class="comment-stats">
                <span class="stats-item">
                    <span class="stats-label">总计:</span>
                    <span id="total-comments" class="stats-value">0</span>
                </span>
                <span class="stats-item">
                    <span class="stats-label">未解决:</span>
                    <span id="unresolved-comments" class="stats-value">0</span>
                </span>
            </div>
        </div>
        
        <!-- 其他组件元素... -->
    </div>
    
    <script src="comment-system.js"></script>
</body>
</html>
```

### 3. 自定义配置

```javascript
// 创建评论系统实例
const commentSystem = new CommentSystem({
    container: document.body,          // 容器元素
    defaultAuthor: '您的姓名',         // 默认作者名
    autoSave: true,                    // 自动保存
    storageKey: 'my-comments'          // 存储键名
});
```

## 🎮 使用方法

### 基本操作

1. **进入评论模式**
   - 点击工具栏中的"评论模式"按钮
   - 或使用快捷键 `Ctrl+Shift+C`

2. **添加评论**
   - 在评论模式下，点击页面任意位置
   - 在弹出的对话框中输入评论内容
   - 选择优先级并保存

3. **查看评论**
   - 点击页面上的评论标记（圆形带数字）
   - 查看评论详情、添加回复

4. **管理评论**
   - 在评论弹窗中可以编辑、删除、标记为已解决
   - 双击统计数据打开评论列表面板

### 键盘操作

| 按键 | 功能 |
|------|------|
| `ESC` | 关闭弹窗/模态框 |

### 优先级说明

- **低** - 蓝色标记，一般性建议
- **普通** - 紫色标记，常规问题
- **高** - 橙色标记，重要问题，带脉冲动画
- **紧急** - 红色标记，紧急问题，快速脉冲动画

## 🔧 API 参考

### CommentSystem 类

```javascript
class CommentSystem {
    constructor(options)           // 创建实例
    
    // 公共方法
    exportComments()              // 导出评论数据
    importComments(data)          // 导入评论数据
    clearAllComments()            // 清空所有评论
    openPanel()                   // 打开评论面板
    closePanel()                  // 关闭评论面板
    
    // 查询方法
    getCommentById(id)            // 根据ID获取评论
    getCommentsByStatus(status)   // 根据状态获取评论
    getCommentsByPriority(priority) // 根据优先级获取评论
}
```

### 配置选项

```javascript
const options = {
    container: document.body,      // 容器元素
    autoSave: true,               // 是否自动保存
    storageKey: 'comment-data',   // localStorage 键名
    defaultAuthor: '匿名用户'      // 默认作者名
};
```

### 数据结构

```javascript
// 评论对象
const comment = {
    id: 1,                        // 唯一ID
    x: 100,                       // X坐标
    y: 200,                       // Y坐标
    author: '作者名',             // 作者
    content: '评论内容',          // 内容
    priority: 'normal',           // 优先级: low/normal/high/urgent
    status: 'unresolved',         // 状态: unresolved/resolved
    timestamp: '2024-01-15T...',  // 时间戳
    replies: []                   // 回复数组
};
```

## 🎨 样式自定义

### CSS 变量

您可以通过修改 CSS 变量来自定义外观：

```css
:root {
    --comment-primary-color: #007bff;
    --comment-success-color: #28a745;
    --comment-warning-color: #ffc107;
    --comment-danger-color: #dc3545;
    --comment-border-radius: 8px;
    --comment-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
```

### 主要类名

- `.comment-marker` - 评论标记
- `.comment-toolbar` - 工具栏
- `.comment-panel` - 评论面板
- `.comment-modal` - 模态框
- `.comment-popup` - 评论弹窗

## 📱 响应式支持

组件完全支持移动端：

- 触摸设备友好的交互
- 自适应布局
- 移动端优化的弹窗尺寸
- 触摸手势支持

## 💾 数据持久化

### 自动保存
- 默认开启，所有操作自动保存到 localStorage
- 页面刷新后数据自动恢复

### 数据导入导出
```javascript
// 导出数据
const data = commentSystem.exportComments();

// 导入数据
commentSystem.importComments(data);
```

导出格式：
```json
{
    "comments": [...],
    "exportTime": "2024-01-15T...",
    "version": "1.0.0"
}
```

## 🔍 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 📝 更新日志

### v1.0.0 (2024-01-15)
- ✨ 初始版本发布
- ✅ 完整的评论功能
- ✅ 响应式设计
- ✅ 键盘快捷键支持
- ✅ 数据导入导出
- ✅ 本地存储

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**享受使用评论系统组件！** 🎉

如有问题或建议，请随时联系。