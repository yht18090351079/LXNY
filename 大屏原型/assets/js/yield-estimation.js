/**
 * 产量预估功能模块
 * 负责产量预估数据的可视化和交互
 */

// 全局变量
let yieldEstimationCharts = {};
let yieldEstimationData = {};
let currentCrop = 'wheat'; // 当前选择的作物：wheat, corn
let yieldLayerVisible = false;
// currentChartType 已在 main.js 中声明，这里不再重复声明

/**
 * 初始化产量预估模块
 */
function initYieldEstimation() {
    console.log('📈 初始化产量预估模块');
    
    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initYieldEstimationCharts, 1000);
        });
    } else {
        setTimeout(initYieldEstimationCharts, 1000);
    }
    
    // 生成模拟数据
    generateYieldEstimationData();
    
    // 初始化交互功能
    initYieldInteractions();
    
    // 延迟更新显示数据，确保DOM已准备好
    setTimeout(() => {
        updateCropDetailsDisplay();
    }, 100);
}

/**
 * 生成产量预估模拟数据
 */
function generateYieldEstimationData() {
    console.log('📊 生成产量预估模拟数据');
    
    // 小麦产量数据
    yieldEstimationData.wheat = {
        // 模型权重数据
        modelWeights: [
            { name: '遥感长势数据', value: 40, color: '#1976D2' },
            { name: '历史产量数据', value: 30, color: '#388E3C' },
            { name: '气象条件', value: 20, color: '#F57C00' },
            { name: '田间管理', value: 10, color: '#7B1FA2' }
        ],
        
        // 产量等级分布
        yieldDistribution: [
            { name: '高产(>500kg/亩)', value: 1256, color: '#1565C0', percent: 42.3 },
            { name: '中高产(400-500kg/亩)', value: 986, color: '#1976D2', percent: 33.2 },
            { name: '中产(300-400kg/亩)', value: 500, color: '#42A5F5', percent: 16.9 },
            { name: '中低产(200-300kg/亩)', value: 180, color: '#FFEB3B', percent: 6.1 },
            { name: '低产(<200kg/亩)', value: 45, color: '#FF5722', percent: 1.5 }
        ],
        
        // 历史产量对比 (近5年)
        historicalYield: {
            years: ['2021', '2022', '2023', '2024', '2025(预估)'],
            totalProduction: [1120, 1256, 1180, 1320, 1485], // 吨
            averageYield: [378, 425, 398, 446, 428], // kg/亩
            accuracy: [null, null, null, 91.5, null] // 预估准确率
        },
        
        // 当前产量概览
        currentOverview: {
            totalProduction: 1485, // 吨
            averageYield: 428, // kg/亩
            comparisonLastYear: 12.5, // %
            comparisonThreeYearAvg: 8.3 // %
        },
        
        // 区域估产达成度数据
        achievementGauge: {
            estimatedYield: 1366, // 预估总产量（吨）
            targetYield: 1660, // 年度目标（吨）
            achievementRate: 82.3 // 完成率（%）
        },
        
        // 经济价值分析
        economicAnalysis: {
            totalValue: 356.4, // 预估总产值（万元）
            averageIncome: 1203, // 亩均收益（元/亩）
            costBenefitRatio: 2.15, // 成本收益率
            valueChange: 8.6, // 产值变化（%）
            incomeChange: 5.8, // 收益变化（%）
            ratioChange: -2.1, // 收益率变化（%）
            cropProfitBreakdown: [
                { name: '小麦主产区收益', value: 356.4, percent: 100 },
                { name: '小麦优质种植收益', value: 298.2, percent: 83.7 },
                { name: '小麦标准种植收益', value: 245.8, percent: 69.0 }
            ]
        }
    };
    
    // 玉米产量数据
    yieldEstimationData.corn = {
        // 模型权重数据 (与小麦相同)
        modelWeights: yieldEstimationData.wheat.modelWeights,
        
        // 产量等级分布 (玉米标准不同)
        yieldDistribution: [
            { name: '高产(>600kg/亩)', value: 1050, color: '#1565C0', percent: 35.4 },
            { name: '中高产(500-600kg/亩)', value: 1200, color: '#1976D2', percent: 40.5 },
            { name: '中产(400-500kg/亩)', value: 580, color: '#42A5F5', percent: 19.6 },
            { name: '中低产(300-400kg/亩)', value: 120, color: '#FFEB3B', percent: 4.1 },
            { name: '低产(<300kg/亩)', value: 15, color: '#FF5722', percent: 0.5 }
        ],
        
        // 历史产量对比
        historicalYield: {
            years: ['2021', '2022', '2023', '2024', '2025(预估)'],
            totalProduction: [1680, 1820, 1756, 1920, 2145], // 吨
            averageYield: [565, 614, 592, 648, 723], // kg/亩
            accuracy: [null, null, null, 89.2, null]
        },
        
        // 当前产量概览
        currentOverview: {
            totalProduction: 2145, // 吨
            averageYield: 723, // kg/亩
            comparisonLastYear: 11.7, // %
            comparisonThreeYearAvg: 15.2 // %
        },
        
        // 区域估产达成度数据
        achievementGauge: {
            estimatedYield: 2145, // 预估总产量（吨）
            targetYield: 2000, // 年度目标（吨）
            achievementRate: 107.3 // 完成率（%）
        },
        
        // 经济价值分析
        economicAnalysis: {
            totalValue: 515.2, // 预估总产值（万元）
            averageIncome: 1736, // 亩均收益（元/亩）
            costBenefitRatio: 2.48, // 成本收益率
            valueChange: 12.3, // 产值变化（%）
            incomeChange: 9.4, // 收益变化（%）
            ratioChange: 1.8, // 收益率变化（%）
            cropProfitBreakdown: [
                { name: '玉米主产区收益', value: 515.2, percent: 100 },
                { name: '玉米高产种植收益', value: 456.8, percent: 88.7 },
                { name: '玉米标准种植收益', value: 382.5, percent: 74.3 },
                { name: '玉米轮作收益', value: 298.7, percent: 58.0 }
            ]
        }
    };
    
    // 油菜产量数据
    yieldEstimationData.rapeseed = {
        modelWeights: yieldEstimationData.wheat.modelWeights,
        yieldDistribution: [
            { name: '高产(>220kg/亩)', value: 780, color: '#1565C0', percent: 26.8 },
            { name: '中高产(180-220kg/亩)', value: 1150, color: '#1976D2', percent: 39.5 },
            { name: '中产(140-180kg/亩)', value: 720, color: '#42A5F5', percent: 24.7 },
            { name: '中低产(100-140kg/亩)', value: 215, color: '#FFEB3B', percent: 7.4 },
            { name: '低产(<100kg/亩)', value: 47, color: '#FF5722', percent: 1.6 }
        ],
        historicalYield: {
            years: ['2021', '2022', '2023', '2024', '2025(预估)'],
            totalProduction: [485, 520, 498, 556, 612], // 吨
            averageYield: [158, 169, 162, 181, 199], // kg/亩
            accuracy: [null, null, null, 85.2, null]
        },
        currentOverview: {
            totalProduction: 612, // 吨
            averageYield: 199, // kg/亩
            comparisonLastYear: 10.1, // %
            comparisonThreeYearAvg: 16.5 // %
        },
        
        // 区域估产达成度数据
        achievementGauge: {
            estimatedYield: 612, // 预估总产量（吨）
            targetYield: 580, // 年度目标（吨）
            achievementRate: 105.5 // 完成率（%）
        },
        
        // 经济价值分析
        economicAnalysis: {
            totalValue: 428.4, // 预估总产值（万元）
            averageIncome: 1395, // 亩均收益（元/亩）
            costBenefitRatio: 3.12, // 成本收益率
            valueChange: 15.7, // 产值变化（%）
            incomeChange: 12.8, // 收益变化（%）
            ratioChange: 4.2, // 收益率变化（%）
            cropProfitBreakdown: [
                { name: '油菜主产区收益', value: 428.4, percent: 100 },
                { name: '油菜优质品种收益', value: 376.8, percent: 87.9 },
                { name: '油菜标准种植收益', value: 312.5, percent: 72.9 },
                { name: '油菜轮作收益', value: 268.4, percent: 62.6 }
            ]
        }
    };
    
    // 蔬菜产量数据
    yieldEstimationData.vegetable = {
        modelWeights: yieldEstimationData.wheat.modelWeights,
        yieldDistribution: [
            { name: '高产(>2200kg/亩)', value: 780, color: '#1565C0', percent: 26.8 },
            { name: '中高产(1800-2200kg/亩)', value: 1150, color: '#1976D2', percent: 39.5 },
            { name: '中产(1400-1800kg/亩)', value: 720, color: '#42A5F5', percent: 24.7 },
            { name: '中低产(1000-1400kg/亩)', value: 215, color: '#FFEB3B', percent: 7.4 },
            { name: '低产(<1000kg/亩)', value: 47, color: '#FF5722', percent: 1.6 }
        ],
        historicalYield: {
            years: ['2021', '2022', '2023', '2024', '2025(预估)'],
            totalProduction: [2450, 2680, 2555, 2850, 3125], // 吨
            averageYield: [1580, 1730, 1650, 1840, 2015], // kg/亩
            accuracy: [null, null, null, 85.6, null]
        },
        currentOverview: {
            totalProduction: 3125, // 吨
            averageYield: 2015, // kg/亩
            comparisonLastYear: 9.6, // %
            comparisonThreeYearAvg: 16.8 // %
        },
        
        // 区域估产达成度数据
        achievementGauge: {
            estimatedYield: 3125, // 预估总产量（吨）
            targetYield: 2800, // 年度目标（吨）
            achievementRate: 111.6 // 完成率（%）
        },
        
        // 经济价值分析
        economicAnalysis: {
            totalValue: 687.5, // 预估总产值（万元）
            averageIncome: 2235, // 亩均收益（元/亩）
            costBenefitRatio: 2.85, // 成本收益率
            valueChange: 18.4, // 产值变化（%）
            incomeChange: 14.6, // 收益变化（%）
            ratioChange: 3.7, // 收益率变化（%）
            cropProfitBreakdown: [
                { name: '蔬菜主产区收益', value: 687.5, percent: 100 },
                { name: '蔬菜大棚种植收益', value: 598.3, percent: 87.0 },
                { name: '蔬菜露地种植收益', value: 456.8, percent: 66.4 },
                { name: '蔬菜有机种植收益', value: 523.2, percent: 76.1 }
            ]
        }
    };
    
    // 马铃薯产量数据
    yieldEstimationData.potato = {
        modelWeights: yieldEstimationData.wheat.modelWeights,
        yieldDistribution: [
            { name: '高产(>2000kg/亩)', value: 620, color: '#1565C0', percent: 24.2 },
            { name: '中高产(1600-2000kg/亩)', value: 985, color: '#1976D2', percent: 38.5 },
            { name: '中产(1200-1600kg/亩)', value: 750, color: '#42A5F5', percent: 29.3 },
            { name: '中低产(800-1200kg/亩)', value: 165, color: '#FFEB3B', percent: 6.4 },
            { name: '低产(<800kg/亩)', value: 41, color: '#FF5722', percent: 1.6 }
        ],
        historicalYield: {
            years: ['2021', '2022', '2023', '2024', '2025(预估)'],
            totalProduction: [2180, 2350, 2280, 2520, 2785], // 吨
            averageYield: [1420, 1530, 1485, 1640, 1815], // kg/亩
            accuracy: [null, null, null, 83.4, null]
        },
        currentOverview: {
            totalProduction: 2785, // 吨
            averageYield: 1815, // kg/亩
            comparisonLastYear: 10.5, // %
            comparisonThreeYearAvg: 15.7 // %
        },
        
        // 区域估产达成度数据
        achievementGauge: {
            estimatedYield: 2785, // 预估总产量（吨）
            targetYield: 2500, // 年度目标（吨）
            achievementRate: 111.4 // 完成率（%）
        },
        
        // 经济价值分析
        economicAnalysis: {
            totalValue: 445.6, // 预估总产值（万元）
            averageIncome: 1455, // 亩均收益（元/亩）
            costBenefitRatio: 2.72, // 成本收益率
            valueChange: 13.2, // 产值变化（%）
            incomeChange: 10.8, // 收益变化（%）
            ratioChange: 2.5, // 收益率变化（%）
            cropProfitBreakdown: [
                { name: '马铃薯主产区收益', value: 445.6, percent: 100 },
                { name: '马铃薯优质种植收益', value: 389.2, percent: 87.3 },
                { name: '马铃薯标准种植收益', value: 334.8, percent: 75.1 },
                { name: '马铃薯加工型收益', value: 398.5, percent: 89.4 }
            ]
        }
    };
    
    // 其他作物产量数据
    yieldEstimationData.other = {
        modelWeights: yieldEstimationData.wheat.modelWeights,
        yieldDistribution: [
            { name: '高产(>1200kg/亩)', value: 380, color: '#1565C0', percent: 18.5 },
            { name: '中高产(900-1200kg/亩)', value: 680, color: '#1976D2', percent: 33.2 },
            { name: '中产(600-900kg/亩)', value: 720, color: '#42A5F5', percent: 35.1 },
            { name: '中低产(400-600kg/亩)', value: 215, color: '#FFEB3B', percent: 10.5 },
            { name: '低产(<400kg/亩)', value: 55, color: '#FF5722', percent: 2.7 }
        ],
        historicalYield: {
            years: ['2021', '2022', '2023', '2024', '2025(预估)'],
            totalProduction: [1680, 1820, 1750, 1950, 2110], // 吨
            averageYield: [785, 850, 818, 912, 987], // kg/亩
            accuracy: [null, null, null, 79.2, null]
        },
        currentOverview: {
            totalProduction: 2110, // 吨
            averageYield: 987, // kg/亩
            comparisonLastYear: 8.2, // %
            comparisonThreeYearAvg: 12.8 // %
        },
        
        // 区域估产达成度数据
        achievementGauge: {
            estimatedYield: 2110, // 预估总产量（吨）
            targetYield: 1950, // 年度目标（吨）
            achievementRate: 108.2 // 完成率（%）
        },
        
        // 经济价值分析
        economicAnalysis: {
            totalValue: 295.4, // 预估总产值（万元）
            averageIncome: 987, // 亩均收益（元/亩）
            costBenefitRatio: 1.95, // 成本收益率
            valueChange: 6.8, // 产值变化（%）
            incomeChange: 4.5, // 收益变化（%）
            ratioChange: -1.8, // 收益率变化（%）
            cropProfitBreakdown: [
                { name: '其他作物主产区收益', value: 295.4, percent: 100 },
                { name: '其他作物优质种植收益', value: 256.8, percent: 87.0 },
                { name: '其他作物标准种植收益', value: 218.5, percent: 74.0 },
                { name: '其他作物轮作收益', value: 189.2, percent: 64.1 }
            ]
        }
    };
}

