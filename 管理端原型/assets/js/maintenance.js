/**
 * 农情遥感系统管理端 - 设备维护管理功能
 * 功能：维护任务管理、维护日历、维护统计分析等
 */

// ===== 全局变量 =====
let maintenanceData = {
    tasks: [],
    statistics: {},
    alerts: []
};
let charts = {};
let currentPage = 1;
let pageSize = 20;
let totalRecords = 0;
let currentDate = new Date();

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeMaintenancePage();
});

/**
 * 页面初始化
 */
function initializeMaintenancePage() {
    console.log('🔧 初始化设备维护管理页面...');
    
    // 生成模拟数据
    generateMockMaintenanceData();
    
    // 初始化图表
    initializeMaintenanceCharts();
    
    // 渲染页面内容
    renderMaintenanceOverview();
    renderMaintenanceCalendar();
    renderMaintenanceAlerts();
    renderMaintenanceTable();
    
    // 绑定事件
    bindMaintenanceEvents();
    
    console.log('✅ 设备维护管理页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟维护数据
 */
function generateMockMaintenanceData() {
    // 维护任务数据
    maintenanceData.tasks = [
        {
            id: 'maint_001',
            taskName: '温度传感器定期校准',
            deviceName: '温度传感器-001',
            deviceType: 'sensor',
            maintenanceType: 'preventive',
            priority: 'medium',
            status: 'scheduled',
            scheduledDate: new Date(2024, 0, 20, 9, 0),
            completedDate: null,
            assignee: '张工程师',
            estimatedCost: 200,
            actualCost: null,
            content: '对温度传感器进行定期校准，确保测量精度',
            remarks: '需要标准温度计',
            createdDate: new Date(2024, 0, 10),
            lastUpdated: new Date(2024, 0, 15)
        },
        {
            id: 'maint_002',
            taskName: '监控摄像头清洁维护',
            deviceName: '监控摄像头-001',
            deviceType: 'camera',
            maintenanceType: 'preventive',
            priority: 'low',
            status: 'completed',
            scheduledDate: new Date(2024, 0, 15, 14, 0),
            completedDate: new Date(2024, 0, 15, 16, 30),
            assignee: '李技术员',
            estimatedCost: 50,
            actualCost: 45,
            content: '清洁摄像头镜头，检查支架固定情况',
            remarks: '镜头有轻微污渍',
            createdDate: new Date(2024, 0, 8),
            lastUpdated: new Date(2024, 0, 15)
        },
        {
            id: 'maint_003',
            taskName: '气象站紧急维修',
            deviceName: '气象站-001',
            deviceType: 'weather',
            maintenanceType: 'emergency',
            priority: 'high',
            status: 'in-progress',
            scheduledDate: new Date(2024, 0, 18, 8, 0),
            completedDate: null,
            assignee: '王维修员',
            estimatedCost: 800,
            actualCost: null,
            content: '风速传感器故障，需要更换传感器模块',
            remarks: '影响气象数据采集',
            createdDate: new Date(2024, 0, 17),
            lastUpdated: new Date(2024, 0, 18)
        },
        {
            id: 'maint_004',
            taskName: '网络设备系统升级',
            deviceName: '网络路由器-001',
            deviceType: 'network',
            maintenanceType: 'upgrade',
            priority: 'medium',
            status: 'scheduled',
            scheduledDate: new Date(2024, 0, 25, 20, 0),
            completedDate: null,
            assignee: '陈主管',
            estimatedCost: 0,
            actualCost: null,
            content: '升级路由器固件到最新版本，提升网络安全性',
            remarks: '需要在非工作时间进行',
            createdDate: new Date(2024, 0, 12),
            lastUpdated: new Date(2024, 0, 16)
        },
        {
            id: 'maint_005',
            taskName: '土壤传感器更换电池',
            deviceName: '土壤传感器-003',
            deviceType: 'sensor',
            maintenanceType: 'corrective',
            priority: 'high',
            status: 'scheduled',
            scheduledDate: new Date(2024, 0, 19, 10, 0),
            completedDate: null,
            assignee: '张工程师',
            estimatedCost: 120,
            actualCost: null,
            content: '更换土壤传感器电池，检查数据传输功能',
            remarks: '电池电量低于10%',
            createdDate: new Date(2024, 0, 16),
            lastUpdated: new Date(2024, 0, 17)
        }
    ];
    
    // 统计数据
    maintenanceData.statistics = {
        totalItems: 156,
        pendingMaintenance: 23,
        completedMaintenance: 89,
        maintenanceCost: 28560,
        typeDistribution: {
            preventive: 65,
            corrective: 45,
            emergency: 28,
            upgrade: 18
        }
    };
    
    // 维护提醒
    maintenanceData.alerts = [
        {
            id: 'alert_001',
            type: 'urgent',
            title: '气象站-001需要紧急维修',
            message: '风速传感器故障，影响数据采集',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
            read: false,
            taskId: 'maint_003'
        },
        {
            id: 'alert_002',
            type: 'scheduled',
            title: '温度传感器-001定期维护提醒',
            message: '计划维护时间：明天上午9:00',
            timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6小时前
            read: false,
            taskId: 'maint_001'
        },
        {
            id: 'alert_003',
            type: 'overdue',
            title: '湿度传感器-002维护逾期',
            message: '计划维护时间已过期3天',
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12小时前
            read: true,
            taskId: null
        }
    ];
    
    totalRecords = maintenanceData.tasks.length;
    
    console.log('🔧 生成设备维护模拟数据完成');
}

// ===== 图表初始化 =====

/**
 * 初始化维护图表
 */
function initializeMaintenanceCharts() {
    initializeMaintenanceTrendChart();
    initializeMaintenanceTypesChart();
}

/**
 * 初始化维护趋势图表
 */
function initializeMaintenanceTrendChart() {
    const chartDom = document.getElementById('maintenanceTrendChart');
    if (!chartDom) return;
    
    charts.maintenanceTrend = echarts.init(chartDom);
    updateMaintenanceTrendChart();
}

/**
 * 更新维护趋势图表
 */
function updateMaintenanceTrendChart() {
    if (!charts.maintenanceTrend) return;
    
    // 生成最近30天的模拟数据
    const days = [];
    const scheduledData = [];
    const completedData = [];
    const costData = [];
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push(date.getDate() + '日');
        
        scheduledData.push(Math.floor(Math.random() * 8) + 2); // 2-10
        completedData.push(Math.floor(Math.random() * 6) + 1); // 1-7
        costData.push(Math.floor(Math.random() * 2000) + 500); // 500-2500
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
            data: ['计划维护', '完成维护', '维护费用'],
            textStyle: {
                color: '#718096',
                fontSize: 11
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
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
                fontSize: 10
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '任务数量',
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
            {
                type: 'value',
                name: '费用(元)',
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
                    show: false
                }
            }
        ],
        series: [
            {
                name: '计划维护',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 3,
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
                data: scheduledData
            },
            {
                name: '完成维护',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 2,
                    color: '#4CAF50'
                },
                data: completedData
            },
            {
                name: '维护费用',
                type: 'bar',
                yAxisIndex: 1,
                barWidth: '20%',
                itemStyle: {
                    color: '#FF9800'
                },
                data: costData
            }
        ]
    };
    
    charts.maintenanceTrend.setOption(option);
}

