// 灾害监测图层可视化逻辑
class DisasterMonitoringLayer {
    constructor(viewer) {
        this.viewer = viewer;
        this.temperatureDataSource = null;
        this.droughtDataSource = null;
        this.currentLayer = 'temperature';
        this.init();
    }

    init() {
        this.createDataSources();
        this.loadTemperatureRiskData();
        this.loadDroughtRiskData();
        this.initCharts();
    }

    createDataSources() {
        // 创建高温冻害数据源
        this.temperatureDataSource = new Cesium.CustomDataSource('temperature-risk');
        this.viewer.dataSources.add(this.temperatureDataSource);

        // 创建干旱监测数据源
        this.droughtDataSource = new Cesium.CustomDataSource('drought-risk');
        this.viewer.dataSources.add(this.droughtDataSource);
        this.droughtDataSource.show = false;
    }

    // 加载高温冻害风险数据
    loadTemperatureRiskData() {
        // 模拟高温冻害风险区域数据
        const temperatureRiskAreas = [
            {
                id: 'temp_risk_1',
                name: '北部高温风险区',
                coordinates: [
                    [103.100, 35.620], [103.120, 35.620], 
                    [103.120, 35.640], [103.100, 35.640]
                ],
                riskLevel: 'extreme', // 极严重
                temperature: 36.5,
                cropType: '小麦',
                affectedArea: 285,
                estimatedLoss: 185.3
            },
            {
                id: 'temp_risk_2',
                name: '东部高温风险区',
                coordinates: [
                    [103.140, 35.600], [103.170, 35.600],
                    [103.170, 35.620], [103.140, 35.620]
                ],
                riskLevel: 'severe', // 严重
                temperature: 34.2,
                cropType: '玉米',
                affectedArea: 156,
                estimatedLoss: 98.7
            },
            {
                id: 'temp_risk_3',
                name: '南部温度风险区',
                coordinates: [
                    [103.080, 35.580], [103.110, 35.580],
                    [103.110, 35.600], [103.080, 35.600]
                ],
                riskLevel: 'moderate', // 中等
                temperature: 32.8,
                cropType: '小麦',
                affectedArea: 89,
                estimatedLoss: 45.2
            },
            {
                id: 'temp_risk_4',
                name: '西部轻度风险区',
                coordinates: [
                    [103.060, 35.610], [103.090, 35.610],
                    [103.090, 35.630], [103.060, 35.630]
                ],
                riskLevel: 'light', // 轻微
                temperature: 31.2,
                cropType: '玉米',
                affectedArea: 45,
                estimatedLoss: 18.6
            }
        ];

        temperatureRiskAreas.forEach(area => {
            this.createTemperatureRiskPolygon(area);
        });
    }

    // 创建高温风险多边形
    createTemperatureRiskPolygon(area) {
        const riskColors = {
            'extreme': { color: '#F44336', alpha: 0.6 },
            'severe': { color: '#FF9800', alpha: 0.5 },
            'moderate': { color: '#FFEB3B', alpha: 0.4 },
            'light': { color: '#FFF9C4', alpha: 0.3 }
        };

        const riskColor = riskColors[area.riskLevel];
        const coordinates = area.coordinates.flat();

        const polygon = this.temperatureDataSource.entities.add({
            id: area.id,
            name: area.name,
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(coordinates),
                material: Cesium.Color.fromCssColorString(riskColor.color).withAlpha(riskColor.alpha),
                outline: true,
                outlineColor: Cesium.Color.fromCssColorString(riskColor.color),
                height: 0,
                extrudedHeight: 50
            },
            properties: {
                riskLevel: area.riskLevel,
                temperature: area.temperature,
                cropType: area.cropType,
                affectedArea: area.affectedArea,
                estimatedLoss: area.estimatedLoss,
                type: 'temperature'
            }
        });

