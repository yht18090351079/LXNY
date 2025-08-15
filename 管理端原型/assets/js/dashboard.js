/**
 * 农情遥感系统管理端 - 仪表板功能
 * 功能：数据可视化、统计图表、实时监控等
 */

// ===== 全局变量 =====
let charts = {};
let dataUpdateInterval = null;
let realTimeData = {
    dataUsage: [],
    deviceStatus: { online: 42, offline: 3, maintenance: 0 },
    systemPerformance: {
        cpu: [],
        memory: [],
        disk: []
    }
};

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

/**
 * 仪表板初始化
 */
function initializeDashboard() {
    console.log('🚀 初始化仪表板...');
    
    // 初始化图表
    initializeCharts();
    
    // 开始数据更新
    startDataUpdates();
    
    // 绑定事件
    bindEvents();
    
    // 加载初始数据
    loadInitialData();
    
    console.log('✅ 仪表板初始化完成');
}

// ===== 图表初始化 =====

/**
 * 初始化所有图表
 */
function initializeCharts() {
    initDataUsageTrend();
    initDeviceStatusChart();
    initSystemPerformanceChart();
}

/**
 * 初始化数据使用趋势图表
 */
function initDataUsageTrend() {
    const chartDom = document.getElementById('dataUsageTrend');
    if (!chartDom) return;
    
    charts.dataUsageTrend = echarts.init(chartDom);
    
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
            },
            formatter: function(params) {
                let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
                params.forEach(param => {
                    result += `
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
                            <span style="margin-right: 16px;">${param.seriesName}:</span>
                            <span style="font-weight: bold;">${param.value} MB</span>
                        </div>
                    `;
                });
                return result;
            }
        },
        legend: {
            data: ['遥感数据', '气象数据', '设备数据'],
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
            data: [],
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
            name: '数据量 (MB)',
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
                name: '遥感数据',
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
                data: []
            },
            {
                name: '气象数据',
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
                data: []
            },
            {
                name: '设备数据',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 3,
                    color: '#FF6B35'
                },
                itemStyle: {
                    color: '#FF6B35',
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                data: []
            }
        ]
    };
    
    charts.dataUsageTrend.setOption(option);
}

/**
 * 初始化设备状态分布图表
 */
