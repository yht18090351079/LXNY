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
                
                // 显示乡镇信息弹窗
                showTownshipInfoPopup(townshipData, click.position);
                
                console.log('🎯 点击乡镇:', townshipData.name);
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
    
    // 创建弹窗HTML
    const popupHtml = `
        <div class="township-info-popup" id="township-popup">
            <div class="popup-header">
                <div class="popup-title">
                    🏘️ ${townshipData.name}
                </div>
                <button class="popup-close" onclick="removeTownshipPopup()">×</button>
            </div>
            <div class="popup-content">
                <div class="info-item">
                    <span class="info-label">👥 人口:</span>
                    <span class="info-value">${townshipData.population.toLocaleString()} 人</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📏 面积:</span>
                    <span class="info-value">${townshipData.area} km²</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🎨 标识色:</span>
                    <span class="info-value">
                        <span class="color-indicator" style="background-color: ${townshipData.color}"></span>
                        ${townshipData.color}
                    </span>
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面
    document.body.insertAdjacentHTML('beforeend', popupHtml);
    
    // 设置弹窗位置
    const popup = document.getElementById('township-popup');
    popup.style.left = `${screenPosition.x + 10}px`;
    popup.style.top = `${screenPosition.y - 10}px`;
    
    console.log(`📋 显示乡镇信息弹窗: ${townshipData.name}`);
}

/**
 * 移除乡镇信息弹窗
 */
function removeTownshipPopup() {
    const popup = document.getElementById('township-popup');
    if (popup) {
        popup.remove();
    }
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
