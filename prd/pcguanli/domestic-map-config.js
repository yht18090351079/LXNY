/**
 * 国内地图服务配置文件
 * 用于替换需要VPN的海外地图服务
 * 包含高德地图、百度地图、天地图等国内服务商
 */

// ===== 高德地图配置 =====
const AMAP_CONFIG = {
    // 高德地图标准图层
    STANDARD: {
        name: '高德标准地图',
        url: 'https://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        maxZoom: 18,
        attribution: '© 高德地图'
    },
    
    // 高德卫星影像
    SATELLITE: {
        name: '高德卫星影像',
        url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={z}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        maxZoom: 18,
        attribution: '© 高德地图'
    },
    
    // 高德路网标注层
    ROAD_NET: {
        name: '高德路网标注',
        url: 'https://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
        subdomains: ['1', '2', '3', '4'],
        maxZoom: 18,
        attribution: '© 高德地图'
    }
};

// ===== 天地图配置 =====
const TIANDITU_CONFIG = {
    // 天地图密钥 - 需要申请替换
    TOKEN: '你的天地图密钥',
    
    // 天地图矢量底图
    VEC: {
        name: '天地图矢量',
        url: 'https://t{s}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={token}',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 18,
        attribution: '© 天地图'
    },
    
    // 天地图矢量标注
    CVA: {
        name: '天地图矢量标注',
        url: 'https://t{s}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={token}',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 18,
        attribution: '© 天地图'
    },
    
    // 天地图影像底图
    IMG: {
        name: '天地图影像',
        url: 'https://t{s}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={token}',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 18,
        attribution: '© 天地图'
    },
    
    // 天地图影像标注
    CIA: {
        name: '天地图影像标注',
        url: 'https://t{s}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk={token}',
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 18,
        attribution: '© 天地图'
    }
};

// ===== 百度地图配置 =====
const BAIDU_CONFIG = {
    // 百度地图标准图层
    STANDARD: {
        name: '百度标准地图',
        url: 'https://maponline{s}.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20200825',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 18,
        attribution: '© 百度地图',
        // 百度地图使用特殊坐标系统，需要坐标转换
        crs: 'BD09'
    },
    
    // 百度卫星影像
    SATELLITE: {
        name: '百度卫星影像',
        url: 'https://maponline{s}.bdimg.com/starpic/?qt=satepc&u=x={x};y={y};z={z};v=009;type=sate&fm=46&udt=20200825',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 18,
        attribution: '© 百度地图',
        crs: 'BD09'
    }
};

// ===== 腾讯地图配置 =====
const TENCENT_CONFIG = {
    // 腾讯地图标准图层
    STANDARD: {
        name: '腾讯标准地图',
        url: 'https://rt{s}.map.gtimg.com/tile?z={z}&x={x}&y={y}&type=vector&styleid=3',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 18,
        attribution: '© 腾讯地图'
    },
    
    // 腾讯卫星影像
    SATELLITE: {
        name: '腾讯卫星影像',
        url: 'https://p{s}.map.gtimg.com/sateTiles/{z}/{x}/{y}.jpg',
        subdomains: ['0', '1', '2', '3'],
        maxZoom: 18,
        attribution: '© 腾讯地图'
    }
};

// ===== OpenStreetMap 国内镜像配置 =====
const OSM_CHINA_CONFIG = {
    // 清华大学镜像
    TSINGHUA: {
        name: 'OpenStreetMap(清华镜像)',
        url: 'https://mirrors.tuna.tsinghua.edu.cn/osm/{z}/{x}/{y}.png',
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors, 清华大学镜像'
    },
    
    // 中科大镜像
    USTC: {
        name: 'OpenStreetMap(中科大镜像)',
        url: 'https://mirrors.ustc.edu.cn/osm/{z}/{x}/{y}.png',
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors, 中科大镜像'
    }
};

// ===== 推荐配置组合 =====
const RECOMMENDED_CONFIG = {
    // 主要地图图层（不需要密钥）
    PRIMARY: {
        standard: AMAP_CONFIG.STANDARD,
        satellite: AMAP_CONFIG.SATELLITE
    },
    
    // 备用地图图层
    FALLBACK: {
        standard: TENCENT_CONFIG.STANDARD,
        satellite: TENCENT_CONFIG.SATELLITE
    },
    
    // 高精度地图图层（需要密钥）
    HIGH_PRECISION: {
        standard: TIANDITU_CONFIG.VEC,
        standardLabel: TIANDITU_CONFIG.CVA,
        satellite: TIANDITU_CONFIG.IMG,
        satelliteLabel: TIANDITU_CONFIG.CIA
    }
};

