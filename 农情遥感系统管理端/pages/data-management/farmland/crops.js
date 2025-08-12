/**
 * 作物管理页面功能
 */

// 全局变量
let growthChart = null;
let healthChart = null;
let cropData = [];
let recordsData = {
  fertilizer: [],
  irrigation: [],
  pesticide: [],
  harvest: []
};
let selectedCrop = null;
let activeTab = 'fertilizer';

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化图表
  initCharts();
  
  // 初始化事件监听
  initEventListeners();
  
  // 初始化标签页
  initTabs();
  
  // 加载模拟数据
  loadMockData();
  
  // 渲染作物列表
  renderCropsList();
  
  // 渲染管理记录
  renderRecords();
  
  // 渲染健康警报
  renderHealthAlerts();
});

/**
 * 模拟作物数据
 */
const mockCropData = [
  {
    id: 'CR001',
    farmlandId: 'FL001',
    farmlandName: '临夏示范农田1号',
    cropType: 'wheat',
    variety: '冬小麦-中麦175',
    plantArea: 15.5,
    plantingDate: '2023-10-15',
    harvestDate: '2024-06-20',
    currentStage: 'heading',
    stageProgress: 72,
    health: 'good',
    density: 25000,
    plantingMethod: 'drill',
    predictedYield: 2.8,
    notes: '生长良好，预计高产'
  },
  {
    id: 'CR002',
    farmlandId: 'FL002',
    farmlandName: '东乡玉米基地',
    cropType: 'corn',
    variety: '玉米-郑单958',
    plantArea: 28.3,
    plantingDate: '2024-04-10',
    harvestDate: '2024-09-15',
    currentStage: 'jointing',
    stageProgress: 45,
    health: 'good',
    density: 4500,
    plantingMethod: 'drill',
    predictedYield: 3.2,
    notes: '拔节良好，需要加强水肥管理'
  },
  {
    id: 'CR003',
    farmlandId: 'FL003',
    farmlandName: '永靖蔬菜园区',
    cropType: 'vegetables',
    variety: '大白菜-春玉黄',
    plantArea: 8.7,
    plantingDate: '2024-02-20',
    harvestDate: '2024-05-15',
    currentStage: 'harvesting',
    stageProgress: 95,
    health: 'warning',
    density: 15000,
    plantingMethod: 'transplant',
    predictedYield: 4.5,
    notes: '接近收获期，注意病虫害防治'
  },
  {
    id: 'CR004',
    farmlandId: 'FL005',
    farmlandName: '临夏水稻试验田',
    cropType: 'rice',
    variety: '水稻-龙粳31',
    plantArea: 12.1,
    plantingDate: '2024-05-01',
    harvestDate: '2024-09-30',
    currentStage: 'tillering',
    stageProgress: 30,
    health: 'danger',
    density: 18000,
    plantingMethod: 'transplant',
    predictedYield: 4.1,
    notes: '出现稻瘟病，需要及时防治'
  }
];

/**
 * 模拟管理记录数据
 */
const mockRecordsData = {
  fertilizer: [
    {
      id: 'FR001',
      cropId: 'CR001',
      operationDate: '2024-01-10',
      fertilizerType: '复合肥',
      amount: 50,
      unit: 'kg/亩',
      method: '撒施',
      notes: '基肥施用'
    },
    {
      id: 'FR002',
      cropId: 'CR002',
      operationDate: '2024-01-12',
      fertilizerType: '尿素',
      amount: 15,
      unit: 'kg/亩',
      method: '条施',
      notes: '追肥'
    }
  ],
  irrigation: [
    {
      id: 'IR001',
      cropId: 'CR001',
      operationDate: '2024-01-08',
      irrigationType: '滴灌',
      duration: 2,
      waterAmount: 30,
      unit: 'mm',
      notes: '春季灌溉'
    },
    {
      id: 'IR002',
      cropId: 'CR003',
      operationDate: '2024-01-14',
      irrigationType: '喷灌',
      duration: 1.5,
      waterAmount: 25,
      unit: 'mm',
      notes: '蔬菜补水'
    }
  ],
  pesticide: [
    {
      id: 'PR001',
      cropId: 'CR004',
      operationDate: '2024-01-13',
      pesticideType: '稻瘟灵',
      concentration: '1000倍',
      sprayAmount: 60,
      unit: 'L/亩',
      targetPest: '稻瘟病',
      notes: '防治稻瘟病'
    }
  ],
  harvest: [
    {
      id: 'HR001',
      cropId: 'CR003',
      operationDate: '2024-01-11',
      harvestArea: 2.5,
      yield: 4.2,
      unit: '吨/亩',
      quality: 'A级',
      notes: '第一批收获'
    }
  ]
};

