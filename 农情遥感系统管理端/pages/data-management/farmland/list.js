/**
 * 农田数据管理页面功能
 */

// 全局变量
let currentView = 'list';
let currentPage = 1;
let pageSize = 20;
let totalItems = 0;
let farmlandData = [];
let filteredData = [];
let selectedItems = [];

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化数据表格
  initDataTable();
  
  // 初始化筛选功能
  initFilters();
  
  // 初始化视图切换
  initViewToggle();
  
  // 初始化分页
  initPagination();
  
  // 初始化事件监听
  initEventListeners();
  
  // 模拟数据加载
  loadMockData();
});

/**
 * 模拟农田数据
 */
const mockFarmlandData = [
  {
    id: 'FL001',
    code: 'LX-001',
    name: '临夏示范农田1号',
    area: 15.5,
    crop: '小麦',
    plantingTime: '2024-03-15',
    growthStage: '抽穗期',
    health: 'good',
    region: '临夏州',
    soilType: '壤土',
    irrigation: '滴灌',
    longitude: 103.2105,
    latitude: 35.5990,
    status: 'active',
    lastUpdate: '2024-01-15 09:30:00',
    description: '示范种植区域，土壤肥沃，灌溉设施完善'
  },
  {
    id: 'FL002',
    code: 'DX-001',
    name: '东乡玉米基地',
    area: 28.3,
    crop: '玉米',
    plantingTime: '2024-04-10',
    growthStage: '拔节期',
    health: 'good',
    region: '东乡县',
    soilType: '沙土',
    irrigation: '喷灌',
    longitude: 103.3892,
    latitude: 35.6644,
    status: 'active',
    lastUpdate: '2024-01-15 08:45:00',
    description: '主要种植玉米，产量稳定'
  },
  {
    id: 'FL003',
    code: 'YJ-001',
    name: '永靖蔬菜园区',
    area: 8.7,
    crop: '蔬菜',
    plantingTime: '2024-02-20',
    growthStage: '成熟期',
    health: 'warning',
    region: '永靖县',
    soilType: '粘土',
    irrigation: '沟灌',
    longitude: 103.3200,
    latitude: 35.9389,
    status: 'harvesting',
    lastUpdate: '2024-01-14 16:20:00',
    description: '多种蔬菜种植，需要加强病虫害防治'
  },
  {
    id: 'FL004',
    code: 'HZ-001',
    name: '和政果园',
    area: 45.2,
    crop: '果树',
    plantingTime: '2023-10-01',
    growthStage: '休眠期',
    health: 'good',
    region: '和政县',
    soilType: '壤土',
    irrigation: '滴灌',
    longitude: 103.3500,
    latitude: 35.4289,
    status: 'idle',
    lastUpdate: '2024-01-13 14:15:00',
    description: '苹果和梨树种植，冬季休眠期'
  },
  {
    id: 'FL005',
    code: 'LX-002',
    name: '临夏水稻试验田',
    area: 12.1,
    crop: '水稻',
    plantingTime: '2024-05-01',
    growthStage: '分蘖期',
    health: 'danger',
    region: '临夏州',
    soilType: '粘土',
    irrigation: '漫灌',
    longitude: 103.2200,
    latitude: 35.6100,
    status: 'active',
    lastUpdate: '2024-01-15 11:00:00',
    description: '水稻试验种植，出现病害需要及时处理'
  }
];

/**
 * 加载模拟数据
 */
function loadMockData() {
  // 生成更多模拟数据
  farmlandData = generateExtendedMockData();
  filteredData = [...farmlandData];
  totalItems = farmlandData.length;
  
  // 更新统计信息
  updateStatistics();
  
  // 渲染当前视图
  renderCurrentView();
  
  // 更新分页
  updatePagination();
}

/**
 * 生成扩展的模拟数据
 */
