/**
 * 农情遥感系统管理端 - 角色权限管理功能
 * 功能：角色管理、权限配置、权限矩阵等
 */

// ===== 全局变量 =====
let roles = [];
let permissions = [];
let permissionGroups = [];
let currentEditingRole = null;
let viewMode = 'card';

// ===== 页面加载完成后初始化 =====
document.addEventListener('DOMContentLoaded', function() {
    initializeRolePage();
});

/**
 * 页面初始化
 */
function initializeRolePage() {
    console.log('🔐 初始化角色权限管理页面...');
    
    // 生成模拟数据
    generateMockData();
    
    // 渲染页面内容
    renderRoleOverview();
    renderPermissionMatrix();
    renderRoleCards();
    
    // 绑定事件
    bindEvents();
    
    console.log('✅ 角色权限管理页面初始化完成');
}

// ===== 数据生成和管理 =====

/**
 * 生成模拟数据
 */
function generateMockData() {
    // 权限组定义
    permissionGroups = [
        {
            id: 'user_management',
            name: '用户管理',
            icon: 'fas fa-users',
            description: '用户账户和权限管理相关功能'
        },
        {
            id: 'data_management', 
            name: '数据管理',
            icon: 'fas fa-database',
            description: '各类数据的查看、编辑和管理功能'
        },
        {
            id: 'device_management',
            name: '设备管理', 
            icon: 'fas fa-microchip',
            description: '传感器和监控设备管理功能'
        },
        {
            id: 'system_config',
            name: '系统配置',
            icon: 'fas fa-cogs',
            description: '系统参数和配置管理功能'
        },
        {
            id: 'report_analytics',
            name: '报表分析',
            icon: 'fas fa-chart-bar',
            description: '数据分析和报表功能'
        }
    ];
    
    // 权限定义
    permissions = [
        // 用户管理权限
        {
            id: 'user_view',
            name: '查看用户',
            group: 'user_management',
            description: '查看用户列表和基本信息'
        },
        {
            id: 'user_create',
            name: '创建用户',
            group: 'user_management', 
            description: '添加新用户账户'
        },
        {
            id: 'user_edit',
            name: '编辑用户',
            group: 'user_management',
            description: '修改用户信息和状态'
        },
        {
            id: 'user_delete',
            name: '删除用户',
            group: 'user_management',
            description: '删除用户账户'
        },
        {
            id: 'role_manage',
            name: '角色管理',
            group: 'user_management',
            description: '管理用户角色和权限'
        },
        
        // 数据管理权限
        {
            id: 'data_view',
            name: '查看数据',
            group: 'data_management',
            description: '查看各类业务数据'
        },
        {
            id: 'data_import',
            name: '导入数据',
            group: 'data_management',
            description: '上传和导入数据文件'
        },
        {
            id: 'data_export',
            name: '导出数据',
            group: 'data_management',
            description: '导出和下载数据'
        },
        {
            id: 'data_edit',
            name: '编辑数据',
            group: 'data_management',
            description: '修改和更新数据内容'
        },
        
        // 设备管理权限
        {
            id: 'device_view',
            name: '查看设备',
            group: 'device_management',
            description: '查看设备状态和信息'
        },
        {
            id: 'device_control',
            name: '控制设备',
            group: 'device_management', 
            description: '远程控制设备操作'
        },
        {
            id: 'device_config',
            name: '配置设备',
            group: 'device_management',
            description: '修改设备参数和配置'
        },
        
        // 系统配置权限
        {
            id: 'system_view',
            name: '查看配置',
            group: 'system_config',
            description: '查看系统配置信息'
        },
        {
            id: 'system_config',
            name: '修改配置',
            group: 'system_config',
            description: '修改系统参数和配置'
        },
        
        // 报表分析权限
        {
            id: 'report_view',
            name: '查看报表',
            group: 'report_analytics',
            description: '查看各类统计报表'
        }
    ];
    
    // 角色定义
    roles = [
        {
            id: 'admin',
            name: '系统管理员',
            description: '拥有系统所有权限，负责系统全面管理',
            permissions: permissions.map(p => p.id), // 所有权限
            userCount: 3,
            enabled: true,
            createTime: new Date('2024-01-01'),
            updateTime: new Date(),
            color: '#F44336',
            icon: 'fas fa-crown'
        },
        {
            id: 'manager',
            name: '业务管理员', 
            description: '负责业务数据管理和设备监控',
            permissions: [
                'user_view', 'data_view', 'data_import', 'data_export', 'data_edit',
                'device_view', 'device_control', 'device_config', 'system_view', 'report_view'
            ],
            userCount: 8,
            enabled: true,
            createTime: new Date('2024-01-02'),
            updateTime: new Date(),
            color: '#FF9800',
            icon: 'fas fa-user-tie'
        },
        {
            id: 'operator',
            name: '系统操作员',
            description: '负责日常操作和设备监控',
            permissions: [
                'data_view', 'data_import', 'device_view', 'device_control', 'report_view'
            ],
            userCount: 15,
            enabled: true,
            createTime: new Date('2024-01-03'),
            updateTime: new Date(),
            color: '#2196F3',
            icon: 'fas fa-user-cog'
        },
        {
            id: 'viewer',
            name: '数据查看员',
            description: '只能查看数据，无修改权限',
            permissions: ['data_view', 'device_view', 'report_view'],
            userCount: 12,
            enabled: true,
            createTime: new Date('2024-01-04'),
            updateTime: new Date(),
            color: '#4CAF50',
            icon: 'fas fa-eye'
        },
        {
            id: 'analyst',
            name: '数据分析员',
            description: '专注于数据分析和报表生成',
            permissions: ['data_view', 'data_export', 'report_view'],
            userCount: 6,
            enabled: true,
            createTime: new Date('2024-01-05'),
            updateTime: new Date(),
            color: '#9C27B0',
            icon: 'fas fa-chart-line'
        },
        {
            id: 'guest',
            name: '访客',
            description: '临时访问权限，仅能查看基础信息',
            permissions: ['data_view'],
            userCount: 2,
            enabled: false,
            createTime: new Date('2024-01-06'),
            updateTime: new Date(),
            color: '#9E9E9E',
            icon: 'fas fa-user-friends'
        }
    ];
    
    console.log(`🔐 生成了 ${roles.length} 个系统角色`);
    console.log(`🔑 包含 ${permissions.length} 项系统权限`);
}

