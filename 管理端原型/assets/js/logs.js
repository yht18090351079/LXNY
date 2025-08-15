/**
 * 农情遥感系统管理端 - 操作日志管理功能
 * 功能：日志查看、筛选、分析、导出等
 */

// ===== 全局变量 =====
let logs = [];
let filteredLogs = [];
let currentLogPage = 1;
let logPageSize = 50;
let totalLogRecords = 2847;
let currentLogSort = { field: 'timestamp', order: 'desc' };
let charts = {};
let viewMode = 'table';
let autoRefreshInterval = null;
let currentTimeRange = '24h';

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeLogPage();
});

/**
 * 页面初始化
 */
function initializeLogPage() {
    console.log('📝 初始化操作日志管理页面...');
    
    // 生成模拟数据
    generateMockLogData();
    
    // 初始化图表
    initializeLogCharts();
    
    // 渲染页面内容
    renderLogOverview();
    renderLogTimeline();
    renderLogCategories();
    renderLogTable();
    
    // 绑定事件
    bindLogEvents();
    
    // 设置默认时间范围
    setDefaultDateRange();
    
    console.log('✅ 操作日志管理页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟日志数据
 */
function generateMockLogData() {
    const logLevels = ['info', 'warning', 'error', 'debug'];
    const logLevelWeights = [0.7, 0.15, 0.1, 0.05];
    
    const actionTypes = [
        { id: 'login', name: '用户登录', weight: 0.2 },
        { id: 'logout', name: '用户登出', weight: 0.15 },
        { id: 'create', name: '创建操作', weight: 0.15 },
        { id: 'update', name: '更新操作', weight: 0.2 },
        { id: 'delete', name: '删除操作', weight: 0.05 },
        { id: 'config', name: '配置修改', weight: 0.1 },
        { id: 'export', name: '数据导出', weight: 0.08 },
        { id: 'import', name: '数据导入', weight: 0.07 }
    ];
    
    const users = [
        { id: 'admin', name: '系统管理员' },
        { id: 'user001', name: '张三' },
        { id: 'user002', name: '李四' },
        { id: 'user003', name: '王五' },
        { id: 'user004', name: '赵六' },
        { id: 'user005', name: '孙七' }
    ];
    
    const ipAddresses = [
        '192.168.1.100', '192.168.1.101', '192.168.1.102',
        '10.0.0.50', '10.0.0.51', '172.16.0.100'
    ];
    
    const targets = [
        '用户账户', '角色权限', '系统配置', '遥感数据',
        '气象数据', '传感器设备', '数据报表', '系统监控'
    ];
    
    logs = [];
    
    for (let i = 0; i < totalLogRecords; i++) {
        const level = getRandomByWeight(logLevels, logLevelWeights);
        const action = getRandomByWeight(actionTypes, actionTypes.map(a => a.weight));
        const user = users[Math.floor(Math.random() * users.length)];
        const target = targets[Math.floor(Math.random() * targets.length)];
        const ip = ipAddresses[Math.floor(Math.random() * ipAddresses.length)];
        
        // 生成时间戳（过去30天内）
        const timestamp = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        // 根据级别生成结果
        let result = 'success';
        if (level === 'error') {
            result = Math.random() < 0.8 ? 'failed' : 'success';
        } else if (level === 'warning') {
            result = Math.random() < 0.3 ? 'failed' : 'success';
        }
        
        const log = {
            id: `log_${String(i + 1).padStart(6, '0')}`,
            timestamp: timestamp,
            level: level,
            action: action.id,
            actionName: action.name,
            user: user.id,
            userName: user.name,
            target: target,
            description: generateLogDescription(action, user, target, result),
            ip: ip,
            result: result,
            details: generateLogDetails(action, user, target, result, timestamp),
            userAgent: generateUserAgent()
        };
        
        logs.push(log);
    }
    
    // 按时间排序
    logs.sort((a, b) => b.timestamp - a.timestamp);
    filteredLogs = [...logs];
    
    console.log(`📝 生成了 ${logs.length} 条操作日志`);
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
 * 生成日志描述
 */
function generateLogDescription(action, user, target, result) {
    const templates = {
        login: `${user.name} 从 IP 地址登录系统`,
        logout: `${user.name} 退出系统`,
        create: `${user.name} 创建了 ${target}`,
        update: `${user.name} 更新了 ${target}`,
        delete: `${user.name} 删除了 ${target}`,
        config: `${user.name} 修改了 ${target} 配置`,
        export: `${user.name} 导出了 ${target}`,
        import: `${user.name} 导入了 ${target}`
    };
    
    let description = templates[action.id] || `${user.name} 执行了 ${action.name} 操作`;
    
    if (result === 'failed') {
        description += '（操作失败）';
    }
    
    return description;
}

/**
 * 生成日志详情
 */
function generateLogDetails(action, user, target, result, timestamp) {
    const details = {
        sessionId: `sess_${Math.random().toString(36).substr(2, 9)}`,
        requestId: `req_${Math.random().toString(36).substr(2, 12)}`,
        duration: Math.floor(Math.random() * 5000 + 100), // 100-5000ms
        requestSize: Math.floor(Math.random() * 10000 + 500), // 500-10000 bytes
        responseSize: Math.floor(Math.random() * 50000 + 1000), // 1000-50000 bytes
        errorCode: result === 'failed' ? Math.floor(Math.random() * 500 + 400) : null,
        errorMessage: result === 'failed' ? generateErrorMessage() : null
    };
    
    return details;
}

/**
 * 生成错误信息
 */
function generateErrorMessage() {
    const errors = [
        '权限不足，无法执行该操作',
        '数据验证失败，请检查输入参数',
        '网络连接超时，请重试',
        '服务器内部错误，请联系管理员',
        '数据库连接失败',
        '文件上传失败，文件格式不支持',
        '用户会话已过期，请重新登录',
        '操作频率过高，请稍后再试'
    ];
    
    return errors[Math.floor(Math.random() * errors.length)];
}

/**
 * 生成用户代理字符串
 */
function generateUserAgent() {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101'
    ];
    
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// ===== 图表初始化 =====

/**
 * 初始化日志图表
 */
function initializeLogCharts() {
    initializeLogTimelineChart();
    initializeLogCategoriesChart();
}

/**
 * 初始化日志时间线图表
 */
function initializeLogTimelineChart() {
    const chartDom = document.getElementById('logTimelineChart');
    if (!chartDom) return;
    
    charts.timeline = echarts.init(chartDom);
    updateLogTimelineChart();
}

/**
 * 更新日志时间线图表
 */
function updateLogTimelineChart() {
    if (!charts.timeline) return;
    
    // 根据时间范围生成数据
    const now = new Date();
    let timeUnit, formatStr, dataPoints;
    
    switch (currentTimeRange) {
        case '24h':
            timeUnit = 60 * 60 * 1000; // 1小时
            dataPoints = 24;
            formatStr = 'HH:mm';
            break;
        case '7d':
            timeUnit = 24 * 60 * 60 * 1000; // 1天
            dataPoints = 7;
            formatStr = 'MM-dd';
            break;
        case '30d':
            timeUnit = 24 * 60 * 60 * 1000; // 1天
            dataPoints = 30;
            formatStr = 'MM-dd';
            break;
        default:
            timeUnit = 60 * 60 * 1000;
            dataPoints = 24;
            formatStr = 'HH:mm';
    }
    
    const categories = ['info', 'warning', 'error'];
    const seriesData = {};
    const timeLabels = [];
    
    // 初始化数据结构
    categories.forEach(category => {
        seriesData[category] = [];
    });
    
    // 生成时间点和对应数据
    for (let i = dataPoints - 1; i >= 0; i--) {
        const timePoint = new Date(now.getTime() - i * timeUnit);
        timeLabels.push(timePoint.toLocaleDateString('zh-CN', 
            currentTimeRange === '24h' ? { hour: '2-digit', minute: '2-digit' } : { month: '2-digit', day: '2-digit' }
        ));
        
        // 统计该时间段的日志数量
        const periodStart = timePoint.getTime();
        const periodEnd = periodStart + timeUnit;
        
        categories.forEach(category => {
            const count = filteredLogs.filter(log => {
                const logTime = log.timestamp.getTime();
                return logTime >= periodStart && logTime < periodEnd && log.level === category;
            }).length;
            
            seriesData[category].push(count);
        });
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
            data: ['信息', '警告', '错误'],
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
            data: timeLabels,
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
            name: '日志数量',
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
                name: '信息',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 3,
                    color: '#2E7D32'
                },
                itemStyle: {
                    color: '#2E7D32'
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
                data: seriesData.info
            },
            {
                name: '警告',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 3,
                    color: '#FF9800'
                },
                itemStyle: {
                    color: '#FF9800'
                },
                data: seriesData.warning
            },
            {
                name: '错误',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 3,
                    color: '#F44336'
                },
                itemStyle: {
                    color: '#F44336'
                },
                data: seriesData.error
            }
        ]
    };
    
    charts.timeline.setOption(option);
}