function generateExtendedMockData() {
  const extendedData = [...mockFarmlandData];
  const crops = ['小麦', '玉米', '水稻', '蔬菜', '果树'];
  const regions = ['临夏州', '东乡县', '永靖县', '和政县'];
  const statuses = ['active', 'idle', 'preparing', 'harvesting'];
  const healths = ['good', 'warning', 'danger'];
  const soilTypes = ['壤土', '沙土', '粘土', '粉土'];
  const irrigations = ['滴灌', '喷灌', '漫灌', '沟灌'];
  
  for (let i = 6; i <= 156; i++) {
    const crop = crops[Math.floor(Math.random() * crops.length)];
    const region = regions[Math.floor(Math.random() * regions.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const health = healths[Math.floor(Math.random() * healths.length)];
    
    extendedData.push({
      id: `FL${String(i).padStart(3, '0')}`,
      code: `${region.substr(0, 2).toUpperCase()}-${String(i).padStart(3, '0')}`,
      name: `${region}${crop}种植区${i}`,
      area: (Math.random() * 50 + 5).toFixed(1),
      crop: crop,
      plantingTime: getRandomDate('2024-02-01', '2024-05-01'),
      growthStage: getRandomGrowthStage(crop),
      health: health,
      region: region,
      soilType: soilTypes[Math.floor(Math.random() * soilTypes.length)],
      irrigation: irrigations[Math.floor(Math.random() * irrigations.length)],
      longitude: (103.2 + Math.random() * 0.3).toFixed(4),
      latitude: (35.4 + Math.random() * 0.6).toFixed(4),
      status: status,
      lastUpdate: getRandomDate('2024-01-10', '2024-01-15'),
      description: `${crop}种植区域，${health === 'good' ? '生长良好' : health === 'warning' ? '需要关注' : '需要处理'}`
    });
  }
  
  return extendedData;
}

/**
 * 获取随机日期
 */
function getRandomDate(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
}

/**
 * 获取随机生长阶段
 */
function getRandomGrowthStage(crop) {
  const stages = {
    '小麦': ['播种期', '出苗期', '分蘖期', '拔节期', '抽穗期', '灌浆期', '成熟期'],
    '玉米': ['播种期', '出苗期', '拔节期', '抽雄期', '灌浆期', '成熟期'],
    '水稻': ['播种期', '出苗期', '分蘖期', '抽穗期', '灌浆期', '成熟期'],
    '蔬菜': ['播种期', '幼苗期', '生长期', '开花期', '结果期', '成熟期'],
    '果树': ['休眠期', '萌芽期', '开花期', '坐果期', '果实发育期', '成熟期']
  };
  
  const cropStages = stages[crop] || stages['小麦'];
  return cropStages[Math.floor(Math.random() * cropStages.length)];
}

/**
 * 初始化数据表格
 */
function initDataTable() {
  const selectAllCheckbox = document.getElementById('selectAll');
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const checkboxes = document.querySelectorAll('#farmlandTableBody input[type="checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
      updateSelectedItems();
    });
  }
}

/**
 * 初始化筛选功能
 */
function initFilters() {
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const cropFilter = document.getElementById('cropFilter');
  const regionFilter = document.getElementById('regionFilter');
  
  // 搜索功能
  if (searchInput) {
    searchInput.addEventListener('input', debounce(applyFilters, 300));
  }
  
  // 筛选器
  [statusFilter, cropFilter, regionFilter].forEach(filter => {
    if (filter) {
      filter.addEventListener('change', applyFilters);
    }
  });
}

/**
 * 应用筛选条件
 */
function applyFilters() {
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const statusFilter = document.getElementById('statusFilter')?.value || '';
  const cropFilter = document.getElementById('cropFilter')?.value || '';
  const regionFilter = document.getElementById('regionFilter')?.value || '';
  
  filteredData = farmlandData.filter(item => {
    const matchSearch = !searchTerm || 
      item.name.toLowerCase().includes(searchTerm) ||
      item.code.toLowerCase().includes(searchTerm);
    
    const matchStatus = !statusFilter || item.status === statusFilter;
    const matchCrop = !cropFilter || item.crop === cropFilter;
    const matchRegion = !regionFilter || item.region === regionFilter;
    
    return matchSearch && matchStatus && matchCrop && matchRegion;
  });
  
  totalItems = filteredData.length;
  currentPage = 1;
  
  renderCurrentView();
  updatePagination();
}

/**
 * 初始化视图切换
 */
function initViewToggle() {
  const viewBtns = document.querySelectorAll('.view-btn');
  viewBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const view = this.dataset.view;
      switchView(view);
    });
  });
}

/**
 * 切换视图
 */
function switchView(view) {
  currentView = view;
  
  // 更新按钮状态
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === view);
  });
  
  // 切换视图显示
  document.querySelectorAll('.list-view, .grid-view, .map-view').forEach(viewEl => {
    viewEl.classList.remove('active');
  });
  
  const targetView = document.getElementById(view + 'View');
  if (targetView) {
    targetView.classList.add('active');
  }
  
  renderCurrentView();
}

