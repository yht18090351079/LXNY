/**
 * 数据质量报告页面JavaScript
 * 负责数据质量分析、异常检测和报告生成
 */

// 全局变量
let currentPage = 1;
const itemsPerPage = 10;
let totalRecords = 0;
let anomaliesData = [];
let filteredAnomalies = [];
let qualityCharts = {};

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadQualityData();
    setupEventListeners();
    initializeCharts();
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
    
    console.log('数据质量报告页面初始化完成');
}

/**
 * 加载质量数据
 */
async function loadQualityData() {
    try {
        showLoading();
        
        // 模拟API调用
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 加载概览数据
        loadOverviewData();
        
        // 加载异常数据
        loadAnomaliesData();
        
        // 更新图表
        updateAllCharts();
        
        hideLoading();
        showNotification('数据质量报告加载完成', 'success');
        
    } catch (error) {
        console.error('加载质量数据失败:', error);
        hideLoading();
        showNotification('加载数据失败，请重试', 'error');
    }
}

/**
 * 加载概览数据
 */
function loadOverviewData() {
    const overviewData = {
        excellent: { count: 1247, percentage: 85.2, trend: 3.2 },
        good: { count: 186, percentage: 12.7, trend: -1.8 },
        warning: { count: 24, percentage: 1.6, trend: 0.3 },
        error: { count: 7, percentage: 0.5, trend: -0.2 }
    };
    
    // 更新概览卡片
    Object.keys(overviewData).forEach(key => {
        const data = overviewData[key];
        const countElement = document.getElementById(`${key}Count`);
        if (countElement) {
            animateNumber(countElement, data.count);
        }
    });
    
    // 更新完整性统计
    updateCompletenessStats();
}

/**
 * 加载异常数据
 */
function loadAnomaliesData() {
    // 模拟异常数据
    anomaliesData = [
        {
            id: 1,
            source: '遥感数据',
            type: 'outlier',
            typeText: '异常值',
            field: '植被指数',
            description: 'NDVI值超出正常范围',
            time: '2024-01-15 14:30:25',
            severity: 'high',
            severityText: '高',
            status: 'pending',
            statusText: '待处理',
            value: '1.25',
            expectedRange: '0.0 - 1.0'
        },
        {
            id: 2,
            source: '气象数据',
            type: 'missing',
            typeText: '缺失数据',
            field: '降雨量',
            description: '连续3小时数据缺失',
            time: '2024-01-15 12:15:00',
            severity: 'medium',
            severityText: '中',
            status: 'processing',
            statusText: '处理中',
            value: 'NULL',
            expectedRange: '0 - 100 mm'
        },
        {
            id: 3,
            source: '传感器数据',
            type: 'duplicate',
            typeText: '重复数据',
            field: '土壤湿度',
            description: '相同时间戳重复记录',
            time: '2024-01-15 10:45:12',
            severity: 'low',
            severityText: '低',
            status: 'resolved',
            statusText: '已解决',
            value: '45.2%',
            expectedRange: '20% - 80%'
        },
        {
            id: 4,
            source: '作物数据',
            type: 'format',
            typeText: '格式错误',
            field: '作物类型',
            description: '作物编码格式不正确',
            time: '2024-01-15 09:20:45',
            severity: 'medium',
            severityText: '中',
            status: 'pending',
            statusText: '待处理',
            value: 'CROP_001X',
            expectedRange: 'CROP_001-999'
        },
        {
            id: 5,
            source: '遥感数据',
            type: 'outlier',
            typeText: '异常值',
            field: '地表温度',
            description: '温度值异常偏高',
            time: '2024-01-15 08:15:30',
            severity: 'high',
            severityText: '高',
            status: 'ignored',
            statusText: '已忽略',
            value: '65.8°C',
            expectedRange: '-10°C - 50°C'
        }
    ];
    
    totalRecords = anomaliesData.length;
    filteredAnomalies = [...anomaliesData];
    
    // 渲染异常数据表格
    renderAnomaliesTable();
    updatePagination();
}

