/**
 * Cesium地图配置文件
 * 包含地图初始化参数、图层配置、样式设置等
 */

// ===== 基础配置 =====
const CESIUM_BASE_CONFIG = {
    // Cesium Ion访问令牌（建议申请自己的令牌）
    ION_ACCESS_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxYWM3M2ZjOS03YzA5LTQ2YjAtOTUyMi1jNTcyMjg5ZmQ5MzAiLCJpZCI6MzIyMjE2LCJpYXQiOjE3NTI3MTc4MTl9.mfDHg0gzH9Qwo6f0piOh5620tk2rZmO2tOsFc7vJOu8',
    
    // CDN配置
    CESIUM_CDN: {
        JS: 'https://cesium.com/downloads/cesiumjs/releases/1.110/Build/Cesium/Cesium.js',
        CSS: 'https://cesium.com/downloads/cesiumjs/releases/1.110/Build/Cesium/Widgets/widgets.css'
    }
};

// ===== 临夏县地理配置 =====
const LINXIA_GEO_CONFIG = {
    // 临夏县中心坐标
    CENTER: {
        longitude: 103.1,    // 经度
        latitude: 35.6,      // 纬度
        height: 50000        // 高度（米）
    },
    
    // 临夏县边界框（大致范围）
    BOUNDS: {
        west: 102.8,         // 西边界
        south: 35.4,         // 南边界
        east: 103.4,         // 东边界
        north: 35.8          // 北边界
    },
    
    // 不同缩放级别的推荐高度
    ZOOM_LEVELS: {
        OVERVIEW: 100000,    // 概览视图
        COUNTY: 50000,       // 县级视图
        TOWNSHIP: 20000,     // 乡镇视图
        VILLAGE: 10000,      // 村级视图
        FIELD: 5000,         // 地块视图
        DETAIL: 2000         // 详细视图
    }
};

// ===== 地图图层配置 =====
const MAP_LAYERS_CONFIG = {
    // 标准地图图层
    STANDARD: {
        // 高德地图标准图层（主要）
        AMAP_STANDARD: {
            name: '高德标准地图',
            type: 'UrlTemplateImageryProvider',
            url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
            subdomains: ['1', '2', '3', '4'],
            maximumLevel: 18,
            credit: '高德地图'
        },
        
        // 腾讯地图标准图层（备用）
        TENCENT_STANDARD: {
            name: '腾讯标准地图',
            type: 'UrlTemplateImageryProvider',
            url: 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={y}&type=vector&styleid=3',
            subdomains: ['0', '1', '2', '3'],
            maximumLevel: 18,
            credit: '腾讯地图'
        },
        
        // OpenStreetMap（国内镜像，备用）
        OSM_CHINA: {
            name: 'OpenStreetMap(清华镜像)',
            type: 'UrlTemplateImageryProvider',
            url: 'https://mirrors.tuna.tsinghua.edu.cn/osm/{z}/{x}/{y}.png',
            subdomains: [],
            maximumLevel: 18,
            credit: 'OpenStreetMap contributors, 清华大学镜像'
        }
    },
    
    // 卫星影像图层
    SATELLITE: {
        // 高德卫星影像（主要）
        AMAP_SATELLITE: {
            name: '高德卫星影像',
            type: 'UrlTemplateImageryProvider',
            url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
            subdomains: ['1', '2', '3', '4'],
            maximumLevel: 18,
            credit: '高德地图'
        },
        
        // 腾讯卫星影像（备用）
        TENCENT_SATELLITE: {
            name: '腾讯卫星影像',
            type: 'UrlTemplateImageryProvider',
            url: 'https://p{s}.map.gtimg.com/sateTiles/{z}/{x}/{y}.jpg',
            subdomains: ['0', '1', '2', '3'],
            maximumLevel: 18,
            credit: '腾讯地图'
        },
        
        // 天地图影像（需要密钥）
        TIANDITU_SATELLITE: {
            name: '天地图影像',
            type: 'UrlTemplateImageryProvider',
            url: 'https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=你的天地图密钥',
            subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
            maximumLevel: 18,
            credit: '天地图'
        }
    }
};

