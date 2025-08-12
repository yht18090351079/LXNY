/**
 * 设备监控模块
 * 负责农业监测设备的显示、管理和交互
 */

// 全局变量
let deviceEntities = [];
let deviceDataSource = null;
let deviceMonitoringEnabled = false;
let currentDevicePopup = null;
let devicePopupWorldPosition = null;
let devicePopupUpdateHandler = null;

// 设备类型配置
const DEVICE_CONFIG = {
    seedling: {
        name: '苗情监测设备',
        icon: '🌱',
        color: '#4CAF50',
        size: 36,
        description: '实时监测作物生长状态、土壤墒情等'
    },
    pesticide: {
        name: '智能杀虫灯',
        icon: '💡',
        color: '#FFC107',
        size: 36,
        description: '物理诱杀害虫，减少农药使用'
    },
    pest: {
        name: '虫情监测仪',
        icon: '🐛',
        color: '#2196F3',
        size: 36,
        description: 'AI识别害虫种类和数量统计'
    }
};

// 设备状态类型
const DEVICE_STATUS = {
    online: { name: '在线', color: '#4CAF50', icon: '🟢' },
    offline: { name: '离线', color: '#9E9E9E', icon: '⚫' },
    warning: { name: '预警', color: '#FF9800', icon: '🟡' },
    maintenance: { name: '维护', color: '#2196F3', icon: '🔵' }
};

/**
 * 初始化设备监控系统
 */
function initDeviceMonitoring() {
    if (!window.cesiumViewer) {
        console.error('❌ Cesium Viewer未初始化，无法创建设备监控系统');
        return;
    }
    
    console.log('📱 初始化设备监控系统...');
    
    try {
        // 创建设备数据源
        deviceDataSource = new Cesium.CustomDataSource('农业监测设备');
        window.cesiumViewer.dataSources.add(deviceDataSource);
        
        // 生成模拟设备数据
        generateMockDeviceData();
        
        // 绑定设备点击事件
        bindDeviceClickEvents();
        
        console.log('✅ 设备监控系统初始化完成');
        
    } catch (error) {
        console.error('❌ 设备监控系统初始化失败:', error);
    }
}

/**
 * 生成模拟设备数据
 */
function generateMockDeviceData() {
    console.log('📊 生成模拟设备数据...');
    
    const config = getConfig();
    const bounds = config.GEO.BOUNDS;
    
    // 为每种设备类型生成设备
    Object.keys(DEVICE_CONFIG).forEach(deviceType => {
        const deviceCount = getDeviceCountForType(deviceType);
        
        for (let i = 0; i < deviceCount; i++) {
            const device = generateRandomDevice(bounds, deviceType, i + 1);
            createDeviceEntity(device);
        }
    });
    
    console.log(`✅ 生成了 ${deviceEntities.length} 个监测设备`);
    
    // 默认隐藏设备图层
    deviceDataSource.show = false;
}

/**
 * 获取设备类型对应的数量
 */
function getDeviceCountForType(deviceType) {
    const counts = {
        seedling: 15,  // 苗情监测设备
        pesticide: 12, // 智能杀虫灯
        pest: 10       // 虫情监测仪
    };
    return counts[deviceType] || 5;
}

/**
 * 生成随机设备数据
 */
function generateRandomDevice(bounds, deviceType, deviceId) {
    const config = DEVICE_CONFIG[deviceType];
    const statusTypes = Object.keys(DEVICE_STATUS);
    const randomStatus = statusTypes[Math.floor(Math.random() * statusTypes.length)];
    
    // 在指定边界内生成随机坐标
    const longitude = bounds.west + Math.random() * (bounds.east - bounds.west);
    const latitude = bounds.south + Math.random() * (bounds.north - bounds.south);
    
    return {
        id: `${deviceType}-${String(deviceId).padStart(3, '0')}`,
        type: deviceType,
        name: config.name,
        position: [longitude, latitude],
        status: randomStatus,
        installDate: generateRandomDate(),
        lastUpdate: new Date().toISOString(),
        sensorData: generateSensorData(deviceType)
    };
}

