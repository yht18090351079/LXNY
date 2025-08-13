/**
 * 作物长势页面功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化侧边栏折叠功能
  initSideMenuToggle();
  
  // 初始化数据面板折叠功能
  initDataPanelToggle();
  
  // 初始化区域级联选择
  initAreaCascadeSelection();
  
  // 初始化地图交互
  initMapInteraction();
  
  // 初始化图表
  initCharts();
  
  // 初始化时间轴
  initTimeline();
  
  // 初始化图例切换
  initLegendToggle();
  
  // 初始化指标选择器
  initIndexSelector();
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
 * 初始化面板标签页功能
 */
function initTabs() {
  const tabItems = document.querySelectorAll('.panel-tabs .tab-item');
  const tabPanes = document.querySelectorAll('.tab-pane');
  
  tabItems.forEach(item => {
    item.addEventListener('click', function() {
      // 移除所有活动状态
      tabItems.forEach(tab => tab.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));
      
      // 添加当前活动状态
      this.classList.add('active');
      const tabId = this.getAttribute('data-tab');
      const targetPane = document.getElementById(`${tabId}-panel`);
      
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/**
 * 初始化时间轴功能
 */
function initTimeline() {
  const timelineSlider = document.querySelector('.timeline-slider');
  const currentDate = document.querySelector('.current-date');
  const prevBtn = document.querySelector('.timeline-btn:first-child');
  const nextBtn = document.querySelector('.timeline-btn:nth-child(3)');
  const playBtn = document.querySelector('.play-btn');
  
  // 定义日期范围
  const startDate = new Date('2023-03-01');
  const endDate = new Date('2023-07-31');
  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  
  let isPlaying = false;
  let playInterval;
  
  // 更新日期显示
  function updateDateDisplay(value) {
    const dayOffset = Math.floor(value / 100 * totalDays);
    const currentDate = new Date(startDate.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    return formatDate(currentDate);
  }
  
  // 格式化日期
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // 初始化日期显示
  if (timelineSlider && currentDate) {
    currentDate.textContent = updateDateDisplay(timelineSlider.value);
    
    // 时间滑块变化
    timelineSlider.addEventListener('input', function() {
      currentDate.textContent = updateDateDisplay(this.value);
      updateMapData(this.value);
    });
  }
  
  // 上一步按钮
  if (prevBtn && timelineSlider) {
    prevBtn.addEventListener('click', function() {
      let value = parseInt(timelineSlider.value);
      if (value > 0) {
        value -= 5;
        if (value < 0) value = 0;
        timelineSlider.value = value;
        currentDate.textContent = updateDateDisplay(value);
        updateMapData(value);
      }
    });
  }
  
  // 下一步按钮
  if (nextBtn && timelineSlider) {
    nextBtn.addEventListener('click', function() {
      let value = parseInt(timelineSlider.value);
      if (value < 100) {
        value += 5;
        if (value > 100) value = 100;
        timelineSlider.value = value;
        currentDate.textContent = updateDateDisplay(value);
        updateMapData(value);
      }
    });
  }
  
  // 播放/暂停按钮
  if (playBtn && timelineSlider) {
    playBtn.addEventListener('click', function() {
      const icon = this.querySelector('i');
      
      if (isPlaying) {
        // 暂停
        clearInterval(playInterval);
        icon.classList.replace('fa-pause', 'fa-play');
      } else {
        // 播放
        playInterval = setInterval(function() {
          let value = parseInt(timelineSlider.value);
          if (value < 100) {
            value += 1;
            timelineSlider.value = value;
            currentDate.textContent = updateDateDisplay(value);
            updateMapData(value);
          } else {
            clearInterval(playInterval);
            icon.classList.replace('fa-pause', 'fa-play');
            isPlaying = false;
          }
        }, 500);
        
        icon.classList.replace('fa-play', 'fa-pause');
      }
      
      isPlaying = !isPlaying;
    });
  }
}

/**
 * 更新地图数据（模拟）
 */
function updateMapData(timelineValue) {
  // 在实际项目中，这里会根据时间点从服务器获取对应的遥感数据
  console.log(`更新地图数据到时间点: ${timelineValue}%`);
  
  // 这里简单模拟NDVI随时间的变化
  if (timelineValue < 20) {
    updateNdviStats(0.42, "较差");
  } else if (timelineValue < 40) {
    updateNdviStats(0.58, "一般");
  } else if (timelineValue < 60) {
    updateNdviStats(0.78, "良好");
  } else if (timelineValue < 80) {
    updateNdviStats(0.85, "优良");
  } else {
    updateNdviStats(0.82, "良好");
  }
}

/**
 * 更新NDVI统计信息
 */
function updateNdviStats(ndviValue, status) {
  const ndviElement = document.querySelector('.stat-card:first-child .stat-value');
  const statusElement = document.querySelector('.stat-status');
  
  if (ndviElement) {
    ndviElement.textContent = ndviValue.toFixed(2);
  }
  
  if (statusElement) {
    statusElement.textContent = status;
    
    // 更新状态样式
    statusElement.classList.remove('good', 'average', 'poor');
    
    if (status === "优良") {
      statusElement.classList.add('good');
    } else if (status === "良好") {
      statusElement.classList.add('good');
    } else if (status === "一般") {
      statusElement.classList.add('average');
    } else {
      statusElement.classList.add('poor');
    }
  }
}

/**
 * 初始化图例折叠功能
 */
function initLegendToggle() {
  const toggleBtn = document.querySelector('.legend-toggle');
  const legendContent = document.querySelector('.legend-content');
  
  if (toggleBtn && legendContent) {
    toggleBtn.addEventListener('click', function() {
      // 切换图例内容显示/隐藏
      if (legendContent.style.display === 'none') {
        legendContent.style.display = 'block';
        toggleBtn.querySelector('i').classList.replace('fa-chevron-up', 'fa-chevron-down');
      } else {
        legendContent.style.display = 'none';
        toggleBtn.querySelector('i').classList.replace('fa-chevron-down', 'fa-chevron-up');
      }
    });
  }
}

/**
 * 初始化指标类型选择
 */
function initIndexSelector() {
  const indexRadios = document.querySelectorAll('.index-item input[type="radio"]');
  const legendTitle = document.querySelector('.legend-header span');
  
  indexRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        const indexId = this.id;
        console.log(`选择指标类型: ${indexId}`);
        
        // 更新图例标题
        if (legendTitle) {
          if (indexId === 'index-ndvi') {
            legendTitle.textContent = 'NDVI指数图例';
          } else if (indexId === 'index-lai') {
            legendTitle.textContent = 'LAI指数图例';
          } else if (indexId === 'index-evi') {
            legendTitle.textContent = 'EVI指数图例';
          } else if (indexId === 'index-msavi') {
            legendTitle.textContent = 'MSAVI指数图例';
          }
        }
        
        // 重新加载图表
        initCharts();
      }
    });
  });
}

