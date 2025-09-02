/**
 * 农情遥感系统大屏 - 灾害定损功能模块
 * 功能：灾害监测、损失预测、预警管理、应急响应
 */

// ===== 页面导航功能 =====

/**
 * 导航到指定页面
 */
function navigateToPage(pageUrl) {
    console.log(`🚀 导航到页面: ${pageUrl}`);
    window.location.href = pageUrl;
}

// ===== 全局变量 =====
let disasterCharts = {
    lossPredictionChart: null,
    historicalDisasterChart: null,
    disasterDistributionChart: null
};

// 旧的entity图层已删除，现在使用imagery图层方式

let currentMonitoringConfig = {
    type: null,           // null (未选中), temperature, drought, comprehensive
    crop: 'wheat',        // wheat, corn, vegetables, potato, rapeseed
    time: 'current',      // current, week, month, season, year
    opacity: 85
};

// 灾害弹窗相关变量
let disasterTooltip = null;
let disasterMouseHandler = null;

// ===== 系统初始化 =====

/**
 * 初始化灾害监测系统
 */
function initDisasterMonitoring() {
    console.log('🚨 初始化灾害监测系统...');
    
    // 初始化控制面板
    initDisasterControlPanel();
    
    // 初始化图表
    initDisasterCharts();
    
    // 初始化地图图层 (会自动处理Cesium未就绪的情况)
    initDisasterLayers();
    
    // 初始化实时数据更新
    initRealTimeUpdates();
    
    // 初始化灾害弹窗
    initDisasterTooltip();
    
    console.log('✅ 灾害监测系统初始化完成');
}

// 页面加载完成后自动初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM内容加载完成');
    // 延迟一点时间确保其他脚本加载完成
    setTimeout(() => {
        console.log('⏰ 开始初始化灾害监测系统');
        initDisasterMonitoring();
    }, 500);
});

// 备用初始化 - 如果DOMContentLoaded没有触发
window.addEventListener('load', function() {
    console.log('🌐 页面完全加载完成');
    // 检查是否已经初始化过
    if (!document.querySelector('.control-collapse-btn')?.hasAttribute('data-initialized')) {
        console.log('🔄 备用初始化触发');
        setTimeout(() => {
            initDisasterMonitoring();
        }, 100);
    }
});

// ===== 控制面板管理 =====

/**
 * 初始化灾害控制面板
 */
function initDisasterControlPanel() {
    console.log('🔧 初始化灾害控制面板...');
    
    // 控制面板折叠功能
    const collapseBtn = document.querySelector('.control-collapse-btn');
    const controlPanel = document.querySelector('.disaster-control-panel');
    const controlContent = document.querySelector('.control-content');
    
    console.log('🔍 查找DOM元素:', {
        collapseBtn: !!collapseBtn,
        controlPanel: !!controlPanel,
        controlContent: !!controlContent
    });
    
    if (collapseBtn && controlPanel) {
        console.log('✅ 添加折叠按钮事件监听器');
        
        collapseBtn.addEventListener('click', function(e) {
            console.log('🖱️ 折叠按钮被点击');
            e.preventDefault();
            e.stopPropagation();
            
            controlPanel.classList.toggle('collapsed');
            
            if (controlPanel.classList.contains('collapsed')) {
                // 收起状态
                console.log('📦 面板收起');
                this.textContent = '▶';
                if (controlContent) {
                    controlContent.style.display = 'none';
                }
            } else {
                // 展开状态
                console.log('📂 面板展开');
                this.textContent = '▼';
                if (controlContent) {
                    controlContent.style.display = 'block';
                }
            }
        });
        
        // 标记已初始化
        collapseBtn.setAttribute('data-initialized', 'true');
        
        // 也可以点击整个header来切换
        const controlHeader = document.querySelector('.control-header');
        if (controlHeader) {
            controlHeader.addEventListener('click', function(e) {
                // 只有点击header本身时才触发，避免与按钮冲突
                if (e.target === this || e.target.classList.contains('control-title')) {
                    console.log('🖱️ 控制面板头部被点击');
                    collapseBtn.click();
                }
            });
        }
    } else {
        console.error('❌ 找不到控制面板DOM元素:', {
            collapseBtn: collapseBtn,
            controlPanel: controlPanel
        });
    }
    
    // 监测类型切换
    initMonitoringTypeSelector();
    
    // 作物选择器
    initCropSelector();
    
    // 时间选择器
    initTimeSelector();
    
    // 透明度控制
    initOpacityControl();
}

/**
 * 初始化监测类型选择器
 */
function initMonitoringTypeSelector() {
    const typeButtons = document.querySelectorAll('.type-btn');
    
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const layerType = this.dataset.type;
            const isCurrentlyActive = this.classList.contains('active');
            const statusIndicator = this.querySelector('.layer-status');
            
            if (isCurrentlyActive) {
                // 当前按钮已激活，点击则取消选中
                this.classList.remove('active');
                if (statusIndicator) {
                    statusIndicator.classList.remove('active');
                }
                
                // 隐藏图层
                toggleDisasterLayer(layerType, false);
                currentActiveDisasterLayer = null;
                currentMonitoringConfig.type = null;
                
                console.log(`❌ 取消选中监测类型: ${layerType}`);
            } else {
                // 先取消其他按钮的选中状态
                typeButtons.forEach(b => {
                    b.classList.remove('active');
                    const otherStatusIndicator = b.querySelector('.layer-status');
                    if (otherStatusIndicator) {
                        otherStatusIndicator.classList.remove('active');
                    }
                    
                    // 隐藏其他图层
                    const otherLayerType = b.dataset.type;
                    if (otherLayerType !== layerType) {
                        toggleDisasterLayer(otherLayerType, false);
                    }
                });
                
                // 激活当前按钮
                this.classList.add('active');
                if (statusIndicator) {
                    statusIndicator.classList.add('active');
                }
                
                // 更新配置
                currentMonitoringConfig.type = layerType;
                
                // 显示对应图层
                toggleDisasterLayer(layerType, true);
                
                console.log(`✅ 选中监测类型: ${layerType}`);
            }
            
            // 更新图表数据
            updateChartsData();
        });
    });
}

