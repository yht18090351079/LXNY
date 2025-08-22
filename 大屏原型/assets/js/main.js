/**
 * 农情遥感系统大屏 - 主JavaScript文件
 * 功能：系统初始化、用户交互、功能切换、时间更新等
 */

// ===== 全局变量 =====
let currentSelectedRegion = 'all';
let currentChartType = 'bar';

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
    alert('操作日志功能\n\n最近操作记录：\n• 14:30 切换到作物分布视图\n• 14:25 调整图层透明度\n• 14:20 查看数据统计\n• 14:15 系统登录');
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
 * 区域配置数据
 */
const regionConfig = {
    'all': {
        name: '全县',
        icon: '🏛️',
        center: { longitude: 103.2, latitude: 35.4, height: 50000 },
        bounds: { west: 102.8, south: 35.0, east: 103.6, north: 35.8 }
    },
    'chengguan': {
        name: '城关镇',
        icon: '🏢',
        center: { longitude: 103.21, latitude: 35.42, height: 20000 },
        bounds: { west: 103.15, south: 35.38, east: 103.27, north: 35.46 },
        stats: {
            totalArea: 892,
            coverage: '县政府所在地',
            growthIndex: 0.85,
            wheatArea: 356,
            cornArea: 298,
            vegetableArea: 156,
            potatoArea: 52,
            rapeseedArea: 30
        }
    },
    'tuchang': {
        name: '土场镇',
        icon: '🏘️',
        center: { longitude: 103.18, latitude: 35.38, height: 20000 },
        bounds: { west: 103.12, south: 35.34, east: 103.24, north: 35.42 },
        stats: {
            totalArea: 1156,
            coverage: '农业重镇',
            growthIndex: 0.82,
            wheatArea: 478,
            cornArea: 389,
            vegetableArea: 198,
            potatoArea: 56,
            rapeseedArea: 35
        }
    },
    'beita': {
        name: '北塔镇',
        icon: '🏘️',
        center: { longitude: 103.25, latitude: 35.45, height: 20000 },
        bounds: { west: 103.19, south: 35.41, east: 103.31, north: 35.49 },
        stats: {
            totalArea: 734,
            coverage: '北部区域',
            growthIndex: 0.78,
            wheatArea: 298,
            cornArea: 245,
            vegetableArea: 123,
            potatoArea: 42,
            rapeseedArea: 26
        }
    },
    'hongguang': {
        name: '红光镇',
        icon: '🏘️',
        center: { longitude: 103.15, latitude: 35.35, height: 20000 },
        bounds: { west: 103.09, south: 35.31, east: 103.21, north: 35.39 },
        stats: {
            totalArea: 623,
            coverage: '西南区域',
            growthIndex: 0.76,
            wheatArea: 245,
            cornArea: 198,
            vegetableArea: 112,
            potatoArea: 38,
            rapeseedArea: 30
        }
    },
    'jishishan': {
        name: '积石山镇',
        icon: '🏘️',
        center: { longitude: 103.28, latitude: 35.48, height: 20000 },
        bounds: { west: 103.22, south: 35.44, east: 103.34, north: 35.52 },
        stats: {
            totalArea: 567,
            coverage: '东北区域',
            growthIndex: 0.81,
            wheatArea: 234,
            cornArea: 189,
            vegetableArea: 89,
            potatoArea: 32,
            rapeseedArea: 23
        }
    },
    'hanjiaji': {
        name: '韩家集镇',
        icon: '🏘️',
        center: { longitude: 103.12, latitude: 35.32, height: 20000 },
        bounds: { west: 103.06, south: 35.28, east: 103.18, north: 35.36 },
        stats: {
            totalArea: 445,
            coverage: '西部区域',
            growthIndex: 0.79,
            wheatArea: 178,
            cornArea: 145,
            vegetableArea: 78,
            potatoArea: 26,
            rapeseedArea: 18
        }
    },
    'xinji': {
        name: '新集镇',
        icon: '🏘️',
        center: { longitude: 103.31, latitude: 35.51, height: 20000 },
        bounds: { west: 103.25, south: 35.47, east: 103.37, north: 35.55 },
        stats: {
            totalArea: 389,
            coverage: '东部区域',
            growthIndex: 0.83,
            wheatArea: 156,
            cornArea: 123,
            vegetableArea: 67,
            potatoArea: 24,
            rapeseedArea: 19
        }
    },
    'liujiaxia': {
        name: '刘家峡镇',
        icon: '🏘️',
        center: { longitude: 103.08, latitude: 35.28, height: 20000 },
        bounds: { west: 103.02, south: 35.24, east: 103.14, north: 35.32 },
        stats: {
            totalArea: 298,
            coverage: '西南角',
            growthIndex: 0.74,
            wheatArea: 118,
            cornArea: 89,
            vegetableArea: 56,
            potatoArea: 21,
            rapeseedArea: 14
        }
    },
    'taiping': {
        name: '太平镇',
        icon: '🏘️',
        center: { longitude: 103.34, latitude: 35.54, height: 20000 },
        bounds: { west: 103.28, south: 35.50, east: 103.40, north: 35.58 },
        stats: {
            totalArea: 234,
            coverage: '东北角',
            growthIndex: 0.77,
            wheatArea: 89,
            cornArea: 78,
            vegetableArea: 42,
            potatoArea: 15,
            rapeseedArea: 10
        }
    },
    'minfeng': {
        name: '民丰镇',
        icon: '🏘️',
        center: { longitude: 103.05, latitude: 35.25, height: 20000 },
        bounds: { west: 102.99, south: 35.21, east: 103.11, north: 35.29 },
        stats: {
            totalArea: 189,
            coverage: '西南角',
            growthIndex: 0.72,
            wheatArea: 72,
            cornArea: 56,
            vegetableArea: 34,
            potatoArea: 16,
            rapeseedArea: 11
        }
    }
};

