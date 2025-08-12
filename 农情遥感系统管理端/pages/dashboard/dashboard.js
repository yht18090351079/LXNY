/**
 * 农情遥感系统管理端 - Dashboard页面功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化图表
  initCharts();
  
  // 初始化实时数据更新
  initRealTimeData();
  
  // 初始化交互功能
  initInteractions();
  
  // 监听侧边栏状态变化，重新调整图表大小
  document.addEventListener('sidebarToggle', function(e) {
    setTimeout(function() {
      resizeAllCharts();
    }, 350);
  });
});

// 侧边栏功能已在common.js中实现，这里不再重复定义

/**
 * 初始化图表
 */
function initCharts() {
  try {
    // 检查必要的DOM元素是否存在
    const trendElement = document.getElementById('trendChart');
    const deviceElement = document.getElementById('deviceStatusChart');
    
    if (!trendElement) {
      console.warn('数据趋势图表容器未找到');
      return;
    }
    
    if (!deviceElement) {
      console.warn('设备状态图表容器未找到');
      return;
    }
    
    // 初始化数据趋势图表
    initTrendChart();
    
    // 初始化设备状态分布图表
    initDeviceStatusChart();
    
    console.log('所有图表初始化完成');
  } catch (e) {
    console.error('图表初始化失败:', e);
  }
}

/**
 * 初始化数据趋势图表
 */
function initTrendChart() {
  try {
    const chartElement = document.getElementById('trendChart');
    if (!chartElement) {
      console.warn('趋势图表DOM元素未找到');
      return;
    }
    
    const trendChart = echarts.init(chartElement);
  
  // 图表配置
  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#FFFFFF'
      }
    },
    legend: {
      data: ['遥感数据', '设备数据', '用户访问'],
      bottom: 10,
      textStyle: {
        color: '#666666'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['12-09', '12-10', '12-11', '12-12', '12-13', '12-14', '12-15'],
      axisLabel: {
        color: '#666666'
      },
      axisLine: {
        lineStyle: {
          color: '#E8E8E8'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#666666'
      },
      axisLine: {
        lineStyle: {
          color: '#E8E8E8'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#F0F0F0'
        }
      }
    },
    series: [
      {
        name: '遥感数据',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#1890FF',
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
              { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
            ]
          }
        },
        data: [120, 132, 101, 134, 90, 230, 210]
      },
      {
        name: '设备数据',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#52C41A',
          width: 3
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
        data: [220, 182, 191, 234, 290, 330, 310]
      },
      {
        name: '用户访问',
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#FAAD14',
          width: 3
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(250, 173, 20, 0.3)' },
              { offset: 1, color: 'rgba(250, 173, 20, 0.05)' }
            ]
          }
        },
        data: [150, 232, 201, 154, 190, 330, 410]
      }
    ]
  };
  
  trendChart.setOption(option);
  
  // 响应式处理
  window.addEventListener('resize', function() {
    trendChart.resize();
  });
  
  // 存储图表实例
  window.trendChart = trendChart;
  
  // 时间范围选择器事件
  const timeRangeSelect = document.querySelector('.time-range-select');
  if (timeRangeSelect) {
    timeRangeSelect.addEventListener('change', function() {
      updateTrendChartData(this.value);
    });
  }
  
  console.log('趋势图表初始化成功');
  } catch (e) {
    console.error('趋势图表初始化失败:', e);
  }
}

/**
 * 初始化设备状态分布图表
 */
function initDeviceStatusChart() {
  try {
    const chartElement = document.getElementById('deviceStatusChart');
    if (!chartElement) {
      console.warn('设备状态图表DOM元素未找到');
      return;
    }
    
    const deviceChart = echarts.init(chartElement);
  
  // 图表配置
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'transparent',
      textStyle: {
        color: '#FFFFFF'
      }
    },
    legend: {
      orient: 'vertical',
      left: 'right',
      top: 'center',
      textStyle: {
        color: '#666666',
        fontSize: 12
      },
      itemWidth: 12,
      itemHeight: 12
    },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
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
            fontSize: '18',
            fontWeight: 'bold',
            color: '#333'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { 
            value: 285, 
            name: '在线设备',
            itemStyle: { color: '#52C41A' }
          },
          { 
            value: 42, 
            name: '离线设备',
            itemStyle: { color: '#F5222D' }
          },
          { 
            value: 15, 
            name: '故障设备',
            itemStyle: { color: '#FAAD14' }
          }
        ]
      }
    ]
  };
  
  deviceChart.setOption(option);
  
  // 响应式处理
  window.addEventListener('resize', function() {
    deviceChart.resize();
  });
  
  // 存储图表实例
  window.deviceChart = deviceChart;
  
  console.log('设备状态图表初始化成功');
  } catch (e) {
    console.error('设备状态图表初始化失败:', e);
  }
}