/**
 * 渲染当前视图
 */
function renderCurrentView() {
  switch (currentView) {
    case 'list':
      renderListView();
      break;
    case 'grid':
      renderGridView();
      break;
    case 'map':
      renderMapView();
      break;
  }
}

/**
 * 渲染列表视图
 */
function renderListView() {
  const tbody = document.getElementById('farmlandTableBody');
  if (!tbody) return;
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);
  
  tbody.innerHTML = currentData.map(item => `
    <tr>
      <td>
        <input type="checkbox" value="${item.id}" onchange="updateSelectedItems()">
      </td>
      <td>${item.code}</td>
      <td>${item.name}</td>
      <td>${item.area}</td>
      <td>${item.crop}</td>
      <td>${item.plantingTime}</td>
      <td>${item.growthStage}</td>
      <td>
        <div class="health-indicator">
          <div class="health-icon ${item.health}">
            <i class="fas ${getHealthIcon(item.health)}"></i>
          </div>
          <span>${getHealthText(item.health)}</span>
        </div>
      </td>
      <td>${item.region}</td>
      <td>${formatDateTime(item.lastUpdate)}</td>
      <td>
        <div class="action-buttons">
          <button class="action-btn view" onclick="viewFarmland('${item.id}')" title="查看">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" onclick="editFarmland('${item.id}')" title="编辑">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteFarmland('${item.id}')" title="删除">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * 渲染网格视图
 */
function renderGridView() {
  const gridContainer = document.getElementById('farmlandGrid');
  if (!gridContainer) return;
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = filteredData.slice(startIndex, endIndex);
  
  gridContainer.innerHTML = currentData.map(item => `
    <div class="farmland-card" data-id="${item.id}">
      <div class="card-header-row">
        <div class="farmland-info">
          <h3>${item.name}</h3>
          <div class="farmland-code">${item.code}</div>
        </div>
        <div class="card-actions">
          <input type="checkbox" value="${item.id}" onchange="updateSelectedItems()">
          <span class="status-badge ${item.status}">${getStatusText(item.status)}</span>
        </div>
      </div>
      <div class="farmland-details">
        <div class="detail-item">
          <span class="detail-label">面积</span>
          <span class="detail-value">${item.area} 亩</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">作物</span>
          <span class="detail-value">${item.crop}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">生长阶段</span>
          <span class="detail-value">${item.growthStage}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">健康状态</span>
          <span class="detail-value">
            <div class="health-indicator">
              <div class="health-icon ${item.health}">
                <i class="fas ${getHealthIcon(item.health)}"></i>
              </div>
              <span>${getHealthText(item.health)}</span>
            </div>
          </span>
        </div>
      </div>
      <div class="card-footer">
        <span class="update-time">${formatDateTime(item.lastUpdate)}</span>
        <div class="action-buttons">
          <button class="action-btn view" onclick="viewFarmland('${item.id}')" title="查看">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-btn edit" onclick="editFarmland('${item.id}')" title="编辑">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-btn delete" onclick="deleteFarmland('${item.id}')" title="删除">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * 渲染地图视图
 */
function renderMapView() {
  const mapContainer = document.getElementById('farmlandMap');
  if (!mapContainer) return;
  
  // 这里可以集成真实的地图API，目前显示占位内容
  mapContainer.innerHTML = `
    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 16px;">
      <i class="fas fa-map" style="font-size: 48px; color: #52C41A;"></i>
      <div style="text-align: center;">
        <h3 style="margin: 0 0 8px 0; color: #333333;">地图视图</h3>
        <p style="margin: 0; color: #666666;">显示 ${filteredData.length} 个农田地块的地理位置分布</p>
      </div>
    </div>
  `;
}

/**
 * 获取健康状态图标
 */
function getHealthIcon(health) {
  const icons = {
    good: 'fa-check',
    warning: 'fa-exclamation',
    danger: 'fa-times'
  };
  return icons[health] || 'fa-question';
}

/**
 * 获取健康状态文本
 */
function getHealthText(health) {
  const texts = {
    good: '良好',
    warning: '需关注',
    danger: '异常'
  };
  return texts[health] || '未知';
}

/**
 * 获取状态文本
 */
function getStatusText(status) {
  const texts = {
    active: '种植中',
    idle: '闲置',
    preparing: '整备中',
    harvesting: '收获中'
  };
  return texts[status] || '未知';
}

/**
 * 格式化日期时间
 */
function formatDateTime(dateTime) {
  if (!dateTime) return '-';
  
  if (dateTime.includes(' ')) {
    return dateTime;
  }
  
  return dateTime + ' 00:00:00';
}

/**
 * 更新统计信息
 */
function updateStatistics() {
  const totalFarmlands = farmlandData.length;
  const totalArea = farmlandData.reduce((sum, item) => sum + parseFloat(item.area), 0);
  const activePlots = farmlandData.filter(item => item.status === 'active').length;
  const alertCount = farmlandData.filter(item => item.health === 'danger').length;
  
  const totalFarmlandsEl = document.getElementById('totalFarmlands');
  const totalAreaEl = document.getElementById('totalArea');
  const activePlotsEl = document.getElementById('activePlots');
  const alertCountEl = document.getElementById('alertCount');
  
  if (totalFarmlandsEl) animateNumber(totalFarmlandsEl, totalFarmlands);
  if (totalAreaEl) animateNumber(totalAreaEl, Math.round(totalArea));
  if (activePlotsEl) animateNumber(activePlotsEl, activePlots);
  if (alertCountEl) animateNumber(alertCountEl, alertCount);
}

/**
 * 数字动画效果
 */
function animateNumber(element, targetValue, duration = 1000) {
  const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
  const difference = targetValue - startValue;
  const stepTime = Math.abs(Math.floor(duration / difference));
  
  let currentValue = startValue;
  const timer = setInterval(() => {
    currentValue += difference > 0 ? 1 : -1;
    element.textContent = formatNumber(currentValue);
    
    if (currentValue === targetValue) {
      clearInterval(timer);
    }
  }, stepTime);
}

/**
 * 初始化分页
 */
function initPagination() {
  // 分页功能在updatePagination中实现
}

/**
 * 更新分页
 */
function updatePagination() {
  const totalPages = Math.ceil(totalItems / pageSize);
  const paginationContainer = document.getElementById('pagination');
  const currentRangeEl = document.getElementById('currentRange');
  const totalCountEl = document.getElementById('totalCount');
  
  if (currentRangeEl) {
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, totalItems);
    currentRangeEl.textContent = `${start}-${end}`;
  }
  
  if (totalCountEl) {
    totalCountEl.textContent = totalItems;
  }
  
  if (!paginationContainer) return;
  
  let paginationHTML = '';
  
  // 上一页
  paginationHTML += `
    <a href="#" class="pagination-item ${currentPage === 1 ? 'disabled' : ''}" 
       onclick="changePage(${currentPage - 1}); return false;">
      <i class="fas fa-chevron-left"></i>
    </a>
  `;
  
  // 页码
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    paginationHTML += `
      <a href="#" class="pagination-item ${i === currentPage ? 'active' : ''}" 
         onclick="changePage(${i}); return false;">
        ${i}
      </a>
    `;
  }
  
  // 下一页
  paginationHTML += `
    <a href="#" class="pagination-item ${currentPage === totalPages ? 'disabled' : ''}" 
       onclick="changePage(${currentPage + 1}); return false;">
      <i class="fas fa-chevron-right"></i>
    </a>
  `;
  
  paginationContainer.innerHTML = paginationHTML;
}

