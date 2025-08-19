/**
 * 业务统计报表页面JavaScript
 * 负责业务数据分析、统计图表和报表生成
 */

// 全局变量
let currentPage = 1;
const itemsPerPage = 10;
let totalRecords = 0;
let businessData = [];
let filteredBusinessData = [];
let businessCharts = {};
let currentDateRange = {
    start: null,
    end: null
};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadBusinessData();
    setupEventListeners();
    initializeCharts();
    setupDateRange();
});

/**
 * 初始化页面
 */
function initializePage() {
    // 初始化侧边栏
    initializeSidebar();
    
    // 初始化用户下拉菜单
    initializeUserDropdown();
    
    // 设置当前时间
    updateLastRefreshTime();
    
    console.log('业务统计报表页面初始化完成');
}

/**
 * 设置日期范围
 */
function setupDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    
    currentDateRange.start = startDate;
    currentDateRange.end = endDate;
}

/**
 * 加载业务数据
 */
async function loadBusinessData() {
    try {
        showLoading();
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 加载概览数据
        loadOverviewData();
        
        // 加载业务详细数据
        loadDetailedBusinessData();
        
        // 更新图表
        updateAllCharts();
        
        // 更新排行榜
        updateRankingList();
        
        hideLoading();
        showNotification('业务统计数据加载完成', 'success');
        
    } catch (error) {
        console.error('加载业务数据失败:', error);
        hideLoading();
        showNotification('加载数据失败，请重试', 'error');
    }
}

/**
 * 加载概览数据
 */
function loadOverviewData() {
    const overviewData = {
        monitoringArea: { value: 12456, trend: 8.5 },
        satelliteImages: { value: 1247, trend: 12.3 },
        disasterAlerts: { value: 23, trend: -15.2 },
        yieldForecast: { value: 8934, trend: 5.7 }
    };
    
    // 更新概览卡片
    Object.keys(overviewData).forEach(key => {
        const data = overviewData[key];
        const element = document.getElementById(key);
        if (element) {
            animateNumber(element, data.value);
        }
    });
}

/**
 * 加载详细业务数据
 */
function loadDetailedBusinessData() {
    // 模拟业务数据
    businessData = [
        {
            id: 1,
            type: 'monitoring',
            typeText: '作物监测',
            region: '北部地区',
            area: 1250.5,
            cropType: '小麦',
            accuracy: 94.2,
            processTime: '2024-01-15 14:30:25',
            status: 'completed',
            statusText: '已完成'
        },
        {
            id: 2,
            type: 'analysis',
            typeText: '长势分析',
            region: '南部地区',
            area: 890.3,
            cropType: '玉米',
            accuracy: 91.8,
            processTime: '2024-01-15 13:45:12',
            status: 'processing',
            statusText: '处理中'
        },
        {
            id: 3,
            type: 'forecast',
            typeText: '产量预测',
            region: '东部地区',
            area: 2150.7,
            cropType: '水稻',
            accuracy: 96.5,
            processTime: '2024-01-15 12:20:45',
            status: 'completed',
            statusText: '已完成'
        },
        {
            id: 4,
            type: 'alert',
            typeText: '灾害预警',
            region: '西部地区',
            area: 650.2,
            cropType: '大豆',
            accuracy: 88.9,
            processTime: '2024-01-15 11:15:30',
            status: 'pending',
            statusText: '待处理'
        },
        {
            id: 5,
            type: 'monitoring',
            typeText: '土壤监测',
            region: '中部地区',
            area: 1450.8,
            cropType: '棉花',
            accuracy: 92.3,
            processTime: '2024-01-15 10:30:15',
            status: 'completed',
            statusText: '已完成'
        }
    ];
    
    totalRecords = businessData.length;
    filteredBusinessData = [...businessData];
    
    // 渲染业务数据表格
    renderBusinessTable();
    updateBusinessPagination();
}

/**
 * 初始化图表
 */
function initializeCharts() {
    // 初始化业务趋势图
    initBusinessTrendChart();
    
    // 初始化作物分布图
    initCropDistributionChart();
    
    // 初始化设备使用率图
    initDeviceUsageChart();
    
    // 初始化区域对比图
    initRegionComparisonChart();
}

/**
 * 初始化业务趋势图
 */