/**
 * 切换区域下拉菜单显示状态
 */
function toggleRegionDropdown() {
    const regionSelector = document.querySelector('.region-selector');
    const dropdown = document.getElementById('region-dropdown');

    if (regionSelector && dropdown) {
        regionSelector.classList.toggle('active');

        // 点击外部关闭下拉菜单
        if (regionSelector.classList.contains('active')) {
            document.addEventListener('click', closeRegionDropdownOnClickOutside);
        } else {
            document.removeEventListener('click', closeRegionDropdownOnClickOutside);
        }
    }
}

/**
 * 点击外部关闭区域下拉菜单
 */
function closeRegionDropdownOnClickOutside(event) {
    const regionSelector = document.querySelector('.region-selector');

    if (regionSelector && !regionSelector.contains(event.target)) {
        regionSelector.classList.remove('active');
        document.removeEventListener('click', closeRegionDropdownOnClickOutside);
    }
}

/**
 * 选择区域
 */
function selectRegion(regionId, regionName, isInitialization = false) {
    // 更新当前选中区域
    currentSelectedRegion = regionId;

    // 更新显示的区域名称
    const regionNameEl = document.getElementById('selected-region');
    if (regionNameEl) {
        regionNameEl.textContent = regionName;
    }

    // 更新下拉菜单中的激活状态
    const dropdownItems = document.querySelectorAll('.region-dropdown .dropdown-item');
    dropdownItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-region') === regionId) {
            item.classList.add('active');
        }
    });

    // 关闭下拉菜单
    const regionSelector = document.querySelector('.region-selector');
    if (regionSelector) {
        regionSelector.classList.remove('active');
    }

    // 移动地图视图到选中区域（初始化时不移动）
    if (!isInitialization) {
        moveToRegion(regionId);
    }

    // 触发区域变更事件
    onRegionChanged(regionId, regionName);

    // 联动乡镇地块显示
    if (window.TownshipBlocks && typeof window.TownshipBlocks.filterByRegion === 'function') {
        window.TownshipBlocks.filterByRegion(regionId);
        console.log(`🏘️ 乡镇地块已联动到区域: ${regionName}`);
    }

    // 更新乡镇长势图表
    if (typeof updateTownCropChart === 'function') {
        // 根据区域选择决定显示的数据类型
        if (regionId === 'all') {
            // 全县模式：显示各乡镇的长势分布
            updateTownCropChart('wheat'); // 默认显示小麦数据
        } else {
            // 单个乡镇模式：显示该乡镇的长势分类分布
            if (typeof updateSingleTownshipChart === 'function') {
                updateSingleTownshipChart(regionId);
            } else {
                console.warn('⚠️ updateSingleTownshipChart 函数未定义');
            }
        }
        console.log(`📊 长势图表已联动到区域: ${regionName}`);
    }

    // 如果当前显示的是表格，也需要更新
    if (typeof updateTownCropTable === 'function' && (currentChartType === 'table' || document.getElementById('town-crop-table').style.display !== 'none')) {
        updateTownCropTable(regionId);
        console.log(`📋 长势表格已联动到区域: ${regionName}`);
    }

    console.log(`📍 区域已切换到: ${regionName} (${regionId})`);
}

/**
 * 移动地图视图到指定区域
 */
function moveToRegion(regionId) {
    const region = regionConfig[regionId];
    if (!region || !window.viewer) {
        return;
    }

    // 使用Cesium相机移动到指定区域
    if (window.viewer.camera) {
        window.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(
                region.center.longitude,
                region.center.latitude,
                region.center.height
            ),
            orientation: {
                heading: 0,
                pitch: Cesium.Math.toRadians(-90),
                roll: 0
            }
        });

        // 显示区域切换提示
        if (typeof showLayerIndicator === 'function') {
            showLayerIndicator(`已切换到 ${region.name}`, 2000);
        }
    }
}

/**
 * 更新单个乡镇的长势分类图表
 */
