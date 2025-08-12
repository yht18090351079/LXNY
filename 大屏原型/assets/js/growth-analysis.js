/**
 * 长势分析功能模块
 * 负责长势分析数据的可视化和交互
 */

// 全局变量
let growthAnalysisCharts = {};
let growthAnalysisData = {};
let growthLayerVisible = false;

/**
 * 初始化长势分析模块
 */
function initGrowthAnalysis() {
    console.log('🌱 初始化长势分析模块');
    
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initGrowthAnalysisCharts, 1000);
        });
    } else {
        setTimeout(initGrowthAnalysisCharts, 1000);
    }
    
    // 生成模拟数据
    generateGrowthAnalysisData();
}

/**
 * 生成长势分析模拟数据
 */
function generateGrowthAnalysisData() {
    console.log('📊 生成长势分析模拟数据');
    
    // NDVI时间序列数据
    growthAnalysisData.ndviTimeSeries = [];
    const startDate = new Date('2024-01-01');
    for (let i = 0; i < 12; i++) {
        const date = new Date(startDate);
        date.setMonth(i);
        growthAnalysisData.ndviTimeSeries.push({
            date: date.toLocaleDateString('zh-CN', { month: 'short' }),
            ndvi: 0.3 + Math.random() * 0.5 + Math.sin(i / 12 * Math.PI * 2) * 0.2
        });
    }
    
    // 长势等级分布数据
    growthAnalysisData.growthLevels = [
        { name: '优秀', value: 2847, color: '#00FF88' },
        { name: '良好', value: 2156, color: '#00D4FF' },
        { name: '一般', value: 1234, color: '#FFD700' },
        { name: '较差', value: 485, color: '#FF4500' }
    ];
    
    // 作物长势对比数据
    growthAnalysisData.cropComparison = [
        { crop: '小麦', currentNDVI: 0.72, lastMonthNDVI: 0.68, color: '#00FF88' },
        { crop: '玉米', currentNDVI: 0.65, lastMonthNDVI: 0.62, color: '#00D4FF' },
        { crop: '辣椒', currentNDVI: 0.58, lastMonthNDVI: 0.55, color: '#FFD700' },
        { crop: '蔬菜', currentNDVI: 0.61, lastMonthNDVI: 0.59, color: '#FF6B6B' }
    ];
    
    // 长势趋势数据
    growthAnalysisData.growthTrend = [];
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        growthAnalysisData.growthTrend.push({
            date: date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
            excellent: 40 + Math.random() * 10 + Math.sin(i / 30 * Math.PI * 2) * 5,
            good: 30 + Math.random() * 8 + Math.cos(i / 30 * Math.PI * 2) * 4,
            normal: 20 + Math.random() * 6,
            poor: 10 + Math.random() * 4
        });
    }
}

/**
 * 初始化长势分析图表
 */
function initGrowthAnalysisCharts() {
    console.log('📈 初始化长势分析图表');
    
    try {
        // 6个专业图表组件
        initStackedChart();           // 1. 长势等级比例堆叠图
        initTrendComparisonChart();   // 4. 长势指数变化趋势图
        initMultiDimensionRadar();    // 5. 多维度长势雷达图
        
        console.log('✅ 长势分析图表初始化完成');
    } catch (error) {
        console.error('❌ 长势分析图表初始化失败:', error);
    }
}

/**
 * 初始化NDVI指数图表
 */
