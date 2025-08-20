/**
 * 时间轴功能模块
 * 负责月份时间节点的显示和数据切换
 */

// 全局变量
let currentMonth = new Date().getMonth() + 1; // 当前月份 (1-12)
let currentYear = new Date().getFullYear(); // 当前年份
let timelineInitialized = false;

// 月份配置数据
const MONTH_CONFIG = {
    1: { name: '1月', label: 'Jan', season: 'winter', hasData: true },
    2: { name: '2月', label: 'Feb', season: 'winter', hasData: true },
    3: { name: '3月', label: 'Mar', season: 'spring', hasData: true },
    4: { name: '4月', label: 'Apr', season: 'spring', hasData: true },
    5: { name: '5月', label: 'May', season: 'spring', hasData: true },
    6: { name: '6月', label: 'Jun', season: 'summer', hasData: true },
    7: { name: '7月', label: 'Jul', season: 'summer', hasData: true },
    8: { name: '8月', label: 'Aug', season: 'summer', hasData: true },
    9: { name: '9月', label: 'Sep', season: 'autumn', hasData: true },
    10: { name: '10月', label: 'Oct', season: 'autumn', hasData: true },
    11: { name: '11月', label: 'Nov', season: 'autumn', hasData: true },
    12: { name: '12月', label: 'Dec', season: 'winter', hasData: true }
};

/**
 * 初始化时间轴
 */
function initTimeline() {
    if (timelineInitialized) {
        console.log('⏰ 时间轴已初始化，跳过重复初始化');
        return;
    }
    
    console.log('⏰ 初始化时间轴...');
    
    try {
        // 创建时间轴HTML结构
        createTimelineHTML();
        
        // 绑定事件监听器
        bindTimelineEvents();
        
        // 设置当前月份为激活状态
        setActiveMonth(currentMonth);
        
        // 更新进度条
        updateTimelineProgress();
        
        timelineInitialized = true;
        console.log('✅ 时间轴初始化完成');
        
    } catch (error) {
        console.error('❌ 时间轴初始化失败:', error);
    }
}

/**
 * 创建时间轴HTML结构
 */
function createTimelineHTML() {
    // 检查是否已存在时间轴
    if (document.getElementById('timeline-container')) {
        console.log('⏰ 时间轴HTML已存在，跳过创建');
        return;
    }
    
    const timelineHTML = `
        <div class="timeline-container" id="timeline-container">
            <div class="timeline-header">
                <div class="timeline-title">
                    <span>📅</span>
                    <span>时间轴</span>
                </div>
                <div class="timeline-controls">
                    <span class="timeline-year">${currentYear}年</span>
                </div>
            </div>
            <div class="timeline-track">
                <div class="timeline-line"></div>
                <div class="timeline-progress" id="timeline-progress"></div>
                <div class="current-time-indicator" id="current-time-indicator"></div>
                <div class="timeline-months" id="timeline-months">
                    ${generateMonthNodes()}
                </div>
            </div>
        </div>
    `;
    
    // 添加到页面底部
    document.body.insertAdjacentHTML('beforeend', timelineHTML);
    console.log('📅 时间轴HTML结构创建完成');
}

/**
 * 生成月份节点HTML
 */
function generateMonthNodes() {
    let monthsHTML = '';
    
    for (let month = 1; month <= 12; month++) {
        const config = MONTH_CONFIG[month];
        const isActive = month === currentMonth ? 'active' : '';
        const hasData = config.hasData ? 'has-data' : '';
        
        monthsHTML += `
            <div class="month-node ${isActive} ${hasData}" 
                 data-month="${month}" 
                 onclick="selectMonth(${month})">
                <div class="month-dot"></div>
                <div class="month-label">${config.name}</div>
                <div class="data-change-indicator">点击查看${config.name}数据</div>
            </div>
        `;
    }
    
    return monthsHTML;
}

/**
 * 绑定时间轴事件监听器
 */
function bindTimelineEvents() {
    // 键盘事件监听
    document.addEventListener('keydown', function(event) {
        if (event.key === 'ArrowLeft') {
            selectPreviousMonth();
        } else if (event.key === 'ArrowRight') {
            selectNextMonth();
        }
    });
    
    console.log('🎮 时间轴事件监听器绑定完成');
}

/**
 * 选择月份
 */
function selectMonth(month) {
    if (month < 1 || month > 12) {
        console.warn('⚠️ 无效的月份:', month);
        return;
    }
    
    console.log(`📅 选择月份: ${month}月`);
    
    // 更新当前月份
    const previousMonth = currentMonth;
    currentMonth = month;
    
    // 更新UI状态
    updateMonthSelection();
    
    // 更新进度条
    updateTimelineProgress();
    
    // 触发数据更新事件
    onMonthChanged(month, previousMonth);
    
    console.log(`✅ 月份切换完成: ${previousMonth}月 → ${month}月`);
}

/**
 * 更新月份选择状态
 */