function updateSingleTownshipChart(regionId) {
    const region = regionConfig[regionId];
    if (!region) {
        console.warn(`⚠️ 未找到区域配置: ${regionId}`);
        return;
    }

    // 获取乡镇名称
    const townshipName = region.name;
    
    // 模拟该乡镇的长势分类数据（优、良、中、差）
    const growthData = {
        '优': Math.floor(Math.random() * 40) + 30, // 30-70%
        '良': Math.floor(Math.random() * 30) + 20, // 20-50%
        '中': Math.floor(Math.random() * 20) + 10, // 10-30%
        '差': Math.floor(Math.random() * 10) + 5   // 5-15%
    };

    // 获取图表容器
    const chartContainer = document.getElementById('town-crop-chart');
    if (!chartContainer) {
        console.warn('⚠️ 未找到图表容器');
        return;
    }

    // 初始化或获取ECharts实例
    let chart = echarts.getInstanceByDom(chartContainer);
    if (!chart) {
        chart = echarts.init(chartContainer);
    }

    // 配置图表选项
    const option = {
        title: {
            text: `${townshipName}长势分类分布`,
            left: 'center',
            textStyle: {
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = params[0];
                const total = Object.values(growthData).reduce((sum, val) => sum + val, 0);
                const percentage = ((data.value / total) * 100).toFixed(1);
                return `${data.name}<br/>面积: ${data.value}亩<br/>占比: ${percentage}%`;
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
            data: Object.keys(growthData),
            axisLabel: {
                color: '#fff',
                fontSize: 12,
                fontWeight: 'bold'
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '面积(亩)',
            nameTextStyle: {
                color: '#fff'
            },
            axisLabel: {
                color: '#fff'
            },
            axisLine: {
                lineStyle: {
                    color: '#fff'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgba(255,255,255,0.1)'
                }
            }
        },
        series: [{
            name: '长势分布',
            type: 'bar',
            data: Object.values(growthData),
            itemStyle: {
                color: function(params) {
                    const colors = ['#4CAF50', '#FFC107', '#FF9800', '#F44336'];
                    return colors[params.dataIndex];
                },
                borderRadius: [4, 4, 0, 0]
            },
            barWidth: '60%',
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(255,255,255,0.3)'
                }
            }
        }]
    };

    // 设置图表配置
    chart.setOption(option, true);
    console.log(`📊 已更新${townshipName}的长势分类图表`);
}

/**
 * 区域变更事件处理
 */
function onRegionChanged(regionId, regionName) {
    // 更新统计数据显示
    updateRegionStatistics(regionId);

    // 更新作物分布数据
    updateCropDistributionData(regionId);

    // 触发自定义事件
    const event = new CustomEvent('regionChanged', {
        detail: {
            regionId: regionId,
            regionName: regionName,
            regionConfig: regionConfig[regionId]
        }
    });
    document.dispatchEvent(event);
}

/**
 * 更新区域统计数据
 */
function updateRegionStatistics(regionId) {
    const region = regionConfig[regionId];
    if (!region || !region.stats) {
        console.warn(`区域 ${regionId} 的统计数据不存在`);
        return;
    }

    const stats = region.stats;

    // 更新区域面积汇总
    const totalAreaEl = document.querySelector('.summary-item.large .summary-value');
    const coverageEl = document.querySelector('.summary-item.large .summary-subtitle');
    const growthIndexEl = document.querySelector('.summary-row .summary-value');

    if (totalAreaEl) {
        // 添加数字动画效果
        animateNumber(totalAreaEl, parseInt(totalAreaEl.textContent.replace(/,/g, '')), stats.totalArea);
    }

    if (coverageEl) {
        coverageEl.textContent = stats.coverage;
    }

    if (growthIndexEl) {
        animateNumber(growthIndexEl, parseFloat(growthIndexEl.textContent), stats.growthIndex, 2);
    }

    console.log(`📊 已更新 ${region.name} 的统计数据`);
}

/**
 * 更新作物分布数据
 */
function updateCropDistributionData(regionId) {
    const region = regionConfig[regionId];
    if (!region || !region.stats) {
        return;
    }

    const stats = region.stats;

    // 更新作物分布卡片中的数据
    const cropCards = document.querySelectorAll('.crop-card');

    cropCards.forEach(card => {
        const cropType = card.querySelector('.crop-name')?.textContent;
        let area = 0;

        switch(cropType) {
            case '小麦':
                area = stats.wheatArea;
                break;
            case '玉米':
                area = stats.cornArea;
                break;
            case '蔬菜':
                area = stats.vegetableArea;
                break;
            case '土豆':
                area = stats.potatoArea;
                break;
            case '油菜':
                area = stats.rapeseedArea;
                break;
        }

        const areaEl = card.querySelector('.crop-area');
        if (areaEl && area > 0) {
            const currentArea = parseInt(areaEl.textContent.replace(/[^\d]/g, ''));
            animateNumber(areaEl, currentArea, area, 0, ' 亩');
        }
    });

    console.log(`🌾 已更新 ${region.name} 的作物分布数据`);
}

/**
 * 数字动画效果
 */
