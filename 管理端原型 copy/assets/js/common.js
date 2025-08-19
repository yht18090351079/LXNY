/**
 * 农情遥感系统管理端 - 通用JavaScript功能
 * 包含：导航管理、时间显示、用户菜单、通知系统、模态框等
 */

// 全局变量
window.ADMIN_SYSTEM = {
    currentUser: {
        name: '系统管理员',
        role: 'admin',
        avatar: '👤'
    },
    notifications: [],
    modals: new Map()
};

/**
 * 页面初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 管理端系统初始化...');
    
    // 初始化各种功能
    initializeTime();
    initializeSidebar();
    initializeUserMenu();
    initializeNotifications();
    initializeModals();
    initializeQuickActions();
    
    console.log('✅ 管理端系统初始化完成');
});

/**
 * 初始化时间显示
 */
function initializeTime() {
    const timeElement = document.getElementById('current-time');
    if (!timeElement) return;
    
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        timeElement.textContent = timeString;
    }
    
    // 立即更新一次
    updateTime();
    
    // 每秒更新
    setInterval(updateTime, 1000);
    
    console.log('🕒 时间显示初始化完成');
}

/**
 * 初始化侧边栏导航
 */
function initializeSidebar() {
    console.log('🧭 初始化侧边栏导航...');
    
    // 获取导航组
    const navGroups = document.querySelectorAll('.nav-group');
    
    // 为每个导航组添加点击事件
    navGroups.forEach(group => {
        const header = group.querySelector('.nav-item');
        if (header && group.querySelector('.nav-submenu')) {
            header.addEventListener('click', (e) => {
                e.preventDefault();
                toggleNavGroup(group);
            });
        }
    });
    
    // 根据当前页面路径自动展开相应的导航组
    const currentPath = window.location.pathname;
    if (currentPath.includes('/data-management/')) {
        const dataManagementGroup = navGroups[1]; // 第二个nav-group是数据管理
        if (dataManagementGroup) expandNavGroup(dataManagementGroup);
    } else if (currentPath.includes('/device-management/')) {
        const deviceManagementGroup = navGroups[2]; // 第三个nav-group是设备管理
        if (deviceManagementGroup) expandNavGroup(deviceManagementGroup);
    } else if (currentPath.includes('/user-management/')) {
        const userManagementGroup = navGroups[3]; // 第四个nav-group是用户管理
        if (userManagementGroup) expandNavGroup(userManagementGroup);
    } else if (currentPath.includes('/system-settings/')) {
        const systemSettingsGroup = navGroups[4]; // 第五个nav-group是系统设置
        if (systemSettingsGroup) expandNavGroup(systemSettingsGroup);
    } else if (currentPath.includes('/reports/')) {
        const reportsGroup = navGroups[5]; // 第六个nav-group是统计报告
        if (reportsGroup) expandNavGroup(reportsGroup);
    }
    
    // 高亮当前页面
    highlightCurrentPage();
    
    console.log('✅ 侧边栏导航初始化完成');
}

/**
 * 切换导航组展开/收起状态
 */
function toggleNavGroup(group) {
    if (group.classList.contains('expanded')) {
        collapseNavGroup(group);
    } else {
        expandNavGroup(group);
    }
}

/**
 * 展开导航组
 */
function expandNavGroup(group) {
    group.classList.add('expanded');
    const submenu = group.querySelector('.nav-submenu');
    if (submenu) {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
    }
}

/**
 * 收起导航组
 */
function collapseNavGroup(group) {
    group.classList.remove('expanded');
    const submenu = group.querySelector('.nav-submenu');
    if (submenu) {
        submenu.style.maxHeight = '0';
    }
}

/**
 * 高亮当前页面在导航中
 */
function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const currentFile = currentPath.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-subitem');
    
    navItems.forEach(item => {
        item.classList.remove('active');
        
        const href = item.getAttribute('href');
        if (href) {
            // 提取文件名进行比较
            const linkFile = href.split('/').pop();
            if (linkFile === currentFile || href.includes(currentFile)) {
                item.classList.add('active');
                
                // 如果是子菜单项，展开父菜单
                const parentGroup = item.closest('.nav-group');
                if (parentGroup) {
                    expandNavGroup(parentGroup);
                }
            }
        }
    });
    
    console.log('🎯 当前页面高亮完成:', currentFile);
}

