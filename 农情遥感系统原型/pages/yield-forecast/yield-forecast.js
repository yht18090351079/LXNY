/**
 * 产量预估页面功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化侧边栏折叠功能
  initSideMenuToggle();
  
  // 初始化数据面板折叠功能
  initDataPanelToggle();
  
  // 初始化权重滑块
  initWeightSliders();
  
  // 初始化预估模型切换
  initModelSelector();
  
  // 初始化运行预测按钮
  initRunButton();
  
  // 初始化说明折叠
  initNotesToggle();
  
  // 初始化图表
  initCharts();
  
  // 初始化导出功能
  initExportButtons();
  
  // 初始化地图
  initMap('county', 'linxia-county');
  
  // 初始化区域级联选择
  initAreaCascadeSelection();
});

/**
 * 初始化侧边栏折叠功能
 */
function initSideMenuToggle() {
  const toggleBtn = document.querySelector('.side-menu-toggle');
  const sideMenu = document.querySelector('.side-menu');
  
  if (toggleBtn && sideMenu) {
    toggleBtn.addEventListener('click', function() {
      sideMenu.classList.toggle('collapsed');
    });
  }
}

/**
 * 初始化数据面板折叠功能
 */
function initDataPanelToggle() {
  const toggleBtn = document.querySelector('.data-panel-toggle');
  const dataPanel = document.querySelector('.data-panel');
  
  if (toggleBtn && dataPanel) {
    toggleBtn.addEventListener('click', function() {
      dataPanel.classList.toggle('collapsed');
      
      // 延迟一小段时间等待CSS过渡动画完成后重新调整地图大小
      setTimeout(function() {
        // 调整Leaflet地图大小
        if (window.mapInstance && typeof window.mapInstance.invalidateSize === 'function') {
          window.mapInstance.invalidateSize();
        }
        
        // 调整ECharts地图大小
        if (window.echartInstance && typeof window.echartInstance.resize === 'function') {
          window.echartInstance.resize();
        }
      }, 300); // 300毫秒延迟，与CSS过渡动画时间匹配
    });
  }
}

/**
 * 初始化权重滑块
 */
function initWeightSliders() {
  const sliders = document.querySelectorAll('.weight-slider');
  
  sliders.forEach(slider => {
    const valueDisplay = slider.nextElementSibling;
    
    // 初始化显示
    if (valueDisplay) {
      valueDisplay.textContent = slider.value;
    }
    
    // 监听滑块变化
    slider.addEventListener('input', function() {
      valueDisplay.textContent = this.value;
    });
  });
}

/**
 * 初始化预估模型切换
 */
function initModelSelector() {
  const modelRadios = document.querySelectorAll('.model-item input[type="radio"]');
  const modelDetails = document.querySelector('.detail-item:nth-child(2) .detail-value');
  
  modelRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const modelId = this.id;
        let modelName = "未知模型";
        
        // 设置模型名称
        if (modelId === 'model-ai') {
          modelName = "AI预测模型 v2.3";
        } else if (modelId === 'model-statistical') {
          modelName = "统计分析模型 v1.8";
        } else if (modelId === 'model-historical') {
          modelName = "历史对比模型 v1.5";
        } else if (modelId === 'model-comprehensive') {
          modelName = "综合分析模型 v2.0";
        }
        
        // 更新模型名称显示
        if (modelDetails) {
          modelDetails.textContent = modelName;
        }
        
        console.log(`选择预估模型: ${modelName}`);
        
        // 在实际项目中，这里会根据选择的模型重新加载图表和数据
        initCharts();
      }
    });
  });
}

/**
 * 初始化运行预测按钮
 */
function initRunButton() {
  const runBtn = document.querySelector('.run-btn');
  
  if (runBtn) {
    runBtn.addEventListener('click', function() {
      // 显示加载状态
      this.disabled = true;
      this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 计算中...';
      
      // 获取参数
      const area = document.querySelector('.area-selector select').value;
      const cropType = document.querySelector('.crop-type-selector input:checked').id;
      const modelType = document.querySelector('.model-selector input:checked').id;
      const targetYear = document.getElementById('target-year').value;
      const confidenceInterval = document.getElementById('confidence-interval').value;
      const weatherWeight = document.getElementById('weather-weight').value;
      const growthWeight = document.getElementById('growth-weight').value;
      const soilWeight = document.getElementById('soil-weight').value;
      
      // 打印参数（实际项目中这里会发送请求到服务器）
      console.log('开始运行预测模型，参数：', {
        area, cropType, modelType, targetYear, confidenceInterval,
        weights: { weather: weatherWeight, growth: growthWeight, soil: soilWeight }
      });
      
      // 模拟异步请求
      setTimeout(() => {
        // 恢复按钮状态
        this.disabled = false;
        this.innerHTML = '运行预测';
        
        // 更新预测结果（在实际项目中，这里会使用服务器返回的数据）
        updatePredictionResults();
        
        // 重新初始化图表
        initCharts();
        
        // 显示成功消息
        showMessage('预测计算完成！', 'success');
      }, 2000);
    });
  }
}

/**
 * 更新预测结果
 */