// ===== 页面渲染 =====

/**
 * 渲染角色概览
 */
function renderRoleOverview() {
    const totalRoles = roles.length;
    const adminRoles = roles.filter(r => r.permissions.length === permissions.length).length;
    const activeRoles = roles.filter(r => r.enabled).length;
    const totalPermissions = permissions.length;
    
    // 更新统计数值
    const totalEl = document.getElementById('totalRoles');
    const adminEl = document.getElementById('adminRoles');
    const activeEl = document.getElementById('activeRoles');
    const permissionsEl = document.getElementById('totalPermissions');
    
    if (totalEl) animateCountUp(totalEl, totalRoles, 800);
    if (adminEl) animateCountUp(adminEl, adminRoles, 800);
    if (activeEl) animateCountUp(activeEl, activeRoles, 800);
    if (permissionsEl) animateCountUp(permissionsEl, totalPermissions, 800);
}

/**
 * 渲染权限矩阵
 */
function renderPermissionMatrix() {
    const tbody = document.getElementById('permissionMatrixBody');
    if (!tbody) return;
    
    // 按权限组分组权限
    const groupedPermissions = {};
    permissionGroups.forEach(group => {
        groupedPermissions[group.id] = {
            group: group,
            permissions: permissions.filter(p => p.group === group.id)
        };
    });
    
    let html = '';
    
    Object.values(groupedPermissions).forEach(({ group, permissions: groupPermissions }) => {
        // 权限组标题行
        html += `
            <tr class="permission-group-header">
                <td class="permission-group-title">
                    <i class="${group.icon}"></i>
                    <strong>${group.name}</strong>
                    <span class="permission-count">(${groupPermissions.length}项)</span>
                </td>
                ${roles.map(role => `
                    <td class="group-permission-summary">
                        <div class="permission-summary">
                            <span class="granted-count">${role.permissions.filter(p => groupPermissions.some(gp => gp.id === p)).length}</span>
                            <span class="total-count">/${groupPermissions.length}</span>
                        </div>
                    </td>
                `).join('')}
            </tr>
        `;
        
        // 权限明细行
        groupPermissions.forEach(permission => {
            html += `
                <tr class="permission-detail-row">
                    <td class="permission-detail">
                        <div class="permission-info">
                            <span class="permission-name">${permission.name}</span>
                            <small class="permission-desc">${permission.description}</small>
                        </div>
                    </td>
                    ${roles.map(role => {
                        const hasPermission = role.permissions.includes(permission.id);
                        return `
                            <td class="permission-cell">
                                <label class="permission-switch">
                                    <input type="checkbox" 
                                           ${hasPermission ? 'checked' : ''} 
                                           ${role.id === 'admin' ? 'disabled' : ''}
                                           onchange="togglePermission('${role.id}', '${permission.id}')">
                                    <span class="switch-slider"></span>
                                </label>
                            </td>
                        `;
                    }).join('')}
                </tr>
            `;
        });
    });
    
    tbody.innerHTML = html;
}

