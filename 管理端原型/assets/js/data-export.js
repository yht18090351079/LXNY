/**
 * 数据导出页面JavaScript
 * 负责数据导出配置、预览和任务管理
 */

// 全局变量
let exportConfig = {
    dataSources: [],
    format: 'excel',
    fileName: '农情遥感数据导出',
    dateRange: { start: null, end: null },
    region: 'all',
    quality: ['excellent', 'good'],
    includeMetadata: true,
    compress: false
};

let exportTasks = [];
let previewData = [];
let currentExportTask = null;

// 页面初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    setupEventListeners();
    loadPreviewData();
    loadExportTasks();
    updateExportSummary();
});

/**
 * 初始化页面
 */
function initializePage() {
    // 初始化侧边栏
    initializeSidebar();
    
    // 初始化用户下拉菜单
    initializeUserDropdown();
    
    // 设置默认日期范围
    setupDefaultDateRange();
    
    // 初始化数据源选择
    initializeDataSources();
    
    console.log('数据导出页面初始化完成');
}

/**
 * 设置默认日期范围
 */
function setupDefaultDateRange() {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    
    document.getElementById('startDate').value = startDate.toISOString().split('T')[0];
    document.getElementById('endDate').value = endDate.toISOString().split('T')[0];
    
    exportConfig.dateRange.start = startDate;
    exportConfig.dateRange.end = endDate;
}

/**
 * 初始化数据源选择
 */
function initializeDataSources() {
    // 默认选中Landsat数据
    exportConfig.dataSources = ['landsat'];
    
    // 设置分类复选框事件
    setupCategoryCheckboxes();
    
    // 更新选中状态
    updateDataSourceSelection();
}

/**
 * 设置分类复选框事件
 */
function setupCategoryCheckboxes() {
    const categories = ['remoteSensingCategory', 'weatherCategory', 'sensorCategory', 'cropCategory'];
    
    categories.forEach(categoryId => {
        const categoryCheckbox = document.getElementById(categoryId);
        if (categoryCheckbox) {
            categoryCheckbox.addEventListener('change', function() {
                const sourceGroup = this.closest('.source-group');
                const sourceItems = sourceGroup.querySelectorAll('.source-item input[type="checkbox"]');
                
                sourceItems.forEach(item => {
                    item.checked = this.checked;
                });
                
                updateDataSourceSelection();
            });
        }
    });
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 数据源选择
    const dataSourceCheckboxes = document.querySelectorAll('input[name="dataSource"]');
    dataSourceCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleDataSourceChange);
    });
    
    // 导出格式选择
    const formatRadios = document.querySelectorAll('input[name="exportFormat"]');
    formatRadios.forEach(radio => {
        radio.addEventListener('change', handleFormatChange);
    });
    
    // 文件名称输入
    const exportName = document.getElementById('exportName');
    if (exportName) {
        exportName.addEventListener('input', handleFileNameChange);
    }
    
    // 日期范围选择
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    if (startDate) startDate.addEventListener('change', handleDateRangeChange);
    if (endDate) endDate.addEventListener('change', handleDateRangeChange);
    
    // 区域筛选
    const regionFilter = document.getElementById('regionFilter');
    if (regionFilter) {
        regionFilter.addEventListener('change', handleRegionChange);
    }
    
    // 数据质量筛选
    const qualityCheckboxes = document.querySelectorAll('.quality-filter input[type="checkbox"]');
    qualityCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleQualityChange);
    });
    
    // 其他选项
    const includeMetadata = document.getElementById('includeMetadata');
    const compressFile = document.getElementById('compressFile');
    if (includeMetadata) includeMetadata.addEventListener('change', handleMetadataChange);
    if (compressFile) compressFile.addEventListener('change', handleCompressChange);
    
    // 按钮事件
    setupButtonListeners();
    
    // 预览标签页
    setupPreviewTabs();
    
    // 模态框事件
    setupModalListeners();
    
    // 全选数据源
    const selectAllSources = document.getElementById('selectAllSources');
    if (selectAllSources) {
        selectAllSources.addEventListener('click', handleSelectAllSources);
    }
    
    // 刷新预览
    const refreshPreview = document.getElementById('refreshPreview');
    if (refreshPreview) {
        refreshPreview.addEventListener('click', handleRefreshPreview);
    }
}

