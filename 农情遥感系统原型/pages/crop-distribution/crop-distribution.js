/**
 * 作物分布页面功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化侧边栏折叠功能
  initSideMenuToggle();
  
  // 初始化数据面板折叠功能
  initDataPanelToggle();
  
  // 初始化底部表格展开折叠功能
  initTableExpand();
  
  // 初始化作物类型选择功能
  initCropTypeSelector();
  
  // 初始化季节选择功能
  initSeasonSelector();
  
  // 初始化地图工具栏功能
  initMapToolbar();
  
  // 初始化底图切换功能
  initBasemapSwitch();
  
  // 初始化单位切换功能
  initUnitSwitch();
  
  // 初始化图表
  initCharts();
  
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
 * 初始化底部表格展开折叠功能
 */
function initTableExpand() {
  const tableContainer = document.getElementById('dataTableContainer');
  const tableHandle = document.querySelector('.table-handle');
  
  if (tableContainer && tableHandle) {
    tableHandle.addEventListener('click', function() {
      tableContainer.classList.toggle('expanded');
      
      // 更新图标方向
      const icon = tableHandle.querySelector('i');
      if (tableContainer.classList.contains('expanded')) {
        icon.classList.replace('fa-grip-lines', 'fa-chevron-down');
      } else {
        icon.classList.replace('fa-chevron-down', 'fa-grip-lines');
      }
    });
  }
}

/**
 * 初始化作物类型选择功能
 */
function initCropTypeSelector() {
  const selectAllBtn = document.querySelector('.select-all');
  const clearAllBtn = document.querySelector('.clear-all');
  const cropCheckboxes = document.querySelectorAll('.crop-item input[type="checkbox"]');
  
  // 全选按钮
  if (selectAllBtn) {
    selectAllBtn.addEventListener('click', function() {
      cropCheckboxes.forEach(checkbox => {
        checkbox.checked = true;
        updateMapLayer(checkbox.id, true);
      });
    });
  }
  
  // 清除按钮
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', function() {
      cropCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
        updateMapLayer(checkbox.id, false);
      });
    });
  }
  
  // 单个复选框变化
  cropCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateMapLayer(this.id, this.checked);
    });
  });
}

/**
 * 更新地图图层（模拟）
 */
function updateMapLayer(layerId, isVisible) {
  console.log(`${layerId} 图层 ${isVisible ? '显示' : '隐藏'}`);
  
  // 实际项目中，这里会调用地图API更新图层显示/隐藏
}

/**
 * 初始化季节选择功能
 */
function initSeasonSelector() {
  const seasonBtns = document.querySelectorAll('.season-btn');
  
  seasonBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除其他按钮的激活状态
      seasonBtns.forEach(b => b.classList.remove('active'));
      
      // 添加当前按钮的激活状态
      this.classList.add('active');
      
      // 选中内部的单选按钮
      const radio = this.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        
        // 模拟更新数据
        console.log(`选择季节: ${radio.value}`);
        updateSeasonData(radio.value);
      }
    });
  });
}

/**
 * 更新季节数据（模拟）
 */
function updateSeasonData(season) {
  // 实际项目中，这里会根据选择的季节重新加载数据
  // 模拟数据变化
  if (season === 'spring') {
    document.querySelector('.total-number').textContent = '789.6';
    document.querySelector('.trend.up').innerHTML = '<i class="fas fa-arrow-up"></i> 7.3%';
  } else if (season === 'summer') {
    document.querySelector('.total-number').textContent = '923.4';
    document.querySelector('.trend.up').innerHTML = '<i class="fas fa-arrow-up"></i> 12.1%';
  } else if (season === 'autumn') {
    document.querySelector('.total-number').textContent = '876.2';
    document.querySelector('.trend.up').innerHTML = '<i class="fas fa-arrow-up"></i> 5.8%';
  } else if (season === 'winter') {
    document.querySelector('.total-number').textContent = '651.7';
    document.querySelector('.trend.up').innerHTML = '<i class="fas fa-arrow-down"></i> -2.3%';
    document.querySelector('.trend.up').classList.replace('up', 'down');
  }
  
  // 重新初始化图表
  initCharts();
}

/**
 * 初始化地图工具栏功能
 */
