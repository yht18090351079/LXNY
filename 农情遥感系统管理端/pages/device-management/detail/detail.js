/**
 * 设备详情页面功能
 */

// 全局变量
let deviceData = null;
let dataChart = null;
let refreshInterval = null;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 获取设备ID
  const deviceId = getDeviceIdFromUrl();
  
  // 加载设备详情
  loadDeviceDetail(deviceId);
  
  // 初始化图表
  initDataChart();
  
  // 初始化事件监听
  initEventListeners();
  
  // 启动实时数据更新
  startRealTimeUpdate();
});

/**
 * 从URL获取设备ID
 */
function getDeviceIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id') || 'SN-001';
}

/**
 * 加载设备详情
 */
function loadDeviceDetail(deviceId) {
  // 模拟设备详情数据
  const mockDeviceData = {
    'SN-001': {
      id: 'SN-001',
      name: '土壤传感器01',
      type: 'sensor',
      typeName: '传感器',
      model: 'SS-2024-Pro',
      status: 'online',
      statusText: '在线',
      location: '1号农田',
      installDate: '2024-01-10',
      manager: '张三',
      phone: '138****1234',
      voltage: '12V DC',
      power: '2W',
      communication: 'LoRa',
      frequency: '每5分钟',
      temperature: '-20°C ~ +60°C',
      protection: 'IP67',
      connectionStatus: '在线',
      signalStrength: '85%',
      batteryLevel: '78%',
      deviceTemperature: '25°C'
    },
    'CAM-001': {
      id: 'CAM-001',
      name: '监控摄像头01',
      type: 'camera',
      typeName: '摄像头',
      model: 'CAM-4K-Pro',
      status: 'online',
      statusText: '在线',
      location: '农田入口',
      installDate: '2024-01-08',
      manager: '李四',
      phone: '139****5678',
      voltage: '24V DC',
      power: '15W',
      communication: 'WiFi/4G',
      frequency: '实时',
      temperature: '-30°C ~ +70°C',
      protection: 'IP66',
      connectionStatus: '在线',
      signalStrength: '92%',
      batteryLevel: null,
      deviceTemperature: '28°C'
    }
  };

  deviceData = mockDeviceData[deviceId] || mockDeviceData['SN-001'];
  
  // 更新页面显示
  updateDeviceInfo();
  loadMaintenanceRecords();
}

/**
 * 更新设备信息显示
 */
