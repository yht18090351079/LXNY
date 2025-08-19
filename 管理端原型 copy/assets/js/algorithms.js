/**
 * 农情遥感系统管理端 - 算法参数配置功能
 * 功能：算法参数管理、性能监控、配置导入导出等
 */

// ===== 全局变量 =====
let algorithmData = {
    configurations: {},
    performance: {},
    statistics: {}
};
let charts = {};
let currentTab = 'crop-analysis';
let unsavedChanges = false;

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeAlgorithmPage();
});

/**
 * 页面初始化
 */
function initializeAlgorithmPage() {
    console.log('🧠 初始化算法参数配置页面...');
    
    // 生成模拟数据
    generateMockAlgorithmData();
    
    // 初始化图表
    initializeAlgorithmCharts();
    
    // 渲染页面内容
    renderAlgorithmOverview();
    
    // 绑定事件
    bindAlgorithmEvents();
    
    // 初始化范围滑块
    initializeRangeSliders();
    
    console.log('✅ 算法参数配置页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟算法数据
 */
function generateMockAlgorithmData() {
    // 算法配置数据
    algorithmData.configurations = {
        'crop-analysis': {
            'crop-growth': {
                enabled: true,
                ndviHealthy: 0.70,
                ndviWarning: 0.40,
                ndviFrequency: 7,
                recognitionAccuracy: 'medium',
                minPlotArea: 0.5,
                boundaryTolerance: 2,
                seedingNdvi: 0.15,
                growingNdvi: 0.50,
                matureNdvi: 0.30
            },
            'growth-monitoring': {
                enabled: true,
                monitoringCycle: 3,
                anomalySensitivity: 'medium',
                historyWeight: 0.3
            }
        },
        'weather-prediction': {
            'weather-forecast': {
                enabled: true,
                forecastDays: 7,
                updateFreq: 6,
                accuracy: 'high',
                tempWeight: 0.3,
                humidityWeight: 0.2,
                rainfallWeight: 0.4,
                windWeight: 0.1
            },
            'extreme-weather': {
                enabled: true,
                highTempThreshold: 35,
                lowTempThreshold: 5,
                heavyRainThreshold: 20,
                strongWindThreshold: 12
            }
        },
        'disease-detection': {
            'disease-recognition': {
                enabled: true,
                confidence: 0.8,
                minLesionArea: 100,
                scanFreq: 5,
                leafSpotWeight: 0.3,
                rustWeight: 0.25,
                powderyMildewWeight: 0.2,
                otherDiseaseWeight: 0.25
            },
            'pest-detection': {
                enabled: true,
                sensitivity: 'medium',
                minPestDensity: 5,
                monitoringTime: 'day-only'
            }
        },
        'yield-estimation': {
            'yield-prediction': {
                enabled: true,
                accuracy: 'medium',
                historicalYears: 5,
                updateFreq: 10,
                ndviWeight: 0.4,
                weatherWeight: 0.3,
                soilWeight: 0.2,
                managementWeight: 0.1
            }
        },
        'image-processing': {
            'image-preprocessing': {
                enabled: true,
                contrastEnhance: 1.2,
                brightnessAdjust: 1.0,
                sharpeningIntensity: 0.5,
                noiseReduction: 'medium',
                filterType: 'gaussian',
                autoCorrection: true,
                correctionAccuracy: 'high'
            },
            'feature-extraction': {
                enabled: true,
                featurePoints: 1000,
                extractionAlgorithm: 'surf',
                matchThreshold: 0.7
            }
        }
    };
    
    // 统计数据
    algorithmData.statistics = {
        totalAlgorithms: 12,
        activeAlgorithms: 10,
        avgPerformance: 92.5,
        lastUpdate: '2小时前'
    };
    
    // 性能数据
    algorithmData.performance = {
        executionTime: generatePerformanceData('execution'),
        accuracy: generatePerformanceData('accuracy'),
        resourceUsage: generatePerformanceData('resource')
    };
    
    console.log('🧠 生成算法参数模拟数据完成');
}

/**
 * 生成性能数据
 */
function generatePerformanceData(type) {
    const algorithms = ['作物分析', '气象预测', '病虫害识别', '产量预估', '图像处理'];
    const data = [];
    
    algorithms.forEach(algorithm => {
        let value;
        switch (type) {
            case 'execution':
                value = Math.random() * 500 + 100; // 100-600ms
                break;
            case 'accuracy':
                value = Math.random() * 15 + 85; // 85-100%
                break;
            case 'resource':
                value = Math.random() * 40 + 20; // 20-60%
                break;
        }
        data.push({ name: algorithm, value: value });
    });
    
    return data;
}

// ===== 图表初始化 =====

/**
 * 初始化算法图表
 */
function initializeAlgorithmCharts() {
    initializeExecutionTimeChart();
    initializeAccuracyChart();
    initializeResourceUsageChart();
}

/**
 * 初始化执行时间图表
 */
function initializeExecutionTimeChart() {
    const chartDom = document.getElementById('executionTimeChart');
    if (!chartDom) return;
    
    charts.executionTime = echarts.init(chartDom);
    updateExecutionTimeChart();
}

/**
 * 更新执行时间图表
 */
function updateExecutionTimeChart() {
    if (!charts.executionTime) return;
    
    const data = algorithmData.performance.executionTime;
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#2E7D32',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: function(params) {
                return `
                    <div style="font-weight: bold; margin-bottom: 8px;">${params[0].name}</div>
                    <div style="display: flex; align-items: center;">
                        <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${params[0].color}; margin-right: 8px;"></span>
                        <span style="margin-right: 16px;">执行时间:</span>
                        <span style="font-weight: bold;">${params[0].value.toFixed(0)}ms</span>
                    </div>
                `;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: data.map(d => d.name),
            axisLine: {
                lineStyle: {
                    color: '#E0E4E7'
                }
            },
            axisLabel: {
                color: '#718096',
                fontSize: 11,
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: '时间 (ms)',
            nameTextStyle: {
                color: '#718096',
                fontSize: 11
            },
            axisLine: {
                lineStyle: {
                    color: '#E0E4E7'
                }
            },
            axisLabel: {
                color: '#718096',
                fontSize: 11
            },
            splitLine: {
                lineStyle: {
                    color: '#F0F2F5',
                    type: 'dashed'
                }
            }
        },
        series: [
            {
                name: '执行时间',
                type: 'bar',
                barWidth: '60%',
                itemStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: '#2E7D32' },
                            { offset: 1, color: '#4CAF50' }
                        ]
                    }
                },
                data: data.map(d => d.value)
            }
        ]
    };
    
    charts.executionTime.setOption(option);
}