function initMapToolbar() {
  // 初始化地图
  initMap('county', 'linxia-county');
  
  const toolBtns = document.querySelectorAll('.tool-btn');
  
  toolBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除所有按钮的激活状态
      toolBtns.forEach(b => b.classList.remove('active'));
      
      // 切换当前按钮的激活状态
      this.classList.toggle('active');
      
      // 根据工具类型执行相应功能
      const toolType = this.getAttribute('title');
      console.log(`激活工具: ${toolType}`);
      
      // 实际项目中，这里会根据工具类型激活相应的地图功能
      if (toolType === '放大' && window.mapInstance) {
        window.mapInstance.zoomIn();
      } else if (toolType === '缩小' && window.mapInstance) {
        window.mapInstance.zoomOut();
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
    // 固定加载临夏县地图数据
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
      echarts.registerMap('临夏县', data);
      
      // 渲染地图
      renderEchartsMap('临夏县', d, chart);
      
      // 为ECharts地图添加点击事件，点击地图上的区域时进入区域详情
      chart.on('click', function(params) {
        console.log('点击了:', params.name);
        
        // 获取当前选中的县区
        const countySelector = document.getElementById('county-selector');
        const countyId = countySelector.value;
        
        // 模拟选择对应的区域
        const townSelector = document.getElementById('town-selector');
        
        // 遍历区域选择器的选项，找到匹配的区域名称
        let found = false;
        for (let i = 0; i < townSelector.options.length; i++) {
          const option = townSelector.options[i];
          if (option.text === params.name) {
            townSelector.value = option.value;
            found = true;
            break;
          }
        }
        
        // 如果找到匹配的区域，切换到真实地图
        if (found) {
          // 切换到Leaflet真实地图
          initRealMap(townSelector.value, countyId);
          
          // 触发change事件
          const event = new Event('change');
          townSelector.dispatchEvent(event);
        }
      });
    });
  }
}

/**
 * 初始化真实地图（Leaflet）
 * @param {string} regionId - 区域ID
 * @param {string} parentId - 父级区域ID
 */
function initRealMap(regionId, parentId) {
  // 隐藏ECharts地图
  const echartsDiv = document.getElementById('echarts-map');
  if (echartsDiv) {
    echartsDiv.style.display = 'none';
  }
  
  // 清空地图容器
  const mapDiv = document.getElementById('map');
  mapDiv.innerHTML = '';
  mapDiv.style.display = 'block';
  
  // 初始化Leaflet地图
  const map = L.map('map').setView([35.6, 103.2], 10);
  window.mapInstance = map;
  
  // 添加底图图层
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  // 根据区域ID调整地图视图
  const regionBounds = {
    'linxia-city': [[35.5, 103.1], [35.7, 103.3]],
    'linxia-county': [[35.4, 103.0], [35.8, 103.4]],
    'kangle': [[35.2, 103.6], [35.5, 104.0]],
    'yongjing': [[35.8, 103.2], [36.2, 103.6]],
    'guanghe': [[35.4, 103.4], [35.7, 103.7]],
    'hezheng': [[35.2, 103.3], [35.5, 103.6]],
    'dongxiang': [[35.7, 103.3], [36.0, 103.7]],
    'jishishan': [[35.6, 102.8], [35.9, 103.2]]
  };
  
  const bounds = regionBounds[regionId] || [[35.4, 102.8], [36.0, 103.7]];
  map.fitBounds(bounds);
  
  // 添加作物分布数据点
  addCropDistributionLayers(map, regionId);
}

/**
 * 添加作物分布图层
 * @param {Object} map - Leaflet地图实例
 * @param {string} regionId - 区域ID
 */
