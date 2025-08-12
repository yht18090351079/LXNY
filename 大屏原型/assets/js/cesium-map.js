/**
 * Cesium地图模块
 * 功能：初始化Cesium地图、图层切换、2D视图控制
 */

// ===== 全局变量 =====
let cesiumViewer = null;
let currentMapLayer = 'satellite'; // 'standard' 或 'satellite' - 默认使用卫星影像
let isMapInitialized = false;

// ===== 获取配置 =====
function getMapConfig() {
    // 使用全局配置，如果不存在则使用默认配置
    if (typeof window.CESIUM_CONFIG !== 'undefined') {
        return window.CESIUM_CONFIG;
    }
    
    // 默认配置（备用）
    return {
        BASE: {
            ION_ACCESS_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYWM3M2ZjOS03YzA5LTQ2YjAtOTUyMi1jNTcyMjg5ZmQ5MzAiLCJpZCI6MzIyMjE2LCJpYXQiOjE3NTI3MTc4MTl9.mfDHg0gzH9Qwo6f0piOh5620tk2rZmO2tOsFc7vJOu8'
        },
        GEO: {
            CENTER: {
                longitude: 103.1,
                latitude: 35.6,
                height: 50000
            }
        }
    };
}

// ===== 地图初始化 =====

/**
 * 检查Cesium是否已加载
 */
function checkCesiumLoaded() {
    return typeof Cesium !== 'undefined' && 
           typeof Cesium.Viewer !== 'undefined' && 
           typeof Cesium.Ion !== 'undefined';
}

/**
 * 初始化Cesium地图
 */