/**
 * 设置按钮监听器
 */
function setupButtonListeners() {
    // 模板按钮
    const templateBtn = document.getElementById('templateBtn');
    if (templateBtn) {
        templateBtn.addEventListener('click', handleLoadTemplate);
    }
    
    // 快速导出
    const quickExportBtn = document.getElementById('quickExportBtn');
    if (quickExportBtn) {
        quickExportBtn.addEventListener('click', handleQuickExport);
    }
    
    // 保存模板
    const saveTemplateBtn = document.getElementById('saveTemplateBtn');
    if (saveTemplateBtn) {
        saveTemplateBtn.addEventListener('click', handleSaveTemplate);
    }
    
    // 预览导出
    const previewExportBtn = document.getElementById('previewExportBtn');
    if (previewExportBtn) {
        previewExportBtn.addEventListener('click', handlePreviewExport);
    }
    
    // 开始导出
    const startExportBtn = document.getElementById('startExportBtn');
    if (startExportBtn) {
        startExportBtn.addEventListener('click', handleStartExport);
    }
    
    // 清理已完成任务
    const clearCompletedTasks = document.getElementById('clearCompletedTasks');
    if (clearCompletedTasks) {
        clearCompletedTasks.addEventListener('click', handleClearCompletedTasks);
    }
}

/**
 * 处理数据源选择变化
 */
function handleDataSourceChange(event) {
    const value = event.target.value;
    const checked = event.target.checked;
    
    if (checked) {
        if (!exportConfig.dataSources.includes(value)) {
            exportConfig.dataSources.push(value);
        }
    } else {
        exportConfig.dataSources = exportConfig.dataSources.filter(source => source !== value);
    }
    
    updateDataSourceSelection();
    updateExportSummary();
    updatePreviewData();
}

/**
 * 更新数据源选择状态
 */
function updateDataSourceSelection() {
    // 更新分类复选框状态
    const categories = [
        { id: 'remoteSensingCategory', sources: ['landsat', 'sentinel', 'modis'] },
        { id: 'weatherCategory', sources: ['temperature', 'precipitation', 'humidity'] },
        { id: 'sensorCategory', sources: ['soil', 'camera'] },
        { id: 'cropCategory', sources: ['growth', 'yield'] }
    ];
    
    categories.forEach(category => {
        const categoryCheckbox = document.getElementById(category.id);
        if (categoryCheckbox) {
            const checkedSources = category.sources.filter(source => 
                exportConfig.dataSources.includes(source)
            );
            
            if (checkedSources.length === 0) {
                categoryCheckbox.checked = false;
                categoryCheckbox.indeterminate = false;
            } else if (checkedSources.length === category.sources.length) {
                categoryCheckbox.checked = true;
                categoryCheckbox.indeterminate = false;
            } else {
                categoryCheckbox.checked = false;
                categoryCheckbox.indeterminate = true;
            }
        }
    });
}

/**
 * 处理导出格式变化
 */
function handleFormatChange(event) {
    exportConfig.format = event.target.value;
    updateExportSummary();
    showNotification(`已切换到${getFormatName(exportConfig.format)}格式`, 'success');
}

/**
 * 获取格式名称
 */
function getFormatName(format) {
    const formatNames = {
        excel: 'Excel',
        csv: 'CSV',
        json: 'JSON',
        pdf: 'PDF'
    };
    return formatNames[format] || format.toUpperCase();
}

/**
 * 处理文件名称变化
 */
function handleFileNameChange(event) {
    exportConfig.fileName = event.target.value || '农情遥感数据导出';
}

/**
 * 处理日期范围变化
 */
function handleDateRangeChange() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        if (new Date(startDate) > new Date(endDate)) {
            showNotification('开始日期不能大于结束日期', 'error');
            return;
        }
        
        exportConfig.dateRange.start = new Date(startDate);
        exportConfig.dateRange.end = new Date(endDate);
        
        updateExportSummary();
        updatePreviewData();
        showNotification('日期范围已更新', 'success');
    }
}

/**
 * 处理区域变化
 */
function handleRegionChange(event) {
    exportConfig.region = event.target.value;
    updateExportSummary();
    updatePreviewData();
}

/**
 * 处理数据质量变化
 */