function initBusinessTrendChart() {
    const chartElement = document.getElementById('businessTrendChart');
    if (!chartElement) return;
    
    businessCharts.trendChart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['监测面积', '影像数量', '产量预估', '预警次数'],
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: generateMonthRange(12)
        },
        yAxis: [
            {
                type: 'value',
                name: '面积(公顷)/数量',
                position: 'left'
            },
            {
                type: 'value',
                name: '产量(吨)',
                position: 'right'
            }
        ],
        series: [
            {
                name: '监测面积',
                type: 'line',
                smooth: true,
                data: generateBusinessTrendData(12, 8000, 15000),
                itemStyle: { color: '#1890ff' },
                areaStyle: { opacity: 0.3 }
            },
            {
                name: '影像数量',
                type: 'bar',
                data: generateBusinessTrendData(12, 800, 1500),
                itemStyle: { color: '#52c41a' }
            },
            {
                name: '产量预估',
                type: 'line',
                smooth: true,
                yAxisIndex: 1,
                data: generateBusinessTrendData(12, 6000, 12000),
                itemStyle: { color: '#722ed1' }
            },
            {
                name: '预警次数',
                type: 'line',
                smooth: true,
                data: generateBusinessTrendData(12, 10, 50),
                itemStyle: { color: '#faad14' }
            }
        ]
    };
    
    businessCharts.trendChart.setOption(option);
}

/**
 * 初始化作物分布图
 */
function initCropDistributionChart() {
    const chartElement = document.getElementById('cropDistributionChart');
    if (!chartElement) return;
    
    businessCharts.cropChart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}公顷 ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: ['小麦', '玉米', '水稻', '大豆', '棉花', '其他']
        },
        series: [
            {
                name: '作物分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                data: [
                    { value: 3250, name: '小麦', itemStyle: { color: '#1890ff' } },
                    { value: 2890, name: '玉米', itemStyle: { color: '#52c41a' } },
                    { value: 2150, name: '水稻', itemStyle: { color: '#722ed1' } },
                    { value: 1650, name: '大豆', itemStyle: { color: '#faad14' } },
                    { value: 1450, name: '棉花', itemStyle: { color: '#13c2c2' } },
                    { value: 1066, name: '其他', itemStyle: { color: '#eb2f96' } }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    
    businessCharts.cropChart.setOption(option);
}

/**
 * 初始化设备使用率图
 */
function initDeviceUsageChart() {
    const chartElement = document.getElementById('deviceUsageChart');
    if (!chartElement) return;
    
    businessCharts.deviceChart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['气象站', '土壤传感器', '摄像头', '无人机', '卫星接收器']
        },
        yAxis: {
            type: 'value',
            name: '使用率 (%)',
            max: 100
        },
        series: [
            {
                name: '设备使用率',
                type: 'bar',
                data: [
                    { value: 92.5, itemStyle: { color: '#52c41a' } },
                    { value: 87.3, itemStyle: { color: '#1890ff' } },
                    { value: 94.8, itemStyle: { color: '#52c41a' } },
                    { value: 78.9, itemStyle: { color: '#faad14' } },
                    { value: 96.2, itemStyle: { color: '#52c41a' } }
                ],
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%'
                }
            }
        ]
    };
    
    businessCharts.deviceChart.setOption(option);
}

/**
 * 初始化区域对比图
 */
