/**
 * 农情遥感系统管理端 - 用户管理功能
 * 功能：用户账户管理、权限分配、角色控制等
 */

// ===== 全局变量 =====
let currentPage = 1;
let pageSize = 20;
let totalRecords = 36;
let currentSort = { field: 'createTime', order: 'desc' };
let selectedRows = new Set();
let users = [];
let filteredUsers = [];
let roles = [];
let departments = [];
let charts = {};
let viewMode = 'list';

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeUserPage();
});

/**
 * 页面初始化
 */
function initializeUserPage() {
    console.log('👥 初始化用户管理页面...');
    
    // 生成模拟数据
    generateMockData();
    
    // 初始化图表
    initializeCharts();
    
    // 渲染页面内容
    renderUserOverview();
    renderRoleDistribution();
    renderUserActivity();
    renderUserTable();
    
    // 绑定事件
    bindEvents();
    
    console.log('✅ 用户管理页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟数据
 */
function generateMockData() {
    // 角色定义
    roles = [
        { 
            id: 'admin', 
            name: '系统管理员', 
            description: '拥有系统全部权限',
            permissions: ['user_management', 'system_config', 'data_management', 'device_management', 'report_view']
        },
        { 
            id: 'manager', 
            name: '业务管理员', 
            description: '负责业务数据管理',
            permissions: ['data_management', 'device_management', 'report_view']
        },
        { 
            id: 'operator', 
            name: '系统操作员', 
            description: '负责日常操作',
            permissions: ['device_management', 'report_view']
        },
        { 
            id: 'viewer', 
            name: '数据查看员', 
            description: '只能查看数据',
            permissions: ['report_view']
        }
    ];
    
    // 部门定义
    departments = [
        { id: 'tech', name: '技术部' },
        { id: 'business', name: '业务部' },
        { id: 'admin', name: '行政部' },
        { id: 'finance', name: '财务部' }
    ];
    
    const statuses = ['active', 'inactive', 'locked', 'disabled'];
    const statusWeights = [0.8, 0.1, 0.05, 0.05]; // 80%活跃用户
    
    const firstNames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
    const lastNames = ['伟', '芳', '娜', '敏', '静', '磊', '强', '军', '勇', '艳', '杰', '明', '丽', '华'];
    
    users = [];
    
    for (let i = 0; i < totalRecords; i++) {
        const role = roles[Math.floor(Math.random() * roles.length)];
        const department = departments[Math.floor(Math.random() * departments.length)];
        const status = getRandomByWeight(statuses, statusWeights);
        
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const realName = firstName + lastName;
        const username = `user${String(i + 1).padStart(3, '0')}`;
        
        // 创建时间在过去一年内
        const createTime = new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000);
        
        // 最后登录时间
        let lastLogin = null;
        if (status === 'active' && Math.random() < 0.9) {
            lastLogin = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000); // 过去30天内
        }
        
        const user = {
            id: `user_${String(i + 1).padStart(4, '0')}`,
            username: username,
            realName: realName,
            email: `${username}@example.com`,
            phone: `1${Math.floor(Math.random() * 9) + 3}${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
            role: role.id,
            roleName: role.name,
            department: department.id,
            departmentName: department.name,
            status: status,
            createTime: createTime,
            lastLogin: lastLogin,
            loginCount: Math.floor(Math.random() * 500 + 10),
            avatar: null, // 使用首字母作为头像
            description: `${role.name} - ${department.name}`,
            permissions: role.permissions,
            isOnline: status === 'active' && Math.random() < 0.3 // 30%的活跃用户在线
        };
        
        users.push(user);
    }
    
    // 按创建时间排序
    users.sort((a, b) => b.createTime - a.createTime);
    filteredUsers = [...users];
    
    console.log(`📊 生成了 ${users.length} 个用户账户`);
    console.log(`👥 包含 ${roles.length} 种用户角色`);
}

/**
 * 按权重随机选择
 */
function getRandomByWeight(items, weights) {
    const random = Math.random();
    let weightSum = 0;
    
    for (let i = 0; i < items.length; i++) {
        weightSum += weights[i];
        if (random <= weightSum) {
            return items[i];
        }
    }
    
    return items[items.length - 1];
}

// ===== 图表初始化 =====

/**
 * 初始化图表
 */
function initializeCharts() {
    initializeRoleDistributionChart();
    initializeUserActivityChart();
}

/**
 * 初始化角色分布图表
 */
function initializeRoleDistributionChart() {
    const chartDom = document.getElementById('roleDistributionChart');
    if (!chartDom) return;
    
    charts.roleDistribution = echarts.init(chartDom);
    updateRoleDistributionChart();
}

/**
 * 更新角色分布图表
 */
function updateRoleDistributionChart() {
    if (!charts.roleDistribution) return;
    
    // 统计各角色用户数量
    const roleStats = {};
    roles.forEach(role => {
        roleStats[role.id] = {
            name: role.name,
            count: 0,
            active: 0
        };
    });
    
    filteredUsers.forEach(user => {
        if (roleStats[user.role]) {
            roleStats[user.role].count++;
            if (user.status === 'active') {
                roleStats[user.role].active++;
            }
        }
    });
    
    // 准备图表数据
    const data = Object.keys(roleStats).map((roleId, index) => {
        const colors = ['#2E7D32', '#1976D2', '#F57C00', '#7B1FA2'];
        return {
            name: roleStats[roleId].name,
            value: roleStats[roleId].count,
            itemStyle: {
                color: colors[index % colors.length]
            }
        };
    }).filter(item => item.value > 0);
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#2E7D32',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: function(params) {
                const roleId = Object.keys(roleStats).find(id => 
                    roleStats[id].name === params.name
                );
                const stats = roleStats[roleId];
                
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>
                    <div style="display: flex; align-items: center; margin-bottom: 4px;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">用户总数:</span>
                        <span style="font-weight: bold;">${params.value} 人</span>
                    </div>
                    <div style="margin-bottom: 4px;">
                        <span style="margin-right: 16px;">活跃用户:</span>
                        <span style="font-weight: bold; color: #4CAF50;">${stats.active} 人</span>
                    </div>
                    <div style="color: #ccc; font-size: 11px;">
                        占比: ${params.percent}%
                    </div>
                `;
            }
        },
        legend: {
            orient: 'vertical',
            right: '10%',
            top: 'center',
            textStyle: {
                color: '#4A5568',
                fontSize: 12
            }
        },
        series: [
            {
                name: '用户角色',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: data
            }
        ]
    };
    
    charts.roleDistribution.setOption(option);
}