/**
 * 初始化日志分类图表
 */
function initializeLogCategoriesChart() {
    const chartDom = document.getElementById('logCategoriesChart');
    if (!chartDom) return;
    
    charts.categories = echarts.init(chartDom);
    updateLogCategoriesChart();
}

/**
 * 更新日志分类图表
 */
function updateLogCategoriesChart() {
    if (!charts.categories) return;
    
    // 统计各操作类型的数量
    const actionStats = {};
    const actionNames = {
        login: '用户登录',
        logout: '用户登出',
        create: '创建操作',
        update: '更新操作',
        delete: '删除操作',
        config: '配置修改',
        export: '数据导出',
        import: '数据导入'
    };
    
    filteredLogs.forEach(log => {
        const actionName = actionNames[log.action] || log.action;
        actionStats[actionName] = (actionStats[actionName] || 0) + 1;
    });
    
    // 准备图表数据
    const data = Object.entries(actionStats).map(([name, value], index) => {
        const colors = ['#2E7D32', '#1976D2', '#F57C00', '#7B1FA2', '#388E3C', '#1565C0', '#F9A825', '#8E24AA'];
        return {
            name: name,
            value: value,
            itemStyle: {
                color: colors[index % colors.length]
            }
        };
    }).sort((a, b) => b.value - a.value);
    
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
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>
                    <div style="display: flex; align-items: center; margin-bottom: 4px;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">操作次数:</span>
                        <span style="font-weight: bold;">${params.value} 次</span>
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
                name: '操作分类',
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
    
    charts.categories.setOption(option);
}