function initRegionComparisonChart() {
    const chartElement = document.getElementById('regionComparisonChart');
    if (!chartElement) return;
    
    businessCharts.regionChart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['监测面积', '产量预估'],
            top: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['北部地区', '南部地区', '东部地区', '西部地区', '中部地区']
        },
        yAxis: [
            {
                type: 'value',
                name: '面积(公顷)',
                position: 'left'
            },
            {
                type: 'value',
                name: '产量(吨)',
                position: 'right'
            }
        ],
        series: [
            {
                name: '监测面积',
                type: 'bar',
                data: [3250, 2890, 2150, 1650, 2516],
                itemStyle: { color: '#1890ff' }
            },
            {
                name: '产量预估',
                type: 'line',
                yAxisIndex: 1,
                data: [2456, 2180, 1890, 1234, 1890],
                itemStyle: { color: '#52c41a' }
            }
        ]
    };
    
    businessCharts.regionChart.setOption(option);
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 日期范围应用
    const applyDateRange = document.getElementById('applyDateRange');
    if (applyDateRange) {
        applyDateRange.addEventListener('click', handleDateRangeChange);
    }
    
    // 刷新按钮
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefresh);
    }
    
    // 导出报表按钮
    const exportReportBtn = document.getElementById('exportReportBtn');
    if (exportReportBtn) {
        exportReportBtn.addEventListener('click', handleExportReport);
    }
    
    // 图表控制按钮
    const chartBtns = document.querySelectorAll('.chart-btn');
    chartBtns.forEach(btn => {
        btn.addEventListener('click', handleChartMetricChange);
    });
    
    // 作物区域选择
    const cropRegion = document.getElementById('cropRegion');
    if (cropRegion) {
        cropRegion.addEventListener('change', handleCropRegionChange);
    }
    
    // 对比指标选择
    const comparisonMetric = document.getElementById('comparisonMetric');
    if (comparisonMetric) {
        comparisonMetric.addEventListener('change', handleComparisonMetricChange);
    }
    
    // 排行指标选择
    const rankingMetric = document.getElementById('rankingMetric');
    if (rankingMetric) {
        rankingMetric.addEventListener('change', handleRankingMetricChange);
    }
    
    // 搜索业务数据
    const searchBusiness = document.getElementById('searchBusiness');
    if (searchBusiness) {
        searchBusiness.addEventListener('input', handleSearchBusiness);
    }
    
    // 业务类型过滤
    const businessFilter = document.getElementById('businessFilter');
    if (businessFilter) {
        businessFilter.addEventListener('change', handleBusinessFilter);
    }
    
    // 导出表格
    const exportTableBtn = document.getElementById('exportTableBtn');
    if (exportTableBtn) {
        exportTableBtn.addEventListener('click', handleExportTable);
    }
    
    // 全选复选框
    const selectAllBusiness = document.getElementById('selectAllBusiness');
    if (selectAllBusiness) {
        selectAllBusiness.addEventListener('change', handleSelectAllBusiness);
    }
    
    // 分页控制
    setupBusinessPaginationListeners();
    
    // 模态框事件
    setupBusinessModalListeners();
    
    // 窗口大小变化时重新调整图表
    window.addEventListener('resize', () => {
        Object.values(businessCharts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    });
}

/**
 * 处理日期范围变化
 */
function handleDateRangeChange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (!startDate || !endDate) {
        showNotification('请选择完整的日期范围', 'warning');
        return;
    }
    
    if (new Date(startDate) > new Date(endDate)) {
        showNotification('开始日期不能大于结束日期', 'error');
        return;
    }
    
    currentDateRange.start = new Date(startDate);
    currentDateRange.end = new Date(endDate);
    
    // 重新加载数据
    loadBusinessData();
    showNotification('日期范围已更新', 'success');
}

/**
 * 处理刷新
 */
async function handleRefresh() {
    const refreshBtn = document.getElementById('refreshBtn');
    const icon = refreshBtn.querySelector('i');
    
    // 添加旋转动画
    icon.classList.add('fa-spin');
    refreshBtn.disabled = true;
    
    try {
        await loadBusinessData();
        updateLastRefreshTime();
    } finally {
        // 移除旋转动画
        setTimeout(() => {
            icon.classList.remove('fa-spin');
            refreshBtn.disabled = false;
        }, 1000);
    }
}

/**
 * 处理导出报表
 */
async function handleExportReport() {
    try {
        showLoading('正在生成业务统计报表...');
        
        // 模拟报表生成
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 创建报表数据
        const reportData = {
            title: '业务统计报表',
            dateRange: `${currentDateRange.start.toLocaleDateString()} - ${currentDateRange.end.toLocaleDateString()}`,
            generateTime: new Date().toLocaleString('zh-CN'),
            overview: {
                monitoringArea: 12456,
                satelliteImages: 1247,
                disasterAlerts: 23,
                yieldForecast: 8934
            },
            details: businessData
        };
        
        // 下载报表
        downloadBusinessReport(reportData);
        
        hideLoading();
        showNotification('业务统计报表导出完成', 'success');
        
    } catch (error) {
        console.error('导出报表失败:', error);
        hideLoading();
        showNotification('导出报表失败，请重试', 'error');
    }
}