/**
 * 初始化产量预估图表
 */
function initYieldEstimationCharts() {
    console.log('📈 初始化产量预估图表');
    
    try {
        // 右侧面板图表
        initTownYieldComparison();     // 1. 乡镇预估产量分析图表
        initTownValueChart();          // 2. 乡镇预产值分析图表

        // 初始化交互控件
        initDisasterCorrectionControls();
        
        // 初始化修正结果显示
        updateCorrectionResult();
        
        console.log('✅ 产量预估图表初始化完成');
    } catch (error) {
        console.error('❌ 产量预估图表初始化失败:', error);
    }
}

/**
 * 1. 初始化预估产量环形图
 */
function initYieldRingChart() {
    const chartElement = document.getElementById('yield-ring-chart');
    if (!chartElement) {
        console.warn('⚠️ 预估产量环形图容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    yieldEstimationCharts.yieldRing = chart;
    
    const data = [
        { name: '小麦', value: 1485, color: '#1976D2' },
        { name: '玉米', value: 2145, color: '#388E3C' },
        { name: '辣椒', value: 968, color: '#F57C00' },
        { name: '蔬菜', value: 645, color: '#7B1FA2' },
        { name: '马铃薯', value: 432, color: '#D32F2F' },
        { name: '其他', value: 285, color: '#616161' }
    ];
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#FFFFFF' },
            formatter: '{b}: {c}吨 ({d}%)'
        },
        legend: {
            show: false
        },
        series: [{
            name: '产量预估',
            type: 'pie',
            radius: ['35%', '75%'],
            center: ['50%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 4,
                borderColor: 'rgba(255, 255, 255, 0.2)',
                borderWidth: 2
            },
            label: {
                show: true,
                position: 'outside',
                color: '#FFFFFF',
                fontSize: 10,
                formatter: '{b}\n{d}%'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            data: data.map(item => ({
                name: item.name,
                value: item.value,
                itemStyle: { color: item.color }
            }))
        }]
    };
    
    chart.setOption(option);
}

/**
 * 2. 初始化区域估产达成度仪表盘
 */
function initAchievementGauge() {
    const chartElement = document.getElementById('achievement-gauge');
    if (!chartElement) {
        console.warn('⚠️ 达成度仪表盘容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    yieldEstimationCharts.achievementGauge = chart;
    
    const option = {
        backgroundColor: 'transparent',
        series: [{
            name: '达成度',
            type: 'gauge',
            center: ['50%', '60%'],
            radius: '80%',
            min: 0,
            max: 100,
            splitNumber: 10,
            axisLine: {
                lineStyle: {
                    width: 8,
                    color: [
                        [0.6, '#FF5722'],
                        [0.8, '#FFD700'],
                        [1, '#00FF88']
                    ]
                }
            },
            pointer: {
                itemStyle: {
                    color: '#00D4FF'
                }
            },
            axisTick: {
                distance: -8,
                length: 6,
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.6)',
                    width: 1
                }
            },
            splitLine: {
                distance: -12,
                length: 12,
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    width: 2
                }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10,
                distance: -20,
                formatter: '{value}%'
            },
            detail: {
                valueAnimation: true,
                formatter: '{value}%',
                color: '#00FF88',
                fontSize: 20,
                fontWeight: 'bold',
                offsetCenter: [0, '20%']
            },
            data: [{
                value: 82.3,
                name: '完成率'
            }]
        }]
    };
    
    chart.setOption(option);
}