/**
 * 加载模拟数据
 */
function loadMockData() {
  cropData = [...mockCropData];
  recordsData = { ...mockRecordsData };
  
  // 更新统计数据
  updateCropStatistics();
}

/**
 * 初始化图表
 */
function initCharts() {
  // 延迟初始化，确保容器尺寸已经正确计算
  setTimeout(() => {
    initGrowthChart();
    initHealthChart();
  }, 100);
  
  // 监听侧边栏状态变化，重新初始化图表
  document.addEventListener('sidebarToggle', function() {
    setTimeout(() => {
      // 侧边栏变化时重新初始化图表以避免变形
      reinitializeCharts();
    }, 350);
  });
  
  // 监听窗口大小变化（增加防抖时间）
  window.addEventListener('resize', debounce(resizeAllCharts, 500));
  
  // 监听页面可见性变化
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      // 页面重新可见时重新调整图表大小
      setTimeout(resizeAllCharts, 200);
    }
  });
}

/**
 * 初始化生长监测图表
 */
function initGrowthChart() {
  const chartElement = document.getElementById('growthChart');
  if (!chartElement) return;
  
  try {
    // 确保之前的实例被正确销毁
    if (growthChart) {
      growthChart.dispose();
    }
    
    // 获取容器实际尺寸进行初始化
    const containerRect = chartElement.parentElement.getBoundingClientRect();
    growthChart = echarts.init(chartElement, null, {
      width: containerRect.width,
      height: containerRect.height,
      renderer: 'canvas',
      devicePixelRatio: window.devicePixelRatio || 1
    });
    
    const option = {
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderWidth: 1,
        borderColor: '#333',
        textStyle: {
          color: '#FFFFFF',
          fontSize: 12
        },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 6px;'
      },
      legend: {
        data: ['生长指数', '健康指数', '预期产量'],
        top: 0,
        textStyle: {
          color: '#666666',
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
        data: getLast30Days(),
        axisLine: {
          lineStyle: {
            color: '#E8E8E8'
          }
        },
        axisLabel: {
          color: '#666666',
          fontSize: 11
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        min: 0,
        max: 100,
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#666666',
          fontSize: 11,
          formatter: '{value}%'
        },
        splitLine: {
          lineStyle: {
            color: '#F0F0F0'
          }
        }
      },
      series: [
        {
          name: '生长指数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#52C41A'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(82, 196, 26, 0.3)' },
                { offset: 1, color: 'rgba(82, 196, 26, 0.05)' }
              ]
            }
          },
          data: generateGrowthData(30, 60, 85)
        },
        {
          name: '健康指数',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#1890FF'
          },
          data: generateGrowthData(30, 70, 90)
        },
        {
          name: '预期产量',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#FAAD14'
          },
          data: generateGrowthData(30, 40, 75)
        }
      ]
    };
    
    growthChart.setOption(option);
  } catch (error) {
    console.warn('初始化生长监测图表失败:', error);
  }
}

/**
 * 初始化健康状态图表
 */
function initHealthChart() {
  const chartElement = document.getElementById('healthChart');
  if (!chartElement) return;
  
  try {
    // 确保之前的实例被正确销毁
    if (healthChart) {
      healthChart.dispose();
    }
    
    // 获取容器实际尺寸进行初始化
    const containerRect = chartElement.parentElement.getBoundingClientRect();
    healthChart = echarts.init(chartElement, null, {
      width: containerRect.width,
      height: containerRect.height,
      renderer: 'canvas',
      devicePixelRatio: window.devicePixelRatio || 1
    });
    
    const option = {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderWidth: 1,
        borderColor: '#333',
        textStyle: {
          color: '#FFFFFF',
          fontSize: 12
        },
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 6px;',
        formatter: '{b}: {c}%'
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '80%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 4,
            borderColor: '#FFFFFF',
            borderWidth: 2
          },
          label: {
            show: false
          },
          labelLine: {
            show: false
          },
          data: [
            {
              value: 68,
              name: '良好',
              itemStyle: { color: '#52C41A' }
            },
            {
              value: 20,
              name: '需关注',
              itemStyle: { color: '#FAAD14' }
            },
            {
              value: 12,
              name: '异常',
              itemStyle: { color: '#F5222D' }
            }
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
    
    healthChart.setOption(option);
  } catch (error) {
    console.warn('初始化健康状态图表失败:', error);
  }
}

/**
 * 调整所有图表大小
 */
function resizeAllCharts() {
  try {
    // 使用requestAnimationFrame确保DOM更新完成后再resize
    requestAnimationFrame(() => {
      if (growthChart && typeof growthChart.resize === 'function') {
        // 获取容器实际尺寸
        const container = document.getElementById('growthChart')?.parentElement;
        if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
          growthChart.resize({
            width: container.offsetWidth,
            height: container.offsetHeight
          });
        }
      }
      
      if (healthChart && typeof healthChart.resize === 'function') {
        const container = document.getElementById('healthChart')?.parentElement;
        if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
          healthChart.resize({
            width: container.offsetWidth,
            height: container.offsetHeight
          });
        }
      }
    });
  } catch (error) {
    console.warn('调整图表大小时出错:', error);
  }
}