function animateNumber(element, startValue, endValue, decimals = 0, suffix = '') {
    const duration = 1000; // 动画持续时间
    const startTime = performance.now();

    function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (endValue - startValue) * easeProgress;

        if (decimals > 0) {
            element.textContent = currentValue.toFixed(decimals) + suffix;
        } else {
            element.textContent = Math.round(currentValue).toLocaleString() + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

/**
 * 获取当前选中的区域
 */
function getCurrentRegion() {
    return {
        id: currentSelectedRegion,
        name: regionConfig[currentSelectedRegion]?.name || '全县',
        config: regionConfig[currentSelectedRegion]
    };
}

/**
 * 初始化区域选择器
 */
function initRegionSelector() {
    // 设置默认区域（初始化时不触发地图移动）
    selectRegion('all', '全县', true);

    // 监听键盘快捷键
    document.addEventListener('keydown', function(event) {
        // Ctrl + R 快速切换区域
        if (event.ctrlKey && event.key === 'r') {
            event.preventDefault();
            toggleRegionDropdown();
        }
    });

    console.log('📍 区域选择器初始化完成');
}

// ===== 功能切换模块 =====

/**
 * 初始化功能切换栏
 */
function initFunctionSwitchBar() {
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
                toggleCropLayerSelector(this.classList.contains('active'), this);
                return;
            }
            
            if (functionType === 'device-monitoring') {
                // 设备监控功能
                this.classList.toggle('active');
                const isActive = this.classList.contains('active');
                toggleDeviceMonitoring(isActive);
                console.log(`设备监控: ${isActive ? '开启' : '关闭'}`);
                return;
            }
            
            // 其他功能待实现
            if (functionType !== 'crop-selection') {
                alert(`${this.querySelector('.btn-text').textContent} 功能将在后续步骤中实现`);
                return;
            }
            
            // 多选：切换激活状态
            this.classList.toggle('active');
            
            // 更新叠加功能状态
            updateOverlayFunctionStatus();
            
            console.log(`叠加功能: ${functionType} ${this.classList.contains('active') ? '开启' : '关闭'}`);
        });
    });
}

/**
 * 更新叠加功能状态
 */
function updateOverlayFunctionStatus() {
    // 左侧面板已改为空白看板，叠加功能状态不再显示
    // 功能状态现在只通过顶部功能切换栏的按钮状态来体现
    console.log('叠加功能状态已更新');
}

// ===== 时间更新模块 =====

/**
 * 更新系统时间显示
 */
function updateSystemTime() {
    const now = new Date();
    
    // 格式化时间
    const timeString = now.toLocaleTimeString('zh-CN', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    
    // 格式化日期
    const dateString = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
    
    // 获取星期
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    const weekday = weekdays[now.getDay()];
    
    // 更新显示
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    if (timeElement) {
        timeElement.textContent = `${dateString} ${timeString}`;
    }
    
    if (dateElement) {
        dateElement.textContent = weekday;
    }
}

// ===== 图层控制模块 =====

/**
 * 初始化图层控制交互
 */
function initLayerControls() {
    const layerCheckboxes = document.querySelectorAll('.layer-checkbox');
    
    layerCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            this.classList.toggle('checked');
            
            // 控制地图上的图层显示/隐藏
            const layerName = this.nextElementSibling?.textContent || '未知图层';
            const isVisible = this.classList.contains('checked');
            
            // 地图相关功能已移除，这里只做日志记录
            console.log(`图层切换功能暂时不可用: ${layerName}`);
            console.log(`图层 ${layerName} ${isVisible ? '显示' : '隐藏'}`);
        });
    });
}

/**
 * 初始化透明度滑块交互
 */
function initOpacitySliders() {
    const opacitySliders = document.querySelectorAll('.opacity-slider');
    
    opacitySliders.forEach(slider => {
        slider.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const width = rect.width;
            const percentage = Math.round((clickX / width) * 100);
            
            this.setAttribute('data-value', percentage);
            this.style.setProperty('--width', percentage + '%');
            
            console.log(`透明度调整为: ${percentage}%`);
        });
    });
}

// ===== 面板控制模块 =====

/**
 * 初始化面板折叠功能
 */
function initPanelControls() {
    console.log('🔧 初始化面板折叠功能...');
    const collapseBtns = document.querySelectorAll('.collapse-btn');
    console.log(`找到 ${collapseBtns.length} 个折叠按钮`);
    
    collapseBtns.forEach((btn, index) => {
        console.log(`绑定第 ${index + 1} 个折叠按钮事件`);
        btn.addEventListener('click', function() {
            console.log('🖱️ 折叠按钮被点击');
            const panel = this.closest('.glass-panel');
            if (panel) {
                panel.classList.toggle('collapsed');
                
                // 更新按钮文字
                if (panel.classList.contains('collapsed')) {
                    this.textContent = panel.classList.contains('left-panel') ? '▶' : '◀';
                } else {
                    this.textContent = panel.classList.contains('left-panel') ? '◀' : '▶';
                }
                
                // 如果是右侧面板，调整地图控制按钮位置
                if (panel.classList.contains('right-panel')) {
                    updateMapControlsPosition();
                }
                
                console.log(`✅ 面板${panel.classList.contains('collapsed') ? '折叠' : '展开'}完成`);
            } else {
                console.log('❌ 未找到父级面板');
            }
        });
    });
}

/**
 * 更新地图控制按钮位置
 */
function updateMapControlsPosition() {
    const rightPanel = document.querySelector('.glass-panel.right-panel');
    const mapControls = document.querySelector('.map-controls');
    
    if (rightPanel && mapControls) {
        const isCollapsed = rightPanel.classList.contains('collapsed');
        const rootStyle = getComputedStyle(document.documentElement);
        
        // 获取CSS变量值
        const rightPanelWidth = parseInt(rootStyle.getPropertyValue('--right-panel-width'));
        const collapsedWidth = parseInt(rootStyle.getPropertyValue('--collapsed-panel-width'));
        const panelMargin = parseInt(rootStyle.getPropertyValue('--panel-margin'));
        const panelGap = parseInt(rootStyle.getPropertyValue('--panel-gap'));
        
        // 计算新的位置
        const panelWidth = isCollapsed ? collapsedWidth : rightPanelWidth;
        const newRight = panelWidth + panelMargin + panelGap;
        
        // 应用新位置
        mapControls.style.right = `${newRight}px`;
        
        console.log(`🗺️ 地图控制按钮位置更新: right = ${newRight}px (面板${isCollapsed ? '折叠' : '展开'})`);
    }
}

