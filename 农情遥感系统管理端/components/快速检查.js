/**
 * 快速检查脚本 - 验证所有页面的侧边栏组件是否正确引入
 * 
 * 在浏览器控制台中运行此脚本，可以快速检查所有页面的状态
 */

// 定义需要检查的页面列表
const pagesToCheck = [
  '../pages/dashboard/dashboard.html',
  '../pages/data-management/data-overview/data-overview.html',
  '../pages/data-management/remote-sensing/list.html',
  '../pages/data-management/remote-sensing/import.html',
  '../pages/data-management/farmland/list.html',
  '../pages/data-management/farmland/crops.html',
  '../pages/device-management/monitor/monitor.html',
  '../pages/device-management/detail/detail.html'
];

/**
 * 检查单个页面的侧边栏组件
 */
async function checkPageSidebar(pageUrl) {
  try {
    const response = await fetch(pageUrl);
    const html = await response.text();
    
    // 检查是否包含组件引用
    const hasSidebarComponent = html.includes('components/sidebar.js');
    
    // 检查是否移除了原始侧边栏HTML
    const hasOldSidebar = html.includes('<div class="sidebar-content">');
    
    // 检查是否有正确的占位符
    const hasPlaceholder = html.includes('侧边栏内容将由组件动态加载');
    
    return {
      url: pageUrl,
      hasSidebarComponent,
      hasOldSidebar: !hasOldSidebar, // 反转，因为我们希望旧的不存在
      hasPlaceholder,
      status: hasSidebarComponent && !hasOldSidebar && hasPlaceholder ? 'success' : 'error'
    };
  } catch (error) {
    return {
      url: pageUrl,
      hasSidebarComponent: false,
      hasOldSidebar: false,
      hasPlaceholder: false,
      status: 'error',
      error: error.message
    };
  }
}

/**
 * 检查所有页面
 */
async function checkAllPages() {
  console.log('🔍 开始检查所有页面的侧边栏组件...\n');
  
  const results = [];
  
  for (const pageUrl of pagesToCheck) {
    console.log(`检查中: ${pageUrl}`);
    const result = await checkPageSidebar(pageUrl);
    results.push(result);
  }
  
  // 生成报告
  console.log('\n📊 检查结果报告：');
  console.log('=====================================');
  
  let successCount = 0;
  let errorCount = 0;
  
  results.forEach((result, index) => {
    const status = result.status === 'success' ? '✅' : '❌';
    const pageName = result.url.split('/').pop().replace('.html', '');
    
    console.log(`${index + 1}. ${status} ${pageName}`);
    console.log(`   组件引用: ${result.hasSidebarComponent ? '✅' : '❌'}`);
    console.log(`   旧代码清理: ${result.hasOldSidebar ? '✅' : '❌'}`);
    console.log(`   占位符存在: ${result.hasPlaceholder ? '✅' : '❌'}`);
    
    if (result.error) {
      console.log(`   错误: ${result.error}`);
    }
    
    console.log('');
    
    if (result.status === 'success') {
      successCount++;
    } else {
      errorCount++;
    }
  });
  
  console.log('=====================================');
  console.log(`✅ 成功: ${successCount} 个页面`);
  console.log(`❌ 失败: ${errorCount} 个页面`);
  console.log(`📈 成功率: ${Math.round((successCount / results.length) * 100)}%`);
  
  if (errorCount === 0) {
    console.log('\n🎉 所有页面的侧边栏组件都配置正确！');
  } else {
    console.log('\n⚠️ 部分页面需要检查和修复。');
  }
  
  return results;
}

/**
 * 检查当前页面的侧边栏组件状态
 */
function checkCurrentPageSidebar() {
  console.log('🔍 检查当前页面的侧边栏组件状态...\n');
  
  const checks = {
    '组件类存在': typeof Sidebar !== 'undefined',
    '侧边栏元素存在': !!document.querySelector('.admin-sidebar'),
    '侧边栏内容已渲染': !!document.querySelector('.admin-sidebar .sidebar-content'),
    '导航链接存在': document.querySelectorAll('.admin-sidebar .nav-link').length > 0,
    '活动状态正确': !!document.querySelector('.admin-sidebar .nav-item.active'),
    '折叠按钮存在': !!document.querySelector('.sidebar-toggle')
  };
  
  console.log('当前页面检查结果：');
  console.log('=====================');
  
  Object.entries(checks).forEach(([name, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${name}`);
  });
  
  const passedCount = Object.values(checks).filter(Boolean).length;
  const totalCount = Object.keys(checks).length;
  const successRate = Math.round((passedCount / totalCount) * 100);
  
  console.log('=====================');
  console.log(`成功率: ${successRate}% (${passedCount}/${totalCount})`);
  
  if (successRate === 100) {
    console.log('🎉 当前页面的侧边栏组件工作正常！');
  } else {
    console.log('⚠️ 当前页面的侧边栏组件可能存在问题。');
  }
  
  return checks;
}

// 导出函数供控制台使用
window.sidebarCheck = {
  checkAllPages,
  checkCurrentPageSidebar,
  checkPageSidebar
};

// 页面加载完成后自动运行当前页面检查
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(checkCurrentPageSidebar, 1000);
  });
} else {
  setTimeout(checkCurrentPageSidebar, 1000);
}

console.log(`
🔧 侧边栏组件快速检查工具已加载！

使用方法：
- sidebarCheck.checkCurrentPageSidebar() - 检查当前页面
- sidebarCheck.checkAllPages() - 检查所有页面（需要在同域下运行）
- sidebarCheck.checkPageSidebar(url) - 检查指定页面

当前页面检查将在1秒后自动运行...
`);