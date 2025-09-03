/**
 * 农情遥感系统大屏 - 长势分析页面专用JavaScript文件
 * 功能：系统初始化、用户交互、功能切换、时间更新等
 */

// ===== 全局变量 =====
let currentSelectedRegion = 'all';
let currentChartType = 'bar';

// ===== 页面导航功能 =====

/**
 * 导航到指定页面
 */
function navigateToPage(pageUrl) {
    console.log(`🚀 导航到页面: ${pageUrl}`);
    window.location.href = pageUrl;
}

// ===== 用户功能模块 =====

/**
 * 显示用户个人信息
 */
function showUserProfile() {
    alert('个人信息功能\n\n用户：张三\n角色：系统管理员\n登录时间：2024-01-15 09:00:00\n权限：完全访问');
}

/**
 * 显示系统设置
 */
function showSystemSettings() {
    alert('系统设置功能\n\n• 界面主题设置\n• 数据更新频率\n• 通知配置\n• 显示选项');
}

/**
 * 显示操作日志
 */
function showOperationLog() {
    alert('操作日志功能\n\n最近操作记录：\n• 14:30 切换到长势分析视图\n• 14:25 调整图层透明度\n• 14:20 查看数据统计\n• 14:15 系统登录');
}

/**
 * 显示帮助信息
 */
function showHelp() {
    alert('帮助中心\n\n• 系统使用指南\n• 功能说明文档\n• 快捷键说明\n• 技术支持联系方式');
}

/**
 * 退出系统
 */
function logout() {
    if (confirm('确定要退出系统吗？')) {
        alert('正在退出系统...\n感谢使用临夏县卫星遥感平台！');
        // 这里可以添加实际的登出逻辑
    }
}

// ===== 区域选择模块 =====

/**
 * 切换区域下拉菜单显示状态
 */
function toggleRegionDropdown() {
    const dropdown = document.getElementById('region-dropdown');
    const regionSelector = document.querySelector('.region-selector');
    
    if (dropdown && regionSelector) {
        const isActive = regionSelector.classList.contains('active');
        
        if (isActive) {
            regionSelector.classList.remove('active');
            dropdown.style.display = 'none';
        } else {
            regionSelector.classList.add('active');
            dropdown.style.display = 'block';
        }
    }
}

/**
 * 选择区域
 */
function selectRegion(regionId, regionName) {
    console.log(`🗺️ 选择区域: ${regionId} - ${regionName}`);
    
    // 更新全局变量
    currentSelectedRegion = regionId;
    
    // 更新界面显示
    const regionNameElement = document.getElementById('selected-region');
    if (regionNameElement) {
        regionNameElement.textContent = regionName;
    }
    
    // 更新下拉菜单状态
    const dropdownItems = document.querySelectorAll('.region-dropdown .dropdown-item');
    dropdownItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-region') === regionId) {
            item.classList.add('active');
        }
    });
    
    // 关闭下拉菜单
    toggleRegionDropdown();
    
    // 更新乡镇地块显示
    if (window.TownshipBlocks) {
        window.TownshipBlocks.filterByRegion(regionId);
        
        if (regionId !== 'all') {
            const regionConfig = getRegionConfig(regionId);
            if (regionConfig) {
                window.TownshipBlocks.focusOn(regionConfig);
            }
        }
    }
    
    // 更新图表数据
    updateChartsForRegion(regionId);
    
    console.log(`✅ 区域选择完成: ${regionName}`);
}

/**
 * 获取区域配置信息
 */
function getRegionConfig(regionId) {
    const regionConfig = {
        'chengguan': {
            name: '城关镇',
            center: { longitude: 103.21, latitude: 35.42, height: 20000 },
            bounds: { west: 103.15, south: 35.38, east: 103.27, north: 35.46 }
        },
        'tuchang': {
            name: '土场镇',
            center: { longitude: 103.18, latitude: 35.38, height: 20000 },
            bounds: { west: 103.12, south: 35.34, east: 103.24, north: 35.42 }
        },
        'beita': {
            name: '北塔镇',
            center: { longitude: 103.25, latitude: 35.45, height: 20000 },
            bounds: { west: 103.19, south: 35.41, east: 103.31, north: 35.49 }
        },
        'hongguang': {
            name: '红光镇',
            center: { longitude: 103.15, latitude: 35.35, height: 20000 },
            bounds: { west: 103.09, south: 35.31, east: 103.21, north: 35.39 }
        },
        'jishishan': {
            name: '积石山镇',
            center: { longitude: 103.28, latitude: 35.48, height: 20000 },
            bounds: { west: 103.22, south: 35.44, east: 103.34, north: 35.52 }
        },
        'hanjiaji': {
            name: '韩家集镇',
            center: { longitude: 103.12, latitude: 35.32, height: 20000 },
            bounds: { west: 103.06, south: 35.28, east: 103.18, north: 35.36 }
        },
        'xinji': {
            name: '新集镇',
            center: { longitude: 103.31, latitude: 35.51, height: 20000 },
            bounds: { west: 103.25, south: 35.47, east: 103.37, north: 35.55 }
        },
        'liujiaxia': {
            name: '刘家峡镇',
            center: { longitude: 103.08, latitude: 35.28, height: 20000 },
            bounds: { west: 103.02, south: 35.24, east: 103.14, north: 35.32 }
        },
        'taiping': {
            name: '太平镇',
            center: { longitude: 103.05, latitude: 35.25, height: 20000 },
            bounds: { west: 102.99, south: 35.21, east: 103.11, north: 35.29 }
        },
        'minfeng': {
            name: '民丰镇',
            center: { longitude: 103.02, latitude: 35.22, height: 20000 },
            bounds: { west: 102.96, south: 35.18, east: 103.08, north: 35.26 }
        }
    };
    
    return regionConfig[regionId];
}

