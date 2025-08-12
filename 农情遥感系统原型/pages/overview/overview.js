/**
 * 遥感总览页面功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化侧边栏折叠功能
  initSideMenuToggle();
  
  // 初始化数据面板折叠功能
  initDataPanelToggle();
  
  // 初始化图层分组折叠功能
  initLayerGroups();
  
  // 初始化图例折叠功能
  initLegendToggle();
  
  // 初始化区域级联选择
  initAreaCascadeSelection();
  
  // 初始化地图 - 默认显示区县级模拟地图
  initMap('county', 'all');
  
  // 初始化信息气泡功能
  initInfoPopup();
  
  // 初始化图表
  initCharts();
  
  // 显示未选择状态的友好提示
  showNoSelectionMessage();
  
  // 初始化右侧页卡切换功能
  initTabSwitch();
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
 * 初始化图层分组折叠功能
 */
function initLayerGroups() {
  const groupTitles = document.querySelectorAll('.layer-group-title');
  
  groupTitles.forEach(title => {
    title.addEventListener('click', function() {
      // 切换折叠状态
      this.classList.toggle('collapsed');
      
      // 获取对应的内容区域
      const items = this.nextElementSibling;
      
      // 切换显示/隐藏
      if (this.classList.contains('collapsed')) {
        items.style.display = 'none';
      } else {
        items.style.display = 'block';
      }
    });
  });
  
  // 初始化农田图层全选功能
  const cropAllCheckbox = document.getElementById('crop-all');
  if (cropAllCheckbox) {
    const cropCheckboxes = document.querySelectorAll('.layer-item input[id^="crop-"]:not(#crop-all)');
    
    // 全选框状态变化时，更新所有子复选框
    cropAllCheckbox.addEventListener('change', function() {
      const isChecked = this.checked;
      cropCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        // 触发change事件，确保图层显示状态也会更新
        const event = new Event('change');
        checkbox.dispatchEvent(event);
      });
    });
    
    // 监听子复选框变化，更新全选框状态
    cropCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        updateGroupSelectStatus(cropCheckboxes, cropAllCheckbox);
      });
    });
  }
  
  // 初始化设备图层全选功能
  const deviceAllCheckbox = document.getElementById('device-all');
  if (deviceAllCheckbox) {
    const deviceCheckboxes = document.querySelectorAll('.layer-item input[id^="device-"]:not(#device-all)');
    
    // 全选框状态变化时，更新所有子复选框
    deviceAllCheckbox.addEventListener('change', function() {
      const isChecked = this.checked;
      deviceCheckboxes.forEach(checkbox => {
        checkbox.checked = isChecked;
        // 触发change事件，确保图层显示状态也会更新
        const event = new Event('change');
        checkbox.dispatchEvent(event);
      });
    });
    
    // 监听子复选框变化，更新全选框状态
    deviceCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        updateGroupSelectStatus(deviceCheckboxes, deviceAllCheckbox);
      });
    });
  }
  
  // 更新全选框状态的辅助函数
  function updateGroupSelectStatus(childCheckboxes, groupCheckbox) {
    let allChecked = true;
    let allUnchecked = true;
    
    childCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        allUnchecked = false;
      } else {
        allChecked = false;
      }
    });
    
    // 全部选中时，全选框选中；全部未选中时，全选框未选中；部分选中时，全选框处于indeterminate状态
    if (allChecked) {
      groupCheckbox.checked = true;
      groupCheckbox.indeterminate = false;
    } else if (allUnchecked) {
      groupCheckbox.checked = false;
      groupCheckbox.indeterminate = false;
    } else {
      groupCheckbox.checked = false;
      groupCheckbox.indeterminate = true;
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
    mapDiv.style.display = 'none';
    
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
      mapContainer.insertBefore(echartsDiv, mapDiv);
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
    mapDiv.style.display = 'block';
    
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
    const countyMapping = {
      'linxia-city': '620900',      // 临夏市
      'linxia-county': '622900',    // 临夏县
      'kangle': '622922',           // 康乐县
      'yongjing': '622923',         // 永靖县
      'guanghe': '622924',          // 广河县
      'hezheng': '622925',          // 和政县
      'dongxiang': '622926',        // 东乡族自治县
      'jishishan': '622927'         // 积石山保安族东乡族撒拉族自治县
    };

    const countyId = countyMapping[regionId] || '620900'; // 默认临夏市
    const countyNames = {
      'linxia-city': '临夏市',
      'linxia-county': '临夏县',
      'kangle': '康乐县',
      'yongjing': '永靖县',
      'guanghe': '广河县',
      'hezheng': '和政县',
      'dongxiang': '东乡族自治县',
      'jishishan': '积石山保安族东乡族撒拉族自治县'
    };
    mapName = countyNames[regionId] || '临夏市';
    
    $.getJSON(`../../static/map/city/${countyId}.json`, function(data) {
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

  // 为ECharts地图添加点击事件，点击地图上的乡镇时进入乡镇详情
  chart.on('click', function(params) {
    console.log('点击了:', params.name);
    
    // 获取当前选中的县区
    const countySelector = document.getElementById('county-selector');
    const countyId = countySelector.value;
    
    // 模拟选择对应的乡镇
    const townSelector = document.getElementById('town-selector');
    
    // 遍历乡镇选择器的选项，找到匹配的乡镇名称
    let found = false;
    for (let i = 0; i < townSelector.options.length; i++) {
      const option = townSelector.options[i];
      if (option.text === params.name) {
        townSelector.value = option.value;
        found = true;
        break;
      }
    }
    
    // 如果找到匹配的乡镇，切换到乡镇地图
    if (found) {
      // 触发change事件
      const event = new Event('change');
      townSelector.dispatchEvent(event);
    }
  });
}

/**
 * 渲染ECharts地图
 * @param {string} map - 地图名称
 * @param {Array} data - 地图数据
 * @param {Object} chart - ECharts实例
 */
function renderEchartsMap(map, data, chart) {
  // 随机生成农作物分布数据
  let seriesData = data.map(item => {
    return {
      name: item.name,
      value: Math.round(Math.random() * 100)
    };
  });
  
  const option = {
    backgroundColor: '#f5f5f5',
    title: {
      text: `${map}农情遥感监测`,
      subtext: '作物分布与生长情况',
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
        return `${params.name}<br/>种植面积: ${params.value}亩<br/>主要作物: 小麦、玉米`;
      }
    },
    visualMap: {
      min: 0,
      max: 100,
      text: ['高', '低'],
      realtime: false,
      calculable: true,
      inRange: {
        color: ['#e0ffff', '#006edd']
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
  
  // 添加图层
  const regionData = mapData[level][regionId] || mapData[level].all;
  
  // 创建ECharts实例和配置
  const echartContainer = document.createElement('div');
  echartContainer.style.position = 'absolute';
  echartContainer.style.top = '0';
  echartContainer.style.left = '0';
  echartContainer.style.width = '100%';
  echartContainer.style.height = '100%';
  echartContainer.style.pointerEvents = 'none'; // 使ECharts层不阻挡鼠标事件
  document.getElementById('map').appendChild(echartContainer);
  
  const chart = echarts.init(echartContainer);
  
  // 配置ECharts选项
  const option = {
    animation: false,
    coordinateSystem: 'leaflet', // 使用Leaflet坐标系统
    series: []
  };
  
  // 添加初始图层
  initSimulatedMapLayers(level, regionId, chart, option);
  
  // 添加图层控制事件
  const layerCheckboxes = document.querySelectorAll('.layer-items input[type="checkbox"]');
  
  layerCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateChartLayers();
    });
  });
  
  // 添加不透明度控制事件
  const opacitySliders = document.querySelectorAll('.opacity-slider input');
  
  opacitySliders.forEach(slider => {
    slider.addEventListener('input', function() {
      updateChartLayers();
    });
  });
  
  // 更新图层函数
  function updateChartLayers() {
    // 同之前的实现...
  }
  
  // 随机生成区域内的点位
  function generateRandomPoints(regionId, count, color) {
    // 同之前的实现...
  }
  
  // 为地图添加缩放控制事件
  document.querySelector('.zoom-in').addEventListener('click', function() {
    map.zoomIn();
  });
  
  document.querySelector('.zoom-out').addEventListener('click', function() {
    map.zoomOut();
  });
  
  // 监听地图点击事件，显示信息气泡
  map.on('click', function(e) {
    showInfoPopup(e.latlng.lat, e.latlng.lng);
  });
  
  return map;
}

