/**
 * 作物分布图层管理模块
 * 负责作物地块的数据管理、渲染和交互
 */

// 全局变量
let cropLayerEntities = [];
let cropDataSources = {};
let layerVisibility = {
    wheat: true,
    corn: true,
    vegetables: true,
    greenhouse: true
};

// 弹窗跟踪变量
let currentPopup = null;
let popupWorldPosition = null;
let popupUpdateHandler = null;

/**
 * 初始化作物图层系统
 */
function initCropLayers() {
    if (!window.cesiumViewer) {
        console.error('❌ Cesium Viewer未初始化，无法创建作物图层');
        return;
    }
    
    console.log('🌾 初始化作物分布图层系统...');
    
    try {
        // 为每种作物类型创建数据源
        const cropTypes = ['wheat', 'corn', 'vegetables', 'greenhouse'];
        cropTypes.forEach(type => {
            const dataSource = new Cesium.CustomDataSource(getConfig().AGRICULTURE.CROP_DISTRIBUTION.types[type].name);
            window.cesiumViewer.dataSources.add(dataSource);
            cropDataSources[type] = dataSource;
        });
        
        // 生成模拟地块数据
        generateMockCropData();
        
        // 创建图层控制UI
        createLayerControlUI();
        
        // 绑定地块点击事件
        bindPlotClickEvents();
        
        console.log('✅ 作物分布图层系统初始化完成');
        
        // 额外的场景刷新，确保所有图层都能正确显示
        setTimeout(() => {
            if (window.cesiumViewer) {
                try {
                    // 强制重新渲染场景（不移动相机）
                    window.cesiumViewer.scene.requestRender();
                    console.log('🎯 已强制刷新地图场景');
                } catch (error) {
                    console.warn('⚠️ 强制场景刷新失败:', error);
                }
            }
        }, 500);
        
    } catch (error) {
        console.error('❌ 作物图层初始化失败:', error);
    }
}

/**
 * 生成模拟作物地块数据
 */
function generateMockCropData() {
    console.log('📊 生成模拟作物地块数据...');
    
    const config = getConfig();
    const bounds = config.GEO.BOUNDS;
    const cropTypes = Object.keys(config.AGRICULTURE.CROP_DISTRIBUTION.types);
    
    // 为每种作物生成地块
    cropTypes.forEach(cropType => {
        const cropConfig = config.AGRICULTURE.CROP_DISTRIBUTION.types[cropType];
        const plotCount = getPlotCountForCrop(cropType);
        
        for (let i = 0; i < plotCount; i++) {
            const plot = generateRandomPlot(bounds, cropType, i + 1);
            createCropPlotEntity(plot, cropConfig);
        }
    });
    
    console.log(`✅ 生成了 ${cropLayerEntities.length} 个作物地块`);
    
    // 强制刷新Cesium场景，确保地块立即显示
    if (window.cesiumViewer) {
        setTimeout(() => {
            try {
                // 记录当前相机位置以确保不会移动
                const camera = window.cesiumViewer.camera;
                const currentLon = Cesium.Math.toDegrees(camera.positionCartographic.longitude);
                const currentLat = Cesium.Math.toDegrees(camera.positionCartographic.latitude);
                const currentHeight = camera.positionCartographic.height;
                
                window.cesiumViewer.scene.requestRender();
                
                console.log('🔄 已触发地图场景刷新');
                console.log(`📍 当前相机位置: ${currentLon.toFixed(3)}, ${currentLat.toFixed(3)}, ${currentHeight.toFixed(0)}m`);
            } catch (error) {
                console.warn('⚠️ 场景刷新失败:', error);
            }
        }, 100);
    }
}

/**
 * 根据作物类型确定地块数量
 */
function getPlotCountForCrop(cropType) {
    const plotCounts = {
        wheat: 15,      // 小麦地块最多
        corn: 12,       // 玉米地块
        vegetables: 8,  // 蔬菜地块
        greenhouse: 5   // 大棚最少但价值高
    };
    return plotCounts[cropType] || 5;
}

