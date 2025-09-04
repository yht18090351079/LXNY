/**
 * 作物基础信息管理页面功能模块
 */

class CropInfoManager {
    constructor() {
        this.currentUser = Auth.getCurrentUser();
        this.editingCropId = null;
        this.currentViewingCrop = null;
        
        // 作物基础信息数据
        this.cropInfoData = [
            { 
                id: 1, 
                name: '小麦', 
                category: '粮食作物', 
                growthPeriod: 180, 
                season: '春季', 
                description: '主要粮食作物，适应性强，营养价值高',
                techPoints: '适时播种，合理密植，科学施肥',
                expectedYield: 450,
                createTime: '2024-01-01 00:00:00',
                updateTime: '2024-01-01 00:00:00'
            },
            { 
                id: 2, 
                name: '玉米', 
                category: '粮食作物', 
                growthPeriod: 120, 
                season: '夏季', 
                description: '重要的粮食和饲料作物，产量高',
                techPoints: '选用优良品种，加强田间管理',
                expectedYield: 650,
                createTime: '2024-01-01 00:00:00',
                updateTime: '2024-01-01 00:00:00'
            },
            { 
                id: 3, 
                name: '青稞', 
                category: '粮食作物', 
                growthPeriod: 150, 
                season: '春季', 
                description: '高原特色作物，抗寒性强',
                techPoints: '选择适宜地块，注意防寒保温',
                expectedYield: 300,
                createTime: '2024-01-01 00:00:00',
                updateTime: '2024-01-01 00:00:00'
            },
            { 
                id: 4, 
                name: '土豆', 
                category: '薯类作物', 
                growthPeriod: 90, 
                season: '春季', 
                description: '重要的薯类作物，营养丰富',
                techPoints: '选择优质种薯，合理轮作',
                expectedYield: 2000,
                createTime: '2024-01-01 00:00:00',
                updateTime: '2024-01-01 00:00:00'
            },
            { 
                id: 5, 
                name: '油菜', 
                category: '经济作物', 
                growthPeriod: 200, 
                season: '秋冬', 
                description: '重要的油料作物，经济价值高',
                techPoints: '合理密植，加强花期管理',
                expectedYield: 200,
                createTime: '2024-01-01 00:00:00',
                updateTime: '2024-01-01 00:00:00'
            },
            { 
                id: 6, 
                name: '豌豆', 
                category: '蔬菜作物', 
                growthPeriod: 80, 
                season: '春季', 
                description: '豆科蔬菜，营养价值丰富',
                techPoints: '适时播种，注意病虫害防治',
                expectedYield: 1500,
                createTime: '2024-01-01 00:00:00',
                updateTime: '2024-01-01 00:00:00'
            },
            { 
                id: 7, 
                name: '蚕豆', 
                category: '蔬菜作物', 
                growthPeriod: 180, 
                season: '秋冬', 
                description: '豆科作物，既可做蔬菜又可做粮食',
                techPoints: '选择排水良好的地块，合理施肥',
                expectedYield: 1200,
                createTime: '2024-01-01 00:00:00',
                updateTime: '2024-01-01 00:00:00'
            }
        ];
        
        this.init();
    }
    
