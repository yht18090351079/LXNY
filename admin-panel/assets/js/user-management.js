/**
 * 用户管理页面功能模块
 */

class UserManagement {
    constructor() {
        this.currentUser = Auth.getCurrentUser();
        this.editingUserId = null;
        
        // 模拟用户数据
        this.users = [
            {
                id: 1,
                username: 'admin',
                name: '系统管理员',
                role: 'superadmin',
                township: null,
                status: 'active',
                lastLogin: '2024-01-20 14:30:00',
                createTime: '2024-01-01 00:00:00',
                permissions: ['all']
            },
            {
                id: 2,
                username: 'linxia_admin',
                name: '临夏县管理员',
                role: 'township',
                township: '临夏县',
                status: 'active',
                lastLogin: '2024-01-20 10:15:00',
                createTime: '2024-01-05 09:00:00',
                permissions: ['data_view', 'data_edit', 'user_view']
            },
            {
                id: 3,
                username: 'dongxiang_admin',
                name: '东乡县管理员',
                role: 'township',
                township: '东乡县',
                status: 'active',
                lastLogin: '2024-01-19 16:45:00',
                createTime: '2024-01-05 09:00:00',
                permissions: ['data_view', 'data_edit', 'user_view']
            },
            {
                id: 4,
                username: 'test_user',
                name: '测试用户',
                role: 'township',
                township: '积石山县',
                status: 'inactive',
                lastLogin: '2024-01-15 08:30:00',
                createTime: '2024-01-10 14:20:00',
                permissions: ['data_view']
            }
        ];
        
        this.init();
    }
    
    init() {
        this.initUserInfo();
        this.bindEvents();
        this.loadUserList();
        this.checkPermissions();
    }
    
    initUserInfo() {
        if (this.currentUser) {
            document.getElementById('currentUserName').textContent = this.currentUser.name;
            document.getElementById('currentUserRole').textContent = 
                this.currentUser.role === 'superadmin' ? '超级管理员' : '乡镇管理员';
        }
    }
    
    checkPermissions() {
        // 只有超级管理员可以管理用户
        if (this.currentUser.role !== 'superadmin') {
            document.getElementById('addUserBtn').style.display = 'none';
            Utils.showMessage('您没有用户管理权限', 'warning');
        }
    }
    