/**
 * 初始化用户活动图表
 */
function initializeUserActivityChart() {
    const chartDom = document.getElementById('userActivityChart');
    if (!chartDom) return;
    
    charts.userActivity = echarts.init(chartDom);
    updateUserActivityChart();
}

/**
 * 更新用户活动图表
 */
function updateUserActivityChart() {
    if (!charts.userActivity) return;
    
    // 生成过去7天的活动数据
    const days = [];
    const loginCounts = [];
    const activeCounts = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
        days.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        
        // 模拟登录和活跃用户数据
        const baseLogin = 15 + Math.random() * 10;
        const baseActive = baseLogin * (0.7 + Math.random() * 0.2); // 活跃用户是登录用户的70-90%
        
        loginCounts.push(Math.floor(baseLogin));
        activeCounts.push(Math.floor(baseActive));
    }
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#2E7D32',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            }
        },
        legend: {
            data: ['登录用户', '活跃用户'],
            top: 10,
            textStyle: {
                color: '#4A5568',
                fontSize: 12
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: days,
            axisLine: {
                lineStyle: {
                    color: '#E0E4E7'
                }
            },
            axisLabel: {
                color: '#718096',
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            name: '用户数',
            nameTextStyle: {
                color: '#718096',
                fontSize: 11
            },
            axisLine: {
                lineStyle: {
                    color: '#E0E4E7'
                }
            },
            axisLabel: {
                color: '#718096',
                fontSize: 11
            },
            splitLine: {
                lineStyle: {
                    color: '#F0F2F5',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '登录用户',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 3,
                    color: '#2E7D32'
                },
                itemStyle: {
                    color: '#2E7D32',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(46, 125, 50, 0.3)' },
                            { offset: 1, color: 'rgba(46, 125, 50, 0.05)' }
                        ]
                    }
                },
                data: loginCounts
            },
            {
                name: '活跃用户',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 3,
                    color: '#2196F3'
                },
                itemStyle: {
                    color: '#2196F3',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                data: activeCounts
            }
        ]
    };
    
    charts.userActivity.setOption(option);
}