// ===== Leaflet 地图创建函数 =====
function createDomesticLeafletMap(containerId, options = {}) {
    const defaultOptions = {
        center: [35.6, 103.1], // 临夏县中心
        zoom: 10,
        zoomControl: true
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    // 创建地图实例
    const map = L.map(containerId, finalOptions);
    
    // 添加高德标准地图作为默认图层
    const amapStandard = L.tileLayer(AMAP_CONFIG.STANDARD.url, {
        subdomains: AMAP_CONFIG.STANDARD.subdomains,
        maxZoom: AMAP_CONFIG.STANDARD.maxZoom,
        attribution: AMAP_CONFIG.STANDARD.attribution
    }).addTo(map);
    
    // 添加图层控制
    const baseMaps = {
        "高德标准地图": amapStandard,
        "高德卫星影像": L.tileLayer(AMAP_CONFIG.SATELLITE.url, {
            subdomains: AMAP_CONFIG.SATELLITE.subdomains,
            maxZoom: AMAP_CONFIG.SATELLITE.maxZoom,
            attribution: AMAP_CONFIG.SATELLITE.attribution
        }),
        "腾讯标准地图": L.tileLayer(TENCENT_CONFIG.STANDARD.url, {
            subdomains: TENCENT_CONFIG.STANDARD.subdomains,
            maxZoom: TENCENT_CONFIG.STANDARD.maxZoom,
            attribution: TENCENT_CONFIG.STANDARD.attribution
        }),
        "腾讯卫星影像": L.tileLayer(TENCENT_CONFIG.SATELLITE.url, {
            subdomains: TENCENT_CONFIG.SATELLITE.subdomains,
            maxZoom: TENCENT_CONFIG.SATELLITE.maxZoom,
            attribution: TENCENT_CONFIG.SATELLITE.attribution
        })
    };
    
    // 如果有天地图密钥，添加天地图图层
    if (TIANDITU_CONFIG.TOKEN && TIANDITU_CONFIG.TOKEN !== '你的天地图密钥') {
        baseMaps["天地图矢量"] = L.layerGroup([
            L.tileLayer(TIANDITU_CONFIG.VEC.url.replace('{token}', TIANDITU_CONFIG.TOKEN), {
                subdomains: TIANDITU_CONFIG.VEC.subdomains,
                maxZoom: TIANDITU_CONFIG.VEC.maxZoom,
                attribution: TIANDITU_CONFIG.VEC.attribution
            }),
            L.tileLayer(TIANDITU_CONFIG.CVA.url.replace('{token}', TIANDITU_CONFIG.TOKEN), {
                subdomains: TIANDITU_CONFIG.CVA.subdomains,
                maxZoom: TIANDITU_CONFIG.CVA.maxZoom,
                attribution: TIANDITU_CONFIG.CVA.attribution
            })
        ]);
        
        baseMaps["天地图影像"] = L.layerGroup([
            L.tileLayer(TIANDITU_CONFIG.IMG.url.replace('{token}', TIANDITU_CONFIG.TOKEN), {
                subdomains: TIANDITU_CONFIG.IMG.subdomains,
                maxZoom: TIANDITU_CONFIG.IMG.maxZoom,
                attribution: TIANDITU_CONFIG.IMG.attribution
            }),
            L.tileLayer(TIANDITU_CONFIG.CIA.url.replace('{token}', TIANDITU_CONFIG.TOKEN), {
                subdomains: TIANDITU_CONFIG.CIA.subdomains,
                maxZoom: TIANDITU_CONFIG.CIA.maxZoom,
                attribution: TIANDITU_CONFIG.CIA.attribution
            })
        ]);
    }
    
    // 添加图层控制器
    L.control.layers(baseMaps).addTo(map);
    
    return map;
}

// ===== Cesium 配置更新函数 =====
function updateCesiumWithDomesticMaps(viewer) {
    // 移除现有图层
    viewer.imageryLayers.removeAll();
    
    // 添加高德标准地图作为默认图层
    const amapProvider = new Cesium.UrlTemplateImageryProvider({
        url: AMAP_CONFIG.STANDARD.url,
        subdomains: AMAP_CONFIG.STANDARD.subdomains,
        maximumLevel: AMAP_CONFIG.STANDARD.maxZoom,
        credit: AMAP_CONFIG.STANDARD.attribution
    });
    
    viewer.imageryLayers.addImageryProvider(amapProvider);
    
    return viewer;
}

// ===== 地图服务状态检测 =====
async function checkMapServiceStatus(config) {
    try {
        const testUrl = config.url
            .replace('{s}', config.subdomains[0])
            .replace('{z}', '3')
            .replace('{x}', '6')
            .replace('{y}', '3');
        
        const response = await fetch(testUrl, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.warn(`地图服务 ${config.name} 不可用:`, error);
        return false;
    }
}

// ===== 自动选择最佳地图服务 =====
async function selectBestMapService() {
    const testOrder = [
        AMAP_CONFIG.STANDARD,
        TENCENT_CONFIG.STANDARD,
        OSM_CHINA_CONFIG.TSINGHUA
    ];
    
    for (const config of testOrder) {
        if (await checkMapServiceStatus(config)) {
            console.log(`使用地图服务: ${config.name}`);
            return config;
        }
    }
    
    console.warn('所有地图服务都不可用，使用默认配置');
    return AMAP_CONFIG.STANDARD;
}

// ===== 导出配置 =====
if (typeof module !== 'undefined' && module.exports) {
    // Node.js环境
    module.exports = {
        AMAP_CONFIG,
        TIANDITU_CONFIG,
        BAIDU_CONFIG,
        TENCENT_CONFIG,
        OSM_CHINA_CONFIG,
        RECOMMENDED_CONFIG,
        createDomesticLeafletMap,
        updateCesiumWithDomesticMaps,
        checkMapServiceStatus,
        selectBestMapService
    };
} else {
    // 浏览器环境
    window.DOMESTIC_MAP_CONFIG = {
        AMAP: AMAP_CONFIG,
        TIANDITU: TIANDITU_CONFIG,
        BAIDU: BAIDU_CONFIG,
        TENCENT: TENCENT_CONFIG,
        OSM_CHINA: OSM_CHINA_CONFIG,
        RECOMMENDED: RECOMMENDED_CONFIG,
        createLeafletMap: createDomesticLeafletMap,
        updateCesium: updateCesiumWithDomesticMaps,
        checkStatus: checkMapServiceStatus,
        selectBest: selectBestMapService
    };
}