/**
 * 农情遥感系统管理端 - 气象数据管理功能
 * 功能：气象数据展示、气象站监控、数据质量管理等
 */

// ===== 全局变量 =====
let currentPage = 1;
let pageSize = 20;
let totalRecords = 1542;
let currentSort = { field: 'datetime', order: 'desc' };
let selectedRows = new Set();
let weatherData = [];
let filteredData = [];
let stationData = [];
let currentChart = 'temperature';
let charts = {};
let currentViewMode = 'grid'; // 当前视图模式：'grid' 或 'list'

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWeatherPage();
});

/**
 * 页面初始化
 */
function initializeWeatherPage() {
    console.log('🌤️ 初始化气象数据管理页面...');
    
    // 恢复视图模式设置
    const savedViewMode = localStorage.getItem('weatherDataViewMode');
    if (savedViewMode && ['list', 'grid'].includes(savedViewMode)) {
        currentViewMode = savedViewMode;
    }
    
    // 生成模拟数据
    generateMockData();
    
    // 初始化图表
    initializeCharts();
    
    // 渲染页面内容
    renderComprehensiveDashboard();
    renderQualityMonitor();
    
    // 绑定事件
    bindEvents();
    
    // 开始实时更新
    startRealTimeUpdate();
    
    // 更新视图切换按钮状态
    updateViewToggleButtons();
    
    console.log('✅ 气象数据管理页面初始化完成');
    console.log(`🌤️ 当前视图模式: ${currentViewMode}`);
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟数据
 */
function generateMockData() {
    const stations = [
        { id: 'station_001', name: '临夏主站', location: '临夏市', status: 'online' },
        { id: 'station_002', name: '康乐分站', location: '康乐县', status: 'online' },
        { id: 'station_003', name: '和政分站', location: '和政县', status: 'maintenance' },
        { id: 'station_004', name: '积石山分站', location: '积石山县', status: 'online' },
        { id: 'station_005', name: '永靖分站', location: '永靖县', status: 'offline' }
    ];
    
    stationData = stations.map(station => {
        const baseTemp = 18 + Math.random() * 10; // 18-28度基准温度
        const baseHumidity = 50 + Math.random() * 30; // 50-80%基准湿度
        
        return {
            ...station,
            currentData: {
                temperature: baseTemp + (Math.random() - 0.5) * 4,
                humidity: baseHumidity + (Math.random() - 0.5) * 10,
                rainfall: Math.random() * 5,
                windspeed: Math.random() * 8 + 1,
                pressure: 1000 + Math.random() * 50,
                radiation: Math.random() * 800 + 200
            },
            lastUpdate: new Date(Date.now() - Math.random() * 3600000) // 过去1小时内
        };
    });
    
    // 生成气象观测数据
    weatherData = [];
    const now = new Date();
    
    for (let i = 0; i < totalRecords; i++) {
        const station = stations[Math.floor(Math.random() * stations.length)];
        const datetime = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000); // 过去30天
        
        // 模拟一天中的温度变化
        const hour = datetime.getHours();
        const baseTemp = 15 + 10 * Math.sin((hour - 6) * Math.PI / 12); // 正弦波模拟日温度变化
        
        const data = {
            id: `weather_${String(i + 1).padStart(6, '0')}`,
            stationId: station.id,
            stationName: station.name,
            datetime: datetime,
            temperature: Math.max(-10, Math.min(40, baseTemp + (Math.random() - 0.5) * 6)),
            humidity: Math.max(20, Math.min(100, 60 + (Math.random() - 0.5) * 40)),
            rainfall: Math.random() < 0.3 ? Math.random() * 20 : 0, // 30%概率有降雨
            windspeed: Math.max(0, Math.random() * 12),
            pressure: Math.max(980, Math.min(1040, 1013 + (Math.random() - 0.5) * 30)),
            radiation: Math.max(0, Math.random() * 1000),
            quality: 70 + Math.random() * 30 // 70-100质量分数
        };
        
        weatherData.push(data);
    }
    
    // 按时间排序
    weatherData.sort((a, b) => b.datetime - a.datetime);
    filteredData = [...weatherData];
    
    console.log(`📊 生成了 ${weatherData.length} 条气象观测数据`);
    console.log(`🏪 生成了 ${stationData.length} 个气象站数据`);
}

