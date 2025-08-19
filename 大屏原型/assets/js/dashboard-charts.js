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
 * 1. 初始化单作物按乡镇长势分布图表
 */
function initTownCropChart() {
    const container = document.getElementById('town-crop-chart');
    if (!container) {
        console.warn('⚠️ 单作物按乡镇长势分布图表容器未找到');
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

    console.log('✅ 单作物按乡镇长势分布图表初始化完成');
}

/**
 * 更新单作物按乡镇长势分布图表
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

    // 直接生成长势分布图表配置
    const option = generateGrowthChartOption(currentCrop, categories);

    // 设置配置项和数据
    townCropChart.setOption(option, true); // true 表示合并配置

    // 更新标题
    const titleElement = document.getElementById('current-crop-title');
    if (titleElement) {
        titleElement.textContent = `${currentCrop.icon} ${currentCrop.name.replace(currentCrop.icon + ' ', '')}按乡镇长势分布`;
    }

    // 更新表格
    updateTownCropTable(cropType, currentCrop);

    console.log(`✅ 已更新为${currentCrop.name}的乡镇长势分布数据`);
}

// 已移除面积分布图表配置函数，现在只使用长势分布模式

/**
 * 生成长势比例堆叠图表配置
 */
function generateGrowthChartOption(currentCrop, categories) {
    const growthColors = {
        excellent: '#4CAF50', // 绿色 - 优
        good: '#8BC34A',      // 浅绿 - 良
        fair: '#FFC107',      // 黄色 - 中
        poor: '#FF5722'       // 红色 - 差
    };

    // 计算各分类总值
    const totalExcellent = currentCrop.growth.excellent.reduce((a, b) => a + b, 0);
    const totalGood = currentCrop.growth.good.reduce((a, b) => a + b, 0);
    const totalFair = currentCrop.growth.fair.reduce((a, b) => a + b, 0);
    const totalPoor = currentCrop.growth.poor.reduce((a, b) => a + b, 0);

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
                let result = `${params[0].axisValue}<br/>`;
                let total = 0;
                params.forEach(item => {
                    total += item.value;
                });
                params.forEach(item => {
                    const percent = ((item.value / total) * 100).toFixed(1);
                    result += `${item.marker} ${item.seriesName}: ${item.value} 亩 (${percent}%)<br/>`;
                });
                result += `总计: ${total} 亩`;
                return result;
            }
        },
        legend: {
            data: ['优', '良', '中', '差'],
            formatter: function(name) {
                const valueMap = {
                    '优': totalExcellent,
                    '良': totalGood,
                    '中': totalFair,
                    '差': totalPoor
                };
                return `${name} (${valueMap[name]})`;
            },
            textStyle: {
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: 9
            },
            top: 5,
            itemGap: 8,
            itemWidth: 12,
            itemHeight: 8
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '8%',
            top: '20%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: categories,
            axisLabel: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 7,
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
        series: [
            {
                name: '优',
                type: 'bar',
                stack: 'growth',
                data: currentCrop.growth.excellent,
                itemStyle: {
                    color: growthColors.excellent
                },
                barWidth: '50%'
            },
            {
                name: '良',
                type: 'bar',
                stack: 'growth',
                data: currentCrop.growth.good,
                itemStyle: {
                    color: growthColors.good
                }
            },
            {
                name: '中',
                type: 'bar',
                stack: 'growth',
                data: currentCrop.growth.fair,
                itemStyle: {
                    color: growthColors.fair
                }
            },
            {
                name: '差',
                type: 'bar',
                stack: 'growth',
                data: currentCrop.growth.poor,
                itemStyle: {
                    color: growthColors.poor
                }
            }
        ]
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
 * 初始化按乡镇作物长势分布切换按钮事件
 */
function initTownCropSwitchButtons() {
    // 精确选择包含按乡镇长势分布的卡片
    const cards = document.querySelectorAll('.stat-card');
    let townCropCard = null;
    
    // 查找包含"按乡镇长势分布"标题的卡片
    cards.forEach(card => {
        const header = card.querySelector('.stat-header');
        if (header && header.textContent.includes('按乡镇长势分布')) {
            townCropCard = card;
        }
    });
    
    if (!townCropCard) return;

    const switchButtons = townCropCard.querySelectorAll('.chart-switch-buttons .switch-btn');
    const chartContainer = document.getElementById('town-crop-chart');
    const tableContainer = document.getElementById('town-crop-table');

    if (!switchButtons.length || !chartContainer || !tableContainer) return;

    switchButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有active状态
            switchButtons.forEach(b => b.classList.remove('active'));
            // 设置当前按钮为active
            this.classList.add('active');

            const type = this.dataset.type;
            
            if (type === 'bar') {
                // 显示柱状图，隐藏表格
                chartContainer.style.display = 'block';
                tableContainer.style.display = 'none';
                console.log('🏘️ 切换到柱状图视图');
            } else if (type === 'table') {
                // 显示表格，隐藏柱状图
                chartContainer.style.display = 'none';
                tableContainer.style.display = 'block';
                console.log('🏘️ 切换到表格视图');
            }
        });
    });
}