function initCesiumMap() {
    console.log('🗺️ 开始初始化Cesium地图...');
    
    // 检查Cesium是否已加载
    if (!checkCesiumLoaded()) {
        console.error('❌ Cesium库未正确加载');
        showMapError('Cesium库加载失败，请检查网络连接');
        return;
    }
    
    try {
        // 获取配置
        const config = getMapConfig();
        console.log('📋 使用配置:', config);
        
        // 显示加载指示器
        showMapLoading('正在初始化地图...');
        
        // 设置Cesium Ion访问令牌
        Cesium.Ion.defaultAccessToken = config.BASE.ION_ACCESS_TOKEN;
        
        // 检查容器是否存在
        const container = document.getElementById('cesium-container');
        if (!container) {
            throw new Error('Cesium容器未找到');
        }
        
        console.log('🏗️ 开始创建Cesium Viewer...');
        
        // 准备地形提供器
        const terrainProvider = createTerrainProvider();
        
        // 创建Viewer配置
        const viewerConfig = {
            // 禁用默认UI组件
            animation: false,           // 动画控件
            baseLayerPicker: false,     // 图层选择器
            fullscreenButton: false,    // 全屏按钮
            geocoder: false,           // 地理编码器
            homeButton: false,         // 主页按钮
            infoBox: false,           // 信息框
            sceneModePicker: false,    // 场景模式选择器
            selectionIndicator: false, // 选择指示器
            timeline: false,          // 时间轴
            navigationHelpButton: false, // 导航帮助按钮
            navigationInstructionsInitiallyVisible: false,
            
            // 场景配置
            scene3DOnly: false,        // 允许2D/3D切换
            requestRenderMode: true,   // 按需渲染
            maximumRenderTimeChange: Infinity,
            
            // 完全禁用默认影像提供器
            imageryProvider: false,
            // 使用最简单的地形提供器
            terrainProvider: new Cesium.EllipsoidTerrainProvider()
        };
        
        // 创建Cesium Viewer
        cesiumViewer = new Cesium.Viewer('cesium-container', viewerConfig);
        
        console.log('✅ Cesium Viewer创建成功');
        
        // 由于禁用了默认影像提供器，现在必须手动添加
        console.log('🔄 添加卫星影像提供器...');
        try {
            const satelliteProvider = createSatelliteImageryProvider();
            cesiumViewer.imageryLayers.addImageryProvider(satelliteProvider);
            console.log('✅ 卫星影像添加成功');
            
            // 卫星影像提供高清的地表图像
        } catch (error) {
            console.error('❌ 卫星影像添加失败，尝试标准地图:', error);
            try {
                // 如果卫星影像失败，降级到标准地图
                const standardProvider = createStandardImageryProvider();
                cesiumViewer.imageryLayers.addImageryProvider(standardProvider);
                currentMapLayer = 'standard';
                console.log('✅ 标准地图添加成功（降级方案）');
            } catch (fallbackError) {
                console.error('❌ 所有地图提供器都失败:', fallbackError);
                throw fallbackError;
            }
        }
        
        // 简单验证图层状态
        const imageryLayers = cesiumViewer.imageryLayers;
        console.log('🔍 影像图层数量:', imageryLayers.length);
        
        // 验证图层添加成功
        if (imageryLayers.length === 0) {
            console.error('❌ 影像图层添加失败');
            throw new Error('无法添加影像图层');
        } else {
            console.log('✅ 影像图层验证成功');
        }
        
        // 强制切换到2D视图
        cesiumViewer.scene.morphTo2D(0);
        
        // 设置初始相机位置
        console.log('📍 设置相机位置到临夏县...');
        setCameraView({
            longitude: config.GEO.CENTER.longitude,
            latitude: config.GEO.CENTER.latitude,
            height: config.GEO.CENTER.height,
            heading: 0,
            pitch: -90,
            roll: 0
        });
        
        // 配置场景
        console.log('🎨 配置场景设置...');
        configureScene();
        
        // 简单验证完成
        console.log('✅ 地图初始化验证完成，图层数量:', imageryLayers.length);
        
        // 绑定事件监听器
        console.log('🔗 绑定事件监听器...');
        bindMapEvents();
        
        // 创建地图控制按钮
        console.log('🎮 创建地图控制按钮...');
        createMapControls();
        
        // 延迟隐藏加载指示器，给瓦片一些时间加载
        setTimeout(() => {
            hideMapLoading();
        }, 2000);
        
        isMapInitialized = true;
        console.log('✅ Cesium地图初始化完成');
        
        // 导出到全局变量供诊断使用
        window.cesiumViewer = cesiumViewer;
        
        // 添加渲染错误处理器
        cesiumViewer.scene.renderError.addEventListener(function(scene, error) {
            console.error('🚨 Cesium渲染错误:', error);
            
            // 检查是否是影像提供器相关错误
            if (error && error.message && 
                (error.message.includes('getDerivedResource') || 
                 error.message.includes('requestImage') ||
                 error.message.includes('imagery'))) {
                
                console.log('🔄 检测到影像提供器错误，尝试切换到备用提供器...');
                
                // 尝试切换到最简单的影像提供器
                setTimeout(() => {
                    try {
                        const imageryLayers = cesiumViewer.imageryLayers;
                        imageryLayers.removeAll();
                        
                        // 使用简单的Google Maps作为应急方案
                        const emergencyProvider = new Cesium.UrlTemplateImageryProvider({
                            url: 'https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                            maximumLevel: 15,
                            credit: new Cesium.Credit('Google Maps (应急)', false),
                            tilingScheme: new Cesium.WebMercatorTilingScheme(),
                            rectangle: Cesium.Rectangle.MAX_VALUE
                        });
                        
                        imageryLayers.addImageryProvider(emergencyProvider);
                        console.log('✅ 已切换到应急地图提供器');
                        showLayerIndicator('应急地图模式', 5000);
                        
                    } catch (recoveryError) {
                        console.error('❌ 应急恢复失败:', recoveryError);
                        showMapError('地图渲染出现问题，建议刷新页面');
                    }
                }, 1000);
                
            } else {
                // 其他类型的渲染错误
                setTimeout(() => {
                    try {
                        console.log('🔄 尝试恢复Cesium渲染...');
                        cesiumViewer.scene.requestRender();
                    } catch (recoveryError) {
                        console.error('❌ 渲染恢复失败:', recoveryError);
                        showMapError('地图渲染出现问题，建议刷新页面');
                    }
                }, 1000);
            }
        });
        
        // 显示图层指示器
        showLayerIndicator(currentMapLayer === 'satellite' ? '卫星影像' : '标准地图', 3000);
        
        // 延迟刷新诊断信息
        setTimeout(() => {
            if (typeof refreshDiagnostic === 'function') {
                refreshDiagnostic();
            }
        }, 3000);
        
    } catch (error) {
        console.error('❌ Cesium地图初始化失败:', error);
        hideMapLoading();
        showMapError('地图初始化失败，请刷新页面重试');
    }
}