/**
 * 重新初始化所有图表（用于容器尺寸显著变化的情况）
 */
function reinitializeCharts() {
  try {
    // 销毁现有图表实例
    if (growthChart) {
      growthChart.dispose();
      growthChart = null;
    }
    if (healthChart) {
      healthChart.dispose();
      healthChart = null;
    }
    
    // 等待DOM更新后重新初始化
    setTimeout(() => {
      initGrowthChart();
      initHealthChart();
    }, 50);
  } catch (error) {
    console.warn('重新初始化图表时出错:', error);
  }
}

/**
 * 初始化事件监听
 */
function initEventListeners() {
  // 添加作物按钮
  const addCropBtn = document.getElementById('addCropBtn');
  if (addCropBtn) {
    addCropBtn.addEventListener('click', openAddCropModal);
  }
  
  // 添加记录按钮
  const addRecordBtn = document.getElementById('addRecordBtn');
  if (addRecordBtn) {
    addRecordBtn.addEventListener('click', openAddRecordModal);
  }
  
  // 刷新监测按钮
  const refreshMonitorBtn = document.getElementById('refreshMonitorBtn');
  if (refreshMonitorBtn) {
    refreshMonitorBtn.addEventListener('click', refreshMonitorData);
  }
  
  // 筛选器
  const cropTypeFilter = document.getElementById('cropTypeFilter');
  const stageFilter = document.getElementById('stageFilter');
  
  if (cropTypeFilter) {
    cropTypeFilter.addEventListener('change', applyFilters);
  }
  
  if (stageFilter) {
    stageFilter.addEventListener('change', applyFilters);
  }
  
  // 预测期间选择
  const forecastPeriod = document.getElementById('forecastPeriod');
  if (forecastPeriod) {
    forecastPeriod.addEventListener('change', updateForecast);
  }
}

/**
 * 初始化标签页
 */
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const tab = this.dataset.tab;
      switchTab(tab);
    });
  });
}

/**
 * 切换标签页
 */
function switchTab(tab) {
  activeTab = tab;
  
  // 更新按钮状态
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  
  // 切换内容显示
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('active');
  });
  
  const targetContent = document.getElementById(tab + 'Tab');
  if (targetContent) {
    targetContent.classList.add('active');
  }
  
  renderRecords();
}

/**
 * 更新作物统计
 */
function updateCropStatistics() {
  const statistics = {
    wheat: cropData.filter(crop => crop.cropType === 'wheat').length,
    corn: cropData.filter(crop => crop.cropType === 'corn').length,
    rice: cropData.filter(crop => crop.cropType === 'rice').length,
    vegetables: cropData.filter(crop => crop.cropType === 'vegetables').length
  };
  
  const wheatCountEl = document.getElementById('wheatCount');
  const cornCountEl = document.getElementById('cornCount');
  const riceCountEl = document.getElementById('riceCount');
  const vegetableCountEl = document.getElementById('vegetableCount');
  
  if (wheatCountEl) animateNumber(wheatCountEl, statistics.wheat);
  if (cornCountEl) animateNumber(cornCountEl, statistics.corn);
  if (riceCountEl) animateNumber(riceCountEl, statistics.rice);
  if (vegetableCountEl) animateNumber(vegetableCountEl, statistics.vegetables);
}

/**
 * 数字动画效果
 */
function animateNumber(element, targetValue, duration = 1000) {
  const startValue = parseInt(element.textContent) || 0;
  const difference = targetValue - startValue;
  
  if (difference === 0) return;
  
  const stepTime = Math.abs(Math.floor(duration / difference));
  let currentValue = startValue;
  
  const timer = setInterval(() => {
    currentValue += difference > 0 ? 1 : -1;
    element.textContent = currentValue;
    
    if (currentValue === targetValue) {
      clearInterval(timer);
    }
  }, stepTime);
}

/**
 * 渲染作物列表
 */