function initDeviceStatusChart() {
    const chartDom = document.getElementById('deviceStatus');
    if (!chartDom) return;
    
    charts.deviceStatus = echarts.init(chartDom);
    
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
                    <div style="display: flex; align-items: center;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params.color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">设备数量:</span>
                        <span style="font-weight: bold;">${params.value} 台</span>
                    </div>
                    <div style="margin-top: 4px; color: #ccc; font-size: 11px;">
                        占比: ${params.percent}%
                    </div>
                `;
            }
        },
        legend: {
            orient: 'vertical',
            right: '8%',
            top: 'center',
            textStyle: {
                color: '#4A5568',
                fontSize: 12
            },
            formatter: function(name) {
                const data = realTimeData.deviceStatus;
                const value = data[name.toLowerCase().replace(' ', '')];
                return `${name}: ${value}台`;
            }
        },
        series: [
            {
                name: '设备状态',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['35%', '50%'],
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
                data: [
                    { 
                        value: 42, 
                        name: 'Online',
                        itemStyle: { color: '#4CAF50' }
                    },
                    { 
                        value: 3, 
                        name: 'Offline',
                        itemStyle: { color: '#F44336' }
                    },
                    { 
                        value: 0, 
                        name: 'Maintenance',
                        itemStyle: { color: '#FF9800' }
                    }
                ]
            }
        ]
    };
    
    charts.deviceStatus.setOption(option);
}

/**
 * 初始化系统性能监控图表
 */
function initSystemPerformanceChart() {
    const chartDom = document.getElementById('systemPerformance');
    if (!chartDom) return;
    
    charts.systemPerformance = echarts.init(chartDom);
    
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
            },
            formatter: function(params) {
                let result = `<div style="font-weight: bold; margin-bottom: 8px;">${params[0].axisValue}</div>`;
                params.forEach(param => {
                    result += `
                        <div style="display: flex; align-items: center; margin-bottom: 4px;">
                            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
                            <span style="margin-right: 16px;">${param.seriesName}:</span>
                            <span style="font-weight: bold;">${param.value}%</span>
                        </div>
                    `;
                });
                return result;
            }
        },
        legend: {
            data: ['CPU使用率', '内存使用率', '磁盘使用率'],
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
            data: [],
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
            min: 0,
            max: 100,
            name: '使用率 (%)',
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
                fontSize: 11,
                formatter: '{value}%'
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
                name: 'CPU使用率',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                lineStyle: {
                    width: 2,
                    color: '#2E7D32'
                },
                itemStyle: {
                    color: '#2E7D32'
                },
                data: []
            },
            {
                name: '内存使用率',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                lineStyle: {
                    width: 2,
                    color: '#2196F3'
                },
                itemStyle: {
                    color: '#2196F3'
                },
                data: []
            },
            {
                name: '磁盘使用率',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                lineStyle: {
                    width: 2,
                    color: '#FF6B35'
                },
                itemStyle: {
                    color: '#FF6B35'
                },
                data: []
            }
        ]
    };
    
    charts.systemPerformance.setOption(option);
}

// ===== 数据加载和更新 =====

/**
 * 加载初始数据
 */
function loadInitialData() {
    // 生成模拟的历史数据
    generateMockData();
    
    // 更新所有图表
    updateAllCharts();
    
    // 更新统计卡片
    updateStatCards();
}

/**
 * 生成模拟数据
 */
function generateMockData() {
    const now = new Date();
    const timeLabels = [];
    const dataUsage = {
        remote: [],
        weather: [],
        device: []
    };
    const performance = {
        cpu: [],
        memory: [],
        disk: []
    };
    
    // 生成过去24小时的数据
    for (let i = 23; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        timeLabels.push(time.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        }));
        
        // 数据使用量（模拟真实波动）
        dataUsage.remote.push(Math.floor(Math.random() * 50 + 100 + Math.sin(i * 0.5) * 20));
        dataUsage.weather.push(Math.floor(Math.random() * 30 + 50 + Math.cos(i * 0.3) * 15));
        dataUsage.device.push(Math.floor(Math.random() * 20 + 30 + Math.sin(i * 0.8) * 10));
        
        // 系统性能（模拟正常运行状态）
        performance.cpu.push(Math.floor(Math.random() * 20 + 15 + Math.sin(i * 0.2) * 10));
        performance.memory.push(Math.floor(Math.random() * 15 + 45 + Math.cos(i * 0.4) * 8));
        performance.disk.push(Math.floor(Math.random() * 5 + 25 + Math.sin(i * 0.1) * 3));
    }
    
    // 存储到全局变量
    realTimeData.timeLabels = timeLabels;
    realTimeData.dataUsage = dataUsage;
    realTimeData.systemPerformance = performance;
}

/**
 * 更新所有图表
 */
function updateAllCharts() {
    updateDataUsageTrend();
    updateDeviceStatusChart();
    updateSystemPerformanceChart();
}

/**
 * 更新数据使用趋势图表
 */
function updateDataUsageTrend() {
    if (!charts.dataUsageTrend) return;
    
    const option = {
        xAxis: {
            data: realTimeData.timeLabels
        },
        series: [
            {
                data: realTimeData.dataUsage.remote
            },
            {
                data: realTimeData.dataUsage.weather
            },
            {
                data: realTimeData.dataUsage.device
            }
        ]
    };
    
    charts.dataUsageTrend.setOption(option);
}

/**
 * 更新设备状态图表
 */
function updateDeviceStatusChart() {
    if (!charts.deviceStatus) return;
    
    const data = realTimeData.deviceStatus;
    const option = {
        series: [
            {
                data: [
                    { value: data.online, name: 'Online', itemStyle: { color: '#4CAF50' } },
                    { value: data.offline, name: 'Offline', itemStyle: { color: '#F44336' } },
                    { value: data.maintenance, name: 'Maintenance', itemStyle: { color: '#FF9800' } }
                ]
            }
        ]
    };
    
    charts.deviceStatus.setOption(option);
}

/**
 * 更新系统性能图表
 */
function updateSystemPerformanceChart() {
    if (!charts.systemPerformance) return;
    
    const option = {
        xAxis: {
            data: realTimeData.timeLabels
        },
        series: [
            {
                data: realTimeData.systemPerformance.cpu
            },
            {
                data: realTimeData.systemPerformance.memory
            },
            {
                data: realTimeData.systemPerformance.disk
            }
        ]
    };
    
    charts.systemPerformance.setOption(option);
}

/**
 * 更新统计卡片
 */
function updateStatCards() {
    // 计算总数据量
    const totalData = realTimeData.dataUsage.remote.reduce((a, b) => a + b, 0) +
                     realTimeData.dataUsage.weather.reduce((a, b) => a + b, 0) +
                     realTimeData.dataUsage.device.reduce((a, b) => a + b, 0);
    
    // 在线设备总数
    const totalDevices = realTimeData.deviceStatus.online + 
                        realTimeData.deviceStatus.offline + 
                        realTimeData.deviceStatus.maintenance;
    
    // 模拟其他数据
    const mockData = {
        dataRecords: Math.floor(totalData / 10) + 2500,
        onlineDevices: realTimeData.deviceStatus.online,
        activeUsers: Math.floor(Math.random() * 10) + 25,
        pendingAlerts: Math.floor(Math.random() * 5) + 1
    };
    
    // 更新卡片显示
    animateCountUp('.stat-card:nth-child(1) .stat-value', mockData.dataRecords, 2000);
    animateCountUp('.stat-card:nth-child(2) .stat-value', mockData.onlineDevices, 1500);
    animateCountUp('.stat-card:nth-child(3) .stat-value', mockData.activeUsers, 1000);
    animateCountUp('.stat-card:nth-child(4) .stat-value', mockData.pendingAlerts, 800);
}

/**
 * 数字动画效果
 */
function animateCountUp(selector, targetValue, duration = 1000) {
    const element = document.querySelector(selector);
    if (!element) return;
    
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
        
        element.textContent = formatNumber(Math.floor(currentValue));
    }, 16);
}

// ===== 实时数据更新 =====

/**
 * 开始数据更新
 */
function startDataUpdates() {
    // 每30秒更新一次数据
    dataUpdateInterval = setInterval(() => {
        updateRealTimeData();
    }, 30000);
    
    console.log('📊 已启动实时数据更新 (30秒间隔)');
}

/**
 * 停止数据更新
 */
function stopDataUpdates() {
    if (dataUpdateInterval) {
        clearInterval(dataUpdateInterval);
        dataUpdateInterval = null;
        console.log('⏹️ 已停止实时数据更新');
    }
}

/**
 * 更新实时数据
 */
function updateRealTimeData() {
    // 模拟新数据
    const now = new Date();
    const newTime = now.toLocaleTimeString('zh-CN', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    // 添加新的时间点
    realTimeData.timeLabels.push(newTime);
    realTimeData.timeLabels.shift(); // 移除最旧的数据点
    
    // 添加新的数据使用量
    realTimeData.dataUsage.remote.push(Math.floor(Math.random() * 50 + 100));
    realTimeData.dataUsage.remote.shift();
    
    realTimeData.dataUsage.weather.push(Math.floor(Math.random() * 30 + 50));
    realTimeData.dataUsage.weather.shift();
    
    realTimeData.dataUsage.device.push(Math.floor(Math.random() * 20 + 30));
    realTimeData.dataUsage.device.shift();
    
    // 添加新的性能数据
    realTimeData.systemPerformance.cpu.push(Math.floor(Math.random() * 20 + 15));
    realTimeData.systemPerformance.cpu.shift();
    
    realTimeData.systemPerformance.memory.push(Math.floor(Math.random() * 15 + 45));
    realTimeData.systemPerformance.memory.shift();
    
    realTimeData.systemPerformance.disk.push(Math.floor(Math.random() * 5 + 25));
    realTimeData.systemPerformance.disk.shift();
    
    // 偶尔更新设备状态
    if (Math.random() < 0.1) {
        const change = Math.random() < 0.5 ? 1 : -1;
        if (change > 0) {
            realTimeData.deviceStatus.online = Math.min(45, realTimeData.deviceStatus.online + 1);
            realTimeData.deviceStatus.offline = Math.max(0, realTimeData.deviceStatus.offline - 1);
        } else {
            realTimeData.deviceStatus.online = Math.max(35, realTimeData.deviceStatus.online - 1);
            realTimeData.deviceStatus.offline = Math.min(10, realTimeData.deviceStatus.offline + 1);
        }
    }
    
    // 更新图表
    updateAllCharts();
    updateStatCards();
    
    console.log('🔄 实时数据已更新');
}

// ===== 事件绑定 =====

/**
 * 绑定事件
 */
function bindEvents() {
    // 监听窗口大小变化，重新调整图表大小
    window.addEventListener('resize', debounce(() => {
        Object.values(charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }, 200));
    
    // 监听数据刷新事件
    document.addEventListener('dataRefreshed', function() {
        loadInitialData();
        showNotification('仪表板数据已刷新', 'success');
    });
    
    // 图表刷新按钮
    document.querySelectorAll('.chart-actions .btn-icon').forEach(btn => {
        btn.addEventListener('click', function() {
            const chartCard = this.closest('.chart-card');
            const chartId = chartCard.querySelector('.chart').id;
            
            if (this.querySelector('i').classList.contains('fa-sync')) {
                refreshChart(chartId);
            }
        });
    });
}

/**
 * 刷新指定图表
 */
function refreshChart(chartId) {
    const chart = charts[chartId];
    if (!chart) return;
    
    // 显示加载状态
    chart.showLoading({
        text: '加载中...',
        color: '#2E7D32',
        textColor: '#2E7D32',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 0
    });
    
    // 模拟数据加载延迟
    setTimeout(() => {
        generateMockData();
        updateAllCharts();
        chart.hideLoading();
        showNotification(`${getChartName(chartId)}已刷新`, 'success');
    }, 1000);
}

/**
 * 获取图表名称
 */
function getChartName(chartId) {
    const names = {
        'dataUsageTrend': '数据使用趋势图表',
        'deviceStatus': '设备状态分布图表',
        'systemPerformance': '系统性能监控图表'
    };
    return names[chartId] || '图表';
}

// ===== 页面卸载清理 =====

/**
 * 页面卸载时清理资源
 */
window.addEventListener('beforeunload', function() {
    stopDataUpdates();
    
    // 销毁图表实例
    Object.values(charts).forEach(chart => {
        if (chart && chart.dispose) {
            chart.dispose();
        }
    });
    
    console.log('🧹 仪表板资源已清理');
});

// ===== 导出功能函数 =====

/**
 * 导出图表为图片
 */
function exportChart(chartId, filename) {
    const chart = charts[chartId];
    if (!chart) {
        showNotification('图表不存在', 'error');
        return;
    }
    
    const url = chart.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
    });
    
    const link = document.createElement('a');
    link.download = filename || `chart_${chartId}_${new Date().getTime()}.png`;
    link.href = url;
    link.click();
    
    showNotification('图表已导出', 'success');
}

/**
 * 导出所有数据为Excel
 */
function exportToExcel() {
    showNotification('Excel导出功能开发中...', 'info');
    // 这里可以实现真实的Excel导出功能
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

/**
 * 格式化数字（如果common.js中没有定义）
 */
if (typeof formatNumber === 'undefined') {
    function formatNumber(num, decimals = 0) {
        return new Intl.NumberFormat('zh-CN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(num);
    }
}
 
 
 
 
 
 
 
 
 