/**
 * 切换页码
 */
function changePage(page) {
  const totalPages = Math.ceil(totalItems / pageSize);
  if (page < 1 || page > totalPages) return;
  
  currentPage = page;
  renderCurrentView();
  updatePagination();
}

/**
 * 更新选中项目
 */
function updateSelectedItems() {
  const checkboxes = document.querySelectorAll('.data-container input[type="checkbox"]:not(#selectAll)');
  selectedItems = Array.from(checkboxes)
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
  
  const batchActionBtn = document.getElementById('batchActionBtn');
  if (batchActionBtn) {
    batchActionBtn.disabled = selectedItems.length === 0;
  }
  
  // 更新全选状态
  const selectAllCheckbox = document.getElementById('selectAll');
  if (selectAllCheckbox) {
    const visibleCheckboxes = Array.from(checkboxes).filter(cb => cb.offsetParent !== null);
    selectAllCheckbox.checked = visibleCheckboxes.length > 0 && 
      visibleCheckboxes.every(checkbox => checkbox.checked);
  }
}

/**
 * 初始化事件监听
 */
function initEventListeners() {
  // 添加地块按钮
  const addFarmlandBtn = document.getElementById('addFarmlandBtn');
  if (addFarmlandBtn) {
    addFarmlandBtn.addEventListener('click', openAddFarmlandModal);
  }
  
  // 批量操作按钮
  const batchActionBtn = document.getElementById('batchActionBtn');
  if (batchActionBtn) {
    batchActionBtn.addEventListener('click', openBatchActionModal);
  }
  
  // 导出按钮
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportData);
  }
}