function updatePredictionResults() {
  // 更新预测卡片
  document.querySelector('.forecast-card.total .forecast-value').textContent = '875,621';
  document.querySelector('.forecast-card.yield .forecast-value').textContent = '532';
  document.querySelector('.forecast-card.accuracy .forecast-value').textContent = '93.7';
  
  // 更新预测详情
  document.querySelector('.detail-item:nth-child(4) .detail-value').textContent = '932,450吨';
  document.querySelector('.detail-item:nth-child(5) .detail-value').textContent = '875,621吨';
  document.querySelector('.detail-item:nth-child(6) .detail-value').textContent = '821,390吨';
  
  // 更新预测时间
  const now = new Date();
  const timeString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  document.querySelector('.detail-item:first-child .detail-value').textContent = timeString;
}

/**
 * 初始化说明折叠功能
 */
function initNotesToggle() {
  const toggleBtn = document.querySelector('.notes-toggle');
  const notesContent = document.querySelector('.notes-content');
  
  if (toggleBtn && notesContent) {
    toggleBtn.addEventListener('click', function() {
      if (notesContent.style.display === 'none') {
        notesContent.style.display = 'block';
        toggleBtn.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
      } else {
        notesContent.style.display = 'none';
        toggleBtn.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-up');
      }
    });
  }
}

/**
 * 初始化导出功能
 */
function initExportButtons() {
  // 导出PDF按钮
  const exportPdfBtn = document.querySelector('.action-btn:first-child');
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', function() {
      console.log('导出PDF报告');
      showMessage('正在生成PDF报告...', 'info');
      
      // 模拟导出延迟
      setTimeout(() => {
        showMessage('PDF报告已生成，正在下载...', 'success');
      }, 1500);
    });
  }
  
  // 分享结果按钮
  const shareBtn = document.querySelector('.action-btn:last-child');
  if (shareBtn) {
    shareBtn.addEventListener('click', function() {
      console.log('分享预测结果');
      showMessage('分享链接已复制到剪贴板', 'success');
    });
  }
  
  // 图表导出按钮
  const downloadButtons = document.querySelectorAll('.chart-actions .fa-download');
  downloadButtons.forEach(btn => {
    btn.parentElement.addEventListener('click', function() {
      const chartTitle = this.closest('.chart-header').querySelector('.chart-title').textContent;
      console.log(`导出图表: ${chartTitle}`);
      showMessage(`正在导出"${chartTitle}"图表...`, 'info');
      
      // 模拟导出延迟
      setTimeout(() => {
        showMessage(`"${chartTitle}"图表已导出`, 'success');
      }, 1000);
    });
  });
  
  // 地图导出按钮
  const exportMapBtn = document.querySelector('.map-tools .map-btn:first-child');
  if (exportMapBtn) {
    exportMapBtn.addEventListener('click', function() {
      console.log('导出地图图片');
      showMessage('正在导出地图图片...', 'info');
      
      // 模拟导出延迟
      setTimeout(() => {
        showMessage('地图图片已导出', 'success');
      }, 1000);
    });
  }
}

/**
 * 显示消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success/warning/error/info)
 */
function showMessage(message, type = 'info') {
  // 创建消息元素
  const msgEl = document.createElement('div');
  msgEl.className = `message message-${type}`;
  msgEl.innerHTML = message;
  
  // 添加到页面
  const container = document.querySelector('.message-container') || document.body;
  container.appendChild(msgEl);
  
  // 显示动画
  setTimeout(() => {
    msgEl.classList.add('show');
  }, 10);
  
  // 设置自动消失
  setTimeout(() => {
    msgEl.classList.remove('show');
    setTimeout(() => {
      msgEl.remove();
    }, 300); // 消失动画时长
  }, 3000);
}

/**
 * 初始化图表
 */
function initCharts() {
  // 初始化产量趋势预测图表
  initYieldTrendChart();
  
  // 初始化区域产量分布图表
  initRegionYieldChart();
  
  // 初始化影响因子分析图表
  initFactorAnalysisChart();
  
  // 初始化历史产量对比图表
  initHistoricalComparisonChart();
}

/**
 * 初始化产量趋势预测图表
 */
function initYieldTrendChart() {
  const chartDom = document.getElementById('yieldTrendChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['历史产量', '预测产量', '预测区间'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['2018', '2019', '2020', '2021', '2022', '2023'],
      axisPointer: {
        type: 'shadow'
      }
    },
    yAxis: {
      type: 'value',
      name: '产量(万吨)',
      min: 70,
      max: 100
    },
    series: [
      {
        name: '历史产量',
        type: 'line',
        data: [73.85, 76.58, 78.24, 81.03, 81.95, null],
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '预测产量',
        type: 'line',
        data: [null, null, null, null, null, 87.56],
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 0
        },
        itemStyle: {
          color: '#52C41A'
        }
      },
      {
        name: '预测区间',
        type: 'line',
        data: [null, null, null, null, null, 87.56],
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3,
          type: 'dashed'
        },
        itemStyle: {
          color: '#52C41A'
        },
        markArea: {
          itemStyle: {
            color: 'rgba(82, 196, 26, 0.2)'
          },
          data: [
            [
              {
                name: '95%置信区间',
                xAxis: 4.5,
                yAxis: 82.14
              },
              {
                xAxis: 5.5,
                yAxis: 93.25
              }
            ]
          ]
        }
      }
    ]
  };
  
  chart.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', function() {
    chart.resize();
  });
}

