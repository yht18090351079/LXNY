/**
 * 数据管理页面功能模块
 */

class DataManagement {
    constructor() {
        this.currentTab = 'planting-area';
        this.currentUser = Auth.getCurrentUser();
        this.editingPlantingAreaId = null;
        this.currentDevice = null;
        this.currentDataType = 'weather-forecast';
        this.currentTimeRange = 7;
        this.historyChart = null;
        this.currentSelectedMonth = '2024-01'; // 当前选择的月份
        
        // 地图相关属性
        this.deviceMap = null;
        this.deviceMarkers = [];
        this.selectedDeviceId = null;
        this.currentMapType = 'standard'; // 'standard' 或 'satellite'
        this.mapProvider = null; // 'leaflet', 'baidu', 'amap'
        this.mapInitialized = false;
        
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
            }
        ];
        
        // 作物相关状态
        this.editingCropId = null;
        this.currentViewingCrop = null;
        
        this.imageData = [
            { id: 1, name: 'LC08_L1TP_20240115', type: 'Landsat', captureTime: '2024-01-15 02:30:00', uploadTime: '2024-01-15 10:00:00', size: '245MB' },
            { id: 2, name: 'S2A_MSIL1C_20240116', type: 'Sentinel', captureTime: '2024-01-16 03:15:00', uploadTime: '2024-01-16 11:30:00', size: '180MB' },
            { id: 3, name: 'MOD09GA_20240117', type: 'MODIS', captureTime: '2024-01-17 01:45:00', uploadTime: '2024-01-17 09:20:00', size: '95MB' },
            { id: 4, name: 'LC08_L1TP_20240118', type: 'Landsat', captureTime: '2024-01-18 02:45:00', uploadTime: '2024-01-18 10:15:00', size: '238MB' },
            { id: 5, name: 'S2B_MSIL1C_20240119', type: 'Sentinel', captureTime: '2024-01-19 03:30:00', uploadTime: '2024-01-19 11:45:00', size: '192MB' },
            { id: 6, name: 'MOD09GA_20240120', type: 'MODIS', captureTime: '2024-01-20 01:20:00', uploadTime: '2024-01-20 09:35:00', size: '88MB' }
        ];
        
        this.deviceData = [
            { id: 1, name: '气象站-001', type: '气象监测', location: '临夏镇中心', status: 'online', lastReport: '2024-01-20 14:30:00', longitude: 103.2012, latitude: 35.5889 },
            { id: 2, name: '土壤传感器-002', type: '土壤监测', location: '临夏镇农田A区', status: 'online', lastReport: '2024-01-20 14:25:00', longitude: 103.1876, latitude: 35.6123 },
            { id: 3, name: '摄像头-003', type: '视频监控', location: '东乡镇农田B区', status: 'offline', lastReport: '2024-01-19 16:45:00', longitude: 103.3901, latitude: 35.6645 },
            { id: 4, name: '气象站-004', type: '气象监测', location: '东乡镇中心', status: 'offline', lastReport: '2024-01-18 10:20:00', longitude: 103.3912, latitude: 35.6601 },
            { id: 5, name: '土壤传感器-005', type: '土壤监测', location: '积石山镇农田C区', status: 'online', lastReport: '2024-01-20 14:20:00', longitude: 102.8734, latitude: 35.7189 },
            { id: 6, name: '摄像头-006', type: '视频监控', location: '积石山镇农田D区', status: 'online', lastReport: '2024-01-20 14:15:00', longitude: 102.8456, latitude: 35.7345 },
            { id: 7, name: '气象站-007', type: '气象监测', location: '康乐镇中心', status: 'offline', lastReport: '2024-01-19 08:30:00', longitude: 103.7089, latitude: 35.3667 },
            { id: 8, name: '土壤传感器-008', type: '土壤监测', location: '和政镇农田E区', status: 'online', lastReport: '2024-01-20 14:10:00', longitude: 103.3501, latitude: 35.4234 }
        ];
        
        this.init();
    }
    
    init() {
        this.initUserInfo();
        this.bindEvents();
        this.loadTabContent();
    }
    
    initUserInfo() {
        if (this.currentUser) {
            document.getElementById('currentUserName').textContent = this.currentUser.name;
            document.getElementById('currentUserRole').textContent = 
                this.currentUser.role === 'superadmin' ? '超级管理员' : '乡镇管理员';
        }
    }
    
    bindEvents() {
        // 侧边栏子菜单切换
        document.querySelectorAll('.menu-child').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                if (tab) {
                    this.switchContent(tab);
                }
            });
        });

        // 侧边栏主菜单
        document.querySelectorAll('.menu-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                if (page === 'user-management') {
                    window.location.href = 'user-management.html';
                } else if (page === 'data-management') {
                    // 切换子菜单展开状态
                    this.toggleSubmenu(e.currentTarget);
                }
            });
        });

        // 搜索和筛选
        this.bindSearchEvents();

        // 模态框事件
        this.bindModalEvents();
    }

    bindSearchEvents() {
        // 种植面积搜索
        const plantingSearchInput = document.getElementById('plantingSearchInput');
        if (plantingSearchInput) {
            plantingSearchInput.addEventListener('input', Utils.debounce(() => {
                this.loadPlantingAreaData();
            }, 300));
        }

        // 设备状态筛选
        const deviceStatusFilter = document.getElementById('deviceStatusFilter');
        if (deviceStatusFilter) {
            deviceStatusFilter.addEventListener('change', () => {
                this.loadDeviceData();
            });
        }

        // 设备搜索
        const deviceSearchInput = document.getElementById('deviceSearchInput');
        if (deviceSearchInput) {
            deviceSearchInput.addEventListener('input', Utils.debounce(() => {
                this.loadDeviceData();
            }, 300));
        }

        // 作物搜索
        const cropSearchInput = document.getElementById('cropSearchInput');
        if (cropSearchInput) {
            cropSearchInput.addEventListener('input', Utils.debounce(() => {
                this.loadCropInfoData();
            }, 300));
        }
    }

    bindModalEvents() {
        // 点击模态框背景关闭
        const modal = document.getElementById('editPlantingAreaModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeEditPlantingAreaModal();
                }
            });
        }

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                this.closeEditPlantingAreaModal();
            }
        });

        // 表单提交事件
        const form = document.getElementById('editPlantingAreaForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePlantingAreaEdit();
            });
        }

        // 面积输入框回车保存
        const areaInput = document.getElementById('editArea');
        if (areaInput) {
            areaInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.savePlantingAreaEdit();
                }
            });
        }
    }
    
    switchContent(contentName) {
        // 更新侧边栏子菜单状态
        document.querySelectorAll('.menu-child').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${contentName}"]`).classList.add('active');

        // 更新内容区域
        document.querySelectorAll('.content-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(contentName).classList.add('active');

        // 更新面包屑
        this.updateBreadcrumb(contentName);

        this.currentTab = contentName;
        this.loadTabContent();
    }

    toggleSubmenu(menuItem) {
        const submenu = menuItem.parentElement.querySelector('.menu-submenu');
        if (submenu) {
            submenu.classList.toggle('show');
            menuItem.classList.toggle('expanded');
        }
    }

    updateBreadcrumb(contentName) {
        const contentMap = {
            'planting-area': {
                title: '种植面积管理',
                description: '管理各乡镇的作物种植面积数据，按月份统计'
            },
            'crop-info': {
                title: '作物基础信息',
                description: '管理系统中的作物基础信息，包括作物名称、类别、生长周期等'
            },
            'image-data': {
                title: '影像数据',
                description: '管理遥感影像数据，包括Landsat、Sentinel、MODIS等卫星数据'
            },
            'device-data': {
                title: '设备数据',
                description: '管理农田监测设备，包括气象站、土壤传感器、摄像头等设备状态'
            }
        };

        const breadcrumb = document.querySelector('.breadcrumb');
        const pageTitle = document.getElementById('pageTitle');
        const pageDescription = document.getElementById('pageDescription');

        if (contentMap[contentName]) {
            const content = contentMap[contentName];

            // 更新面包屑
            if (breadcrumb) {
                breadcrumb.innerHTML = `
                    <div class="breadcrumb-item">
                        <i class="fas fa-home"></i>
                        <span>首页</span>
                    </div>
                    <span class="breadcrumb-separator">/</span>
                    <div class="breadcrumb-item">
                        <span>数据管理</span>
                    </div>
                    <span class="breadcrumb-separator">/</span>
                    <div class="breadcrumb-item">
                        <span>${content.title}</span>
                    </div>
                `;
            }

            // 更新页面标题和描述
            if (pageTitle) pageTitle.textContent = content.title;
            if (pageDescription) pageDescription.textContent = content.description;
        }
    }
    
    loadTabContent() {
        switch (this.currentTab) {
            case 'planting-area':
                this.loadPlantingAreaData();
                break;
            case 'crop-info':
                this.loadCropInfoData();
                break;
            case 'image-data':
                this.loadImageData();
                break;
            case 'device-data':
                this.loadDeviceData();
                break;
        }
    }
    
    loadPlantingAreaData() {
        // 加载日期导航
        this.loadDateNavigation();
        
        // 加载当前月份的数据
        this.loadCurrentMonthData();
    }

    // 加载日期导航
    loadDateNavigation() {
        const dateNavList = document.getElementById('dateNavList');
        if (!dateNavList) return;

        // 获取所有可用的月份
        const availableMonths = [...new Set(this.plantingAreaData.map(item => item.month))].sort();
        
        let dateNavHtml = '';
        availableMonths.forEach(month => {
            const monthData = this.plantingAreaData.filter(item => item.month === month);
            const dataCount = monthData.length;
            const isActive = month === this.currentSelectedMonth;
            
            dateNavHtml += `
                <div class="date-nav-item ${isActive ? 'active' : ''}" data-month="${month}" onclick="window.dataManager.switchMonth('${month}')">
                    <span class="date-text">${this.formatMonthTitle(month)}</span>
                    <span class="data-count">${dataCount}</span>
                </div>
            `;
        });
        
        dateNavList.innerHTML = dateNavHtml;
    }

    // 加载当前月份的数据
    loadCurrentMonthData() {
        const container = document.getElementById('plantingTreeContainer');
        if (!container) return;

        // 更新页面标题和汇总信息
        this.updateDataHeader();
        
        // 构建并渲染树状数据
        const treeData = this.buildTreeData();
        container.innerHTML = this.renderTreeNodes(treeData);
    }

    // 更新数据头部信息
    updateDataHeader() {
        const monthTitleElement = document.getElementById('currentMonthTitle');
        const dataSummaryElement = document.getElementById('dataSummary');
        
        if (monthTitleElement) {
            monthTitleElement.textContent = `${this.formatMonthTitle(this.currentSelectedMonth)} 种植面积数据`;
        }

        if (dataSummaryElement) {
            const currentMonthData = this.plantingAreaData.filter(item => item.month === this.currentSelectedMonth);
            const totalArea = currentMonthData.reduce((sum, item) => sum + item.area, 0);
            const townshipCount = new Set(currentMonthData.map(item => item.township)).size;
            const cropCount = new Set(currentMonthData.map(item => item.crop)).size;

            dataSummaryElement.innerHTML = `
                <div class="summary-item">
                    <span class="summary-label">总面积:</span>
                    <span class="summary-value">${totalArea.toLocaleString()} 亩</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">涉及乡镇:</span>
                    <span class="summary-value">${townshipCount} 个</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">作物种类:</span>
                    <span class="summary-value">${cropCount} 种</span>
                </div>
                <div class="summary-item">
                    <span class="summary-label">数据条目:</span>
                    <span class="summary-value">${currentMonthData.length} 条</span>
                </div>
            `;
        }
    }

    // 切换月份
    switchMonth(month) {
        if (month === this.currentSelectedMonth) return;
        
        this.currentSelectedMonth = month;
        
        // 更新导航状态
        document.querySelectorAll('.date-nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.month === month);
        });
        
        // 重新加载当前月份数据
        this.loadCurrentMonthData();
    }

    buildTreeData() {
        // 只获取当前选择月份的数据
        let data = this.getFilteredPlantingAreaData().filter(item => item.month === this.currentSelectedMonth);

        // 按乡镇分组
        const townshipGroups = {};
        data.forEach(item => {
            if (!townshipGroups[item.township]) {
                townshipGroups[item.township] = [];
            }
            townshipGroups[item.township].push(item);
        });

        // 转换为两级树状结构：乡镇 -> 作物
        const treeData = [];
        Object.keys(townshipGroups).sort().forEach(township => {
            const townshipNode = {
                id: `township-${this.currentSelectedMonth}-${township}`,
                type: 'township',
                title: township,
                month: this.currentSelectedMonth,
                township: township,
                expanded: true,
                children: []
            };

            townshipGroups[township].forEach(crop => {
                townshipNode.children.push({
                    id: `crop-${crop.id}`,
                    type: 'crop',
                    title: crop.crop,
                    area: crop.area,
                    updateTime: crop.updateTime,
                    data: crop,
                    leaf: true
                });
            });

            // 计算乡镇总面积
            townshipNode.totalArea = townshipNode.children.reduce((sum, crop) => sum + crop.area, 0);
            treeData.push(townshipNode);
        });

        return treeData;
    }

    renderTreeNodes(nodes, level = 1) {
        return nodes.map(node => {
            const hasChildren = node.children && node.children.length > 0;
            const isExpanded = node.expanded;

            let content = `
                <div class="tree-node level-${level} ${isExpanded ? 'expanded' : ''} ${node.leaf ? 'leaf' : ''}" data-id="${node.id}">
                    <div class="tree-node-content" onclick="toggleTreeNode('${node.id}')">
                        ${hasChildren ? `<i class="fas fa-chevron-right tree-expand-icon"></i>` : '<span class="tree-expand-icon"></span>'}
                        <i class="tree-node-icon ${this.getNodeIcon(node.type)}"></i>
                        <div class="tree-node-label">
                            <span class="tree-node-title">${node.title}</span>
                            <div class="tree-node-meta">
                                ${this.getNodeMeta(node)}
                                ${this.getNodeActions(node)}
                            </div>
                        </div>
                    </div>
            `;

            if (hasChildren) {
                content += `
                    <div class="tree-children">
                        ${this.renderTreeNodes(node.children, level + 1)}
                    </div>
                `;
            }

            content += '</div>';
            return content;
        }).join('');
    }

    getNodeIcon(type) {
        switch (type) {
            case 'month': return 'fas fa-calendar-alt';
            case 'township': return 'fas fa-map-marker-alt';
            case 'crop': return 'fas fa-seedling';
            default: return 'fas fa-circle';
        }
    }

    getNodeMeta(node) {
        switch (node.type) {
            case 'month':
                return `<span>总面积: ${node.totalArea}亩</span><span>乡镇数: ${node.children.length}</span>`;
            case 'township':
                return `<span>总面积: ${node.totalArea}亩</span><span>作物数: ${node.children.length}</span>`;
            case 'crop':
                return `<span>面积: ${node.area}亩</span><span>更新: ${node.updateTime}</span>`;
            default:
                return '';
        }
    }

    getNodeActions(node) {
        if (node.type === 'crop') {
            return `
                <div class="tree-node-actions">
                    <button class="tree-action-btn edit" onclick="editPlantingArea(${node.data.id})" title="编辑">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            `;
        }
        return '';
    }

    formatMonthTitle(month) {
        const [year, monthNum] = month.split('-');
        return `${year}年${parseInt(monthNum)}月`;
    }

    showEditPlantingAreaModal(id) {
        const item = this.plantingAreaData.find(data => data.id === id);
        if (!item) {
            Utils.showMessage('未找到对应的种植面积记录', 'error');
            return;
        }

        // 检查权限
        if (this.currentUser.role === 'township' && item.township !== this.currentUser.township) {
            Utils.showMessage('您没有权限编辑其他乡镇的数据', 'error');
            return;
        }

        this.editingPlantingAreaId = id;

        // 填充表单数据
        document.getElementById('editMonth').value = this.formatMonthTitle(item.month);
        document.getElementById('editTownship').value = item.township;
        document.getElementById('editCrop').value = item.crop;
        document.getElementById('editArea').value = item.area;
        document.getElementById('editRemark').value = item.remark || '';
        document.getElementById('editUpdateTime').value = item.updateTime;

        // 显示模态框
        document.getElementById('editPlantingAreaModal').classList.add('show');

        // 聚焦到面积输入框
        setTimeout(() => {
            document.getElementById('editArea').focus();
            document.getElementById('editArea').select();
        }, 300);
    }

    closeEditPlantingAreaModal() {
        document.getElementById('editPlantingAreaModal').classList.remove('show');
        document.getElementById('editPlantingAreaForm').reset();
        this.editingPlantingAreaId = null;
    }

    async savePlantingAreaEdit() {
        if (!this.editingPlantingAreaId) return;

        const area = parseFloat(document.getElementById('editArea').value);
        const remark = document.getElementById('editRemark').value.trim();

        // 验证数据
        if (isNaN(area) || area < 0) {
            Utils.showMessage('请输入有效的种植面积', 'error');
            return;
        }

        if (area > 10000) {
            Utils.showMessage('种植面积不能超过10000亩', 'error');
            return;
        }

        // 显示保存状态
        const saveBtn = document.querySelector('#editPlantingAreaModal .btn-primary');
        const originalText = saveBtn.innerHTML;
        saveBtn.classList.add('loading');
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 保存中...';
        saveBtn.disabled = true;

        try {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 更新数据
            const itemIndex = this.plantingAreaData.findIndex(data => data.id === this.editingPlantingAreaId);
            if (itemIndex !== -1) {
                this.plantingAreaData[itemIndex].area = area;
                this.plantingAreaData[itemIndex].remark = remark;
                this.plantingAreaData[itemIndex].updateTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
            }

            // 刷新显示
            this.loadPlantingAreaData();

            // 关闭模态框
            this.closeEditPlantingAreaModal();

            Utils.showMessage('种植面积更新成功', 'success');

        } catch (error) {
            console.error('保存失败:', error);
            Utils.showMessage('保存失败，请稍后重试', 'error');
        } finally {
            // 恢复按钮状态
            saveBtn.classList.remove('loading');
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    }

    showDeviceHistory(deviceId) {
        const device = this.deviceData.find(d => d.id === deviceId);
        if (!device) {
            Utils.showMessage('未找到对应的设备', 'error');
            return;
        }

        this.currentDevice = device;
        document.getElementById('deviceHistoryTitle').textContent = `${device.name} - 历史数据`;

        // 显示模态框
        document.getElementById('deviceHistoryModal').classList.add('show');

        // 绑定事件
        this.bindHistoryModalEvents();

        // 加载默认数据
        this.loadHistoryData();
    }

    bindHistoryModalEvents() {
        // 数据类型切换
        document.querySelectorAll('.data-type-tabs .tab-item').forEach(tab => {
            tab.addEventListener('click', (e) => {
                document.querySelectorAll('.data-type-tabs .tab-item').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                this.currentDataType = e.target.dataset.type;
                this.loadHistoryData();
            });
        });

        // 时间范围切换
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentTimeRange = parseInt(e.target.dataset.range);
                this.loadHistoryData();
            });
        });

        // 模态框背景点击关闭
        const modal = document.getElementById('deviceHistoryModal');
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeDeviceHistoryModal();
            }
        });
    }

    closeDeviceHistoryModal() {
        document.getElementById('deviceHistoryModal').classList.remove('show');
        if (this.historyChart) {
            this.historyChart.dispose();
            this.historyChart = null;
        }
    }

    loadHistoryData() {
        // 生成模拟历史数据
        const data = this.generateHistoryData(this.currentDataType, this.currentTimeRange);

        // 更新统计卡片
        this.updateStatsCards(data);

        // 更新图表
        this.updateHistoryChart(data);

        // 更新数据表格
        this.updateHistoryTable(data);
    }

    generateHistoryData(dataType, timeRange) {
        const data = [];
        const now = new Date();

        for (let i = timeRange - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().slice(0, 10);
            const timeStr = date.toISOString().slice(0, 19).replace('T', ' ');

            let record = { date: dateStr, time: timeStr };

            switch (dataType) {
                case 'weather-forecast':
                    record = {
                        ...record,
                        temperature: Math.round(15 + Math.random() * 20),
                        humidity: Math.round(40 + Math.random() * 40),
                        rainfall: Math.round(Math.random() * 10 * 10) / 10,
                        windSpeed: Math.round(Math.random() * 15 * 10) / 10,
                        pressure: Math.round(1000 + Math.random() * 50),
                        weather: ['晴', '多云', '阴', '小雨', '中雨'][Math.floor(Math.random() * 5)]
                    };
                    break;
                case 'rainfall':
                    record = {
                        ...record,
                        rainfall: Math.round(Math.random() * 20 * 10) / 10,
                        intensity: ['无雨', '小雨', '中雨', '大雨'][Math.floor(Math.random() * 4)]
                    };
                    break;
                case 'ground-temp':
                    record = {
                        ...record,
                        temperature: Math.round(10 + Math.random() * 25 * 10) / 10,
                        depth5cm: Math.round(12 + Math.random() * 20 * 10) / 10,
                        depth10cm: Math.round(14 + Math.random() * 18 * 10) / 10,
                        depth20cm: Math.round(16 + Math.random() * 16 * 10) / 10
                    };
                    break;
                case 'air-temp':
                    record = {
                        ...record,
                        temperature: Math.round(10 + Math.random() * 25 * 10) / 10,
                        maxTemp: Math.round(15 + Math.random() * 20 * 10) / 10,
                        minTemp: Math.round(5 + Math.random() * 15 * 10) / 10,
                        avgTemp: Math.round(10 + Math.random() * 20 * 10) / 10
                    };
                    break;
                case 'accumulated-temp':
                    const baseTemp = i === timeRange - 1 ? 0 : data[data.length - 1]?.accumulatedTemp || 0;
                    record = {
                        ...record,
                        dailyTemp: Math.round(Math.random() * 25 * 10) / 10,
                        accumulatedTemp: Math.round((baseTemp + Math.random() * 25) * 10) / 10
                    };
                    break;
                case 'accumulated-rain':
                    const baseRain = i === timeRange - 1 ? 0 : data[data.length - 1]?.accumulatedRain || 0;
                    record = {
                        ...record,
                        dailyRain: Math.round(Math.random() * 15 * 10) / 10,
                        accumulatedRain: Math.round((baseRain + Math.random() * 15) * 10) / 10
                    };
                    break;
                case 'humidity':
                    record = {
                        ...record,
                        humidity: Math.round(30 + Math.random() * 50),
                        maxHumidity: Math.round(50 + Math.random() * 40),
                        minHumidity: Math.round(20 + Math.random() * 30),
                        avgHumidity: Math.round(40 + Math.random() * 40)
                    };
                    break;
            }

            data.push(record);
        }

        return data;
    }

    updateStatsCards(data) {
        const container = document.getElementById('dataStatsCards');
        let cards = '';

        switch (this.currentDataType) {
            case 'weather-forecast':
                const avgTemp = Math.round(data.reduce((sum, d) => sum + d.temperature, 0) / data.length);
                const avgHumidity = Math.round(data.reduce((sum, d) => sum + d.humidity, 0) / data.length);
                const totalRain = Math.round(data.reduce((sum, d) => sum + d.rainfall, 0) * 10) / 10;
                cards = `
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #ff6b6b;"><i class="fas fa-thermometer-half"></i></div>
                        <div class="stat-card-value">${avgTemp}°C</div>
                        <div class="stat-card-label">平均气温</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #4ecdc4;"><i class="fas fa-tint"></i></div>
                        <div class="stat-card-value">${avgHumidity}%</div>
                        <div class="stat-card-label">平均湿度</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #45b7d1;"><i class="fas fa-cloud-rain"></i></div>
                        <div class="stat-card-value">${totalRain}mm</div>
                        <div class="stat-card-label">累计降雨</div>
                    </div>
                `;
                break;
            case 'rainfall':
                const totalRainfall = Math.round(data.reduce((sum, d) => sum + d.rainfall, 0) * 10) / 10;
                const maxRainfall = Math.max(...data.map(d => d.rainfall));
                const rainyDays = data.filter(d => d.rainfall > 0).length;
                cards = `
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #45b7d1;"><i class="fas fa-cloud-rain"></i></div>
                        <div class="stat-card-value">${totalRainfall}mm</div>
                        <div class="stat-card-label">累计降雨量</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #96ceb4;"><i class="fas fa-tint"></i></div>
                        <div class="stat-card-value">${maxRainfall}mm</div>
                        <div class="stat-card-label">最大日降雨</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #feca57;"><i class="fas fa-calendar-day"></i></div>
                        <div class="stat-card-value">${rainyDays}天</div>
                        <div class="stat-card-label">降雨天数</div>
                    </div>
                `;
                break;
            case 'air-temp':
                const maxTemp = Math.max(...data.map(d => d.maxTemp));
                const minTemp = Math.min(...data.map(d => d.minTemp));
                const avgTempAir = Math.round(data.reduce((sum, d) => sum + d.avgTemp, 0) / data.length * 10) / 10;
                cards = `
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #ff6b6b;"><i class="fas fa-temperature-high"></i></div>
                        <div class="stat-card-value">${maxTemp}°C</div>
                        <div class="stat-card-label">最高气温</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #4ecdc4;"><i class="fas fa-temperature-low"></i></div>
                        <div class="stat-card-value">${minTemp}°C</div>
                        <div class="stat-card-label">最低气温</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #feca57;"><i class="fas fa-thermometer-half"></i></div>
                        <div class="stat-card-value">${avgTempAir}°C</div>
                        <div class="stat-card-label">平均气温</div>
                    </div>
                `;
                break;
            // 其他数据类型的统计卡片...
            default:
                cards = `
                    <div class="stat-card">
                        <div class="stat-card-icon" style="color: #95a5a6;"><i class="fas fa-chart-bar"></i></div>
                        <div class="stat-card-value">${data.length}</div>
                        <div class="stat-card-label">数据点数</div>
                    </div>
                `;
        }

        container.innerHTML = cards;
    }

    updateHistoryChart(data) {
        const chartContainer = document.getElementById('historyChart');

        if (this.historyChart) {
            this.historyChart.dispose();
        }

        this.historyChart = echarts.init(chartContainer);

        let option = {};
        const dates = data.map(d => d.date);

        switch (this.currentDataType) {
            case 'weather-forecast':
                option = {
                    title: { text: '七天气象预测', left: 'center' },
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['气温', '湿度', '降雨量'], bottom: 0 },
                    xAxis: { type: 'category', data: dates },
                    yAxis: [
                        { type: 'value', name: '气温(°C)/湿度(%)', position: 'left' },
                        { type: 'value', name: '降雨量(mm)', position: 'right' }
                    ],
                    series: [
                        {
                            name: '气温',
                            type: 'line',
                            data: data.map(d => d.temperature),
                            itemStyle: { color: '#ff6b6b' }
                        },
                        {
                            name: '湿度',
                            type: 'line',
                            data: data.map(d => d.humidity),
                            itemStyle: { color: '#4ecdc4' }
                        },
                        {
                            name: '降雨量',
                            type: 'bar',
                            yAxisIndex: 1,
                            data: data.map(d => d.rainfall),
                            itemStyle: { color: '#45b7d1' }
                        }
                    ]
                };
                break;
            case 'rainfall':
                option = {
                    title: { text: '降雨量历史数据', left: 'center' },
                    tooltip: { trigger: 'axis' },
                    xAxis: { type: 'category', data: dates },
                    yAxis: { type: 'value', name: '降雨量(mm)' },
                    series: [{
                        name: '降雨量',
                        type: 'bar',
                        data: data.map(d => d.rainfall),
                        itemStyle: { color: '#45b7d1' }
                    }]
                };
                break;
            case 'air-temp':
                option = {
                    title: { text: '气温历史数据', left: 'center' },
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['最高气温', '平均气温', '最低气温'], bottom: 0 },
                    xAxis: { type: 'category', data: dates },
                    yAxis: { type: 'value', name: '气温(°C)' },
                    series: [
                        {
                            name: '最高气温',
                            type: 'line',
                            data: data.map(d => d.maxTemp),
                            itemStyle: { color: '#ff6b6b' }
                        },
                        {
                            name: '平均气温',
                            type: 'line',
                            data: data.map(d => d.avgTemp),
                            itemStyle: { color: '#feca57' }
                        },
                        {
                            name: '最低气温',
                            type: 'line',
                            data: data.map(d => d.minTemp),
                            itemStyle: { color: '#4ecdc4' }
                        }
                    ]
                };
                break;
            case 'accumulated-temp':
                option = {
                    title: { text: '积温数据', left: 'center' },
                    tooltip: { trigger: 'axis' },
                    legend: { data: ['日积温', '累计积温'], bottom: 0 },
                    xAxis: { type: 'category', data: dates },
                    yAxis: [
                        { type: 'value', name: '日积温(°C)', position: 'left' },
                        { type: 'value', name: '累计积温(°C)', position: 'right' }
                    ],
                    series: [
                        {
                            name: '日积温',
                            type: 'bar',
                            data: data.map(d => d.dailyTemp),
                            itemStyle: { color: '#feca57' }
                        },
                        {
                            name: '累计积温',
                            type: 'line',
                            yAxisIndex: 1,
                            data: data.map(d => d.accumulatedTemp),
                            itemStyle: { color: '#ff6b6b' }
                        }
                    ]
                };
                break;
            default:
                option = {
                    title: { text: '数据图表', left: 'center' },
                    tooltip: { trigger: 'axis' },
                    xAxis: { type: 'category', data: dates },
                    yAxis: { type: 'value' },
                    series: [{
                        name: '数值',
                        type: 'line',
                        data: data.map(() => Math.random() * 100)
                    }]
                };
        }

        this.historyChart.setOption(option);
    }

    updateHistoryTable(data) {
        const thead = document.getElementById('historyTableHead');
        const tbody = document.getElementById('historyTableBody');

        let headers = ['日期', '时间'];
        let rows = '';

        switch (this.currentDataType) {
            case 'weather-forecast':
                headers = ['日期', '天气', '气温(°C)', '湿度(%)', '降雨量(mm)', '风速(m/s)', '气压(hPa)'];
                rows = data.map(d => `
                    <tr>
                        <td>${d.date}</td>
                        <td>${d.weather}</td>
                        <td>${d.temperature}</td>
                        <td>${d.humidity}</td>
                        <td>${d.rainfall}</td>
                        <td>${d.windSpeed}</td>
                        <td>${d.pressure}</td>
                    </tr>
                `).join('');
                break;
            case 'rainfall':
                headers = ['日期', '降雨量(mm)', '降雨强度'];
                rows = data.map(d => `
                    <tr>
                        <td>${d.date}</td>
                        <td>${d.rainfall}</td>
                        <td>${d.intensity}</td>
                    </tr>
                `).join('');
                break;
            case 'air-temp':
                headers = ['日期', '最高气温(°C)', '平均气温(°C)', '最低气温(°C)'];
                rows = data.map(d => `
                    <tr>
                        <td>${d.date}</td>
                        <td>${d.maxTemp}</td>
                        <td>${d.avgTemp}</td>
                        <td>${d.minTemp}</td>
                    </tr>
                `).join('');
                break;
            default:
                headers = ['日期', '数值'];
                rows = data.map(d => `
                    <tr>
                        <td>${d.date}</td>
                        <td>--</td>
                    </tr>
                `).join('');
        }

        thead.innerHTML = `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`;
        tbody.innerHTML = rows;
    }


    
    getFilteredPlantingAreaData() {
        let data = [...this.plantingAreaData];

        // 权限过滤：乡镇管理员只能看到自己乡镇的数据
        if (this.currentUser.role === 'township') {
            data = data.filter(item => item.township === this.currentUser.township);
        }

        // 搜索过滤
        const searchTerm = document.getElementById('plantingSearchInput')?.value.toLowerCase();
        if (searchTerm) {
            data = data.filter(item =>
                item.township.toLowerCase().includes(searchTerm) ||
                item.crop.toLowerCase().includes(searchTerm) ||
                this.formatMonthTitle(item.month).toLowerCase().includes(searchTerm)
            );
        }

        return data;
    }
    
    loadCropInfoData() {
        const tbody = document.getElementById('cropInfoTableBody');
        if (!tbody) return;
        
        const filteredData = this.getFilteredCropData();
        
        tbody.innerHTML = filteredData.map(item => `
            <tr>
                <td>
                    <div class="crop-name-cell">
                        <strong>${item.name}</strong>
                        ${item.description ? `<div class="crop-description">${item.description}</div>` : ''}
                    </div>
                </td>
                <td>
                    <span class="category-tag ${this.getCategoryClass(item.category)}">
                        ${item.category}
                    </span>
                </td>
                <td>${item.growthPeriod} 天</td>
                <td>
                    <span class="season-tag ${this.getSeasonClass(item.season)}">
                        ${item.season}
                    </span>
                </td>
                <td>
                    <div class="time-info">
                        <div>创建: ${item.createTime}</div>
                        ${item.updateTime !== item.createTime ? `<div>更新: ${item.updateTime}</div>` : ''}
                    </div>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-info" onclick="viewCropDetail(${item.id})" title="查看详情">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="editCrop(${item.id})" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCrop(${item.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    getFilteredCropData() {
        let data = [...this.cropInfoData];
        
        // 搜索过滤
        const searchTerm = document.getElementById('cropSearchInput')?.value.toLowerCase();
        if (searchTerm) {
            data = data.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm) ||
                item.description?.toLowerCase().includes(searchTerm) ||
                item.techPoints?.toLowerCase().includes(searchTerm)
            );
        }
        
        return data;
    }

    getCategoryClass(category) {
        const categoryClasses = {
            '粮食作物': 'category-grain',
            '经济作物': 'category-economic',
            '薯类作物': 'category-tuber',
            '蔬菜作物': 'category-vegetable',
            '果树作物': 'category-fruit',
            '饲料作物': 'category-feed',
            '其他作物': 'category-other'
        };
        return categoryClasses[category] || 'category-default';
    }

    getSeasonClass(season) {
        const seasonClasses = {
            '春季': 'season-spring',
            '夏季': 'season-summer',
            '秋季': 'season-autumn',
            '冬季': 'season-winter',
            '春夏': 'season-spring-summer',
            '秋冬': 'season-autumn-winter',
            '全年': 'season-all'
        };
        return seasonClasses[season] || 'season-default';
    }
    
    loadImageData() {
        const tbody = document.getElementById('imageDataTableBody');
        if (!tbody) return;

        tbody.innerHTML = this.imageData.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.captureTime}</td>
                <td>${item.uploadTime}</td>
                <td>${item.size}</td>
            </tr>
        `).join('');
    }
    
    loadDeviceData() {
        // 更新设备统计信息
        this.updateDeviceStats();
        
        // 更新设备列表
        this.updateDeviceTable();
        
        // 初始化或更新地图
        this.initDeviceMap();
    }

    updateDeviceStats() {
        const statsContainer = document.getElementById('deviceStats');
        if (!statsContainer) return;

        const data = this.getFilteredDeviceData();
        const onlineCount = data.filter(d => d.status === 'online').length;
        const offlineCount = data.filter(d => d.status === 'offline').length;
        const totalCount = data.length;

        const typeStats = {};
        data.forEach(device => {
            typeStats[device.type] = (typeStats[device.type] || 0) + 1;
        });

        statsContainer.innerHTML = `
            <div class="device-stat-item">
                <span class="stat-label">总计:</span>
                <span class="stat-value">${totalCount}</span>
            </div>
            <div class="device-stat-item">
                <span class="stat-label">在线:</span>
                <span class="stat-value" style="color: #52c41a;">${onlineCount}</span>
            </div>
            <div class="device-stat-item">
                <span class="stat-label">离线:</span>
                <span class="stat-value" style="color: #8c8c8c;">${offlineCount}</span>
            </div>
        `;
    }

    updateDeviceTable() {
        const tbody = document.getElementById('deviceDataTableBody');
        if (!tbody) return;

        const filteredData = this.getFilteredDeviceData();

        tbody.innerHTML = filteredData.map(item => `
            <tr onclick="window.dataManager.selectDevice(${item.id})" class="device-row" data-device-id="${item.id}">
                <td>${item.name}</td>
                <td>${item.type}</td>
                <td>${item.location}</td>
                <td>
                    <span class="device-status ${item.status}">
                        <span class="device-status-dot"></span>
                        ${item.status === 'online' ? '在线' : '离线'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="event.stopPropagation(); viewDeviceHistory(${item.id})" title="查看历史数据">
                        <i class="fas fa-chart-line"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // 初始化设备地图（多地图服务提供商备用方案）
    async initDeviceMap() {
        const mapContainer = document.getElementById('deviceMap');
        if (!mapContainer) return;

        // 如果地图已经初始化，只更新标记
        if (this.mapInitialized && this.deviceMap) {
            this.updateDeviceMarkers();
            return;
        }

        // 显示加载提示
        this.showMapLoading('正在初始化地图...');

        // 按优先级尝试不同的地图服务
        const mapProviders = [
            { name: 'leaflet', init: () => this.initLeafletMap() },
            { name: 'baidu', init: () => this.initBaiduMap() },
            { name: 'amap', init: () => this.initAmapMap() }
        ];

        for (const provider of mapProviders) {
            try {
                console.log(`🗺️ 尝试初始化${provider.name}地图...`);
                await provider.init();
                this.mapProvider = provider.name;
                this.mapInitialized = true;
                this.hideMapLoading();
                console.log(`✅ ${provider.name}地图初始化成功`);
                
                // 更新地图服务提供商显示
                this.updateMapProviderDisplay();
                
                // 添加设备标记
                this.updateDeviceMarkers();
                return;
            } catch (error) {
                console.warn(`❌ ${provider.name}地图初始化失败:`, error);
                continue;
            }
        }

        // 所有地图服务都失败
        this.showMapError('地图服务暂时不可用，请稍后重试');
    }

    // Leaflet开源地图初始化（优先选择，免费无限制）
    async initLeafletMap() {
        if (typeof L === 'undefined') {
            throw new Error('Leaflet库未加载');
        }

        // 临夏镇中心坐标
        const center = [35.6, 103.2];
        
        this.deviceMap = L.map('deviceMap').setView(center, 10);

        // 添加地图图层
        const tileLayer = this.currentMapType === 'satellite' 
            ? L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP'
            })
            : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            });

        tileLayer.addTo(this.deviceMap);

        this.deviceMarkers = [];
    }

    // 百度地图初始化
    async initBaiduMap() {
        if (typeof BMap === 'undefined') {
            throw new Error('百度地图API未加载');
        }

        this.deviceMap = new BMap.Map('deviceMap');
        const point = new BMap.Point(103.2, 35.6);
        this.deviceMap.centerAndZoom(point, 10);

        // 添加地图控件
        this.deviceMap.addControl(new BMap.NavigationControl());
        this.deviceMap.addControl(new BMap.ScaleControl());

        // 设置地图类型
        if (this.currentMapType === 'satellite') {
            this.deviceMap.setMapType(BMAP_SATELLITE_MAP);
        }

        this.deviceMarkers = [];
    }

    // 高德地图初始化（保留作为备用）
    async initAmapMap() {
        if (typeof AMap === 'undefined') {
            throw new Error('高德地图API未加载');
        }

        this.deviceMap = new AMap.Map('deviceMap', {
            center: [103.2, 35.6],
            zoom: 10,
            mapStyle: this.currentMapType === 'satellite' ? 'amap://styles/satellite' : 'amap://styles/normal'
        });

        // 添加地图控件
        this.deviceMap.addControl(new AMap.ToolBar({
            position: { top: '10px', right: '10px' }
        }));

        this.deviceMap.addControl(new AMap.Scale({
            position: { bottom: '10px', right: '10px' }
        }));

        this.deviceMarkers = [];
    }

    // 显示地图加载状态
    showMapLoading(message = '地图加载中...') {
        const loadingElement = document.getElementById('mapLoading');
        if (loadingElement) {
            loadingElement.style.display = 'flex';
            loadingElement.querySelector('span').textContent = message;
        }
    }

    // 隐藏地图加载状态
    hideMapLoading() {
        const loadingElement = document.getElementById('mapLoading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }

    // 显示地图错误信息
    showMapError(message) {
        const mapContainer = document.getElementById('deviceMap');
        if (mapContainer) {
            mapContainer.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    color: #666;
                    font-size: 14px;
                    text-align: center;
                    padding: 40px;
                ">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #faad14; margin-bottom: 16px;"></i>
                    <div style="margin-bottom: 16px;">${message}</div>
                    <button class="btn btn-primary" onclick="window.dataManager.retryMapInit()">
                        <i class="fas fa-redo"></i> 重试
                    </button>
                </div>
            `;
        }
    }

    // 重试地图初始化
    retryMapInit() {
        this.mapInitialized = false;
        this.deviceMap = null;
        this.mapProvider = null;
        this.initDeviceMap();
    }

    // 更新地图服务提供商显示
    updateMapProviderDisplay() {
        const providerElement = document.getElementById('currentMapProvider');
        if (!providerElement) return;

        const providerNames = {
            'leaflet': 'OpenStreetMap',
            'baidu': '百度地图',
            'amap': '高德地图'
        };

        const displayName = providerNames[this.mapProvider] || '未知';
        providerElement.textContent = displayName;

        // 如果是Leaflet，显示额外提示
        if (this.mapProvider === 'leaflet') {
            providerElement.title = '开源免费地图服务，无使用限制';
        } else {
            providerElement.title = '';
        }
    }

    // 更新设备标记（支持多种地图服务）
    updateDeviceMarkers() {
        if (!this.deviceMap || !this.mapProvider) return;

        // 清除现有标记
        this.clearDeviceMarkers();

        const filteredData = this.getFilteredDeviceData();

        // 根据地图服务提供商选择相应的标记实现
        switch (this.mapProvider) {
            case 'leaflet':
                this.updateLeafletMarkers(filteredData);
                break;
            case 'baidu':
                this.updateBaiduMarkers(filteredData);
                break;
            case 'amap':
                this.updateAmapMarkers(filteredData);
                break;
        }

        // 调整地图视野
        this.fitMapView();
    }

    // 清除设备标记
    clearDeviceMarkers() {
        if (!this.deviceMarkers.length) return;

        switch (this.mapProvider) {
            case 'leaflet':
                this.deviceMarkers.forEach(marker => {
                    this.deviceMap.removeLayer(marker);
                });
                break;
            case 'baidu':
                this.deviceMarkers.forEach(marker => {
                    this.deviceMap.removeOverlay(marker);
                });
                break;
            case 'amap':
                this.deviceMarkers.forEach(marker => {
                    this.deviceMap.remove(marker);
                });
                break;
        }
        this.deviceMarkers = [];
    }

    // Leaflet标记更新
    updateLeafletMarkers(filteredData) {
        filteredData.forEach(device => {
            const statusColor = device.status === 'online' ? '#52c41a' : '#8c8c8c';
            const isSelected = device.id === this.selectedDeviceId;
            
            const marker = L.marker([device.latitude, device.longitude], {
                icon: L.divIcon({
                    html: `
                        <div style="
                            width: 30px; 
                            height: 30px; 
                            background-color: ${statusColor}; 
                            border: ${isSelected ? '3px solid #1890ff' : '2px solid white'};
                            border-radius: 50%; 
                            display: flex; 
                            align-items: center; 
                            justify-content: center; 
                            color: white; 
                            font-size: 12px; 
                            font-weight: bold;
                            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                            cursor: pointer;
                        ">
                            ${this.getDeviceIcon(device.type)}
                        </div>
                    `,
                    className: 'device-marker',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            });

            marker.bindPopup(`
                <div style="text-align: center;">
                    <strong>${device.name}</strong><br>
                    ${device.type}<br>
                    <small>${device.location}</small>
                </div>
            `);

            marker.on('click', () => {
                this.selectDevice(device.id);
            });

            marker.addTo(this.deviceMap);
            this.deviceMarkers.push(marker);
        });
    }

    // 百度地图标记更新
    updateBaiduMarkers(filteredData) {
        filteredData.forEach(device => {
            const point = new BMap.Point(device.longitude, device.latitude);
            const statusColor = device.status === 'online' ? '#52c41a' : '#8c8c8c';
            const isSelected = device.id === this.selectedDeviceId;

            const marker = new BMap.Marker(point, {
                icon: new BMap.Icon(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
                    <svg width="30" height="30" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="15" cy="15" r="13" fill="${statusColor}" stroke="${isSelected ? '#1890ff' : 'white'}" stroke-width="${isSelected ? '3' : '2'}"/>
                        <text x="15" y="20" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${this.getDeviceIcon(device.type)}</text>
                    </svg>
                `)}`, new BMap.Size(30, 30))
            });

            const infoWindow = new BMap.InfoWindow(`
                <div style="text-align: center;">
                    <strong>${device.name}</strong><br>
                    ${device.type}<br>
                    <small>${device.location}</small>
                </div>
            `);

            marker.addEventListener('click', () => {
                this.selectDevice(device.id);
                this.deviceMap.openInfoWindow(infoWindow, point);
            });

            this.deviceMap.addOverlay(marker);
            this.deviceMarkers.push(marker);
        });
    }

    // 高德地图标记更新
    updateAmapMarkers(filteredData) {
        filteredData.forEach(device => {
            const marker = new AMap.Marker({
                position: [device.longitude, device.latitude],
                title: device.name,
                content: this.createMarkerContent(device),
                offset: new AMap.Pixel(-15, -30)
            });

            marker.on('click', () => {
                this.selectDevice(device.id);
            });

            this.deviceMap.add(marker);
            this.deviceMarkers.push(marker);
        });
    }

    // 调整地图视野
    fitMapView() {
        if (!this.deviceMarkers.length) return;

        switch (this.mapProvider) {
            case 'leaflet':
                if (this.deviceMarkers.length > 0) {
                    const group = new L.featureGroup(this.deviceMarkers);
                    this.deviceMap.fitBounds(group.getBounds().pad(0.1));
                }
                break;
            case 'baidu':
                if (this.deviceMarkers.length > 0) {
                    this.deviceMap.setViewport(this.deviceMarkers.map(marker => marker.getPosition()));
                }
                break;
            case 'amap':
                this.deviceMap.setFitView(this.deviceMarkers);
                break;
        }
    }

    // 选择设备（支持多种地图服务）
    selectDevice(deviceId) {
        this.selectedDeviceId = deviceId;
        const device = this.deviceData.find(d => d.id === deviceId);
        
        // 更新表格选择状态
        document.querySelectorAll('.device-row').forEach(row => {
            row.classList.toggle('selected', parseInt(row.dataset.deviceId) === deviceId);
        });

        // 更新地图标记
        this.updateDeviceMarkers();

        // 更新设备信息显示
        this.updateSelectedDeviceInfo(device);

        // 地图中心移动到选中设备
        if (device && this.deviceMap) {
            this.centerMapToDevice(device);
        }
    }

    // 地图中心移动到设备
    centerMapToDevice(device) {
        switch (this.mapProvider) {
            case 'leaflet':
                this.deviceMap.setView([device.latitude, device.longitude], this.deviceMap.getZoom());
                break;
            case 'baidu':
                const point = new BMap.Point(device.longitude, device.latitude);
                this.deviceMap.panTo(point);
                break;
            case 'amap':
                this.deviceMap.setCenter([device.longitude, device.latitude]);
                break;
        }
    }

    // 创建标记内容
    createMarkerContent(device) {
        const statusColor = device.status === 'online' ? '#52c41a' : '#8c8c8c';
        const isSelected = device.id === this.selectedDeviceId;
        
        return `
            <div style="
                width: 30px; 
                height: 30px; 
                background-color: ${statusColor}; 
                border: ${isSelected ? '3px solid #1890ff' : '2px solid white'};
                border-radius: 50%; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                color: white; 
                font-size: 12px; 
                font-weight: bold;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                cursor: pointer;
            ">
                ${this.getDeviceIcon(device.type)}
            </div>
        `;
    }

    // 获取设备图标
    getDeviceIcon(type) {
        const icons = {
            '气象监测': '🌡️',
            '土壤监测': '🌱',
            '视频监控': '📹'
        };
        return icons[type] || '📍';
    }

    // 选择设备
    selectDevice(deviceId) {
        this.selectedDeviceId = deviceId;
        const device = this.deviceData.find(d => d.id === deviceId);
        
        // 更新表格选择状态
        document.querySelectorAll('.device-row').forEach(row => {
            row.classList.toggle('selected', parseInt(row.dataset.deviceId) === deviceId);
        });

        // 更新地图标记
        this.updateDeviceMarkers();

        // 更新设备信息显示
        this.updateSelectedDeviceInfo(device);

        // 地图中心移动到选中设备
        if (device && this.deviceMap) {
            this.deviceMap.setCenter([device.longitude, device.latitude]);
        }
    }

    // 更新选中设备信息
    updateSelectedDeviceInfo(device) {
        const infoContainer = document.getElementById('selectedDeviceInfo');
        if (!infoContainer) return;

        if (!device) {
            infoContainer.innerHTML = `
                <div class="no-selection">
                    <i class="fas fa-info-circle"></i>
                    点击设备列表或地图标记查看详细信息
                </div>
            `;
            return;
        }

        infoContainer.innerHTML = `
            <div class="device-info-card">
                <div class="device-info-icon ${device.status}">
                    ${this.getDeviceIcon(device.type)}
                </div>
                <div class="device-info-details">
                    <h5>${device.name}</h5>
                    <p>${device.type} · ${device.location}</p>
                </div>
                <div class="device-info-meta">
                    <div class="coordinates">${device.longitude.toFixed(4)}, ${device.latitude.toFixed(4)}</div>
                    <div class="last-report">最后上报: ${device.lastReport}</div>
                </div>
            </div>
        `;
    }

    getFilteredDeviceData() {
        let data = [...this.deviceData];

        // 搜索过滤
        const searchTerm = document.getElementById('deviceSearchInput')?.value.toLowerCase();
        if (searchTerm) {
            data = data.filter(item =>
                item.name.toLowerCase().includes(searchTerm) ||
                item.type.toLowerCase().includes(searchTerm) ||
                item.location.toLowerCase().includes(searchTerm)
            );
        }

        // 状态过滤
        const statusFilter = document.getElementById('deviceStatusFilter')?.value;
        if (statusFilter) {
            data = data.filter(item => item.status === statusFilter);
        }

        return data;
    }
    
    getDeviceStatusClass(status) {
        switch (status) {
            case 'online': return 'status-online';
            case 'offline': return 'status-offline';
            default: return 'status-offline';
        }
    }

    getDeviceStatusText(status) {
        switch (status) {
            case 'online': return '在线';
            case 'offline': return '离线';
            default: return '离线';
        }
    }
}

// 全局函数

function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        Auth.logout();
    }
}

