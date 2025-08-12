/**
 * 遥感数据导入页面功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化导入流程
  initImportProcess();
  
  // 初始化文件上传
  initFileUpload();
  
  // 初始化表单验证
  initFormValidation();
});

// 全局变量
let currentStep = 1;
let selectedMethod = '';
let uploadedFiles = [];
let importConfig = {};



/**
 * 初始化导入流程
 */
function initImportProcess() {
  // 导入方式选择
  const methodCards = document.querySelectorAll('.method-card');
  methodCards.forEach(card => {
    card.addEventListener('click', function() {
      // 移除其他选中状态
      methodCards.forEach(c => c.classList.remove('selected'));
      // 添加当前选中状态
      this.classList.add('selected');
      selectedMethod = this.dataset.method;
      
      // 更新下一步按钮状态
      updateNextButton();
    });
  });
  
  // 认证方式变化
  const authTypeSelect = document.getElementById('authType');
  if (authTypeSelect) {
    authTypeSelect.addEventListener('change', function() {
      const authDetails = document.getElementById('authDetails');
      if (this.value === 'none') {
        authDetails.style.display = 'none';
      } else {
        authDetails.style.display = 'block';
      }
    });
  }
}

/**
 * 初始化文件上传
 */
function initFileUpload() {
  const uploadArea = document.getElementById('uploadArea');
  const fileInput = document.getElementById('fileInput');
  
  // 拖拽上传
  if (uploadArea) {
    uploadArea.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('dragover');
      
      const files = Array.from(e.dataTransfer.files);
      handleFiles(files);
    });
    
    uploadArea.addEventListener('click', function() {
      fileInput.click();
    });
  }
  
  // 文件选择
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      const files = Array.from(this.files);
      handleFiles(files);
    });
  }
}

/**
 * 处理文件
 */
function handleFiles(files) {
  files.forEach(file => {
    const fileId = Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const fileObj = {
      id: fileId,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: 'pending' // pending, uploading, completed, error
    };
    
    uploadedFiles.push(fileObj);
    addFileToList(fileObj);
  });
  
  updateNextButton();
}

/**
 * 添加文件到列表
 */