        // 添加标签
        this.temperatureDataSource.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
                (area.coordinates[0][0] + area.coordinates[2][0]) / 2,
                (area.coordinates[0][1] + area.coordinates[2][1]) / 2,
                100
            ),
            label: {
                text: `${area.name}\n${area.temperature}°C`,
                font: '12pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -30),
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString(riskColor.color).withAlpha(0.8)
            }
        });
    }

    // 加载干旱风险数据
    loadDroughtRiskData() {
        const droughtRiskAreas = [
            {
                id: 'drought_risk_1',
                name: '东南部特旱区',
                coordinates: [
                    [103.130, 35.570], [103.160, 35.570],
                    [103.160, 35.590], [103.130, 35.590]
                ],
                droughtLevel: 'extreme', // 特旱
                soilMoisture: 15,
                precipitation: -65,
                cropType: '小麦',
                affectedArea: 198,
                estimatedLoss: 156.8
            },
            {
                id: 'drought_risk_2',
                name: '西北部重旱区',
                coordinates: [
                    [103.070, 35.630], [103.100, 35.630],
                    [103.100, 35.650], [103.070, 35.650]
                ],
                droughtLevel: 'severe', // 重旱
                soilMoisture: 25,
                precipitation: -45,
                cropType: '玉米',
                affectedArea: 142,
                estimatedLoss: 89.3
            },
            {
                id: 'drought_risk_3',
                name: '中部中旱区',
                coordinates: [
                    [103.100, 35.590], [103.130, 35.590],
                    [103.130, 35.610], [103.100, 35.610]
                ],
                droughtLevel: 'moderate', // 中旱
                soilMoisture: 35,
                precipitation: -25,
                cropType: '辣椒',
                affectedArea: 86,
                estimatedLoss: 42.5
            },
            {
                id: 'drought_risk_4',
                name: '北部轻旱区',
                coordinates: [
                    [103.110, 35.640], [103.140, 35.640],
                    [103.140, 35.660], [103.110, 35.660]
                ],
                droughtLevel: 'light', // 轻旱
                soilMoisture: 45,
                precipitation: -15,
                cropType: '玉米',
                affectedArea: 67,
                estimatedLoss: 23.4
            }
        ];

        droughtRiskAreas.forEach(area => {
            this.createDroughtRiskPolygon(area);
        });
    }

    // 创建干旱风险多边形
    createDroughtRiskPolygon(area) {
        const droughtColors = {
            'extreme': { color: '#673AB7', alpha: 0.6 },
            'severe': { color: '#1565C0', alpha: 0.5 },
            'moderate': { color: '#2196F3', alpha: 0.4 },
            'light': { color: '#E3F2FD', alpha: 0.3 }
        };

        const droughtColor = droughtColors[area.droughtLevel];
        const coordinates = area.coordinates.flat();

        this.droughtDataSource.entities.add({
            id: area.id,
            name: area.name,
            polygon: {
                hierarchy: Cesium.Cartesian3.fromDegreesArray(coordinates),
                material: Cesium.Color.fromCssColorString(droughtColor.color).withAlpha(droughtColor.alpha),
                outline: true,
                outlineColor: Cesium.Color.fromCssColorString(droughtColor.color),
                height: 0,
                extrudedHeight: 30
            },
            properties: {
                droughtLevel: area.droughtLevel,
                soilMoisture: area.soilMoisture,
                precipitation: area.precipitation,
                cropType: area.cropType,
                affectedArea: area.affectedArea,
                estimatedLoss: area.estimatedLoss,
                type: 'drought'
            }
        });

        // 添加标签
        this.droughtDataSource.entities.add({
            position: Cesium.Cartesian3.fromDegrees(
                (area.coordinates[0][0] + area.coordinates[2][0]) / 2,
                (area.coordinates[0][1] + area.coordinates[2][1]) / 2,
                100
            ),
            label: {
                text: `${area.name}\n含水量${area.soilMoisture}%`,
                font: '12pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -30),
                showBackground: true,
                backgroundColor: Cesium.Color.fromCssColorString(droughtColor.color).withAlpha(0.8)
            }
        });
    }

    // 切换图层
    switchLayer(layerType) {
        this.currentLayer = layerType;
        
        if (layerType === 'temperature') {
            this.temperatureDataSource.show = true;
            this.droughtDataSource.show = false;
        } else if (layerType === 'drought') {
            this.temperatureDataSource.show = false;
            this.droughtDataSource.show = true;
        }

        this.updateCharts(layerType);
    }

    // 初始化图表
    initCharts() {
        // 添加延时确保DOM元素已经完全渲染
        setTimeout(() => {
            this.initTemperatureRiskChart();
            this.initDroughtLevelChart();
            this.initLossDistributionChart();
            this.initHistoricalComparisonChart();
        }, 100);
    }

    // 初始化高温风险图表
    initTemperatureRiskChart() {
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载');
            return;
        }
        
        const container = document.getElementById('temperature-risk-chart');
        if (!container) {
            console.error('找不到temperature-risk-chart容器');
            return;
        }

        try {
            const chart = echarts.init(container);
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}% ({d}%)'
                },
                series: [{
                    name: '风险等级',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '50%'],
                    data: [
                        { value: 8.5, name: '极严重风险', itemStyle: { color: '#F44336' } },
                        { value: 15.2, name: '严重风险', itemStyle: { color: '#FF9800' } },
                        { value: 23.8, name: '中等风险', itemStyle: { color: '#FFEB3B' } },
                        { value: 31.4, name: '轻微风险', itemStyle: { color: '#FFF9C4' } },
                        { value: 21.1, name: '无风险', itemStyle: { color: 'transparent' } }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }]
            };
            chart.setOption(option);
            console.log('高温风险图表初始化成功');
        } catch (error) {
            console.error('高温风险图表初始化失败:', error);
        }
    }

    // 初始化干旱等级图表
    initDroughtLevelChart() {
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载');
            return;
        }
        
        const container = document.getElementById('drought-level-chart');
        if (!container) {
            console.error('找不到drought-level-chart容器');
            return;
        }

        try {
            const chart = echarts.init(container);
            const option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c}% ({d}%)'
                },
                series: [{
                    name: '干旱等级',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    center: ['50%', '50%'],
                    data: [
                        { value: 5.3, name: '特旱', itemStyle: { color: '#673AB7' } },
                        { value: 12.7, name: '重旱', itemStyle: { color: '#1565C0' } },
                        { value: 28.5, name: '中旱', itemStyle: { color: '#2196F3' } },
                        { value: 34.2, name: '轻旱', itemStyle: { color: '#E3F2FD' } },
                        { value: 19.3, name: '无旱', itemStyle: { color: 'transparent' } }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    },
                    label: {
                        show: false
                    },
                    labelLine: {
                        show: false
                    }
                }]
            };
            chart.setOption(option);
            console.log('干旱等级图表初始化成功');
        } catch (error) {
            console.error('干旱等级图表初始化失败:', error);
        }
    }

    // 初始化损失分布图表
    initLossDistributionChart() {
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载');
            return;
        }
        
        const container = document.getElementById('loss-distribution-chart');
        if (!container) {
            console.error('找不到loss-distribution-chart容器');
            return;
        }

        try {
            const chart = echarts.init(container);
            const option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
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
                    data: ['小麦', '玉米', '辣椒', '其他'],
                    axisLabel: {
                        color: '#fff',
                        fontSize: 10
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '损失(万元)',
                    axisLabel: {
                        color: '#fff',
                        fontSize: 10
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                series: [{
                    name: '经济损失',
                    type: 'bar',
                    data: [512.3, 344.1, 89.5, 32.8],
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#40C4FF' },
                            { offset: 1, color: '#1976D2' }
                        ])
                    },
                    emphasis: {
                        itemStyle: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                                { offset: 0, color: '#64B5F6' },
                                { offset: 1, color: '#1976D2' }
                            ])
                        }
                    }
                }]
            };
            chart.setOption(option);
            console.log('损失分布图表初始化成功');
        } catch (error) {
            console.error('损失分布图表初始化失败:', error);
        }
    }

    // 初始化历史对比图表
    initHistoricalComparisonChart() {
        if (typeof echarts === 'undefined') {
            console.error('ECharts未加载');
            return;
        }
        
        const container = document.getElementById('historical-comparison-chart');
        if (!container) {
            console.error('找不到historical-comparison-chart容器');
            return;
        }

        try {
            const chart = echarts.init(container);
            const option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['高温损失', '干旱损失'],
                    textStyle: {
                        color: '#fff',
                        fontSize: 10
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
                    data: ['2022年', '2023年', '2024年', '2025年'],
                    axisLabel: {
                        color: '#fff',
                        fontSize: 10
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    }
                },
                yAxis: {
                    type: 'value',
                    name: '损失(万元)',
                    axisLabel: {
                        color: '#fff',
                        fontSize: 10
                    },
                    axisLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                },
                series: [
                    {
                        name: '高温损失',
                        type: 'line',
                        data: [320, 412, 675, 856],
                        itemStyle: {
                            color: '#FF5722'
                        },
                        lineStyle: {
                            color: '#FF5722'
                        }
                    },
                    {
                        name: '干旱损失',
                        type: 'line',
                        data: [280, 298, 456, 512],
                        itemStyle: {
                            color: '#2196F3'
                        },
                        lineStyle: {
                            color: '#2196F3'
                        }
                    }
                ]
            };
            chart.setOption(option);
            console.log('历史对比图表初始化成功');
        } catch (error) {
            console.error('历史对比图表初始化失败:', error);
        }
    }

    // 更新图表数据
    updateCharts(layerType) {
        // 根据图层类型更新相关图表显示
        if (layerType === 'temperature') {
            // 显示高温相关数据
            this.updateOverviewCards('temperature');
        } else if (layerType === 'drought') {
            // 显示干旱相关数据
            this.updateOverviewCards('drought');
        }
    }

    // 更新概览卡片
    updateOverviewCards(type) {
        const cards = document.querySelectorAll('.overview-card');
        if (type === 'temperature') {
            // 更新高温灾害数据
            cards[0].querySelector('.card-value').textContent = '1,285';
            cards[1].querySelector('.card-value').textContent = '2,156';
            cards[2].querySelector('.card-value').textContent = '856.4';
        } else if (type === 'drought') {
            // 更新干旱灾害数据
            cards[0].querySelector('.card-value').textContent = '982';
            cards[1].querySelector('.card-value').textContent = '1,654';
            cards[2].querySelector('.card-value').textContent = '623.8';
        }
    }

    // 处理点击事件
    setupClickHandlers() {
        this.viewer.selectedEntityChanged.addEventListener(() => {
            const selectedEntity = this.viewer.selectedEntity;
            if (selectedEntity && selectedEntity.properties) {
                this.showDisasterDetails(selectedEntity);
            }
        });
    }

    // 显示灾害详情
    showDisasterDetails(entity) {
        const props = entity.properties;
        const type = props.type?.getValue();
        
        if (type === 'temperature') {
            const info = `
                <div class="disaster-info-popup">
                    <h4>${entity.name}</h4>
                    <p>风险等级: ${this.getRiskLevelText(props.riskLevel?.getValue())}</p>
                    <p>当前温度: ${props.temperature?.getValue()}°C</p>
                    <p>主要作物: ${props.cropType?.getValue()}</p>
                    <p>受灾面积: ${props.affectedArea?.getValue()} 公顷</p>
                    <p>预估损失: ${props.estimatedLoss?.getValue()} 万元</p>
                </div>
            `;
            this.showInfoWindow(info);
        } else if (type === 'drought') {
            const info = `
                <div class="disaster-info-popup">
                    <h4>${entity.name}</h4>
                    <p>干旱等级: ${this.getDroughtLevelText(props.droughtLevel?.getValue())}</p>
                    <p>土壤含水量: ${props.soilMoisture?.getValue()}%</p>
                    <p>降水距平: ${props.precipitation?.getValue()}%</p>
                    <p>主要作物: ${props.cropType?.getValue()}</p>
                    <p>受灾面积: ${props.affectedArea?.getValue()} 公顷</p>
                    <p>预估损失: ${props.estimatedLoss?.getValue()} 万元</p>
                </div>
            `;
            this.showInfoWindow(info);
        }
    }

    // 获取风险等级文本
    getRiskLevelText(level) {
        const levels = {
            'extreme': '极严重',
            'severe': '严重',
            'moderate': '中等',
            'light': '轻微'
        };
        return levels[level] || level;
    }

    // 获取干旱等级文本
    getDroughtLevelText(level) {
        const levels = {
            'extreme': '特旱',
            'severe': '重旱',
            'moderate': '中旱',
            'light': '轻旱'
        };
        return levels[level] || level;
    }

    // 显示信息窗口
    showInfoWindow(content) {
        // 这里可以实现自定义的信息窗口显示逻辑
        console.log('显示灾害详情:', content);
    }
}