// ===== 地图控制模块 =====

/**
 * 重置地图视图
 */
function resetMapView() {
    console.log('🎯 重置地图视图');
    
    if (window.cesiumViewer) {
        // 重置到临夏县中心视图
        window.cesiumViewer.camera.setView({
            destination: window.Cesium.Cartesian3.fromDegrees(103.1, 35.6, 50000),
            orientation: {
                heading: 0,
                pitch: -90 * Math.PI / 180,
                roll: 0
            }
        });
        
        console.log('✅ 地图视图已重置');
    } else {
        console.warn('⚠️ Cesium地图未初始化');
    }
}

// ===== 图表控制模块 =====

/**
 * 切换乡镇作物图表类型
 */
function switchTownCropChart(chartType) {
    console.log(`📊 切换图表类型: ${chartType}`);

    // 更新按钮状态
    const buttons = document.querySelectorAll('.chart-switch-buttons .switch-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-type') === chartType) {
            btn.classList.add('active');
        }
    });

    // 更新全局变量
    currentChartType = chartType;

    // 根据图表类型显示对应内容
    const chartDiv = document.getElementById('town-crop-chart');
    const tableDiv = document.getElementById('town-crop-table');

    if (chartType === 'table') {
        chartDiv.style.display = 'none';
        tableDiv.style.display = 'block';
        updateTownCropTable(currentSelectedRegion);
    } else {
        chartDiv.style.display = 'block';
        tableDiv.style.display = 'none';
        updateTownCropChart(currentSelectedRegion, chartType);
    }
}

/**
 * 更新区域对应的图表数据
 */
function updateChartsForRegion(regionId) {
    console.log(`📊 更新图表数据: ${regionId}`);
    
    // 更新长势分析图表
    if (currentChartType === 'table') {
        updateTownCropTable(regionId);
    } else {
        updateTownCropChart(regionId, currentChartType);
    }
    
    // 更新长势指数变化趋势图 - 使用本页面独立实现
    if (typeof updateGrowthTrendChart === 'function') {
        const townshipName = getTownshipNameById(regionId) || '红台镇';
        updateGrowthTrendChart(townshipName);
    }
    
    // 更新长势指数评估
    if (typeof updateGrowthIndexAssessment === 'function') {
        updateGrowthIndexAssessment(regionId);
    }
    
    // 更新汇总数据
    updateGrowthSummaryData(regionId);
}

/**
 * 根据regionId获取乡镇名称
 */
function getTownshipNameById(regionId) {
    const regionConfig = {
        'chengguan': '城关镇',
        'tuchang': '土场镇',
        'beita': '北塔镇',
        'hongguang': '红光镇',
        'jishishan': '积石山镇',
        'hanjiaji': '韩家集镇',
        'xinji': '新集镇',
        'liujiaxia': '刘家峡镇',
        'taiping': '太平镇',
        'minfeng': '民丰镇',
        'all': '全县'
    };
    
    return regionConfig[regionId] || '红台镇';
}

/**
 * 更新汇总数据
 */
function updateGrowthSummaryData(regionId) {
    const avgGrowthElement = document.getElementById('avg-growth-index-value');
    const excellentRateElement = document.getElementById('excellent-rate-value');
    const trendInfoElement = document.getElementById('growth-trend-info');
    
    if (regionId === 'all') {
        // 全县汇总数据
        if (avgGrowthElement) avgGrowthElement.textContent = '0.82';
        if (excellentRateElement) excellentRateElement.textContent = '42%';
        if (trendInfoElement) trendInfoElement.textContent = '较上月提升8.2%';
    } else {
        // 单个乡镇数据
        const townshipName = getTownshipNameById(regionId);
        const growthData = calculateTownshipGrowthIndex(regionId);
        
        if (avgGrowthElement) avgGrowthElement.textContent = growthData.avgIndex.toFixed(2);
        if (excellentRateElement) excellentRateElement.textContent = growthData.excellentRate + '%';
        if (trendInfoElement) trendInfoElement.textContent = `${townshipName}长势指数`;
    }
}

/**
 * 计算乡镇长势指数
 */