/**
 * 初始化区域产量分布图表
 */
function initRegionYieldChart() {
  const chartDom = document.getElementById('regionYieldChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}万吨 ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0,
      data: ['北部区域', '南部区域', '东部区域', '西部区域']
    },
    series: [
      {
        name: '区域产量',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 32.58, name: '北部区域' },
          { value: 19.27, name: '南部区域' },
          { value: 25.43, name: '东部区域' },
          { value: 10.28, name: '西部区域' }
        ]
      }
    ]
  };
  
  chart.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', function() {
    chart.resize();
  });
}

/**
 * 初始化影响因子分析图表
 */
function initFactorAnalysisChart() {
  const chartDom = document.getElementById('factorAnalysisChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['因子得分', '同比变化'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        max: 10,
        axisLabel: {
          formatter: '{value} 分'
        },
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        max: 15,
        min: -15,
        axisLabel: {
          formatter: '{value} %'
        },
        splitLine: {
          show: false
        }
      }
    ],
    yAxis: {
      type: 'category',
      data: ['降水量', '积温', 'NDVI均值', '土壤水分', '日照时数'],
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '因子得分',
        type: 'bar',
        data: [8.5, 7.8, 8.3, 6.5, 7.2],
        label: {
          show: true,
          position: 'right',
          formatter: '{c} 分'
        },
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '同比变化',
        type: 'bar',
        yAxisIndex: 0,
        xAxisIndex: 1,
        data: [12.5, 5.2, 3.7, -1.8, 2.1],
        label: {
          show: true,
          position: 'right',
          formatter: function(params) {
            return params.value > 0 ? `+${params.value}%` : `${params.value}%`;
          }
        },
        itemStyle: {
          color: function(params) {
            return params.value >= 0 ? '#52C41A' : '#F5222D';
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', function() {
    chart.resize();
  });
}

/**
 * 初始化历史产量对比图表
 */
