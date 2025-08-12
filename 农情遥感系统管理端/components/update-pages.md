# 批量更新页面使用侧边栏组件

## 需要更新的页面列表

以下页面需要更新以使用新的侧边栏组件：

### ✅ 已更新
- [x] `pages/dashboard/dashboard.html`
- [x] `pages/device-management/monitor/monitor.html`

### 📋 待更新
- [ ] `pages/data-management/data-overview/data-overview.html`
- [ ] `pages/data-management/remote-sensing/list.html`
- [ ] `pages/data-management/remote-sensing/import.html`
- [ ] `pages/data-management/farmland/list.html`
- [ ] `pages/data-management/farmland/crops.html`
- [ ] `pages/device-management/detail/detail.html`

## 更新步骤模板

对于每个页面，执行以下操作：

### 1. 替换侧边栏HTML

**查找：**
```html
<aside class="admin-sidebar">
  <div class="sidebar-content">
    <nav class="sidebar-nav">
      <!-- 大量的导航HTML代码 -->
    </nav>
  </div>
</aside>
```

**替换为：**
```html
<aside class="admin-sidebar">
  <!-- 侧边栏内容将由组件动态加载 -->
</aside>
```

### 2. 添加组件脚本引用

在页面底部的脚本引用中添加：

**不同目录的路径：**
- `pages/dashboard/` → `../../components/sidebar.js`
- `pages/data-management/data-overview/` → `../../../components/sidebar.js`
- `pages/data-management/remote-sensing/` → `../../../components/sidebar.js`
- `pages/data-management/farmland/` → `../../../components/sidebar.js`
- `pages/device-management/` → `../../../components/sidebar.js`

**示例：**
```html
<!-- 脚本文件 -->
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script src="../../../assets/js/common.js"></script>
<script src="../../../components/sidebar.js"></script>  <!-- 新增这行 -->
<script src="页面自己的js文件.js"></script>
```

## 验证清单

更新每个页面后，确认：

- [ ] 页面能正常加载
- [ ] 侧边栏正确显示
- [ ] 当前页面在导航中标记为活动状态
- [ ] 所有导航链接能正确跳转
- [ ] 侧边栏折叠/展开功能正常
- [ ] 响应式布局正常

## 注意事项

1. **路径计算**：确保组件脚本的引用路径正确
2. **加载顺序**：组件脚本应在common.js之后，页面自己的JS之前
3. **CSS兼容**：现有的侧边栏CSS样式会继续生效
4. **功能保持**：侧边栏的折叠、响应式等功能会保持不变

## 测试建议

1. **本地测试**：在本地环境测试所有页面
2. **跨页面导航**：测试页面间的跳转是否正常
3. **响应式测试**：在不同屏幕尺寸下测试
4. **功能测试**：确认侧边栏交互功能正常