// ===== 图表初始化 =====

/**
 * 初始化图表
 */
function initializeCharts() {
    initializeWeatherTrendChart();
    initializeMiniCharts();
}

/**
 * 初始化气象趋势图表
 */
function initializeWeatherTrendChart() {
    const chartDom = document.getElementById('weatherTrendChart');
    if (!chartDom) return;
    
    charts.weatherTrend = echarts.init(chartDom);
    updateWeatherTrendChart(currentChart);
}

/**
 * 初始化迷你图表
 */
function initializeMiniCharts() {
    const chartIds = ['temperatureChart', 'humidityChart', 'rainfallChart', 'windSpeedChart'];
    
    chartIds.forEach(chartId => {
        const chartDom = document.getElementById(chartId);
        if (!chartDom) return;
        
        charts[chartId] = echarts.init(chartDom);
        updateMiniChart(chartId);
    });
}

/**
 * 更新气象趋势图表
 */
function updateWeatherTrendChart(dataType) {
    if (!charts.weatherTrend) return;
    
    // 获取过去7天的数据
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentData = weatherData.filter(item => 
        item.datetime >= startDate && item.datetime <= endDate
    );
    
    // 按天分组并计算平均值
    const dailyData = {};
    recentData.forEach(item => {
        const dateKey = item.datetime.toDateString();
        if (!dailyData[dateKey]) {
            dailyData[dateKey] = { values: [], date: item.datetime };
        }
        dailyData[dateKey].values.push(item[dataType]);
    });
    
    const timeLabels = [];
    const values = [];
    
    Object.keys(dailyData).sort().forEach(dateKey => {
        const dayData = dailyData[dateKey];
        const avgValue = dayData.values.reduce((a, b) => a + b, 0) / dayData.values.length;
        
        timeLabels.push(dayData.date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        values.push(avgValue.toFixed(1));
    });
    
    const colorMap = {
        temperature: '#FF6B35',
        humidity: '#2196F3',
        rainfall: '#607D8B',
        windspeed: '#4CAF50'
    };
    
    const unitMap = {
        temperature: '°C',
        humidity: '%',
        rainfall: 'mm',
        windspeed: 'm/s'
    };
    
    const nameMap = {
        temperature: '温度',
        humidity: '湿度',
        rainfall: '降雨量',
        windspeed: '风速'
    };
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: colorMap[dataType],
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: function(params) {
                const param = params[0];
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${param.axisValue}</div>
                    <div style="display: flex; align-items: center;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${param.color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">${nameMap[dataType]}:</span>
                        <span style="font-weight: bold;">${param.value} ${unitMap[dataType]}</span>
                    </div>
                `;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '8%',
            top: '5%',
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
            name: unitMap[dataType],
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
                name: nameMap[dataType],
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                lineStyle: {
                    width: 3,
                    color: colorMap[dataType]
                },
                itemStyle: {
                    color: colorMap[dataType],
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: colorMap[dataType] + '40' },
                            { offset: 1, color: colorMap[dataType] + '10' }
                        ]
                    }
                },
                data: values
            }
        ]
    };
    
    charts.weatherTrend.setOption(option, true);
}

/**
 * 更新迷你图表
 */
function updateMiniChart(chartId) {
    const chart = charts[chartId];
    if (!chart) return;
    
    // 生成过去24小时的数据
    const hours = [];
    const values = [];
    
    for (let i = 23; i >= 0; i--) {
        const time = new Date(Date.now() - i * 60 * 60 * 1000);
        hours.push(time.getHours());
        
        // 根据图表类型生成不同的模拟数据
        let value;
        switch(chartId) {
            case 'temperatureChart':
                value = 15 + 10 * Math.sin((time.getHours() - 6) * Math.PI / 12) + Math.random() * 2;
                break;
            case 'humidityChart':
                value = 60 + Math.random() * 20;
                break;
            case 'rainfallChart':
                value = Math.random() < 0.1 ? Math.random() * 5 : 0;
                break;
            case 'windSpeedChart':
                value = 2 + Math.random() * 4;
                break;
            default:
                value = Math.random() * 100;
        }
        values.push(value.toFixed(1));
    }
    
    const colorMap = {
        temperatureChart: '#FF6B35',
        humidityChart: '#2196F3', 
        rainfallChart: '#607D8B',
        windSpeedChart: '#4CAF50'
    };
    
    const option = {
        grid: {
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
        },
        xAxis: {
            type: 'category',
            show: false,
            data: hours
        },
        yAxis: {
            type: 'value',
            show: false
        },
        series: [
            {
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: {
                    width: 2,
                    color: colorMap[chartId]
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: colorMap[chartId] + '60' },
                            { offset: 1, color: colorMap[chartId] + '10' }
                        ]
                    }
                },
                data: values
            }
        ]
    };
    
    chart.setOption(option);
}

// ===== 页面渲染 =====

/**
 * 渲染综合气象监测看板
 */
function renderComprehensiveDashboard() {
    renderKeyMetrics();
    renderStationList();
    renderDashboardSummary();
    
    console.log('🌈 综合气象监测看板已渲染');
}

/**
 * 渲染核心指标卡片
 */
function renderKeyMetrics() {
    // 计算温度统计
    const temperatures = stationData.map(station => station.currentData.temperature);
    const tempMin = Math.min(...temperatures);
    const tempMax = Math.max(...temperatures);
    const tempAvg = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
    
    // 计算湿度统计
    const humidities = stationData.map(station => station.currentData.humidity);
    const humidityMin = Math.min(...humidities);
    const humidityMax = Math.max(...humidities);
    const humidityAvg = humidities.reduce((sum, humidity) => sum + humidity, 0) / humidities.length;
    
    // 更新温度指标
    const tempMinEl = document.getElementById('tempMin');
    const tempMaxEl = document.getElementById('tempMax');
    const tempAvgEl = document.getElementById('tempAvg');
    
    if (tempMinEl) tempMinEl.textContent = `${tempMin.toFixed(1)}°C`;
    if (tempMaxEl) tempMaxEl.textContent = `${tempMax.toFixed(1)}°C`;
    if (tempAvgEl) tempAvgEl.textContent = `${tempAvg.toFixed(1)}°C`;
    
    // 更新湿度指标
    const humidityMinEl = document.getElementById('humidityMin');
    const humidityMaxEl = document.getElementById('humidityMax');
    const humidityAvgEl = document.getElementById('humidityAvg');
    
    if (humidityMinEl) humidityMinEl.textContent = `${Math.round(humidityMin)}%`;
    if (humidityMaxEl) humidityMaxEl.textContent = `${Math.round(humidityMax)}%`;
    if (humidityAvgEl) humidityAvgEl.textContent = `${Math.round(humidityAvg)}%`;
    
    // 初始化迷你图表
    initializeMiniCharts();
}

/**
 * 渲染气象站状态列表
 */
function renderStationList() {
    const stationListEl = document.getElementById('stationList');
    const stationStatusEl = document.getElementById('stationStatus');
    
    if (!stationListEl) return;
    
    // 更新在线状态统计
    const onlineCount = stationData.filter(station => station.status === 'online').length;
    if (stationStatusEl) {
        stationStatusEl.textContent = `${onlineCount}/${stationData.length}`;
    }
    
    // 渲染气象站列表
    stationListEl.innerHTML = stationData.map(station => {
        const timeDiff = Math.floor((Date.now() - station.lastUpdate) / 60000);
        
        return `
            <div class="station-item" onclick="viewStationDetails('${station.id}')">
                <div class="station-status-dot ${station.status}"></div>
                <div class="station-item-info">
                    <div class="station-item-name">${station.name}</div>
                    <div class="station-item-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${station.location}
                        </div>
                    </div>
                <div class="station-item-data">
                    <div class="station-temp">${station.currentData.temperature.toFixed(1)}°C</div>
                    <div>${timeDiff}分钟前</div>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染看板汇总信息
 */
function renderDashboardSummary() {
    const totalRainfall = stationData.reduce((sum, station) => sum + station.currentData.rainfall, 0);
    const maxWindSpeed = Math.max(...stationData.map(station => station.currentData.windspeed));
    const onlineStations = stationData.filter(station => station.status === 'online').length;
    const dataQuality = onlineStations === stationData.length ? '优' : onlineStations > stationData.length * 0.8 ? '良' : '一般';
    const alertCount = stationData.filter(station => station.status === 'offline').length;
    
    // 更新汇总信息
    const totalRainfallEl = document.getElementById('totalRainfall');
    const maxWindSpeedEl = document.getElementById('maxWindSpeed');
    const dataQualityEl = document.getElementById('dataQuality');
    const alertCountEl = document.getElementById('alertCount');
    
    if (totalRainfallEl) totalRainfallEl.textContent = `${totalRainfall.toFixed(1)}mm`;
    if (maxWindSpeedEl) maxWindSpeedEl.textContent = `${maxWindSpeed.toFixed(1)}m/s`;
    if (dataQualityEl) {
        dataQualityEl.textContent = dataQuality;
        dataQualityEl.className = `summary-value quality-${dataQuality === '优' ? 'good' : 'normal'}`;
    }
    if (alertCountEl) alertCountEl.textContent = alertCount;
}







/**
 * 渲染数据质量监控
 */
function renderQualityMonitor() {
    // 计算质量统计
    const totalRecords = filteredData.length;
    const normalData = filteredData.filter(item => item.quality >= 80).length;
    const warningData = filteredData.filter(item => item.quality >= 60 && item.quality < 80).length;
    const errorData = filteredData.filter(item => item.quality < 60).length;
    const delayedData = Math.floor(totalRecords * 0.008); // 模拟延迟数据
    
    // 更新显示
    const qualityCards = document.querySelectorAll('.quality-card');
    if (qualityCards.length >= 4) {
        // 正常数据
        const normalCard = qualityCards[0];
        normalCard.querySelector('.quality-value').textContent = ((normalData / totalRecords) * 100).toFixed(1) + '%';
        normalCard.querySelector('.quality-count').textContent = normalData + ' 条记录';
        
        // 异常数据
        const warningCard = qualityCards[1];
        warningCard.querySelector('.quality-value').textContent = ((warningData / totalRecords) * 100).toFixed(1) + '%';
        warningCard.querySelector('.quality-count').textContent = warningData + ' 条记录';
        
        // 缺失数据
        const errorCard = qualityCards[2];
        errorCard.querySelector('.quality-value').textContent = ((errorData / totalRecords) * 100).toFixed(1) + '%';
        errorCard.querySelector('.quality-count').textContent = errorData + ' 条记录';
        
        // 延迟数据
        const delayCard = qualityCards[3];
        delayCard.querySelector('.quality-value').textContent = ((delayedData / totalRecords) * 100).toFixed(1) + '%';
        delayCard.querySelector('.quality-count').textContent = delayedData + ' 条记录';
    }
}

// ===== 工具函数 =====

/**
 * 获取温度样式类
 */
function getTemperatureClass(temp) {
    if (temp > 30) return 'hot';
    if (temp < 5) return 'cold';
    return '';
}

/**
 * 获取湿度样式类
 */
function getHumidityClass(humidity) {
    if (humidity > 80) return 'high';
    if (humidity < 30) return 'low';
    return '';
}

/**
 * 获取降雨量样式类
 */
function getRainfallClass(rainfall) {
    if (rainfall > 10) return 'heavy';
    if (rainfall < 0.1) return 'light';
    return '';
}

/**
 * 获取风速样式类
 */
function getWindSpeedClass(windspeed) {
    if (windspeed > 6) return 'strong';
    if (windspeed < 1) return 'calm';
    return '';
}

/**
 * 获取质量等级
 */
function getQualityLevel(quality) {
    if (quality >= 90) return 'excellent';
    if (quality >= 75) return 'good';
    if (quality >= 60) return 'fair';
    return 'poor';
}



// ===== 事件绑定 =====

/**
 * 绑定事件
 */
function bindEvents() {
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











// ===== 气象站操作 =====

/**
 * 查看气象站详情
 */
function viewStationDetails(stationId) {
    const station = stationData.find(s => s.id === stationId);
    if (!station) {
        showNotification('气象站不存在', 'error');
        return;
    }
    
    // 阻止事件冒泡（当点击按钮时）
    if (event) {
        event.stopPropagation();
    }
    
    // 填充基本信息
    document.getElementById('detailStationName').textContent = station.name;
    document.getElementById('detailStationId').textContent = station.id;
    document.getElementById('detailStationLocation').textContent = station.location;
    
    // 设置状态
    const statusElement = document.getElementById('detailStationStatus');
    const statusText = {
        online: '在线',
        offline: '离线', 
        maintenance: '维护中'
    }[station.status];
    statusElement.textContent = statusText;
    statusElement.className = `status-badge ${station.status}`;
    
    // 设置最后更新时间
    const timeDiff = Math.floor((Date.now() - station.lastUpdate) / 60000);
    document.getElementById('detailLastUpdate').textContent = `${timeDiff}分钟前`;
    
    // 填充实时数据
    const data = station.currentData;
    document.getElementById('detailTemperature').textContent = `${data.temperature.toFixed(1)}°C`;
    document.getElementById('detailHumidity').textContent = `${Math.round(data.humidity)}%`;
    document.getElementById('detailRainfall').textContent = `${data.rainfall.toFixed(1)}mm`;
    document.getElementById('detailWindspeed').textContent = `${data.windspeed.toFixed(1)}m/s`;
    document.getElementById('detailPressure').textContent = `${data.pressure.toFixed(1)}hPa`;
    document.getElementById('detailRadiation').textContent = `${Math.round(data.radiation)}W/m²`;
    
    // 初始化趋势图表
    initializeStationTrendChart(stationId);
    
    // 显示模态框
    const modal = document.getElementById('stationDetailModal');
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
    }
    
    console.log(`🌤️ 显示气象站详情: ${station.name}`);
}

/**
 * 关闭气象站详情模态框
 */
function closeStationDetailModal() {
    const modal = document.getElementById('stationDetailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto'; // 恢复背景滚动
    }
    
    // 销毁图表以释放资源
    if (charts.stationTrend) {
        charts.stationTrend.dispose();
        delete charts.stationTrend;
    }
}

/**
 * 初始化气象站趋势图表
 */
function initializeStationTrendChart(stationId) {
    const chartDom = document.getElementById('stationTrendChart');
    if (!chartDom) return;
    
    // 如果图表已存在，先销毁
    if (charts.stationTrend) {
        charts.stationTrend.dispose();
    }
    
    charts.stationTrend = echarts.init(chartDom);
    
    // 生成过去24小时的模拟数据
    const hours = [];
    const temperatureData = [];
    const humidityData = [];
    const rainfallData = [];
    const windspeedData = [];
    
    for (let i = 23; i >= 0; i--) {
        const time = new Date(Date.now() - i * 60 * 60 * 1000);
        hours.push(time.getHours() + ':00');
        
        // 生成模拟数据，基于时间的变化
        const hour = time.getHours();
        temperatureData.push((15 + 10 * Math.sin((hour - 6) * Math.PI / 12) + Math.random() * 2).toFixed(1));
        humidityData.push(Math.round(60 + Math.random() * 20));
        rainfallData.push((Math.random() < 0.1 ? Math.random() * 3 : 0).toFixed(1));
        windspeedData.push((2 + Math.random() * 4).toFixed(1));
    }
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#667eea',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            axisPointer: {
                type: 'cross',
                crossStyle: {
                    color: '#999'
                }
            }
        },
        legend: {
            data: ['温度', '湿度', '降雨量', '风速'],
            top: '5%',
            textStyle: {
                color: '#64748B',
                fontSize: 12
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            top: '20%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: hours,
                axisPointer: {
                    type: 'shadow'
                },
                axisLine: {
                    lineStyle: {
                        color: '#E2E8F0'
                    }
                },
                axisLabel: {
                    color: '#64748B',
                    fontSize: 11
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '温度(°C) / 风速(m/s)',
                position: 'left',
                axisLine: {
                    lineStyle: {
                        color: '#E2E8F0'
                    }
                },
                axisLabel: {
                    color: '#64748B',
                    fontSize: 11
                }
            },
            {
                type: 'value',
                name: '湿度(%) / 降雨(mm)',
                position: 'right',
                axisLine: {
                    lineStyle: {
                        color: '#E2E8F0'
                    }
                },
                axisLabel: {
                    color: '#64748B',
                    fontSize: 11
                }
            }
        ],
        series: [
            {
                name: '温度',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                yAxisIndex: 0,
                lineStyle: {
                    width: 3,
                    color: '#FF6B6B'
                },
                itemStyle: {
                    color: '#FF6B6B'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                            { offset: 1, color: 'rgba(255, 107, 107, 0.1)' }
                        ]
                    }
                },
                data: temperatureData
            },
            {
                name: '湿度',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                yAxisIndex: 1,
                lineStyle: {
                    width: 3,
                    color: '#4ECDC4'
                },
                itemStyle: {
                    color: '#4ECDC4'
                },
                data: humidityData
            },
            {
                name: '降雨量',
                type: 'bar',
                yAxisIndex: 1,
                itemStyle: {
                    color: '#45B7D1',
                    borderRadius: [2, 2, 0, 0]
                },
                data: rainfallData
            },
            {
                name: '风速',
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 4,
                yAxisIndex: 0,
                lineStyle: {
                    width: 3,
                    color: '#96CEB4'
                },
                itemStyle: {
                    color: '#96CEB4'
                },
                data: windspeedData
            }
        ]
    };
    
    charts.stationTrend.setOption(option);
}