function calculateTownshipGrowthIndex(regionId) {
    const growthData = getSingleTownshipGrowthData(regionId);
    const total = growthData.excellent + growthData.good + growthData.medium + growthData.poor;
    
    if (total === 0) {
        return { avgIndex: 0, excellentRate: 0 };
    }
    
    // 计算加权平均长势指数 (优:1.0, 良:0.8, 中:0.6, 差:0.4)
    const weightedSum = (growthData.excellent * 1.0) + 
                       (growthData.good * 0.8) + 
                       (growthData.medium * 0.6) + 
                       (growthData.poor * 0.4);
    
    const avgIndex = weightedSum / total;
    const excellentRate = Math.round((growthData.excellent / total) * 100);
    
    return { avgIndex, excellentRate };
}

/**
 * 更新乡镇作物长势图表
 */
function updateTownCropChart(regionId, chartType = 'bar') {
    const chartContainer = document.getElementById('town-crop-chart');
    const titleElement = document.getElementById('current-crop-title');

    if (!chartContainer || !titleElement) return;

    // 获取或创建ECharts实例
    let chart = echarts.getInstanceByDom(chartContainer);
    if (!chart) {
        chart = echarts.init(chartContainer);
    }

    let option;

    if (regionId === 'all') {
        // 显示所有乡镇的汇总数据
        titleElement.textContent = '🌾 小麦按乡镇长势分布';
        option = getTownshipSummaryChartOption(chartType);
        console.log(`📊 显示全县汇总数据`);
    } else {
        // 显示单个乡镇的长势分类数据
        const townshipName = getTownshipNameById(regionId);
        titleElement.textContent = `🌾 ${townshipName}长势分类分布`;
        option = getSingleTownshipChartOption(regionId, chartType);
        console.log(`📊 显示${townshipName}长势分类数据:`, getSingleTownshipGrowthData(regionId));
    }

    chart.setOption(option, true);
}

/**
 * 更新乡镇作物长势表格
 */
function updateTownCropTable(regionId) {
    const titleElement = document.getElementById('current-crop-title');
    const tableBody = document.getElementById('town-crop-tbody');

    if (!titleElement || !tableBody) return;

    if (regionId === 'all') {
        // 显示所有乡镇数据
        titleElement.textContent = '🌾 小麦按乡镇长势分布';
        
        const townshipData = [
            { name: '红台镇', excellent: 182, good: 137, medium: 91, poor: 46 },
            { name: '土桥镇', excellent: 159, good: 119, medium: 80, poor: 40 },
            { name: '漫路镇', excellent: 107, good: 80, medium: 54, poor: 27 },
            { name: '北塘镇', excellent: 54, good: 40, medium: 27, poor: 13 },
            { name: '关滩镇', excellent: 125, good: 94, medium: 62, poor: 31 },
            { name: '新集镇', excellent: 116, good: 87, medium: 58, poor: 29 },
            { name: '麻尼寺沟镇', excellent: 79, good: 59, medium: 40, poor: 20 },
            { name: '韩集镇', excellent: 67, good: 50, medium: 33, poor: 17 }
        ];
        
        tableBody.innerHTML = townshipData.map(township => {
            const total = township.excellent + township.good + township.medium + township.poor;
            return `
                <tr>
                    <td>${township.name}</td>
                    <td>${township.excellent}</td>
                    <td>${township.good}</td>
                    <td>${township.medium}</td>
                    <td>${township.poor}</td>
                    <td>${total}</td>
                </tr>
            `;
        }).join('');
        
    } else {
        // 显示单个乡镇的长势分类数据
        const townshipName = getTownshipNameById(regionId);
        const growthData = getSingleTownshipGrowthData(regionId);

        titleElement.textContent = `🌾 ${townshipName}长势分类分布`;

        const total = growthData.excellent + growthData.good + growthData.medium + growthData.poor;
        tableBody.innerHTML = `
            <tr>
                <td>${townshipName}</td>
                <td>${growthData.excellent}</td>
                <td>${growthData.good}</td>
                <td>${growthData.medium}</td>
                <td>${growthData.poor}</td>
                <td>${total}</td>
            </tr>
        `;
    }
}

/**
 * 获取乡镇汇总图表配置
 */
function getTownshipSummaryChartOption(chartType) {
    const townships = ['红台镇', '土桥镇', '漫路镇', '北塘镇', '关滩镇', '新集镇', '麻尼寺沟镇', '韩集镇'];
    const excellentData = [182, 159, 107, 54, 125, 116, 79, 67];
    const goodData = [137, 119, 80, 40, 94, 87, 59, 50];
    const mediumData = [91, 80, 54, 27, 62, 58, 40, 33];
    const poorData = [46, 40, 27, 13, 31, 29, 20, 17];

    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['优', '良', '中', '差'],
            textStyle: { color: '#fff' },
            top: '5%'
        },
        grid: {
            left: '3%', right: '4%', bottom: '3%', top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: townships,
            axisLabel: { color: '#fff', fontSize: 9, rotate: 45 }
        },
        yAxis: {
            type: 'value',
            axisLabel: { color: '#fff', fontSize: 10 }
        },
        series: [
            {
                name: '优',
                type: 'bar',
                stack: '长势',
                data: excellentData,
                itemStyle: { color: '#4CAF50' }
            },
            {
                name: '良',
                type: 'bar',
                stack: '长势',
                data: goodData,
                itemStyle: { color: '#8BC34A' }
            },
            {
                name: '中',
                type: 'bar',
                stack: '长势',
                data: mediumData,
                itemStyle: { color: '#FFC107' }
            },
            {
                name: '差',
                type: 'bar',
                stack: '长势',
                data: poorData,
                itemStyle: { color: '#FF5722' }
            }
        ]
    };
}

