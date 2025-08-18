/**
 * 农情遥感系统管理端 - 预警信息留痕管理功能
 * 功能：预警信息生命周期追踪、操作记录管理、数据分析等
 */

// ===== 全局变量 =====
let alertLogs = [];
let filteredAlertLogs = [];
let currentAlertPage = 1;
let alertPageSize = 20;
let currentTimelinePage = 1;
let timelinePageSize = 10;
let totalAlertRecords = 156;
let currentAlertSort = { field: 'createTime', order: 'desc' };
let alertCharts = {};
let alertViewMode = 'table';
let alertAutoRefreshInterval = null;
let currentAlertTimeRange = '7d';

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAlertLogPage();
});

/**
 * 页面初始化
 */
function initializeAlertLogPage() {
    console.log('⚠️ 初始化预警信息留痕管理页面...');
    
    // 生成模拟数据
    generateMockAlertData();
    
    // 初始化图表
    initializeAlertCharts();
    
    // 渲染页面内容
    renderAlertOverview();
    renderAlertTrendChart();
    renderAlertTypeChart();
    renderAlertTable();
    
    // 绑定事件
    bindAlertEvents();
    
    // 设置默认时间范围
    setDefaultAlertDateRange();
    
    console.log('✅ 预警信息留痕管理页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟预警数据
 */
function generateMockAlertData() {
    const alertTypes = [
        { name: '暴雨预警', icon: '🌧️', weight: 0.25 },
        { name: '低温预警', icon: '🌡️', weight: 0.20 },
        { name: '雷电预警', icon: '⚡', weight: 0.15 },
        { name: '大风预警', icon: '🌪️', weight: 0.15 },
        { name: '暴雪预警', icon: '🌨️', weight: 0.15 },
        { name: '大雾预警', icon: '🌫️', weight: 0.10 }
    ];
    
    const alertLevels = [
        { level: 'info', name: '蓝色预警', color: '#3498db', weight: 0.4 },
        { level: 'warning', name: '黄色预警', color: '#f1c40f', weight: 0.35 },
        { level: 'danger', name: '橙色预警', color: '#e67e22', weight: 0.20 },
        { level: 'critical', name: '红色预警', color: '#e74c3c', weight: 0.05 }
    ];
    
    const operators = [
        { id: 'admin', name: '系统管理员' },
        { id: 'user001', name: '张三' },
        { id: 'user002', name: '李四' },
        { id: 'user003', name: '王五' }
    ];
    
    const operationTypes = [
        { id: 'create', name: '创建录入', icon: '➕', color: '#27ae60' },
        { id: 'display', name: '开始展示', icon: '📺', color: '#3498db' },
        { id: 'cancel', name: '取消展示', icon: '⏹️', color: '#e67e22' },
        { id: 'expire', name: '自动过期', icon: '⏰', color: '#95a5a6' },
        { id: 'restore', name: '恢复展示', icon: '🔄', color: '#9b59b6' }
    ];
    
    const currentStatuses = [
        { status: 'displaying', name: '正在展示', weight: 0.1 },
        { status: 'cancelled', name: '已取消展示', weight: 0.2 },
        { status: 'expired', name: '已过期', weight: 0.7 }
    ];
    
    alertLogs = [];
    
    for (let i = 0; i < totalAlertRecords; i++) {
        const alertType = getRandomByWeight(alertTypes, alertTypes.map(t => t.weight));
        const alertLevel = getRandomByWeight(alertLevels, alertLevels.map(l => l.weight));
        const currentStatus = getRandomByWeight(currentStatuses, currentStatuses.map(s => s.weight));
        
        // 生成发布时间（过去90天内）
        const publishTime = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
        
        // 生成录入时间（发布时间后0-6小时内）
        const createTime = new Date(publishTime.getTime() + Math.random() * 6 * 60 * 60 * 1000);
        
        // 生成预警编号
        const alertId = `ALERT_${publishTime.getFullYear()}${String(publishTime.getMonth() + 1).padStart(2, '0')}${String(publishTime.getDate()).padStart(2, '0')}_${String(i + 1).padStart(3, '0')}`;
        
        // 生成操作历史
        const operations = generateAlertOperations(alertType, alertLevel, currentStatus, createTime, operators, operationTypes);
        
        const alertLog = {
            id: `alert_log_${String(i + 1).padStart(6, '0')}`,
            alertId: alertId,
            alertType: alertType.name,
            alertIcon: alertType.icon,
            alertLevel: alertLevel.level,
            alertLevelName: alertLevel.name,
            alertLevelColor: alertLevel.color,
            alertContent: generateAlertContent(alertType, alertLevel),
            publishTime: publishTime,
            createTime: createTime,
            currentStatus: currentStatus.status,
            currentStatusName: currentStatus.name,
            lastOperateTime: operations[operations.length - 1].operateTime,
            operations: operations,
            totalOperations: operations.length
        };
        
        alertLogs.push(alertLog);
    }
    
    // 按创建时间排序
    alertLogs.sort((a, b) => b.createTime - a.createTime);
    filteredAlertLogs = [...alertLogs];
    
    console.log(`⚠️ 生成了 ${alertLogs.length} 条预警留痕记录`);
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

/**
 * 生成预警操作历史
 */
function generateAlertOperations(alertType, alertLevel, currentStatus, createTime, operators, operationTypes) {
    const operations = [];
    let currentTime = createTime;
    
    // 1. 创建录入操作（必有）
    const createOperator = operators[Math.floor(Math.random() * operators.length)];
    operations.push({
        id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'create',
        typeName: '创建录入',
        operator: createOperator.id,
        operatorName: createOperator.name,
        operateTime: new Date(currentTime),
        description: `录入${alertType.name}${alertLevel.name}信息`,
        result: 'success',
        ip: generateRandomIP()
    });
    
    currentTime = new Date(currentTime.getTime() + Math.random() * 10 * 60 * 1000); // 0-10分钟后
    
    // 2. 开始展示操作（大部分预警都会展示）
    if (Math.random() > 0.1) {
        const displayOperator = operators[Math.floor(Math.random() * operators.length)];
        operations.push({
            id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'display',
            typeName: '开始展示',
            operator: displayOperator.id,
            operatorName: displayOperator.name,
            operateTime: new Date(currentTime),
            description: `预警信息开始在大屏展示`,
            result: 'success',
            ip: generateRandomIP()
        });
        
        currentTime = new Date(currentTime.getTime() + Math.random() * 24 * 60 * 60 * 1000); // 0-24小时后
    }
    
    // 3. 根据当前状态生成后续操作
    if (currentStatus.status === 'cancelled') {
        const cancelOperator = operators[Math.floor(Math.random() * operators.length)];
        operations.push({
            id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'cancel',
            typeName: '取消展示',
            operator: cancelOperator.id,
            operatorName: cancelOperator.name,
            operateTime: new Date(currentTime),
            description: `手动取消预警信息的大屏展示`,
            result: 'success',
            ip: generateRandomIP()
        });
        
        // 可能的恢复操作
        if (Math.random() > 0.7) {
            currentTime = new Date(currentTime.getTime() + Math.random() * 12 * 60 * 60 * 1000);
            const restoreOperator = operators[Math.floor(Math.random() * operators.length)];
            operations.push({
                id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'restore',
                typeName: '恢复展示',
                operator: restoreOperator.id,
                operatorName: restoreOperator.name,
                operateTime: new Date(currentTime),
                description: `恢复预警信息的大屏展示`,
                result: 'success',
                ip: generateRandomIP()
            });
        }
    } else if (currentStatus.status === 'expired') {
        operations.push({
            id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'expire',
            typeName: '自动过期',
            operator: 'system',
            operatorName: '系统自动',
            operateTime: new Date(currentTime),
            description: `预警信息达到时效期限，系统自动过期处理`,
            result: 'success',
            ip: '系统内部'
        });
    }
    
    return operations;
}

/**
 * 生成预警内容
 */
function generateAlertContent(alertType, alertLevel) {
    const templates = {
        '暴雨预警': `临夏县气象局发布暴雨${alertLevel.name}，预计未来6-12小时内将出现强降雨天气，请注意防范。`,
        '低温预警': `临夏县气象局发布低温${alertLevel.name}，预计最低气温将降至5°C以下，请做好防寒保温工作。`,
        '雷电预警': `临夏县气象局发布雷电${alertLevel.name}，预计将出现雷电天气，请注意人身和财产安全。`,
        '大风预警': `临夏县气象局发布大风${alertLevel.name}，预计风力将达到7级以上，请加固设施并注意安全。`,
        '暴雪预警': `临夏县气象局发布暴雪${alertLevel.name}，预计将出现强降雪天气，请注意交通安全。`,
        '大雾预警': `临夏县气象局发布大雾${alertLevel.name}，预计能见度将低于500米，请注意交通安全。`
    };
    
    return templates[alertType.name] || `临夏县气象局发布${alertType.name}${alertLevel.name}，请注意防范。`;
}

/**
 * 生成随机IP地址
 */
function generateRandomIP() {
    const ips = [
        '192.168.1.100', '192.168.1.101', '192.168.1.102',
        '10.0.0.50', '10.0.0.51', '172.16.0.100'
    ];
    return ips[Math.floor(Math.random() * ips.length)];
}

// ===== 图表初始化 =====

/**
 * 初始化预警图表
 */
function initializeAlertCharts() {
    alertCharts.trendChart = echarts.init(document.getElementById('alertTrendChart'));
    alertCharts.typeChart = echarts.init(document.getElementById('alertTypeChart'));
    
    // 监听窗口大小变化
    window.addEventListener('resize', function() {
        Object.values(alertCharts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    });
}

/**
 * 渲染预警统计概览
 */
function renderAlertOverview() {
    // 计算统计数据
    const stats = {
        total: alertLogs.length,
        active: alertLogs.filter(log => log.currentStatus === 'displaying').length,
        expired: alertLogs.filter(log => log.currentStatus === 'expired').length,
        operations: alertLogs.reduce((sum, log) => sum + log.totalOperations, 0)
    };
    
    // 更新DOM
    document.getElementById('totalAlerts').textContent = stats.total;
    document.getElementById('activeAlerts').textContent = stats.active;
    document.getElementById('expiredAlerts').textContent = stats.expired;
    document.getElementById('totalOperations').textContent = stats.operations;
    
    console.log('📊 预警统计概览已更新', stats);
}

/**
 * 渲染预警趋势图表
 */
function renderAlertTrendChart() {
    const days = parseInt(currentAlertTimeRange.replace('d', ''));
    const dates = [];
    const alertCounts = [];
    
    // 生成日期和对应的预警数量
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dates.push(dateStr);
        
        // 计算该日期的预警数量
        const count = alertLogs.filter(log => {
            const logDate = log.publishTime.toISOString().split('T')[0];
            return logDate === dateStr;
        }).length;
        alertCounts.push(count);
    }
    
    const option = {
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.8)',
            borderColor: '#333',
            textStyle: { color: '#fff' }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: dates.map(date => {
                const d = new Date(date);
                return `${d.getMonth() + 1}/${d.getDate()}`;
            }),
            axisLabel: {
                color: '#666'
            },
            axisLine: {
                lineStyle: { color: '#ddd' }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#666'
            },
            axisLine: {
                lineStyle: { color: '#ddd' }
            },
            splitLine: {
                lineStyle: { color: '#f0f0f0' }
            }
        },
        series: [{
            name: '预警发布数量',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
                color: '#3498db'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [{
                        offset: 0, color: 'rgba(52, 152, 219, 0.3)'
                    }, {
                        offset: 1, color: 'rgba(52, 152, 219, 0.05)'
                    }]
                }
            },
            data: alertCounts
        }]
    };
    
    alertCharts.trendChart.setOption(option);
}