// ===== 地图样式配置 =====
const MAP_STYLE_CONFIG = {
    // 2D场景配置
    SCENE_2D: {
        backgroundColor: [0, 0, 0, 1],          // 背景颜色（黑色）
        fog: {
            enabled: false                       // 禁用雾效
        },
        globe: {
            enableLighting: false,               // 禁用光照
            showWaterEffect: false,              // 禁用水面效果
            showGroundAtmosphere: false,         // 禁用地面大气效果
            depthTestAgainstTerrain: false       // 禁用地形深度测试
        },
        skyBox: {
            show: false                          // 隐藏天空盒
        },
        sun: {
            show: false                          // 隐藏太阳
        },
        moon: {
            show: false                          // 隐藏月亮
        },
        skyAtmosphere: {
            show: false                          // 隐藏天空大气效果
        }
    },
    
    // 相机配置
    CAMERA: {
        // 默认视图参数
        DEFAULT_VIEW: {
            heading: 0,                          // 方位角
            pitch: -90,                          // 俯仰角（-90度为正俯视）
            roll: 0                              // 翻滚角
        },
        
        // 相机约束
        CONSTRAINTS: {
            minimumZoomDistance: 100,            // 最小缩放距离
            maximumZoomDistance: 20000000        // 最大缩放距离
        }
    }
};

// ===== 农业数据图层配置 =====
const AGRICULTURE_LAYERS_CONFIG = {
    // 作物分布图层
    CROP_DISTRIBUTION: {
        name: '作物分布',
        visible: true,
        opacity: 0.6,
        
        // 作物类型详细配置
        types: {
            wheat: {
                name: '小麦',
                icon: '🌾',
                color: '#4CAF50',
                borderColor: '#2E7D32',
                borderWidth: 1,
                opacity: 0.6,
                minOpacity: 0.3,
                maxOpacity: 0.8
            },
            corn: {
                name: '玉米',
                icon: '🌽',
                color: '#FFC107',
                borderColor: '#F57C00',
                borderWidth: 1,
                opacity: 0.6,
                minOpacity: 0.3,
                maxOpacity: 0.8
            },
            vegetables: {
                name: '蔬菜',
                icon: '🥬',
                color: '#00BCD4',
                borderColor: '#00838F',
                borderWidth: 1,
                opacity: 0.6,
                minOpacity: 0.3,
                maxOpacity: 0.8
            },
            greenhouse: {
                name: '大棚',
                icon: '🏠',
                color: '#2196F3',
                borderColor: '#1565C0',
                borderWidth: 2,  // 大棚使用更粗的边框
                opacity: 0.6,
                minOpacity: 0.3,
                maxOpacity: 0.8
            }
        },
        
        // 图层控制配置
        control: {
            showLabels: true,
            showBorders: true,
            showArea: true,
            showStatistics: true
        },
        
        // 数据源信息
        dataSource: {
            resolution: '0.8m',
            satellite: '高分二号卫星',
            updateFrequency: '每年2次',
            totalArea: '1212.4 km²'
        }
    },
    
    // 长势分析图层
    GROWTH_ANALYSIS: {
        name: '长势分析',
        visible: false,
        opacity: 0.7,
        colors: {
            excellent: '#4CAF50',    // 优秀 - 绿色
            good: '#8BC34A',         // 良好 - 浅绿色
            average: '#FFC107',      // 一般 - 黄色
            poor: '#FF9800',         // 较差 - 橙色
            bad: '#F44336'           // 很差 - 红色
        }
    },
    
    // 产量预估图层
    YIELD_ESTIMATION: {
        name: '产量预估',
        visible: false,
        opacity: 0.7,
        colors: {
            high: '#4CAF50',         // 高产 - 绿色
            medium: '#FFC107',       // 中产 - 黄色
            low: '#FF5722'           // 低产 - 红色
        }
    },
    
    // 气象监测图层
    WEATHER_MONITORING: {
        name: '气象监测',
        visible: false,
        opacity: 0.6,
        types: {
            temperature: '温度',
            humidity: '湿度',
            precipitation: '降水',
            wind: '风速'
        }
    },
    
    // 灾害监测图层
    DISASTER_MONITORING: {
        name: '灾害监测',
        visible: false,
        opacity: 0.8,
        types: {
            drought: '干旱',
            flood: '洪涝',
            pest: '病虫害',
            hail: '冰雹'
        },
        colors: {
            low: '#4CAF50',          // 低风险 - 绿色
            medium: '#FFC107',       // 中风险 - 黄色
            high: '#FF9800',         // 高风险 - 橙色
            critical: '#F44336'      // 严重 - 红色
        }
    },
    
    // 设备监控图层
    DEVICE_MONITORING: {
        name: '设备监控',
        visible: false,
        opacity: 1.0,
        types: {
            weather_station: '气象站',
            soil_sensor: '土壤传感器',
            camera: '监控摄像头',
            irrigation: '灌溉设备'
        },
        status_colors: {
            online: '#4CAF50',       // 在线 - 绿色
            offline: '#F44336',      // 离线 - 红色
            warning: '#FF9800',      // 警告 - 橙色
            maintenance: '#9E9E9E'   // 维护 - 灰色
        }
    }
};