function updateDeviceInfo() {
  if (!deviceData) return;

  // 更新页面标题
  document.getElementById('deviceTitle').textContent = `${deviceData.name} - 设备详情`;
  document.title = `${deviceData.name} - 设备详情 - 农情遥感系统管理端`;

  // 更新设备概览
  const deviceAvatar = document.getElementById('deviceAvatar');
  deviceAvatar.className = `device-avatar ${deviceData.type}`;
  deviceAvatar.innerHTML = `<i class="fas fa-${getDeviceIcon(deviceData.type)}"></i>`;

  document.getElementById('deviceName').textContent = deviceData.name;
  document.getElementById('deviceId').textContent = deviceData.id;
  
  const deviceStatus = document.getElementById('deviceStatus');
  deviceStatus.className = `device-status ${deviceData.status}`;
  deviceStatus.innerHTML = `
    <span class="status-dot ${deviceData.status}"></span>
    <span class="status-text">${deviceData.statusText}</span>
  `;

  // 更新基本信息
  document.getElementById('infoDeviceName').textContent = deviceData.name;
  document.getElementById('infoDeviceId').textContent = deviceData.id;
  document.getElementById('infoDeviceType').textContent = deviceData.typeName;
  document.getElementById('infoDeviceModel').textContent = deviceData.model;
  document.getElementById('infoLocation').textContent = deviceData.location;
  document.getElementById('infoInstallDate').textContent = deviceData.installDate;
  document.getElementById('infoManager').textContent = deviceData.manager;
  document.getElementById('infoPhone').textContent = deviceData.phone;

  // 更新技术参数
  document.getElementById('infoVoltage').textContent = deviceData.voltage;
  document.getElementById('infoPower').textContent = deviceData.power;
  document.getElementById('infoCommunication').textContent = deviceData.communication;
  document.getElementById('infoFrequency').textContent = deviceData.frequency;
  document.getElementById('infoTemperature').textContent = deviceData.temperature;
  document.getElementById('infoProtection').textContent = deviceData.protection;

  // 更新实时状态
  document.getElementById('connectionStatus').textContent = deviceData.connectionStatus;
  document.getElementById('signalStrength').textContent = deviceData.signalStrength;
  document.getElementById('batteryLevel').textContent = deviceData.batteryLevel || '无电池';
  document.getElementById('deviceTemperature').textContent = deviceData.deviceTemperature;

  // 更新最后更新时间
  document.getElementById('lastUpdate').textContent = new Date().toLocaleString();
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
 * 加载维护记录
 */
function loadMaintenanceRecords() {
  const mockRecords = [
    {
      id: 1,
      type: 'maintenance',
      title: '定期维护',
      desc: '清洁传感器外壳，检查连接线路',
      time: '2024-01-15 14:30',
      operator: '张三'
    },
    {
      id: 2,
      type: 'repair',
      title: '故障修复',
      desc: '更换损坏的温度传感器模块',
      time: '2024-01-10 09:15',
      operator: '李四'
    },
    {
      id: 3,
      type: 'upgrade',
      title: '固件升级',
      desc: '升级到v2.1.0版本，优化数据传输',
      time: '2024-01-05 16:45',
      operator: '王五'
    }
  ];

  const maintenanceList = document.getElementById('maintenanceList');
  if (!maintenanceList) return;

  maintenanceList.innerHTML = mockRecords.map(record => `
    <div class="maintenance-item">
      <div class="maintenance-icon">
        <i class="fas fa-${getMaintenanceIcon(record.type)}"></i>
      </div>
      <div class="maintenance-content">
        <div class="maintenance-title">${record.title}</div>
        <div class="maintenance-desc">${record.desc}</div>
        <div class="maintenance-time">${record.time} - ${record.operator}</div>
      </div>
    </div>
  `).join('');
}

/**
 * 获取维护记录图标
 */
function getMaintenanceIcon(type) {
  const icons = {
    maintenance: 'tools',
    repair: 'wrench',
    upgrade: 'upload'
  };
  return icons[type] || 'cog';
}

/**
 * 初始化数据图表
 */
function initDataChart() {
  const chartContainer = document.getElementById('dataChart');
  if (!chartContainer) return;

  dataChart = echarts.init(chartContainer);
  
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    legend: {
      data: ['温度', '湿度', '光照强度']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: generateTimeLabels()
    },
    yAxis: [
      {
        type: 'value',
        name: '温度(°C)',
        position: 'left',
        axisLabel: {
          formatter: '{value} °C'
        }
      },
      {
        type: 'value',
        name: '湿度(%)',
        position: 'right',
        axisLabel: {
          formatter: '{value} %'
        }
      }
    ],
    series: [
      {
        name: '温度',
        type: 'line',
        yAxisIndex: 0,
        data: generateRandomData(24, 20, 30),
        smooth: true,
        itemStyle: {
          color: '#1890FF'
        }
      },
      {
        name: '湿度',
        type: 'line',
        yAxisIndex: 1,
        data: generateRandomData(24, 40, 80),
        smooth: true,
        itemStyle: {
          color: '#52C41A'
        }
      },
      {
        name: '光照强度',
        type: 'line',
        yAxisIndex: 1,
        data: generateRandomData(24, 0, 100),
        smooth: true,
        itemStyle: {
          color: '#FAAD14'
        }
      }
    ]
  };

  dataChart.setOption(option);
  
  // 监听侧边栏切换事件，重新调整图表大小
  document.addEventListener('sidebarToggle', function() {
    setTimeout(() => {
      dataChart.resize();
    }, 350);
  });
  
  // 窗口大小改变时重新调整图表大小
  window.addEventListener('resize', function() {
    dataChart.resize();
  });
}

/**
 * 生成时间标签
 */
function generateTimeLabels() {
  const labels = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    labels.push(time.getHours().toString().padStart(2, '0') + ':00');
  }
  return labels;
}

/**
 * 生成随机数据
 */
function generateRandomData(count, min, max) {
  const data = [];
  for (let i = 0; i < count; i++) {
    data.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return data;
}

/**
 * 初始化事件监听
 */
function initEventListeners() {
  // 编辑设备按钮
  const editDeviceBtn = document.getElementById('editDeviceBtn');
  if (editDeviceBtn) {
    editDeviceBtn.addEventListener('click', function() {
      editDevice();
    });
  }

  // 远程控制按钮
  const remoteControlBtn = document.getElementById('remoteControlBtn');
  if (remoteControlBtn) {
    remoteControlBtn.addEventListener('click', function() {
      toggleRemoteControl();
    });
  }

  // 状态切换按钮
  const statusToggleBtn = document.getElementById('statusToggleBtn');
  if (statusToggleBtn) {
    statusToggleBtn.addEventListener('click', function() {
      toggleDeviceStatus();
    });
  }

  // 图表控制按钮
  const chartControlBtns = document.querySelectorAll('.chart-control-btn');
  chartControlBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // 移除其他按钮的active类
      chartControlBtns.forEach(b => b.classList.remove('active'));
      // 添加当前按钮的active类
      this.classList.add('active');
      
      const period = this.getAttribute('data-period');
      updateChartData(period);
    });
  });
}