/**
 * 初始化地图交互
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
    });
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
        mapContainer.insertBefore(echartsDiv, mapDiv);
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
  // 获取当前选择的指标类型
  const selectedIndex = document.querySelector('.index-item input[type="radio"]:checked').id;
  
  // 随机生成NDVI/LAI/EVI数据
  let seriesData = data.map(item => {
    let value;
    if (selectedIndex === 'index-ndvi') {
      // NDVI范围通常在-1到1之间，但农作物通常为0.2-0.8
      value = (Math.random() * 0.6 + 0.2).toFixed(2);
    } else if (selectedIndex === 'index-lai') {
      // LAI范围通常为0-10
      value = (Math.random() * 5 + 1).toFixed(1);
    } else if (selectedIndex === 'index-evi') {
      // EVI范围通常为-1到1
      value = (Math.random() * 0.7 + 0.1).toFixed(2);
    } else {
      // 默认范围
      value = (Math.random() * 0.6 + 0.2).toFixed(2);
    }
    
    return {
      name: item.name,
      value: parseFloat(value)
    };
  });
  
  // 设置颜色方案和值范围
  let colorRange, minValue, maxValue, formatter;
  if (selectedIndex === 'index-ndvi') {
    colorRange = ['#eff3db', '#c4e687', '#8fbc8f', '#4daf4a', '#006400'];
    minValue = 0.2;
    maxValue = 0.8;
    formatter = '{b}<br/>NDVI: {c}';
  } else if (selectedIndex === 'index-lai') {
    colorRange = ['#f7fcf5', '#c7e9c0', '#74c476', '#238b45', '#00441b'];
    minValue = 1;
    maxValue = 6;
    formatter = '{b}<br/>LAI: {c}';
  } else if (selectedIndex === 'index-evi') {
    colorRange = ['#f7fbff', '#c6dbef', '#6baed6', '#2171b5', '#08306b'];
    minValue = 0.1;
    maxValue = 0.8;
    formatter = '{b}<br/>EVI: {c}';
  } else {
    colorRange = ['#eff3db', '#c4e687', '#8fbc8f', '#4daf4a', '#006400'];
    minValue = 0.2;
    maxValue = 0.8;
    formatter = '{b}<br/>NDVI: {c}';
  }
  
  const option = {
    backgroundColor: '#f5f5f5',
    title: {
      text: `${map}作物长势监测`,
      subtext: '植被指数分布',
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
      formatter: formatter
    },
    visualMap: {
      min: minValue,
      max: maxValue,
      text: ['高', '低'],
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
  L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
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
  L.tileLayer('https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
    subdomains: ['1', '2', '3', '4'],
    attribution: '© 高德地图',
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
          <tr><td>长势评级:</td><td><span style="color:${statusColor}">${poly.growthStatus}</span></td></tr>
          <tr><td>NDVI值:</td><td>${poly.growthIndex}</td></tr>
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
 * 初始化图表
 */