/**
 * 初始化用户菜单
 */
function initializeUserMenu() {
    const userMenu = document.querySelector('.user-menu');
    const userAvatar = document.querySelector('.user-avatar');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (!userMenu || !userAvatar || !userDropdown) return;
    
    // 点击头像显示/隐藏下拉菜单
    userAvatar.addEventListener('click', (e) => {
        e.stopPropagation();
        userDropdown.classList.toggle('show');
    });
    
    // 点击其他地方隐藏下拉菜单
    document.addEventListener('click', () => {
        userDropdown.classList.remove('show');
    });
    
    // 阻止下拉菜单内的点击事件冒泡
    userDropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    console.log('👤 用户菜单初始化完成');
}

/**
 * 初始化通知系统
 */
function initializeNotifications() {
    // 创建通知容器
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
    
    console.log('🔔 通知系统初始化完成');
}

/**
 * 显示通知
 */
function showNotification(title, message, type = 'info', duration = 5000) {
    const container = document.querySelector('.notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const iconMap = {
        success: '✅',
        warning: '⚠️',
        error: '❌',
        info: 'ℹ️'
    };
    
    notification.innerHTML = `
        <div class="notification-icon">${iconMap[type] || 'ℹ️'}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">×</button>
    `;
    
    container.appendChild(notification);
    
    // 显示动画
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 关闭按钮事件
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        hideNotification(notification);
    });
    
    // 自动关闭
    if (duration > 0) {
        setTimeout(() => {
            hideNotification(notification);
        }, duration);
    }
    
    return notification;
}

/**
 * 隐藏通知
 */
function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

/**
 * 初始化模态框
 */
function initializeModals() {
    // 为所有模态框添加事件监听
    document.addEventListener('click', (e) => {
        // 打开模态框
        if (e.target.hasAttribute('data-modal')) {
            e.preventDefault();
            const modalId = e.target.getAttribute('data-modal');
            openModal(modalId);
        }
        
        // 关闭模态框
        if (e.target.classList.contains('modal-overlay') || 
            e.target.classList.contains('modal-close')) {
            e.preventDefault();
            closeModal();
        }
    });
    
    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    console.log('📱 模态框初始化完成');
}

/**
 * 打开模态框
 */
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // 触发自定义事件
    modal.dispatchEvent(new CustomEvent('modal:open'));
}

/**
 * 关闭模态框
 */
function closeModal() {
    const modals = document.querySelectorAll('.modal-overlay.show');
    modals.forEach(modal => {
        modal.classList.remove('show');
        modal.dispatchEvent(new CustomEvent('modal:close'));
    });
    
    document.body.style.overflow = '';
}

/**
 * 搜索功能
 */
function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 2) return;
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
}

/**
 * 执行搜索
 */
function performSearch(query) {
    console.log('🔍 搜索:', query);
    // 这里可以实现具体的搜索逻辑
    showNotification('搜索', `正在搜索: ${query}`, 'info', 3000);
}

/**
 * 表格排序功能
 */
function initializeTableSort() {
    const tables = document.querySelectorAll('.table-enhanced');
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('th.sortable');
        
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                const currentOrder = header.dataset.order || 'asc';
                const newOrder = currentOrder === 'asc' ? 'desc' : 'asc';
                
                // 清除其他列的排序状态
                headers.forEach(h => {
                    h.classList.remove('sorted', 'asc', 'desc');
                    h.removeAttribute('data-order');
                });
                
                // 设置当前列的排序状态
                header.classList.add('sorted', newOrder);
                header.dataset.order = newOrder;
                
                // 执行排序
                sortTable(table, column, newOrder);
            });
        });
    });
}

/**
 * 表格排序实现
 */
function sortTable(table, column, order) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    rows.sort((a, b) => {
        const aValue = a.querySelector(`[data-column="${column}"]`)?.textContent || '';
        const bValue = b.querySelector(`[data-column="${column}"]`)?.textContent || '';
        
        if (order === 'asc') {
            return aValue.localeCompare(bValue, 'zh-CN', { numeric: true });
        } else {
            return bValue.localeCompare(aValue, 'zh-CN', { numeric: true });
        }
    });
    
    // 重新排列行
    rows.forEach(row => tbody.appendChild(row));
}

/**
 * 表单验证
 */
function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