function renderCropsList() {
  const cropsList = document.getElementById('cropsList');
  if (!cropsList) return;
  
  const filteredCrops = getFilteredCrops();
  
  cropsList.innerHTML = filteredCrops.map(crop => `
    <div class="crop-item ${selectedCrop?.id === crop.id ? 'selected' : ''}" 
         onclick="selectCrop('${crop.id}')">
      <div class="crop-icon">
        <i class="fas ${getCropIcon(crop.cropType)}"></i>
      </div>
      <div class="crop-info">
        <div class="crop-name">${crop.variety}</div>
        <div class="crop-details">
          <span>${crop.farmlandName}</span>
          <span>${crop.plantArea} 亩</span>
          <span>播种: ${crop.plantingDate}</span>
        </div>
      </div>
      <div class="crop-stage ${getStageClass(crop.currentStage)}">
        <i class="fas fa-leaf"></i>
        ${getStageText(crop.currentStage)}
      </div>
    </div>
  `).join('');
}

/**
 * 获取筛选后的作物数据
 */
function getFilteredCrops() {
  const cropTypeFilter = document.getElementById('cropTypeFilter')?.value || '';
  const stageFilter = document.getElementById('stageFilter')?.value || '';
  
  return cropData.filter(crop => {
    const matchType = !cropTypeFilter || crop.cropType === cropTypeFilter;
    const matchStage = !stageFilter || crop.currentStage === stageFilter;
    return matchType && matchStage;
  });
}

/**
 * 选择作物
 */
function selectCrop(cropId) {
  selectedCrop = cropData.find(crop => crop.id === cropId);
  renderCropsList();
  updateGrowthChart();
  renderRecords();
}

/**
 * 应用筛选条件
 */
function applyFilters() {
  renderCropsList();
}

/**
 * 渲染管理记录
 */
function renderRecords() {
  const recordsList = document.getElementById(activeTab + 'Records');
  if (!recordsList) return;
  
  const records = recordsData[activeTab] || [];
  const filteredRecords = selectedCrop 
    ? records.filter(record => record.cropId === selectedCrop.id)
    : records;
  
  if (filteredRecords.length === 0) {
    recordsList.innerHTML = `
      <div style="text-align: center; padding: 40px; color: #999999;">
        <i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 16px; display: block;"></i>
        ${selectedCrop ? `${selectedCrop.variety} 暂无${getTabText(activeTab)}记录` : `暂无${getTabText(activeTab)}记录`}
      </div>
    `;
    return;
  }
  
  recordsList.innerHTML = filteredRecords.map(record => `
    <div class="record-item">
      <div class="record-icon">
        <i class="fas ${getRecordIcon(activeTab)}"></i>
      </div>
      <div class="record-content">
        <div class="record-title">${getRecordTitle(record, activeTab)}</div>
        <div class="record-details">${getRecordDetails(record, activeTab)}</div>
      </div>
      <div class="record-time">${record.operationDate}</div>
    </div>
  `).join('');
}

/**
 * 渲染健康警报
 */
function renderHealthAlerts() {
  const healthAlerts = document.getElementById('healthAlerts');
  if (!healthAlerts) return;
  
  const alerts = [
    {
      type: 'danger',
      icon: 'fa-exclamation-triangle',
      message: '临夏水稻试验田发现稻瘟病，需要及时防治'
    },
    {
      type: 'warning',
      icon: 'fa-exclamation',
      message: '永靖蔬菜园区蚜虫数量增加，建议加强监控'
    },
    {
      type: 'info',
      icon: 'fa-info-circle',
      message: '东乡玉米基地即将进入关键生长期，注意水肥管理'
    }
  ];
  
  healthAlerts.innerHTML = alerts.map(alert => `
    <div class="health-alert ${alert.type}">
      <div class="alert-icon">
        <i class="fas ${alert.icon}"></i>
      </div>
      <span>${alert.message}</span>
    </div>
  `).join('');
}

/**
 * 获取作物图标
 */
function getCropIcon(cropType) {
  const icons = {
    wheat: 'fa-wheat-awn',
    corn: 'fa-corn',
    rice: 'fa-seedling',
    vegetables: 'fa-carrot',
    fruits: 'fa-apple-alt'
  };
  return icons[cropType] || 'fa-seedling';
}

/**
 * 获取阶段样式类
 */
function getStageClass(stage) {
  // 根据阶段返回不同的样式类
  return 'stage-' + stage;
}

/**
 * 获取阶段文本
 */
function getStageText(stage) {
  const stages = {
    seeding: '播种期',
    sprouting: '出苗期',
    tillering: '分蘖期',
    jointing: '拔节期',
    heading: '抽穗期',
    flowering: '开花期',
    filling: '灌浆期',
    ripening: '成熟期',
    harvesting: '收获期'
  };
  return stages[stage] || stage;
}

/**
 * 获取标签页文本
 */