function toggleUserMenu() {
    // 用户菜单功能（可扩展）
    console.log('用户菜单');
}

// 种植面积管理相关函数
function editPlantingArea(id) {
    const dataManager = window.dataManager;
    if (dataManager) {
        dataManager.showEditPlantingAreaModal(id);
    }
}

function closeEditPlantingAreaModal() {
    const dataManager = window.dataManager;
    if (dataManager) {
        dataManager.closeEditPlantingAreaModal();
    }
}

function savePlantingAreaEdit() {
    const dataManager = window.dataManager;
    if (dataManager) {
        dataManager.savePlantingAreaEdit();
    }
}

// 作物信息管理相关函数
function showAddCropModal() {
    const dataManager = window.dataManager;
    if (!dataManager) return;
    
    dataManager.editingCropId = null;
    document.getElementById('cropModalTitle').textContent = '新增作物信息';
    
    // 重置表单
    document.getElementById('cropForm').reset();
    
    // 显示模态框
    document.getElementById('cropModal').classList.add('show');
}

function editCrop(id) {
    const dataManager = window.dataManager;
    if (!dataManager) return;
    
    const crop = dataManager.cropInfoData.find(c => c.id === id);
    if (!crop) {
        Utils.showMessage('未找到对应的作物信息', 'error');
        return;
    }
    
    dataManager.editingCropId = id;
    document.getElementById('cropModalTitle').textContent = '编辑作物信息';
    
    // 填充表单数据
    document.getElementById('cropName').value = crop.name;
    document.getElementById('cropCategory').value = crop.category;
    document.getElementById('cropGrowthPeriod').value = crop.growthPeriod;
    document.getElementById('cropSeason').value = crop.season;
    document.getElementById('cropDescription').value = crop.description || '';
    document.getElementById('cropTechPoints').value = crop.techPoints || '';
    document.getElementById('cropExpectedYield').value = crop.expectedYield || '';
    
    // 显示模态框
    document.getElementById('cropModal').classList.add('show');
}

