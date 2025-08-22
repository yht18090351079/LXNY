/**
 * 乡镇地块管理模块
 * 负责创建和管理乡镇级别的矩形地块
 */

// 全局变量
let townshipDataSource = null;
let townshipBlocks = [];

// 临夏县乡镇数据配置 - 与区域选择器保持一致
const TOWNSHIP_DATA = {
    '城关镇': {
        name: '城关镇',
        id: 'chengguan',
        bounds: [103.15, 35.35, 103.25, 35.45],
        population: 28000,
        area: 85.6,
        color: '#00FFFF'
    },
    '土场镇': {
        name: '土场镇',
        id: 'tuchang',
        bounds: [103.05, 35.25, 103.15, 35.35],
        population: 22000,
        area: 72.3,
        color: '#00FFFF'
    },
    '北塔镇': {
        name: '北塔镇',
        id: 'beita',
        bounds: [103.25, 35.35, 103.35, 35.45],
        population: 18000,
        area: 68.9,
        color: '#00FFFF'
    },
    '红光镇': {
        name: '红光镇',
        id: 'hongguang',
        bounds: [103.15, 35.45, 103.25, 35.55],
        population: 25000,
        area: 78.4,
        color: '#00FFFF'
    },
    '积石山镇': {
        name: '积石山镇',
        id: 'jishishan',
        bounds: [103.05, 35.35, 103.15, 35.45],
        population: 32000,
        area: 92.1,
        color: '#00FFFF'
    },
    '韩家集镇': {
        name: '韩家集镇',
        id: 'hanjiaji',
        bounds: [103.25, 35.25, 103.35, 35.35],
        population: 26000,
        area: 81.7,
        color: '#00FFFF'
    },
    '新集镇': {
        name: '新集镇',
        id: 'xinji',
        bounds: [103.35, 35.35, 103.45, 35.45],
        population: 15000,
        area: 58.2,
        color: '#00FFFF'
    },
    '刘家峡镇': {
        name: '刘家峡镇',
        id: 'liujiaxia',
        bounds: [103.05, 35.15, 103.15, 35.25],
        population: 19000,
        area: 65.8,
        color: '#00FFFF'
    },
    '太平镇': {
        name: '太平镇',
        id: 'taiping',
        bounds: [103.15, 35.15, 103.25, 35.25],
        population: 24000,
        area: 76.5,
        color: '#00FFFF'
    },
    '民丰镇': {
        name: '民丰镇',
        id: 'minfeng',
        bounds: [103.25, 35.15, 103.35, 35.25],
        population: 21000,
        area: 69.3,
        color: '#00FFFF'
    }
};

/**
 * 初始化乡镇地块系统
 */
function initTownshipBlocks() {
    console.log('🏘️ 初始化乡镇地块系统...');

    try {
        // 检查多种可能的Cesium实例
        const viewer = window.cesiumViewer || window.viewer;
        if (!viewer) {
            console.warn('⚠️ Cesium Viewer未初始化，延迟初始化乡镇地块');
            // 添加重试次数限制，避免无限循环
            if (!initTownshipBlocks.retryCount) {
                initTownshipBlocks.retryCount = 0;
            }
            initTownshipBlocks.retryCount++;

            if (initTownshipBlocks.retryCount < 10) {
                setTimeout(initTownshipBlocks, 1000);
            } else {
                console.error('❌ Cesium Viewer初始化超时，停止重试');
            }
            return;
        }

        // 重置重试计数
        initTownshipBlocks.retryCount = 0;
        
        // 清理现有乡镇地块
        cleanupTownshipBlocks();
        
        // 创建乡镇数据源
        townshipDataSource = new Cesium.CustomDataSource('乡镇地块');
        viewer.dataSources.add(townshipDataSource);
        
        // 创建所有乡镇地块
        createAllTownshipBlocks();
        
        // 绑定点击事件
        bindTownshipClickEvents();
        
        console.log('✅ 乡镇地块系统初始化完成');
        
    } catch (error) {
        console.error('❌ 乡镇地块初始化失败:', error);
    }
}

/**
 * 创建所有乡镇地块
 */
function createAllTownshipBlocks() {
    console.log('📍 创建乡镇地块...');
    
    Object.keys(TOWNSHIP_DATA).forEach(townshipName => {
        const township = TOWNSHIP_DATA[townshipName];
        createTownshipBlock(township);
    });
    
    console.log(`✅ 创建了 ${townshipBlocks.length} 个乡镇地块`);
}

/**
 * 创建单个乡镇地块
 */
function createTownshipBlock(township) {
    const [west, south, east, north] = township.bounds;
    
    // 创建矩形实体
    const entity = townshipDataSource.entities.add({
        id: `township-${township.name}`,
        name: township.name,
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(west, south, east, north),
            material: Cesium.Color.fromCssColorString(township.color).withAlpha(0.3),
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString(township.color),
            outlineWidth: 2,
            height: 0,
            extrudedHeight: 100 // 轻微的3D效果
        },
        
        // 标签（乡镇名称）
        label: {
            text: township.name,
            font: '14pt Microsoft YaHei, sans-serif',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(0, 0),
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            show: true
        },
        
        // 存储乡镇数据
        properties: {
            townshipName: township.name,
            population: township.population,
            area: township.area,
            color: township.color
        }
    });
    
    townshipBlocks.push({
        entity: entity,
        township: township
    });
    
    console.log(`📍 创建乡镇地块: ${township.name}`);
}

/**
 * 绑定乡镇地块点击事件
 */