/**
 * 获取单个乡镇长势分类图表配置
 */
function getSingleTownshipChartOption(regionId, chartType) {
    const growthData = getSingleTownshipGrowthData(regionId);
    const categories = ['优', '良', '中', '差'];
    const values = [growthData.excellent, growthData.good, growthData.medium, growthData.poor];
    const colors = ['#4CAF50', '#8BC34A', '#FFC107', '#FF5722'];

    return {
        backgroundColor: 'transparent',
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' },
            formatter: function(params) {
                const data = params[0];
                const total = values.reduce((a, b) => a + b, 0);
                const percentage = ((data.value / total) * 100).toFixed(1);
                return `${data.name}<br/>面积: ${data.value} 亩<br/>占比: ${percentage}%`;
            }
        },
        grid: {
            left: '3%', right: '4%', bottom: '3%', top: '10%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: categories,
            axisLabel: { 
                color: '#fff', 
                fontSize: 12,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: { color: '#fff' }
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: { 
                color: '#fff', 
                fontSize: 10 
            },
            axisLine: {
                lineStyle: { color: '#fff' }
            },
            splitLine: {
                lineStyle: { color: 'rgba(255, 255, 255, 0.2)' }
            }
        },
        series: [{
            name: '面积(亩)',
            type: 'bar',
            data: values.map((value, index) => ({
                value: value,
                itemStyle: { 
                    color: colors[index],
                    borderRadius: [4, 4, 0, 0]
                }
            })),
            label: {
                show: true,
                position: 'top',
                color: '#fff',
                fontSize: 10,
                formatter: '{c} 亩'
            }
        }]
    };
}

/**
 * 根据区域ID获取乡镇名称
 */
function getTownshipNameById(regionId) {
    const nameMap = {
        'chengguan': '城关镇',
        'tuchang': '土场镇',
        'beita': '北塔镇',
        'hongguang': '红光镇',
        'jishishan': '积石山镇',
        'hanjiaji': '韩家集镇',
        'xinji': '新集镇',
        'liujiaxia': '刘家峡镇',
        'taiping': '太平镇',
        'minfeng': '民丰镇'
    };
    return nameMap[regionId] || '未知乡镇';
}

/**
 * 获取单个乡镇长势数据（根据月份变化）
 */
function getSingleTownshipGrowthData(regionId) {
    const currentMonth = window.Timeline ? window.Timeline.getCurrentMonth() : new Date().getMonth() + 1;

    // 基础数据
    const baseData = {
        'chengguan': { excellent: 180, good: 135, medium: 90, poor: 45 },
        'tuchang': { excellent: 160, good: 120, medium: 80, poor: 40 },
        'beita': { excellent: 110, good: 82, medium: 55, poor: 28 },
        'hongguang': { excellent: 140, good: 105, medium: 70, poor: 35 },
        'jishishan': { excellent: 200, good: 150, medium: 100, poor: 50 },
        'hanjiaji': { excellent: 130, good: 98, medium: 65, poor: 33 },
        'xinji': { excellent: 120, good: 90, medium: 60, poor: 30 },
        'liujiaxia': { excellent: 95, good: 71, medium: 47, poor: 24 },
        'taiping': { excellent: 115, good: 86, medium: 58, poor: 29 },
        'minfeng': { excellent: 105, good: 79, medium: 52, poor: 26 }
    };

    const base = baseData[regionId] || { excellent: 0, good: 0, medium: 0, poor: 0 };

    // 根据月份调整数据（模拟季节性变化）
    const seasonalFactor = getSeasonalFactor(currentMonth);

    return {
        excellent: Math.round(base.excellent * seasonalFactor.excellent),
        good: Math.round(base.good * seasonalFactor.good),
        medium: Math.round(base.medium * seasonalFactor.medium),
        poor: Math.round(base.poor * seasonalFactor.poor)
    };
}

/**
 * 获取季节性调整因子
 */