function initNDVIChart() {
    const chartElement = document.getElementById('ndvi-chart');
    if (!chartElement) {
        console.warn('⚠️ NDVI图表容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    growthAnalysisCharts.ndviChart = chart;
    
    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '15%',
            right: '10%',
            top: '20%',
            bottom: '25%'
        },
        xAxis: {
            type: 'category',
            data: growthAnalysisData.ndviTimeSeries.map(item => item.date),
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 1,
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11,
                formatter: '{value}'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 212, 255, 0.2)',
                    type: 'dashed'
                }
            }
        },
        series: [{
            name: 'NDVI指数',
            type: 'line',
            data: growthAnalysisData.ndviTimeSeries.map(item => item.ndvi.toFixed(3)),
            smooth: true,
            lineStyle: {
                color: '#00FF88',
                width: 3
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: 'rgba(0, 255, 136, 0.4)' },
                        { offset: 1, color: 'rgba(0, 255, 136, 0.1)' }
                    ]
                }
            },
            itemStyle: {
                color: '#00FF88',
                borderColor: '#FFFFFF',
                borderWidth: 2
            },
            emphasis: {
                itemStyle: {
                    color: '#00FF88',
                    borderColor: '#FFFFFF',
                    borderWidth: 3,
                    shadowColor: '#00FF88',
                    shadowBlur: 10
                }
            }
        }],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: {
                color: '#FFFFFF'
            },
            formatter: function(params) {
                return `${params[0].name}<br/>NDVI指数: ${params[0].value}`;
            }
        }
    };
    
    chart.setOption(option);
}

/**
 * 初始化长势等级分布图表
 */
function initGrowthLevelChart() {
    const chartElement = document.getElementById('growth-level-chart');
    if (!chartElement) {
        console.warn('⚠️ 长势等级图表容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    growthAnalysisCharts.growthLevelChart = chart;
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: {
                color: '#FFFFFF'
            },
            formatter: '{b}: {c}亩 ({d}%)'
        },
        legend: {
            bottom: '5%',
            left: 'center',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 12
            }
        },
        series: [{
            name: '长势分布',
            type: 'pie',
            radius: ['30%', '70%'],
            center: ['50%', '45%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 5,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2
            },
            label: {
                show: true,
                position: 'outside',
                color: '#FFFFFF',
                fontSize: 11,
                formatter: '{b}\n{d}%'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 13,
                    fontWeight: 'bold'
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: growthAnalysisData.growthLevels.map(item => ({
                name: item.name,
                value: item.value,
                itemStyle: {
                    color: item.color
                }
            }))
        }]
    };
    
    chart.setOption(option);
}

/**
 * 初始化长势趋势图表
 */
function initGrowthTrendChart() {
    const chartElement = document.getElementById('growth-trend-chart');
    if (!chartElement) {
        console.warn('⚠️ 长势趋势图表容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    growthAnalysisCharts.growthTrendChart = chart;
    
    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '15%',
            right: '10%',
            top: '15%',
            bottom: '25%'
        },
        xAxis: {
            type: 'category',
            data: growthAnalysisData.growthTrend.map(item => item.date),
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10,
                interval: 4
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11,
                formatter: '{value}%'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 212, 255, 0.2)',
                    type: 'dashed'
                }
            }
        },
        legend: {
            top: '5%',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        series: [
            {
                name: '优秀',
                type: 'line',
                data: growthAnalysisData.growthTrend.map(item => item.excellent.toFixed(1)),
                smooth: true,
                lineStyle: { color: '#00FF88', width: 2 },
                itemStyle: { color: '#00FF88' }
            },
            {
                name: '良好',
                type: 'line',
                data: growthAnalysisData.growthTrend.map(item => item.good.toFixed(1)),
                smooth: true,
                lineStyle: { color: '#00D4FF', width: 2 },
                itemStyle: { color: '#00D4FF' }
            },
            {
                name: '一般',
                type: 'line',
                data: growthAnalysisData.growthTrend.map(item => item.normal.toFixed(1)),
                smooth: true,
                lineStyle: { color: '#FFD700', width: 2 },
                itemStyle: { color: '#FFD700' }
            },
            {
                name: '较差',
                type: 'line',
                data: growthAnalysisData.growthTrend.map(item => item.poor.toFixed(1)),
                smooth: true,
                lineStyle: { color: '#FF4500', width: 2 },
                itemStyle: { color: '#FF4500' }
            }
        ],
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: {
                color: '#FFFFFF'
            },
            formatter: function(params) {
                let result = `${params[0].name}<br/>`;
                params.forEach(param => {
                    result += `${param.seriesName}: ${param.value}%<br/>`;
                });
                return result;
            }
        }
    };
    
    chart.setOption(option);
}