function getTabText(tab) {
  const tabs = {
    fertilizer: '施肥',
    irrigation: '灌溉',
    pesticide: '农药',
    harvest: '收获'
  };
  return tabs[tab] || tab;
}

/**
 * 获取记录图标
 */
function getRecordIcon(tab) {
  const icons = {
    fertilizer: 'fa-flask',
    irrigation: 'fa-tint',
    pesticide: 'fa-bug',
    harvest: 'fa-cut'
  };
  return icons[tab] || 'fa-clipboard';
}

/**
 * 获取记录标题
 */
function getRecordTitle(record, tab) {
  switch (tab) {
    case 'fertilizer':
      return `${record.fertilizerType} - ${record.amount}${record.unit}`;
    case 'irrigation':
      return `${record.irrigationType} - ${record.waterAmount}${record.unit}`;
    case 'pesticide':
      return `${record.pesticideType} - ${record.concentration}`;
    case 'harvest':
      return `收获 ${record.harvestArea}亩 - ${record.yield}${record.unit}`;
    default:
      return '管理记录';
  }
}

/**
 * 获取记录详情
 */
function getRecordDetails(record, tab) {
  switch (tab) {
    case 'fertilizer':
      return `${record.method} | ${record.notes}`;
    case 'irrigation':
      return `持续${record.duration}小时 | ${record.notes}`;
    case 'pesticide':
      return `防治${record.targetPest} | 用量${record.sprayAmount}${record.unit}`;
    case 'harvest':
      return `质量等级${record.quality} | ${record.notes}`;
    default:
      return record.notes || '';
  }
}

/**
 * 更新生长监测图表
 */
function updateGrowthChart() {
  if (!growthChart || !selectedCrop) return;
  
  const newOption = {
    title: {
      text: selectedCrop.variety + ' 生长监测',
      left: 'center',
      textStyle: {
        fontSize: 14,
        color: '#333333'
      }
    },
    series: [
      {
        data: generateGrowthData(30, 60, 85)
      },
      {
        data: generateGrowthData(30, 70, 90)
      },
      {
        data: generateGrowthData(30, 40, 75)
      }
    ]
  };
  
  growthChart.setOption(newOption);
}

/**
 * 刷新监测数据
 */
function refreshMonitorData() {
  const btn = document.getElementById('refreshMonitorBtn');
  if (!btn) return;
  
  // 显示加载状态
  const originalHTML = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 刷新中...';
  btn.disabled = true;
  
  setTimeout(() => {
    // 更新图表数据
    updateGrowthChart();
    
    // 恢复按钮状态
    btn.innerHTML = originalHTML;
    btn.disabled = false;
    
    Message.success('监测数据已更新');
  }, 2000);
}

/**
 * 更新预测数据
 */
function updateForecast() {
  // 这里可以根据选择的期间更新预测数据
  Message.info('预测数据已更新');
}

/**
 * 打开添加作物模态框
 */
function openAddCropModal() {
  console.log('打开添加作物模态框');
  const modal = document.getElementById('addCropModal');
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    // 设置默认播种日期为今天
    const today = new Date().toISOString().split('T')[0];
    const plantingDateInput = modal.querySelector('input[name="plantingDate"]');
    if (plantingDateInput && !plantingDateInput.value) {
      plantingDateInput.value = today;
    }
    
    // 计算预计收获日期（播种后120天）
    const harvestDate = new Date();
    harvestDate.setDate(harvestDate.getDate() + 120);
    const harvestDateInput = modal.querySelector('input[name="harvestDate"]');
    if (harvestDateInput && !harvestDateInput.value) {
      harvestDateInput.value = harvestDate.toISOString().split('T')[0];
    }
  } else {
    console.error('找不到添加作物模态框元素');
  }
}

/**
 * 关闭添加作物模态框
 */
function closeAddCropModal() {
  console.log('关闭添加作物模态框');
  const modal = document.getElementById('addCropModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    const form = document.getElementById('cropForm');
    if (form) {
      form.reset();
    }
  }
}

/**
 * 提交作物表单
 */