/**
 * 生成随机地块多边形
 */
function generateRandomPlot(bounds, cropType, plotId) {
    // 在临夏县范围内生成随机位置
    const centerLon = bounds.west + Math.random() * (bounds.east - bounds.west);
    const centerLat = bounds.south + Math.random() * (bounds.north - bounds.south);
    
    // 根据作物类型确定地块大小
    const plotSizes = {
        wheat: { min: 0.01, max: 0.03 },      // 较大的地块
        corn: { min: 0.008, max: 0.025 },     // 中等地块
        vegetables: { min: 0.005, max: 0.015 }, // 较小地块
        greenhouse: { min: 0.002, max: 0.008 } // 小地块但密集
    };
    
    const sizeConfig = plotSizes[cropType];
    const size = sizeConfig.min + Math.random() * (sizeConfig.max - sizeConfig.min);
    
    // 生成不规则多边形（4-6个顶点）
    const vertexCount = 4 + Math.floor(Math.random() * 3);
    const positions = [];
    
    for (let i = 0; i < vertexCount; i++) {
        const angle = (i / vertexCount) * 2 * Math.PI;
        const radius = size * (0.8 + Math.random() * 0.4); // 增加不规则性
        
        const lon = centerLon + radius * Math.cos(angle);
        const lat = centerLat + radius * Math.sin(angle);
        
        positions.push(lon, lat);
    }
    
    // 计算面积（简化计算）
    const area = (size * size * Math.PI * 111000 * 111000).toFixed(1); // 转换为平方米并简化
    
    return {
        id: `${cropType}-${plotId.toString().padStart(3, '0')}`,
        type: cropType,
        positions: positions,
        area: area,
        centerLon: centerLon,
        centerLat: centerLat,
        plotNumber: `LX-2024-${cropType.toUpperCase()}-${plotId.toString().padStart(3, '0')}`,
        plantingDate: generatePlantingDate(cropType),
        farmer: generateFarmerName(),
        status: generateCropStatus()
    };
}

/**
 * 创建作物地块实体
 */
function createCropPlotEntity(plot, cropConfig) {
    const dataSource = cropDataSources[plot.type];
    if (!dataSource) return;
    
    // 创建多边形实体
    const entity = dataSource.entities.add({
        id: plot.id,
        name: `${cropConfig.name}地块 ${plot.plotNumber}`,
        polygon: {
            hierarchy: Cesium.Cartesian3.fromDegreesArray(plot.positions),
            material: Cesium.Color.fromCssColorString(cropConfig.color).withAlpha(cropConfig.opacity),
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString(cropConfig.borderColor),
            outlineWidth: cropConfig.borderWidth,
            height: 0,
            extrudedHeight: cropConfig.borderWidth * 2 // 轻微的3D效果
        },
        
        // 标签（地块编号）
        label: {
            text: plot.plotNumber.split('-').pop(), // 只显示编号部分
            font: '12pt sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, -20),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            show: getConfig().AGRICULTURE.CROP_DISTRIBUTION.control.showLabels
        },
        
        // 存储地块数据
        properties: {
            cropType: plot.type,
            area: plot.area,
            plotNumber: plot.plotNumber,
            plantingDate: plot.plantingDate,
            farmer: plot.farmer,
            status: plot.status
        }
    });
    
    cropLayerEntities.push({
        entity: entity,
        plot: plot,
        type: plot.type
    });
    
    // 立即请求渲染该实体
    if (window.cesiumViewer) {
        setTimeout(() => {
            try {
                window.cesiumViewer.scene.requestRender();
            } catch (error) {
                console.debug('实体渲染请求失败:', error);
            }
        }, 10);
    }
}

/**
 * 切换图层可见性
 */
function toggleCropLayer(cropType, visible) {
    if (cropDataSources[cropType]) {
        cropDataSources[cropType].show = visible;
        layerVisibility[cropType] = visible;
        
        console.log(`🔄 ${cropType}图层${visible ? '显示' : '隐藏'}`);
        
        // 更新统计信息
        updateCropStatistics();
    }
}

