/**
 * 农情遥感系统大屏 - 气象监测功能JavaScript文件
 * 功能：气象数据处理、图层控制、数据可视化、交互控制等
 */

// ===== 全局变量 =====
let temperatureTrendChart = null;
let weatherAnimationInterval = null;
let currentTimeIndex = 0;
let isPlaying = false;

// 气象图层状态 - MSN天气风格：一次只显示一个图层
const weatherLayerStates = {
    precipitation: { visible: true, opacity: 0.9 },
    'soil-temperature': { visible: false, opacity: 0.8 },
    temperature: { visible: false, opacity: 0.8 },
    'accumulated-temperature': { visible: false, opacity: 0.7 },
    'accumulated-precipitation': { visible: false, opacity: 0.7 },
    humidity: { visible: false, opacity: 0.8 }
};

// 当前活跃的图层
let currentActiveLayer = null; // 默认没有选择任何图层

// 弹窗相关变量
let weatherTooltip = null;
let mouseHandler = null;

// 时间控制相关变量
let currentTimeMode = 'historical'; // 'historical', 'current', 'forecast'
let selectedDateTime = new Date(); // 当前选择的时间
let animationSpeed = 1; // 动画播放速度
let isAnimationPlaying = false;
let animationInterval = null;

// 模拟气象数据
const weatherData = {
    current: {
        temperature: 18.00,
        humidity: 65.00,
        windSpeed: 3.20,
        windDirection: '东南风',
        pressure: 1013.00,
        visibility: 15.00,
        feelsLike: 20.00,
        weather: '多云',
        icon: '☁️',
        precipitation: 0.0,
        soilTemperature: 16.50,
        accumulatedTemperature: 1250.0,
        accumulatedPrecipitation: 85.5
    },
    hourlyForecast: generateHourlyData(),
    weeklyForecast: [
        { date: '今天', weather: '☁️', temp: '18.00°/8.00°', desc: '多云' },
        { date: '明天', weather: '🌧️', temp: '15.00°/6.00°', desc: '小雨' },
        { date: '周三', weather: '☀️', temp: '22.00°/10.00°', desc: '晴' },
        { date: '周四', weather: '⛅', temp: '20.00°/12.00°', desc: '多云' },
        { date: '周五', weather: '🌧️', temp: '16.00°/8.00°', desc: '中雨' },
        { date: '周六', weather: '🌤️', temp: '19.00°/9.00°', desc: '多云' },
        { date: '周日', weather: '☀️', temp: '24.00°/14.00°', desc: '晴' }
    ],
    alerts: [
        {
            type: 'warning',
            icon: '🌧️',
            title: '暴雨黄色预警',
            time: '14:20'
        },
        {
            type: 'info',
            icon: '🌡️',
            title: '低温蓝色预警',
            time: '08:00'
        }
    ]
};

// ===== 数据生成函数 =====

/**
 * 生成24小时温度数据
 */
function generateHourlyData() {
    const data = [];
    const baseTemp = 18;
    
    for (let i = 0; i < 24; i++) {
        // 模拟温度变化曲线
        const hourTemp = baseTemp + Math.sin((i - 6) * Math.PI / 12) * 8 + Math.random() * 2 - 1;
        data.push({
            hour: i,
            temperature: parseFloat(hourTemp.toFixed(2)),
            humidity: parseFloat((60 + Math.random() * 20).toFixed(2)),
            windSpeed: parseFloat((2 + Math.random() * 4).toFixed(2))
        });
    }
    
    return data;
}

// ===== 气象监测模块初始化 =====

/**
 * 初始化气象监测功能
 */
function initWeatherMonitoring() {
    console.log('🌤️ 初始化气象监测功能...');
    
    // 初始化图层控制
    initWeatherLayerControls();
    
    // 初始化时间控制
    initTimeControls();
    
    // 初始化数据看板
    initWeatherDashboard();
    
    // 初始化图表
    initWeatherCharts();
    
    // 启动数据更新
    startWeatherDataUpdate();
    
    // 默认不加载任何图层，等用户手动选择
    console.log('ℹ️ 默认无图层选中，等待用户选择');
    
    // 初始化气象数据弹窗
    initWeatherTooltip();
    
    console.log('✅ 气象监测功能初始化完成');
}

/**
 * 初始化默认气象图层
 */
function initDefaultWeatherLayer() {
    // 延迟初始化，确保Cesium地图已完全加载
    setTimeout(() => {
        if (window.cesiumViewer && currentActiveLayer) {
            console.log(`🌤️ 初始化默认气象图层: ${currentActiveLayer}`);
            toggleWeatherLayer(currentActiveLayer, true);
        }
    }, 2000);
}

// ===== 图层控制模块 =====

/**
 * 初始化气象图层控制 - MSN天气风格
 */
function initWeatherLayerControls() {
    console.log('🗺️ 初始化气象图层控制...');
    
    // 气象选项卡点击控制
    const weatherTabs = document.querySelectorAll('.weather-tab');
    weatherTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const layerType = this.dataset.layer;
            toggleWeatherLayerSelection(layerType);
        });
    });
    
    // 透明度控制
    const opacitySlider = document.getElementById('layer-opacity-slider');
    const opacityValue = document.getElementById('opacity-value');
    
    if (opacitySlider) {
        opacitySlider.addEventListener('input', function() {
            const opacity = parseInt(this.value) / 100;
            
            // 只有在有活跃图层时才更新透明度
            if (currentActiveLayer) {
                // 更新当前活跃图层的透明度
                weatherLayerStates[currentActiveLayer].opacity = opacity;
                setWeatherLayerOpacity(currentActiveLayer, opacity);
                
                console.log(`🎨 ${currentActiveLayer}图层透明度: ${this.value}%`);
            } else {
                console.log('ℹ️ 请先选择一个气象图层');
            }
            
            // 更新显示值
            if (opacityValue) {
                opacityValue.textContent = `${this.value}%`;
            }
        });
    }
    
    console.log('✅ 气象图层控制初始化完成');
}

/**
 * 获取图层键名
 */
function getLayerKey(layerId) {
    const layerMapping = {
        'temp': 'temperature',
        'rain': 'precipitation',
        'wind': 'wind',
        'humidity': 'humidity',
        'soil-temp': 'soil-temperature'
    };
    
    return layerMapping[layerId] || layerId;
}

/**
 * 切换气象图层选择状态 - 支持选中/取消选中
 */
function toggleWeatherLayerSelection(layerType) {
    console.log(`🔄 切换气象图层选择: ${layerType}`);
    
    // 如果当前没有选中任何图层，或者选中的是其他图层，则选中当前图层
    if (currentActiveLayer !== layerType) {
        // 隐藏之前选中的图层
        if (currentActiveLayer) {
            toggleWeatherLayer(currentActiveLayer, false);
            weatherLayerStates[currentActiveLayer].visible = false;
        }
        
        // 显示新的图层
        toggleWeatherLayer(layerType, true);
        weatherLayerStates[layerType].visible = true;
        currentActiveLayer = layerType;
        
        // 确保应用当前的透明度设置
        setTimeout(() => {
            setWeatherLayerOpacity(layerType, weatherLayerStates[layerType].opacity);
        }, 100);
        
        console.log(`✅ 已选中 ${layerType} 图层`);
    } else {
        // 如果当前选中的就是这个图层，则取消选中
        toggleWeatherLayer(layerType, false);
        weatherLayerStates[layerType].visible = false;
        currentActiveLayer = null;
        
        console.log(`✅ 已取消选中 ${layerType} 图层`);
    }
    
    // 更新UI状态
    updateWeatherTabsUI(currentActiveLayer);
    
    // 更新透明度滑块和弹窗
    if (currentActiveLayer) {
        updateOpacitySlider(currentActiveLayer);
        updateTooltipLayerType(currentActiveLayer);
    }
    
    // 更新选择器中的对应状态
    syncLayerCheckbox(layerType, currentActiveLayer === layerType);
}

/**
 * 切换到指定气象图层 - MSN天气风格
 */
function switchToWeatherLayer(layerType) {
    console.log(`🔄 切换到气象图层: ${layerType}`);
    
    // 隐藏当前活跃图层
    if (currentActiveLayer && currentActiveLayer !== layerType) {
        weatherLayerStates[currentActiveLayer].visible = false;
        toggleWeatherLayer(currentActiveLayer, false);
    }
    
    // 显示新选择的图层
    weatherLayerStates[layerType].visible = true;
    toggleWeatherLayer(layerType, true);
    
    // 更新当前活跃图层
    currentActiveLayer = layerType;
    
    // 确保应用当前的透明度设置
    setTimeout(() => {
        setWeatherLayerOpacity(layerType, weatherLayerStates[layerType].opacity);
    }, 100);
    
    // 更新UI状态
    updateWeatherTabsUI(layerType);
    
    // 更新透明度滑块
    updateOpacitySlider(layerType);
    
    // 更新弹窗图层显示
    updateTooltipLayerType(layerType);
    
    // 更新选择器中的对应状态
    syncLayerCheckbox(layerType, true);
    
    console.log(`✅ 已切换到 ${layerType} 图层`);
}

