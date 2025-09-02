/**
 * 数据看板图表组件
 * 负责初始化和管理所有ECharts图表
 */

// 全局图表实例
let townCropChart = null;
let trendComparisonChart = null;

// 当前选择的作物类型
let currentSelectedCrop = 'wheat';

// 当前选中的乡镇（默认为红台镇）
let currentSelectedTown = '红台镇';

// 当前显示模式：固定为长势比例模式
let currentChartMode = 'growth';

/**
 * 初始化所有数据看板图表
 */
function initDashboardCharts() {
    // 确保ECharts已加载
    if (typeof echarts === 'undefined') {
        console.error('❌ ECharts library not loaded');
        return;
    }

    console.log('📊 初始化数据看板图表...');

    // 根据页面类型初始化相应图表
    // 只在index.html页面初始化这些图表
    if (document.getElementById('town-crop-chart')) {
        initTownCropChart();
    }

    if (document.getElementById('growth-trend-comparison')) {
        initTrendComparisonChart();
    }

    console.log('✅ 数据看板图表初始化完成');
}

/**
 * 1. 初始化单作物按乡镇面积分布图表
 */
function initTownCropChart() {
    const container = document.getElementById('town-crop-chart');
    if (!container) {
    console.log('⚠️ 单作物按乡镇面积分布图表容器未找到');
        return;
    }

    // 创建图表实例
    townCropChart = echarts.init(container);

    // 初始化显示小麦数据
    window.updateTownCropChart('wheat');

    // 窗口大小改变时重新调整图表
    window.addEventListener('resize', function () {
        if (townCropChart) {
            townCropChart.resize();
        }
    });

    // 绑定切换按钮事件
    initTownCropSwitchButtons();

    // 添加图表点击事件
    townCropChart.on('click', function(params) {
        if (params.name) {
            const townName = params.name;
            console.log(`🖱️ 点击了乡镇: ${townName}`);
            
            // 更新长势趋势对比图表
            if (window.updateTrendComparisonChart) {
                window.updateTrendComparisonChart(townName);
            }
        }
    });

    console.log('✅ 单作物按乡镇面积分布图表初始化完成');
}

/**
 * 更新单作物按乡镇面积分布图表
 * 全局函数，供main.js调用
 */