function submitCropForm() {
  console.log('提交作物表单');
  const form = document.getElementById('cropForm');
  if (!form) {
    Message.error('找不到表单元素');
    return;
  }
  
  const formData = new FormData(form);
  
  // 简单的表单验证
  const requiredFields = ['farmlandId', 'cropType', 'variety', 'plantArea', 'plantingDate'];
  for (let field of requiredFields) {
    const value = formData.get(field);
    if (!value || value.trim() === '') {
      Message.error(`请填写${getFieldName(field)}`);
      return;
    }
  }
  
  // 验证种植面积
  const plantArea = parseFloat(formData.get('plantArea'));
  if (isNaN(plantArea) || plantArea <= 0) {
    Message.error('请输入有效的种植面积');
    return;
  }
  
  // 验证种植密度
  const density = formData.get('density');
  if (density && (isNaN(parseInt(density)) || parseInt(density) <= 0)) {
    Message.error('请输入有效的种植密度');
    return;
  }
  
  // 验证日期
  const plantingDate = formData.get('plantingDate');
  const harvestDate = formData.get('harvestDate');
  if (harvestDate && new Date(harvestDate) <= new Date(plantingDate)) {
    Message.error('收获日期必须晚于播种日期');
    return;
  }
  
  try {
    // 创建新的作物数据
    const newCrop = {
      id: `CR${String(cropData.length + 1).padStart(3, '0')}`,
      farmlandId: formData.get('farmlandId'),
      farmlandName: getFarmlandName(formData.get('farmlandId')),
      cropType: formData.get('cropType'),
      variety: formData.get('variety').trim(),
      plantArea: plantArea,
      plantingDate: plantingDate,
      harvestDate: harvestDate || '',
      currentStage: 'seeding',
      stageProgress: 5,
      health: 'good',
      density: parseInt(formData.get('density')) || 0,
      plantingMethod: formData.get('plantingMethod') || '',
      predictedYield: 0,
      notes: formData.get('notes') || ''
    };
    
    cropData.push(newCrop);
    updateCropStatistics();
    renderCropsList();
    closeAddCropModal();
    Message.success('作物添加成功');
    
    console.log('新添加的作物:', newCrop);
  } catch (error) {
    console.error('添加作物时出错:', error);
    Message.error('添加作物失败，请重试');
  }
}

/**
 * 打开添加记录模态框
 */
function openAddRecordModal() {
  console.log('打开添加记录模态框');
  const modal = document.getElementById('addRecordModal');
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
    // 设置默认记录类型
    const recordTypeSelect = modal.querySelector('select[name="recordType"]');
    if (recordTypeSelect) {
      recordTypeSelect.value = activeTab;
    }
    
    // 设置默认操作日期为今天
    const today = new Date().toISOString().split('T')[0];
    const operationDateInput = modal.querySelector('input[name="operationDate"]');
    if (operationDateInput && !operationDateInput.value) {
      operationDateInput.value = today;
    }
    
    updateRecordForm();
  } else {
    console.error('找不到添加记录模态框元素');
  }
}

/**
 * 关闭添加记录模态框
 */
function closeAddRecordModal() {
  console.log('关闭添加记录模态框');
  const modal = document.getElementById('addRecordModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
    const form = document.getElementById('recordForm');
    if (form) {
      form.reset();
    }
    // 清空动态字段
    const dynamicFields = document.getElementById('dynamicFields');
    if (dynamicFields) {
      dynamicFields.innerHTML = '';
    }
  }
}

/**
 * 更新记录表单
 */