/**
 * 初始化作物选择器
 */
function initCropSelector() {
    const cropButtons = document.querySelectorAll('.crop-btn');
    
    cropButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            cropButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 更新配置
            currentMonitoringConfig.crop = this.dataset.crop;
            
            // 更新图层过滤
            updateLayerFilter(currentMonitoringConfig.crop);
            
            // 更新图表数据
            updateChartsData();
            
            console.log(`切换监测作物: ${currentMonitoringConfig.crop}`);
        });
    });
}

/**
 * 初始化时间选择器
 */
function initTimeSelector() {
    const timeSelect = document.getElementById('monitoring-time');
    
    if (timeSelect) {
        timeSelect.addEventListener('change', function() {
            currentMonitoringConfig.time = this.value;
            
            // 更新时间范围
            updateTimeRange(currentMonitoringConfig.time);
            
            // 更新图表数据
            updateChartsData();
            
            console.log(`切换时间范围: ${currentMonitoringConfig.time}`);
        });
    }
}

/**
 * 初始化透明度控制
 */
function initOpacityControl() {
    const opacitySlider = document.getElementById('layer-opacity');
    const opacityValue = document.querySelector('.opacity-value');
    
    if (opacitySlider && opacityValue) {
        opacitySlider.addEventListener('input', function() {
            const opacity = parseInt(this.value);
            currentMonitoringConfig.opacity = opacity;
            
            // 更新显示
            opacityValue.textContent = `${opacity}%`;
            
            // 更新图层透明度
            updateLayerOpacity(opacity);
            
            console.log(`调整图层透明度: ${opacity}%`);
        });
    }
}

// ===== 地图图层管理 =====

// 灾害图层状态管理
let disasterLayerStates = {
    temperature: { opacity: 0.85, visible: false },
    drought: { opacity: 0.85, visible: false },
    comprehensive: { opacity: 0.85, visible: false }
};

let currentActiveDisasterLayer = null;

/**
 * 初始化灾害监测图层系统
 */
function initDisasterLayers() {
    if (!window.cesiumViewer) {
        console.warn('⚠️ Cesium viewer 未找到，延迟初始化图层...');
        // 延迟重试初始化
        setTimeout(() => {
            initDisasterLayers();
        }, 1000);
        return;
    }
    
    console.log('✅ 灾害监测图层系统初始化完成');
}

/**
 * 切换灾害图层显示 (参考气象图层实现)
 */
function toggleDisasterLayer(layerType, visible) {
    if (!window.cesiumViewer) {
        console.warn('❌ Cesium Viewer未初始化');
        return;
    }
    
    // 获取或创建灾害图层
    let existingLayer = null;
    
    // 查找现有图层
    for (let i = 0; i < window.cesiumViewer.imageryLayers.length; i++) {
        const layer = window.cesiumViewer.imageryLayers.get(i);
        if (layer._name === `disaster_${layerType}`) {
            existingLayer = layer;
            break;
        }
    }
    
    if (visible) {
        if (!existingLayer) {
            // 创建新的灾害图层
            existingLayer = createDisasterLayer(layerType);
            if (existingLayer) {
                existingLayer._name = `disaster_${layerType}`;
                window.cesiumViewer.imageryLayers.add(existingLayer);
                console.log(`✅ 已添加灾害图层: ${layerType}`);
            }
        }
        if (existingLayer) {
            existingLayer.show = true;
            console.log(`👁️ 显示灾害图层: ${layerType}`);
        }
    } else {
        if (existingLayer) {
            existingLayer.show = false;
            console.log(`🙈 隐藏灾害图层: ${layerType}`);
        }
    }
    
    // 更新状态
    disasterLayerStates[layerType].visible = visible;
    console.log(`🚨 ${layerType}图层${visible ? '显示' : '隐藏'}`);
}

/**
 * 创建灾害图层 (参考气象图层实现)
 */
function createDisasterLayer(layerType) {
    if (!window.cesiumViewer) {
        console.warn('❌ Cesium Viewer未初始化');
        return null;
    }
    
    let imageryProvider = null;
    
    try {
        switch (layerType) {
            case 'temperature':
                // 高温/冻害图层
                console.log('🌡️ 创建高温/冻害栅格图层...');
                imageryProvider = createDisasterRasterLayer('temperature');
                break;
                
            case 'drought':
                // 干旱监测图层
                console.log('💧 创建干旱监测栅格图层...');
                imageryProvider = createDisasterRasterLayer('drought');
                break;
                
            case 'comprehensive':
                // 综合评估图层
                console.log('📊 创建综合评估栅格图层...');
                imageryProvider = createDisasterRasterLayer('comprehensive');
                break;
                
            default:
                console.warn(`❌ 未知的灾害图层类型: ${layerType}`);
                return null;
        }
        
        if (imageryProvider) {
            const layer = new Cesium.ImageryLayer(imageryProvider);
            layer.alpha = disasterLayerStates[layerType]?.opacity || 0.7;
            return layer;
        }
        
    } catch (error) {
        console.error(`❌ 创建灾害图层失败 (${layerType}):`, error);
    }
    
    return null;
}

/**
 * 创建灾害栅格图层 (参考气象栅格图层实现)
 */