/**
 * 初始化准确率图表
 */
function initializeAccuracyChart() {
    const chartDom = document.getElementById('accuracyChart');
    if (!chartDom) return;
    
    charts.accuracy = echarts.init(chartDom);
    updateAccuracyChart();
}

/**
 * 更新准确率图表
 */
function updateAccuracyChart() {
    if (!charts.accuracy) return;
    
    const data = algorithmData.performance.accuracy;
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'item',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#1976D2',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            },
            formatter: '{a} <br/>{b}: {c}%'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            textStyle: {
                color: '#718096',
                fontSize: 10
            }
        },
        series: [
            {
                name: '算法准确率',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['40%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '14',
                        fontWeight: 'bold',
                        color: '#1976D2'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data.map(d => ({ name: d.name, value: d.value.toFixed(1) })),
                color: ['#1976D2', '#2196F3', '#42A5F5', '#64B5F6', '#90CAF9']
            }
        ]
    };
    
    charts.accuracy.setOption(option);
}

/**
 * 初始化资源使用图表
 */
function initializeResourceUsageChart() {
    const chartDom = document.getElementById('resourceUsageChart');
    if (!chartDom) return;
    
    charts.resourceUsage = echarts.init(chartDom);
    updateResourceUsageChart();
}

/**
 * 更新资源使用图表
 */
function updateResourceUsageChart() {
    if (!charts.resourceUsage) return;
    
    const data = algorithmData.performance.resourceUsage;
    
    const option = {
        title: {
            show: false
        },
        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(50, 50, 50, 0.9)',
            borderColor: '#FF9800',
            borderWidth: 1,
            textStyle: {
                color: '#fff',
                fontSize: 12
            }
        },
        radar: {
            indicator: data.map(d => ({ name: d.name, max: 100 })),
            radius: '70%',
            axisLine: {
                lineStyle: {
                    color: '#E0E4E7'
                }
            },
            axisLabel: {
                color: '#718096',
                fontSize: 10
            },
            splitLine: {
                lineStyle: {
                    color: '#F0F2F5'
                }
            },
            splitArea: {
                areaStyle: {
                    color: ['rgba(255, 152, 0, 0.05)', 'rgba(255, 152, 0, 0.1)']
                }
            }
        },
        series: [
            {
                name: '资源使用率',
                type: 'radar',
                data: [
                    {
                        value: data.map(d => d.value),
                        name: '资源使用率',
                        areaStyle: {
                            color: 'rgba(255, 152, 0, 0.2)'
                        },
                        lineStyle: {
                            color: '#FF9800',
                            width: 2
                        },
                        symbol: 'circle',
                        symbolSize: 4
                    }
                ]
            }
        ]
    };
    
    charts.resourceUsage.setOption(option);
}

// ===== 页面渲染 =====

/**
 * 渲染算法概览
 */