function initHistoricalComparisonChart() {
  const chartDom = document.getElementById('historicalComparisonChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['实际产量', '预测产量', '误差率'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '10%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: ['2018', '2019', '2020', '2021', '2022'],
        axisPointer: {
          type: 'shadow'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '产量(万吨)',
        min: 70,
        max: 85,
        position: 'left',
        axisLine: {
          lineStyle: {
            color: '#1890FF'
          }
        },
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '误差率(%)',
        min: -5,
        max: 5,
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#FAAD14'
          }
        },
        axisLabel: {
          formatter: '{value}%'
        }
      }
    ],
    series: [
      {
        name: '实际产量',
        type: 'bar',
        barWidth: '25%',
        data: [73.85, 76.58, 78.24, 81.03, 81.95],
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '预测产量',
        type: 'bar',
        barWidth: '25%',
        data: [75.26, 79.01, 77.68, 79.22, 82.53],
        itemStyle: {
          color: '#52C41A'
        }
      },
      {
        name: '误差率',
        type: 'line',
        yAxisIndex: 1,
        data: [1.9, 3.2, -0.7, -2.2, 0.7],
        symbolSize: 8,
        lineStyle: {
          width: 3,
          type: 'dashed'
        },
        itemStyle: {
          color: '#FAAD14'
        },
        label: {
          show: true,
          position: 'top',
          formatter: function(params) {
            return params.value > 0 ? `+${params.value}%` : `${params.value}%`;
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', function() {
    chart.resize();
  });
}

/**
 * 初始化地图
 * @param {string} level - 地图级别：county（区县） 或 town（乡镇）
 * @param {string} regionId - 选中的区域ID
 * @param {string} parentId - 父级区域ID（乡镇级别时使用）
 */
function initMap(level, regionId = 'all', parentId = null) {
  // 清空地图容器
  const mapContainer = document.querySelector('.map-container');
  const mapDiv = document.getElementById('map');
  
  if (!mapContainer || !mapDiv) {
    console.error('找不到地图容器元素');
    return; // 如果没有地图容器，直接返回
  }
  
  // 移除之前可能存在的地图实例
  if (window.mapInstance) {
    window.mapInstance.remove();
    window.mapInstance = null;
  }
  
  // 移除可能存在的ECharts地图实例
  if (window.echartInstance) {
    window.echartInstance.dispose();
    window.echartInstance = null;
  }
  
  // 控制图例显示/隐藏
  const mapLegend = document.querySelector('.map-legend');
  if (mapLegend) {
    if (level === 'county') {
      // 市县级地图隐藏图例
      mapLegend.style.display = 'none';
    } else {
      // 乡镇级地图显示图例
      mapLegend.style.display = 'block';
    }
  }
  
  if (level === 'county') {
    // 区县级别使用ECharts地图
    // 隐藏Leaflet地图
    if (mapDiv) {
      mapDiv.style.display = 'none';
    }
    
    // 创建ECharts容器
    let echartsDiv = document.getElementById('echarts-map');
    if (!echartsDiv) {
      echartsDiv = document.createElement('div');
      echartsDiv.id = 'echarts-map';
      echartsDiv.style.width = '100%';
      echartsDiv.style.height = '100%';
      echartsDiv.style.position = 'absolute';
      echartsDiv.style.top = '0';
      echartsDiv.style.left = '0';
      echartsDiv.style.zIndex = '10';
      if (mapContainer) {
        mapContainer.appendChild(echartsDiv);
      }
    } else {
      echartsDiv.style.display = 'block';
    }
    
    // 初始化ECharts地图
    initEchartsMap(regionId);
  } else {
    // 乡镇级别使用Leaflet地图
    
    // 隐藏ECharts地图
    const echartsDiv = document.getElementById('echarts-map');
    if (echartsDiv) {
      echartsDiv.style.display = 'none';
    }
    
    // 显示Leaflet地图
    if (mapDiv) {
      mapDiv.style.display = 'block';
    }
    
    if (level === 'town' && regionId !== 'all') {
      // 初始化乡镇级真实地图
      initRealMap(regionId, parentId);
    } else {
      // 初始化模拟地图
      initSimulatedMap(level, regionId);
    }
  }
}

/**
 * 初始化ECharts地图
 * @param {string} regionId - 选中的区县ID
 */
function initEchartsMap(regionId) {
  // 初始化ECharts实例
  const chart = echarts.init(document.getElementById('echarts-map'));
  window.echartInstance = chart; // 存储ECharts实例，方便后续管理
  
  // 地图数据
  let mapData = [];
  
  // 根据选择的区县加载对应的地图数据
  let mapName = '甘肃省临夏回族自治州';
  if (regionId === 'all') {
    // 加载临夏州全州地图
    $.getJSON('../../static/map/china.json', function(data) {
      // 这里应该替换为实际的临夏州地图数据
      // 由于示例中没有具体的临夏州地图，这里使用中国地图作为示例
      let d = [];
      for (let i = 0; i < data.features.length; i++) {
        d.push({
          name: data.features[i].properties.name
        });
      }
      mapData = d;
      
      // 注册地图
      echarts.registerMap('linxia', data);
      
      // 渲染地图
      renderEchartsMap('linxia', d, chart);
    });
  } else {
    // 加载选中区县的地图
    // 注意：这里需要根据实际情况修改，将regionId映射到对应的地图JSON文件
    // 固定使用临夏县地图数据
    mapName = '临夏县';
    
    $.getJSON('../../static/map/city/622900.json', function(data) {
      // 处理区县地图数据
      let d = [];
      for (let i = 0; data.features && i < data.features.length; i++) {
        d.push({
          name: data.features[i].properties.name
        });
      }
      mapData = d;
      
      // 注册地图
      echarts.registerMap(mapName, data);
      
      // 渲染地图
      renderEchartsMap(mapName, d, chart);
    });
  }
}

/**
 * 渲染ECharts地图
 * @param {string} map - 地图名称
 * @param {Array} data - 地图数据
 * @param {Object} chart - ECharts实例
 */
function renderEchartsMap(map, data, chart) {
  // 获取当前选择的作物类型
  const cropType = document.querySelector('.crop-type-selector input[type="radio"]:checked').id;
  
  // 获取当前选择的预估模型
  const modelType = document.querySelector('.model-selector input[type="radio"]:checked').id;
  
  // 生成产量预测数据
  const seriesData = generateForecastData(data);
  
  // 设置颜色方案
  let colorRange;
  if (cropType === 'crop-wheat') {
    colorRange = ['#ffffd4', '#fed98e', '#fe9929', '#d95f0e', '#993404'];
  } else if (cropType === 'crop-corn') {
    colorRange = ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'];
  } else if (cropType === 'crop-vegetable') {
    colorRange = ['#f1eef6', '#bdc9e1', '#74a9cf', '#2b8cbe', '#045a8d'];
  } else if (cropType === 'crop-greenhouse') {
    colorRange = ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'];
  } else {
    colorRange = ['#ffffd4', '#fed98e', '#fe9929', '#d95f0e', '#993404'];
  }
  
  const option = {
    backgroundColor: '#f5f5f5',
    title: {
      text: `${map}产量预估`,
      subtext: '预测产量分布',
      left: 'center',
      textStyle: {
        color: '#333',
        fontSize: 18,
        fontWeight: 'normal',
        fontFamily: "Microsoft YaHei"
      },
      subtextStyle: {
        color: '#666',
        fontSize: 14,
        fontWeight: 'normal',
        fontFamily: "Microsoft YaHei"
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return `${params.name}<br/>预估产量: ${params.value}公斤/亩<br/>同比增长: ${(Math.random() * 10 - 2).toFixed(1)}%`;
      }
    },
    visualMap: {
      min: 300,
      max: 700,
      text: ['高产', '低产'],
      realtime: false,
      calculable: true,
      inRange: {
        color: colorRange
      }
    },
    toolbox: {
      show: true,
      orient: 'vertical',
      left: 'right',
      top: 'center',
      feature: {
        dataView: { readOnly: false },
        restore: {},
        saveAsImage: {}
      }
    },
    series: [
      {
        name: map,
        type: 'map',
        mapType: map,
        roam: true,
        label: {
          normal: {
            show: true,
            textStyle: {
              color: '#333',
              fontSize: 12
            }
          },
          emphasis: {
            show: true,
            textStyle: {
              color: '#333',
              fontSize: 14,
              fontWeight: 'bold'
            }
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#e0f7fa',
            borderColor: '#3cb6c7'
          },
          emphasis: {
            areaColor: '#4fc3f7'
          }
        },
        data: seriesData
      }
    ]
  };
  
  // 设置ECharts选项
  chart.setOption(option);
}

/**
 * 生成产量预测数据
 * @param {Array} data - 地图区域数据
 * @returns {Array} - 带有预测产量的数据
 */
function generateForecastData(data) {
  return data.map(item => {
    return {
      name: item.name,
      value: Math.floor(Math.random() * 400 + 300) // 随机产量，范围300-700公斤/亩
    };
  });
}

/**
 * 初始化模拟地图（区县级）
 * @param {string} level - 地图级别
 * @param {string} regionId - 区域ID
 */
function initSimulatedMap(level, regionId) {
  // 定义地图数据（省略不重要的地理坐标数据，简化表示）
  const mapData = {
    'county': {
      // 临夏州下属区县地理边界数据（简化）
      'all': {
        'linxia-city': { center: [35.6, 103.2], name: '临夏市', bounds: [[35.5, 103.1], [35.7, 103.3]] },
        'linxia-county': { center: [35.5, 103.0], name: '临夏县', bounds: [[35.4, 102.9], [35.6, 103.1]] },
        'kangle': { center: [35.4, 103.1], name: '康乐县', bounds: [[35.3, 103.0], [35.5, 103.2]] },
        'yongjing': { center: [35.9, 103.3], name: '永靖县', bounds: [[35.8, 103.2], [36.0, 103.4]] },
        'guanghe': { center: [35.5, 102.9], name: '广河县', bounds: [[35.4, 102.8], [35.6, 103.0]] },
        'hezheng': { center: [35.2, 103.2], name: '和政县', bounds: [[35.1, 103.1], [35.3, 103.3]] },
        'dongxiang': { center: [35.7, 103.1], name: '东乡族自治县', bounds: [[35.6, 103.0], [35.8, 103.2]] },
        'jishishan': { center: [35.7, 103.0], name: '积石山县', bounds: [[35.6, 102.9], [35.8, 103.1]] }
      }
    }
  };
  
  // 创建地图
  const mapOptions = {
    zoomControl: false, // 禁用默认缩放控件，使用自定义控件
    attributionControl: false // 禁用归属控件
  };
  
  const map = L.map('map', mapOptions).setView([35.6, 103.2], 10);
  window.mapInstance = map;
  
  // 添加底图图层
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
  }).addTo(map);
  
  // 设置地图视图范围
  if (level === 'county' && regionId !== 'all') {
    // 如果选择了具体区县，则缩放到对应区县
    const countyData = mapData.county.all[regionId];
    
    if (countyData) {
      map.fitBounds([
        countyData.bounds[0],
        countyData.bounds[1]
      ]);
    }
  } else {
    // 如果是全部区县，则显示整个临夏州
    map.fitBounds([
      [35.1, 102.8],
      [36.0, 103.4]
    ]);
  }
  
  return map;
}