function bindTownshipClickEvents() {
    const viewer = window.cesiumViewer || window.viewer;
    if (!viewer) {
        console.warn('⚠️ Cesium Viewer未初始化，无法绑定点击事件');
        return;
    }

    // 添加点击事件监听器
    viewer.screenSpaceEventHandler.setInputAction(function(click) {
        console.log('🖱️ 点击事件触发，位置:', click.position);
        
        const pickedObject = viewer.scene.pick(click.position);
        
        if (Cesium.defined(pickedObject)) {
            const entity = pickedObject.id;
            
            // 检查是否是乡镇地块实体
            if (entity && entity.id && entity.id.startsWith('township-')) {
                const townshipData = {
                    name: entity.properties.townshipName?.getValue(),
                    population: entity.properties.population?.getValue(),
                    area: entity.properties.area?.getValue(),
                    color: entity.properties.color?.getValue()
                };
                
                console.log('🎯 点击乡镇:', townshipData.name);
                console.log('📍 点击位置:', click.position);
                
                // 先尝试获取世界坐标
                let worldPosition = null;
                
                // 方法1: 从实体获取位置
                if (entity.position) {
                    worldPosition = entity.position.getValue(viewer.clock.currentTime);
                    console.log('🌍 从实体position获取世界坐标:', worldPosition);
                }
                
                // 方法2: 如果方法1失败，使用pickEllipsoid
                if (!worldPosition) {
                    try {
                        worldPosition = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
                        console.log('🌍 从pickEllipsoid获取世界坐标:', worldPosition);
                    } catch (error) {
                        console.warn('⚠️ pickEllipsoid失败:', error);
                    }
                }
                
                // 方法3: 如果前两种方法都失败，使用默认坐标
                if (!worldPosition) {
                    console.warn('⚠️ 无法获取世界坐标，使用默认坐标');
                    worldPosition = Cesium.Cartesian3.fromDegrees(103.2, 35.4, 0);
                }
                
                // 存储世界坐标
                window.popupWorldPosition = worldPosition;
                console.log('🌍 最终存储的世界坐标:', window.popupWorldPosition);
                
                // 显示乡镇信息弹窗
                showTownshipInfoPopup(townshipData, click.position);
            }
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
    console.log('✅ 乡镇地块点击事件绑定完成');
}

/**
 * 显示乡镇信息弹窗
 */
function showTownshipInfoPopup(townshipData, screenPosition) {
    // 移除现有弹窗
    removeTownshipPopup();
    
    // 获取地图容器
    const mapContainer = document.getElementById('cesium-container');
    if (!mapContainer) {
        console.warn('⚠️ 未找到地图容器');
        return;
    }
    
    // 获取Cesium viewer
    const viewer = window.cesiumViewer;
    if (!viewer) {
        console.warn('⚠️ 未找到Cesium viewer');
        return;
    }
    
    // 检查是否已有世界坐标（从点击事件中获取）
    if (!window.popupWorldPosition) {
        console.warn('⚠️ 未找到世界坐标，使用默认位置');
        window.popupWorldPosition = Cesium.Cartesian3.fromDegrees(103.2, 35.4, 0);
    }
    
    console.log('🌍 使用已存储的世界坐标:', window.popupWorldPosition);
    
    // 获取当前选择的作物
    const selectedCrop = getSelectedCrop();
    
    // 获取农业数据
    const agriculturalData = getAgriculturalData(townshipData.name, selectedCrop);
    
    // 创建弹窗HTML
    const popupHtml = `
        <div class="township-info-popup" id="township-popup">
            <div class="popup-header">
                <div class="popup-title">
                    🌾 ${townshipData.name}农业数据
                </div>
                <button class="popup-close" onclick="removeTownshipPopup()">×</button>
            </div>
            <div class="popup-content">
                <div class="info-item">
                    <span class="info-label">🌱 主要作物:</span>
                    <span class="info-value">${agriculturalData.crops}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📏 种植面积:</span>
                    <span class="info-value">${agriculturalData.area.toLocaleString()} 亩</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📊 长势指数:</span>
                    <span class="info-value">${agriculturalData.growthIndex}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">⭐ 长势等级:</span>
                    <span class="info-value">
                        <span class="growth-level" style="color: ${agriculturalData.growthLevelColor}">${agriculturalData.growthLevel}</span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">📈 预估产量:</span>
                    <span class="info-value">${agriculturalData.estimatedYield.toLocaleString()} 吨</span>
                </div>
                <div class="info-item">
                    <span class="info-label">⚠️ 预估损失:</span>
                    <span class="info-value">${agriculturalData.estimatedLoss.toLocaleString()} 吨</span>
                </div>
            </div>
        </div>
    `;
    
    // 添加到地图容器内
    mapContainer.insertAdjacentHTML('beforeend', popupHtml);
    
    // 设置弹窗初始位置
    updatePopupPositionFromWorld();
    
    // 添加地图移动事件监听器
    addMapMoveListener();
    
    console.log(`📋 显示乡镇信息弹窗: ${townshipData.name}`);
    
    // 添加调试信息
    console.log(`🌍 世界坐标:`, window.popupWorldPosition);
    console.log(`📍 屏幕坐标:`, screenPosition);
    console.log(`🌾 当前选中作物:`, selectedCrop);
    
    // 添加作物选择器变化监听
    addCropSelectionListener();
}

/**
 * 移除乡镇信息弹窗
 */
function removeTownshipPopup() {
    const popup = document.getElementById('township-popup');
    if (popup) {
        popup.remove();
    }
    
    // 同时检查并移除可能存在于body中的旧弹窗（兼容性处理）
    const bodyPopup = document.querySelector('body .township-info-popup');
    if (bodyPopup) {
        bodyPopup.remove();
    }
    
    // 移除地图移动事件监听器
    removeMapMoveListener();
    
    // 移除作物选择器监听
    removeCropSelectionListener();
}

/**
 * 添加地图移动事件监听器
 */
function addMapMoveListener() {
    const viewer = window.cesiumViewer;
    if (!viewer) {
        console.warn('⚠️ 未找到Cesium viewer，无法添加移动监听器');
        return;
    }
    
    // 移除现有监听器
    removeMapMoveListener();
    
    console.log('🎯 添加地图移动事件监听器...');
    
    // 添加新的监听器 - 使用正确的事件监听方式
    try {
        window.mapMoveHandler = viewer.camera.moveEnd.addEventListener(() => {
            console.log('🔄 地图移动事件触发，更新弹窗位置...');
            updatePopupPositionFromWorld();
        });
        console.log('✅ moveEnd事件监听器已添加');
    } catch (error) {
        console.warn('⚠️ moveEnd事件监听器添加失败:', error);
    }
    
    // 同时监听相机变化事件
    try {
        window.cameraChangeHandler = viewer.camera.changed.addEventListener(() => {
            console.log('📷 相机变化事件触发，更新弹窗位置...');
            updatePopupPositionFromWorld();
        });
        console.log('✅ camera.changed事件监听器已添加');
    } catch (error) {
        console.warn('⚠️ camera.changed事件监听器添加失败:', error);
    }
    
    // 暂时禁用scene.postRender事件监听器，避免无限循环
    /*
    try {
        window.renderHandler = viewer.scene.postRender.addEventListener(() => {
            // 只在有弹窗和世界坐标时更新，避免无限循环
            const popup = document.getElementById('township-popup');
            if (popup && window.popupWorldPosition) {
                // 添加防抖，避免过于频繁的更新
                if (!window.lastUpdateTime || Date.now() - window.lastUpdateTime > 100) {
                    window.lastUpdateTime = Date.now();
                    updatePopupPositionFromWorld();
                }
            }
        });
        console.log('✅ scene.postRender事件监听器已添加');
    } catch (error) {
        console.warn('⚠️ scene.postRender事件监听器添加失败:', error);
    }
    */
    console.log('⚠️ scene.postRender事件监听器已暂时禁用，避免无限循环');
    
    console.log('✅ 地图移动事件监听器已添加');
}

/**
 * 移除地图移动事件监听器
 */
function removeMapMoveListener() {
    console.log('🗑️ 移除地图移动事件监听器...');
    
    if (window.mapMoveHandler) {
        try {
            window.mapMoveHandler();
            console.log('✅ moveEnd监听器已移除');
        } catch (error) {
            console.warn('⚠️ moveEnd监听器移除失败:', error);
        }
        window.mapMoveHandler = null;
    }
    
    if (window.cameraChangeHandler) {
        try {
            window.cameraChangeHandler();
            console.log('✅ camera.changed监听器已移除');
        } catch (error) {
            console.warn('⚠️ camera.changed监听器移除失败:', error);
        }
        window.cameraChangeHandler = null;
    }
    
    if (window.renderHandler) {
        try {
            window.renderHandler();
            console.log('✅ scene.postRender监听器已移除');
        } catch (error) {
            console.warn('⚠️ scene.postRender监听器移除失败:', error);
        }
        window.renderHandler = null;
    }
    
    // 清除世界坐标
    window.popupWorldPosition = null;
    console.log('✅ 世界坐标已清除');
}

/**
 * 根据世界坐标更新弹窗位置
 */
function updatePopupPositionFromWorld() {
    console.log('🔄 开始更新弹窗位置...');
    
    const popup = document.getElementById('township-popup');
    if (!popup) {
        console.warn('⚠️ 未找到弹窗元素');
        return;
    }
    
    const viewer = window.cesiumViewer;
    if (!viewer) {
        console.warn('⚠️ 未找到Cesium viewer');
        return;
    }
    
    if (!window.popupWorldPosition) {
        console.warn('⚠️ 未找到世界坐标');
        return;
    }
    
    // 将世界坐标转换为屏幕坐标
    console.log('🌍 世界坐标:', window.popupWorldPosition);
    const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
        viewer.scene,
        window.popupWorldPosition
    );
    
    console.log('📍 转换后的屏幕坐标:', screenPosition);
    
    if (!screenPosition) {
        // 如果世界坐标不在当前视图中，隐藏弹窗
        console.log('⚠️ 世界坐标不在当前视图中，隐藏弹窗');
        popup.style.display = 'none';
        return;
    }
    
    // 显示弹窗
    popup.style.display = 'block';
    
    // 获取地图容器
    const mapContainer = document.getElementById('cesium-container');
    if (!mapContainer) {
        return;
    }
    
    // 获取地图容器的位置信息
    const mapRect = mapContainer.getBoundingClientRect();
    
    // 计算相对于地图容器的位置
    const relativeX = screenPosition.x - mapRect.left;
    const relativeY = screenPosition.y - mapRect.top;
    
    // 设置弹窗位置
    popup.style.position = 'absolute';
    popup.style.left = `${relativeX + 10}px`;
    popup.style.top = `${relativeY - 10}px`;
    
    // 确保弹窗不超出地图边界
    const popupRect = popup.getBoundingClientRect();
    const maxX = mapRect.width - popupRect.width - 10;
    const maxY = mapRect.height - popupRect.height - 10;
    
    if (relativeX > maxX) {
        popup.style.left = `${maxX}px`;
    }
    if (relativeY < 0) {
        popup.style.top = '10px';
    }
    
    console.log(`📍 弹窗位置已更新: (${relativeX}, ${relativeY})`);
}

/**
 * 测试弹窗移动功能（调试用）
 */
function testPopupMovement() {
    console.log('🧪 测试弹窗移动功能...');
    console.log('当前世界坐标:', window.popupWorldPosition);
    console.log('当前弹窗:', document.getElementById('township-popup'));
    
    if (window.popupWorldPosition && document.getElementById('township-popup')) {
        updatePopupPositionFromWorld();
        console.log('✅ 弹窗位置更新完成');
    } else {
        console.log('❌ 缺少必要的数据或元素');
    }
}

// 添加到全局作用域，方便调试
window.testPopupMovement = testPopupMovement;

/**
 * 手动触发地图移动事件（调试用）
 */
function triggerMapMove() {
    const viewer = window.cesiumViewer;
    if (!viewer) {
        console.log('❌ 未找到Cesium viewer');
        return;
    }
    
    console.log('🔄 手动触发地图移动事件...');
    
    // 模拟地图移动 - 使用更简单的方法
    const currentHeading = viewer.camera.heading;
    viewer.camera.setView({
        destination: viewer.camera.position,
        orientation: {
            heading: currentHeading + 0.1, // 稍微旋转相机
            pitch: viewer.camera.pitch,
            roll: viewer.camera.roll
        }
    });
    
    // 手动触发位置更新
    setTimeout(() => {
        console.log('🔄 手动触发弹窗位置更新...');
        updatePopupPositionFromWorld();
    }, 100);
    
    console.log('✅ 地图移动事件已触发');
}

window.triggerMapMove = triggerMapMove;

/**
 * 使用定时器测试弹窗移动（调试用）
 */
function testPopupWithTimer() {
    console.log('⏰ 开始定时器测试弹窗移动...');
    
    if (!window.popupWorldPosition || !document.getElementById('township-popup')) {
        console.log('❌ 缺少必要的数据或元素');
        return;
    }
    
    // 每2秒更新一次弹窗位置
    window.popupTimer = setInterval(() => {
        console.log('⏰ 定时器触发，更新弹窗位置...');
        updatePopupPositionFromWorld();
    }, 2000);
    
    console.log('✅ 定时器已启动，每2秒更新一次弹窗位置');
}

/**
 * 停止定时器测试
 */
function stopPopupTimer() {
    if (window.popupTimer) {
        clearInterval(window.popupTimer);
        window.popupTimer = null;
        console.log('⏹️ 定时器已停止');
    }
}

window.testPopupWithTimer = testPopupWithTimer;
window.stopPopupTimer = stopPopupTimer;

/**
 * 使用固定坐标测试弹窗移动（调试用）
 */
function testPopupWithFixedPosition() {
    console.log('🧪 使用固定坐标测试弹窗移动...');
    
    const viewer = window.cesiumViewer;
    if (!viewer) {
        console.log('❌ 未找到Cesium viewer');
        return;
    }
    
    // 使用临夏县的固定坐标
    const fixedPosition = Cesium.Cartesian3.fromDegrees(103.2, 35.4, 0);
    window.popupWorldPosition = fixedPosition;
    
    console.log('🌍 设置固定世界坐标:', window.popupWorldPosition);
    
    // 创建测试弹窗
    const mapContainer = document.getElementById('cesium-container');
    if (mapContainer) {
        const testPopupHtml = `
            <div class="township-info-popup" id="township-popup">
                <div class="popup-header">
                    <div class="popup-title">🧪 临夏县中心测试</div>
                    <button class="popup-close" onclick="removeTownshipPopup()">×</button>
                </div>
                <div class="popup-content">
                    <div class="info-item">
                        <span class="info-label">🌱 主要作物:</span>
                        <span class="info-value">小麦、玉米、蔬菜</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📏 种植面积:</span>
                        <span class="info-value">15,000 亩</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📊 长势指数:</span>
                        <span class="info-value">0.88</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">⭐ 长势等级:</span>
                        <span class="info-value">
                            <span class="growth-level" style="color: #4CAF50">优</span>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📈 预估产量:</span>
                        <span class="info-value">10,200 吨</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">⚠️ 预估损失:</span>
                        <span class="info-value">280 吨</span>
                    </div>
                </div>
            </div>
        `;
        
        mapContainer.insertAdjacentHTML('beforeend', testPopupHtml);
        
        // 更新弹窗位置
        updatePopupPositionFromWorld();
        
        // 添加移动监听器
        addMapMoveListener();
        
        console.log('✅ 测试弹窗已创建，请移动地图测试');
        console.log('💡 提示：移动地图时弹窗应该跟随移动');
    }
}

window.testPopupWithFixedPosition = testPopupWithFixedPosition;

/**
 * 使用鼠标当前位置测试弹窗（调试用）
 */
function testPopupAtMousePosition() {
    console.log('🖱️ 使用鼠标当前位置测试弹窗...');
    
    const viewer = window.cesiumViewer;
    if (!viewer) {
        console.log('❌ 未找到Cesium viewer');
        return;
    }
    
    // 获取地图容器
    const mapContainer = document.getElementById('cesium-container');
    if (!mapContainer) {
        console.log('❌ 未找到地图容器');
        return;
    }
    
    // 模拟鼠标点击位置（地图中心）
    const mapRect = mapContainer.getBoundingClientRect();
    const centerX = mapRect.width / 2;
    const centerY = mapRect.height / 2;
    
    const mockClickPosition = {
        x: centerX,
        y: centerY
    };
    
    console.log('📍 模拟点击位置:', mockClickPosition);
    
    // 创建测试数据
    const testTownshipData = {
        name: '测试乡镇',
        population: 10000,
        area: 50.0,
        color: '#00FFFF'
    };
    
    // 显示测试弹窗
    showTownshipInfoPopup(testTownshipData, mockClickPosition);
}

window.testPopupAtMousePosition = testPopupAtMousePosition;

/**
 * 使用乡镇地块实际坐标测试弹窗（调试用）
 */
function testPopupWithTownshipPosition() {
    console.log('🏘️ 使用乡镇地块实际坐标测试弹窗...');
    
    const viewer = window.cesiumViewer;
    if (!viewer) {
        console.log('❌ 未找到Cesium viewer');
        return;
    }
    
    // 使用城关镇的实际坐标（从TOWNSHIP_DATA中获取）
    const chengguanBounds = [103.15, 35.35, 103.25, 35.45];
    const centerLon = (chengguanBounds[0] + chengguanBounds[2]) / 2;
    const centerLat = (chengguanBounds[1] + chengguanBounds[3]) / 2;
    
    const townshipPosition = Cesium.Cartesian3.fromDegrees(centerLon, centerLat, 0);
    window.popupWorldPosition = townshipPosition;
    
    console.log('🌍 设置城关镇世界坐标:', window.popupWorldPosition);
    console.log('📍 经纬度:', centerLon, centerLat);
    
    // 创建测试弹窗
    const mapContainer = document.getElementById('cesium-container');
    if (mapContainer) {
        const testPopupHtml = `
            <div class="township-info-popup" id="township-popup">
                <div class="popup-header">
                    <div class="popup-title">🏘️ 城关镇农业数据</div>
                    <button class="popup-close" onclick="removeTownshipPopup()">×</button>
                </div>
                <div class="popup-content">
                    <div class="info-item">
                        <span class="info-label">🌱 主要作物:</span>
                        <span class="info-value">小麦、玉米、蔬菜</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📏 种植面积:</span>
                        <span class="info-value">12,500 亩</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📊 长势指数:</span>
                        <span class="info-value">0.85</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">⭐ 长势等级:</span>
                        <span class="info-value">
                            <span class="growth-level" style="color: #4CAF50">优</span>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📈 预估产量:</span>
                        <span class="info-value">8,500 吨</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">⚠️ 预估损失:</span>
                        <span class="info-value">320 吨</span>
                    </div>
                </div>
            </div>
        `;
        
        mapContainer.insertAdjacentHTML('beforeend', testPopupHtml);
        
        // 更新弹窗位置
        updatePopupPositionFromWorld();
        
        // 添加移动监听器
        addMapMoveListener();
        
        console.log('✅ 城关镇测试弹窗已创建，请移动地图测试');
        console.log('💡 提示：移动地图时弹窗应该跟随移动到城关镇位置');
    }
}

window.testPopupWithTownshipPosition = testPopupWithTownshipPosition;

/**
 * 简单测试弹窗移动功能（调试用）
 */
function simpleTestPopup() {
    console.log('🧪 简单测试弹窗移动功能...');
    
    // 直接设置世界坐标
    window.popupWorldPosition = Cesium.Cartesian3.fromDegrees(103.2, 35.4, 0);
    console.log('🌍 设置世界坐标:', window.popupWorldPosition);
    
    // 创建简单弹窗
    const mapContainer = document.getElementById('cesium-container');
    if (mapContainer) {
        // 移除现有弹窗
        const existingPopup = document.getElementById('township-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        const testPopupHtml = `
            <div class="township-info-popup" id="township-popup">
                <div class="popup-header">
                    <div class="popup-title">🧪 测试弹窗</div>
                    <button class="popup-close" onclick="removeTownshipPopup()">×</button>
                </div>
                <div class="popup-content">
                    <div class="info-item">
                        <span class="info-label">🌱 主要作物:</span>
                        <span class="info-value">小麦、玉米、蔬菜</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📏 种植面积:</span>
                        <span class="info-value">12,500 亩</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📊 长势指数:</span>
                        <span class="info-value">0.85</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">⭐ 长势等级:</span>
                        <span class="info-value">
                            <span class="growth-level" style="color: #4CAF50">优</span>
                        </span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">📈 预估产量:</span>
                        <span class="info-value">8,500 吨</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">⚠️ 预估损失:</span>
                        <span class="info-value">320 吨</span>
                    </div>
                </div>
            </div>
        `;
        
        mapContainer.insertAdjacentHTML('beforeend', testPopupHtml);
        
        // 立即更新弹窗位置
        console.log('🔄 立即更新弹窗位置...');
        updatePopupPositionFromWorld();
        
        // 添加移动监听器
        addMapMoveListener();
        
        console.log('✅ 简单测试弹窗已创建');
        console.log('💡 请移动地图，观察弹窗是否跟随移动');
    }
}

window.simpleTestPopup = simpleTestPopup;

/**
 * 获取当前选择的作物
 */
function getSelectedCrop() {
    const selectedRadio = document.querySelector('input[name="crop-selection"]:checked');
    if (selectedRadio) {
        return selectedRadio.id.replace('crop-', '');
    }
    return 'wheat'; // 默认选择小麦
}

/**
 * 获取乡镇农业数据
 */
function getAgriculturalData(townshipName, selectedCrop = 'wheat') {
    // 作物配置
    const cropConfig = {
        wheat: {
            name: '小麦',
            icon: '🌾',
            color: '#4CAF50'
        },
        corn: {
            name: '玉米',
            icon: '🌽',
            color: '#FFC107'
        },
        pepper: {
            name: '辣椒',
            icon: '🌶️',
            color: '#FF5722'
        },
        vegetables: {
            name: '蔬菜',
            icon: '🥬',
            color: '#4CAF50'
        },
        greenhouse: {
            name: '大棚',
            icon: '🏠',
            color: '#9E9E9E'
        }
    };
    
    // 各乡镇各作物的基础数据
    const agriculturalConfig = {
        '城关镇': {
            wheat: { area: 4500, growthIndex: 0.85, growthLevel: '优', estimatedYield: 3200, estimatedLoss: 120 },
            corn: { area: 3800, growthIndex: 0.82, growthLevel: '良', estimatedYield: 2800, estimatedLoss: 150 },
            pepper: { area: 1200, growthIndex: 0.88, growthLevel: '优', estimatedYield: 800, estimatedLoss: 30 },
            vegetables: { area: 2000, growthIndex: 0.86, growthLevel: '优', estimatedYield: 1200, estimatedLoss: 50 },
            greenhouse: { area: 1000, growthIndex: 0.90, growthLevel: '优', estimatedYield: 500, estimatedLoss: 20 }
        },
        '土场镇': {
            wheat: { area: 5200, growthIndex: 0.82, growthLevel: '良', estimatedYield: 3800, estimatedLoss: 180 },
            corn: { area: 4800, growthIndex: 0.79, growthLevel: '良', estimatedYield: 3200, estimatedLoss: 200 },
            pepper: { area: 1800, growthIndex: 0.85, growthLevel: '优', estimatedYield: 1200, estimatedLoss: 60 },
            vegetables: { area: 2500, growthIndex: 0.83, growthLevel: '良', estimatedYield: 1500, estimatedLoss: 80 },
            greenhouse: { area: 1500, growthIndex: 0.87, growthLevel: '优', estimatedYield: 800, estimatedLoss: 30 }
        },
        '北塔镇': {
            wheat: { area: 3200, growthIndex: 0.78, growthLevel: '良', estimatedYield: 2200, estimatedLoss: 120 },
            corn: { area: 2800, growthIndex: 0.75, growthLevel: '中', estimatedYield: 1800, estimatedLoss: 150 },
            pepper: { area: 800, growthIndex: 0.82, growthLevel: '良', estimatedYield: 500, estimatedLoss: 40 },
            vegetables: { area: 1500, growthIndex: 0.80, growthLevel: '良', estimatedYield: 900, estimatedLoss: 60 },
            greenhouse: { area: 1500, growthIndex: 0.84, growthLevel: '良', estimatedYield: 800, estimatedLoss: 40 }
        },
        '红光镇': {
            wheat: { area: 4800, growthIndex: 0.88, growthLevel: '优', estimatedYield: 3500, estimatedLoss: 100 },
            corn: { area: 4200, growthIndex: 0.85, growthLevel: '优', estimatedYield: 3000, estimatedLoss: 120 },
            pepper: { area: 1500, growthIndex: 0.90, growthLevel: '优', estimatedYield: 1000, estimatedLoss: 30 },
            vegetables: { area: 2200, growthIndex: 0.87, growthLevel: '优', estimatedYield: 1400, estimatedLoss: 50 },
            greenhouse: { area: 500, growthIndex: 0.92, growthLevel: '优', estimatedYield: 300, estimatedLoss: 10 }
        },
        '积石山镇': {
            wheat: { area: 5800, growthIndex: 0.91, growthLevel: '优', estimatedYield: 4200, estimatedLoss: 80 },
            corn: { area: 5200, growthIndex: 0.88, growthLevel: '优', estimatedYield: 3800, estimatedLoss: 100 },
            pepper: { area: 2000, growthIndex: 0.93, growthLevel: '优', estimatedYield: 1400, estimatedLoss: 40 },
            vegetables: { area: 2800, growthIndex: 0.90, growthLevel: '优', estimatedYield: 1800, estimatedLoss: 60 },
            greenhouse: { area: 1000, growthIndex: 0.94, growthLevel: '优', estimatedYield: 600, estimatedLoss: 20 }
        },
        '韩家集镇': {
            wheat: { area: 4800, growthIndex: 0.79, growthLevel: '良', estimatedYield: 3200, estimatedLoss: 160 },
            corn: { area: 4200, growthIndex: 0.76, growthLevel: '良', estimatedYield: 2800, estimatedLoss: 180 },
            pepper: { area: 1400, growthIndex: 0.83, growthLevel: '良', estimatedYield: 900, estimatedLoss: 70 },
            vegetables: { area: 2000, growthIndex: 0.81, growthLevel: '良', estimatedYield: 1200, estimatedLoss: 90 },
            greenhouse: { area: 1800, growthIndex: 0.85, growthLevel: '优', estimatedYield: 1000, estimatedLoss: 50 }
        },
        '新集镇': {
            wheat: { area: 3200, growthIndex: 0.75, growthLevel: '中', estimatedYield: 2000, estimatedLoss: 200 },
            corn: { area: 2800, growthIndex: 0.72, growthLevel: '中', estimatedYield: 1800, estimatedLoss: 220 },
            pepper: { area: 800, growthIndex: 0.78, growthLevel: '良', estimatedYield: 500, estimatedLoss: 80 },
            vegetables: { area: 1200, growthIndex: 0.76, growthLevel: '良', estimatedYield: 700, estimatedLoss: 100 },
            greenhouse: { area: 900, growthIndex: 0.80, growthLevel: '良', estimatedYield: 500, estimatedLoss: 60 }
        },
        '刘家峡镇': {
            wheat: { area: 3800, growthIndex: 0.83, growthLevel: '良', estimatedYield: 2600, estimatedLoss: 120 },
            corn: { area: 3200, growthIndex: 0.80, growthLevel: '良', estimatedYield: 2200, estimatedLoss: 140 },
            pepper: { area: 1000, growthIndex: 0.86, growthLevel: '优', estimatedYield: 700, estimatedLoss: 50 },
            vegetables: { area: 1800, growthIndex: 0.84, growthLevel: '良', estimatedYield: 1100, estimatedLoss: 70 },
            greenhouse: { area: 1200, growthIndex: 0.88, growthLevel: '优', estimatedYield: 700, estimatedLoss: 30 }
        },
        '太平镇': {
            wheat: { area: 4800, growthIndex: 0.87, growthLevel: '优', estimatedYield: 3400, estimatedLoss: 100 },
            corn: { area: 4200, growthIndex: 0.84, growthLevel: '良', estimatedYield: 3000, estimatedLoss: 120 },
            pepper: { area: 1400, growthIndex: 0.89, growthLevel: '优', estimatedYield: 900, estimatedLoss: 40 },
            vegetables: { area: 2000, growthIndex: 0.86, growthLevel: '优', estimatedYield: 1300, estimatedLoss: 60 },
            greenhouse: { area: 1600, growthIndex: 0.91, growthLevel: '优', estimatedYield: 900, estimatedLoss: 30 }
        },
        '民丰镇': {
            wheat: { area: 4000, growthIndex: 0.81, growthLevel: '良', estimatedYield: 2800, estimatedLoss: 140 },
            corn: { area: 3500, growthIndex: 0.78, growthLevel: '良', estimatedYield: 2400, estimatedLoss: 160 },
            pepper: { area: 1200, growthIndex: 0.84, growthLevel: '良', estimatedYield: 800, estimatedLoss: 60 },
            vegetables: { area: 1800, growthIndex: 0.82, growthLevel: '良', estimatedYield: 1100, estimatedLoss: 80 },
            greenhouse: { area: 1000, growthIndex: 0.86, growthLevel: '优', estimatedYield: 600, estimatedLoss: 40 }
        }
    };
    
    // 获取当前月份，用于季节性调整
    const currentMonth = window.Timeline ? window.Timeline.getCurrentMonth() : new Date().getMonth() + 1;
    
    // 获取乡镇数据
    const townshipData = agriculturalConfig[townshipName];
    if (!townshipData) {
        // 默认数据
        return {
            crops: cropConfig[selectedCrop]?.name || '小麦',
            area: 5000,
            growthIndex: '0.80',
            growthLevel: '良',
            growthLevelColor: '#FFC107',
            estimatedYield: 3500,
            estimatedLoss: 200
        };
    }
    
    // 获取选中作物的数据
    const cropData = townshipData[selectedCrop];
    if (!cropData) {
        // 如果该乡镇没有该作物数据，使用默认数据
        return {
            crops: cropConfig[selectedCrop]?.name || '小麦',
            area: 3000,
            growthIndex: '0.75',
            growthLevel: '中',
            growthLevelColor: '#FF9800',
            estimatedYield: 2000,
            estimatedLoss: 150
        };
    }
    
    // 根据月份调整数据（模拟季节性变化）
    const seasonalAdjustment = getSeasonalAdjustment(currentMonth);
    
    return {
        crops: cropConfig[selectedCrop]?.name || '小麦',
        area: Math.round(cropData.area * seasonalAdjustment.area),
        growthIndex: (cropData.growthIndex * seasonalAdjustment.growthIndex).toFixed(2),
        growthLevel: cropData.growthLevel,
        growthLevelColor: getGrowthLevelColor(cropData.growthLevel),
        estimatedYield: Math.round(cropData.estimatedYield * seasonalAdjustment.yield),
        estimatedLoss: Math.round(cropData.estimatedLoss * seasonalAdjustment.loss)
    };
}

/**
 * 获取季节性调整因子
 */
function getSeasonalAdjustment(month) {
    // 春季(3-5月): 种植期，面积增加，长势好转
    // 夏季(6-8月): 生长期，长势最佳，产量预估高
    // 秋季(9-11月): 收获期，产量确定，损失显现
    // 冬季(12-2月): 休耕期，面积减少，长势较差
    
    const adjustments = {
        1: { area: 0.3, growthIndex: 0.6, yield: 0.8, loss: 1.2 },   // 冬季
        2: { area: 0.4, growthIndex: 0.7, yield: 0.8, loss: 1.1 },
        3: { area: 0.8, growthIndex: 0.9, yield: 0.9, loss: 1.0 },   // 春季开始
        4: { area: 1.0, growthIndex: 1.0, yield: 0.9, loss: 0.9 },
        5: { area: 1.0, growthIndex: 1.1, yield: 1.0, loss: 0.8 },
        6: { area: 1.0, growthIndex: 1.2, yield: 1.1, loss: 0.7 },   // 夏季最佳
        7: { area: 1.0, growthIndex: 1.2, yield: 1.1, loss: 0.7 },
        8: { area: 1.0, growthIndex: 1.1, yield: 1.0, loss: 0.8 },
        9: { area: 0.9, growthIndex: 1.0, yield: 1.0, loss: 0.9 },   // 秋季
        10: { area: 0.8, growthIndex: 0.9, yield: 1.0, loss: 1.0 },
        11: { area: 0.6, growthIndex: 0.8, yield: 0.9, loss: 1.1 },
        12: { area: 0.4, growthIndex: 0.7, yield: 0.8, loss: 1.2 }   // 冬季
    };
    
    return adjustments[month] || { area: 1.0, growthIndex: 1.0, yield: 1.0, loss: 1.0 };
}

/**
 * 获取长势等级对应的颜色
 */
function getGrowthLevelColor(level) {
    const colors = {
        '优': '#4CAF50',
        '良': '#FFC107',
        '中': '#FF9800',
        '差': '#F44336'
    };
    return colors[level] || '#FFC107';
}

/**
 * 添加作物选择器变化监听
 */
function addCropSelectionListener() {
    // 移除现有监听器
    removeCropSelectionListener();
    
    // 添加新的监听器
    const cropRadios = document.querySelectorAll('input[name="crop-selection"]');
    cropRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                console.log('🌾 作物选择改变:', this.id.replace('crop-', ''));
                updatePopupContent();
            }
        });
    });
    
    console.log('✅ 作物选择器监听器已添加');
}

/**
 * 移除作物选择器监听
 */
function removeCropSelectionListener() {
    const cropRadios = document.querySelectorAll('input[name="crop-selection"]');
    cropRadios.forEach(radio => {
        // 移除所有事件监听器
        radio.replaceWith(radio.cloneNode(true));
    });
}

/**
 * 更新弹窗内容
 */
function updatePopupContent() {
    const popup = document.getElementById('township-popup');
    if (!popup) {
        return;
    }
    
    // 获取当前选中的作物
    const selectedCrop = getSelectedCrop();
    
    // 获取乡镇名称（从弹窗标题中提取）
    const titleElement = popup.querySelector('.popup-title');
    const townshipName = titleElement.textContent.replace('🌾 ', '').replace('农业数据', '').replace('🧪 ', '').replace('测试', '');
    
    // 获取新的农业数据
    const agriculturalData = getAgriculturalData(townshipName, selectedCrop);
    
    // 更新弹窗内容
    const contentElement = popup.querySelector('.popup-content');
    contentElement.innerHTML = `
        <div class="info-item">
            <span class="info-label">🌱 主要作物:</span>
            <span class="info-value">${agriculturalData.crops}</span>
        </div>
        <div class="info-item">
            <span class="info-label">📏 种植面积:</span>
            <span class="info-value">${agriculturalData.area.toLocaleString()} 亩</span>
        </div>
        <div class="info-item">
            <span class="info-label">📊 长势指数:</span>
            <span class="info-value">${agriculturalData.growthIndex}</span>
        </div>
        <div class="info-item">
            <span class="info-label">⭐ 长势等级:</span>
            <span class="info-value">
                <span class="growth-level" style="color: ${agriculturalData.growthLevelColor}">${agriculturalData.growthLevel}</span>
            </span>
        </div>
        <div class="info-item">
            <span class="info-label">📈 预估产量:</span>
            <span class="info-value">${agriculturalData.estimatedYield.toLocaleString()} 吨</span>
        </div>
        <div class="info-item">
            <span class="info-label">⚠️ 预估损失:</span>
            <span class="info-value">${agriculturalData.estimatedLoss.toLocaleString()} 吨</span>
        </div>
    `;
    
    console.log(`🔄 弹窗内容已更新为: ${agriculturalData.crops}`);
}

/**
 * 清理乡镇地块资源
 */
function cleanupTownshipBlocks() {
    const viewer = window.cesiumViewer || window.viewer;
    if (townshipDataSource && viewer) {
        viewer.dataSources.remove(townshipDataSource);
    }
    
    townshipDataSource = null;
    townshipBlocks = [];
    
    console.log('🧹 乡镇地块资源清理完成');
}

/**
 * 设置乡镇地块可见性
 */
function setTownshipBlocksVisibility(visible) {
    if (townshipDataSource) {
        townshipDataSource.show = visible;
        console.log(`👁️ 乡镇地块可见性设置为: ${visible}`);
    }
}

/**
 * 根据区域ID过滤显示乡镇地块
 * @param {string} regionId - 区域ID，'all'表示显示所有，其他值表示特定乡镇
 */
function filterTownshipsByRegion(regionId) {
    if (!townshipBlocks || townshipBlocks.length === 0) {
        console.warn('⚠️ 乡镇地块未初始化，无法进行过滤');
        return;
    }

    console.log(`🔍 过滤乡镇地块，区域ID: ${regionId}`);

    townshipBlocks.forEach(block => {
        const township = block.township;
        const entity = block.entity;

        if (regionId === 'all') {
            // 显示所有乡镇
            entity.show = true;
        } else {
            // 只显示匹配的乡镇
            entity.show = (township.id === regionId);
        }
    });

    // 统计显示的乡镇数量
    const visibleCount = townshipBlocks.filter(block => block.entity.show).length;
    console.log(`✅ 乡镇地块过滤完成，显示 ${visibleCount}/${townshipBlocks.length} 个乡镇`);

    // 如果只显示一个乡镇，自动聚焦到该乡镇
    if (regionId !== 'all') {
        const targetTownship = Object.values(TOWNSHIP_DATA).find(t => t.id === regionId);
        if (targetTownship) {
            focusOnTownship(targetTownship);
        }
    }
}

/**
 * 聚焦到指定乡镇
 * @param {Object} township - 乡镇数据对象
 */
function focusOnTownship(township) {
    const viewer = window.cesiumViewer || window.viewer;
    if (!viewer || !township) return;

    try {
        const [west, south, east, north] = township.bounds;
        const centerLon = (west + east) / 2;
        const centerLat = (south + north) / 2;

        // 计算合适的高度
        const latRange = north - south;
        const lonRange = east - west;
        const maxRange = Math.max(latRange, lonRange);
        const height = maxRange * 100000; // 根据范围调整高度

        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height),
            duration: 2.0,
            orientation: {
                heading: 0.0,
                pitch: -Cesium.Math.PI_OVER_TWO,
                roll: 0.0
            }
        });

        console.log(`🎯 聚焦到乡镇: ${township.name}`);
    } catch (error) {
        console.error('❌ 聚焦乡镇失败:', error);
    }
}

/**
 * 高亮指定乡镇
 */
function highlightTownship(townshipName) {
    townshipBlocks.forEach(block => {
        if (block.township.name === townshipName) {
            // 高亮显示
            block.entity.rectangle.material = Cesium.Color.fromCssColorString(block.township.color).withAlpha(0.8);
            block.entity.rectangle.outlineWidth = 4;
        } else {
            // 恢复正常显示
            block.entity.rectangle.material = Cesium.Color.fromCssColorString(block.township.color).withAlpha(0.3);
            block.entity.rectangle.outlineWidth = 2;
        }
    });
    
    console.log(`🎯 高亮乡镇: ${townshipName}`);
}

/**
 * 通用的乡镇地块初始化函数，适用于所有页面
 */
function initTownshipBlocksForPage() {
    // 延迟初始化，确保Cesium完全加载
    setTimeout(() => {
        if (window.TownshipBlocks && typeof window.TownshipBlocks.init === 'function') {
            window.TownshipBlocks.init();
            console.log('🏘️ 乡镇地块模块初始化完成');
        } else {
            console.warn('⚠️ 乡镇地块模块未加载');
        }
    }, 3000); // 3秒延迟确保Cesium完全初始化
}

/**
 * 获取乡镇统计信息
 */
function getTownshipStatistics() {
    const townships = Object.values(TOWNSHIP_DATA);
    return {
        totalTownships: townships.length,
        totalPopulation: townships.reduce((sum, t) => sum + t.population, 0),
        totalArea: townships.reduce((sum, t) => sum + t.area, 0),
        averagePopulation: Math.round(townships.reduce((sum, t) => sum + t.population, 0) / townships.length),
        averageArea: Math.round(townships.reduce((sum, t) => sum + t.area, 0) / townships.length * 10) / 10
    };
}

/**
 * 根据人口密度获取乡镇排名
 */
function getTownshipsByPopulationDensity() {
    return Object.values(TOWNSHIP_DATA)
        .map(township => ({
            ...township,
            density: Math.round(township.population / township.area * 10) / 10
        }))
        .sort((a, b) => b.density - a.density);
}

// 导出函数供外部调用
window.TownshipBlocks = {
    init: initTownshipBlocks,
    initForPage: initTownshipBlocksForPage,
    cleanup: cleanupTownshipBlocks,
    setVisibility: setTownshipBlocksVisibility,
    filterByRegion: filterTownshipsByRegion,
    focusOn: focusOnTownship,
    highlight: highlightTownship,
    getStatistics: getTownshipStatistics,
    getByPopulationDensity: getTownshipsByPopulationDensity,
    data: TOWNSHIP_DATA
};