// ===== UI配置 =====
const UI_CONFIG = {
    // 控制按钮配置
    CONTROLS: {
        position: {
            top: '140px',
            right: '400px'
        },
        buttons: [
            { id: 'zoom-in', icon: '+', title: '放大', action: 'mapZoomIn' },
            { id: 'zoom-out', icon: '-', title: '缩小', action: 'mapZoomOut' },
            { id: 'layer-toggle', icon: '🛰️', title: '卫星图', action: 'toggleMapLayer' },
            { id: 'reset-view', icon: '🎯', title: '重置视图', action: 'resetMapView' }
        ]
    },
    
    // 加载指示器配置
    LOADING: {
        messages: {
            init: '正在初始化地图...',
            layer_switch: '正在切换图层...',
            data_load: '正在加载数据...',
            error: '加载失败，请重试'
        }
    },
    
    // 图层指示器配置
    LAYER_INDICATOR: {
        duration: 2000,  // 显示持续时间（毫秒）
        position: {
            bottom: '30px',
            right: '30px'
        }
    }
};

// ===== 性能配置 =====
const PERFORMANCE_CONFIG = {
    // 渲染配置
    RENDERING: {
        requestRenderMode: true,                 // 按需渲染
        maximumRenderTimeChange: Infinity,      // 最大渲染时间变化
        targetFrameRate: 30,                    // 目标帧率
        resolutionScale: 1.0                    // 分辨率缩放
    },
    
    // 瓦片加载配置
    TILE_LOADING: {
        maximumScreenSpaceError: 16,            // 最大屏幕空间误差
        tileCacheSize: 100,                     // 瓦片缓存大小
        loadingDescendantLimit: 20              // 加载后代限制
    }
};

// ===== 导出配置 =====
if (typeof module !== 'undefined' && module.exports) {
    // Node.js环境
    module.exports = {
        CESIUM_BASE_CONFIG,
        LINXIA_GEO_CONFIG,
        MAP_LAYERS_CONFIG,
        MAP_STYLE_CONFIG,
        AGRICULTURE_LAYERS_CONFIG,
        UI_CONFIG,
        PERFORMANCE_CONFIG
    };
} else {
    // 浏览器环境
    window.CESIUM_CONFIG = {
        BASE: CESIUM_BASE_CONFIG,
        GEO: LINXIA_GEO_CONFIG,
        LAYERS: MAP_LAYERS_CONFIG,
        STYLE: MAP_STYLE_CONFIG,
        AGRICULTURE: AGRICULTURE_LAYERS_CONFIG,
        UI: UI_CONFIG,
        PERFORMANCE: PERFORMANCE_CONFIG
    };
}