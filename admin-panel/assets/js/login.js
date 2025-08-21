/**
 * 登录页面功能模块
 */

class LoginManager {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.usernameInput = document.getElementById('username');
        this.passwordInput = document.getElementById('password');
        this.rememberCheckbox = document.getElementById('rememberMe');
        this.loginBtn = document.getElementById('loginBtn');
        this.loginBtnText = document.getElementById('loginBtnText');
        this.errorMessage = document.getElementById('errorMessage');
        this.errorText = document.getElementById('errorText');
        this.successMessage = document.getElementById('successMessage');
        
        this.init();
    }
    
    init() {
        // 绑定事件
        this.bindEvents();
        
        // 检查是否已登录
        this.checkLoginStatus();
        
        // 加载记住的用户信息
        this.loadRememberedUser();
        
        // 添加键盘事件
        this.addKeyboardEvents();
    }
    
    bindEvents() {
        // 表单提交事件
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });
        
        // 输入框焦点事件 - 隐藏错误消息
        this.usernameInput.addEventListener('focus', () => this.hideError());
        this.passwordInput.addEventListener('focus', () => this.hideError());
        
        // 输入验证
        this.usernameInput.addEventListener('input', () => this.validateInput());
        this.passwordInput.addEventListener('input', () => this.validateInput());
    }
    
    addKeyboardEvents() {
        // Enter键登录
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.loginBtn.disabled) {
                this.handleLogin();
            }
        });
    }
    
    checkLoginStatus() {
        // 如果已登录，直接跳转到数据管理页面
        if (Auth.isLoggedIn()) {
            this.redirectToDataManagement();
        }
    }
    
    loadRememberedUser() {
        const rememberedUser = Auth.getRememberedUser();
        if (rememberedUser) {
            this.usernameInput.value = rememberedUser.username;
            this.passwordInput.value = rememberedUser.password;
            this.rememberCheckbox.checked = true;
        }
    }
    
    validateInput() {
        // 原型阶段：始终允许登录
        this.loginBtn.disabled = false;
        return true;
    }
    
    async handleLogin() {
        // 原型阶段：直接登录，无需验证
        this.setLoading(true);

        try {
            // 模拟网络延迟，保持真实感
            await this.delay(800);

            // 直接使用默认管理员账号登录
            const result = Auth.login('admin', 'admin123', false);

            this.showSuccess();
            // 延迟跳转，让用户看到成功消息
            setTimeout(() => {
                this.redirectToDataManagement();
            }, 1200);

        } catch (error) {
            console.error('登录错误:', error);
            this.showError('系统错误，请稍后重试');
        } finally {
            this.setLoading(false);
        }
    }
    
    setLoading(loading) {
        if (loading) {
            this.loginBtn.classList.add('loading');
            this.loginBtn.disabled = true;
            this.loginBtnText.textContent = '登录中...';
        } else {
            this.loginBtn.classList.remove('loading');
            this.loginBtn.disabled = false;
            this.loginBtnText.textContent = '登录';
        }
    }
    
    showError(message) {
        this.hideSuccess();
        this.errorText.textContent = message;
        this.errorMessage.classList.add('show');
        
        // 3秒后自动隐藏
        setTimeout(() => this.hideError(), 3000);
    }
    
    hideError() {
        this.errorMessage.classList.remove('show');
    }
    
    showSuccess() {
        this.hideError();
        this.successMessage.classList.add('show');
    }
    
    hideSuccess() {
        this.successMessage.classList.remove('show');
    }
    
    redirectToDataManagement() {
        window.location.href = CONFIG.routes.dataManagement;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}



// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    new LoginManager();
    
    // 添加一些交互效果
    addInteractiveEffects();
});

// 添加交互效果
function addInteractiveEffects() {
    // 输入框聚焦效果
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'scale(1.02)';
            this.parentElement.style.transition = 'transform 0.2s ease';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // 登录框悬浮效果
    const loginBox = document.querySelector('.login-box');
    if (loginBox) {
        loginBox.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        loginBox.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
}

// 添加页面可见性检测
document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
        // 页面重新可见时，检查登录状态
        if (Auth.isLoggedIn()) {
            window.location.href = CONFIG.routes.dataManagement;
        }
    }
});