/**
 * 渲染角色卡片
 */
function renderRoleCards() {
    const container = document.getElementById('roleCardsContainer');
    if (!container) return;
    
    // 过滤和搜索
    const searchText = document.getElementById('roleSearchInput')?.value?.toLowerCase() || '';
    const filteredRoles = roles.filter(role => {
        if (searchText) {
            const searchFields = [
                role.name,
                role.description,
                role.id
            ].join(' ').toLowerCase();
            if (!searchFields.includes(searchText)) {
                return false;
            }
        }
        return true;
    });
    
    if (filteredRoles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-search"></i>
                <h3>未找到匹配的角色</h3>
                <p>请尝试调整搜索条件</p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div class="role-cards-grid">
            ${filteredRoles.map(role => {
                const permissionCount = role.permissions.length;
                const totalPermissions = permissions.length;
                const permissionPercentage = Math.round((permissionCount / totalPermissions) * 100);
                
                return `
                    <div class="role-card ${!role.enabled ? 'disabled' : ''}" data-role="${role.id}">
                        <div class="role-card-header">
                            <div class="role-icon" style="background: ${role.color};">
                                <i class="${role.icon}"></i>
                            </div>
                            <div class="role-status">
                                <span class="status-badge ${role.enabled ? 'enabled' : 'disabled'}">
                                    ${role.enabled ? '启用' : '禁用'}
                                </span>
                            </div>
                        </div>
                        
                        <div class="role-card-body">
                            <h3 class="role-name">${role.name}</h3>
                            <p class="role-description">${role.description}</p>
                            
                            <div class="role-stats">
                                <div class="stat-item">
                                    <span class="stat-label">用户数量</span>
                                    <span class="stat-value">${role.userCount} 人</span>
                                </div>
                                <div class="stat-item">
                                    <span class="stat-label">权限数量</span>
                                    <span class="stat-value">${permissionCount} 项</span>
                                </div>
                            </div>
                            
                            <div class="permission-progress">
                                <div class="progress-header">
                                    <span class="progress-label">权限覆盖率</span>
                                    <span class="progress-percentage">${permissionPercentage}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${permissionPercentage}%; background: ${role.color};"></div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="role-card-actions">
                            <button class="role-action-btn view" onclick="viewRoleDetails('${role.id}')" 
                                    data-tooltip="查看详情">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="role-action-btn edit" onclick="editRole('${role.id}')"
                                    data-tooltip="编辑角色" ${role.id === 'admin' ? 'disabled' : ''}>
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="role-action-btn ${role.enabled ? 'disable' : 'enable'}" 
                                    onclick="toggleRoleStatus('${role.id}')"
                                    data-tooltip="${role.enabled ? '禁用角色' : '启用角色'}"
                                    ${role.id === 'admin' ? 'disabled' : ''}>
                                <i class="fas fa-${role.enabled ? 'ban' : 'check'}"></i>
                            </button>
                            <button class="role-action-btn delete" onclick="deleteRole('${role.id}')"
                                    data-tooltip="删除角色" ${role.id === 'admin' ? 'disabled' : ''}>
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        
                        <div class="role-card-footer">
                            <small class="update-time">
                                最后更新: ${role.updateTime.toLocaleDateString('zh-CN')}
                            </small>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
    
    container.innerHTML = html;
}

// ===== 工具函数 =====

/**
 * 数字动画效果
 */
function animateCountUp(element, targetValue, duration = 1000) {
    const startValue = parseInt(element.textContent.replace(/,/g, '')) || 0;
    const increment = (targetValue - startValue) / (duration / 16);
    let currentValue = startValue;
    
    const timer = setInterval(() => {
        currentValue += increment;
        
        if ((increment > 0 && currentValue >= targetValue) || 
            (increment < 0 && currentValue <= targetValue)) {
            currentValue = targetValue;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(currentValue);
    }, 16);
}

// ===== 事件绑定 =====

/**
 * 绑定事件
 */
function bindEvents() {
    // 搜索框
    const searchInput = document.getElementById('roleSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(handleRoleSearch, 300));
    }
}

/**
 * 处理角色搜索
 */
function handleRoleSearch() {
    renderRoleCards();
}

// ===== 功能函数 =====

/**
 * 切换权限
 */
function togglePermission(roleId, permissionId) {
    const role = roles.find(r => r.id === roleId);
    if (!role || role.id === 'admin') {
        return;
    }
    
    const permissionIndex = role.permissions.indexOf(permissionId);
    if (permissionIndex > -1) {
        role.permissions.splice(permissionIndex, 1);
        showNotification(`已移除角色 ${role.name} 的权限`, 'info');
    } else {
        role.permissions.push(permissionId);
        showNotification(`已授予角色 ${role.name} 新权限`, 'success');
    }
    
    role.updateTime = new Date();
    
    // 更新显示
    renderPermissionMatrix();
    renderRoleCards();
    renderRoleOverview();
}

/**
 * 展开所有权限
 */
function expandAllPermissions() {
    document.querySelectorAll('.permission-group-header').forEach(header => {
        header.classList.add('expanded');
    });
    showNotification('已展开所有权限组', 'info');
}

/**
 * 收起所有权限
 */
function collapseAllPermissions() {
    document.querySelectorAll('.permission-group-header').forEach(header => {
        header.classList.remove('expanded');
    });
    showNotification('已收起所有权限组', 'info');
}

/**
 * 切换角色视图
 */
function toggleRoleView(mode) {
    viewMode = mode;
    
    // 更新按钮状态
    document.querySelectorAll('.role-list-actions .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    renderRoleCards();
}

/**
 * 查看角色详情
 */
function viewRoleDetails(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role) {
        showNotification('角色不存在', 'error');
        return;
    }
    
    // 获取角色权限详情
    const rolePermissions = permissions.filter(p => role.permissions.includes(p.id));
    const groupedPermissions = {};
    
    permissionGroups.forEach(group => {
        const groupPermissions = rolePermissions.filter(p => p.group === group.id);
        if (groupPermissions.length > 0) {
            groupedPermissions[group.id] = {
                group: group,
                permissions: groupPermissions
            };
        }
    });
    
    const content = `
        <div class="role-detail-content">
            <div class="role-basic-info">
                <div class="role-avatar" style="background: ${role.color};">
                    <i class="${role.icon}"></i>
                </div>
                <div class="role-info">
                    <h3>${role.name}</h3>
                    <p>${role.description}</p>
                    <div class="role-meta">
                        <span class="meta-item">
                            <i class="fas fa-users"></i>
                            ${role.userCount} 个用户
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-key"></i>
                            ${role.permissions.length} 项权限
                        </span>
                        <span class="meta-item status-${role.enabled ? 'enabled' : 'disabled'}">
                            <i class="fas fa-${role.enabled ? 'check-circle' : 'ban'}"></i>
                            ${role.enabled ? '已启用' : '已禁用'}
                        </span>
                    </div>
                </div>
            </div>
            
            <div class="role-permissions-detail">
                <h4><i class="fas fa-list"></i> 权限清单</h4>
                ${Object.values(groupedPermissions).map(({ group, permissions: groupPermissions }) => `
                    <div class="permission-group-detail">
                        <h5><i class="${group.icon}"></i> ${group.name}</h5>
                        <div class="permission-items">
                            ${groupPermissions.map(permission => `
                                <div class="permission-item">
                                    <span class="permission-name">${permission.name}</span>
                                    <small class="permission-desc">${permission.description}</small>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="role-timeline">
                <h4><i class="fas fa-history"></i> 更新记录</h4>
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <span class="timeline-action">角色创建</span>
                        <span class="timeline-time">${role.createTime.toLocaleString('zh-CN')}</span>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <span class="timeline-action">最后更新</span>
                        <span class="timeline-time">${role.updateTime.toLocaleString('zh-CN')}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal({
        title: `角色详情 - ${role.name}`,
        content: content,
        actions: [
            { text: '编辑角色', class: 'btn-secondary', onclick: `editRole('${roleId}'); closeModal();` },
            { text: '关闭', class: 'btn-primary', onclick: 'closeModal()' }
        ]
    });
}

/**
 * 编辑角色
 */
function editRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role) {
        showNotification('角色不存在', 'error');
        return;
    }
    
    if (role.id === 'admin') {
        showNotification('系统管理员角色不允许编辑', 'warning');
        return;
    }
    
    currentEditingRole = role;
    
    // 生成权限复选框
    const permissionCheckboxes = permissionGroups.map(group => {
        const groupPermissions = permissions.filter(p => p.group === group.id);
        return `
            <div class="permission-group">
                <h5><i class="${group.icon}"></i> ${group.name}</h5>
                <div class="permission-checkboxes-grid">
                    ${groupPermissions.map(permission => `
                        <label class="permission-checkbox">
                            <input type="checkbox" 
                                   value="${permission.id}" 
                                   ${role.permissions.includes(permission.id) ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            <span class="permission-label">
                                <span class="permission-name">${permission.name}</span>
                                <small class="permission-desc">${permission.description}</small>
                            </span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    const content = `
        <form id="editRoleForm" class="role-form">
            <div class="form-row">
                <div class="form-group">
                    <label class="form-label">角色标识:</label>
                    <input type="text" class="form-control" id="editRoleId" value="${role.id}" readonly>
                    <small class="form-hint">角色标识不可修改</small>
                </div>
                <div class="form-group">
                    <label class="form-label">角色名称:</label>
                    <input type="text" class="form-control" id="editRoleName" value="${role.name}" required>
                </div>
            </div>
            
            <div class="form-group">
                <label class="form-label">角色描述:</label>
                <textarea class="form-control" id="editRoleDescription" rows="3">${role.description}</textarea>
            </div>
            
            <div class="form-group">
                <label class="form-label">权限配置:</label>
                <div class="permission-checkboxes" id="editPermissionCheckboxes">
                    ${permissionCheckboxes}
                </div>
            </div>
            
            <div class="form-group">
                <label class="checkbox-label">
                    <input type="checkbox" id="editRoleEnabled" ${role.enabled ? 'checked' : ''}>
                    <span class="checkmark"></span>
                    启用此角色
                </label>
            </div>
        </form>
    `;
    
    const modal = document.getElementById('editRoleModal');
    const editContent = document.getElementById('roleEditContent');
    if (editContent) {
        editContent.innerHTML = content;
    }
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * 更新角色
 */
function updateRole() {
    if (!currentEditingRole) return;
    
    const form = document.getElementById('editRoleForm');
    if (!form) return;
    
    // 获取表单数据
    const roleName = document.getElementById('editRoleName').value.trim();
    const roleDescription = document.getElementById('editRoleDescription').value.trim();
    const roleEnabled = document.getElementById('editRoleEnabled').checked;
    
    if (!roleName) {
        showNotification('请输入角色名称', 'error');
        return;
    }
    
    // 获取选中的权限
    const selectedPermissions = [];
    document.querySelectorAll('#editPermissionCheckboxes input[type="checkbox"]:checked').forEach(checkbox => {
        selectedPermissions.push(checkbox.value);
    });
    
    // 更新角色信息
    currentEditingRole.name = roleName;
    currentEditingRole.description = roleDescription;
    currentEditingRole.permissions = selectedPermissions;
    currentEditingRole.enabled = roleEnabled;
    currentEditingRole.updateTime = new Date();
    
    // 关闭模态框
    closeEditRoleModal();
    
    // 更新显示
    renderPermissionMatrix();
    renderRoleCards();
    renderRoleOverview();
    
    showNotification(`角色 ${roleName} 更新成功`, 'success');
}

/**
 * 切换角色状态
 */
function toggleRoleStatus(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role || role.id === 'admin') {
        return;
    }
    
    const newStatus = !role.enabled;
    const actionText = newStatus ? '启用' : '禁用';
    
    showConfirm(`确定要${actionText}角色 "${role.name}" 吗？`, () => {
        role.enabled = newStatus;
        role.updateTime = new Date();
        
        renderPermissionMatrix();
        renderRoleCards();
        renderRoleOverview();
        
        showNotification(`角色 ${role.name} 已${actionText}`, 'success');
    });
}

/**
 * 删除角色
 */
function deleteRole(roleId) {
    const role = roles.find(r => r.id === roleId);
    if (!role || role.id === 'admin') {
        return;
    }
    
    if (role.userCount > 0) {
        showNotification(`角色 ${role.name} 下还有 ${role.userCount} 个用户，无法删除`, 'warning');
        return;
    }
    
    showConfirm(`确定要删除角色 "${role.name}" 吗？\n\n此操作不可撤销。`, () => {
        const index = roles.findIndex(r => r.id === roleId);
        if (index > -1) {
            roles.splice(index, 1);
        }
        
        renderPermissionMatrix();
        renderRoleCards();
        renderRoleOverview();
        
        showNotification(`角色 ${role.name} 已删除`, 'success');
    });
}

/**
 * 显示添加角色模态框
 */
function showAddRoleModal() {
    // 生成权限复选框
    const permissionCheckboxes = permissionGroups.map(group => {
        const groupPermissions = permissions.filter(p => p.group === group.id);
        return `
            <div class="permission-group">
                <h5><i class="${group.icon}"></i> ${group.name}</h5>
                <div class="permission-checkboxes-grid">
                    ${groupPermissions.map(permission => `
                        <label class="permission-checkbox">
                            <input type="checkbox" value="${permission.id}">
                            <span class="checkmark"></span>
                            <span class="permission-label">
                                <span class="permission-name">${permission.name}</span>
                                <small class="permission-desc">${permission.description}</small>
                            </span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
    
    const checkboxContainer = document.getElementById('permissionCheckboxes');
    if (checkboxContainer) {
        checkboxContainer.innerHTML = permissionCheckboxes;
    }
    
    const modal = document.getElementById('addRoleModal');
    if (modal) {
        modal.classList.add('show');
    }
}

/**
 * 关闭添加角色模态框
 */
function closeAddRoleModal() {
    const modal = document.getElementById('addRoleModal');
    if (modal) {
        modal.classList.remove('show');
        
        // 重置表单
        const form = document.getElementById('addRoleForm');
        if (form) {
            form.reset();
        }
    }
}

/**
 * 关闭编辑角色模态框
 */
function closeEditRoleModal() {
    const modal = document.getElementById('editRoleModal');
    if (modal) {
        modal.classList.remove('show');
    }
    currentEditingRole = null;
}

/**
 * 保存角色
 */
function saveRole() {
    const form = document.getElementById('addRoleForm');
    if (!form) return;
    
    // 验证必填字段
    const roleId = document.getElementById('roleId').value.trim();
    const roleName = document.getElementById('roleName').value.trim();
    const roleDescription = document.getElementById('roleDescription').value.trim();
    const roleEnabled = document.getElementById('roleEnabled').checked;
    
    if (!roleId || !roleName) {
        showNotification('请填写角色标识和名称', 'error');
        return;
    }
    
    // 验证角色标识唯一性
    if (roles.find(r => r.id === roleId)) {
        showNotification('角色标识已存在', 'error');
        return;
    }
    
    // 获取选中的权限
    const selectedPermissions = [];
    document.querySelectorAll('#permissionCheckboxes input[type="checkbox"]:checked').forEach(checkbox => {
        selectedPermissions.push(checkbox.value);
    });
    
    // 创建新角色
    const newRole = {
        id: roleId,
        name: roleName,
        description: roleDescription || '自定义角色',
        permissions: selectedPermissions,
        userCount: 0,
        enabled: roleEnabled,
        createTime: new Date(),
        updateTime: new Date(),
        color: '#607D8B',
        icon: 'fas fa-user-tag'
    };
    
    // 添加到角色列表
    roles.push(newRole);
    
    // 关闭模态框
    closeAddRoleModal();
    
    // 更新显示
    renderPermissionMatrix();
    renderRoleCards();
    renderRoleOverview();
    
    showNotification(`角色 ${roleName} 添加成功`, 'success');
}

/**
 * 导出角色配置
 */
function exportRoles() {
    showNotification('角色配置导出功能开发中...', 'info');
}

/**
 * 刷新数据
 */
function refreshData() {
    renderRoleOverview();
    renderPermissionMatrix();
    renderRoleCards();
    showNotification('数据已刷新', 'success');
}

// ===== 工具函数 =====

/**
 * 防抖函数（如果common.js中没有定义）
 */
if (typeof debounce === 'undefined') {
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}
 
 
 
 
 
 
 
 
 