/**
 * 初始化实际地图 (Leaflet)
 * @param {string} townId - 乡镇ID
 * @param {string} countyId - 区县ID
 */
function initRealMap(townId, countyId) {
  // 设置地图中心坐标（基于所选乡镇）
  // 这里使用模拟坐标，实际项目中应该使用真实坐标
  const mapCenters = {
    'chengguan': [35.6010, 103.1935],
    'hongtai': [35.5850, 103.2209],
    'beidao': [35.6120, 103.1809],
    'yinji': [35.5784, 103.2409],
    'hexi': [35.5650, 103.2609],
    'douba': [35.5550, 103.1709],
    'kangle-town': [35.3760, 103.0795],
    'songmingyan': [35.3960, 103.0595],
    'yongjing-town': [35.9720, 103.3215],
    'liujiaxia': [36.0020, 103.3115],
    'guanghe-town': [35.4830, 103.5655],
    'longwu': [35.4630, 103.5455],
    'hezheng-town': [35.2420, 103.3495],
    'xinhua': [35.2620, 103.3295],
    'tuoshan': [35.6420, 103.4520],
    'daban': [35.6620, 103.4320],
    'liuji': [35.7430, 102.8765],
    'wenquan': [35.7230, 102.8965]
  };
  
  // 默认坐标（临夏州中心）
  let mapCenter = [35.5884, 103.2109];
  let zoomLevel = 12;
  
  if (townId in mapCenters) {
    mapCenter = mapCenters[townId];
    zoomLevel = 14;
  }
  
  // 初始化地图
  const map = L.map('map').setView(mapCenter, zoomLevel);
  
  // 添加OpenStreetMap底图
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 18,
  }).addTo(map);
  
  // 添加缩放控制
  L.control.zoom({
    position: 'topright'
  }).addTo(map);
  
  // 添加作物地块（模拟数据）
  addCropLayers(map, townId);
  
  // 存储地图实例以便其他地方使用
  window.mapInstance = map;
  
  return map;
}

