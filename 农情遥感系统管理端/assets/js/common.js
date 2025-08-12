/**
 * 农情遥感系统管理端公共JavaScript文件
 */

// 消息提示工具
const Message = {
  show(text, type = 'info') {
    console.log(`${type}: ${text}`);
    // 在真实项目中，这里可以集成Toast组件
  },
  success(text) { this.show(text, 'success'); },
  error(text) { this.show(text, 'error'); },
  info(text) { this.show(text, 'info'); },
  warning(text) { this.show(text, 'warning'); }
};

// 本地存储工具
const Storage = {
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('无法保存到本地存储:', e);
      return false;
    }
  },
  
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (e) {
      console.warn('无法从本地存储读取:', e);
      return defaultValue;
    }
  },
  
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.warn('无法从本地存储删除:', e);
      return false;
    }
  }
};

/**
 * 初始化侧边栏功能（通用函数）
 */
function initSidebar() {
  const sidebar = document.querySelector('.admin-sidebar');
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const mobileToggleBtn = document.querySelector('.mobile-menu-toggle');
  
  // 桌面端侧边栏折叠功能
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('collapsed');
      
      // 保存状态到本地存储
      const isCollapsed = sidebar.classList.contains('collapsed');
      Storage.set('sidebar_collapsed', isCollapsed);
      
      // 触发自定义事件，让其他模块知道侧边栏状态变化
      document.dispatchEvent(new CustomEvent('sidebarToggle', {
        detail: { collapsed: isCollapsed }
      }));
    });
    
    // 恢复侧边栏状态
    const isCollapsed = Storage.get('sidebar_collapsed', false);
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    }
    
    // 鼠标悬浮侧边栏时的提示效果（仅在折叠状态）
    sidebar.addEventListener('mouseenter', function() {
      if (sidebar.classList.contains('collapsed')) {
        toggleBtn.style.opacity = '1';
      }
    });
    
    sidebar.addEventListener('mouseleave', function() {
      if (sidebar.classList.contains('collapsed')) {
        toggleBtn.style.opacity = '0.7';
      }
    });
  }
  
  // 移动端侧边栏切换功能
  if (mobileToggleBtn && sidebar) {
    mobileToggleBtn.addEventListener('click', function() {
      sidebar.classList.toggle('open');
      
      // 切换图标
      const icon = mobileToggleBtn.querySelector('i');
      if (sidebar.classList.contains('open')) {
        icon.className = 'fas fa-times';
      } else {
        icon.className = 'fas fa-bars';
      }
    });
    
    // 点击遮罩层关闭侧边栏
    document.addEventListener('click', function(e) {
      if (sidebar.classList.contains('open') && 
          !sidebar.contains(e.target) && 
          !mobileToggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
        const icon = mobileToggleBtn.querySelector('i');
        icon.className = 'fas fa-bars';
      }
    });
    
    // 窗口大小改变时重置移动端菜单状态
    window.addEventListener('resize', function() {
      if (window.innerWidth > 1024 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        const icon = mobileToggleBtn.querySelector('i');
        icon.className = 'fas fa-bars';
      }
    });
  }
}

/**
 * 更新最后更新时间
 */
function updateLastUpdateTime() {
  const now = new Date();
  const timeString = now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const timeElement = document.getElementById('lastUpdateTime');
  if (timeElement) {
    timeElement.textContent = timeString;
  }
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
 * 格式化数字（添加千分位分隔符）
 */
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 将工具函数添加到全局对象
window.Message = Message;
window.Storage = Storage;
window.initSidebar = initSidebar;
window.updateLastUpdateTime = updateLastUpdateTime;
window.formatFileSize = formatFileSize;
window.formatNumber = formatNumber;
window.debounce = debounce;
window.throttle = throttle;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  // 自动初始化侧边栏（如果存在）
  if (document.querySelector('.admin-sidebar')) {
    initSidebar();
  }
  
  // 自动更新时间（如果存在）
  if (document.getElementById('lastUpdateTime')) {
    updateLastUpdateTime();
    // 每30秒更新一次时间
    setInterval(updateLastUpdateTime, 30000);
  }
  
  // 初始化模态框功能
  initModalHandlers();
});

/**
 * 初始化模态框处理函数
 */
function initModalHandlers() {
  // ESC键关闭模态框
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.modal.active');
      if (activeModal) {
        activeModal.classList.remove('active');
        document.body.classList.remove('modal-open');
      }
    }
  });
  
  // 模态框背景点击关闭
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal') && e.target.classList.contains('active')) {
      e.target.classList.remove('active');
      document.body.classList.remove('modal-open');
    }
  });
  
  // 防止模态框内容区域的点击冒泡到背景层
  document.addEventListener('click', function(e) {
    if (e.target.closest('.modal-content')) {
      e.stopPropagation();
    }
  });
}