/**
 * 创建地形提供器 - 简化版本，专用于2D地图
 */
function createTerrainProvider() {
    try {
        // 对于2D地图，直接使用椭球体地形最稳定
        console.log('🌍 使用椭球体地形（2D模式最佳选择）');
        return new Cesium.EllipsoidTerrainProvider();
    } catch (error) {
        console.error('❌ 地形提供器创建失败:', error);
        // 如果连椭球体地形都失败，返回null让Cesium使用默认值
        return null;
    }
}

/**
 * 创建标准地图影像提供器
 */
function createStandardImageryProvider() {
    console.log('🗺️ 创建Google标准地图影像提供器...');
    
    const providers = [
        // 方案1: Google Maps 标准地图
        () => {
            console.log('🔄 尝试Google Maps标准地图');
            return new Cesium.UrlTemplateImageryProvider({
                url: 'https://mt{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
                subdomains: ['0', '1', '2', '3'],
                maximumLevel: 18,
                credit: new Cesium.Credit('Google Maps', false),
                tilingScheme: new Cesium.WebMercatorTilingScheme(),
                rectangle: Cesium.Rectangle.MAX_VALUE
            });
        },
        
        // 方案2: Google Maps 地形地图（备用）
        () => {
            console.log('🔄 尝试Google Maps地形地图');
            return new Cesium.UrlTemplateImageryProvider({
                url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
                subdomains: ['0', '1', '2', '3'],
                maximumLevel: 18,
                credit: new Cesium.Credit('Google Maps', false),
                tilingScheme: new Cesium.WebMercatorTilingScheme(),
                rectangle: Cesium.Rectangle.MAX_VALUE
            });
        },
        
        // 方案3: 应急方案
        () => {
            console.log('🔄 使用应急标准地图');
            return new Cesium.SingleTileImageryProvider({
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMmE0ZDNhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdvb2dsZSDmoIflh4blnLDlm748L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuW6lOaApeaooeW8jzwvdGV4dD4KPC9zdmc+',
                rectangle: Cesium.Rectangle.MAX_VALUE,
                credit: new Cesium.Credit('Google Maps (应急)', false)
            });
        }
    ];
    
    // 逐个尝试提供器
    for (let i = 0; i < providers.length; i++) {
        try {
            const provider = providers[i]();
            console.log(`✅ 方案${i + 1}创建成功`);
            return provider;
        } catch (error) {
            console.error(`❌ 方案${i + 1}失败:`, error.message);
            if (i === providers.length - 1) {
                console.error('❌ 所有Google Maps方案都失败了');
                throw new Error('无法创建Google Maps标准地图提供器');
            }
        }
    }
}

/**
 * 创建卫星影像提供器
 */
function createSatelliteImageryProvider() {
    console.log('🛰️ 创建Google卫星地图影像提供器...');
    
    const providers = [
        // 方案1: Google Maps 卫星影像
        () => {
            console.log('🔄 尝试Google Maps卫星影像');
            return new Cesium.UrlTemplateImageryProvider({
                url: 'https://mt{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
                subdomains: ['0', '1', '2', '3'],
                maximumLevel: 18,
                credit: new Cesium.Credit('Google Maps', false),
                tilingScheme: new Cesium.WebMercatorTilingScheme(),
                rectangle: Cesium.Rectangle.MAX_VALUE
            });
        },
        
        // 方案2: Google Maps 混合模式（卫星+标签）
        () => {
            console.log('🔄 尝试Google Maps混合模式');
            return new Cesium.UrlTemplateImageryProvider({
                url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
                subdomains: ['0', '1', '2', '3'],
                maximumLevel: 18,
                credit: new Cesium.Credit('Google Maps', false),
                tilingScheme: new Cesium.WebMercatorTilingScheme(),
                rectangle: Cesium.Rectangle.MAX_VALUE
            });
        },
        
        // 方案3: 应急方案
        () => {
            console.log('🔄 使用应急卫星地图');
            return new Cesium.SingleTileImageryProvider({
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMWE0NzNhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkdvb2dsZSDljq/mmJ/lnLDlm748L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iI2NjYyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuW6lOaApeaooeW8jzwvdGV4dD4KPC9zdmc+',
                rectangle: Cesium.Rectangle.MAX_VALUE,
                credit: new Cesium.Credit('Google Maps (应急)', false)
            });
        }
    ];
    
    // 逐个尝试提供器
    for (let i = 0; i < providers.length; i++) {
        try {
            const provider = providers[i]();
            console.log(`✅ 方案${i + 1}创建成功`);
            return provider;
        } catch (error) {
            console.error(`❌ 方案${i + 1}失败:`, error.message);
            if (i === providers.length - 1) {
                console.error('❌ 所有Google Maps卫星方案都失败了');
                throw new Error('无法创建Google Maps卫星地图提供器');
            }
        }
    }
}