function createDisasterRasterLayer(layerType) {
    console.log(`🎨 开始创建 ${layerType} 灾害栅格图层...`);
    
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    
    // 创建ImageData对象，直接操作像素数据
    const imageData = context.createImageData(1024, 1024);
    const data = imageData.data;
    
    switch(layerType) {
        case 'temperature':
            // 高温/冻害 - 红色系，集中高风险区域
            drawPixelTemperatureRisk(data, '#FF0000');
            break;
        case 'drought':
            // 干旱监测 - 橙色系，干旱分布模式
            drawPixelDroughtRisk(data, '#FF8C00');
            break;
        case 'comprehensive':
            // 综合评估 - 紫色系，综合风险模式
            drawPixelComprehensiveRisk(data, '#8B008B');
            break;
        default:
            return createSimulatedDisasterLayer('未知', '#888888', 0.5);
    }
    
    // 将像素数据绘制到画布
    context.putImageData(imageData, 0, 0);
    
    const dataUrl = canvas.toDataURL();
    console.log(`✅ ${layerType} 灾害栅格图层创建成功`);
    
    return new Cesium.SingleTileImageryProvider({
        url: dataUrl,
        rectangle: Cesium.Rectangle.fromDegrees(102.5, 34.5, 104.5, 36.5),
        credit: `${layerType}灾害监测数据`
    });
}

/**
 * 切换灾害图层显示 (更新原有函数以兼容新的实现)
 */
function switchDisasterLayer(layerType) {
    // 如果layerType为null，隐藏所有图层
    if (!layerType) {
        if (currentActiveDisasterLayer) {
            toggleDisasterLayer(currentActiveDisasterLayer, false);
            disasterLayerStates[currentActiveDisasterLayer].visible = false;
            currentActiveDisasterLayer = null;
        }
        console.log(`❌ 隐藏所有灾害图层`);
        return;
    }
    
    // 隐藏当前活跃图层
    if (currentActiveDisasterLayer && currentActiveDisasterLayer !== layerType) {
        toggleDisasterLayer(currentActiveDisasterLayer, false);
        disasterLayerStates[currentActiveDisasterLayer].visible = false;
    }
    
    // 显示新图层
    toggleDisasterLayer(layerType, true);
    disasterLayerStates[layerType].visible = true;
    currentActiveDisasterLayer = layerType;
    
    console.log(`✅ 切换到灾害图层: ${layerType}`);
}

/**
 * 更新图层过滤器
 */
function updateLayerFilter(cropType) {
    // 根据作物类型过滤显示内容
    console.log(`更新图层过滤器: ${cropType}`);
    
    // 根据不同作物类型调整图层显示
    const cropInfo = {
        wheat: { name: '小麦', icon: '🌾', riskFactor: 1.0 },
        corn: { name: '玉米', icon: '🌽', riskFactor: 0.9 },
        vegetables: { name: '蔬菜', icon: '🥬', riskFactor: 1.2 },
        potato: { name: '土豆', icon: '🥔', riskFactor: 0.8 },
        rapeseed: { name: '油菜', icon: '🌻', riskFactor: 1.1 }
    };
    
    const currentCrop = cropInfo[cropType];
    if (currentCrop) {
        console.log(`✅ 切换到作物: ${currentCrop.name} ${currentCrop.icon} (风险系数: ${currentCrop.riskFactor})`);
        
        // 这里可以根据作物类型调整图层的显示强度或颜色
        // 例如：蔬菜类作物可能对某些灾害更敏感
        
        // 更新图表数据以反映选定作物的风险
        updateChartsData();
    } else {
        console.warn(`⚠️ 未知的作物类型: ${cropType}`);
    }
}

/**
 * 更新图层透明度
 */
function updateLayerOpacity(opacity) {
    const alpha = opacity / 100;
    
    if (!window.cesiumViewer) {
        console.warn('❌ Cesium Viewer未初始化');
        return;
    }
    
    // 更新当前活跃图层的透明度
    if (currentActiveDisasterLayer) {
        // 查找对应的图层
        for (let i = 0; i < window.cesiumViewer.imageryLayers.length; i++) {
            const layer = window.cesiumViewer.imageryLayers.get(i);
            if (layer._name === `disaster_${currentActiveDisasterLayer}`) {
                layer.alpha = alpha;
                console.log(`🎨 ${currentActiveDisasterLayer}图层透明度设置为: ${opacity}%`);
                
                // 更新状态
                disasterLayerStates[currentActiveDisasterLayer].opacity = alpha;
                return;
            }
        }
    } else {
        console.log(`⚠️ 没有活跃的灾害图层，透明度设置将在选择图层后生效`);
    }
    
    // 更新所有图层状态的透明度设置
    Object.keys(disasterLayerStates).forEach(layerType => {
        disasterLayerStates[layerType].opacity = alpha;
    });
    
    console.log(`更新图层透明度配置: ${opacity}%`);
}

/**
 * 更新时间范围
 */
function updateTimeRange(timeRange) {
    // 根据时间范围更新数据
    console.log(`更新时间范围: ${timeRange}`);
    
    // 这里可以实现时间范围数据过滤逻辑
}

// ===== 图表管理 =====

/**
 * 初始化灾害监测图表
 */
function initDisasterCharts() {
    if (typeof echarts === 'undefined') {
        console.error('❌ ECharts library not loaded');
        return;
    }
    
    console.log('📊 初始化灾害监测图表...');
    
    // 初始化损失预测图表
    initLossPredictionChart();
    
    // 初始化历史灾害对比图表
    initHistoricalDisasterChart();
    
    // 初始化灾害分布统计图表
    initDisasterDistributionChart();
    
    console.log('✅ 灾害监测图表初始化完成');
}

/**
 * 初始化损失预测图表
 */
