/**
 * 种植面积管理页面功能模块
 */

class PlantingAreaManager {
    constructor() {
        this.currentUser = Auth.getCurrentUser();
        this.editingPlantingAreaId = null;
        this.currentSelectedMonth = '2024-01'; // 当前选择的月份
        
        // 模拟三级树状数据：月份 -> 乡镇 -> 作物
        this.plantingAreaData = [
            { id: 1, township: '临夏镇', crop: '小麦', area: 1200, month: '2024-01', updateTime: '2024-01-15 10:30:00', remark: '春小麦主产区' },
            { id: 2, township: '临夏镇', crop: '玉米', area: 800, month: '2024-01', updateTime: '2024-01-15 10:35:00', remark: '' },
            { id: 3, township: '临夏镇', crop: '青稞', area: 450, month: '2024-01', updateTime: '2024-01-15 10:40:00', remark: '高海拔地区种植' },
            { id: 4, township: '东乡镇', crop: '小麦', area: 950, month: '2024-01', updateTime: '2024-01-15 11:00:00', remark: '' },
            { id: 5, township: '东乡镇', crop: '青稞', area: 600, month: '2024-01', updateTime: '2024-01-15 11:15:00', remark: '传统种植作物' },
            { id: 6, township: '积石山镇', crop: '小麦', area: 780, month: '2024-01', updateTime: '2024-01-15 11:30:00', remark: '' },
            { id: 7, township: '积石山镇', crop: '土豆', area: 320, month: '2024-01', updateTime: '2024-01-15 11:45:00', remark: '新增种植品种' },

            { id: 8, township: '临夏镇', crop: '小麦', area: 1150, month: '2024-02', updateTime: '2024-02-15 09:20:00', remark: '面积略有增加' },
            { id: 9, township: '临夏镇', crop: '玉米', area: 850, month: '2024-02', updateTime: '2024-02-15 09:25:00', remark: '' },
            { id: 10, township: '临夏镇', crop: '青稞', area: 480, month: '2024-02', updateTime: '2024-02-15 09:30:00', remark: '' },
            { id: 11, township: '东乡镇', crop: '小麦', area: 980, month: '2024-02', updateTime: '2024-02-15 10:10:00', remark: '' },
            { id: 12, township: '东乡镇', crop: '青稞', area: 620, month: '2024-02', updateTime: '2024-02-15 10:30:00', remark: '' },
            { id: 13, township: '积石山镇', crop: '小麦', area: 820, month: '2024-02', updateTime: '2024-02-15 10:45:00', remark: '' },
            { id: 14, township: '积石山镇', crop: '土豆', area: 350, month: '2024-02', updateTime: '2024-02-15 11:00:00', remark: '种植面积扩大' },

            { id: 15, township: '临夏镇', crop: '小麦', area: 1180, month: '2024-03', updateTime: '2024-03-15 09:20:00', remark: '' },
            { id: 16, township: '临夏镇', crop: '玉米', area: 880, month: '2024-03', updateTime: '2024-03-15 09:25:00', remark: '' },
            { id: 17, township: '东乡镇', crop: '小麦', area: 1020, month: '2024-03', updateTime: '2024-03-15 10:10:00', remark: '' },
            { id: 18, township: '东乡镇', crop: '青稞', area: 650, month: '2024-03', updateTime: '2024-03-15 10:30:00', remark: '' }
        ];
        
        this.init();
    }
    
