/**
 * 作物数据管理页面JavaScript
 * 负责作物数据的展示、筛选、添加、编辑等功能
 */

// 全局变量
let cropData = [];
let filteredCropData = [];
let currentPage = 1;
const itemsPerPage = 20;
let sortColumn = '';
let sortDirection = 'asc';

// 作物分布图表和生长周期图表
let cropDistributionChart = null;
let growthTimelineChart = null;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    loadCropData();
    initializeCharts();
    setupEventListeners();
    updateTime();
    setInterval(updateTime, 1000);
});

/**
 * 初始化页面
 */
function initializePage() {
    // 初始化侧边栏
    initializeSidebar();
    
    // 设置当前日期
    const today = new Date().toISOString().split('T')[0];
    const plantStartDate = document.getElementById('plantStartDate');
    const plantEndDate = document.getElementById('plantEndDate');
    const plantDate = document.getElementById('plantDate');
    
    if (plantStartDate) plantStartDate.value = today;
    if (plantEndDate) plantEndDate.value = today;
    if (plantDate) plantDate.value = today;
    
    console.log('作物数据管理页面初始化完成');
}

/**
 * 加载作物数据
 */
function loadCropData() {
    // 模拟作物数据
    cropData = generateMockCropData();
    filteredCropData = [...cropData];
    
    // 更新统计信息
    updateCropStatistics();
    
    // 渲染作物表格
    renderCropTable();
    
    // 更新分页
    updatePagination();
    
    // 更新图表
    updateChartData();
}

/**
 * 生成模拟作物数据
 */