/**
 * 添加作物地块图层
 * @param {Object} map - Leaflet地图实例
 * @param {string} townId - 乡镇ID
 */
function addCropLayers(map, townId) {
  // 获取选中的作物类型
  const selectedCrop = document.querySelector('.crop-type-selector input[type="radio"]:checked').id;
  
  // 作物类型颜色映射
  const cropColors = {
    'crop-wheat': '#E8D639',    // 小麦 - 黄色
    'crop-corn': '#61D836',     // 玉米 - 绿色
    'crop-vegetable': '#36D8AD', // 蔬菜 - 青色
    'crop-greenhouse': '#36A0D8' // 大棚 - 蓝色
  };
  
  // 样式定义
  const cropStyles = {
    'crop-wheat': { color: '#E8D639', fillColor: '#E8D639', weight: 1, fillOpacity: 0.7 },
    'crop-corn': { color: '#61D836', fillColor: '#61D836', weight: 1, fillOpacity: 0.7 },
    'crop-vegetable': { color: '#36D8AD', fillColor: '#36D8AD', weight: 1, fillOpacity: 0.7 },
    'crop-greenhouse': { color: '#36A0D8', fillColor: '#36A0D8', weight: 1, fillOpacity: 0.7 }
  };
  
  // 为每个乡镇生成模拟地块数据
  const cropPolygons = generateCropPolygons(townId);
  
  // 创建图层组
  const layerGroups = {
    'crop-wheat': L.layerGroup(),
    'crop-corn': L.layerGroup(),
    'crop-vegetable': L.layerGroup(),
    'crop-greenhouse': L.layerGroup()
  };
  
  // 筛选选中作物类型的地块
  const polygons = cropPolygons.filter(poly => poly.cropType === selectedCrop);
  
  // 添加地块到图层
  polygons.forEach(poly => {
    const polygon = L.polygon(poly.coordinates, cropStyles[selectedCrop]).addTo(layerGroups[selectedCrop]);
    
    // 获取作物状态颜色
    let statusColor = '#52C41A'; // 默认优-绿色
    if (poly.growthStatus === '良') {
      statusColor = '#FAAD14'; // 良-黄色
    } else if (poly.growthStatus === '中') {
      statusColor = '#F5222D'; // 中-红色
    }
    
    // 添加弹出信息
    polygon.bindPopup(`
      <div class="field-popup">
        <h4>${getCropName(selectedCrop)}地块 #${poly.id}</h4>
        <table>
          <tr><td>面积:</td><td>${poly.area}亩</td></tr>
          <tr><td>品种:</td><td>${poly.variety}</td></tr>
          <tr><td>播种日期:</td><td>${poly.plantDate}</td></tr>
          <tr><td>权属人:</td><td>${poly.owner}</td></tr>
          <tr><td>预计产量:</td><td>${poly.estimatedYield}</td></tr>
          <tr><td>长势评级:</td><td><span style="color:${statusColor}">${poly.growthStatus}</span></td></tr>
        </table>
      </div>
    `);
    
    // 添加悬停效果
    polygon.on('mouseover', function() {
      this.setStyle({
        fillOpacity: 0.8,
        weight: 3
      });
    });
    
    polygon.on('mouseout', function() {
      this.setStyle({
        fillOpacity: 0.7,
        weight: 1
      });
    });
  });
  
  // 添加图层到地图
  Object.values(layerGroups).forEach(layer => layer.addTo(map));
  
  // 添加图层控制
  const overlays = {
    '小麦': layerGroups['crop-wheat'],
    '玉米': layerGroups['crop-corn'],
    '蔬菜': layerGroups['crop-vegetable'],
    '大棚': layerGroups['crop-greenhouse']
  };
  
  L.control.layers(null, overlays, {
    position: 'topright',
    collapsed: false
  }).addTo(map);
  
  // 监听作物类型选择器变化
  document.querySelectorAll('.crop-type-selector input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      // 隐藏所有图层
      Object.values(layerGroups).forEach(layer => map.removeLayer(layer));
      
      // 显示选中的图层
      const selectedCropType = this.id;
      if (layerGroups[selectedCropType]) {
        map.addLayer(layerGroups[selectedCropType]);
      }
    });
  });
}

/**
 * 获取作物名称
 * @param {string} cropType - 作物类型ID
 * @returns {string} 作物名称
 */
function getCropName(cropType) {
  switch(cropType) {
    case 'crop-wheat': return '小麦';
    case 'crop-corn': return '玉米';
    case 'crop-vegetable': return '蔬菜';
    case 'crop-greenhouse': return '大棚';
    default: return '未知作物';
  }
}

/**
 * 为指定乡镇生成模拟地块数据
 * @param {string} townId - 乡镇ID
 * @returns {Array} 地块数据数组
 */
