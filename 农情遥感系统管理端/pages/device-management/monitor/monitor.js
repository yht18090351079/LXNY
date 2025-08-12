/**
 * 设备监控页面功能
 */

// 全局变量
let deviceStatusChart = null;
let refreshInterval = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 初始化图表
  initCharts();
  
  // 初始化数据
  loadMonitorData();
  
  // 初始化事件监听
  initEventListeners();
  
  // 启动自动刷新
  startAutoRefresh();
});

/**
 * 初始化图表
 */
function initCharts() {
  // 初始化设备状态分布图表
  initDeviceStatusChart();
}

/**
 * 初始化设备状态分布图表
 */
function initDeviceStatusChart() {
  const chartContainer = document.getElementById('deviceStatusChart');
  if (!chartContainer) return;

  deviceStatusChart = echarts.init(chartContainer);
  
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'center',
      data: ['在线设备', '离线设备', '告警设备']
    },
    series: [
      {
        name: '设备状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { value: 28, name: '在线设备', itemStyle: { color: '#52C41A' } },
          { value: 3, name: '离线设备', itemStyle: { color: '#F5222D' } },
          { value: 2, name: '告警设备', itemStyle: { color: '#FAAD14' } }
        ]
      }
    ]
  };

  deviceStatusChart.setOption(option);
  
  // 监听侧边栏切换事件，重新调整图表大小
  document.addEventListener('sidebarToggle', function() {
    setTimeout(() => {
      deviceStatusChart.resize();
    }, 350);
  });
  
  // 窗口大小改变时重新调整图表大小
  window.addEventListener('resize', function() {
    deviceStatusChart.resize();
  });
}

/**
 * 加载监控数据
 */
function loadMonitorData() {
  // 加载告警列表
  loadAlertList();
  
  // 加载设备监控表格
  loadDeviceTable();
}

/**
 * 加载告警列表
 */
function loadAlertList() {
  const alertList = document.getElementById('alertList');
  if (!alertList) return;

  const mockAlerts = [
    {
      id: 1,
      level: 'high',
      icon: 'fas fa-exclamation-triangle',
      title: '设备离线告警',
      desc: '气象站WS-001已离线超过10分钟',
      time: '2分钟前',
      device: 'WS-001'
    },
    {
      id: 2,
      level: 'medium',
      icon: 'fas fa-battery-quarter',
      title: '电池电量低',
      desc: '传感器SN-005电池电量仅剩15%',
      time: '5分钟前',
      device: 'SN-005'
    },
    {
      id: 3,
      level: 'medium',
      icon: 'fas fa-wifi',
      title: '信号强度弱',
      desc: '摄像头CAM-003信号强度低于30%',
      time: '8分钟前',
      device: 'CAM-003'
    },
    {
      id: 4,
      level: 'low',
      icon: 'fas fa-info-circle',
      title: '数据上传异常',
      desc: '传感器SN-002数据上传延迟',
      time: '12分钟前',
      device: 'SN-002'
    },
    {
      id: 5,
      level: 'high',
      icon: 'fas fa-exclamation-triangle',
      title: '设备故障',
      desc: '网关GW-001响应超时',
      time: '15分钟前',
      device: 'GW-001'
    }
  ];

  alertList.innerHTML = mockAlerts.map(alert => `
    <div class="alert-item">
      <div class="alert-icon ${alert.level}">
        <i class="${alert.icon}"></i>
      </div>
      <div class="alert-content">
        <div class="alert-title">${alert.title}</div>
        <div class="alert-desc">${alert.desc}</div>
        <div class="alert-time">${alert.time}</div>
      </div>
    </div>
  `).join('');
}

/**
 * 加载设备监控表格
 */
