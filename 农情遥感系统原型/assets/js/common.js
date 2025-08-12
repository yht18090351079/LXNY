/**
 * 农情遥感系统Web应用端 - 公共JS功能
 */

// DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 初始化侧边栏折叠功能
  initSideMenu();
  
  // 初始化右侧数据面板折叠功能
  initDataPanel();
  
  // 初始化响应式菜单
  initResponsiveMenu();
});

/**
 * 初始化侧边栏折叠功能
 */
function initSideMenu() {
  const toggleBtn = document.querySelector('.side-menu-toggle');
  const sideMenu = document.querySelector('.side-menu');
  
  if (toggleBtn && sideMenu) {
    toggleBtn.addEventListener('click', function() {
      sideMenu.classList.toggle('collapsed');
      
      // 更新图标方向
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (sideMenu.classList.contains('collapsed')) {
          icon.classList.replace('icon-arrow-left', 'icon-arrow-right');
        } else {
          icon.classList.replace('icon-arrow-right', 'icon-arrow-left');
        }
      }
    });
  }
}

/**
 * 初始化右侧数据面板折叠功能
 */
function initDataPanel() {
  const toggleBtn = document.querySelector('.data-panel-toggle');
  const dataPanel = document.querySelector('.data-panel');
  
  if (toggleBtn && dataPanel) {
    toggleBtn.addEventListener('click', function() {
      dataPanel.classList.toggle('collapsed');
      
      // 更新图标方向
      const icon = toggleBtn.querySelector('i');
      if (icon) {
        if (dataPanel.classList.contains('collapsed')) {
          icon.classList.replace('icon-arrow-right', 'icon-arrow-left');
        } else {
          icon.classList.replace('icon-arrow-left', 'icon-arrow-right');
        }
      }
    });
  }
}

/**
 * 初始化响应式菜单
 */
function initResponsiveMenu() {
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const sideMenu = document.querySelector('.side-menu');
  
  if (mobileToggle && sideMenu) {
    mobileToggle.addEventListener('click', function() {
      sideMenu.classList.toggle('open');
    });
  }
  
  // 点击页面其他地方关闭移动菜单
  document.addEventListener('click', function(e) {
    if (sideMenu && !sideMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
      if (sideMenu.classList.contains('open')) {
        sideMenu.classList.remove('open');
      }
    }
  });
}

/**
 * 标签页切换功能
 * @param {string} container - 标签页容器选择器
 */
function initTabs(container) {
  const tabContainer = document.querySelector(container);
  if (!tabContainer) return;
  
  const tabs = tabContainer.querySelectorAll('.tab-item');
  const contents = tabContainer.querySelectorAll('.tab-content-item');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 移除所有活动状态
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));
      
      // 添加当前活动状态
      tab.classList.add('active');
      const target = tab.getAttribute('data-target');
      const content = tabContainer.querySelector(`.tab-content-item[data-id="${target}"]`);
      if (content) {
        content.classList.add('active');
      }
    });
  });
}

/**
 * 显示加载状态
 * @param {string} container - 容器选择器
 * @param {boolean} show - 是否显示
 */
function showLoading(container, show = true) {
  const el = document.querySelector(container);
  if (!el) return;
  
  if (show) {
    const loading = document.createElement('div');
    loading.className = 'loading';
    loading.innerHTML = '<div class="loading-spinner"></div>';
    el.appendChild(loading);
  } else {
    const loading = el.querySelector('.loading');
    if (loading) {
      loading.remove();
    }
  }
}

/**
 * 格式化数字（添加千分位）
 * @param {number} num - 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * 将日期格式化为YYYY-MM-DD
 * @param {Date} date - 日期对象
 * @returns {string} 格式化后的日期字符串
 */
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 显示消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success/warning/error/info)
 * @param {number} duration - 显示时长(ms)
 */
function showMessage(message, type = 'info', duration = 3000) {
  // 创建消息元素
  const msgEl = document.createElement('div');
  msgEl.className = `message message-${type}`;
  msgEl.innerHTML = message;
  
  // 添加到页面
  const container = document.querySelector('.message-container') || document.body;
  container.appendChild(msgEl);
  
  // 显示动画
  setTimeout(() => {
    msgEl.classList.add('show');
  }, 10);
  
  // 设置自动消失
  setTimeout(() => {
    msgEl.classList.remove('show');
    setTimeout(() => {
      msgEl.remove();
    }, 300); // 消失动画时长
  }, duration);
}

// 菜单折叠/展开功能
document.addEventListener('DOMContentLoaded', function() {
  // 侧边菜单折叠/展开
  const sideMenuToggle = document.querySelector('.side-menu-toggle');
  const sideMenu = document.querySelector('.side-menu');
  
  if (sideMenuToggle && sideMenu) {
    sideMenuToggle.addEventListener('click', function() {
      sideMenu.classList.toggle('collapsed');
    });
  }
  
  // 数据面板折叠/展开
  const dataPanelToggle = document.querySelector('.data-panel-toggle');
  const dataPanel = document.querySelector('.data-panel');
  
  if (dataPanelToggle && dataPanel) {
    dataPanelToggle.addEventListener('click', function() {
      dataPanel.classList.toggle('collapsed');
    });
  }
  
  // 移动端菜单按钮
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  
  if (mobileNavToggle && sideMenu) {
    mobileNavToggle.addEventListener('click', function() {
      sideMenu.classList.toggle('open');
    });
  }
}); 