function generateCropPolygons(townId) {
  // 获取乡镇中心坐标
  const mapCenters = {
    'chengguan': [35.6010, 103.1935],
    'hongtai': [35.5850, 103.2209],
    'beidao': [35.6120, 103.1809],
    'yinji': [35.5784, 103.2409],
    'hexi': [35.5650, 103.2609],
    'douba': [35.5550, 103.1709],
    'kangle-town': [35.3760, 103.0795],
    'songmingyan': [35.3960, 103.0595],
    'yongjing-town': [35.9720, 103.3215],
    'liujiaxia': [36.0020, 103.3115],
    'guanghe-town': [35.4830, 103.5655],
    'longwu': [35.4630, 103.5455],
    'hezheng-town': [35.2420, 103.3495],
    'xinhua': [35.2620, 103.3295],
    'tuoshan': [35.6420, 103.4520],
    'daban': [35.6620, 103.4320],
    'liuji': [35.7430, 102.8765],
    'wenquan': [35.7230, 102.8965]
  };
  
  const center = mapCenters[townId] || [35.5884, 103.2109];
  const polygons = [];
  
  // 作物类型
  const cropTypes = ['crop-wheat', 'crop-corn', 'crop-vegetable', 'crop-greenhouse'];
  
  // 作物品种
  const cropVarieties = {
    'crop-wheat': ['冬小麦', '春小麦', '矮杆小麦', '高产小麦'],
    'crop-corn': ['甜玉米', '普通玉米', '高产玉米', '糯玉米'],
    'crop-vegetable': ['西红柿', '黄瓜', '茄子', '辣椒', '西红柿、黄瓜'],
    'crop-greenhouse': ['草莓', '西红柿', '黄瓜', '西瓜', '哈密瓜']
  };
  
  // 生长阶段
  const growthStages = {
    'crop-wheat': ['苗期', '分蘖期', '拔节期', '抽穗期', '灌浆期', '成熟期'],
    'crop-corn': ['苗期', '拔节期', '抽穗期', '开花期', '灌浆期', '成熟期'],
    'crop-vegetable': ['苗期', '生长期', '开花期', '结果期', '成熟期'],
    'crop-greenhouse': ['苗期', '生长期', '开花期', '结果期', '盛果期']
  };
  
  // 区域名称
  const locations = ['东部区域', '西部区域', '南部区域', '北部区域', '中心区域', '东南区域', '西南区域', '东北区域', '西北区域'];
  
  // 权属人姓名
  const owners = ['李明', '张伟', '王刚', '赵丽', '刘欢', '陈晓', '杨华', '周强', '吴芳'];
  
  // 为每种作物生成多个地块
  let idCounter = 1000;
  cropTypes.forEach(cropType => {
    // 每种作物生成5-10个地块
    const count = 5 + Math.floor(Math.random() * 6);
    const cropCode = cropType === 'crop-wheat' ? 'W' : 
                     cropType === 'crop-corn' ? 'C' : 
                     cropType === 'crop-vegetable' ? 'V' : 'G';
    
    for (let i = 0; i < count; i++) {
      idCounter++;
      // 随机偏移中心点
      const centerLat = center[0] + (Math.random() - 0.5) * 0.05;
      const centerLng = center[1] + (Math.random() - 0.5) * 0.05;
      
      // 地块大小（面积）
      const size = 0.002 + Math.random() * 0.008;
      
      // 地块形状（多边形顶点）
      const vertices = 4 + Math.floor(Math.random() * 4); // 4-7个顶点
      
      // 生成多边形坐标
      const coordinates = [];
      for (let j = 0; j < vertices; j++) {
        const angle = (j / vertices) * 2 * Math.PI;
        // 添加一些随机性使地块形状不那么规则
        const radius = size * (0.8 + Math.random() * 0.4);
        const lat = centerLat + radius * Math.cos(angle);
        const lng = centerLng + radius * Math.sin(angle);
        coordinates.push([lat, lng]);
      }
      
      // 计算面积（模拟数据）
      const area = Math.round(10 + Math.random() * 90);
      
      // 生成种植日期和收获日期
      const year = 2023;
      let plantMonth, harvestMonth;
      
      switch(cropType) {
        case 'crop-wheat':
          plantMonth = 9; // 上一年9月播种
          harvestMonth = 6; // 6月收获
          break;
        case 'crop-corn':
          plantMonth = 4; // 4月播种
          harvestMonth = 9; // 9月收获
          break;
        case 'crop-vegetable':
          plantMonth = 3 + Math.floor(Math.random() * 3); // 3-5月播种
          harvestMonth = plantMonth + 3; // 3个月后收获
          break;
        case 'crop-greenhouse':
          plantMonth = 1 + Math.floor(Math.random() * 6); // 1-6月播种
          harvestMonth = plantMonth + 2 + Math.floor(Math.random() * 2); // 2-3个月后收获
          break;
      }
      
      const plantDay = 1 + Math.floor(Math.random() * 28);
      const harvestDay = 1 + Math.floor(Math.random() * 28);
      
      const plantDate = `${year}-${plantMonth.toString().padStart(2, '0')}-${plantDay.toString().padStart(2, '0')}`;
      const harvestDate = `${year}-${harvestMonth.toString().padStart(2, '0')}-${harvestDay.toString().padStart(2, '0')}`;
      
      // 随机选择品种
      const variety = cropVarieties[cropType][Math.floor(Math.random() * cropVarieties[cropType].length)];
      
      // 随机选择生长阶段
      const growthStage = growthStages[cropType][Math.floor(Math.random() * growthStages[cropType].length)];
      
      // 随机生成生长指数（0.5-1.0）
      const growthIndex = (0.5 + Math.random() * 0.5).toFixed(2);
      
      // 根据生长指数确定生长状态
      let growthStatus = '优';
      if (growthIndex < 0.7) {
        growthStatus = '中';
      } else if (growthIndex < 0.85) {
        growthStatus = '良';
      }
      
      // 随机选择区域
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // 随机选择权属人
      const owner = owners[Math.floor(Math.random() * owners.length)];
      
      // 生成预计产量
      let estimatedYield;
      switch(cropType) {
        case 'crop-wheat':
          estimatedYield = `${400 + Math.floor(Math.random() * 200)}公斤/亩`;
          break;
        case 'crop-corn':
          estimatedYield = `${500 + Math.floor(Math.random() * 300)}公斤/亩`;
          break;
        case 'crop-vegetable':
          estimatedYield = `${2000 + Math.floor(Math.random() * 2000)}公斤/亩`;
          break;
        case 'crop-greenhouse':
          estimatedYield = `${1500 + Math.floor(Math.random() * 5000)}公斤/亩`;
          break;
      }
      
      // 生成联系电话
      const contact = `1${3 + Math.floor(Math.random() * 6)}${Math.floor(Math.random() * 10000000).toString().padStart(8, '0')}`;
      
      // 添加到地块数组
      polygons.push({
        id: `${cropCode}${idCounter}`,
        cropType,
        coordinates,
        area,
        plantDate,
        harvestDate,
        variety,
        growthStage,
        growthIndex,
        growthStatus,
        location,
        owner,
        estimatedYield,
        contact
      });
    }
  });
  
  return polygons;
}