function renderAlgorithmOverview() {
    const stats = algorithmData.statistics;
    
    // 更新统计数据
    updateElement('totalAlgorithms', stats.totalAlgorithms);
    updateElement('activeAlgorithms', stats.activeAlgorithms);
    updateElement('avgPerformance', stats.avgPerformance + '%');
    updateElement('lastUpdate', stats.lastUpdate);
    
    console.log('🧠 渲染算法概览完成');
}

// ===== 工具函数 =====

/**
 * 更新元素内容
 */
function updateElement(id, content) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = content;
    }
}

/**
 * 初始化范围滑块
 */
function initializeRangeSliders() {
    const rangeInputs = document.querySelectorAll('.range-input');
    rangeInputs.forEach(input => {
        updateRangeValue(input);
        input.addEventListener('input', function() {
            updateRangeValue(this);
            markUnsavedChanges();
        });
    });
}

/**
 * 更新范围值显示
 */
function updateRangeValue(input) {
    const valueSpan = input.nextElementSibling;
    if (valueSpan && valueSpan.classList.contains('range-value')) {
        valueSpan.textContent = parseFloat(input.value).toFixed(2);
    }
}

/**
 * 标记未保存的更改
 */
function markUnsavedChanges() {
    unsavedChanges = true;
    // 可以在页面上显示未保存提示
}

// ===== 事件绑定 =====

/**
 * 绑定算法配置事件
 */
function bindAlgorithmEvents() {
    // 窗口大小变化时重新调整图表
    window.addEventListener('resize', debounce(() => {
        Object.values(charts).forEach(chart => {
            if (chart && chart.resize) {
                chart.resize();
            }
        });
    }, 200));
    
    // 监听表单变化
    const formControls = document.querySelectorAll('.form-control');
    formControls.forEach(control => {
        control.addEventListener('change', markUnsavedChanges);
    });
    
    // 监听复选框变化
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', markUnsavedChanges);
    });
    
    // 页面离开前提醒保存
    window.addEventListener('beforeunload', function(e) {
        if (unsavedChanges) {
            e.preventDefault();
            e.returnValue = '您有未保存的更改，确定要离开吗？';
        }
    });
}

// ===== 功能函数 =====

/**
 * 切换算法选项卡
 */
function switchAlgorithmTab(tabId) {
    currentTab = tabId;
    
    // 更新选项卡状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[onclick*="${tabId}"]`).classList.add('active');
    
    // 更新内容区域
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    
    const tabNames = {
        'crop-analysis': '作物分析算法',
        'weather-prediction': '气象预测算法',
        'disease-detection': '病虫害识别',
        'yield-estimation': '产量预估算法',
        'image-processing': '图像处理算法'
    };
    
    showNotification(`已切换到${tabNames[tabId]}配置`, 'info');
}

/**
 * 切换算法启用状态
 */
function toggleAlgorithm(algorithmId) {
    const statusBadge = event.target.closest('.section-header').querySelector('.status-badge');
    const isActive = statusBadge.classList.contains('active');
    
    if (isActive) {
        statusBadge.classList.remove('active');
        statusBadge.textContent = '已停用';
        showNotification(`${algorithmId} 算法已停用`, 'warning');
    } else {
        statusBadge.classList.add('active');
        statusBadge.textContent = '运行中';
        showNotification(`${algorithmId} 算法已启用`, 'success');
    }
    
    markUnsavedChanges();
}

/**
 * 保存所有配置
 */
function saveAllConfig() {
    showNotification('正在保存算法配置...', 'info');
    
    // 收集所有配置数据
    const configData = collectAllConfigurations();
    
    // 模拟保存过程
    setTimeout(() => {
        // 更新配置数据
        algorithmData.configurations = configData;
        unsavedChanges = false;
        
        showNotification('算法配置保存成功', 'success');
    }, 2000);
}

/**
 * 收集所有配置数据
 */
function collectAllConfigurations() {
    const config = {};
    
    // 遍历所有输入元素收集配置
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id && input.value !== undefined) {
            const tabId = input.closest('.tab-content')?.id;
            if (tabId) {
                if (!config[tabId]) config[tabId] = {};
                
                let value = input.value;
                if (input.type === 'number' || input.type === 'range') {
                    value = parseFloat(value);
                } else if (input.type === 'checkbox') {
                    value = input.checked;
                }
                
                config[tabId][input.id] = value;
            }
        }
    });
    
    return config;
}

/**
 * 恢复默认配置
 */
function resetToDefaults() {
    showConfirm('确定要恢复所有算法参数到默认设置吗？此操作将覆盖当前配置。', () => {
        showNotification('正在恢复默认配置...', 'info');
        
        setTimeout(() => {
            // 重新生成默认数据
            generateMockAlgorithmData();
            
            // 重新渲染页面
            renderAlgorithmOverview();
            
            // 重置所有输入元素
            resetAllInputs();
            
            unsavedChanges = false;
            showNotification('已恢复默认配置', 'success');
        }, 1000);
    });
}