/**
 * 3. 初始化乡镇预估产量分析图表
 */
function initTownYieldComparison() {
    const chartElement = document.getElementById('town-yield-chart');
    if (!chartElement) {
        console.warn('⚠️ 乡镇产量图表容器未找到');
        return;
    }

    const chart = echarts.init(chartElement);
    yieldEstimationCharts.townYieldComparison = chart;

    // 初始化时显示默认作物（小麦）的数据
    updateTownYieldComparisonChart();
}

/**
 * 更新乡镇产量对比图表
 */
function updateTownYieldComparisonChart() {
    // 根据当前图表类型选择显示方式
    if (currentChartType === 'table') {
        showTownYieldTable();
        return;
    }

    showTownYieldChart();
}

/**
 * 显示乡镇产量图表（折线图或饼图）
 */
function showTownYieldChart() {
    // 显示图表容器，隐藏表格容器
    const chartContainer = document.getElementById('town-yield-chart');
    const tableContainer = document.getElementById('town-yield-table');

    if (chartContainer) chartContainer.style.display = 'block';
    if (tableContainer) tableContainer.style.display = 'none';

    const chart = yieldEstimationCharts.townYieldComparison;
    if (!chart) {
        console.warn('⚠️ 乡镇产量图表未初始化');
        return;
    }
    
    // 获取当前选中作物的历史数据
    const currentData = yieldEstimationData[currentCrop]?.historicalYield;
    if (!currentData) {
        console.warn(`⚠️ 未找到作物 ${currentCrop} 的历史数据`);
        return;
    }
    
    // 作物名称映射
    const cropNames = {
        'wheat': '小麦',
        'corn': '玉米', 
        'rapeseed': '油菜',
        'vegetable': '蔬菜',
        'potato': '马铃薯',
        'other': '其他作物'
    };
    
    const cropName = cropNames[currentCrop] || currentCrop;
    
    // 构造实际产量数据（2025年为预估，没有实际值）
    const actualData = [...currentData.averageYield];
    actualData[actualData.length - 1] = null; // 最后一年是预估值，没有实际值
    
    // 预估数据（基于历史数据生成合理的预估值）
    const estimatedData = currentData.averageYield.map((value, index) => {
        if (index === actualData.length - 1) {
            // 最新年份使用修正后的预估值
            const correctedYield = getCorrectedEstimatedYield();
            return correctedYield !== null ? correctedYield : value;
        }
        // 历史年份的预估值（略有差异以显示预估准确性）
        return Math.round(value * (0.95 + Math.random() * 0.1));
    });
    
    // 根据图表类型设置series类型
    const seriesType = currentChartType === 'line' ? 'line' : 'bar';
    const barWidth = currentChartType === 'bar' ? '25%' : undefined;
    
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
                    if (param.value !== null) {
                        result += `${param.seriesName}: ${param.value}kg/亩<br/>`;
                    }
                });
                return result;
            }
        },
        legend: {
            data: [`${cropName}实际`, `${cropName}预估`],
            top: '5%',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10
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
            data: currentData.years,
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10
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
                name: `${cropName}实际`,
                type: seriesType,
                data: actualData,
                itemStyle: {
                    color: '#1976D2'
                },
                barWidth: barWidth,
                lineStyle: currentChartType === 'line' ? { color: '#1976D2', width: 2 } : undefined,
                symbol: currentChartType === 'line' ? 'circle' : undefined,
                symbolSize: currentChartType === 'line' ? 6 : undefined,
                connectNulls: false
            },
            {
                name: `${cropName}预估`,
                type: seriesType,
                data: estimatedData,
                itemStyle: {
                    color: 'rgba(25, 118, 210, 0.6)'
                },
                barWidth: barWidth,
                lineStyle: currentChartType === 'line' ? { color: 'rgba(25, 118, 210, 0.6)', width: 2, type: 'dashed' } : undefined,
                symbol: currentChartType === 'line' ? 'diamond' : undefined,
                symbolSize: currentChartType === 'line' ? 6 : undefined
            }
        ]
    };
    
    chart.setOption(option);
    console.log(`🔄 更新五年对比图表: ${cropName} (${currentChartType})`);
}