/**
 * 更新气象选项卡UI状态
 */
function updateWeatherTabsUI(activeLayer) {
    const weatherTabs = document.querySelectorAll('.weather-tab');
    
    weatherTabs.forEach(tab => {
        const layerType = tab.dataset.layer;
        
        if (layerType === activeLayer && activeLayer !== null) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
}

/**
 * 更新透明度滑块
 */
function updateOpacitySlider(layerType) {
    const opacitySlider = document.getElementById('layer-opacity-slider');
    const opacityValue = document.getElementById('opacity-value');
    
    if (opacitySlider && weatherLayerStates[layerType]) {
        const opacity = Math.round(weatherLayerStates[layerType].opacity * 100);
        opacitySlider.value = opacity;
        
        if (opacityValue) {
            opacityValue.textContent = `${opacity}%`;
        }
        
        console.log(`🎛️ 透明度滑块更新: ${layerType} = ${opacity}%`);
    }
}

/**
 * 切换气象图层显示
 */
function toggleWeatherLayer(layerType, visible) {
    if (!window.cesiumViewer) {
        console.warn('❌ Cesium Viewer未初始化');
        return;
    }
    
    // 获取或创建气象图层（使用layerType作为标识）
    let existingLayer = null;
    
    // 查找现有图层
    for (let i = 0; i < window.cesiumViewer.imageryLayers.length; i++) {
        const layer = window.cesiumViewer.imageryLayers.get(i);
        if (layer._name === layerType) {
            existingLayer = layer;
            break;
        }
    }
    
    if (visible) {
        if (!existingLayer) {
            // 创建新的气象图层
            existingLayer = createWeatherLayer(layerType);
            if (existingLayer) {
                // _name已在createWeatherLayer中设置为layerType
                window.cesiumViewer.imageryLayers.add(existingLayer);
                console.log(`✅ 已添加气象图层: ${layerType}`);
            }
        }
        if (existingLayer) {
            existingLayer.show = true;
            console.log(`👁️ 显示气象图层: ${layerType}`);
        }
    } else {
        if (existingLayer) {
            existingLayer.show = false;
            console.log(`🙈 隐藏气象图层: ${layerType}`);
        }
    }
    
    console.log(`🌤️ ${layerType}图层${visible ? '显示' : '隐藏'}`);
}

/**
 * 创建气象图层
 */
function createWeatherLayer(layerType) {
    if (!window.cesiumViewer) {
        console.warn('❌ Cesium Viewer未初始化');
        return null;
    }
    
    let imageryProvider = null;
    
    try {
        switch (layerType) {
            case 'precipitation':
                // 降雨数据图层 - 使用像素级栅格化数据
                console.log('🌧️ 创建降雨像素级图层...');
                imageryProvider = createWeatherRasterLayer('precipitation');
                break;
                
            case 'temperature':
                // 气温数据图层 - 使用像素级栅格化数据
                console.log('🌡️ 创建气温像素级图层...');
                imageryProvider = createWeatherRasterLayer('temperature');
                break;
                
            case 'soil-temperature':
                // 地温数据图层 - 栅格化模拟图层
                imageryProvider = createWeatherRasterLayer('soil-temperature');
                break;
                
            case 'accumulated-temperature':
                // 积温图层 - 栅格化模拟图层
                imageryProvider = createWeatherRasterLayer('accumulated-temperature');
                break;
                
            case 'accumulated-precipitation':
                // 积雨图层 - 栅格化模拟图层
                imageryProvider = createWeatherRasterLayer('accumulated-precipitation');
                break;
                
            case 'humidity':
                // 湿度图层 - 栅格化模拟图层
                imageryProvider = createWeatherRasterLayer('humidity');
                break;
                
            default:
                console.warn(`❌ 未知的气象图层类型: ${layerType}`);
                return null;
        }
        
        if (imageryProvider) {
            const layer = new Cesium.ImageryLayer(imageryProvider);
            layer.alpha = weatherLayerStates[layerType]?.opacity || 0.8;
            layer._name = layerType; // 添加标识以便后续查找
            return layer;
        }
        
    } catch (error) {
        console.error(`❌ 创建${layerType}图层失败:`, error);
        // 如果创建失败，使用备用栅格化图层
        const fallbackProvider = createWeatherRasterLayer(layerType);
        if (fallbackProvider) {
            const layer = new Cesium.ImageryLayer(fallbackProvider);
            layer.alpha = weatherLayerStates[layerType]?.opacity || 0.8;
            layer._name = layerType; // 添加标识以便后续查找
            return layer;
        }
    }
    
    return null;
}

/**
 * 创建像素级栅格化气象图层
 */
function createSimulatedWeatherLayer(name, color, opacity) {
    // 创建高分辨率Canvas，每个像素点作为一个数据单元
    const canvas = document.createElement('canvas');
    canvas.width = 1024;  // 增加分辨率
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    
    // 创建ImageData对象，直接操作像素数据
    const imageData = context.createImageData(1024, 1024);
    const data = imageData.data;
    
    // 解析颜色
    const hexColor = color.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    // 为每个像素点生成数据
    for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
            const index = (y * 1024 + x) * 4;
            
            // 计算相对位置
            const centerX = 512;
            const centerY = 512;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
            
            // 基于距离和噪声生成强度
            let intensity = 1 - (distance / maxDistance);
            
            // 添加多层噪声创造更真实的效果
            const noise1 = Math.sin(x * 0.02) * Math.cos(y * 0.02) * 0.3;
            const noise2 = Math.sin(x * 0.05) * Math.sin(y * 0.05) * 0.2;
            const noise3 = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 0.1;
            const randomNoise = (Math.random() - 0.5) * 0.1;
            
            intensity += noise1 + noise2 + noise3 + randomNoise;
            intensity = Math.max(0, Math.min(1, intensity));
            
            // 设置像素颜色
            if (intensity > 0.05) { // 过滤太弱的信号
                data[index] = r;     // Red
                data[index + 1] = g; // Green
                data[index + 2] = b; // Blue
                data[index + 3] = Math.floor(intensity * 255 * opacity); // Alpha
            } else {
                data[index] = 0;
                data[index + 1] = 0;
                data[index + 2] = 0;
                data[index + 3] = 0; // 透明
            }
        }
    }
    
    // 将像素数据绘制到画布
    context.putImageData(imageData, 0, 0);
    
    // 转换为Base64数据URL
    const dataUrl = canvas.toDataURL();
    
    return new Cesium.SingleTileImageryProvider({
        url: dataUrl,
        rectangle: Cesium.Rectangle.fromDegrees(102.5, 34.5, 104.5, 36.5), // 临夏地区范围
        credit: `像素级${name}数据`
    });
}

/**
 * 创建特定类型的像素级气象图层
 */
function createWeatherRasterLayer(layerType) {
    console.log(`🎨 开始创建 ${layerType} 像素级图层...`);
    
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    
    // 创建ImageData对象，直接操作像素数据
    const imageData = context.createImageData(1024, 1024);
    const data = imageData.data;
    
    switch(layerType) {
        case 'precipitation':
            // 降雨 - 蓝色系，集中分布模式
            drawPixelPrecipitation(data, '#0066FF');
            break;
        case 'temperature':
            // 气温 - 红橙色系，温度梯度模式
            drawPixelTemperature(data, '#FF2D00');
            break;
        case 'soil-temperature':
            // 地温 - 棕色系，地表温度模式
            drawPixelSoilTemperature(data, '#CD853F');
            break;
        case 'accumulated-temperature':
            // 积温 - 深橙色系，累积效应模式
            drawPixelAccumulatedTemp(data, '#FF4500');
            break;
        case 'accumulated-precipitation':
            // 积雨 - 深蓝色系，累积降水模式
            drawPixelAccumulatedPrecip(data, '#1E90FF');
            break;
        case 'humidity':
            // 湿度 - 青绿色系，湿度分布模式
            drawPixelHumidity(data, '#00CED1');
            break;
        default:
            return createSimulatedWeatherLayer('未知', '#888888', 0.5);
    }
    
    // 将像素数据绘制到画布
    context.putImageData(imageData, 0, 0);
    
    const dataUrl = canvas.toDataURL();
    console.log(`✅ ${layerType} 像素级图层创建成功`);
    
    return new Cesium.SingleTileImageryProvider({
        url: dataUrl,
        rectangle: Cesium.Rectangle.fromDegrees(102.5, 34.5, 104.5, 36.5),
        credit: `像素级${layerType}数据`
    });
}