/**
 * 工具函数：格式化日期
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 工具函数：格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 工具函数：防抖
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 工具函数：节流
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 快捷操作配置和控制
 */
let quickActionsConfig = [
    {
        id: 'upload-remote-sensing',
        title: '上传遥感数据',
        icon: 'fas fa-satellite',
        url: 'pages/data-management/remote-sensing.html',
        color: 'primary'
    },
    {
        id: 'add-device',
        title: '添加设备',
        icon: 'fas fa-plus',
        url: 'pages/device-management/sensors.html',
        color: 'success'
    },
    {
        id: 'create-user',
        title: '创建用户',
        icon: 'fas fa-user-plus',
        url: 'pages/user-management/users.html',
        color: 'info'
    },
    {
        id: 'export-report',
        title: '导出报表',
        icon: 'fas fa-download',
        url: 'pages/reports/export.html',
        color: 'warning'
    }
];

// 可选的快捷操作预设
const quickActionsPresets = [
    {
        id: 'data-import',
        title: '数据导入',
        icon: 'fas fa-upload',
        url: 'pages/data-management/import.html',
        color: 'primary'
    },
    {
        id: 'system-backup',
        title: '系统备份',
        icon: 'fas fa-database',
        url: 'pages/system-settings/backup.html',
        color: 'secondary'
    },
    {
        id: 'weather-sync',
        title: '气象同步',
        icon: 'fas fa-cloud-sun',
        url: 'pages/data-management/weather.html',
        color: 'info'
    },
    {
        id: 'alert-config',
        title: '告警配置',
        icon: 'fas fa-bell',
        url: 'pages/system-settings/alerts.html',
        color: 'danger'
    },
    {
        id: 'analysis-report',
        title: '分析报告',
        icon: 'fas fa-chart-line',
        url: 'pages/reports/analysis.html',
        color: 'success'
    },
    {
        id: 'maintenance',
        title: '系统维护',
        icon: 'fas fa-tools',
        url: 'pages/system-settings/maintenance.html',
        color: 'secondary'
    }
];

/**
 * 初始化快捷操作
 */
function initializeQuickActions() {
    // 从本地存储加载配置
    loadQuickActionsConfig();
    
    // 渲染快捷操作
    renderQuickActions();
    
    console.log('📌 快捷操作边栏已初始化（可自定义模式）');
}

/**
 * 从本地存储加载快捷操作配置
 */
function loadQuickActionsConfig() {
    const savedConfig = localStorage.getItem('quickActionsConfig');
    if (savedConfig) {
        try {
            quickActionsConfig = JSON.parse(savedConfig);
        } catch (e) {
            console.warn('快捷操作配置加载失败，使用默认配置', e);
        }
    }
}

/**
 * 保存快捷操作配置到本地存储
 */
function saveQuickActionsConfig() {
    try {
        localStorage.setItem('quickActionsConfig', JSON.stringify(quickActionsConfig));
        console.log('快捷操作配置已保存');
    } catch (e) {
        console.error('保存快捷操作配置失败', e);
    }
}

/**
 * 渲染快捷操作
 */
function renderQuickActions() {
    const grid = document.getElementById('quickActionGrid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    quickActionsConfig.forEach(action => {
        const actionItem = createActionItem(action);
        grid.appendChild(actionItem);
    });
}

/**
 * 创建快捷操作项
 */
function createActionItem(action) {
    const item = document.createElement('div');
    item.className = 'action-item';
    item.onclick = () => {
        if (action.url) {
            window.location.href = action.url;
        } else if (action.callback && typeof window[action.callback] === 'function') {
            window[action.callback]();
        }
    };
    
    item.innerHTML = `
        <i class="${action.icon}"></i>
        <span>${action.title}</span>
    `;
    
    return item;
}

/**
 * 打开自定义模态框
 */