/**
 * 显示乡镇产量表格
 */
function showTownYieldTable() {
    // 显示表格容器，隐藏图表容器
    const chartContainer = document.getElementById('town-yield-chart');
    const tableContainer = document.getElementById('town-yield-table');

    if (chartContainer) chartContainer.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'block';
    
    // 获取当前选中作物的历史数据
    const currentData = yieldEstimationData[currentCrop]?.historicalYield;
    if (!currentData) {
        console.warn(`⚠️ 未找到作物 ${currentCrop} 的历史数据`);
        return;
    }
    
    // 作物名称映射
    const cropNames = {
        'wheat': '小麦',
        'corn': '玉米', 
        'rapeseed': '油菜',
        'vegetable': '蔬菜',
        'potato': '马铃薯',
        'other': '其他作物'
    };
    
    const cropName = cropNames[currentCrop] || currentCrop;
    
    // 构造实际产量数据
    const actualData = [...currentData.averageYield];
    actualData[actualData.length - 1] = null;
    
    // 预估数据
    const estimatedData = currentData.averageYield.map((value, index) => {
        if (index === actualData.length - 1) {
            // 最新年份使用修正后的预估值
            const correctedYield = getCorrectedEstimatedYield();
            return correctedYield !== null ? correctedYield : value;
        }
        return Math.round(value * (0.95 + Math.random() * 0.1));
    });
    
    // 生成表格HTML
    let tableHTML = `
        <table class="comparison-table">
            <thead>
                <tr>
                    <th>年份</th>
                    <th>${cropName}实际(kg/亩)</th>
                    <th>${cropName}预估(kg/亩)</th>
                    <th>预估误差</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    currentData.years.forEach((year, index) => {
        const actual = actualData[index];
        const estimated = estimatedData[index];
        const error = actual && estimated ? 
            `${Math.abs(((estimated - actual) / actual * 100)).toFixed(1)}%` : 
            '-';
        
        tableHTML += `
            <tr>
                <td class="year-col">${year}</td>
                <td class="actual-col">${actual !== null ? actual : '<span class="null-value">待测</span>'}</td>
                <td class="estimated-col">${estimated}</td>
                <td>${error}</td>
            </tr>
        `;
    });
    
    tableHTML += `
            </tbody>
        </table>
    `;
    
    tableContainer.innerHTML = tableHTML;
    console.log(`🔄 更新五年对比表格: ${cropName}`);
}

/**
 * 初始化灾害损失修正控件
 */
function initDisasterCorrectionControls() {
    const droughtSlider = document.getElementById('drought-loss');
    const heatSlider = document.getElementById('heat-loss');
    
    if (droughtSlider) {
        droughtSlider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            this.nextElementSibling.textContent = value.toFixed(1) + '%';
            updateCorrectionResult();
        });
    }
    
    if (heatSlider) {
        heatSlider.addEventListener('input', function() {
            const value = parseFloat(this.value);
            this.nextElementSibling.textContent = value.toFixed(1) + '%';
            updateCorrectionResult();
        });
    }
}

/**
 * 获取当前修正后的预估产量（以kg/亩为单位）
 */
function getCorrectedEstimatedYield() {
    const droughtLoss = parseFloat(document.getElementById('drought-loss')?.value || 5);
    const heatLoss = parseFloat(document.getElementById('heat-loss')?.value || 3);
    const totalLoss = droughtLoss + heatLoss;
    
    // 获取当前作物的原始预估产量（kg/亩）
    const currentData = yieldEstimationData[currentCrop]?.historicalYield;
    if (!currentData || !currentData.averageYield) return null;
    
    const originalYieldPerAcre = currentData.averageYield[currentData.averageYield.length - 1];
    return Math.round(originalYieldPerAcre * (1 - totalLoss / 100));
}

/**
 * 更新修正结果
 */
function updateCorrectionResult() {
    const droughtLoss = parseFloat(document.getElementById('drought-loss')?.value || 5);
    const heatLoss = parseFloat(document.getElementById('heat-loss')?.value || 3);
    const totalLoss = droughtLoss + heatLoss;
    
    const originalYield = 1485; // 吨
    const correctedYield = originalYield * (1 - totalLoss / 100);
    
    // 更新显示
    const correctedEl = document.querySelector('.result-value.corrected');
    const lossEl = document.querySelector('.result-value.loss');
    
    if (correctedEl) {
        correctedEl.textContent = Math.round(correctedYield) + '吨';
    }
    if (lossEl) {
        lossEl.textContent = totalLoss.toFixed(1) + '%';
    }
    
    // 更新仪表盘中的预估产量
    updateAchievementGauge();

    // 更新乡镇产量对比图表中的预估值
    updateTownYieldComparisonChart();

    // 更新经济价值分析卡
    updateEconomicAnalysisWithCorrection();
    
    console.log(`🔄 灾害修正更新: 损失率${totalLoss.toFixed(1)}%, 修正后产量${Math.round(correctedYield)}吨`);
}

/**
 * 原有的产量分布图表函数（保留以防需要）
 */
function initYieldDistributionChart() {
    const chartElement = document.getElementById('yield-distribution-chart');
    if (!chartElement) {
        console.warn('⚠️ 产量分布图表容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    yieldEstimationCharts.yieldDistribution = chart;
    
    const data = yieldEstimationData[currentCrop].yieldDistribution;
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#FFFFFF' },
            formatter: function(params) {
                const param = params[0];
                return `${param.name}<br/>面积: ${param.value} 亩<br/>占比: ${data[param.dataIndex].percent}%`;
            }
        },
        grid: {
            left: '15%',
            right: '10%',
            top: '10%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.name.split('(')[0]), // 只显示简化标签
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10,
                interval: 0,
                rotate: 15
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 212, 255, 0.2)',
                    type: 'dashed'
                }
            }
        },
        series: [{
            name: '面积',
            type: 'bar',
            data: data.map(item => ({
                value: item.value,
                itemStyle: {
                    color: item.color,
                    borderRadius: [4, 4, 0, 0]
                }
            })),
            barWidth: '60%',
            label: {
                show: true,
                position: 'top',
                color: '#FFFFFF',
                fontSize: 10,
                formatter: '{c}'
            }
        }]
    };
    
    chart.setOption(option);
}

/**
 * 2. 初始化历史产量对比趋势图
 */
function initHistoricalYieldChart() {
    const chartElement = document.getElementById('historical-yield-chart');
    if (!chartElement) {
        console.warn('⚠️ 历史产量图表容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    yieldEstimationCharts.historicalYield = chart;
    
    const data = yieldEstimationData[currentCrop].historicalYield;
    
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
                    if (param.seriesName === '总产量') {
                        result += `${param.seriesName}: ${param.value} 吨<br/>`;
                    } else {
                        result += `${param.seriesName}: ${param.value} kg/亩<br/>`;
                    }
                });
                return result;
            }
        },
        legend: {
            data: ['总产量', '平均单产'],
            top: '5%',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        grid: {
            left: '15%',
            right: '15%',
            top: '25%',
            bottom: '15%'
        },
        xAxis: {
            type: 'category',
            data: data.years,
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '总产量(吨)',
                position: 'left',
                axisLine: {
                    lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
                },
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 10
                },
                splitLine: {
                    lineStyle: {
                        color: 'rgba(0, 212, 255, 0.2)',
                        type: 'dashed'
                    }
                }
            },
            {
                type: 'value',
                name: '平均单产(kg/亩)',
                position: 'right',
                axisLine: {
                    lineStyle: { color: 'rgba(0, 255, 136, 0.5)' }
                },
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 10
                }
            }
        ],
        series: [
            {
                name: '总产量',
                type: 'bar',
                yAxisIndex: 0,
                data: data.totalProduction,
                itemStyle: {
                    color: '#1976D2',
                    borderRadius: [4, 4, 0, 0]
                },
                barWidth: '40%'
            },
            {
                name: '平均单产',
                type: 'line',
                yAxisIndex: 1,
                data: data.averageYield,
                smooth: true,
                lineStyle: {
                    color: '#00FF88',
                    width: 3
                },
                itemStyle: {
                    color: '#00FF88'
                },
                symbol: 'circle',
                symbolSize: 6
            }
        ]
    };
    
    chart.setOption(option);
}

/**
 * 更新产量概览数据
 */
function updateYieldOverview() {
    const overview = yieldEstimationData[currentCrop].currentOverview;
    
    // 更新总产量
    const productionValueEl = document.querySelector('.production-value');
    if (productionValueEl) {
        productionValueEl.textContent = overview.totalProduction.toLocaleString();
    }
    
    // 更新平均单产
    const yieldValueEl = document.querySelector('.yield-value');
    if (yieldValueEl) {
        yieldValueEl.textContent = overview.averageYield;
    }
    
    // 更新对比数据
    const comparisonEls = document.querySelectorAll('.comparison-value');
    if (comparisonEls[0]) {
        comparisonEls[0].textContent = `+${overview.comparisonLastYear}%`;
    }
    if (comparisonEls[1]) {
        comparisonEls[1].textContent = `+${overview.comparisonThreeYearAvg}%`;
    }
}

/**
 * 初始化交互功能
 */
function initYieldInteractions() {
    console.log('🔄 初始化产量预估交互功能');
    
    // 作物选择器 (左侧面板产量详情)
    const cropSelectorItems = document.querySelectorAll('.crop-selector-item');
    cropSelectorItems.forEach(item => {
        item.addEventListener('click', function() {
            const crop = this.dataset.crop;
            switchYieldCrop(crop);
            
            // 更新选中状态
            cropSelectorItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 添加选择动画效果
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // 作物选择按钮 (右侧面板 - 保留兼容性)
    const cropBtns = document.querySelectorAll('.crop-btn');
    cropBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const crop = this.dataset.crop;
            switchYieldCrop(crop);
            
            // 更新按钮状态
            cropBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 同步更新左侧选择器状态
            cropSelectorItems.forEach(i => {
                if (i.dataset.crop === crop) {
                    i.classList.add('active');
                } else {
                    i.classList.remove('active');
                }
            });
        });
    });
    
    // 图表类型切换按钮
    const switchBtns = document.querySelectorAll('.switch-btn');
    switchBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const type = this.dataset.type;
            switchChartType(type);
        });
    });
    
    // 页面功能切换处理
    initPageFunctionSwitchBar();
}

/**
 * 切换图表类型
 */
function switchChartType(type) {
    if (type === currentChartType) return;
    
    console.log(`🔄 切换图表类型: ${currentChartType} -> ${type}`);
    currentChartType = type;
    
    // 更新按钮状态
    const switchBtns = document.querySelectorAll('.switch-btn');
    switchBtns.forEach(btn => {
        if (btn.dataset.type === type) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // 更新显示
    updateTownYieldComparisonChart();
}

/**
 * 切换作物类型
 */
function switchYieldCrop(crop) {
    if (crop === currentCrop) return;
    
    // 作物名称映射
    const cropNames = {
        'wheat': '小麦',
        'corn': '玉米', 
        'rapeseed': '油菜',
        'vegetable': '蔬菜',
        'potato': '马铃薯',
        'other': '其他作物'
    };
    
    console.log(`🔄 切换到 ${cropNames[crop] || crop} 产量预估`);
    currentCrop = crop;
    
    // 更新图表数据
    if (yieldEstimationCharts.yieldDistribution) {
        const distributionData = yieldEstimationData[crop].yieldDistribution;
        const option = yieldEstimationCharts.yieldDistribution.getOption();
        option.xAxis[0].data = distributionData.map(item => item.name.split('(')[0]);
        option.series[0].data = distributionData.map(item => ({
            value: item.value,
            itemStyle: {
                color: item.color,
                borderRadius: [4, 4, 0, 0]
            }
        }));
        yieldEstimationCharts.yieldDistribution.setOption(option);
    }
    
    if (yieldEstimationCharts.historicalYield) {
        const historicalData = yieldEstimationData[crop].historicalYield;
        const option = yieldEstimationCharts.historicalYield.getOption();
        option.xAxis[0].data = historicalData.years;
        option.series[0].data = historicalData.totalProduction;
        option.series[1].data = historicalData.averageYield;
        yieldEstimationCharts.historicalYield.setOption(option);
    }
    
    // 更新概览数据
    updateYieldOverview();
    
    // 更新产量分级分布显示
    updateYieldGradeDisplay();
    
    // 更新左侧面板产量详情显示
    updateCropDetailsDisplay();
}

/**
 * 更新产量分级分布显示
 */
function updateYieldGradeDisplay() {
    const distributionData = yieldEstimationData[currentCrop].yieldDistribution;
    const gradeItems = document.querySelectorAll('.grade-item');
    
    gradeItems.forEach((item, index) => {
        if (distributionData[index]) {
            const data = distributionData[index];
            const areaEl = item.querySelector('.grade-area');
            const percentEl = item.querySelector('.grade-percent');
            const blocksEl = item.querySelector('.grade-blocks');
            
            if (areaEl) areaEl.textContent = `${data.value} 亩`;
            if (percentEl) percentEl.textContent = `${data.percent}%`;
            if (blocksEl) {
                // 模拟地块数量计算
                const blocks = Math.round(data.value / 10);
                blocksEl.textContent = `${blocks} 块`;
            }
        }
    });
}

/**
 * 切换产量图层显示
 */
function toggleYieldLayer(visible) {
    yieldLayerVisible = visible;
    console.log(`📈 产量图层: ${visible ? '显示' : '隐藏'}`);
    
    if (visible) {
        addYieldLayerToMap();
    } else {
        removeYieldLayerFromMap();
    }
}

/**
 * 添加产量图层到地图
 */
function addYieldLayerToMap() {
    if (!window.cesiumViewer) {
        console.warn('⚠️ Cesium viewer 未初始化');
        return;
    }
    
    console.log('🗺️ 添加产量预估图层到地图');
    
    // 这里可以添加实际的产量图层逻辑
    // 例如：产量分级颜色映射、地块产量可视化等
}

/**
 * 移除地图上的产量图层
 */
function removeYieldLayerFromMap() {
    if (!window.cesiumViewer) {
        return;
    }
    
    console.log('🗺️ 移除地图上的产量预估图层');
    
    // 这里可以添加移除产量图层的逻辑
}

/**
 * 更新左侧面板产量详情显示
 */
function updateCropDetailsDisplay() {
    console.log('🔄 更新作物产量详情显示');
    
    // 获取所有作物的产量数据
    const cropData = {
        wheat: { icon: '🌾', name: '小麦', yield: yieldEstimationData.wheat?.currentOverview?.averageYield || 485, confidence: '±8.2%' },
        corn: { icon: '🌽', name: '玉米', yield: yieldEstimationData.corn?.currentOverview?.averageYield || 628, confidence: '±6.5%' },
        rapeseed: { icon: '🌻', name: '油菜', yield: yieldEstimationData.rapeseed?.currentOverview?.averageYield || 199, confidence: '±11.8%' },
        vegetable: { icon: '🥬', name: '蔬菜', yield: yieldEstimationData.vegetable?.currentOverview?.averageYield || 1820, confidence: '±10.5%' },
        potato: { icon: '🥔', name: '马铃薯', yield: yieldEstimationData.potato?.currentOverview?.averageYield || 1650, confidence: '±9.8%' },
        other: { icon: '🌱', name: '其他', yield: yieldEstimationData.other?.currentOverview?.averageYield || 950, confidence: '±15.3%' }
    };
    
    // 更新每个作物项的显示数据
    Object.keys(cropData).forEach(cropType => {
        const cropElement = document.querySelector(`[data-crop="${cropType}"]`);
        if (cropElement) {
            const data = cropData[cropType];
            
            // 更新图标
            const iconElement = cropElement.querySelector('.crop-icon');
            if (iconElement) {
                iconElement.textContent = data.icon;
            }
            
            // 更新名称
            const nameElement = cropElement.querySelector('.crop-name');
            if (nameElement) {
                nameElement.textContent = data.name;
            }
            
            // 更新产量
            const yieldElement = cropElement.querySelector('.crop-yield');
            if (yieldElement) {
                yieldElement.textContent = `${Math.round(data.yield)}kg/亩`;
            }
            
            // 更新置信度范围
            const confidenceElement = cropElement.querySelector('.confidence-range');
            if (confidenceElement) {
                confidenceElement.textContent = data.confidence;
            }
            
            // 更新title提示
            cropElement.title = `点击查看${data.name}产量详情`;
        }
    });
    
    // 如果当前选中作物的数据有变化，添加高亮效果
    const currentCropElement = document.querySelector(`[data-crop="${currentCrop}"]`);
    if (currentCropElement) {
        currentCropElement.style.transform = 'scale(1.02)';
        setTimeout(() => {
            currentCropElement.style.transform = '';
        }, 300);
    }

    // 更新乡镇产量对比图表
    updateTownYieldComparisonChart();

    // 更新区域估产达成度仪表盘
    updateAchievementGauge();
    
    // 更新经济价值分析（带灾害修正）
    updateEconomicAnalysisWithCorrection();
}

/**
 * 更新区域估产达成度仪表盘
 */
function updateAchievementGauge() {
    console.log('🔄 更新区域估产达成度仪表盘');
    
    // 获取当前选中作物的达成度数据
    const gaugeData = yieldEstimationData[currentCrop]?.achievementGauge;
    if (!gaugeData) {
        console.warn(`⚠️ 未找到作物 ${currentCrop} 的达成度数据`);
        return;
    }
    
    // 计算修正后的预估产量（吨）
    const droughtLoss = parseFloat(document.getElementById('drought-loss')?.value || 5);
    const heatLoss = parseFloat(document.getElementById('heat-loss')?.value || 3);
    const totalLoss = droughtLoss + heatLoss;
    const correctedEstimatedYield = Math.round(gaugeData.estimatedYield * (1 - totalLoss / 100));
    
    // 计算修正后的达成率
    const correctedAchievementRate = (correctedEstimatedYield / gaugeData.targetYield * 100);
    
    // 更新预估产量
    const estimatedYieldEl = document.querySelector('.gauge-item:nth-child(1) .gauge-value');
    if (estimatedYieldEl) {
        estimatedYieldEl.textContent = `${correctedEstimatedYield}吨`;
    }
    
    // 更新年度目标
    const targetYieldEl = document.querySelector('.gauge-item:nth-child(2) .gauge-value');
    if (targetYieldEl) {
        targetYieldEl.textContent = `${gaugeData.targetYield}吨`;
    }
    
    // 更新进度条
    const progressValueEl = document.querySelector('.progress-value');
    const progressFillEl = document.querySelector('.progress-fill');
    if (progressValueEl) {
        progressValueEl.textContent = `${correctedAchievementRate.toFixed(1)}%`;
    }
    if (progressFillEl) {
        progressFillEl.style.width = `${correctedAchievementRate.toFixed(1)}%`;
    }
    
    console.log(`🔄 更新仪表盘: ${correctedAchievementRate.toFixed(1)}% 达成率 (修正后${correctedEstimatedYield}吨)`);
}

/**
 * 更新经济价值分析（带灾害损失修正）
 */
function updateEconomicAnalysisWithCorrection() {
    console.log('🔄 更新经济价值分析 - 带灾害修正');
    
    // 获取当前选中作物的经济数据
    const economicData = yieldEstimationData[currentCrop]?.economicAnalysis;
    if (!economicData) {
        console.warn(`⚠️ 未找到作物 ${currentCrop} 的经济数据`);
        return;
    }
    
    // 计算灾害损失修正系数
    const droughtLoss = parseFloat(document.getElementById('drought-loss')?.value || 5);
    const heatLoss = parseFloat(document.getElementById('heat-loss')?.value || 3);
    const totalLoss = droughtLoss + heatLoss;
    const correctionFactor = (1 - totalLoss / 100);
    
    // 修正后的经济数据
    const correctedTotalValue = economicData.totalValue * correctionFactor;
    const correctedAverageIncome = economicData.averageIncome * correctionFactor;
    // 成本收益率保持不变，因为成本和收益都会按比例调整
    const correctedCostBenefitRatio = economicData.costBenefitRatio;
    
    // 更新预估总产值
    const totalValueEl = document.querySelector('.econ-card:nth-child(1) .econ-value');
    if (totalValueEl) {
        totalValueEl.textContent = `${correctedTotalValue.toFixed(1)}万元`;
    }
    
    // 更新亩均收益
    const averageIncomeEl = document.querySelector('.econ-card:nth-child(2) .econ-value');
    if (averageIncomeEl) {
        averageIncomeEl.textContent = `${Math.round(correctedAverageIncome)}元/亩`;
    }
    
    // 更新成本收益率
    const costBenefitEl = document.querySelector('.econ-card:nth-child(3) .econ-value');
    if (costBenefitEl) {
        costBenefitEl.textContent = correctedCostBenefitRatio.toString();
    }
    
    // 更新变化率（显示相对于原始值的变化）
    const valueChangePercent = (correctionFactor - 1) * 100;
    const valueChangeEl = document.querySelector('.econ-card:nth-child(1) .econ-change');
    if (valueChangeEl) {
        valueChangeEl.textContent = `${valueChangePercent > 0 ? '+' : ''}${valueChangePercent.toFixed(1)}%`;
        valueChangeEl.className = `econ-change ${valueChangePercent >= 0 ? 'positive' : 'negative'}`;
    }
    
    const incomeChangeEl = document.querySelector('.econ-card:nth-child(2) .econ-change');
    if (incomeChangeEl) {
        incomeChangeEl.textContent = `${valueChangePercent > 0 ? '+' : ''}${valueChangePercent.toFixed(1)}%`;
        incomeChangeEl.className = `econ-change ${valueChangePercent >= 0 ? 'positive' : 'negative'}`;
    }
    
    const ratioChangeEl = document.querySelector('.econ-card:nth-child(3) .econ-change');
    if (ratioChangeEl) {
        // 收益率变化保持原有逻辑
        const change = economicData.ratioChange;
        ratioChangeEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
        ratioChangeEl.className = `econ-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
    
    // 更新收益分解 - 根据修正后的数值调整
    const profitContainer = document.querySelector('.profit-breakdown');
    if (profitContainer && economicData.cropProfitBreakdown.length > 0) {
        // 清空现有项目
        profitContainer.innerHTML = '';
        
        // 为每个收益项目创建元素，应用修正系数
        economicData.cropProfitBreakdown.forEach((breakdown) => {
            const correctedValue = breakdown.value * correctionFactor;
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';
            breakdownItem.innerHTML = `
                <span class="breakdown-label">${breakdown.name}</span>
                <span class="breakdown-value">${correctedValue.toFixed(1)}万元</span>
                <span class="breakdown-percent">${breakdown.percent}%</span>
            `;
            profitContainer.appendChild(breakdownItem);
        });
    }
    
    console.log(`🔄 更新经济分析(修正): ${correctedTotalValue.toFixed(1)}万元总产值, 损失率${totalLoss.toFixed(1)}%`);
}