/**
 * 绘制像素级降雨数据 - 雨带效应模式
 */
function drawPixelPrecipitation(data, baseColor) {
    const hexColor = baseColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
            const index = (y * 1024 + x) * 4;
            
            // 创建雨带效应
            const rainBand = Math.sin(x * 0.008 + y * 0.006) * 0.5 + 0.5;
            const rainfall = Math.sin(x * 0.02) * Math.cos(y * 0.015) * 0.3;
            let intensity = rainBand * (rainfall + 0.3) * (Math.random() * 0.7 + 0.3);
            
            intensity = Math.max(0, Math.min(1, intensity));
            
            if (intensity > 0.1) {
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = Math.floor(intensity * 220);
            } else {
                data[index + 3] = 0; // 透明
            }
        }
    }
}

/**
 * 绘制像素级气温数据 - 温度梯度模式
 */
function drawPixelTemperature(data, baseColor) {
    const hexColor = baseColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
            const index = (y * 1024 + x) * 4;
            
            // 从上到下的温度梯度 + 随机变化
            const gradient = 1 - (y / 1024);
            const thermal = Math.sin(x * 0.01) * Math.sin(y * 0.008) * 0.2;
            let intensity = gradient + thermal + (Math.random() - 0.5) * 0.3;
            
            intensity = Math.max(0, Math.min(1, intensity));
            
            if (intensity > 0.1) {
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = Math.floor(intensity * 200);
            } else {
                data[index + 3] = 0;
            }
        }
    }
}

/**
 * 绘制像素级地温数据 - 地表温度模式
 */
function drawPixelSoilTemperature(data, baseColor) {
    const hexColor = baseColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
            const index = (y * 1024 + x) * 4;
            
            // 块状分布，模拟土壤温度分布
            const blockX = Math.floor(x / 80);
            const blockY = Math.floor(y / 80);
            const block = blockX + blockY;
            const soilPattern = Math.sin(block * 0.5) * 0.3 + 0.7;
            const microVariation = Math.sin(x * 0.05) * Math.cos(y * 0.04) * 0.2;
            let intensity = soilPattern * (microVariation + 0.5) * (Math.random() * 0.4 + 0.6);
            
            intensity = Math.max(0, Math.min(1, intensity));
            
            if (intensity > 0.2) {
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = Math.floor(intensity * 180);
            } else {
                data[index + 3] = 0;
            }
        }
    }
}

/**
 * 绘制像素级积温数据 - 累积效应模式
 */
function drawPixelAccumulatedTemp(data, baseColor) {
    const hexColor = baseColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
            const index = (y * 1024 + x) * 4;
            
            // 从中心向外递减的累积效应
            const centerX = 512;
            const centerY = 512;
            const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
            const maxDistance = Math.sqrt(centerX ** 2 + centerY ** 2);
            
            const accumulation = 1 - (distance / maxDistance);
            const seasonal = Math.sin(x * 0.003) * Math.cos(y * 0.004) * 0.3;
            let intensity = accumulation * (seasonal + 0.5) * (Math.random() * 0.4 + 0.6);
            
            intensity = Math.max(0, Math.min(1, intensity));
            
            if (intensity > 0.2) {
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = Math.floor(intensity * 190);
            } else {
                data[index + 3] = 0;
            }
        }
    }
}

/**
 * 绘制像素级积雨数据 - 累积降水模式
 */
function drawPixelAccumulatedPrecip(data, baseColor) {
    const hexColor = baseColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
            const index = (y * 1024 + x) * 4;
            
            // 河流状分布模拟积雨
            const stream1 = Math.sin(x * 0.012) * Math.cos(y * 0.009);
            const stream2 = Math.cos(x * 0.008) * Math.sin(y * 0.012);
            const drainage = Math.abs(stream1 + stream2 * 0.5);
            let intensity = drainage * (Math.random() * 0.6 + 0.4);
            
            intensity = Math.max(0, Math.min(1, intensity));
            
            if (intensity > 0.25) {
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = Math.floor(intensity * 210);
            } else {
                data[index + 3] = 0;
            }
        }
    }
}

/**
 * 绘制像素级湿度数据 - 湿度分布模式
 */
function drawPixelHumidity(data, baseColor) {
    const hexColor = baseColor.replace('#', '');
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    
    for (let y = 0; y < 1024; y++) {
        for (let x = 0; x < 1024; x++) {
            const index = (y * 1024 + x) * 4;
            
            // 波浪状分布模拟湿度
            const wave1 = Math.sin(x * 0.006) * Math.sin(y * 0.008);
            const wave2 = Math.cos(x * 0.004) * Math.cos(y * 0.006);
            const humidity = (wave1 + wave2) * 0.5 + 0.5;
            const moisture = Math.sin(x * 0.02) * Math.cos(y * 0.015) * 0.2;
            let intensity = humidity * (moisture + 0.5) * (Math.random() * 0.5 + 0.5);
            
            intensity = Math.max(0, Math.min(1, intensity));
            
            if (intensity > 0.2) {
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = Math.floor(intensity * 170);
            } else {
                data[index + 3] = 0;
            }
        }
    }
}

/**
 * 创建备用气象图层（当网络图层失败时使用）
 */
function createFallbackWeatherLayer(layerType) {
    return createWeatherRasterLayer(layerType);
}

/**
 * 设置气象图层透明度
 */
function setWeatherLayerOpacity(layerType, opacity) {
    if (!window.cesiumViewer) {
        console.warn('❌ Cesium Viewer未初始化');
        return;
    }
    
    // 查找对应的图层（使用layerType作为标识）
    for (let i = 0; i < window.cesiumViewer.imageryLayers.length; i++) {
        const layer = window.cesiumViewer.imageryLayers.get(i);
        if (layer._name === layerType) {
            layer.alpha = opacity;
            console.log(`🎨 ${layerType}图层透明度设置为: ${Math.round(opacity * 100)}%`);
            return;
        }
    }
    
    console.warn(`⚠️ 未找到图层: ${layerType}`);
}

// ===== 时间控制模块 =====

/**
 * 初始化时间控制
 */
function initTimeControls() {
    console.log('⏰ 初始化历史数据时间控制...');
    
    // 初始化历史日期选择器
    initHistoricalDatePicker();
    
    // 时间模式选择
    const modeTabs = document.querySelectorAll('.mode-tab');
    modeTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const mode = this.dataset.mode;
            switchTimeMode(mode);
        });
    });
    
    // 历史时间选择器
    const historicalDate = document.getElementById('historical-date');
    const historicalTime = document.getElementById('historical-time');
    
    if (historicalDate) {
        historicalDate.addEventListener('change', function() {
            updateSelectedDateTime();
        });
    }
    
    if (historicalTime) {
        historicalTime.addEventListener('change', function() {
            updateSelectedDateTime();
        });
    }
    
    // 快速历史按钮
    const quickBtns = document.querySelectorAll('.quick-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const days = parseInt(this.dataset.days);
            setQuickHistoricalDate(days);
        });
    });
    
    // 预报时间选择
    const forecastSelect = document.getElementById('forecast-time');
    if (forecastSelect) {
        forecastSelect.addEventListener('change', function() {
            const selectedTime = this.value;
            updateForecastTime(selectedTime);
        });
    }
    
    // 时间轴滑块（支持历史和预报）
    const timeSlider = document.getElementById('time-slider');
    if (timeSlider) {
        timeSlider.addEventListener('input', function() {
            const timeOffset = parseInt(this.value);
            updateTimeSlider(timeOffset);
        });
    }
    
    // 动画控制按钮
    initAnimationControls();
    
    // 默认设置为预报模式
    switchTimeMode('forecast');
    
    console.log('✅ 历史数据时间控制初始化完成');
}

/**
 * 更新预报时间
 */
function updateForecastTime(timeValue) {
    // 根据选择的时间更新数据显示
    const timeMapping = {
        'current': 0,
        '1h': 1,
        '3h': 3,
        '6h': 6,
        '12h': 12,
        '24h': 24
    };
    
    const hoursAhead = timeMapping[timeValue] || 0;
    updateWeatherAtTime(hoursAhead);
}

/**
 * 更新指定时间的气象数据
 */
function updateWeatherAtTime(hoursAhead) {
    // 这里可以调用API获取指定时间的气象数据
    // 暂时使用模拟数据
    
    const timeSlider = document.getElementById('time-slider');
    if (timeSlider) {
        timeSlider.value = hoursAhead;
    }
    
    // 更新地图上的气象图层
    if (typeof window.updateMapWeatherAtTime === 'function') {
        window.updateMapWeatherAtTime(hoursAhead);
    }
}

/**
 * 开始气象动画播放
 */