/**
 * 生成随机日期
 */
function generateRandomDate() {
    const start = new Date(2020, 0, 1);
    const end = new Date();
    const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
    return new Date(randomTime).toISOString().split('T')[0];
}

/**
 * 生成传感器数据
 */
function generateSensorData(deviceType) {
    switch (deviceType) {
        case 'seedling':
            return {
                soilTemperature: (Math.random() * 20 + 5).toFixed(1) + '°C',
                soilMoisture: (Math.random() * 40 + 30).toFixed(1) + '%',
                lightIntensity: (Math.random() * 50000 + 10000).toFixed(0) + ' lux',
                co2Concentration: (Math.random() * 200 + 300).toFixed(0) + ' ppm'
            };
        case 'pesticide':
            return {
                workingHours: (Math.random() * 12 + 6).toFixed(1) + ' 小时/天',
                pestCount: Math.floor(Math.random() * 500 + 100) + ' 只/夜',
                voltage: (Math.random() * 2 + 11).toFixed(1) + 'V',
                power: (Math.random() * 20 + 30).toFixed(1) + 'W'
            };
        case 'pest':
            return {
                pestTypes: Math.floor(Math.random() * 5 + 3) + ' 种',
                totalCount: Math.floor(Math.random() * 200 + 50) + ' 只',
                recognitionRate: (Math.random() * 10 + 85).toFixed(1) + '%',
                lastScan: '2小时前'
            };
        default:
            return {};
    }
}

/**
 * 创建设备实体
 */
function createDeviceEntity(device) {
    const config = DEVICE_CONFIG[device.type];
    const statusConfig = DEVICE_STATUS[device.status];
    
    try {
        const entity = deviceDataSource.entities.add({
            id: device.id,
            position: Cesium.Cartesian3.fromDegrees(device.position[0], device.position[1]),
            billboard: {
                image: createDeviceIcon(config.icon, config.color, statusConfig.color),
                width: config.size,
                height: config.size,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                scaleByDistance: new Cesium.NearFarScalar(1500, 1.2, 15000, 0.8),  // 调整缩放参数
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
                text: device.name,
                font: '12px Microsoft YaHei',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -35),
                show: false // 默认不显示标签
            }
        });
        
        // 存储设备数据到实体
        entity.deviceData = device;
        
        deviceEntities.push({
            entity: entity,
            data: device,
            type: device.type
        });
        
    } catch (error) {
        console.error(`❌ 创建设备实体失败 [${device.id}]:`, error);
    }
}

/**
 * 创建设备图标
 */
function createDeviceIcon(emoji, deviceColor, statusColor) {
    const canvas = document.createElement('canvas');
    canvas.width = 48;  // 增加画布大小
    canvas.height = 48;
    const ctx = canvas.getContext('2d');
    
    // 绘制状态指示器背景圆
    ctx.beginPath();
    ctx.arc(24, 24, 20, 0, 2 * Math.PI);  // 增加背景圆大小
    ctx.fillStyle = deviceColor;
    ctx.fill();
    
    // 添加边框
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 绘制设备图标
    ctx.font = '24px Arial';  // 增加字体大小
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 24, 24);
    
    // 绘制状态指示器
    ctx.beginPath();
    ctx.arc(38, 10, 6, 0, 2 * Math.PI);  // 增加状态指示器大小
    ctx.fillStyle = statusColor;
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    return canvas.toDataURL();
}

/**
 * 切换设备监控显示
 */
function toggleDeviceMonitoring(enabled) {
    deviceMonitoringEnabled = enabled;
    
    if (deviceDataSource) {
        deviceDataSource.show = enabled;
        console.log(`📱 设备监控图层${enabled ? '显示' : '隐藏'}`);
        console.log(`📊 设备数据源包含 ${deviceDataSource.entities.values.length} 个实体`);
        console.log(`📍 设备实体数组包含 ${deviceEntities.length} 个设备`);
        
        // 更新设备统计信息
        if (enabled) {
            updateDeviceStatistics();
            
            // 调试：列出所有设备
            deviceEntities.forEach((item, index) => {
                console.log(`🔍 设备 ${index + 1}:`, item.data.name, item.data.id, '位置:', item.data.position);
            });
        }
    } else {
        console.warn('⚠️ 设备数据源未初始化');
    }
}