/**
 * 初始化作物长势对比图表
 */
function initCropComparisonChart() {
    const chartElement = document.getElementById('crop-growth-comparison');
    if (!chartElement) {
        console.warn('⚠️ 作物对比图表容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    growthAnalysisCharts.cropComparisonChart = chart;
    
    const option = {
        backgroundColor: 'transparent',
        grid: {
            left: '20%',
            right: '10%',
            top: '15%',
            bottom: '15%'
        },
        xAxis: {
            type: 'value',
            min: 0,
            max: 1,
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 212, 255, 0.2)',
                    type: 'dashed'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: growthAnalysisData.cropComparison.map(item => item.crop),
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 12
            }
        },
        series: [
            {
                name: '当前NDVI',
                type: 'bar',
                data: growthAnalysisData.cropComparison.map((item, index) => ({
                    value: item.currentNDVI,
                    itemStyle: {
                        color: item.color,
                        borderRadius: [0, 4, 4, 0]
                    }
                })),
                barWidth: '40%',
                label: {
                    show: true,
                    position: 'right',
                    color: '#FFFFFF',
                    fontSize: 11,
                    formatter: '{c}'
                }
            },
            {
                name: '上月NDVI',
                type: 'bar',
                data: growthAnalysisData.cropComparison.map((item, index) => ({
                    value: item.lastMonthNDVI,
                    itemStyle: {
                        color: 'rgba(255, 255, 255, 0.3)',
                        borderRadius: [0, 4, 4, 0]
                    }
                })),
                barWidth: '40%'
            }
        ],
        legend: {
            top: '5%',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: {
                color: '#FFFFFF'
            },
            formatter: function(params) {
                const crop = params[0].name;
                const current = params[0].value;
                const last = params[1].value;
                const change = ((current - last) / last * 100).toFixed(1);
                return `${crop}<br/>当前: ${current}<br/>上月: ${last}<br/>变化: ${change}%`;
            }
        }
    };
    
    chart.setOption(option);
}

/**
 * 1. 初始化长势等级比例堆叠图
 */