function initLossPredictionChart() {
    const container = document.getElementById('loss-prediction-chart');
    if (!container) return;
    
    disasterCharts.lossPredictionChart = echarts.init(container);
    
    // 清空并使用默认的面积图表配置
    disasterCharts.lossPredictionChart.clear();
    const defaultOption = getLossAreaChartOption();
    disasterCharts.lossPredictionChart.setOption(defaultOption);
    
    // 图表切换功能
    initLossChartSwitcher();
    
    // 初始化时更新汇总数据为面积类型
    setTimeout(() => {
        updatePredictionSummary('area');
    }, 100);
    
    console.log('📊 损失预测图表初始化完成 - 默认显示面积数据');
}

/**
 * 初始化历史灾害对比图表
 */
function initHistoricalDisasterChart() {
    const container = document.getElementById('historical-disaster-chart');
    if (!container) return;
    
    disasterCharts.historicalDisasterChart = echarts.init(container);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#ffffff' }
        },
        grid: {
            left: '15%',
            right: '10%',
            bottom: '15%',
            top: '10%'
        },
        xAxis: {
            type: 'category',
            data: ['2020', '2021', '2022', '2023', '2024'],
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { color: 'rgba(255, 255, 255, 0.8)' }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { color: 'rgba(255, 255, 255, 0.8)' },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [
            {
                name: '受灾面积',
                type: 'line',
                data: [1200, 1450, 980, 1780, 1939],
                smooth: true,
                lineStyle: {
                    color: '#00D4FF',
                    width: 3
                },
                itemStyle: {
                    color: '#00D4FF',
                    borderWidth: 2,
                    borderColor: '#ffffff'
                },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                        { offset: 1, color: 'rgba(0, 212, 255, 0.1)' }
                    ])
                }
            }
        ]
    };
    
    disasterCharts.historicalDisasterChart.setOption(option);
}

/**
 * 初始化灾害分布统计图表
 */
function initDisasterDistributionChart() {
    const container = document.getElementById('disaster-distribution-chart');
    if (!container) return;
    
    disasterCharts.disasterDistributionChart = echarts.init(container);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} 亩 ({d}%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#ffffff' }
        },
        series: [
            {
                name: '灾害类型分布',
                type: 'pie',
                radius: ['30%', '70%'],
                center: ['50%', '50%'],
                data: [
                    {
                        value: 1245,
                        name: '高温/冻害',
                        itemStyle: { color: '#F44336' }
                    },
                    {
                        value: 694,
                        name: '干旱灾害',
                        itemStyle: { color: '#2196F3' }
                    }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 212, 255, 0.5)'
                    }
                },
                label: {
                    color: '#ffffff',
                    fontSize: 12
                },
                labelLine: {
                    lineStyle: { color: 'rgba(255, 255, 255, 0.5)' }
                }
            }
        ]
    };
    
    disasterCharts.disasterDistributionChart.setOption(option);
}

/**
 * 初始化损失图表切换器
 */
function initLossChartSwitcher() {
    const chartContainer = document.getElementById('loss-prediction-chart');
    if (!chartContainer || !chartContainer.parentElement) {
        console.warn('⚠️ 损失预测图表容器未找到');
        return;
    }
    
    const switchButtons = chartContainer.parentElement.querySelectorAll('.switch-btn');
    
    if (switchButtons.length === 0) {
        console.warn('⚠️ 图表切换按钮未找到');
        return;
    }
    
    switchButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 更新按钮状态
            switchButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 根据类型更新图表数据
            const chartType = this.dataset.type;
            updateLossPredictionData(chartType);
        });
    });
    
    console.log('✅ 损失图表切换器初始化完成');
}

/**
 * 更新损失预测数据
 */
function updateLossPredictionData(type) {
    if (!disasterCharts.lossPredictionChart) return;
    
    let chartOption;
    
    switch (type) {
        case 'area':
            chartOption = getLossAreaChartOption();
            break;
        case 'yield':
            chartOption = getLossYieldChartOption();
            break;
        case 'economic':
            chartOption = getLossEconomicChartOption();
            break;
        default:
            chartOption = getLossAreaChartOption();
    }
    
    // 完全清空并重新设置图表，确保不会显示多个系列
    disasterCharts.lossPredictionChart.clear();
    disasterCharts.lossPredictionChart.setOption(chartOption);
    console.log(`📊 损失预测图表已切换到: ${type}`);
    
    // 更新汇总数据
    updatePredictionSummary(type);
}

/**
 * 获取受灾面积图表配置
 */
function getLossAreaChartOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#ffffff' },
            formatter: function(params) {
                const value = params[0].value;
                return `${params[0].name}<br/>受灾面积: ${value.toLocaleString()} 亩`;
            }
        },
        grid: {
            left: '15%',
            right: '10%',
            bottom: '20%',
            top: '15%'
        },
        xAxis: {
            type: 'category',
            data: ['轻微', '中等', '严重', '极严重'],
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            name: '受灾面积 (亩)',
            nameTextStyle: { 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 10
            },
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10,
                formatter: function(value) {
                    return value >= 1000 ? (value/1000).toFixed(1) + 'k' : value;
                }
            },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [
            {
                name: '受灾面积',
                type: 'bar',
                data: [156, 324, 567, 892],
                barWidth: '60%',
                itemStyle: {
                    color: function(params) {
                        const colors = ['#4CAF50', '#FFC107', '#FF9800', '#F44336'];
                        return colors[params.dataIndex];
                    },
                    borderRadius: [3, 3, 0, 0]
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#ffffff',
                    fontSize: 10,
                    formatter: function(params) {
                        return params.value >= 1000 ? (params.value/1000).toFixed(1) + 'k' : params.value;
                    }
                }
            }
        ]
    };
}

/**
 * 获取产量损失图表配置
 */
function getLossYieldChartOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#ffffff' },
            formatter: function(params) {
                const value = params[0].value;
                return `${params[0].name}<br/>产量损失: ${value.toLocaleString()} 吨`;
            }
        },
        grid: {
            left: '15%',
            right: '10%',
            bottom: '20%',
            top: '15%'
        },
        xAxis: {
            type: 'category',
            data: ['轻微', '中等', '严重', '极严重'],
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            name: '产量损失 (吨)',
            nameTextStyle: { 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 10
            },
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10
            },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [
            {
                name: '产量损失',
                type: 'bar',
                data: [45.2, 89.7, 156.2, 234.5],
                barWidth: '60%',
                itemStyle: {
                    color: function(params) {
                        const colors = ['#81C784', '#FFB74D', '#FF8A65', '#E57373'];
                        return colors[params.dataIndex];
                    },
                    borderRadius: [3, 3, 0, 0]
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#ffffff',
                    fontSize: 10,
                    formatter: function(params) {
                        return params.value.toFixed(1);
                    }
                }
            }
        ]
    };
}

/**
 * 获取经济损失图表配置
 */
function getLossEconomicChartOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#ffffff' },
            formatter: function(params) {
                const value = params[0].value;
                return `${params[0].name}<br/>经济损失: ${value.toLocaleString()} 万元`;
            }
        },
        grid: {
            left: '15%',
            right: '10%',
            bottom: '20%',
            top: '15%'
        },
        xAxis: {
            type: 'category',
            data: ['轻微', '中等', '严重', '极严重'],
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            name: '经济损失 (万元)',
            nameTextStyle: { 
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 10
            },
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            axisLabel: { 
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10
            },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: [
            {
                name: '经济损失',
                type: 'bar',
                data: [25.8, 67.4, 132.8, 186.7],
                barWidth: '60%',
                itemStyle: {
                    color: function(params) {
                        const colors = ['#66BB6A', '#FFA726', '#FF7043', '#EF5350'];
                        return colors[params.dataIndex];
                    },
                    borderRadius: [3, 3, 0, 0]
                },
                label: {
                    show: true,
                    position: 'top',
                    color: '#ffffff',
                    fontSize: 10,
                    formatter: function(params) {
                        return params.value.toFixed(1);
                    }
                }
            }
        ]
    };
}

/**
 * 更新损失预测汇总数据
 */
function updatePredictionSummary(type) {
    const summaryItems = document.querySelectorAll('.prediction-summary .summary-item');
    if (summaryItems.length < 3) return;
    
    let summaryData;
    
    switch (type) {
        case 'area':
            summaryData = {
                area: { value: '1,939 亩', label: '受灾面积' },
                affected: { value: '325.6 万平米', label: '影响范围' },
                coverage: { value: '65.2%', label: '覆盖率' }
            };
            break;
        case 'yield':
            summaryData = {
                area: { value: '325.6 吨', label: '产量损失' },
                affected: { value: '186.7 万元', label: '等值损失' },
                coverage: { value: '42.8%', label: '损失率' }
            };
            break;
        case 'economic':
            summaryData = {
                area: { value: '186.7 万元', label: '经济损失' },
                affected: { value: '325.6 吨', label: '等值产量' },
                coverage: { value: '12.3%', label: 'GDP占比' }
            };
            break;
        default:
            return;
    }
    
    // 更新第一个汇总项
    if (summaryItems[0]) {
        const label = summaryItems[0].querySelector('.summary-label');
        const value = summaryItems[0].querySelector('.summary-value');
        if (label) label.textContent = summaryData.area.label;
        if (value) {
            value.textContent = summaryData.area.value;
            value.className = 'summary-value danger'; // 保持原有样式
        }
    }
    
    // 更新第二个汇总项
    if (summaryItems[1]) {
        const label = summaryItems[1].querySelector('.summary-label');
        const value = summaryItems[1].querySelector('.summary-value');
        if (label) label.textContent = summaryData.affected.label;
        if (value) {
            value.textContent = summaryData.affected.value;
            value.className = 'summary-value warning'; // 保持原有样式
        }
    }
    
    // 更新第三个汇总项
    if (summaryItems[2]) {
        const label = summaryItems[2].querySelector('.summary-label');
        const value = summaryItems[2].querySelector('.summary-value');
        if (label) label.textContent = summaryData.coverage.label;
        if (value) {
            value.textContent = summaryData.coverage.value;
            value.className = type === 'economic' ? 'summary-value warning' : 'summary-value danger';
        }
    }
    
    console.log(`📊 损失预测汇总数据已更新为: ${type}`);
}

/**
 * 更新所有图表数据
 */
function updateChartsData() {
    // 根据当前配置更新所有图表数据
    console.log('更新图表数据...', currentMonitoringConfig);
    
    // 这里可以根据配置从API获取新数据并更新图表
    // 目前使用模拟数据
}

// ===== 像素级图层绘制函数 (参考气象图层实现) =====

/**
 * 绘制像素级高温/冻害风险数据
 */
function drawPixelTemperatureRisk(data, baseColor) {
    const hexColor = baseColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % 1024;
        const y = Math.floor((i / 4) / 1024);
        
        // 创建高温风险区域模式 - 集中分布
        const centerX1 = 300, centerY1 = 400; // 第一个高风险区域
        const centerX2 = 700, centerY2 = 600; // 第二个高风险区域
        
        const dist1 = Math.sqrt((x - centerX1) ** 2 + (y - centerY1) ** 2);
        const dist2 = Math.sqrt((x - centerX2) ** 2 + (y - centerY2) ** 2);
        
        let intensity = 0;
        if (dist1 < 150) {
            intensity = Math.max(intensity, 0.95 - (dist1 / 150) * 0.5);
        }
        if (dist2 < 120) {
            intensity = Math.max(intensity, 0.9 - (dist2 / 120) * 0.4);
        }
        
        // 添加一些随机噪声增加真实感
        intensity += (Math.random() - 0.5) * 0.05;
        intensity = Math.max(0, Math.min(1, intensity));
        
        if (intensity > 0.05) {
            // 增强颜色饱和度和亮度
            data[i] = Math.min(255, Math.floor(r * intensity * 1.2));     // Red - 增强
            data[i + 1] = Math.floor(g * intensity * 0.3); // Green - 降低绿色
            data[i + 2] = Math.floor(b * intensity * 0.3); // Blue - 降低蓝色
            data[i + 3] = Math.floor(255 * intensity * 0.95); // Alpha - 更不透明
        } else {
            data[i + 3] = 0; // 完全透明
        }
    }
}

