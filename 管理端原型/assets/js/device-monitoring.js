/**
 * 农情遥感系统管理端 - 监控设备管理功能
 * 功能：监控设备管理、实时视频流、录制控制、设备状态监控等
 */

// ===== 全局变量 =====
let monitoringData = {
    devices: [],
    statistics: {},
    liveStreams: {}
};
let charts = {};
let currentPage = 1;
let pageSize = 20;
let totalRecords = 0;
let currentGridSize = 9;
let currentView = 'grid';

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeMonitoringPage();
});

/**
 * 页面初始化
 */
function initializeMonitoringPage() {
    console.log('📹 初始化监控设备管理页面...');
    
    // 生成模拟数据
    generateMockMonitoringData();
    
    // 初始化图表
    initializeMonitoringCharts();
    
    // 渲染页面内容
    renderMonitoringOverview();
    renderMonitoringGrid();
    renderMonitoringTable();
    
    // 绑定事件
    bindMonitoringEvents();
    
    console.log('✅ 监控设备管理页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟监控设备数据
 */
function generateMockMonitoringData() {
    // 监控设备数据
    monitoringData.devices = [
        {
            id: 'cam_001',
            name: '北部农田监控01',
            type: 'camera',
            ip: '192.168.1.101',
            port: 8080,
            location: '北部片区A地块',
            area: 'north',
            status: 'online',
            resolution: '1080p',
            frameRate: 25,
            recording: true,
            lastActive: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
            coordinates: { lat: 35.6012, lng: 103.2145 },
            features: ['autoRecord', 'motionDetection', 'nightVision'],
            description: '监控北部农田作物生长状况'
        },
        {
            id: 'cam_002',
            name: '南部农田监控01',
            type: 'camera',
            ip: '192.168.1.102',
            port: 8080,
            location: '南部片区B地块',
            area: 'south',
            status: 'online',
            resolution: '1080p',
            frameRate: 25,
            recording: false,
            lastActive: new Date(Date.now() - 2 * 60 * 1000), // 2分钟前
            coordinates: { lat: 35.5234, lng: 103.1876 },
            features: ['autoRecord', 'audioRecord'],
            description: '监控南部农田灌溉系统'
        },
        {
            id: 'drone_001',
            name: '巡航无人机01',
            type: 'drone',
            ip: '192.168.1.201',
            port: 9090,
            location: '移动巡航',
            area: 'center',
            status: 'online',
            resolution: '4k',
            frameRate: 30,
            recording: true,
            lastActive: new Date(Date.now() - 1 * 60 * 1000), // 1分钟前
            coordinates: { lat: 35.5678, lng: 103.2234 },
            features: ['autoRecord', 'motionDetection'],
            description: '定期巡航监控农田整体状况'
        },
        {
            id: 'cam_003',
            name: '东部农田监控01',
            type: 'camera',
            ip: '192.168.1.103',
            port: 8080,
            location: '东部片区C地块',
            area: 'east',
            status: 'offline',
            resolution: '720p',
            frameRate: 15,
            recording: false,
            lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2小时前
            coordinates: { lat: 35.5890, lng: 103.2567 },
            features: ['autoRecord'],
            description: '监控东部农田病虫害情况'
        },
        {
            id: 'thermal_001',
            name: '热成像监控01',
            type: 'thermal',
            ip: '192.168.1.301',
            port: 8081,
            location: '西部片区D地块',
            area: 'west',
            status: 'online',
            resolution: '1080p',
            frameRate: 25,
            recording: true,
            lastActive: new Date(Date.now() - 10 * 60 * 1000), // 10分钟前
            coordinates: { lat: 35.5345, lng: 103.1654 },
            features: ['autoRecord', 'nightVision'],
            description: '热成像监控作物温度分布'
        },
        {
            id: 'cam_004',
            name: '中部农田监控01',
            type: 'camera',
            ip: '192.168.1.104',
            port: 8080,
            location: '中部片区E地块',
            area: 'center',
            status: 'alert',
            resolution: '1080p',
            frameRate: 25,
            recording: false,
            lastActive: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
            coordinates: { lat: 35.5567, lng: 103.2098 },
            features: ['autoRecord', 'motionDetection', 'audioRecord'],
            description: '监控中部农田水源管理'
        }
    ];
    
    // 统计数据
    monitoringData.statistics = {
        totalDevices: 128,
        onlineDevices: 115,
        recordingDevices: 87,
        alertDevices: 5,
        statusDistribution: {
            online: 115,
            offline: 8,
            alert: 5
        },
        typeDistribution: {
            camera: 98,
            drone: 15,
            satellite: 8,
            thermal: 7
        }
    };
    
    totalRecords = monitoringData.devices.length;
    
    console.log('📹 生成监控设备模拟数据完成');
}

// ===== 图表初始化 =====

/**
 * 初始化监控设备图表
 */
function initializeMonitoringCharts() {
    initializeDeviceStatusChart();
    initializeMonitoringTrendChart();
}

/**
 * 初始化设备状态分布图表
 */
function initializeDeviceStatusChart() {
    const chartDom = document.getElementById('deviceStatusChart');
    if (!chartDom) return;
    
    charts.deviceStatus = echarts.init(chartDom);
    updateDeviceStatusChart();
}

/**
 * 更新设备状态分布图表
 */
function updateDeviceStatusChart() {
    if (!charts.deviceStatus) return;
    
    const statusNames = {
        online: '在线',
        offline: '离线',
        alert: '告警'
    };
    
    const data = Object.entries(monitoringData.statistics.statusDistribution).map(([key, value]) => ({
        name: statusNames[key],
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
                fontSize: 11
            }
        },
        series: [
            {
                name: '设备状态',
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
                        fontSize: '16',
                        fontWeight: 'bold',
                        color: '#2E7D32'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data,
                color: ['#4CAF50', '#F44336', '#FF9800']
            }
        ]
    };
    
    charts.deviceStatus.setOption(option);
}

/**
 * 初始化监控活动趋势图表
 */
function initializeMonitoringTrendChart() {
    const chartDom = document.getElementById('monitoringTrendChart');
    if (!chartDom) return;
    
    charts.monitoringTrend = echarts.init(chartDom);
    updateMonitoringTrendChart();
}

/**
 * 更新监控活动趋势图表
 */
function updateMonitoringTrendChart() {
    if (!charts.monitoringTrend) return;
    
    // 生成24小时的模拟数据
    const now = new Date();
    const hours = [];
    const onlineData = [];
    const recordingData = [];
    const alertData = [];
    
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        hours.push(time.getHours() + ':00');
        
        onlineData.push(Math.floor(Math.random() * 15) + 110); // 110-125
        recordingData.push(Math.floor(Math.random() * 20) + 80); // 80-100
        alertData.push(Math.floor(Math.random() * 8) + 2); // 2-10
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
            data: ['在线设备', '录制设备', '告警设备'],
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
            data: hours,
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
        yAxis: {
            type: 'value',
            name: '设备数量',
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
                name: '在线设备',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 3,
                    color: '#4CAF50'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(76, 175, 80, 0.3)' },
                            { offset: 1, color: 'rgba(76, 175, 80, 0.05)' }
                        ]
                    }
                },
                data: onlineData
            },
            {
                name: '录制设备',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 2,
                    color: '#2196F3'
                },
                data: recordingData
            },
            {
                name: '告警设备',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 2,
                    color: '#FF9800'
                },
                data: alertData
            }
        ]
    };
    
    charts.monitoringTrend.setOption(option);
}