function updateRecordForm() {
  const recordType = document.querySelector('select[name="recordType"]').value;
  const dynamicFields = document.getElementById('dynamicFields');
  
  if (!dynamicFields) return;
  
  let fieldsHTML = '';
  
  switch (recordType) {
    case 'fertilizer':
      fieldsHTML = `
        <div class="form-group">
          <label class="form-label">肥料类型 *</label>
          <select name="fertilizerType" class="form-input" required>
            <option value="">请选择肥料类型</option>
            <option value="复合肥">复合肥</option>
            <option value="尿素">尿素</option>
            <option value="磷酸二铵">磷酸二铵</option>
            <option value="钾肥">钾肥</option>
            <option value="有机肥">有机肥</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">施用量 *</label>
          <input type="number" name="amount" class="form-input" placeholder="请输入施用量" step="0.1" required>
        </div>
        <div class="form-group">
          <label class="form-label">单位</label>
          <select name="unit" class="form-input">
            <option value="kg/亩">kg/亩</option>
            <option value="吨/亩">吨/亩</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">施用方式</label>
          <select name="method" class="form-input">
            <option value="撒施">撒施</option>
            <option value="条施">条施</option>
            <option value="穴施">穴施</option>
            <option value="叶面喷施">叶面喷施</option>
          </select>
        </div>
      `;
      break;
    case 'irrigation':
      fieldsHTML = `
        <div class="form-group">
          <label class="form-label">灌溉方式 *</label>
          <select name="irrigationType" class="form-input" required>
            <option value="">请选择灌溉方式</option>
            <option value="滴灌">滴灌</option>
            <option value="喷灌">喷灌</option>
            <option value="漫灌">漫灌</option>
            <option value="沟灌">沟灌</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">持续时间(小时) *</label>
          <input type="number" name="duration" class="form-input" placeholder="请输入持续时间" step="0.5" required>
        </div>
        <div class="form-group">
          <label class="form-label">用水量 *</label>
          <input type="number" name="waterAmount" class="form-input" placeholder="请输入用水量" step="1" required>
        </div>
        <div class="form-group">
          <label class="form-label">单位</label>
          <select name="unit" class="form-input">
            <option value="mm">mm</option>
            <option value="m³/亩">m³/亩</option>
          </select>
        </div>
      `;
      break;
    case 'pesticide':
      fieldsHTML = `
        <div class="form-group">
          <label class="form-label">农药名称 *</label>
          <input type="text" name="pesticideType" class="form-input" placeholder="请输入农药名称" required>
        </div>
        <div class="form-group">
          <label class="form-label">浓度 *</label>
          <input type="text" name="concentration" class="form-input" placeholder="如：1000倍" required>
        </div>
        <div class="form-group">
          <label class="form-label">喷施量 *</label>
          <input type="number" name="sprayAmount" class="form-input" placeholder="请输入喷施量" step="1" required>
        </div>
        <div class="form-group">
          <label class="form-label">防治对象</label>
          <input type="text" name="targetPest" class="form-input" placeholder="请输入防治的病虫害">
        </div>
      `;
      break;
    case 'harvest':
      fieldsHTML = `
        <div class="form-group">
          <label class="form-label">收获面积(亩) *</label>
          <input type="number" name="harvestArea" class="form-input" placeholder="请输入收获面积" step="0.1" required>
        </div>
        <div class="form-group">
          <label class="form-label">产量 *</label>
          <input type="number" name="yield" class="form-input" placeholder="请输入产量" step="0.1" required>
        </div>
        <div class="form-group">
          <label class="form-label">单位</label>
          <select name="unit" class="form-input">
            <option value="吨/亩">吨/亩</option>
            <option value="kg/亩">kg/亩</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">质量等级</label>
          <select name="quality" class="form-input">
            <option value="A级">A级</option>
            <option value="B级">B级</option>
            <option value="C级">C级</option>
          </select>
        </div>
      `;
      break;
  }
  
  dynamicFields.innerHTML = fieldsHTML;
}

/**
 * 提交记录表单
 */
function submitRecordForm() {
  console.log('提交记录表单');
  const form = document.getElementById('recordForm');
  if (!form) {
    Message.error('找不到表单元素');
    return;
  }
  
  const formData = new FormData(form);
  const recordType = formData.get('recordType');
  
  if (!recordType) {
    Message.error('请选择记录类型');
    return;
  }
  
  // 验证必填字段
  const operationDate = formData.get('operationDate');
  if (!operationDate) {
    Message.error('请填写操作日期');
    return;
  }
  
  // 根据记录类型验证特定字段
  switch (recordType) {
    case 'fertilizer':
      if (!formData.get('fertilizerType') || !formData.get('amount')) {
        Message.error('请填写肥料类型和施用量');
        return;
      }
      if (isNaN(parseFloat(formData.get('amount'))) || parseFloat(formData.get('amount')) <= 0) {
        Message.error('请输入有效的施用量');
        return;
      }
      break;
    case 'irrigation':
      if (!formData.get('irrigationType') || !formData.get('duration') || !formData.get('waterAmount')) {
        Message.error('请填写灌溉方式、持续时间和用水量');
        return;
      }
      if (isNaN(parseFloat(formData.get('duration'))) || parseFloat(formData.get('duration')) <= 0) {
        Message.error('请输入有效的持续时间');
        return;
      }
      if (isNaN(parseFloat(formData.get('waterAmount'))) || parseFloat(formData.get('waterAmount')) <= 0) {
        Message.error('请输入有效的用水量');
        return;
      }
      break;
    case 'pesticide':
      if (!formData.get('pesticideType') || !formData.get('concentration') || !formData.get('sprayAmount')) {
        Message.error('请填写农药名称、浓度和喷施量');
        return;
      }
      if (isNaN(parseFloat(formData.get('sprayAmount'))) || parseFloat(formData.get('sprayAmount')) <= 0) {
        Message.error('请输入有效的喷施量');
        return;
      }
      break;
    case 'harvest':
      if (!formData.get('harvestArea') || !formData.get('yield')) {
        Message.error('请填写收获面积和产量');
        return;
      }
      if (isNaN(parseFloat(formData.get('harvestArea'))) || parseFloat(formData.get('harvestArea')) <= 0) {
        Message.error('请输入有效的收获面积');
        return;
      }
      if (isNaN(parseFloat(formData.get('yield'))) || parseFloat(formData.get('yield')) <= 0) {
        Message.error('请输入有效的产量');
        return;
      }
      break;
  }
  
  try {
    // 创建新记录
    const newRecord = {
      id: `${recordType.charAt(0).toUpperCase()}R${String((recordsData[recordType]?.length || 0) + 1).padStart(3, '0')}`,
      cropId: selectedCrop?.id || 'CR001',
      operationDate: operationDate,
      notes: formData.get('notes') || ''
    };
    
    // 根据记录类型添加特定字段
    switch (recordType) {
      case 'fertilizer':
        Object.assign(newRecord, {
          fertilizerType: formData.get('fertilizerType'),
          amount: parseFloat(formData.get('amount')),
          unit: formData.get('unit') || 'kg/亩',
          method: formData.get('method') || '撒施'
        });
        break;
      case 'irrigation':
        Object.assign(newRecord, {
          irrigationType: formData.get('irrigationType'),
          duration: parseFloat(formData.get('duration')),
          waterAmount: parseFloat(formData.get('waterAmount')),
          unit: formData.get('unit') || 'mm'
        });
        break;
      case 'pesticide':
        Object.assign(newRecord, {
          pesticideType: formData.get('pesticideType'),
          concentration: formData.get('concentration'),
          sprayAmount: parseFloat(formData.get('sprayAmount')),
          unit: 'L/亩',
          targetPest: formData.get('targetPest') || ''
        });
        break;
      case 'harvest':
        Object.assign(newRecord, {
          harvestArea: parseFloat(formData.get('harvestArea')),
          yield: parseFloat(formData.get('yield')),
          unit: formData.get('unit') || '吨/亩',
          quality: formData.get('quality') || 'A级'
        });
        break;
    }
    
    // 确保recordsData[recordType]存在
    if (!recordsData[recordType]) {
      recordsData[recordType] = [];
    }
    
    recordsData[recordType].push(newRecord);
    renderRecords();
    closeAddRecordModal();
    Message.success('记录添加成功');
    
    console.log('新添加的记录:', newRecord);
  } catch (error) {
    console.error('添加记录时出错:', error);
    Message.error('添加记录失败，请重试');
  }
}