function addCropDistributionLayers(map, regionId) {
  // 模拟作物分布数据
  const cropData = {
    'wheat': { color: '#FFD700', name: '小麦' },
    'corn': { color: '#32CD32', name: '玉米' },
    'vegetable': { color: '#FF6347', name: '蔬菜' },
    'fruit': { color: '#FF69B4', name: '果树' }
  };
  
  // 为每种作物生成随机分布点
  Object.keys(cropData).forEach(cropType => {
    const crop = cropData[cropType];
    const points = generateRandomCropPoints(regionId, cropType, 15);
    
    points.forEach(point => {
      L.circleMarker([point.lat, point.lng], {
        radius: Math.random() * 8 + 4,
        fillColor: crop.color,
        color: crop.color,
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.6
      }).addTo(map).bindPopup(`
        <div style="text-align: center;">
          <strong>${crop.name}种植区</strong><br>
          <span style="color: #666;">面积: ${(Math.random() * 50 + 10).toFixed(1)} 亩</span><br>
          <span style="color: #666;">产量预估: ${(Math.random() * 500 + 200).toFixed(0)} 公斤/亩</span>
        </div>
      `);
    });
  });
}

/**
 * 生成随机作物分布点
 * @param {string} regionId - 区域ID
 * @param {string} cropType - 作物类型
 * @param {number} count - 点的数量
 * @returns {Array} 坐标点数组
 */
function generateRandomCropPoints(regionId, cropType, count) {
  const bounds = {
    'linxia-city': { minLat: 35.5, maxLat: 35.7, minLng: 103.1, maxLng: 103.3 },
    'linxia-county': { minLat: 35.4, maxLat: 35.8, minLng: 103.0, maxLng: 103.4 },
    'kangle': { minLat: 35.2, maxLat: 35.5, minLng: 103.6, maxLng: 104.0 },
    'yongjing': { minLat: 35.8, maxLat: 36.2, minLng: 103.2, maxLng: 103.6 },
    'guanghe': { minLat: 35.4, maxLat: 35.7, minLng: 103.4, maxLng: 103.7 },
    'hezheng': { minLat: 35.2, maxLat: 35.5, minLng: 103.3, maxLng: 103.6 },
    'dongxiang': { minLat: 35.7, maxLat: 36.0, minLng: 103.3, maxLng: 103.7 },
    'jishishan': { minLat: 35.6, maxLat: 35.9, minLng: 102.8, maxLng: 103.2 }
  };
  
  const bound = bounds[regionId] || bounds['linxia-county'];
  const points = [];
  
  for (let i = 0; i < count; i++) {
    points.push({
      lat: bound.minLat + Math.random() * (bound.maxLat - bound.minLat),
      lng: bound.minLng + Math.random() * (bound.maxLng - bound.minLng)
    });
  }
  
  return points;
}

/**
 * 渲染ECharts地图
 * @param {string} map - 地图名称
 * @param {Array} data - 地图数据
 * @param {Object} chart - ECharts实例
 */