/**
 * 初始化维护类型分布图表
 */
function initializeMaintenanceTypesChart() {
    const chartDom = document.getElementById('maintenanceTypesChart');
    if (!chartDom) return;
    
    charts.maintenanceTypes = echarts.init(chartDom);
    updateMaintenanceTypesChart();
}

/**
 * 更新维护类型分布图表
 */
function updateMaintenanceTypesChart() {
    if (!charts.maintenanceTypes) return;
    
    const typeNames = {
        preventive: '预防性维护',
        corrective: '纠正性维护',
        emergency: '紧急维修',
        upgrade: '设备升级'
    };
    
    const data = Object.entries(maintenanceData.statistics.typeDistribution).map(([key, value]) => ({
        name: typeNames[key],
        value: value
    }));
    
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
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            textStyle: {
                color: '#718096',
                fontSize: 10
            }
        },
        series: [
            {
                name: '维护类型',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold',
                        color: '#2E7D32'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data,
                color: ['#2E7D32', '#4CAF50', '#FF9800', '#2196F3']
            }
        ]
    };
    
    charts.maintenanceTypes.setOption(option);
}

// ===== 页面渲染 =====

/**
 * 渲染维护概览
 */
function renderMaintenanceOverview() {
    const stats = maintenanceData.statistics;
    
    // 更新统计数据
    updateElement('totalMaintenanceItems', stats.totalItems);
    updateElement('pendingMaintenance', stats.pendingMaintenance);
    updateElement('completedMaintenance', stats.completedMaintenance);
    updateElement('maintenanceCost', stats.maintenanceCost.toLocaleString());
    
    console.log('🔧 渲染维护概览完成');
}