// ===== 作物图层选择器 =====

// 全局变量，存储事件监听器函数以便移除
let cropSelectorClickHandler = null;

/**
 * 切换作物图层选择器
 */
function toggleCropLayerSelector(show, buttonElement) {
    let selector = document.getElementById('crop-layer-selector');
    
    if (show) {
        // 如果选择器不存在，创建它
        if (!selector) {
            selector = createCropLayerSelector();
            document.body.appendChild(selector);
        }
        
        // 定位选择器到按钮下方
        const buttonRect = buttonElement.getBoundingClientRect();
        selector.style.left = `${buttonRect.left}px`;
        selector.style.top = `${buttonRect.bottom + 5}px`;
        selector.style.display = 'block';
        
        console.log('🌾 显示作物图层选择器');
    } else {
        // 隐藏选择器
        if (selector) {
            selector.style.display = 'none';
        }
        console.log('🌾 隐藏作物图层选择器');
    }
}

/**
 * 创建作物图层选择器
 */
function createCropLayerSelector() {
    const selector = document.createElement('div');
    selector.id = 'crop-layer-selector';
    selector.className = 'crop-layer-selector';
    
    selector.innerHTML = `
        <div class="selector-content">
            <div class="crop-option" data-crop="wheat">
                <input type="radio" name="crop-selection" id="crop-wheat" checked>
                <label for="crop-wheat">
                    <span class="crop-icon">🌾</span>
                    <span class="crop-name">小麦</span>
                </label>
            </div>
            <div class="crop-option" data-crop="corn">
                <input type="radio" name="crop-selection" id="crop-corn">
                <label for="crop-corn">
                    <span class="crop-icon">🌽</span>
                    <span class="crop-name">玉米</span>
                </label>
            </div>
            <div class="crop-option" data-crop="pepper">
                <input type="radio" name="crop-selection" id="crop-pepper">
                <label for="crop-pepper">
                    <span class="crop-icon">🌶️</span>
                    <span class="crop-name">辣椒</span>
                </label>
            </div>
            <div class="crop-option" data-crop="vegetables">
                <input type="radio" name="crop-selection" id="crop-vegetables">
                <label for="crop-vegetables">
                    <span class="crop-icon">🥬</span>
                    <span class="crop-name">蔬菜</span>
                </label>
            </div>
            <div class="crop-option" data-crop="greenhouse">
                <input type="radio" name="crop-selection" id="crop-greenhouse">
                <label for="crop-greenhouse">
                    <span class="crop-icon">🏠</span>
                    <span class="crop-name">大棚</span>
                </label>
            </div>
        </div>
    `;
    
    // 绑定图层切换事件（单选模式）
    selector.addEventListener('change', function(e) {
        if (e.target.type === 'radio') {
            const cropType = e.target.closest('.crop-option').dataset.crop;
            // 单选模式：隐藏所有作物图层，然后显示选中的作物图层
            hideAllCropLayers();
            toggleCropLayer(cropType, true);
            console.log(`🌾 已切换到: ${e.target.closest('.crop-option').querySelector('.crop-name').textContent}`);
        }
    });

    // 初始化时触发默认选中项（小麦）的联动
    setTimeout(() => {
        const defaultSelected = selector.querySelector('input[type="radio"]:checked');
        if (defaultSelected) {
            const cropType = defaultSelected.closest('.crop-option').dataset.crop;
            hideAllCropLayers();
            toggleCropLayer(cropType, true);
            console.log(`🌾 初始化默认选择: ${defaultSelected.closest('.crop-option').querySelector('.crop-name').textContent}`);
        }
    }, 100);
    
    // 移除旧的事件监听器（如果存在）
    if (cropSelectorClickHandler) {
        document.removeEventListener('click', cropSelectorClickHandler);
    }
    
    // 创建新的事件监听器函数
    cropSelectorClickHandler = function(e) {
        if (!selector.contains(e.target) && !e.target.closest('[data-function="crop-selection"]')) {
            const cropButton = document.querySelector('[data-function="crop-selection"]');
            if (cropButton && cropButton.classList.contains('active')) {
                cropButton.classList.remove('active');
                toggleCropLayerSelector(false);
            }
        }
    };
    
    // 绑定新的事件监听器
    document.addEventListener('click', cropSelectorClickHandler);
    
    return selector;
}

/**
 * 切换具体作物图层显示
 */
