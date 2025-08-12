/**
 * 气象一张图页面功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化侧边栏折叠功能
  initSideMenuToggle();
  
  // 初始化数据面板折叠功能
  initDataPanelToggle();
  
  // 初始化区域级联选择
  initAreaCascadeSelection();
  
  // 初始化气象指标选择
  initWeatherIndexSelector();
  
  // 初始化日期类型选择
  initDateTypeSelector();
  
  // 初始化配色方案选择
  initColorSchemeSelector();
  
  // 初始化应用设置按钮
  initApplyButton();
  
  // 初始化地图交互
  initMapInteraction();
  
  // 初始化日期控制
  initDateControls();
  
  // 初始化图表
  initCharts();
  
  // 初始化气象站点交互
  initStationInteraction();
  
  // 初始化报告操作
  initReportActions();
});

/**
 * 初始化气象指标切换功能
 */
function initWeatherIndexSelector() {
  const indexRadios = document.querySelectorAll('.weather-index-item input[type="radio"]');
  const currentIndexTitle = document.querySelector('.current-index');
  const legendTitle = document.querySelector('.legend-title');
  const legendGradient = document.querySelector('.legend-gradient');
  const legendLabels = document.querySelector('.legend-labels');
  
  // 指标配置
  const indexConfigs = {
    'index-temperature': {
      title: '温度分布',
      legendTitle: '温度 (°C)',
      gradientClass: 'temperature-gradient',
      labels: ['15', '20', '25', '30', '35']
    },
    'index-rainfall': {
      title: '降水分布',
      legendTitle: '降水量 (mm)',
      gradientClass: 'rainfall-gradient',
      labels: ['0', '25', '50', '75', '100']
    },
    'index-humidity': {
      title: '湿度分布',
      legendTitle: '湿度 (%)',
      gradientClass: 'humidity-gradient',
      labels: ['30', '45', '60', '75', '90']
    },
    'index-sunlight': {
      title: '日照分布',
      legendTitle: '日照 (小时)',
      gradientClass: 'sunlight-gradient',
      labels: ['2', '4', '6', '8', '10']
    },
    'index-wind': {
      title: '风速分布',
      legendTitle: '风速 (m/s)',
      gradientClass: 'wind-gradient',
      labels: ['0', '3', '6', '9', '12']
    },
    'index-accumulated-temperature': {
      title: '积温分布',
      legendTitle: '积温 (°C·d)',
      gradientClass: 'accumulated-temp-gradient',
      labels: ['500', '1000', '1500', '2000', '2500']
    }
  };
  
  indexRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const indexId = this.id;
        const config = indexConfigs[indexId];
        
        // 更新标题和图例
        if (currentIndexTitle) {
          currentIndexTitle.textContent = config.title;
        }
        
        if (legendTitle) {
          legendTitle.textContent = config.legendTitle;
        }
        
        if (legendGradient) {
          // 移除所有渐变类
          legendGradient.classList.remove(
            'temperature-gradient', 
            'rainfall-gradient', 
            'humidity-gradient', 
            'sunlight-gradient', 
            'wind-gradient', 
            'accumulated-temp-gradient'
          );
          // 添加当前渐变类
          legendGradient.classList.add(config.gradientClass);
        }
        
        if (legendLabels) {
          // 更新标签
          const labelSpans = legendLabels.querySelectorAll('span');
          config.labels.forEach((label, index) => {
            if (labelSpans[index]) {
              labelSpans[index].textContent = label;
            }
          });
        }
        
        // 在实际项目中，这里会根据选择的指标重新加载地图数据
        console.log(`选择了气象指标: ${config.title}`);
      }
    });
  });
}

/**
 * 初始化时间类型切换功能
 */
function initDateTypeSelector() {
  const dateTypeRadios = document.querySelectorAll('.date-type-item input[type="radio"]');
  const datePicker = document.querySelector('.date-picker-container');
  const forecastPeriod = document.querySelector('.forecast-period');
  
  dateTypeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const dateType = this.id;
        
        // 显示/隐藏相应的控件
        if (dateType === 'date-type-real') {
          datePicker.style.display = 'flex';
          forecastPeriod.style.display = 'none';
        } else if (dateType === 'date-type-history') {
          datePicker.style.display = 'flex';
          forecastPeriod.style.display = 'none';
        } else if (dateType === 'date-type-forecast') {
          datePicker.style.display = 'flex';
          forecastPeriod.style.display = 'block';
        }
        
        console.log(`选择了时间类型: ${dateType}`);
      }
    });
  });
}