/**
 * 创建行政区划标签提供器
 */
function createAdministrativeLabelProvider() {
    console.log('🏛️ 创建行政区划标签提供器...');
    
    const providers = [
        // 方案1: Google Maps 仅标签图层（透明背景）
        () => {
            console.log('🔄 尝试Google Maps标签图层');
            return new Cesium.UrlTemplateImageryProvider({
                url: 'https://mt{s}.google.com/vt/lyrs=h&x={x}&y={y}&z={z}',
                subdomains: ['0', '1', '2', '3'],
                maximumLevel: 18,
                credit: new Cesium.Credit('Google Maps', false),
                tilingScheme: new Cesium.WebMercatorTilingScheme(),
                rectangle: Cesium.Rectangle.MAX_VALUE
            });
        },
        
        // 方案2: OpenStreetMap 标签图层
        () => {
            console.log('🔄 尝试OpenStreetMap标签图层');
            return new Cesium.UrlTemplateImageryProvider({
                url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                subdomains: ['a', 'b', 'c'],
                maximumLevel: 18,
                credit: new Cesium.Credit('OpenStreetMap', false),
                tilingScheme: new Cesium.WebMercatorTilingScheme(),
                rectangle: Cesium.Rectangle.MAX_VALUE,
                // 设置透明度以便与卫星图层混合
                alpha: 0.7
            });
        },
        
        // 方案3: 应急标签方案
        () => {
            console.log('🔄 使用应急标签图层');
            return new Cesium.SingleTileImageryProvider({
                url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ0cmFuc3BhcmVudCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iMzAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiNmZmYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7kuLTlpI/ljoLnlJ/ljLo8L3RleHQ+CiAgPHRleHQgeD0iNTAlIiB5PSI3MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjY2NjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TGlueGlhIENvdW50eTwvdGV4dD4KPC9zdmc+',
                rectangle: Cesium.Rectangle.MAX_VALUE,
                credit: new Cesium.Credit('行政区划 (应急)', false),
                alpha: 0.8
            });
        }
    ];
    
    // 逐个尝试提供器
    for (let i = 0; i < providers.length; i++) {
        try {
            const provider = providers[i]();
            console.log(`✅ 标签方案${i + 1}创建成功`);
            return provider;
        } catch (error) {
            console.error(`❌ 标签方案${i + 1}失败:`, error.message);
            if (i === providers.length - 1) {
                console.error('❌ 所有行政区划标签方案都失败了');
                throw new Error('无法创建行政区划标签提供器');
            }
        }
    }
}

/**
 * 配置场景设置
 */
function configureScene() {
    const scene = cesiumViewer.scene;
    
    try {
        // 禁用深度测试以提高2D性能
        scene.globe.depthTestAgainstTerrain = false;
        
        // 设置背景颜色为深灰色（而不是纯黑色）
        scene.backgroundColor = Cesium.Color.fromCssColorString('#1a1a2e');
        
        // 禁用雾效
        scene.fog.enabled = false;
        
        // 禁用天空盒
        scene.skyBox.show = false;
        
        // 禁用太阳和月亮
        scene.sun.show = false;
        scene.moon.show = false;
        
        // 禁用星空
        scene.skyAtmosphere.show = false;
        
        // 配置地球
        const globe = scene.globe;
        globe.enableLighting = false;
        globe.showWaterEffect = false;
        globe.showGroundAtmosphere = false;
        
        // 确保地球可见
        globe.show = true;
        
        // 添加图层加载监听器
        const imageryLayers = cesiumViewer.imageryLayers;
        console.log('🗺️ 影像图层数量:', imageryLayers.length);
        
        // 监听瓦片加载事件
        scene.globe.tileLoadProgressEvent.addEventListener(function(queuedTileCount) {
            if (queuedTileCount === 0) {
                console.log('✅ 地图瓦片加载完成');
            } else {
                console.log('⏳ 正在加载地图瓦片:', queuedTileCount, '个');
            }
        });
        
        console.log('🎨 场景配置完成');
        
    } catch (error) {
        console.error('❌ 场景配置失败:', error);
    }
}