/**
 * 绘制像素级干旱风险数据
 */
function drawPixelDroughtRisk(data, baseColor) {
    const hexColor = baseColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % 1024;
        const y = Math.floor((i / 4) / 1024);
        
        // 创建干旱区域模式 - 条带状分布
        const bandY1 = 200, bandY2 = 500, bandY3 = 800;
        let intensity = 0;
        
        // 三个干旱带 - 扩大范围，增强强度
        if (Math.abs(y - bandY1) < 100) {
            intensity = Math.max(intensity, 0.85 - Math.abs(y - bandY1) / 100 * 0.3);
        }
        if (Math.abs(y - bandY2) < 120) {
            intensity = Math.max(intensity, 0.9 - Math.abs(y - bandY2) / 120 * 0.4);
        }
        if (Math.abs(y - bandY3) < 90) {
            intensity = Math.max(intensity, 0.8 - Math.abs(y - bandY3) / 90 * 0.3);
        }
        
        // 添加横向变化
        intensity *= (0.85 + 0.3 * Math.sin(x / 180));
        intensity += (Math.random() - 0.5) * 0.08;
        intensity = Math.max(0, Math.min(1, intensity));
        
        if (intensity > 0.08) {
            // 增强橙色，减少其他颜色
            data[i] = Math.min(255, Math.floor(r * intensity * 1.1));     // Red - 增强
            data[i + 1] = Math.min(255, Math.floor(g * intensity * 0.8)); // Green - 保持橙色
            data[i + 2] = Math.floor(b * intensity * 0.2); // Blue - 大幅降低
            data[i + 3] = Math.floor(255 * intensity * 0.9); // Alpha - 更不透明
        } else {
            data[i + 3] = 0;
        }
    }
}

/**
 * 绘制像素级综合风险数据
 */
function drawPixelComprehensiveRisk(data, baseColor) {
    const hexColor = baseColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % 1024;
        const y = Math.floor((i / 4) / 1024);
        
        // 创建综合风险模式 - 多中心叠加
        let intensity = 0;
        
        // 多个风险中心 - 增强强度和范围
        const centers = [
            {x: 200, y: 300, radius: 180, strength: 0.95},
            {x: 500, y: 200, radius: 150, strength: 0.85},
            {x: 800, y: 400, radius: 130, strength: 0.9},
            {x: 400, y: 700, radius: 200, strength: 0.98}
        ];
        
        centers.forEach(center => {
            const dist = Math.sqrt((x - center.x) ** 2 + (y - center.y) ** 2);
            if (dist < center.radius) {
                intensity = Math.max(intensity, center.strength * (1 - dist / center.radius * 0.8));
            }
        });
        
        // 添加波纹效果
        intensity *= (0.8 + 0.25 * Math.sin((x + y) / 40));
        intensity += (Math.random() - 0.5) * 0.06;
        intensity = Math.max(0, Math.min(1, intensity));
        
        if (intensity > 0.08) {
            // 增强紫色效果
            data[i] = Math.min(255, Math.floor(r * intensity * 0.9));     // Red - 保持紫色
            data[i + 1] = Math.floor(g * intensity * 0.2); // Green - 降低
            data[i + 2] = Math.min(255, Math.floor(b * intensity * 1.1)); // Blue - 增强紫色
            data[i + 3] = Math.floor(255 * intensity * 0.92); // Alpha - 更不透明
        } else {
            data[i + 3] = 0;
        }
    }
}

/**
 * 创建简化的模拟图层 (备用方案)
 */
function createSimulatedDisasterLayer(name, color, opacity) {
    console.log(`🔄 创建简化${name}图层...`);
    
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    // 简单的渐变效果
    const gradient = context.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, color + '80'); // 50% 透明度
    gradient.addColorStop(1, color + '00'); // 完全透明
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, 512, 512);
    
    const dataUrl = canvas.toDataURL();
    
    return new Cesium.SingleTileImageryProvider({
        url: dataUrl,
        rectangle: Cesium.Rectangle.fromDegrees(102.5, 34.5, 104.5, 36.5),
        credit: `简化${name}数据`
    });
}

// ===== 实时数据更新 =====

/**
 * 初始化实时数据更新
 */
function initRealTimeUpdates() {
    // 每30秒更新一次数据
    setInterval(() => {
        updateRealTimeData();
    }, 30000);
    
    // 初始化自动滚动
    initAutoScroll();
    
    console.log('⏰ 实时数据更新已启动');
}

/**
 * 初始化自动滚动功能（已替换为丝滑滚动）
 */
function initAutoScroll() {
    console.log('🔄 使用新的丝滑滚动方案');
}

/**
 * 更新实时数据
 */
function updateRealTimeData() {
    // 更新预警信息
    updateAlertData();
    
    // 更新统计数据
    updateStatisticsData();
    
    // 更新图层数据
    updateLayerData();
    
    console.log('🔄 实时数据已更新');
}

/**
 * 更新预警数据
 */
function updateAlertData() {
    // 模拟预警数据更新
    const alertCount = document.querySelector('.alert-badge');
    if (alertCount) {
        const currentCount = parseInt(alertCount.textContent);
        // 随机更新预警数量
        const newCount = Math.max(0, currentCount + Math.floor(Math.random() * 3) - 1);
        alertCount.textContent = newCount;
    }
}