function initStackedChart() {
    const chartElement = document.getElementById('growth-stacked-chart');
    if (!chartElement) {
        console.warn('⚠️ 长势等级堆叠图容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    growthAnalysisCharts.stackedChart = chart;
    
    // 堆叠图数据 - 不同作物的长势等级分布
    const crops = ['小麦', '玉米', '辣椒', '蔬菜', '马铃薯'];
    const excellentData = [45, 38, 42, 35, 40];
    const goodData = [32, 35, 28, 38, 30];
    const normalData = [18, 20, 22, 20, 22];
    const poorData = [5, 7, 8, 7, 8];
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#FFFFFF' },
            formatter: function(params) {
                let result = `${params[0].name}<br/>`;
                let total = 0;
                params.forEach(param => {
                    total += param.value;
                });
                params.forEach(param => {
                    const percentage = ((param.value / total) * 100).toFixed(1);
                    result += `${param.seriesName}: ${param.value}% (${percentage}%)<br/>`;
                });
                return result;
            }
        },
        legend: {
            data: ['优秀', '良好', '一般', '较差'],
            top: '5%',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        grid: {
            left: '15%',
            right: '10%',
            top: '25%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: crops,
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11,
                formatter: '{value}%'
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 212, 255, 0.2)',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '优秀',
                type: 'bar',
                stack: '总量',
                data: excellentData,
                itemStyle: {
                    color: '#00FF88'
                }
            },
            {
                name: '良好',
                type: 'bar',
                stack: '总量',
                data: goodData,
                itemStyle: {
                    color: '#00D4FF'
                }
            },
            {
                name: '一般',
                type: 'bar',
                stack: '总量',
                data: normalData,
                itemStyle: {
                    color: '#FFD700'
                }
            },
            {
                name: '较差',
                type: 'bar',
                stack: '总量',
                data: poorData,
                itemStyle: {
                    color: '#FF4500'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 计算并更新优良率
    const totalExcellent = excellentData.reduce((a, b) => a + b, 0);
    const totalGood = goodData.reduce((a, b) => a + b, 0);
    const totalAll = excellentData.concat(goodData, normalData, poorData).reduce((a, b) => a + b, 0);
    const excellenceRate = ((totalExcellent + totalGood) / totalAll * 100).toFixed(1);
    
    const excellenceRateElement = document.getElementById('excellence-rate-value');
    if (excellenceRateElement) {
        excellenceRateElement.textContent = excellenceRate + '%';
    }
}

/**
 * 4. 初始化长势指数变化趋势图（双轴对比）
 */
function initTrendComparisonChart() {
    const chartElement = document.getElementById('growth-trend-comparison');
    if (!chartElement) {
        console.warn('⚠️ 长势趋势对比图容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    growthAnalysisCharts.trendComparisonChart = chart;
    
    // 生成30天数据
    const dates = [];
    const currentYear = [];
    const historicalAverage = [];
    
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }));
        
        // 当前年份数据（有季节性变化）
        const baseValue = 0.65 + Math.sin(i / 30 * Math.PI) * 0.15;
        currentYear.push((baseValue + Math.random() * 0.1 - 0.05).toFixed(3));
        
        // 历史同期平均（相对稳定）
        const historicalBase = 0.60 + Math.sin(i / 30 * Math.PI) * 0.12;
        historicalAverage.push((historicalBase + Math.random() * 0.05 - 0.025).toFixed(3));
    }
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#FFFFFF' },
            formatter: function(params) {
                let result = `${params[0].name}<br/>`;
                params.forEach(param => {
                    result += `${param.seriesName}: ${param.value}<br/>`;
                });
                const diff = (parseFloat(params[0].value) - parseFloat(params[1].value)).toFixed(3);
                const diffPercent = ((diff / parseFloat(params[1].value)) * 100).toFixed(1);
                result += `差值: ${diff} (${diffPercent}%)`;
                return result;
            }
        },
        legend: {
            data: ['2025年长势指数', '历史同期平均'],
            top: '5%',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        grid: {
            left: '15%',
            right: '10%',
            top: '25%',
            bottom: '20%'
        },
        xAxis: {
            type: 'category',
            data: dates,
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10,
                interval: 4
            }
        },
        yAxis: {
            type: 'value',
            min: 0.4,
            max: 0.9,
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 212, 255, 0.2)',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '2025年长势指数',
                type: 'line',
                data: currentYear,
                smooth: true,
                lineStyle: {
                    color: '#00FF88',
                    width: 3
                },
                itemStyle: {
                    color: '#00FF88'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 255, 136, 0.3)' },
                            { offset: 1, color: 'rgba(0, 255, 136, 0.1)' }
                        ]
                    }
                },
                markLine: {
                    data: [
                        {
                            name: '抽穗期',
                            xAxis: dates[15],
                            lineStyle: {
                                color: '#FFD700',
                                type: 'dashed'
                            },
                            label: {
                                color: '#FFD700',
                                fontSize: 10
                            }
                        }
                    ]
                }
            },
            {
                name: '历史同期平均',
                type: 'line',
                data: historicalAverage,
                smooth: true,
                lineStyle: {
                    color: '#00D4FF',
                    width: 2,
                    type: 'dashed'
                },
                itemStyle: {
                    color: '#00D4FF'
                }
            }
        ]
    };
    
    chart.setOption(option);
}

/**
 * 5. 初始化多维度长势雷达图
 */