window.updateTownCropChart = function(cropType) {
    console.log(`🔄 updateTownCropChart 被调用，作物类型: ${cropType}`);
    
    if (!townCropChart) {
        console.warn('⚠️ townCropChart 图表实例不存在');
        return;
    }

    currentSelectedCrop = cropType;
    console.log(`📝 当前选择的作物已更新为: ${cropType}`);

    // 临夏县各乡镇各作物数据
    const townCropData = {
        wheat: {
            name: '🌾 小麦',
            icon: '🌾',
            color: '#4CAF50',
            data: [456, 398, 268, 134, 312, 289, 198, 167],
            total: 2222,
            // 长势比例数据（优、良、中、差的比例，按乡镇）
            growth: {
                excellent: [182, 159, 107, 54, 125, 116, 79, 67], // 优：40%
                good: [137, 119, 80, 40, 94, 87, 59, 50],         // 良：30%
                fair: [91, 80, 54, 27, 62, 58, 40, 33],           // 中：20%
                poor: [46, 40, 27, 13, 31, 29, 20, 17]            // 差：10%
            }
        },
        corn: {
            name: '🌽 玉米',
            icon: '🌽',
            color: '#FFC107',
            data: [378, 298, 198, 112, 245, 189, 156, 123],
            total: 1699,
            growth: {
                excellent: [151, 119, 79, 45, 98, 76, 62, 49],   // 优：40%
                good: [113, 89, 59, 34, 74, 57, 47, 37],         // 良：30%
                fair: [76, 60, 40, 22, 49, 38, 31, 25],          // 中：20%
                poor: [38, 30, 20, 11, 25, 19, 16, 12]           // 差：10%
            }
        },
        pepper: {
            name: '🌶️ 辣椒',
            icon: '🌶️',
            color: '#FF5722',
            data: [156, 134, 98, 65, 89, 76, 54, 43],
            total: 715,
            growth: {
                excellent: [62, 54, 39, 26, 36, 30, 22, 17],     // 优：40%
                good: [47, 40, 29, 20, 27, 23, 16, 13],          // 良：30%
                fair: [31, 27, 20, 13, 18, 15, 11, 9],           // 中：20%
                poor: [16, 13, 10, 6, 9, 8, 5, 4]               // 差：10%
            }
        },
        vegetables: {
            name: '🥬 蔬菜',
            icon: '🥬',
            color: '#4CAF50',
            data: [89, 78, 67, 41, 56, 48, 34, 29],
            total: 442,
            growth: {
                excellent: [36, 31, 27, 16, 22, 19, 14, 12],     // 优：40%
                good: [27, 23, 20, 12, 17, 14, 10, 9],           // 良：30%
                fair: [18, 16, 13, 8, 11, 10, 7, 6],             // 中：20%
                poor: [8, 8, 7, 5, 6, 5, 3, 2]                  // 差：10%
            }
        },
        greenhouse: {
            name: '🏠 大棚',
            icon: '🏠',
            color: '#9E9E9E',
            data: [45, 38, 28, 15, 23, 19, 14, 12],
            total: 194,
            growth: {
                excellent: [18, 15, 11, 6, 9, 8, 6, 5],          // 优：40%
                good: [14, 11, 8, 5, 7, 6, 4, 4],               // 良：30%
                fair: [9, 8, 6, 3, 5, 4, 3, 2],                 // 中：20%
                poor: [4, 4, 3, 1, 2, 2, 1, 1]                  // 差：10%
            }
        }
    };

    const categories = ['红台镇', '土桥镇', '漫路镇', '北塬镇', '关滩镇', '新集镇', '麻尼寺沟镇', '韩集镇'];
    const currentCrop = townCropData[cropType] || townCropData.wheat;

    // 直接生成面积分布图表配置
    const option = generateAreaChartOption(currentCrop, categories);

    // 设置配置项和数据
    townCropChart.setOption(option, true); // true 表示合并配置

    // 更新标题
    const titleElement = document.getElementById('current-crop-title');
    if (titleElement) {
        titleElement.textContent = `${currentCrop.icon} ${currentCrop.name.replace(currentCrop.icon + ' ', '')}按乡镇面积分布`;
    }

    console.log(`✅ 已更新为${currentCrop.name}的乡镇面积分布数据`);
}

// 已移除长势分布图表配置函数，现在只使用面积分布模式

/**
 * 生成面积分布柱状图表配置
 */
function generateAreaChartOption(currentCrop, categories) {
    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            },
            appendToBody: true,
            className: 'chart-tooltip-popup',
            formatter: function (params) {
                const data = params[0];
                const percent = ((data.value / currentCrop.total) * 100).toFixed(1);
                return `${data.axisValue}<br/>面积: ${data.value} 亩 (${percent}%)`;
            }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '8%',
            top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 9,
                rotate: 30,
                interval: 0
            },
            axisLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.3)'
                }
            },
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10,
                formatter: '{value}亩'
            },
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255, 255, 255, 0.1)',
                    type: 'dashed'
                }
            }
        },
        series: [{
            name: '种植面积',
            type: 'bar',
            data: currentCrop.data,
            itemStyle: {
                color: {
                    type: 'linear',
                    x: 0, y: 0, x2: 0, y2: 1,
                    colorStops: [
                        { offset: 0, color: currentCrop.color },
                        { offset: 1, color: currentCrop.color + '88' }
                    ]
                },
                borderRadius: [4, 4, 0, 0]
            },
            emphasis: {
                itemStyle: {
                    color: currentCrop.color
                }
            },
            barWidth: '60%'
        }]
    };
}

/**
 * 更新单作物按乡镇长势分布表格
 */