/**
 * 渲染预警类型分布图表
 */
function renderAlertTypeChart() {
    // 统计各种预警类型的数量
    const typeStats = {};
    alertLogs.forEach(log => {
        typeStats[log.alertType] = (typeStats[log.alertType] || 0) + 1;
    });
    
    const data = Object.entries(typeStats).map(([type, count]) => ({
        name: type,
        value: count
    }));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}条 ({d}%)',
            backgroundColor: 'rgba(50, 50, 50, 0.8)',
            borderColor: '#333',
            textStyle: { color: '#fff' }
        },
        legend: {
            orient: 'vertical',
            right: '10%',
            top: 'center',
            textStyle: {
                color: '#666'
            }
        },
        series: [{
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
            labelLine: {
                show: false
            },
            emphasis: {
                scale: true,
                scaleSize: 5
            },
            data: data
        }]
    };
    
    alertCharts.typeChart.setOption(option);
}

/**
 * 渲染预警记录表格
 */
function renderAlertTable() {
    const tableBody = document.getElementById('alertTableBody');
    const startIndex = (currentAlertPage - 1) * alertPageSize;
    const endIndex = Math.min(startIndex + alertPageSize, filteredAlertLogs.length);
    const pageData = filteredAlertLogs.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    pageData.forEach(log => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <div class="id-column">
                    <code>${log.alertId}</code>
                </div>
            </td>
            <td>
                <div class="type-column">
                    <span class="alert-icon">${log.alertIcon}</span>
                    ${log.alertType}
                </div>
            </td>
            <td>
                <span class="alert-level-badge alert-level-${log.alertLevel}">
                    ${log.alertLevelName}
                </span>
            </td>
            <td>${formatDateTime(log.publishTime)}</td>
            <td>${formatDateTime(log.createTime)}</td>
            <td>
                <span class="status-badge status-${log.currentStatus}">
                    ${log.currentStatusName}
                </span>
            </td>
            <td>${formatDateTime(log.lastOperateTime)}</td>
            <td>
                <span class="operation-count">${log.totalOperations}次操作</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-sm btn-primary" onclick="showAlertDetail('${log.id}')" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${log.currentStatus === 'displaying' ? 
                        `<button class="btn btn-sm btn-warning" onclick="cancelAlertDisplay('${log.id}')" title="取消展示">
                            <i class="fas fa-pause"></i>
                        </button>` : 
                        (log.currentStatus === 'cancelled' ? 
                            `<button class="btn btn-sm btn-success" onclick="restoreAlertDisplay('${log.id}')" title="恢复展示">
                                <i class="fas fa-play"></i>
                            </button>` : ''
                        )
                    }
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // 更新分页信息
    updateAlertPagination();
    
    console.log(`📋 预警记录表格已更新，显示 ${pageData.length} 条记录`);
}