// 全局变量
let disasterLayer = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('灾害监测模块 - DOM加载完成');
    
    // 等待ECharts加载完成
    if (typeof echarts === 'undefined') {
        console.error('ECharts未加载，正在等待...');
        // 检查ECharts是否加载完成的循环
        const checkECharts = setInterval(() => {
            if (typeof echarts !== 'undefined') {
                console.log('ECharts加载完成');
                clearInterval(checkECharts);
                initializeDisasterMonitoring();
            }
        }, 100);
    } else {
        console.log('ECharts已加载');
        initializeDisasterMonitoring();
    }
});

function initializeDisasterMonitoring() {
    // 等待Cesium地图初始化完成后再创建灾害图层
    if (window.viewer) {
        console.log('Cesium viewer已存在，初始化灾害监测');
        initDisasterMonitoring();
    } else {
        console.log('等待Cesium viewer初始化...');
        // 如果viewer还未初始化，则监听初始化完成事件
        document.addEventListener('cesiumViewerReady', function() {
            console.log('收到cesiumViewerReady事件');
            initDisasterMonitoring();
        });
        
        // 备用方案：定时检查viewer是否已经初始化
        let attempts = 0;
        const maxAttempts = 50; // 最多等待5秒
        const checkViewer = setInterval(() => {
            attempts++;
            if (window.viewer) {
                console.log('检测到Cesium viewer已初始化');
                clearInterval(checkViewer);
                initDisasterMonitoring();
            } else if (attempts >= maxAttempts) {
                console.error('等待Cesium viewer超时');
                clearInterval(checkViewer);
                // 即使没有viewer，也尝试初始化图表
                initChartsOnly();
            }
        }, 100);
    }
}