// ===== 页面渲染 =====

/**
 * 渲染日志概览
 */
function renderLogOverview() {
    const totalLogs = filteredLogs.length;
    const todayLogs = filteredLogs.filter(log => {
        const today = new Date();
        const logDate = log.timestamp;
        return logDate.toDateString() === today.toDateString();
    }).length;
    const warningLogs = filteredLogs.filter(log => log.level === 'warning').length;
    const errorLogs = filteredLogs.filter(log => log.level === 'error').length;
    
    // 更新统计数值
    const totalEl = document.getElementById('totalLogs');
    const todayEl = document.getElementById('todayLogs');
    const warningEl = document.getElementById('warningLogs');
    const errorEl = document.getElementById('errorLogs');
    
    if (totalEl) animateCountUp(totalEl, totalLogs, 1000);
    if (todayEl) animateCountUp(todayEl, todayLogs, 800);
    if (warningEl) animateCountUp(warningEl, warningLogs, 800);
    if (errorEl) animateCountUp(errorEl, errorLogs, 800);
}

/**
 * 渲染日志时间线
 */
function renderLogTimeline() {
    updateLogTimelineChart();
}

/**
 * 渲染日志分类
 */
function renderLogCategories() {
    updateLogCategoriesChart();
}

/**
 * 渲染日志表格
 */