/**
 * 处理图表指标变化
 */
function handleChartMetricChange(event) {
    const metric = event.target.dataset.metric;
    
    // 更新按钮状态
    document.querySelectorAll('.chart-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新图表数据
    updateTrendChartByMetric(metric);
    showNotification(`已切换到${event.target.textContent}视图`, 'success');
}

/**
 * 根据指标更新趋势图
 */
function updateTrendChartByMetric(metric) {
    const option = businessCharts.trendChart.getOption();
    
    // 根据选择的指标突出显示对应的系列
    option.series.forEach((series, index) => {
        if (
            (metric === 'area' && series.name === '监测面积') ||
            (metric === 'images' && series.name === '影像数量') ||
            (metric === 'yield' && series.name === '产量预估') ||
            (metric === 'alerts' && series.name === '预警次数')
        ) {
            series.emphasis = { focus: 'series' };
            series.lineStyle = { width: 4 };
        } else {
            series.emphasis = { focus: 'none' };
            series.lineStyle = { width: 2 };
        }
    });
    
    businessCharts.trendChart.setOption(option);
}

/**
 * 处理作物区域变化
 */
function handleCropRegionChange(event) {
    const region = event.target.value;
    
    // 根据区域更新作物分布数据
    let cropData;
    switch (region) {
        case 'north':
            cropData = [
                { value: 1200, name: '小麦', itemStyle: { color: '#1890ff' } },
                { value: 800, name: '玉米', itemStyle: { color: '#52c41a' } },
                { value: 600, name: '大豆', itemStyle: { color: '#faad14' } },
                { value: 400, name: '其他', itemStyle: { color: '#eb2f96' } }
            ];
            break;
        case 'south':
            cropData = [
                { value: 1500, name: '水稻', itemStyle: { color: '#722ed1' } },
                { value: 1000, name: '玉米', itemStyle: { color: '#52c41a' } },
                { value: 800, name: '棉花', itemStyle: { color: '#13c2c2' } },
                { value: 500, name: '其他', itemStyle: { color: '#eb2f96' } }
            ];
            break;
        default:
            cropData = [
                { value: 3250, name: '小麦', itemStyle: { color: '#1890ff' } },
                { value: 2890, name: '玉米', itemStyle: { color: '#52c41a' } },
                { value: 2150, name: '水稻', itemStyle: { color: '#722ed1' } },
                { value: 1650, name: '大豆', itemStyle: { color: '#faad14' } },
                { value: 1450, name: '棉花', itemStyle: { color: '#13c2c2' } },
                { value: 1066, name: '其他', itemStyle: { color: '#eb2f96' } }
            ];
    }
    
    const option = businessCharts.cropChart.getOption();
    option.series[0].data = cropData;
    option.legend[0].data = cropData.map(item => item.name);
    
    businessCharts.cropChart.setOption(option);
    showNotification(`已切换到${event.target.options[event.target.selectedIndex].text}`, 'success');
}

/**
 * 处理对比指标变化
 */
function handleComparisonMetricChange(event) {
    const metric = event.target.value;
    
    // 根据指标更新区域对比数据
    let seriesData;
    switch (metric) {
        case 'yield':
            seriesData = [
                {
                    name: '产量预估',
                    type: 'bar',
                    data: [2456, 2180, 1890, 1234, 1890],
                    itemStyle: { color: '#52c41a' }
                }
            ];
            break;
        case 'efficiency':
            seriesData = [
                {
                    name: '监测效率',
                    type: 'bar',
                    data: [92.5, 87.3, 94.8, 78.9, 96.2],
                    itemStyle: { color: '#1890ff' }
                }
            ];
            break;
        default:
            seriesData = [
                {
                    name: '监测面积',
                    type: 'bar',
                    data: [3250, 2890, 2150, 1650, 2516],
                    itemStyle: { color: '#1890ff' }
                },
                {
                    name: '产量预估',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [2456, 2180, 1890, 1234, 1890],
                    itemStyle: { color: '#52c41a' }
                }
            ];
    }
    
    const option = businessCharts.regionChart.getOption();
    option.series = seriesData;
    option.legend[0].data = seriesData.map(s => s.name);
    
    businessCharts.regionChart.setOption(option);
    showNotification(`已切换到${event.target.options[event.target.selectedIndex].text}对比`, 'success');
}

/**
 * 更新排行榜
 */
function updateRankingList(metric = 'area') {
    const rankingData = {
        area: [
            { name: '北部地区', value: 3250, unit: '公顷' },
            { name: '中部地区', value: 2516, unit: '公顷' },
            { name: '南部地区', value: 2890, unit: '公顷' },
            { name: '东部地区', value: 2150, unit: '公顷' },
            { name: '西部地区', value: 1650, unit: '公顷' }
        ],
        accuracy: [
            { name: '东部地区', value: 96.5, unit: '%' },
            { name: '北部地区', value: 94.2, unit: '%' },
            { name: '中部地区', value: 92.3, unit: '%' },
            { name: '南部地区', value: 91.8, unit: '%' },
            { name: '西部地区', value: 88.9, unit: '%' }
        ],
        alerts: [
            { name: '北部地区', value: 95.8, unit: '%' },
            { name: '东部地区', value: 93.2, unit: '%' },
            { name: '中部地区', value: 91.5, unit: '%' },
            { name: '南部地区', value: 89.7, unit: '%' },
            { name: '西部地区', value: 87.3, unit: '%' }
        ],
        yield: [
            { name: '东部地区', value: 94.8, unit: '%' },
            { name: '北部地区', value: 92.1, unit: '%' },
            { name: '中部地区', value: 90.5, unit: '%' },
            { name: '南部地区', value: 88.9, unit: '%' },
            { name: '西部地区', value: 86.2, unit: '%' }
        ]
    };
    
    const data = rankingData[metric];
    const rankingList = document.getElementById('rankingList');
    
    if (rankingList && data) {
        rankingList.innerHTML = data.map((item, index) => `
            <div class="ranking-item">
                <div class="ranking-number ${index < 3 ? 'top-three' : ''}">${index + 1}</div>
                <div class="ranking-info">
                    <div class="ranking-name">${item.name}</div>
                    <div class="ranking-value">${item.value.toLocaleString()} ${item.unit}</div>
                </div>
                <div class="ranking-bar">
                    <div class="bar-fill" style="width: ${(item.value / data[0].value) * 100}%"></div>
                </div>
            </div>
        `).join('');
    }
}

/**
 * 处理排行指标变化
 */
function handleRankingMetricChange(event) {
    const metric = event.target.value;
    updateRankingList(metric);
    showNotification(`已切换到${event.target.options[event.target.selectedIndex].text}排行`, 'success');
}

/**
 * 处理搜索业务数据
 */
function handleSearchBusiness(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredBusinessData = [...businessData];
    } else {
        filteredBusinessData = businessData.filter(business => 
            business.typeText.toLowerCase().includes(searchTerm) ||
            business.region.toLowerCase().includes(searchTerm) ||
            business.cropType.toLowerCase().includes(searchTerm)
        );
    }
    
    totalRecords = filteredBusinessData.length;
    currentPage = 1;
    renderBusinessTable();
    updateBusinessPagination();
}