function handleQualityChange(event) {
    const value = event.target.value;
    const checked = event.target.checked;
    
    if (checked) {
        if (!exportConfig.quality.includes(value)) {
            exportConfig.quality.push(value);
        }
    } else {
        exportConfig.quality = exportConfig.quality.filter(quality => quality !== value);
    }
    
    updateExportSummary();
    updatePreviewData();
}

/**
 * 处理元数据选项变化
 */
function handleMetadataChange(event) {
    exportConfig.includeMetadata = event.target.checked;
    updateExportSummary();
}

/**
 * 处理压缩选项变化
 */
function handleCompressChange(event) {
    exportConfig.compress = event.target.checked;
    updateExportSummary();
}

/**
 * 处理全选数据源
 */
function handleSelectAllSources() {
    const allCheckboxes = document.querySelectorAll('input[name="dataSource"]');
    const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
    
    allCheckboxes.forEach(checkbox => {
        checkbox.checked = !allChecked;
    });
    
    if (allChecked) {
        exportConfig.dataSources = [];
    } else {
        exportConfig.dataSources = Array.from(allCheckboxes).map(cb => cb.value);
    }
    
    updateDataSourceSelection();
    updateExportSummary();
    updatePreviewData();
    
    showNotification(allChecked ? '已取消全选' : '已全选数据源', 'success');
}

/**
 * 处理刷新预览
 */
function handleRefreshPreview() {
    const refreshBtn = document.getElementById('refreshPreview');
    const icon = refreshBtn.querySelector('i');
    
    icon.classList.add('fa-spin');
    
    setTimeout(() => {
        updatePreviewData();
        icon.classList.remove('fa-spin');
        showNotification('预览数据已刷新', 'success');
    }, 1000);
}

/**
 * 处理加载模板
 */
function handleLoadTemplate() {
    // 模拟加载模板
    const templates = [
        {
            name: '遥感数据标准导出',
            config: {
                dataSources: ['landsat', 'sentinel'],
                format: 'excel',
                quality: ['excellent', 'good'],
                includeMetadata: true,
                compress: false
            }
        },
        {
            name: '气象数据完整导出',
            config: {
                dataSources: ['temperature', 'precipitation', 'humidity'],
                format: 'csv',
                quality: ['excellent', 'good', 'warning'],
                includeMetadata: true,
                compress: true
            }
        }
    ];
    
    // 简单实现：加载第一个模板
    const template = templates[0];
    applyTemplate(template);
    showNotification(`已加载模板：${template.name}`, 'success');
}

/**
 * 应用模板
 */
function applyTemplate(template) {
    // 更新配置
    Object.assign(exportConfig, template.config);
    
    // 更新UI
    updateUIFromConfig();
    updateExportSummary();
    updatePreviewData();
}

/**
 * 根据配置更新UI
 */
function updateUIFromConfig() {
    // 更新数据源选择
    const dataSourceCheckboxes = document.querySelectorAll('input[name="dataSource"]');
    dataSourceCheckboxes.forEach(checkbox => {
        checkbox.checked = exportConfig.dataSources.includes(checkbox.value);
    });
    
    // 更新格式选择
    const formatRadio = document.querySelector(`input[name="exportFormat"][value="${exportConfig.format}"]`);
    if (formatRadio) formatRadio.checked = true;
    
    // 更新质量选择
    const qualityCheckboxes = document.querySelectorAll('.quality-filter input[type="checkbox"]');
    qualityCheckboxes.forEach(checkbox => {
        checkbox.checked = exportConfig.quality.includes(checkbox.value);
    });
    
    // 更新其他选项
    const includeMetadata = document.getElementById('includeMetadata');
    const compressFile = document.getElementById('compressFile');
    if (includeMetadata) includeMetadata.checked = exportConfig.includeMetadata;
    if (compressFile) compressFile.checked = exportConfig.compress;
    
    updateDataSourceSelection();
}

/**
 * 处理快速导出
 */