function renderEchartsMap(map, data, chart) {
  // 获取当前选择的作物类型
  const activeCrops = [];
  document.querySelectorAll('.crop-item input[type="checkbox"]:checked').forEach(checkbox => {
    activeCrops.push(checkbox.id);
  });
  
  // 获取当前选择的季节
  const selectedSeason = document.querySelector('.season-btn.active input[type="radio"]').value;
  
  // 根据选择的作物类型和季节生成随机数据
  const seriesData = data.map(item => {
    return {
      name: item.name,
      value: Math.round(Math.random() * 100)
    };
  });
  
  // 设置颜色方案
  let colorRange;
  if (activeCrops.includes('crop-wheat')) {
    colorRange = ['#ffffd4', '#fed98e', '#fe9929', '#d95f0e', '#993404'];
  } else if (activeCrops.includes('crop-corn')) {
    colorRange = ['#edf8e9', '#bae4b3', '#74c476', '#31a354', '#006d2c'];
  } else if (activeCrops.includes('crop-rice')) {
    colorRange = ['#f1eef6', '#bdc9e1', '#74a9cf', '#2b8cbe', '#045a8d'];
  } else if (activeCrops.includes('crop-vegetable')) {
    colorRange = ['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'];
  } else {
    colorRange = ['#f7f7f7', '#cccccc', '#969696', '#636363', '#252525'];
  }
  
  const option = {
    backgroundColor: '#f5f5f5',
    title: {
      text: `${map}作物分布`,
      subtext: `${selectedSeason}季作物分布情况`,
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
        return `${params.name}<br/>种植面积: ${params.value}亩`;
      }
    },
    visualMap: {
      min: 0,
      max: 100,
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
        name: '作物分布',
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
  const selectedCrops = [];
  document.querySelectorAll('.crop-item input[type="checkbox"]:checked').forEach(checkbox => {
    selectedCrops.push(checkbox.id);
  });
  
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
  const cropLayers = {};
  const layerGroups = {
    'crop-wheat': L.layerGroup(),
    'crop-corn': L.layerGroup(),
    'crop-vegetable': L.layerGroup(),
    'crop-greenhouse': L.layerGroup()
  };
  
  // 为每种作物类型创建图层
  Object.keys(cropColors).forEach(cropType => {
    if (selectedCrops.includes(cropType)) {
      // 筛选当前作物类型的地块
      const polygons = cropPolygons.filter(poly => poly.cropType === cropType);
      
      // 添加地块到图层
      polygons.forEach(poly => {
        const polygon = L.polygon(poly.coordinates, cropStyles[cropType]).addTo(layerGroups[cropType]);
        
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
            <h4>${getCropName(cropType)}地块 #${poly.id}</h4>
            <table>
              <tr><td>面积:</td><td>${poly.area}亩</td></tr>
              <tr><td>品种:</td><td>${poly.variety}</td></tr>
              <tr><td>播种日期:</td><td>${poly.plantDate}</td></tr>
              <tr><td>权属人:</td><td>${poly.owner}</td></tr>
              <tr><td>长势评级:</td><td><span style="color:${statusColor}">${poly.growthStatus}</span></td></tr>
            </table>
          </div>
        `);
        
        // 添加点击事件，更新右侧详情面板
        polygon.on('click', function() {
          // 如果有右侧详情面板，可以更新详情
          if (typeof updateSelectedDetails === 'function') {
            updateSelectedDetails('field', cropType.replace('crop-', ''), {
              id: poly.id,
              name: `${getCropName(cropType)}地块 #${poly.id}`,
              location: poly.location,
              area: `${poly.area}亩`,
              crop: getCropName(cropType),
              variety: poly.variety,
              plantDate: poly.plantDate,
              owner: poly.owner,
              growthStage: poly.growthStage,
              growthIndex: poly.growthIndex,
              growthStatus: poly.growthStatus,
              estimatedYield: poly.estimatedYield,
              contact: poly.contact
            });
          }
        });
        
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
      layerGroups[cropType].addTo(map);
      cropLayers[getCropName(cropType)] = layerGroups[cropType];
    }
  });
  
  // 添加图层控制
  L.control.layers(null, cropLayers, {
    position: 'topright',
    collapsed: false
  }).addTo(map);
  
  // 监听作物类型复选框变化
  document.querySelectorAll('.crop-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const cropType = this.id;
      
      if (this.checked && layerGroups[cropType]) {
        map.addLayer(layerGroups[cropType]);
      } else if (!this.checked && layerGroups[cropType]) {
        map.removeLayer(layerGroups[cropType]);
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
 * 初始化底图切换功能
 */
function initBasemapSwitch() {
  const basemapBtns = document.querySelectorAll('.basemap-btn');
  const opacitySlider = document.querySelector('.opacity-slider');
  
  basemapBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除所有按钮的激活状态
      basemapBtns.forEach(b => b.classList.remove('active'));
      
      // 添加当前按钮的激活状态
      this.classList.add('active');
      
      const mapType = this.getAttribute('data-type');
      console.log(`切换底图: ${mapType}`);
      
      // 模拟切换底图
      const map = document.getElementById('map');
      if (map) {
        // 在实际项目中，这里会调用地图API切换底图
        // 这里仅做简单样式模拟
        if (mapType === 'base') {
          map.style.filter = 'none';
        } else if (mapType === 'satellite') {
          map.style.filter = 'saturate(1.2)';
        } else if (mapType === 'terrain') {
          map.style.filter = 'contrast(1.1) brightness(1.1)';
        }
      }
    });
  });
  
  // 透明度滑块
  if (opacitySlider) {
    opacitySlider.addEventListener('input', function() {
      const opacity = this.value / 100;
      console.log(`设置透明度: ${opacity}`);
      
      // 模拟设置透明度
      const map = document.getElementById('map');
      if (map) {
        // 在实际项目中，这里会调用地图API设置图层透明度
        // 这里仅做简单样式模拟
        map.style.opacity = opacity;
      }
    });
  }
}