/**
 * 工具函数：获取字段名称
 */
function getFieldName(field) {
  const names = {
    farmlandId: '地块',
    cropType: '作物类型',
    variety: '品种名称',
    plantArea: '种植面积',
    plantingDate: '播种日期'
  };
  return names[field] || field;
}

/**
 * 工具函数：获取农田名称
 */
function getFarmlandName(farmlandId) {
  const farmlands = {
    'FL001': '临夏示范农田1号',
    'FL002': '东乡玉米基地',
    'FL003': '永靖蔬菜园区',
    'FL005': '临夏水稻试验田'
  };
  return farmlands[farmlandId] || '未知农田';
}

/**
 * 工具函数：获取最近30天的日期数组
 */
function getLast30Days() {
  const dates = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
  }
  return dates;
}

/**
 * 工具函数：生成生长数据
 */
function generateGrowthData(count, min, max) {
  const data = [];
  let lastValue = Math.floor(Math.random() * (max - min)) + min;
  
  for (let i = 0; i < count; i++) {
    // 生成相对平滑的随机数据
    const change = (Math.random() - 0.5) * (max - min) * 0.1;
    lastValue = Math.max(min, Math.min(max, lastValue + change));
    data.push(Math.floor(lastValue));
  }
  
  return data;
}

// 模态框外部点击关闭功能由common.js处理

/**
 * 清理所有图表资源
 */
function cleanupChartResources() {
  try {
    if (growthChart) {
      growthChart.dispose();
      growthChart = null;
    }
    if (healthChart) {
      healthChart.dispose();
      healthChart = null;
    }
  } catch (error) {
    console.warn('清理图表资源时出错:', error);
  }
}

// 页面卸载时清理资源
window.addEventListener('beforeunload', cleanupChartResources);

// 页面可见性变化时管理资源
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // 页面隐藏时清理资源以释放内存
    cleanupChartResources();
  } else {
    // 页面重新可见时重新初始化图表
    setTimeout(() => {
      initGrowthChart();
      initHealthChart();
    }, 100);
  }
});

// 暴露函数到全局作用域
window.openAddCropModal = openAddCropModal;
window.closeAddCropModal = closeAddCropModal;
window.submitCropForm = submitCropForm;
window.openAddRecordModal = openAddRecordModal;
window.closeAddRecordModal = closeAddRecordModal;
window.submitRecordForm = submitRecordForm;
window.updateRecordForm = updateRecordForm;
window.selectCrop = selectCrop;