function getSeasonalFactor(month) {
    // 春季(3-5月): 长势逐渐好转
    // 夏季(6-8月): 长势最佳
    // 秋季(9-11月): 长势稳定
    // 冬季(12-2月): 长势较差

    const factors = {
        1: { excellent: 0.6, good: 0.8, medium: 1.2, poor: 1.4 },  // 冬季
        2: { excellent: 0.7, good: 0.9, medium: 1.1, poor: 1.3 },
        3: { excellent: 0.8, good: 1.0, medium: 1.0, poor: 1.2 },  // 春季开始
        4: { excellent: 0.9, good: 1.1, medium: 0.9, poor: 1.1 },
        5: { excellent: 1.0, good: 1.2, medium: 0.8, poor: 1.0 },
        6: { excellent: 1.2, good: 1.3, medium: 0.7, poor: 0.8 },  // 夏季最佳
        7: { excellent: 1.3, good: 1.2, medium: 0.6, poor: 0.7 },
        8: { excellent: 1.2, good: 1.1, medium: 0.7, poor: 0.8 },
        9: { excellent: 1.1, good: 1.0, medium: 0.8, poor: 0.9 },  // 秋季
        10: { excellent: 1.0, good: 0.9, medium: 0.9, poor: 1.0 },
        11: { excellent: 0.9, good: 0.8, medium: 1.0, poor: 1.1 },
        12: { excellent: 0.7, good: 0.8, medium: 1.1, poor: 1.3 }   // 冬季
    };

    return factors[month] || { excellent: 1, good: 1, medium: 1, poor: 1 };
}

// ===== 时间更新模块 =====

/**
 * 更新系统时间显示
 */
function updateSystemTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    if (timeElement) {
        const timeString = now.toLocaleTimeString('zh-CN', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = `2024-01-15 ${timeString}`;
    }
    
    if (dateElement) {
        const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
        dateElement.textContent = weekdays[now.getDay()];
    }
}

/**
 * 月份数据更新函数
 */
function updateChartsForMonth(month) {
    console.log(`📊 更新图表数据到${month}月`);

    // 更新长势图表
    if (currentSelectedRegion === 'all') {
        updateTownCropChart('all', currentChartType);
    } else {
        updateTownCropChart(currentSelectedRegion, currentChartType);
    }

    // 更新长势指数评估（根据新月份重新计算）
    if (typeof updateGrowthIndexAssessment === 'function') {
        updateGrowthIndexAssessment(currentSelectedRegion);
    }

    // 更新汇总数据
    updateGrowthSummaryData(currentSelectedRegion);
}

/**
 * 月份选择处理函数
 */
function selectMonth(month) {
    console.log(`📅 选择月份: ${month}`);
    
    if (window.Timeline) {
        window.Timeline.selectMonth(month);
    }
    
    // 更新数据
    updateChartsForMonth(month);
}

// ===== 乡镇地块控制函数 =====

/**
 * 切换乡镇地块可见性
 */
function toggleTownshipVisibility() {
    const switchElement = document.getElementById('township-visibility-switch');
    const isActive = switchElement && switchElement.classList.contains('active');

    if (isActive) {
        switchElement.classList.remove('active');
        if (window.TownshipBlocks) {
            window.TownshipBlocks.setVisibility(false);
        }
        console.log('👁️ 隐藏乡镇地块');
    } else {
        if (switchElement) switchElement.classList.add('active');
        if (window.TownshipBlocks) {
            window.TownshipBlocks.setVisibility(true);
        }
        console.log('👁️ 显示乡镇地块');
    }
}

/**
 * 高亮指定乡镇
 */
function highlightTownship(townshipName) {
    if (window.TownshipBlocks) {
        window.TownshipBlocks.highlight(townshipName);
    }
}

/**
 * 生成乡镇统计信息
 */
function generateTownshipStats() {
    const statsContainer = document.getElementById('township-stats');
    if (!statsContainer || !window.TownshipBlocks) return;

    const stats = window.TownshipBlocks.getStatistics();
    statsContainer.innerHTML = `
        <div>总乡镇数: ${stats.totalTownships}个</div>
        <div>总人口: ${stats.totalPopulation.toLocaleString()}人</div>
        <div>总面积: ${stats.totalArea}km²</div>
        <div>平均人口: ${stats.averagePopulation.toLocaleString()}人</div>
    `;
}

/**
 * 生成乡镇列表
 */
function generateTownshipList() {
    const listContainer = document.getElementById('township-list');
    if (!listContainer || !window.TownshipBlocks) return;

    const townships = window.TownshipBlocks.getByPopulationDensity();
    let listHtml = '';

    townships.forEach(township => {
        listHtml += `
            <div class="township-item" onclick="selectTownshipFromList('${township.id}', '${township.name}')">
                <div class="township-color" style="background-color: ${township.color}"></div>
                <span class="township-name">${township.name}</span>
                <span class="township-area">${township.area}km²</span>
            </div>
        `;
    });

    listContainer.innerHTML = listHtml;
    console.log('📋 乡镇列表生成完成');
}

/**
 * 从乡镇列表选择乡镇（与区域选择器联动）
 */
function selectTownshipFromList(townshipId, townshipName) {
    // 调用主系统的区域选择函数，实现联动
    if (typeof selectRegion === 'function') {
        selectRegion(townshipId, townshipName);
    } else {
        // 备用方案：直接操作乡镇地块
        if (window.TownshipBlocks) {
            window.TownshipBlocks.filterByRegion(townshipId);
            window.TownshipBlocks.highlight(townshipName);
        }
    }
}

// ===== 页面初始化 =====