/**
 * 更新趋势图表数据
 */
function updateTrendChartData(timeRange) {
  if (!window.trendChart) return;
  
  let data;
  let xAxisData;
  
  switch(timeRange) {
    case '7':
      xAxisData = ['12-09', '12-10', '12-11', '12-12', '12-13', '12-14', '12-15'];
      data = {
        遥感数据: [120, 132, 101, 134, 90, 230, 210],
        设备数据: [220, 182, 191, 234, 290, 330, 310],
        用户访问: [150, 232, 201, 154, 190, 330, 410]
      };
      break;
    case '30':
      // 模拟30天数据
      xAxisData = Array.from({length: 30}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        return (date.getMonth() + 1) + '-' + date.getDate().toString().padStart(2, '0');
      });
      data = {
        遥感数据: Array.from({length: 30}, () => Math.floor(Math.random() * 300) + 100),
        设备数据: Array.from({length: 30}, () => Math.floor(Math.random() * 400) + 200),
        用户访问: Array.from({length: 30}, () => Math.floor(Math.random() * 500) + 150)
      };
      break;
    case '90':
      // 模拟90天数据
      xAxisData = Array.from({length: 15}, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - 90 + i * 6);
        return (date.getMonth() + 1) + '-' + date.getDate().toString().padStart(2, '0');
      });
      data = {
        遥感数据: Array.from({length: 15}, () => Math.floor(Math.random() * 350) + 150),
        设备数据: Array.from({length: 15}, () => Math.floor(Math.random() * 450) + 250),
        用户访问: Array.from({length: 15}, () => Math.floor(Math.random() * 550) + 200)
      };
      break;
    default:
      return;
  }
  
  // 更新图表
  window.trendChart.setOption({
    xAxis: {
      data: xAxisData
    },
    series: [
      { data: data.遥感数据 },
      { data: data.设备数据 },
      { data: data.用户访问 }
    ]
  });
}

/**
 * 初始化实时数据更新
 */
function initRealTimeData() {
  // 每30秒更新一次实时数据
  setInterval(function() {
    updateSystemMonitors();
    updateLastUpdateTime();
    updateNotifications();
  }, 30000);
  
  // 每5分钟更新一次统计数据
  setInterval(function() {
    updateStatCards();
  }, 300000);
}

/**
 * 更新系统监控数据
 */
function updateSystemMonitors() {
  const monitors = [
    { selector: '.monitor-item:nth-child(1) .progress-fill', max: 100 },
    { selector: '.monitor-item:nth-child(2) .progress-fill', max: 100 },
    { selector: '.monitor-item:nth-child(3) .progress-fill', max: 100 },
    { selector: '.monitor-item:nth-child(4) .progress-fill', max: 100 }
  ];
  
  monitors.forEach(monitor => {
    const element = document.querySelector(monitor.selector);
    const textElement = element?.parentElement.querySelector('.monitor-text');
    
    if (element && textElement) {
      // 生成随机数据（模拟实时更新）
      const value = Math.floor(Math.random() * monitor.max);
      const percentage = Math.min(value, monitor.max);
      
      // 更新进度条
      element.style.width = percentage + '%';
      textElement.textContent = percentage + '%';
      
      // 更新颜色
      if (percentage < 50) {
        element.setAttribute('data-color', 'green');
      } else if (percentage < 80) {
        element.setAttribute('data-color', 'orange');
      } else {
        element.setAttribute('data-color', 'red');
      }
    }
  });
}

/**
 * 更新统计卡片数据
 */
function updateStatCards() {
  const statCards = document.querySelectorAll('.stat-card');
  
  statCards.forEach((card, index) => {
    const valueElement = card.querySelector('.stat-value');
    const trendElement = card.querySelector('.stat-trend span');
    
    if (valueElement && trendElement) {
      // 模拟数据变化
      const currentValue = parseInt(valueElement.textContent.replace(/,/g, ''));
      const changePercent = (Math.random() - 0.5) * 20; // -10% 到 +10%
      const newValue = Math.floor(currentValue * (1 + changePercent / 100));
      
      // 更新数值
      valueElement.textContent = newValue.toLocaleString();
      
      // 更新趋势
      const trendValue = Math.abs(changePercent).toFixed(1) + '%';
      trendElement.textContent = trendValue;
      
      // 更新趋势方向
      const trendContainer = card.querySelector('.stat-trend');
      const icon = trendContainer.querySelector('i');
      
      if (changePercent > 0) {
        trendContainer.className = 'stat-trend up';
        icon.className = 'fas fa-arrow-up';
      } else {
        trendContainer.className = 'stat-trend down';
        icon.className = 'fas fa-arrow-down';
      }
    }
  });
}

/**
 * 更新最后更新时间
 */