/**
 * 更新经济价值分析（原始版本，不带修正）
 */
function updateEconomicAnalysis() {
    console.log('🔄 更新经济价值分析 - 当前作物:', currentCrop);
    
    // 获取当前选中作物的经济数据
    const economicData = yieldEstimationData[currentCrop]?.economicAnalysis;
    if (!economicData) {
        console.warn(`⚠️ 未找到作物 ${currentCrop} 的经济数据`);
        return;
    }
    
    // 更新预估总产值
    const totalValueEl = document.querySelector('.econ-card:nth-child(1) .econ-value');
    if (totalValueEl) {
        totalValueEl.textContent = `${economicData.totalValue}万元`;
    }
    
    // 更新亩均收益
    const averageIncomeEl = document.querySelector('.econ-card:nth-child(2) .econ-value');
    if (averageIncomeEl) {
        averageIncomeEl.textContent = `${economicData.averageIncome}元/亩`;
    }
    
    // 更新成本收益率
    const costBenefitEl = document.querySelector('.econ-card:nth-child(3) .econ-value');
    if (costBenefitEl) {
        costBenefitEl.textContent = economicData.costBenefitRatio.toString();
    }
    
    // 更新变化率
    const valueChangeEl = document.querySelector('.econ-card:nth-child(1) .econ-change');
    if (valueChangeEl) {
        const change = economicData.valueChange;
        valueChangeEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
        valueChangeEl.className = `econ-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
    
    const incomeChangeEl = document.querySelector('.econ-card:nth-child(2) .econ-change');
    if (incomeChangeEl) {
        const change = economicData.incomeChange;
        incomeChangeEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
        incomeChangeEl.className = `econ-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
    
    const ratioChangeEl = document.querySelector('.econ-card:nth-child(3) .econ-change');
    if (ratioChangeEl) {
        const change = economicData.ratioChange;
        ratioChangeEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
        ratioChangeEl.className = `econ-change ${change >= 0 ? 'positive' : 'negative'}`;
    }
    
    // 更新收益分解 - 动态显示当前作物相关收益
    const profitContainer = document.querySelector('.profit-breakdown');
    
    if (profitContainer && economicData.cropProfitBreakdown.length > 0) {
        // 清空现有项目
        profitContainer.innerHTML = '';
        
        // 为每个收益项目创建元素
        economicData.cropProfitBreakdown.forEach((breakdown) => {
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'breakdown-item';
            breakdownItem.innerHTML = `
                <span class="breakdown-label">${breakdown.name}</span>
                <span class="breakdown-value">${breakdown.value}万元</span>
                <span class="breakdown-percent">${breakdown.percent}%</span>
            `;
            profitContainer.appendChild(breakdownItem);
        });
    }
    
    console.log(`🔄 更新经济分析: ${economicData.totalValue}万元总产值`);
}



/**
 * 更新产量预估数据
 */
function updateYieldEstimationData() {
    console.log('🔄 更新产量预估数据');
    
    // 重新生成数据
    generateYieldEstimationData();
    
    // 更新图表
    Object.values(yieldEstimationCharts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
    
    // 更新显示
    updateYieldOverview();
    updateYieldGradeDisplay();
    updateCropDetailsDisplay();
}

/**
 * 响应式图表调整
 */
function resizeYieldEstimationCharts() {
    Object.values(yieldEstimationCharts).forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
}

// 窗口大小变化时调整图表
window.addEventListener('resize', resizeYieldEstimationCharts);

// 全局导出
window.YieldEstimation = {
    init: initYieldEstimation,
    toggleLayer: toggleYieldLayer,
    switchCrop: switchYieldCrop,
    updateData: updateYieldEstimationData,
    resize: resizeYieldEstimationCharts
};

// 自动初始化
initYieldEstimation();

/**
 * 页面功能切换处理（复制自main.js，确保产量预估页面也能正常跳转）
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
                // 在产量预估页面也需要作物选择功能
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

// ===== 乡镇预产值分析图表 =====

let townValueChart = null;
let currentTownValueChartType = 'combo'; // 当前图表类型：combo, pie, table

/**
 * 初始化乡镇预产值分析图表
 */
function initTownValueChart() {
    const chartElement = document.getElementById('town-value-chart');
    if (!chartElement) {
        console.warn('⚠️ 乡镇预产值图表容器未找到');
        return;
    }

    townValueChart = echarts.init(chartElement);

    // 初始化图表切换按钮事件
    initTownValueChartSwitchButtons();

    // 显示默认图表（产量产值组合图）
    updateTownValueChart();

    console.log('✅ 乡镇预产值图表初始化完成');
}

/**
 * 初始化图表切换按钮事件
 */
function initTownValueChartSwitchButtons() {
    const switchButtons = document.querySelectorAll('#town-value-title + .chart-switch-buttons .switch-btn');

    switchButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const chartType = this.getAttribute('data-type');

            // 更新按钮状态
            switchButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // 更新图表类型
            currentTownValueChartType = chartType;

            // 更新显示
            updateTownValueChart();
        });
    });
}

