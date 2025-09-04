/**
 * 灾害阈值设置页面功能模块
 */

class DisasterThresholdManager {
    constructor() {
        this.currentUser = Auth.getCurrentUser();
        this.editingThresholdId = null;
        this.currentViewingThreshold = null;
        this.deletingThresholdId = null;
        
        // 阈值数据
        this.thresholdData = [
            {
                id: 1,
                name: '高温预警阈值',
                type: 'temperature',
                warningLevel: 'warning',
                config: {
                    minValue: 35,
                    maxValue: null,
                    unit: '°C',
                    duration: 3,
                    description: '连续3小时温度超过35°C时触发预警'
                },
                applicableCrop: 'wheat',
                applicableArea: 'all',
                status: 'active',
                priority: 2,
                description: '用于监测高温天气对小麦的影响',
                createTime: '2024-01-15 10:00:00',
                updateTime: '2024-01-15 10:00:00'
            },
            {
                id: 2,
                name: '极端高温阈值',
                type: 'temperature',
                warningLevel: 'critical',
                config: {
                    minValue: 40,
                    maxValue: null,
                    unit: '°C',
                    duration: 1,
                    description: '温度超过40°C时立即触发严重预警'
                },
                applicableCrop: 'all',
                applicableArea: 'all',
                status: 'active',
                priority: 3,
                description: '极端高温对农作物造成严重威胁时的预警阈值',
                createTime: '2024-01-15 10:30:00',
                updateTime: '2024-01-15 10:30:00'
            },
            {
                id: 3,
                name: '低温冻害阈值',
                type: 'temperature',
                warningLevel: 'danger',
                config: {
                    minValue: null,
                    maxValue: 0,
                    unit: '°C',
                    duration: 2,
                    description: '连续2小时温度低于0°C时触发冻害预警'
                },
                applicableCrop: 'all',
                applicableArea: 'all',
                status: 'active',
                priority: 3,
                description: '用于预防低温冻害对作物的损害',
                createTime: '2024-01-15 11:00:00',
                updateTime: '2024-01-15 11:00:00'
            },
            {
                id: 4,
                name: '空气湿度过低阈值',
                type: 'humidity',
                warningLevel: 'warning',
                config: {
                    minValue: null,
                    maxValue: 30,
                    unit: '%',
                    duration: 6,
                    description: '连续6小时湿度低于30%时触发干旱预警'
                },
                applicableCrop: 'all',
                applicableArea: 'all',
                status: 'active',
                priority: 2,
                description: '监测空气湿度过低可能导致的干旱风险',
                createTime: '2024-01-15 11:30:00',
                updateTime: '2024-01-15 11:30:00'
            },
            {
                id: 5,
                name: '空气湿度过高阈值',
                type: 'humidity',
                warningLevel: 'info',
                config: {
                    minValue: 85,
                    maxValue: null,
                    unit: '%',
                    duration: 12,
                    description: '连续12小时湿度超过85%时触发病害风险预警'
                },
                applicableCrop: 'all',
                applicableArea: 'all',
                status: 'active',
                priority: 1,
                description: '高湿度环境容易滋生病虫害',
                createTime: '2024-01-15 12:00:00',
                updateTime: '2024-01-15 12:00:00'
            },
            {
                id: 6,
                name: '小麦长势异常预警',
                type: 'ndvi',
                warningLevel: 'warning',
                config: {
                    minValue: null,
                    maxValue: 0.3,
                    unit: '',
                    duration: null,
                    description: '长势指数低于0.3时触发小麦健康状况预警'
                },
                applicableCrop: 'wheat',
                applicableArea: 'all',
                status: 'active',
                priority: 2,
                description: '监测小麦长势异常，及时发现病虫害或营养不良',
                createTime: '2024-01-15 12:30:00',
                updateTime: '2024-01-15 12:30:00'
            },
            {
                id: 7,
                name: '玉米长势严重不良',
                type: 'ndvi',
                warningLevel: 'critical',
                config: {
                    minValue: null,
                    maxValue: 0.1,
                    unit: '',
                    duration: null,
                    description: '长势指数低于0.1时触发严重植被损失预警'
                },
                applicableCrop: 'corn',
                applicableArea: 'linxia',
                status: 'active',
                priority: 3,
                description: '玉米长势严重不足，可能存在严重病害或干旱',
                createTime: '2024-01-15 13:00:00',
                updateTime: '2024-01-15 13:00:00'
            },
            {
                id: 8,
                name: '夏季高温阈值（东乡镇）',
                type: 'temperature',
                warningLevel: 'danger',
                config: {
                    minValue: 38,
                    maxValue: null,
                    unit: '°C',
                    duration: 2,
                    description: '东乡镇夏季温度超过38°C超过2小时触发预警'
                },
                applicableCrop: 'potato',
                applicableArea: 'dongxiang',
                status: 'inactive',
                priority: 2,
                description: '针对东乡镇马铃薯种植制定的特殊高温阈值',
                createTime: '2024-01-15 13:30:00',
                updateTime: '2024-01-15 13:30:00'
            },
            {
                id: 9,
                name: '水稻低温冷害阈值',
                type: 'temperature',
                warningLevel: 'danger',
                config: {
                    minValue: null,
                    maxValue: 15,
                    unit: '°C',
                    duration: 6,
                    description: '连续6小时温度低于15°C时触发水稻冷害预警'
                },
                applicableCrop: 'rice',
                applicableArea: 'hezheng',
                status: 'active',
                priority: 3,
                description: '水稻在开花期对低温敏感，需要特别监测',
                createTime: '2024-01-15 14:00:00',
                updateTime: '2024-01-15 14:00:00'
            },
            {
                id: 10,
                name: '果树长势监测阈值',
                type: 'ndvi',
                warningLevel: 'info',
                config: {
                    minValue: null,
                    maxValue: 0.4,
                    unit: '',
                    duration: null,
                    description: '果树长势指数低于0.4时提醒关注'
                },
                applicableCrop: 'fruits',
                applicableArea: 'all',
                status: 'active',
                priority: 1,
                description: '果树生长期长势监测，便于及时采取措施',
                createTime: '2024-01-15 14:30:00',
                updateTime: '2024-01-15 14:30:00'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.initUserInfo();
        this.bindEvents();
        this.loadThresholdData();
        this.renderThresholdStats();
        this.checkUserPermissions();
    }
    
    initUserInfo() {
        if (this.currentUser) {
            const userNameEl = document.getElementById('currentUserName');
            const userRoleEl = document.getElementById('currentUserRole');
            
            if (userNameEl) userNameEl.textContent = this.currentUser.name;
            if (userRoleEl) {
                userRoleEl.textContent = this.currentUser.role === 'superadmin' ? '超级管理员' : '乡镇管理员';
            }
        }
    }
    
    checkUserPermissions() {
        // 检查用户权限，只有超级管理员可以访问此页面
        if (!this.currentUser || this.currentUser.role !== 'superadmin') {
            Utils.showMessage('您没有权限访问此页面', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
            return;
        }
    }
    
    bindEvents() {
        // 搜索和筛选事件
        const searchInput = document.getElementById('thresholdSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => {
                this.loadThresholdData();
            }, 300));
        }

        const typeFilter = document.getElementById('thresholdTypeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', () => {
                this.loadThresholdData();
            });
        }