/**
 * 初始化实际地图 (Leaflet)
 * @param {string} townId - 乡镇ID
 * @param {string} countyId - 区县ID
 */
function initRealMap(townId, countyId) {
  // 隐藏自定义缩放控件
  document.querySelector('.map-controls').style.display = 'none';
  
  // 移除背景图片
  document.getElementById('map').style.backgroundImage = 'none';
  
  // 获取乡镇名称
  let townName = "";
  const townSelector = document.getElementById('town-selector');
  const selectedOption = townSelector.options[townSelector.selectedIndex];
  townName = selectedOption.textContent;
  
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
  
  // 添加天地图（可选）
  const tdtNormal = L.tileLayer('https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=你的天地图密钥', {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    maxZoom: 18
  });
  
  const tdtLabel = L.tileLayer('https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=你的天地图密钥', {
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    maxZoom: 18
  });
  
  // 创建图层控制器
  const baseMaps = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }),
    "卫星影像": L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 18
    })
  };
  
  // 添加图层控制器
  L.control.layers(baseMaps, {}).addTo(map);
  
  // 添加缩放控制
  L.control.zoom({
    position: 'topright'
  }).addTo(map);
  
  // 添加乡镇名称标签
  L.marker(mapCenter).addTo(map)
    .bindPopup(`<b>${townName}</b>`).openPopup();
  
  // 创建图层组，用于管理各类图层
  const layerGroups = {
    'crop-wheat': L.layerGroup(),
    'crop-corn': L.layerGroup(),
    'crop-vegetable': L.layerGroup(),
    'crop-greenhouse': L.layerGroup(),
    'device-monitor': L.layerGroup(),
    'device-light': L.layerGroup(),
    'device-trap': L.layerGroup()
  };
  
  // 样式定义
  const cropStyles = {
    'crop-wheat': { color: '#E8D639', fillColor: '#E8D639', weight: 1, fillOpacity: 0.7 },
    'crop-corn': { color: '#61D836', fillColor: '#61D836', weight: 1, fillOpacity: 0.7 },
    'crop-vegetable': { color: '#36D8AD', fillColor: '#36D8AD', weight: 1, fillOpacity: 0.7 },
    'crop-greenhouse': { color: '#36A0D8', fillColor: '#36A0D8', weight: 1, fillOpacity: 0.7 }
  };
  
  // 设备图标定义
  const deviceIcons = {
    'device-monitor': L.divIcon({
      html: '<i class="fas fa-seedling" style="color: #52C41A; font-size: 18px;"></i>',
      className: 'device-icon-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    }),
    'device-light': L.divIcon({
      html: '<i class="fas fa-lightbulb" style="color: #FAAD14; font-size: 18px;"></i>',
      className: 'device-icon-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    }),
    'device-trap': L.divIcon({
      html: '<i class="fas fa-bug" style="color: #1890FF; font-size: 18px;"></i>',
      className: 'device-icon-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    })
  };
  
  // 根据中心点创建一些真实的地块示例
  const lat = mapCenter[0];
  const lng = mapCenter[1];
  
  // 1. 小麦地块 - 多边形形状
  const wheatField1 = L.polygon([
    [lat - 0.008, lng - 0.012],
    [lat - 0.002, lng - 0.015],
    [lat - 0.001, lng - 0.005],
    [lat - 0.006, lng - 0.003]
  ], cropStyles['crop-wheat']).addTo(layerGroups['crop-wheat']);
  
  wheatField1.bindPopup(`
    <div class="field-popup">
      <h4>小麦地块 #W1001</h4>
      <table>
        <tr><td>面积:</td><td>45.3亩</td></tr>
        <tr><td>品种:</td><td>冬小麦</td></tr>
        <tr><td>播种日期:</td><td>2023-09-20</td></tr>
        <tr><td>权属人:</td><td>李明</td></tr>
        <tr><td>长势评级:</td><td><span style="color:#52C41A">优</span></td></tr>
      </table>
    </div>
  `);
  
  // 添加点击事件，更新右侧详情面板
  wheatField1.on('click', function() {
    updateSelectedDetails('field', 'wheat', {
      id: 'W1001',
      name: '小麦地块 #W1001',
      location: '东部区域',
      area: '45.3亩',
      crop: '小麦',
      variety: '冬小麦',
      plantDate: '2023-09-20',
      owner: '李明',
      growthStage: '拔节期',
      growthIndex: '0.88',
      growthStatus: '优',
      estimatedYield: '540公斤/亩',
      contact: '13845678901'
    });
  });
  
  const wheatField2 = L.polygon([
    [lat + 0.005, lng + 0.012],
    [lat + 0.010, lng + 0.008],
    [lat + 0.012, lng + 0.015],
    [lat + 0.007, lng + 0.018]
  ], cropStyles['crop-wheat']).addTo(layerGroups['crop-wheat']);
  
  wheatField2.bindPopup(`
    <div class="field-popup">
      <h4>小麦地块 #W1002</h4>
      <table>
        <tr><td>面积:</td><td>38.6亩</td></tr>
        <tr><td>品种:</td><td>春小麦</td></tr>
        <tr><td>播种日期:</td><td>2023-09-15</td></tr>
        <tr><td>权属人:</td><td>张伟</td></tr>
        <tr><td>长势评级:</td><td><span style="color:#FAAD14">良</span></td></tr>
      </table>
    </div>
  `);
  
  // 添加点击事件，更新右侧详情面板
  wheatField2.on('click', function() {
    updateSelectedDetails('field', 'wheat', {
      id: 'W1002',
      name: '小麦地块 #W1002',
      location: '北部区域',
      area: '38.6亩',
      crop: '小麦',
      variety: '春小麦',
      plantDate: '2023-09-15',
      owner: '张伟',
      growthStage: '拔节期',
      growthIndex: '0.75',
      growthStatus: '良',
      estimatedYield: '480公斤/亩',
      contact: '13756789012'
    });
  });
  
  // 2. 玉米地块 - 复杂多边形
  const cornField1 = L.polygon([
    [lat - 0.015, lng + 0.005],
    [lat - 0.012, lng + 0.010],
    [lat - 0.007, lng + 0.012],
    [lat - 0.005, lng + 0.007],
    [lat - 0.008, lng + 0.003]
  ], cropStyles['crop-corn']).addTo(layerGroups['crop-corn']);
  
  cornField1.bindPopup(`
    <div class="field-popup">
      <h4>玉米地块 #C2001</h4>
      <table>
        <tr><td>面积:</td><td>52.7亩</td></tr>
        <tr><td>品种:</td><td>甜玉米</td></tr>
        <tr><td>播种日期:</td><td>2023-04-10</td></tr>
        <tr><td>权属人:</td><td>王刚</td></tr>
        <tr><td>长势评级:</td><td><span style="color:#52C41A">优</span></td></tr>
      </table>
    </div>
  `);
  
  // 添加点击事件，更新右侧详情面板
  cornField1.on('click', function() {
    updateSelectedDetails('field', 'corn', {
      id: 'C2001',
      name: '玉米地块 #C2001',
      location: '西南区域',
      area: '52.7亩',
      crop: '玉米',
      variety: '甜玉米',
      plantDate: '2023-04-10',
      owner: '王刚',
      growthStage: '抽穗期',
      growthIndex: '0.92',
      growthStatus: '优',
      estimatedYield: '650公斤/亩',
      contact: '13912345678'
    });
  });
  
  // 3. 蔬菜地块 - 复杂形状
  const vegetableField1 = L.polygon([
    [lat + 0.002, lng - 0.015],
    [lat + 0.005, lng - 0.012],
    [lat + 0.010, lng - 0.015],
    [lat + 0.008, lng - 0.022]
  ], cropStyles['crop-vegetable']).addTo(layerGroups['crop-vegetable']);
  
  vegetableField1.bindPopup(`
    <div class="field-popup">
      <h4>蔬菜地块 #V3001</h4>
      <table>
        <tr><td>面积:</td><td>25.4亩</td></tr>
        <tr><td>品种:</td><td>西红柿、黄瓜</td></tr>
        <tr><td>播种日期:</td><td>2023-03-15</td></tr>
        <tr><td>权属人:</td><td>赵丽</td></tr>
        <tr><td>长势评级:</td><td><span style="color:#F5222D">中</span></td></tr>
      </table>
    </div>
  `);
  
  // 添加点击事件，更新右侧详情面板
  vegetableField1.on('click', function() {
    updateSelectedDetails('field', 'vegetable', {
      id: 'V3001',
      name: '蔬菜地块 #V3001',
      location: '东南区域',
      area: '25.4亩',
      crop: '蔬菜',
      variety: '西红柿、黄瓜',
      plantDate: '2023-03-15',
      owner: '赵丽',
      growthStage: '结果期',
      growthIndex: '0.65',
      growthStatus: '中',
      estimatedYield: '3200公斤/亩',
      contact: '13898765432'
    });
  });
  
  // 4. 大棚地块 - 规则形状
  const greenhouse1 = L.polygon([
    [lat - 0.005, lng + 0.018],
    [lat - 0.005, lng + 0.025],
    [lat - 0.002, lng + 0.025],
    [lat - 0.002, lng + 0.018]
  ], cropStyles['crop-greenhouse']).addTo(layerGroups['crop-greenhouse']);
  
  greenhouse1.bindPopup(`
    <div class="field-popup">
      <h4>智能大棚 #G4001</h4>
      <table>
        <tr><td>面积:</td><td>8.5亩</td></tr>
        <tr><td>作物:</td><td>草莓</td></tr>
        <tr><td>温度:</td><td>26.5℃</td></tr>
        <tr><td>湿度:</td><td>68%</td></tr>
        <tr><td>权属人:</td><td>刘欢</td></tr>
      </table>
    </div>
  `);
  
  // 添加点击事件，更新右侧详情面板
  greenhouse1.on('click', function() {
    updateSelectedDetails('field', 'greenhouse', {
      id: 'G4001',
      name: '智能大棚 #G4001',
      location: '中心区域',
      area: '8.5亩',
      crop: '草莓',
      plantDate: '2023-02-20',
      owner: '刘欢',
      temperature: '26.5℃',
      humidity: '68%',
      growthStage: '盛果期',
      growthIndex: '0.93',
      growthStatus: '优',
      estimatedYield: '1800公斤/亩',
      contact: '13765432109'
    });
  });
  
  const greenhouse2 = L.polygon([
    [lat - 0.005, lng + 0.027],
    [lat - 0.005, lng + 0.034],
    [lat - 0.002, lng + 0.034],
    [lat - 0.002, lng + 0.027]
  ], cropStyles['crop-greenhouse']).addTo(layerGroups['crop-greenhouse']);
  
  greenhouse2.bindPopup(`
    <div class="field-popup">
      <h4>智能大棚 #G4002</h4>
      <table>
        <tr><td>面积:</td><td>8.5亩</td></tr>
        <tr><td>作物:</td><td>西红柿</td></tr>
        <tr><td>温度:</td><td>24.8℃</td></tr>
        <tr><td>湿度:</td><td>75%</td></tr>
        <tr><td>权属人:</td><td>刘欢</td></tr>
      </table>
    </div>
  `);
  
  // 添加点击事件，更新右侧详情面板
  greenhouse2.on('click', function() {
    updateSelectedDetails('field', 'greenhouse', {
      id: 'G4002',
      name: '智能大棚 #G4002',
      location: '中心区域',
      area: '8.5亩',
      crop: '西红柿',
      plantDate: '2023-01-15',
      owner: '刘欢',
      temperature: '24.8℃',
      humidity: '75%',
      growthStage: '结果期',
      growthIndex: '0.88',
      growthStatus: '优',
      estimatedYield: '5500公斤/亩',
      contact: '13765432109'
    });
  });
  
  // 添加物联网设备标记
  // 1. 苗情监测设备
  const monitorDevices = [
    { lat: lat - 0.004, lng: lng - 0.009, id: 'MD001', battery: '85%', lastUpdate: '1小时前', status: '正常' },
    { lat: lat + 0.008, lng: lng + 0.013, id: 'MD002', battery: '72%', lastUpdate: '2小时前', status: '正常' },
    { lat: lat - 0.010, lng: lng + 0.008, id: 'MD003', battery: '65%', lastUpdate: '30分钟前', status: '正常' }
  ];
  
  monitorDevices.forEach(device => {
    const marker = L.marker([device.lat, device.lng], { icon: deviceIcons['device-monitor'] })
      .bindPopup(`
        <div class="device-popup">
          <h4>苗情监测设备 #${device.id}</h4>
          <table>
            <tr><td>电量:</td><td>${device.battery}</td></tr>
            <tr><td>最后更新:</td><td>${device.lastUpdate}</td></tr>
            <tr><td>状态:</td><td>${device.status}</td></tr>
            <tr><td>当前温度:</td><td>22.5℃</td></tr>
            <tr><td>当前湿度:</td><td>78%</td></tr>
            <tr><td>土壤水分:</td><td>65%</td></tr>
          </table>
        </div>
      `);
    
    // 添加点击事件，更新右侧详情面板
    marker.on('click', function() {
      updateSelectedDetails('device', 'monitor', device);
    });
    
    layerGroups['device-monitor'].addLayer(marker);
  });
  
  // 2. 智能杀虫灯
  const lightDevices = [
    { lat: lat + 0.003, lng: lng - 0.014, id: 'SL001', battery: '92%', lastUpdate: '15分钟前', status: '开启', catches: 56 },
    { lat: lat - 0.013, lng: lng + 0.017, id: 'SL002', battery: '88%', lastUpdate: '25分钟前', status: '开启', catches: 43 }
  ];
  
  lightDevices.forEach(device => {
    const marker = L.marker([device.lat, device.lng], { icon: deviceIcons['device-light'] })
      .bindPopup(`
        <div class="device-popup">
          <h4>智能杀虫灯 #${device.id}</h4>
          <table>
            <tr><td>电量:</td><td>${device.battery}</td></tr>
            <tr><td>最后更新:</td><td>${device.lastUpdate}</td></tr>
            <tr><td>状态:</td><td>${device.status}</td></tr>
            <tr><td>今日捕获:</td><td>${device.catches}只</td></tr>
            <tr><td>主要虫种:</td><td>稻飞虱、蚜虫</td></tr>
          </table>
        </div>
      `);
    
    // 添加点击事件，更新右侧详情面板
    marker.on('click', function() {
      updateSelectedDetails('device', 'light', device);
    });
    
    layerGroups['device-light'].addLayer(marker);
  });
  
  // 3. 虫情监测仪
  const trapDevices = [
    { lat: lat - 0.005, lng: lng - 0.018, id: 'PT001', battery: '78%', lastUpdate: '45分钟前', status: '正常' },
    { lat: lat + 0.014, lng: lng + 0.005, id: 'PT002', battery: '82%', lastUpdate: '35分钟前', status: '正常' },
    { lat: lat - 0.008, lng: lng + 0.022, id: 'PT003', battery: '76%', lastUpdate: '50分钟前', status: '预警', alert: '检测到害虫密度超标' }
  ];
  
  trapDevices.forEach(device => {
    const marker = L.marker([device.lat, device.lng], { icon: deviceIcons['device-trap'] })
      .bindPopup(`
        <div class="device-popup">
          <h4>虫情监测仪 #${device.id}</h4>
          <table>
            <tr><td>电量:</td><td>${device.battery}</td></tr>
            <tr><td>最后更新:</td><td>${device.lastUpdate}</td></tr>
            <tr><td>状态:</td><td>${device.status === '预警' ? '<span style="color: #F5222D">'+device.status+'</span>' : device.status}</td></tr>
            <tr><td>害虫密度:</td><td>${device.status === '预警' ? '<span style="color: #F5222D">高</span>' : '正常'}</td></tr>
            ${device.alert ? '<tr><td>预警信息:</td><td><span style="color: #F5222D">'+device.alert+'</span></td></tr>' : ''}
          </table>
        </div>
      `);
    
    // 添加点击事件，更新右侧详情面板
    marker.on('click', function() {
      updateSelectedDetails('device', 'trap', device);
    });
    
    layerGroups['device-trap'].addLayer(marker);
  });
  
  // 将所有图层添加到地图
  for (const layerId in layerGroups) {
    layerGroups[layerId].addTo(map);
  }
  
  // 处理图层切换
  const layerCheckboxes = document.querySelectorAll('.layer-item input[type="checkbox"]');
  
  layerCheckboxes.forEach(checkbox => {
    const layerId = checkbox.id;
    
    // 初始状态设置
    if (layerId in layerGroups) {
      map[checkbox.checked ? 'addLayer' : 'removeLayer'](layerGroups[layerId]);
    }
    
    // 监听切换事件
    checkbox.addEventListener('change', function() {
      if (layerId in layerGroups) {
        if (this.checked) {
          map.addLayer(layerGroups[layerId]);
        } else {
          map.removeLayer(layerGroups[layerId]);
        }
      }
    });
    
    // 处理透明度调整
    const sliderParent = checkbox.closest('.layer-item');
    if (sliderParent && layerId.startsWith('crop-')) {
      const opacitySlider = sliderParent.querySelector('.opacity-slider input');
      if (opacitySlider) {
        opacitySlider.addEventListener('input', function() {
          const opacity = this.value / 100;
          
          // 遍历图层组中的所有图层设置透明度
          layerGroups[layerId].eachLayer(function(layer) {
            if (layer.setStyle) {
              layer.setStyle({ fillOpacity: opacity });
            }
          });
        });
      }
    }
  });
  
  // 时间轴控制
  const timeSlider = document.querySelector('.time-slider');
  if (timeSlider) {
    timeSlider.addEventListener('input', function() {
      // 在实际项目中，这里应该根据时间轴的值更新地图上的图层
      console.log(`时间更新: ${this.value}`);
    });
  }
  
  // 点击地图显示详情
  map.on('click', function(e) {
    // 地图空白处点击，不触发气泡
    console.log('点击了地图：', e.latlng);
  });
  
  // 存储地图实例以便其他地方使用
  window.mapInstance = map;
  
  console.log(`已初始化${townName}真实地图`);
}

/**
 * 生成随机颜色
 */
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

/**
 * 初始化信息气泡功能
 */
function initInfoPopup() {
  const popup = document.getElementById('infoPopup');
  const closeBtn = document.querySelector('.popup-close');
  
  if (closeBtn && popup) {
    closeBtn.addEventListener('click', function() {
      popup.style.display = 'none';
    });
  }
}

/**
 * 显示信息气泡
 */
function showInfoPopup(x, y) {
  const popup = document.getElementById('infoPopup');
  
  if (popup) {
    // 调整气泡位置，确保在可视区域内
    const mapContainer = document.querySelector('.map-container');
    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;
    
    // 计算位置，防止超出边界
    let left = x;
    let top = y;
    
    // 确保不超出右边界
    if (left + popupWidth > mapContainer.offsetWidth) {
      left = mapContainer.offsetWidth - popupWidth - 20;
    }
    
    // 确保不超出下边界
    if (top + popupHeight > mapContainer.offsetHeight) {
      top = mapContainer.offsetHeight - popupHeight - 20;
    }
    
    // 设置位置并显示
    popup.style.left = `${left}px`;
    popup.style.top = `${top}px`;
    popup.style.transform = 'none';
    popup.style.display = 'block';
  }
}

/**
 * 初始化图表
 */
function initCharts() {
  // 初始化长势指数变化趋势图表
  initGrowthChart();
  
  // 初始化关键指标完成情况图表
  initGaugeChart();
}

/**
 * 初始化长势指数变化趋势图表
 */
function initGrowthChart() {
  const chartDom = document.getElementById('growthChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  window.growthChart = chart; // 保存图表实例
  
  // 模拟数据
  const dates = ['3月', '4月', '5月', '6月', '7月'];
  const growthData = [0.45, 0.58, 0.71, 0.83, 0.86];
  const rainData = [35, 58, 90, 120, 75];
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: [
      {
        type: 'value',
        name: '长势指数',
        min: 0,
        max: 1,
        position: 'left',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#1890FF'
          }
        },
        splitLine: {
          show: false
        }
      },
      {
        type: 'value',
        name: '降水量',
        min: 0,
        max: 150,
        position: 'right',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#52C41A'
          }
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          formatter: '{value} mm'
        }
      }
    ],
    series: [
      {
        name: '长势指数',
        type: 'line',
        data: growthData,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#1890FF'
        },
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '降水量',
        type: 'bar',
        yAxisIndex: 1,
        data: rainData,
        itemStyle: {
          color: '#52C41A',
          opacity: 0.7
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
 * 初始化关键指标完成情况图表
 */
function initGaugeChart() {
  const chartDom = document.getElementById('gaugeChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  window.gaugeChart = chart; // 保存图表实例
  
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 1,
        splitNumber: 5,
        radius: '90%',
        axisLine: {
          lineStyle: {
            width: 10,
            color: [
              [0.6, '#F5222D'],
              [0.8, '#FAAD14'],
              [1, '#52C41A']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 10,
          offsetCenter: [0, '-40%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 3
          }
        },
        axisLabel: {
          color: '#999',
          fontSize: 12,
          distance: -50,
          formatter: function(value) {
            if (value === 0.2) {
              return '差';
            } else if (value === 0.4) {
              return '较差';
            } else if (value === 0.6) {
              return '一般';
            } else if (value === 0.8) {
              return '良好';
            } else if (value === 1) {
              return '优秀';
            }
            return '';
          }
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}',
          color: 'auto',
          offsetCenter: [0, '-20%'],
          fontSize: 24
        },
        data: [
          {
            value: 0.86,
            name: '当前长势指数',
            title: {
              offsetCenter: [0, '30%']
            }
          }
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

// 模拟时间控制功能
document.addEventListener('DOMContentLoaded', function() {
  const timeSlider = document.querySelector('.time-slider');
  const dateDisplay = document.querySelector('.date-display');
  const playButton = document.querySelector('.playback-controls .fa-play').parentNode;
  
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
    dateDisplay.textContent = formatDate(currentDate);
  }
  
  // 格式化日期
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // 初始化日期显示
  updateDateDisplay(timeSlider.value);
  
  // 时间滑块变化
  timeSlider.addEventListener('input', function() {
    updateDateDisplay(this.value);
  });
  
  // 播放/暂停按钮
  playButton.addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    if (isPlaying) {
      // 暂停
      clearInterval(playInterval);
      icon.classList.replace('fa-pause', 'fa-play');
    } else {
      // 播放
      playInterval = setInterval(function() {
        let value = parseInt(timeSlider.value);
        if (value < 100) {
          value += 1;
          timeSlider.value = value;
          updateDateDisplay(value);
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
  
  // 前进按钮
  document.querySelector('.fa-step-forward').parentNode.addEventListener('click', function() {
    let value = parseInt(timeSlider.value);
    if (value < 100) {
      value += 5;
      if (value > 100) value = 100;
      timeSlider.value = value;
      updateDateDisplay(value);
    }
  });
  
  // 后退按钮
  document.querySelector('.fa-step-backward').parentNode.addEventListener('click', function() {
    let value = parseInt(timeSlider.value);
    if (value > 0) {
      value -= 5;
      if (value < 0) value = 0;
      timeSlider.value = value;
      updateDateDisplay(value);
    }
  });
});

/**
 * 更新选中区域详情面板
 * @param {string} type - 类型：'field'(农田) 或 'device'(设备)
 * @param {string} subtype - 子类型
 * @param {object} data - 详情数据对象
 */
function updateSelectedDetails(type, subtype, data) {
  const detailsSection = document.querySelector('.selected-details');
  const thumbnail = detailsSection.querySelector('.thumbnail');
  const detailInfo = detailsSection.querySelector('.detail-info');
  
  if (!detailsSection || !thumbnail || !detailInfo) return;
  
  // 清空现有内容
  detailInfo.innerHTML = '';
  
  // 更新标题
  const sectionTitle = detailsSection.querySelector('.section-title');
  if (sectionTitle) {
    sectionTitle.textContent = type === 'field' ? '选中地块详情' : '选中设备详情';
  }
  
  // 确保详情页卡被激活显示
  const detailsTab = document.querySelector('.tab-button[data-tab="details"]');
  if (detailsTab && !detailsTab.classList.contains('active')) {
    detailsTab.click();
  }
  
  // 更新缩略图
  if (type === 'field') {
    // 显示农田图片
    let bgColor;
    switch(subtype) {
      case 'wheat':
        bgColor = '#E8D639';
        break;
      case 'corn':
        bgColor = '#61D836';
        break;
      case 'vegetable':
        bgColor = '#36D8AD';
        break;
      case 'greenhouse':
        bgColor = '#36A0D8';
        break;
      default:
        bgColor = '#F0F2F5';
    }
    
    thumbnail.style.backgroundColor = bgColor;
    thumbnail.innerHTML = `
      <div style="font-size: 18px; color: #fff; text-shadow: 0 0 3px rgba(0,0,0,0.5);">
        ${data.crop}地块
      </div>
    `;
  } else {
    // 显示设备图标
    let icon, color;
    switch(subtype) {
      case 'monitor':
        icon = 'fa-seedling';
        color = '#52C41A';
        break;
      case 'light':
        icon = 'fa-lightbulb';
        color = '#FAAD14';
        break;
      case 'trap':
        icon = 'fa-bug';
        color = '#1890FF';
        break;
      default:
        icon = 'fa-microchip';
        color = '#722ED1';
    }
    
    thumbnail.style.backgroundColor = '#F0F2F5';
    thumbnail.innerHTML = `
      <div style="font-size: 36px; color: ${color};">
        <i class="fas ${icon}"></i>
      </div>
    `;
  }
  
  // 根据类型和数据生成详情内容
  let detailsHTML = '';
  
  if (type === 'field') {
    // 农田详情
    detailsHTML = `
      <div class="info-row">
        <div class="info-label">名称：</div>
        <div class="info-value">${data.name}</div>
      </div>
      <div class="info-row">
        <div class="info-label">位置：</div>
        <div class="info-value">${data.location}</div>
      </div>
      <div class="info-row">
        <div class="info-label">面积：</div>
        <div class="info-value">${data.area}</div>
      </div>
      <div class="info-row">
        <div class="info-label">作物：</div>
        <div class="info-value">${data.crop}${data.variety ? ' ('+data.variety+')' : ''}</div>
      </div>
      <div class="info-row">
        <div class="info-label">种植时间：</div>
        <div class="info-value">${data.plantDate}</div>
      </div>
      <div class="info-row">
        <div class="info-label">生长阶段：</div>
        <div class="info-value">${data.growthStage}</div>
      </div>
      <div class="info-row">
        <div class="info-label">长势指数：</div>
        <div class="info-value">${data.growthIndex} (${data.growthStatus})</div>
      </div>
      <div class="info-row">
        <div class="info-label">预计产量：</div>
        <div class="info-value">${data.estimatedYield}</div>
      </div>
      <div class="info-row">
        <div class="info-label">权属人：</div>
        <div class="info-value">${data.owner} (${data.contact})</div>
      </div>
    `;
    
    // 针对大棚添加额外信息
    if (subtype === 'greenhouse') {
      detailsHTML += `
        <div class="info-row">
          <div class="info-label">温度：</div>
          <div class="info-value">${data.temperature}</div>
        </div>
        <div class="info-row">
          <div class="info-label">湿度：</div>
          <div class="info-value">${data.humidity}</div>
        </div>
      `;
    }
  } else {
    // 设备详情
    detailsHTML = `
      <div class="info-row">
        <div class="info-label">设备ID：</div>
        <div class="info-value">#${data.id}</div>
      </div>
      <div class="info-row">
        <div class="info-label">设备类型：</div>
        <div class="info-value">${getDeviceTypeName(subtype)}</div>
      </div>
      <div class="info-row">
        <div class="info-label">电量：</div>
        <div class="info-value">${data.battery}</div>
      </div>
      <div class="info-row">
        <div class="info-label">最后更新：</div>
        <div class="info-value">${data.lastUpdate}</div>
      </div>
      <div class="info-row">
        <div class="info-label">工作状态：</div>
        <div class="info-value">${data.status === '预警' ? 
          '<span style="color: #F5222D">'+data.status+'</span>' : data.status}</div>
      </div>
    `;
    
    // 针对不同设备类型添加特定信息
    if (subtype === 'monitor') {
      detailsHTML += `
        <div class="info-row">
          <div class="info-label">当前温度：</div>
          <div class="info-value">22.5℃</div>
        </div>
        <div class="info-row">
          <div class="info-label">当前湿度：</div>
          <div class="info-value">78%</div>
        </div>
        <div class="info-row">
          <div class="info-label">土壤水分：</div>
          <div class="info-value">65%</div>
        </div>
      `;
    } else if (subtype === 'light') {
      detailsHTML += `
        <div class="info-row">
          <div class="info-label">今日捕获：</div>
          <div class="info-value">${data.catches}只</div>
        </div>
        <div class="info-row">
          <div class="info-label">主要虫种：</div>
          <div class="info-value">稻飞虱、蚜虫</div>
        </div>
      `;
    } else if (subtype === 'trap') {
      detailsHTML += `
        <div class="info-row">
          <div class="info-label">害虫密度：</div>
          <div class="info-value">${data.status === '预警' ? 
            '<span style="color: #F5222D">高</span>' : '正常'}</div>
        </div>
        ${data.alert ? 
          `<div class="info-row">
            <div class="info-label">预警信息：</div>
            <div class="info-value"><span style="color: #F5222D">${data.alert}</span></div>
           </div>` : ''}
      `;
    }
    
    // 添加历史数据链接
    detailsHTML += `
      <div class="info-row" style="margin-top: 10px;">
        <button class="btn btn-primary btn-sm" onclick="showHistoryDataPopup('${data.id}', '${subtype}')">查看历史数据</button>
      </div>
    `;
  }
  
  // 更新详情内容
  detailInfo.innerHTML = detailsHTML;
}

/**
 * 获取设备类型名称
 */
function getDeviceTypeName(deviceType) {
  switch(deviceType) {
    case 'monitor':
      return '苗情监测设备';
    case 'light':
      return '智能杀虫灯';
    case 'trap':
      return '虫情监测仪';
    default:
      return '未知设备';
  }
}

/**
 * 显示未选择状态的友好提示
 */
function showNoSelectionMessage() {
  const detailsSection = document.querySelector('.selected-details');
  const thumbnail = detailsSection.querySelector('.thumbnail');
  const detailInfo = detailsSection.querySelector('.detail-info');
  
  if (!detailsSection || !thumbnail || !detailInfo) return;
  
  // 更新标题
  const sectionTitle = detailsSection.querySelector('.section-title');
  if (sectionTitle) {
    sectionTitle.textContent = '区域详情';
  }
  
  // 更新缩略图
  thumbnail.style.backgroundColor = '#F5F5F5';
  thumbnail.innerHTML = `
    <div style="font-size: 36px; color: #BFBFBF;">
      <i class="fas fa-map-marker-alt"></i>
    </div>
  `;
  
  // 更新详情内容
  detailInfo.innerHTML = `
    <div class="no-selection-message" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 200px; text-align: center; color: #8C8C8C;">
      <i class="fas fa-hand-pointer" style="font-size: 32px; margin-bottom: 16px;"></i>
      <p style="font-size: 16px;">请点击地图上的地块或设备查看详细信息</p>
      <p style="font-size: 14px; margin-top: 8px;">您可以选择农田地块或物联网设备，查看详细数据</p>
    </div>
  `;
}

/**
 * 初始化右侧页卡切换功能
 */
function initTabSwitch() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  if (tabButtons.length && tabContents.length) {
    // 初始化：显示第一个页卡内容，激活第一个按钮
    tabContents.forEach((content, index) => {
      if (index === 0) {
        content.classList.add('active');
      } else {
        content.classList.remove('active');
      }
    });

    tabButtons.forEach((button, index) => {
      if (index === 0) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
      
      // 添加点击事件处理
      button.addEventListener('click', function() {
        // 移除所有激活状态
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // 激活当前选中的页卡和按钮
        this.classList.add('active');
        tabContents[index].classList.add('active');
        
        // 如果是切换到图表页卡，需要重新调整图表大小
        if (tabContents[index].querySelector('#growthChart') || 
            tabContents[index].querySelector('#gaugeChart')) {
          setTimeout(() => {
            if (window.growthChart) window.growthChart.resize();
            if (window.gaugeChart) window.gaugeChart.resize();
          }, 50);
        }
      });
    });
  }
}

/**
 * 显示历史数据弹窗
 * @param {string} deviceId - 设备ID
 * @param {string} deviceType - 设备类型
 */
function showHistoryDataPopup(deviceId, deviceType) {
  // 获取已有的弹窗元素，如果不存在则创建
  let historyPopup = document.getElementById('historyDataPopup');
  if (!historyPopup) {
    historyPopup = document.createElement('div');
    historyPopup.id = 'historyDataPopup';
    historyPopup.className = 'history-data-popup';
    document.body.appendChild(historyPopup);
  }

  // 设置弹窗内容
  let title = '历史数据';
  let content = '';
  
  switch(deviceType) {
    case 'monitor':
      title = '苗情监测设备历史数据';
      content = `
        <div class="history-data-chart" id="temperatureChart" style="height: 200px;"></div>
        <div class="history-data-chart" id="humidityChart" style="height: 200px;"></div>
      `;
      break;
    case 'light':
      title = '智能杀虫灯历史数据';
      content = `
        <div class="history-data-chart" id="catchesChart" style="height: 250px;"></div>
      `;
      break;
    case 'trap':
      title = '虫情监测仪历史数据';
      content = `
        <div class="history-data-chart" id="pestDensityChart" style="height: 250px;"></div>
      `;
      break;
    default:
      content = `<p>暂无 ${deviceId} 的历史数据</p>`;
  }
  
  // 构建弹窗HTML
  historyPopup.innerHTML = `
    <div class="popup-content">
      <div class="popup-header">
        <h3 class="popup-title">${title}</h3>
        <button class="popup-close" onclick="closeHistoryPopup()">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="popup-body">
        ${content}
      </div>
      <div class="popup-footer">
        <button class="btn btn-primary" onclick="exportHistoryData('${deviceId}')">导出数据</button>
        <button class="btn btn-secondary" onclick="closeHistoryPopup()">关闭</button>
      </div>
    </div>
  `;
  
  // 显示弹窗
  historyPopup.style.display = 'flex';
  
  // 初始化图表
  setTimeout(() => {
    if (deviceType === 'monitor') {
      initTemperatureChart();
      initHumidityChart();
    } else if (deviceType === 'light') {
      initCatchesChart();
    } else if (deviceType === 'trap') {
      initPestDensityChart();
    }
  }, 100);
}

/**
 * 关闭历史数据弹窗
 */
function closeHistoryPopup() {
  const historyPopup = document.getElementById('historyDataPopup');
  if (historyPopup) {
    historyPopup.style.display = 'none';
  }
}

/**
 * 导出历史数据
 */
function exportHistoryData(deviceId) {
  alert(`正在导出设备 ${deviceId} 的历史数据，请稍候...`);
  // 实际项目中这里应该调用后端API进行数据导出
}

/**
 * 初始化温度历史图表
 */
function initTemperatureChart() {
  const chartDom = document.getElementById('temperatureChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据 - 最近7天的温度数据
  const dates = [];
  const temperatureData = [];
  
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    
    // 生成模拟温度数据，范围20-28度
    temperatureData.push((20 + Math.random() * 8).toFixed(1));
  }
  
  const option = {
    title: {
      text: '温度变化趋势(℃)',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value',
      name: '温度(℃)',
      min: 18,
      max: 30
    },
    series: [
      {
        name: '温度',
        type: 'line',
        data: temperatureData,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#FF9F43'
        },
        itemStyle: {
          color: '#FF9F43'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 159, 67, 0.5)' },
              { offset: 1, color: 'rgba(255, 159, 67, 0.1)' }
            ]
          }
        }
      }
    ]
  };
  
  chart.setOption(option);
}

/**
 * 初始化湿度历史图表
 */
function initHumidityChart() {
  const chartDom = document.getElementById('humidityChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据 - 最近7天的湿度数据
  const dates = [];
  const humidityData = [];
  const soilMoistureData = [];
  
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    
    // 生成模拟湿度数据，范围60-90%
    humidityData.push((60 + Math.random() * 30).toFixed(1));
    
    // 生成模拟土壤湿度数据，范围50-80%
    soilMoistureData.push((50 + Math.random() * 30).toFixed(1));
  }
  
  const option = {
    title: {
      text: '湿度变化趋势(%)',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['空气湿度', '土壤湿度'],
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value',
      name: '湿度(%)',
      min: 40,
      max: 100
    },
    series: [
      {
        name: '空气湿度',
        type: 'line',
        data: humidityData,
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#1890FF'
        },
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '土壤湿度',
        type: 'line',
        data: soilMoistureData,
        smooth: true,
        lineStyle: {
          width: 2,
          color: '#52C41A'
        },
        itemStyle: {
          color: '#52C41A'
        }
      }
    ]
  };
  
  chart.setOption(option);
}

/**
 * 初始化捕获数量历史图表
 */
function initCatchesChart() {
  const chartDom = document.getElementById('catchesChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据 - 最近7天的捕获数据
  const dates = [];
  const catchesData = [];
  
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    
    // 生成模拟捕获数据，范围30-70
    catchesData.push(Math.floor(30 + Math.random() * 40));
  }
  
  const option = {
    title: {
      text: '每日捕获数量统计',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value',
      name: '捕获数量(只)'
    },
    series: [
      {
        name: '捕获数量',
        type: 'bar',
        data: catchesData,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#FAAD14' },
              { offset: 1, color: '#FFD591' }
            ]
          }
        },
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}只'
        }
      }
    ]
  };
  
  chart.setOption(option);
}

/**
 * 初始化害虫密度历史图表
 */
function initPestDensityChart() {
  const chartDom = document.getElementById('pestDensityChart');
  if (!chartDom) return;
  
  const chart = echarts.init(chartDom);
  
  // 模拟数据 - 最近30天的害虫密度数据
  const dates = [];
  const densityData = [];
  const warningLine = [];
  
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    
    // 生成模拟密度数据，一般在0.2-0.6之间，但最后几天有高峰
    let density;
    if (i < 3) {
      density = (0.6 + Math.random() * 0.3).toFixed(2);
    } else {
      density = (0.2 + Math.random() * 0.4).toFixed(2);
    }
    densityData.push(density);
    
    // 预警线固定在0.7
    warningLine.push(0.7);
  }
  
  const option = {
    title: {
      text: '害虫密度变化趋势',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['害虫密度', '预警阈值'],
      bottom: 0
    },
    xAxis: {
      type: 'category',
      data: dates
    },
    yAxis: {
      type: 'value',
      name: '密度指数',
      min: 0,
      max: 1
    },
    series: [
      {
        name: '害虫密度',
        type: 'line',
        data: densityData,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#1890FF'
        },
        itemStyle: {
          color: '#1890FF'
        },
        markPoint: {
          data: [
            { type: 'max', name: '最大值' }
          ]
        }
      },
      {
        name: '预警阈值',
        type: 'line',
        data: warningLine,
        lineStyle: {
          width: 2,
          color: '#F5222D',
          type: 'dashed'
        },
        itemStyle: {
          color: '#F5222D'
        }
      }
    ]
  };
  
  chart.setOption(option);
} 