/**
 * 更新乡镇预产值图表
 */
function updateTownValueChart() {
    // 乡镇预产值数据
    const townValueData = [
        { name: '红台镇', yield: 456, price: 3.15, value: 143.6, percent: 33.5 },
        { name: '土桥镇', yield: 298, price: 3.12, value: 93.0, percent: 21.7 },
        { name: '漫路镇', yield: 268, price: 3.18, value: 85.2, percent: 19.9 },
        { name: '北塬镇', yield: 134, price: 3.10, value: 41.5, percent: 9.7 },
        { name: '关滩镇', yield: 112, price: 3.16, value: 35.4, percent: 8.3 },
        { name: '新集镇', yield: 98, price: 3.08, value: 30.2, percent: 7.0 }
    ];

    // 如果是表格模式，显示表格并隐藏图表
    if (currentTownValueChartType === 'table') {
        showTownValueTable();
        return;
    }

    // 显示图表并隐藏表格
    showTownValueChart();

    if (!townValueChart) return;

    let option = {};

    if (currentTownValueChartType === 'combo') {
        // 柱状图+折线图组合配置
        option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(0, 20, 40, 0.9)',
                borderColor: 'rgba(0, 212, 255, 0.5)',
                textStyle: { color: '#FFFFFF' },
                formatter: function(params) {
                    const data = townValueData[params[0].dataIndex];
                    return `${data.name}<br/>
                            预估产量: ${data.yield}吨<br/>
                            平均价格: ${data.price}元/kg<br/>
                            预产值: ${data.value}万元<br/>
                            占比: ${data.percent}%`;
                }
            },
            legend: {
                data: ['预估产量', '预产值'],
                top: '5%',
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 10
                }
            },
            grid: {
                left: '15%',
                right: '15%',
                top: '20%',
                bottom: '25%'
            },
            xAxis: {
                type: 'category',
                data: townValueData.map(item => item.name),
                axisLabel: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 9,
                    rotate: 45
                },
                axisLine: {
                    lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
                }
            },
            yAxis: [
                {
                    type: 'value',
                    name: '产量(吨)',
                    position: 'left',
                    nameTextStyle: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 10
                    },
                    axisLabel: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 9
                    },
                    axisLine: {
                        lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'rgba(0, 212, 255, 0.2)',
                            type: 'dashed'
                        }
                    }
                },
                {
                    type: 'value',
                    name: '产值(万元)',
                    position: 'right',
                    nameTextStyle: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 10
                    },
                    axisLabel: {
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 9
                    },
                    axisLine: {
                        lineStyle: { color: 'rgba(255, 215, 0, 0.5)' }
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            series: [
                {
                    name: '预估产量',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: townValueData.map(item => item.yield),
                    itemStyle: {
                        color: {
                            type: 'linear',
                            x: 0, y: 0, x2: 0, y2: 1,
                            colorStops: [
                                { offset: 0, color: '#00D4FF' },
                                { offset: 1, color: '#0099CC' }
                            ]
                        }
                    },
                    barWidth: '50%'
                },
                {
                    name: '预产值',
                    type: 'line',
                    yAxisIndex: 1,
                    data: townValueData.map(item => item.value),
                    smooth: true,
                    lineStyle: {
                        color: '#FFD700',
                        width: 3
                    },
                    itemStyle: {
                        color: '#FFD700',
                        borderWidth: 2,
                        borderColor: '#FFFFFF'
                    },
                    symbol: 'circle',
                    symbolSize: 6
                }
            ]
        };
    } else if (currentTownValueChartType === 'pie') {
        // 饼状图配置
        option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'item',
                backgroundColor: 'rgba(0, 20, 40, 0.9)',
                borderColor: 'rgba(0, 212, 255, 0.5)',
                textStyle: { color: '#FFFFFF' },
                formatter: function(params) {
                    const data = townValueData[params.dataIndex];
                    return `${data.name}<br/>
                            预估产量: ${data.yield}吨<br/>
                            平均价格: ${data.price}元/kg<br/>
                            预产值: ${data.value}万元<br/>
                            占比: ${data.percent}%`;
                }
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                top: 'center',
                textStyle: {
                    color: 'rgba(255, 255, 255, 0.8)',
                    fontSize: 9
                }
            },
            series: [{
                type: 'pie',
                radius: ['30%', '70%'],
                center: ['65%', '50%'],
                data: townValueData.map((item, index) => ({
                    value: item.value,
                    name: item.name,
                    itemStyle: {
                        color: [
                            '#FFD700', '#FF8C00', '#32CD32',
                            '#00CED1', '#9370DB', '#FF69B4'
                        ][index]
                    }
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                label: {
                    show: true,
                    fontSize: 9,
                    color: 'rgba(255, 255, 255, 0.8)',
                    formatter: '{b}\n{c}万元'
                }
            }]
        };
    }

    townValueChart.setOption(option, true);
}

/**
 * 显示乡镇产值图表
 */
function showTownValueChart() {
    const chartContainer = document.getElementById('town-value-chart');
    const tableContainer = document.getElementById('town-value-table');

    if (chartContainer) chartContainer.style.display = 'block';
    if (tableContainer) tableContainer.style.display = 'none';
}

/**
 * 显示乡镇产值表格
 */
function showTownValueTable() {
    const chartContainer = document.getElementById('town-value-chart');
    const tableContainer = document.getElementById('town-value-table');

    if (chartContainer) chartContainer.style.display = 'none';
    if (tableContainer) tableContainer.style.display = 'block';
}

// 页面加载完成后初始化功能切换
// 注意：main.js 中已经有统一的初始化，这里不需要重复初始化
// if (document.readyState === 'loading') {
//     document.addEventListener('DOMContentLoaded', initPageFunctionSwitchBar);
// } else {
//     initPageFunctionSwitchBar();
// }

// 页面加载完成后初始化时间轴
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // 初始化时间轴
        if (window.Timeline) {
            window.Timeline.init();
            console.log('⏰ 产量预估页面时间轴初始化完成');
        }
    }, 3000); // 等待其他模块初始化完成
});