function renderLogTable() {
    if (viewMode === 'timeline') {
        renderLogTimelineView();
        return;
    }
    
    const tbody = document.getElementById('logTableBody');
    if (!tbody) return;
    
    // 计算当前页的数据
    const startIndex = (currentLogPage - 1) * logPageSize;
    const endIndex = startIndex + logPageSize;
    const pageData = filteredLogs.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>暂无日志</h3>
                        <p>当前筛选条件下没有找到匹配的日志</p>
                    </div>
                </td>
            </tr>
        `;
        updateLogPaginationInfo(0, 0, 0);
        return;
    }
    
    tbody.innerHTML = pageData.map(log => {
        const levelText = {
            info: '信息',
            warning: '警告',
            error: '错误',
            debug: '调试'
        }[log.level];
        
        const resultText = {
            success: '成功',
            failed: '失败'
        }[log.result];
        
        return `
            <tr onclick="viewLogDetails('${log.id}')" class="log-row" data-level="${log.level}">
                <td class="log-timestamp">
                    <div class="timestamp-main">${log.timestamp.toLocaleDateString('zh-CN')}</div>
                    <small class="timestamp-time">${log.timestamp.toLocaleTimeString('zh-CN')}</small>
                </td>
                <td>
                    <span class="log-level ${log.level}">${levelText}</span>
                </td>
                <td>
                    <span class="action-badge ${log.action}">${log.actionName}</span>
                </td>
                <td class="log-user">
                    <div class="user-info">
                        <span class="user-name">${log.userName}</span>
                        <small class="user-id">(${log.user})</small>
                    </div>
                </td>
                <td class="log-target">${log.target}</td>
                <td class="log-description">${log.description}</td>
                <td class="log-ip">
                    <code>${log.ip}</code>
                </td>
                <td>
                    <span class="result-badge ${log.result}">${resultText}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="event.stopPropagation(); viewLogDetails('${log.id}')" 
                                data-tooltip="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn export" onclick="event.stopPropagation(); exportSingleLog('${log.id}')"
                                data-tooltip="导出日志">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // 更新分页信息
    updateLogPaginationInfo(startIndex + 1, Math.min(endIndex, filteredLogs.length), filteredLogs.length);
    updateLogPaginationControls();
}

/**
 * 渲染时间线视图
 */
function renderLogTimelineView() {
    const container = document.getElementById('logTableContainer');
    if (!container) return;
    
    // 计算当前页的数据
    const startIndex = (currentLogPage - 1) * logPageSize;
    const endIndex = startIndex + logPageSize;
    const pageData = filteredLogs.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>暂无日志</h3>
                <p>当前筛选条件下没有找到匹配的日志</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = `
        <div class="log-timeline-container">
            ${pageData.map(log => {
                const levelText = {
                    info: '信息',
                    warning: '警告',
                    error: '错误',
                    debug: '调试'
                }[log.level];
                
                const resultText = {
                    success: '成功',
                    failed: '失败'
                }[log.result];
                
                return `
                    <div class="log-timeline-item" data-level="${log.level}" onclick="viewLogDetails('${log.id}')">
                        <div class="timeline-dot ${log.level}"></div>
                        <div class="timeline-content">
                            <div class="log-header">
                                <div class="log-time">
                                    ${log.timestamp.toLocaleString('zh-CN')}
                                </div>
                                <div class="log-badges">
                                    <span class="log-level ${log.level}">${levelText}</span>
                                    <span class="result-badge ${log.result}">${resultText}</span>
                                </div>
                            </div>
                            <div class="log-content">
                                <h4 class="log-title">${log.actionName}</h4>
                                <p class="log-desc">${log.description}</p>
                                <div class="log-meta">
                                    <span class="meta-item">
                                        <i class="fas fa-user"></i>
                                        ${log.userName}
                                    </span>
                                    <span class="meta-item">
                                        <i class="fas fa-globe"></i>
                                        ${log.ip}
                                    </span>
                                    <span class="meta-item">
                                        <i class="fas fa-tag"></i>
                                        ${log.target}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    // 更新分页信息
    updateLogPaginationInfo(startIndex + 1, Math.min(endIndex, filteredLogs.length), filteredLogs.length);
    updateLogPaginationControls();
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
        
        element.textContent = Math.floor(currentValue).toLocaleString();
    }, 16);
}

/**
 * 更新日志分页信息
 */