function startWeatherAnimation() {
    if (isPlaying) return;
    
    isPlaying = true;
    
    weatherAnimationInterval = setInterval(() => {
        currentTimeIndex++;
        
        if (currentTimeIndex > 168) { // 7天 = 168小时
            currentTimeIndex = 0;
        }
        
        updateWeatherAtTime(currentTimeIndex);
        
        // 更新播放状态显示
        const playBtn = document.getElementById('play-btn');
        if (playBtn) {
            playBtn.textContent = '⏸️ 播放中';
            playBtn.disabled = true;
        }
        
    }, 200); // 每200ms切换一次时间
    
    console.log('▶️ 开始播放气象动画');
}

/**
 * 暂停气象动画播放
 */
function pauseWeatherAnimation() {
    if (!isPlaying) return;
    
    isPlaying = false;
    
    if (weatherAnimationInterval) {
        clearInterval(weatherAnimationInterval);
        weatherAnimationInterval = null;
    }
    
    // 恢复播放按钮状态
    const playBtn = document.getElementById('play-btn');
    if (playBtn) {
        playBtn.textContent = '▶️ 播放';
        playBtn.disabled = false;
    }
    
    console.log('⏸️ 暂停气象动画播放');
}

/**
 * 重置气象动画
 */
function resetWeatherAnimation() {
    pauseWeatherAnimation();
    
    currentTimeIndex = 0;
    updateWeatherAtTime(0);
    
    console.log('🔄 重置气象动画');
}

// ===== 数据看板模块 =====

/**
 * 初始化气象数据看板
 */
function initWeatherDashboard() {
    console.log('📊 初始化气象数据看板...');
    
    // 更新当前天气
    updateCurrentWeather();
    
    // 更新7天预报
    updateWeeklyForecast();
    
    // 更新农业气象指数
    updateAgriWeatherIndex();
    
    // 更新气象预警
    updateWeatherAlerts();
    
    console.log('✅ 气象数据看板初始化完成');
}

/**
 * 更新当前天气显示
 */
function updateCurrentWeather() {
    const current = weatherData.current;
    
    // 更新天气图标和描述
    const weatherIcon = document.querySelector('.weather-icon');
    const weatherDesc = document.querySelector('.weather-desc');
    const weatherTemp = document.querySelector('.weather-temp');
    
    if (weatherIcon) weatherIcon.textContent = current.icon;
    if (weatherDesc) weatherDesc.textContent = current.weather;
    if (weatherTemp) weatherTemp.textContent = `${current.temperature.toFixed(2)}°C`;
    
    // 更新详细信息
    const detailItems = document.querySelectorAll('.detail-item');
    const details = [
        current.feelsLike.toFixed(2) + '°C',
        current.humidity.toFixed(2) + '%',
        current.windSpeed.toFixed(2) + ' m/s',
        current.windDirection,
        current.pressure.toFixed(2) + ' hPa',
        current.visibility.toFixed(2) + ' km'
    ];
    
    detailItems.forEach((item, index) => {
        const valueElement = item.querySelector('.detail-value');
        if (valueElement && details[index]) {
            valueElement.textContent = details[index];
        }
    });
    
}

/**
 * 更新7天天气预报
 */
function updateWeeklyForecast() {
    const forecastItems = document.querySelectorAll('.forecast-item');
    const forecasts = weatherData.weeklyForecast;
    
    forecastItems.forEach((item, index) => {
        if (forecasts[index]) {
            const forecast = forecasts[index];
            
            const dateElement = item.querySelector('.forecast-date');
            const weatherElement = item.querySelector('.forecast-weather');
            const tempElement = item.querySelector('.forecast-temp');
            const descElement = item.querySelector('.forecast-desc');
            
            if (dateElement) dateElement.textContent = forecast.date;
            if (weatherElement) weatherElement.textContent = forecast.weather;
            if (tempElement) tempElement.textContent = forecast.temp;
            if (descElement) descElement.textContent = forecast.desc;
        }
    });
}

/**
 * 更新农业气象指数
 */
function updateAgriWeatherIndex() {
    // 模拟农业气象指数计算
    const indices = [
        { label: '作物适宜度', value: '适宜', class: 'good', progress: 75 },
        { label: '病虫害风险', value: '中等', class: 'warning', progress: 45 },
        { label: '灌溉建议', value: '不需要', class: 'info', progress: 20 }
    ];
    
    const indexItems = document.querySelectorAll('.index-item');
    
    indexItems.forEach((item, index) => {
        if (indices[index]) {
            const indexData = indices[index];
            
            const valueElement = item.querySelector('.index-value');
            const progressElement = item.querySelector('.progress-fill');
            
            if (valueElement) {
                valueElement.textContent = indexData.value;
                valueElement.className = `index-value ${indexData.class}`;
            }
            
            if (progressElement) {
                progressElement.style.width = `${indexData.progress}%`;
                progressElement.className = `progress-fill ${indexData.class}`;
            }
        }
    });
}

/**
 * 更新气象预警 - 保持滚动效果
 */
function updateWeatherAlerts() {
    const alertsContainer = document.querySelector('.weather-alerts');
    if (!alertsContainer) return;
    
    // 检查是否已经有滚动结构，如果有就不要覆盖
    const existingMarquee = alertsContainer.querySelector('.alerts-marquee');
    if (existingMarquee) {
        console.log('🔄 保持现有的滚动预警结构');
        return; // 保持现有的滚动结构，不要覆盖
    }
    
    // 只有在没有滚动结构时才创建静态预警（作为后备）
    alertsContainer.innerHTML = '';
    
    // 添加预警信息
    weatherData.alerts.forEach(alert => {
        const alertElement = document.createElement('div');
        alertElement.className = `alert-item ${alert.type}`;
        alertElement.innerHTML = `
            <div class="alert-icon">${alert.icon}</div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-time">发布时间：${alert.time}</div>
            </div>
        `;
        
        alertsContainer.appendChild(alertElement);
    });
}

// ===== 图表模块 =====

/**
 * 初始化气象图表
 */
function initWeatherCharts() {
    console.log('📈 初始化气象图表...');
    
    // 初始化24小时温度趋势图
    initTemperatureTrendChart();
    
    // 初始化7天预报温度趋势图
    initForecastTemperatureChart();
    
    // 初始化7天天气预报ECharts图表
    initSevenDayWeatherEChart();
    
    console.log('✅ 气象图表初始化完成');
}

/**
 * 初始化24小时温度趋势图
 */
function initTemperatureTrendChart() {
    const container = document.getElementById('temperature-trend-chart');
    if (!container) {
        console.warn('⚠️ 温度趋势图容器未找到');
        return;
    }
    
    // 确保ECharts已加载
    if (typeof echarts === 'undefined') {
        console.error('❌ ECharts library not loaded');
        return;
    }
    
    temperatureTrendChart = echarts.init(container);
    
    const hourlyData = weatherData.hourlyForecast;
    const hours = hourlyData.map(item => `${item.hour}:00`);
    const temperatures = hourlyData.map(item => item.temperature);
    const humidity = hourlyData.map(item => item.humidity);
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: {
                color: '#ffffff'
            },
                    formatter: function(params) {
            let result = `<div style="color: #00d4ff; font-weight: bold;">${params[0].axisValue}</div>`;
            params.forEach(param => {
                const value = typeof param.value === 'number' ? param.value.toFixed(2) : param.value;
                result += `<div style="color: ${param.color};">${param.seriesName}: ${value}${param.seriesName === '温度' ? '°C' : '%'}</div>`;
            });
            return result;
        }
        },
        legend: {
            data: ['温度', '湿度'],
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            },
            top: 5
        },
        grid: {
            left: '8%',
            right: '8%',
            top: '20%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: hours,
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 10,
                interval: 3
            },
            splitLine: {
                show: false
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '温度(°C)',
                nameTextStyle: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 10
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 10
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            {
                type: 'value',
                name: '湿度(%)',
                nameTextStyle: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 10
                },
                position: 'right',
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                },
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 10
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name: '温度',
                type: 'line',
                data: temperatures,
                smooth: true,
                lineStyle: {
                    color: '#00d4ff',
                    width: 2
                },
                itemStyle: {
                    color: '#00d4ff',
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 212, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 212, 255, 0.05)' }
                        ]
                    }
                },
                emphasis: {
                    focus: 'series'
                }
            },
            {
                name: '湿度',
                type: 'line',
                yAxisIndex: 1,
                data: humidity,
                smooth: true,
                lineStyle: {
                    color: '#4CAF50',
                    width: 2
                },
                itemStyle: {
                    color: '#4CAF50',
                    borderColor: '#ffffff',
                    borderWidth: 2
                },
                emphasis: {
                    focus: 'series'
                }
            }
        ]
    };
    
    temperatureTrendChart.setOption(option);
    
    // 窗口大小变化时重新调整图表
    window.addEventListener('resize', function() {
        if (temperatureTrendChart) {
            temperatureTrendChart.resize();
        }
    });
    
    console.log('✅ 温度趋势图初始化完成');
}