/**
 * 渲染维护日历
 */
function renderMaintenanceCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarGrid || !currentMonthElement) return;
    
    // 更新月份显示
    currentMonthElement.textContent = `${currentDate.getFullYear()}年${currentDate.getMonth() + 1}月`;
    
    // 生成日历
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let calendarHTML = '<div class="calendar-weekdays">';
    const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
    weekdays.forEach(day => {
        calendarHTML += `<div class="weekday">${day}</div>`;
    });
    calendarHTML += '</div><div class="calendar-days">';
    
    for (let i = 0; i < 42; i++) {
        const currentCalendarDate = new Date(startDate);
        currentCalendarDate.setDate(startDate.getDate() + i);
        
        const isCurrentMonth = currentCalendarDate.getMonth() === month;
        const isToday = currentCalendarDate.toDateString() === new Date().toDateString();
        
        // 检查当天是否有维护任务
        const dayTasks = maintenanceData.tasks.filter(task => {
            const taskDate = new Date(task.scheduledDate);
            return taskDate.toDateString() === currentCalendarDate.toDateString();
        });
        
        let dayClass = 'calendar-day';
        if (!isCurrentMonth) dayClass += ' other-month';
        if (isToday) dayClass += ' today';
        
        let taskIndicators = '';
        dayTasks.forEach(task => {
            let indicatorClass = 'task-indicator ';
            if (task.status === 'completed') indicatorClass += 'completed';
            else if (task.maintenanceType === 'emergency') indicatorClass += 'urgent';
            else indicatorClass += 'scheduled';
            
            taskIndicators += `<span class="${indicatorClass}" title="${task.taskName}"></span>`;
        });
        
        calendarHTML += `
            <div class="${dayClass}" onclick="showDayTasks('${currentCalendarDate.toISOString()}')">
                <span class="day-number">${currentCalendarDate.getDate()}</span>
                <div class="task-indicators">${taskIndicators}</div>
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    calendarGrid.innerHTML = calendarHTML;
    
    console.log('🔧 渲染维护日历完成');
}

/**
 * 渲染维护提醒
 */
function renderMaintenanceAlerts() {
    const alertsList = document.getElementById('alertsList');
    if (!alertsList) return;
    
    if (maintenanceData.alerts.length === 0) {
        alertsList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-bell-slash"></i>
                <h4>暂无提醒</h4>
                <p>当前没有需要关注的维护提醒</p>
            </div>
        `;
        return;
    }
    
    alertsList.innerHTML = maintenanceData.alerts.map(alert => {
        const alertTypeClass = {
            urgent: 'urgent',
            scheduled: 'scheduled',
            overdue: 'overdue'
        }[alert.type];
        
        const alertIcon = {
            urgent: 'fas fa-exclamation-circle',
            scheduled: 'fas fa-clock',
            overdue: 'fas fa-exclamation-triangle'
        }[alert.type];
        
        return `
            <div class="alert-item ${alertTypeClass} ${alert.read ? 'read' : ''}" 
                 onclick="handleAlertClick('${alert.id}')">
                <div class="alert-icon">
                    <i class="${alertIcon}"></i>
                </div>
                <div class="alert-content">
                    <h4 class="alert-title">${alert.title}</h4>
                    <p class="alert-message">${alert.message}</p>
                    <div class="alert-time">${formatTimeAgo(alert.timestamp)}</div>
                </div>
                <div class="alert-actions">
                    <button class="btn-icon btn-xs" onclick="event.stopPropagation(); markAlertRead('${alert.id}')" 
                            data-tooltip="标记已读">
                        <i class="fas fa-check"></i>
                    </button>
                    <button class="btn-icon btn-xs" onclick="event.stopPropagation(); dismissAlert('${alert.id}')" 
                            data-tooltip="忽略">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('🔧 渲染维护提醒完成');
}

/**
 * 渲染维护表格
 */
function renderMaintenanceTable() {
    const tbody = document.getElementById('maintenanceTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, maintenanceData.tasks.length);
    const pageData = maintenanceData.tasks.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map(task => {
        const statusClass = getMaintenanceStatusClass(task.status);
        const statusText = getMaintenanceStatusText(task.status);
        const priorityClass = getPriorityClass(task.priority);
        const priorityText = getPriorityText(task.priority);
        const typeText = getMaintenanceTypeText(task.maintenanceType);
        
        return `
            <tr>
                <td>
                    <input type="checkbox" class="maintenance-checkbox" value="${task.id}">
                </td>
                <td>
                    <div class="task-name-cell">
                        <span onclick="showMaintenanceDetail('${task.id}')" class="link">${task.taskName}</span>
                    </div>
                </td>
                <td>${task.deviceName}</td>
                <td>
                    <span class="type-badge ${task.maintenanceType}">${typeText}</span>
                </td>
                <td>
                    <span class="priority-badge ${priorityClass}">${priorityText}</span>
                </td>
                <td>${formatDateTime(task.scheduledDate)}</td>
                <td>
                    <span class="badge badge-${statusClass}">${statusText}</span>
                </td>
                <td>${task.assignee}</td>
                <td>¥${task.estimatedCost || 0}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-xs" onclick="showMaintenanceDetail('${task.id}')" data-tooltip="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-xs" onclick="editMaintenanceTask('${task.id}')" data-tooltip="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-xs" onclick="updateTaskStatus('${task.id}')" data-tooltip="更新状态">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn-icon btn-xs" onclick="deleteMaintenanceTask('${task.id}')" data-tooltip="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // 更新分页信息
    updateMaintenancePaginationInfo();
    
    console.log('🔧 渲染维护表格完成');
}

// ===== 工具函数 =====

/**
 * 更新元素内容
 */
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

/**
 * 获取维护状态样式类
 */
function getMaintenanceStatusClass(status) {
    const classes = {
        scheduled: 'info',
        'in-progress': 'warning',
        completed: 'success',
        cancelled: 'secondary'
    };
    return classes[status] || 'secondary';
}

/**
 * 获取维护状态文本
 */
function getMaintenanceStatusText(status) {
    const texts = {
        scheduled: '已排期',
        'in-progress': '进行中',
        completed: '已完成',
        cancelled: '已取消'
    };
    return texts[status] || '未知';
}

/**
 * 获取优先级样式类
 */
function getPriorityClass(priority) {
    const classes = {
        high: 'danger',
        medium: 'warning',
        low: 'success'
    };
    return classes[priority] || 'secondary';
}

/**
 * 获取优先级文本
 */
function getPriorityText(priority) {
    const texts = {
        high: '高优先级',
        medium: '中优先级',
        low: '低优先级'
    };
    return texts[priority] || '未知';
}

/**
 * 获取维护类型文本
 */
function getMaintenanceTypeText(type) {
    const texts = {
        preventive: '预防性维护',
        corrective: '纠正性维护',
        emergency: '紧急维修',
        upgrade: '设备升级'
    };
    return texts[type] || '未知';
}

/**
 * 格式化日期时间
 */
function formatDateTime(date) {
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
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
function updateMaintenancePaginationInfo() {
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalRecords);
    
    updateElement('maintenancePageStart', startIndex);
    updateElement('maintenancePageEnd', endIndex);
    updateElement('totalMaintenanceRecords', totalRecords);
}

// ===== 事件绑定 =====

/**
 * 绑定维护管理事件
 */
function bindMaintenanceEvents() {
    // 窗口大小变化时重新调整图表
    window.addEventListener('resize', debounce(() => {
        Object.values(charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }, 200));
    
    // 文件拖拽上传
    const fileUploadArea = document.querySelector('.file-upload-area');
    if (fileUploadArea) {
        fileUploadArea.addEventListener('dragover', handleDragOver);
        fileUploadArea.addEventListener('drop', handleFileDrop);
    }
}

/**
 * 处理文件拖拽悬停
 */
function handleDragOver(e) {
    e.preventDefault();
    e.target.classList.add('drag-over');
}

/**
 * 处理文件拖拽放置
 */
function handleFileDrop(e) {
    e.preventDefault();
    e.target.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    handleMaintenanceFiles(files);
}

/**
 * 处理维护文件选择
 */
function handleMaintenanceFileSelect(event) {
    const files = event.target.files;
    handleMaintenanceFiles(files);
}

/**
 * 处理维护文件
 */
function handleMaintenanceFiles(files) {
    const selectedFilesContainer = document.getElementById('selectedMaintenanceFiles');
    if (!selectedFilesContainer) return;
    
    selectedFilesContainer.innerHTML = '';
    
    Array.from(files).forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.innerHTML = `
            <div class="file-info">
                <i class="fas fa-file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${formatFileSize(file.size)})</span>
            </div>
            <button class="btn-icon btn-xs" onclick="removeMaintenanceFile(this)">
                <i class="fas fa-times"></i>
            </button>
        `;
        selectedFilesContainer.appendChild(fileItem);
    });
}