/**
 * 重置所有输入元素
 */
function resetAllInputs() {
    // 重置范围滑块
    const rangeInputs = document.querySelectorAll('.range-input');
    rangeInputs.forEach(input => {
        const defaultValue = input.getAttribute('value');
        if (defaultValue) {
            input.value = defaultValue;
            updateRangeValue(input);
        }
    });
    
    // 重置其他输入元素
    const otherInputs = document.querySelectorAll('input:not(.range-input), select');
    otherInputs.forEach(input => {
        if (input.type === 'checkbox') {
            input.checked = input.hasAttribute('checked');
        } else {
            const defaultValue = input.getAttribute('value') || input.querySelector('option[selected]')?.value;
            if (defaultValue) {
                input.value = defaultValue;
            }
        }
    });
}

/**
 * 导出配置
 */
function exportConfig() {
    showNotification('正在导出算法配置...', 'info');
    
    const configData = collectAllConfigurations();
    const exportData = {
        version: '1.0',
        timestamp: new Date().toISOString(),
        configurations: configData,
        statistics: algorithmData.statistics
    };
    
    // 创建下载链接
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `algorithm-config-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('配置文件已导出', 'success');
}

/**
 * 导入配置
 */
function importConfig() {
    const modal = document.getElementById('importConfigModal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * 关闭导入配置模态框
 */
function closeImportConfigModal() {
    const modal = document.getElementById('importConfigModal');
    if (modal) {
        modal.classList.remove('show');
    }
}

/**
 * 处理配置文件选择
 */
function handleConfigFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const selectedFileContainer = document.getElementById('selectedConfigFile');
    if (selectedFileContainer) {
        selectedFileContainer.innerHTML = `
            <div class="file-item">
                <div class="file-info">
                    <i class="fas fa-file-code"></i>
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">(${formatFileSize(file.size)})</span>
                </div>
                <button class="btn-icon btn-xs" onclick="clearSelectedFile()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
    }
}

/**
 * 清除选中的文件
 */
function clearSelectedFile() {
    document.getElementById('configFileInput').value = '';
    document.getElementById('selectedConfigFile').innerHTML = '';
}

/**
 * 导入配置文件
 */
function importConfiguration() {
    const fileInput = document.getElementById('configFileInput');
    const file = fileInput.files[0];
    
    if (!file) {
        showNotification('请先选择配置文件', 'warning');
        return;
    }
    
    showNotification('正在导入配置文件...', 'info');
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const configData = JSON.parse(e.target.result);
            
            // 验证配置文件格式
            if (!configData.configurations) {
                throw new Error('配置文件格式不正确');
            }
            
            // 应用配置
            algorithmData.configurations = configData.configurations;
            
            // 更新页面
            renderAlgorithmOverview();
            resetAllInputs();
            
            closeImportConfigModal();
            showNotification('配置导入成功', 'success');
            
        } catch (error) {
            showNotification('配置文件格式错误：' + error.message, 'error');
        }
    };
    
    reader.readAsText(file);
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 刷新性能数据
 */
function refreshPerformance() {
    showNotification('正在刷新性能数据...', 'info');
    
    setTimeout(() => {
        // 重新生成性能数据
        algorithmData.performance = {
            executionTime: generatePerformanceData('execution'),
            accuracy: generatePerformanceData('accuracy'),
            resourceUsage: generatePerformanceData('resource')
        };
        
        // 更新图表
        updateExecutionTimeChart();
        updateAccuracyChart();
        updateResourceUsageChart();
        
        showNotification('性能数据已刷新', 'success');
    }, 1000);
}

/**
 * 导出性能报告
 */
function exportPerformanceReport() {
    showNotification('正在生成性能报告...', 'info');
    
    const reportData = {
        title: '算法性能监控报告',
        timestamp: new Date().toISOString(),
        statistics: algorithmData.statistics,
        performance: algorithmData.performance,
        summary: {
            totalAlgorithms: algorithmData.statistics.totalAlgorithms,
            activeAlgorithms: algorithmData.statistics.activeAlgorithms,
            avgPerformance: algorithmData.statistics.avgPerformance,
            recommendations: [
                '建议优化图像处理算法的执行效率',
                '气象预测算法准确率可进一步提升',
                '考虑增加病虫害识别算法的训练数据'
            ]
        }
    };
    
    setTimeout(() => {
        const dataStr = JSON.stringify(reportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('性能报告已导出', 'success');
    }, 2000);
}

// ===== 工具函数 =====

/**
 * 防抖函数（如果common.js中没有定义）
 */
if (typeof debounce === 'undefined') {
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
 
 
 
 
 
 
 
 
 