/**
 * 页面加载完成后初始化
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 长势分析页面开始初始化...');
    
    // 确保全局变量已初始化
    if (typeof currentSelectedRegion === 'undefined') {
        window.currentSelectedRegion = 'all';
    }
    if (typeof currentChartType === 'undefined') {
        window.currentChartType = 'bar';
    }

    // 启动时间更新
    updateSystemTime();
    setInterval(updateSystemTime, 1000);

    // 初始化组件
    function initializeComponents() {
        console.log('🔧 检查组件初始化状态...');
        
        // 检查Cesium是否初始化完成
        if (!window.cesiumViewer) {
            console.warn('⚠️ Cesium Viewer未初始化，延迟初始化组件...');
            // 再次延迟重试
            setTimeout(initializeComponents, 1000);
            return;
        }
        
        console.log('✅ Cesium Viewer已初始化，继续初始化其他组件...');
        
        // 检查乡镇地块模块
        if (window.TownshipBlocks) {
            console.log('✅ 乡镇地块模块已加载');
            // 使用重试机制的初始化
            window.TownshipBlocks.init();
            console.log('🏠 乡镇地块初始化完成');
        } else {
            console.log('⚠️ 乡镇地块模块未加载');
        }

        // 初始化图表
        updateTownCropChart('all', 'bar');
        updateGrowthSummaryData('all');

        // 检查时间轴模块
        if (window.Timeline) {
            console.log('✅ 时间轴模块已加载');
            window.Timeline.init();
            console.log('⏰ 时间轴初始化完成');
        } else {
            console.log('⚠️ 时间轴模块未加载');
        }

        console.log('🎉 长势分析页面初始化完成');
    }

    // 初始化Cesium地图
    if (typeof initCesiumMap === 'function') {
        // 延迟初始化地图，确保DOM和Cesium库完全加载
        setTimeout(() => {
            // 检查Cesium容器是否存在
            const cesiumContainer = document.getElementById('cesium-container');
            if (!cesiumContainer) {
                console.error('❌ Cesium容器不存在');
                return;
            }
            
            // 检查Cesium库是否加载
            if (typeof Cesium === 'undefined') {
                console.error('❌ Cesium库未加载');
                return;
            }
            
            console.log('🗺️ 开始初始化Cesium地图...');
            initCesiumMap();
            console.log('✅ Cesium地图初始化完成');
            
            // 地图初始化完成后，再初始化其他组件
            setTimeout(initializeComponents, 1000);
            
        }, 500); // 增加延迟时间，确保Cesium库完全加载
        console.log('🗺️ Cesium地图模块准备就绪');
    } else {
        console.warn('⚠️ Cesium地图模块未加载');
        // 如果地图模块未加载，仍然初始化其他组件
        setTimeout(initializeComponents, 2000);
    }

    // 添加调试函数到全局作用域
    window.debugGrowthAnalysis = function() {
        console.log('🔍 调试长势分析功能...');
        console.log('当前选中区域:', window.currentSelectedRegion);
        console.log('当前图表类型:', window.currentChartType);
        console.log('selectRegion函数:', typeof selectRegion);
        console.log('updateTownCropChart函数:', typeof updateTownCropChart);
        
        // 测试区域选择
        if (typeof selectRegion === 'function') {
            console.log('🧪 测试选择城关镇...');
            selectRegion('chengguan', '城关镇');
        }
    };
});

// ===== 长势指数变化趋势图模块 =====

let growthTrendChart = null;
let currentSelectedTownForGrowth = '红台镇';

/**
 * 初始化长势指数变化趋势图
 */
function initGrowthTrendChart() {
    const chartElement = document.getElementById('growth-trend-comparison');
    if (!chartElement) {
        console.warn('⚠️ 长势指数趋势图容器未找到');
        return;
    }
    
    growthTrendChart = echarts.init(chartElement);
    
    // 渲染初始图表
    updateGrowthTrendChart(currentSelectedTownForGrowth);
    
    // 窗口大小改变时重新调整图表
    window.addEventListener('resize', function() {
        if (growthTrendChart) {
            growthTrendChart.resize();
        }
    });
    
    console.log('✅ 长势指数变化趋势图初始化完成');
}

/**
 * 更新长势指数变化趋势图
 * @param {string} townName - 选中的乡镇名称
 */
