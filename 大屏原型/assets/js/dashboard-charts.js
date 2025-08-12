/**
 * 数据看板图表组件
 * 负责初始化和管理所有ECharts图表
 */

// 全局图表实例
let cropAreaPieChart = null;
let plantingComparisonChart = null;
let cropSankeyChart = null;

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

    // 初始化各个图表
    initCropAreaPieChart();
    initPlantingComparisonChart();
    initCropSankeyChart();

    console.log('✅ 数据看板图表初始化完成');
}

/**
 * 1. 初始化作物面积环形图
 */
function initCropAreaPieChart() {
    const container = document.getElementById('crop-area-pie');
    if (!container) {
        console.warn('⚠️ 作物面积环形图容器未找到');
        return;
    }

    // 创建图表实例
    cropAreaPieChart = echarts.init(container);

    // 配置选项
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} 亩 ({d}%)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            }
        },
        legend: {
            show: false
        },
        series: [
            {
                name: '作物面积分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['50%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5,
                    borderColor: 'rgba(0, 0, 0, 0.3)',
                    borderWidth: 2
                },
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#ffffff'
                    },
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 212, 255, 0.5)'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    { 
                        value: 1256, 
                        name: '小麦',
                        itemStyle: { color: '#4CAF50' }
                    },
                    { 
                        value: 986, 
                        name: '玉米',
                        itemStyle: { color: '#FFC107' }
                    },
                    { 
                        value: 453, 
                        name: '辣椒',
                        itemStyle: { color: '#FF5722' }
                    },
                    { 
                        value: 275, 
                        name: '其他',
                        itemStyle: { color: '#00BCD4' }
                    }
                ],
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return Math.random() * 200;
                }
            }
        ]
    };

    // 设置配置项并渲染图表
    cropAreaPieChart.setOption(option);

    // 添加点击事件
    cropAreaPieChart.on('click', function (params) {
        console.log('点击了作物:', params.name, '面积:', params.value, '亩');
        // 这里可以添加筛选功能
    });
}

/**
 * 2. 初始化种植结构对比柱状图
 */
function initPlantingComparisonChart() {
    const container = document.getElementById('planting-comparison-chart');
    if (!container) {
        console.warn('⚠️ 种植结构对比图容器未找到');
        return;
    }

    // 创建图表实例
    plantingComparisonChart = echarts.init(container);
    
    // 初始化为柱状图
    updatePlantingChart('bar');

    // 图表切换事件监听
    initChartSwitchEvents();
}

/**
 * 3. 初始化作物轮作桑基图
 */
function initCropSankeyChart() {
    const container = document.getElementById('crop-sankey-chart');
    if (!container) {
        console.warn('⚠️ 作物轮作桑基图容器未找到');
        return;
    }

    // 创建图表实例
    cropSankeyChart = echarts.init(container);

    // 配置选项
    const option = {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: {
                color: '#ffffff',
                fontSize: 12
            }
        },
        series: [
            {
                type: 'sankey',
                layout: 'none',
                emphasis: {
                    focus: 'adjacency'
                },
                nodeAlign: 'left',
                nodeGap: 15,
                nodeWidth: 18,
                layoutIterations: 32,
                data: [
                    {
                        name: '油菜',
                        x: 50,
                        y: 40,
                        itemStyle: { color: '#FFEB3B' }
                    },
                    {
                        name: '小麦',
                        x: 50,
                        y: 80,
                        itemStyle: { color: '#4CAF50' }
                    },
                    {
                        name: '辣椒',
                        x: 50,
                        y: 120,
                        itemStyle: { color: '#FF5722' }
                    },
                    {
                        name: '娃娃菜',
                        x: 250,
                        y: 40,
                        itemStyle: { color: '#8BC34A' }
                    },
                    {
                        name: '玉米',
                        x: 250,
                        y: 80,
                        itemStyle: { color: '#FFC107' }
                    },
                    {
                        name: '小麦_2',
                        x: 250,
                        y: 120,
                        itemStyle: { color: '#4CAF50' }
                    }
                ],
                links: [
                    {
                        source: '油菜',
                        target: '娃娃菜',
                        value: 45,
                        lineStyle: {
                            color: 'rgba(255, 235, 59, 0.8)',
                            curveness: 0.5
                        }
                    },
                    {
                        source: '小麦',
                        target: '玉米',
                        value: 38,
                        lineStyle: {
                            color: 'rgba(76, 175, 80, 0.8)',
                            curveness: 0.5
                        }
                    },
                    {
                        source: '辣椒',
                        target: '小麦_2',
                        value: 28,
                        lineStyle: {
                            color: 'rgba(255, 87, 34, 0.8)',
                            curveness: 0.5
                        }
                    }
                ],
                edgeLabel: {
                    show: true,
                    fontSize: 11,
                    color: '#ffffff',
                    fontWeight: 'bold',
                    formatter: function(params) {
                        return params.value + '%';
                    }
                },
                label: {
                    show: true,
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: 11,
                    fontWeight: 'bold'
                },
                lineStyle: {
                    color: 'gradient',
                    curveness: 0.5
                }
            }
        ],
        animationDuration: 1500,
        animationEasing: 'cubicInOut'
    };

    // 设置配置项并渲染图表
    cropSankeyChart.setOption(option);
}