// ===== 页面渲染 =====

/**
 * 渲染用户概览
 */
function renderUserOverview() {
    const totalUsers = filteredUsers.length;
    const activeUsers = filteredUsers.filter(u => u.status === 'active').length;
    const adminUsers = filteredUsers.filter(u => u.role === 'admin').length;
    const onlineUsers = filteredUsers.filter(u => u.isOnline).length;
    
    // 更新统计数值
    const totalEl = document.getElementById('totalUsers');
    const activeEl = document.getElementById('activeUsers');
    const adminEl = document.getElementById('adminUsers');
    const onlineEl = document.getElementById('onlineUsers');
    
    if (totalEl) animateCountUp(totalEl, totalUsers, 1000);
    if (activeEl) animateCountUp(activeEl, activeUsers, 1000);
    if (adminEl) animateCountUp(adminEl, adminUsers, 800);
    if (onlineEl) animateCountUp(onlineEl, onlineUsers, 800);
}

/**
 * 渲染角色分布
 */
function renderRoleDistribution() {
    updateRoleDistributionChart();
}

/**
 * 渲染用户活动
 */
function renderUserActivity() {
    updateUserActivityChart();
}

/**
 * 渲染用户表格
 */
function renderUserTable() {
    if (viewMode === 'card') {
        renderUserCards();
        return;
    }
    
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    
    // 计算当前页的数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredUsers.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>暂无用户</h3>
                        <p>当前筛选条件下没有找到匹配的用户</p>
                    </div>
                </td>
            </tr>
        `;
        updatePaginationInfo(0, 0, 0);
        return;
    }
    
    tbody.innerHTML = pageData.map(user => {
        const statusText = {
            active: '激活',
            inactive: '未激活',
            locked: '锁定',
            disabled: '禁用'
        }[user.status];
        
        const lastLoginText = user.lastLogin ? 
            formatTimeAgo(user.lastLogin) : '从未登录';
        
        // 生成用户头像（使用真实姓名首字母）
        const avatarText = user.realName.charAt(0);
        
        return `
            <tr ${selectedRows.has(user.id) ? 'class="selected"' : ''}>
                <td>
                    <input type="checkbox" ${selectedRows.has(user.id) ? 'checked' : ''} 
                           onchange="toggleRowSelection('${user.id}')">
                </td>
                <td>
                    <div class="user-avatar-cell">
                        <div class="user-avatar">${avatarText}</div>
                        <div class="user-info">
                            <h4>${user.username}</h4>
                            ${user.isOnline ? '<small style="color: var(--success-color);"><i class="fas fa-circle"></i> 在线</small>' : ''}
                        </div>
                    </div>
                </td>
                <td class="user-name">${user.realName}</td>
                <td>
                    <div class="user-email">${user.email}</div>
                    <small>${user.phone}</small>
                </td>
                <td>
                    <span class="role-badge ${user.role}">${user.roleName}</span>
                </td>
                <td>
                    <span class="department-tag">${user.departmentName}</span>
                </td>
                <td>
                    <span class="user-status ${user.status}">${statusText}</span>
                </td>
                <td>
                    <div class="login-time">${lastLoginText}</div>
                    <small>登录${user.loginCount}次</small>
                </td>
                <td>
                    <div class="create-time">${user.createTime.toLocaleDateString('zh-CN')}</div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewUserDetails('${user.id}')" 
                                data-tooltip="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="editUser('${user.id}')"
                                data-tooltip="编辑用户">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn ${user.status === 'active' ? 'lock' : 'unlock'}" 
                                onclick="toggleUserStatus('${user.id}')"
                                data-tooltip="${user.status === 'active' ? '锁定用户' : '激活用户'}">
                            <i class="fas fa-${user.status === 'active' ? 'lock' : 'unlock'}"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteUser('${user.id}')"
                                data-tooltip="删除用户">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // 更新分页信息
    updatePaginationInfo(startIndex + 1, Math.min(endIndex, filteredUsers.length), filteredUsers.length);
    updatePaginationControls();
    updateBatchActionButtons();
}