/**
 * 初始化单位切换功能
 */
function initUnitSwitch() {
  const unitBtns = document.querySelectorAll('.unit');
  const totalNumber = document.querySelector('.total-number');
  
  if (!totalNumber) return;
  
  let currentValue = parseFloat(totalNumber.textContent);
  
  unitBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 如果已经是激活状态，不做处理
      if (this.classList.contains('active')) return;
      
      // 移除所有按钮的激活状态
      unitBtns.forEach(b => b.classList.remove('active'));
      
      // 添加当前按钮的激活状态
      this.classList.add('active');
      
      const unitType = this.getAttribute('data-unit');
      
      // 转换单位
      if (unitType === 'km2' && currentValue > 1000) {
        // 亩转平方公里
        currentValue = currentValue / 1500;
        totalNumber.textContent = currentValue.toFixed(1);
      } else if (unitType === 'mu' && currentValue < 1000) {
        // 平方公里转亩
        currentValue = currentValue * 1500;
        totalNumber.textContent = Math.round(currentValue);
      }
    });
  });
}

/**
 * 初始化图表
 */
function initCharts() {
  // 初始化作物占比饼图
  initPieChart();
  
  // 初始化作物面积条形图
  initBarChart();
  
  // 初始化历年变化折线图
  initLineChart();
}

/**
 * 初始化作物占比饼图
 */
function initPieChart() {
  const chartDom = document.getElementById('pieChart');
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
      data: ['小麦', '玉米', '蔬菜', '大棚']
    },
    series: [
      {
        name: '作物面积',
        type: 'pie',
        radius: ['45%', '70%'],
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
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 156.3, name: '小麦', itemStyle: { color: '#E8D639' } },
          { value: 203.7, name: '玉米', itemStyle: { color: '#61D836' } },
          { value: 138.2, name: '蔬菜', itemStyle: { color: '#36D8AD' } },
          { value: 291.4, name: '大棚', itemStyle: { color: '#36A0D8' } }
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
 * 初始化作物面积条形图
 */
function initBarChart() {
  const chartDom = document.getElementById('barChart');
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
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} km²'
      }
    },
    yAxis: {
      type: 'category',
      data: ['小麦', '玉米', '蔬菜', '大棚'],
      axisLabel: {
        fontSize: 12
      }
    },
    series: [
      {
        name: '面积',
        type: 'bar',
        data: [
          { value: 156.3, itemStyle: { color: '#E8D639' } },
          { value: 203.7, itemStyle: { color: '#61D836' } },
          { value: 138.2, itemStyle: { color: '#36D8AD' } },
          { value: 291.4, itemStyle: { color: '#36A0D8' } }
        ],
        label: {
          show: true,
          position: 'right',
          formatter: '{c} km²'
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
 * 初始化历年变化折线图
 */
function initLineChart() {
  const chartDom = document.getElementById('lineChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据
  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['小麦', '玉米', '蔬菜', '大棚'],
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
      boundaryGap: false,
      data: ['2019', '2020', '2021', '2022', '2023']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} km²'
      }
    },
    series: [
      {
        name: '小麦',
        type: 'line',
        data: [120.5, 132.1, 140.8, 148.5, 156.3],
        itemStyle: { color: '#E8D639' },
        lineStyle: { width: 3 }
      },
      {
        name: '玉米',
        type: 'line',
        data: [150.2, 165.8, 178.4, 188.5, 203.7],
        itemStyle: { color: '#61D836' },
        lineStyle: { width: 3 }
      },
      {
        name: '蔬菜',
        type: 'line',
        data: [110.4, 118.9, 125.6, 133.2, 138.2],
        itemStyle: { color: '#36D8AD' },
        lineStyle: { width: 3 }
      },
      {
        name: '大棚',
        type: 'line',
        data: [220.5, 245.8, 280.2, 298.4, 291.4],
        itemStyle: { color: '#36A0D8' },
        lineStyle: { width: 3 }
      }
    ]
  };
  
  chart.setOption(option);
  
  // 响应窗口大小变化
  window.addEventListener('resize', function() {
    chart.resize();
  });
} 