function toggleCropLayer(cropType, show) {
    console.log(`🌾 ${show ? '显示' : '隐藏'}${cropType}图层`);
    
    // 这里可以调用Cesium地图的图层控制API
    if (typeof window.toggleMapCropLayer === 'function') {
        window.toggleMapCropLayer(cropType, show);
    }
    
    // 更新图层项的视觉状态
    const layerItem = document.querySelector(`[data-crop="${cropType}"]`);
    if (layerItem) {
        if (show) {
            layerItem.classList.add('active');
        } else {
            layerItem.classList.remove('active');
        }
    }

    // 如果显示某个作物图层，更新右侧面板的单作物分布图表
    if (show && typeof window.updateTownCropChart === 'function') {
        window.updateTownCropChart(cropType);
        console.log(`🏘️ 已联动更新${cropType}的乡镇分布图表`);
    }
}

/**
 * 隐藏所有作物图层
 */
function hideAllCropLayers() {
    const cropTypes = ['wheat', 'corn', 'pepper', 'vegetables', 'greenhouse'];
    cropTypes.forEach(cropType => {
        toggleCropLayer(cropType, false);
    });
}

/**
 * 显示所有作物图层
 */
function showAllCropLayers() {
    const cropTypes = ['wheat', 'corn', 'pepper', 'vegetables', 'greenhouse'];
    cropTypes.forEach(cropType => {
        toggleCropLayer(cropType, true);
    });
}


// ===== 系统初始化 =====

/**
 * 页面加载完成后的初始化函数
 */
function initializeSystem() {
    console.log('🚀 开始初始化农情遥感系统大屏...');
    
    // 初始化系统时间显示
    updateSystemTime();
    // 每秒更新时间
    setInterval(updateSystemTime, 1000);
    console.log('⏰ 系统时间模块初始化完成');
    
    // 初始化功能切换模块
    initFunctionSwitchBar();
    console.log('🔄 功能切换模块初始化完成');
    
    // 初始化图层控制
    initLayerControls();
    console.log('🗺️ 图层控制模块初始化完成');
    
    // 初始化透明度滑块
    initOpacitySliders();
    console.log('🎚️ 透明度滑块模块初始化完成');
    
    // 初始化面板控制
    initPanelControls();
    console.log('📋 面板控制模块初始化完成');
    
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
                console.error('❌ Cesium库未加载，请检查网络连接');
                return;
            }
            
            console.log('🗺️ 开始初始化Cesium地图...');
            initCesiumMap();
            
            // 地图初始化完成后，再初始化作物图层
            setTimeout(() => {
                if (window.CropLayers && typeof window.CropLayers.init === 'function') {
                    window.CropLayers.init();
                    console.log('🌾 作物图层模块初始化完成');
                    
                    // 额外的渲染触发，确保场景正常显示（不移动相机）
                    setTimeout(() => {
                        if (window.cesiumViewer) {
                            try {
                                // 强制渲染场景
                                window.cesiumViewer.scene.requestRender();
                                console.log('🎯 已强制触发场景渲染');
                            } catch (error) {
                                console.warn('⚠️ 场景渲染触发失败:', error);
                            }
                        }
                    }, 1000);
                    
                } else {
                    console.warn('⚠️ 作物图层模块未加载');
                }

                // 初始化乡镇地块 - 使用通用初始化函数
                if (window.TownshipBlocks && typeof window.TownshipBlocks.initForPage === 'function') {
                    window.TownshipBlocks.initForPage();
                } else {
                    console.warn('⚠️ 乡镇地块模块未加载');
                }
            }, 3000); // 等待地图完全初始化后再加载作物图层
            
        }, 500); // 增加延迟时间，确保Cesium库完全加载
        console.log('🗺️ Cesium地图模块准备就绪');
    } else {
        console.warn('⚠️ Cesium地图模块未加载');
    }
    
    console.log('✅ 农情遥感系统大屏初始化完成！');
    console.log('🌾 当前功能：作物分布监测');
}

// ===== 事件监听器 =====

// DOM加载完成后初始化系统
document.addEventListener('DOMContentLoaded', initializeSystem);

// 页面可见性变化时的处理
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        console.log('📱 页面进入后台');
    } else {
        console.log('📱 页面回到前台');
        // 页面回到前台时更新时间
        updateSystemTime();
    }
});

// 窗口大小变化时的处理
window.addEventListener('resize', function() {
    console.log('📐 窗口大小发生变化:', window.innerWidth, 'x', window.innerHeight);
    // 这里可以添加响应式布局调整逻辑
});

// 错误处理
window.addEventListener('error', function(e) {
    console.error('❌ 系统发生错误:', e.error);
    console.error('错误位置:', e.filename, ':', e.lineno);
});

// 未处理的Promise拒绝
window.addEventListener('unhandledrejection', function(e) {
    console.error('❌ 未处理的Promise拒绝:', e.reason);
    e.preventDefault(); // 阻止默认的错误处理
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', function(e) {
    console.log('🧹 页面即将卸载，清理资源...');
    
    // 销毁Cesium地图实例
    if (typeof destroyCesiumMap === 'function') {
        destroyCesiumMap();
    }
});

// ===== 诊断功能 =====

let diagnosticMode = false;
let logBuffer = '';

// 劫持console方法来收集日志
const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

function addToLog(message, type = 'log') {
    const timestamp = new Date().toLocaleTimeString();
    logBuffer += `[${timestamp}] ${type.toUpperCase()}: ${message}\n`;
    
    const logElement = document.getElementById('console-log');
    if (logElement) {
        logElement.textContent = logBuffer;
        logElement.scrollTop = logElement.scrollHeight;
    }
    
    // 保持原始功能
    if (type === 'error') originalConsoleError(message);
    else if (type === 'warn') originalConsoleWarn(message);
    else originalConsoleLog(message);
}