/**
 * 移除维护文件
 */
function removeMaintenanceFile(button) {
    button.parentElement.remove();
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ===== 功能函数 =====

/**
 * 显示添加维护任务模态框
 */
function showAddMaintenanceModal() {
    const modal = document.getElementById('addMaintenanceModal');
    if (modal) {
        // 设置默认时间
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        document.getElementById('scheduledStartDate').value = tomorrow.toISOString().slice(0, 16);
        
        modal.classList.add('show');
    }
}

/**
 * 关闭添加维护任务模态框
 */
function closeAddMaintenanceModal() {
    const modal = document.getElementById('addMaintenanceModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 保存维护任务
 */
function saveMaintenanceTask() {
    const form = document.getElementById('addMaintenanceForm');
    
    // 验证表单
    const taskName = document.getElementById('taskName').value;
    const maintenanceType = document.getElementById('maintenanceType').value;
    const deviceName = document.getElementById('deviceName').value;
    const priority = document.getElementById('priority').value;
    const scheduledStartDate = document.getElementById('scheduledStartDate').value;
    const assignee = document.getElementById('assignee').value;
    const maintenanceContent = document.getElementById('maintenanceContent').value;
    
    if (!taskName || !maintenanceType || !deviceName || !priority || !scheduledStartDate || !assignee || !maintenanceContent) {
        showNotification('请填写必填字段', 'warning');
        return;
    }
    
    showNotification('正在保存维护任务...', 'info');
    
    // 模拟保存过程
    setTimeout(() => {
        const newTask = {
            id: 'maint_' + Date.now(),
            taskName: taskName,
            deviceName: deviceName,
            deviceType: 'sensor', // 根据设备名称推断
            maintenanceType: maintenanceType,
            priority: priority,
            status: 'scheduled',
            scheduledDate: new Date(scheduledStartDate),
            completedDate: null,
            assignee: assignee,
            estimatedCost: parseFloat(document.getElementById('estimatedCost').value) || 0,
            actualCost: null,
            content: maintenanceContent,
            remarks: document.getElementById('remarks').value || '',
            createdDate: new Date(),
            lastUpdated: new Date()
        };
        
        maintenanceData.tasks.unshift(newTask);
        totalRecords = maintenanceData.tasks.length;
        
        renderMaintenanceTable();
        renderMaintenanceCalendar();
        closeAddMaintenanceModal();
        showNotification('维护任务保存成功', 'success');
    }, 2000);
}

/**
 * 显示维护任务详情
 */
function showMaintenanceDetail(taskId) {
    const task = maintenanceData.tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const modal = document.getElementById('maintenanceDetailModal');
    const content = document.getElementById('maintenanceDetailContent');
    
    if (modal && content) {
        content.innerHTML = `
            <div class="maintenance-detail-layout">
                <div class="task-basic-info">
                    <div class="info-header">
                        <h4>${task.taskName}</h4>
                        <div class="task-badges">
                            <span class="badge badge-${getMaintenanceStatusClass(task.status)}">${getMaintenanceStatusText(task.status)}</span>
                            <span class="priority-badge ${getPriorityClass(task.priority)}">${getPriorityText(task.priority)}</span>
                        </div>
                    </div>
                    
                    <div class="info-grid">
                        <div class="info-section">
                            <h5>基本信息</h5>
                            <div class="info-items">
                                <div class="info-item">
                                    <label>设备名称:</label>
                                    <span>${task.deviceName}</span>
                                </div>
                                <div class="info-item">
                                    <label>维护类型:</label>
                                    <span>${getMaintenanceTypeText(task.maintenanceType)}</span>
                                </div>
                                <div class="info-item">
                                    <label>负责人:</label>
                                    <span>${task.assignee}</span>
                                </div>
                                <div class="info-item">
                                    <label>计划时间:</label>
                                    <span>${formatDateTime(task.scheduledDate)}</span>
                                </div>
                                ${task.completedDate ? `
                                    <div class="info-item">
                                        <label>完成时间:</label>
                                        <span>${formatDateTime(task.completedDate)}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h5>费用信息</h5>
                            <div class="info-items">
                                <div class="info-item">
                                    <label>预估费用:</label>
                                    <span>¥${task.estimatedCost || 0}</span>
                                </div>
                                ${task.actualCost !== null ? `
                                    <div class="info-item">
                                        <label>实际费用:</label>
                                        <span>¥${task.actualCost}</span>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="task-content">
                    <div class="content-section">
                        <h5>维护内容</h5>
                        <p>${task.content}</p>
                    </div>
                    
                    ${task.remarks ? `
                        <div class="content-section">
                            <h5>备注信息</h5>
                            <p>${task.remarks}</p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="task-timeline">
                    <h5>任务时间线</h5>
                    <div class="timeline-items">
                        <div class="timeline-item">
                            <div class="timeline-dot created"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">任务创建</div>
                                <div class="timeline-time">${formatDateTime(task.createdDate)}</div>
                            </div>
                        </div>
                        
                        <div class="timeline-item">
                            <div class="timeline-dot scheduled"></div>
                            <div class="timeline-content">
                                <div class="timeline-title">任务排期</div>
                                <div class="timeline-time">${formatDateTime(task.scheduledDate)}</div>
                            </div>
                        </div>
                        
                        ${task.completedDate ? `
                            <div class="timeline-item">
                                <div class="timeline-dot completed"></div>
                                <div class="timeline-content">
                                    <div class="timeline-title">任务完成</div>
                                    <div class="timeline-time">${formatDateTime(task.completedDate)}</div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
        modal.classList.add('show');
    }
}

/**
 * 关闭维护任务详情模态框
 */
function closeMaintenanceDetailModal() {
    const modal = document.getElementById('maintenanceDetailModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 日历导航函数
 */
function prevMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderMaintenanceCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderMaintenanceCalendar();
}

function goToToday() {
    currentDate = new Date();
    renderMaintenanceCalendar();
}

/**
 * 显示某天的维护任务
 */
function showDayTasks(dateString) {
    const date = new Date(dateString);
    const dayTasks = maintenanceData.tasks.filter(task => {
        const taskDate = new Date(task.scheduledDate);
        return taskDate.toDateString() === date.toDateString();
    });
    
    if (dayTasks.length === 0) {
        showNotification(`${date.getMonth() + 1}月${date.getDate()}日暂无维护任务`, 'info');
        return;
    }
    
    const taskList = dayTasks.map(task => `• ${task.taskName}`).join('<br>');
    showNotification(`${date.getMonth() + 1}月${date.getDate()}日维护任务：<br>${taskList}`, 'info');
}

/**
 * 处理提醒点击
 */
function handleAlertClick(alertId) {
    const alert = maintenanceData.alerts.find(a => a.id === alertId);
    if (alert && alert.taskId) {
        showMaintenanceDetail(alert.taskId);
    }
}

/**
 * 标记提醒已读
 */
function markAlertRead(alertId) {
    const alert = maintenanceData.alerts.find(a => a.id === alertId);
    if (alert) {
        alert.read = true;
        renderMaintenanceAlerts();
        showNotification('提醒已标记为已读', 'success');
    }
}

/**
 * 忽略提醒
 */
function dismissAlert(alertId) {
    const index = maintenanceData.alerts.findIndex(a => a.id === alertId);
    if (index > -1) {
        maintenanceData.alerts.splice(index, 1);
        renderMaintenanceAlerts();
        showNotification('提醒已忽略', 'success');
    }
}

/**
 * 标记所有提醒已读
 */
function markAllAlertsRead() {
    maintenanceData.alerts.forEach(alert => {
        alert.read = true;
    });
    renderMaintenanceAlerts();
    showNotification('所有提醒已标记为已读', 'success');
}

/**
 * 配置提醒
 */
function configureAlerts() {
    showNotification('提醒配置功能开发中...', 'info');
}

/**
 * 刷新提醒
 */
function refreshAlerts() {
    renderMaintenanceAlerts();
    showNotification('提醒已刷新', 'info');
}

/**
 * 图表控制函数
 */
function setMaintenanceTimeRange(range) {
    // 更新时间范围按钮状态
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateMaintenanceTrendChart();
    
    const rangeNames = {
        month: '本月',
        quarter: '本季',
        year: '本年'
    };
    
    showNotification(`已切换到${rangeNames[range]}视图`, 'info');
}

function refreshMaintenanceTypes() {
    updateMaintenanceTypesChart();
    showNotification('维护类型图表已刷新', 'info');
}

function exportMaintenanceChart() {
    showNotification('正在导出维护统计图表...', 'info');
}

/**
 * 筛选和批量操作函数
 */
function applyMaintenanceFilters() {
    showNotification('筛选功能开发中...', 'info');
}

function clearMaintenanceFilters() {
    // 重置所有筛选器
    document.querySelectorAll('#maintenanceTypeFilter, #maintenanceStatusFilter, #deviceTypeFilter, #priorityFilter').forEach(select => {
        select.value = '';
    });
    showNotification('筛选条件已清除', 'info');
}

function batchSchedule() {
    showNotification('批量排期功能开发中...', 'info');
}

function batchComplete() {
    showNotification('批量完成功能开发中...', 'info');
}

function batchExportMaintenance() {
    showNotification('批量导出功能开发中...', 'info');
}

/**
 * 表格视图切换
 */
function toggleMaintenanceView(viewType) {
    const viewNames = {
        timeline: '时间线视图',
        kanban: '看板视图',
        table: '表格视图'
    };
    
    showNotification(`切换到${viewNames[viewType]}功能开发中...`, 'info');
}

/**
 * 维护任务操作函数
 */
function editMaintenanceTask(taskId) {
    showNotification('编辑维护任务功能开发中...', 'info');
}

function updateTaskStatus(taskId) {
    const task = maintenanceData.tasks.find(t => t.id === taskId);
    if (task) {
        // 简单的状态切换逻辑
        if (task.status === 'scheduled') {
            task.status = 'in-progress';
        } else if (task.status === 'in-progress') {
            task.status = 'completed';
            task.completedDate = new Date();
        }
        
        renderMaintenanceTable();
        showNotification(`任务状态已更新为：${getMaintenanceStatusText(task.status)}`, 'success');
    }
}

function deleteMaintenanceTask(taskId) {
    const task = maintenanceData.tasks.find(t => t.id === taskId);
    if (task) {
        showConfirm(`确定要删除维护任务 "${task.taskName}" 吗？`, () => {
            const index = maintenanceData.tasks.findIndex(t => t.id === taskId);
            if (index > -1) {
                maintenanceData.tasks.splice(index, 1);
                totalRecords = maintenanceData.tasks.length;
                renderMaintenanceTable();
                renderMaintenanceCalendar();
                showNotification('维护任务删除成功', 'success');
            }
        });
    }
}

function updateMaintenanceStatus() {
    showNotification('更新状态功能开发中...', 'info');
}

/**
 * 其他功能函数
 */
function generateMaintenanceReport() {
    showNotification('正在生成维护报告...', 'info');
    
    setTimeout(() => {
        showNotification('维护报告生成完成', 'success');
    }, 2000);
}

function scheduleMaintenanceBatch() {
    showNotification('批量排期功能开发中...', 'info');
}

/**
 * 切换全选
 */
function toggleSelectAllMaintenance() {
    const selectAll = document.getElementById('selectAllMaintenance');
    const checkboxes = document.querySelectorAll('.maintenance-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

// ===== 分页函数 =====

/**
 * 切换页面
 */
function changeMaintenancePage(action) {
    const totalPages = Math.ceil(totalRecords / pageSize);
    
    switch (action) {
        case 'first':
            currentPage = 1;
            break;
        case 'prev':
            if (currentPage > 1) currentPage--;
            break;
        case 'next':
            if (currentPage < totalPages) currentPage++;
            break;
        case 'last':
            currentPage = totalPages;
            break;
        default:
            if (typeof action === 'number') {
                currentPage = action;
            }
    }
    
    renderMaintenanceTable();
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
 
 
 
 
 
 
 
 
 