function initCharts() {
  // 初始化NDVI等级分布图表
  initNdviDistributionChart();
  
  // 初始化区域对比图表
  initRegionComparisonChart();
  
  // 初始化历年对比图表
  initYearlyComparisonChart();
  
  // 初始化生长曲线图表
  initGrowthCurveChart();
}

/**
 * 初始化NDVI等级分布图表
 */
function initNdviDistributionChart() {
  const chartDom = document.getElementById('ndviDistributionChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} km² ({d}%)'
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      data: ['优良', '良好', '一般', '不良', '严重不良']
    },
    color: ['#91cf60', '#d9ef8b', '#fee08b', '#fc8d59', '#d73027'],
    series: [
      {
        name: 'NDVI等级面积',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 63.5, name: '优良' },
          { value: 42.8, name: '良好' },
          { value: 25.6, name: '一般' },
          { value: 15.2, name: '不良' },
          { value: 6.3, name: '严重不良' }
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
 * 初始化区域对比图表
 */
function initRegionComparisonChart() {
  const chartDom = document.getElementById('regionComparisonChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 使用临夏州的实际县市数据
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
      type: 'value',
      min: 0,
      max: 1,
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'category',
      data: ['临夏市', '临夏县', '康乐县', '永靖县', '广河县', '和政县', '东乡族自治县', '积石山县'],
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: 'NDVI',
        type: 'bar',
        data: [0.76, 0.81, 0.79, 0.73, 0.77, 0.80, 0.75, 0.72],
        itemStyle: {
          color: function(params) {
            const value = params.value;
            if (value >= 0.8) return '#91cf60';
            if (value >= 0.6) return '#d9ef8b';
            if (value >= 0.4) return '#fee08b';
            if (value >= 0.2) return '#fc8d59';
            return '#d73027';
          }
        },
        barWidth: '60%',
        label: {
          show: true,
          position: 'right',
          formatter: '{c}'
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
 * 初始化历年对比图表
 */
function initYearlyComparisonChart() {
  const chartDom = document.getElementById('yearlyComparisonChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['2023', '2022', '五年平均'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['3月', '4月', '5月', '6月', '7月']
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1
    },
    series: [
      {
        name: '2023',
        type: 'line',
        data: [0.42, 0.58, 0.78, 0.85, 0.82],
        symbolSize: 6,
        lineStyle: { width: 3 },
        itemStyle: { color: '#1890FF' }
      },
      {
        name: '2022',
        type: 'line',
        data: [0.38, 0.55, 0.73, 0.82, 0.80],
        symbolSize: 6,
        lineStyle: { width: 3 },
        itemStyle: { color: '#73D13D' }
      },
      {
        name: '五年平均',
        type: 'line',
        data: [0.40, 0.56, 0.75, 0.83, 0.81],
        symbolSize: 6,
        lineStyle: { 
          width: 3,
          type: 'dashed'
        },
        itemStyle: { color: '#FAAD14' }
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
 * 初始化生长曲线图表
 */
function initGrowthCurveChart() {
  const chartDom = document.getElementById('growthCurveChart');
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
      data: ['NDVI指数', '温度', '降水量'],
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
        data: ['3月初', '3月中', '3月末', '4月初', '4月中', '4月末', '5月初', '5月中', '5月末', '6月初', '6月中', '6月末', '7月初', '7月中', '7月末'],
        axisLabel: {
          interval: 2
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'NDVI',
        min: 0,
        max: 1,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#1890FF'
          }
        }
      },
      {
        type: 'value',
        name: '温度 (°C)',
        min: 0,
        max: 40,
        position: 'right',
        offset: 0,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#FAAD14'
          }
        }
      },
      {
        type: 'value',
        name: '降水量 (mm)',
        min: 0,
        max: 80,
        position: 'right',
        offset: 60,
        axisLine: {
          show: true,
          lineStyle: {
            color: '#73D13D'
          }
        }
      }
    ],
    series: [
      {
        name: 'NDVI指数',
        type: 'line',
        yAxisIndex: 0,
        data: [0.35, 0.40, 0.48, 0.52, 0.58, 0.65, 0.72, 0.78, 0.82, 0.85, 0.84, 0.83, 0.82, 0.80, 0.78],
        symbolSize: 6,
        lineStyle: { width: 3 },
        itemStyle: { color: '#1890FF' },
        markPoint: {
          data: [
            { name: '当前', coord: [8, 0.82], symbol: 'pin', symbolSize: 40, label: { show: true, position: 'top', formatter: '当前' } }
          ]
        },
        markLine: {
          data: [
            { 
              name: '生长阶段', 
              xAxis: 8,
              lineStyle: { color: '#F5222D', type: 'dashed', width: 2 }
            }
          ]
        }
      },
      {
        name: '温度',
        type: 'line',
        yAxisIndex: 1,
        data: [8, 10, 12, 15, 18, 20, 22, 25, 27, 28, 30, 32, 34, 35, 33],
        symbolSize: 0,
        lineStyle: { width: 2 },
        itemStyle: { color: '#FAAD14' }
      },
      {
        name: '降水量',
        type: 'bar',
        yAxisIndex: 2,
        data: [12, 15, 8, 20, 10, 30, 15, 25, 18, 35, 20, 15, 10, 20, 15],
        itemStyle: { 
          color: '#73D13D',
          opacity: 0.6
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
 * 初始化行政区域选择器及地图下钻功能
 */
function initAreaSelector() {
  // 获取各级行政区域选择器
  const areaLevelSelector = document.getElementById('area-level');
  const stateSelector = document.getElementById('state-selector');
  const citySelector = document.getElementById('city-selector');
  const townSelector = document.getElementById('town-selector');
  const villageSelector = document.getElementById('village-selector');
  
  // 临夏州乡镇数据（部分示例数据）
  const townData = {
    'linxia-city': [
      { value: 'chengguan', label: '城关镇' },
      { value: 'bozhou', label: '波州镇' },
      { value: 'anjiapo', label: '安家坡镇' },
      { value: 'dongxiang', label: '东乡族镇' },
      { value: 'hexi', label: '河西镇' }
    ],
    'linxia-county': [
      { value: 'lianghe', label: '莲花镇' },
      { value: 'yongjing', label: '漫路镇' },
      { value: 'kangle', label: '韩集镇' },
      { value: 'xincheng', label: '新集镇' },
      { value: 'dahejia', label: '大河家镇' }
    ],
    'kangle': [
      { value: 'jishi', label: '景视镇' },
      { value: 'songmingyan', label: '松鸣岩镇' },
      { value: 'pingan', label: '平安镇' },
      { value: 'yangzi', label: '杨子镇' }
    ],
    'yongjing': [
      { value: 'liuji', label: '刘家峡镇' },
      { value: 'xiaohe', label: '小河镇' },
      { value: 'dahejia', label: '大河家镇' },
      { value: 'yanguanying', label: '盐官营镇' }
    ],
    'guanghe': [
      { value: 'chengguan', label: '城关镇' },
      { value: 'xinhe', label: '新河镇' },
      { value: 'zhaoxin', label: '朝阳镇' },
      { value: 'sanhe', label: '三甲集镇' }
    ],
    'hezheng': [
      { value: 'chengguan', label: '城关镇' },
      { value: 'xinmin', label: '新民镇' },
      { value: 'songshan', label: '松山镇' },
      { value: 'dashu', label: '大树镇' }
    ],
    'dongxiang': [
      { value: 'bajiao', label: '坝角镇' },
      { value: 'longquan', label: '龙泉镇' },
      { value: 'wozhan', label: '锁南镇' },
      { value: 'daban', label: '达板镇' }
    ],
    'jishishan': [
      { value: 'chengguan', label: '城关镇' },
      { value: 'liuji', label: '吹麻滩镇' },
      { value: 'wenquan', label: '温泉镇' },
      { value: 'wushan', label: '五寨镇' }
    ]
  };
  
  // 村级数据（仅展示部分示例数据）
  const villageData = {
    // 临夏市城关镇下的村庄
    'chengguan': [
      { value: 'v1', label: '东关村' },
      { value: 'v2', label: '西关村' },
      { value: 'v3', label: '北关村' },
      { value: 'v4', label: '南关村' },
      { value: 'v5', label: '城北村' }
    ],
    // 其他乡镇下的村庄数据可以按需添加
  };
  
  // 监听行政层级选择变化
  if (areaLevelSelector) {
    areaLevelSelector.addEventListener('change', function() {
      const level = this.value;
      
      // 隐藏所有选择器
      stateSelector.style.display = 'none';
      citySelector.style.display = 'none';
      townSelector.style.display = 'none';
      villageSelector.style.display = 'none';
      
      // 根据选择的层级显示对应的选择器
      switch (level) {
        case 'state':
          stateSelector.style.display = 'block';
          updateMapLevel('state');
          break;
        case 'city':
          stateSelector.style.display = 'block';
          citySelector.style.display = 'block';
          updateMapLevel('city');
          break;
        case 'town':
          stateSelector.style.display = 'block';
          citySelector.style.display = 'block';
          townSelector.style.display = 'block';
          updateMapLevel('town');
          break;
        case 'village':
          stateSelector.style.display = 'block';
          citySelector.style.display = 'block';
          townSelector.style.display = 'block';
          villageSelector.style.display = 'block';
          updateMapLevel('village');
          break;
      }
    });
  }
  
  // 县市级选择变化时更新乡镇选项
  if (citySelector) {
    citySelector.addEventListener('change', function() {
      const cityValue = this.value;
      
      // 清空乡镇选择器
      townSelector.innerHTML = '<option value="all">全部乡镇</option>';
      villageSelector.innerHTML = '<option value="all">全部村</option>';
      
      // 如果选择了特定县市，则加载其下属乡镇
      if (cityValue !== 'all' && townData[cityValue]) {
        townData[cityValue].forEach(town => {
          const option = document.createElement('option');
          option.value = town.value;
          option.textContent = town.label;
          townSelector.appendChild(option);
        });
      }
      
      // 更新地图显示
      updateMapView('city', cityValue);
    });
  }
  
  // 乡镇选择变化时更新村级选项
  if (townSelector) {
    townSelector.addEventListener('change', function() {
      const townValue = this.value;
      
      // 清空村级选择器
      villageSelector.innerHTML = '<option value="all">全部村</option>';
      
      // 如果选择了特定乡镇，则加载其下属村庄
      if (townValue !== 'all' && villageData[townValue]) {
        villageData[townValue].forEach(village => {
          const option = document.createElement('option');
          option.value = village.value;
          option.textContent = village.label;
          villageSelector.appendChild(option);
        });
      }
      
      // 更新地图显示
      updateMapView('town', townValue);
    });
  }
  
  // 村级选择变化时更新地图
  if (villageSelector) {
    villageSelector.addEventListener('change', function() {
      const villageValue = this.value;
      
      // 更新地图显示
      updateMapView('village', villageValue);
    });
  }
  
  // 初始化地图层级
  updateMapLevel('state');
}

/**
 * 更新地图层级（下钻功能）
 * @param {string} level - 地图层级（state/city/town/village）
 */
function updateMapLevel(level) {
  console.log(`更新地图层级为: ${level}`);
  
  // 在实际项目中，这里会根据层级切换地图的缩放级别和显示内容
  // 例如加载不同精度的边界数据、调整缩放级别等
  
  // 获取地图实例（实际项目中可能是GIS地图组件的实例）
  const mapElement = document.getElementById('map');
  
  if (mapElement) {
    // 模拟更新地图层级
    switch (level) {
      case 'state':
        // 州级视图，显示整个临夏州
        mapElement.setAttribute('data-zoom', '8');
        mapElement.setAttribute('data-level', 'state');
        break;
      case 'city':
        // 县市级视图，显示县市边界
        mapElement.setAttribute('data-zoom', '10');
        mapElement.setAttribute('data-level', 'city');
        break;
      case 'town':
        // 乡镇级视图，显示乡镇边界
        mapElement.setAttribute('data-zoom', '12');
        mapElement.setAttribute('data-level', 'town');
        break;
      case 'village':
        // 村级视图，显示村级边界
        mapElement.setAttribute('data-zoom', '14');
        mapElement.setAttribute('data-level', 'village');
        break;
    }
  }
}

/**
 * 更新地图视图
 * @param {string} type - 区域类型（city/town/village）
 * @param {string} value - 区域值
 */
function updateMapView(type, value) {
  console.log(`更新地图视图: ${type} = ${value}`);
  
  // 在实际项目中，这里会根据选择的区域更新地图显示范围
  // 例如放大到特定区域、高亮显示选中区域等
  
  // 获取地图实例
  const mapElement = document.getElementById('map');
  
  if (mapElement) {
    // 设置地图中心点和边界（模拟）
    mapElement.setAttribute('data-center', value);
    
    // 更新数据展示面板
    updateDataPanel(type, value);
  }
}

/**
 * 更新数据展示面板
 * @param {string} type - 区域类型
 * @param {string} value - 区域值
 */
function updateDataPanel(type, value) {
  // 根据选择的区域更新右侧数据面板内容
  // 在实际项目中，这里会请求服务器获取选定区域的数据
  
  if (value === 'all') {
    // 如果选择"全部"，则显示汇总数据
    console.log(`显示${type}级别的汇总数据`);
  } else {
    // 显示特定区域的数据
    console.log(`显示${value}的详细数据`);
  }
  
  // 重新初始化图表以反映新数据
  initCharts();
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