/**
 * 初始化7天预报温度趋势图（Canvas双线折线图）
 */
function initForecastTemperatureChart() {
    const canvas = document.getElementById('forecast-temperature-chart');
    if (!canvas) {
        console.warn('⚠️ 7天预报温度图容器未找到');
        return;
    }
    
    const ctx = canvas.getContext('2d');
    
    // 7天预报数据
    const forecastData = {
        dates: ['今天', '明天', '周三', '周四', '周五', '周六', '周日'],
        maxTemps: [18, 15, 22, 20, 16, 19, 24],
        minTemps: [8, 6, 10, 12, 8, 9, 14]
    };
    
    drawForecastTemperatureChart(ctx, canvas, forecastData);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        setTimeout(() => {
            const newCanvas = document.getElementById('forecast-temperature-chart');
            if (newCanvas) {
                const newCtx = newCanvas.getContext('2d');
                drawForecastTemperatureChart(newCtx, newCanvas, forecastData);
            }
        }, 100);
    });
    
    console.log('✅ 7天预报温度趋势图初始化完成');
}

/**
 * 绘制7天预报温度双线折线图
 */
function drawForecastTemperatureChart(ctx, canvas, data) {
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 设置画布样式
    ctx.font = '10px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 计算温度范围
    const allTemps = [...data.maxTemps, ...data.minTemps];
    const maxTemp = Math.max(...allTemps);
    const minTemp = Math.min(...allTemps);
    const tempRange = maxTemp - minTemp;
    const tempPadding = tempRange * 0.1;
    const chartMaxTemp = maxTemp + tempPadding;
    const chartMinTemp = minTemp - tempPadding;
    const chartTempRange = chartMaxTemp - chartMinTemp;
    
    // 计算坐标点
    const points = data.dates.length;
    const stepX = chartWidth / (points - 1);
    
    function getX(index) {
        return padding + index * stepX;
    }
    
    function getY(temp) {
        return padding + chartHeight - ((temp - chartMinTemp) / chartTempRange) * chartHeight;
    }
    
    // 绘制网格线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // 水平网格线
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }
    
    // 垂直网格线
    for (let i = 0; i < points; i++) {
        const x = getX(i);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
    }
    
    // 绘制最高温度线
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
        const x = getX(i);
        const y = getY(data.maxTemps[i]);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // 绘制最低温度线
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
        const x = getX(i);
        const y = getY(data.minTemps[i]);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // 绘制数据点和温度值
    for (let i = 0; i < points; i++) {
        const x = getX(i);
        
        // 最高温度点
        const maxY = getY(data.maxTemps[i]);
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(x, maxY, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 最高温度值
        ctx.fillStyle = '#FF6B6B';
        ctx.fillText(`${data.maxTemps[i]}°`, x, maxY - 12);
        
        // 最低温度点
        const minY = getY(data.minTemps[i]);
        ctx.fillStyle = '#4ECDC4';
        ctx.beginPath();
        ctx.arc(x, minY, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 最低温度值
        ctx.fillStyle = '#4ECDC4';
        ctx.fillText(`${data.minTemps[i]}°`, x, minY + 12);
        
        // 日期标签
        ctx.fillStyle = '#A0AEC0';
        ctx.fillText(data.dates[i], x, height - 15);
    }
    
    // 绘制图例
    const legendY = 15;
    const legendStartX = padding;
    
    // 最高温度图例
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(legendStartX, legendY);
    ctx.lineTo(legendStartX + 20, legendY);
    ctx.stroke();
    
    ctx.fillStyle = '#FF6B6B';
    ctx.textAlign = 'left';
    ctx.fillText('最高温度', legendStartX + 25, legendY);
    
    // 最低温度图例
    ctx.strokeStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.moveTo(legendStartX + 80, legendY);
    ctx.lineTo(legendStartX + 100, legendY);
    ctx.stroke();
    
    ctx.fillStyle = '#4ECDC4';
    ctx.fillText('最低温度', legendStartX + 105, legendY);
}

/**
 * 初始化7天天气预报ECharts图表
 */
function initSevenDayWeatherEChart() {
    const container = document.getElementById('seven-day-weather-chart');
    if (!container) {
        console.warn('⚠️ 7天天气预报图容器未找到');
        return;
    }
    
    // 确保ECharts已加载
    if (typeof echarts === 'undefined') {
        console.error('❌ ECharts library not loaded');
        return;
    }
    
    const sevenDayChart = echarts.init(container);
    
    // 7天天气预报数据
    const forecastData = {
        dates: ['今天', '明天', '周三', '周四', '周五', '周六', '周日'],
        maxTemps: [18, 15, 22, 20, 16, 19, 24],
        minTemps: [8, 6, 10, 12, 8, 9, 14],
        weather: ['☁️', '🌧️', '☀️', '⛅', '🌧️', '🌤️', '☀️'],
        description: ['多云', '小雨', '晴', '多云', '中雨', '多云', '晴']
    };
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            },
            formatter: function(params) {
                const dataIndex = params[0].dataIndex;
                let result = `<div style="color: #00d4ff; font-weight: bold; margin-bottom: 8px;">
                    ${forecastData.weather[dataIndex]} ${forecastData.dates[dataIndex]} - ${forecastData.description[dataIndex]}
                </div>`;
                
                params.forEach(param => {
                    const value = typeof param.value === 'number' ? param.value : param.value;
                    result += `<div style="color: ${param.color}; margin: 4px 0;">
                        ${param.seriesName}: ${value}°C
                    </div>`;
                });
                return result;
            }
        },
        legend: {
            data: ['最高温度', '最低温度'],
            textStyle: {
                color: '#ffffff',
                fontSize: 11
            },
            top: 10,
            itemWidth: 15,
            itemHeight: 8
        },
        grid: {
            left: '8%',
            right: '8%',
            top: '25%',
            bottom: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: forecastData.dates,
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10
            },
            splitLine: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            name: '温度(°C)',
            nameTextStyle: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 10
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 9
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)'
                }
            }
        },
        series: [
            {
                name: '最高温度',
                type: 'line',
                data: forecastData.maxTemps,
                smooth: true,
                lineStyle: {
                    color: '#FF6B6B',
                    width: 2
                },
                itemStyle: {
                    color: '#FF6B6B',
                    borderColor: '#ffffff',
                    borderWidth: 1
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                            { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
                        ]
                    }
                },
                emphasis: {
                    focus: 'series'
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: function(params) {
                        return `${forecastData.weather[params.dataIndex]}\n${params.value}°`;
                    },
                    textStyle: {
                        color: '#FF6B6B',
                        fontSize: 10,
                        lineHeight: 12
                    },
                    offset: [0, -10]
                }
            },
            {
                name: '最低温度',
                type: 'line',
                data: forecastData.minTemps,
                smooth: true,
                lineStyle: {
                    color: '#4ECDC4',
                    width: 2
                },
                itemStyle: {
                    color: '#4ECDC4',
                    borderColor: '#ffffff',
                    borderWidth: 1
                },
                emphasis: {
                    focus: 'series'
                },
                label: {
                    show: true,
                    position: 'bottom',
                    formatter: '{c}°',
                    textStyle: {
                        color: '#4ECDC4',
                        fontSize: 10
                    },
                    offset: [0, 5]
                }
            }
        ]
    };
    
    sevenDayChart.setOption(option);
    
    // 窗口大小变化时重新调整图表
    window.addEventListener('resize', function() {
        if (sevenDayChart) {
            sevenDayChart.resize();
        }
    });
    
    console.log('✅ 7天天气预报ECharts图表初始化完成');
}

/**
 * 绘制7天天气双线折线图
 */