async function handleQuickExport() {
    if (exportConfig.dataSources.length === 0) {
        showNotification('请至少选择一个数据源', 'warning');
        return;
    }
    
    try {
        // 使用默认配置快速导出
        const taskId = generateTaskId();
        const task = {
            id: taskId,
            name: `快速导出_${new Date().toLocaleString()}`,
            config: { ...exportConfig },
            status: 'running',
            progress: 0,
            startTime: new Date(),
            estimatedRecords: calculateEstimatedRecords()
        };
        
        exportTasks.unshift(task);
        updateExportTasksList();
        
        // 开始导出过程
        await startExportProcess(task);
        
    } catch (error) {
        console.error('快速导出失败:', error);
        showNotification('快速导出失败，请重试', 'error');
    }
}

/**
 * 处理保存模板
 */
function handleSaveTemplate() {
    if (exportConfig.dataSources.length === 0) {
        showNotification('请至少选择一个数据源', 'warning');
        return;
    }
    
    // 显示模板保存模态框
    const modal = document.getElementById('templateModal');
    modal.classList.add('show');
}

/**
 * 处理预览导出
 */
function handlePreviewExport() {
    if (exportConfig.dataSources.length === 0) {
        showNotification('请至少选择一个数据源', 'warning');
        return;
    }
    
    // 切换到表格预览标签
    switchPreviewTab('table');
    
    // 滚动到预览区域
    const previewCard = document.querySelector('.content-card.full-width');
    if (previewCard) {
        previewCard.scrollIntoView({ behavior: 'smooth' });
    }
    
    showNotification('预览数据已更新', 'success');
}

/**
 * 处理开始导出
 */
async function handleStartExport() {
    if (exportConfig.dataSources.length === 0) {
        showNotification('请至少选择一个数据源', 'warning');
        return;
    }
    
    try {
        const taskId = generateTaskId();
        const task = {
            id: taskId,
            name: exportConfig.fileName,
            config: { ...exportConfig },
            status: 'running',
            progress: 0,
            startTime: new Date(),
            estimatedRecords: calculateEstimatedRecords()
        };
        
        exportTasks.unshift(task);
        updateExportTasksList();
        
        // 显示进度模态框
        showExportProgress(task);
        
        // 开始导出过程
        await startExportProcess(task);
        
    } catch (error) {
        console.error('导出失败:', error);
        showNotification('导出失败，请重试', 'error');
    }
}

/**
 * 处理清理已完成任务
 */
function handleClearCompletedTasks() {
    const completedTasks = exportTasks.filter(task => task.status === 'completed');
    
    if (completedTasks.length === 0) {
        showNotification('没有已完成的任务', 'info');
        return;
    }
    
    exportTasks = exportTasks.filter(task => task.status !== 'completed');
    updateExportTasksList();
    showNotification(`已清理${completedTasks.length}个已完成任务`, 'success');
}

/**
 * 开始导出过程
 */
async function startExportProcess(task) {
    currentExportTask = task;
    
    try {
        // 模拟导出过程
        for (let i = 0; i <= 100; i += 5) {
            if (task.status === 'cancelled') {
                break;
            }
            
            if (task.status === 'paused') {
                // 等待恢复
                while (task.status === 'paused') {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }
            
            task.progress = i;
            updateTaskProgress(task);
            
            if (document.getElementById('exportProgressModal').classList.contains('show')) {
                updateProgressModal(task);
            }
            
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        if (task.status !== 'cancelled') {
            task.status = 'completed';
            task.endTime = new Date();
            task.downloadUrl = generateDownloadUrl(task);
            
            updateTaskProgress(task);
            showNotification(`导出任务"${task.name}"已完成`, 'success');
            
            // 自动下载文件
            if (task.downloadUrl) {
                downloadFile(task.downloadUrl, generateFileName(task));
            }
        }
        
    } catch (error) {
        task.status = 'failed';
        task.error = error.message;
        updateTaskProgress(task);
        showNotification(`导出任务"${task.name}"失败`, 'error');
    } finally {
        currentExportTask = null;
        hideExportProgress();
    }
}

/**
 * 显示导出进度
 */
function showExportProgress(task) {
    const modal = document.getElementById('exportProgressModal');
    modal.classList.add('show');
    
    // 初始化进度信息
    updateProgressModal(task);
}

/**
 * 更新进度模态框
 */
function updateProgressModal(task) {
    document.getElementById('progressTitle').textContent = `导出任务：${task.name}`;
    document.getElementById('progressDetails').textContent = getProgressDetails(task);
    document.getElementById('progressFill').style.width = `${task.progress}%`;
    document.getElementById('progressText').textContent = `${task.progress}%`;
    document.getElementById('processedCount').textContent = Math.floor(task.estimatedRecords * task.progress / 100);
    document.getElementById('totalCount').textContent = task.estimatedRecords;
    document.getElementById('remainingTime').textContent = calculateRemainingTime(task);
}

/**
 * 获取进度详情
 */
function getProgressDetails(task) {
    if (task.progress === 0) return '正在初始化导出任务...';
    if (task.progress < 20) return '正在读取数据源...';
    if (task.progress < 60) return '正在处理数据...';
    if (task.progress < 90) return '正在生成文件...';
    if (task.progress < 100) return '正在完成导出...';
    return '导出完成';
}

/**
 * 计算剩余时间
 */
function calculateRemainingTime(task) {
    if (task.progress === 0) return '--';
    
    const elapsed = (new Date() - task.startTime) / 1000; // 秒
    const rate = task.progress / elapsed;
    const remaining = (100 - task.progress) / rate;
    
    if (remaining < 60) {
        return `${Math.ceil(remaining)}秒`;
    } else if (remaining < 3600) {
        return `${Math.ceil(remaining / 60)}分钟`;
    } else {
        return `${Math.ceil(remaining / 3600)}小时`;
    }
}

/**
 * 隐藏导出进度
 */
function hideExportProgress() {
    const modal = document.getElementById('exportProgressModal');
    modal.classList.remove('show');
}

/**
 * 设置预览标签页
 */
function setupPreviewTabs() {
    const tabBtns = document.querySelectorAll('.preview-tab');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchPreviewTab(tabName);
        });
    });
}