// ===== 页面渲染 =====

/**
 * 渲染监控设备概览
 */
function renderMonitoringOverview() {
    const stats = monitoringData.statistics;
    
    // 更新统计数据
    updateElement('totalMonitoringDevices', stats.totalDevices);
    updateElement('onlineDevices', stats.onlineDevices);
    updateElement('recordingDevices', stats.recordingDevices);
    updateElement('alertDevices', stats.alertDevices);
    
    console.log('📹 渲染监控设备概览完成');
}

/**
 * 渲染监控网格
 */
function renderMonitoringGrid() {
    const container = document.getElementById('monitoringGrid');
    if (!container) return;
    
    const gridCols = Math.sqrt(currentGridSize);
    container.style.gridTemplateColumns = `repeat(${gridCols}, 1fr)`;
    
    const activeDevices = monitoringData.devices.filter(d => d.status === 'online').slice(0, currentGridSize);
    
    container.innerHTML = activeDevices.map(device => {
        const statusClass = getStatusClass(device.status);
        const typeIcon = getDeviceTypeIcon(device.type);
        
        return `
            <div class="monitoring-cell" onclick="showLivePreview('${device.id}')">
                <div class="cell-header">
                    <div class="device-info">
                        <i class="${typeIcon}"></i>
                        <span class="device-name">${device.name}</span>
                    </div>
                    <div class="device-status">
                        <span class="status-dot ${statusClass}"></span>
                        <span class="recording-indicator ${device.recording ? 'active' : ''}">
                            <i class="fas fa-record-vinyl"></i>
                        </span>
                    </div>
                </div>
                <div class="cell-video">
                    <div class="video-placeholder">
                        <i class="fas fa-play-circle"></i>
                        <p>点击观看实时画面</p>
                        <small>${device.resolution} | ${device.frameRate}fps</small>
                    </div>
                </div>
                <div class="cell-controls">
                    <button class="cell-btn" onclick="event.stopPropagation(); toggleRecording('${device.id}')" 
                            data-tooltip="${device.recording ? '停止录制' : '开始录制'}">
                        <i class="fas fa-${device.recording ? 'stop' : 'play'}"></i>
                    </button>
                    <button class="cell-btn" onclick="event.stopPropagation(); captureSnapshot('${device.id}')" 
                            data-tooltip="截图">
                        <i class="fas fa-camera"></i>
                    </button>
                    <button class="cell-btn" onclick="event.stopPropagation(); showDeviceControls('${device.id}')" 
                            data-tooltip="设备控制">
                        <i class="fas fa-cog"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // 填充空白格子
    const emptyCount = currentGridSize - activeDevices.length;
    for (let i = 0; i < emptyCount; i++) {
        container.innerHTML += `
            <div class="monitoring-cell empty">
                <div class="empty-placeholder">
                    <i class="fas fa-plus-circle"></i>
                    <p>暂无设备</p>
                </div>
            </div>
        `;
    }
    
    console.log('📹 渲染监控网格完成');
}

/**
 * 渲染监控设备表格
 */
function renderMonitoringTable() {
    const tbody = document.getElementById('monitoringTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, monitoringData.devices.length);
    const pageData = monitoringData.devices.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map(device => {
        const statusClass = getStatusClass(device.status);
        const statusText = getStatusText(device.status);
        const typeText = getDeviceTypeText(device.type);
        const typeIcon = getDeviceTypeIcon(device.type);
        
        return `
            <tr>
                <td>
                    <input type="checkbox" class="monitoring-checkbox" value="${device.id}">
                </td>
                <td>
                    <div class="device-name-cell">
                        <i class="${typeIcon}"></i>
                        <span onclick="showMonitoringDetail('${device.id}')" class="link">${device.name}</span>
                    </div>
                </td>
                <td>
                    <span class="type-badge ${device.type}">${typeText}</span>
                </td>
                <td>${device.location}</td>
                <td>
                    <span class="badge badge-${statusClass}">${statusText}</span>
                </td>
                <td>${device.resolution}</td>
                <td>
                    <span class="recording-status ${device.recording ? 'active' : 'inactive'}">
                        <i class="fas fa-${device.recording ? 'record-vinyl' : 'stop-circle'}"></i>
                        ${device.recording ? '录制中' : '未录制'}
                    </span>
                </td>
                <td>${formatTimeAgo(device.lastActive)}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-xs" onclick="showLivePreview('${device.id}')" data-tooltip="实时预览">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon btn-xs" onclick="toggleRecording('${device.id}')" data-tooltip="${device.recording ? '停止录制' : '开始录制'}">
                            <i class="fas fa-${device.recording ? 'stop' : 'play'}"></i>
                        </button>
                        <button class="btn-icon btn-xs" onclick="editMonitoringDevice('${device.id}')" data-tooltip="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon btn-xs" onclick="deleteMonitoringDevice('${device.id}')" data-tooltip="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // 更新分页信息
    updateMonitoringPaginationInfo();
    
    console.log('📹 渲染监控设备表格完成');
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
 * 获取设备状态样式类
 */
function getStatusClass(status) {
    const classes = {
        online: 'success',
        offline: 'secondary',
        alert: 'warning'
    };
    return classes[status] || 'secondary';
}

/**
 * 获取设备状态文本
 */
function getStatusText(status) {
    const texts = {
        online: '在线',
        offline: '离线',
        alert: '告警'
    };
    return texts[status] || '未知';
}

/**
 * 获取设备类型文本
 */
function getDeviceTypeText(type) {
    const texts = {
        camera: '网络摄像头',
        drone: '无人机',
        satellite: '卫星图像',
        thermal: '热成像仪'
    };
    return texts[type] || '未知';
}

/**
 * 获取设备类型图标
 */
function getDeviceTypeIcon(type) {
    const icons = {
        camera: 'fas fa-video',
        drone: 'fas fa-helicopter',
        satellite: 'fas fa-satellite',
        thermal: 'fas fa-thermometer-half'
    };
    return icons[type] || 'fas fa-video';
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
function updateMonitoringPaginationInfo() {
    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, totalRecords);
    
    updateElement('monitoringPageStart', startIndex);
    updateElement('monitoringPageEnd', endIndex);
    updateElement('totalMonitoringRecords', totalRecords);
}

// ===== 事件绑定 =====

/**
 * 绑定监控设备管理事件
 */
function bindMonitoringEvents() {
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
 * 刷新监控设备
 */
function refreshMonitoringDevices() {
    showNotification('正在刷新监控设备...', 'info');
    
    // 模拟数据刷新
    setTimeout(() => {
        generateMockMonitoringData();
        renderMonitoringOverview();
        renderMonitoringGrid();
        renderMonitoringTable();
        updateDeviceStatusChart();
        updateMonitoringTrendChart();
        showNotification('监控设备已刷新', 'success');
    }, 1000);
}

/**
 * 批量控制
 */
function batchControl() {
    const selectedDevices = document.querySelectorAll('.monitoring-checkbox:checked');
    if (selectedDevices.length === 0) {
        showNotification('请先选择要控制的设备', 'warning');
        return;
    }
    
    showNotification(`已选择 ${selectedDevices.length} 个设备进行批量控制`, 'info');
}

/**
 * 显示添加监控设备模态框
 */
function showAddMonitoringModal() {
    const modal = document.getElementById('addMonitoringModal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * 关闭添加监控设备模态框
 */
function closeAddMonitoringModal() {
    const modal = document.getElementById('addMonitoringModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 保存监控设备
 */
function saveMonitoringDevice() {
    const form = document.getElementById('addMonitoringForm');
    
    // 验证表单
    const deviceName = document.getElementById('deviceName').value;
    const deviceType = document.getElementById('deviceType').value;
    const location = document.getElementById('location').value;
    const area = document.getElementById('area').value;
    
    if (!deviceName || !deviceType || !location || !area) {
        showNotification('请填写必填字段', 'warning');
        return;
    }
    
    showNotification('正在保存监控设备...', 'info');
    
    // 模拟保存过程
    setTimeout(() => {
        const newDevice = {
            id: 'dev_' + Date.now(),
            name: deviceName,
            type: deviceType,
            ip: document.getElementById('deviceIP').value || '192.168.1.100',
            port: parseInt(document.getElementById('devicePort').value) || 8080,
            location: location,
            area: area,
            status: 'offline',
            resolution: document.getElementById('resolution').value || '1080p',
            frameRate: parseInt(document.getElementById('frameRate').value) || 25,
            recording: false,
            lastActive: new Date(),
            coordinates: {
                lat: parseFloat(document.getElementById('latitude').value) || 0,
                lng: parseFloat(document.getElementById('longitude').value) || 0
            },
            features: [],
            description: document.getElementById('deviceDescription').value || ''
        };
        
        monitoringData.devices.unshift(newDevice);
        totalRecords = monitoringData.devices.length;
        
        renderMonitoringTable();
        renderMonitoringGrid();
        closeAddMonitoringModal();
        showNotification('监控设备保存成功', 'success');
    }, 2000);
}

/**
 * 测试连接
 */
function testConnection() {
    const ip = document.getElementById('deviceIP').value;
    const port = document.getElementById('devicePort').value;
    
    if (!ip || !port) {
        showNotification('请先填写IP地址和端口号', 'warning');
        return;
    }
    
    showNotification('正在测试设备连接...', 'info');
    
    setTimeout(() => {
        const success = Math.random() > 0.3; // 70%成功率
        if (success) {
            showNotification('设备连接测试成功', 'success');
        } else {
            showNotification('设备连接测试失败，请检查网络设置', 'error');
        }
    }, 2000);
}

/**
 * 获取设备位置
 */
function getDeviceLocation() {
    showNotification('正在获取设备位置...', 'info');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
                document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
                showNotification('位置获取成功', 'success');
            },
            function(error) {
                showNotification('位置获取失败，请手动输入坐标', 'warning');
            }
        );
    } else {
        showNotification('浏览器不支持定位功能', 'warning');
    }
}

/**
 * 显示监控设备详情
 */
function showMonitoringDetail(deviceId) {
    const device = monitoringData.devices.find(d => d.id === deviceId);
    if (!device) return;
    
    const modal = document.getElementById('monitoringDetailModal');
    const content = document.getElementById('monitoringDetailContent');
    
    if (modal && content) {
        content.innerHTML = `
            <div class="monitoring-detail-layout">
                <div class="device-preview">
                    <div class="preview-header">
                        <h4>实时画面</h4>
                        <div class="preview-controls">
                            <button class="btn-sm" onclick="captureSnapshot('${device.id}')">
                                <i class="fas fa-camera"></i> 截图
                            </button>
                            <button class="btn-sm" onclick="toggleRecording('${device.id}')">
                                <i class="fas fa-${device.recording ? 'stop' : 'play'}"></i> 
                                ${device.recording ? '停止录制' : '开始录制'}
                            </button>
                        </div>
                    </div>
                    <div class="preview-container">
                        <div class="video-placeholder large">
                            <i class="fas fa-play-circle"></i>
                            <p>点击播放实时视频流</p>
                            <small>${device.resolution} | ${device.frameRate}fps</small>
                        </div>
                    </div>
                </div>
                
                <div class="device-info-panel">
                    <div class="info-section">
                        <h4>基本信息</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>设备名称:</label>
                                <span>${device.name}</span>
                            </div>
                            <div class="info-item">
                                <label>设备类型:</label>
                                <span>${getDeviceTypeText(device.type)}</span>
                            </div>
                            <div class="info-item">
                                <label>IP地址:</label>
                                <span>${device.ip}:${device.port}</span>
                            </div>
                            <div class="info-item">
                                <label>安装位置:</label>
                                <span>${device.location}</span>
                            </div>
                            <div class="info-item">
                                <label>所属区域:</label>
                                <span>${device.area}</span>
                            </div>
                            <div class="info-item">
                                <label>设备状态:</label>
                                <span class="badge badge-${getStatusClass(device.status)}">${getStatusText(device.status)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>技术参数</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>分辨率:</label>
                                <span>${device.resolution}</span>
                            </div>
                            <div class="info-item">
                                <label>帧率:</label>
                                <span>${device.frameRate} fps</span>
                            </div>
                            <div class="info-item">
                                <label>录制状态:</label>
                                <span class="recording-status ${device.recording ? 'active' : 'inactive'}">
                                    <i class="fas fa-${device.recording ? 'record-vinyl' : 'stop-circle'}"></i>
                                    ${device.recording ? '录制中' : '未录制'}
                                </span>
                            </div>
                            <div class="info-item">
                                <label>最后活动:</label>
                                <span>${formatTimeAgo(device.lastActive)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>功能特性</h4>
                        <div class="features-list">
                            ${device.features.map(feature => {
                                const featureNames = {
                                    autoRecord: '自动录制',
                                    motionDetection: '运动检测',
                                    nightVision: '夜视功能',
                                    audioRecord: '音频录制'
                                };
                                return `<span class="feature-tag">${featureNames[feature] || feature}</span>`;
                            }).join('')}
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>位置信息</h4>
                        <div class="info-grid">
                            <div class="info-item">
                                <label>纬度:</label>
                                <span>${device.coordinates.lat.toFixed(6)}</span>
                            </div>
                            <div class="info-item">
                                <label>经度:</label>
                                <span>${device.coordinates.lng.toFixed(6)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="info-section">
                        <h4>设备描述</h4>
                        <p>${device.description || '暂无描述'}</p>
                    </div>
                </div>
            </div>
        `;
        modal.classList.add('show');
    }
}

/**
 * 关闭监控设备详情模态框
 */
function closeMonitoringDetailModal() {
    const modal = document.getElementById('monitoringDetailModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 显示实时预览
 */
function showLivePreview(deviceId) {
    const device = monitoringData.devices.find(d => d.id === deviceId);
    if (!device) return;
    
    const modal = document.getElementById('livePreviewModal');
    const title = document.getElementById('previewTitle');
    const container = document.getElementById('livePreviewContainer');
    
    if (modal && title && container) {
        title.textContent = `实时预览 - ${device.name}`;
        
        container.innerHTML = `
            <div class="live-stream-container">
                <div class="stream-placeholder">
                    <i class="fas fa-video"></i>
                    <h3>正在连接视频流...</h3>
                    <p>设备: ${device.name}</p>
                    <p>分辨率: ${device.resolution} | 帧率: ${device.frameRate}fps</p>
                    <div class="stream-status">
                        <span class="status-dot ${getStatusClass(device.status)}"></span>
                        <span>${getStatusText(device.status)}</span>
                    </div>
                </div>
            </div>
            <div class="stream-controls">
                <div class="control-buttons">
                    <button class="stream-btn" onclick="zoomIn()" data-tooltip="放大">
                        <i class="fas fa-search-plus"></i>
                    </button>
                    <button class="stream-btn" onclick="zoomOut()" data-tooltip="缩小">
                        <i class="fas fa-search-minus"></i>
                    </button>
                    <button class="stream-btn" onclick="moveUp()" data-tooltip="向上">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="stream-btn" onclick="moveDown()" data-tooltip="向下">
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="stream-btn" onclick="moveLeft()" data-tooltip="向左">
                        <i class="fas fa-arrow-left"></i>
                    </button>
                    <button class="stream-btn" onclick="moveRight()" data-tooltip="向右">
                        <i class="fas fa-arrow-right"></i>
                    </button>
                </div>
                <div class="stream-info">
                    <span>码率: 2.5 Mbps</span>
                    <span>延迟: 120ms</span>
                    <span>丢包率: 0.1%</span>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
        
        // 模拟视频流连接
        setTimeout(() => {
            const placeholder = container.querySelector('.stream-placeholder');
            if (placeholder) {
                placeholder.innerHTML = `
                    <div class="live-video">
                        <div class="video-overlay">
                            <div class="video-info">
                                <span class="device-name">${device.name}</span>
                                <span class="timestamp">${new Date().toLocaleString()}</span>
                            </div>
                            <div class="recording-indicator ${device.recording ? 'active' : ''}">
                                <i class="fas fa-record-vinyl"></i>
                                ${device.recording ? 'REC' : ''}
                            </div>
                        </div>
                        <div class="video-content">
                            <p>模拟实时视频画面</p>
                            <small>${device.resolution} @ ${device.frameRate}fps</small>
                        </div>
                    </div>
                `;
            }
        }, 2000);
    }
}

/**
 * 关闭实时预览模态框
 */
function closeLivePreviewModal() {
    const modal = document.getElementById('livePreviewModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 切换录制状态
 */
function toggleRecording(deviceId) {
    const device = monitoringData.devices.find(d => d.id === deviceId);
    if (!device) return;
    
    device.recording = !device.recording;
    const action = device.recording ? '开始' : '停止';
    
    renderMonitoringGrid();
    renderMonitoringTable();
    showNotification(`${device.name} ${action}录制`, 'success');
}

/**
 * 截图
 */
function captureSnapshot(deviceId) {
    const device = monitoringData.devices.find(d => d.id === deviceId);
    if (device) {
        showNotification(`正在截取 ${device.name} 画面...`, 'info');
        
        setTimeout(() => {
            showNotification('截图保存成功', 'success');
        }, 1000);
    }
}

/**
 * 设备控制
 */
function showDeviceControls(deviceId) {
    showNotification('设备控制面板功能开发中...', 'info');
}

/**
 * 设置监控视图
 */
function setMonitoringView(viewType) {
    currentView = viewType;
    
    // 更新按钮状态
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
    
    const viewNames = {
        grid: '网格视图',
        list: '列表视图',
        map: '地图视图'
    };
    
    showNotification(`已切换到${viewNames[viewType]}`, 'info');
}

/**
 * 改变网格大小
 */
function changeGridSize() {
    const select = document.getElementById('gridSize');
    currentGridSize = parseInt(select.value);
    renderMonitoringGrid();
    
    const gridSizes = {
        4: '2×2',
        9: '3×3',
        16: '4×4',
        25: '5×5'
    };
    
    showNotification(`已切换到${gridSizes[currentGridSize]}网格`, 'info');
}

/**
 * 按状态筛选
 */
function filterByStatus() {
    const filter = document.getElementById('statusFilter').value;
    // 实际应用中会根据筛选条件重新渲染
    if (filter) {
        showNotification(`按状态筛选: ${getStatusText(filter)}`, 'info');
    } else {
        showNotification('显示所有状态设备', 'info');
    }
}

/**
 * 按区域筛选
 */
function filterByArea() {
    const filter = document.getElementById('areaFilter').value;
    const areaNames = {
        north: '北部片区',
        south: '南部片区',
        east: '东部片区',
        west: '西部片区',
        center: '中部片区'
    };
    
    if (filter) {
        showNotification(`按区域筛选: ${areaNames[filter]}`, 'info');
    } else {
        showNotification('显示所有区域设备', 'info');
    }
}

/**
 * 批量录制控制
 */
function startAllRecording() {
    showNotification('正在启动所有设备录制...', 'info');
    
    setTimeout(() => {
        monitoringData.devices.forEach(device => {
            if (device.status === 'online') {
                device.recording = true;
            }
        });
        
        renderMonitoringGrid();
        renderMonitoringTable();
        showNotification('所有在线设备已开始录制', 'success');
    }, 1000);
}

function stopAllRecording() {
    showNotification('正在停止所有设备录制...', 'info');
    
    setTimeout(() => {
        monitoringData.devices.forEach(device => {
            device.recording = false;
        });
        
        renderMonitoringGrid();
        renderMonitoringTable();
        showNotification('所有设备已停止录制', 'success');
    }, 1000);
}

function captureAll() {
    const onlineDevices = monitoringData.devices.filter(d => d.status === 'online');
    showNotification(`正在对 ${onlineDevices.length} 个在线设备进行批量截图...`, 'info');
    
    setTimeout(() => {
        showNotification('批量截图完成', 'success');
    }, 2000);
}

/**
 * 视频流控制函数
 */
function captureFrame() {
    showNotification('截图已保存', 'success');
}

function toggleRecording() {
    showNotification('录制状态已切换', 'info');
}

function toggleFullscreen() {
    const modal = document.getElementById('livePreviewModal');
    if (modal) {
        if (modal.classList.contains('fullscreen-active')) {
            modal.classList.remove('fullscreen-active');
        } else {
            modal.classList.add('fullscreen-active');
        }
    }
}

// 摄像头控制函数
function zoomIn() { showNotification('放大', 'info'); }
function zoomOut() { showNotification('缩小', 'info'); }
function moveUp() { showNotification('向上移动', 'info'); }
function moveDown() { showNotification('向下移动', 'info'); }
function moveLeft() { showNotification('向左移动', 'info'); }
function moveRight() { showNotification('向右移动', 'info'); }

/**
 * 图表控制函数
 */
function refreshStatusChart() {
    updateDeviceStatusChart();
    showNotification('状态图表已刷新', 'info');
}

function exportChart(chartType) {
    showNotification(`正在导出${chartType}图表...`, 'info');
}

function setTimeRange(range) {
    // 更新时间范围按钮状态
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    updateMonitoringTrendChart();
    
    const rangeNames = {
        '24h': '24小时',
        '7d': '7天',
        '30d': '30天'
    };
    
    showNotification(`已切换到${rangeNames[range]}视图`, 'info');
}

/**
 * 搜索设备
 */
function searchDevices() {
    const searchTerm = document.getElementById('deviceSearch').value;
    if (searchTerm) {
        showNotification(`搜索: ${searchTerm}`, 'info');
    }
}

/**
 * 切换全选
 */
function toggleSelectAllMonitoring() {
    const selectAll = document.getElementById('selectAllMonitoring');
    const checkboxes = document.querySelectorAll('.monitoring-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
    });
}

/**
 * 编辑监控设备
 */
function editMonitoringDevice(deviceId) {
    showNotification('编辑设备功能开发中...', 'info');
}

/**
 * 删除监控设备
 */
function deleteMonitoringDevice(deviceId) {
    const device = monitoringData.devices.find(d => d.id === deviceId);
    if (device) {
        showConfirm(`确定要删除设备 "${device.name}" 吗？`, () => {
            const index = monitoringData.devices.findIndex(d => d.id === deviceId);
            if (index > -1) {
                monitoringData.devices.splice(index, 1);
                totalRecords = monitoringData.devices.length;
                renderMonitoringTable();
                renderMonitoringGrid();
                showNotification('设备删除成功', 'success');
            }
        });
    }
}

/**
 * 控制设备
 */
function controlDevice() {
    showNotification('设备控制功能开发中...', 'info');
}

// ===== 分页函数 =====

/**
 * 切换页面
 */
function changeMonitoringPage(action) {
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
    
    renderMonitoringTable();
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
 
 
 
 
 
 
 
 
 