/**
 * 初始化颜色方案切换功能
 */
function initColorSchemeSelector() {
  const colorOptions = document.querySelectorAll('.color-option');
  
  colorOptions.forEach(option => {
    option.addEventListener('click', function() {
      // 移除所有激活状态
      colorOptions.forEach(opt => opt.classList.remove('active'));
      
      // 添加当前选项激活状态
      this.classList.add('active');
      
      const scheme = this.getAttribute('data-scheme');
      console.log(`选择了配色方案: ${scheme}`);
    });
  });
}

/**
 * 初始化应用设置按钮功能
 */
function initApplyButton() {
  const applyBtn = document.querySelector('.apply-btn');
  
  if (applyBtn) {
    applyBtn.addEventListener('click', function() {
      // 获取当前设置
      const showGrid = document.getElementById('show-grid').checked;
      const showContour = document.getElementById('show-contour').checked;
      const showLabel = document.getElementById('show-label').checked;
      const showBoundary = document.getElementById('show-boundary').checked;
      const colorScheme = document.querySelector('.color-option.active').getAttribute('data-scheme');
      
      // 应用设置（在实际项目中，这里会更新地图显示）
      console.log('应用显示设置:', {
        showGrid,
        showContour,
        showLabel,
        showBoundary,
        colorScheme
      });
      
      // 显示成功提示
      showToast('设置已应用');
    });
  }
}

/**
 * 初始化地图交互功能
 */
function initMapInteraction() {
  // 初始化地图
  initMap('county', 'linxia-county');

  // 初始化地图工具按钮
  const mapTools = document.querySelectorAll('.map-toolbar .tool-btn');
  
  mapTools.forEach(tool => {
    tool.addEventListener('click', function() {
      // 移除所有工具按钮的激活状态
      mapTools.forEach(t => t.classList.remove('active'));
      
      // 添加当前工具按钮的激活状态
      this.classList.add('active');
      
      // 根据工具类型执行相应功能
      const toolType = this.getAttribute('title');
      console.log(`激活工具: ${toolType}`);
      
      // 实际项目中，这里会根据工具类型激活相应的地图功能
      if (toolType === '放大' && window.mapInstance) {
        window.mapInstance.zoomIn();
      } else if (toolType === '缩小' && window.mapInstance) {
        window.mapInstance.zoomOut();
      } else if (toolType === '全屏查看') {
        const mapContainer = document.querySelector('.weather-map-container');
        if (mapContainer) {
          if (!document.fullscreenElement) {
            mapContainer.requestFullscreen().catch(err => {
              console.error('全屏请求被拒绝:', err);
            });
          } else {
            document.exitFullscreen();
          }
        }
      }
    });
  });
  
  // 初始化区域级联选择
  initAreaCascadeSelection();
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

/**
 * 初始化日期控制器
 */
function initDateControls() {
  const prevDateBtn = document.getElementById('prevDate');
  const nextDateBtn = document.getElementById('nextDate');
  const playPauseBtn = document.getElementById('playPause');
  const currentDateDisplay = document.querySelector('.current-date');
  
  let isPlaying = false;
  let playInterval;
  
  // 更新当前显示的日期
  function updateDateDisplay(date) {
    if (currentDateDisplay) {
      const formattedDate = formatDate(date);
      currentDateDisplay.textContent = formattedDate;
    }
  }
  
  // 格式化日期
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  
  // 获取当前显示的日期
  function getCurrentDate() {
    const dateString = currentDateDisplay.textContent;
    return new Date(dateString);
  }
  
  // 向前一天
  if (prevDateBtn) {
    prevDateBtn.addEventListener('click', function() {
      const currentDate = getCurrentDate();
      currentDate.setDate(currentDate.getDate() - 1);
      updateDateDisplay(currentDate);
    });
  }
  
  // 向后一天
  if (nextDateBtn) {
    nextDateBtn.addEventListener('click', function() {
      const currentDate = getCurrentDate();
      currentDate.setDate(currentDate.getDate() + 1);
      updateDateDisplay(currentDate);
    });
  }
  
  // 播放/暂停
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
      const icon = this.querySelector('i');
      
      if (!isPlaying) {
        // 开始播放
        isPlaying = true;
        icon.classList.replace('fa-play', 'fa-pause');
        
        // 每3秒前进一天
        playInterval = setInterval(() => {
          const currentDate = getCurrentDate();
          currentDate.setDate(currentDate.getDate() + 1);
          updateDateDisplay(currentDate);
        }, 3000);
      } else {
        // 暂停播放
        isPlaying = false;
        icon.classList.replace('fa-pause', 'fa-play');
        clearInterval(playInterval);
      }
    });
  }
}