/**
 * 设置相机视图
 */
function setCameraView(viewConfig) {
    cesiumViewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
            viewConfig.longitude,
            viewConfig.latitude,
            viewConfig.height
        ),
        orientation: {
            heading: Cesium.Math.toRadians(viewConfig.heading),
            pitch: Cesium.Math.toRadians(viewConfig.pitch),
            roll: Cesium.Math.toRadians(viewConfig.roll)
        }
    });
}

/**
 * 绑定地图事件
 */
function bindMapEvents() {
    // 地图渲染完成事件
    cesiumViewer.scene.globe.tileLoadProgressEvent.addEventListener(function(queuedTileCount) {
        if (queuedTileCount === 0) {
            console.log('📍 地图瓦片加载完成');
        }
    });
    
    // 相机移动事件
    cesiumViewer.camera.moveEnd.addEventListener(function() {
        // 可以在这里添加相机移动后的处理逻辑
    });
    
    console.log('🔗 地图事件绑定完成');
}

// ===== 地图控制功能 =====

/**
 * 创建地图控制按钮
 */
function createMapControls() {
    const controlsHtml = `
        <div class="map-controls">
            <div class="map-control-btn" title="放大" onclick="mapZoomIn()">+</div>
            <div class="map-control-btn" title="缩小" onclick="mapZoomOut()">-</div>
            <div class="map-control-btn" title="标准地图" onclick="toggleMapLayer()" id="layer-btn">🗺️</div>
            <div class="map-control-btn" title="重置视图" onclick="resetMapView()">🎯</div>
        </div>
        
        <div class="map-layer-indicator" id="layer-indicator">
            <div class="layer-name" id="layer-name">卫星影像</div>
        </div>
        
        <div class="map-loading" id="map-loading">
            <div class="loading-spinner"></div>
            <div class="loading-text" id="loading-text">加载中...</div>
        </div>
    `;
    
    // 将控制按钮添加到地图容器
    const mapContainer = document.getElementById('map-container');
    mapContainer.insertAdjacentHTML('beforeend', controlsHtml);
    
    console.log('🎮 地图控制按钮创建完成');
}

/**
 * 地图放大
 */
function mapZoomIn() {
    if (!cesiumViewer) return;
    
    const camera = cesiumViewer.camera;
    const currentHeight = camera.positionCartographic.height;
    const newHeight = Math.max(currentHeight * 0.5, 1000); // 最小高度1000米
    
    camera.zoomIn(currentHeight - newHeight);
    console.log('🔍 地图放大，当前高度:', newHeight.toFixed(0), '米');
}

/**
 * 地图缩小
 */
function mapZoomOut() {
    if (!cesiumViewer) return;
    
    const camera = cesiumViewer.camera;
    const currentHeight = camera.positionCartographic.height;
    const newHeight = Math.min(currentHeight * 2, 20000000); // 最大高度2000万米
    
    camera.zoomOut(newHeight - currentHeight);
    console.log('🔍 地图缩小，当前高度:', newHeight.toFixed(0), '米');
}

/**
 * 切换地图图层
 */
