/**
 * 农情遥感系统管理端 - 系统监控功能
 * 功能：实时监控、性能指标、服务状态、告警管理等
 */

// ===== 全局变量 =====
let monitoringData = {
    system: {},
    services: [],
    alerts: [],
    metrics: {}
};
let charts = {};
let autoRefreshInterval = null;
let currentTimeRange = '1h';
let isAutoRefreshEnabled = false;

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeMonitoringPage();
});

/**
 * 页面初始化
 */
function initializeMonitoringPage() {
    console.log('📊 初始化系统监控页面...');
    
    // 生成模拟数据
    generateMockMonitoringData();
    
    // 初始化图表
    initializeMonitoringCharts();
    
    // 渲染页面内容
    renderSystemOverview();
    renderResourceMonitors();
    renderServiceGrid();
    renderMonitoringCharts();
    renderAlertItems();
    
    // 初始化进度环
    initializeProgressRings();
    
    // 绑定事件
    bindMonitoringEvents();
    
    // 启动定时刷新
    startAutoRefresh();
    
    console.log('✅ 系统监控页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟监控数据
 */
function generateMockMonitoringData() {
    // 系统概览数据
    monitoringData.system = {
        healthScore: 98.5,
        alertCount: 3,
        performance: 'good',
        responseTime: 120,
        cpu: 42.3,
        memory: 68.7,
        disk: 83.2,
        network: {
            upload: 45,
            download: 80,
            total: 125
        }
    };
    
    // 服务状态数据
    monitoringData.services = [
        {
            id: 'database',
            name: '数据库服务',
            description: 'PostgreSQL 主数据库',
            status: 'running',
            icon: 'fas fa-database',
            metrics: {
                connections: '45/100',
                qps: '1,250'
            },
            uptime: '15天 6小时',
            lastCheck: new Date()
        },
        {
            id: 'api',
            name: 'API 服务',
            description: '后端接口服务',
            status: 'running',
            icon: 'fas fa-server',
            metrics: {
                requests: '8,432',
                responseTime: '120ms'
            },
            uptime: '15天 6小时',
            lastCheck: new Date()
        },
        {
            id: 'cache',
            name: '缓存服务',
            description: 'Redis 缓存集群',
            status: 'warning',
            icon: 'fas fa-memory',
            metrics: {
                memoryUsage: '85%',
                hitRate: '92%'
            },
            uptime: '15天 6小时',
            lastCheck: new Date()
        },
        {
            id: 'search',
            name: '搜索服务',
            description: 'Elasticsearch 搜索引擎',
            status: 'running',
            icon: 'fas fa-search',
            metrics: {
                indices: '12',
                documents: '2.3M'
            },
            uptime: '15天 6小时',
            lastCheck: new Date()
        }
    ];
    
    // 告警数据
    monitoringData.alerts = [
        {
            id: 'alert_001',
            level: 'warning',
            title: '磁盘使用率过高',
            message: '主服务器磁盘使用率达到83.2%，建议清理临时文件',
            timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30分钟前
            source: 'system',
            acknowledged: false
        },
        {
            id: 'alert_002',
            level: 'warning',
            title: '缓存服务内存告警',
            message: 'Redis缓存服务内存使用率超过85%，可能影响性能',
            timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15分钟前
            source: 'service',
            acknowledged: false
        },
        {
            id: 'alert_003',
            level: 'info',
            title: '系统自动备份完成',
            message: '数据库自动备份任务执行成功，备份文件已保存',
            timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5分钟前
            source: 'backup',
            acknowledged: true
        }
    ];
    
    // 生成历史监控数据
    generateHistoricalData();
    
    console.log('📊 生成监控模拟数据完成');
}

/**
 * 生成历史监控数据
 */
function generateHistoricalData() {
    const now = new Date();
    const timeRanges = {
        '1h': { points: 60, interval: 60 * 1000 }, // 1分钟一个点
        '6h': { points: 72, interval: 5 * 60 * 1000 }, // 5分钟一个点
        '24h': { points: 96, interval: 15 * 60 * 1000 }, // 15分钟一个点
        '7d': { points: 168, interval: 60 * 60 * 1000 } // 1小时一个点
    };
    
    monitoringData.metrics = {};
    
    Object.keys(timeRanges).forEach(range => {
        const config = timeRanges[range];
        monitoringData.metrics[range] = {
            timestamps: [],
            systemLoad: [],
            responseTime: [],
            errorRate: [],
            dataVolume: []
        };
        
        for (let i = config.points - 1; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * config.interval);
            monitoringData.metrics[range].timestamps.push(timestamp);
            
            // 生成模拟数据
            monitoringData.metrics[range].systemLoad.push(
                Math.random() * 60 + 20 + Math.sin(i * 0.1) * 10
            );
            monitoringData.metrics[range].responseTime.push(
                Math.random() * 200 + 50 + Math.sin(i * 0.05) * 30
            );
            monitoringData.metrics[range].errorRate.push(
                Math.random() * 5 + Math.sin(i * 0.03) * 2
            );
            monitoringData.metrics[range].dataVolume.push(
                Math.random() * 1000 + 500 + Math.sin(i * 0.08) * 200
            );
        }
    });
}

// ===== 图表初始化 =====

/**
 * 初始化监控图表
 */
function initializeMonitoringCharts() {
    initializeSystemLoadChart();
    initializeResponseTimeChart();
    initializeErrorRateChart();
    initializeDataVolumeChart();
    initializeNetworkChart();
}

/**
 * 初始化系统负载图表
 */
function initializeSystemLoadChart() {
    const chartDom = document.getElementById('systemLoadChart');
    if (!chartDom) return;
    
    charts.systemLoad = echarts.init(chartDom);
    updateSystemLoadChart();
}

/**
 * 更新系统负载图表
 */
function updateSystemLoadChart() {
    if (!charts.systemLoad) return;
    
    const data = monitoringData.metrics[currentTimeRange];
    if (!data) return;
    
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
                const time = new Date(params[0].axisValue).toLocaleString('zh-CN');
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${time}</div>
                    <div style="display: flex; align-items: center;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params[0].color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">系统负载:</span>
                        <span style="font-weight: bold;">${params[0].value.toFixed(1)}%</span>
                    </div>
                `;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.timestamps.map(t => t.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })),
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
            name: '负载 (%)',
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
                name: '系统负载',
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
                data: data.systemLoad
            }
        ]
    };
    
    charts.systemLoad.setOption(option);
}

/**
 * 初始化响应时间图表
 */
function initializeResponseTimeChart() {
    const chartDom = document.getElementById('responseTimeChart');
    if (!chartDom) return;
    
    charts.responseTime = echarts.init(chartDom);
    updateResponseTimeChart();
}

/**
 * 更新响应时间图表
 */
function updateResponseTimeChart() {
    if (!charts.responseTime) return;
    
    const data = monitoringData.metrics[currentTimeRange];
    if (!data) return;
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#1976D2',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: function(params) {
                const time = new Date(params[0].axisValue).toLocaleString('zh-CN');
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${time}</div>
                    <div style="display: flex; align-items: center;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params[0].color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">响应时间:</span>
                        <span style="font-weight: bold;">${params[0].value.toFixed(0)}ms</span>
                    </div>
                `;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.timestamps.map(t => t.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })),
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
            name: '时间 (ms)',
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
                name: '响应时间',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 3,
                    color: '#1976D2'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(25, 118, 210, 0.3)' },
                            { offset: 1, color: 'rgba(25, 118, 210, 0.05)' }
                        ]
                    }
                },
                data: data.responseTime
            }
        ]
    };
    
    charts.responseTime.setOption(option);
}