        const statusFilter = document.getElementById('thresholdStatusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                this.loadThresholdData();
            });
        }

        // 作物筛选
        const cropFilter = document.getElementById('thresholdCropFilter');
        if (cropFilter) {
            cropFilter.addEventListener('change', () => {
                this.loadThresholdData();
            });
        }

        // 模态框事件
        this.bindModalEvents();
        
        // 表单提交事件
        const thresholdForm = document.getElementById('thresholdForm');
        if (thresholdForm) {
            thresholdForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveThreshold();
            });
        }
    }

    bindModalEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal-overlay.show');
            if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                this.closeModal(modal);
            }
        });

        // 点击遮罩关闭模态框
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    // 渲染阈值统计卡片
    renderThresholdStats() {
        const statsContainer = document.getElementById('thresholdStats');
        if (!statsContainer) return;

        const temperatureCount = this.thresholdData.filter(t => t.type === 'temperature' && t.status === 'active').length;
        const humidityCount = this.thresholdData.filter(t => t.type === 'humidity' && t.status === 'active').length;
        const ndviCount = this.thresholdData.filter(t => t.type === 'ndvi' && t.status === 'active').length;
        const totalCount = this.thresholdData.filter(t => t.status === 'active').length;

        statsContainer.innerHTML = `
            <div class="stat-card temperature">
                <div class="stat-header">
                    <h4 class="stat-title">温度阈值</h4>
                    <i class="fas fa-thermometer-half stat-icon"></i>
                </div>
                <p class="stat-value">${temperatureCount}</p>
                <p class="stat-description">已启用的温度监测阈值</p>
            </div>
            <div class="stat-card humidity">
                <div class="stat-header">
                    <h4 class="stat-title">湿度阈值</h4>
                    <i class="fas fa-tint stat-icon"></i>
                </div>
                <p class="stat-value">${humidityCount}</p>
                <p class="stat-description">已启用的湿度监测阈值</p>
            </div>
            <div class="stat-card ndvi">
                <div class="stat-header">
                    <h4 class="stat-title">长势阈值</h4>
                    <i class="fas fa-leaf stat-icon"></i>
                </div>
                <p class="stat-value">${ndviCount}</p>
                <p class="stat-description">已启用的长势监测阈值</p>
            </div>
            <div class="stat-card total">
                <div class="stat-header">
                    <h4 class="stat-title">总计</h4>
                    <i class="fas fa-chart-pie stat-icon"></i>
                </div>
                <p class="stat-value">${totalCount}</p>
                <p class="stat-description">所有已启用的阈值数量</p>
            </div>
        `;
    }

    // 加载阈值数据
    loadThresholdData() {
        const tableBody = document.getElementById('thresholdTableBody');
        if (!tableBody) return;

        let filteredData = [...this.thresholdData];

        // 搜索过滤
        const searchInput = document.getElementById('thresholdSearchInput');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filteredData = filteredData.filter(threshold => 
                threshold.name.toLowerCase().includes(searchTerm) ||
                threshold.description.toLowerCase().includes(searchTerm)
            );
        }

        // 类型筛选
        const typeFilter = document.getElementById('thresholdTypeFilter');
        if (typeFilter && typeFilter.value) {
            filteredData = filteredData.filter(threshold => threshold.type === typeFilter.value);
        }

        // 状态筛选
        const statusFilter = document.getElementById('thresholdStatusFilter');
        if (statusFilter && statusFilter.value) {
            filteredData = filteredData.filter(threshold => threshold.status === statusFilter.value);
        }

        // 作物筛选
        const cropFilter = document.getElementById('thresholdCropFilter');
        if (cropFilter && cropFilter.value) {
            filteredData = filteredData.filter(threshold => {
                if (Array.isArray(threshold.applicableCrop)) {
                    return threshold.applicableCrop.includes(cropFilter.value) || threshold.applicableCrop.includes('all');
                }
                return threshold.applicableCrop === cropFilter.value || threshold.applicableCrop === 'all';
            });
        }

        if (filteredData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" class="text-center">暂无数据</td></tr>';
            return;
        }

        const html = filteredData.map(threshold => `
            <tr>
                <td>
                    <div class="threshold-name-cell">
                        <i class="fas fa-${this.getTypeIcon(threshold.type)}"></i>
                        <span class="threshold-name">${threshold.name}</span>
                    </div>
                </td>
                <td>
                    <span class="type-badge type-${threshold.type}">${this.getTypeLabel(threshold.type)}</span>
                </td>
                <td>
                    <span class="warning-badge warning-${threshold.warningLevel}">
                        <i class="fas fa-${this.getWarningIcon(threshold.warningLevel)}"></i>
                        ${this.getWarningLabel(threshold.warningLevel)}
                    </span>
                </td>
                <td>
                    <span class="threshold-range">${this.formatThresholdRange(threshold.config)}</span>
                </td>
                <td>
                    <span class="crop-badge">${this.getCropLabel(threshold.applicableCrop)}</span>
                </td>
                <td>
                    <span class="area-badge">${this.getAreaLabel(threshold.applicableArea)}</span>
                </td>
                <td>
                    <span class="status-badge status-${threshold.status}">
                        <span class="status-dot"></span>
                        ${threshold.status === 'active' ? '启用' : '禁用'}
                    </span>
                </td>
                <td>${Utils.formatDate(threshold.createTime, 'MM-DD HH:mm')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline" onclick="window.thresholdManager.viewThresholdDetail(${threshold.id})" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="window.thresholdManager.editThreshold(${threshold.id})" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="window.thresholdManager.showDeleteThresholdModal(${threshold.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = html;
    }

    // 获取监测类型图标
    getTypeIcon(type) {
        const iconMap = {
            'temperature': 'thermometer-half',
            'humidity': 'tint',
            'ndvi': 'leaf'
        };
        return iconMap[type] || 'question-circle';
    }

    // 获取监测类型标签
    getTypeLabel(type) {
        const labelMap = {
            'temperature': '温度',
            'humidity': '湿度',
            'ndvi': '长势'
        };
        return labelMap[type] || type;
    }

    // 获取预警等级图标
    getWarningIcon(level) {
        const iconMap = {
            'info': 'info-circle',
            'warning': 'exclamation-triangle',
            'danger': 'exclamation',
            'critical': 'radiation-alt'
        };
        return iconMap[level] || 'question-circle';
    }

    // 获取预警等级标签
    getWarningLabel(level) {
        const labelMap = {
            'info': '信息',
            'warning': '注意',
            'danger': '警告',
            'critical': '严重'
        };
        return labelMap[level] || level;
    }

    // 格式化阈值范围
    formatThresholdRange(config) {
        const { minValue, maxValue, unit } = config;
        
        if (minValue !== null && maxValue !== null) {
            return `${minValue} ~ ${maxValue} ${unit}`;
        } else if (minValue !== null) {
            return `≥ ${minValue} ${unit}`;
        } else if (maxValue !== null) {
            return `≤ ${maxValue} ${unit}`;
        } else {
            return '未设置';
        }
    }

    // 获取作物标签
    getCropLabel(crop) {
        const labelMap = {
            'all': '所有作物',
            'wheat': '小麦',
            'corn': '玉米',
            'rice': '水稻',
            'potato': '马铃薯',
            'rapeseed': '油菜',
            'barley': '青稞',
            'beans': '豆类',
            'vegetables': '蔬菜',
            'fruits': '果树'
        };
        return labelMap[crop] || crop;
    }

    // 获取区域标签
    getAreaLabel(area) {
        const labelMap = {
            'all': '全部区域',
            'linxia': '临夏镇',
            'dongxiang': '东乡镇',
            'jishishan': '积石山镇',
            'kangle': '康乐镇',
            'hezheng': '和政镇'
        };
        
        // 如果是数组，处理多个区域
        if (Array.isArray(area)) {
            if (area.includes('all') || area.length === 0) {
                return '全部区域';
            }
            return area.map(a => labelMap[a] || a).join(', ');
        }
        
        return labelMap[area] || area;
    }

    // 显示新增阈值模态框
    showAddThresholdModal() {
        this.editingThresholdId = null;
        this.resetThresholdForm();
        document.getElementById('thresholdModalTitle').textContent = '新增灾害阈值';
        this.showModal('thresholdModal');
    }

    // 编辑阈值
    editThreshold(id) {
        const threshold = this.thresholdData.find(t => t.id === id);
        if (!threshold) return;

        this.editingThresholdId = id;
        this.fillThresholdForm(threshold);
        document.getElementById('thresholdModalTitle').textContent = '编辑灾害阈值';
        this.showModal('thresholdModal');
    }

    // 查看阈值详情
    viewThresholdDetail(id) {
        const threshold = this.thresholdData.find(t => t.id === id);
        if (!threshold) return;

        this.currentViewingThreshold = threshold;
        this.renderThresholdDetail(threshold);
        this.showModal('thresholdDetailModal');
    }

    // 渲染阈值详情
    renderThresholdDetail(threshold) {
        const container = document.getElementById('thresholdDetailContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="threshold-detail-grid">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> 基本信息</h4>
                    <div class="detail-items">
                        <div class="detail-item">
                            <label>阈值名称:</label>
                            <span>${threshold.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>监测类型:</label>
                            <span class="type-badge type-${threshold.type}">${this.getTypeLabel(threshold.type)}</span>
                        </div>
                        <div class="detail-item">
                            <label>预警等级:</label>
                            <span class="warning-badge warning-${threshold.warningLevel}">
                                <i class="fas fa-${this.getWarningIcon(threshold.warningLevel)}"></i>
                                ${this.getWarningLabel(threshold.warningLevel)}
                            </span>
                        </div>
                        <div class="detail-item">
                            <label>适用作物:</label>
                            <span class="crop-badge">${this.getCropLabel(threshold.applicableCrop)}</span>
                        </div>
                        <div class="detail-item">
                            <label>适用区域:</label>
                            <span class="area-badge">${this.getAreaLabel(threshold.applicableArea)}</span>
                        </div>
                        <div class="detail-item">
                            <label>状态:</label>
                            <span class="status-badge status-${threshold.status}">
                                <span class="status-dot"></span>
                                ${threshold.status === 'active' ? '启用' : '禁用'}
                            </span>
                        </div>
                        <div class="detail-item">
                            <label>优先级:</label>
                            <span>${this.getPriorityLabel(threshold.priority)}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-sliders-h"></i> 阈值配置</h4>
                    <div class="detail-items">
                        <div class="detail-item">
                            <label>阈值范围:</label>
                            <span class="threshold-range">${this.formatThresholdRange(threshold.config)}</span>
                        </div>
                        ${threshold.config.duration ? `
                            <div class="detail-item">
                                <label>持续时长:</label>
                                <span>${threshold.config.duration} 小时</span>
                            </div>
                        ` : ''}
                        <div class="detail-item">
                            <label>配置说明:</label>
                            <span>${threshold.config.description || '无'}</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-file-alt"></i> 详细说明</h4>
                    <div class="detail-description">
                        ${threshold.description || '暂无详细说明'}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-clock"></i> 时间信息</h4>
                    <div class="detail-items">
                        <div class="detail-item">
                            <label>创建时间:</label>
                            <span>${Utils.formatDate(threshold.createTime)}</span>
                        </div>
                        <div class="detail-item">
                            <label>更新时间:</label>
                            <span>${Utils.formatDate(threshold.updateTime)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 获取优先级标签
    getPriorityLabel(priority) {
        const labelMap = {
            1: '低',
            2: '中', 
            3: '高'
        };
        return labelMap[priority] || priority;
    }

    // 编辑当前查看的阈值
    editCurrentThreshold() {
        if (this.currentViewingThreshold) {
            this.closeThresholdDetailModal();
            setTimeout(() => {
                this.editThreshold(this.currentViewingThreshold.id);
            }, 100);
        }
    }

    // 显示删除确认模态框
    showDeleteThresholdModal(id) {
        const threshold = this.thresholdData.find(t => t.id === id);
        if (!threshold) return;

        this.deletingThresholdId = id;
        document.getElementById('deleteThresholdName').textContent = threshold.name;
        this.showModal('deleteThresholdModal');
    }

    // 确认删除阈值
    confirmDeleteThreshold() {
        if (!this.deletingThresholdId) return;

        const index = this.thresholdData.findIndex(t => t.id === this.deletingThresholdId);
        if (index !== -1) {
            this.thresholdData.splice(index, 1);
            Utils.showMessage('阈值删除成功', 'success');
            this.loadThresholdData();
            this.renderThresholdStats();
        }

        this.closeDeleteThresholdModal();
    }

    // 重置表单
    resetThresholdForm() {
        const form = document.getElementById('thresholdForm');
        if (form) {
            form.reset();
        }
        
        // 重置多选区域 - 默认选择"全部区域"（包含所有具体区域）
        const areaCheckboxes = document.querySelectorAll('input[name="applicableArea"]');
        if (areaCheckboxes) {
            // 选中所有区域（包括"全部区域"）
            areaCheckboxes.forEach(checkbox => checkbox.checked = true);
        }
        
        // 重置阈值配置区域
        this.updateThresholdFields();
    }

    // 填充表单数据
    fillThresholdForm(threshold) {
        document.getElementById('thresholdName').value = threshold.name;
        document.getElementById('thresholdType').value = threshold.type;
        document.getElementById('warningLevel').value = threshold.warningLevel;
        document.getElementById('applicableCrop').value = threshold.applicableCrop;
        
        // 处理多选区域
        const areaCheckboxes = document.querySelectorAll('input[name="applicableArea"]');
        if (areaCheckboxes) {
            // 清除所有选择
            areaCheckboxes.forEach(checkbox => checkbox.checked = false);
            
            // 处理区域选择
            let areasToSelect = [];
            if (Array.isArray(threshold.applicableArea)) {
                areasToSelect = threshold.applicableArea;
            } else {
                areasToSelect = [threshold.applicableArea];
            }
            
            // 如果包含"all"，选中所有区域
            if (areasToSelect.includes('all')) {
                areaCheckboxes.forEach(checkbox => checkbox.checked = true);
            } else {
                // 否则选择指定的区域
                areasToSelect.forEach(area => {
                    const checkbox = document.querySelector(`input[name="applicableArea"][value="${area}"]`);
                    if (checkbox) checkbox.checked = true;
                });
            }
        }
        
        document.getElementById('thresholdStatus').value = threshold.status;
        document.getElementById('priority').value = threshold.priority;
        document.getElementById('thresholdDescription').value = threshold.description || '';
        
        // 更新阈值配置字段并填充数据
        this.updateThresholdFields();
        setTimeout(() => {
            this.fillConfigFields(threshold.config);
        }, 100);
    }

    // 填充配置字段数据
    fillConfigFields(config) {
        const minValueEl = document.getElementById('configMinValue');
        const maxValueEl = document.getElementById('configMaxValue');
        const durationEl = document.getElementById('configDuration');
        const configDescEl = document.getElementById('configDescription');
        
        if (minValueEl) minValueEl.value = config.minValue || '';
        if (maxValueEl) maxValueEl.value = config.maxValue || '';
        if (durationEl) durationEl.value = config.duration || '';
        if (configDescEl) configDescEl.value = config.description || '';
    }

    // 更新阈值配置字段
    updateThresholdFields() {
        const thresholdType = document.getElementById('thresholdType').value;
        const configContainer = document.getElementById('thresholdConfig');
        
        if (!thresholdType) {
            configContainer.innerHTML = `
                <div class="config-placeholder">
                    <i class="fas fa-arrow-up"></i>
                    <p>请先选择监测类型</p>
                </div>
            `;
            return;
        }

        const typeInfo = this.getTypeConfigInfo(thresholdType);
        
        configContainer.innerHTML = `
            <div class="config-content active">
                <div class="config-row">
                    <div class="config-group">
                        <label class="config-label">最小值 ${typeInfo.unit}</label>
                        <input type="number" class="config-input" id="configMinValue" 
                               step="${typeInfo.step}" 
                               placeholder="留空表示无限制">
                        <p class="config-description">当数值大于等于此值时触发预警</p>
                    </div>
                    <div class="config-group">
                        <label class="config-label">最大值 ${typeInfo.unit}</label>
                        <input type="number" class="config-input" id="configMaxValue" 
                               step="${typeInfo.step}" 
                               placeholder="留空表示无限制">
                        <p class="config-description">当数值小于等于此值时触发预警</p>
                    </div>
                </div>
                ${thresholdType !== 'ndvi' ? `
                    <div class="config-row">
                        <div class="config-group">
                            <label class="config-label">持续时长 (小时)</label>
                            <input type="number" class="config-input" id="configDuration" 
                                   min="1" max="72" placeholder="1">
                            <p class="config-description">满足条件持续多长时间后触发预警</p>
                        </div>
                        <div class="config-group">
                            <label class="config-label">配置说明</label>
                            <input type="text" class="config-input" id="configDescription" 
                                   placeholder="简要描述此阈值配置">
                            <p class="config-description">用于系统内部识别和日志记录</p>
                        </div>
                    </div>
                ` : `
                    <div class="config-row">
                        <div class="config-group">
                            <label class="config-label">配置说明</label>
                            <input type="text" class="config-input" id="configDescription" 
                                   placeholder="简要描述此阈值配置">
                            <p class="config-description">NDVI指数不需要持续时长，立即生效</p>
                        </div>
                        <div class="config-group">
                            <!-- 占位 -->
                        </div>
                    </div>
                `}
            </div>
        `;
    }

    // 获取类型配置信息
    getTypeConfigInfo(type) {
        const configMap = {
            'temperature': {
                unit: '(°C)',
                step: '0.1',
                range: '-50 ~ 60'
            },
            'humidity': {
                unit: '(%)',
                step: '1',
                range: '0 ~ 100'
            },
            'ndvi': {
                unit: '',
                step: '0.01',
                range: '-1 ~ 1'
            }
        };
        return configMap[type] || { unit: '', step: '1', range: '' };
    }

    // 保存阈值
    saveThreshold() {
        // 获取多选区域的值
        const areaCheckboxes = document.querySelectorAll('input[name="applicableArea"]:checked');
        const selectedAreas = Array.from(areaCheckboxes).map(checkbox => checkbox.value);
        
        // 如果选择了"全部区域"，只保存 ['all']，否则保存具体区域
        let finalAreas;
        if (selectedAreas.includes('all')) {
            finalAreas = ['all'];
        } else {
            finalAreas = selectedAreas.length > 0 ? selectedAreas : ['all'];
        }
        
        const formData = {
            name: document.getElementById('thresholdName').value.trim(),
            type: document.getElementById('thresholdType').value,
            warningLevel: document.getElementById('warningLevel').value,
            applicableCrop: document.getElementById('applicableCrop').value,
            applicableArea: finalAreas,
            status: document.getElementById('thresholdStatus').value,
            priority: parseInt(document.getElementById('priority').value),
            description: document.getElementById('thresholdDescription').value.trim()
        };

        // 验证基本字段
        if (!formData.name || !formData.type || !formData.warningLevel) {
            Utils.showMessage('请填写所有必填字段', 'error');
            return;
        }

        // 获取配置数据
        const config = this.getConfigData(formData.type);
        if (!config) {
            Utils.showMessage('阈值配置不能为空', 'error');
            return;
        }

        // 检查阈值名称重复（编辑时排除自身）
        const existingThreshold = this.thresholdData.find(t => 
            t.name === formData.name && t.id !== this.editingThresholdId
        );
        if (existingThreshold) {
            Utils.showMessage('阈值名称已存在', 'error');
            return;
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if (this.editingThresholdId) {
            // 编辑模式
            const index = this.thresholdData.findIndex(t => t.id === this.editingThresholdId);
            if (index !== -1) {
                this.thresholdData[index] = {
                    ...this.thresholdData[index],
                    ...formData,
                    config,
                    updateTime: now
                };
                Utils.showMessage('阈值更新成功', 'success');
            }
        } else {
            // 新增模式
            const newId = Math.max(...this.thresholdData.map(t => t.id), 0) + 1;
            this.thresholdData.push({
                id: newId,
                ...formData,
                config,
                createTime: now,
                updateTime: now
            });
            Utils.showMessage('阈值添加成功', 'success');
        }

        this.closeThresholdModal();
        this.loadThresholdData();
        this.renderThresholdStats();
    }

    // 获取配置数据
    getConfigData(type) {
        const minValue = document.getElementById('configMinValue')?.value;
        const maxValue = document.getElementById('configMaxValue')?.value;
        const duration = document.getElementById('configDuration')?.value;
        const description = document.getElementById('configDescription')?.value;

        // 验证至少设置了最小值或最大值
        if (!minValue && !maxValue) {
            return null;
        }

        const typeInfo = this.getTypeConfigInfo(type);
        
        return {
            minValue: minValue ? parseFloat(minValue) : null,
            maxValue: maxValue ? parseFloat(maxValue) : null,
            unit: typeInfo.unit.replace(/[()]/g, ''),
            duration: type !== 'ndvi' ? (duration ? parseInt(duration) : 1) : null,
            description: description || ''
        };
    }

    // 导出阈值数据
    exportThresholdData() {
        // 创建CSV内容
        const headers = ['阈值名称', '监测类型', '预警等级', '阈值范围', '适用作物', '适用区域', '状态', '优先级', '创建时间', '说明'];
        const csvContent = [
            headers.join(','),
            ...this.thresholdData.map(threshold => [
                threshold.name,
                this.getTypeLabel(threshold.type),
                this.getWarningLabel(threshold.warningLevel),
                this.formatThresholdRange(threshold.config),
                this.getCropLabel(threshold.applicableCrop),
                this.getAreaLabel(threshold.applicableArea),
                threshold.status === 'active' ? '启用' : '禁用',
                this.getPriorityLabel(threshold.priority),
                threshold.createTime,
                threshold.description || ''
            ].join(','))
        ].join('\n');

        // 下载文件
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `灾害阈值配置_${Utils.formatDate(new Date(), 'YYYY-MM-DD')}.csv`;
        link.click();

        Utils.showMessage('配置导出成功', 'success');
    }

    // 模态框控制
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    closeThresholdModal() {
        this.editingThresholdId = null;
        this.closeModal('thresholdModal');
    }

    closeThresholdDetailModal() {
        this.currentViewingThreshold = null;
        this.closeModal('thresholdDetailModal');
    }

    closeDeleteThresholdModal() {
        this.deletingThresholdId = null;
        this.closeModal('deleteThresholdModal');
    }
}

// 全局函数
function showAddThresholdModal() {
    if (window.thresholdManager) {
        window.thresholdManager.showAddThresholdModal();
    }
}

function updateThresholdFields() {
    if (window.thresholdManager) {
        window.thresholdManager.updateThresholdFields();
    }
}

function closeThresholdModal() {
    if (window.thresholdManager) {
        window.thresholdManager.closeThresholdModal();
    }
}

function saveThreshold() {
    if (window.thresholdManager) {
        window.thresholdManager.saveThreshold();
    }
}

function closeThresholdDetailModal() {
    if (window.thresholdManager) {
        window.thresholdManager.closeThresholdDetailModal();
    }
}

function editCurrentThreshold() {
    if (window.thresholdManager) {
        window.thresholdManager.editCurrentThreshold();
    }
}

function closeDeleteThresholdModal() {
    if (window.thresholdManager) {
        window.thresholdManager.closeDeleteThresholdModal();
    }
}

function confirmDeleteThreshold() {
    if (window.thresholdManager) {
        window.thresholdManager.confirmDeleteThreshold();
    }
}

function exportThresholdData() {
    if (window.thresholdManager) {
        window.thresholdManager.exportThresholdData();
    }
}

// 处理区域复选框逻辑
function handleAreaCheckboxChange(checkbox) {
    const allCheckbox = document.querySelector('input[name="applicableArea"][value="all"]');
    const otherCheckboxes = document.querySelectorAll('input[name="applicableArea"]:not([value="all"])');
    
    if (checkbox.value === 'all') {
        // 如果点击的是"全部区域"
        if (checkbox.checked) {
            // 选中"全部区域"时，选中所有其他区域
            otherCheckboxes.forEach(cb => cb.checked = true);
        } else {
            // 取消"全部区域"时，取消所有其他区域
            otherCheckboxes.forEach(cb => cb.checked = false);
        }
    } else {
        // 如果点击的是具体区域
        if (checkbox.checked) {
            // 检查是否所有具体区域都被选中
            const allOthersChecked = Array.from(otherCheckboxes).every(cb => cb.checked);
            if (allOthersChecked) {
                // 如果所有具体区域都被选中，自动选中"全部区域"
                if (allCheckbox) allCheckbox.checked = true;
            }
        } else {
            // 取消具体区域时，取消"全部区域"
            if (allCheckbox) allCheckbox.checked = false;
            
            // 检查是否还有其他区域被选中
            const hasOtherChecked = Array.from(otherCheckboxes).some(cb => cb.checked);
            if (!hasOtherChecked) {
                // 如果没有任何具体区域被选中，自动选择"全部区域"
                if (allCheckbox) {
                    allCheckbox.checked = true;
                    // 选中"全部区域"时，选中所有其他区域
                    otherCheckboxes.forEach(cb => cb.checked = true);
                }
            }
        }
    }
    
    // 更新选择状态的视觉反馈
    updateAreaSelectionDisplay();
}

// 更新区域选择的显示状态
function updateAreaSelectionDisplay() {
    const allCheckbox = document.querySelector('input[name="applicableArea"][value="all"]');
    const otherCheckboxes = document.querySelectorAll('input[name="applicableArea"]:not([value="all"])');
    const checkedOthers = Array.from(otherCheckboxes).filter(cb => cb.checked);
    
    // 更新帮助文本
    const helpText = document.querySelector('.checkbox-help span');
    if (helpText) {
        if (allCheckbox && allCheckbox.checked) {
            helpText.textContent = '已选择全部区域';
            helpText.style.color = '#52c41a';
            helpText.style.fontWeight = '500';
        } else if (checkedOthers.length > 0) {
            const areaNames = checkedOthers.map(cb => {
                const label = cb.closest('.checkbox-item').querySelector('.checkbox-text');
                return label ? label.textContent.trim() : cb.value;
            }).join('、');
            helpText.textContent = `已选择：${areaNames}`;
            helpText.style.color = '#1890ff';
            helpText.style.fontWeight = '500';
        } else {
            helpText.textContent = '可以选择多个区域，选择"全部区域"将应用于所有乡镇';
            helpText.style.color = '#52c41a';
            helpText.style.fontWeight = 'normal';
        }
        
        // 2秒后恢复原始样式
        setTimeout(() => {
            if (helpText.textContent.includes('已选择')) {
                helpText.textContent = '可以选择多个区域，选择"全部区域"将应用于所有乡镇';
                helpText.style.color = '#52c41a';
                helpText.style.fontWeight = 'normal';
            }
        }, 3000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.thresholdManager = new DisasterThresholdManager();
});
