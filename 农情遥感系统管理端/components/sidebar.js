/**
 * 侧边栏组件
 * 动态加载侧边栏并设置正确的导航链接和活动状态
 */

class Sidebar {
  constructor() {
    this.currentPage = this.detectCurrentPage();
    this.basePath = this.calculateBasePath();
  }

  /**
   * 检测当前页面类型
   */
  detectCurrentPage() {
    const path = window.location.pathname;
    
    // 更精确的页面检测
    if (path.includes('/dashboard/')) return 'dashboard';
    if (path.includes('/data-overview/')) return 'data-overview';
    if (path.includes('/remote-sensing/')) return 'remote-sensing';
    if (path.includes('/farmland/')) return 'farmland';
    if (path.includes('/device-management/')) return 'device-management';
    if (path.includes('/users/')) return 'users';
    if (path.includes('/roles/')) return 'roles';
    if (path.includes('/system-config/')) return 'system-config';
    if (path.includes('/system-logs/')) return 'system-logs';
    
    // 根据URL判断页面类型
    const urlParts = path.split('/');
    for (let i = 0; i < urlParts.length; i++) {
      if (urlParts[i] === 'dashboard') return 'dashboard';
      if (urlParts[i] === 'data-overview') return 'data-overview';
      if (urlParts[i] === 'remote-sensing') return 'remote-sensing';
      if (urlParts[i] === 'farmland') return 'farmland';
      if (urlParts[i] === 'device-management') return 'device-management';
    }
    
    return 'dashboard'; // 默认
  }

  /**
   * 计算基础路径（相对于当前页面到项目根目录）
   */
  calculateBasePath() {
    const path = window.location.pathname;
    
    // 根据当前页面深度计算到项目根目录的相对路径
    if (path.includes('/pages/dashboard/')) return '../../';
    if (path.includes('/pages/data-management/data-overview/')) return '../../../';
    if (path.includes('/pages/data-management/remote-sensing/')) return '../../../';
    if (path.includes('/pages/data-management/farmland/')) return '../../../';
    if (path.includes('/pages/device-management/')) return '../../../';
    if (path.includes('/components/')) return '../'; // 组件目录下的测试页面
    
    return '../../'; // 默认
  }

  /**
   * 获取页面路径映射
   */
  getPagePaths() {
    return {
      'dashboard': `${this.basePath}pages/dashboard/dashboard.html`,
      'data-overview': `${this.basePath}pages/data-management/data-overview/data-overview.html`,
      'remote-sensing': `${this.basePath}pages/data-management/remote-sensing/list.html`,
      'farmland': `${this.basePath}pages/data-management/farmland/list.html`,
      'device-management': `${this.basePath}pages/device-management/monitor/monitor.html`,
      'users': '#',
      'roles': '#',
      'system-config': '#',
      'system-logs': '#'
    };
  }

  /**
   * 生成侧边栏HTML
   */
  generateSidebarHTML() {
    return `
      <div class="sidebar-content">
        <nav class="sidebar-nav">
          <div class="nav-group">
            <div class="nav-group-title">主要功能</div>
            <div class="nav-item" data-page="dashboard">
              <a href="#" class="nav-link" data-title="仪表盘">
                <i class="nav-icon fas fa-tachometer-alt"></i>
                <span class="nav-text">仪表盘</span>
              </a>
            </div>
          </div>
          
          <div class="nav-group">
            <div class="nav-group-title">数据管理</div>
            <div class="nav-item" data-page="data-overview">
              <a href="#" class="nav-link" data-title="数据概览">
                <i class="nav-icon fas fa-chart-bar"></i>
                <span class="nav-text">数据概览</span>
              </a>
            </div>
            <div class="nav-item" data-page="remote-sensing">
              <a href="#" class="nav-link" data-title="遥感数据">
                <i class="nav-icon fas fa-satellite"></i>
                <span class="nav-text">遥感数据</span>
              </a>
            </div>
            <div class="nav-item" data-page="farmland">
              <a href="#" class="nav-link" data-title="农田数据">
                <i class="nav-icon fas fa-seedling"></i>
                <span class="nav-text">农田数据</span>
              </a>
            </div>
          </div>
          
          <div class="nav-group">
            <div class="nav-group-title">设备管理</div>
            <div class="nav-item" data-page="device-management">
              <a href="#" class="nav-link" data-title="设备管理">
                <i class="nav-icon fas fa-desktop"></i>
                <span class="nav-text">设备管理</span>
              </a>
            </div>
          </div>
          
          <div class="nav-group">
            <div class="nav-group-title">用户管理</div>
            <div class="nav-item" data-page="users">
              <a href="#" class="nav-link" data-title="用户列表">
                <i class="nav-icon fas fa-users"></i>
                <span class="nav-text">用户列表</span>
              </a>
            </div>
            <div class="nav-item" data-page="roles">
              <a href="#" class="nav-link" data-title="角色权限">
                <i class="nav-icon fas fa-user-shield"></i>
                <span class="nav-text">角色权限</span>
              </a>
            </div>
          </div>
          
          <div class="nav-group">
            <div class="nav-group-title">系统设置</div>
            <div class="nav-item" data-page="system-config">
              <a href="#" class="nav-link" data-title="系统配置">
                <i class="nav-icon fas fa-cogs"></i>
                <span class="nav-text">系统配置</span>
              </a>
            </div>
            <div class="nav-item" data-page="system-logs">
              <a href="#" class="nav-link" data-title="系统日志">
                <i class="nav-icon fas fa-file-alt"></i>
                <span class="nav-text">系统日志</span>
              </a>
            </div>
          </div>
        </nav>
      </div>
    `;
  }

  /**
   * 设置导航链接
   */
  setupNavigation(sidebarElement) {
    const pagePaths = this.getPagePaths();
    const navItems = sidebarElement.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
      const page = item.getAttribute('data-page');
      const link = item.querySelector('.nav-link');
      
      if (page && pagePaths[page] && link) {
        link.href = pagePaths[page];
        
        // 设置当前页面的活动状态
        if (page === this.currentPage) {
          item.classList.add('active');
        }
      }
    });
  }

  /**
   * 渲染侧边栏到指定容器
   */
  render(containerId = 'sidebar-container') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Sidebar container with id "${containerId}" not found`);
      return;
    }

    const sidebarHtml = this.generateSidebarHTML();
    container.innerHTML = sidebarHtml;
    
    // 获取插入的侧边栏元素
    const sidebarElement = container.querySelector('.admin-sidebar');
    if (sidebarElement) {
      this.setupNavigation(sidebarElement);
    }
  }

  /**
   * 直接替换现有侧边栏
   */
  replaceExistingSidebar() {
    const existingSidebar = document.querySelector('.admin-sidebar');
    if (!existingSidebar) {
      console.error('No existing sidebar found to replace');
      return;
    }

    const sidebarHtml = this.generateSidebarHTML();
    
    // 直接替换内容
    existingSidebar.innerHTML = sidebarHtml;
    
    // 设置导航
    this.setupNavigation(existingSidebar);
  }
}

/**
 * 全局初始化函数
 * 在页面加载完成后自动替换侧边栏
 */
function initSidebar() {
  const sidebar = new Sidebar();
  sidebar.replaceExistingSidebar();
}

// 自动初始化（如果页面中已有侧边栏）
document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.admin-sidebar')) {
    initSidebar();
  }
});

// 导出供外部使用
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sidebar;
} else {
  window.Sidebar = Sidebar;
  window.initSidebar = initSidebar;
}