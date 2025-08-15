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

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeWeatherPage();
});

/**
 * 页面初始化
 */
function initializeWeatherPage() {
    console.log('🌤️ 初始化气象数据管理页面...');
    
    // 生成模拟数据
    generateMockData();
    
    // 初始化图表
    initializeCharts();
    
    // 渲染页面内容
    renderWeatherOverview();
    renderStationStatus();
    renderDataTable();
    renderQualityMonitor();
    
    // 绑定事件
    bindEvents();
    
    // 开始实时更新
    startRealTimeUpdate();
    
    console.log('✅ 气象数据管理页面初始化完成');
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
 * 渲染气象概览
 */
function renderWeatherOverview() {
    // 计算平均值
    const recentData = weatherData.slice(0, 100); // 最近100条数据
    
    const avgTemp = recentData.reduce((sum, item) => sum + item.temperature, 0) / recentData.length;
    const avgHumidity = recentData.reduce((sum, item) => sum + item.humidity, 0) / recentData.length;
    const todayRainfall = recentData
        .filter(item => item.datetime.toDateString() === new Date().toDateString())
        .reduce((sum, item) => sum + item.rainfall, 0);
    const avgWindSpeed = recentData.reduce((sum, item) => sum + item.windspeed, 0) / recentData.length;
    
    // 更新显示值
    document.getElementById('avgTemperature').textContent = avgTemp.toFixed(1);
    document.getElementById('avgHumidity').textContent = Math.round(avgHumidity);
    document.getElementById('todayRainfall').textContent = todayRainfall.toFixed(1);
    document.getElementById('avgWindSpeed').textContent = avgWindSpeed.toFixed(1);
}

/**
 * 渲染气象站状态
 */
function renderStationStatus() {
    const stationGrid = document.getElementById('stationGrid');
    if (!stationGrid) return;
    
    stationGrid.innerHTML = stationData.map(station => {
        const statusText = {
            online: '在线',
            offline: '离线',
            maintenance: '维护中'
        }[station.status];
        
        const data = station.currentData;
        const timeDiff = Math.floor((Date.now() - station.lastUpdate) / 60000); // 分钟
        
        return `
            <div class="station-card">
                <div class="station-header">
                    <div class="station-info">
                        <h4>${station.name}</h4>
                        <div class="station-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${station.location}
                        </div>
                    </div>
                    <div class="station-status-badge ${station.status}">
                        <span class="status-dot"></span>
                        ${statusText}
                    </div>
                </div>
                
                <div class="station-data">
                    <div class="data-item">
                        <span class="data-value temperature-value">${data.temperature.toFixed(1)}</span>
                        <span class="data-label">温度 (°C)</span>
                    </div>
                    <div class="data-item">
                        <span class="data-value humidity-value">${Math.round(data.humidity)}</span>
                        <span class="data-label">湿度 (%)</span>
                    </div>
                    <div class="data-item">
                        <span class="data-value rainfall-value">${data.rainfall.toFixed(1)}</span>
                        <span class="data-label">降雨 (mm)</span>
                    </div>
                    <div class="data-item">
                        <span class="data-value windspeed-value">${data.windspeed.toFixed(1)}</span>
                        <span class="data-label">风速 (m/s)</span>
                    </div>
                </div>
                
                <div class="station-actions">
                    <button class="station-btn view" onclick="viewStationDetails('${station.id}')" 
                            data-tooltip="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="station-btn config" onclick="configStation('${station.id}')"
                            data-tooltip="配置设置">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="station-btn maintenance" onclick="maintenanceStation('${station.id}')"
                            data-tooltip="维护管理">
                        <i class="fas fa-tools"></i>
                    </button>
                </div>
                
                <div class="station-footer">
                    <small class="text-muted">最后更新: ${timeDiff}分钟前</small>
                </div>
            </div>
        `;
    }).join('');
}

/**
 * 渲染数据表格
 */
function renderDataTable() {
    const tbody = document.getElementById('tableBody');
    if (!tbody) return;
    
    // 计算当前页的数据
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    if (pageData.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="9" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>暂无数据</h3>
                        <p>当前筛选条件下没有找到匹配的气象数据</p>
                    </div>
                </td>
            </tr>
        `;
        updatePaginationInfo(0, 0, 0);
        return;
    }
    
    tbody.innerHTML = pageData.map(item => `
        <tr ${selectedRows.has(item.id) ? 'class="selected"' : ''}>
            <td>
                <input type="checkbox" ${selectedRows.has(item.id) ? 'checked' : ''} 
                       onchange="toggleRowSelection('${item.id}')">
            </td>
            <td>
                <div class="station-cell">
                    <strong>${item.stationName}</strong>
                    <small>${item.stationId}</small>
                </div>
            </td>
            <td>
                <div class="datetime-cell">
                    <div>${item.datetime.toLocaleDateString('zh-CN')}</div>
                    <small>${item.datetime.toLocaleTimeString('zh-CN')}</small>
                </div>
            </td>
            <td>
                <span class="temperature-value ${getTemperatureClass(item.temperature)}">
                    ${item.temperature.toFixed(1)}
                </span>
            </td>
            <td>
                <span class="humidity-value ${getHumidityClass(item.humidity)}">
                    ${Math.round(item.humidity)}
                </span>
            </td>
            <td>
                <span class="rainfall-value ${getRainfallClass(item.rainfall)}">
                    ${item.rainfall.toFixed(1)}
                </span>
            </td>
            <td>
                <span class="windspeed-value ${getWindSpeedClass(item.windspeed)}">
                    ${item.windspeed.toFixed(1)}
                </span>
            </td>
            <td>
                <div class="quality-score">
                    <div class="quality-bar">
                        <div class="quality-fill ${getQualityLevel(item.quality)}" 
                             style="width: ${item.quality}%"></div>
                    </div>
                    <span class="quality-text">${Math.round(item.quality)}%</span>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewDataDetails('${item.id}')" 
                            data-tooltip="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn download" onclick="exportDataRecord('${item.id}')"
                            data-tooltip="导出记录">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteDataRecord('${item.id}')"
                            data-tooltip="删除记录">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // 更新分页信息
    updatePaginationInfo(startIndex + 1, Math.min(endIndex, filteredData.length), filteredData.length);
    updatePaginationControls();
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
    const totalPages = Math.ceil(filteredData.length / pageSize);
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
    const filters = ['stationFilter', 'dataTypeFilter', 'timeGranularity', 'startDate', 'endDate'];
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
 * 切换图表类型
 */
function switchChart(chartType) {
    currentChart = chartType;
    
    // 更新标签页样式
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新图表
    updateWeatherTrendChart(chartType);
    
    showNotification(`已切换到${getChartTypeName(chartType)}图表`, 'success');
}

/**
 * 获取图表类型名称
 */
function getChartTypeName(chartType) {
    const names = {
        temperature: '温度',
        humidity: '湿度',
        rainfall: '降雨量',
        windspeed: '风速'
    };
    return names[chartType] || chartType;
}

/**
 * 刷新图表
 */
function refreshChart() {
    updateWeatherTrendChart(currentChart);
    showNotification('图表已刷新', 'success');
}

/**
 * 导出图表
 */
function exportChart() {
    if (!charts.weatherTrend) {
        showNotification('图表不存在', 'error');
        return;
    }
    
    const url = charts.weatherTrend.getDataURL({
        type: 'png',
        pixelRatio: 2,
        backgroundColor: '#fff'
    });
    
    const link = document.createElement('a');
    link.download = `weather_${currentChart}_chart_${new Date().getTime()}.png`;
    link.href = url;
    link.click();
    
    showNotification('图表已导出', 'success');
}

/**
 * 全屏显示图表
 */
function fullscreenChart() {
    showNotification('全屏功能开发中...', 'info');
}

/**
 * 应用筛选
 */
function applyFilters() {
    const station = document.getElementById('stationFilter')?.value || '';
    const dataType = document.getElementById('dataTypeFilter')?.value || '';
    const granularity = document.getElementById('timeGranularity')?.value || 'hourly';
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    const searchText = document.querySelector('.search-input')?.value?.toLowerCase() || '';
    
    filteredData = weatherData.filter(item => {
        // 气象站筛选
        if (station && item.stationId !== station) {
            return false;
        }
        
        // 时间范围筛选
        if (startDate) {
            const start = new Date(startDate);
            if (item.datetime < start) return false;
        }
        
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            if (item.datetime > end) return false;
        }
        
        // 搜索文本筛选
        if (searchText) {
            const searchFields = [item.stationName, item.stationId].join(' ').toLowerCase();
            if (!searchFields.includes(searchText)) {
                return false;
            }
        }
        
        return true;
    });
    
    // 重置到第一页
    currentPage = 1;
    selectedRows.clear();
    
    renderDataTable();
    renderQualityMonitor();
    
    const filterCount = [station, startDate, endDate, searchText].filter(Boolean).length;
    if (filterCount > 0) {
        showNotification(`已应用 ${filterCount} 个筛选条件，找到 ${filteredData.length} 条记录`, 'info');
    }
}

/**
 * 清除筛选
 */
function clearFilters() {
    // 清除筛选器值
    const filterElements = [
        'stationFilter',
        'dataTypeFilter', 
        'startDate',
        'endDate'
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    // 重置时间粒度
    const granularityEl = document.getElementById('timeGranularity');
    if (granularityEl) granularityEl.value = 'hourly';
    
    // 清除搜索框
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    // 重置数据
    filteredData = [...weatherData];
    currentPage = 1;
    selectedRows.clear();
    
    renderDataTable();
    renderQualityMonitor();
    
    showNotification('已清除所有筛选条件', 'success');
}

/**
 * 处理搜索
 */
function handleSearch() {
    applyFilters();
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
    
    renderDataTable();
}

/**
 * 切换页面
 */
function changePage(action) {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    
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
    renderDataTable();
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
    filteredData.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        if (field === 'datetime') {
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
    renderDataTable();
    
    showNotification(`已按${getSortFieldName(field)}${currentSort.order === 'asc' ? '升序' : '降序'}排列`, 'success');
}

/**
 * 获取排序字段名称
 */
function getSortFieldName(field) {
    const fieldNames = {
        station: '气象站',
        datetime: '观测时间',
        temperature: '温度',
        humidity: '湿度',
        rainfall: '降雨量',
        windspeed: '风速',
        quality: '数据质量'
    };
    return fieldNames[field] || field;
}

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
    
    showNotification(`查看气象站详情: ${station.name}`, 'info');
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
        
        renderDataTable();
        renderQualityMonitor();
        
        showNotification('数据记录已删除', 'success');
    });
}

// ===== 其他功能 =====

/**
 * 显示气象站管理
 */
function showStationManagement() {
    showNotification('气象站管理功能开发中...', 'info');
}

/**
 * 显示数据导入
 */
function showDataImport() {
    const modal = document.getElementById('importModal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * 关闭导入模态框
 */
function closeImportModal() {
    const modal = document.getElementById('importModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 选择导入类型
 */
function selectImportType(type) {
    // 移除其他选中状态
    document.querySelectorAll('.import-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // 选中当前选项
    event.currentTarget.classList.add('selected');
    
    const typeNames = {
        file: '文件导入',
        api: 'API接口导入',
        manual: '手动录入'
    };
    
    showNotification(`已选择 ${typeNames[type]}`, 'success');
}

/**
 * 导出数据
 */
function exportData() {
    showNotification('数据导出功能开发中...', 'info');
}

/**
 * 生成报表
 */
function generateReport() {
    showNotification('报表生成功能开发中...', 'info');
}

/**
 * 数据质量检查
 */
function dataQualityCheck() {
    showNotification('正在进行数据质量检查...', 'info');
    
    setTimeout(() => {
        renderQualityMonitor();
        showNotification('数据质量检查完成', 'success');
    }, 2000);
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
 
 
 
 
 
 
 
 
 