function updateLastUpdateTime() {
  const timeElement = document.getElementById('lastUpdateTime');
  if (timeElement) {
    const now = new Date();
    const timeString = now.getFullYear() + '-' + 
                     (now.getMonth() + 1).toString().padStart(2, '0') + '-' + 
                     now.getDate().toString().padStart(2, '0') + ' ' +
                     now.getHours().toString().padStart(2, '0') + ':' + 
                     now.getMinutes().toString().padStart(2, '0') + ':' + 
                     now.getSeconds().toString().padStart(2, '0');
    timeElement.textContent = timeString;
  }
}

/**
 * 更新通知数据
 */
function updateNotifications() {
  // 这里可以通过API获取最新的通知数据
  // 目前使用模拟数据
  const notificationCount = Math.floor(Math.random() * 10) + 1;
  
  // 更新通知徽章
  const badges = document.querySelectorAll('.badge');
  badges.forEach(badge => {
    badge.textContent = notificationCount;
  });
  
  // 更新通知计数
  const notificationCountElement = document.querySelector('.notification-count');
  if (notificationCountElement) {
    notificationCountElement.textContent = notificationCount;
  }
}

/**
 * 初始化交互功能
 */
function initInteractions() {
  // 刷新数据按钮
  const refreshBtn = document.querySelector('.page-actions .btn-secondary');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      showLoading();
      
      // 模拟数据刷新
      setTimeout(function() {
        updateStatCards();
        updateSystemMonitors();
        updateLastUpdateTime();
        hideLoading();
        showMessage('数据刷新完成', 'success');
      }, 1500);
    });
  }
  
  // 导出报告按钮
  const exportBtn = document.querySelector('.page-actions .btn-primary');
  if (exportBtn) {
    exportBtn.addEventListener('click', function() {
      showMessage('报告导出功能开发中...', 'info');
    });
  }
  
  // 快速操作项点击事件
  const quickActionItems = document.querySelectorAll('.quick-action-item');
  quickActionItems.forEach(item => {
    item.addEventListener('click', function(e) {
      e.preventDefault();
      const title = this.querySelector('.action-title').textContent;
      showMessage(`${title}功能开发中...`, 'info');
    });
  });
  
  // 通知项点击事件
  const notificationItems = document.querySelectorAll('.notification-item');
  notificationItems.forEach(item => {
    item.addEventListener('click', function() {
      const title = this.querySelector('.notification-title').textContent;
      showMessage(`查看详情：${title}`, 'info');
    });
  });
}

/**
 * 重新调整所有图表大小
 */
function resizeAllCharts() {
  try {
    // 调整数据趋势图表
    if (window.trendChart && typeof window.trendChart.resize === 'function') {
      window.trendChart.resize();
    }
    // 调整设备状态图表  
    if (window.deviceChart && typeof window.deviceChart.resize === 'function') {
      window.deviceChart.resize();
    }
  } catch (e) {
    console.warn('调整图表大小时出错:', e);
  }
}

/**
 * 显示加载状态
 */
function showLoading() {
  // 创建加载遮罩
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  loadingOverlay.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">正在刷新数据...</div>
  `;
  
  // 添加样式
  loadingOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color: white;
  `;
  
  document.body.appendChild(loadingOverlay);
}

/**
 * 隐藏加载状态
 */
function hideLoading() {
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.remove();
  }
}

/**
 * 显示消息提示
 */
function showMessage(text, type = 'info') {
  // 创建消息元素
  const message = document.createElement('div');
  message.className = `message-toast message-${type}`;
  message.textContent = text;
  
  // 添加样式
  message.style.cssText = `
    position: fixed;
    top: 80px;
    right: 24px;
    background-color: white;
    color: #333;
    padding: 12px 20px;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    transition: all 0.3s ease;
    border-left: 4px solid ${getMessageColor(type)};
  `;
  
  document.body.appendChild(message);
  
  // 3秒后自动移除
  setTimeout(function() {
    message.style.opacity = '0';
    message.style.transform = 'translateX(100%)';
    setTimeout(function() {
      if (message.parentNode) {
        message.parentNode.removeChild(message);
      }
    }, 300);
  }, 3000);
}

/**
 * 获取消息类型对应的颜色
 */
function getMessageColor(type) {
  switch(type) {
    case 'success':
      return '#52C41A';
    case 'warning':
      return '#FAAD14';
    case 'error':
      return '#F5222D';
    default:
      return '#1890FF';
  }
}

/**
 * 响应式处理
 */
window.addEventListener('resize', function() {
  resizeAllCharts();
});

/**
 * 页面卸载时清理
 */
window.addEventListener('beforeunload', function() {
  // 清理定时器和事件监听器
  if (window.trendChart) {
    window.trendChart.dispose();
  }
  if (window.deviceChart) {
    window.deviceChart.dispose();
  }
});