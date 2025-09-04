/**
 * 农情遥感系统管理端 - 通用功能模块
 */

// 全局配置
const CONFIG = {
    // 模拟用户数据
    users: {
        'admin': {
            password: 'admin123',
            role: 'superadmin',
            name: '系统管理员',
            permissions: ['all']
        },
        'linxia_admin': {
            password: 'linxia123',
            role: 'township',
            name: '临夏县管理员',
            township: '临夏县',
            permissions: ['data_view', 'data_edit', 'user_view']
        },
        'dongxiang_admin': {
            password: 'dongxiang123',
            role: 'township',
            name: '东乡县管理员',
            township: '东乡县',
            permissions: ['data_view', 'data_edit', 'user_view']
        }
    },
    
    // 页面路由
    routes: {
        login: 'index.html',
        dataManagement: 'data-management.html',
        plantingArea: 'planting-area-new.html',
        cropInfo: 'crop-info-new.html',
        imageData: 'image-data-new.html',
        deviceData: 'device-data-new.html',
        userManagement: 'user-management.html',
        disasterThreshold: 'disaster-threshold.html' // 超级管理员专用
    }
};

// 工具函数类
class Utils {
    /**
     * 显示消息提示
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, error, warning)
     * @param {number} duration - 显示时长(毫秒)
     */
    static showMessage(message, type = 'success', duration = 3000) {
        // 移除已存在的消息
        const existingMessage = document.querySelector('.global-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // 创建消息元素
        const messageEl = document.createElement('div');
        messageEl.className = `global-message message message-${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        // 添加样式
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            min-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(messageEl);
        
        // 自动移除
        setTimeout(() => {
            messageEl.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => messageEl.remove(), 300);
        }, duration);
    }
    
    /**
     * 格式化日期
     * @param {Date|string} date - 日期对象或字符串
     * @param {string} format - 格式化模式
     */
    static formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        
        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day)
            .replace('HH', hours)
            .replace('mm', minutes)
            .replace('ss', seconds);
    }
    
    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} delay - 延迟时间
     */
    static debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
    
    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} delay - 延迟时间
     */
    static throttle(func, delay) {
        let lastCall = 0;
        return function (...args) {
            const now = Date.now();
            if (now - lastCall >= delay) {
                lastCall = now;
                func.apply(this, args);
            }
        };
    }
    
    /**
     * 深拷贝对象
     * @param {any} obj - 要拷贝的对象
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => Utils.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = Utils.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }
    
    /**
     * 生成随机ID
     * @param {number} length - ID长度
     */
    static generateId(length = 8) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }
}

// 本地存储管理类
class Storage {
    /**
     * 设置本地存储
     * @param {string} key - 键名
     * @param {any} value - 值
     */
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('设置本地存储失败:', error);
        }
    }
    
    /**
     * 获取本地存储
     * @param {string} key - 键名
     * @param {any} defaultValue - 默认值
     */
    static get(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('获取本地存储失败:', error);
            return defaultValue;
        }
    }
    
    /**
     * 移除本地存储
     * @param {string} key - 键名
     */
    static remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('移除本地存储失败:', error);
        }
    }
    
    /**
     * 清空本地存储
     */
    static clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('清空本地存储失败:', error);
        }
    }
}

// 用户认证管理类
class Auth {
    /**
     * 用户登录
     * @param {string} username - 用户名
     * @param {string} password - 密码
     * @param {boolean} remember - 是否记住密码
     */
    static login(username, password, remember = false) {
        const user = CONFIG.users[username];
        
        if (!user || user.password !== password) {
            return {
                success: false,
                message: '用户名或密码错误'
            };
        }
        
        // 保存用户信息
        const userInfo = {
            username: username,
            name: user.name,
            role: user.role,
            township: user.township || null,
            permissions: user.permissions,
            loginTime: new Date().toISOString()
        };
        
        Storage.set('userInfo', userInfo);
        
        // 记住密码
        if (remember) {
            Storage.set('rememberedUser', { username, password });
        } else {
            Storage.remove('rememberedUser');
        }
        
        return {
            success: true,
            message: '登录成功',
            user: userInfo
        };
    }
    
    /**
     * 用户登出
     */
    static logout() {
        Storage.remove('userInfo');
        window.location.href = CONFIG.routes.login;
    }
    
    /**
     * 获取当前用户信息
     */
    static getCurrentUser() {
        return Storage.get('userInfo');
    }
    
    /**
     * 检查用户是否已登录
     */
    static isLoggedIn() {
        return !!this.getCurrentUser();
    }
    
    /**
     * 检查用户权限
     * @param {string} permission - 权限名称
     */
    static hasPermission(permission) {
        const user = this.getCurrentUser();
        if (!user) return false;
        
        return user.permissions.includes('all') || user.permissions.includes(permission);
    }
    
    /**
     * 获取记住的用户信息
     */
    static getRememberedUser() {
        return Storage.get('rememberedUser');
    }
}

// 页面初始化时检查登录状态
document.addEventListener('DOMContentLoaded', function() {
    // 如果不是登录页面且用户未登录，跳转到登录页
    if (!window.location.pathname.includes('index.html') && 
        window.location.pathname !== '/' && 
        !Auth.isLoggedIn()) {
        window.location.href = CONFIG.routes.login;
    }
});

// 添加全局样式
const globalStyles = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

// 注入全局样式
const styleSheet = document.createElement('style');
styleSheet.textContent = globalStyles;
document.head.appendChild(styleSheet);

// 导航管理类
class Navigation {
    /**
     * 初始化导航
     */
    static init() {
        // 绑定菜单点击事件
        document.addEventListener('click', function(e) {
            const menuItem = e.target.closest('.menu-item[data-page]');
            if (menuItem) {
                const page = menuItem.getAttribute('data-page');
                Navigation.navigateTo(page);
            }
        });
        
        // 更新当前用户信息显示
        Navigation.updateUserInfo();
    }
    
    /**
     * 导航到指定页面
     * @param {string} page - 页面标识
     */
            static navigateTo(page) {
            const routes = {
                'planting-area': CONFIG.routes.plantingArea,
                'crop-info': CONFIG.routes.cropInfo,
                'image-data': CONFIG.routes.imageData,
                'device-data': CONFIG.routes.deviceData,
                'data-management': CONFIG.routes.dataManagement,
                'user-management': CONFIG.routes.userManagement,
                'disaster-threshold': CONFIG.routes.disasterThreshold
            };
            
            if (routes[page]) {
                window.location.href = routes[page];
            }
        }
    
    /**
     * 更新用户信息显示
     */
    static updateUserInfo() {
        const user = Auth.getCurrentUser();
        if (user) {
            const userNameEl = document.getElementById('currentUserName');
            const userRoleEl = document.getElementById('currentUserRole');
            
            if (userNameEl) userNameEl.textContent = user.name;
            if (userRoleEl) {
                userRoleEl.textContent = user.role === 'superadmin' ? '超级管理员' : 
                                       user.role === 'township' ? '乡镇管理员' : user.role;
            }
            
            // 根据用户角色显示/隐藏超级管理员专用菜单
            Navigation.updateMenuVisibility(user);
        }
    }
    
    static updateMenuVisibility(user) {
        const superadminMenus = document.querySelectorAll('.menu-item.superadmin-only');
        superadminMenus.forEach(menu => {
            if (user && user.role === 'superadmin') {
                menu.style.display = 'flex';
            } else {
                menu.style.display = 'none';
            }
        });
    }
}

// 全局函数 - 处理用户操作
function toggleUserMenu() {
    // 可以添加用户菜单下拉功能
    console.log('用户菜单点击');
}

function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        Auth.logout();
    }
}

// 页面加载完成后初始化导航
document.addEventListener('DOMContentLoaded', function() {
    Navigation.init();
});