function toggleMapLayer(targetType) {
    if (!cesiumViewer) return;
    
    // 如果没有指定目标类型，则使用切换模式
    if (!targetType) {
        targetType = currentMapLayer === 'standard' ? 'satellite' : 'standard';
    }
    
    // 如果已经是目标类型，不需要切换
    if (currentMapLayer === targetType) {
        console.log(`🔄 地图已经是 ${targetType} 模式`);
        return;
    }
    
    showMapLoading('正在切换图层...');
    
    try {
        if (targetType === 'satellite') {
            // 切换到卫星图
            const satelliteProvider = createSatelliteImageryProvider();
            cesiumViewer.imageryLayers.removeAll();
            cesiumViewer.imageryLayers.addImageryProvider(satelliteProvider);
            
            // 添加行政区划标签图层
            const labelProvider = createAdministrativeLabelProvider();
            cesiumViewer.imageryLayers.addImageryProvider(labelProvider);
            
            currentMapLayer = 'satellite';
            showLayerIndicator('卫星影像', 2000);
            console.log('🛰️ 已切换到卫星影像');
            
        } else {
            // 切换到标准地图
            const standardProvider = createStandardImageryProvider();
            cesiumViewer.imageryLayers.removeAll();
            cesiumViewer.imageryLayers.addImageryProvider(standardProvider);
            
            currentMapLayer = 'standard';
            showLayerIndicator('标准地图', 2000);
            console.log('🗺️ 已切换到标准地图');
        }
        
        // 更新旧版控制按钮状态（如果存在）
        const oldBtn = document.getElementById('layer-btn');
        if (oldBtn) {
            if (currentMapLayer === 'satellite') {
                oldBtn.innerHTML = '🗺️';
                oldBtn.title = '标准地图';
                oldBtn.classList.add('active');
            } else {
                oldBtn.innerHTML = '🛰️';
                oldBtn.title = '卫星图';
                oldBtn.classList.remove('active');
            }
        }
        
        // 延迟隐藏加载指示器，等待图层加载
        setTimeout(() => {
            hideMapLoading();
        }, 1000);
        
    } catch (error) {
        console.error('❌ 图层切换失败:', error);
        hideMapLoading();
        showMapError('图层切换失败');
    }
}

/**
 * 重置地图视图
 */
function resetMapView() {
    if (!cesiumViewer) return;
    
    const config = getMapConfig();
    setCameraView({
        longitude: config.GEO.CENTER.longitude,
        latitude: config.GEO.CENTER.latitude,
        height: config.GEO.CENTER.height,
        heading: 0,
        pitch: -90,
        roll: 0
    });
    showLayerIndicator('视图已重置', 1500);
    console.log('🎯 地图视图已重置');
}

// ===== UI辅助函数 =====

/**
 * 显示地图加载指示器
 */
function showMapLoading(text = '加载中...') {
    const loadingEl = document.getElementById('map-loading');
    const textEl = document.getElementById('loading-text');
    
    if (loadingEl && textEl) {
        textEl.textContent = text;
        loadingEl.classList.add('show');
    }
}

/**
 * 隐藏地图加载指示器
 */
function hideMapLoading() {
    const loadingEl = document.getElementById('map-loading');
    if (loadingEl) {
        loadingEl.classList.remove('show');
    }
}

/**
 * 显示图层指示器
 */
function showLayerIndicator(layerName, duration = 2000) {
    const indicatorEl = document.getElementById('layer-indicator');
    const nameEl = document.getElementById('layer-name');
    
    if (indicatorEl && nameEl) {
        nameEl.textContent = layerName;
        indicatorEl.classList.add('show');
        
        setTimeout(() => {
            indicatorEl.classList.remove('show');
        }, duration);
    }
}

/**
 * 显示地图错误信息
 */
function showMapError(message) {
    console.error('🚨 地图错误:', message);
    // 这里可以显示一个错误提示UI
    alert(`地图错误: ${message}`);
}

// ===== 地图销毁 =====

/**
 * 销毁地图实例
 */
function destroyCesiumMap() {
    if (cesiumViewer) {
        cesiumViewer.destroy();
        cesiumViewer = null;
        isMapInitialized = false;
        console.log('🗑️ Cesium地图已销毁');
    }
}

// ===== 导出函数 =====
window.initCesiumMap = initCesiumMap;
window.mapZoomIn = mapZoomIn;
window.mapZoomOut = mapZoomOut;
window.toggleMapLayer = toggleMapLayer;
window.resetMapView = resetMapView;
window.destroyCesiumMap = destroyCesiumMap;

// ===== 模块导出（如果使用ES6模块） =====
/*
export {
    initCesiumMap,
    mapZoomIn,
    mapZoomOut,
    toggleMapLayer,
    resetMapView,
    destroyCesiumMap,
    cesiumViewer
};
*/