function generateMockCropData() {
    const cropTypes = ['grains', 'cash', 'vegetables', 'fruits'];
    const cropNames = {
        grains: ['小麦', '玉米', '水稻', '大麦', '燕麦'],
        cash: ['棉花', '油菜', '花生', '芝麻', '向日葵'],
        vegetables: ['白菜', '萝卜', '胡萝卜', '西红柿', '黄瓜'],
        fruits: ['苹果', '梨', '桃', '杏', '葡萄']
    };
    const varieties = ['优质品种A', '高产品种B', '抗病品种C', '早熟品种D', '晚熟品种E'];
    const regions = ['north', 'south', 'east', 'west', 'center'];
    const statuses = ['seeding', 'growing', 'flowering', 'fruiting', 'mature', 'harvested'];
    
    const data = [];
    
    for (let i = 1; i <= 1247; i++) {
        const cropType = cropTypes[Math.floor(Math.random() * cropTypes.length)];
        const cropName = cropNames[cropType][Math.floor(Math.random() * cropNames[cropType].length)];
        const variety = varieties[Math.floor(Math.random() * varieties.length)];
        const region = regions[Math.floor(Math.random() * regions.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        
        const plantArea = (Math.random() * 500 + 10).toFixed(2);
        const expectedYield = (Math.random() * 50 + 5).toFixed(2);
        const plantDensity = Math.floor(Math.random() * 5000 + 1000);
        
        // 生成种植日期（过去6个月内）
        const plantDate = new Date();
        plantDate.setDate(plantDate.getDate() - Math.floor(Math.random() * 180));
        
        // 生成预期收获日期（种植日期后3-6个月）
        const harvestDate = new Date(plantDate);
        harvestDate.setMonth(harvestDate.getMonth() + Math.floor(Math.random() * 3) + 3);
        
        data.push({
            id: i,
            cropName: cropName,
            cropType: cropType,
            variety: variety,
            plantArea: parseFloat(plantArea),
            plantDate: plantDate.toISOString().split('T')[0],
            expectedHarvestDate: harvestDate.toISOString().split('T')[0],
            region: region,
            expectedYield: parseFloat(expectedYield),
            growthStatus: status,
            plantDensity: plantDensity,
            latitude: (35 + Math.random() * 5).toFixed(6),
            longitude: (103 + Math.random() * 5).toFixed(6),
            remarks: `${cropName}种植记录 - 批次${i}`
        });
    }
    
    return data;
}

/**
 * 更新作物统计信息
 */
function updateCropStatistics() {
    const totalCrops = cropData.length;
    const activeCrops = cropData.filter(crop => 
        ['seeding', 'growing', 'flowering', 'fruiting', 'mature'].includes(crop.growthStatus)
    ).length;
    const harvestedCrops = cropData.filter(crop => crop.growthStatus === 'harvested').length;
    const totalArea = cropData.reduce((sum, crop) => sum + crop.plantArea, 0);
    
    // 更新DOM元素
    updateElementText('totalCrops', totalCrops.toLocaleString());
    updateElementText('activeCrops', activeCrops.toLocaleString());
    updateElementText('harvestedCrops', harvestedCrops.toLocaleString());
    updateElementText('totalArea', Math.round(totalArea).toLocaleString());
}

/**
 * 初始化图表
 */
function initializeCharts() {
    initializeCropDistributionChart();
    initializeGrowthTimelineChart();
}

/**
 * 初始化作物分布图表
 */
function initializeCropDistributionChart() {
    const chartElement = document.getElementById('cropDistributionChart');
    if (!chartElement) return;
    
    cropDistributionChart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: ['粮食作物', '经济作物', '蔬菜作物', '果树作物']
        },
        series: [
            {
                name: '作物分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['60%', '50%'],
                data: [],
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
    
    cropDistributionChart.setOption(option);
}

/**
 * 初始化生长周期图表
 */
function initializeGrowthTimelineChart() {
    const chartElement = document.getElementById('growthTimelineChart');
    if (!chartElement) return;
    
    growthTimelineChart = echarts.init(chartElement);
    
    const option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['播种期', '生长期', '开花期', '结果期', '成熟期', '已收获']
        },
        xAxis: {
            type: 'category',
            data: []
        },
        yAxis: {
            type: 'value',
            name: '作物数量'
        },
        series: []
    };
    
    growthTimelineChart.setOption(option);
}

/**
 * 更新图表数据
 */
function updateChartData() {
    updateCropDistributionChart();
    updateGrowthTimelineChart();
}

/**
 * 更新作物分布图表
 */
function updateCropDistributionChart() {
    if (!cropDistributionChart) return;
    
    const typeCount = {
        grains: 0,
        cash: 0,
        vegetables: 0,
        fruits: 0
    };
    
    filteredCropData.forEach(crop => {
        typeCount[crop.cropType]++;
    });
    
    const data = [
        { value: typeCount.grains, name: '粮食作物', itemStyle: { color: '#FFC107' } },
        { value: typeCount.cash, name: '经济作物', itemStyle: { color: '#4CAF50' } },
        { value: typeCount.vegetables, name: '蔬菜作物', itemStyle: { color: '#8BC34A' } },
        { value: typeCount.fruits, name: '果树作物', itemStyle: { color: '#FF5722' } }
    ];
    
    cropDistributionChart.setOption({
        series: [{
            data: data
        }]
    });
}

/**
 * 更新生长周期图表
 */
function updateGrowthTimelineChart() {
    if (!growthTimelineChart) return;
    
    // 生成最近30天的日期
    const dates = [];
    const statusData = {
        seeding: [],
        growing: [],
        flowering: [],
        fruiting: [],
        mature: [],
        harvested: []
    };
    
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
        
        // 模拟每日各状态作物数量
        Object.keys(statusData).forEach(status => {
            statusData[status].push(Math.floor(Math.random() * 50) + 10);
        });
    }
    
    const series = [
        { name: '播种期', type: 'line', data: statusData.seeding, smooth: true, itemStyle: { color: '#9E9E9E' } },
        { name: '生长期', type: 'line', data: statusData.growing, smooth: true, itemStyle: { color: '#4CAF50' } },
        { name: '开花期', type: 'line', data: statusData.flowering, smooth: true, itemStyle: { color: '#E91E63' } },
        { name: '结果期', type: 'line', data: statusData.fruiting, smooth: true, itemStyle: { color: '#FF9800' } },
        { name: '成熟期', type: 'line', data: statusData.mature, smooth: true, itemStyle: { color: '#673AB7' } },
        { name: '已收获', type: 'line', data: statusData.harvested, smooth: true, itemStyle: { color: '#607D8B' } }
    ];
    
    growthTimelineChart.setOption({
        xAxis: { data: dates },
        series: series
    });
}