/**
 * 更新统计数据
 */
function updateStatisticsData() {
    // 更新损失预测数据
    const summaryValues = document.querySelectorAll('.summary-value');
    summaryValues.forEach(elem => {
        if (elem.textContent.includes('亩')) {
            const current = parseFloat(elem.textContent.replace(/[^\d.]/g, ''));
            const variation = (Math.random() - 0.5) * 0.1; // ±5%变化
            const newValue = Math.max(0, current * (1 + variation));
            elem.textContent = `${newValue.toFixed(0)} 亩`;
        }
    });
}

/**
 * 更新图层数据
 */
function updateLayerData() {
    // 模拟图层数据更新
    // 在实际应用中，这里会从API获取最新的遥感数据
    console.log('更新图层数据...');
}

// ===== 窗口大小调整 =====

/**
 * 处理窗口大小变化
 */
function handleWindowResize() {
    // 重新调整图表大小
    Object.values(disasterCharts).forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
}

// ===== 事件监听器 =====
window.addEventListener('resize', handleWindowResize);

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保其他模块已加载
    setTimeout(() => {
        initDisasterMonitoring();
    }, 1000);
    
    // 备用自动滚动初始化
    setTimeout(() => {
        initSimpleAutoScroll();
    }, 3000);
});

/**
 * 丝滑连续滚动（主要方案）
 */
function initSimpleAutoScroll() {
    const alertList = document.querySelector('.alert-list');
    if (!alertList) {
        console.warn('⚠️ 预警列表未找到');
        return;
    }
    
    const totalItems = alertList.querySelectorAll('.alert-item').length;
    if (totalItems <= 3) {
        console.log('📏 内容不足，无需滚动');
        return;
    }
    
    let isHovered = false;
    let scrollPosition = 0;
    const maxScroll = alertList.scrollHeight - alertList.clientHeight;
    const scrollSpeed = 0.3; // 每次滚动的像素数（更丝滑）
    const scrollInterval = 30; // 滚动间隔（毫秒，更频繁更平滑）
    const pauseTime = 1500; // 每条预警停留时间（毫秒）
    
    let isPaused = false;
    let pauseTimeout = null;
    
    // 鼠标交互事件
    alertList.addEventListener('mouseenter', () => {
        isHovered = true;
    });
    
    alertList.addEventListener('mouseleave', () => {
        isHovered = false;
    });
    
    // 丝滑滚动函数
    function smoothScroll() {
        if (isHovered || isPaused) return;
        
        scrollPosition += scrollSpeed;
        
        // 到达底部时重置
        if (scrollPosition >= maxScroll) {
            scrollPosition = 0;
            // 到底部后暂停一下再重新开始
            isPaused = true;
            pauseTimeout = setTimeout(() => {
                isPaused = false;
            }, pauseTime);
        }
        
        alertList.scrollTop = scrollPosition;
    }
    
    // 每个项目停留检查
    let lastItemIndex = 0;
    function checkItemPause() {
        if (isHovered || isPaused) return;
        
        const itemHeight = 78;
        const currentItemIndex = Math.floor(scrollPosition / itemHeight);
        
        // 当滚动到新项目时，暂停一下
        if (currentItemIndex !== lastItemIndex && currentItemIndex < totalItems) {
            lastItemIndex = currentItemIndex;
            isPaused = true;
            
            if (pauseTimeout) clearTimeout(pauseTimeout);
            pauseTimeout = setTimeout(() => {
                isPaused = false;
            }, pauseTime);
        }
    }
    
    // 启动滚动
    setInterval(smoothScroll, scrollInterval);
    setInterval(checkItemPause, 200);
    
    console.log('✅ 丝滑自动滚动已启动');
}

// ===== 灾害数据弹窗功能 =====

/**
 * 初始化灾害数据弹窗功能
 */
function initDisasterTooltip() {
    console.log('🔧 初始化灾害数据弹窗...');
    
    disasterTooltip = document.getElementById('disaster-tooltip');
    if (!disasterTooltip) {
        console.warn('⚠️ 找不到灾害弹窗元素');
        return;
    }
    
    // 等待Cesium加载完成后绑定鼠标事件
    setTimeout(() => {
        if (window.cesiumViewer) {
            setupDisasterTooltipMouseHandler();
            console.log('✅ 灾害弹窗事件绑定完成');
        } else {
            console.warn('⚠️ Cesium viewer 未就绪，延迟绑定弹窗事件');
            // 如果Cesium还没准备好，再等一会
            setTimeout(() => {
                if (window.cesiumViewer) {
                    setupDisasterTooltipMouseHandler();
                    console.log('✅ 灾害弹窗事件延迟绑定完成');
                }
            }, 2000);
        }
    }, 1000);
}

/**
 * 设置灾害弹窗鼠标事件处理
 */
function setupDisasterTooltipMouseHandler() {
    if (!window.cesiumViewer) {
        console.warn('⚠️ Cesium viewer 不可用');
        return;
    }
    
    const scene = window.cesiumViewer.scene;
    const canvas = scene.canvas;
    
    // 移除已存在的处理器
    if (disasterMouseHandler) {
        disasterMouseHandler();
        disasterMouseHandler = null;
    }
    
    // 鼠标移动事件
    const mouseMoveHandler = (event) => {
        const position = new Cesium.Cartesian2(event.clientX, event.clientY);
        
        // 检查是否在临夏地区范围内
        const cartesian = window.cesiumViewer.camera.pickEllipsoid(position, scene.globe.ellipsoid);
        if (cartesian) {
            const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
            const longitude = Cesium.Math.toDegrees(cartographic.longitude);
            const latitude = Cesium.Math.toDegrees(cartographic.latitude);
            
            // 检查是否在临夏地区范围内且有选中的灾害图层 (102.5°-104.5°E, 34.5°-36.5°N)
            if (longitude >= 102.5 && longitude <= 104.5 && 
                latitude >= 34.5 && latitude <= 36.5 && 
                currentMonitoringConfig.type) {
                // 显示弹窗
                showDisasterTooltip(event.clientX, event.clientY, longitude, latitude);
            } else {
                hideDisasterTooltip();
            }
        } else {
            hideDisasterTooltip();
        }
    };
    
    // 鼠标离开地图区域
    const mouseLeaveHandler = () => {
        hideDisasterTooltip();
    };
    
    // 绑定事件
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('mouseleave', mouseLeaveHandler);
    
    // 返回清理函数
    disasterMouseHandler = () => {
        canvas.removeEventListener('mousemove', mouseMoveHandler);
        canvas.removeEventListener('mouseleave', mouseLeaveHandler);
    };
}