function loadDeviceTable() {
  const tableBody = document.getElementById('deviceTableBody');
  if (!tableBody) return;

  const mockDevices = [
    {
      id: 'SN-001',
      name: '土壤传感器01',
      type: 'sensor',
      typeName: '传感器',
      status: 'online',
      statusText: '在线',
      location: '1号农田',
      lastComm: '2分钟前',
      signal: 85,
      battery: 78,
      dataUpload: '正常'
    },
    {
      id: 'CAM-001',
      name: '监控摄像头01',
      type: 'camera',
      typeName: '摄像头',
      status: 'online',
      statusText: '在线',
      location: '农田入口',
      lastComm: '1分钟前',
      signal: 92,
      battery: null,
      dataUpload: '正常'
    },
    {
      id: 'WS-001',
      name: '气象站01',
      type: 'weather',
      typeName: '气象站',
      status: 'offline',
      statusText: '离线',
      location: '中心区域',
      lastComm: '10分钟前',
      signal: 0,
      battery: 45,
      dataUpload: '中断'
    },
    {
      id: 'SN-002',
      name: '土壤传感器02',
      type: 'sensor',
      typeName: '传感器',
      status: 'alert',
      statusText: '告警',
      location: '2号农田',
      lastComm: '3分钟前',
      signal: 65,
      battery: 15,
      dataUpload: '延迟'
    },
    {
      id: 'GW-001',
      name: '数据网关01',
      type: 'gateway',
      typeName: '网关',
      status: 'online',
      statusText: '在线',
      location: '控制中心',
      lastComm: '30秒前',
      signal: 98,
      battery: null,
      dataUpload: '正常'
    }
  ];

  tableBody.innerHTML = mockDevices.map(device => `
    <tr>
      <td>
        <div class="device-name">
          <strong>${device.name}</strong>
          <div style="font-size: 12px; color: #999; margin-top: 2px;">${device.id}</div>
        </div>
      </td>
      <td>
        <div class="device-type">
          <div class="device-type-icon ${device.type}">
            <i class="fas fa-${getDeviceIcon(device.type)}"></i>
          </div>
          <span>${device.typeName}</span>
        </div>
      </td>
      <td>
        <div class="device-status ${device.status}">
          <span class="status-dot ${device.status}"></span>
          ${device.statusText}
        </div>
      </td>
      <td>${device.location}</td>
      <td>${device.lastComm}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 8px;">
          <div class="progress-bar">
            <div class="progress-fill ${getSignalLevel(device.signal)}" style="width: ${device.signal}%"></div>
          </div>
          <span style="font-size: 12px; color: #666;">${device.signal}%</span>
        </div>
      </td>
      <td>
        ${device.battery !== null ? `
          <div style="display: flex; align-items: center; gap: 8px;">
            <div class="progress-bar">
              <div class="progress-fill ${getBatteryLevel(device.battery)}" style="width: ${device.battery}%"></div>
            </div>
            <span style="font-size: 12px; color: #666;">${device.battery}%</span>
          </div>
        ` : '<span style="color: #999; font-size: 12px;">无电池</span>'}
      </td>
      <td>
        <span class="data-upload-status ${device.dataUpload === '正常' ? 'normal' : 'abnormal'}">${device.dataUpload}</span>
      </td>
      <td>
        <div class="action-buttons">
          <button class="action-button view" title="查看详情" onclick="viewDevice('${device.id}')">
            <i class="fas fa-eye"></i>
          </button>
          <button class="action-button edit" title="编辑设备" onclick="editDevice('${device.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="action-button delete" title="删除设备" onclick="deleteDevice('${device.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * 获取设备图标
 */
function getDeviceIcon(type) {
  const icons = {
    sensor: 'thermometer-half',
    camera: 'video',
    weather: 'cloud-sun',
    gateway: 'wifi'
  };
  return icons[type] || 'microchip';
}

/**
 * 获取信号强度等级
 */
function getSignalLevel(signal) {
  if (signal >= 70) return 'good';
  if (signal >= 30) return 'medium';
  return 'low';
}

/**
 * 获取电池电量等级
 */
function getBatteryLevel(battery) {
  if (battery >= 50) return 'good';
  if (battery >= 20) return 'medium';
  return 'low';
}

/**
 * 初始化事件监听
 */
function initEventListeners() {
  // 刷新按钮
  const refreshBtn = document.getElementById('refreshBtn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function() {
      refreshData();
    });
  }

  // 告警设置按钮
  const alertSettingsBtn = document.getElementById('alertSettingsBtn');
  if (alertSettingsBtn) {
    alertSettingsBtn.addEventListener('click', function() {
      openAlertSettingsModal();
    });
  }

  // 添加设备按钮
  const addDeviceBtn = document.getElementById('addDeviceBtn');
  if (addDeviceBtn) {
    addDeviceBtn.addEventListener('click', function() {
      addDevice();
    });
  }

  // 状态筛选
  const statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', function() {
      filterDevices();
    });
  }

  // 类型筛选
  const typeFilter = document.getElementById('typeFilter');
  if (typeFilter) {
    typeFilter.addEventListener('change', function() {
      filterDevices();
    });
  }

  // 地图控制按钮
  const mapControlBtns = document.querySelectorAll('.map-control-btn');
  mapControlBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除其他按钮的active类
      mapControlBtns.forEach(b => b.classList.remove('active'));
      // 添加当前按钮的active类
      this.classList.add('active');
      
      const layer = this.getAttribute('data-layer');
      filterMapDevices(layer);
    });
  });
}

/**
 * 刷新数据
 */
function refreshData() {
  const refreshBtn = document.getElementById('refreshBtn');
  const icon = refreshBtn.querySelector('i');
  
  // 添加旋转动画
  icon.style.animation = 'spin 1s linear infinite';
  refreshBtn.disabled = true;
  
  // 模拟数据刷新
  setTimeout(() => {
    loadMonitorData();
    updateOverviewCards();
    
    // 移除旋转动画
    icon.style.animation = '';
    refreshBtn.disabled = false;
    
    // 显示成功消息
    showMessage('数据刷新成功', 'success');
  }, 1000);
}

/**
 * 更新总览卡片数据
 */
function updateOverviewCards() {
  // 模拟数据更新
  const onlineDevices = document.getElementById('onlineDevices');
  const offlineDevices = document.getElementById('offlineDevices');
  const alertCount = document.getElementById('alertCount');
  const dataTransmission = document.getElementById('dataTransmission');
  
  if (onlineDevices) onlineDevices.textContent = Math.floor(Math.random() * 5) + 26;
  if (offlineDevices) offlineDevices.textContent = Math.floor(Math.random() * 3) + 2;
  if (alertCount) alertCount.textContent = Math.floor(Math.random() * 5) + 3;
  if (dataTransmission) dataTransmission.textContent = (Math.random() * 5 + 94).toFixed(1) + '%';
}

/**
 * 筛选设备
 */
function filterDevices() {
  const statusFilter = document.getElementById('statusFilter').value;
  const typeFilter = document.getElementById('typeFilter').value;
  
  const rows = document.querySelectorAll('#deviceTableBody tr');
  
  rows.forEach(row => {
    let showRow = true;
    
    // 状态筛选
    if (statusFilter) {
      const statusElement = row.querySelector('.device-status');
      if (statusElement && !statusElement.classList.contains(statusFilter)) {
        showRow = false;
      }
    }
    
    // 类型筛选
    if (typeFilter && showRow) {
      const typeIcon = row.querySelector('.device-type-icon');
      if (typeIcon && !typeIcon.classList.contains(typeFilter)) {
        showRow = false;
      }
    }
    
    row.style.display = showRow ? '' : 'none';
  });
}

/**
 * 筛选地图设备
 */
function filterMapDevices(layer) {
  console.log('筛选地图设备层级:', layer);
  // 这里可以实现地图设备筛选逻辑
}

/**
 * 启动自动刷新
 */
function startAutoRefresh() {
  // 每30秒自动刷新一次数据
  refreshInterval = setInterval(() => {
    loadAlertList();
    updateOverviewCards();
  }, 30000);
}

/**
 * 停止自动刷新
 */
function stopAutoRefresh() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

/**
 * 查看设备详情
 */
function viewDevice(deviceId) {
  window.location.href = `../detail/detail.html?id=${deviceId}`;
}

/**
 * 添加设备
 */
function addDevice() {
  showMessage('添加设备功能开发中...', 'info');
  // 这里可以打开添加设备的模态框或跳转到添加页面
}

/**
 * 编辑设备
 */
function editDevice(deviceId) {
  console.log('编辑设备:', deviceId);
  showMessage('编辑功能开发中...', 'info');
}

/**
 * 删除设备
 */
function deleteDevice(deviceId) {
  if (confirm('确定要删除这个设备吗？')) {
    console.log('删除设备:', deviceId);
    showMessage('设备删除成功', 'success');
    // 重新加载表格数据
    setTimeout(() => {
      loadDeviceTable();
    }, 500);
  }
}

/**
 * 打开告警设置模态框
 */
function openAlertSettingsModal() {
  const modal = document.getElementById('alertSettingsModal');
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('modal-open');
  }
}

/**
 * 关闭告警设置模态框
 */
function closeAlertSettingsModal() {
  const modal = document.getElementById('alertSettingsModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('modal-open');
  }
}

/**
 * 保存告警设置
 */
function saveAlertSettings() {
  // 获取表单数据
  const formData = new FormData();
  const inputs = document.querySelectorAll('#alertSettingsModal input');
  
  inputs.forEach(input => {
    if (input.type === 'checkbox') {
      formData.append(input.name || 'setting', input.checked);
    } else {
      formData.append(input.name || 'setting', input.value);
    }
  });
  
  // 模拟保存
  setTimeout(() => {
    showMessage('告警设置保存成功', 'success');
    closeAlertSettingsModal();
  }, 500);
}

/**
 * 显示消息提示
 */
function showMessage(text, type = 'info') {
  // 这里可以集成Toast组件或使用浏览器alert
  console.log(`${type.toUpperCase()}: ${text}`);
  
  // 简单的消息提示实现
  const message = document.createElement('div');
  message.className = `message message-${type}`;
  message.textContent = text;
  message.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#f6ffed' : type === 'error' ? '#fff2f0' : '#e6f7ff'};
    color: ${type === 'success' ? '#52c41a' : type === 'error' ? '#f5222d' : '#1890ff'};
    border: 1px solid ${type === 'success' ? '#b7eb8f' : type === 'error' ? '#ffccc7' : '#91d5ff'};
    border-radius: 6px;
    z-index: 9999;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(message);
  
  // 3秒后自动移除
  setTimeout(() => {
    message.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      document.body.removeChild(message);
    }, 300);
  }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
  
  .data-upload-status.normal {
    color: #52C41A;
    font-weight: 500;
  }
  
  .data-upload-status.abnormal {
    color: #F5222D;
    font-weight: 500;
  }
`;
document.head.appendChild(style);

// 页面卸载时清理定时器
window.addEventListener('beforeunload', function() {
  stopAutoRefresh();
});