/**
 * 初始化错误率图表
 */
function initializeErrorRateChart() {
    const chartDom = document.getElementById('errorRateChart');
    if (!chartDom) return;
    
    charts.errorRate = echarts.init(chartDom);
    updateErrorRateChart();
}

/**
 * 更新错误率图表
 */
function updateErrorRateChart() {
    if (!charts.errorRate) return;
    
    const data = monitoringData.metrics[currentTimeRange];
    if (!data) return;
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#F57C00',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: function(params) {
                const time = new Date(params[0].axisValue).toLocaleString('zh-CN');
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${time}</div>
                    <div style="display: flex; align-items: center;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params[0].color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">错误率:</span>
                        <span style="font-weight: bold;">${params[0].value.toFixed(2)}%</span>
                    </div>
                `;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.timestamps.map(t => t.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })),
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
            name: '错误率 (%)',
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
                name: '错误率',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 3,
                    color: '#F57C00'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(245, 124, 0, 0.3)' },
                            { offset: 1, color: 'rgba(245, 124, 0, 0.05)' }
                        ]
                    }
                },
                data: data.errorRate
            }
        ]
    };
    
    charts.errorRate.setOption(option);
}

/**
 * 初始化数据处理量图表
 */
function initializeDataVolumeChart() {
    const chartDom = document.getElementById('dataVolumeChart');
    if (!chartDom) return;
    
    charts.dataVolume = echarts.init(chartDom);
    updateDataVolumeChart();
}

/**
 * 更新数据处理量图表
 */
function updateDataVolumeChart() {
    if (!charts.dataVolume) return;
    
    const data = monitoringData.metrics[currentTimeRange];
    if (!data) return;
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#7B1FA2',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: function(params) {
                const time = new Date(params[0].axisValue).toLocaleString('zh-CN');
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${time}</div>
                    <div style="display: flex; align-items: center;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params[0].color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">处理量:</span>
                        <span style="font-weight: bold;">${params[0].value.toFixed(0)} MB</span>
                    </div>
                `;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.timestamps.map(t => t.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })),
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
                name: '数据处理量',
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#7B1FA2' },
                            { offset: 1, color: '#9C27B0' }
                        ]
                    }
                },
                data: data.dataVolume
            }
        ]
    };
    
    charts.dataVolume.setOption(option);
}