function updateMonthSelection() {
    const monthNodes = document.querySelectorAll('.month-node');
    
    monthNodes.forEach(node => {
        const month = parseInt(node.getAttribute('data-month'));
        
        if (month === currentMonth) {
            node.classList.add('active');
        } else {
            node.classList.remove('active');
        }
    });
}

/**
 * 更新时间轴进度条
 */
function updateTimelineProgress() {
    const progressBar = document.getElementById('timeline-progress');
    const indicator = document.getElementById('current-time-indicator');

    if (!progressBar || !indicator) return;

    // 计算进度百分比
    const progress = ((currentMonth - 1) / 11) * 100;

    // 更新进度条宽度，限制在容器范围内
    const maxWidth = Math.min(progress, 95); // 最大95%，避免超出容器
    progressBar.style.width = `${maxWidth}%`;

    // 更新指示器位置，确保在有效范围内
    const indicatorPosition = 20 + (progress / 100) * 60; // 限制在20px到80px之间
    indicator.style.left = `${Math.min(indicatorPosition, 75)}%`;

    console.log(`📊 时间轴进度更新: ${progress.toFixed(1)}%`);
}

/**
 * 设置激活月份
 */
function setActiveMonth(month) {
    currentMonth = month;
    updateMonthSelection();
    updateTimelineProgress();
}

/**
 * 选择上一个月
 */
function selectPreviousMonth() {
    const newMonth = currentMonth > 1 ? currentMonth - 1 : 12;
    selectMonth(newMonth);
}

/**
 * 选择下一个月
 */
function selectNextMonth() {
    const newMonth = currentMonth < 12 ? currentMonth + 1 : 1;
    selectMonth(newMonth);
}

/**
 * 月份变更事件处理
 */
function onMonthChanged(newMonth, previousMonth) {
    console.log(`🔄 月份变更事件: ${previousMonth}月 → ${newMonth}月`);
    
    // 触发数据更新
    updateDataForMonth(newMonth);
    
    // 触发图表更新
    if (typeof updateChartsForMonth === 'function') {
        updateChartsForMonth(newMonth);
    }
    
    // 触发乡镇地块数据更新
    if (typeof updateTownshipDataForMonth === 'function') {
        updateTownshipDataForMonth(newMonth);
    }
    
    // 触发长势图表更新
    if (typeof updateTownCropChart === 'function' && typeof currentSelectedRegion !== 'undefined') {
        updateTownCropChart(currentSelectedRegion, currentChartType || 'bar');
    }
    
    // 显示数据变化提示
    showDataChangeNotification(newMonth);
}

/**
 * 更新指定月份的数据
 */
function updateDataForMonth(month) {
    console.log(`📊 更新${month}月数据...`);
    
    // 这里可以调用具体的数据更新函数
    // 例如更新作物分布数据、长势分析数据、气象数据等
    
    // 模拟数据更新延迟
    setTimeout(() => {
        console.log(`✅ ${month}月数据更新完成`);
    }, 500);
}

/**
 * 显示数据变化通知
 */
function showDataChangeNotification(month) {
    const monthName = MONTH_CONFIG[month].name;
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(60, 60, 60, 0.9);
        backdrop-filter: blur(15px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #FFFFFF;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: bold;
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    notification.textContent = `📅 已切换到${monthName}数据`;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 3000);
}

/**
 * 自动播放功能
 */
let autoPlayInterval = null;
let isAutoPlaying = false;

function toggleAutoPlay() {
    if (isAutoPlaying) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
}

function startAutoPlay() {
    if (autoPlayInterval) return;
    
    isAutoPlaying = true;
    autoPlayInterval = setInterval(() => {
        selectNextMonth();
    }, 2000); // 每2秒切换一次
    
    // 更新按钮状态
    const btn = document.querySelector('.timeline-control-btn');
    if (btn) {
        btn.textContent = '停止播放';
        btn.classList.add('active');
    }
    
    console.log('▶️ 自动播放已开始');
}

function stopAutoPlay() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    
    isAutoPlaying = false;
    
    // 更新按钮状态
    const btn = document.querySelector('.timeline-control-btn');
    if (btn) {
        btn.textContent = '自动播放';
        btn.classList.remove('active');
    }
    
    console.log('⏸️ 自动播放已停止');
}

/**
 * 重置时间轴
 */
function resetTimeline() {
    stopAutoPlay();
    const realCurrentMonth = new Date().getMonth() + 1;
    selectMonth(realCurrentMonth);
    console.log('🔄 时间轴已重置到当前月份');
}

/**
 * 获取当前选择的月份
 */
function getCurrentMonth() {
    return currentMonth;
}

/**
 * 获取月份配置信息
 */
function getMonthConfig(month) {
    return MONTH_CONFIG[month] || null;
}

// 导出函数供外部调用
window.Timeline = {
    init: initTimeline,
    selectMonth: selectMonth,
    getCurrentMonth: getCurrentMonth,
    getMonthConfig: getMonthConfig,
    setActiveMonth: setActiveMonth,
    toggleAutoPlay: toggleAutoPlay,
    resetTimeline: resetTimeline
};