function initMultiDimensionRadar() {
    const chartElement = document.getElementById('multi-dimension-radar');
    if (!chartElement) {
        console.warn('⚠️ 多维度雷达图容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    growthAnalysisCharts.multiDimensionRadar = chart;
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#FFFFFF' }
        },
        legend: {
            data: ['小麦', '玉米', '辣椒'],
            top: '2%',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        radar: {
            center: ['50%', '57%'],
            radius: '62%',
            indicator: [
                { name: '长势', max: 100 },
                { name: '覆盖度', max: 100 },
                { name: '健康度', max: 100 },
                { name: '产量', max: 100 }
            ],
            name: {
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 11
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(0, 212, 255, 0.3)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 212, 255, 0.2)'
                }
            },
            splitArea: {
                show: true,
                areaStyle: {
                    color: [
                        'rgba(0, 255, 136, 0.05)',
                        'rgba(0, 212, 255, 0.05)'
                    ]
                }
            }
        },
        series: [{
            name: '长势评估',
            type: 'radar',
            data: [
                {
                    value: [85, 88, 82, 90],
                    name: '小麦',
                    itemStyle: {
                        color: '#00FF88'
                    },
                    areaStyle: {
                        color: 'rgba(0, 255, 136, 0.2)'
                    }
                },
                {
                    value: [78, 82, 75, 80],
                    name: '玉米',
                    itemStyle: {
                        color: '#00D4FF'
                    },
                    areaStyle: {
                        color: 'rgba(0, 212, 255, 0.2)'
                    }
                },
                {
                    value: [70, 75, 68, 72],
                    name: '辣椒',
                    itemStyle: {
                        color: '#FFD700'
                    },
                    areaStyle: {
                        color: 'rgba(255, 215, 0, 0.2)'
                    }
                }
            ]
        }]
    };
    
    chart.setOption(option);
}

/**
 * 切换长势图层显示
 */
function toggleGrowthLayer(visible) {
    growthLayerVisible = visible;
    console.log(`🌱 长势图层: ${visible ? '显示' : '隐藏'}`);
    
    if (visible) {
        addGrowthLayerToMap();
    } else {
        removeGrowthLayerFromMap();
    }
}

/**
 * 添加长势图层到地图
 */
function addGrowthLayerToMap() {
    if (!window.cesiumViewer) {
        console.warn('⚠️ Cesium viewer 未初始化');
        return;
    }
    
    console.log('🗺️ 添加长势分析图层到地图');
    
    // 这里可以添加实际的长势图层逻辑
    // 例如：NDVI颜色映射、长势等级可视化等
}

/**
 * 移除地图上的长势图层
 */
function removeGrowthLayerFromMap() {
    if (!window.cesiumViewer) {
        return;
    }
    
    console.log('🗺️ 移除地图上的长势分析图层');
    
    // 这里可以添加移除长势图层的逻辑
}

/**
 * 更新长势分析数据
 */
function updateGrowthAnalysisData() {
    console.log('🔄 更新长势分析数据');
    
    // 重新生成数据
    generateGrowthAnalysisData();
    
    // 更新图表
    if (growthAnalysisCharts.ndviChart) {
        const ndviOption = growthAnalysisCharts.ndviChart.getOption();
        ndviOption.xAxis[0].data = growthAnalysisData.ndviTimeSeries.map(item => item.date);
        ndviOption.series[0].data = growthAnalysisData.ndviTimeSeries.map(item => item.ndvi.toFixed(3));
        growthAnalysisCharts.ndviChart.setOption(ndviOption);
    }
    
    if (growthAnalysisCharts.growthLevelChart) {
        const levelOption = growthAnalysisCharts.growthLevelChart.getOption();
        levelOption.series[0].data = growthAnalysisData.growthLevels.map(item => ({
            name: item.name,
            value: item.value,
            itemStyle: { color: item.color }
        }));
        growthAnalysisCharts.growthLevelChart.setOption(levelOption);
    }
    
    // 更新统计数据
    updateGrowthStatistics();
}

/**
 * 更新长势统计数据
 */