/**
 * 渲染作物表格
 */
function renderCropTable() {
    const tbody = document.getElementById('cropTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredCropData.length);
    const pageData = filteredCropData.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map(crop => `
        <tr>
            <td>
                <input type="checkbox" value="${crop.id}" onchange="updateBatchActions()">
            </td>
            <td>
                <span class="crop-name">${crop.cropName}</span>
            </td>
            <td>
                <span class="crop-type ${crop.cropType}">${getCropTypeText(crop.cropType)}</span>
            </td>
            <td>${crop.variety}</td>
            <td>
                <span class="area-value">${crop.plantArea.toLocaleString()}</span>
            </td>
            <td>${crop.plantDate}</td>
            <td>
                <span class="growth-status ${crop.growthStatus}">${getGrowthStatusText(crop.growthStatus)}</span>
            </td>
            <td>${getRegionText(crop.region)}</td>
            <td>
                <span class="yield-value">${crop.expectedYield.toLocaleString()}</span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewCropDetail(${crop.id})" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn process" onclick="editCrop(${crop.id})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteCrop(${crop.id})" title="删除">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 筛选器事件
    const filters = ['cropTypeFilter', 'growthStatusFilter', 'areaFilter'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyCropFilters);
        }
    });
    
    // 日期筛选器事件
    const dateFilters = ['plantStartDate', 'plantEndDate'];
    dateFilters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) {
            element.addEventListener('change', applyCropFilters);
        }
    });
    
    // 表格排序事件
    const sortableHeaders = document.querySelectorAll('th[data-sort]');
    sortableHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.sort;
            sortCropTable(column);
        });
    });
    
    // 全选复选框事件
    const selectAllCheckbox = document.getElementById('selectAllCrops');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleSelectAllCrops);
    }
    
    // 窗口大小变化时重新调整图表
    window.addEventListener('resize', () => {
        if (cropDistributionChart) cropDistributionChart.resize();
        if (growthTimelineChart) growthTimelineChart.resize();
    });
}

/**
 * 应用作物筛选
 */
function applyCropFilters() {
    const cropTypeFilter = document.getElementById('cropTypeFilter')?.value || '';
    const growthStatusFilter = document.getElementById('growthStatusFilter')?.value || '';
    const areaFilter = document.getElementById('areaFilter')?.value || '';
    const plantStartDate = document.getElementById('plantStartDate')?.value || '';
    const plantEndDate = document.getElementById('plantEndDate')?.value || '';
    
    filteredCropData = cropData.filter(crop => {
        // 作物类型筛选
        if (cropTypeFilter && crop.cropType !== cropTypeFilter) return false;
        
        // 生长状态筛选
        if (growthStatusFilter && crop.growthStatus !== growthStatusFilter) return false;
        
        // 区域筛选
        if (areaFilter && crop.region !== areaFilter) return false;
        
        // 种植时间筛选
        if (plantStartDate && crop.plantDate < plantStartDate) return false;
        if (plantEndDate && crop.plantDate > plantEndDate) return false;
        
        return true;
    });
    
    // 重置到第一页
    currentPage = 1;
    
    // 重新渲染表格和更新分页
    renderCropTable();
    updatePagination();
    updateChartData();
    
    showNotification(`筛选结果：找到 ${filteredCropData.length} 条作物记录`, 'success');
}

/**
 * 清除作物筛选
 */
function clearCropFilters() {
    // 重置筛选器
    const filters = ['cropTypeFilter', 'growthStatusFilter', 'areaFilter', 'plantStartDate', 'plantEndDate'];
    filters.forEach(filterId => {
        const element = document.getElementById(filterId);
        if (element) element.value = '';
    });
    
    // 重置数据
    filteredCropData = [...cropData];
    currentPage = 1;
    
    // 重新渲染
    renderCropTable();
    updatePagination();
    updateChartData();
    
    showNotification('筛选条件已清除', 'info');
}

/**
 * 排序作物表格
 */
function sortCropTable(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }
    
    filteredCropData.sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];
        
        // 处理数字类型
        if (typeof valueA === 'number' && typeof valueB === 'number') {
            return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
        }
        
        // 处理字符串类型
        valueA = String(valueA).toLowerCase();
        valueB = String(valueB).toLowerCase();
        
        if (sortDirection === 'asc') {
            return valueA.localeCompare(valueB);
        } else {
            return valueB.localeCompare(valueA);
        }
    });
    
    // 更新表头排序图标
    updateSortIcons(column, sortDirection);
    
    // 重新渲染表格
    renderCropTable();
}

/**
 * 更新排序图标
 */
function updateSortIcons(activeColumn, direction) {
    const headers = document.querySelectorAll('th[data-sort]');
    headers.forEach(header => {
        header.classList.remove('sorted-asc', 'sorted-desc');
        if (header.dataset.sort === activeColumn) {
            header.classList.add(`sorted-${direction}`);
        }
    });
}

/**
 * 切换全选
 */
function toggleSelectAllCrops() {
    const selectAllCheckbox = document.getElementById('selectAllCrops');
    const checkboxes = document.querySelectorAll('#cropTableBody input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAllCheckbox.checked;
    });
    
    updateBatchActions();
}

/**
 * 更新批量操作按钮状态
 */
function updateBatchActions() {
    const checkboxes = document.querySelectorAll('#cropTableBody input[type="checkbox"]:checked');
    const hasSelected = checkboxes.length > 0;
    
    const batchButtons = ['batchUpdateBtn', 'batchExportBtn', 'batchHarvestBtn'];
    batchButtons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = !hasSelected;
        }
    });
}

/**
 * 更新分页
 */
function updatePagination() {
    const totalRecords = filteredCropData.length;
    const totalPages = Math.ceil(totalRecords / itemsPerPage);
    const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endRecord = Math.min(currentPage * itemsPerPage, totalRecords);
    
    // 更新分页信息
    updateElementText('cropPageStart', startRecord);
    updateElementText('cropPageEnd', endRecord);
    updateElementText('totalCropRecords', totalRecords.toLocaleString());
    
    // 更新分页按钮
    const firstBtn = document.getElementById('firstCropPageBtn');
    const prevBtn = document.getElementById('prevCropPageBtn');
    const nextBtn = document.getElementById('nextCropPageBtn');
    const lastBtn = document.getElementById('lastCropPageBtn');
    
    if (firstBtn) firstBtn.disabled = currentPage <= 1;
    if (prevBtn) prevBtn.disabled = currentPage <= 1;
    if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    if (lastBtn) lastBtn.disabled = currentPage >= totalPages;
    
    // 生成页码按钮
    generatePageNumbers(totalPages);
}

/**
 * 生成页码按钮
 */
function generatePageNumbers(totalPages) {
    const pageNumbersContainer = document.getElementById('cropPageNumbers');
    if (!pageNumbersContainer) return;
    
    let html = '';
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // 调整起始页码
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                    onclick="changeCropPage('page', ${i})">
                ${i}
            </button>
        `;
    }
    
    pageNumbersContainer.innerHTML = html;
}

/**
 * 切换作物页码
 */
function changeCropPage(action, pageNum) {
    const totalPages = Math.ceil(filteredCropData.length / itemsPerPage);
    
    switch (action) {
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
        case 'page':
            currentPage = pageNum;
            break;
    }
    
    renderCropTable();
    updatePagination();
}

/**
 * 设置作物时间范围
 */
function setCropTimeRange(range) {
    // 更新按钮状态
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新图表数据
    updateGrowthTimelineChart();
    
    showNotification(`已切换到${range === 'month' ? '本月' : range === 'season' ? '本季' : '本年'}视图`, 'info');
}

/**
 * 刷新作物分布图表
 */
function refreshCropDistribution() {
    updateCropDistributionChart();
    showNotification('作物分布图表已刷新', 'success');
}

/**
 * 导出图表
 */
function exportCropChart(chartType) {
    const chart = chartType === 'distribution' ? cropDistributionChart : growthTimelineChart;
    if (!chart) return;
    
    const url = chart.getDataURL({
        pixelRatio: 2,
        backgroundColor: '#fff'
    });
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${chartType === 'distribution' ? '作物分布' : '生长周期'}_${new Date().toISOString().split('T')[0]}.png`;
    link.click();
    
    showNotification('图表导出成功', 'success');
}

/**
 * 显示添加作物模态框
 */
function showAddCropModal() {
    const modal = document.getElementById('addCropModal');
    if (modal) {
        modal.classList.add('show');
        
        // 重置表单
        const form = document.getElementById('addCropForm');
        if (form) form.reset();
        
        // 设置默认日期
        const plantDate = document.getElementById('plantDate');
        if (plantDate) plantDate.value = new Date().toISOString().split('T')[0];
    }
}

/**
 * 关闭添加作物模态框
 */
function closeAddCropModal() {
    const modal = document.getElementById('addCropModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 保存作物
 */
function saveCrop() {
    const form = document.getElementById('addCropForm');
    if (!form) return;
    
    // 获取表单数据
    const formData = new FormData(form);
    const cropData = {
        id: Date.now(), // 临时ID
        cropName: document.getElementById('cropName').value,
        cropType: document.getElementById('cropType').value,
        variety: document.getElementById('variety').value,
        plantArea: parseFloat(document.getElementById('plantArea').value) || 0,
        plantDate: document.getElementById('plantDate').value,
        expectedHarvestDate: document.getElementById('expectedHarvestDate').value,
        region: document.getElementById('region').value,
        expectedYield: parseFloat(document.getElementById('expectedYield').value) || 0,
        growthStatus: document.getElementById('growthStatus').value,
        plantDensity: parseInt(document.getElementById('plantDensity').value) || 0,
        latitude: parseFloat(document.getElementById('latitude').value) || 0,
        longitude: parseFloat(document.getElementById('longitude').value) || 0,
        remarks: document.getElementById('remarks').value
    };
    
    // 验证必填字段
    if (!cropData.cropName || !cropData.cropType || !cropData.plantDate || !cropData.region) {
        showNotification('请填写所有必填字段', 'error');
        return;
    }
    
    // 模拟保存到服务器
    setTimeout(() => {
        // 添加到数据中
        window.cropData.push(cropData);
        filteredCropData.push(cropData);
        
        // 关闭模态框
        closeAddCropModal();
        
        // 更新显示
        updateCropStatistics();
        renderCropTable();
        updatePagination();
        updateChartData();
        
        showNotification('作物信息保存成功', 'success');
    }, 500);
}

/**
 * 查看作物详情
 */
function viewCropDetail(cropId) {
    const crop = cropData.find(c => c.id === cropId);
    if (!crop) return;
    
    const modal = document.getElementById('cropDetailModal');
    const content = document.getElementById('cropDetailContent');
    
    if (!modal || !content) return;
    
    // 生成详情内容
    content.innerHTML = `
        <div class="detail-section">
            <h4>基本信息</h4>
            <div class="detail-item">
                <span class="detail-label">作物名称:</span>
                <span class="detail-value">${crop.cropName}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">作物类型:</span>
                <span class="detail-value">${getCropTypeText(crop.cropType)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">品种:</span>
                <span class="detail-value">${crop.variety}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">种植面积:</span>
                <span class="detail-value">${crop.plantArea} 亩</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">种植区域:</span>
                <span class="detail-value">${getRegionText(crop.region)}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">生长状态:</span>
                <span class="detail-value">${getGrowthStatusText(crop.growthStatus)}</span>
            </div>
        </div>
        <div class="detail-section">
            <h4>种植信息</h4>
            <div class="detail-item">
                <span class="detail-label">种植时间:</span>
                <span class="detail-value">${crop.plantDate}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">预期收获:</span>
                <span class="detail-value">${crop.expectedHarvestDate}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">预期产量:</span>
                <span class="detail-value">${crop.expectedYield} 吨</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">种植密度:</span>
                <span class="detail-value">${crop.plantDensity} 株/亩</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">地块坐标:</span>
                <span class="detail-value">${crop.latitude}, ${crop.longitude}</span>
            </div>
            <div class="detail-item">
                <span class="detail-label">备注信息:</span>
                <span class="detail-value">${crop.remarks || '无'}</span>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

/**
 * 关闭作物详情模态框
 */
function closeCropDetailModal() {
    const modal = document.getElementById('cropDetailModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 编辑作物信息
 */
function editCrop(cropId) {
    showNotification('编辑功能开发中...', 'info');
}

/**
 * 删除作物
 */
function deleteCrop(cropId) {
    if (!confirm('确定要删除这条作物记录吗？')) return;
    
    // 从数据中移除
    const index = cropData.findIndex(c => c.id === cropId);
    if (index > -1) {
        cropData.splice(index, 1);
    }
    
    const filteredIndex = filteredCropData.findIndex(c => c.id === cropId);
    if (filteredIndex > -1) {
        filteredCropData.splice(filteredIndex, 1);
    }
    
    // 更新显示
    updateCropStatistics();
    renderCropTable();
    updatePagination();
    updateChartData();
    
    showNotification('作物记录删除成功', 'success');
}

/**
 * 批量更新状态
 */
function batchUpdateStatus() {
    const selectedCheckboxes = document.querySelectorAll('#cropTableBody input[type="checkbox"]:checked');
    if (selectedCheckboxes.length === 0) {
        showNotification('请先选择要更新的作物', 'warning');
        return;
    }
    
    showNotification('批量更新功能开发中...', 'info');
}

/**
 * 批量导出数据
 */
function batchExportData() {
    const selectedCheckboxes = document.querySelectorAll('#cropTableBody input[type="checkbox"]:checked');
    if (selectedCheckboxes.length === 0) {
        showNotification('请先选择要导出的作物', 'warning');
        return;
    }
    
    showNotification('批量导出功能开发中...', 'info');
}

/**
 * 批量收获
 */
function batchHarvest() {
    const selectedCheckboxes = document.querySelectorAll('#cropTableBody input[type="checkbox"]:checked');
    if (selectedCheckboxes.length === 0) {
        showNotification('请先选择要收获的作物', 'warning');
        return;
    }
    
    showNotification('批量收获功能开发中...', 'info');
}

/**
 * 刷新作物数据
 */
function refreshCropData() {
    showLoading();
    
    setTimeout(() => {
        loadCropData();
        hideLoading();
        showNotification('作物数据刷新成功', 'success');
    }, 1000);
}

/**
 * 导入作物数据
 */
function importCropData() {
    showNotification('数据导入功能开发中...', 'info');
}

/**
 * 获取位置
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                document.getElementById('latitude').value = position.coords.latitude.toFixed(6);
                document.getElementById('longitude').value = position.coords.longitude.toFixed(6);
                showNotification('位置获取成功', 'success');
            },
            error => {
                showNotification('位置获取失败，请手动输入坐标', 'error');
            }
        );
    } else {
        showNotification('浏览器不支持地理位置功能', 'error');
    }
}

/**
 * 切换作物视图
 */
function toggleCropView(viewType) {
    // 更新按钮状态
    document.querySelectorAll('.table-actions .btn-icon').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    showNotification(`已切换到${viewType === 'card' ? '卡片' : viewType === 'list' ? '列表' : '地图'}视图`, 'info');
}

// 辅助函数
function getCropTypeText(type) {
    const typeMap = {
        grains: '粮食作物',
        cash: '经济作物',
        vegetables: '蔬菜作物',
        fruits: '果树作物'
    };
    return typeMap[type] || type;
}

function getGrowthStatusText(status) {
    const statusMap = {
        seeding: '播种期',
        growing: '生长期',
        flowering: '开花期',
        fruiting: '结果期',
        mature: '成熟期',
        harvested: '已收获'
    };
    return statusMap[status] || status;
}

function getRegionText(region) {
    const regionMap = {
        north: '北部片区',
        south: '南部片区',
        east: '东部片区',
        west: '西部片区',
        center: '中部片区'
    };
    return regionMap[region] || region;
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN');
    updateElementText('current-time', timeString);
    updateElementText('last-update', '刚刚');
}
 
 
 
 
 
 
 
 
 