function drawSevenDayWeatherChart(ctx, canvas, data) {
    const width = canvas.width;
    const height = canvas.height;
    const padding = 50;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    // 清除画布
    ctx.clearRect(0, 0, width, height);
    
    // 设置画布样式
    ctx.font = '10px Microsoft YaHei';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // 计算温度范围
    const allTemps = [...data.morningTemps, ...data.nightTemps];
    const maxTemp = Math.max(...allTemps);
    const minTemp = Math.min(...allTemps);
    const tempRange = maxTemp - minTemp;
    const tempPadding = tempRange * 0.2;
    const chartMaxTemp = maxTemp + tempPadding;
    const chartMinTemp = minTemp - tempPadding;
    const chartTempRange = chartMaxTemp - chartMinTemp;
    
    // 计算坐标点
    const points = data.dates.length;
    const stepX = chartWidth / (points - 1);
    
    function getX(index) {
        return padding + index * stepX;
    }
    
    function getY(temp) {
        return padding + chartHeight - ((temp - chartMinTemp) / chartTempRange) * chartHeight;
    }
    
    // 绘制网格线
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // 水平网格线
    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(padding + chartWidth, y);
        ctx.stroke();
    }
    
    // 垂直网格线
    for (let i = 0; i < points; i++) {
        const x = getX(i);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, padding + chartHeight);
        ctx.stroke();
    }
    
    // 绘制早上温度线（上方）
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
        const x = getX(i);
        const y = getY(data.morningTemps[i]);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // 绘制晚上温度线（下方）
    ctx.strokeStyle = '#4ECDC4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < points; i++) {
        const x = getX(i);
        const y = getY(data.nightTemps[i]);
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    ctx.stroke();
    
    // 绘制数据点、温度值和天气信息
    for (let i = 0; i < points; i++) {
        const x = getX(i);
        
        // 早上温度点
        const morningY = getY(data.morningTemps[i]);
        ctx.fillStyle = '#FF6B6B';
        ctx.beginPath();
        ctx.arc(x, morningY, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 早上温度值
        ctx.fillStyle = '#FF6B6B';
        ctx.fillText(`${data.morningTemps[i]}°`, x, morningY - 15);
        
        // 早上天气图标和描述
        ctx.font = '14px Arial';
        ctx.fillText(data.morningWeather[i], x, morningY - 35);
        ctx.font = '8px Microsoft YaHei';
        ctx.fillStyle = '#A0AEC0';
        ctx.fillText(data.morningDesc[i], x, morningY - 50);
        
        // 晚上温度点
        const nightY = getY(data.nightTemps[i]);
        ctx.fillStyle = '#4ECDC4';
        ctx.beginPath();
        ctx.arc(x, nightY, 3, 0, 2 * Math.PI);
        ctx.fill();
        
        // 晚上温度值
        ctx.fillStyle = '#4ECDC4';
        ctx.font = '10px Microsoft YaHei';
        ctx.fillText(`${data.nightTemps[i]}°`, x, nightY + 15);
        
        // 日期标签
        ctx.fillStyle = '#A0AEC0';
        ctx.font = '9px Microsoft YaHei';
        ctx.fillText(data.dates[i], x, height - 15);
    }
    
    // 绘制图例
    const legendY = 20;
    const legendStartX = padding;
    
    // 早上温度图例
    ctx.strokeStyle = '#FF6B6B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(legendStartX, legendY);
    ctx.lineTo(legendStartX + 20, legendY);
    ctx.stroke();
    
    ctx.fillStyle = '#FF6B6B';
    ctx.font = '10px Microsoft YaHei';
    ctx.textAlign = 'left';
    ctx.fillText('早上天气/温度', legendStartX + 25, legendY);
    
    // 晚上温度图例
    ctx.strokeStyle = '#4ECDC4';
    ctx.beginPath();
    ctx.moveTo(legendStartX + 110, legendY);
    ctx.lineTo(legendStartX + 130, legendY);
    ctx.stroke();
    
    ctx.fillStyle = '#4ECDC4';
    ctx.fillText('晚上温度', legendStartX + 135, legendY);
}

// ===== 数据更新模块 =====

/**
 * 启动气象数据更新
 */
function startWeatherDataUpdate() {
    console.log('🔄 启动气象数据更新...');
    
    // 立即更新一次
    updateWeatherData();
    
    // 每5分钟更新一次数据
    setInterval(updateWeatherData, 5 * 60 * 1000);
    
    console.log('✅ 气象数据更新已启动');
}

/**
 * 更新气象数据
 */
function updateWeatherData() {
    console.log('📡 更新气象数据...');
    
    // 这里可以调用实际的气象数据API
    // 暂时使用模拟数据更新
    
    // 添加数据更新动画效果
    const rightPanel = document.querySelector('.right-panel');
    if (rightPanel) {
        rightPanel.classList.add('weather-updating');
        
        setTimeout(() => {
            rightPanel.classList.remove('weather-updating');
        }, 2000);
    }
    
    // 模拟数据变化
    weatherData.current.temperature = parseFloat((weatherData.current.temperature + (Math.random() - 0.5) * 2).toFixed(2));
    weatherData.current.humidity = parseFloat((weatherData.current.humidity + (Math.random() - 0.5) * 5).toFixed(2));
    weatherData.current.windSpeed = parseFloat((weatherData.current.windSpeed + (Math.random() - 0.5) * 1).toFixed(2));
    weatherData.current.precipitation = parseFloat((weatherData.current.precipitation + (Math.random() - 0.3) * 0.5).toFixed(1));
    weatherData.current.soilTemperature = parseFloat((weatherData.current.soilTemperature + (Math.random() - 0.5) * 1.5).toFixed(2));
    weatherData.current.accumulatedTemperature = parseFloat((weatherData.current.accumulatedTemperature + (Math.random() - 0.5) * 5).toFixed(1));
    weatherData.current.accumulatedPrecipitation = parseFloat((weatherData.current.accumulatedPrecipitation + (Math.random() - 0.5) * 2).toFixed(1));
    
    // 确保数据在合理范围内
    weatherData.current.humidity = Math.max(0, Math.min(100, weatherData.current.humidity));
    weatherData.current.windSpeed = Math.max(0, weatherData.current.windSpeed);
    weatherData.current.precipitation = Math.max(0, weatherData.current.precipitation);
    weatherData.current.accumulatedTemperature = Math.max(0, weatherData.current.accumulatedTemperature);
    weatherData.current.accumulatedPrecipitation = Math.max(0, weatherData.current.accumulatedPrecipitation);
    
    // 更新显示
    updateCurrentWeather();
    
    // 更新图表
    if (temperatureTrendChart) {
        // 重新生成小时数据
        weatherData.hourlyForecast = generateHourlyData();
        
        const hourlyData = weatherData.hourlyForecast;
        const temperatures = hourlyData.map(item => item.temperature);
        const humidity = hourlyData.map(item => item.humidity);
        
        temperatureTrendChart.setOption({
            series: [
                { data: temperatures },
                { data: humidity }
            ]
        });
    }
    
    console.log('✅ 气象数据更新完成');
}

// ===== 气象图层选择器 =====

/**
 * 切换气象图层选择器
 */
function toggleWeatherLayerSelector(show, buttonElement) {
    let selector = document.getElementById('weather-layer-selector');
    
    if (show) {
        // 如果选择器不存在，创建它
        if (!selector) {
            selector = createWeatherLayerSelector();
            document.body.appendChild(selector);
        }
        
        // 定位选择器到按钮下方
        const buttonRect = buttonElement.getBoundingClientRect();
        selector.style.left = `${buttonRect.left}px`;
        selector.style.top = `${buttonRect.bottom + 5}px`;
        selector.style.display = 'block';
        
        console.log('🌤️ 显示气象图层选择器');
    } else {
        // 隐藏选择器
        if (selector) {
            selector.style.display = 'none';
        }
        console.log('🌤️ 隐藏气象图层选择器');
    }
}

/**
 * 创建气象图层选择器
 */
function createWeatherLayerSelector() {
    const selector = document.createElement('div');
    selector.id = 'weather-layer-selector';
    selector.className = 'weather-layer-selector';
    
    selector.innerHTML = `
        <div class="weather-selector-content">
            <div class="weather-option" data-layer="temperature">
                <input type="checkbox" id="selector-temp" checked>
                <label for="selector-temp">
                    <span class="weather-layer-icon">🌡️</span>
                    <span class="weather-layer-name">气温</span>
                </label>
            </div>
            <div class="weather-option" data-layer="precipitation">
                <input type="checkbox" id="selector-rain" checked>
                <label for="selector-rain">
                    <span class="weather-layer-icon">🌧️</span>
                    <span class="weather-layer-name">降雨</span>
                </label>
            </div>
            <div class="weather-option" data-layer="wind">
                <input type="checkbox" id="selector-wind">
                <label for="selector-wind">
                    <span class="weather-layer-icon">🌬️</span>
                    <span class="weather-layer-name">风场</span>
                </label>
            </div>
            <div class="weather-option" data-layer="humidity">
                <input type="checkbox" id="selector-humidity">
                <label for="selector-humidity">
                    <span class="weather-layer-icon">💧</span>
                    <span class="weather-layer-name">湿度</span>
                </label>
            </div>
            <div class="weather-option" data-layer="soil-temperature">
                <input type="checkbox" id="selector-soil-temp">
                <label for="selector-soil-temp">
                    <span class="weather-layer-icon">🌡️</span>
                    <span class="weather-layer-name">地温</span>
                </label>
            </div>
        </div>
    `;
    
    // 绑定图层切换事件
    selector.addEventListener('change', function(e) {
        if (e.target.type === 'checkbox') {
            const layerType = e.target.closest('.weather-option').dataset.layer;
            const isChecked = e.target.checked;
            toggleWeatherLayer(layerType, isChecked);
            
            // 同步左侧面板中的对应复选框
            syncLayerCheckbox(layerType, isChecked);
        }
    });
    
    // 点击外部关闭选择器
    document.addEventListener('click', function(e) {
        if (!selector.contains(e.target) && !e.target.closest('[data-function="crop-selection"]')) {
                const weatherButton = document.querySelector('[data-function="crop-selection"]');
            if (weatherButton && weatherButton.classList.contains('active')) {
                weatherButton.classList.remove('active');
                toggleWeatherLayerSelector(false);
            }
        }
    });
    
    return selector;
}

