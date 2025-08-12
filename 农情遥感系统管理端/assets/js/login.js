/**
 * 管理端登录页面功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面功能
    initLoginForm();
    initPasswordToggle();
    initRememberMe();
    showWelcomeMessage();
});

/**
 * 初始化登录表单
 */
function initLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 添加输入框焦点效果
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

/**
 * 初始化密码显示/隐藏功能
 */
function initPasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordInput = document.getElementById('password');
    
    if (passwordToggle && passwordInput) {
        passwordToggle.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            const icon = this.querySelector('i');
            if (type === 'text') {
                icon.classList.replace('fa-eye', 'fa-eye-slash');
            } else {
                icon.classList.replace('fa-eye-slash', 'fa-eye');
            }
        });
    }
}

/**
 * 初始化记住登录状态功能
 */
function initRememberMe() {
    const rememberCheckbox = document.getElementById('remember');
    const usernameInput = document.getElementById('username');
    
    // 页面加载时检查是否有保存的用户名
    const savedUsername = localStorage.getItem('admin_username');
    if (savedUsername) {
        usernameInput.value = savedUsername;
        rememberCheckbox.checked = true;
    }
}

/**
 * 处理登录逻辑
 */
async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const remember = document.getElementById('remember').checked;
    const loginButton = document.getElementById('loginButton');
    
    // 基本验证
    if (!username) {
        showMessage('请输入用户名', 'error');
        return;
    }
    
    if (!password) {
        showMessage('请输入密码', 'error');
        return;
    }
    
    // 显示加载状态
    setLoginButtonLoading(true);
    
    try {
        // 模拟登录验证（实际项目中应该调用后端API）
        await simulateLogin(username, password);
        
        // 保存登录状态
        if (remember) {
            localStorage.setItem('admin_username', username);
            localStorage.setItem('admin_remember', 'true');
        } else {
            localStorage.removeItem('admin_username');
            localStorage.removeItem('admin_remember');
        }
        
        // 保存登录token（模拟）
        localStorage.setItem('admin_token', 'mock_admin_token_' + Date.now());
        localStorage.setItem('admin_user', JSON.stringify({
            id: 1,
            username: username,
            name: '系统管理员',
            role: 'admin',
            permissions: ['all']
        }));
        
        showMessage('登录成功，正在跳转...', 'success');
        
        // 延迟跳转到主页面
        setTimeout(() => {
            window.location.href = 'pages/dashboard/dashboard.html';
        }, 1500);
        
    } catch (error) {
        showMessage(error.message || '登录失败，请检查用户名和密码', 'error');
    } finally {
        setLoginButtonLoading(false);
    }
}

/**
 * 模拟登录验证
 */
function simulateLogin(username, password) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // 模拟验证逻辑
            const validCredentials = [
                { username: 'admin', password: 'admin123' },
                { username: 'manager', password: 'manager123' },
                { username: 'supervisor', password: 'super123' }
            ];
            
            const isValid = validCredentials.some(cred => 
                cred.username === username && cred.password === password
            );
            
            if (isValid) {
                resolve();
            } else {
                reject(new Error('用户名或密码错误'));
            }
        }, 1500); // 模拟网络延迟
    });
}

/**
 * 设置登录按钮加载状态
 */
function setLoginButtonLoading(loading) {
    const loginButton = document.getElementById('loginButton');
    const buttonText = loginButton.querySelector('.button-text');
    const buttonLoader = loginButton.querySelector('.button-loader');
    
    if (loading) {
        loginButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'block';
    } else {
        loginButton.disabled = false;
        buttonText.style.display = 'block';
        buttonLoader.style.display = 'none';
    }
}

/**
 * 显示消息提示
 */
function showMessage(text, type = 'info') {
    const overlay = document.getElementById('messageOverlay');
    const messageBox = document.getElementById('messageBox');
    const messageIcon = messageBox.querySelector('.message-icon i');
    const messageText = document.getElementById('messageText');
    const confirmButton = document.getElementById('messageConfirmButton');
    
    // 设置消息内容
    messageText.textContent = text;
    
    // 设置图标和颜色
    const iconClass = messageBox.querySelector('.message-icon');
    iconClass.className = 'message-icon ' + type;
    
    switch(type) {
        case 'success':
            messageIcon.className = 'fas fa-check-circle';
            break;
        case 'error':
            messageIcon.className = 'fas fa-exclamation-circle';
            break;
        case 'warning':
            messageIcon.className = 'fas fa-exclamation-triangle';
            break;
        default:
            messageIcon.className = 'fas fa-info-circle';
    }
    
    // 显示消息框
    overlay.style.display = 'flex';
    
    // 确定按钮点击事件
    confirmButton.onclick = function() {
        overlay.style.display = 'none';
    };
    
    // 点击遮罩关闭
    overlay.onclick = function(e) {
        if (e.target === overlay) {
            overlay.style.display = 'none';
        }
    };
}

/**
 * 显示欢迎信息
 */
function showWelcomeMessage() {
    // 检查是否是首次访问
    const hasVisited = localStorage.getItem('admin_has_visited');
    
    if (!hasVisited) {
        setTimeout(() => {
            showMessage('欢迎使用农情遥感系统管理平台！\n\n演示账号：\n用户名：admin  密码：admin123\n用户名：manager  密码：manager123', 'info');
            localStorage.setItem('admin_has_visited', 'true');
        }, 1000);
    }
}

/**
 * 检查登录状态
 */
function checkLoginStatus() {
    const token = localStorage.getItem('admin_token');
    if (token && window.location.pathname !== '/index.html') {
        // 如果已登录且不在登录页面，可以跳转到dashboard
        // window.location.href = 'pages/dashboard/dashboard.html';
    }
}

// 页面加载时检查登录状态
checkLoginStatus();