/**
 * 编辑设备
 */
function editDevice() {
  showMessage('编辑设备功能开发中...', 'info');
}

/**
 * 切换远程控制
 */
function toggleRemoteControl() {
  showMessage('远程控制功能开发中...', 'info');
}

/**
 * 切换设备状态
 */
function toggleDeviceStatus() {
  if (!deviceData) return;

  const newStatus = deviceData.status === 'online' ? 'offline' : 'online';
  const newStatusText = newStatus === 'online' ? '在线' : '离线';
  
  if (confirm(`确定要${newStatusText === '在线' ? '启用' : '禁用'}这个设备吗？`)) {
    deviceData.status = newStatus;
    deviceData.statusText = newStatusText;
    
    // 更新显示
    const deviceStatus = document.getElementById('deviceStatus');
    deviceStatus.className = `device-status ${newStatus}`;
    deviceStatus.innerHTML = `
      <span class="status-dot ${newStatus}"></span>
      <span class="status-text">${newStatusText}</span>
    `;
    
    showMessage(`设备已${newStatusText === '在线' ? '启用' : '禁用'}`, 'success');
  }
}

/**
 * 更新图表数据
 */
function updateChartData(period) {
  if (!dataChart) return;

  let dataCount = 24;
  let timeUnit = 'hour';
  
  switch (period) {
    case '7d':
      dataCount = 7;
      timeUnit = 'day';
      break;
    case '30d':
      dataCount = 30;
      timeUnit = 'day';
      break;
    default:
      dataCount = 24;
      timeUnit = 'hour';
  }

  const option = {
    xAxis: {
      data: generateTimeLabels(dataCount, timeUnit)
    },
    series: [
      {
        data: generateRandomData(dataCount, 20, 30)
      },
      {
        data: generateRandomData(dataCount, 40, 80)
      },
      {
        data: generateRandomData(dataCount, 0, 100)
      }
    ]
  };

  dataChart.setOption(option);
}

/**
 * 执行远程命令
 */
function executeCommand(command) {
  const commandNames = {
    reboot: '重启设备',
    reset: '重置配置',
    calibrate: '校准传感器',
    update: '固件升级'
  };

  const commandName = commandNames[command] || command;
  
  if (confirm(`确定要执行"${commandName}"操作吗？`)) {
    // 模拟命令执行
    showMessage(`正在执行${commandName}...`, 'info');
    
    setTimeout(() => {
      showMessage(`${commandName}执行成功`, 'success');
    }, 2000);
  }
}

/**
 * 启动实时数据更新
 */
function startRealTimeUpdate() {
  // 每30秒更新一次实时数据
  refreshInterval = setInterval(() => {
    updateRealTimeData();
  }, 30000);
}

/**
 * 更新实时数据
 */
function updateRealTimeData() {
  if (!deviceData) return;

  // 模拟数据变化
  const signalStrength = Math.floor(Math.random() * 20) + 75; // 75-95%
  const batteryLevel = deviceData.batteryLevel ? Math.floor(Math.random() * 10) + 70 : null; // 70-80%
  const deviceTemperature = Math.floor(Math.random() * 10) + 20; // 20-30°C

  // 更新显示
  document.getElementById('signalStrength').textContent = signalStrength + '%';
  if (deviceData.batteryLevel) {
    document.getElementById('batteryLevel').textContent = batteryLevel + '%';
  }
  document.getElementById('deviceTemperature').textContent = deviceTemperature + '°C';
  document.getElementById('lastUpdate').textContent = new Date().toLocaleString();
}

/**
 * 停止实时数据更新
 */
function stopRealTimeUpdate() {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
}

/**
 * 显示消息提示
 */
function showMessage(text, type = 'info') {
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
      if (document.body.contains(message)) {
        document.body.removeChild(message);
      }
    }, 300);
  }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// 页面卸载时清理定时器
window.addEventListener('beforeunload', function() {
  stopRealTimeUpdate();
});