/**
 * 同步图层复选框状态
 */
function syncLayerCheckbox(layerType, isChecked) {
    const mapping = {
        'temperature': 'temp-layer',
        'precipitation': 'rain-layer',
        'wind': 'wind-layer',
        'humidity': 'humidity-layer',
        'soil-temperature': 'soil-temp-layer'
    };
    
    const checkboxId = mapping[layerType];
    if (checkboxId) {
        const checkbox = document.getElementById(checkboxId);
        if (checkbox) {
            checkbox.checked = isChecked;
        }
    }
}

// ===== 系统初始化 =====

/**
 * 页面加载完成后的初始化函数
 */
function initializeWeatherSystem() {
    console.log('🚀 开始初始化气象监测系统...');
    
    // 等待主系统初始化完成后再初始化气象功能
    setTimeout(() => {
        initWeatherMonitoring();
        
        // 绑定气象图层选择器按钮
        const weatherLayersBtn = document.querySelector('[data-function="crop-selection"]');
        if (weatherLayersBtn) {
            weatherLayersBtn.addEventListener('click', function() {
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                toggleWeatherLayerSelector(isActive, this);
            });
        }
        
        console.log('✅ 气象监测系统初始化完成！');
    }, 1000);
}

// ===== 事件监听器 =====

// DOM加载完成后初始化气象系统
document.addEventListener('DOMContentLoaded', initializeWeatherSystem);

// 页面卸载时清理资源
window.addEventListener('beforeunload', function() {
    console.log('🧹 清理气象监测系统资源...');
    
    // 停止动画
    pauseWeatherAnimation();
    
    // 销毁图表实例
    if (temperatureTrendChart) {
        temperatureTrendChart.dispose();
        temperatureTrendChart = null;
    }
});

// ===== 导出函数（如果需要模块化） =====
// 如果使用ES6模块，可以取消注释以下代码
/*
export {
    initWeatherMonitoring,
    toggleWeatherLayer,
    setWeatherLayerOpacity,
    updateWeatherData,
    startWeatherAnimation,
    pauseWeatherAnimation,
    resetWeatherAnimation
};
*/

/**
 * 初始化气象数据弹窗功能
 */
function initWeatherTooltip() {
    weatherTooltip = document.getElementById('weather-tooltip');
    if (!weatherTooltip) {
        console.warn('⚠️ 找不到气象弹窗元素');
        return;
    }
    
    // 等待Cesium加载完成后绑定鼠标事件
    setTimeout(() => {
        if (window.cesiumViewer) {
            setupTooltipMouseHandler();
        }
    }, 3000);
}

/**
 * 设置弹窗鼠标事件处理
 */
function setupTooltipMouseHandler() {
    if (!window.cesiumViewer) return;
    
    const scene = window.cesiumViewer.scene;
    const canvas = scene.canvas;
    
    // 移除已存在的处理器
    if (mouseHandler) {
        mouseHandler();
        mouseHandler = null;
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
            
            // 检查是否在临夏地区范围内且有选中的图层 (102.5°-104.5°E, 34.5°-36.5°N)
            if (longitude >= 102.5 && longitude <= 104.5 && latitude >= 34.5 && latitude <= 36.5 && currentActiveLayer) {
                // 显示弹窗
                showWeatherTooltip(event.clientX, event.clientY, longitude, latitude);
            } else {
                hideWeatherTooltip();
            }
        } else {
            hideWeatherTooltip();
        }
    };
    
    // 鼠标离开地图区域
    const mouseLeaveHandler = () => {
        hideWeatherTooltip();
    };
    
    // 绑定事件
    canvas.addEventListener('mousemove', mouseMoveHandler);
    canvas.addEventListener('mouseleave', mouseLeaveHandler);
    
    // 返回清理函数
    mouseHandler = () => {
        canvas.removeEventListener('mousemove', mouseMoveHandler);
        canvas.removeEventListener('mouseleave', mouseLeaveHandler);
    };
}

/**
 * 显示气象数据弹窗
 */
function showWeatherTooltip(x, y, longitude, latitude) {
    if (!weatherTooltip) return;
    
    // 生成模拟气象数据
    const weatherInfo = generateTooltipWeatherData(longitude, latitude);
    
    // 更新弹窗内容
    updateTooltipContent(weatherInfo, longitude, latitude);
    
    // 设置弹窗位置
    const tooltipX = Math.min(x + 15, window.innerWidth - 200);
    const tooltipY = Math.max(y - 10, 10);
    
    weatherTooltip.style.left = tooltipX + 'px';
    weatherTooltip.style.top = tooltipY + 'px';
    weatherTooltip.style.display = 'block';
    weatherTooltip.classList.add('show');
    weatherTooltip.classList.remove('hide');
}

/**
 * 隐藏气象数据弹窗
 */
function hideWeatherTooltip() {
    if (!weatherTooltip) return;
    
    weatherTooltip.classList.add('hide');
    weatherTooltip.classList.remove('show');
    
    setTimeout(() => {
        if (weatherTooltip.classList.contains('hide')) {
            weatherTooltip.style.display = 'none';
        }
    }, 200);
}

/**
 * 生成弹窗气象数据
 */
function generateTooltipWeatherData(longitude, latitude) {
    const layerNames = {
        'precipitation': '降雨数据',
        'temperature': '气温数据',
        'soil-temperature': '地温数据',
        'accumulated-temperature': '积温',
        'accumulated-precipitation': '积雨',
        'humidity': '空气相对湿度'
    };
    
    const layerUnits = {
        'precipitation': 'mm/h',
        'temperature': '°C',
        'soil-temperature': '°C',
        'accumulated-temperature': '°C·天',
        'accumulated-precipitation': 'mm',
        'humidity': '%'
    };
    
    // 基于位置生成模拟数据
    const seed = (longitude * 1000 + latitude * 1000) % 1000;
    let value;
    
    switch (currentActiveLayer) {
        case 'precipitation':
            value = (Math.sin(seed * 0.01) * 5 + 5 + Math.random() * 3).toFixed(2);
            break;
        case 'temperature':
            value = (Math.sin(seed * 0.005) * 8 + 18 + Math.random() * 4).toFixed(2);
            break;
        case 'soil-temperature':
            value = (Math.sin(seed * 0.003) * 6 + 16 + Math.random() * 3).toFixed(2);
            break;
        case 'accumulated-temperature':
            value = (Math.sin(seed * 0.002) * 200 + 1200 + Math.random() * 100).toFixed(1);
            break;
        case 'accumulated-precipitation':
            value = (Math.sin(seed * 0.008) * 30 + 80 + Math.random() * 20).toFixed(1);
            break;
        case 'humidity':
            value = (Math.sin(seed * 0.006) * 20 + 60 + Math.random() * 15).toFixed(2);
            break;
        default:
            value = '--';
    }
    
    return {
        layerName: layerNames[currentActiveLayer] || '未知图层',
        value: value,
        unit: layerUnits[currentActiveLayer] || '',
        updateTime: new Date().toLocaleTimeString()
    };
}

/**
 * 更新弹窗内容
 */
function updateTooltipContent(weatherInfo, longitude, latitude) {
    // 更新图层类型（表头）
    const layerTypeElement = document.getElementById('tooltip-layer-type');
    if (layerTypeElement) {
        layerTypeElement.textContent = weatherInfo.layerName;
    }
    
    // 更新坐标显示
    const coordsElement = document.getElementById('tooltip-coords');
    if (coordsElement) {
        coordsElement.textContent = `${longitude.toFixed(2)}°, ${latitude.toFixed(2)}°`;
    }
    
    // 更新数值
    const dataValueElement = document.getElementById('tooltip-data-value');
    if (dataValueElement) {
        dataValueElement.textContent = `${weatherInfo.value} ${weatherInfo.unit}`;
    }
    
    // 更新时间
    const timeElement = document.getElementById('tooltip-time');
    if (timeElement) {
        timeElement.textContent = weatherInfo.updateTime;
    }
}

/**
 * 更新弹窗中的图层类型显示
 */