function initChartsOnly() {
    console.log('仅初始化图表（无Cesium）');
    try {
        const tempLayer = {
            initCharts: function() {
                setTimeout(() => {
                    initTemperatureRiskChart();
                    initDroughtLevelChart(); 
                    initLossDistributionChart();
                    initHistoricalComparisonChart();
                }, 200);
            }
        };
        tempLayer.initCharts();
    } catch (error) {
        console.error('图表初始化失败:', error);
    }
}

// 独立的图表初始化函数（当Cesium未初始化时使用）
function initTemperatureRiskChart() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts未加载');
        return;
    }
    
    const container = document.getElementById('temperature-risk-chart');
    if (!container) {
        console.error('找不到temperature-risk-chart容器');
        return;
    }

    try {
        const chart = echarts.init(container);
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}% ({d}%)'
            },
            series: [{
                name: '风险等级',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                data: [
                    { value: 8.5, name: '极严重风险', itemStyle: { color: '#F44336' } },
                    { value: 15.2, name: '严重风险', itemStyle: { color: '#FF9800' } },
                    { value: 23.8, name: '中等风险', itemStyle: { color: '#FFEB3B' } },
                    { value: 31.4, name: '轻微风险', itemStyle: { color: '#FFF9C4' } },
                    { value: 21.1, name: '无风险', itemStyle: { color: 'transparent' } }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }]
        };
        chart.setOption(option);
        console.log('独立高温风险图表初始化成功');
    } catch (error) {
        console.error('独立高温风险图表初始化失败:', error);
    }
}

