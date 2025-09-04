/**
 * 设备数据管理页面功能模块
 */

class DeviceDataManager {
    constructor() {
        this.currentUser = Auth.getCurrentUser();
        this.currentDevice = null;
        this.currentDataType = 'weather-forecast';
        this.currentTimeRange = 7;
        this.historyChart = null;
        
        // 设备相关状态
        this.editingDeviceId = null;
        this.deletingDeviceId = null;
        
        // 地图相关属性
        this.deviceMap = null;
        this.deviceMarkers = [];
        this.selectedDeviceId = null;
        this.currentMapType = 'standard'; // 'standard' 或 'satellite'
        this.mapProvider = null; // 'leaflet', 'baidu', 'amap'
        this.mapInitialized = false;
        
        // 设备数据
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
        this.loadDeviceData();
        this.initDeviceMap();
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
        // 搜索和筛选事件
        const deviceSearchInput = document.getElementById('deviceSearchInput');
        if (deviceSearchInput) {
            deviceSearchInput.addEventListener('input', Utils.debounce(() => {
                this.loadDeviceData();
            }, 300));
        }

        const deviceStatusFilter = document.getElementById('deviceStatusFilter');
        if (deviceStatusFilter) {
            deviceStatusFilter.addEventListener('change', () => {
                this.loadDeviceData();
            });
        }

        // 模态框事件
        this.bindModalEvents();
        
        // 设备历史数据模态框事件
        this.bindDeviceHistoryEvents();
        
        // 表单事件
        const deviceForm = document.getElementById('deviceForm');
        if (deviceForm) {
            deviceForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveDevice();
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

    bindDeviceHistoryEvents() {
        // 数据类型切换
        document.querySelectorAll('.data-type-tabs .tab-item').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.data-type-tabs .tab-item').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentDataType = tab.dataset.type;
                this.loadHistoryData();
            });
        });

        // 时间范围切换
        document.querySelectorAll('.time-range-buttons .time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.time-range-buttons .time-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentTimeRange = parseInt(btn.dataset.range);
                this.loadHistoryData();
            });
        });
    }

    // 加载设备数据
    loadDeviceData() {
        const tableBody = document.getElementById('deviceDataTableBody');
        if (!tableBody) return;

        let filteredData = [...this.deviceData];

        // 搜索过滤
        const searchInput = document.getElementById('deviceSearchInput');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filteredData = filteredData.filter(device => 
                device.name.toLowerCase().includes(searchTerm) ||
                device.type.toLowerCase().includes(searchTerm) ||
                device.location.toLowerCase().includes(searchTerm)
            );
        }

        // 状态筛选
        const statusFilter = document.getElementById('deviceStatusFilter');
        if (statusFilter && statusFilter.value) {
            filteredData = filteredData.filter(device => device.status === statusFilter.value);
        }

        // 更新设备统计
        this.updateDeviceStats(filteredData);

        if (filteredData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" class="text-center">暂无数据</td></tr>';
            return;
        }

        const html = filteredData.map(device => `
            <tr class="device-row ${device.id === this.selectedDeviceId ? 'selected' : ''}" 
                data-device-id="${device.id}" 
                onclick="window.deviceManager.selectDevice(${device.id})">
                <td>
                    <div class="device-name-cell">
                        <i class="fas fa-${this.getDeviceIcon(device.type)} device-icon"></i>
                        <span class="device-name">${device.name}</span>
                    </div>
                </td>
                <td>
                    <span class="type-badge type-${device.type.replace(/监测|监控/, '')}">${device.type}</span>
                </td>
                <td class="device-location">${device.location}</td>
                <td>
                    <span class="status-badge status-${device.status}">
                        <span class="status-dot"></span>
                        ${device.status === 'online' ? '在线' : '离线'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline" onclick="window.deviceManager.showDeviceHistory(${device.id})" title="历史数据">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="window.deviceManager.editDevice(${device.id})" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="window.deviceManager.showDeleteDeviceModal(${device.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = html;

        // 更新地图标记
        this.updateMapMarkers(filteredData);
    }

    // 获取设备图标
    getDeviceIcon(type) {
        const iconMap = {
            '气象监测': 'cloud-sun',
            '土壤监测': 'seedling',
            '视频监控': 'video'
        };
        return iconMap[type] || 'microchip';
    }

    // 更新设备统计
    updateDeviceStats(devices) {
        const deviceStats = document.getElementById('deviceStats');
        if (!deviceStats) return;

        const totalCount = devices.length;
        const onlineCount = devices.filter(d => d.status === 'online').length;
        const offlineCount = totalCount - onlineCount;

        deviceStats.innerHTML = `
            <div class="stat-item">
                <span class="stat-label">总数:</span>
                <span class="stat-value">${totalCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label stat-online">在线:</span>
                <span class="stat-value">${onlineCount}</span>
            </div>
            <div class="stat-item">
                <span class="stat-label stat-offline">离线:</span>
                <span class="stat-value">${offlineCount}</span>
            </div>
        `;
    }

    // 初始化设备地图
    initDeviceMap() {
        setTimeout(() => {
            this.setupLeafletMap();
        }, 100);
    }

    setupLeafletMap() {
        const mapContainer = document.getElementById('deviceMap');
        const mapLoading = document.getElementById('mapLoading');
        
        if (!mapContainer) return;

        try {
            // 隐藏加载提示
            if (mapLoading) mapLoading.style.display = 'none';

            // 初始化地图
            this.deviceMap = L.map('deviceMap').setView([35.6, 103.2], 10);

            // 添加地图图层
            this.addMapTileLayers();

            // 更新地图提供商信息
            this.updateMapProviderInfo('Leaflet (OpenStreetMap)');

            this.mapInitialized = true;
            this.updateMapMarkers(this.deviceData);

        } catch (error) {
            console.error('地图初始化失败:', error);
            if (mapLoading) {
                mapLoading.innerHTML = '<i class="fas fa-exclamation-triangle"></i><span>地图加载失败</span>';
            }
        }
    }

    addMapTileLayers() {
        if (!this.deviceMap) return;

        // 标准地图图层
        const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        });

        // 卫星图层 (使用Esri World Imagery)
        const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: '© Esri',
            maxZoom: 18
        });

        // 默认添加标准图层
        standardLayer.addTo(this.deviceMap);

        // 存储图层引用
        this.mapLayers = {
            standard: standardLayer,
            satellite: satelliteLayer
        };
    }

    // 切换地图类型
    toggleMapType() {
        if (!this.deviceMap || !this.mapLayers) return;

        const mapTypeBtn = document.getElementById('mapTypeBtn');
        
        if (this.currentMapType === 'standard') {
            this.deviceMap.removeLayer(this.mapLayers.standard);
            this.deviceMap.addLayer(this.mapLayers.satellite);
            this.currentMapType = 'satellite';
            if (mapTypeBtn) {
                mapTypeBtn.innerHTML = '<i class="fas fa-map"></i> 标准';
            }
        } else {
            this.deviceMap.removeLayer(this.mapLayers.satellite);
            this.deviceMap.addLayer(this.mapLayers.standard);
            this.currentMapType = 'standard';
            if (mapTypeBtn) {
                mapTypeBtn.innerHTML = '<i class="fas fa-satellite"></i> 卫星';
            }
        }
    }

    // 更新地图提供商信息
    updateMapProviderInfo(provider) {
        const providerEl = document.getElementById('currentMapProvider');
        if (providerEl) {
            providerEl.textContent = provider;
        }
        this.mapProvider = provider;
    }

    // 更新地图标记
    updateMapMarkers(devices) {
        if (!this.deviceMap || !this.mapInitialized) return;

        // 清除现有标记
        this.deviceMarkers.forEach(marker => {
            this.deviceMap.removeLayer(marker);
        });
        this.deviceMarkers = [];

        // 添加新标记
        devices.forEach(device => {
            const icon = L.divIcon({
                html: `<div class="device-marker ${device.status} ${device.id === this.selectedDeviceId ? 'selected' : ''}">
                        <i class="fas fa-${this.getDeviceIcon(device.type)}"></i>
                       </div>`,
                iconSize: [30, 30],
                className: 'custom-div-icon'
            });

            const marker = L.marker([device.latitude, device.longitude], { icon })
                .addTo(this.deviceMap)
                .bindPopup(`
                    <div class="device-popup">
                        <h4>${device.name}</h4>
                        <p><strong>类型:</strong> ${device.type}</p>
                        <p><strong>位置:</strong> ${device.location}</p>
                        <p><strong>状态:</strong> <span class="status-${device.status}">${device.status === 'online' ? '在线' : '离线'}</span></p>
                        <p><strong>最后上报:</strong> ${Utils.formatDate(device.lastReport, 'MM-DD HH:mm')}</p>
                    </div>
                `)
                .on('click', () => {
                    this.selectDevice(device.id);
                });

            this.deviceMarkers.push(marker);
        });
    }

    // 选择设备
    selectDevice(deviceId) {
        this.selectedDeviceId = deviceId;
        const device = this.deviceData.find(d => d.id === deviceId);
        
        if (device) {
            this.currentDevice = device;
            this.updateSelectedDeviceInfo(device);
            this.loadDeviceData(); // 重新加载以更新选中状态
            
            // 地图居中到设备位置
            if (this.deviceMap) {
                this.deviceMap.setView([device.latitude, device.longitude], 12);
            }
        }
    }

    // 更新选中设备信息
    updateSelectedDeviceInfo(device) {
        const selectedDeviceInfo = document.getElementById('selectedDeviceInfo');
        if (!selectedDeviceInfo) return;

        selectedDeviceInfo.innerHTML = `
            <div class="selected-device-details">
                <div class="device-header">
                    <i class="fas fa-${this.getDeviceIcon(device.type)} device-icon"></i>
                    <h4>${device.name}</h4>
                    <span class="status-badge status-${device.status}">
                        <span class="status-dot"></span>
                        ${device.status === 'online' ? '在线' : '离线'}
                    </span>
                </div>
                <div class="device-details">
                    <div class="detail-item">
                        <label>类型:</label>
                        <span>${device.type}</span>
                    </div>
                    <div class="detail-item">
                        <label>位置:</label>
                        <span>${device.location}</span>
                    </div>
                    <div class="detail-item">
                        <label>坐标:</label>
                        <span>${device.latitude.toFixed(4)}, ${device.longitude.toFixed(4)}</span>
                    </div>
                    <div class="detail-item">
                        <label>最后上报:</label>
                        <span>${Utils.formatDate(device.lastReport)}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // 显示设备历史数据
    showDeviceHistory(deviceId) {
        const device = this.deviceData.find(d => d.id === deviceId);
        if (!device) return;

        this.currentDevice = device;
        document.getElementById('deviceHistoryTitle').textContent = `${device.name} - 历史数据`;
        
        this.showModal('deviceHistoryModal');
        this.loadHistoryData();
    }

    // 加载历史数据
    loadHistoryData() {
        if (!this.currentDevice) return;

        this.generateMockHistoryData();
        this.renderHistoryChart();
        this.renderHistoryTable();
        this.renderDataStatsCards();
    }

    // 生成模拟历史数据
    generateMockHistoryData() {
        const now = new Date();
        const data = [];
        
        for (let i = this.currentTimeRange - 1; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            
            // 根据数据类型生成不同的模拟数据
            let value, unit, label;
            switch (this.currentDataType) {
                case 'weather-forecast':
                    value = 15 + Math.random() * 20; // 15-35°C
                    unit = '°C';
                    label = '温度';
                    break;
                case 'rainfall':
                    value = Math.random() * 50; // 0-50mm
                    unit = 'mm';
                    label = '降雨量';
                    break;
                case 'ground-temp':
                    value = 8 + Math.random() * 25; // 8-33°C
                    unit = '°C';
                    label = '地温';
                    break;
                case 'air-temp':
                    value = 10 + Math.random() * 25; // 10-35°C
                    unit = '°C';
                    label = '气温';
                    break;
                case 'accumulated-temp':
                    value = 300 + Math.random() * 200; // 300-500°C·日
                    unit = '°C·日';
                    label = '积温';
                    break;
                case 'accumulated-rain':
                    value = 50 + Math.random() * 150; // 50-200mm
                    unit = 'mm';
                    label = '积雨';
                    break;
                case 'humidity':
                    value = 40 + Math.random() * 40; // 40-80%
                    unit = '%';
                    label = '湿度';
                    break;
                default:
                    value = Math.random() * 100;
                    unit = '';
                    label = '数值';
            }
            
            data.push({
                date: date.toISOString().split('T')[0],
                datetime: Utils.formatDate(date),
                value: Math.round(value * 100) / 100,
                unit,
                label
            });
        }
        
        this.currentHistoryData = data;
    }

    // 渲染历史数据图表
    renderHistoryChart() {
        const chartContainer = document.getElementById('historyChart');
        if (!chartContainer || !this.currentHistoryData) return;

        // 销毁现有图表
        if (this.historyChart) {
            this.historyChart.dispose();
        }

        this.historyChart = echarts.init(chartContainer);

        const option = {
            title: {
                text: `${this.currentDevice.name} - ${this.currentHistoryData[0]?.label || ''}数据趋势`,
                left: 'center',
                textStyle: {
                    fontSize: 16
                }
            },
            tooltip: {
                trigger: 'axis',
                formatter: params => {
                    const data = params[0];
                    return `${data.axisValue}<br/>${data.seriesName}: ${data.value} ${this.currentHistoryData[0]?.unit || ''}`;
                }
            },
            xAxis: {
                type: 'category',
                data: this.currentHistoryData.map(item => item.date),
                axisLabel: {
                    formatter: value => {
                        const date = new Date(value);
                        return `${date.getMonth() + 1}/${date.getDate()}`;
                    }
                }
            },
            yAxis: {
                type: 'value',
                name: this.currentHistoryData[0]?.unit || '',
                axisLabel: {
                    formatter: '{value} ' + (this.currentHistoryData[0]?.unit || '')
                }
            },
            series: [{
                name: this.currentHistoryData[0]?.label || '数值',
                type: 'line',
                data: this.currentHistoryData.map(item => item.value),
                smooth: true,
                lineStyle: {
                    color: '#007bff',
                    width: 3
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(0, 123, 255, 0.3)' },
                            { offset: 1, color: 'rgba(0, 123, 255, 0.1)' }
                        ]
                    }
                }
            }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            }
        };

        this.historyChart.setOption(option);
    }

    // 渲染历史数据表格
    renderHistoryTable() {
        const tableHead = document.getElementById('historyTableHead');
        const tableBody = document.getElementById('historyTableBody');
        
        if (!tableHead || !tableBody || !this.currentHistoryData) return;

        // 表头
        tableHead.innerHTML = `
            <tr>
                <th>日期</th>
                <th>${this.currentHistoryData[0]?.label || '数值'} (${this.currentHistoryData[0]?.unit || ''})</th>
                <th>记录时间</th>
            </tr>
        `;

        // 表体
        const html = this.currentHistoryData.map(item => `
            <tr>
                <td>${item.date}</td>
                <td>${item.value} ${item.unit}</td>
                <td>${item.datetime}</td>
            </tr>
        `).join('');

        tableBody.innerHTML = html;
    }

    // 渲染数据统计卡片
    renderDataStatsCards() {
        const cardsContainer = document.getElementById('dataStatsCards');
        if (!cardsContainer || !this.currentHistoryData) return;

        const values = this.currentHistoryData.map(item => item.value);
        const max = Math.max(...values);
        const min = Math.min(...values);
        const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
        const unit = this.currentHistoryData[0]?.unit || '';

        cardsContainer.innerHTML = `
            <div class="stats-card">
                <div class="card-icon max">
                    <i class="fas fa-arrow-up"></i>
                </div>
                <div class="card-content">
                    <div class="card-value">${max.toFixed(2)} ${unit}</div>
                    <div class="card-label">最大值</div>
                </div>
            </div>
            <div class="stats-card">
                <div class="card-icon min">
                    <i class="fas fa-arrow-down"></i>
                </div>
                <div class="card-content">
                    <div class="card-value">${min.toFixed(2)} ${unit}</div>
                    <div class="card-label">最小值</div>
                </div>
            </div>
            <div class="stats-card">
                <div class="card-icon avg">
                    <i class="fas fa-chart-line"></i>
                </div>
                <div class="card-content">
                    <div class="card-value">${avg.toFixed(2)} ${unit}</div>
                    <div class="card-label">平均值</div>
                </div>
            </div>
            <div class="stats-card">
                <div class="card-icon count">
                    <i class="fas fa-database"></i>
                </div>
                <div class="card-content">
                    <div class="card-value">${values.length}</div>
                    <div class="card-label">数据点数</div>
                </div>
            </div>
        `;
    }

    // 显示新增设备模态框
    showAddDeviceModal() {
        this.editingDeviceId = null;
        this.resetDeviceForm();
        document.getElementById('deviceModalTitle').textContent = '新增设备信息';
        this.showModal('deviceModal');
    }

    // 编辑设备
    editDevice(deviceId) {
        const device = this.deviceData.find(d => d.id === deviceId);
        if (!device) return;

        this.editingDeviceId = deviceId;
        this.fillDeviceForm(device);
        document.getElementById('deviceModalTitle').textContent = '编辑设备信息';
        this.showModal('deviceModal');
    }

    // 显示删除确认模态框
    showDeleteDeviceModal(deviceId) {
        const device = this.deviceData.find(d => d.id === deviceId);
        if (!device) return;

        this.deletingDeviceId = deviceId;
        document.getElementById('deleteDeviceName').textContent = device.name;
        
        // 绑定确认删除按钮事件
        const confirmBtn = document.getElementById('confirmDeleteDeviceBtn');
        if (confirmBtn) {
            confirmBtn.onclick = () => this.confirmDeleteDevice();
        }
        
        this.showModal('deleteDeviceModal');
    }

    // 确认删除设备
    confirmDeleteDevice() {
        if (!this.deletingDeviceId) return;

        const index = this.deviceData.findIndex(d => d.id === this.deletingDeviceId);
        if (index !== -1) {
            this.deviceData.splice(index, 1);
            Utils.showMessage('设备删除成功', 'success');
            this.loadDeviceData();
        }

        this.closeDeleteDeviceModal();
    }

    // 重置设备表单
    resetDeviceForm() {
        const form = document.getElementById('deviceForm');
        if (form) {
            form.reset();
        }
        
        // 设置默认的上报时间为当前时间
        const lastReportInput = document.getElementById('deviceLastReport');
        if (lastReportInput) {
            const now = new Date();
            const formattedTime = now.toISOString().slice(0, 16);
            lastReportInput.value = formattedTime;
        }
    }

    // 填充设备表单
    fillDeviceForm(device) {
        document.getElementById('deviceName').value = device.name;
        document.getElementById('deviceType').value = device.type;
        document.getElementById('deviceLocation').value = device.location;
        document.getElementById('deviceStatus').value = device.status;
        document.getElementById('deviceLongitude').value = device.longitude;
        document.getElementById('deviceLatitude').value = device.latitude;
        document.getElementById('deviceLastReport').value = device.lastReport.replace(' ', 'T');
    }

    // 保存设备
    saveDevice() {
        const formData = {
            name: document.getElementById('deviceName').value.trim(),
            type: document.getElementById('deviceType').value,
            location: document.getElementById('deviceLocation').value.trim(),
            status: document.getElementById('deviceStatus').value,
            longitude: parseFloat(document.getElementById('deviceLongitude').value),
            latitude: parseFloat(document.getElementById('deviceLatitude').value),
            lastReport: document.getElementById('deviceLastReport').value
        };

        // 验证必填字段
        if (!formData.name || !formData.type || !formData.location || !formData.status || 
            isNaN(formData.longitude) || isNaN(formData.latitude) || !formData.lastReport) {
            Utils.showMessage('请填写所有必填字段', 'error');
            return;
        }

        // 验证坐标范围
        if (formData.longitude < -180 || formData.longitude > 180) {
            Utils.showMessage('经度必须在-180到180之间', 'error');
            return;
        }
        
        if (formData.latitude < -90 || formData.latitude > 90) {
            Utils.showMessage('纬度必须在-90到90之间', 'error');
            return;
        }

        // 检查设备名称重复（编辑时排除自身）
        const existingDevice = this.deviceData.find(d => 
            d.name === formData.name && d.id !== this.editingDeviceId
        );
        if (existingDevice) {
            Utils.showMessage('设备名称已存在', 'error');
            return;
        }

        if (this.editingDeviceId) {
            // 编辑模式
            const index = this.deviceData.findIndex(d => d.id === this.editingDeviceId);
            if (index !== -1) {
                this.deviceData[index] = {
                    ...this.deviceData[index],
                    ...formData,
                    lastReport: formData.lastReport.replace('T', ' ')
                };
                Utils.showMessage('设备信息更新成功', 'success');
            }
        } else {
            // 新增模式
            const newId = Math.max(...this.deviceData.map(d => d.id), 0) + 1;
            this.deviceData.push({
                id: newId,
                ...formData,
                lastReport: formData.lastReport.replace('T', ' ')
            });
            Utils.showMessage('设备信息添加成功', 'success');
        }

        this.closeDeviceModal();
        this.loadDeviceData();
    }

    // 导出设备数据
    exportDeviceData() {
        // 创建CSV内容
        const headers = ['设备名称', '设备类型', '位置', '状态', '经度', '纬度', '最后上报时间'];
        const csvContent = [
            headers.join(','),
            ...this.deviceData.map(device => [
                device.name,
                device.type,
                device.location,
                device.status === 'online' ? '在线' : '离线',
                device.longitude,
                device.latitude,
                device.lastReport
            ].join(','))
        ].join('\n');

        // 下载文件
        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `设备数据_${Utils.formatDate(new Date(), 'YYYY-MM-DD')}.csv`;
        link.click();

        Utils.showMessage('数据导出成功', 'success');
    }

    // 刷新设备地图
    refreshDeviceMap() {
        if (this.deviceMap) {
            this.loadDeviceData();
            Utils.showMessage('地图数据已刷新', 'success');
        }
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

    closeDeviceModal() {
        this.editingDeviceId = null;
        this.closeModal('deviceModal');
    }

    closeDeleteDeviceModal() {
        this.deletingDeviceId = null;
        this.closeModal('deleteDeviceModal');
    }

    closeDeviceHistoryModal() {
        this.currentDevice = null;
        if (this.historyChart) {
            this.historyChart.dispose();
            this.historyChart = null;
        }
        this.closeModal('deviceHistoryModal');
    }
}