/**
 * 显示灾害数据弹窗
 */
function showDisasterTooltip(x, y, longitude, latitude) {
    if (!disasterTooltip) return;
    
    // 生成模拟灾害数据
    const disasterInfo = generateTooltipDisasterData(longitude, latitude);
    
    // 更新弹窗内容
    updateDisasterTooltipContent(disasterInfo, longitude, latitude);
    
    // 设置弹窗位置
    const tooltipX = Math.min(x + 15, window.innerWidth - 220);
    const tooltipY = Math.max(y - 10, 10);
    
    disasterTooltip.style.left = tooltipX + 'px';
    disasterTooltip.style.top = tooltipY + 'px';
    disasterTooltip.style.display = 'block';
    disasterTooltip.classList.add('show');
    disasterTooltip.classList.remove('hide');
}

/**
 * 隐藏灾害数据弹窗
 */
function hideDisasterTooltip() {
    if (!disasterTooltip) return;
    
    disasterTooltip.classList.add('hide');
    disasterTooltip.classList.remove('show');
    
    setTimeout(() => {
        if (disasterTooltip.classList.contains('hide')) {
            disasterTooltip.style.display = 'none';
        }
    }, 200);
}

/**
 * 生成弹窗灾害数据
 */
function generateTooltipDisasterData(longitude, latitude) {
    const layerNames = {
        'temperature': '高温/冻害',
        'drought': '干旱监测',
        'comprehensive': '综合评估'
    };
    
    // 基于位置生成模拟数据
    const seed = (longitude * 1000 + latitude * 1000) % 1000;
    let riskLevel, riskIndex, riskColor;
    
    switch (currentMonitoringConfig.type) {
        case 'temperature':
            // 高温/冻害风险
            const tempRisk = Math.sin(seed * 0.01) * 0.5 + 0.5; // 0-1
            if (tempRisk < 0.3) {
                riskLevel = '低风险';
                riskColor = '#52C41A';
            } else if (tempRisk < 0.6) {
                riskLevel = '中风险';
                riskColor = '#FAAD14';
            } else {
                riskLevel = '高风险';
                riskColor = '#F5222D';
            }
            riskIndex = (tempRisk * 100).toFixed(1);
            break;
            
        case 'drought':
            // 干旱风险
            const droughtRisk = Math.cos(seed * 0.012) * 0.5 + 0.5;
            if (droughtRisk < 0.25) {
                riskLevel = '无旱情';
                riskColor = '#52C41A';
            } else if (droughtRisk < 0.5) {
                riskLevel = '轻旱';
                riskColor = '#FAAD14';
            } else if (droughtRisk < 0.75) {
                riskLevel = '中旱';
                riskColor = '#FA8C16';
            } else {
                riskLevel = '重旱';
                riskColor = '#F5222D';
            }
            riskIndex = (droughtRisk * 100).toFixed(1);
            break;
            
        case 'comprehensive':
            // 综合评估
            const compRisk = (Math.sin(seed * 0.008) + Math.cos(seed * 0.015)) * 0.25 + 0.5;
            if (compRisk < 0.3) {
                riskLevel = '安全';
                riskColor = '#52C41A';
            } else if (compRisk < 0.6) {
                riskLevel = '注意';
                riskColor = '#FAAD14';
            } else if (compRisk < 0.8) {
                riskLevel = '警告';
                riskColor = '#FA8C16';
            } else {
                riskLevel = '危险';
                riskColor = '#F5222D';
            }
            riskIndex = (compRisk * 100).toFixed(1);
            break;
            
        default:
            riskLevel = '--';
            riskIndex = '--';
            riskColor = '#666';
    }
    
    return {
        layerName: layerNames[currentMonitoringConfig.type] || '未知',
        riskLevel: riskLevel,
        riskIndex: riskIndex,
        riskColor: riskColor,
        updateTime: new Date().toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        })
    };
}

/**
 * 更新弹窗内容
 */
function updateDisasterTooltipContent(disasterInfo, longitude, latitude) {
    // 更新标题和坐标
    const titleElement = document.getElementById('disaster-tooltip-layer-type');
    const coordsElement = document.getElementById('disaster-tooltip-coords');
    
    if (titleElement) {
        titleElement.textContent = disasterInfo.layerName;
    }
    
    if (coordsElement) {
        coordsElement.textContent = `${longitude.toFixed(3)}°, ${latitude.toFixed(3)}°`;
    }
    
    // 更新数据项
    const riskLevelElement = document.getElementById('disaster-tooltip-risk-level');
    const timeElement = document.getElementById('disaster-tooltip-time');
    
    if (riskLevelElement) {
        riskLevelElement.textContent = disasterInfo.riskLevel;
        riskLevelElement.style.color = disasterInfo.riskColor;
    }
    
    if (timeElement) {
        timeElement.textContent = disasterInfo.updateTime;
    }
}

console.log('📄 灾害定损模块已加载');