/**
 * 初始化图表
 */
function initializeCharts() {
    // 初始化数据质量趋势图
    initQualityTrendChart();
    
    // 初始化数据源质量分布图
    initSourceQualityChart();
    
    // 初始化数据准确性分析图
    initAccuracyChart();
}

/**
 * 初始化数据质量趋势图
 */
function initQualityTrendChart() {
    const chartElement = document.getElementById('qualityTrendChart');
    if (!chartElement) return;
    
    qualityCharts.trendChart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross'
            }
        },
        legend: {
            data: ['优秀', '良好', '警告', '异常'],
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
            data: generateDateRange(30)
        },
        yAxis: {
            type: 'value',
            name: '数据量',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                name: '优秀',
                type: 'line',
                smooth: true,
                data: generateTrendData(30, 800, 1200),
                itemStyle: { color: '#52c41a' },
                areaStyle: { opacity: 0.3 }
            },
            {
                name: '良好',
                type: 'line',
                smooth: true,
                data: generateTrendData(30, 100, 200),
                itemStyle: { color: '#1890ff' },
                areaStyle: { opacity: 0.3 }
            },
            {
                name: '警告',
                type: 'line',
                smooth: true,
                data: generateTrendData(30, 10, 50),
                itemStyle: { color: '#faad14' },
                areaStyle: { opacity: 0.3 }
            },
            {
                name: '异常',
                type: 'line',
                smooth: true,
                data: generateTrendData(30, 0, 20),
                itemStyle: { color: '#ff4d4f' },
                areaStyle: { opacity: 0.3 }
            }
        ]
    };
    
    qualityCharts.trendChart.setOption(option);
}

/**
 * 初始化数据源质量分布图
 */