/**
 * 绑定设备点击事件
 */
function bindDeviceClickEvents() {
    if (!window.cesiumViewer) return;
    
    // 创建新的事件处理器，避免与现有事件冲突
    const deviceClickHandler = new Cesium.ScreenSpaceEventHandler(window.cesiumViewer.scene.canvas);
    
    deviceClickHandler.setInputAction(function onLeftClick(event) {
        console.log('🖱️ 设备监控 - 检测到点击事件');
        
        const pickedObject = window.cesiumViewer.scene.pick(event.position);
        console.log('🎯 拾取对象:', pickedObject);
        
        if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
            console.log('📍 点击的实体ID:', pickedObject.id.id);
            console.log('📊 实体数据:', pickedObject.id.deviceData);
            
            // 检查是否为设备实体
            if (Cesium.defined(pickedObject.id.deviceData)) {
                const deviceEntity = pickedObject.id;
                const deviceData = deviceEntity.deviceData;
                
                console.log('📱 点击设备:', deviceData.name, deviceData.id);
                
                // 计算世界坐标用于弹窗跟随
                const worldPosition = Cesium.Cartesian3.fromDegrees(deviceData.position[0], deviceData.position[1]);
                
                // 显示设备信息弹窗
                showDeviceInfoPopup(deviceData, event.position, worldPosition);
                
                // 阻止事件冒泡
                event.stopPropagation = true;
                return;
            }
        }
        
        console.log('❌ 未点击到设备实体');
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
    
    // 存储事件处理器引用，以便后续清理
    window.deviceClickHandler = deviceClickHandler;
}

/**
 * 显示设备信息弹窗
 */
function showDeviceInfoPopup(deviceData, screenPosition, worldPosition) {
    // 移除现有弹窗
    removeExistingDevicePopup();
    
    const config = DEVICE_CONFIG[deviceData.type];
    const statusConfig = DEVICE_STATUS[deviceData.status];
    
    // 创建弹窗HTML
    const popupHtml = `
        <div class="device-info-popup" id="device-popup">
            <div class="popup-header">
                <div class="popup-title">
                    ${config.icon} ${deviceData.name}
                </div>
                <button class="popup-close" onclick="closeDevicePopup()">×</button>
            </div>
            <div class="popup-content">
                <div class="info-item">
                    <span class="info-label">📍 设备编号:</span>
                    <span class="info-value">${deviceData.id}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">${statusConfig.icon} 运行状态:</span>
                    <span class="info-value status-${deviceData.status}">${statusConfig.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">📅 安装日期:</span>
                    <span class="info-value">${deviceData.installDate}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">🔄 最后更新:</span>
                    <span class="info-value">${formatDateTime(deviceData.lastUpdate)}</span>
                </div>
                
                <div class="sensor-data-section">
                    <div class="sensor-title">📊 传感器数据</div>
                    ${generateSensorDataHtml(deviceData.sensorData)}
                </div>
            </div>
        </div>
    `;
    
    // 添加弹窗到页面
    const popupContainer = document.createElement('div');
    popupContainer.className = 'device-popup-container';
    popupContainer.innerHTML = popupHtml;
    document.body.appendChild(popupContainer);
    
    // 定位弹窗
    const popup = document.getElementById('device-popup');
    if (popup && screenPosition) {
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
    
    currentDevicePopup = popup;
    devicePopupWorldPosition = worldPosition;
    
    console.log('📍 设备弹窗创建完成:', {
        popup: !!currentDevicePopup,
        worldPosition: !!devicePopupWorldPosition,
        coordinates: worldPosition
    });
    
    // 启动弹窗跟随更新
    if (worldPosition) {
        startDevicePopupFollowing();
    } else {
        console.warn('⚠️ 无法启动设备弹窗跟随：世界坐标为空');
    }
    
    // 添加淡入动画
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
}

/**
 * 生成传感器数据HTML
 */
function generateSensorDataHtml(sensorData) {
    return Object.entries(sensorData).map(([key, value]) => {
        const labelMap = {
            soilTemperature: '🌡️ 土壤温度',
            soilMoisture: '💧 土壤湿度',
            lightIntensity: '☀️ 光照强度',
            co2Concentration: '🌬️ CO2浓度',
            workingHours: '⏰ 工作时长',
            pestCount: '🐛 诱虫数量',
            voltage: '⚡ 电压',
            power: '🔋 功率',
            pestTypes: '🔍 害虫种类',
            totalCount: '📊 总数量',
            recognitionRate: '🎯 识别率',
            lastScan: '⏱️ 最后扫描'
        };
        
        const label = labelMap[key] || key;
        
        return `
            <div class="sensor-item">
                <span class="sensor-label">${label}:</span>
                <span class="sensor-value">${value}</span>
            </div>
        `;
    }).join('');
}

/**
 * 格式化日期时间
 */
function formatDateTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * 移除现有设备弹窗
 */
function removeExistingDevicePopup() {
    // 停止弹窗跟随更新
    stopDevicePopupFollowing();
    
    const existingPopup = document.querySelector('.device-popup-container');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // 清理全局变量
    currentDevicePopup = null;
    devicePopupWorldPosition = null;
}

/**
 * 关闭设备弹窗
 */
function closeDevicePopup() {
    removeExistingDevicePopup();
}

// 确保函数在全局范围内可访问
window.closeDevicePopup = closeDevicePopup;

/**
 * 启动设备弹窗跟随更新
 */
function startDevicePopupFollowing() {
    if (!window.cesiumViewer || !currentDevicePopup || !devicePopupWorldPosition) {
        console.debug('无法启动设备弹窗跟随: 缺少必要组件');
        return;
    }
    
    console.log('🎯 启动设备弹窗跟随更新');
    
    // 停止之前的更新循环
    stopDevicePopupFollowing();
    
    // 创建更新函数
    const updateDevicePopupPosition = () => {
        if (!currentDevicePopup || !devicePopupWorldPosition || !window.cesiumViewer) {
            return;
        }
        
        try {
            // 将世界坐标转换为屏幕坐标
            const screenPosition = Cesium.SceneTransforms.wgs84ToWindowCoordinates(
                window.cesiumViewer.scene,
                devicePopupWorldPosition
            );
            
            if (screenPosition && Cesium.defined(screenPosition)) {
                // 获取Cesium容器的位置偏移
                const cesiumContainer = document.getElementById('cesium-container');
                const containerRect = cesiumContainer ? cesiumContainer.getBoundingClientRect() : { left: 0, top: 0 };
                
                // 计算最终位置
                let finalX = screenPosition.x + containerRect.left;
                let finalY = screenPosition.y + containerRect.top - 20; // 弹窗显示在点击位置上方
                
                // 边界检测和调整
                const popupRect = currentDevicePopup.getBoundingClientRect();
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
                currentDevicePopup.style.left = `${finalX}px`;
                currentDevicePopup.style.top = `${finalY}px`;
                
                console.debug('设备弹窗位置更新:', { x: finalX, y: finalY });
            } else {
                console.debug('无法获取设备屏幕坐标');
            }
        } catch (error) {
            console.debug('设备弹窗位置更新失败:', error);
        }
    };
    
    // 立即执行一次位置更新
    updateDevicePopupPosition();
    
    // 方法1: 监听相机变化事件
    try {
        devicePopupUpdateHandler = window.cesiumViewer.camera.changed.addEventListener(updateDevicePopupPosition);
        console.log('✅ 设备弹窗相机变化事件监听器已绑定');
    } catch (error) {
        console.debug('绑定设备弹窗相机事件失败:', error);
    }
    
    // 方法2: 使用高频定时器确保更新
    const intervalId = setInterval(() => {
        if (!currentDevicePopup || !document.body.contains(currentDevicePopup)) {
            clearInterval(intervalId);
            return;
        }
        updateDevicePopupPosition();
    }, 33); // 约30fps，平衡性能和流畅度
    
    // 方法3: 监听场景渲染事件
    try {
        const renderHandler = window.cesiumViewer.scene.postRender.addEventListener(updateDevicePopupPosition);
        
        // 保存所有处理器以便清理
        if (!window.devicePopupUpdateHandlers) {
            window.devicePopupUpdateHandlers = [];
        }
        window.devicePopupUpdateHandlers.push({
            type: 'render',
            handler: renderHandler,
            remove: () => window.cesiumViewer.scene.postRender.removeEventListener(renderHandler)
        });
    } catch (error) {
        console.debug('绑定设备弹窗渲染事件失败:', error);
    }
    
    // 保存定时器ID以便清理
    if (!window.devicePopupIntervals) {
        window.devicePopupIntervals = [];
    }
    window.devicePopupIntervals.push(intervalId);
}

/**
 * 停止设备弹窗跟随更新
 */
function stopDevicePopupFollowing() {
    console.log('🛑 停止设备弹窗跟随更新');
    
    // 移除相机事件监听器
    if (devicePopupUpdateHandler && window.cesiumViewer) {
        try {
            window.cesiumViewer.camera.changed.removeEventListener(devicePopupUpdateHandler);
            console.log('✅ 设备弹窗相机事件监听器已移除');
        } catch (error) {
            console.debug('移除设备弹窗相机事件监听器失败:', error);
        }
        devicePopupUpdateHandler = null;
    }
    
    // 清理所有更新处理器
    if (window.devicePopupUpdateHandlers) {
        window.devicePopupUpdateHandlers.forEach(handler => {
            try {
                handler.remove();
            } catch (error) {
                console.debug('移除设备弹窗更新处理器失败:', error);
            }
        });
        window.devicePopupUpdateHandlers = [];
    }
    
    // 清理定时器
    if (window.devicePopupIntervals) {
        window.devicePopupIntervals.forEach(id => clearInterval(id));
        window.devicePopupIntervals = [];
        console.log('✅ 设备弹窗定时器已清理');
    }
}

/**
 * 更新设备统计信息
 */
function updateDeviceStatistics() {
    const stats = {
        total: deviceEntities.length,
        online: 0,
        offline: 0,
        warning: 0,
        maintenance: 0,
        byType: {}
    };
    
    deviceEntities.forEach(item => {
        const device = item.data;
        stats[device.status]++;
        
        if (!stats.byType[device.type]) {
            stats.byType[device.type] = 0;
        }
        stats.byType[device.type]++;
    });
    
    console.log('📊 设备统计信息:', stats);
    
    // 这里可以更新右侧数据看板
    if (typeof updateDeviceMonitoringDashboard === 'function') {
        updateDeviceMonitoringDashboard(stats);
    }
}

/**
 * 获取设备统计信息
 */
function getDeviceStats() {
    const stats = {
        total: deviceEntities.length,
        online: 0,
        offline: 0,
        warning: 0,
        maintenance: 0,
        byType: {}
    };
    
    deviceEntities.forEach(item => {
        const device = item.data;
        stats[device.status]++;
        
        if (!stats.byType[device.type]) {
            stats.byType[device.type] = 0;
        }
        stats.byType[device.type]++;
    });
    
    return stats;
}

// 导出函数供其他模块使用
if (typeof window !== 'undefined') {
    window.DeviceMonitoring = {
        init: initDeviceMonitoring,
        toggle: toggleDeviceMonitoring,
        getStats: getDeviceStats,
        closePopup: closeDevicePopup
    };
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保Cesium已加载
    setTimeout(() => {
        console.log('🚀 开始初始化设备监控系统...');
        if (window.cesiumViewer) {
            initDeviceMonitoring();
        } else {
            console.warn('⚠️ Cesium Viewer未准备就绪，等待更长时间...');
            setTimeout(() => {
                initDeviceMonitoring();
            }, 3000);
        }
    }, 2000);
});