function updateLogPaginationInfo(start, end, total) {
    const pageStartEl = document.getElementById('logPageStart');
    const pageEndEl = document.getElementById('logPageEnd');
    const totalRecordsEl = document.getElementById('totalLogRecords');
    
    if (pageStartEl) pageStartEl.textContent = start;
    if (pageEndEl) pageEndEl.textContent = end;
    if (totalRecordsEl) totalRecordsEl.textContent = total.toLocaleString();
}

/**
 * 更新日志分页控件
 */
function updateLogPaginationControls() {
    const totalPages = Math.ceil(filteredLogs.length / logPageSize);
    const pageNumbersEl = document.getElementById('logPageNumbers');
    
    if (!pageNumbersEl) return;
    
    // 生成页码按钮
    let pageNumbers = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentLogPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers += `
            <button class="page-btn ${i === currentLogPage ? 'active' : ''}" 
                    onclick="changeLogPage(${i})">${i}</button>
        `;
    }
    
    pageNumbersEl.innerHTML = pageNumbers;
    
    // 更新导航按钮状态
    const firstPageBtn = document.getElementById('firstLogPageBtn');
    const prevPageBtn = document.getElementById('prevLogPageBtn');
    const nextPageBtn = document.getElementById('nextLogPageBtn');
    const lastPageBtn = document.getElementById('lastLogPageBtn');
    
    if (firstPageBtn) firstPageBtn.disabled = currentLogPage === 1;
    if (prevPageBtn) prevPageBtn.disabled = currentLogPage === 1;
    if (nextPageBtn) nextPageBtn.disabled = currentLogPage === totalPages;
    if (lastPageBtn) lastPageBtn.disabled = currentLogPage === totalPages;
}

/**
 * 设置默认时间范围
 */
function setDefaultDateRange() {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const startDateEl = document.getElementById('startDate');
    const endDateEl = document.getElementById('endDate');
    
    if (startDateEl) startDateEl.value = weekAgo.toISOString().split('T')[0];
    if (endDateEl) endDateEl.value = today.toISOString().split('T')[0];
}

// ===== 事件绑定 =====

/**
 * 绑定日志事件
 */
function bindLogEvents() {
    // 表格排序
    document.querySelectorAll('#logTable th[data-sort]').forEach(th => {
        th.addEventListener('click', function() {
            const field = this.getAttribute('data-sort');
            handleLogSort(field);
        });
    });
    
    // 筛选器变化
    const filters = ['actionFilter', 'levelFilter', 'userFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', debounce(applyLogFilters, 300));
        }
    });
    
    // 日期范围变化
    const dateInputs = ['startDate', 'endDate'];
    dateInputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            element.addEventListener('change', debounce(applyLogFilters, 300));
        }
    });
    
    // 搜索框
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleLogSearch, 300));
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
 * 设置时间范围
 */
function setTimeRange(range) {
    currentTimeRange = range;
    
    // 更新按钮状态
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新图表
    updateLogTimelineChart();
    
    const rangeNames = {
        '24h': '24小时',
        '7d': '7天',
        '30d': '30天'
    };
    
    showNotification(`已切换到${rangeNames[range]}视图`, 'info');
}

/**
 * 刷新分类图表
 */
function refreshCategoryChart() {
    updateLogCategoriesChart();
    showNotification('操作分类图表已刷新', 'success');
}

/**
 * 切换日志视图
 */
function toggleLogView(mode) {
    viewMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('.table-actions .btn-icon').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 渲染对应视图
    renderLogTable();
    
    const viewNames = {
        timeline: '时间线视图',
        table: '表格视图'
    };
    
    showNotification(`已切换到${viewNames[mode]}`, 'success');
}

/**
 * 自动刷新日志
 */
function autoRefreshLogs() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
        event.target.classList.remove('active');
        showNotification('已关闭自动刷新', 'info');
    } else {
        autoRefreshInterval = setInterval(() => {
            refreshLogs();
        }, 30000); // 30秒刷新一次
        event.target.classList.add('active');
        showNotification('已开启自动刷新（30秒间隔）', 'success');
    }
}

/**
 * 应用日志筛选
 */
