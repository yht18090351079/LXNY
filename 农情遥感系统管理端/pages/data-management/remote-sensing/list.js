/**
 * 遥感数据管理页面功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化数据表格
  initDataTable();
  
  // 初始化筛选功能
  initFilters();
  
  // 初始化视图切换
  initViewToggle();
  
  // 初始化分页
  initPagination();
  
  // 模拟数据加载
  loadMockData();
});



/**
 * 模拟数据
 */
const mockData = [
  {
    id: 'RS20241215001',
    name: 'Landsat-8_北京地区_202412',
    type: 'optical',
    typeName: '光学影像',
    satellite: 'landsat',
    satelliteName: 'Landsat-8',
    collectTime: '2024-12-15 10:30:00',
    spatialRange: '116.20°E-116.60°E, 39.80°N-40.20°N',
    resolution: '30m',
    size: '2.3GB',
    status: 'processed',
    statusName: '已处理',
    preview: 'https://via.placeholder.com/300x200?text=Landsat-8'
  },
  {
    id: 'RS20241215002',
    name: 'Sentinel-2_上海地区_202412',
    type: 'optical',
    typeName: '光学影像',
    satellite: 'sentinel',
    satelliteName: 'Sentinel-2',
    collectTime: '2024-12-14 14:20:00',
    spatialRange: '121.20°E-121.80°E, 31.00°N-31.40°N',
    resolution: '10m',
    size: '1.8GB',
    status: 'processing',
    statusName: '处理中',
    preview: 'https://via.placeholder.com/300x200?text=Sentinel-2'
  },
  {
    id: 'RS20241215003',
    name: 'MODIS_华北平原_202412',
    type: 'optical',
    typeName: '光学影像',
    satellite: 'modis',
    satelliteName: 'MODIS',
    collectTime: '2024-12-13 09:15:00',
    spatialRange: '114.00°E-120.00°E, 36.00°N-41.00°N',
    resolution: '250m',
    size: '580MB',
    status: 'processed',
    statusName: '已处理',
    preview: 'https://via.placeholder.com/300x200?text=MODIS'
  },
  {
    id: 'RS20241215004',
    name: '高分一号_长江流域_202412',
    type: 'optical',
    typeName: '光学影像',
    satellite: 'gf',
    satelliteName: '高分一号',
    collectTime: '2024-12-12 11:45:00',
    spatialRange: '108.00°E-122.00°E, 28.00°N-35.00°N',
    resolution: '2m',
    size: '4.2GB',
    status: 'failed',
    statusName: '处理失败',
    preview: 'https://via.placeholder.com/300x200?text=GF-1'
  },
  {
    id: 'RS20241215005',
    name: 'Sentinel-1_珠江三角洲_202412',
    type: 'radar',
    typeName: '雷达数据',
    satellite: 'sentinel',
    satelliteName: 'Sentinel-1',
    collectTime: '2024-12-11 16:30:00',
    spatialRange: '112.50°E-114.50°E, 22.30°N-24.30°N',
    resolution: '10m',
    size: '1.2GB',
    status: 'pending',
    statusName: '待处理',
    preview: 'https://via.placeholder.com/300x200?text=Sentinel-1'
  }
];

let currentData = [...mockData];
let currentPage = 1;
let pageSize = 20;
let selectedItems = new Set();

/**
 * 加载模拟数据
 */
function loadMockData() {
  // 扩展模拟数据到更多条目
  const extendedData = [];
  for (let i = 0; i < 143; i++) {
    const baseItem = mockData[i % mockData.length];
    extendedData.push({
      ...baseItem,
      id: `RS2024121${String(i + 1).padStart(4, '0')}`,
      name: `${baseItem.name}_${i + 1}`,
      collectTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ')
    });
  }
  
  currentData = extendedData;
  updateTotalCount();
  renderCurrentView();
}

/**
 * 初始化数据表格
 */
function initDataTable() {
  // 全选功能
  const selectAllCheckbox = document.getElementById('selectAll');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', toggleSelectAll);
  }
  
  // 页面大小选择
  const pageSizeSelect = document.getElementById('pageSize');
  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', function() {
      pageSize = parseInt(this.value);
      currentPage = 1;
      renderCurrentView();
      updatePagination();
    });
  }
}

/**
 * 初始化筛选功能
 */
function initFilters() {
  // 搜索功能
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let searchTimeout;
    searchInput.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        applyFilters();
      }, 300);
    });
  }
  
  // 筛选器变化事件
  const filters = ['dataTypeFilter', 'satelliteFilter', 'statusFilter', 'startDate', 'endDate'];
  filters.forEach(filterId => {
    const element = document.getElementById(filterId);
    if (element) {
      element.addEventListener('change', applyFilters);
    }
  });
}