/**
 * 初始化网络图表
 */
function initializeNetworkChart() {
    const chartDom = document.getElementById('networkChart');
    if (!chartDom) return;
    
    charts.network = echarts.init(chartDom);
    updateNetworkChart();
}

/**
 * 更新网络图表
 */
function updateNetworkChart() {
    if (!charts.network) return;
    
    // 生成最近10分钟的网络流量数据
    const now = new Date();
    const data = [];
    const uploadData = [];
    const downloadData = [];
    
    for (let i = 9; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 1000);
        data.push(time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }));
        uploadData.push(Math.random() * 20 + 35);
        downloadData.push(Math.random() * 30 + 65);
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
                fontSize: 11
            }
        },
        legend: {
            data: ['上行', '下行'],
            textStyle: {
                color: '#718096',
                fontSize: 10
            },
            itemWidth: 10,
            itemHeight: 10
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '5%',
            top: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data,
            axisLine: {
                show: false
            },
            axisLabel: {
                color: '#718096',
                fontSize: 9
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitLine: {
                show: false
            }
        },
        series: [
            {
                name: '上行',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 2,
                    color: '#2E7D32'
                },
                data: uploadData
            },
            {
                name: '下行',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 2,
                    color: '#1976D2'
                },
                data: downloadData
            }
        ]
    };
    
    charts.network.setOption(option);
}

// ===== 页面渲染 =====

/**
 * 渲染系统概览
 */
function renderSystemOverview() {
    // 系统概览数据已经在HTML中静态设置，这里可以根据需要动态更新
    console.log('📊 渲染系统概览');
}

/**
 * 渲染资源监控器
 */
function renderResourceMonitors() {
    console.log('📊 渲染资源监控器');
}

/**
 * 渲染服务网格
 */
function renderServiceGrid() {
    console.log('📊 渲染服务状态');
}

/**
 * 渲染监控图表
 */
function renderMonitoringCharts() {
    updateSystemLoadChart();
    updateResponseTimeChart();
    updateErrorRateChart();
    updateDataVolumeChart();
    updateNetworkChart();
}

/**
 * 渲染告警项目
 */
