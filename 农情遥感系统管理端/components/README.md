# 侧边栏组件使用说明

## 概述

侧边栏组件用于统一管理所有页面的左侧导航栏，避免代码重复，提高维护性。

## 文件结构

```
components/
├── sidebar.js      # 侧边栏JavaScript逻辑（包含HTML生成）
├── README.md       # 使用说明
├── test.html       # 测试页面
└── update-pages.md # 批量更新指南
```

## 使用方法

### 1. HTML结构

在页面中保留基本的侧边栏容器：

```html
<!-- 左侧菜单 - 使用组件 -->
<aside class="admin-sidebar">
  <!-- 侧边栏内容将由组件动态加载 -->
</aside>
```

### 2. 引入JavaScript

在页面底部引入侧边栏组件脚本：

```html
<!-- 脚本文件 -->
<script src="../../components/sidebar.js"></script>
```

**注意：** 路径需要根据当前页面相对于components目录的位置调整：
- `pages/dashboard/` → `../../components/sidebar.js`
- `pages/data-management/data-overview/` → `../../../components/sidebar.js`
- `pages/device-management/monitor/` → `../../../components/sidebar.js`

### 3. 自动初始化

组件会自动检测页面中的 `.admin-sidebar` 元素并替换为动态生成的导航栏。

**重要更新：** 组件现在直接在JavaScript中生成HTML，不再需要加载外部HTML文件，避免了路径问题和网络请求。

## 功能特性

### 自动路径检测

组件会根据当前页面URL自动：
- 设置正确的导航链接路径
- 标记当前页面为活动状态
- 计算相对路径

### 支持的页面类型

- `dashboard` - 仪表盘
- `data-overview` - 数据概览
- `remote-sensing` - 遥感数据
- `farmland` - 农田数据
- `device-management` - 设备管理
- `users` - 用户列表
- `roles` - 角色权限
- `system-config` - 系统配置
- `system-logs` - 系统日志

### 路径映射

组件会根据页面类型自动生成正确的导航链接：

```javascript
{
  'dashboard': 'pages/dashboard/dashboard.html',
  'data-overview': 'pages/data-management/data-overview/data-overview.html',
  'remote-sensing': 'pages/data-management/remote-sensing/list.html',
  'farmland': 'pages/data-management/farmland/list.html',
  'device-management': 'pages/device-management/monitor/monitor.html',
  // ...
}
```

## 页面迁移步骤

### 步骤1：替换HTML

将现有的完整侧边栏HTML替换为：

```html
<aside class="admin-sidebar">
  <!-- 侧边栏内容将由组件动态加载 -->
</aside>
```

### 步骤2：引入脚本

在页面底部添加组件脚本引用：

```html
<script src="[相对路径]/components/sidebar.js"></script>
```

### 步骤3：测试导航

确认页面加载后：
- 侧边栏正确显示
- 当前页面标记为活动状态
- 所有导航链接正确跳转

## 验证和测试

### 使用验证测试页面
打开 `components/验证测试.html` 进行完整的功能验证：
- 自动检测组件加载状态
- 测试侧边栏渲染和导航功能
- 验证页面间跳转是否正常
- 检查响应式布局适配

### 简单测试
打开 `components/test.html` 进行快速测试。

## 优势

1. **代码复用** - 避免在每个页面重复侧边栏代码
2. **统一维护** - 修改导航结构只需更新组件文件
3. **自动适配** - 组件自动处理路径和活动状态
4. **易于扩展** - 新增页面只需在组件中添加配置

## 注意事项

1. 确保正确的脚本引用路径
2. 保持现有的CSS样式不变
3. 新页面需要在组件中添加路径映射
4. 组件依赖现有的 `common.js` 中的侧边栏样式和功能