/**
 * 切换预览标签页
 */
function switchPreviewTab(tabName) {
    // 更新标签按钮状态
    document.querySelectorAll('.preview-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // 更新标签页内容
    document.querySelectorAll('.preview-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById(`${tabName}Preview`).classList.add('active');
    
    // 加载对应的数据
    switch (tabName) {
        case 'table':
            updateTablePreview();
            break;
        case 'structure':
            updateStructurePreview();
            break;
        case 'statistics':
            updateStatisticsPreview();
            break;
    }
}

/**
 * 设置模态框监听器
 */
function setupModalListeners() {
    // 进度模态框
    const closeProgressModal = document.getElementById('closeProgressModal');
    if (closeProgressModal) {
        closeProgressModal.addEventListener('click', () => {
            document.getElementById('exportProgressModal').classList.remove('show');
        });
    }
    
    const pauseExportBtn = document.getElementById('pauseExportBtn');
    if (pauseExportBtn) {
        pauseExportBtn.addEventListener('click', handlePauseExport);
    }
    
    const cancelExportBtn = document.getElementById('cancelExportBtn');
    if (cancelExportBtn) {
        cancelExportBtn.addEventListener('click', handleCancelExport);
    }
    
    // 模板模态框
    const closeTemplateModal = document.getElementById('closeTemplateModal');
    if (closeTemplateModal) {
        closeTemplateModal.addEventListener('click', () => {
            document.getElementById('templateModal').classList.remove('show');
        });
    }
    
    const cancelTemplateBtn = document.getElementById('cancelTemplateBtn');
    if (cancelTemplateBtn) {
        cancelTemplateBtn.addEventListener('click', () => {
            document.getElementById('templateModal').classList.remove('show');
        });
    }
    
    const saveTemplateConfirmBtn = document.getElementById('saveTemplateConfirmBtn');
    if (saveTemplateConfirmBtn) {
        saveTemplateConfirmBtn.addEventListener('click', handleSaveTemplateConfirm);
    }
}

/**
 * 处理暂停导出
 */
function handlePauseExport() {
    if (currentExportTask) {
        if (currentExportTask.status === 'running') {
            currentExportTask.status = 'paused';
            document.getElementById('pauseExportBtn').innerHTML = '<i class="fas fa-play"></i> 继续';
            showNotification('导出任务已暂停', 'info');
        } else if (currentExportTask.status === 'paused') {
            currentExportTask.status = 'running';
            document.getElementById('pauseExportBtn').innerHTML = '<i class="fas fa-pause"></i> 暂停';
            showNotification('导出任务已继续', 'info');
        }
        
        updateTaskProgress(currentExportTask);
    }
}

/**
 * 处理取消导出
 */
function handleCancelExport() {
    if (currentExportTask) {
        currentExportTask.status = 'cancelled';
        updateTaskProgress(currentExportTask);
        hideExportProgress();
        showNotification('导出任务已取消', 'warning');
    }
}

/**
 * 处理保存模板确认
 */
function handleSaveTemplateConfirm() {
    const templateName = document.getElementById('templateName').value.trim();
    const templateDescription = document.getElementById('templateDescription').value.trim();
    
    if (!templateName) {
        showNotification('请输入模板名称', 'warning');
        return;
    }
    
    // 模拟保存模板
    const template = {
        id: generateTaskId(),
        name: templateName,
        description: templateDescription,
        config: { ...exportConfig },
        createTime: new Date()
    };
    
    // 这里应该保存到服务器或本地存储
    console.log('保存模板:', template);
    
    // 关闭模态框
    document.getElementById('templateModal').classList.remove('show');
    
    // 清空表单
    document.getElementById('templateName').value = '';
    document.getElementById('templateDescription').value = '';
    
    showNotification(`模板"${templateName}"保存成功`, 'success');
}

/**
 * 加载预览数据
 */
function loadPreviewData() {
    // 模拟预览数据
    previewData = [
        {
            source: 'Landsat影像',
            time: '2024-01-15 14:30:25',
            region: '北部地区',
            value: '0.85',
            quality: 'excellent'
        },
        {
            source: 'Landsat影像',
            time: '2024-01-15 13:45:12',
            region: '南部地区',
            value: '0.78',
            quality: 'good'
        },
        {
            source: 'Landsat影像',
            time: '2024-01-15 12:20:45',
            region: '东部地区',
            value: '0.92',
            quality: 'excellent'
        },
        {
            source: 'Landsat影像',
            time: '2024-01-15 11:15:30',
            region: '西部地区',
            value: '0.65',
            quality: 'warning'
        },
        {
            source: 'Landsat影像',
            time: '2024-01-15 10:30:15',
            region: '中部地区',
            value: '0.88',
            quality: 'good'
        }
    ];
    
    updatePreviewData();
}

/**
 * 更新预览数据
 */
function updatePreviewData() {
    // 根据当前配置筛选数据
    const filteredData = previewData.filter(item => {
        // 这里应该根据实际配置进行筛选
        return exportConfig.quality.includes(item.quality);
    });
    
    // 更新预览计数
    document.getElementById('previewCount').textContent = filteredData.length.toLocaleString();
    
    // 更新表格预览
    updateTablePreview(filteredData);
}

/**
 * 更新表格预览
 */
function updateTablePreview(data = previewData) {
    const tbody = document.getElementById('previewTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = data.slice(0, 10).map(item => `
        <tr>
            <td>${item.source}</td>
            <td>${item.time}</td>
            <td>${item.region}</td>
            <td>${item.value}</td>
            <td>
                <span class="quality-badge ${item.quality}">
                    ${getQualityText(item.quality)}
                </span>
            </td>
        </tr>
    `).join('');
}

/**
 * 更新数据结构预览
 */
function updateStructurePreview() {
    const structureTree = document.getElementById('structureTree');
    if (!structureTree) return;
    
    const structure = {
        '数据根目录': {
            '遥感数据': {
                'Landsat影像': '1,247条记录',
                'Sentinel-2数据': '892条记录',
                'MODIS数据': '1,567条记录'
            },
            '气象数据': {
                '温度数据': '2,156条记录',
                '降水数据': '1,890条记录',
                '湿度数据': '1,678条记录'
            },
            '传感器数据': {
                '土壤传感器': '3,245条记录',
                '监控摄像头': '1,234条记录'
            },
            '作物数据': {
                '生长监测数据': '1,567条记录',
                '产量预估数据': '892条记录'
            }
        }
    };
    
    structureTree.innerHTML = renderStructureTree(structure);
}

/**
 * 渲染数据结构树
 */
function renderStructureTree(obj, level = 0) {
    let html = '';
    
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'object') {
            html += `
                <div class="tree-node" style="margin-left: ${level * 20}px">
                    <i class="fas fa-folder tree-icon"></i>
                    <span class="tree-label">${key}</span>
                    ${renderStructureTree(value, level + 1)}
                </div>
            `;
        } else {
            html += `
                <div class="tree-leaf" style="margin-left: ${level * 20}px">
                    <i class="fas fa-file tree-icon"></i>
                    <span class="tree-label">${key}</span>
                    <span class="tree-value">${value}</span>
                </div>
            `;
        }
    }
    
    return html;
}

/**
 * 更新统计信息预览
 */
function updateStatisticsPreview() {
    const statisticsGrid = document.getElementById('statisticsGrid');
    if (!statisticsGrid) return;
    
    const statistics = [
        { label: '总记录数', value: '12,456', icon: 'fas fa-database' },
        { label: '数据源数量', value: '9', icon: 'fas fa-server' },
        { label: '时间跨度', value: '30天', icon: 'fas fa-calendar' },
        { label: '覆盖区域', value: '5个', icon: 'fas fa-map' },
        { label: '数据质量', value: '94.2%', icon: 'fas fa-check-circle' },
        { label: '文件大小', value: '2.5MB', icon: 'fas fa-file' }
    ];
    
    statisticsGrid.innerHTML = statistics.map(stat => `
        <div class="stat-card">
            <div class="stat-icon">
                <i class="${stat.icon}"></i>
            </div>
            <div class="stat-info">
                <div class="stat-label">${stat.label}</div>
                <div class="stat-value">${stat.value}</div>
            </div>
        </div>
    `).join('');
}

/**
 * 加载导出任务
 */
function loadExportTasks() {
    // 模拟已有的导出任务
    exportTasks = [
        {
            id: 'task_001',
            name: '遥感数据月度报告',
            config: { format: 'excel', dataSources: ['landsat', 'sentinel'] },
            status: 'completed',
            progress: 100,
            startTime: new Date(Date.now() - 3600000),
            endTime: new Date(Date.now() - 3000000),
            estimatedRecords: 1247,
            downloadUrl: '#'
        },
        {
            id: 'task_002',
            name: '气象数据导出',
            config: { format: 'csv', dataSources: ['temperature', 'precipitation'] },
            status: 'failed',
            progress: 45,
            startTime: new Date(Date.now() - 7200000),
            estimatedRecords: 2156,
            error: '网络连接超时'
        }
    ];
    
    updateExportTasksList();
}

/**
 * 更新导出任务列表
 */
function updateExportTasksList() {
    const tasksContainer = document.getElementById('tasksContainer');
    if (!tasksContainer) return;
    
    if (exportTasks.length === 0) {
        tasksContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <p>暂无导出任务</p>
            </div>
        `;
        return;
    }
    
    tasksContainer.innerHTML = exportTasks.map(task => `
        <div class="task-item ${task.status}">
            <div class="task-info">
                <div class="task-name">${task.name}</div>
                <div class="task-details">
                    <span class="task-format">${getFormatName(task.config.format)}</span>
                    <span class="task-sources">${task.config.dataSources.length}个数据源</span>
                    <span class="task-records">${task.estimatedRecords.toLocaleString()}条记录</span>
                    <span class="task-time">${task.startTime.toLocaleString()}</span>
                </div>
            </div>
            <div class="task-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${task.progress}%"></div>
                </div>
                <div class="progress-text">${task.progress}%</div>
            </div>
            <div class="task-status">
                <span class="status-badge ${task.status}">${getStatusText(task.status)}</span>
                ${task.error ? `<div class="error-message">${task.error}</div>` : ''}
            </div>
            <div class="task-actions">
                ${task.status === 'completed' && task.downloadUrl ? 
                    `<button class="btn btn-ghost btn-sm" onclick="downloadTaskFile('${task.id}')" title="下载">
                        <i class="fas fa-download"></i>
                    </button>` : ''
                }
                ${task.status === 'failed' ? 
                    `<button class="btn btn-ghost btn-sm" onclick="retryTask('${task.id}')" title="重试">
                        <i class="fas fa-redo"></i>
                    </button>` : ''
                }
                <button class="btn btn-ghost btn-sm" onclick="deleteTask('${task.id}')" title="删除">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

/**
 * 更新任务进度
 */
function updateTaskProgress(task) {
    updateExportTasksList();
}

/**
 * 更新导出摘要
 */
function updateExportSummary() {
    const selectedSources = exportConfig.dataSources.length;
    const estimatedRecords = calculateEstimatedRecords();
    const estimatedSize = calculateEstimatedSize();
    
    document.getElementById('selectedSources').textContent = `${selectedSources}个`;
    document.getElementById('estimatedRecords').textContent = `${estimatedRecords.toLocaleString()}条`;
    document.getElementById('estimatedSize').textContent = estimatedSize;
}

/**
 * 计算预计记录数
 */
function calculateEstimatedRecords() {
    const recordCounts = {
        landsat: 1247,
        sentinel: 892,
        modis: 1567,
        temperature: 2156,
        precipitation: 1890,
        humidity: 1678,
        soil: 3245,
        camera: 1234,
        growth: 1567,
        yield: 892
    };
    
    return exportConfig.dataSources.reduce((total, source) => {
        return total + (recordCounts[source] || 0);
    }, 0);
}

/**
 * 计算预计文件大小
 */
function calculateEstimatedSize() {
    const records = calculateEstimatedRecords();
    const bytesPerRecord = exportConfig.format === 'json' ? 500 : 
                          exportConfig.format === 'excel' ? 200 : 150;
    
    const totalBytes = records * bytesPerRecord;
    
    if (totalBytes < 1024 * 1024) {
        return `${Math.round(totalBytes / 1024)}KB`;
    } else {
        return `${(totalBytes / (1024 * 1024)).toFixed(1)}MB`;
    }
}

/**
 * 获取质量等级文本
 */
function getQualityText(quality) {
    const qualityTexts = {
        excellent: '优秀',
        good: '良好',
        warning: '警告',
        error: '异常'
    };
    return qualityTexts[quality] || quality;
}

/**
 * 获取状态文本
 */
function getStatusText(status) {
    const statusTexts = {
        running: '运行中',
        paused: '已暂停',
        completed: '已完成',
        failed: '已失败',
        cancelled: '已取消'
    };
    return statusTexts[status] || status;
}

/**
 * 生成任务ID
 */
function generateTaskId() {
    return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
}

/**
 * 生成下载URL
 */
function generateDownloadUrl(task) {
    // 模拟生成下载链接
    return `#download_${task.id}`;
}

/**
 * 生成文件名
 */
function generateFileName(task) {
    const timestamp = new Date().toISOString().split('T')[0];
    const extension = getFileExtension(task.config.format);
    return `${task.name}_${timestamp}.${extension}`;
}

/**
 * 获取文件扩展名
 */
function getFileExtension(format) {
    const extensions = {
        excel: 'xlsx',
        csv: 'csv',
        json: 'json',
        pdf: 'pdf'
    };
    return extensions[format] || 'txt';
}

/**
 * 下载文件
 */
function downloadFile(url, filename) {
    // 模拟文件下载
    console.log(`下载文件: ${filename} from ${url}`);
    showNotification(`文件 ${filename} 下载开始`, 'success');
}

/**
 * 下载任务文件
 */
function downloadTaskFile(taskId) {
    const task = exportTasks.find(t => t.id === taskId);
    if (task && task.downloadUrl) {
        const filename = generateFileName(task);
        downloadFile(task.downloadUrl, filename);
    }
}

/**
 * 重试任务
 */
async function retryTask(taskId) {
    const task = exportTasks.find(t => t.id === taskId);
    if (task) {
        task.status = 'running';
        task.progress = 0;
        task.startTime = new Date();
        task.error = null;
        
        updateTaskProgress(task);
        showNotification(`任务"${task.name}"开始重试`, 'info');
        
        // 重新开始导出过程
        await startExportProcess(task);
    }
}

/**
 * 删除任务
 */
function deleteTask(taskId) {
    const taskIndex = exportTasks.findIndex(t => t.id === taskId);
    if (taskIndex > -1) {
        const task = exportTasks[taskIndex];
        
        if (task.status === 'running') {
            if (!confirm('任务正在运行中，确定要删除吗？')) {
                return;
            }
            task.status = 'cancelled';
        }
        
        exportTasks.splice(taskIndex, 1);
        updateExportTasksList();
        showNotification(`任务"${task.name}"已删除`, 'success');
    }
}
 
 
 
 
 
 
 
 
 