/**
 * 更新分页信息
 */
function updateAlertPagination() {
    const startIndex = (currentAlertPage - 1) * alertPageSize + 1;
    const endIndex = Math.min(currentAlertPage * alertPageSize, filteredAlertLogs.length);
    const totalPages = Math.ceil(filteredAlertLogs.length / alertPageSize);
    
    document.getElementById('alertPageStart').textContent = startIndex;
    document.getElementById('alertPageEnd').textContent = endIndex;
    document.getElementById('totalAlertRecords').textContent = filteredAlertLogs.length;
    
    // 生成页码按钮
    const pageNumbers = document.getElementById('alertPageNumbers');
    pageNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentAlertPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `btn btn-secondary ${i === currentAlertPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changeAlertPage(i);
        pageNumbers.appendChild(pageBtn);
    }
    
    // 更新导航按钮状态
    document.getElementById('firstAlertPageBtn').disabled = currentAlertPage === 1;
    document.getElementById('prevAlertPageBtn').disabled = currentAlertPage === 1;
    document.getElementById('nextAlertPageBtn').disabled = currentAlertPage === totalPages;
    document.getElementById('lastAlertPageBtn').disabled = currentAlertPage === totalPages;
}

// ===== 事件绑定 =====

/**
 * 绑定预警相关事件
 */
function bindAlertEvents() {
    // 表格排序
    document.querySelectorAll('#alertTable th[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const field = this.dataset.sort;
            sortAlertTable(field);
        });
    });
    
    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            searchAlertLogs(this.value);
        }, 300));
    }
    
    // 时间更新
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    console.log('🔗 预警事件绑定完成');
}

/**
 * 设置默认时间范围
 */
function setDefaultAlertDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);
    
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');
    
    if (startInput) startInput.value = startDate.toISOString().split('T')[0];
    if (endInput) endInput.value = endDate.toISOString().split('T')[0];
}

// ===== 功能函数 =====

/**
 * 设置预警时间范围
 */
function setAlertTimeRange(range) {
    currentAlertTimeRange = range;
    
    // 更新按钮状态
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 重新渲染图表
    renderAlertTrendChart();
}

/**
 * 刷新预警统计图表
 */
function refreshAlertTypeChart() {
    renderAlertTypeChart();
    showToast('预警类型分布图表已刷新', 'success');
}

/**
 * 刷新预警记录
 */
function refreshAlertLogs() {
    renderAlertOverview();
    renderAlertTrendChart();
    renderAlertTypeChart();
    renderAlertTable();
    showToast('预警记录已刷新', 'success');
}

/**
 * 应用预警筛选
 */
function applyAlertFilters() {
    const alertTypeFilter = document.getElementById('alertTypeFilter').value;
    const alertLevelFilter = document.getElementById('alertLevelFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const operatorFilter = document.getElementById('operatorFilter').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    filteredAlertLogs = alertLogs.filter(log => {
        // 预警类型筛选
        if (alertTypeFilter && log.alertType !== alertTypeFilter) return false;
        
        // 预警等级筛选
        if (alertLevelFilter && log.alertLevel !== alertLevelFilter) return false;
        
        // 状态筛选
        if (statusFilter && log.currentStatus !== statusFilter) return false;
        
        // 操作用户筛选
        if (operatorFilter) {
            const hasOperator = log.operations.some(op => op.operator === operatorFilter);
            if (!hasOperator) return false;
        }
        
        // 时间范围筛选
        if (startDate) {
            const start = new Date(startDate);
            if (log.createTime < start) return false;
        }
        
        if (endDate) {
            const end = new Date(endDate + 'T23:59:59');
            if (log.createTime > end) return false;
        }
        
        return true;
    });
    
    currentAlertPage = 1;
    currentTimelinePage = 1;
    
    if (alertViewMode === 'table') {
        renderAlertTable();
    } else if (alertViewMode === 'timeline') {
        renderTimelineView();
    }
    
    showToast(`筛选完成，找到 ${filteredAlertLogs.length} 条记录`, 'success');
}

/**
 * 清除预警筛选
 */
function clearAlertFilters() {
    document.getElementById('alertTypeFilter').value = '';
    document.getElementById('alertLevelFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('operatorFilter').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    
    filteredAlertLogs = [...alertLogs];
    currentAlertPage = 1;
    currentTimelinePage = 1;
    
    if (alertViewMode === 'table') {
        renderAlertTable();
    } else if (alertViewMode === 'timeline') {
        renderTimelineView();
    }
    
    setDefaultAlertDateRange();
    showToast('筛选条件已清除', 'success');
}

/**
 * 预警表格排序
 */
function sortAlertTable(field) {
    const order = (currentAlertSort.field === field && currentAlertSort.order === 'desc') ? 'asc' : 'desc';
    currentAlertSort = { field, order };
    
    filteredAlertLogs.sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];
        
        // 处理日期字段
        if (valueA instanceof Date && valueB instanceof Date) {
            return order === 'desc' ? valueB - valueA : valueA - valueB;
        }
        
        // 处理字符串字段
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            return order === 'desc' ? valueB.localeCompare(valueA) : valueA.localeCompare(valueB);
        }
        
        // 处理数字字段
        return order === 'desc' ? valueB - valueA : valueA - valueB;
    });
    
    // 更新排序图标
    document.querySelectorAll('.sort-icon').forEach(icon => {
        icon.className = 'fas fa-sort sort-icon';
    });
    
    const currentIcon = document.querySelector(`th[data-sort="${field}"] .sort-icon`);
    currentIcon.className = `fas fa-sort-${order === 'desc' ? 'down' : 'up'} sort-icon`;
    
    if (alertViewMode === 'table') {
        renderAlertTable();
    } else if (alertViewMode === 'timeline') {
        renderTimelineView();
    }
}

/**
 * 切换分页
 */
function changeAlertPage(action) {
    const totalPages = Math.ceil(filteredAlertLogs.length / alertPageSize);
    
    switch(action) {
        case 'first':
            currentAlertPage = 1;
            break;
        case 'prev':
            if (currentAlertPage > 1) currentAlertPage--;
            break;
        case 'next':
            if (currentAlertPage < totalPages) currentAlertPage++;
            break;
        case 'last':
            currentAlertPage = totalPages;
            break;
        default:
            if (typeof action === 'number') {
                currentAlertPage = action;
            }
    }
    
    renderAlertTable();
}

/**
 * 搜索预警记录
 */
function searchAlertLogs(keyword) {
    if (!keyword.trim()) {
        filteredAlertLogs = [...alertLogs];
    } else {
        const searchTerm = keyword.toLowerCase();
        filteredAlertLogs = alertLogs.filter(log => {
            return log.alertId.toLowerCase().includes(searchTerm) ||
                   log.alertType.toLowerCase().includes(searchTerm) ||
                   log.alertContent.toLowerCase().includes(searchTerm) ||
                   log.operations.some(op => 
                       op.operatorName.toLowerCase().includes(searchTerm) ||
                       op.description.toLowerCase().includes(searchTerm)
                   );
        });
    }
    
    currentAlertPage = 1;
    renderAlertTable();
}

/**
 * 显示预警详情
 */
function showAlertDetail(alertLogId) {
    const log = alertLogs.find(l => l.id === alertLogId);
    if (!log) return;
    
    // 填充基本信息
    document.getElementById('detailAlertId').textContent = log.alertId;
    document.getElementById('detailAlertType').innerHTML = `${log.alertIcon} ${log.alertType}`;
    document.getElementById('detailAlertLevel').innerHTML = `<span class="alert-level-badge alert-level-${log.alertLevel}">${log.alertLevelName}</span>`;
    document.getElementById('detailPublishTime').textContent = formatDateTime(log.publishTime);
    document.getElementById('detailCreateTime').textContent = formatDateTime(log.createTime);
    document.getElementById('detailCurrentStatus').innerHTML = `<span class="status-badge status-${log.currentStatus}">${log.currentStatusName}</span>`;
    document.getElementById('detailAlertContent').textContent = log.alertContent;
    
    // 生成操作历史时间线
    const timeline = document.getElementById('alertOperationTimeline');
    timeline.innerHTML = '';
    
    log.operations.forEach((operation, index) => {
        const timelineItem = document.createElement('div');
        timelineItem.className = 'timeline-item';
        
        // 设置时间线点的颜色
        const dotColor = getOperationColor(operation.type);
        
        timelineItem.innerHTML = `
            <div class="timeline-dot" style="background-color: ${dotColor}"></div>
            <div class="timeline-content">
                <div class="timeline-header">
                    <div class="timeline-title">
                        <span class="operation-badge operation-${operation.type}">${operation.typeName}</span>
                    </div>
                    <div class="timeline-time">${formatDateTime(operation.operateTime)}</div>
                </div>
                <div class="timeline-description">${operation.description}</div>
                <div class="timeline-operator">
                    操作人：${operation.operatorName} | IP：${operation.ip} | 
                    结果：<span class="result-${operation.result}">${operation.result === 'success' ? '成功' : '失败'}</span>
                </div>
            </div>
        `;
        
        timeline.appendChild(timelineItem);
    });
    
    // 显示模态框
    document.getElementById('alertDetailModal').style.display = 'flex';
}

/**
 * 获取操作类型对应的颜色
 */
function getOperationColor(operationType) {
    const colors = {
        'create': '#27ae60',
        'display': '#3498db',
        'cancel': '#e67e22',
        'expire': '#95a5a6',
        'restore': '#9b59b6'
    };
    return colors[operationType] || '#7f8c8d';
}

/**
 * 关闭预警详情模态框
 */
function closeAlertDetailModal() {
    document.getElementById('alertDetailModal').style.display = 'none';
}

/**
 * 显示添加预警模态框
 */
function showAddAlertModal() {
    // 设置默认发布时间为当前时间
    const now = new Date();
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    document.getElementById('newPublishTime').value = localISOTime;
    
    document.getElementById('addAlertModal').style.display = 'flex';
}

/**
 * 关闭添加预警模态框
 */
function closeAddAlertModal() {
    document.getElementById('addAlertModal').style.display = 'none';
    document.getElementById('addAlertForm').reset();
}

/**
 * 提交新预警
 */
function submitAddAlert() {
    const form = document.getElementById('addAlertForm');
    const formData = new FormData(form);
    
    const alertType = document.getElementById('newAlertType').value;
    const alertLevel = document.getElementById('newAlertLevel').value;
    const publishTime = document.getElementById('newPublishTime').value;
    const alertContent = document.getElementById('newAlertContent').value;
    const autoDisplay = document.getElementById('autoDisplay').checked;
    
    // 表单验证
    if (!alertType || !alertLevel || !publishTime || !alertContent) {
        showToast('请填写所有必填字段', 'error');
        return;
    }
    
    // 这里应该是实际的API调用
    // 模拟添加成功
    setTimeout(() => {
        showToast('预警信息录入成功' + (autoDisplay ? '，已开始大屏展示' : ''), 'success');
        closeAddAlertModal();
        
        // 刷新数据（实际应用中应该重新获取数据）
        refreshAlertLogs();
    }, 500);
}

/**
 * 取消预警展示
 */
function cancelAlertDisplay(alertLogId) {
    if (!confirm('确定要取消这条预警信息的大屏展示吗？')) return;
    
    // 模拟API调用
    setTimeout(() => {
        const log = alertLogs.find(l => l.id === alertLogId);
        if (log) {
            log.currentStatus = 'cancelled';
            log.currentStatusName = '已取消展示';
            log.lastOperateTime = new Date();
            
            // 添加操作记录
            log.operations.push({
                id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'cancel',
                typeName: '取消展示',
                operator: 'admin',
                operatorName: '系统管理员',
                operateTime: new Date(),
                description: '手动取消预警信息的大屏展示',
                result: 'success',
                ip: '192.168.1.100'
            });
            log.totalOperations++;
        }
        
        renderAlertOverview();
        renderAlertTable();
        showToast('预警展示已取消', 'success');
    }, 300);
}

/**
 * 恢复预警展示
 */
function restoreAlertDisplay(alertLogId) {
    if (!confirm('确定要恢复这条预警信息的大屏展示吗？')) return;
    
    // 模拟API调用
    setTimeout(() => {
        const log = alertLogs.find(l => l.id === alertLogId);
        if (log) {
            log.currentStatus = 'displaying';
            log.currentStatusName = '正在展示';
            log.lastOperateTime = new Date();
            
            // 添加操作记录
            log.operations.push({
                id: `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'restore',
                typeName: '恢复展示',
                operator: 'admin',
                operatorName: '系统管理员',
                operateTime: new Date(),
                description: '恢复预警信息的大屏展示',
                result: 'success',
                ip: '192.168.1.100'
            });
            log.totalOperations++;
        }
        
        renderAlertOverview();
        renderAlertTable();
        showToast('预警展示已恢复', 'success');
    }, 300);
}