    bindEvents() {
        // 侧边栏菜单
        document.querySelectorAll('.menu-item[data-page]').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                if (page === 'data-management') {
                    window.location.href = 'data-management.html';
                } else if (page === 'data-management' && item.classList.contains('menu-parent')) {
                    // 切换子菜单展开状态
                    this.toggleSubmenu(e.currentTarget);
                }
            });
        });

        // 数据管理子菜单
        document.querySelectorAll('.menu-child').forEach(item => {
            item.addEventListener('click', (e) => {
                const tab = e.currentTarget.dataset.tab;
                if (tab) {
                    window.location.href = `data-management.html#${tab}`;
                }
            });
        });
        
        // 搜索和筛选
        this.bindSearchEvents();
        
        // 模态框事件
        this.bindModalEvents();
    }
    
    bindSearchEvents() {
        const searchInput = document.getElementById('userSearchInput');
        const roleFilter = document.getElementById('roleFilter');
        
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce(() => {
                this.filterUsers();
            }, 300));
        }
        
        if (roleFilter) {
            roleFilter.addEventListener('change', () => {
                this.filterUsers();
            });
        }
    }
    
    bindModalEvents() {
        // 点击模态框背景关闭
        document.getElementById('userModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeUserModal();
            }
        });
    }
    
    loadUserList() {
        const userList = document.getElementById('userList');
        if (!userList) return;
        
        const filteredUsers = this.getFilteredUsers();
        
        userList.innerHTML = filteredUsers.map(user => this.createUserCard(user)).join('');
    }
    
    getFilteredUsers() {
        let users = [...this.users];
        
        // 搜索过滤
        const searchTerm = document.getElementById('userSearchInput')?.value.toLowerCase();
        if (searchTerm) {
            users = users.filter(user => 
                user.username.toLowerCase().includes(searchTerm) ||
                user.name.toLowerCase().includes(searchTerm) ||
                (user.township && user.township.toLowerCase().includes(searchTerm))
            );
        }
        
        // 角色过滤
        const roleFilter = document.getElementById('roleFilter')?.value;
        if (roleFilter) {
            users = users.filter(user => user.role === roleFilter);
        }
        
        return users;
    }
    
    createUserCard(user) {

                return `
             <div class="user-list-item">
                 <div class="user-name-cell">
                     ${user.name}
                 </div>
                 
                 <div class="user-account-cell">
                     ${user.username}
                 </div>
                 
                 <div class="user-township-cell">
                     ${user.township ? user.township : '-'}
                 </div>
                 
                 <div class="user-login-cell">
                     ${user.lastLogin}
                 </div>
                 
                 <div class="user-actions-cell">
                     ${this.currentUser.role === 'superadmin' ? `
                         <button class="btn btn-sm btn-default" onclick="userManager.editUser(${user.id})" title="编辑">
                             编辑
                         </button>
                         <button class="btn btn-sm btn-warning" onclick="userManager.resetPassword(${user.id})" title="重置密码">
                             重置密码
                         </button>
                         ${user.id !== this.currentUser.id ? `
                             <button class="btn btn-sm btn-danger" onclick="userManager.deleteUser(${user.id})" title="删除">
                                 删除
                             </button>
                         ` : '<span class="btn-placeholder"></span>'}
                     ` : `
                         <span class="btn-placeholder"></span>
                         <span class="btn-placeholder"></span>
                         <span class="btn-placeholder"></span>
                     `}
                 </div>
             </div>
         `;
    }
    
    getDaysFromCreate(createTime) {
        const days = Math.floor((new Date() - new Date(createTime)) / (1000 * 60 * 60 * 24));
        return days;
    }
    
    getLastLoginDays(lastLogin) {
        const days = Math.floor((new Date() - new Date(lastLogin)) / (1000 * 60 * 60 * 24));
        if (days === 0) return '今天';
        if (days === 1) return '昨天';
        return `${days}天前`;
    }
    

    
    filterUsers() {
        this.loadUserList();
    }

    toggleSubmenu(menuItem) {
        const submenu = menuItem.parentElement.querySelector('.menu-submenu');
        if (submenu) {
            submenu.classList.toggle('show');
            menuItem.classList.toggle('expanded');
        }
    }
    
    showAddUserModal() {
        if (this.currentUser.role !== 'superadmin') {
            Utils.showMessage('您没有权限添加用户', 'error');
            return;
        }
        
        this.editingUserId = null;
        document.getElementById('userModalTitle').textContent = '新增用户';
        document.getElementById('userForm').reset();
        document.getElementById('townshipSelector').classList.remove('show');
        document.getElementById('userModal').classList.add('show');
    }
    
    editUser(userId) {
        if (this.currentUser.role !== 'superadmin') {
            Utils.showMessage('您没有权限编辑用户', 'error');
            return;
        }
        
        const user = this.users.find(u => u.id === userId);
        if (!user) return;
        
        this.editingUserId = userId;
        document.getElementById('userModalTitle').textContent = '编辑用户';
        
        // 填充表单
        document.getElementById('username').value = user.username;
        document.getElementById('name').value = user.name;
        document.getElementById('role').value = user.role;
        
        if (user.role === 'township') {
            document.getElementById('townshipSelector').classList.add('show');
            document.getElementById('township').value = user.township || '';
        }
        
        // 编辑时不需要密码
        document.getElementById('password').required = false;
        document.getElementById('confirmPassword').required = false;
        
        document.getElementById('userModal').classList.add('show');
    }
    
    closeUserModal() {
        document.getElementById('userModal').classList.remove('show');
        document.getElementById('userForm').reset();
        this.editingUserId = null;
    }
    
    saveUser() {
        const form = document.getElementById('userForm');
        const formData = new FormData(form);
        
        // 验证表单
        if (!this.validateUserForm(formData)) {
            return;
        }
        
        const userData = {
            username: formData.get('username'),
            name: formData.get('name'),
            role: formData.get('role'),
            township: formData.get('township') || null,
            status: 'active',
            permissions: this.getDefaultPermissions(formData.get('role'))
        };
        
        if (this.editingUserId) {
            // 编辑用户
            const userIndex = this.users.findIndex(u => u.id === this.editingUserId);
            if (userIndex !== -1) {
                this.users[userIndex] = { ...this.users[userIndex], ...userData };
                Utils.showMessage('用户信息更新成功', 'success');
            }
        } else {
            // 新增用户
            const newUser = {
                id: Math.max(...this.users.map(u => u.id)) + 1,
                ...userData,
                lastLogin: '从未登录',
                createTime: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            this.users.push(newUser);
            Utils.showMessage('用户创建成功', 'success');
        }
        
        this.closeUserModal();
        this.loadUserList();
    }
    
    validateUserForm(formData) {
        const username = formData.get('username');
        const name = formData.get('name');
        const role = formData.get('role');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');
        
        if (!username || !name || !role) {
            Utils.showMessage('请填写所有必填字段', 'error');
            return false;
        }
        
        // 检查用户名是否重复
        const existingUser = this.users.find(u => u.username === username && u.id !== this.editingUserId);
        if (existingUser) {
            Utils.showMessage('用户名已存在', 'error');
            return false;
        }
        
        // 新增用户时验证密码
        if (!this.editingUserId) {
            if (!password || !confirmPassword) {
                Utils.showMessage('请输入密码', 'error');
                return false;
            }
            
            if (password !== confirmPassword) {
                Utils.showMessage('两次输入的密码不一致', 'error');
                return false;
            }
        }
        
        // 乡镇管理员必须选择乡镇
        if (role === 'township' && !formData.get('township')) {
            Utils.showMessage('乡镇管理员必须选择所属乡镇', 'error');
            return false;
        }
        
        return true;
    }
    
    getDefaultPermissions(role) {
        if (role === 'superadmin') {
            return ['all'];
        } else {
            return ['data_view', 'data_edit', 'user_view'];
        }
    }
    
    resetPassword(userId) {
        if (confirm('确定要重置该用户的密码吗？新密码将设置为：123456')) {
            Utils.showMessage('密码重置成功，新密码为：123456', 'success');
        }
    }
    
    deleteUser(userId) {
        if (userId === this.currentUser.id) {
            Utils.showMessage('不能删除当前登录用户', 'error');
            return;
        }
        
        if (confirm('确定要删除该用户吗？此操作不可恢复。')) {
            this.users = this.users.filter(u => u.id !== userId);
            Utils.showMessage('用户删除成功', 'success');
            this.loadUserList();
        }
    }
}

// 全局函数


function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        Auth.logout();
    }
}

function toggleUserMenu() {
    console.log('用户菜单');
}

function toggleTownshipSelector() {
    const role = document.getElementById('role').value;
    const townshipSelector = document.getElementById('townshipSelector');
    
    if (role === 'township') {
        townshipSelector.classList.add('show');
        document.getElementById('township').required = true;
    } else {
        townshipSelector.classList.remove('show');
        document.getElementById('township').required = false;
    }
}

function showAddUserModal() {
    userManager.showAddUserModal();
}

function closeUserModal() {
    userManager.closeUserModal();
}

function saveUser() {
    userManager.saveUser();
}

// 全局变量
let userManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    userManager = new UserManagement();
});