function initDroughtLevelChart() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts未加载');
        return;
    }
    
    const container = document.getElementById('drought-level-chart');
    if (!container) {
        console.error('找不到drought-level-chart容器');
        return;
    }

    try {
        const chart = echarts.init(container);
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c}% ({d}%)'
            },
            series: [{
                name: '干旱等级',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                data: [
                    { value: 5.3, name: '特旱', itemStyle: { color: '#673AB7' } },
                    { value: 12.7, name: '重旱', itemStyle: { color: '#1565C0' } },
                    { value: 28.5, name: '中旱', itemStyle: { color: '#2196F3' } },
                    { value: 34.2, name: '轻旱', itemStyle: { color: '#E3F2FD' } },
                    { value: 19.3, name: '无旱', itemStyle: { color: 'transparent' } }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                }
            }]
        };
        chart.setOption(option);
        console.log('独立干旱等级图表初始化成功');
    } catch (error) {
        console.error('独立干旱等级图表初始化失败:', error);
    }
}

function initLossDistributionChart() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts未加载');
        return;
    }
    
    const container = document.getElementById('loss-distribution-chart');
    if (!container) {
        console.error('找不到loss-distribution-chart容器');
        return;
    }

    try {
        const chart = echarts.init(container);
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
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
                data: ['小麦', '玉米', '辣椒', '其他'],
                axisLabel: {
                    color: '#fff',
                    fontSize: 10
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: '损失(万元)',
                axisLabel: {
                    color: '#fff',
                    fontSize: 10
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            series: [{
                name: '经济损失',
                type: 'bar',
                data: [512.3, 344.1, 89.5, 32.8],
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#40C4FF' },
                        { offset: 1, color: '#1976D2' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#64B5F6' },
                            { offset: 1, color: '#1976D2' }
                        ])
                    }
                }
            }]
        };
        chart.setOption(option);
        console.log('独立损失分布图表初始化成功');
    } catch (error) {
        console.error('独立损失分布图表初始化失败:', error);
    }
}