/**
 * 导出气象站数据
 */
function exportStationData() {
    // 获取当前选中的气象站ID（可以从模态框中获取）
    const stationName = document.getElementById('detailStationName').textContent;
    showNotification(`导出 ${stationName} 数据功能开发中...`, 'info');
}

/**
 * 配置气象站
 */
function configStation(stationId) {
    const station = stationData.find(s => s.id === stationId);
    if (!station) {
        showNotification('气象站不存在', 'error');
        return;
    }
    
    showNotification(`配置气象站: ${station.name}`, 'info');
}

/**
 * 维护气象站
 */
function maintenanceStation(stationId) {
    const station = stationData.find(s => s.id === stationId);
    if (!station) {
        showNotification('气象站不存在', 'error');
        return;
    }
    
    showNotification(`维护气象站: ${station.name}`, 'info');
}

// ===== 数据操作 =====

/**
 * 查看数据详情
 */
function viewDataDetails(id) {
    const data = weatherData.find(item => item.id === id);
    if (!data) {
        showNotification('数据不存在', 'error');
        return;
    }
    
    showNotification(`查看数据详情: ${data.stationName} ${data.datetime.toLocaleString()}`, 'info');
}

/**
 * 导出数据记录
 */
function exportDataRecord(id) {
    const data = weatherData.find(item => item.id === id);
    if (!data) {
        showNotification('数据不存在', 'error');
        return;
    }
    
    showNotification(`导出数据记录: ${data.stationName}`, 'success');
}