function updateGrowthTrendChart(townName) {
    if (!growthTrendChart) {
        console.warn('⚠️ 长势指数趋势图未初始化');
        return;
    }
    
    currentSelectedTownForGrowth = townName;
    
    // 12个月份数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    
    // 全县平均长势指数数据（0-1之间）
    const countyAvgGrowthData = [
        0.45,  // 1月 - 冬季休眠期
        0.50,  // 2月 - 春耕准备期
        0.60,  // 3月 - 春播开始
        0.75,  // 4月 - 作物生长期
        0.85,  // 5月 - 快速生长期
        0.90,  // 6月 - 夏季生长旺期
        0.88,  // 7月 - 开花结果期
        0.82,  // 8月 - 成熟期
        0.70,  // 9月 - 秋收季节
        0.58,  // 10月 - 收获期
        0.48,  // 11月 - 收获完成期
        0.42   // 12月 - 冬季休眠期
    ];
    
    // 不同乡镇的长势指数数据
    const townGrowthData = {
        '红台镇': [0.48, 0.53, 0.63, 0.78, 0.88, 0.93, 0.91, 0.85, 0.73, 0.61, 0.51, 0.45],
        '土桥镇': [0.46, 0.51, 0.61, 0.76, 0.86, 0.91, 0.89, 0.83, 0.71, 0.59, 0.49, 0.43],
        '漫路镇': [0.44, 0.49, 0.59, 0.74, 0.84, 0.89, 0.87, 0.81, 0.69, 0.57, 0.47, 0.41],
        '北塬镇': [0.43, 0.48, 0.58, 0.73, 0.83, 0.88, 0.86, 0.80, 0.68, 0.56, 0.46, 0.40],
        '关滩镇': [0.45, 0.50, 0.60, 0.75, 0.85, 0.90, 0.88, 0.82, 0.70, 0.58, 0.48, 0.42],
        '新集镇': [0.47, 0.52, 0.62, 0.77, 0.87, 0.92, 0.90, 0.84, 0.72, 0.60, 0.50, 0.44],
        '麻尼寺沟镇': [0.42, 0.47, 0.57, 0.72, 0.82, 0.87, 0.85, 0.79, 0.67, 0.55, 0.45, 0.39],
        '韩集镇': [0.41, 0.46, 0.56, 0.71, 0.81, 0.86, 0.84, 0.78, 0.66, 0.54, 0.44, 0.38]
    };
    
    // 获取选中乡镇的数据
    const selectedTownData = townGrowthData[townName] || townGrowthData['红台镇'];
    
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
                if (params.length > 1) {
                    const diff = (params[1].value - params[0].value).toFixed(3);
                    const diffPercent = ((diff / params[0].value) * 100).toFixed(1);
                    result += `差值: ${diff} (${diffPercent}%)`;
                }
                return result;
            }
        },
        legend: {
            data: ['全县平均长势指数', `${townName}长势指数`],
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
            name: '长势指数',
            min: 0,
            max: 1,
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
                formatter: '{value}'
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
                name: '全县平均长势指数',
                type: 'line',
                data: countyAvgGrowthData,
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
                name: `${townName}长势指数`,
                type: 'line',
                data: selectedTownData,
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
    
    growthTrendChart.setOption(option);
    console.log(`✅ 长势指数趋势图已更新为: ${townName}`);
}

// 将长势指数图表更新函数暴露到全局，供其他模块调用
window.updateGrowthTrendChart = updateGrowthTrendChart;

// ===== 长势指数评估功能 =====

/**
 * 更新长势指数评估数据
 */
function updateGrowthIndexAssessment(regionId) {
    console.log(`📊 更新长势指数评估，区域: ${regionId}`);
    
    // 获取当前月份
    const currentMonth = window.Timeline ? window.Timeline.getCurrentMonth() : new Date().getMonth() + 1;
    
    // 根据区域和月份获取长势指数数据
    const assessmentData = getGrowthIndexData(regionId, currentMonth);
    
    // 更新主要指数值
    const mainValueElement = document.getElementById('growth-index-main-value');
    const levelInfoElement = document.getElementById('growth-level-info');
    const reasonElement = document.getElementById('growth-score-reason');
    
    if (mainValueElement) {
        mainValueElement.textContent = assessmentData.overallIndex.toFixed(2);
    }
    
    if (levelInfoElement) {
        levelInfoElement.textContent = `等级：${assessmentData.level}`;
        levelInfoElement.className = `summary-subtitle ${assessmentData.levelClass}`;
    }
    
    if (reasonElement) {
        reasonElement.textContent = assessmentData.basisText;
    }
    
    // 更新详细因子数据
    updateGrowthFactors(assessmentData.factors);
    
    console.log(`✅ 长势指数评估已更新：${assessmentData.overallIndex.toFixed(2)} (${assessmentData.level})`);
}

/**
 * 更新长势评估因子详情
 */
function updateGrowthFactors(factors) {
    const factorsContainer = document.getElementById('growth-factors');
    if (!factorsContainer) return;
    
    factorsContainer.innerHTML = '';
    
    factors.forEach(factor => {
        const factorDiv = document.createElement('div');
        factorDiv.className = 'factor-item';
        
        factorDiv.innerHTML = `
            <span class="factor-name">${factor.name}:</span>
            <span class="factor-value ${factor.level}">${factor.value}</span>
        `;
        
        factorsContainer.appendChild(factorDiv);
    });
}

/**
 * 获取长势指数评估数据
 */