/**
 * 处理业务类型过滤
 */
function handleBusinessFilter(event) {
    const filterType = event.target.value;
    
    if (filterType === 'all') {
        filteredBusinessData = [...businessData];
    } else {
        filteredBusinessData = businessData.filter(business => business.type === filterType);
    }
    
    totalRecords = filteredBusinessData.length;
    currentPage = 1;
    renderBusinessTable();
    updateBusinessPagination();
}

/**
 * 处理导出表格
 */
function handleExportTable() {
    const csvContent = generateCSVContent(filteredBusinessData);
    downloadCSV(csvContent, '业务统计数据.csv');
    showNotification('表格数据导出完成', 'success');
}

/**
 * 处理全选业务数据
 */
function handleSelectAllBusiness(event) {
    const checkboxes = document.querySelectorAll('#businessTableBody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = event.target.checked;
    });
}

/**
 * 渲染业务数据表格
 */
function renderBusinessTable() {
    const tbody = document.getElementById('businessTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredBusinessData.length);
    const pageData = filteredBusinessData.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map(business => `
        <tr>
            <td>
                <input type="checkbox" value="${business.id}">
            </td>
            <td>
                <div class="business-type">
                    <i class="fas ${getBusinessIcon(business.type)}"></i>
                    <span>${business.typeText}</span>
                </div>
            </td>
            <td>${business.region}</td>
            <td>${business.area.toLocaleString()}</td>
            <td>
                <span class="crop-tag">${business.cropType}</span>
            </td>
            <td>
                <div class="accuracy-display">
                    <span class="accuracy-value">${business.accuracy}%</span>
                    <div class="accuracy-bar">
                        <div class="accuracy-fill" style="width: ${business.accuracy}%"></div>
                    </div>
                </div>
            </td>
            <td>${business.processTime}</td>
            <td>
                <span class="status-badge ${business.status}">${business.statusText}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-ghost btn-sm" onclick="viewBusinessDetail(${business.id})" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="downloadBusinessReport(${business.id})" title="下载报告">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * 获取业务类型图标
 */
function getBusinessIcon(type) {
    const icons = {
        monitoring: 'fa-eye',
        analysis: 'fa-chart-line',
        forecast: 'fa-chart-bar',
        alert: 'fa-exclamation-triangle'
    };
    return icons[type] || 'fa-file';
}

/**
 * 查看业务详情
 */
function viewBusinessDetail(id) {
    const business = businessData.find(b => b.id === id);
    if (!business) return;
    
    // 填充详情数据
    document.getElementById('detailBusinessType').textContent = business.typeText;
    document.getElementById('detailRegion').textContent = business.region;
    document.getElementById('detailArea').textContent = `${business.area.toLocaleString()} 公顷`;
    document.getElementById('detailCropType').textContent = business.cropType;
    document.getElementById('detailAccuracy').textContent = `${business.accuracy}%`;
    document.getElementById('detailProcessTime').textContent = business.processTime;
    
    // 显示模态框
    const modal = document.getElementById('businessDetailModal');
    modal.classList.add('show');
    
    // 初始化指标图表
    setTimeout(() => {
        initBusinessMetricsChart(business);
    }, 300);
}

/**
 * 初始化业务指标图表
 */
function initBusinessMetricsChart(business) {
    const chartElement = document.getElementById('metricsChart');
    if (!chartElement) return;
    
    const chart = echarts.init(chartElement);
    
    const option = {
        title: {
            text: `${business.typeText} - 业务指标`,
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        radar: {
            indicator: [
                { name: '监测精度', max: 100 },
                { name: '处理速度', max: 100 },
                { name: '数据质量', max: 100 },
                { name: '覆盖范围', max: 100 },
                { name: '时效性', max: 100 }
            ]
        },
        series: [
            {
                name: '业务指标',
                type: 'radar',
                data: [
                    {
                        value: [business.accuracy, 85.3, 92.1, 88.7, 91.5],
                        name: business.typeText,
                        itemStyle: { color: '#1890ff' }
                    }
                ]
            }
        ]
    };
    
    chart.setOption(option);
}

/**
 * 设置业务分页监听器
 */
function setupBusinessPaginationListeners() {
    const prevPage = document.getElementById('businessPrevPage');
    const nextPage = document.getElementById('businessNextPage');
    
    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderBusinessTable();
                updateBusinessPagination();
            }
        });
    }
    
    if (nextPage) {
        nextPage.addEventListener('click', () => {
            const maxPage = Math.ceil(totalRecords / itemsPerPage);
            if (currentPage < maxPage) {
                currentPage++;
                renderBusinessTable();
                updateBusinessPagination();
            }
        });
    }
}

/**
 * 更新业务分页信息
 */
function updateBusinessPagination() {
    const maxPage = Math.ceil(totalRecords / itemsPerPage);
    const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);
    
    // 更新分页信息
    const pageStart = document.getElementById('businessPageStart');
    const pageEnd = document.getElementById('businessPageEnd');
    const totalRecordsElement = document.getElementById('businessTotalRecords');
    
    if (pageStart) pageStart.textContent = startRecord;
    if (pageEnd) pageEnd.textContent = endRecord;
    if (totalRecordsElement) totalRecordsElement.textContent = totalRecords;
    
    // 更新分页按钮状态
    const prevPage = document.getElementById('businessPrevPage');
    const nextPage = document.getElementById('businessNextPage');
    
    if (prevPage) {
        prevPage.disabled = currentPage <= 1;
    }
    
    if (nextPage) {
        nextPage.disabled = currentPage >= maxPage;
    }
    
    // 更新页码
    updateBusinessPageNumbers(maxPage);
}

/**
 * 更新业务页码显示
 */
function updateBusinessPageNumbers(maxPage) {
    const pageNumbers = document.getElementById('businessPageNumbers');
    if (!pageNumbers) return;
    
    let html = '';
    const showPages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(maxPage, startPage + showPages - 1);
    
    if (endPage - startPage + 1 < showPages) {
        startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToBusinessPage(${i})">
                ${i}
            </button>
        `;
    }
    
    pageNumbers.innerHTML = html;
}

/**
 * 跳转到指定业务页码
 */
function goToBusinessPage(page) {
    currentPage = page;
    renderBusinessTable();
    updateBusinessPagination();
}

/**
 * 设置业务模态框监听器
 */
function setupBusinessModalListeners() {
    // 关闭模态框
    const closeModal = document.getElementById('closeBusinessModal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('businessDetailModal').classList.remove('show');
        });
    }
    
    // 点击遮罩关闭模态框
    const modalOverlay = document.getElementById('businessDetailModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('show');
            }
        });
    }
    
    // 标签页切换
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchBusinessTab(tabName);
        });
    });
}

