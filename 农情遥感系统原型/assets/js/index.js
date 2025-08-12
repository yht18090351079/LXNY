/**
 * 登录页面功能
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 获取登录按钮
  const loginBtn = document.querySelector('.login-btn');
  
  // 绑定登录按钮点击事件
  if (loginBtn) {
    loginBtn.addEventListener('click', handleLogin);
  }
  
  // 绑定表单提交事件（回车登录）
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleLogin();
    });
  }
});

/**
 * 处理登录操作
 */
function handleLogin() {
  // 获取用户名和密码
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const remember = document.getElementById('remember').checked;
  
  // 演示系统：直接允许登录，无需验证
  // 跳转到首页
  showMessage('登录成功，正在跳转...', 'success');
  setTimeout(() => {
    window.location.href = 'pages/overview/overview.html';
  }, 1000);
}

/**
 * 显示消息提示
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型（error/success）
 */
function showMessage(message, type = 'error') {
  // 查找是否已有提示框
  let messageEl = document.querySelector('.message-box');
  
  // 如果没有则创建
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.className = 'message-box';
    document.body.appendChild(messageEl);
    
    // 添加样式
    messageEl.style.position = 'fixed';
    messageEl.style.top = '20px';
    messageEl.style.left = '50%';
    messageEl.style.transform = 'translateX(-50%)';
    messageEl.style.padding = '12px 20px';
    messageEl.style.borderRadius = '4px';
    messageEl.style.fontSize = '14px';
    messageEl.style.zIndex = '9999';
    messageEl.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)';
  }
  
  // 设置消息类型样式
  if (type === 'error') {
    messageEl.style.backgroundColor = '#f44336';
    messageEl.style.color = 'white';
  } else if (type === 'success') {
    messageEl.style.backgroundColor = '#4caf50';
    messageEl.style.color = 'white';
  }
  
  // 设置消息内容
  messageEl.textContent = message;
  
  // 显示消息
  messageEl.style.display = 'block';
  
  // 自动隐藏
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

// 页面加载完成后，检查是否有保存的用户名
window.addEventListener('load', function() {
  const savedUsername = localStorage.getItem('username');
  if (savedUsername) {
    document.getElementById('username').value = savedUsername;
    document.getElementById('remember').checked = true;
  }
}); 