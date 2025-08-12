/**
 * 数据概览页面功能
 */

// 全局变量
let dataGrowthChart = null;
let dataTypeChart = null;
let refreshInterval = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化图表
  initCharts();
  
  // 初始化事件监听
  initEventListeners();
  
  // 启动数据刷新
  startDataRefresh();
  
  // 初始化动画效果
  initAnimations();
});

/**
 * 初始化图表
 */
function initCharts() {
  // 延迟初始化，确保容器尺寸已经正确计算
  setTimeout(() => {
    initDataGrowthChart();
    initDataTypeChart();
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
 * 初始化数据增长趋势图表
 */
function initDataGrowthChart() {
  const chartElement = document.getElementById('dataGrowthChart');
  if (!chartElement) return;
  
  try {
    // 确保之前的实例被正确销毁
    if (dataGrowthChart) {
      dataGrowthChart.dispose();
    }
    
    // 获取容器实际尺寸进行初始化
    const containerRect = chartElement.parentElement.getBoundingClientRect();
    dataGrowthChart = echarts.init(chartElement, null, {
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
        extraCssText: 'box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); border-radius: 6px;',
        formatter: function(params) {
          let result = params[0].name + '<br />';
          params.forEach(param => {
            result += `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${param.color};"></span>`;
            result += `${param.seriesName}: ${formatNumber(param.value)}<br />`;
          });
          return result;
        }
      },
      legend: {
        data: ['遥感数据', '农田数据', '环境数据'],
        top: 0,
        textStyle: {
          color: '#666666'
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
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        axisLabel: {
          color: '#666666',
          fontSize: 12,
          formatter: function(value) {
            return formatNumber(value);
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
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#1890FF'
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
          data: generateRandomData(30, 50, 200)
        },
        {
          name: '农田数据',
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
          data: generateRandomData(30, 30, 120)
        },
        {
          name: '环境数据',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: {
            color: '#FAAD14'
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
          data: generateRandomData(30, 20, 80)
        }
      ]
    };
    
    dataGrowthChart.setOption(option);
  } catch (error) {
    console.warn('初始化数据增长图表失败:', error);
  }
}

/**
 * 初始化数据类型分布图表
 */
function initDataTypeChart() {
  const chartElement = document.getElementById('dataTypeChart');
  if (!chartElement) return;
  
  try {
    // 确保之前的实例被正确销毁
    if (dataTypeChart) {
      dataTypeChart.dispose();
    }
    
    // 获取容器实际尺寸进行初始化
    const containerRect = chartElement.parentElement.getBoundingClientRect();
    dataTypeChart = echarts.init(chartElement, null, {
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
        formatter: '{b}: {c} ({d}%)'
      },
      series: [
        {
          type: 'pie',
          radius: ['45%', '75%'],
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
              value: 5812,
              name: '遥感数据',
              itemStyle: { color: '#1890FF' }
            },
            {
              value: 3689,
              name: '农田数据',
              itemStyle: { color: '#52C41A' }
            },
            {
              value: 2156,
              name: '环境数据',
              itemStyle: { color: '#FAAD14' }
            },
            {
              value: 1189,
              name: '其他数据',
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
    
    dataTypeChart.setOption(option);
  } catch (error) {
    console.warn('初始化数据类型图表失败:', error);
  }
}

/**
 * 调整所有图表大小
 */
function resizeAllCharts() {
  try {
    // 使用requestAnimationFrame确保DOM更新完成后再resize
    requestAnimationFrame(() => {
      if (dataGrowthChart && typeof dataGrowthChart.resize === 'function') {
        // 获取容器实际尺寸
        const container = document.getElementById('dataGrowthChart')?.parentElement;
        if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
          dataGrowthChart.resize({
            width: container.offsetWidth,
            height: container.offsetHeight
          });
        }
      }
      
      if (dataTypeChart && typeof dataTypeChart.resize === 'function') {
        const container = document.getElementById('dataTypeChart')?.parentElement;
        if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
          dataTypeChart.resize({
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
    if (dataGrowthChart) {
      dataGrowthChart.dispose();
      dataGrowthChart = null;
    }
    if (dataTypeChart) {
      dataTypeChart.dispose();
      dataTypeChart = null;
    }
    
    // 等待DOM更新后重新初始化
    setTimeout(() => {
      initDataGrowthChart();
      initDataTypeChart();
    }, 50);
  } catch (error) {
    console.warn('重新初始化图表时出错:', error);
  }
}

/**
 * 初始化事件监听
 */
function initEventListeners() {
  // 刷新数据按钮
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', refreshData);
  }
  
  // 导出报表按钮
  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportReport);
  }
  
  // 趋势期间选择
  const trendPeriod = document.getElementById('trendPeriod');
  if (trendPeriod) {
    trendPeriod.addEventListener('change', function() {
      updateTrendChart(this.value);
    });
  }
  
  // 存储管理按钮
  const manageStorageBtn = document.getElementById('manageStorageBtn');
  if (manageStorageBtn) {
    manageStorageBtn.addEventListener('click', openStorageModal);
  }
  
  // 模态框外部点击关闭
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      closeStorageModal();
    }
  });
}

/**
 * 刷新数据
 */
function refreshData() {
  const refreshBtn = document.getElementById('refreshBtn');
  if (!refreshBtn) return;
  
  // 显示加载状态
  const originalHTML = refreshBtn.innerHTML;
  refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 刷新中...';
  refreshBtn.disabled = true;
  
  // 模拟数据刷新
  setTimeout(() => {
    // 更新统计数据
    updateStatistics();
    
    // 更新图表数据
    updateCharts();
    
    // 恢复按钮状态
    refreshBtn.innerHTML = originalHTML;
    refreshBtn.disabled = false;
    
    // 显示成功消息
    Message.success('数据刷新完成');
    
    // 更新时间
    updateLastUpdateTime();
  }, 2000);
}

/**
 * 更新统计数据
 */
function updateStatistics() {
  // 模拟数据更新
  const stats = {
    total: Math.floor(Math.random() * 5000) + 10000,
    recent: Math.floor(Math.random() * 500) + 1000,
    processing: Math.floor(Math.random() * 100) + 50,
    storage: (Math.random() * 1 + 2).toFixed(1) + 'TB'
  };
  
  // 更新DOM
  const totalElement = document.getElementById('totalDataCount');
  const recentElement = document.getElementById('recentDataCount');
  const processingElement = document.getElementById('processingCount');
  const storageElement = document.getElementById('storageUsage');
  
  if (totalElement) animateNumber(totalElement, stats.total);
  if (recentElement) animateNumber(recentElement, stats.recent);
  if (processingElement) animateNumber(processingElement, stats.processing);
  if (storageElement) storageElement.textContent = stats.storage;
}

/**
 * 更新图表数据
 */
function updateCharts() {
  // 更新数据增长图表
  if (dataGrowthChart) {
    const newOption = {
      series: [
        {
          data: generateRandomData(30, 50, 200)
        },
        {
          data: generateRandomData(30, 30, 120)
        },
        {
          data: generateRandomData(30, 20, 80)
        }
      ]
    };
    dataGrowthChart.setOption(newOption);
  }
  
  // 更新数据类型图表
  if (dataTypeChart) {
    const newData = [
      { value: Math.floor(Math.random() * 2000) + 4000, name: '遥感数据' },
      { value: Math.floor(Math.random() * 1500) + 2500, name: '农田数据' },
      { value: Math.floor(Math.random() * 1000) + 1500, name: '环境数据' },
      { value: Math.floor(Math.random() * 800) + 800, name: '其他数据' }
    ];
    
    const newOption = {
      series: [{
        data: newData
      }]
    };
    dataTypeChart.setOption(newOption);
  }
}

/**
 * 更新趋势图表
 */
function updateTrendChart(period) {
  if (!dataGrowthChart) return;
  
  let days = parseInt(period);
  const newOption = {
    xAxis: {
      data: getLastNDays(days)
    },
    series: [
      {
        data: generateRandomData(days, 50, 200)
      },
      {
        data: generateRandomData(days, 30, 120)
      },
      {
        data: generateRandomData(days, 20, 80)
      }
    ]
  };
  
  dataGrowthChart.setOption(newOption);
}

/**
 * 导出报表
 */
function exportReport() {
  const exportBtn = document.getElementById('exportBtn');
  if (!exportBtn) return;
  
  // 显示加载状态
  const originalHTML = exportBtn.innerHTML;
  exportBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 导出中...';
  exportBtn.disabled = true;
  
  // 模拟导出过程
  setTimeout(() => {
    // 创建下载链接（这里只是模拟）
    const link = document.createElement('a');
    link.href = '#';
    link.download = `农情遥感系统数据概览报表_${new Date().toISOString().split('T')[0]}.xlsx`;
    
    // 恢复按钮状态
    exportBtn.innerHTML = originalHTML;
    exportBtn.disabled = false;
    
    // 显示成功消息
    Message.success('报表导出完成');
  }, 3000);
}

/**
 * 打开存储管理模态框
 */
function openStorageModal() {
  const modal = document.getElementById('storageModal');
  if (modal) {
    modal.classList.add('active');
  }
}

/**
 * 关闭存储管理模态框
 */
function closeStorageModal() {
  const modal = document.getElementById('storageModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

/**
 * 启动数据刷新
 */
function startDataRefresh() {
  // 每5分钟自动刷新一次数据
  refreshInterval = setInterval(() => {
    updateStatistics();
    updateCharts();
  }, 300000); // 5分钟
}

/**
 * 初始化动画效果
 */
function initAnimations() {
  // 使用Intersection Observer实现滚动动画
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // 观察所有卡片元素
  document.querySelectorAll('.stats-card, .chart-card, .detail-card').forEach(card => {
    observer.observe(card);
  });
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
 * 工具函数：获取最近N天的日期数组
 */
function getLastNDays(days) {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }));
  }
  return dates;
}

/**
 * 工具函数：获取最近30天的日期数组
 */
function getLast30Days() {
  return getLastNDays(30);
}

/**
 * 工具函数：生成随机数据
 */
function generateRandomData(count, min, max) {
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

/**
 * 清理页面资源
 */
function cleanupResources() {
  // 清理定时器
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
  
  // 销毁图表实例
  try {
    if (dataGrowthChart) {
      dataGrowthChart.dispose();
      dataGrowthChart = null;
    }
    if (dataTypeChart) {
      dataTypeChart.dispose();
      dataTypeChart = null;
    }
  } catch (error) {
    console.warn('清理图表实例时出错:', error);
  }
}

// 页面卸载时清理资源
window.addEventListener('beforeunload', cleanupResources);

// 页面隐藏时也进行清理（移动端兼容）
document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    // 页面隐藏时暂停定时器
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
  } else {
    // 页面显示时重启定时器
    if (!refreshInterval) {
      startDataRefresh();
    }
  }
});

// 添加CSS动画类
const style = document.createElement('style');
style.textContent = `
  .animate-in {
    animation: slideInUp 0.6s ease-out forwards;
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);