function applyLogFilters() {
    const action = document.getElementById('actionFilter')?.value || '';
    const level = document.getElementById('levelFilter')?.value || '';
    const user = document.getElementById('userFilter')?.value || '';
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    const searchText = document.querySelector('.search-input')?.value?.toLowerCase() || '';
    
    filteredLogs = logs.filter(log => {
        // 操作类型筛选
        if (action && log.action !== action) {
            return false;
        }
        
        // 日志级别筛选
        if (level && log.level !== level) {
            return false;
        }
        
        // 用户筛选
        if (user && log.user !== user) {
            return false;
        }
        
        // 时间范围筛选
        if (startDate) {
            const start = new Date(startDate);
            if (log.timestamp < start) {
                return false;
            }
        }
        
        if (endDate) {
            const end = new Date(endDate + ' 23:59:59');
            if (log.timestamp > end) {
                return false;
            }
        }
        
        // 搜索文本筛选
        if (searchText) {
            const searchFields = [
                log.description,
                log.userName,
                log.target,
                log.ip,
                log.actionName
            ].join(' ').toLowerCase();
            if (!searchFields.includes(searchText)) {
                return false;
            }
        }
        
        return true;
    });
    
    // 重置到第一页
    currentLogPage = 1;
    
    renderLogTable();
    renderLogOverview();
    updateLogTimelineChart();
    updateLogCategoriesChart();
    
    const filterCount = [action, level, user, startDate, endDate, searchText].filter(Boolean).length;
    if (filterCount > 0) {
        showNotification(`已应用 ${filterCount} 个筛选条件，找到 ${filteredLogs.length.toLocaleString()} 条日志`, 'info');
    }
}

/**
 * 清除日志筛选
 */
function clearLogFilters() {
    // 清除筛选器值
    const filterElements = [
        'actionFilter',
        'levelFilter',
        'userFilter',
        'startDate',
        'endDate'
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    // 清除搜索框
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    // 重置数据
    filteredLogs = [...logs];
    currentLogPage = 1;
    
    renderLogTable();
    renderLogOverview();
    updateLogTimelineChart();
    updateLogCategoriesChart();
    
    showNotification('已清除所有筛选条件', 'success');
}

/**
 * 处理日志搜索
 */
function handleLogSearch() {
    applyLogFilters();
}

/**
 * 处理日志排序
 */
function handleLogSort(field) {
    if (currentLogSort.field === field) {
        currentLogSort.order = currentLogSort.order === 'asc' ? 'desc' : 'asc';
    } else {
        currentLogSort.field = field;
        currentLogSort.order = 'desc';
    }
    
    // 应用排序
    filteredLogs.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (field === 'timestamp') {
            aVal = aVal.getTime();
            bVal = bVal.getTime();
        } else if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
        }
        
        if (currentLogSort.order === 'asc') {
            return aVal > bVal ? 1 : -1;
        } else {
            return aVal < bVal ? 1 : -1;
        }
    });
    
    currentLogPage = 1;
    renderLogTable();
    
    const fieldNames = {
        timestamp: '时间',
        level: '级别',
        action: '操作类型',
        user: '用户',
        target: '操作对象',
        ip: 'IP地址',
        result: '结果'
    };
    
    showNotification(`已按${fieldNames[field]}${currentLogSort.order === 'asc' ? '升序' : '降序'}排列`, 'success');
}

/**
 * 切换日志页面
 */
function changeLogPage(action) {
    const totalPages = Math.ceil(filteredLogs.length / logPageSize);
    
    switch(action) {
        case 'first':
            currentLogPage = 1;
            break;
        case 'prev':
            currentLogPage = Math.max(1, currentLogPage - 1);
            break;
        case 'next':
            currentLogPage = Math.min(totalPages, currentLogPage + 1);
            break;
        case 'last':
            currentLogPage = totalPages;
            break;
        default:
            if (typeof action === 'number') {
                currentLogPage = Math.max(1, Math.min(totalPages, action));
            }
    }
    
    renderLogTable();
}

/**
 * 查看日志详情
 */