function initHistoricalComparisonChart() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts未加载');
        return;
    }
    
    const container = document.getElementById('historical-comparison-chart');
    if (!container) {
        console.error('找不到historical-comparison-chart容器');
        return;
    }

    try {
        const chart = echarts.init(container);
        const option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['高温损失', '干旱损失'],
                textStyle: {
                    color: '#fff',
                    fontSize: 10
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
                data: ['2022年', '2023年', '2024年', '2025年'],
                axisLabel: {
                    color: '#fff',
                    fontSize: 10
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: '损失(万元)',
                axisLabel: {
                    color: '#fff',
                    fontSize: 10
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    }
                }
            },
            series: [
                {
                    name: '高温损失',
                    type: 'line',
                    data: [320, 412, 675, 856],
                    itemStyle: {
                        color: '#FF5722'
                    },
                    lineStyle: {
                        color: '#FF5722'
                    }
                },
                {
                    name: '干旱损失',
                    type: 'line',
                    data: [280, 298, 456, 512],
                    itemStyle: {
                        color: '#2196F3'
                    },
                    lineStyle: {
                        color: '#2196F3'
                    }
                }
            ]
        };
        chart.setOption(option);
        console.log('独立历史对比图表初始化成功');
    } catch (error) {
        console.error('独立历史对比图表初始化失败:', error);
    }
}

function initDisasterMonitoring() {
    if (window.viewer) {
        disasterLayer = new DisasterMonitoringLayer(window.viewer);
        disasterLayer.setupClickHandlers();
    }
}

// 导出给其他模块使用
window.disasterLayer = disasterLayer;