function updateGrowthStatistics() {
    // 更新NDVI统计值
    const avgNDVI = growthAnalysisData.ndviTimeSeries.reduce((sum, item) => sum + item.ndvi, 0) / growthAnalysisData.ndviTimeSeries.length;
    const maxNDVI = Math.max(...growthAnalysisData.ndviTimeSeries.map(item => item.ndvi));
    const totalArea = growthAnalysisData.growthLevels.reduce((sum, item) => sum + item.value, 0);
    const coverage = (growthAnalysisData.growthLevels.slice(0, 3).reduce((sum, item) => sum + item.value, 0) / totalArea * 100);
    
    // 更新DOM元素
    const avgElement = document.querySelector('.ndvi-avg');
    const maxElement = document.querySelector('.ndvi-max');
    const coverageElement = document.querySelector('.ndvi-coverage');
    
    if (avgElement) avgElement.textContent = avgNDVI.toFixed(2);
    if (maxElement) maxElement.textContent = maxNDVI.toFixed(2);
    if (coverageElement) coverageElement.textContent = coverage.toFixed(1) + '%';
}

/**
 * 响应式图表调整
 */
function resizeGrowthAnalysisCharts() {
    Object.values(growthAnalysisCharts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
}

// 窗口大小变化时调整图表
window.addEventListener('resize', resizeGrowthAnalysisCharts);

// 全局导出
window.GrowthAnalysis = {
    init: initGrowthAnalysis,
    toggleLayer: toggleGrowthLayer,
    updateData: updateGrowthAnalysisData,
    resize: resizeGrowthAnalysisCharts
};

// 自动初始化
initGrowthAnalysis();

/**
 * 页面功能切换处理（复制自main.js，确保长势分析页面也能正常跳转）
 */
function initPageFunctionSwitchBar() {
    // 主功能按钮切换（单选）
    const mainSwitchBtns = document.querySelectorAll('.main-switch-btn');
    
    mainSwitchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const functionType = this.dataset.function;
            
            // 页面跳转映射
            const pageMapping = {
                'crop-distribution': 'index.html',
                'growth-analysis': 'growth-analysis.html',
                'yield-estimation': 'yield-estimation.html',
                'weather-monitoring': 'weather-monitoring.html',
                'disaster-monitoring': 'disaster-monitoring.html'
            };
            
            // 检查是否有对应的页面
            if (pageMapping[functionType]) {
                // 如果当前已经在目标页面，不需要跳转
                const currentPage = window.location.pathname.split('/').pop() || 'index.html';
                const targetPage = pageMapping[functionType];
                
                if (currentPage === targetPage) {
                    console.log(`已在 ${functionType} 页面，无需跳转`);
                    return;
                }
                
                console.log(`正在跳转到: ${functionType} (${targetPage})`);
                
                // 页面跳转
                window.location.href = targetPage;
                return;
            }
            
            // 未实现的功能显示提示
            alert(`${this.querySelector('.btn-text').textContent} 功能页面将在后续步骤中创建`);
        });
    });

    // 叠加功能按钮切换（可多选）
    const overlaySwitchBtns = document.querySelectorAll('.overlay-switch-btn');
    
    overlaySwitchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const functionType = this.dataset.function;
            
            if (functionType === 'crop-selection') {
                // 切换作物图层选择器
                this.classList.toggle('active');
                // 在长势分析页面也需要作物选择功能
                if (typeof toggleCropLayerSelector === 'function') {
                    toggleCropLayerSelector(this.classList.contains('active'), this);
                }
                return;
            }
            
            if (functionType === 'device-monitoring') {
                // 设备监控功能
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                if (typeof toggleDeviceMonitoring === 'function') {
                    toggleDeviceMonitoring(isActive);
                }
                console.log(`设备监控: ${isActive ? '开启' : '关闭'}`);
                return;
            }
            
            // 其他功能待实现
            alert(`${this.querySelector('.btn-text').textContent} 功能将在后续步骤中实现`);
        });
    });
}

// 页面加载完成后初始化功能切换
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageFunctionSwitchBar);
} else {
    initPageFunctionSwitchBar();
}