function initSourceQualityChart() {
    const chartElement = document.getElementById('sourceQualityChart');
    if (!chartElement) return;
    
    qualityCharts.sourceChart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: ['遥感数据', '气象数据', '传感器数据', '作物数据', 'GIS数据']
        },
        series: [
            {
                name: '数据质量分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                data: [
                    { value: 456, name: '遥感数据', itemStyle: { color: '#1890ff' } },
                    { value: 312, name: '气象数据', itemStyle: { color: '#52c41a' } },
                    { value: 234, name: '传感器数据', itemStyle: { color: '#faad14' } },
                    { value: 189, name: '作物数据', itemStyle: { color: '#722ed1' } },
                    { value: 156, name: 'GIS数据', itemStyle: { color: '#13c2c2' } }
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
    
    qualityCharts.sourceChart.setOption(option);
}

/**
 * 初始化数据准确性分析图
 */
function initAccuracyChart() {
    const chartElement = document.getElementById('accuracyChart');
    if (!chartElement) return;
    
    qualityCharts.accuracyChart = echarts.init(chartElement);
    
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
            data: ['遥感数据', '气象数据', '传感器数据', '作物数据', 'GIS数据']
        },
        yAxis: {
            type: 'value',
            name: '准确率 (%)',
            min: 80,
            max: 100
        },
        series: [
            {
                name: '数据准确率',
                type: 'bar',
                data: [
                    { value: 94.5, itemStyle: { color: '#52c41a' } },
                    { value: 97.2, itemStyle: { color: '#52c41a' } },
                    { value: 91.8, itemStyle: { color: '#faad14' } },
                    { value: 89.3, itemStyle: { color: '#faad14' } },
                    { value: 96.1, itemStyle: { color: '#52c41a' } }
                ],
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}%'
                }
            }
        ]
    };
    
    qualityCharts.accuracyChart.setOption(option);
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 刷新按钮
    const refreshBtn = document.getElementById('refreshBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', handleRefresh);
    }
    
    // 生成报告按钮
    const generateReportBtn = document.getElementById('generateReportBtn');
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', handleGenerateReport);
    }
    
    // 趋势周期选择
    const trendPeriod = document.getElementById('trendPeriod');
    if (trendPeriod) {
        trendPeriod.addEventListener('change', handleTrendPeriodChange);
    }
    
    // 刷新数据源图表
    const refreshSourceBtn = document.getElementById('refreshSourceBtn');
    if (refreshSourceBtn) {
        refreshSourceBtn.addEventListener('click', () => {
            qualityCharts.sourceChart.resize();
            showNotification('图表已刷新', 'success');
        });
    }
    
    // 搜索异常数据
    const searchAnomalies = document.getElementById('searchAnomalies');
    if (searchAnomalies) {
        searchAnomalies.addEventListener('input', handleSearchAnomalies);
    }
    
    // 异常类型过滤
    const anomalyFilter = document.getElementById('anomalyFilter');
    if (anomalyFilter) {
        anomalyFilter.addEventListener('change', handleAnomalyFilter);
    }
    
    // 全选复选框
    const selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', handleSelectAll);
    }
    
    // 分页控制
    setupPaginationListeners();
    
    // 模态框事件
    setupModalListeners();
    
    // 窗口大小变化时重新调整图表
    window.addEventListener('resize', () => {
        Object.values(qualityCharts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    });
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
        await loadQualityData();
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
 * 处理生成报告
 */
async function handleGenerateReport() {
    try {
        showLoading('正在生成数据质量报告...');
        
        // 模拟报告生成
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // 创建报告数据
        const reportData = {
            title: '数据质量报告',
            generateTime: new Date().toLocaleString('zh-CN'),
            summary: {
                totalRecords: 1464,
                excellentCount: 1247,
                goodCount: 186,
                warningCount: 24,
                errorCount: 7,
                overallQuality: '85.2%'
            },
            details: anomaliesData
        };
        
        // 下载报告
        downloadReport(reportData);
        
        hideLoading();
        showNotification('数据质量报告生成完成', 'success');
        
    } catch (error) {
        console.error('生成报告失败:', error);
        hideLoading();
        showNotification('生成报告失败，请重试', 'error');
    }
}

/**
 * 处理趋势周期变化
 */
function handleTrendPeriodChange(event) {
    const period = parseInt(event.target.value);
    
    // 更新趋势图数据
    const option = qualityCharts.trendChart.getOption();
    option.xAxis[0].data = generateDateRange(period);
    option.series.forEach(series => {
        series.data = generateTrendData(period, 
            series.name === '优秀' ? 800 : 
            series.name === '良好' ? 100 :
            series.name === '警告' ? 10 : 0,
            series.name === '优秀' ? 1200 : 
            series.name === '良好' ? 200 :
            series.name === '警告' ? 50 : 20
        );
    });
    
    qualityCharts.trendChart.setOption(option);
    showNotification(`已切换到最近${period}天数据`, 'success');
}

/**
 * 处理搜索异常数据
 */
function handleSearchAnomalies(event) {
    const searchTerm = event.target.value.toLowerCase().trim();
    
    if (!searchTerm) {
        filteredAnomalies = [...anomaliesData];
    } else {
        filteredAnomalies = anomaliesData.filter(anomaly => 
            anomaly.source.toLowerCase().includes(searchTerm) ||
            anomaly.typeText.toLowerCase().includes(searchTerm) ||
            anomaly.field.toLowerCase().includes(searchTerm) ||
            anomaly.description.toLowerCase().includes(searchTerm)
        );
    }
    
    totalRecords = filteredAnomalies.length;
    currentPage = 1;
    renderAnomaliesTable();
    updatePagination();
}

/**
 * 处理异常类型过滤
 */
function handleAnomalyFilter(event) {
    const filterType = event.target.value;
    
    if (filterType === 'all') {
        filteredAnomalies = [...anomaliesData];
    } else {
        filteredAnomalies = anomaliesData.filter(anomaly => anomaly.type === filterType);
    }
    
    totalRecords = filteredAnomalies.length;
    currentPage = 1;
    renderAnomaliesTable();
    updatePagination();
}

/**
 * 处理全选
 */
function handleSelectAll(event) {
    const checkboxes = document.querySelectorAll('#anomaliesTableBody input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.checked = event.target.checked;
    });
}