/**
 * 初始化视图切换
 */
function initViewToggle() {
  const viewBtns = document.querySelectorAll('.view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const viewType = this.dataset.view;
      switchView(viewType);
    });
  });
}

/**
 * 切换视图
 */
function switchView(viewType) {
  // 更新按钮状态
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
  
  // 切换视图
  const tableView = document.getElementById('tableView');
  const gridView = document.getElementById('gridView');
  
  if (viewType === 'table') {
    tableView.classList.add('active');
    gridView.classList.remove('active');
    renderTableView();
  } else {
    tableView.classList.remove('active');
    gridView.classList.add('active');
    renderGridView();
  }
}

/**
 * 渲染当前视图
 */
function renderCurrentView() {
  const activeViewBtn = document.querySelector('.view-btn.active');
  const viewType = activeViewBtn ? activeViewBtn.dataset.view : 'table';
  
  if (viewType === 'table') {
    renderTableView();
  } else {
    renderGridView();
  }
}

/**
 * 渲染表格视图
 */
function renderTableView() {
  const tbody = document.getElementById('dataTableBody');
  if (!tbody) return;
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, currentData.length);
  const pageData = currentData.slice(startIndex, endIndex);
  
  tbody.innerHTML = pageData.map(item => `
    <tr>
      <td>
        <input type="checkbox" value="${item.id}" onchange="toggleItemSelection('${item.id}')">
      </td>
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.typeName}</td>
      <td>${item.satelliteName}</td>
      <td>${item.collectTime}</td>
      <td>${item.spatialRange}</td>
      <td>${item.resolution}</td>
      <td>${item.size}</td>
      <td>
        <span class="status-tag ${item.status}">
          <i class="fas fa-${getStatusIcon(item.status)}"></i>
          ${item.statusName}
        </span>
      </td>
      <td>
        <div class="action-btns">
          <button class="action-btn-small view" onclick="viewDataDetail('${item.id}')" title="查看详情">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn-small download" onclick="downloadData('${item.id}')" title="下载">
            <i class="fas fa-download"></i>
          </button>
          <button class="action-btn-small delete" onclick="deleteData('${item.id}')" title="删除">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
  
  updatePaginationInfo();
}

/**
 * 渲染网格视图
 */
function renderGridView() {
  const gridContainer = document.getElementById('dataGrid');
  if (!gridContainer) return;
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, currentData.length);
  const pageData = currentData.slice(startIndex, endIndex);
  
  gridContainer.innerHTML = pageData.map(item => `
    <div class="grid-item" onclick="viewDataDetail('${item.id}')">
      <div class="grid-item-header">
        <div class="grid-item-icon">
          <i class="fas fa-${getTypeIcon(item.type)}"></i>
        </div>
        <div>
          <h4 class="grid-item-title">${item.name}</h4>
          <p class="grid-item-subtitle">${item.id}</p>
        </div>
      </div>
      <div class="grid-item-content">
        <div class="grid-item-meta">
          <div class="meta-item">
            <span class="meta-label">数据类型</span>
            <span class="meta-value">${item.typeName}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">卫星来源</span>
            <span class="meta-value">${item.satelliteName}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">采集时间</span>
            <span class="meta-value">${item.collectTime}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">分辨率</span>
            <span class="meta-value">${item.resolution}</span>
          </div>
        </div>
      </div>
      <div class="grid-item-status">
        <span class="status-tag ${item.status}">
          <i class="fas fa-${getStatusIcon(item.status)}"></i>
          ${item.statusName}
        </span>
      </div>
      <div class="grid-item-actions" onclick="event.stopPropagation()">
        <button class="btn btn-outline" onclick="downloadData('${item.id}')">
          <i class="fas fa-download"></i>
          下载
        </button>
        <button class="btn btn-danger" onclick="deleteData('${item.id}')">
          <i class="fas fa-trash"></i>
          删除
        </button>
      </div>
    </div>
  `).join('');
  
  updatePaginationInfo();
}

/**
 * 获取状态图标
 */
function getStatusIcon(status) {
  const icons = {
    processed: 'check-circle',
    processing: 'spinner',
    pending: 'clock',
    failed: 'exclamation-triangle'
  };
  return icons[status] || 'question-circle';
}

/**
 * 获取类型图标
 */
function getTypeIcon(type) {
  const icons = {
    optical: 'camera',
    radar: 'broadcast-tower',
    hyperspectral: 'spectrum',
    thermal: 'thermometer-half'
  };
  return icons[type] || 'satellite';
}

/**
 * 初始化分页
 */
function initPagination() {
  updatePagination();
}

/**
 * 更新分页
 */
function updatePagination() {
  const totalPages = Math.ceil(currentData.length / pageSize);
  const pagination = document.getElementById('pagination');
  
  if (!pagination) return;
  
  let paginationHTML = '';
  
  // 上一页按钮
  paginationHTML += `
    <button class="page-btn" ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
      <i class="fas fa-chevron-left"></i>
    </button>
  `;
  
  // 页码按钮
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);
  
  if (startPage > 1) {
    paginationHTML += `<button class="page-btn" onclick="goToPage(1)">1</button>`;
    if (startPage > 2) {
      paginationHTML += `<span class="page-ellipsis">...</span>`;
    }
  }
  
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">
        ${i}
      </button>
    `;
  }
  
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationHTML += `<span class="page-ellipsis">...</span>`;
    }
    paginationHTML += `<button class="page-btn" onclick="goToPage(${totalPages})">${totalPages}</button>`;
  }
  
  // 下一页按钮
  paginationHTML += `
    <button class="page-btn" ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
      <i class="fas fa-chevron-right"></i>
    </button>
  `;
  
  pagination.innerHTML = paginationHTML;
  updatePaginationInfo();
}