/**
 * 删除数据记录
 */
function deleteDataRecord(id) {
    const data = weatherData.find(item => item.id === id);
    if (!data) {
        showNotification('数据不存在', 'error');
        return;
    }
    
    showConfirm(`确定要删除数据记录吗？\n\n气象站: ${data.stationName}\n时间: ${data.datetime.toLocaleString()}`, () => {
        // 从数据列表中移除
        const index = weatherData.findIndex(item => item.id === id);
        if (index > -1) {
            weatherData.splice(index, 1);
        }
        
        const filteredIndex = filteredData.findIndex(item => item.id === id);
        if (filteredIndex > -1) {
            filteredData.splice(filteredIndex, 1);
        }
        
        selectedRows.delete(id);
        totalRecords = weatherData.length;
        
        renderQualityMonitor();
        
        showNotification('数据记录已删除', 'success');
    });
}

// ===== 其他功能 =====

/**
 * 初始化迷你图表
 */
function initializeMiniCharts() {
    const tempMiniChart = document.getElementById('tempMiniChart');
    const humidityMiniChart = document.getElementById('humidityMiniChart');
    
    if (tempMiniChart) {
        tempMiniChart.textContent = '温度趋势图';
    }
    if (humidityMiniChart) {
        humidityMiniChart.textContent = '湿度趋势图';
    }
}

