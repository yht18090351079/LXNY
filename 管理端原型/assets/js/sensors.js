/**
 * 农情遥感系统管理端 - 传感器管理功能
 * 功能：传感器设备监控、配置管理、数据采集等
 */

// ===== 全局变量 =====
let currentPage = 1;
let pageSize = 20;
let totalRecords = 156;
let currentSort = { field: 'lastUpdate', order: 'desc' };
let selectedRows = new Set();
let sensorDevices = [];
let filteredDevices = [];
let sensorTypes = [];
let charts = {};
let monitorView = 'grid';

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeSensorPage();
});

/**
 * 页面初始化
 */
function initializeSensorPage() {
    console.log('🌡️ 初始化传感器管理页面...');
    
    // 生成模拟数据
    generateMockData();
    
    // 初始化图表
    initializeCharts();
    
    // 渲染页面内容
    renderDeviceOverview();
    renderSensorDistribution();
    renderDeviceMonitor();
    renderDeviceTable();
    
    // 绑定事件
    bindEvents();
    
    // 开始实时更新
    startRealTimeUpdate();
    
    console.log('✅ 传感器管理页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟数据
 */
function generateMockData() {
    // 传感器类型定义
    sensorTypes = [
        { id: 'temperature', name: '温度传感器', icon: 'fas fa-thermometer-half', color: '#FF6B35', unit: '°C' },
        { id: 'humidity', name: '湿度传感器', icon: 'fas fa-tint', color: '#2196F3', unit: '%' },
        { id: 'soil', name: '土壤传感器', icon: 'fas fa-seedling', color: '#795548', unit: '%' },
        { id: 'light', name: '光照传感器', icon: 'fas fa-sun', color: '#FFC107', unit: 'lux' },
        { id: 'ph', name: 'pH传感器', icon: 'fas fa-flask', color: '#9C27B0', unit: 'pH' },
        { id: 'co2', name: 'CO2传感器', icon: 'fas fa-smog', color: '#607D8B', unit: 'ppm' }
    ];
    
    const areas = [
        { id: 'field_a', name: 'A区农田' },
        { id: 'field_b', name: 'B区农田' },
        { id: 'field_c', name: 'C区农田' },
        { id: 'greenhouse', name: '温室大棚' }
    ];
    
    const statuses = ['online', 'offline', 'alert', 'maintenance'];
    const statusWeights = [0.75, 0.1, 0.1, 0.05]; // 在线率75%
    
    const transmissionTypes = ['wifi', '4g', 'lora', 'ethernet'];
    const brands = ['海康威视', '大华股份', '华为', '中兴通讯', '研华科技'];
    
    sensorDevices = [];
    
    for (let i = 0; i < totalRecords; i++) {
        const sensorType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)];
        const area = areas[Math.floor(Math.random() * areas.length)];
        const status = getRandomByWeight(statuses, statusWeights);
        
        // 根据传感器类型生成合理的数值范围
        let currentValue, minValue, maxValue;
        switch(sensorType.id) {
            case 'temperature':
                currentValue = Math.random() * 30 + 10; // 10-40°C
                minValue = 0;
                maxValue = 50;
                break;
            case 'humidity':
                currentValue = Math.random() * 40 + 40; // 40-80%
                minValue = 0;
                maxValue = 100;
                break;
            case 'soil':
                currentValue = Math.random() * 30 + 30; // 30-60%
                minValue = 0;
                maxValue = 100;
                break;
            case 'light':
                currentValue = Math.random() * 50000 + 10000; // 10000-60000 lux
                minValue = 0;
                maxValue = 100000;
                break;
            case 'ph':
                currentValue = Math.random() * 4 + 6; // 6-10 pH
                minValue = 0;
                maxValue = 14;
                break;
            case 'co2':
                currentValue = Math.random() * 800 + 400; // 400-1200 ppm
                minValue = 0;
                maxValue = 2000;
                break;
            default:
                currentValue = Math.random() * 100;
                minValue = 0;
                maxValue = 100;
        }
        
        const device = {
            id: `sensor_${String(i + 1).padStart(4, '0')}`,
            deviceId: `${sensorType.id.toUpperCase()}-${String(i + 1).padStart(4, '0')}`,
            deviceName: `${sensorType.name}-${i + 1}`,
            deviceType: sensorType.id,
            typeName: sensorType.name,
            icon: sensorType.icon,
            color: sensorType.color,
            unit: sensorType.unit,
            area: area.id,
            areaName: area.name,
            location: `${area.name} ${Math.floor(Math.random() * 10 + 1)}号点位`,
            coordinates: {
                longitude: 103.1 + Math.random() * 0.2,
                latitude: 35.5 + Math.random() * 0.2
            },
            status: status,
            currentValue: currentValue,
            minValue: minValue,
            maxValue: maxValue,
            battery: Math.floor(Math.random() * 50 + 50), // 50-100%
            signalStrength: Math.floor(Math.random() * 40 + 60), // 60-100%
            lastUpdate: new Date(Date.now() - Math.random() * 3600000), // 过去1小时内
            installDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            brand: brands[Math.floor(Math.random() * brands.length)],
            model: `Model-${Math.floor(Math.random() * 900 + 100)}`,
            transmissionType: transmissionTypes[Math.floor(Math.random() * transmissionTypes.length)],
            dataFrequency: [1, 5, 10, 30, 60][Math.floor(Math.random() * 5)], // 分钟
            description: `${sensorType.name}设备，用于监测${area.name}的环境参数`
        };
        
        // 生成历史数据（用于图表显示）
        device.historyData = generateHistoryData(sensorType.id, 24); // 24小时数据
        
        sensorDevices.push(device);
    }
    
    // 按最后更新时间排序
    sensorDevices.sort((a, b) => b.lastUpdate - a.lastUpdate);
    filteredDevices = [...sensorDevices];
    
    console.log(`📊 生成了 ${sensorDevices.length} 个传感器设备`);
    console.log(`📈 包含 ${sensorTypes.length} 种传感器类型`);
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
 * 生成历史数据
 */
function generateHistoryData(sensorType, hours) {
    const data = [];
    const now = new Date();
    
    for (let i = hours - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        let value;
        
        // 根据传感器类型和时间生成合理的变化趋势
        const hour = time.getHours();
        switch(sensorType) {
            case 'temperature':
                // 温度随时间变化，白天高晚上低
                value = 20 + 10 * Math.sin((hour - 6) * Math.PI / 12) + (Math.random() - 0.5) * 4;
                break;
            case 'humidity':
                // 湿度与温度相反，早晚高中午低
                value = 60 - 15 * Math.sin((hour - 6) * Math.PI / 12) + (Math.random() - 0.5) * 10;
                break;
            case 'light':
                // 光照强度白天高夜晚低
                if (hour >= 6 && hour <= 18) {
                    value = 20000 + 30000 * Math.sin((hour - 6) * Math.PI / 12) + Math.random() * 5000;
                } else {
                    value = Math.random() * 1000;
                }
                break;
            case 'soil':
                // 土壤湿度变化较缓慢
                value = 45 + Math.sin(hour * Math.PI / 12) * 5 + (Math.random() - 0.5) * 3;
                break;
            case 'ph':
                // pH值变化很小
                value = 7.2 + (Math.random() - 0.5) * 0.6;
                break;
            case 'co2':
                // CO2浓度白天低夜晚高（植物光合作用）
                value = 600 - 200 * Math.sin((hour - 6) * Math.PI / 12) + (Math.random() - 0.5) * 100;
                break;
            default:
                value = 50 + Math.random() * 20;
        }
        
        data.push({
            time: time,
            value: Math.max(0, value)
        });
    }
    
    return data;
}

// ===== 图表初始化 =====

/**
 * 初始化图表
 */
function initializeCharts() {
    initializeSensorDistributionChart();
}

/**
 * 初始化传感器分布图表
 */
function initializeSensorDistributionChart() {
    const chartDom = document.getElementById('sensorDistributionChart');
    if (!chartDom) return;
    
    charts.sensorDistribution = echarts.init(chartDom);
    updateSensorDistributionChart();
}

/**
 * 更新传感器分布图表
 */
function updateSensorDistributionChart() {
    if (!charts.sensorDistribution) return;
    
    // 统计各类型传感器数量
    const typeStats = {};
    sensorTypes.forEach(type => {
        typeStats[type.id] = {
            name: type.name,
            count: 0,
            online: 0,
            color: type.color
        };
    });
    
    filteredDevices.forEach(device => {
        if (typeStats[device.deviceType]) {
            typeStats[device.deviceType].count++;
            if (device.status === 'online') {
                typeStats[device.deviceType].online++;
            }
        }
    });
    
    // 准备图表数据
    const data = Object.keys(typeStats).map(typeId => ({
        name: typeStats[typeId].name,
        value: typeStats[typeId].count,
        itemStyle: {
            color: typeStats[typeId].color
        }
    })).filter(item => item.value > 0);
    
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
                const typeId = Object.keys(typeStats).find(id => 
                    typeStats[id].name === params.name
                );
                const stats = typeStats[typeId];
                
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${params.name}</div>
                    <div style="display: flex; align-items: center; margin-bottom: 4px;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">设备总数:</span>
                        <span style="font-weight: bold;">${params.value} 台</span>
                    </div>
                    <div style="margin-bottom: 4px;">
                        <span style="margin-right: 16px;">在线设备:</span>
                        <span style="font-weight: bold; color: #4CAF50;">${stats.online} 台</span>
                    </div>
                    <div style="color: #ccc; font-size: 11px;">
                        占比: ${params.percent}%
                    </div>
                `;
            }
        },
        legend: {
            show: false
        },
        series: [
            {
                name: '传感器类型',
                type: 'pie',
                radius: ['50%', '80%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 8,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: true,
                    position: 'outside',
                    formatter: '{b}\n{c}台 ({d}%)',
                    fontSize: 11,
                    fontWeight: 'bold'
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
    
    charts.sensorDistribution.setOption(option);
    
    // 更新图例
    updateSensorLegend(typeStats);
}

/**
 * 更新传感器图例
 */
function updateSensorLegend(typeStats) {
    const legendEl = document.getElementById('sensorLegend');
    if (!legendEl) return;
    
    legendEl.innerHTML = Object.keys(typeStats).map(typeId => {
        const stats = typeStats[typeId];
        if (stats.count === 0) return '';
        
        const onlineRate = stats.count > 0 ? (stats.online / stats.count * 100).toFixed(1) : 0;
        
        return `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${stats.color}"></div>
                <div class="legend-content">
                    <div class="legend-name">${stats.name}</div>
                    <div class="legend-stats">
                        <span>总数: ${stats.count}</span>
                        <span>在线: ${stats.online}</span>
                        <span>在线率: ${onlineRate}%</span>
                    </div>
                </div>
            </div>
        `;
    }).filter(Boolean).join('');
}

// ===== 页面渲染 =====

/**
 * 渲染设备概览
 */
function renderDeviceOverview() {
    const totalDevices = filteredDevices.length;
    const onlineDevices = filteredDevices.filter(d => d.status === 'online').length;
    const alertDevices = filteredDevices.filter(d => d.status === 'alert').length;
    const maintenanceDevices = filteredDevices.filter(d => d.status === 'maintenance').length;
    
    // 更新统计数值
    const totalEl = document.getElementById('totalDevices');
    const onlineEl = document.getElementById('onlineDevices');
    const alertEl = document.getElementById('alertDevices');
    const maintenanceEl = document.getElementById('maintenanceDevices');
    
    if (totalEl) animateCountUp(totalEl, totalDevices, 1000);
    if (onlineEl) animateCountUp(onlineEl, onlineDevices, 1000);
    if (alertEl) animateCountUp(alertEl, alertDevices, 800);
    if (maintenanceEl) animateCountUp(maintenanceEl, maintenanceDevices, 800);
}

/**
 * 渲染传感器分布
 */
function renderSensorDistribution() {
    updateSensorDistributionChart();
}

/**
 * 渲染设备监控
 */
function renderDeviceMonitor() {
    const deviceGrid = document.getElementById('deviceGrid');
    if (!deviceGrid) return;
    
    if (monitorView === 'grid') {
        renderDeviceGrid();
    } else if (monitorView === 'map') {
        renderDeviceMap();
    }
}

/**
 * 渲染设备网格
 */
function renderDeviceGrid() {
    const deviceGrid = document.getElementById('deviceGrid');
    if (!deviceGrid) return;
    
    // 只显示前20个设备（避免页面过于复杂）
    const displayDevices = filteredDevices.slice(0, 20);
    
    deviceGrid.innerHTML = displayDevices.map(device => {
        const statusText = {
            online: '在线',
            offline: '离线',
            alert: '告警',
            maintenance: '维护'
        }[device.status];
        
        const timeDiff = Math.floor((Date.now() - device.lastUpdate) / 60000); // 分钟
        const timeText = timeDiff < 1 ? '刚刚' : `${timeDiff}分钟前`;
        
        return `
            <div class="device-card ${device.status}">
                <div class="device-header">
                    <div class="device-info">
                        <h4>${device.deviceName}</h4>
                        <div class="device-id">${device.deviceId}</div>
                    </div>
                    <div class="device-status ${device.status}">
                        <span class="status-dot"></span>
                        ${statusText}
                    </div>
                </div>
                
                <div class="device-metrics">
                    <div class="metric-item">
                        <span class="metric-value">${device.currentValue.toFixed(1)}</span>
                        <span class="metric-label">当前值 (${device.unit})</span>
                    </div>
                    <div class="metric-item">
                        <span class="metric-value">${device.battery}%</span>
                        <span class="metric-label">电池电量</span>
                    </div>
                </div>
                
                <div class="device-location">
                    <i class="fas fa-map-marker-alt"></i>
                    ${device.location}
                </div>
                
                <div class="device-actions">
                    <button class="device-btn view" onclick="viewDeviceDetails('${device.id}')" 
                            data-tooltip="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="device-btn config" onclick="configDevice('${device.id}')"
                            data-tooltip="设备配置">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="device-btn maintenance" onclick="maintenanceDevice('${device.id}')"
                            data-tooltip="设备维护">
                        <i class="fas fa-tools"></i>
                    </button>
                    <button class="device-btn restart" onclick="restartDevice('${device.id}')"
                            data-tooltip="重启设备">
                        <i class="fas fa-power-off"></i>
                    </button>
                </div>
                
                <div class="device-footer">
                    <small class="update-time">最后更新: ${timeText}</small>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染设备地图
 */
function renderDeviceMap() {
    const deviceGrid = document.getElementById('deviceGrid');
    if (!deviceGrid) return;
    
    deviceGrid.innerHTML = `
        <div class="device-map">
            <i class="fas fa-map-marked-alt" style="font-size: 48px; margin-bottom: 16px;"></i>
            <div>设备地图视图开发中...</div>
            <div style="margin-top: 8px; font-size: 14px;">将显示所有传感器设备的地理位置分布</div>
        </div>
    `;
}

/**
 * 渲染设备表格
 */
function renderDeviceTable() {
    const tbody = document.getElementById('deviceTableBody');
    if (!tbody) return;
    
    // 计算当前页的数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredDevices.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>暂无设备</h3>
                        <p>当前筛选条件下没有找到匹配的传感器设备</p>
                    </div>
                </td>
            </tr>
        `;
        updatePaginationInfo(0, 0, 0);
        return;
    }
    
    tbody.innerHTML = pageData.map(device => {
        const statusText = {
            online: '在线',
            offline: '离线',
            alert: '告警',
            maintenance: '维护'
        }[device.status];
        
        const timeDiff = Math.floor((Date.now() - device.lastUpdate) / 60000);
        const timeText = timeDiff < 1 ? '刚刚' : `${timeDiff}分钟前`;
        
        const batteryLevel = device.battery > 60 ? 'high' : device.battery > 30 ? 'medium' : 'low';
        
        return `
            <tr ${selectedRows.has(device.id) ? 'class="selected"' : ''}>
                <td>
                    <input type="checkbox" ${selectedRows.has(device.id) ? 'checked' : ''} 
                           onchange="toggleRowSelection('${device.id}')">
                </td>
                <td>
                    <div class="device-id-cell">
                        <strong>${device.deviceId}</strong>
                    </div>
                </td>
                <td class="device-name">${device.deviceName}</td>
                <td>
                    <span class="device-type-badge ${device.deviceType}">
                        <i class="${device.icon}"></i>
                        ${device.typeName}
                    </span>
                </td>
                <td>
                    <div class="location-cell">
                        <div class="location-area">${device.areaName}</div>
                        <div class="location-detail">${device.location}</div>
                    </div>
                </td>
                <td>
                    <span class="status-badge ${device.status}">${statusText}</span>
                </td>
                <td>
                    <div class="value-cell">
                        <span class="current-value">${device.currentValue.toFixed(1)}</span>
                        <span class="value-unit">${device.unit}</span>
                    </div>
                </td>
                <td>
                    <div class="update-time">${timeText}</div>
                </td>
                <td>
                    <div class="battery-indicator">
                        <div class="battery-bar">
                            <div class="battery-fill ${batteryLevel}" style="width: ${device.battery}%"></div>
                        </div>
                        <span class="battery-percent">${device.battery}%</span>
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="viewDeviceDetails('${device.id}')" 
                                data-tooltip="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn config" onclick="configDevice('${device.id}')"
                                data-tooltip="设备配置">
                            <i class="fas fa-cog"></i>
                        </button>
                        <button class="action-btn maintenance" onclick="maintenanceDevice('${device.id}')"
                                data-tooltip="设备维护">
                            <i class="fas fa-tools"></i>
                        </button>
                        <button class="action-btn delete" onclick="deleteDevice('${device.id}')"
                                data-tooltip="删除设备">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }).join('');
    
    // 更新分页信息
    updatePaginationInfo(startIndex + 1, Math.min(endIndex, filteredDevices.length), filteredDevices.length);
    updatePaginationControls();
    updateBatchActionButtons();
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
    const totalPages = Math.ceil(filteredDevices.length / pageSize);
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
        'batchConfigBtn',
        'batchMaintenanceBtn',
        'batchRestartBtn'
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
    const filters = ['deviceTypeFilter', 'statusFilter', 'areaFilter'];
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
 * 切换监控视图
 */
function switchMonitorView(viewType) {
    monitorView = viewType;
    
    // 更新按钮状态
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 渲染对应视图
    renderDeviceMonitor();
    
    const viewNames = {
        grid: '网格视图',
        list: '列表视图',
        map: '地图视图'
    };
    
    showNotification(`已切换到${viewNames[viewType]}`, 'success');
}

/**
 * 刷新传感器图表
 */
function refreshSensorChart() {
    updateSensorDistributionChart();
    showNotification('传感器分布图表已刷新', 'success');
}

/**
 * 导出传感器图表
 */
function exportSensorChart() {
    if (!charts.sensorDistribution) {
        showNotification('图表不存在', 'error');
        return;
    }
    
    const url = charts.sensorDistribution.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
    });
    
    const link = document.createElement('a');
    link.download = `sensor_distribution_${new Date().getTime()}.png`;
    link.href = url;
    link.click();
    
    showNotification('传感器分布图表已导出', 'success');
}