    init() {
        this.initUserInfo();
        this.bindEvents();
        this.loadCropInfoData();
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
        const cropSearchInput = document.getElementById('cropSearchInput');
        if (cropSearchInput) {
            cropSearchInput.addEventListener('input', Utils.debounce(() => {
                this.loadCropInfoData();
            }, 300));
        }

        // 模态框事件
        this.bindModalEvents();
        
        // 表单提交事件
        const cropForm = document.getElementById('cropForm');
        if (cropForm) {
            cropForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveCrop();
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

    // 加载作物信息数据
    loadCropInfoData() {
        const tableBody = document.getElementById('cropInfoTableBody');
        if (!tableBody) return;

        let filteredData = [...this.cropInfoData];

        // 搜索过滤
        const searchInput = document.getElementById('cropSearchInput');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filteredData = filteredData.filter(crop => 
                crop.name.toLowerCase().includes(searchTerm) ||
                crop.category.toLowerCase().includes(searchTerm)
            );
        }

        if (filteredData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">暂无数据</td></tr>';
            return;
        }

        const html = filteredData.map(crop => `
            <tr>
                <td>
                    <div class="crop-name-cell">
                        <i class="fas fa-seedling crop-icon"></i>
                        <span>${crop.name}</span>
                    </div>
                </td>
                <td>
                    <span class="category-badge category-${crop.category.replace(/作物$/, '')}">${crop.category}</span>
                </td>
                <td>${crop.growthPeriod}</td>
                <td>
                    <span class="season-badge season-${crop.season}">${crop.season}</span>
                </td>
                <td>${Utils.formatDate(crop.createTime, 'YYYY-MM-DD')}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline" onclick="window.cropManager.viewCropDetail(${crop.id})" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="window.cropManager.editCrop(${crop.id})" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="window.cropManager.deleteCrop(${crop.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = html;
    }

    // 显示新增作物模态框
    showAddCropModal() {
        this.editingCropId = null;
        this.resetCropForm();
        document.getElementById('cropModalTitle').textContent = '新增作物信息';
        this.showModal('cropModal');
    }

    // 编辑作物
    editCrop(id) {
        const crop = this.cropInfoData.find(c => c.id === id);
        if (!crop) return;

        this.editingCropId = id;
        this.fillCropForm(crop);
        document.getElementById('cropModalTitle').textContent = '编辑作物信息';
        this.showModal('cropModal');
    }

    // 查看作物详情
    viewCropDetail(id) {
        const crop = this.cropInfoData.find(c => c.id === id);
        if (!crop) return;

        this.currentViewingCrop = crop;
        this.renderCropDetail(crop);
        this.showModal('cropDetailModal');
    }

    // 渲染作物详情
    renderCropDetail(crop) {
        const container = document.getElementById('cropDetailContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="crop-detail-grid">
                <div class="detail-section">
                    <h4><i class="fas fa-info-circle"></i> 基本信息</h4>
                    <div class="detail-items">
                        <div class="detail-item">
                            <label>作物名称:</label>
                            <span>${crop.name}</span>
                        </div>
                        <div class="detail-item">
                            <label>作物类别:</label>
                            <span class="category-badge category-${crop.category.replace(/作物$/, '')}">${crop.category}</span>
                        </div>
                        <div class="detail-item">
                            <label>生长周期:</label>
                            <span>${crop.growthPeriod} 天</span>
                        </div>
                        <div class="detail-item">
                            <label>适宜季节:</label>
                            <span class="season-badge season-${crop.season}">${crop.season}</span>
                        </div>
                        <div class="detail-item">
                            <label>预期产量:</label>
                            <span>${crop.expectedYield} kg/亩</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-leaf"></i> 详细描述</h4>
                    <div class="detail-description">
                        ${crop.description || '暂无描述'}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-tools"></i> 技术要点</h4>
                    <div class="detail-tech-points">
                        ${crop.techPoints || '暂无技术要点'}
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-clock"></i> 时间信息</h4>
                    <div class="detail-items">
                        <div class="detail-item">
                            <label>创建时间:</label>
                            <span>${Utils.formatDate(crop.createTime)}</span>
                        </div>
                        <div class="detail-item">
                            <label>更新时间:</label>
                            <span>${Utils.formatDate(crop.updateTime)}</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // 编辑当前查看的作物
    editCurrentCrop() {
        if (this.currentViewingCrop) {
            this.closeCropDetailModal();
            setTimeout(() => {
                this.editCrop(this.currentViewingCrop.id);
            }, 100);
        }
    }

    // 删除作物
    deleteCrop(id) {
        const crop = this.cropInfoData.find(c => c.id === id);
        if (!crop) return;

        if (confirm(`确定要删除作物 "${crop.name}" 吗？此操作不可恢复。`)) {
            const index = this.cropInfoData.findIndex(c => c.id === id);
            if (index !== -1) {
                this.cropInfoData.splice(index, 1);
                Utils.showMessage('作物信息删除成功', 'success');
                this.loadCropInfoData();
            }
        }
    }

    // 重置表单
    resetCropForm() {
        const form = document.getElementById('cropForm');
        if (form) {
            form.reset();
        }
    }

    // 填充表单数据
    fillCropForm(crop) {
        document.getElementById('cropName').value = crop.name;
        document.getElementById('cropCategory').value = crop.category;
        document.getElementById('cropGrowthPeriod').value = crop.growthPeriod;
        document.getElementById('cropSeason').value = crop.season;
        document.getElementById('cropDescription').value = crop.description || '';
        document.getElementById('cropTechPoints').value = crop.techPoints || '';
        document.getElementById('cropExpectedYield').value = crop.expectedYield || '';
    }

    // 保存作物信息
    saveCrop() {
        const formData = {
            name: document.getElementById('cropName').value.trim(),
            category: document.getElementById('cropCategory').value,
            growthPeriod: parseInt(document.getElementById('cropGrowthPeriod').value),
            season: document.getElementById('cropSeason').value,
            description: document.getElementById('cropDescription').value.trim(),
            techPoints: document.getElementById('cropTechPoints').value.trim(),
            expectedYield: parseFloat(document.getElementById('cropExpectedYield').value) || 0
        };

        // 验证必填字段
        if (!formData.name || !formData.category || !formData.growthPeriod || !formData.season) {
            Utils.showMessage('请填写所有必填字段', 'error');
            return;
        }

        if (formData.growthPeriod <= 0 || formData.growthPeriod > 365) {
            Utils.showMessage('生长周期必须在1-365天之间', 'error');
            return;
        }

        // 检查作物名称重复（编辑时排除自身）
        const existingCrop = this.cropInfoData.find(c => 
            c.name === formData.name && c.id !== this.editingCropId
        );
        if (existingCrop) {
            Utils.showMessage('作物名称已存在', 'error');
            return;
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if (this.editingCropId) {
            // 编辑模式
            const index = this.cropInfoData.findIndex(c => c.id === this.editingCropId);
            if (index !== -1) {
                this.cropInfoData[index] = {
                    ...this.cropInfoData[index],
                    ...formData,
                    updateTime: now
                };
                Utils.showMessage('作物信息更新成功', 'success');
            }
        } else {
            // 新增模式
            const newId = Math.max(...this.cropInfoData.map(c => c.id), 0) + 1;
            this.cropInfoData.push({
                id: newId,
                ...formData,
                createTime: now,
                updateTime: now
            });
            Utils.showMessage('作物信息添加成功', 'success');
        }

        this.closeCropModal();
        this.loadCropInfoData();
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

    closeCropModal() {
        this.editingCropId = null;
        this.closeModal('cropModal');
    }

    closeCropDetailModal() {
        this.currentViewingCrop = null;
        this.closeModal('cropDetailModal');
    }
}

// 全局函数
function showAddCropModal() {
    if (window.cropManager) {
        window.cropManager.showAddCropModal();
    }
}

function closeCropModal() {
    if (window.cropManager) {
        window.cropManager.closeCropModal();
    }
}

function saveCrop() {
    if (window.cropManager) {
        window.cropManager.saveCrop();
    }
}

function closeCropDetailModal() {
    if (window.cropManager) {
        window.cropManager.closeCropDetailModal();
    }
}

function editCurrentCrop() {
    if (window.cropManager) {
        window.cropManager.editCurrentCrop();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.cropManager = new CropInfoManager();
});