/**
 * 切换趋势图表指标
 */
let currentTrendMetric = 'temperature';

function switchTrendMetric(metric) {
    // 更新按钮状态
    document.querySelectorAll('.trend-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentTrendMetric = metric;
    updateWeatherTrendChart(metric);
    
    showNotification(`已切换到${getTrendMetricName(metric)}趋势`, 'info');
    console.log(`📊 切换趋势图表到: ${metric}`);
}

function getTrendMetricName(metric) {
    const names = {
        temperature: '温度',
        humidity: '湿度', 
        rainfall: '降雨',
        wind: '风速'
    };
    return names[metric] || metric;
}

/**
 * 切换侧边栏显示/隐藏
 */
let sidebarCollapsed = false;

function toggleSidebar() {
    const sidebar = document.querySelector('.dashboard-sidebar');
    const toggleBtn = document.querySelector('.sidebar-toggle i');
    
    if (!sidebar || !toggleBtn) return;
    
    sidebarCollapsed = !sidebarCollapsed;
    
    if (sidebarCollapsed) {
        sidebar.style.width = '60px';
        sidebar.style.overflow = 'hidden';
        toggleBtn.className = 'fas fa-chevron-left';
        showNotification('侧边栏已折叠', 'info');
    } else {
        sidebar.style.width = '320px';
        sidebar.style.overflow = 'visible';
        toggleBtn.className = 'fas fa-chevron-right';
        showNotification('侧边栏已展开', 'info');
    }
    
    console.log(`📱 侧边栏${sidebarCollapsed ? '折叠' : '展开'}`);
}

/**
 * 导出气象报告
 */
function exportWeatherReport() {
    showNotification('正在生成气象报告...', 'info');
    
    // 模拟报告生成
    setTimeout(() => {
        const reportData = {
            生成时间: new Date().toLocaleString('zh-CN'),
            气象站总数: stationData.length,
            在线气象站: stationData.filter(s => s.status === 'online').length,
            平均温度: (stationData.reduce((sum, s) => sum + s.currentData.temperature, 0) / stationData.length).toFixed(1) + '°C',
            平均湿度: Math.round(stationData.reduce((sum, s) => sum + s.currentData.humidity, 0) / stationData.length) + '%',
            总降雨量: stationData.reduce((sum, s) => sum + s.currentData.rainfall, 0).toFixed(1) + 'mm',
            最大风速: Math.max(...stationData.map(s => s.currentData.windspeed)).toFixed(1) + 'm/s'
        };
        
        console.log('📄 气象报告数据:', reportData);
        showNotification('气象报告生成成功', 'success');
    }, 1500);
}

/**
 * 刷新所有数据 (综合看板版本)
 */
function refreshAllData() {
    showNotification('正在刷新气象数据...', 'info');
    
    // 重新生成模拟数据
    generateMockData();
    
    // 刷新综合看板
    renderComprehensiveDashboard();
    renderQualityMonitor();
    
    // 更新图表
    updateWeatherTrendChart(currentTrendMetric);
    
    showNotification('气象数据已刷新', 'success');
    console.log('🔄 气象数据已刷新');
}

/**
 * 向后兼容的refreshData函数
 */
function refreshData() {
    refreshAllData();
}



/**
 * 显示气象站管理
 */
function showStationManagement() {
    showNotification('气象站管理功能开发中...', 'info');
}





/**
 * 刷新气象站状态
 */
function refreshStationStatus() {
    // 模拟状态更新
    stationData.forEach(station => {
        // 随机更新部分数据
        const data = station.currentData;
        data.temperature += (Math.random() - 0.5) * 2;
        data.humidity += (Math.random() - 0.5) * 5;
        data.rainfall = Math.random() * 2;
        data.windspeed += (Math.random() - 0.5) * 1;
        
        station.lastUpdate = new Date();
    });
    
    renderStationStatus();
    renderWeatherOverview();
    showNotification('气象站状态已更新', 'success');
}

/**
 * 显示气象站地图
 */
function showStationMap() {
    showNotification('气象站地图功能开发中...', 'info');
}

/**
 * 刷新质量状态
 */
function refreshQualityStatus() {
    renderQualityMonitor();
    showNotification('数据质量状态已更新', 'success');
}

// ===== 实时更新 =====

/**
 * 开始实时更新
 */
function startRealTimeUpdate() {
    // 每5分钟更新一次迷你图表
    setInterval(() => {
        Object.keys(charts).forEach(chartId => {
            if (chartId.includes('Chart') && chartId !== 'weatherTrend') {
                updateMiniChart(chartId);
            }
        });
    }, 5 * 60 * 1000);
    
    // 每10分钟更新一次概览数据
    setInterval(() => {
        renderWeatherOverview();
    }, 10 * 60 * 1000);
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
 * 获取温度样式类
 */
function getTemperatureClass(temperature) {
    if (temperature < 0) return 'temp-freezing';
    if (temperature < 10) return 'temp-cold';
    if (temperature < 25) return 'temp-moderate';
    if (temperature < 35) return 'temp-warm';
    return 'temp-hot';
}

/**
 * 获取湿度样式类
 */
function getHumidityClass(humidity) {
    if (humidity < 30) return 'humidity-low';
    if (humidity < 60) return 'humidity-moderate';
    return 'humidity-high';
}

/**
 * 获取降雨量样式类
 */
function getRainfallClass(rainfall) {
    if (rainfall === 0) return 'rainfall-none';
    if (rainfall < 5) return 'rainfall-light';
    if (rainfall < 25) return 'rainfall-moderate';
    return 'rainfall-heavy';
}

/**
 * 获取质量样式类
 */
function getQualityClass(quality) {
    if (quality >= 90) return 'quality-excellent';
    if (quality >= 80) return 'quality-good';
    if (quality >= 70) return 'quality-fair';
    if (quality >= 60) return 'quality-poor';
    return 'quality-bad';
}

/**
 * 获取质量等级文本
 */
function getQualityText(quality) {
    if (quality >= 90) return '优秀';
    if (quality >= 80) return '良好';
    if (quality >= 70) return '一般';
    if (quality >= 60) return '较差';
    return '差';
}
 