/**
 * 初始化统计图表
 */
function initCharts() {
  // 初始化标签页切换功能
  const tabItems = document.querySelectorAll('.chart-tabs .tab-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabItems.forEach(item => {
    item.addEventListener('click', function() {
      const tabId = this.getAttribute('data-tab');
      
      // 切换标签页
      tabItems.forEach(tab => tab.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      this.classList.add('active');
      document.getElementById(tabId).classList.add('active');
      
      // 重新初始化当前图表
      switch (tabId) {
        case 'temp-trend':
          initTempTrendChart();
          break;
        case 'rainfall-trend':
          initRainfallTrendChart();
          break;
        case 'area-compare':
          initAreaCompareChart();
          break;
        case 'year-compare':
          initYearCompareChart();
          break;
      }
    });
  });
  
  // 初始化默认显示的图表
  initTempTrendChart();
}

/**
 * 初始化温度趋势图表
 */
function initTempTrendChart() {
  const chartDom = document.getElementById('tempTrendChart');
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
      data: ['平均温度', '最高温度', '最低温度', '历史同期'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['7/1', '7/2', '7/3', '7/4', '7/5', '7/6', '7/7', '7/8', '7/9', '7/10', '7/11', '7/12', '7/13', '7/14', '7/15']
    },
    yAxis: {
      type: 'value',
      name: '温度(°C)',
      min: 15,
      max: 35
    },
    series: [
      {
        name: '平均温度',
        type: 'line',
        data: [24.5, 25.2, 26.1, 25.8, 26.5, 27.2, 28.1, 28.5, 27.9, 26.8, 25.9, 26.2, 26.5, 27.1, 26.5],
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '最高温度',
        type: 'line',
        data: [29.2, 30.1, 31.5, 30.8, 31.2, 32.5, 33.2, 33.6, 32.8, 31.5, 30.2, 31.1, 32.2, 32.8, 32.8],
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          color: '#F5222D'
        }
      },
      {
        name: '最低温度',
        type: 'line',
        data: [20.2, 20.8, 21.5, 21.2, 22.1, 22.5, 23.2, 23.8, 23.5, 22.8, 22.2, 21.5, 21.2, 21.8, 21.2],
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          width: 2
        },
        itemStyle: {
          color: '#13C2C2'
        }
      },
      {
        name: '历史同期',
        type: 'line',
        data: [23.5, 24.1, 24.8, 25.2, 25.5, 25.8, 26.2, 26.5, 26.8, 26.2, 25.5, 25.2, 24.8, 25.2, 25.3],
        symbol: 'none',
        lineStyle: {
          type: 'dashed',
          width: 2
        },
        itemStyle: {
          color: '#8C8C8C'
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
 * 初始化降水趋势图表
 */
function initRainfallTrendChart() {
  const chartDom = document.getElementById('rainfallTrendChart');
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
      data: ['日降水量', '累计降水量', '历史同期累计'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['7/1', '7/2', '7/3', '7/4', '7/5', '7/6', '7/7', '7/8', '7/9', '7/10', '7/11', '7/12', '7/13', '7/14', '7/15']
    },
    yAxis: [
      {
        type: 'value',
        name: '日降水量(mm)',
        min: 0,
        max: 50,
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
        name: '累计降水量(mm)',
        min: 0,
        max: 200,
        position: 'right',
        axisLine: {
          lineStyle: {
            color: '#722ED1'
          }
        },
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '日降水量',
        type: 'bar',
        data: [12.5, 0, 0, 8.2, 18.6, 0, 0, 5.2, 32.5, 15.8, 2.3, 0, 35.2, 9.8, 5.5],
        barWidth: '50%',
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '累计降水量',
        type: 'line',
        yAxisIndex: 1,
        data: [12.5, 12.5, 12.5, 20.7, 39.3, 39.3, 39.3, 44.5, 77.0, 92.8, 95.1, 95.1, 130.3, 140.1, 145.6],
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#722ED1'
        }
      },
      {
        name: '历史同期累计',
        type: 'line',
        yAxisIndex: 1,
        data: [8.2, 15.5, 22.1, 28.3, 35.6, 42.8, 50.2, 58.5, 65.8, 73.2, 80.5, 88.2, 95.8, 103.2, 110.5],
        symbol: 'none',
        lineStyle: {
          type: 'dashed',
          width: 2
        },
        itemStyle: {
          color: '#8C8C8C'
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
 * 初始化区域对比图表
 */
function initAreaCompareChart() {
  const chartDom = document.getElementById('areaCompareChart');
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
      data: ['平均温度', '累计降水', '日照时数'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['北部区域', '南部区域', '东部区域', '西部区域', '中心区域']
    },
    yAxis: [
      {
        type: 'value',
        name: '温度/日照',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '降水量(mm)',
        axisLabel: {
          formatter: '{value}'
        }
      }
    ],
    series: [
      {
        name: '平均温度',
        type: 'bar',
        data: [25.8, 27.2, 28.5, 24.6, 26.5],
        itemStyle: {
          color: '#F5222D'
        }
      },
      {
        name: '累计降水',
        type: 'bar',
        yAxisIndex: 1,
        data: [132.5, 156.8, 128.2, 165.2, 145.6],
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '日照时数',
        type: 'bar',
        data: [182.5, 175.8, 195.2, 165.8, 186.4],
        itemStyle: {
          color: '#FAAD14'
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
 * 初始化年际对比图表
 */
function initYearCompareChart() {
  const chartDom = document.getElementById('yearCompareChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['2023年', '2022年', '2021年', '2020年', '近5年平均'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '8%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['7/1', '7/5', '7/10', '7/15', '7/20', '7/25', '7/30']
    },
    yAxis: {
      type: 'value',
      name: '温度(°C)',
      min: 20,
      max: 35
    },
    series: [
      {
        name: '2023年',
        type: 'line',
        data: [24.5, 26.5, 26.8, 26.5, null, null, null],
        lineStyle: {
          width: 3
        },
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '2022年',
        type: 'line',
        data: [25.2, 27.2, 28.5, 27.8, 28.2, 29.5, 28.8],
        lineStyle: {
          width: 2
        },
        itemStyle: {
          color: '#13C2C2'
        }
      },
      {
        name: '2021年',
        type: 'line',
        data: [23.8, 25.6, 26.8, 27.2, 28.5, 28.2, 27.5],
        lineStyle: {
          width: 2
        },
        itemStyle: {
          color: '#722ED1'
        }
      },
      {
        name: '2020年',
        type: 'line',
        data: [24.2, 26.2, 27.5, 28.1, 28.8, 27.6, 26.8],
        lineStyle: {
          width: 2
        },
        itemStyle: {
          color: '#FA8C16'
        }
      },
      {
        name: '近5年平均',
        type: 'line',
        data: [24.5, 26.3, 27.2, 27.5, 28.2, 28.5, 27.6],
        lineStyle: {
          type: 'dashed',
          width: 2
        },
        itemStyle: {
          color: '#8C8C8C'
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
 * 初始化站点数据交互
 */
function initStationInteraction() {
  // 站点搜索
  const stationSearchInput = document.querySelector('.station-filter .form-input');
  const stationItems = document.querySelectorAll('.station-item');
  
  if (stationSearchInput) {
    stationSearchInput.addEventListener('input', function() {
      const searchText = this.value.toLowerCase();
      
      stationItems.forEach(item => {
        const stationName = item.querySelector('.station-name').textContent.toLowerCase();
        const stationId = item.querySelector('.station-id').textContent.toLowerCase();
        
        if (stationName.includes(searchText) || stationId.includes(searchText)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
  
  // 站点选择
  stationItems.forEach(item => {
    item.addEventListener('click', function() {
      stationItems.forEach(si => si.classList.remove('active'));
      this.classList.add('active');
      
      const stationName = this.querySelector('.station-name').textContent;
      console.log(`选择站点: ${stationName}`);
      
      // 在实际项目中，这里会在地图上突出显示选中的站点
    });
  });
}

/**
 * 初始化报告操作
 */
function initReportActions() {
  // 下载报告按钮
  const downloadReportBtn = document.querySelector('.report-btn:first-child');
  if (downloadReportBtn) {
    downloadReportBtn.addEventListener('click', function() {
      console.log('下载气象报告');
      showToast('气象报告开始下载');
    });
  }
  
  // 导出PDF按钮
  const exportPdfBtn = document.querySelector('.report-btn:last-child');
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener('click', function() {
      console.log('导出PDF报告');
      showToast('正在生成PDF报告...');
      
      // 模拟导出延迟
      setTimeout(() => {
        showToast('PDF报告已生成，开始下载');
      }, 1500);
    });
  }
  
  // 查看完整报告链接
  const viewReportLink = document.querySelector('.report-view-more .link');
  if (viewReportLink) {
    viewReportLink.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('查看完整报告');
      showToast('正在加载完整报告...');
    });
  }
}

/**
 * 显示提示信息
 * @param {string} message - 提示信息内容
 */
function showToast(message) {
  // 创建提示元素
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  // 添加到页面
  document.body.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);
  
  // 自动消失
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

/**
 * 初始化地图
 * @param {string} level - 地图级别：county（区县） 或 town（乡镇）
 * @param {string} regionId - 选中的区域ID
 * @param {string} parentId - 父级区域ID（乡镇级别时使用）
 */
function initMap(level, regionId = 'all', parentId = null) {
  // 清空地图容器
  const mapContainer = document.getElementById('weatherMap');
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
  // 根据当前选择的气象指标设置数据
  const selectedIndex = document.querySelector('.weather-index-item input[type="radio"]:checked').id;
  let seriesName, visualMapConfig;
  
  switch(selectedIndex) {
    case 'index-temperature':
      seriesName = '温度';
      visualMapConfig = {
        min: 15,
        max: 35,
        text: ['高温', '低温'],
        inRange: {
          color: ['#d1e5f0', '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']
        }
      };
      break;
    case 'index-rainfall':
      seriesName = '降水量';
      visualMapConfig = {
        min: 0,
        max: 100,
        text: ['多', '少'],
        inRange: {
          color: ['#eff3ff', '#c6dbef', '#9ecae1', '#6baed6', '#3182bd', '#08519c']
        }
      };
      break;
    case 'index-humidity':
      seriesName = '湿度';
      visualMapConfig = {
        min: 30,
        max: 90,
        text: ['高', '低'],
        inRange: {
          color: ['#eff3ff', '#bdd7e7', '#6baed6', '#3182bd', '#08519c']
        }
      };
      break;
    case 'index-sunlight':
      seriesName = '日照';
      visualMapConfig = {
        min: 2,
        max: 10,
        text: ['多', '少'],
        inRange: {
          color: ['#ffffcc', '#ffeda0', '#fed976', '#feb24c', '#fd8d3c', '#fc4e2a', '#e31a1c', '#bd0026', '#800026']
        }
      };
      break;
    case 'index-wind':
      seriesName = '风速';
      visualMapConfig = {
        min: 0,
        max: 12,
        text: ['高', '低'],
        inRange: {
          color: ['#f7fcf0', '#e0f3db', '#ccebc5', '#a8ddb5', '#7bccc4', '#4eb3d3', '#2b8cbe', '#0868ac']
        }
      };
      break;
    case 'index-accumulated-temperature':
      seriesName = '积温';
      visualMapConfig = {
        min: 500,
        max: 2500,
        text: ['高', '低'],
        inRange: {
          color: ['#fff7ec', '#fee8c8', '#fdd49e', '#fdbb84', '#fc8d59', '#ef6548', '#d7301f', '#b30000', '#7f0000']
        }
      };
      break;
    default:
      seriesName = '温度';
      visualMapConfig = {
        min: 15,
        max: 35,
        text: ['高温', '低温'],
        inRange: {
          color: ['#d1e5f0', '#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b']
        }
      };
  }
  
  // 随机生成气象数据
  let seriesData = data.map(item => {
    return {
      name: item.name,
      value: Math.round(visualMapConfig.min + Math.random() * (visualMapConfig.max - visualMapConfig.min))
    };
  });
  
  const option = {
    backgroundColor: '#f5f5f5',
    title: {
      text: `${map}气象分布`,
      subtext: `${seriesName}分布情况`,
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
        return `${params.name}<br/>${seriesName}: ${params.value}${getUnitByIndex(selectedIndex)}`;
      }
    },
    visualMap: {
      min: visualMapConfig.min,
      max: visualMapConfig.max,
      text: visualMapConfig.text,
      realtime: false,
      calculable: true,
      inRange: visualMapConfig.inRange
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
        name: seriesName,
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
 * 根据指标ID获取单位
 */
function getUnitByIndex(indexId) {
  switch(indexId) {
    case 'index-temperature':
      return '°C';
    case 'index-rainfall':
      return 'mm';
    case 'index-humidity':
      return '%';
    case 'index-sunlight':
      return '小时';
    case 'index-wind':
      return 'm/s';
    case 'index-accumulated-temperature':
      return '°C·d';
    default:
      return '';
  }
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
  
  // 添加气象站点（模拟数据）
  addWeatherStations(map, townId);
  
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
  
  // 添加地块到图层
  cropPolygons.forEach(poly => {
    const polygon = L.polygon(poly.coordinates, cropStyles[poly.cropType]).addTo(layerGroups[poly.cropType]);
    
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
        <h4>${getCropName(poly.cropType)}地块 #${poly.id}</h4>
        <table>
          <tr><td>面积:</td><td>${poly.area}亩</td></tr>
          <tr><td>品种:</td><td>${poly.variety}</td></tr>
          <tr><td>播种日期:</td><td>${poly.plantDate}</td></tr>
          <tr><td>权属人:</td><td>${poly.owner}</td></tr>
          <tr><td>长势评级:</td><td><span style="color:${statusColor}">${poly.growthStatus}</span></td></tr>
          <tr><td>当前温度:</td><td>${poly.currentTemp}℃</td></tr>
          <tr><td>当前湿度:</td><td>${poly.currentHumidity}%</td></tr>
        </table>
        <div class="popup-actions">
          <button class="btn btn-sm btn-primary">查看详情</button>
          <button class="btn btn-sm btn-secondary">导出数据</button>
        </div>
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
}

/**
 * 添加气象站点
 * @param {Object} map - Leaflet地图实例
 * @param {string} townId - 乡镇ID
 */
function addWeatherStations(map, townId) {
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
  
  // 创建气象站点图标
  const stationIcon = L.divIcon({
    html: '<i class="fas fa-cloud-sun" style="color: #1890FF; font-size: 18px;"></i>',
    className: 'weather-station-icon',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
  
  // 生成3-5个气象站点
  const stationCount = 3 + Math.floor(Math.random() * 3);
  const stations = [];
  
  for (let i = 0; i < stationCount; i++) {
    // 随机偏移中心点
    const lat = center[0] + (Math.random() - 0.5) * 0.04;
    const lng = center[1] + (Math.random() - 0.5) * 0.04;
    
    // 生成随机气象数据
    const temp = (20 + Math.random() * 15).toFixed(1);
    const humidity = Math.round(40 + Math.random() * 50);
    const windSpeed = (1 + Math.random() * 6).toFixed(1);
    const rainfall = (Math.random() * 10).toFixed(1);
    const pressure = Math.round(1000 + Math.random() * 20);
    const stationId = `S${1001 + i}`;
    
    // 创建站点标记
    const marker = L.marker([lat, lng], { icon: stationIcon }).addTo(map);
    
    // 添加弹出信息
    marker.bindPopup(`
      <div class="field-popup">
        <h4>气象站 #${stationId}</h4>
        <table>
          <tr><td>温度:</td><td>${temp}℃</td></tr>
          <tr><td>湿度:</td><td>${humidity}%</td></tr>
          <tr><td>风速:</td><td>${windSpeed}m/s</td></tr>
          <tr><td>降水量:</td><td>${rainfall}mm</td></tr>
          <tr><td>气压:</td><td>${pressure}hPa</td></tr>
          <tr><td>更新时间:</td><td>${getCurrentTime()}</td></tr>
        </table>
        <div class="popup-actions">
          <button class="btn btn-sm btn-primary" onclick="showHistoryData('${stationId}'); return false;">历史数据</button>
          <button class="btn btn-sm btn-secondary" onclick="exportStationData('${stationId}'); return false;">导出</button>
        </div>
      </div>
    `);
    
    // 添加悬停效果
    marker.on('mouseover', function() {
      this._icon.style.transform = this._icon.style.transform + ' scale(1.2)';
    });
    
    marker.on('mouseout', function() {
      this._icon.style.transform = this._icon.style.transform.replace(' scale(1.2)', '');
    });
    
    // 添加点击事件，更新右侧详情面板
    marker.on('click', function() {
      // 如果有右侧详情面板，可以更新详情
      if (document.querySelector('.data-panel')) {
        const stationInfoPanel = document.querySelector('.station-info');
        if (stationInfoPanel) {
          stationInfoPanel.innerHTML = `
            <div class="panel-header">
              <h3>气象站 #${stationId} 详情</h3>
            </div>
            <div class="panel-body">
              <div class="info-item">
                <span class="info-label">站点ID:</span>
                <span class="info-value">${stationId}</span>
              </div>
              <div class="info-item">
                <span class="info-label">位置:</span>
                <span class="info-value">经度: ${lng.toFixed(4)}, 纬度: ${lat.toFixed(4)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">温度:</span>
                <span class="info-value">${temp}℃</span>
              </div>
              <div class="info-item">
                <span class="info-label">湿度:</span>
                <span class="info-value">${humidity}%</span>
              </div>
              <div class="info-item">
                <span class="info-label">风速:</span>
                <span class="info-value">${windSpeed}m/s</span>
              </div>
              <div class="info-item">
                <span class="info-label">降水量:</span>
                <span class="info-value">${rainfall}mm</span>
              </div>
              <div class="info-item">
                <span class="info-label">气压:</span>
                <span class="info-value">${pressure}hPa</span>
              </div>
              <div class="info-item">
                <span class="info-label">更新时间:</span>
                <span class="info-value">${getCurrentTime()}</span>
              </div>
            </div>
            <div class="panel-footer">
              <button class="btn btn-primary" onclick="showHistoryData('${stationId}')">查看历史数据</button>
              <button class="btn btn-secondary" onclick="exportStationData('${stationId}')">导出数据</button>
            </div>
          `;
        }
      }
    });
    
    stations.push({
      id: stationId,
      lat,
      lng,
      temp,
      humidity,
      windSpeed,
      rainfall,
      pressure
    });
  }
  
  return stations;
}

/**
 * 获取当前时间字符串
 * @returns {string} 格式化的时间字符串
 */
function getCurrentTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
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
    // 每种作物生成3-6个地块
    const count = 3 + Math.floor(Math.random() * 4);
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
      
      // 生成当前气象数据
      const currentTemp = (20 + Math.random() * 15).toFixed(1);
      const currentHumidity = Math.round(40 + Math.random() * 50);
      
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
        contact,
        currentTemp,
        currentHumidity
      });
    }
  });
  
  return polygons;
}

/**
 * 显示站点历史数据
 * @param {string} stationId - 站点ID
 */
function showHistoryData(stationId) {
  // 在实际项目中，这里会请求服务器获取历史数据
  // 这里简单模拟显示一个弹窗
  console.log(`正在加载 ${stationId} 的历史数据，此功能在开发中...`);
  // 使用setTimeout代替alert，避免阻塞UI
  setTimeout(() => {
    alert(`正在加载 ${stationId} 的历史数据，此功能在开发中...`);
  }, 100);
  return false; // 确保不返回true，避免异步响应问题
}

/**
 * 导出站点数据
 * @param {string} stationId - 站点ID
 */
function exportStationData(stationId) {
  // 在实际项目中，这里会生成并下载数据文件
  // 这里简单模拟显示一个弹窗
  console.log(`正在导出 ${stationId} 的数据，此功能在开发中...`);
  // 使用setTimeout代替alert，避免阻塞UI
  setTimeout(() => {
    alert(`正在导出 ${stationId} 的数据，此功能在开发中...`);
  }, 100);
  return false; // 确保不返回true，避免异步响应问题
}

/**
 * 初始化侧边栏折叠功能
 */
function initSideMenuToggle() {
  const toggleBtn = document.querySelector('.side-menu-toggle');
  const sideMenu = document.querySelector('.side-menu');
  
  if (toggleBtn && sideMenu) {
    toggleBtn.addEventListener('click', function() {
      sideMenu.classList.toggle('collapsed');
      
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
 * 初始化数据面板折叠功能
 */
function initDataPanelToggle() {
  const toggleBtn = document.querySelector('.data-panel-toggle');
  const dataPanel = document.querySelector('.data-panel');
  
  if (toggleBtn && dataPanel) {
    toggleBtn.addEventListener('click', function() {
      dataPanel.classList.toggle('collapsed');
      
      // 切换图标方向
      const icon = this.querySelector('i');
      if (icon) {
        if (dataPanel.classList.contains('collapsed')) {
          icon.classList.replace('fa-chevron-right', 'fa-chevron-left');
        } else {
          icon.classList.replace('fa-chevron-left', 'fa-chevron-right');
        }
      }
      
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