/**
 * 刷新监控数据
 */
function refreshMonitorData() {
    // 模拟数据更新
    filteredDevices.forEach(device => {
        // 随机更新部分设备的数值
        if (Math.random() < 0.3) {
            const variation = (Math.random() - 0.5) * 0.1;
            device.currentValue *= (1 + variation);
            device.currentValue = Math.max(device.minValue, Math.min(device.maxValue, device.currentValue));
            device.lastUpdate = new Date();
        }
    });
    
    renderDeviceMonitor();
    renderDeviceTable();
    renderDeviceOverview();
    
    showNotification('监控数据已刷新', 'success');
}

/**
 * 应用筛选
 */
function applyFilters() {
    const deviceType = document.getElementById('deviceTypeFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const area = document.getElementById('areaFilter')?.value || '';
    const searchText = document.querySelector('.search-input')?.value?.toLowerCase() || '';
    
    filteredDevices = sensorDevices.filter(device => {
        // 设备类型筛选
        if (deviceType && device.deviceType !== deviceType) {
            return false;
        }
        
        // 状态筛选
        if (status && device.status !== status) {
            return false;
        }
        
        // 区域筛选
        if (area && device.area !== area) {
            return false;
        }
        
        // 搜索文本筛选
        if (searchText) {
            const searchFields = [
                device.deviceName, 
                device.deviceId, 
                device.typeName,
                device.location,
                device.description
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
    
    renderDeviceTable();
    renderDeviceMonitor();
    renderDeviceOverview();
    updateSensorDistributionChart();
    
    const filterCount = [deviceType, status, area, searchText].filter(Boolean).length;
    if (filterCount > 0) {
        showNotification(`已应用 ${filterCount} 个筛选条件，找到 ${filteredDevices.length} 台设备`, 'info');
    }
}

/**
 * 清除筛选
 */
function clearFilters() {
    // 清除筛选器值
    const filterElements = [
        'deviceTypeFilter',
        'statusFilter',
        'areaFilter'
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    // 清除搜索框
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    // 重置数据
    filteredDevices = [...sensorDevices];
    currentPage = 1;
    selectedRows.clear();
    
    renderDeviceTable();
    renderDeviceMonitor();
    renderDeviceOverview();
    updateSensorDistributionChart();
    
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
    filteredDevices.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (field === 'lastUpdate') {
            aVal = aVal.getTime();
            bVal = bVal.getTime();
        } else if (typeof aVal === 'number') {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
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
    renderDeviceTable();
    
    showNotification(`已按${getSortFieldName(field)}${currentSort.order === 'asc' ? '升序' : '降序'}排列`, 'success');
}

/**
 * 获取排序字段名称
 */
function getSortFieldName(field) {
    const fieldNames = {
        deviceId: '设备ID',
        deviceName: '设备名称',
        deviceType: '设备类型',
        location: '安装位置',
        status: '设备状态',
        value: '当前数值',
        lastUpdate: '最后更新',
        battery: '电池电量'
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
    
    renderDeviceTable();
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
        const pageData = filteredDevices.slice(startIndex, endIndex);
        
        pageData.forEach(device => {
            selectedRows.add(device.id);
        });
    }
    
    renderDeviceTable();
}

/**
 * 切换页面
 */
function changePage(action) {
    const totalPages = Math.ceil(filteredDevices.length / pageSize);
    
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
    renderDeviceTable();
}

// ===== 设备操作 =====

/**
 * 查看设备详情
 */
function viewDeviceDetails(id) {
    const device = sensorDevices.find(d => d.id === id);
    if (!device) {
        showNotification('设备不存在', 'error');
        return;
    }
    
    const statusText = {
        online: '在线',
        offline: '离线',
        alert: '告警',
        maintenance: '维护'
    }[device.status];
    
    const content = `
        <div class="device-detail-content">
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> 基本信息</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>设备ID:</label>
                        <span>${device.deviceId}</span>
                    </div>
                    <div class="detail-item">
                        <label>设备名称:</label>
                        <span>${device.deviceName}</span>
                    </div>
                    <div class="detail-item">
                        <label>设备类型:</label>
                        <span class="device-type-badge ${device.deviceType}">
                            <i class="${device.icon}"></i>
                            ${device.typeName}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>品牌型号:</label>
                        <span>${device.brand} ${device.model}</span>
                    </div>
                    <div class="detail-item">
                        <label>安装日期:</label>
                        <span>${device.installDate.toLocaleDateString('zh-CN')}</span>
                    </div>
                    <div class="detail-item">
                        <label>设备状态:</label>
                        <span class="status-badge ${device.status}">${statusText}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-map-marker-alt"></i> 位置信息</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>安装区域:</label>
                        <span>${device.areaName}</span>
                    </div>
                    <div class="detail-item">
                        <label>具体位置:</label>
                        <span>${device.location}</span>
                    </div>
                    <div class="detail-item">
                        <label>经度:</label>
                        <span>${device.coordinates.longitude.toFixed(6)}</span>
                    </div>
                    <div class="detail-item">
                        <label>纬度:</label>
                        <span>${device.coordinates.latitude.toFixed(6)}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-chart-line"></i> 当前数据</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>当前数值:</label>
                        <span style="font-weight: bold; color: var(--primary-color);">
                            ${device.currentValue.toFixed(2)} ${device.unit}
                        </span>
                    </div>
                    <div class="detail-item">
                        <label>数据范围:</label>
                        <span>${device.minValue} - ${device.maxValue} ${device.unit}</span>
                    </div>
                    <div class="detail-item">
                        <label>最后更新:</label>
                        <span>${device.lastUpdate.toLocaleString('zh-CN')}</span>
                    </div>
                    <div class="detail-item">
                        <label>采集频率:</label>
                        <span>每 ${device.dataFrequency} 分钟</span>
                    </div>
                </div>
                <div id="deviceDataChart" class="data-chart"></div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-cogs"></i> 技术参数</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <label>传输方式:</label>
                        <span>${device.transmissionType.toUpperCase()}</span>
                    </div>
                    <div class="detail-item">
                        <label>信号强度:</label>
                        <span>${device.signalStrength}%</span>
                    </div>
                    <div class="detail-item">
                        <label>电池电量:</label>
                        <span>${device.battery}%</span>
                    </div>
                    <div class="detail-item">
                        <label>设备描述:</label>
                        <span>${device.description}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal({
        title: `设备详情 - ${device.deviceName}`,
        content: content,
        actions: [
            { text: '编辑设备', class: 'btn-secondary', onclick: `editDevice('${id}'); closeModal();` },
            { text: '下载数据', class: 'btn-secondary', onclick: `downloadDeviceData('${id}'); closeModal();` },
            { text: '关闭', class: 'btn-primary', onclick: 'closeModal()' }
        ]
    });
    
    // 渲染设备数据图表
    setTimeout(() => {
        renderDeviceDataChart(device);
    }, 100);
}

/**
 * 渲染设备数据图表
 */
function renderDeviceDataChart(device) {
    const chartDom = document.getElementById('deviceDataChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const timeLabels = device.historyData.map(item => 
        item.time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    );
    const values = device.historyData.map(item => item.value.toFixed(2));
    
    const option = {
        title: {
            text: `过去24小时${device.typeName}数据`,
            textStyle: {
                fontSize: 14,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                const param = params[0];
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${param.axisValue}</div>
                    <div style="display: flex; align-items: center;">
                        <span style="margin-right: 16px;">${device.typeName}:</span>
                        <span style="font-weight: bold;">${param.value} ${device.unit}</span>
                    </div>
                `;
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
            data: timeLabels,
            axisLabel: {
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            name: device.unit,
            axisLabel: {
                fontSize: 10
            }
        },
        series: [
            {
                name: device.typeName,
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                lineStyle: {
                    width: 2,
                    color: device.color
                },
                itemStyle: {
                    color: device.color
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: device.color + '40' },
                            { offset: 1, color: device.color + '10' }
                        ]
                    }
                },
                data: values
            }
        ]
    };
    
    chart.setOption(option);
}

/**
 * 配置设备
 */
function configDevice(id) {
    const device = sensorDevices.find(d => d.id === id);
    if (!device) {
        showNotification('设备不存在', 'error');
        return;
    }
    
    showNotification(`配置设备: ${device.deviceName}`, 'info');
}

/**
 * 维护设备
 */
function maintenanceDevice(id) {
    const device = sensorDevices.find(d => d.id === id);
    if (!device) {
        showNotification('设备不存在', 'error');
        return;
    }
    
    showConfirm(`确定要将设备 "${device.deviceName}" 设置为维护状态吗？`, () => {
        device.status = 'maintenance';
        renderDeviceTable();
        renderDeviceMonitor();
        renderDeviceOverview();
        showNotification(`设备 ${device.deviceName} 已设置为维护状态`, 'success');
    });
}

/**
 * 重启设备
 */
function restartDevice(id) {
    const device = sensorDevices.find(d => d.id === id);
    if (!device) {
        showNotification('设备不存在', 'error');
        return;
    }
    
    showConfirm(`确定要重启设备 "${device.deviceName}" 吗？`, () => {
        showNotification(`正在重启设备 ${device.deviceName}...`, 'info');
        
        // 模拟重启过程
        setTimeout(() => {
            device.status = 'online';
            device.lastUpdate = new Date();
            renderDeviceTable();
            renderDeviceMonitor();
            renderDeviceOverview();
            showNotification(`设备 ${device.deviceName} 重启完成`, 'success');
        }, 3000);
    });
}

/**
 * 删除设备
 */
function deleteDevice(id) {
    const device = sensorDevices.find(d => d.id === id);
    if (!device) {
        showNotification('设备不存在', 'error');
        return;
    }
    
    showConfirm(`确定要删除设备 "${device.deviceName}" 吗？\n\n此操作不可撤销。`, () => {
        // 从数据中移除
        const index = sensorDevices.findIndex(d => d.id === id);
        if (index > -1) {
            sensorDevices.splice(index, 1);
        }
        
        const filteredIndex = filteredDevices.findIndex(d => d.id === id);
        if (filteredIndex > -1) {
            filteredDevices.splice(filteredIndex, 1);
        }
        
        selectedRows.delete(id);
        totalRecords = sensorDevices.length;
        
        renderDeviceTable();
        renderDeviceMonitor();
        renderDeviceOverview();
        updateSensorDistributionChart();
        
        showNotification(`设备 ${device.deviceName} 已删除`, 'success');
    });
}

// ===== 批量操作 =====

/**
 * 批量配置
 */
function batchConfigure() {
    if (selectedRows.size === 0) {
        showNotification('请先选择要配置的设备', 'warning');
        return;
    }
    
    showNotification(`批量配置 ${selectedRows.size} 台设备功能开发中...`, 'info');
}

/**
 * 批量维护
 */
function batchMaintenance() {
    if (selectedRows.size === 0) {
        showNotification('请先选择要维护的设备', 'warning');
        return;
    }
    
    showConfirm(`确定要将选中的 ${selectedRows.size} 台设备设置为维护状态吗？`, () => {
        let maintainedCount = 0;
        
        selectedRows.forEach(id => {
            const device = sensorDevices.find(d => d.id === id);
            if (device) {
                device.status = 'maintenance';
                maintainedCount++;
            }
        });
        
        selectedRows.clear();
        renderDeviceTable();
        renderDeviceMonitor();
        renderDeviceOverview();
        
        showNotification(`已将 ${maintainedCount} 台设备设置为维护状态`, 'success');
    });
}

/**
 * 批量重启
 */
function batchRestart() {
    if (selectedRows.size === 0) {
        showNotification('请先选择要重启的设备', 'warning');
        return;
    }
    
    showConfirm(`确定要重启选中的 ${selectedRows.size} 台设备吗？`, () => {
        showNotification(`正在批量重启 ${selectedRows.size} 台设备...`, 'info');
        
        // 模拟批量重启
        setTimeout(() => {
            let restartedCount = 0;
            
            selectedRows.forEach(id => {
                const device = sensorDevices.find(d => d.id === id);
                if (device) {
                    device.status = 'online';
                    device.lastUpdate = new Date();
                    restartedCount++;
                }
            });
            
            selectedRows.clear();
            renderDeviceTable();
            renderDeviceMonitor();
            renderDeviceOverview();
            
            showNotification(`${restartedCount} 台设备重启完成`, 'success');
        }, 5000);
    });
}

// ===== 其他功能 =====

/**
 * 显示设备地图
 */
function showDeviceMap() {
    showNotification('设备地图功能开发中...', 'info');
}

/**
 * 显示添加传感器模态框
 */
function showAddSensorModal() {
    const modal = document.getElementById('addSensorModal');
    if (modal) {
        modal.classList.add('show');
        
        // 生成设备ID
        const deviceIdInput = document.getElementById('deviceId');
        if (deviceIdInput) {
            const nextId = String(sensorDevices.length + 1).padStart(4, '0');
            deviceIdInput.value = `SENSOR-${nextId}`;
        }
    }
}

/**
 * 关闭添加传感器模态框
 */
function closeAddSensorModal() {
    const modal = document.getElementById('addSensorModal');
    if (modal) {
        modal.classList.remove('show');
        
        // 重置表单
        const form = document.getElementById('addSensorForm');
        if (form) {
            form.reset();
        }
    }
}

/**
 * 保存传感器设备
 */
function saveSensorDevice() {
    const form = document.getElementById('addSensorForm');
    if (!form) return;
    
    // 获取表单数据
    const formData = new FormData(form);
    const deviceData = {};
    
    // 验证必填字段
    const requiredFields = ['deviceName', 'deviceType', 'installArea'];
    let isValid = true;
    
    requiredFields.forEach(field => {
        const element = document.getElementById(field);
        if (!element || !element.value.trim()) {
            showNotification(`请填写${element?.previousElementSibling?.textContent || field}`, 'error');
            isValid = false;
        }
    });
    
    if (!isValid) return;
    
    // 创建新设备
    const deviceType = sensorTypes.find(t => t.id === document.getElementById('deviceType').value);
    const newDevice = {
        id: `sensor_${Date.now()}`,
        deviceId: document.getElementById('deviceId').value,
        deviceName: document.getElementById('deviceName').value,
        deviceType: deviceType.id,
        typeName: deviceType.name,
        icon: deviceType.icon,
        color: deviceType.color,
        unit: deviceType.unit,
        area: document.getElementById('installArea').value,
        areaName: document.querySelector(`#installArea option[value="${document.getElementById('installArea').value}"]`).textContent,
        location: document.getElementById('specificLocation').value || '待定位置',
        coordinates: {
            longitude: parseFloat(document.getElementById('longitude').value) || 103.1,
            latitude: parseFloat(document.getElementById('latitude').value) || 35.5
        },
        status: 'online',
        currentValue: Math.random() * 50 + 25,
        minValue: 0,
        maxValue: 100,
        battery: Math.floor(Math.random() * 30 + 70),
        signalStrength: Math.floor(Math.random() * 30 + 70),
        lastUpdate: new Date(),
        installDate: new Date(),
        brand: document.getElementById('deviceModel').value.split(' ')[0] || '未知品牌',
        model: document.getElementById('deviceModel').value || 'Unknown',
        transmissionType: document.getElementById('transmissionType').value,
        dataFrequency: parseInt(document.getElementById('dataFrequency').value),
        description: document.getElementById('deviceDescription').value || '新添加的传感器设备'
    };
    
    // 生成历史数据
    newDevice.historyData = generateHistoryData(deviceType.id, 24);
    
    // 添加到设备列表
    sensorDevices.unshift(newDevice);
    totalRecords = sensorDevices.length;
    
    // 重新应用筛选
    applyFilters();
    
    // 关闭模态框
    closeAddSensorModal();
    
    showNotification(`传感器设备 ${newDevice.deviceName} 添加成功`, 'success');
}

/**
 * 导出设备列表
 */
function exportDeviceList() {
    showNotification('设备列表导出功能开发中...', 'info');
}

/**
 * 打印设备列表
 */
function printDeviceList() {
    showNotification('设备列表打印功能开发中...', 'info');
}

/**
 * 编辑设备
 */
function editDevice() {
    showNotification('设备编辑功能开发中...', 'info');
}

/**
 * 下载设备数据
 */
function downloadDeviceData() {
    showNotification('设备数据下载功能开发中...', 'info');
}

// ===== 实时更新 =====

/**
 * 开始实时更新
 */
function startRealTimeUpdate() {
    // 每30秒更新一次设备数据
    setInterval(() => {
        // 随机更新部分设备状态
        filteredDevices.forEach(device => {
            if (Math.random() < 0.1) { // 10%概率更新
                const variation = (Math.random() - 0.5) * 0.1;
                device.currentValue *= (1 + variation);
                device.currentValue = Math.max(device.minValue, Math.min(device.maxValue, device.currentValue));
                device.lastUpdate = new Date();
                
                // 更新电池电量
                if (Math.random() < 0.05) { // 5%概率电池电量变化
                    device.battery = Math.max(0, device.battery - Math.random());
                }
            }
        });
        
        // 刷新显示
        if (monitorView === 'grid') {
            renderDeviceGrid();
        }
    }, 30000);
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
 
 
 
 
 
 
 
 
 