function getGrowthIndexData(regionId, month) {
    // 基础数据配置
    const baseFactors = {
        'all': {
            ndvi: { base: 0.78, range: 0.15 },
            lai: { base: 3.2, range: 0.8 },
            temperature: { base: 0.91, range: 0.12 },
            moisture: { base: 0.73, range: 0.20 }
        },
        'chengguan': {
            ndvi: { base: 0.82, range: 0.12 },
            lai: { base: 3.5, range: 0.6 },
            temperature: { base: 0.88, range: 0.10 },
            moisture: { base: 0.79, range: 0.15 }
        },
        'tuchang': {
            ndvi: { base: 0.75, range: 0.18 },
            lai: { base: 3.0, range: 0.9 },
            temperature: { base: 0.93, range: 0.08 },
            moisture: { base: 0.71, range: 0.22 }
        },
        'beita': {
            ndvi: { base: 0.69, range: 0.20 },
            lai: { base: 2.8, range: 1.0 },
            temperature: { base: 0.89, range: 0.14 },
            moisture: { base: 0.68, range: 0.25 }
        }
    };
    
    // 获取区域基础数据，如果没有则使用全县数据
    const regionFactors = baseFactors[regionId] || baseFactors['all'];
    
    // 根据月份调整季节性变化
    const seasonalFactor = getSeasonalGrowthFactor(month);
    
    // 计算各项指标
    const ndviValue = Math.max(0.3, Math.min(1.0, 
        regionFactors.ndvi.base * seasonalFactor + (Math.random() - 0.5) * regionFactors.ndvi.range * 0.3
    ));
    
    const laiValue = Math.max(1.0, Math.min(6.0,
        regionFactors.lai.base * seasonalFactor + (Math.random() - 0.5) * regionFactors.lai.range * 0.3
    ));
    
    const tempValue = Math.max(0.5, Math.min(1.0,
        regionFactors.temperature.base * (1 + (Math.random() - 0.5) * regionFactors.temperature.range * 0.2)
    ));
    
    const moistureValue = Math.max(0.4, Math.min(1.0,
        regionFactors.moisture.base * (1 + (Math.random() - 0.5) * regionFactors.moisture.range * 0.2)
    ));
    
    // 计算综合指数 (权重：NDVI 40%, LAI 25%, 温度 20%, 墒情 15%)
    const overallIndex = (ndviValue * 0.4) + (laiValue / 6 * 0.25) + (tempValue * 0.2) + (moistureValue * 0.15);
    
    // 确定等级
    let level, levelClass;
    if (overallIndex >= 0.85) {
        level = '优秀';
        levelClass = 'excellent';
    } else if (overallIndex >= 0.75) {
        level = '良好';
        levelClass = 'good';
    } else if (overallIndex >= 0.65) {
        level = '中等';
        levelClass = 'medium';
    } else {
        level = '较差';
        levelClass = 'poor';
    }
    
    // 生成因子数据
    const factors = [
        {
            name: '植被指数(NDVI)',
            value: ndviValue.toFixed(2),
            level: ndviValue >= 0.8 ? 'excellent' : ndviValue >= 0.7 ? 'good' : ndviValue >= 0.6 ? 'medium' : 'poor'
        },
        {
            name: '叶面积指数(LAI)',
            value: laiValue.toFixed(1),
            level: laiValue >= 3.5 ? 'excellent' : laiValue >= 2.8 ? 'good' : laiValue >= 2.0 ? 'medium' : 'poor'
        },
        {
            name: '温湿度适宜度',
            value: tempValue.toFixed(2),
            level: tempValue >= 0.9 ? 'excellent' : tempValue >= 0.8 ? 'good' : tempValue >= 0.7 ? 'medium' : 'poor'
        },
        {
            name: '土壤墒情',
            value: moistureValue.toFixed(2),
            level: moistureValue >= 0.8 ? 'excellent' : moistureValue >= 0.7 ? 'good' : moistureValue >= 0.6 ? 'medium' : 'poor'
        }
    ];
    
    return {
        overallIndex,
        level,
        levelClass,
        basisText: '基于NDVI、LAI、温湿度',
        factors
    };
}

/**
 * 获取季节性长势调整因子
 */
function getSeasonalGrowthFactor(month) {
    const factors = {
        1: 0.6,   // 冬季休眠期
        2: 0.65,  // 冬季末期
        3: 0.75,  // 春季开始
        4: 0.85,  // 春季生长期
        5: 0.95,  // 春季旺盛期
        6: 1.1,   // 夏季生长高峰
        7: 1.15,  // 夏季最旺盛期
        8: 1.1,   // 夏季后期
        9: 0.95,  // 秋季成熟期
        10: 0.85, // 秋季收获期
        11: 0.7,  // 秋季末期
        12: 0.6   // 冬季开始
    };
    
    return factors[month] || 1.0;
}

// 暴露长势指数评估函数到全局
window.updateGrowthIndexAssessment = updateGrowthIndexAssessment;

// 页面加载完成后初始化长势指数图表和评估
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保ECharts库已加载
    setTimeout(() => {
        if (typeof echarts !== 'undefined') {
            initGrowthTrendChart();
        } else {
            console.warn('⚠️ ECharts库未加载，无法初始化长势指数图表');
        }
        
        // 初始化长势指数评估
        updateGrowthIndexAssessment('all');
    }, 1000);
});