/**
 * 查看农田详情
 */
function viewFarmland(id) {
  const farmland = farmlandData.find(item => item.id === id);
  if (farmland) {
    Message.info(`查看农田：${farmland.name}`);
    // 这里可以跳转到详情页面或打开详情模态框
  }
}

/**
 * 编辑农田信息
 */
function editFarmland(id) {
  const farmland = farmlandData.find(item => item.id === id);
  if (farmland) {
    Message.info(`编辑农田：${farmland.name}`);
    // 这里可以打开编辑模态框并填充数据
  }
}

/**
 * 删除农田
 */
function deleteFarmland(id) {
  const farmland = farmlandData.find(item => item.id === id);
  if (farmland && confirm(`确定要删除农田"${farmland.name}"吗？`)) {
    farmlandData = farmlandData.filter(item => item.id !== id);
    applyFilters();
    updateStatistics();
    Message.success('删除成功');
  }
}

/**
 * 打开添加地块模态框
 */
function openAddFarmlandModal() {
  console.log('打开添加地块模态框');
  const modal = document.getElementById('addFarmlandModal');
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    // 设置默认日期为今天
    const today = new Date().toISOString().split('T')[0];
    const plantingDateInput = modal.querySelector('input[name="plantingDate"]');
    if (plantingDateInput && !plantingDateInput.value) {
      plantingDateInput.value = today;
    }
  } else {
    console.error('找不到添加地块模态框元素');
  }
}

/**
 * 关闭添加地块模态框
 */
function closeAddFarmlandModal() {
  console.log('关闭添加地块模态框');
  const modal = document.getElementById('addFarmlandModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    const form = document.getElementById('farmlandForm');
    if (form) {
      form.reset();
    }
  }
}

/**
 * 提交地块表单
 */
function submitFarmlandForm() {
  console.log('提交地块表单');
  const form = document.getElementById('farmlandForm');
  if (!form) {
    Message.error('找不到表单元素');
    return;
  }
  
  const formData = new FormData(form);
  
  // 简单的表单验证
  const requiredFields = ['code', 'name', 'area', 'region'];
  for (let field of requiredFields) {
    const value = formData.get(field);
    if (!value || value.trim() === '') {
      const fieldNames = {
        'code': '地块编号',
        'name': '地块名称', 
        'area': '面积',
        'region': '所属区域'
      };
      Message.error(`请填写${fieldNames[field]}`);
      return;
    }
  }
  
  // 验证面积是否为有效数字
  const area = parseFloat(formData.get('area'));
  if (isNaN(area) || area <= 0) {
    Message.error('请输入有效的面积数值');
    return;
  }
  
  // 检查地块编号是否重复
  const code = formData.get('code').trim();
  const existingFarmland = farmlandData.find(item => item.code === code);
  if (existingFarmland) {
    Message.error('地块编号已存在，请使用不同的编号');
    return;
  }
  
  try {
    // 创建新的农田数据
    const newFarmland = {
      id: `FL${String(farmlandData.length + 1).padStart(3, '0')}`,
      code: code,
      name: formData.get('name').trim(),
      area: area,
      crop: '未种植',
      plantingTime: '-',
      growthStage: '-',
      health: 'good',
      region: formData.get('region'),
      soilType: formData.get('soilType') || '未知',
      irrigation: formData.get('irrigation') || '未知',
      longitude: parseFloat(formData.get('longitude')) || 0,
      latitude: parseFloat(formData.get('latitude')) || 0,
      status: 'idle',
      lastUpdate: new Date().toISOString().slice(0, 19).replace('T', ' '),
      description: formData.get('description') || ''
    };
    
    farmlandData.unshift(newFarmland);
    applyFilters();
    updateStatistics();
    closeAddFarmlandModal();
    Message.success('地块添加成功');
    
    console.log('新添加的地块:', newFarmland);
  } catch (error) {
    console.error('添加地块时出错:', error);
    Message.error('添加地块失败，请重试');
  }
}