/**
 * 渲染用户卡片
 */
function renderUserCards() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
    
    // 计算当前页的数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredUsers.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        tableContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>暂无用户</h3>
                <p>当前筛选条件下没有找到匹配的用户</p>
            </div>
        `;
        return;
    }
    
    tableContainer.innerHTML = `
        <div class="user-card-grid">
            ${pageData.map(user => {
                const statusText = {
                    active: '激活',
                    inactive: '未激活',
                    locked: '锁定',
                    disabled: '禁用'
                }[user.status];
                
                const avatarText = user.realName.charAt(0);
                
                return `
                    <div class="user-card ${selectedRows.has(user.id) ? 'selected' : ''}">
                        <div class="user-card-avatar">${avatarText}</div>
                        <div class="user-card-name">${user.realName}</div>
                        <div class="user-card-email">${user.email}</div>
                        <div class="user-card-meta">
                            <span class="role-badge ${user.role}">${user.roleName}</span>
                            <span class="user-status ${user.status}">${statusText}</span>
                        </div>
                        <div class="user-card-actions">
                            <button class="user-card-btn view" onclick="viewUserDetails('${user.id}')" 
                                    data-tooltip="查看详情">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="user-card-btn edit" onclick="editUser('${user.id}')"
                                    data-tooltip="编辑用户">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="user-card-btn delete" onclick="deleteUser('${user.id}')"
                                    data-tooltip="删除用户">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    // 更新分页信息
    updatePaginationInfo(startIndex + 1, Math.min(endIndex, filteredUsers.length), filteredUsers.length);
    updatePaginationControls();
}

// ===== 工具函数 =====

/**
 * 数字动画效果
 */
function animateCountUp(element, targetValue, duration = 1000) {
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const increment = (targetValue - startValue) / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        
        if ((increment > 0 && currentValue >= targetValue) || 
            (increment < 0 && currentValue <= targetValue)) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(currentValue);
    }, 16);
}

/**
 * 格式化时间差
 */
function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 30) return `${days}天前`;
    
    return date.toLocaleDateString('zh-CN');
}

/**
 * 更新分页信息
 */
function updatePaginationInfo(start, end, total) {
    const pageStartEl = document.getElementById('pageStart');
    const pageEndEl = document.getElementById('pageEnd');
    const totalRecordsEl = document.getElementById('totalRecords');
    
    if (pageStartEl) pageStartEl.textContent = start;
    if (pageEndEl) pageEndEl.textContent = end;
    if (totalRecordsEl) totalRecordsEl.textContent = total;
}

/**
 * 更新分页控件
 */
function updatePaginationControls() {
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const pageNumbersEl = document.getElementById('pageNumbers');
    
    if (!pageNumbersEl) return;
    
    // 生成页码按钮
    let pageNumbers = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changePage(${i})">${i}</button>
        `;
    }
    
    pageNumbersEl.innerHTML = pageNumbers;
    
    // 更新导航按钮状态
    const firstPageBtn = document.getElementById('firstPageBtn');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const lastPageBtn = document.getElementById('lastPageBtn');
    
    if (firstPageBtn) firstPageBtn.disabled = currentPage === 1;
    if (prevPageBtn) prevPageBtn.disabled = currentPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentPage === totalPages;
    if (lastPageBtn) lastPageBtn.disabled = currentPage === totalPages;
}

/**
 * 更新批量操作按钮状态
 */
function updateBatchActionButtons() {
    const hasSelection = selectedRows.size > 0;
    
    const buttons = [
        'batchActivateBtn',
        'batchDeactivateBtn',
        'batchResetBtn'
    ];
    
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = !hasSelection;
        }
    });
}