/**
 * 导出预警记录
 */
function exportAlertLogs() {
    showToast('正在生成导出文件...', 'info');
    
    // 模拟导出过程
    setTimeout(() => {
        showToast('预警记录导出完成', 'success');
    }, 2000);
}

/**
 * 导出预警详情
 */
function exportAlertDetail() {
    showToast('正在导出预警详情...', 'info');
    
    // 模拟导出过程
    setTimeout(() => {
        showToast('预警详情导出完成', 'success');
    }, 1000);
}

/**
 * 切换预警视图模式
 */
function toggleAlertView(mode) {
    alertViewMode = mode;
    
    // 更新按钮状态
    document.getElementById('tableViewBtn').classList.remove('active');
    document.getElementById('timelineViewBtn').classList.remove('active');
    
    if (mode === 'table') {
        document.getElementById('tableViewBtn').classList.add('active');
        document.getElementById('alertTableContainer').style.display = 'block';
        document.getElementById('alertTimelineContainer').style.display = 'none';
        showToast('切换到表格视图', 'success');
    } else if (mode === 'timeline') {
        document.getElementById('timelineViewBtn').classList.add('active');
        document.getElementById('alertTableContainer').style.display = 'none';
        document.getElementById('alertTimelineContainer').style.display = 'block';
        renderTimelineView();
        showToast('切换到时间线视图', 'success');
    }
}