// 重写console方法
console.log = (message) => addToLog(message, 'log');
console.error = (message) => addToLog(message, 'error');
console.warn = (message) => addToLog(message, 'warn');

function updateDiagnosticInfo(elementId, text, className = '') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
        element.className = 'info-line ' + className;
    }
}

function toggleDiagnosticMode() {
    diagnosticMode = !diagnosticMode;
    const leftPanel = document.querySelector('.left-panel');
    
    if (diagnosticMode) {
        leftPanel.classList.add('diagnostic-mode-expanded');
        refreshDiagnostic();
        console.log('🔧 诊断模式已启用');
    } else {
        leftPanel.classList.remove('diagnostic-mode-expanded');
        console.log('🔧 诊断模式已禁用');
    }
}

function refreshDiagnostic() {
    if (!window.cesiumViewer) {
        updateDiagnosticInfo('viewer-status', '❌ Viewer未初始化', 'error');
        updateDiagnosticInfo('layer-count', '图层数量: 未知', 'warning');
        updateDiagnosticInfo('scene-mode', '场景模式: 未知', 'warning');
        return;
    }
    
    try {
        // 基础信息
        const viewer = window.cesiumViewer;
        const layers = viewer.imageryLayers;
        const layerCount = layers.length;
        const sceneMode = viewer.scene.mode === Cesium.SceneMode.SCENE2D ? '2D' : 
                        viewer.scene.mode === Cesium.SceneMode.SCENE3D ? '3D' : 'Columbus';
        
        updateDiagnosticInfo('viewer-status', '✅ Viewer运行正常', 'success');
        updateDiagnosticInfo('layer-count', `图层数量: ${layerCount}`, layerCount > 0 ? 'success' : 'warning');
        updateDiagnosticInfo('scene-mode', `场景模式: ${sceneMode}`, 'info');
        
        // 图层详情
        const detailsElement = document.getElementById('layer-details');
        if (detailsElement) {
        let detailsHtml = '';
        
        if (layerCount === 0) {
            detailsHtml = '<div class="info-line warning">没有图层</div>';
        } else {
            for (let i = 0; i < layerCount; i++) {
                const layer = layers.get(i);
                detailsHtml += `<div class="info-line">图层${i}:</div>`;
                
                if (layer) {
                    detailsHtml += `<div class="info-line">  - 对象: ✅</div>`;
                    detailsHtml += `<div class="info-line">  - 可见: ${layer.show}</div>`;
                    detailsHtml += `<div class="info-line">  - 透明度: ${layer.alpha}</div>`;
                    
                    if (layer.imageryProvider) {
                        detailsHtml += `<div class="info-line success">  - 影像提供器: ✅</div>`;
                        
                        let providerName = 'Unknown';
                        let layerType = '';
                        try {
                            if (layer.imageryProvider.constructor && layer.imageryProvider.constructor.name) {
                                providerName = layer.imageryProvider.constructor.name;
                            }
                            
                            // 根据URL判断图层类型
                            if (layer.imageryProvider.url) {
                                const url = layer.imageryProvider.url;
                                if (url.includes('lyrs=s')) {
                                    layerType = ' (卫星)';
                                } else if (url.includes('lyrs=h')) {
                                    layerType = ' (标签)';
                                } else if (url.includes('lyrs=m')) {
                                    layerType = ' (标准)';
                                } else if (url.includes('lyrs=y')) {
                                    layerType = ' (混合)';
                                } else if (url.includes('openstreetmap')) {
                                    layerType = ' (OSM)';
                                }
                            }
                        } catch (e) {
                            providerName = 'Error getting name';
                        }
                        detailsHtml += `<div class="info-line">  - 类型: ${providerName}${layerType}</div>`;
                    } else {
                        detailsHtml += `<div class="info-line error">  - 影像提供器: ❌</div>`;
                    }
                } else {
                    detailsHtml += `<div class="info-line error">  - 对象: ❌</div>`;
                }
            }
        }
        
        detailsElement.innerHTML = detailsHtml;
        }
        
    } catch (error) {
        console.error('诊断刷新失败: ' + error.message);
        updateDiagnosticInfo('viewer-status', '❌ 诊断失败', 'error');
    }
}