function updateTooltipLayerType(layerType) {
    const layerNames = {
        'precipitation': '降雨数据',
        'temperature': '气温数据',
        'soil-temperature': '地温数据',
        'accumulated-temperature': '积温',
        'accumulated-precipitation': '积雨',
        'humidity': '空气相对湿度'
    };
    
    const layerTypeElement = document.getElementById('tooltip-layer-type');
    if (layerTypeElement) {
        layerTypeElement.textContent = layerNames[layerType] || '未知图层';
    }
}

// ===== 历史数据时间控制函数 =====

/**
 * 初始化历史日期选择器
 */
function initHistoricalDatePicker() {
    const historicalDate = document.getElementById('historical-date');
    if (historicalDate) {
        // 设置最大日期为今天
        const today = new Date();
        historicalDate.max = today.toISOString().split('T')[0];
        
        // 设置默认日期为昨天
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        historicalDate.value = yesterday.toISOString().split('T')[0];
        
        selectedDateTime = yesterday;
    }
}

/**
 * 切换时间模式
 */
function switchTimeMode(mode) {
    currentTimeMode = mode;
    
    // 更新模式标签状态
    document.querySelectorAll('.mode-tab').forEach(tab => {
        if (tab.dataset.mode === mode) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // 显示/隐藏相应的选择器
    const historicalSelector = document.getElementById('historical-selector');
    const forecastSelector = document.getElementById('forecast-selector');
    const timeRangeLabel = document.getElementById('time-range-label');
    const timeSlider = document.getElementById('time-slider');
    
    switch(mode) {
        case 'historical':
            if (historicalSelector) historicalSelector.style.display = 'block';
            if (forecastSelector) forecastSelector.style.display = 'none';
            if (timeRangeLabel) timeRangeLabel.textContent = '历史时间轴：';
            if (timeSlider) {
                timeSlider.min = '-168';
                timeSlider.max = '0';
                timeSlider.value = '0';
            }
            updateTimeLabels('7天前', '现在', '');
            break;
            
        case 'forecast':
            if (historicalSelector) historicalSelector.style.display = 'none';
            if (forecastSelector) forecastSelector.style.display = 'block';
            if (timeRangeLabel) timeRangeLabel.textContent = '预报时间轴：';
            if (timeSlider) {
                timeSlider.min = '0';
                timeSlider.max = '168';
                timeSlider.value = '0';
            }
            updateTimeLabels('', '现在', '7天后');
            break;
    }
    
    updateSelectedDateTime();
    console.log(`🔄 切换到${mode}模式`);
}

/**
 * 更新时间标签
 */
function updateTimeLabels(start, center, end) {
    const startLabel = document.getElementById('time-start-label');
    const centerLabel = document.getElementById('time-center-label');
    const endLabel = document.getElementById('time-end-label');
    
    if (startLabel) startLabel.textContent = start;
    if (centerLabel) centerLabel.textContent = center;
    if (endLabel) endLabel.textContent = end;
}

/**
 * 设置快速历史日期
 */
function setQuickHistoricalDate(days) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - days);
    
    const historicalDate = document.getElementById('historical-date');
    if (historicalDate) {
        historicalDate.value = targetDate.toISOString().split('T')[0];
    }
    
    // 更新快速按钮状态
    document.querySelectorAll('.quick-btn').forEach(btn => {
        if (parseInt(btn.dataset.days) === days) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    updateSelectedDateTime();
}

/**
 * 更新选择的日期时间
 */
function updateSelectedDateTime() {
    const historicalDate = document.getElementById('historical-date');
    const historicalTime = document.getElementById('historical-time');
    
    if (currentTimeMode === 'historical' && historicalDate && historicalTime) {
        const dateStr = historicalDate.value;
        const timeStr = historicalTime.value;
        
        if (dateStr && timeStr) {
            selectedDateTime = new Date(`${dateStr}T${timeStr}`);
            updateCurrentTimeDisplay(selectedDateTime.toLocaleString('zh-CN'));
            
            // 根据历史时间更新气象数据
            if (currentActiveLayer) {
                updateWeatherDataForTime(selectedDateTime);
            }
        }
    } else if (currentTimeMode === 'current') {
        selectedDateTime = new Date();
        updateCurrentTimeDisplay('实时数据');
    }
}

/**
 * 更新当前时间显示
 */
function updateCurrentTimeDisplay(timeText) {
    const currentTimeText = document.getElementById('current-time-text');
    if (currentTimeText) {
        currentTimeText.textContent = timeText;
    }
}

/**
 * 更新时间滑块
 */
function updateTimeSlider(timeOffset) {
    const baseTime = currentTimeMode === 'historical' ? new Date() : selectedDateTime;
    const targetTime = new Date(baseTime.getTime() + timeOffset * 60 * 60 * 1000);
    
    selectedDateTime = targetTime;
    updateCurrentTimeDisplay(targetTime.toLocaleString('zh-CN'));
    
    // 更新气象数据
    if (currentActiveLayer) {
        updateWeatherDataForTime(targetTime);
    }
}

/**
 * 根据时间更新气象数据
 */
function updateWeatherDataForTime(dateTime) {
    // 基于时间生成不同的气象数据
    const timeOffset = (dateTime.getTime() - new Date().getTime()) / (1000 * 60 * 60);
    const timeVariation = Math.sin(timeOffset * 0.1) * 0.3;
    
    // 更新当前显示的数据
    if (currentActiveLayer) {
        console.log(`🕐 更新${currentActiveLayer}图层数据到时间: ${dateTime.toLocaleString('zh-CN')}`);
        
        // 根据时间偏移重新生成图层数据
        regenerateWeatherLayerForTime(currentActiveLayer, timeVariation);
    }
}

/**
 * 根据时间重新生成气象图层
 */
function regenerateWeatherLayerForTime(layerType, timeVariation) {
    // 隐藏当前图层
    toggleWeatherLayer(layerType, false);
    
    // 延迟后重新创建图层（模拟加载历史数据）
    setTimeout(() => {
        toggleWeatherLayer(layerType, true);
        
        // 应用时间变化效果
        if (weatherLayerStates[layerType]) {
            const newOpacity = Math.max(0.3, Math.min(1.0, weatherLayerStates[layerType].opacity + timeVariation));
            setTimeout(() => {
                setWeatherLayerOpacity(layerType, newOpacity);
            }, 200);
        }
    }, 300);
}

/**
 * 初始化动画控制
 */
function initAnimationControls() {
    const playBtn = document.getElementById('play-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const resetBtn = document.getElementById('reset-btn');
    const speedBtn = document.getElementById('speed-btn');
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            startTimeAnimation();
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            pauseTimeAnimation();
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            resetTimeAnimation();
        });
    }
    
    if (speedBtn) {
        speedBtn.addEventListener('click', function() {
            cycleAnimationSpeed();
        });
    }
}

/**
 * 开始时间动画
 */
function startTimeAnimation() {
    if (isAnimationPlaying) return;
    
    isAnimationPlaying = true;
    const timeSlider = document.getElementById('time-slider');
    
    if (timeSlider) {
        animationInterval = setInterval(() => {
            let currentValue = parseInt(timeSlider.value);
            const maxValue = parseInt(timeSlider.max);
            const minValue = parseInt(timeSlider.min);
            
            currentValue += animationSpeed;
            
            if (currentValue > maxValue) {
                if (currentTimeMode === 'historical') {
                    currentValue = minValue;
                } else {
                    currentValue = maxValue;
                    pauseTimeAnimation();
                }
            }
            
            timeSlider.value = currentValue;
            updateTimeSlider(currentValue);
        }, 1000 / animationSpeed);
    }
    
    console.log(`▶️ 开始时间动画播放 (速度: ${animationSpeed}x)`);
}

/**
 * 暂停时间动画
 */
function pauseTimeAnimation() {
    isAnimationPlaying = false;
    if (animationInterval) {
        clearInterval(animationInterval);
        animationInterval = null;
    }
    console.log('⏸️ 暂停时间动画');
}

/**
 * 重置时间动画
 */
function resetTimeAnimation() {
    pauseTimeAnimation();
    
    const timeSlider = document.getElementById('time-slider');
    if (timeSlider) {
        timeSlider.value = currentTimeMode === 'historical' ? timeSlider.max : timeSlider.min;
        updateTimeSlider(parseInt(timeSlider.value));
    }
    
    console.log('🔄 重置时间动画');
}

/**
 * 循环动画速度
 */
function cycleAnimationSpeed() {
    const speeds = [1, 2, 4, 8];
    const currentIndex = speeds.indexOf(animationSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    animationSpeed = speeds[nextIndex];
    
    const speedBtn = document.getElementById('speed-btn');
    if (speedBtn) {
        speedBtn.textContent = `⏩ 速度: ${animationSpeed}x`;
    }
    
    // 如果正在播放，重新启动以应用新速度
    if (isAnimationPlaying) {
        pauseTimeAnimation();
        startTimeAnimation();
    }
    
    console.log(`⚡ 动画速度设置为: ${animationSpeed}x`);
}