function updateTownCropTable(cropType, cropData) {
    const columnHeader = document.getElementById('crop-column-header');
    const tbody = document.getElementById('town-crop-tbody');
    const totalElement = document.getElementById('crop-total');

    if (!columnHeader || !tbody || !totalElement) return;

    const categories = ['红台镇', '土桥镇', '漫路镇', '北塬镇', '关滩镇', '新集镇', '麻尼寺沟镇', '韩集镇'];

    // 计算合计数据
    const totalExcellent = cropData.growth.excellent.reduce((a, b) => a + b, 0);
    const totalGood = cropData.growth.good.reduce((a, b) => a + b, 0);
    const totalFair = cropData.growth.fair.reduce((a, b) => a + b, 0);
    const totalPoor = cropData.growth.poor.reduce((a, b) => a + b, 0);
    
    // 更新固定的合计行
    const stickyTotalRow = document.querySelector('.sticky-total');
    if (stickyTotalRow) {
        stickyTotalRow.innerHTML = `
            <td><strong>合计</strong></td>
            <td><strong>${totalExcellent}</strong></td>
            <td><strong>${totalGood}</strong></td>
            <td><strong>${totalFair}</strong></td>
            <td><strong>${totalPoor}</strong></td>
            <td><strong>${cropData.total}</strong></td>
        `;
    }

    // 生成乡镇数据行
    let tableHTML = '';
    categories.forEach((town, index) => {
        const excellent = cropData.growth.excellent[index];
        const good = cropData.growth.good[index];
        const fair = cropData.growth.fair[index];
        const poor = cropData.growth.poor[index];
        const townTotal = excellent + good + fair + poor;
        
        tableHTML += `
            <tr>
                <td>${town}</td>
                <td>${excellent}</td>
                <td>${good}</td>
                <td>${fair}</td>
                <td>${poor}</td>
                <td>${townTotal}</td>
            </tr>
        `;
    });

    tbody.innerHTML = tableHTML;
}

/**
 * 初始化按乡镇作物面积分布切换按钮事件
 * 注意：已移除表格切换功能，只保留柱状图显示
 */
function initTownCropSwitchButtons() {
    // 精确选择包含按乡镇面积分布的卡片
    const cards = document.querySelectorAll('.stat-card');
    let townCropCard = null;
    
    // 查找包含"按乡镇面积分布"标题的卡片
    cards.forEach(card => {
        const header = card.querySelector('.stat-header');
        if (header && header.textContent.includes('按乡镇面积分布')) {
            townCropCard = card;
        }
    });
    
    if (!townCropCard) {
        console.log('📊 单作物按乡镇面积分布卡片已优化为柱状图模式');
        return;
    }

    const chartContainer = document.getElementById('town-crop-chart');
    if (chartContainer) {
        // 确保柱状图始终显示
        chartContainer.style.display = 'block';
        console.log('📊 柱状图显示已固定启用');
    }
}

// 移除了图表模式切换功能，现在固定为面积分布模式

// 如果页面已经加载完成，立即初始化图表
/**
 * 种植面积变化趋势图（从长势分析改为面积分析）
 */