/**
 * 渲染异常数据表格
 */
function renderAnomaliesTable() {
    const tbody = document.getElementById('anomaliesTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredAnomalies.length);
    const pageData = filteredAnomalies.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map(anomaly => `
        <tr>
            <td>
                <input type="checkbox" value="${anomaly.id}">
            </td>
            <td>
                <div class="source-info">
                    <i class="fas fa-database"></i>
                    <span>${anomaly.source}</span>
                </div>
            </td>
            <td>
                <span class="anomaly-type ${anomaly.type}">${anomaly.typeText}</span>
            </td>
            <td>${anomaly.field}</td>
            <td class="description-cell">
                <span title="${anomaly.description}">${anomaly.description}</span>
            </td>
            <td>${anomaly.time}</td>
            <td>
                <span class="severity-badge ${anomaly.severity}">${anomaly.severityText}</span>
            </td>
            <td>
                <span class="status-badge ${anomaly.status}">${anomaly.statusText}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-ghost btn-sm" onclick="viewAnomalyDetail(${anomaly.id})" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="fixAnomaly(${anomaly.id})" title="修复">
                        <i class="fas fa-wrench"></i>
                    </button>
                    <button class="btn btn-ghost btn-sm" onclick="deleteAnomaly(${anomaly.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * 查看异常详情
 */
function viewAnomalyDetail(id) {
    const anomaly = anomaliesData.find(a => a.id === id);
    if (!anomaly) return;
    
    // 填充详情数据
    document.getElementById('detailSource').textContent = anomaly.source;
    document.getElementById('detailType').textContent = anomaly.typeText;
    document.getElementById('detailField').textContent = anomaly.field;
    document.getElementById('detailValue').textContent = anomaly.value;
    document.getElementById('detailRange').textContent = anomaly.expectedRange;
    document.getElementById('detailTime').textContent = anomaly.time;
    
    // 显示模态框
    const modal = document.getElementById('detailModal');
    modal.classList.add('show');
    
    // 初始化分析图表
    setTimeout(() => {
        initAnalysisChart(anomaly);
    }, 300);
}

/**
 * 初始化分析图表
 */
function initAnalysisChart(anomaly) {
    const chartElement = document.getElementById('analysisChart');
    if (!chartElement) return;
    
    const chart = echarts.init(chartElement);
    
    const option = {
        title: {
            text: `${anomaly.field} 异常分析`,
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: generateTimeRange(24)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '实际值',
                type: 'line',
                data: generateAnomalyData(24, anomaly.type),
                itemStyle: { color: '#1890ff' }
            },
            {
                name: '预期范围上限',
                type: 'line',
                data: new Array(24).fill(parseFloat(anomaly.expectedRange.split(' - ')[1])),
                itemStyle: { color: '#52c41a' },
                lineStyle: { type: 'dashed' }
            },
            {
                name: '预期范围下限',
                type: 'line',
                data: new Array(24).fill(parseFloat(anomaly.expectedRange.split(' - ')[0])),
                itemStyle: { color: '#52c41a' },
                lineStyle: { type: 'dashed' }
            }
        ]
    };
    
    chart.setOption(option);
}

/**
 * 修复异常
 */
async function fixAnomaly(id) {
    try {
        showLoading('正在修复异常数据...');
        
        // 模拟修复过程
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 更新异常状态
        const anomaly = anomaliesData.find(a => a.id === id);
        if (anomaly) {
            anomaly.status = 'resolved';
            anomaly.statusText = '已解决';
        }
        
        // 重新渲染表格
        renderAnomaliesTable();
        
        hideLoading();
        showNotification('异常数据修复成功', 'success');
        
    } catch (error) {
        console.error('修复异常失败:', error);
        hideLoading();
        showNotification('修复异常失败，请重试', 'error');
    }
}

/**
 * 删除异常
 */
async function deleteAnomaly(id) {
    if (!confirm('确定要删除这条异常数据吗？')) {
        return;
    }
    
    try {
        showLoading('正在删除异常数据...');
        
        // 模拟删除过程
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 从数据中移除
        const index = anomaliesData.findIndex(a => a.id === id);
        if (index > -1) {
            anomaliesData.splice(index, 1);
        }
        
        // 重新过滤和渲染
        const searchTerm = document.getElementById('searchAnomalies').value.toLowerCase().trim();
        const filterType = document.getElementById('anomalyFilter').value;
        
        filteredAnomalies = anomaliesData.filter(anomaly => {
            const matchesSearch = !searchTerm || 
                anomaly.source.toLowerCase().includes(searchTerm) ||
                anomaly.typeText.toLowerCase().includes(searchTerm) ||
                anomaly.field.toLowerCase().includes(searchTerm) ||
                anomaly.description.toLowerCase().includes(searchTerm);
            
            const matchesFilter = filterType === 'all' || anomaly.type === filterType;
            
            return matchesSearch && matchesFilter;
        });
        
        totalRecords = filteredAnomalies.length;
        
        // 调整当前页码
        const maxPage = Math.ceil(totalRecords / itemsPerPage);
        if (currentPage > maxPage && maxPage > 0) {
            currentPage = maxPage;
        }
        
        renderAnomaliesTable();
        updatePagination();
        
        hideLoading();
        showNotification('异常数据删除成功', 'success');
        
    } catch (error) {
        console.error('删除异常失败:', error);
        hideLoading();
        showNotification('删除异常失败，请重试', 'error');
    }
}

/**
 * 设置模态框监听器
 */
function setupModalListeners() {
    // 关闭模态框
    const closeModal = document.getElementById('closeDetailModal');
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            document.getElementById('detailModal').classList.remove('show');
        });
    }
    
    // 点击遮罩关闭模态框
    const modalOverlay = document.getElementById('detailModal');
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
            switchTab(tabName);
        });
    });
}

/**
 * 切换标签页
 */
function switchTab(tabName) {
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
 * 设置分页监听器
 */
function setupPaginationListeners() {
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (prevPage) {
        prevPage.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderAnomaliesTable();
                updatePagination();
            }
        });
    }
    
    if (nextPage) {
        nextPage.addEventListener('click', () => {
            const maxPage = Math.ceil(totalRecords / itemsPerPage);
            if (currentPage < maxPage) {
                currentPage++;
                renderAnomaliesTable();
                updatePagination();
            }
        });
    }
}

/**
 * 更新分页信息
 */
function updatePagination() {
    const maxPage = Math.ceil(totalRecords / itemsPerPage);
    const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);
    
    // 更新分页信息
    const pageStart = document.getElementById('pageStart');
    const pageEnd = document.getElementById('pageEnd');
    const totalRecordsElement = document.getElementById('totalRecords');
    
    if (pageStart) pageStart.textContent = startRecord;
    if (pageEnd) pageEnd.textContent = endRecord;
    if (totalRecordsElement) totalRecordsElement.textContent = totalRecords;
    
    // 更新分页按钮状态
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');
    
    if (prevPage) {
        prevPage.disabled = currentPage <= 1;
    }
    
    if (nextPage) {
        nextPage.disabled = currentPage >= maxPage;
    }
    
    // 更新页码
    updatePageNumbers(maxPage);
}

/**
 * 更新页码显示
 */
function updatePageNumbers(maxPage) {
    const pageNumbers = document.getElementById('pageNumbers');
    if (!pageNumbers) return;
    
    let html = '';
    const showPages = 5; // 显示的页码数量
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(maxPage, startPage + showPages - 1);
    
    // 调整起始页码
    if (endPage - startPage + 1 < showPages) {
        startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }
    
    pageNumbers.innerHTML = html;
}

/**
 * 跳转到指定页码
 */
function goToPage(page) {
    currentPage = page;
    renderAnomaliesTable();
    updatePagination();
}

/**
 * 更新完整性统计
 */
function updateCompletenessStats() {
    const stats = [
        { label: '遥感数据完整性', value: 94.5 },
        { label: '气象数据完整性', value: 97.2 },
        { label: '传感器数据完整性', value: 91.8 },
        { label: '作物数据完整性', value: 89.3 }
    ];
    
    const container = document.querySelector('.completeness-stats');
    if (!container) return;
    
    stats.forEach((stat, index) => {
        const progressFill = container.children[index]?.querySelector('.progress-fill');
        const progressText = container.children[index]?.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            // 动画更新进度条
            setTimeout(() => {
                progressFill.style.width = `${stat.value}%`;
                progressText.textContent = `${stat.value}%`;
            }, index * 200);
        }
    });
}

/**
 * 更新所有图表
 */
function updateAllCharts() {
    Object.values(qualityCharts).forEach(chart => {
        if (chart && chart.resize) {
            chart.resize();
        }
    });
}

/**
 * 下载报告
 */
function downloadReport(reportData) {
    const content = `
# ${reportData.title}

生成时间: ${reportData.generateTime}

## 数据质量概览

- 总记录数: ${reportData.summary.totalRecords}
- 优秀数据: ${reportData.summary.excellentCount} (${((reportData.summary.excellentCount / reportData.summary.totalRecords) * 100).toFixed(1)}%)
- 良好数据: ${reportData.summary.goodCount} (${((reportData.summary.goodCount / reportData.summary.totalRecords) * 100).toFixed(1)}%)
- 警告数据: ${reportData.summary.warningCount} (${((reportData.summary.warningCount / reportData.summary.totalRecords) * 100).toFixed(1)}%)
- 异常数据: ${reportData.summary.errorCount} (${((reportData.summary.errorCount / reportData.summary.totalRecords) * 100).toFixed(1)}%)
- 整体质量: ${reportData.summary.overallQuality}

## 异常数据详情

${reportData.details.map(anomaly => `
### ${anomaly.source} - ${anomaly.field}
- 异常类型: ${anomaly.typeText}
- 异常描述: ${anomaly.description}
- 异常值: ${anomaly.value}
- 期望范围: ${anomaly.expectedRange}
- 发现时间: ${anomaly.time}
- 严重程度: ${anomaly.severityText}
- 处理状态: ${anomaly.statusText}
`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `数据质量报告_${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * 生成日期范围
 */
function generateDateRange(days) {
    const dates = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
    }
    return dates;
}

/**
 * 生成时间范围
 */
function generateTimeRange(hours) {
    const times = [];
    for (let i = 0; i < hours; i++) {
        times.push(`${i.toString().padStart(2, '0')}:00`);
    }
    return times;
}

/**
 * 生成趋势数据
 */
function generateTrendData(days, min, max) {
    const data = [];
    for (let i = 0; i < days; i++) {
        data.push(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return data;
}

/**
 * 生成异常数据
 */
function generateAnomalyData(hours, type) {
    const data = [];
    const baseValue = type === 'outlier' ? 1.2 : 0.8;
    
    for (let i = 0; i < hours; i++) {
        let value = baseValue + (Math.random() - 0.5) * 0.2;
        if (type === 'outlier' && i === 12) {
            value = 1.25; // 异常点
        }
        data.push(value.toFixed(2));
    }
    return data;
}

/**
 * 更新最后刷新时间
 */
function updateLastRefreshTime() {
    const now = new Date().toLocaleString('zh-CN');
    console.log(`数据最后刷新时间: ${now}`);
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
 
 
 
 
 
 
 
 
 