function openCustomizeModal() {
    const modal = document.getElementById('customizeModal');
    if (!modal) return;
    
    // 渲染当前操作和可选操作
    renderCurrentActionsList();
    renderAvailableActionsList();
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

/**
 * 关闭自定义模态框
 */
function closeCustomizeModal() {
    const modal = document.getElementById('customizeModal');
    if (!modal) return;
    
    modal.classList.remove('show');
    document.body.style.overflow = '';
}

/**
 * 渲染当前操作列表
 */
function renderCurrentActionsList() {
    const list = document.getElementById('currentActionsList');
    if (!list) return;
    
    list.innerHTML = '';
    
    if (quickActionsConfig.length === 0) {
        list.innerHTML = '<div class="empty-state">暂无快捷操作</div>';
        return;
    }
    
    quickActionsConfig.forEach((action, index) => {
        const item = document.createElement('div');
        item.className = 'customize-action-item';
        item.innerHTML = `
            <i class="${action.icon}"></i>
            <span>${action.title}</span>
            <button class="remove-btn" onclick="removeQuickAction(${index})">×</button>
        `;
        list.appendChild(item);
    });
}

/**
 * 渲染可选操作列表
 */
function renderAvailableActionsList() {
    const list = document.getElementById('availableActionsList');
    if (!list) return;
    
    list.innerHTML = '';
    
    // 过滤掉已经添加的操作
    const currentIds = quickActionsConfig.map(action => action.id);
    const availableActions = quickActionsPresets.filter(action => !currentIds.includes(action.id));
    
    if (availableActions.length === 0) {
        list.innerHTML = '<div class="empty-state">暂无可添加的操作</div>';
        return;
    }
    
    availableActions.forEach(action => {
        const item = document.createElement('div');
        item.className = 'customize-action-item';
        item.onclick = () => addQuickAction(action);
        item.innerHTML = `
            <i class="${action.icon}"></i>
            <span>${action.title}</span>
        `;
        list.appendChild(item);
    });
}

/**
 * 添加快捷操作
 */
function addQuickAction(action) {
    if (quickActionsConfig.find(item => item.id === action.id)) {
        showNotification('提示', '该操作已存在', 'warning', 2000);
        return;
    }
    
    quickActionsConfig.push(action);
    
    // 重新渲染列表
    renderCurrentActionsList();
    renderAvailableActionsList();
}

/**
 * 移除快捷操作
 */
function removeQuickAction(index) {
    if (index >= 0 && index < quickActionsConfig.length) {
        quickActionsConfig.splice(index, 1);
        
        // 重新渲染列表
        renderCurrentActionsList();
        renderAvailableActionsList();
    }
}

/**
 * 保存自定义配置
 */
function saveCustomization() {
    saveQuickActionsConfig();
    renderQuickActions();
    closeCustomizeModal();
    showNotification('保存成功', '快捷操作配置已更新', 'success', 2000);
}

/**
 * 侧边栏控制
 */
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebar) return;
    
    sidebar.classList.toggle('collapsed');
    
    if (sidebar.classList.contains('collapsed')) {
        console.log('📱 左侧边栏已收起');
    } else {
        console.log('📱 左侧边栏已展开');
    }
}

/**
 * 用户菜单控制
 */
function toggleUserMenu() {
    const userDropdown = document.getElementById('userDropdown');
    if (!userDropdown) return;
    
    userDropdown.classList.toggle('show');
}

/**
 * 用户操作函数
 */
function showUserProfile() {
    showNotification('个人信息功能正在开发中...', 'info');
}

function showSystemSettings() {
    showNotification('系统设置功能正在开发中...', 'info');
}

function logout() {
    if (confirm('确定要退出登录吗？')) {
        showNotification('正在退出...', 'info');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
    }
}

// 导出常用函数到全局
window.showNotification = showNotification;
window.openModal = openModal;
window.closeModal = closeModal;
window.formatDate = formatDate;
window.formatFileSize = formatFileSize;
window.debounce = debounce;
window.throttle = throttle;
window.validateForm = validateForm;
window.initializeSidebar = initializeSidebar;
window.updateTime = initializeTime;
window.initializeQuickActions = initializeQuickActions;
window.loadQuickActionsConfig = loadQuickActionsConfig;
window.saveQuickActionsConfig = saveQuickActionsConfig;
window.renderQuickActions = renderQuickActions;
window.openCustomizeModal = openCustomizeModal;
window.closeCustomizeModal = closeCustomizeModal;
window.addQuickAction = addQuickAction;
window.removeQuickAction = removeQuickAction;
window.saveCustomization = saveCustomization;
window.toggleSidebar = toggleSidebar;
window.toggleUserMenu = toggleUserMenu;
window.showUserProfile = showUserProfile;
window.showSystemSettings = showSystemSettings;
window.logout = logout;