function viewLogDetails(logId) {
    const log = logs.find(l => l.id === logId);
    if (!log) {
        showNotification('日志不存在', 'error');
        return;
    }
    
    const levelText = {
        info: '信息',
        warning: '警告',
        error: '错误',
        debug: '调试'
    }[log.level];
    
    const resultText = {
        success: '成功',
        failed: '失败'
    }[log.result];
    
    const content = `
        <div class="log-detail-content">
            <div class="log-basic-info">
                <div class="log-header-detail">
                    <h3>${log.actionName}</h3>
                    <div class="log-badges-detail">
                        <span class="log-level ${log.level}">${levelText}</span>
                        <span class="result-badge ${log.result}">${resultText}</span>
                    </div>
                </div>
                <p class="log-description-detail">${log.description}</p>
            </div>
            
            <div class="log-metadata">
                <div class="metadata-section">
                    <h4><i class="fas fa-info-circle"></i> 基本信息</h4>
                    <div class="metadata-grid">
                        <div class="metadata-item">
                            <label>日志ID:</label>
                            <span><code>${log.id}</code></span>
                        </div>
                        <div class="metadata-item">
                            <label>操作时间:</label>
                            <span>${log.timestamp.toLocaleString('zh-CN')}</span>
                        </div>
                        <div class="metadata-item">
                            <label>操作用户:</label>
                            <span>${log.userName} (${log.user})</span>
                        </div>
                        <div class="metadata-item">
                            <label>操作对象:</label>
                            <span>${log.target}</span>
                        </div>
                        <div class="metadata-item">
                            <label>客户端IP:</label>
                            <span><code>${log.ip}</code></span>
                        </div>
                        <div class="metadata-item">
                            <label>用户代理:</label>
                            <span><small>${log.userAgent}</small></span>
                        </div>
                    </div>
                </div>
                
                <div class="metadata-section">
                    <h4><i class="fas fa-cogs"></i> 请求信息</h4>
                    <div class="metadata-grid">
                        <div class="metadata-item">
                            <label>会话ID:</label>
                            <span><code>${log.details.sessionId}</code></span>
                        </div>
                        <div class="metadata-item">
                            <label>请求ID:</label>
                            <span><code>${log.details.requestId}</code></span>
                        </div>
                        <div class="metadata-item">
                            <label>执行时长:</label>
                            <span>${log.details.duration}ms</span>
                        </div>
                        <div class="metadata-item">
                            <label>请求大小:</label>
                            <span>${log.details.requestSize} bytes</span>
                        </div>
                        <div class="metadata-item">
                            <label>响应大小:</label>
                            <span>${log.details.responseSize} bytes</span>
                        </div>
                        ${log.details.errorCode ? `
                        <div class="metadata-item error">
                            <label>错误代码:</label>
                            <span><code>${log.details.errorCode}</code></span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                
                ${log.details.errorMessage ? `
                <div class="metadata-section error-section">
                    <h4><i class="fas fa-exclamation-triangle"></i> 错误信息</h4>
                    <div class="error-message">
                        <code>${log.details.errorMessage}</code>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    const modal = document.getElementById('logDetailModal');
    const detailContent = document.getElementById('logDetailContent');
    if (detailContent) {
        detailContent.innerHTML = content;
    }
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * 关闭日志详情模态框
 */
function closeLogDetailModal() {
    const modal = document.getElementById('logDetailModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 导出单个日志
 */
function exportSingleLog(logId) {
    if (logId) {
        showNotification(`导出日志 ${logId}`, 'info');
    } else {
        showNotification('导出当前查看的日志', 'info');
    }
}

/**
 * 刷新日志
 */
function refreshLogs() {
    renderLogOverview();
    updateLogTimelineChart();
    updateLogCategoriesChart();
    renderLogTable();
    showNotification('日志数据已刷新', 'success');
}

/**
 * 导出日志
 */
function exportLogs() {
    showNotification('日志导出功能开发中...', 'info');
}

/**
 * 清理旧日志
 */
function clearOldLogs() {
    showConfirm('确定要清理30天前的日志吗？\n\n此操作不可撤销。', () => {
        showNotification('日志清理功能开发中...', 'info');
    });
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
 
 
 
 
 
 
 
 
 