/**
 * 获取当前位置
 */
function getCurrentLocation() {
  console.log('获取当前位置');
  if (!navigator.geolocation) {
    Message.error('浏览器不支持定位功能');
    return;
  }
  
  const btn = event.target.closest('button');
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 定位中...';
  btn.disabled = true;
  
  navigator.geolocation.getCurrentPosition(
    function(position) {
      const longitude = position.coords.longitude.toFixed(6);
      const latitude = position.coords.latitude.toFixed(6);
      
      const longitudeInput = document.querySelector('input[name="longitude"]');
      const latitudeInput = document.querySelector('input[name="latitude"]');
      
      if (longitudeInput) longitudeInput.value = longitude;
      if (latitudeInput) latitudeInput.value = latitude;
      
      btn.innerHTML = originalText;
      btn.disabled = false;
      Message.success(`定位成功：${latitude}, ${longitude}`);
    },
    function(error) {
      btn.innerHTML = originalText;
      btn.disabled = false;
      
      let errorMessage = '定位失败';
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = '用户拒绝了定位请求';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = '位置信息不可用';
          break;
        case error.TIMEOUT:
          errorMessage = '定位请求超时';
          break;
      }
      Message.error(errorMessage + '，请手动输入坐标');
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    }
  );
}

/**
 * 打开批量操作模态框
 */
function openBatchActionModal() {
  if (selectedItems.length === 0) {
    Message.warning('请先选择要操作的项目');
    return;
  }
  
  const modal = document.getElementById('batchActionModal');
  if (modal) {
    modal.classList.add('active');
  }
}

/**
 * 关闭批量操作模态框
 */
function closeBatchActionModal() {
  const modal = document.getElementById('batchActionModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

/**
 * 导出数据
 */
function exportData() {
  const dataToExport = filteredData.map(item => ({
    '地块编号': item.code,
    '地块名称': item.name,
    '面积(亩)': item.area,
    '当前作物': item.crop,
    '种植时间': item.plantingTime,
    '生长阶段': item.growthStage,
    '健康状态': getHealthText(item.health),
    '所属区域': item.region,
    '土壤类型': item.soilType,
    '灌溉方式': item.irrigation,
    '状态': getStatusText(item.status),
    '最后更新': item.lastUpdate
  }));
  
  // 这里可以实现真实的导出功能
  console.log('导出数据:', dataToExport);
  Message.success('导出成功');
}

// 模态框外部点击关闭功能由common.js处理

// 批量操作选项点击事件
document.addEventListener('click', function(e) {
  if (e.target.closest('.batch-option')) {
    const action = e.target.closest('.batch-option').dataset.action;
    handleBatchAction(action);
  }
});

/**
 * 处理批量操作
 */
function handleBatchAction(action) {
  switch (action) {
    case 'status':
      Message.info(`批量修改 ${selectedItems.length} 个项目的状态`);
      break;
    case 'export':
      Message.info(`批量导出 ${selectedItems.length} 个项目的数据`);
      break;
    case 'archive':
      Message.info(`批量归档 ${selectedItems.length} 个项目`);
      break;
    case 'delete':
      if (confirm(`确定要删除选中的 ${selectedItems.length} 个项目吗？`)) {
        farmlandData = farmlandData.filter(item => !selectedItems.includes(item.id));
        selectedItems = [];
        applyFilters();
        updateStatistics();
        Message.success('批量删除成功');
      }
      break;
  }
  closeBatchActionModal();
}

// 暴露函数到全局作用域
window.openAddFarmlandModal = openAddFarmlandModal;
window.closeAddFarmlandModal = closeAddFarmlandModal;
window.submitFarmlandForm = submitFarmlandForm;
window.getCurrentLocation = getCurrentLocation;
window.openBatchActionModal = openBatchActionModal;
window.closeBatchActionModal = closeBatchActionModal;
window.viewFarmland = viewFarmland;
window.editFarmland = editFarmland;
window.deleteFarmland = deleteFarmland;
window.updateSelectedItems = updateSelectedItems;
window.changePage = changePage;