/**
 * 初始化区域级联选择
 */
function initAreaCascadeSelection() {
  const countySelector = document.getElementById('county-selector');
  const townSelector = document.getElementById('town-selector');
  
  if (countySelector && townSelector) {
    // 定义乡镇数据（模拟数据）
    const townData = {
      'all': [
        { value: 'all', text: '全部乡镇' }
      ],
      'linxia-city': [
        { value: 'all', text: '全部乡镇' },
        { value: 'chengguan', text: '城关镇' },
        { value: 'hongtai', text: '洪泰镇' },
        { value: 'beidao', text: '北道镇' }
      ],
      'linxia-county': [
        { value: 'all', text: '全部乡镇' },
        { value: 'yinji', text: '榆林镇' },
        { value: 'hexi', text: '河西镇' },
        { value: 'douba', text: '头墩镇' }
      ],
      'kangle': [
        { value: 'all', text: '全部乡镇' },
        { value: 'kangle-town', text: '康乐镇' },
        { value: 'songmingyan', text: '松鸣岩镇' }
      ],
      'yongjing': [
        { value: 'all', text: '全部乡镇' },
        { value: 'yongjing-town', text: '永靖镇' },
        { value: 'liujiaxia', text: '刘家峡镇' }
      ],
      'guanghe': [
        { value: 'all', text: '全部乡镇' },
        { value: 'guanghe-town', text: '广河镇' },
        { value: 'longwu', text: '龙望镇' }
      ],
      'hezheng': [
        { value: 'all', text: '全部乡镇' },
        { value: 'hezheng-town', text: '和政镇' },
        { value: 'xinhua', text: '新华镇' }
      ],
      'dongxiang': [
        { value: 'all', text: '全部乡镇' },
        { value: 'tuoshan', text: '坡泉镇' },
        { value: 'daban', text: '大板镇' }
      ],
      'jishishan': [
        { value: 'all', text: '全部乡镇' },
        { value: 'liuji', text: '六合镇' },
        { value: 'wenquan', text: '温泉镇' }
      ]
    };
    
    // 区县选择变更时更新乡镇选项
    countySelector.addEventListener('change', function() {
      const countyId = this.value;
      
      // 更新乡镇选择器的选项
      updateTownOptions(countyId);
      
      // 重新初始化地图
      initMap('county', countyId);
    });
    
    // 乡镇选择变更时更新地图
    townSelector.addEventListener('change', function() {
      const countyId = countySelector.value;
      const townId = this.value;
      
      // 如果选择了具体乡镇，显示乡镇级真实地图
      if (townId !== 'all') {
        initMap('town', townId, countyId);
      } else {
        // 如果选择了"全部乡镇"，则显示县级模拟地图
        initMap('county', countyId);
      }
    });
    
    // 更新乡镇选择器的选项
    function updateTownOptions(countyId) {
      // 清空现有选项
      townSelector.innerHTML = '';
      
      // 获取对应的乡镇数据
      const towns = townData[countyId] || townData['all'];
      
      // 添加新选项
      towns.forEach(town => {
        const option = document.createElement('option');
        option.value = town.value;
        option.textContent = town.text;
        townSelector.appendChild(option);
      });
    }
  }
} 