function renderAlertItems() {
    const container = document.getElementById('alertItems');
    if (!container) return;
    
    if (monitoringData.alerts.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-check-circle"></i>
                <h3>暂无告警</h3>
                <p>系统运行正常，没有需要处理的告警</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = monitoringData.alerts.map(alert => {
        const levelText = {
            critical: '严重',
            warning: '警告',
            info: '信息'
        }[alert.level];
        
        const levelIcon = {
            critical: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        }[alert.level];
        
        return `
            <div class="alert-item ${alert.level} ${alert.acknowledged ? 'acknowledged' : ''}" 
                 onclick="viewAlertDetails('${alert.id}')">
                <div class="alert-header">
                    <div class="alert-level">
                        <i class="${levelIcon}"></i>
                        <span>${levelText}</span>
                    </div>
                    <div class="alert-time">
                        ${formatTimeAgo(alert.timestamp)}
                    </div>
                </div>
                <div class="alert-content">
                    <h4 class="alert-title">${alert.title}</h4>
                    <p class="alert-message">${alert.message}</p>
                    <div class="alert-meta">
                        <span class="alert-source">来源: ${alert.source}</span>
                        ${alert.acknowledged ? '<span class="alert-status">已确认</span>' : '<span class="alert-status pending">待处理</span>'}
                    </div>
                </div>
                <div class="alert-actions">
                    <button class="btn-sm" onclick="event.stopPropagation(); acknowledgeAlert('${alert.id}')">
                        ${alert.acknowledged ? '取消确认' : '确认告警'}
                    </button>
                    <button class="btn-sm" onclick="event.stopPropagation(); dismissAlert('${alert.id}')">
                        忽略
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 初始化进度环
 */
function initializeProgressRings() {
    document.querySelectorAll('.progress-ring').forEach(ring => {
        const progress = parseFloat(ring.getAttribute('data-progress'));
        const fill = ring.querySelector('.progress-ring-fill');
        if (fill) {
            const radius = 54;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (progress / 100) * circumference;
            
            fill.style.strokeDasharray = circumference;
            fill.style.strokeDashoffset = offset;
        }
    });
}

// ===== 工具函数 =====

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

// ===== 事件绑定 =====

/**
 * 绑定监控事件
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
 * 设置监控时间范围
 */
function setMonitorTimeRange(range) {
    currentTimeRange = range;
    
    // 更新按钮状态
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新图表
    renderMonitoringCharts();
    
    const rangeNames = {
        '1h': '1小时',
        '6h': '6小时',
        '24h': '24小时',
        '7d': '7天'
    };
    
    showNotification(`已切换到${rangeNames[range]}视图`, 'info');
}

/**
 * 切换自动刷新
 */
function toggleAutoRefresh() {
    if (isAutoRefreshEnabled) {
        stopAutoRefresh();
        event.target.classList.remove('active');
        showNotification('已关闭自动刷新', 'info');
    } else {
        startAutoRefresh();
        event.target.classList.add('active');
        showNotification('已开启自动刷新（30秒间隔）', 'success');
    }
}

/**
 * 启动自动刷新
 */
function startAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
    }
    
    autoRefreshInterval = setInterval(() => {
        refreshAllMetrics();
    }, 30000); // 30秒刷新一次
    
    isAutoRefreshEnabled = true;
}

/**
 * 停止自动刷新
 */
function stopAutoRefresh() {
    if (autoRefreshInterval) {
        clearInterval(autoRefreshInterval);
        autoRefreshInterval = null;
    }
    isAutoRefreshEnabled = false;
}

/**
 * 刷新所有监控指标
 */
function refreshAllMetrics() {
    // 模拟数据更新
    monitoringData.system.cpu = Math.random() * 30 + 35;
    monitoringData.system.memory = Math.random() * 20 + 60;
    monitoringData.system.disk = Math.random() * 5 + 80;
    
    // 更新进度环
    setTimeout(() => {
        initializeProgressRings();
    }, 100);
    
    // 更新图表
    generateHistoricalData();
    renderMonitoringCharts();
    
    if (!isAutoRefreshEnabled) {
        showNotification('监控数据已刷新', 'success');
    }
}

/**
 * 全屏显示图表
 */
function fullscreenChart(chartType) {
    showNotification(`${chartType} 图表全屏功能开发中...`, 'info');
}

/**
 * 刷新服务状态
 */
function refreshServices() {
    // 模拟服务状态更新
    monitoringData.services.forEach(service => {
        service.lastCheck = new Date();
        // 随机更新一些指标
        if (service.id === 'cache' && Math.random() < 0.3) {
            service.status = 'running'; // 缓存服务可能恢复正常
        }
    });
    
    renderServiceGrid();
    showNotification('服务状态已刷新', 'success');
}

/**
 * 查看服务日志
 */
function viewServiceLogs(serviceId) {
    const service = monitoringData.services.find(s => s.id === serviceId);
    if (service) {
        showNotification(`查看 ${service.name} 服务日志`, 'info');
    }
}

/**
 * 重启服务
 */
function restartService(serviceId) {
    const service = monitoringData.services.find(s => s.id === serviceId);
    if (service) {
        showConfirm(`确定要重启 ${service.name} 服务吗？`, () => {
            showNotification(`正在重启 ${service.name} 服务...`, 'info');
            
            // 模拟重启过程
            setTimeout(() => {
                service.status = 'running';
                service.lastCheck = new Date();
                renderServiceGrid();
                showNotification(`${service.name} 服务重启成功`, 'success');
            }, 2000);
        });
    }
}

/**
 * 查看告警详情
 */
function viewAlertDetails(alertId) {
    const alert = monitoringData.alerts.find(a => a.id === alertId);
    if (!alert) return;
    
    const levelText = {
        critical: '严重',
        warning: '警告',
        info: '信息'
    }[alert.level];
    
    const content = `
        <div class="alert-detail-content">
            <div class="alert-detail-header">
                <div class="alert-level ${alert.level}">
                    <i class="fas fa-exclamation-triangle"></i>
                    <span>${levelText}</span>
                </div>
                <div class="alert-status ${alert.acknowledged ? 'acknowledged' : 'pending'}">
                    ${alert.acknowledged ? '已确认' : '待处理'}
                </div>
            </div>
            <h3>${alert.title}</h3>
            <p class="alert-description">${alert.message}</p>
            <div class="alert-metadata">
                <div class="metadata-item">
                    <label>告警时间:</label>
                    <span>${alert.timestamp.toLocaleString('zh-CN')}</span>
                </div>
                <div class="metadata-item">
                    <label>告警来源:</label>
                    <span>${alert.source}</span>
                </div>
                <div class="metadata-item">
                    <label>告警ID:</label>
                    <span>${alert.id}</span>
                </div>
            </div>
        </div>
    `;
    
    showModal({
        title: '告警详情',
        content: content,
        actions: [
            { text: alert.acknowledged ? '取消确认' : '确认告警', class: 'btn-secondary', onclick: `acknowledgeAlert('${alertId}'); closeModal();` },
            { text: '忽略告警', class: 'btn-secondary', onclick: `dismissAlert('${alertId}'); closeModal();` },
            { text: '关闭', class: 'btn-primary', onclick: 'closeModal()' }
        ]
    });
}

/**
 * 确认告警
 */
function acknowledgeAlert(alertId) {
    const alert = monitoringData.alerts.find(a => a.id === alertId);
    if (alert) {
        alert.acknowledged = !alert.acknowledged;
        renderAlertItems();
        const action = alert.acknowledged ? '确认' : '取消确认';
        showNotification(`告警已${action}`, 'success');
    }
}

/**
 * 忽略告警
 */
function dismissAlert(alertId) {
    const index = monitoringData.alerts.findIndex(a => a.id === alertId);
    if (index > -1) {
        monitoringData.alerts.splice(index, 1);
        renderAlertItems();
        showNotification('告警已忽略', 'success');
    }
}

/**
 * 清除所有告警
 */
function clearAllAlerts() {
    if (monitoringData.alerts.length === 0) {
        showNotification('暂无告警需要清除', 'info');
        return;
    }
    
    showConfirm('确定要清除所有告警吗？', () => {
        monitoringData.alerts = [];
        renderAlertItems();
        showNotification('所有告警已清除', 'success');
    });
}

/**
 * 配置告警规则
 */
function configureAlertRules() {
    showNotification('告警规则配置功能开发中...', 'info');
}

/**
 * 配置告警
 */
function configureAlerts() {
    const modal = document.getElementById('alertConfigModal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * 关闭告警配置模态框
 */
function closeAlertConfigModal() {
    const modal = document.getElementById('alertConfigModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 保存告警配置
 */
function saveAlertConfig() {
    showNotification('告警配置已保存', 'success');
    closeAlertConfigModal();
}

/**
 * 导出监控报告
 */
function exportMetrics() {
    showNotification('监控报告导出功能开发中...', 'info');
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
 
 
 
 
 
 
 
 
 