/**
 * 跳转到指定页面
 */
function goToPage(page) {
  const totalPages = Math.ceil(currentData.length / pageSize);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderCurrentView();
  updatePagination();
}

/**
 * 更新分页信息
 */
function updatePaginationInfo() {
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, currentData.length);
  
  const pageStartEl = document.getElementById('pageStart');
  const pageEndEl = document.getElementById('pageEnd');
  const totalItemsEl = document.getElementById('totalItems');
  
  if (pageStartEl) pageStartEl.textContent = startIndex;
  if (pageEndEl) pageEndEl.textContent = endIndex;
  if (totalItemsEl) totalItemsEl.textContent = currentData.length;
}

/**
 * 更新总数据量显示
 */
function updateTotalCount() {
  const totalCountEl = document.getElementById('totalCount');
  if (totalCountEl) {
    totalCountEl.textContent = currentData.length;
  }
}

/**
 * 应用筛选
 */
function applyFilters() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const dataType = document.getElementById('dataTypeFilter')?.value || '';
  const satellite = document.getElementById('satelliteFilter')?.value || '';
  const status = document.getElementById('statusFilter')?.value || '';
  const startDate = document.getElementById('startDate')?.value || '';
  const endDate = document.getElementById('endDate')?.value || '';
  
  currentData = mockData.filter(item => {
    // 搜索过滤
    if (searchTerm && !item.name.toLowerCase().includes(searchTerm) && 
        !item.id.toLowerCase().includes(searchTerm)) {
      return false;
    }
    
    // 数据类型过滤
    if (dataType && item.type !== dataType) {
      return false;
    }
    
    // 卫星来源过滤
    if (satellite && item.satellite !== satellite) {
      return false;
    }
    
    // 状态过滤
    if (status && item.status !== status) {
      return false;
    }
    
    // 时间范围过滤
    if (startDate || endDate) {
      const itemDate = item.collectTime.split(' ')[0];
      if (startDate && itemDate < startDate) {
        return false;
      }
      if (endDate && itemDate > endDate) {
        return false;
      }
    }
    
    return true;
  });
  
  currentPage = 1;
  selectedItems.clear();
  updateSelectAllState();
  updateTotalCount();
  renderCurrentView();
  updatePagination();
}

/**
 * 重置筛选
 */
function resetFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('dataTypeFilter').value = '';
  document.getElementById('satelliteFilter').value = '';
  document.getElementById('statusFilter').value = '';
  document.getElementById('startDate').value = '';
  document.getElementById('endDate').value = '';
  
  loadMockData();
}

/**
 * 搜索数据
 */
function searchData() {
  applyFilters();
}

/**
 * 切换全选状态
 */
function toggleSelectAll() {
  const selectAllCheckbox = document.getElementById('selectAll');
  const isChecked = selectAllCheckbox.checked;
  
  const checkboxes = document.querySelectorAll('#dataTableBody input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
    checkbox.checked = isChecked;
    if (isChecked) {
      selectedItems.add(checkbox.value);
    } else {
      selectedItems.delete(checkbox.value);
    }
  });
  
  updateBatchActions();
}

/**
 * 切换单项选择
 */
function toggleItemSelection(itemId) {
  const checkbox = document.querySelector(`input[value="${itemId}"]`);
  if (checkbox.checked) {
    selectedItems.add(itemId);
  } else {
    selectedItems.delete(itemId);
  }
  
  updateSelectAllState();
  updateBatchActions();
}

/**
 * 更新全选状态
 */