function viewCropDetail(id) {
    const dataManager = window.dataManager;
    if (!dataManager) return;
    
    const crop = dataManager.cropInfoData.find(c => c.id === id);
    if (!crop) {
        Utils.showMessage('未找到对应的作物信息', 'error');
        return;
    }
    
    dataManager.currentViewingCrop = crop;
    
    // 生成详情内容
    const detailContainer = document.getElementById('cropDetailContainer');
    detailContainer.innerHTML = `
        <div class="crop-detail-grid">
            <div class="detail-section">
                <h4 class="detail-section-title">基本信息</h4>
                <div class="detail-items">
                    <div class="detail-item">
                        <label>作物名称:</label>
                        <span class="detail-value">${crop.name}</span>
                    </div>
                    <div class="detail-item">
                        <label>作物类别:</label>
                        <span class="detail-value category-tag ${dataManager.getCategoryClass(crop.category)}">${crop.category}</span>
                    </div>
                    <div class="detail-item">
                        <label>生长周期:</label>
                        <span class="detail-value">${crop.growthPeriod} 天</span>
                    </div>
                    <div class="detail-item">
                        <label>种植季节:</label>
                        <span class="detail-value season-tag ${dataManager.getSeasonClass(crop.season)}">${crop.season}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="detail-section-title">种植信息</h4>
                <div class="detail-items">
                    <div class="detail-item">
                        <label>预期产量:</label>
                        <span class="detail-value">${crop.expectedYield ? crop.expectedYield + ' kg/亩' : '未设置'}</span>
                    </div>
                    <div class="detail-item">
                        <label>技术要点:</label>
                        <span class="detail-value">${crop.techPoints || '无'}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section full-width">
                <h4 class="detail-section-title">作物描述</h4>
                <div class="detail-description">
                    ${crop.description || '暂无描述'}
                </div>
            </div>
            
            <div class="detail-section full-width">
                <h4 class="detail-section-title">时间信息</h4>
                <div class="detail-items">
                    <div class="detail-item">
                        <label>创建时间:</label>
                        <span class="detail-value">${crop.createTime}</span>
                    </div>
                    <div class="detail-item">
                        <label>更新时间:</label>
                        <span class="detail-value">${crop.updateTime}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 显示模态框
    document.getElementById('cropDetailModal').classList.add('show');
}

function editCurrentCrop() {
    const dataManager = window.dataManager;
    if (!dataManager || !dataManager.currentViewingCrop) return;
    
    // 关闭详情模态框
    closeCropDetailModal();
    
    // 打开编辑模态框
    editCrop(dataManager.currentViewingCrop.id);
}

function deleteCrop(id) {
    const dataManager = window.dataManager;
    if (!dataManager) return;
    
    const crop = dataManager.cropInfoData.find(c => c.id === id);
    if (!crop) {
        Utils.showMessage('未找到对应的作物信息', 'error');
        return;
    }
    
    if (confirm(`确定要删除作物 "${crop.name}" 吗？\n删除后无法恢复！`)) {
        // 删除作物
        dataManager.cropInfoData = dataManager.cropInfoData.filter(c => c.id !== id);
        
        // 刷新表格
        dataManager.loadCropInfoData();
        
        Utils.showMessage('作物信息删除成功', 'success');
    }
}

function saveCrop() {
    const dataManager = window.dataManager;
    if (!dataManager) return;
    
    // 获取表单数据
    const formData = {
        name: document.getElementById('cropName').value.trim(),
        category: document.getElementById('cropCategory').value,
        growthPeriod: parseInt(document.getElementById('cropGrowthPeriod').value),
        season: document.getElementById('cropSeason').value,
        description: document.getElementById('cropDescription').value.trim(),
        techPoints: document.getElementById('cropTechPoints').value.trim(),
        expectedYield: parseFloat(document.getElementById('cropExpectedYield').value) || null
    };
    
    // 表单验证
    if (!formData.name) {
        Utils.showMessage('请输入作物名称', 'error');
        return;
    }
    
    if (!formData.category) {
        Utils.showMessage('请选择作物类别', 'error');
        return;
    }
    
    if (!formData.growthPeriod || formData.growthPeriod < 1) {
        Utils.showMessage('请输入有效的生长周期', 'error');
        return;
    }
    
    if (!formData.season) {
        Utils.showMessage('请选择适宜种植季节', 'error');
        return;
    }
    
    // 检查名称重复
    const existingCrop = dataManager.cropInfoData.find(c => 
        c.name.toLowerCase() === formData.name.toLowerCase() && 
        c.id !== dataManager.editingCropId
    );
    
    if (existingCrop) {
        Utils.showMessage('作物名称已存在，请选择其他名称', 'error');
        return;
    }
    
    const currentTime = new Date().toLocaleString('zh-CN');
    
    if (dataManager.editingCropId) {
        // 编辑模式
        const cropIndex = dataManager.cropInfoData.findIndex(c => c.id === dataManager.editingCropId);
        if (cropIndex !== -1) {
            dataManager.cropInfoData[cropIndex] = {
                ...dataManager.cropInfoData[cropIndex],
                ...formData,
                updateTime: currentTime
            };
            Utils.showMessage('作物信息更新成功', 'success');
        }
    } else {
        // 新增模式
        const newId = Math.max(...dataManager.cropInfoData.map(c => c.id)) + 1;
        const newCrop = {
            id: newId,
            ...formData,
            createTime: currentTime,
            updateTime: currentTime
        };
        dataManager.cropInfoData.push(newCrop);
        Utils.showMessage('作物信息添加成功', 'success');
    }
    
    // 刷新表格
    dataManager.loadCropInfoData();
    
    // 关闭模态框
    closeCropModal();
}

function closeCropModal() {
    document.getElementById('cropModal').classList.remove('show');
}

function closeCropDetailModal() {
    document.getElementById('cropDetailModal').classList.remove('show');
}

// 影像数据相关函数 - 纯展示，无操作功能

// 设备数据相关函数
function viewDeviceHistory(id) {
    const dataManager = window.dataManager;
    if (dataManager) {
        dataManager.showDeviceHistory(id);
    }
}



function closeDeviceHistoryModal() {
    const dataManager = window.dataManager;
    if (dataManager) {
        dataManager.closeDeviceHistoryModal();
    }
}

function refreshHistoryData() {
    const dataManager = window.dataManager;
    if (dataManager) {
        dataManager.loadHistoryData();
        Utils.showMessage('数据已刷新', 'success');
    }
}

function loadCustomRangeData() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!startDate || !endDate) {
        Utils.showMessage('请选择开始和结束日期', 'warning');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        Utils.showMessage('开始日期不能晚于结束日期', 'error');
        return;
    }

    Utils.showMessage('自定义时间范围查询功能开发中...', 'info');
}

function exportHistoryData() {
    Utils.showMessage('数据导出功能开发中...', 'info');
}

// 树节点操作函数
function toggleTreeNode(nodeId) {
    const node = document.querySelector(`[data-id="${nodeId}"]`);
    if (node && !node.classList.contains('leaf')) {
        node.classList.toggle('expanded');
    }
}

function expandAllNodes() {
    document.querySelectorAll('.tree-node:not(.leaf)').forEach(node => {
        node.classList.add('expanded');
    });
}

function collapseAllNodes() {
    document.querySelectorAll('.tree-node:not(.leaf)').forEach(node => {
        node.classList.remove('expanded');
    });
}

function exportPlantingData() {
    const dataManager = window.dataManager;
    if (!dataManager) return;

    try {
        // 获取当前选中月份的数据
        const currentMonth = dataManager.currentSelectedMonth;
        const exportData = [];
        
        // 从plantingAreaData中获取数据（扁平化结构）
        if (dataManager.plantingAreaData && dataManager.plantingAreaData.length > 0) {
            dataManager.plantingAreaData.forEach(item => {
                // 如果指定了月份，只导出该月份的数据
                if (!currentMonth || item.month === currentMonth) {
                    exportData.push({
                        '统计月份': dataManager.formatMonthTitle(item.month),
                        '乡镇名称': item.township,
                        '作物类型': item.crop,
                        '种植面积(亩)': item.area,
                        '更新时间': item.updateTime,
                        '备注': item.remark || '-'
                    });
                }
            });
        }

        if (exportData.length === 0) {
            Utils.showMessage('没有可导出的种植面积数据', 'warning');
            return;
        }

        // 创建CSV内容
        const headers = Object.keys(exportData[0]);
        const csvContent = [
            headers.join(','),
            ...exportData.map(row => 
                headers.map(header => `"${row[header]}"`).join(',')
            )
        ].join('\n');

        // 创建Blob并下载
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        const monthText = currentMonth ? dataManager.formatMonthTitle(currentMonth) : '全部月份';
        const fileName = `种植面积数据_${monthText}_${new Date().toLocaleDateString('zh-CN')}.csv`;
        
        link.setAttribute('href', url);
        link.setAttribute('download', fileName);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        const monthDisplayText = currentMonth ? `(${monthText})` : '(全部月份)';
        Utils.showMessage(`成功导出 ${exportData.length} 条种植面积数据${monthDisplayText}`, 'success');
        
    } catch (error) {
        console.error('导出种植面积数据失败:', error);
        Utils.showMessage('导出失败，请稍后重试', 'error');
    }
}

// 地图相关全局函数
function toggleMapType() {
    const dataManager = window.dataManager;
    if (!dataManager || !dataManager.deviceMap) return;

    // 切换地图类型
    dataManager.currentMapType = dataManager.currentMapType === 'standard' ? 'satellite' : 'standard';
    
    // 根据地图服务提供商更新地图样式
    switch (dataManager.mapProvider) {
        case 'leaflet':
            // 移除当前图层
            dataManager.deviceMap.eachLayer(layer => {
                if (layer instanceof L.TileLayer) {
                    dataManager.deviceMap.removeLayer(layer);
                }
            });
            
            // 添加新图层
            const tileLayer = dataManager.currentMapType === 'satellite' 
                ? L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP'
                })
                : L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                });
            tileLayer.addTo(dataManager.deviceMap);
            break;
            
        case 'baidu':
            if (dataManager.currentMapType === 'satellite') {
                dataManager.deviceMap.setMapType(BMAP_SATELLITE_MAP);
            } else {
                dataManager.deviceMap.setMapType(BMAP_NORMAL_MAP);
            }
            break;
            
        case 'amap':
            const mapStyle = dataManager.currentMapType === 'satellite' ? 'amap://styles/satellite' : 'amap://styles/normal';
            dataManager.deviceMap.setMapStyle(mapStyle);
            break;
    }
    
    // 更新按钮显示
    const mapTypeBtn = document.getElementById('mapTypeBtn');
    if (mapTypeBtn) {
        if (dataManager.currentMapType === 'satellite') {
            mapTypeBtn.innerHTML = '<i class="fas fa-satellite"></i> 卫星';
        } else {
            mapTypeBtn.innerHTML = '<i class="fas fa-map"></i> 标准';
        }
    }
}

function refreshDeviceMap() {
    const dataManager = window.dataManager;
    if (!dataManager) return;

    // 重新加载设备数据和地图
    dataManager.loadDeviceData();
    Utils.showMessage('地图已刷新', 'success');
}

function exportDeviceData() {
    const dataManager = window.dataManager;
    if (!dataManager) return;

    // 获取当前过滤的设备数据
    const deviceData = dataManager.getFilteredDeviceData();
    
    if (deviceData.length === 0) {
        Utils.showMessage('没有可导出的设备数据', 'warning');
        return;
    }

    try {
        // 准备导出数据
        const exportData = deviceData.map(device => ({
            '设备名称': device.name,
            '设备类型': device.type,
            '安装位置': device.location,
            '设备状态': device.status === 'online' ? '在线' : '离线',
            '最后上报时间': device.lastReport,
            '经度': device.longitude,
            '纬度': device.latitude
        }));

        // 创建CSV内容
        const headers = Object.keys(exportData[0]);
        const csvContent = [
            headers.join(','),
            ...exportData.map(row => 
                headers.map(header => `"${row[header]}"`).join(',')
            )
        ].join('\n');

        // 创建Blob并下载
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `设备数据_${new Date().toLocaleDateString('zh-CN')}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        Utils.showMessage(`成功导出 ${deviceData.length} 条设备数据`, 'success');
        
    } catch (error) {
        console.error('导出设备数据失败:', error);
        Utils.showMessage('导出失败，请稍后重试', 'error');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.dataManager = new DataManagement();
});