/**
 * 切换业务标签页
 */
function switchBusinessTab(tabName) {
    // 更新标签按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // 更新标签页内容
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}Tab`).classList.add('active');
}

/**
 * 更新所有图表
 */
function updateAllCharts() {
    Object.values(businessCharts).forEach(chart => {
        if (chart && chart.resize) {
            chart.resize();
        }
    });
}

/**
 * 下载业务报表
 */
function downloadBusinessReport(reportData) {
    const content = `
# ${reportData.title}

统计周期: ${reportData.dateRange}
生成时间: ${reportData.generateTime}

## 业务概览

- 监测面积: ${reportData.overview.monitoringArea.toLocaleString()} 公顷
- 遥感影像: ${reportData.overview.satelliteImages.toLocaleString()} 景
- 灾害预警: ${reportData.overview.disasterAlerts} 次
- 产量预估: ${reportData.overview.yieldForecast.toLocaleString()} 吨

## 业务详情

${reportData.details.map(business => `
### ${business.typeText} - ${business.region}
- 监测面积: ${business.area.toLocaleString()} 公顷
- 作物类型: ${business.cropType}
- 监测精度: ${business.accuracy}%
- 处理时间: ${business.processTime}
- 状态: ${business.statusText}
`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `业务统计报表_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 生成CSV内容
 */
function generateCSVContent(data) {
    const headers = ['业务类型', '区域', '面积(公顷)', '作物类型', '监测精度(%)', '处理时间', '状态'];
    const csvRows = [headers.join(',')];
    
    data.forEach(business => {
        const row = [
            business.typeText,
            business.region,
            business.area,
            business.cropType,
            business.accuracy,
            business.processTime,
            business.statusText
        ];
        csvRows.push(row.join(','));
    });
    
    return csvRows.join('\n');
}

/**
 * 下载CSV文件
 */
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 生成月份范围
 */
function generateMonthRange(months) {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const result = [];
    const currentMonth = new Date().getMonth();
    
    for (let i = months - 1; i >= 0; i--) {
        const monthIndex = (currentMonth - i + 12) % 12;
        result.push(monthNames[monthIndex]);
    }
    
    return result;
}

/**
 * 生成业务趋势数据
 */
function generateBusinessTrendData(months, min, max) {
    const data = [];
    for (let i = 0; i < months; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

/**
 * 更新最后刷新时间
 */
function updateLastRefreshTime() {
    const now = new Date().toLocaleString('zh-CN');
    console.log(`业务数据最后刷新时间: ${now}`);
}

/**
 * 显示加载状态
 */
function showLoading(message = '正在加载...') {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        const text = overlay.querySelector('p');
        if (text) text.textContent = message;
        overlay.classList.add('show');
    }
}

/**
 * 隐藏加载状态
 */
function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

/**
 * 数字动画
 */
function animateNumber(element, target, duration = 1000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}
 
 
 
 
 
 
 
 
 