/**
 * 设置图层透明度
 */
function setCropLayerOpacity(cropType, opacity) {
    const entities = cropLayerEntities.filter(item => item.type === cropType);
    const config = getConfig().AGRICULTURE.CROP_DISTRIBUTION.types[cropType];
    
    entities.forEach(item => {
        if (item.entity.polygon) {
            item.entity.polygon.material = Cesium.Color.fromCssColorString(config.color).withAlpha(opacity);
        }
    });
    
    console.log(`🎨 ${cropType}图层透明度设置为: ${opacity}`);
}

/**
 * 更新作物统计信息
 */
function updateCropStatistics() {
    const stats = {
        wheat: { count: 0, area: 0 },
        corn: { count: 0, area: 0 },
        vegetables: { count: 0, area: 0 },
        greenhouse: { count: 0, area: 0 }
    };
    
    cropLayerEntities.forEach(item => {
        if (layerVisibility[item.type]) {
            stats[item.type].count++;
            stats[item.type].area += parseFloat(item.plot.area);
        }
    });
    
    // 更新右侧面板的统计信息
    updateCropPanel(stats);
}

/**
 * 更新作物面板显示
 */
function updateCropPanel(stats) {
    // 这个函数将在main.js中实现，用于更新右侧面板的显示
    if (typeof updateRightPanelCropStats === 'function') {
        updateRightPanelCropStats(stats);
    }
}

/**
 * 创建图层控制UI
 */
function createLayerControlUI() {
    // 这个函数将在main.js中实现，用于创建图层控制界面
    console.log('🎮 作物图层控制UI准备就绪');
}

// ===== 辅助函数 =====

function generatePlantingDate(cropType) {
    const plantingMonths = {
        wheat: ['10', '11'],      // 冬小麦
        corn: ['04', '05'],       // 春玉米
        vegetables: ['03', '04', '05'], // 春季蔬菜
        greenhouse: ['全年']       // 大棚全年
    };
    
    const months = plantingMonths[cropType];
    const month = months[Math.floor(Math.random() * months.length)];
    return month === '全年' ? '全年种植' : `2024-${month}-${(Math.floor(Math.random() * 28) + 1).toString().padStart(2, '0')}`;
}

function generateFarmerName() {
    const surnames = ['张', '李', '王', '刘', '陈', '杨', '赵', '黄', '周', '吴'];
    const names = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '军', '洋'];
    return surnames[Math.floor(Math.random() * surnames.length)] + names[Math.floor(Math.random() * names.length)];
}

function generateCropStatus() {
    const statuses = ['excellent', 'good', 'normal', 'attention'];
    return statuses[Math.floor(Math.random() * statuses.length)];
}

function getConfig() {
    return window.CESIUM_CONFIG || {};
}

/**
 * 销毁作物图层
 */
function destroyCropLayers() {
    console.log('🧹 清理作物图层资源...');
    
    Object.values(cropDataSources).forEach(dataSource => {
        if (window.cesiumViewer && window.cesiumViewer.dataSources) {
            window.cesiumViewer.dataSources.remove(dataSource);
        }
    });
    
    cropLayerEntities = [];
    cropDataSources = {};
    
    console.log('✅ 作物图层资源清理完成');
}

/**
 * 绑定地块点击事件
 */