// ===== 事件绑定 =====

/**
 * 绑定事件
 */
function bindEvents() {
    // 表格排序
    document.querySelectorAll('th[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const field = this.getAttribute('data-sort');
            handleSort(field);
        });
    });
    
    // 筛选器变化
    const filters = ['roleFilter', 'statusFilter', 'departmentFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', debounce(applyFilters, 300));
        }
    });
    
    // 搜索框
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleSearch, 300));
    }
    
    // 窗口大小变化时重新调整图表
    window.addEventListener('resize', debounce(() => {
        Object.values(charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }, 200));
}

// ===== 功能函数 =====

/**
 * 刷新角色图表
 */
function refreshRoleChart() {
    updateRoleDistributionChart();
    showNotification('角色分布图表已刷新', 'success');
}

/**
 * 刷新活动图表
 */
function refreshActivityChart() {
    updateUserActivityChart();
    showNotification('用户活动图表已刷新', 'success');
}

/**
 * 切换视图模式
 */
function toggleView(mode) {
    viewMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('.table-actions .btn-icon').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 渲染对应视图
    renderUserTable();
    
    const viewNames = {
        card: '卡片视图',
        list: '列表视图'
    };
    
    showNotification(`已切换到${viewNames[mode]}`, 'success');
}

/**
 * 应用筛选
 */