// 全局函数
function showAddDeviceModal() {
    if (window.deviceManager) {
        window.deviceManager.showAddDeviceModal();
    }
}

function closeDeviceModal() {
    if (window.deviceManager) {
        window.deviceManager.closeDeviceModal();
    }
}

function closeDeleteDeviceModal() {
    if (window.deviceManager) {
        window.deviceManager.closeDeleteDeviceModal();
    }
}

function closeDeviceHistoryModal() {
    if (window.deviceManager) {
        window.deviceManager.closeDeviceHistoryModal();
    }
}

function toggleMapType() {
    if (window.deviceManager) {
        window.deviceManager.toggleMapType();
    }
}

function exportDeviceData() {
    if (window.deviceManager) {
        window.deviceManager.exportDeviceData();
    }
}

function refreshDeviceMap() {
    if (window.deviceManager) {
        window.deviceManager.refreshDeviceMap();
    }
}

function loadCustomRangeData() {
    if (window.deviceManager) {
        // 获取自定义时间范围
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
            
            if (days > 0 && days <= 365) {
                window.deviceManager.currentTimeRange = days;
                window.deviceManager.loadHistoryData();
                Utils.showMessage(`已加载 ${days} 天的数据`, 'success');
            } else {
                Utils.showMessage('请选择有效的时间范围（最多365天）', 'error');
            }
        } else {
            Utils.showMessage('请选择开始和结束日期', 'error');
        }
    }
}

function exportHistoryData() {
    if (window.deviceManager && window.deviceManager.currentHistoryData) {
        const data = window.deviceManager.currentHistoryData;
        const device = window.deviceManager.currentDevice;
        
        const headers = ['日期', `${data[0]?.label || '数值'} (${data[0]?.unit || ''})`, '记录时间'];
        const csvContent = [
            headers.join(','),
            ...data.map(item => [
                item.date,
                `${item.value} ${item.unit}`,
                item.datetime
            ].join(','))
        ].join('\n');

        const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${device?.name || '设备'}_历史数据_${Utils.formatDate(new Date(), 'YYYY-MM-DD')}.csv`;
        link.click();

        Utils.showMessage('历史数据导出成功', 'success');
    }
}

function refreshHistoryData() {
    if (window.deviceManager) {
        window.deviceManager.loadHistoryData();
        Utils.showMessage('历史数据已刷新', 'success');
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.deviceManager = new DeviceDataManager();
});