    init() {
        this.initUserInfo();
        this.bindEvents();
        this.loadPlantingAreaData();
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
    
    bindEvents() {
        // 搜索事件
        const plantingSearchInput = document.getElementById('plantingSearchInput');
        if (plantingSearchInput) {
            plantingSearchInput.addEventListener('input', Utils.debounce(() => {
                this.loadPlantingAreaData();
            }, 300));
        }

        // 模态框事件
        this.bindModalEvents();
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

    // 月份导航相关方法
    formatMonthTitle(month) {
        const [year, monthNum] = month.split('-');
        return `${year}年${parseInt(monthNum)}月`;
    }

    renderDateNavigation() {
        const dateNavList = document.getElementById('dateNavList');
        if (!dateNavList) return;

        // 获取所有月份并去重
        const months = [...new Set(this.plantingAreaData.map(item => item.month))].sort();
        
        let navHtml = '';
        months.forEach(month => {
            const dataCount = this.plantingAreaData.filter(item => item.month === month).length;
            const isActive = month === this.currentSelectedMonth;
            
            navHtml += `
                <div class="date-nav-item ${isActive ? 'active' : ''}" data-month="${month}" onclick="window.plantingManager.switchMonth('${month}')">
                    <span class="date-text">${this.formatMonthTitle(month)}</span>
                    <span class="data-count">${dataCount}</span>
                </div>
            `;
        });
        
        dateNavList.innerHTML = navHtml;
    }

    switchMonth(month) {
        this.currentSelectedMonth = month;
        this.renderDateNavigation();
        this.loadPlantingAreaData();
    }

    // 数据统计
    renderDataSummary() {
        const dataSummary = document.getElementById('dataSummary');
        if (!dataSummary) return;

        const currentMonthData = this.plantingAreaData.filter(item => item.month === this.currentSelectedMonth);
        const totalArea = currentMonthData.reduce((sum, item) => sum + item.area, 0);
        const townshipCount = new Set(currentMonthData.map(item => item.township)).size;
        const cropTypeCount = new Set(currentMonthData.map(item => item.crop)).size;

        dataSummary.innerHTML = `
            <div class="summary-item">
                <span class="summary-label">总面积:</span>
                <span class="summary-value">${totalArea.toLocaleString()} 亩</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">乡镇数量:</span>
                <span class="summary-value">${townshipCount} 个</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">作物种类:</span>
                <span class="summary-value">${cropTypeCount} 种</span>
            </div>
        `;
    }

    // 种植面积数据加载
    loadPlantingAreaData() {
        const container = document.getElementById('plantingTreeContainer');
        if (!container) return;

        // 更新月份标题
        const monthTitle = document.getElementById('currentMonthTitle');
        if (monthTitle) {
            monthTitle.textContent = `${this.formatMonthTitle(this.currentSelectedMonth)} 种植面积数据`;
        }

        // 渲染日期导航
        this.renderDateNavigation();
        
        // 渲染数据统计
        this.renderDataSummary();

        // 获取当前月份数据
        let currentMonthData = this.plantingAreaData.filter(item => item.month === this.currentSelectedMonth);

        // 搜索过滤
        const searchInput = document.getElementById('plantingSearchInput');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.trim().toLowerCase();
            currentMonthData = currentMonthData.filter(item => 
                item.township.toLowerCase().includes(searchTerm) || 
                item.crop.toLowerCase().includes(searchTerm)
            );
        }

        // 按乡镇分组
        const groupedData = {};
        currentMonthData.forEach(item => {
            if (!groupedData[item.township]) {
                groupedData[item.township] = [];
            }
            groupedData[item.township].push(item);
        });

        // 生成树状HTML
        let treeHtml = '';
        Object.entries(groupedData).forEach(([township, crops]) => {
            const townshipTotal = crops.reduce((sum, crop) => sum + crop.area, 0);
            
            treeHtml += `
                <div class="tree-node township-node">
                    <div class="tree-node-header" onclick="toggleTreeNode(this)">
                        <i class="fas fa-chevron-down tree-icon"></i>
                        <i class="fas fa-map-marker-alt node-icon"></i>
                        <span class="node-title">${township}</span>
                        <span class="node-summary">${townshipTotal.toLocaleString()} 亩 (${crops.length} 种作物)</span>
                    </div>
                    <div class="tree-node-children">
                        ${crops.map(crop => `
                            <div class="tree-node crop-node">
                                <div class="crop-info">
                                    <div class="crop-header">
                                        <i class="fas fa-seedling crop-icon"></i>
                                        <span class="crop-name">${crop.crop}</span>
                                        <span class="crop-area">${crop.area.toLocaleString()} 亩</span>
                                    </div>
                                    <div class="crop-details">
                                        <span class="crop-update-time">更新时间: ${Utils.formatDate(crop.updateTime, 'MM-DD HH:mm')}</span>
                                        ${crop.remark ? `<span class="crop-remark">${crop.remark}</span>` : ''}
                                    </div>
                                </div>
                                <div class="crop-actions">
                                    <button class="btn btn-sm btn-primary" onclick="window.plantingManager.editPlantingArea(${crop.id})" title="编辑">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });

        container.innerHTML = treeHtml || '<div class="empty-state">暂无数据</div>';
    }

    // 编辑种植面积
    editPlantingArea(id) {
        const item = this.plantingAreaData.find(d => d.id === id);
        if (!item) return;

        this.editingPlantingAreaId = id;
        
        // 填充表单数据
        document.getElementById('editMonth').value = this.formatMonthTitle(item.month);
        document.getElementById('editTownship').value = item.township;
        document.getElementById('editCrop').value = item.crop;
        document.getElementById('editArea').value = item.area;
        document.getElementById('editRemark').value = item.remark || '';
        document.getElementById('editUpdateTime').value = Utils.formatDate(item.updateTime);

        this.showModal('editPlantingAreaModal');
    }

    // 保存种植面积编辑
    savePlantingAreaEdit() {
        if (!this.editingPlantingAreaId) return;

        const area = parseFloat(document.getElementById('editArea').value);
        const remark = document.getElementById('editRemark').value.trim();

        if (isNaN(area) || area < 0) {
            Utils.showMessage('请输入有效的种植面积', 'error');
            return;
        }

        // 更新数据
        const itemIndex = this.plantingAreaData.findIndex(d => d.id === this.editingPlantingAreaId);
        if (itemIndex !== -1) {
            this.plantingAreaData[itemIndex].area = area;
            this.plantingAreaData[itemIndex].remark = remark;
            this.plantingAreaData[itemIndex].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
        }

        Utils.showMessage('种植面积更新成功', 'success');
        this.closeEditPlantingAreaModal();
        this.loadPlantingAreaData();
    }

    // 导出种植面积数据
    exportPlantingData() {
        const currentMonthData = this.plantingAreaData.filter(item => item.month === this.currentSelectedMonth);
        
        // 创建CSV内容
        const headers = ['乡镇', '作物', '种植面积(亩)', '更新时间', '备注'];
        const csvContent = [
            headers.join(','),
            ...currentMonthData.map(item => [
                item.township,
                item.crop,
                item.area,
                item.updateTime,
                item.remark || ''
            ].join(','))
        ].join('\n');

        // 下载文件
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `种植面积数据_${this.formatMonthTitle(this.currentSelectedMonth)}.csv`;
        link.click();

        Utils.showMessage('数据导出成功', 'success');
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

    closeEditPlantingAreaModal() {
        this.editingPlantingAreaId = null;
        this.closeModal('editPlantingAreaModal');
    }
}

// 全局函数
function expandAllNodes() {
    document.querySelectorAll('.tree-node-header').forEach(header => {
        const icon = header.querySelector('.tree-icon');
        const children = header.nextElementSibling;
        if (children && !children.classList.contains('show')) {
            children.classList.add('show');
            icon.style.transform = 'rotate(90deg)';
        }
    });
}

function collapseAllNodes() {
    document.querySelectorAll('.tree-node-header').forEach(header => {
        const icon = header.querySelector('.tree-icon');
        const children = header.nextElementSibling;
        if (children && children.classList.contains('show')) {
            children.classList.remove('show');
            icon.style.transform = 'rotate(0deg)';
        }
    });
}

function toggleTreeNode(header) {
    const icon = header.querySelector('.tree-icon');
    const children = header.nextElementSibling;
    
    if (children) {
        children.classList.toggle('show');
        const isExpanded = children.classList.contains('show');
        icon.style.transform = isExpanded ? 'rotate(90deg)' : 'rotate(0deg)';
    }
}

function exportPlantingData() {
    if (window.plantingManager) {
        window.plantingManager.exportPlantingData();
    }
}

function closeEditPlantingAreaModal() {
    if (window.plantingManager) {
        window.plantingManager.closeEditPlantingAreaModal();
    }
}

function savePlantingAreaEdit() {
    if (window.plantingManager) {
        window.plantingManager.savePlantingAreaEdit();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.plantingManager = new PlantingAreaManager();
});