function addFileToList(fileObj) {
  const fileList = document.getElementById('fileList');
  if (!fileList) return;
  
  const fileItem = document.createElement('div');
  fileItem.className = 'file-item';
  fileItem.dataset.fileId = fileObj.id;
  
  fileItem.innerHTML = `
    <div class="file-icon">
      <i class="fas fa-file"></i>
    </div>
    <div class="file-info">
      <div class="file-name">${fileObj.name}</div>
      <div class="file-meta">${formatFileSize(fileObj.size)} • ${getFileType(fileObj.name)}</div>
    </div>
    <div class="file-progress">
      <div class="progress-bar-small">
        <div class="progress-fill-small" style="width: ${fileObj.progress}%"></div>
      </div>
      <div class="progress-text-small">${fileObj.progress}%</div>
    </div>
    <div class="file-actions">
      <button class="file-action-btn" onclick="previewFile('${fileObj.id}')" title="预览">
        <i class="fas fa-eye"></i>
      </button>
      <button class="file-action-btn remove" onclick="removeFile('${fileObj.id}')" title="删除">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;
  
  fileList.appendChild(fileItem);
}

/**
 * 格式化文件大小
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * 获取文件类型
 */
function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  const types = {
    'tiff': 'TIFF影像',
    'tif': 'TIFF影像',
    'hdf': 'HDF数据',
    'nc': 'NetCDF数据',
    'jpg': 'JPEG影像',
    'jpeg': 'JPEG影像',
    'png': 'PNG影像',
    'zip': '压缩文件',
    'rar': '压缩文件'
  };
  return types[ext] || '未知格式';
}

/**
 * 删除文件
 */
function removeFile(fileId) {
  // 从数组中移除
  uploadedFiles = uploadedFiles.filter(file => file.id !== fileId);
  
  // 从DOM中移除
  const fileItem = document.querySelector(`[data-file-id="${fileId}"]`);
  if (fileItem) {
    fileItem.remove();
  }
  
  updateNextButton();
}

/**
 * 预览文件
 */
function previewFile(fileId) {
  const fileObj = uploadedFiles.find(file => file.id === fileId);
  if (!fileObj) return;
  
  alert(`预览文件：${fileObj.name}\n大小：${formatFileSize(fileObj.size)}\n类型：${getFileType(fileObj.name)}`);
}

/**
 * 选择文件
 */
function selectFiles() {
  document.getElementById('fileInput').click();
}

/**
 * 初始化表单验证
 */
function initFormValidation() {
  const form = document.getElementById('dataConfigForm');
  if (!form) return;
  
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
    field.addEventListener('blur', validateField);
    field.addEventListener('input', validateField);
  });
}

/**
 * 验证字段
 */
function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  
  // 移除之前的错误状态
  field.classList.remove('error');
  
  // 检查必填字段
  if (field.hasAttribute('required') && !value) {
    field.classList.add('error');
    return false;
  }
  
  return true;
}

/**
 * 验证当前步骤
 */
function validateCurrentStep() {
  switch (currentStep) {
    case 1:
      return selectedMethod !== '';
    case 2:
      return validateDataConfig();
    case 3:
      return validateFileUpload();
    case 4:
      return true;
    default:
      return false;
  }
}

/**
 * 验证数据配置
 */
function validateDataConfig() {
  const form = document.getElementById('dataConfigForm');
  if (!form) return false;
  
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('error');
      isValid = false;
    } else {
      field.classList.remove('error');
    }
  });
  
  return isValid;
}

/**
 * 验证文件上传
 */
function validateFileUpload() {
  if (selectedMethod === 'upload') {
    return uploadedFiles.length > 0;
  } else if (selectedMethod === 'url') {
    const dataUrl = document.getElementById('dataUrl')?.value;
    return dataUrl && dataUrl.trim() !== '';
  } else if (selectedMethod === 'api') {
    const apiProvider = document.getElementById('apiProvider')?.value;
    const apiKey = document.getElementById('apiKey')?.value;
    return apiProvider && apiKey;
  }
  return false;
}

/**
 * 更新下一步按钮状态
 */
function updateNextButton() {
  const nextBtn = document.getElementById('nextBtn');
  const prevBtn = document.getElementById('prevBtn');
  
  if (nextBtn) {
    const isValid = validateCurrentStep();
    nextBtn.disabled = !isValid;
    
    if (currentStep === 4) {
      nextBtn.innerHTML = '<i class="fas fa-upload"></i> 开始导入';
    } else {
      nextBtn.innerHTML = '下一步 <i class="fas fa-chevron-right"></i>';
    }
  }
  
  if (prevBtn) {
    prevBtn.disabled = currentStep === 1;
  }
}

/**
 * 下一步
 */
function nextStep() {
  if (!validateCurrentStep()) {
    alert('请完成当前步骤的必填项');
    return;
  }
  
  if (currentStep === 4) {
    startImport();
    return;
  }
  
  if (currentStep < 4) {
    // 保存当前步骤的数据
    saveStepData();
    
    currentStep++;
    updateStepDisplay();
    updateStepContent();
    updateNextButton();
  }
}

/**
 * 上一步
 */
function prevStep() {
  if (currentStep > 1) {
    currentStep--;
    updateStepDisplay();
    updateStepContent();
    updateNextButton();
  }
}

/**
 * 更新步骤显示
 */
function updateStepDisplay() {
  // 更新步骤指示器
  const steps = document.querySelectorAll('.step');
  steps.forEach((step, index) => {
    const stepNumber = index + 1;
    step.classList.remove('active', 'completed');
    
    if (stepNumber === currentStep) {
      step.classList.add('active');
    } else if (stepNumber < currentStep) {
      step.classList.add('completed');
      
      // 更改已完成步骤的数字为勾选图标
      const stepNumberEl = step.querySelector('.step-number');
      stepNumberEl.innerHTML = '<i class="fas fa-check"></i>';
    } else {
      // 恢复未来步骤的数字
      const stepNumberEl = step.querySelector('.step-number');
      stepNumberEl.textContent = stepNumber;
    }
  });
}

/**
 * 更新步骤内容
 */
function updateStepContent() {
  // 隐藏所有步骤内容
  const importSteps = document.querySelectorAll('.import-step');
  importSteps.forEach(step => step.classList.remove('active'));
  
  // 显示当前步骤内容
  const currentStepEl = document.getElementById(`step${currentStep}`);
  if (currentStepEl) {
    currentStepEl.classList.add('active');
  }
  
  // 根据选择的方法显示相应的上传界面
  if (currentStep === 3) {
    showUploadMethod();
  }
  
  // 如果是确认步骤，生成摘要
  if (currentStep === 4) {
    generateConfirmationSummary();
  }
}

/**
 * 显示上传方法界面
 */
function showUploadMethod() {
  const uploadMethod = document.getElementById('uploadMethod');
  const urlMethod = document.getElementById('urlMethod');
  const apiMethod = document.getElementById('apiMethod');
  
  // 隐藏所有方法
  uploadMethod.style.display = 'none';
  urlMethod.style.display = 'none';
  apiMethod.style.display = 'none';
  
  // 显示选中的方法
  switch (selectedMethod) {
    case 'upload':
      uploadMethod.style.display = 'block';
      break;
    case 'url':
      urlMethod.style.display = 'block';
      break;
    case 'api':
      apiMethod.style.display = 'block';
      break;
  }
}

/**
 * 保存步骤数据
 */
function saveStepData() {
  switch (currentStep) {
    case 1:
      importConfig.method = selectedMethod;
      break;
    case 2:
      saveDataConfig();
      break;
    case 3:
      saveFileData();
      break;
  }
}

/**
 * 保存数据配置
 */
function saveDataConfig() {
  const form = document.getElementById('dataConfigForm');
  if (!form) return;
  
  const formData = new FormData(form);
  importConfig.dataInfo = {
    name: document.getElementById('dataName')?.value || '',
    type: document.getElementById('dataType')?.value || '',
    satellite: document.getElementById('satellite')?.value || '',
    resolution: document.getElementById('resolution')?.value || '',
    collectDate: document.getElementById('collectDate')?.value || '',
    cloudCover: document.getElementById('cloudCover')?.value || '',
    bounds: {
      north: document.getElementById('northBound')?.value || '',
      south: document.getElementById('southBound')?.value || '',
      east: document.getElementById('eastBound')?.value || '',
      west: document.getElementById('westBound')?.value || ''
    },
    description: document.getElementById('description')?.value || '',
    tags: document.getElementById('tags')?.value || ''
  };
}

/**
 * 保存文件数据
 */
function saveFileData() {
  if (selectedMethod === 'upload') {
    importConfig.files = uploadedFiles;
  } else if (selectedMethod === 'url') {
    importConfig.url = {
      dataUrl: document.getElementById('dataUrl')?.value || '',
      authType: document.getElementById('authType')?.value || 'none',
      username: document.getElementById('username')?.value || '',
      password: document.getElementById('password')?.value || ''
    };
  } else if (selectedMethod === 'api') {
    importConfig.api = {
      provider: document.getElementById('apiProvider')?.value || '',
      apiKey: document.getElementById('apiKey')?.value || '',
      searchParams: document.getElementById('searchParams')?.value || ''
    };
  }
}

/**
 * 生成确认摘要
 */
function generateConfirmationSummary() {
  const dataSummary = document.getElementById('dataSummary');
  const fileSummary = document.getElementById('fileSummary');
  
  if (dataSummary && importConfig.dataInfo) {
    const data = importConfig.dataInfo;
    dataSummary.innerHTML = `
      <div class="summary-item">
        <div class="summary-label">数据名称</div>
        <div class="summary-value">${data.name || '-'}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">数据类型</div>
        <div class="summary-value">${getDataTypeName(data.type)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">卫星来源</div>
        <div class="summary-value">${getSatelliteName(data.satellite)}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">空间分辨率</div>
        <div class="summary-value">${data.resolution || '-'}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">采集时间</div>
        <div class="summary-value">${data.collectDate || '-'}</div>
      </div>
      <div class="summary-item">
        <div class="summary-label">云覆盖率</div>
        <div class="summary-value">${data.cloudCover ? data.cloudCover + '%' : '-'}</div>
      </div>
    `;
  }
  
  if (fileSummary) {
    let summaryHTML = '';
    
    if (selectedMethod === 'upload' && uploadedFiles.length > 0) {
      const totalSize = uploadedFiles.reduce((sum, file) => sum + file.size, 0);
      summaryHTML = `
        <div class="summary-item">
          <div class="summary-label">文件数量</div>
          <div class="summary-value">${uploadedFiles.length} 个</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">总大小</div>
          <div class="summary-value">${formatFileSize(totalSize)}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">文件列表</div>
          <div class="summary-value">
            ${uploadedFiles.map(file => file.name).join('<br>')}
          </div>
        </div>
      `;
    } else if (selectedMethod === 'url' && importConfig.url) {
      summaryHTML = `
        <div class="summary-item">
          <div class="summary-label">数据来源</div>
          <div class="summary-value">网络地址</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">URL地址</div>
          <div class="summary-value">${importConfig.url.dataUrl}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">认证方式</div>
          <div class="summary-value">${getAuthTypeName(importConfig.url.authType)}</div>
        </div>
      `;
    } else if (selectedMethod === 'api' && importConfig.api) {
      summaryHTML = `
        <div class="summary-item">
          <div class="summary-label">数据来源</div>
          <div class="summary-value">API接口</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">API提供商</div>
          <div class="summary-value">${getApiProviderName(importConfig.api.provider)}</div>
        </div>
        <div class="summary-item">
          <div class="summary-label">搜索参数</div>
          <div class="summary-value">${importConfig.api.searchParams || '-'}</div>
        </div>
      `;
    }
    
    fileSummary.innerHTML = summaryHTML;
  }
}

/**
 * 获取数据类型名称
 */
function getDataTypeName(type) {
  const types = {
    'optical': '光学影像',
    'radar': '雷达数据',
    'hyperspectral': '高光谱',
    'thermal': '热红外',
    'lidar': '激光雷达'
  };
  return types[type] || '-';
}

/**
 * 获取卫星名称
 */
function getSatelliteName(satellite) {
  const satellites = {
    'landsat': 'Landsat系列',
    'sentinel': 'Sentinel系列',
    'modis': 'MODIS',
    'gf': '高分系列',
    'worldview': 'WorldView',
    'quickbird': 'QuickBird',
    'other': '其他'
  };
  return satellites[satellite] || '-';
}

/**
 * 获取认证方式名称
 */
function getAuthTypeName(authType) {
  const types = {
    'none': '无需认证',
    'basic': '基础认证',
    'token': 'Token认证'
  };
  return types[authType] || '-';
}

/**
 * 获取API提供商名称
 */
function getApiProviderName(provider) {
  const providers = {
    'earthdata': 'NASA Earthdata',
    'copernicus': 'Copernicus Open Access Hub',
    'gee': 'Google Earth Engine',
    'planet': 'Planet Labs',
    'custom': '自定义API'
  };
  return providers[provider] || '-';
}

/**
 * 开始导入
 */
function startImport() {
  // 显示导入进度
  const progressContainer = document.getElementById('importProgress');
  const stepNavigation = document.querySelector('.step-navigation');
  
  progressContainer.style.display = 'block';
  stepNavigation.style.display = 'none';
  
  // 模拟导入过程
  simulateImportProcess();
}

/**
 * 模拟导入过程
 */
function simulateImportProcess() {
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');
  const progressStatus = document.getElementById('progressStatus');
  const progressDetails = document.getElementById('progressDetails');
  
  const steps = [
    { progress: 10, status: '验证文件格式...', details: '正在检查文件格式和完整性' },
    { progress: 25, status: '上传文件...', details: '正在上传数据文件到服务器' },
    { progress: 40, status: '解析元数据...', details: '正在提取和解析数据元信息' },
    { progress: 60, status: '数据预处理...', details: '正在进行数据格式转换和优化' },
    { progress: 80, status: '生成预览...', details: '正在生成数据预览和缩略图' },
    { progress: 95, status: '更新数据库...', details: '正在将数据信息写入数据库' },
    { progress: 100, status: '导入完成', details: '数据导入成功完成' }
  ];
  
  let currentStepIndex = 0;
  
  function updateProgress() {
    const step = steps[currentStepIndex];
    
    progressFill.style.width = step.progress + '%';
    progressText.textContent = step.progress + '%';
    progressStatus.textContent = step.status;
    progressDetails.textContent = step.details;
    
    currentStepIndex++;
    
    if (currentStepIndex < steps.length) {
      setTimeout(updateProgress, 1000 + Math.random() * 1000);
    } else {
      // 导入完成
      setTimeout(() => {
        alert('数据导入完成！');
        goBack();
      }, 1000);
    }
  }
  
  updateProgress();
}

/**
 * 验证URL
 */
function validateUrl() {
  const dataUrl = document.getElementById('dataUrl')?.value;
  if (!dataUrl) {
    alert('请输入URL地址');
    return;
  }
  
  // 模拟URL验证
  alert('URL验证成功！文件大小：2.3GB');
  updateNextButton();
}

/**
 * 搜索API数据
 */
function searchApiData() {
  const apiProvider = document.getElementById('apiProvider')?.value;
  const apiKey = document.getElementById('apiKey')?.value;
  
  if (!apiProvider || !apiKey) {
    alert('请选择API提供商并输入API密钥');
    return;
  }
  
  // 模拟API搜索
  alert('找到 5 条匹配的数据记录');
  
  const apiResults = document.getElementById('apiResults');
  apiResults.style.display = 'block';
  apiResults.innerHTML = `
    <div style="padding: 16px;">
      <h5>搜索结果</h5>
      <p>找到 5 条符合条件的数据记录，请选择要导入的数据。</p>
      <div style="margin-top: 12px;">
        <button class="btn btn-primary">选择全部</button>
      </div>
    </div>
  `;
  
  updateNextButton();
}

/**
 * 返回列表
 */
function goBack() {
  window.location.href = 'list.html';
}

/**
 * 查看导入历史
 */
function viewImportHistory() {
  const modal = document.getElementById('historyModal');
  const tableBody = document.getElementById('historyTableBody');
  
  // 模拟历史数据
  const historyData = [
    {
      time: '2024-12-15 14:30:25',
      name: 'Landsat-8_北京地区_202412',
      fileCount: 3,
      size: '2.3GB',
      status: 'completed'
    },
    {
      time: '2024-12-14 10:15:30',
      name: 'Sentinel-2_上海地区_202412',
      fileCount: 1,
      size: '1.8GB',
      status: 'completed'
    },
    {
      time: '2024-12-13 16:45:12',
      name: 'MODIS_华北平原_202412',
      fileCount: 2,
      size: '580MB',
      status: 'failed'
    }
  ];
  
  tableBody.innerHTML = historyData.map(item => `
    <tr>
      <td>${item.time}</td>
      <td>${item.name}</td>
      <td>${item.fileCount}</td>
      <td>${item.size}</td>
      <td>
        <span class="status-tag ${item.status}">
          ${getStatusName(item.status)}
        </span>
      </td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="viewImportDetail('${item.name}')">
          查看详情
        </button>
      </td>
    </tr>
  `).join('');
  
  modal.classList.add('active');
}

/**
 * 获取状态名称
 */
function getStatusName(status) {
  const statusNames = {
    'completed': '已完成',
    'failed': '失败',
    'processing': '处理中'
  };
  return statusNames[status] || '未知';
}

/**
 * 查看导入详情
 */
function viewImportDetail(name) {
  alert(`查看导入详情：${name}`);
}

/**
 * 关闭历史模态框
 */
function closeHistoryModal() {
  const modal = document.getElementById('historyModal');
  modal.classList.remove('active');
}



// 初始化页面状态
document.addEventListener('DOMContentLoaded', function() {
  updateStepDisplay();
  updateNextButton();
});

// 模态框点击外部关闭
document.addEventListener('click', function(e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
});