function bindPlotClickEvents() {
    if (!window.cesiumViewer) {
        console.warn('⚠️ Cesium Viewer未初始化，无法绑定点击事件');
        return;
    }
    
    // 绑定鼠标点击事件
    window.cesiumViewer.screenSpaceEventHandler.setInputAction(function(click) {
        // 获取点击位置的实体
        const pickedObject = window.cesiumViewer.scene.pick(click.position);
        
        if (Cesium.defined(pickedObject)) {
            const entity = pickedObject.id;
            
            // 检查是否是地块实体
            if (entity && entity.properties) {
                const plotData = {
                    plotNumber: entity.properties.plotNumber?.getValue(),
                    cropType: entity.properties.cropType?.getValue(),
                    area: entity.properties.area?.getValue(),
                    plantingDate: entity.properties.plantingDate?.getValue(),
                    farmer: entity.properties.farmer?.getValue(),
                    status: entity.properties.status?.getValue()
                };
                
                // 计算地块的世界坐标（用于弹窗跟随）
                const worldPosition = calculatePlotWorldPosition(entity);
                console.log('🌍 计算的世界坐标:', worldPosition);
                
                // 显示地块信息弹窗
                showPlotInfoPopup(plotData, click.position, worldPosition);
                
                console.log('🎯 点击地块:', plotData.plotNumber);
            }
        } else {
            // 点击空白区域时关闭弹窗
            removeExistingPopup();
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
    console.log('✅ 地块点击事件绑定完成');
}

/**
 * 显示地块信息弹窗
 */
function showPlotInfoPopup(plotData, screenPosition, worldPosition) {
    // 移除现有弹窗
    removeExistingPopup();
    
    // 获取作物类型的中文名称和图标
    const cropConfig = getConfig().AGRICULTURE.CROP_DISTRIBUTION.types[plotData.cropType];
    const cropName = cropConfig ? cropConfig.name : plotData.cropType;
    const cropIcon = cropConfig ? cropConfig.icon : '🌾';
    
    // 计算面积（转换为平方千米）
    const areaInKm2 = (parseFloat(plotData.area) / 1000000).toFixed(3); // 1km² = 1,000,000平方米
    
    // 创建弹窗HTML
    const popupHtml = `
        <div class="plot-info-popup" id="plot-popup">
            <div class="popup-header">
                <div class="popup-title">
                    ${cropIcon} ${cropName}地块信息
                </div>
                <button class="popup-close" onclick="closePlotPopup()">×</button>
            </div>
            <div class="popup-content">
                <div class="info-item">
                    <span class="info-label">📍 地块编号:</span>
                    <span class="info-value">${plotData.plotNumber}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">${cropIcon} 作物类型:</span>
                    <span class="info-value">${cropName}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📏 地块面积:</span>
                    <span class="info-value">${areaInKm2} km²</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📈 生长状态:</span>
                    <span class="info-value status-${plotData.status}">${getStatusText(plotData.status)}</span>
                </div>
            </div>
        </div>
    `;
    
    // 添加弹窗到页面
    const popupContainer = document.createElement('div');
    popupContainer.innerHTML = popupHtml;
    document.body.appendChild(popupContainer);
    
    // 定位弹窗
    const popup = document.getElementById('plot-popup');
    if (popup && screenPosition) {
        // 将Cesium屏幕坐标转换为页面坐标
        const cesiumContainer = document.getElementById('cesium-container');
        const containerRect = cesiumContainer.getBoundingClientRect();
        
        const x = containerRect.left + screenPosition.x;
        const y = containerRect.top + screenPosition.y;
        
        // 调整位置避免弹窗超出屏幕
        const popupRect = popup.getBoundingClientRect();
        const adjustedX = Math.min(x, window.innerWidth - popupRect.width - 20);
        const adjustedY = Math.max(20, y - popupRect.height - 20);
        
        popup.style.left = `${adjustedX}px`;
        popup.style.top = `${adjustedY}px`;
    }
    
    // 保存弹窗和世界坐标信息，用于跟随更新
    currentPopup = popup;
    popupWorldPosition = worldPosition;
    
    console.log('📍 弹窗创建完成:', {
        popup: !!currentPopup,
        worldPosition: !!popupWorldPosition,
        coordinates: worldPosition
    });
    
    // 启动弹窗跟随更新
    if (worldPosition) {
        startPopupFollowing();
    } else {
        console.warn('⚠️ 无法启动弹窗跟随：世界坐标为空');
    }
    
    // 添加淡入动画
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
}

/**
 * 移除现有弹窗
 */
function removeExistingPopup() {
    // 停止弹窗跟随更新
    stopPopupFollowing();
    
    const existingPopup = document.getElementById('plot-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // 清理全局变量
    currentPopup = null;
    popupWorldPosition = null;
}

/**
 * 关闭地块弹窗
 */
function closePlotPopup() {
    const popup = document.getElementById('plot-popup');
    if (popup) {
        popup.classList.add('hide');
        setTimeout(() => {
            popup.remove();
        }, 300);
    }
}

/**
 * 获取状态文本
 */
function getStatusText(status) {
    const statusMap = {
        'excellent': '优秀',
        'good': '良好',
        'normal': '正常',
        'attention': '需关注'
    };
    return statusMap[status] || status;
}

/**
 * 计算地块的世界坐标（用于弹窗跟随）
 */
function calculatePlotWorldPosition(entity) {
    if (!entity) {
        console.debug('实体为空');
        return null;
    }
    
    try {
        // 方法1: 使用entity的position属性
        if (entity.position) {
            const position = entity.position.getValue(window.cesiumViewer.clock.currentTime);
            console.debug('使用实体position:', position);
            return position;
        }
        
        // 方法2: 从多边形计算中心
        if (entity.polygon && entity.polygon.hierarchy) {
            const hierarchy = entity.polygon.hierarchy.getValue(window.cesiumViewer.clock.currentTime);
            console.debug('多边形层次结构:', hierarchy);
            
            if (hierarchy && hierarchy.length > 0) {
                // 使用Cesium的边界球计算中心
                const boundingSphere = Cesium.BoundingSphere.fromPoints(hierarchy);
                console.debug('边界球中心:', boundingSphere.center);
                return boundingSphere.center;
            }
        }
        
        // 方法3: 从存储的plot数据计算中心
        if (entity.properties && entity.properties.plotNumber) {
            const plotNumber = entity.properties.plotNumber.getValue();
            console.debug('尝试从plot数据计算中心，地块编号:', plotNumber);
            
            // 查找对应的地块数据
            for (let cropEntity of cropLayerEntities) {
                if (cropEntity.plot.plotNumber === plotNumber) {
                    const positions = cropEntity.plot.positions;
                    if (positions && positions.length >= 2) {
                        // 计算经纬度中心点
                        let sumLon = 0, sumLat = 0;
                        for (let i = 0; i < positions.length; i += 2) {
                            sumLon += positions[i];
                            sumLat += positions[i + 1];
                        }
                        const centerLon = sumLon / (positions.length / 2);
                        const centerLat = sumLat / (positions.length / 2);
                        
                        const centerPosition = Cesium.Cartesian3.fromDegrees(centerLon, centerLat, 0);
                        console.debug('从plot数据计算的中心:', centerPosition);
                        return centerPosition;
                    }
                }
            }
        }
        
        console.debug('所有方法都失败，无法计算地块中心');
    } catch (error) {
        console.error('计算地块中心位置失败:', error);
    }
    
    return null;
}

/**
 * 启动弹窗跟随更新
 */
function startPopupFollowing() {
    if (!window.cesiumViewer || !currentPopup || !popupWorldPosition) {
        console.debug('无法启动弹窗跟随: 缺少必要组件');
        return;
    }
    
    console.log('🎯 启动弹窗跟随更新');
    
    // 停止之前的更新循环
    stopPopupFollowing();
    
    // 创建更新函数
    const updatePopupPosition = () => {
        if (!currentPopup || !popupWorldPosition || !window.cesiumViewer) {
            return;
        }
        
        try {
            // 将世界坐标转换为屏幕坐标
            const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.cesiumViewer.scene,
                popupWorldPosition
            );
            
            if (screenPosition && Cesium.defined(screenPosition)) {
                // 获取Cesium容器的位置偏移
                const cesiumContainer = document.getElementById('cesium-container');
                const containerRect = cesiumContainer ? cesiumContainer.getBoundingClientRect() : { left: 0, top: 0 };
                
                // 计算最终位置
                let finalX = screenPosition.x + containerRect.left;
                let finalY = screenPosition.y + containerRect.top - 20; // 弹窗显示在点击位置上方
                
                // 边界检测和调整
                const popupRect = currentPopup.getBoundingClientRect();
                const margin = 10;
                
                // 水平边界检测
                if (finalX + popupRect.width + margin > window.innerWidth) {
                    finalX = window.innerWidth - popupRect.width - margin;
                }
                if (finalX < margin) {
                    finalX = margin;
                }
                
                // 垂直边界检测
                if (finalY < margin) {
                    finalY = screenPosition.y + containerRect.top + 30; // 显示在点击位置下方
                }
                if (finalY + popupRect.height + margin > window.innerHeight) {
                    finalY = window.innerHeight - popupRect.height - margin;
                }
                
                // 应用位置更新
                currentPopup.style.left = `${finalX}px`;
                currentPopup.style.top = `${finalY}px`;
                
                console.debug('弹窗位置更新:', { x: finalX, y: finalY });
            } else {
                console.debug('无法获取屏幕坐标');
            }
        } catch (error) {
            console.debug('弹窗位置更新失败:', error);
        }
    };
    
    // 立即执行一次位置更新
    updatePopupPosition();
    
    // 方法1: 监听相机变化事件
    try {
        popupUpdateHandler = window.cesiumViewer.camera.changed.addEventListener(updatePopupPosition);
        console.log('✅ 相机变化事件监听器已绑定');
    } catch (error) {
        console.debug('绑定相机事件失败:', error);
    }
    
    // 方法2: 使用高频定时器确保更新
    const intervalId = setInterval(() => {
        if (!currentPopup || !document.body.contains(currentPopup)) {
            clearInterval(intervalId);
            return;
        }
        updatePopupPosition();
    }, 33); // 约30fps，平衡性能和流畅度
    
    // 方法3: 监听场景渲染事件
    try {
        const renderHandler = window.cesiumViewer.scene.postRender.addEventListener(updatePopupPosition);
        
        // 保存所有处理器以便清理
        if (!window.popupUpdateHandlers) {
            window.popupUpdateHandlers = [];
        }
        window.popupUpdateHandlers.push({
            type: 'render',
            handler: renderHandler,
            remove: () => window.cesiumViewer.scene.postRender.removeEventListener(renderHandler)
        });
    } catch (error) {
        console.debug('绑定渲染事件失败:', error);
    }
    
    // 保存定时器ID以便清理
    if (!window.popupIntervals) {
        window.popupIntervals = [];
    }
    window.popupIntervals.push(intervalId);
}

/**
 * 停止弹窗跟随更新
 */
function stopPopupFollowing() {
    console.log('🛑 停止弹窗跟随更新');
    
    // 移除相机事件监听器
    if (popupUpdateHandler && window.cesiumViewer) {
        try {
            window.cesiumViewer.camera.changed.removeEventListener(popupUpdateHandler);
            console.log('✅ 相机事件监听器已移除');
        } catch (error) {
            console.debug('移除相机事件监听器失败:', error);
        }
        popupUpdateHandler = null;
    }
    
    // 清理所有更新处理器
    if (window.popupUpdateHandlers) {
        window.popupUpdateHandlers.forEach(handler => {
            try {
                handler.remove();
            } catch (error) {
                console.debug('移除更新处理器失败:', error);
            }
        });
        window.popupUpdateHandlers = [];
    }
    
    // 清理定时器
    if (window.popupIntervals) {
        window.popupIntervals.forEach(id => clearInterval(id));
        window.popupIntervals = [];
        console.log('✅ 定时器已清理');
    }
}

// 全局函数，供HTML onclick调用
window.closePlotPopup = closePlotPopup;

// ===== 全局导出 =====
window.CropLayers = {
    init: initCropLayers,
    toggle: toggleCropLayer,
    setOpacity: setCropLayerOpacity,
    updateStats: updateCropStatistics,
    destroy: destroyCropLayers,
    getEntities: () => cropLayerEntities,
    getVisibility: () => layerVisibility
};