function inspectLayers() {
    if (!window.cesiumViewer) return;
    
    console.log('🔬 开始深度检查图层');
    
    const analysisElement = document.getElementById('deep-analysis');
    let analysisHtml = '';
    
    try {
        const layers = window.cesiumViewer.imageryLayers;
        analysisHtml += `<div class="info-line">图层集合: ${layers.constructor.name}</div>`;
        analysisHtml += `<div class="info-line">数量: ${layers.length}</div>`;
        
        for (let i = 0; i < layers.length; i++) {
            analysisHtml += `<div class="info-line"><br/>--- 图层 ${i} ---</div>`;
            
            try {
                const layer = layers.get(i);
                analysisHtml += `<div class="info-line">get(${i}): ${typeof layer}</div>`;
                
                if (layer === null) {
                    analysisHtml += `<div class="info-line error">图层为 null</div>`;
                } else if (layer === undefined) {
                    analysisHtml += `<div class="info-line error">图层为 undefined</div>`;
                } else {
                    analysisHtml += `<div class="info-line success">图层有效</div>`;
                    
                    const props = ['show', 'alpha', 'imageryProvider'];
                    props.forEach(prop => {
                        try {
                            const value = layer[prop];
                            analysisHtml += `<div class="info-line">  ${prop}: ${typeof value} = ${value}</div>`;
                        } catch (propError) {
                            analysisHtml += `<div class="info-line error">  ${prop}: 访问失败</div>`;
                        }
                    });
                }
            } catch (layerError) {
                analysisHtml += `<div class="info-line error">获取图层${i}失败</div>`;
            }
        }
        
    } catch (error) {
        analysisHtml += `<div class="info-line error">深度分析失败: ${error.message}</div>`;
    }
    
    analysisElement.innerHTML = analysisHtml;
    document.getElementById('deep-analysis-section').style.display = 'block';
}

function testLayerAccess() {
    if (!window.cesiumViewer) return;
    
    console.log('🧪 测试图层访问方法');
    
    try {
        const layers = window.cesiumViewer.imageryLayers;
        console.log(`图层数量: ${layers.length}`);
        
        if (layers.length > 0) {
            console.log('测试访问第一个图层:');
            
            try {
                const layer1 = layers.get(0);
                console.log('  方法1 layers.get(0):', typeof layer1, layer1 ? '成功' : '失败');
            } catch (e) {
                console.log('  方法1失败:', e.message);
            }
            
            try {
                const layer2 = layers._layers ? layers._layers[0] : undefined;
                console.log('  方法2 layers._layers[0]:', typeof layer2, layer2 ? '成功' : '失败');
            } catch (e) {
                console.log('  方法2失败:', e.message);
            }
        }
    } catch (error) {
        console.log('测试失败:', error.message);
    }
    
    document.getElementById('console-log-section').style.display = 'block';
}



// ===== 作物图层控制函数 =====

/**
 * 切换作物图层显示/隐藏
 */
function toggleCropLayer(cropType, visible) {
    if (window.CropLayers && typeof window.CropLayers.toggle === 'function') {
        window.CropLayers.toggle(cropType, visible);
        console.log(`🔄 ${cropType}图层${visible ? '显示' : '隐藏'}`);
    }
}

/**
 * 设置作物图层透明度
 */
function setCropOpacity(cropType, opacity) {
    if (window.CropLayers && typeof window.CropLayers.setOpacity === 'function') {
        window.CropLayers.setOpacity(cropType, opacity);
        console.log(`🎨 ${cropType}图层透明度: ${Math.round(opacity * 100)}%`);
    }
}

/**
 * 更新右侧面板的作物统计信息
 */
function updateRightPanelCropStats(stats) {
    const cropTypes = ['wheat', 'corn', 'vegetables', 'greenhouse'];
    const cropNames = {
        wheat: '小麦',
        corn: '玉米', 
        vegetables: '蔬菜',
        greenhouse: '大棚'
    };
    const cropIcons = {
        wheat: '🌾',
        corn: '🌽',
        vegetables: '🥬', 
        greenhouse: '🏠'
    };
    
    // 计算总数量和总面积
    let totalCount = 0;
    let totalArea = 0;
    
    cropTypes.forEach(type => {
        totalCount += stats[type].count;
        totalArea += stats[type].area;
    });
    
    // 更新每种作物的统计信息
    cropTypes.forEach(type => {
        const statsElement = document.getElementById(`${type}-stats`);
        if (statsElement) {
            const count = stats[type].count;
            const area = stats[type].area;
            const percentage = totalArea > 0 ? (area / totalArea * 100).toFixed(1) : 0;
            
            // 更新统计数值
            const valueElement = statsElement.querySelector('.stat-value');
            const labelElement = statsElement.querySelector('.stat-label');
            const progressElement = statsElement.querySelector('.progress-fill');
            
            if (valueElement) valueElement.textContent = count;
            if (labelElement) labelElement.textContent = `${cropIcons[type]} ${cropNames[type]} (${percentage}%)`;
            if (progressElement) progressElement.style.width = `${percentage}%`;
        }
    });
    
    console.log('📊 作物统计信息已更新');
}

// ===== 工具函数 =====

/**
 * 格式化数字显示（添加千分位分隔符）
 * @param {number} num - 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 获取当前时间戳
 * @returns {number} 当前时间戳
 */
function getCurrentTimestamp() {
    return Date.now();
}

/**
 * 延迟执行函数
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise} Promise对象
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} wait - 等待时间
 * @returns {Function} 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} limit - 限制时间
 * @returns {Function} 节流后的函数
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}



// ===== 导出函数（如果需要模块化） =====
// 如果使用ES6模块，可以取消注释以下代码
/*
export {
    showUserProfile,
    showSystemSettings,
    showOperationLog,
    showHelp,
    logout,
    updateSystemTime,
    formatNumber,
    getCurrentTimestamp,
    delay,
    debounce,
    throttle,
    initCropSelector,
    toggleCropSelectorPanel,
    selectAllCrops,
    deselectAllCrops,
    resetCropSelection
};
*/