function updateSelectAllState() {
  const selectAllCheckbox = document.getElementById('selectAll');
  const checkboxes = document.querySelectorAll('#dataTableBody input[type="checkbox"]');
  
  if (checkboxes.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
  } else {
    const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
    
    if (checkedCount === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedCount === checkboxes.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }
}

/**
 * 更新批量操作
 */
function updateBatchActions() {
  if (selectedItems.size > 0) {
    showBatchActions();
  } else {
    hideBatchActions();
  }
}

/**
 * 显示批量操作
 */
function showBatchActions() {
  // 这里可以添加显示批量操作按钮的逻辑
  console.log(`已选择 ${selectedItems.size} 个项目`);
}

/**
 * 隐藏批量操作
 */
function hideBatchActions() {
  // 这里可以添加隐藏批量操作按钮的逻辑
}

/**
 * 查看数据详情
 */
function viewDataDetail(dataId) {
  const data = currentData.find(item => item.id === dataId);
  if (!data) return;
  
  const modal = document.getElementById('dataDetailModal');
  const content = document.getElementById('dataDetailContent');
  
  content.innerHTML = `
    <div class="detail-grid">
      <div class="detail-item">
        <label>数据ID：</label>
        <span>${data.id}</span>
      </div>
      <div class="detail-item">
        <label>数据名称：</label>
        <span>${data.name}</span>
      </div>
      <div class="detail-item">
        <label>数据类型：</label>
        <span>${data.typeName}</span>
      </div>
      <div class="detail-item">
        <label>卫星来源：</label>
        <span>${data.satelliteName}</span>
      </div>
      <div class="detail-item">
        <label>采集时间：</label>
        <span>${data.collectTime}</span>
      </div>
      <div class="detail-item">
        <label>空间范围：</label>
        <span>${data.spatialRange}</span>
      </div>
      <div class="detail-item">
        <label>分辨率：</label>
        <span>${data.resolution}</span>
      </div>
      <div class="detail-item">
        <label>数据大小：</label>
        <span>${data.size}</span>
      </div>
      <div class="detail-item">
        <label>处理状态：</label>
        <span class="status-tag ${data.status}">
          <i class="fas fa-${getStatusIcon(data.status)}"></i>
          ${data.statusName}
        </span>
      </div>
    </div>
  `;
  
  modal.classList.add('active');
}

/**
 * 关闭模态框
 */
function closeModal() {
  const modal = document.getElementById('dataDetailModal');
  modal.classList.remove('active');
}

/**
 * 下载数据
 */
function downloadData(dataId) {
  const data = currentData.find(item => item.id === dataId);
  if (!data) return;
  
  // 模拟下载
  alert(`开始下载：${data.name}`);
  console.log(`下载数据：${dataId}`);
}

/**
 * 删除数据
 */
function deleteData(dataId) {
  if (confirm('确定要删除这条数据吗？')) {
    // 模拟删除
    console.log(`删除数据：${dataId}`);
    alert('数据删除成功');
    
    // 从当前数据中移除
    const index = currentData.findIndex(item => item.id === dataId);
    if (index > -1) {
      currentData.splice(index, 1);
      updateTotalCount();
      renderCurrentView();
      updatePagination();
    }
  }
}

/**
 * 导入数据
 */
function importData() {
  window.location.href = 'import.html';
}

/**
 * 导出数据
 */
function exportData() {
  alert('开始导出数据...');
  console.log('导出当前筛选的数据');
}

/**
 * 批量处理
 */
function batchProcess() {
  if (selectedItems.size === 0) {
    alert('请先选择要处理的数据');
    return;
  }
  
  if (confirm(`确定要处理选中的 ${selectedItems.size} 条数据吗？`)) {
    alert('开始批量处理...');
    console.log('批量处理数据：', Array.from(selectedItems));
  }
}

/**
 * 批量下载
 */
function batchDownload() {
  if (selectedItems.size === 0) {
    alert('请先选择要下载的数据');
    return;
  }
  
  alert(`开始下载 ${selectedItems.size} 条数据...`);
  console.log('批量下载数据：', Array.from(selectedItems));
}

/**
 * 批量删除
 */
function batchDelete() {
  if (selectedItems.size === 0) {
    alert('请先选择要删除的数据');
    return;
  }
  
  if (confirm(`确定要删除选中的 ${selectedItems.size} 条数据吗？此操作不可恢复！`)) {
    alert('批量删除完成');
    console.log('批量删除数据：', Array.from(selectedItems));
    
    // 从当前数据中移除选中的项
    currentData = currentData.filter(item => !selectedItems.has(item.id));
    selectedItems.clear();
    updateTotalCount();
    renderCurrentView();
    updatePagination();
  }
}



// 模态框点击外部关闭
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});