function applyFilters() {
    const role = document.getElementById('roleFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const department = document.getElementById('departmentFilter')?.value || '';
    const searchText = document.querySelector('.search-input')?.value?.toLowerCase() || '';
    
    filteredUsers = users.filter(user => {
        // 角色筛选
        if (role && user.role !== role) {
            return false;
        }
        
        // 状态筛选
        if (status && user.status !== status) {
            return false;
        }
        
        // 部门筛选
        if (department && user.department !== department) {
            return false;
        }
        
        // 搜索文本筛选
        if (searchText) {
            const searchFields = [
                user.username,
                user.realName,
                user.email,
                user.phone,
                user.roleName,
                user.departmentName,
                user.description
            ].join(' ').toLowerCase();
            if (!searchFields.includes(searchText)) {
                return false;
            }
        }
        
        return true;
    });
    
    // 重置到第一页
    currentPage = 1;
    selectedRows.clear();
    
    renderUserTable();
    renderUserOverview();
    updateRoleDistributionChart();
    
    const filterCount = [role, status, department, searchText].filter(Boolean).length;
    if (filterCount > 0) {
        showNotification(`已应用 ${filterCount} 个筛选条件，找到 ${filteredUsers.length} 个用户`, 'info');
    }
}

/**
 * 清除筛选
 */
function clearFilters() {
    // 清除筛选器值
    const filterElements = [
        'roleFilter',
        'statusFilter',
        'departmentFilter'
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    // 清除搜索框
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    // 重置数据
    filteredUsers = [...users];
    currentPage = 1;
    selectedRows.clear();
    
    renderUserTable();
    renderUserOverview();
    updateRoleDistributionChart();
    
    showNotification('已清除所有筛选条件', 'success');
}

/**
 * 处理搜索
 */
function handleSearch() {
    applyFilters();
}

/**
 * 处理排序
 */
function handleSort(field) {
    if (currentSort.field === field) {
        currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
    } else {
        currentSort.field = field;
        currentSort.order = 'desc';
    }
    
    // 应用排序
    filteredUsers.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (field === 'createTime' || field === 'lastLogin') {
            aVal = aVal ? aVal.getTime() : 0;
            bVal = bVal ? bVal.getTime() : 0;
        } else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (currentSort.order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    currentPage = 1;
    renderUserTable();
    
    showNotification(`已按${getSortFieldName(field)}${currentSort.order === 'asc' ? '升序' : '降序'}排列`, 'success');
}

/**
 * 获取排序字段名称
 */
function getSortFieldName(field) {
    const fieldNames = {
        username: '用户名',
        realName: '真实姓名',
        email: '邮箱',
        role: '角色',
        department: '部门',
        status: '状态',
        lastLogin: '最后登录',
        createTime: '创建时间'
    };
    return fieldNames[field] || field;
}

/**
 * 切换行选择
 */
function toggleRowSelection(id) {
    if (selectedRows.has(id)) {
        selectedRows.delete(id);
    } else {
        selectedRows.add(id);
    }
    
    renderUserTable();
}

/**
 * 切换全选
 */
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const isChecked = selectAllCheckbox.checked;
    
    selectedRows.clear();
    
    if (isChecked) {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageData = filteredUsers.slice(startIndex, endIndex);
        
        pageData.forEach(user => {
            selectedRows.add(user.id);
        });
    }
    
    renderUserTable();
}

/**
 * 切换页面
 */
function changePage(action) {
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    
    switch(action) {
        case 'first':
            currentPage = 1;
            break;
        case 'prev':
            currentPage = Math.max(1, currentPage - 1);
            break;
        case 'next':
            currentPage = Math.min(totalPages, currentPage + 1);
            break;
        case 'last':
            currentPage = totalPages;
            break;
        default:
            if (typeof action === 'number') {
                currentPage = Math.max(1, Math.min(totalPages, action));
            }
    }
    
    selectedRows.clear();
    renderUserTable();
}

// ===== 用户操作 =====

/**
 * 查看用户详情
 */
function viewUserDetails(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        showNotification('用户不存在', 'error');
        return;
    }
    
    const role = roles.find(r => r.id === user.role);
    const statusText = {
        active: '激活',
        inactive: '未激活',
        locked: '锁定',
        disabled: '禁用'
    }[user.status];
    
    const avatarText = user.realName.charAt(0);
    
    const content = `
        <div class="user-detail-content">
            <div class="detail-section">
                <div class="user-avatar-large">${avatarText}</div>
                <h4><i class="fas fa-user"></i> 基本信息</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>用户名:</label>
                        <span>${user.username}</span>
                    </div>
                    <div class="detail-item">
                        <label>真实姓名:</label>
                        <span>${user.realName}</span>
                    </div>
                    <div class="detail-item">
                        <label>邮箱地址:</label>
                        <span>${user.email}</span>
                    </div>
                    <div class="detail-item">
                        <label>手机号码:</label>
                        <span>${user.phone}</span>
                    </div>
                    <div class="detail-item">
                        <label>用户角色:</label>
                        <span class="role-badge ${user.role}">${user.roleName}</span>
                    </div>
                    <div class="detail-item">
                        <label>所属部门:</label>
                        <span>${user.departmentName}</span>
                    </div>
                    <div class="detail-item">
                        <label>账户状态:</label>
                        <span class="user-status ${user.status}">${statusText}</span>
                    </div>
                    <div class="detail-item">
                        <label>创建时间:</label>
                        <span>${user.createTime.toLocaleString('zh-CN')}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-chart-line"></i> 使用统计</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>登录次数:</label>
                        <span>${user.loginCount} 次</span>
                    </div>
                    <div class="detail-item">
                        <label>最后登录:</label>
                        <span>${user.lastLogin ? user.lastLogin.toLocaleString('zh-CN') : '从未登录'}</span>
                    </div>
                    <div class="detail-item">
                        <label>在线状态:</label>
                        <span style="color: ${user.isOnline ? 'var(--success-color)' : 'var(--text-tertiary)'};">
                            <i class="fas fa-circle"></i> ${user.isOnline ? '在线' : '离线'}
                        </span>
                    </div>
                </div>
                
                <h4 style="margin-top: var(--spacing-lg);"><i class="fas fa-shield-alt"></i> 权限列表</h4>
                <div class="permission-list">
                    ${role.permissions.map(permission => {
                        const permissionNames = {
                            user_management: '用户管理',
                            system_config: '系统配置',
                            data_management: '数据管理',
                            device_management: '设备管理',
                            report_view: '报表查看'
                        };
                        return `
                            <div class="permission-item">
                                <span class="permission-name">${permissionNames[permission] || permission}</span>
                                <span class="permission-status granted">已授权</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
    `;
    
    showModal({
        title: `用户详情 - ${user.realName}`,
        content: content,
        actions: [
            { text: '编辑用户', class: 'btn-secondary', onclick: `editUser('${id}'); closeModal();` },
            { text: '重置密码', class: 'btn-secondary', onclick: `resetUserPassword('${id}'); closeModal();` },
            { text: '关闭', class: 'btn-primary', onclick: 'closeModal()' }
        ]
    });
}

/**
 * 编辑用户
 */
function editUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        showNotification('用户不存在', 'error');
        return;
    }
    
    showNotification(`编辑用户: ${user.realName}`, 'info');
}

/**
 * 切换用户状态
 */
function toggleUserStatus(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        showNotification('用户不存在', 'error');
        return;
    }
    
    const newStatus = user.status === 'active' ? 'locked' : 'active';
    const actionText = newStatus === 'active' ? '激活' : '锁定';
    
    showConfirm(`确定要${actionText}用户 "${user.realName}" 吗？`, () => {
        user.status = newStatus;
        renderUserTable();
        renderUserOverview();
        showNotification(`用户 ${user.realName} 已${actionText}`, 'success');
    });
}

/**
 * 删除用户
 */
function deleteUser(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        showNotification('用户不存在', 'error');
        return;
    }
    
    showConfirm(`确定要删除用户 "${user.realName}" 吗？\n\n此操作不可撤销。`, () => {
        // 从数据中移除
        const index = users.findIndex(u => u.id === id);
        if (index > -1) {
            users.splice(index, 1);
        }
        
        const filteredIndex = filteredUsers.findIndex(u => u.id === id);
        if (filteredIndex > -1) {
            filteredUsers.splice(filteredIndex, 1);
        }
        
        selectedRows.delete(id);
        totalRecords = users.length;
        
        renderUserTable();
        renderUserOverview();
        updateRoleDistributionChart();
        
        showNotification(`用户 ${user.realName} 已删除`, 'success');
    });
}

/**
 * 重置用户密码
 */
function resetUserPassword(id) {
    const user = users.find(u => u.id === id);
    if (!user) {
        showNotification('用户不存在', 'error');
        return;
    }
    
    showConfirm(`确定要重置用户 "${user.realName}" 的密码吗？\n\n新密码将发送到用户邮箱。`, () => {
        showNotification(`已重置用户 ${user.realName} 的密码，新密码已发送到邮箱`, 'success');
    });
}

// ===== 批量操作 =====

/**
 * 批量激活
 */
function batchActivate() {
    if (selectedRows.size === 0) {
        showNotification('请先选择要激活的用户', 'warning');
        return;
    }
    
    showConfirm(`确定要激活选中的 ${selectedRows.size} 个用户吗？`, () => {
        let activatedCount = 0;
        
        selectedRows.forEach(id => {
            const user = users.find(u => u.id === id);
            if (user && user.status !== 'active') {
                user.status = 'active';
                activatedCount++;
            }
        });
        
        selectedRows.clear();
        renderUserTable();
        renderUserOverview();
        
        showNotification(`已激活 ${activatedCount} 个用户账户`, 'success');
    });
}

/**
 * 批量禁用
 */
function batchDeactivate() {
    if (selectedRows.size === 0) {
        showNotification('请先选择要禁用的用户', 'warning');
        return;
    }
    
    showConfirm(`确定要禁用选中的 ${selectedRows.size} 个用户吗？`, () => {
        let deactivatedCount = 0;
        
        selectedRows.forEach(id => {
            const user = users.find(u => u.id === id);
            if (user && user.status === 'active') {
                user.status = 'disabled';
                user.isOnline = false;
                deactivatedCount++;
            }
        });
        
        selectedRows.clear();
        renderUserTable();
        renderUserOverview();
        
        showNotification(`已禁用 ${deactivatedCount} 个用户账户`, 'success');
    });
}

/**
 * 批量重置密码
 */
function batchResetPassword() {
    if (selectedRows.size === 0) {
        showNotification('请先选择要重置密码的用户', 'warning');
        return;
    }
    
    showConfirm(`确定要重置选中的 ${selectedRows.size} 个用户的密码吗？\n\n新密码将发送到用户邮箱。`, () => {
        showNotification(`已重置 ${selectedRows.size} 个用户的密码，新密码已发送到各自邮箱`, 'success');
        selectedRows.clear();
        renderUserTable();
    });
}

// ===== 其他功能 =====

/**
 * 显示添加用户模态框
 */
function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * 关闭添加用户模态框
 */
function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.classList.remove('show');
        
        // 重置表单
        const form = document.getElementById('addUserForm');
        if (form) {
            form.reset();
        }
    }
}

/**
 * 保存用户
 */
function saveUser() {
    const form = document.getElementById('addUserForm');
    if (!form) return;
    
    // 验证必填字段
    const requiredFields = ['username', 'realName', 'email', 'userRole', 'userDepartment', 'password', 'confirmPassword'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element || !element.value.trim()) {
            showNotification(`请填写${element?.previousElementSibling?.textContent || field}`, 'error');
            isValid = false;
        }
    });
    
    if (!isValid) return;
    
    // 验证密码确认
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('两次输入的密码不一致', 'error');
        return;
    }
    
    // 验证用户名唯一性
    const username = document.getElementById('username').value;
    if (users.find(u => u.username === username)) {
        showNotification('用户名已存在', 'error');
        return;
    }
    
    // 创建新用户
    const role = roles.find(r => r.id === document.getElementById('userRole').value);
    const department = departments.find(d => d.id === document.getElementById('userDepartment').value);
    
    const newUser = {
        id: `user_${Date.now()}`,
        username: username,
        realName: document.getElementById('realName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value || '',
        role: role.id,
        roleName: role.name,
        department: department.id,
        departmentName: department.name,
        status: 'active',
        createTime: new Date(),
        lastLogin: null,
        loginCount: 0,
        avatar: null,
        description: document.getElementById('userDescription').value || `${role.name} - ${department.name}`,
        permissions: role.permissions,
        isOnline: false
    };
    
    // 添加到用户列表
    users.unshift(newUser);
    totalRecords = users.length;
    
    // 重新应用筛选
    applyFilters();
    
    // 关闭模态框
    closeAddUserModal();
    
    showNotification(`用户 ${newUser.realName} 添加成功`, 'success');
}

/**
 * 导出用户列表
 */
function exportUserList() {
    showNotification('用户列表导出功能开发中...', 'info');
}

/**
 * 导出用户
 */
function exportUsers() {
    showNotification('用户数据导出功能开发中...', 'info');
}

// ===== 工具函数 =====

/**
 * 防抖函数（如果common.js中没有定义）
 */
if (typeof debounce === 'undefined') {
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
 
 
 
 
 
 
 
 
 