// 移除了图表模式切换功能，现在固定为长势分布模式

// 如果页面已经加载完成，立即初始化图表
/**
 * 长势指数变化趋势图（从growth-analysis.js移植）
 */
function initTrendComparisonChart() {
    const chartElement = document.getElementById('growth-trend-comparison');
    if (!chartElement) {
        console.warn('⚠️ 长势趋势对比图容器未找到');
        return;
    }
    
    const chart = echarts.init(chartElement);
    trendComparisonChart = chart;
    
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
        
        // 选中乡镇的长势指数（基于当前选择的乡镇，默认为红台镇）
        const townBase = 0.62 + Math.sin(i / 30 * Math.PI) * 0.13;
        historicalAverage.push((townBase + Math.random() * 0.08 - 0.04).toFixed(3));
    }
    
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
                    result += `${param.seriesName}: ${param.value}<br/>`;
                });
                const diff = (parseFloat(params[0].value) - parseFloat(params[1].value)).toFixed(3);
                const diffPercent = ((diff / parseFloat(params[1].value)) * 100).toFixed(1);
                result += `差值: ${diff} (${diffPercent}%)`;
                return result;
            }
        },
        legend: {
            data: ['2025年长势指数', `${currentSelectedTown}长势指数`],
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
                name: `${currentSelectedTown}长势指数`,
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
    
    // 窗口大小改变时重新调整图表
    window.addEventListener('resize', function() {
        if (chart) {
            chart.resize();
        }
    });
    
    console.log('✅ 长势指数变化趋势图初始化完成');
}

/**
 * 更新长势趋势对比图表
 * @param {string} townName - 选中的乡镇名称
 */
function updateTrendComparisonChart(townName) {
    if (!trendComparisonChart) {
        console.warn('⚠️ 长势趋势对比图表未初始化');
        return;
    }
    
    currentSelectedTown = townName;
    
    // 生成30天数据
    const dates = [];
    const currentYear = [];
    const selectedTownData = [];
    
    // 不同乡镇的基础长势系数
    const townBaseValues = {
        '红台镇': 0.62,
        '土桥镇': 0.58,
        '漫路镇': 0.55,
        '北塬镇': 0.52,
        '关滩镇': 0.60,
        '新集镇': 0.59,
        '麻尼寺沟镇': 0.56,
        '韩集镇': 0.54
    };
    
    const townBase = townBaseValues[townName] || 0.58;
    
    for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - 29 + i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }));
        
        // 当前年份数据（有季节性变化）
        const baseValue = 0.65 + Math.sin(i / 30 * Math.PI) * 0.15;
        currentYear.push((baseValue + Math.random() * 0.1 - 0.05).toFixed(3));
        
        // 选中乡镇的长势指数
        const townValue = townBase + Math.sin(i / 30 * Math.PI) * 0.13;
        selectedTownData.push((townValue + Math.random() * 0.08 - 0.04).toFixed(3));
    }
    
    const option = {
        legend: {
            data: ['2025年长势指数', `${townName}长势指数`],
            top: '5%',
            textStyle: {
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: 11
            }
        },
        series: [
            {
                name: '2025年长势指数',
                data: currentYear
            },
            {
                name: `${townName}长势指数`,
                data: selectedTownData
            }
        ]
    };
    
    trendComparisonChart.setOption(option);
    console.log(`✅ 长势趋势图已更新为: ${townName}`);
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