function initTrendComparisonChart() {
    const chartElement = document.getElementById('growth-trend-comparison');
    if (!chartElement) {
        console.warn('⚠️ 种植面积趋势对比图容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    trendComparisonChart = chart;
    
    // 生成12个月份的面积数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    
    // 全县总面积数据（亩）
    const totalAreaData = [
        2800,  // 1月 - 冬季休耕
        2950,  // 2月 - 春耕准备
        3200,  // 3月 - 春播开始
        3850,  // 4月 - 春播高峰
        4200,  // 5月 - 夏播开始
        4500,  // 6月 - 夏播高峰
        4650,  // 7月 - 种植面积峰值
        4500,  // 8月 - 部分作物收获
        4100,  // 9月 - 秋收开始
        3500,  // 10月 - 秋收高峰
        3000,  // 11月 - 秋收尾声
        2800   // 12月 - 冬季休耕
    ];
    
    // 选中乡镇面积数据（默认为红台镇）
    const townAreaData = [
        320,   // 1月
        340,   // 2月
        380,   // 3月
        450,   // 4月
        480,   // 5月
        520,   // 6月
        540,   // 7月
        520,   // 8月
        470,   // 9月
        400,   // 10月
        350,   // 11月
        320    // 12月
    ];
    
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 20, 40, 0.9)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#FFFFFF' },
            appendToBody: true,
            formatter: function(params) {
                let result = `${params[0].name}<br/>`;
                params.forEach(param => {
                    result += `${param.seriesName}: ${param.value} 亩<br/>`;
                });
                if (params.length > 1) {
                    const diff = params[0].value - params[1].value;
                    const diffPercent = ((diff / params[1].value) * 100).toFixed(1);
                    result += `差值: ${diff} 亩 (${diffPercent}%)`;
                }
                return result;
            }
        },
        legend: {
            data: ['全县总面积', `${currentSelectedTown}面积`],
            top: '3%',
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
            data: months,
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
            name: '种植面积（亩）',
            nameTextStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 10
            },
            axisLine: {
                lineStyle: { color: 'rgba(0, 212, 255, 0.5)' }
            },
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11,
                formatter: '{value}亩'
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
                name: '全县总面积',
                type: 'line',
                data: totalAreaData,
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
                }
            },
            {
                name: `${currentSelectedTown}面积`,
                type: 'line',
                data: townAreaData,
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
    
    // 窗口大小改变时重新调整图表
    window.addEventListener('resize', function() {
        if (chart) {
            chart.resize();
        }
    });
    
    console.log('✅ 种植面积变化趋势图初始化完成');
}

/**
 * 更新种植面积趋势对比图表
 * @param {string} townName - 选中的乡镇名称
 */
function updateTrendComparisonChart(townName) {
    if (!trendComparisonChart) {
        console.warn('⚠️ 种植面积趋势对比图表未初始化');
        return;
    }
    
    currentSelectedTown = townName;
    
    // 12个月份数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    
    // 不同乡镇的种植面积数据（亩）
    const townAreaData = {
        '红台镇': [320, 340, 380, 450, 480, 520, 540, 520, 470, 400, 350, 320],
        '土桥镇': [280, 300, 340, 400, 430, 460, 480, 460, 420, 360, 310, 280],
        '漫路镇': [200, 220, 250, 290, 320, 350, 370, 350, 320, 270, 230, 200],
        '北塬镇': [100, 110, 130, 150, 170, 180, 190, 180, 160, 140, 120, 100],
        '关滩镇': [250, 270, 300, 350, 380, 410, 430, 410, 370, 320, 280, 250],
        '新集镇': [230, 250, 280, 330, 360, 390, 410, 390, 350, 300, 260, 230],
        '麻尼寺沟镇': [150, 170, 190, 220, 240, 260, 280, 260, 240, 200, 170, 150],
        '韩集镇': [130, 140, 160, 190, 210, 230, 250, 230, 210, 180, 150, 130]
    };
    
    // 全县总面积数据（亩）
    const totalAreaData = [2800, 2950, 3200, 3850, 4200, 4500, 4650, 4500, 4100, 3500, 3000, 2800];
    
    // 获取选中乡镇的数据
    const selectedTownData = townAreaData[townName] || townAreaData['红台镇'];
    
    const option = {
        legend: {
            data: ['全县总面积', `${townName}面积`],
            top: '3%',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        series: [
            {
                name: '全县总面积',
                data: totalAreaData
            },
            {
                name: `${townName}面积`,
                data: selectedTownData
            }
        ]
    };
    
    trendComparisonChart.setOption(option);
    console.log(`✅ 种植面积趋势图已更新为: ${townName}`);
}

// 将更新函数暴露到全局
window.updateTrendComparisonChart = updateTrendComparisonChart;

// ===== 页面加载后自动初始化 =====
if (document.readyState === 'complete') {
    // 延迟一下确保DOM完全准备好
    setTimeout(initDashboardCharts, 500);
} else {
    // 否则等待页面加载完成
    window.addEventListener('load', function() {
        setTimeout(initDashboardCharts, 500);
    });
}