/**
 * 自动刷新预警记录
 */
function autoRefreshAlerts() {
    if (alertAutoRefreshInterval) {
        clearInterval(alertAutoRefreshInterval);
        alertAutoRefreshInterval = null;
        event.target.classList.remove('active');
        showToast('自动刷新已停止', 'info');
    } else {
        alertAutoRefreshInterval = setInterval(() => {
            refreshAlertLogs();
        }, 30000); // 30秒刷新一次
        event.target.classList.add('active');
        showToast('已开启自动刷新（30秒间隔）', 'success');
    }
}

// ===== 工具函数 =====

/**
 * 格式化日期时间
 */
function formatDateTime(date) {
    if (!date) return '-';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hour = String(d.getHours()).padStart(2, '0');
    const minute = String(d.getMinutes()).padStart(2, '0');
    const second = String(d.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

/**
 * 防抖函数
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
 * 更新当前时间
 */
function updateCurrentTime() {
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
    
    const timeElement = document.getElementById('current-time');
    if (timeElement) {
        timeElement.textContent = timeString;
    }
    
    const lastUpdateElement = document.getElementById('last-update');
    if (lastUpdateElement) {
        lastUpdateElement.textContent = '刚刚';
    }
}

/**
 * 显示提示信息
 */
function showToast(message, type = 'info') {
    // 创建提示框
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加样式
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // 自动隐藏
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// ===== 时间线视图相关功能 =====

/**
 * 渲染时间线视图
 */
function renderTimelineView() {
    const timelineContainer = document.getElementById('alertTimelineContent');
    const startIndex = (currentTimelinePage - 1) * timelinePageSize;
    const endIndex = Math.min(startIndex + timelinePageSize, filteredAlertLogs.length);
    const pageData = filteredAlertLogs.slice(startIndex, endIndex);
    
    // 按日期分组
    const groupedData = groupAlertsByDate(pageData);
    
    let timelineHTML = '';
    
    Object.keys(groupedData).forEach(dateKey => {
        const alerts = groupedData[dateKey];
        
        timelineHTML += `
            <div class="timeline-group">
                <div class="timeline-date">${formatTimelineDate(dateKey)}</div>
        `;
        
        alerts.forEach(log => {
            timelineHTML += `
                <div class="timeline-alert ${log.alertLevel}" onclick="showAlertDetail('${log.id}')">
                    <div class="timeline-alert-header">
                        <div class="timeline-alert-title">
                            <span class="timeline-alert-icon">${log.alertIcon}</span>
                            <span>${log.alertType}</span>
                            <span class="alert-level-badge alert-level-${log.alertLevel}">
                                ${log.alertLevelName}
                            </span>
                        </div>
                        <div class="timeline-alert-time">
                            ${formatDateTime(log.publishTime)}
                        </div>
                    </div>
                    <div class="timeline-alert-content">
                        ${log.alertContent}
                    </div>
                    <div class="timeline-alert-meta">
                        <div class="timeline-alert-operations">
                            ${log.operations.slice(0, 3).map(op => 
                                `<span class="timeline-alert-operation operation-${op.type}">${op.typeName}</span>`
                            ).join('')}
                            ${log.operations.length > 3 ? `<span class="timeline-alert-operation" style="background: #95a5a6;">+${log.operations.length - 3}</span>` : ''}
                        </div>
                        <div class="timeline-alert-actions">
                            <span class="status-badge status-${log.currentStatus}">${log.currentStatusName}</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        timelineHTML += '</div>';
    });
    
    timelineContainer.innerHTML = timelineHTML;
    
    // 更新时间线分页信息
    updateTimelinePagination();
    
    console.log(`📅 时间线视图已渲染，显示 ${pageData.length} 条记录`);
}

/**
 * 按日期分组预警数据
 */
function groupAlertsByDate(alertData) {
    const grouped = {};
    
    alertData.forEach(log => {
        const dateKey = log.publishTime.toISOString().split('T')[0];
        
        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        
        grouped[dateKey].push(log);
    });
    
    // 按日期排序（最新日期在前）
    const sortedKeys = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));
    const sortedGrouped = {};
    sortedKeys.forEach(key => {
        // 同一天内按时间倒序排列
        grouped[key].sort((a, b) => b.publishTime - a.publishTime);
        sortedGrouped[key] = grouped[key];
    });
    
    return sortedGrouped;
}

/**
 * 格式化时间线日期
 */
function formatTimelineDate(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const dateString = date.toISOString().split('T')[0];
    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];
    
    if (dateString === todayString) {
        return '今天';
    } else if (dateString === yesterdayString) {
        return '昨天';
    } else {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}年${month}月${day}日`;
    }
}

/**
 * 更新时间线分页信息
 */
function updateTimelinePagination() {
    const startIndex = (currentTimelinePage - 1) * timelinePageSize + 1;
    const endIndex = Math.min(currentTimelinePage * timelinePageSize, filteredAlertLogs.length);
    const totalPages = Math.ceil(filteredAlertLogs.length / timelinePageSize);
    
    document.getElementById('timelinePageStart').textContent = startIndex;
    document.getElementById('timelinePageEnd').textContent = endIndex;
    document.getElementById('totalTimelineRecords').textContent = filteredAlertLogs.length;
    
    // 生成页码按钮
    const pageNumbers = document.getElementById('timelinePageNumbers');
    pageNumbers.innerHTML = '';
    
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentTimelinePage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.className = `btn btn-secondary ${i === currentTimelinePage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.onclick = () => changeTimelinePage(i);
        pageNumbers.appendChild(pageBtn);
    }
    
    // 更新导航按钮状态
    document.getElementById('firstTimelinePageBtn').disabled = currentTimelinePage === 1;
    document.getElementById('prevTimelinePageBtn').disabled = currentTimelinePage === 1;
    document.getElementById('nextTimelinePageBtn').disabled = currentTimelinePage === totalPages;
    document.getElementById('lastTimelinePageBtn').disabled = currentTimelinePage === totalPages;
}

/**
 * 切换时间线分页
 */
function changeTimelinePage(action) {
    const totalPages = Math.ceil(filteredAlertLogs.length / timelinePageSize);
    
    switch(action) {
        case 'first':
            currentTimelinePage = 1;
            break;
        case 'prev':
            if (currentTimelinePage > 1) currentTimelinePage--;
            break;
        case 'next':
            if (currentTimelinePage < totalPages) currentTimelinePage++;
            break;
        case 'last':
            currentTimelinePage = totalPages;
            break;
        default:
            if (typeof action === 'number') {
                currentTimelinePage = action;
            }
    }
    
    renderTimelineView();
}

// ===== 页面卸载清理 =====
window.addEventListener('beforeunload', function() {
    if (alertAutoRefreshInterval) {
        clearInterval(alertAutoRefreshInterval);
    }
    
    // 清理图表资源
    Object.values(alertCharts).forEach(chart => {
        if (chart && typeof chart.dispose === 'function') {
            chart.dispose();
        }
    });
});