/**
 * 响应式调整图表大小
 */
function resizeDashboardCharts() {
    if (cropAreaPieChart) {
        cropAreaPieChart.resize();
    }
    if (plantingComparisonChart) {
        plantingComparisonChart.resize();
    }
    if (cropSankeyChart) {
        cropSankeyChart.resize();
    }
}

/**
 * 销毁所有图表实例
 */
function disposeDashboardCharts() {
    if (cropAreaPieChart) {
        cropAreaPieChart.dispose();
        cropAreaPieChart = null;
    }
    if (plantingComparisonChart) {
        plantingComparisonChart.dispose();
        plantingComparisonChart = null;
    }
    if (cropSankeyChart) {
        cropSankeyChart.dispose();
        cropSankeyChart = null;
    }
}

// 窗口大小改变时重新调整图表大小
window.addEventListener('resize', function() {
    setTimeout(resizeDashboardCharts, 100);
});

// 页面卸载时清理图表
window.addEventListener('beforeunload', function() {
    disposeDashboardCharts();
});

/**
 * 种植结构数据
 */
const plantingData = {
    categories: ['玉米', '小麦', '辣椒', '其他'],
    data2022: [1200, 980, 650, 285],
    data2023: [1280, 1020, 640, 270],
    data2024: [1344, 1058, 631, 275],
    colors: ['#FFC107', '#4CAF50', '#FF5722', '#9E9E9E']
};

/**
 * 更新种植结构图表
 */
function updatePlantingChart(type) {
    if (!plantingComparisonChart) return;
    
    const chartContainer = document.getElementById('planting-comparison-chart');
    const tableContainer = document.getElementById('planting-comparison-table');
    
    if (type === 'table') {
        // 显示表格，隐藏图表
        chartContainer.style.display = 'none';
        tableContainer.style.display = 'block';
        return;
    } else {
        // 显示图表，隐藏表格
        chartContainer.style.display = 'block';
        tableContainer.style.display = 'none';
    }
    
    let option;
    
    if (type === 'bar') {
        option = getBarChartOption();
    } else if (type === 'line') {
        option = getLineChartOption();
    }
    
    plantingComparisonChart.setOption(option, true);
}

/**
 * 获取柱状图配置
 */
function getBarChartOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#ffffff', fontSize: 12 },
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(function(item) {
                    result += item.seriesName + ': ' + item.value + ' 亩<br/>';
                });
                return result;
            }
        },
        legend: {
            data: ['2022年', '2023年', '2024年'],
            textStyle: { color: '#ffffff', fontSize: 11 },
            top: 10
        },
        grid: {
            left: '15%', right: '10%', bottom: '15%', top: '25%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        yAxis: {
            type: 'category',
            data: plantingData.categories.slice().reverse(),
            axisLabel: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 11 },
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
        },
        series: [
            {
                name: '2022年', type: 'bar',
                data: plantingData.data2022.slice().reverse(),
                itemStyle: { color: 'rgba(255, 255, 255, 0.4)', borderRadius: [0, 3, 3, 0] }
            },
            {
                name: '2023年', type: 'bar',
                data: plantingData.data2023.slice().reverse(),
                itemStyle: { color: 'rgba(0, 212, 255, 0.6)', borderRadius: [0, 3, 3, 0] }
            },
            {
                name: '2024年', type: 'bar',
                data: plantingData.data2024.slice().reverse(),
                itemStyle: { color: '#00d4ff', borderRadius: [0, 3, 3, 0] }
            }
        ],
        animationDuration: 1000,
        animationEasing: 'cubicOut'
    };
}

/**
 * 获取折线图配置
 */
function getLineChartOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: 'rgba(0, 212, 255, 0.5)',
            textStyle: { color: '#ffffff', fontSize: 12 }
        },
        legend: {
            data: plantingData.categories,
            textStyle: { color: '#ffffff', fontSize: 11 },
            top: 10
        },
        grid: {
            left: '10%', right: '10%', bottom: '15%', top: '25%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['2022年', '2023年', '2024年'],
            axisLabel: { color: 'rgba(255, 255, 255, 0.9)', fontSize: 11 },
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 10 },
            axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
            splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
        },
        series: plantingData.categories.map((crop, index) => ({
            name: crop,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 6,
            data: [
                plantingData.data2022[index],
                plantingData.data2023[index],
                plantingData.data2024[index]
            ],
            itemStyle: { color: plantingData.colors[index] },
            lineStyle: { color: plantingData.colors[index], width: 2 }
        })),
        animationDuration: 1000,
        animationEasing: 'cubicOut'
    };
}

/**
 * 初始化图表切换事件
 */
function initChartSwitchEvents() {
    const switchButtons = document.querySelectorAll('.switch-btn');
    
    switchButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            switchButtons.forEach(btn => btn.classList.remove('active'));
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 获取图表类型并更新
            const chartType = this.getAttribute('data-type');
            updatePlantingChart(chartType);
        });
    });
}

// 如果页面已经加载完成，立即初始化图表
if (document.readyState === 'complete') {
    // 延迟一下确保DOM完全准备好
    setTimeout(initDashboardCharts, 500);
} else {
    // 否则等待页面加载完成
    window.addEventListener('load', function() {
        setTimeout(initDashboardCharts, 500);
    });
}