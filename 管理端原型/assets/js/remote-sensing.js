/**
 * 农情遥感系统管理端 - 遥感数据管理功能
 * 功能：数据列表、上传管理、处理监控、筛选排序等
 */

// ===== 全局变量 =====
let currentPage = 1;
let pageSize = 20;
let totalRecords = 247;
let currentSort = { field: 'date', order: 'desc' };
let selectedRows = new Set();
let dataList = [];
let filteredData = [];
let processingTasks = [];

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeRemoteSensingPage();
});

/**
 * 页面初始化
 */
function initializeRemoteSensingPage() {
    console.log('🛰️ 初始化遥感数据管理页面...');
    
    // 初始化数据
    generateMockData();
    
    // 渲染页面内容
    renderDataTable();
    renderProcessingMonitor();
    
    // 绑定事件
    bindEvents();
    
    // 初始化上传功能
    initializeUpload();
    
    // 开始定时更新
    startRealTimeUpdate();
    
    console.log('✅ 遥感数据管理页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟数据
 */
function generateMockData() {
    const dataTypes = ['Landsat', 'Sentinel-2', 'MODIS', '高分1号', '高分2号'];
    const statuses = ['pending', 'processing', 'completed', 'failed'];
    const statusWeights = [0.1, 0.2, 0.65, 0.05]; // 权重分布
    
    dataList = [];
    processingTasks = [];
    
    // 生成数据列表
    for (let i = 0; i < totalRecords; i++) {
        const date = new Date(2024, 0, 1 + Math.floor(Math.random() * 365));
        const dataType = dataTypes[Math.floor(Math.random() * dataTypes.length)];
        const status = getRandomByWeight(statuses, statusWeights);
        const quality = 60 + Math.random() * 40; // 60-100的质量分数
        
        const data = {
            id: `rs_${String(i + 1).padStart(4, '0')}`,
            filename: `${dataType.toLowerCase()}_${date.getFullYear()}_${String(date.getMonth() + 1).padStart(2, '0')}_${String(date.getDate()).padStart(2, '0')}_${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}.tif`,
            type: dataType,
            date: date,
            size: Math.floor(Math.random() * 2000 + 100), // 100MB - 2100MB
            status: status,
            quality: Math.floor(quality),
            uploadTime: new Date(date.getTime() + Math.random() * 86400000), // 上传时间在获取时间之后
            processingTime: status === 'completed' ? Math.floor(Math.random() * 120 + 15) : null, // 15-135分钟
            notes: Math.random() > 0.7 ? '高质量影像数据，云量较少' : ''
        };
        
        dataList.push(data);
        
        // 添加到处理任务列表（仅处理中的任务）
        if (status === 'processing') {
            processingTasks.push({
                id: data.id,
                filename: data.filename,
                progress: Math.floor(Math.random() * 80 + 10), // 10-90%
                startTime: new Date(Date.now() - Math.random() * 3600000), // 过去1小时内开始
                estimatedTime: Math.floor(Math.random() * 60 + 10) // 预计还需10-70分钟
            });
        }
    }
    
    // 按日期排序（最新的在前）
    dataList.sort((a, b) => b.date - a.date);
    filteredData = [...dataList];
    
    console.log(`📊 生成了 ${dataList.length} 条遥感数据记录`);
    console.log(`🔄 当前有 ${processingTasks.length} 个处理任务在进行中`);
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

// ===== 数据表格渲染 =====

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
                <td colspan="8" class="text-center">
                    <div class="empty-state">
                        <i class="fas fa-inbox"></i>
                        <h3>暂无数据</h3>
                        <p>当前筛选条件下没有找到匹配的遥感数据</p>
                    </div>
                </td>
            </tr>
        `;
        updatePaginationInfo(0, 0, 0);
        return;
    }
    
    // 生成表格行
    tbody.innerHTML = pageData.map(item => `
        <tr ${selectedRows.has(item.id) ? 'class="selected"' : ''}>
            <td>
                <input type="checkbox" ${selectedRows.has(item.id) ? 'checked' : ''} 
                       onchange="toggleRowSelection('${item.id}')">
            </td>
            <td>
                <div class="filename-cell">
                    <strong>${item.filename}</strong>
                    ${item.notes ? `<div class="file-notes">${item.notes}</div>` : ''}
                </div>
            </td>
            <td>
                <span class="data-type-badge ${item.type.toLowerCase().replace(/[^a-z0-9]/g, '')}">${item.type}</span>
            </td>
            <td>
                <div class="date-cell">
                    <div>${item.date.toLocaleDateString('zh-CN')}</div>
                    <small>${item.date.toLocaleTimeString('zh-CN')}</small>
                </div>
            </td>
            <td>
                <span class="file-size">${formatFileSize(item.size * 1024 * 1024)}</span>
            </td>
            <td>
                <span class="status-badge ${item.status}">${getStatusText(item.status)}</span>
                ${item.processingTime ? `<div class="processing-time">处理耗时: ${item.processingTime}分钟</div>` : ''}
            </td>
            <td>
                <div class="quality-score">
                    <div class="quality-bar">
                        <div class="quality-fill ${getQualityLevel(item.quality)}" 
                             style="width: ${item.quality}%"></div>
                    </div>
                    <span class="quality-text">${item.quality}%</span>
                </div>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewDataDetails('${item.id}')" 
                            data-tooltip="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn download" onclick="downloadData('${item.id}')"
                            data-tooltip="下载数据">
                        <i class="fas fa-download"></i>
                    </button>
                    ${item.status === 'pending' ? `
                        <button class="action-btn process" onclick="processData('${item.id}')"
                                data-tooltip="开始处理">
                            <i class="fas fa-play"></i>
                        </button>
                    ` : ''}
                    <button class="action-btn delete" onclick="deleteData('${item.id}')"
                            data-tooltip="删除数据">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
    
    // 更新分页信息
    updatePaginationInfo(startIndex + 1, Math.min(endIndex, filteredData.length), filteredData.length);
    
    // 更新分页控件
    updatePaginationControls();
    
    // 更新批量操作按钮状态
    updateBatchActionButtons();
}

/**
 * 获取状态文本
 */
function getStatusText(status) {
    const statusMap = {
        pending: '待处理',
        processing: '处理中',
        completed: '已完成',
        failed: '处理失败'
    };
    return statusMap[status] || status;
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

// ===== 处理监控渲染 =====

/**
 * 渲染处理监控
 */
function renderProcessingMonitor() {
    const processingListEl = document.getElementById('processingList');
    if (!processingListEl) return;
    
    if (processingTasks.length === 0) {
        processingListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-tasks"></i>
                <h3>暂无处理任务</h3>
                <p>当前没有正在处理的遥感数据</p>
            </div>
        `;
        return;
    }
    
    processingListEl.innerHTML = processingTasks.map(task => {
        const elapsed = Math.floor((Date.now() - task.startTime) / 60000); // 已用时间（分钟）
        const remaining = Math.max(0, task.estimatedTime - elapsed); // 剩余时间
        
        return `
            <div class="processing-item">
                <div class="processing-header">
                    <div class="processing-title">${task.filename}</div>
                    <div class="processing-status">${task.progress}%</div>
                </div>
                <div class="processing-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${task.progress}%"></div>
                    </div>
                </div>
                <div class="processing-info">
                    <div class="processing-time">
                        <i class="fas fa-clock"></i>
                        已处理 ${elapsed} 分钟
                    </div>
                    <div class="processing-time">
                        <i class="fas fa-hourglass-half"></i>
                        预计还需 ${remaining} 分钟
                    </div>
                </div>
            </div>
        `;
    }).join('');
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
    const filters = ['dataTypeFilter', 'statusFilter', 'startDate', 'endDate'];
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
    
    // 全选checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', toggleSelectAll);
    }
}

// ===== 数据操作功能 =====

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
        
        // 特殊处理不同类型的字段
        if (field === 'date') {
            aVal = aVal.getTime();
            bVal = bVal.getTime();
        } else if (field === 'size') {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        } else if (field === 'quality') {
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
    
    // 重置到第一页
    currentPage = 1;
    renderDataTable();
    
    // 更新排序图标
    updateSortIcons(field, currentSort.order);
    
    showNotification(`已按${getSortFieldName(field)}${currentSort.order === 'asc' ? '升序' : '降序'}排列`, 'success');
}

/**
 * 获取排序字段名称
 */
function getSortFieldName(field) {
    const fieldNames = {
        name: '文件名称',
        type: '数据类型',
        date: '获取时间',
        size: '文件大小',
        status: '处理状态',
        quality: '数据质量'
    };
    return fieldNames[field] || field;
}

/**
 * 更新排序图标
 */
function updateSortIcons(activeField, order) {
    document.querySelectorAll('th[data-sort] .sort-icon').forEach(icon => {
        const th = icon.closest('th');
        const field = th.getAttribute('data-sort');
        
        if (field === activeField) {
            icon.className = `fas fa-sort-${order === 'asc' ? 'up' : 'down'} sort-icon`;
            th.setAttribute('data-order', order);
        } else {
            icon.className = 'fas fa-sort sort-icon';
            th.removeAttribute('data-order');
        }
    });
}

/**
 * 应用筛选
 */
function applyFilters() {
    const dataType = document.getElementById('dataTypeFilter')?.value || '';
    const status = document.getElementById('statusFilter')?.value || '';
    const startDate = document.getElementById('startDate')?.value || '';
    const endDate = document.getElementById('endDate')?.value || '';
    const searchText = document.querySelector('.search-input')?.value?.toLowerCase() || '';
    
    filteredData = dataList.filter(item => {
        // 数据类型筛选
        if (dataType && !item.type.toLowerCase().includes(dataType.toLowerCase())) {
            return false;
        }
        
        // 状态筛选
        if (status && item.status !== status) {
            return false;
        }
        
        // 时间范围筛选
        if (startDate) {
            const start = new Date(startDate);
            if (item.date < start) return false;
        }
        
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999); // 包含结束日期的整天
            if (item.date > end) return false;
        }
        
        // 搜索文本筛选
        if (searchText) {
            const searchFields = [item.filename, item.type, item.notes].join(' ').toLowerCase();
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
    
    const filterCount = [dataType, status, startDate, endDate, searchText].filter(Boolean).length;
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
        'dataTypeFilter',
        'statusFilter', 
        'startDate',
        'endDate'
    ];
    
    filterElements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
    
    // 清除搜索框
    const searchInput = document.querySelector('.search-input');
    if (searchInput) searchInput.value = '';
    
    // 重置数据
    filteredData = [...dataList];
    currentPage = 1;
    selectedRows.clear();
    
    renderDataTable();
    
    showNotification('已清除所有筛选条件', 'success');
}

/**
 * 处理搜索
 */
function handleSearch() {
    applyFilters();
}

// ===== 选择操作 =====

/**
 * 切换行选择
 */
function toggleRowSelection(id) {
    if (selectedRows.has(id)) {
        selectedRows.delete(id);
    } else {
        selectedRows.add(id);
    }
    
    updateBatchActionButtons();
    updateSelectAllCheckbox();
}

/**
 * 切换全选
 */
function toggleSelectAll() {
    const selectAllCheckbox = document.getElementById('selectAll');
    const isChecked = selectAllCheckbox.checked;
    
    selectedRows.clear();
    
    if (isChecked) {
        // 选择当前页的所有项目
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageData = filteredData.slice(startIndex, endIndex);
        
        pageData.forEach(item => {
            selectedRows.add(item.id);
        });
    }
    
    renderDataTable();
    updateBatchActionButtons();
}

/**
 * 更新全选复选框状态
 */
function updateSelectAllCheckbox() {
    const selectAllCheckbox = document.getElementById('selectAll');
    if (!selectAllCheckbox) return;
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pageData = filteredData.slice(startIndex, endIndex);
    
    const selectedInPage = pageData.filter(item => selectedRows.has(item.id)).length;
    
    if (selectedInPage === 0) {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = false;
    } else if (selectedInPage === pageData.length) {
        selectAllCheckbox.checked = true;
        selectAllCheckbox.indeterminate = false;
    } else {
        selectAllCheckbox.checked = false;
        selectAllCheckbox.indeterminate = true;
    }
}

/**
 * 更新批量操作按钮状态
 */
function updateBatchActionButtons() {
    const hasSelection = selectedRows.size > 0;
    
    const buttons = [
        'batchDeleteBtn',
        'batchDownloadBtn', 
        'batchProcessBtn'
    ];
    
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = !hasSelection;
        }
    });
}

// ===== 分页操作 =====

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

// ===== 数据操作功能 =====

/**
 * 查看数据详情
 */
function viewDataDetails(id) {
    const data = dataList.find(item => item.id === id);
    if (!data) {
        showNotification('数据不存在', 'error');
        return;
    }
    
    const qualityLevel = getQualityLevel(data.quality);
    const qualityText = {
        excellent: '优秀',
        good: '良好', 
        fair: '一般',
        poor: '较差'
    }[qualityLevel];
    
    showModal({
        title: '遥感数据详情',
        content: `
            <div class="data-details">
                <div class="detail-section">
                    <h4>基本信息</h4>
                    <div class="detail-grid">
                        <div class="detail-item">
                            <label>文件名称:</label>
                            <span>${data.filename}</span>
                        </div>
                        <div class="detail-item">
                            <label>数据类型:</label>
                            <span class="data-type-badge ${data.type.toLowerCase().replace(/[^a-z0-9]/g, '')}">${data.type}</span>
                        </div>
                        <div class="detail-item">
                            <label>文件大小:</label>
                            <span>${formatFileSize(data.size * 1024 * 1024)}</span>
                        </div>
                        <div class="detail-item">
                            <label>获取时间:</label>
                            <span>${data.date.toLocaleString('zh-CN')}</span>
                        </div>
                        <div class="detail-item">
                            <label>上传时间:</label>
                            <span>${data.uploadTime.toLocaleString('zh-CN')}</span>
                        </div>
                        <div class="detail-item">
                            <label>处理状态:</label>
                            <span class="status-badge ${data.status}">${getStatusText(data.status)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>质量信息</h4>
                    <div class="quality-display">
                        <div class="quality-score">
                            <div class="quality-bar">
                                <div class="quality-fill ${qualityLevel}" style="width: ${data.quality}%"></div>
                            </div>
                            <span class="quality-text">${data.quality}% (${qualityText})</span>
                        </div>
                    </div>
                </div>
                
                ${data.processingTime ? `
                <div class="detail-section">
                    <h4>处理信息</h4>
                    <div class="detail-item">
                        <label>处理耗时:</label>
                        <span>${data.processingTime} 分钟</span>
                    </div>
                </div>
                ` : ''}
                
                ${data.notes ? `
                <div class="detail-section">
                    <h4>备注信息</h4>
                    <p>${data.notes}</p>
                </div>
                ` : ''}
            </div>
        `,
        actions: [
            { text: '下载数据', class: 'btn-primary', onclick: `downloadData('${id}'); closeModal();` },
            { text: '关闭', class: 'btn-secondary', onclick: 'closeModal()' }
        ]
    });
}

/**
 * 下载数据
 */
function downloadData(id) {
    const data = dataList.find(item => item.id === id);
    if (!data) {
        showNotification('数据不存在', 'error');
        return;
    }
    
    showNotification(`正在准备下载 ${data.filename}...`, 'info');
    
    // 模拟下载过程
    setTimeout(() => {
        showNotification(`${data.filename} 下载已开始`, 'success');
        // 这里可以实现真实的下载逻辑
    }, 1000);
}

/**
 * 处理数据
 */
function processData(id) {
    const data = dataList.find(item => item.id === id);
    if (!data) {
        showNotification('数据不存在', 'error');
        return;
    }
    
    if (data.status !== 'pending') {
        showNotification('只能处理状态为"待处理"的数据', 'warning');
        return;
    }
    
    // 更新数据状态
    data.status = 'processing';
    
    // 添加到处理任务列表
    processingTasks.push({
        id: data.id,
        filename: data.filename,
        progress: 5,
        startTime: new Date(),
        estimatedTime: Math.floor(Math.random() * 60 + 30) // 30-90分钟
    });
    
    renderDataTable();
    renderProcessingMonitor();
    
    showNotification(`已开始处理 ${data.filename}`, 'success');
}

/**
 * 删除数据
 */
function deleteData(id) {
    const data = dataList.find(item => item.id === id);
    if (!data) {
        showNotification('数据不存在', 'error');
        return;
    }
    
    showConfirm(`确定要删除数据 "${data.filename}" 吗？\n\n此操作不可撤销。`, () => {
        // 从数据列表中移除
        const index = dataList.findIndex(item => item.id === id);
        if (index > -1) {
            dataList.splice(index, 1);
        }
        
        // 从筛选数据中移除
        const filteredIndex = filteredData.findIndex(item => item.id === id);
        if (filteredIndex > -1) {
            filteredData.splice(filteredIndex, 1);
        }
        
        // 从选择中移除
        selectedRows.delete(id);
        
        // 从处理任务中移除
        const taskIndex = processingTasks.findIndex(task => task.id === id);
        if (taskIndex > -1) {
            processingTasks.splice(taskIndex, 1);
        }
        
        // 更新总记录数
        totalRecords = dataList.length;
        
        // 检查当前页是否还有数据
        const totalPages = Math.ceil(filteredData.length / pageSize);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        renderDataTable();
        renderProcessingMonitor();
        
        showNotification(`已删除数据 ${data.filename}`, 'success');
    });
}

// ===== 批量操作 =====

/**
 * 批量删除
 */
function batchDelete() {
    if (selectedRows.size === 0) {
        showNotification('请先选择要删除的数据', 'warning');
        return;
    }
    
    showConfirm(`确定要删除选中的 ${selectedRows.size} 条数据吗？\n\n此操作不可撤销。`, () => {
        let deletedCount = 0;
        
        selectedRows.forEach(id => {
            const dataIndex = dataList.findIndex(item => item.id === id);
            if (dataIndex > -1) {
                dataList.splice(dataIndex, 1);
                deletedCount++;
            }
            
            const filteredIndex = filteredData.findIndex(item => item.id === id);
            if (filteredIndex > -1) {
                filteredData.splice(filteredIndex, 1);
            }
            
            const taskIndex = processingTasks.findIndex(task => task.id === id);
            if (taskIndex > -1) {
                processingTasks.splice(taskIndex, 1);
            }
        });
        
        selectedRows.clear();
        totalRecords = dataList.length;
        
        // 检查当前页
        const totalPages = Math.ceil(filteredData.length / pageSize);
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = totalPages;
        }
        
        renderDataTable();
        renderProcessingMonitor();
        
        showNotification(`已删除 ${deletedCount} 条数据`, 'success');
    });
}

/**
 * 批量下载
 */
function batchDownload() {
    if (selectedRows.size === 0) {
        showNotification('请先选择要下载的数据', 'warning');
        return;
    }
    
    showNotification(`正在准备下载 ${selectedRows.size} 个文件...`, 'info');
    
    // 模拟批量下载
    setTimeout(() => {
        showNotification(`${selectedRows.size} 个文件下载已开始`, 'success');
        // 这里可以实现真实的批量下载逻辑
    }, 2000);
}

/**
 * 批量处理
 */
function batchProcess() {
    if (selectedRows.size === 0) {
        showNotification('请先选择要处理的数据', 'warning');
        return;
    }
    
    const pendingItems = Array.from(selectedRows)
        .map(id => dataList.find(item => item.id === id))
        .filter(item => item && item.status === 'pending');
    
    if (pendingItems.length === 0) {
        showNotification('选中的数据中没有可处理的项目（状态必须为"待处理"）', 'warning');
        return;
    }
    
    // 批量开始处理
    pendingItems.forEach(data => {
        data.status = 'processing';
        
        processingTasks.push({
            id: data.id,
            filename: data.filename,
            progress: Math.floor(Math.random() * 10 + 5),
            startTime: new Date(),
            estimatedTime: Math.floor(Math.random() * 60 + 30)
        });
    });
    
    renderDataTable();
    renderProcessingMonitor();
    
    showNotification(`已开始批量处理 ${pendingItems.length} 个文件`, 'success');
}

// ===== 上传功能 =====

/**
 * 初始化上传功能
 */
function initializeUpload() {
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    
    if (!uploadZone || !fileInput) return;
    
    // 拖拽上传
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    
    uploadZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });
    
    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        const files = Array.from(e.dataTransfer.files);
        handleFileSelection(files);
    });
    
    // 文件选择
    fileInput.addEventListener('change', function() {
        const files = Array.from(this.files);
        handleFileSelection(files);
    });
}

/**
 * 处理文件选择
 */
function handleFileSelection(files) {
    const validFiles = files.filter(file => {
        const validExtensions = ['.tif', '.tiff', '.img', '.jp2', '.zip'];
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
        
        if (!validExtensions.includes(extension)) {
            showNotification(`文件 ${file.name} 格式不支持`, 'error');
            return false;
        }
        
        if (file.size > maxSize) {
            showNotification(`文件 ${file.name} 大小超过限制 (2GB)`, 'error');
            return false;
        }
        
        return true;
    });
    
    if (validFiles.length === 0) {
        return;
    }
    
    // 显示上传进度
    const uploadProgress = document.getElementById('uploadProgress');
    if (uploadProgress) {
        uploadProgress.style.display = 'block';
        uploadProgress.innerHTML = validFiles.map(file => `
            <div class="progress-item">
                <div class="progress-info">
                    <span class="filename">${file.name}</span>
                    <span class="progress-percent">0%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: 0%"></div>
                </div>
            </div>
        `).join('');
    }
    
    showNotification(`已选择 ${validFiles.length} 个文件，点击"开始上传"按钮开始上传`, 'info');
}

/**
 * 显示上传模态框
 */
function showUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.add('show');
        
        // 重置表单
        const fileInput = document.getElementById('fileInput');
        const uploadProgress = document.getElementById('uploadProgress');
        const acquisitionTime = document.getElementById('acquisitionTime');
        const uploadNotes = document.getElementById('uploadNotes');
        
        if (fileInput) fileInput.value = '';
        if (uploadProgress) uploadProgress.style.display = 'none';
        if (acquisitionTime) acquisitionTime.value = '';
        if (uploadNotes) uploadNotes.value = '';
    }
}

/**
 * 关闭上传模态框
 */
function closeUploadModal() {
    const modal = document.getElementById('uploadModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 开始上传
 */
function startUpload() {
    const fileInput = document.getElementById('fileInput');
    const dataType = document.getElementById('uploadDataType')?.value || 'landsat';
    const acquisitionTime = document.getElementById('acquisitionTime')?.value;
    const notes = document.getElementById('uploadNotes')?.value || '';
    
    if (!fileInput || fileInput.files.length === 0) {
        showNotification('请先选择要上传的文件', 'warning');
        return;
    }
    
    const files = Array.from(fileInput.files);
    
    // 模拟上传过程
    let uploadedCount = 0;
    
    files.forEach((file, index) => {
        setTimeout(() => {
            // 模拟上传进度
            const progressItem = document.querySelectorAll('.progress-item')[index];
            if (progressItem) {
                const progressFill = progressItem.querySelector('.progress-fill');
                const progressPercent = progressItem.querySelector('.progress-percent');
                
                let progress = 0;
                const uploadInterval = setInterval(() => {
                    progress += Math.random() * 10;
                    if (progress >= 100) {
                        progress = 100;
                        clearInterval(uploadInterval);
                        
                        uploadedCount++;
                        
                        // 添加到数据列表
                        const newData = {
                            id: `rs_${String(dataList.length + 1).padStart(4, '0')}`,
                            filename: file.name,
                            type: dataType,
                            date: acquisitionTime ? new Date(acquisitionTime) : new Date(),
                            size: Math.floor(file.size / (1024 * 1024)), // 转换为MB
                            status: 'pending',
                            quality: Math.floor(Math.random() * 40 + 60), // 60-100
                            uploadTime: new Date(),
                            processingTime: null,
                            notes: notes
                        };
                        
                        dataList.unshift(newData); // 添加到开头
                        totalRecords = dataList.length;
                        
                        // 如果所有文件都上传完成
                        if (uploadedCount === files.length) {
                            applyFilters(); // 重新应用筛选
                            closeUploadModal();
                            showNotification(`已成功上传 ${files.length} 个文件`, 'success');
                        }
                    }
                    
                    if (progressFill) progressFill.style.width = progress + '%';
                    if (progressPercent) progressPercent.textContent = Math.floor(progress) + '%';
                }, 100);
            }
        }, index * 500); // 错开上传时间
    });
}

// ===== 其他功能 =====

/**
 * 刷新处理状态
 */
function refreshProcessingStatus() {
    // 模拟状态更新
    processingTasks.forEach(task => {
        task.progress = Math.min(100, task.progress + Math.random() * 10);
        
        if (task.progress >= 100) {
            // 任务完成，更新数据状态
            const data = dataList.find(item => item.id === task.id);
            if (data) {
                data.status = 'completed';
                data.processingTime = Math.floor((Date.now() - task.startTime) / 60000);
            }
        }
    });
    
    // 移除已完成的任务
    processingTasks = processingTasks.filter(task => task.progress < 100);
    
    renderProcessingMonitor();
    renderDataTable();
    
    showNotification('处理状态已更新', 'success');
}

/**
 * 切换视图模式
 */
function toggleView(viewMode) {
    // 这里可以实现网格视图和列表视图的切换
    showNotification(`切换到${viewMode === 'grid' ? '网格' : '列表'}视图`, 'info');
}

/**
 * 导出表格
 */
function exportTable() {
    showNotification('表格导出功能开发中...', 'info');
    // 这里可以实现表格导出功能
}

// ===== 实时更新 =====

/**
 * 开始实时更新
 */
function startRealTimeUpdate() {
    // 每30秒更新一次处理进度
    setInterval(() => {
        if (processingTasks.length > 0) {
            processingTasks.forEach(task => {
                task.progress = Math.min(100, task.progress + Math.random() * 5);
            });
            
            renderProcessingMonitor();
        }
    }, 30000);
}

// ===== 工具函数 =====

/**
 * 格式化文件大小（如果common.js中没有定义）
 */
if (typeof formatFileSize === 'undefined') {
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
}

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
 
 
 
 
 
 
 
 
 