/**
 * 影像数据管理页面功能模块
 */

class ImageDataManager {
    constructor() {
        this.currentUser = Auth.getCurrentUser();
        this.editingImageId = null;
        this.uploadedFile = null;
        this.uploadProgress = 0;
        
        // 影像数据
        this.imageData = [
            { id: 1, name: 'GF2_PMS_20240115_临夏小麦', type: '高分2号', crop: '小麦', dataTime: '2024-01-15 02:30:00', uploadTime: '2024-01-15 10:00:00', size: '245MB', remark: '春小麦监测数据' },
            { id: 2, name: 'S2A_MSIL1C_20240116_玉米长势', type: 'Sentinel-2', crop: '玉米', dataTime: '2024-01-16 03:15:00', uploadTime: '2024-01-16 11:30:00', size: '180MB', remark: '夏玉米长势监测' },
            { id: 3, name: 'LC8_OLI_20240117_青稞种植', type: 'Landsat-8', crop: '青稞', dataTime: '2024-01-17 01:45:00', uploadTime: '2024-01-17 09:20:00', size: '295MB', remark: '高海拔青稞种植区' },
            { id: 4, name: 'GF1_WFV_20240118_小麦分布', type: '高分1号', crop: '小麦', dataTime: '2024-01-18 02:45:00', uploadTime: '2024-01-18 10:15:00', size: '138MB', remark: '冬小麦分布调查' },
            { id: 5, name: 'WV3_MS_20240119_土豆基地', type: 'WorldView', crop: '土豆', dataTime: '2024-01-19 03:30:00', uploadTime: '2024-01-19 11:45:00', size: '412MB', remark: '马铃薯种植基地' },
            { id: 6, name: 'MOD09GA_20240120_农作物', type: 'MODIS', crop: '玉米', dataTime: '2024-01-20 01:20:00', uploadTime: '2024-01-20 09:35:00', size: '88MB', remark: '大范围农作物监测' },
            { id: 7, name: 'GF2_PMS_20240121_油菜花期', type: '高分2号', crop: '油菜', dataTime: '2024-01-21 02:10:00', uploadTime: '2024-01-21 10:30:00', size: '267MB', remark: '春季油菜花期监测' },
            { id: 8, name: 'S2B_MSIL1C_20240122_豌豆', type: 'Sentinel-2', crop: '豌豆', dataTime: '2024-01-22 03:25:00', uploadTime: '2024-01-22 11:00:00', size: '198MB', remark: '豌豆生长期监测' }
        ];
        
        this.init();
    }
    
    init() {
        this.initUserInfo();
        this.bindEvents();
        this.loadImageData();
    }
    
    initUserInfo() {
        if (this.currentUser) {
            const userNameEl = document.getElementById('currentUserName');
            const userRoleEl = document.getElementById('currentUserRole');
            
            if (userNameEl) userNameEl.textContent = this.currentUser.name;
            if (userRoleEl) {
                userRoleEl.textContent = this.currentUser.role === 'superadmin' ? '超级管理员' : '乡镇管理员';
            }
        }
    }
    
    bindEvents() {
        // 搜索和筛选事件
        const imageSearchInput = document.getElementById('imageSearchInput');
        if (imageSearchInput) {
            imageSearchInput.addEventListener('input', Utils.debounce(() => {
                this.loadImageData();
            }, 300));
        }

        const imageTypeFilter = document.getElementById('imageTypeFilter');
        if (imageTypeFilter) {
            imageTypeFilter.addEventListener('change', () => {
                this.loadImageData();
            });
        }

        // 文件上传事件
        this.bindUploadEvents();

        // 模态框事件
        this.bindModalEvents();
        
        // 表单提交事件
        const imageForm = document.getElementById('imageForm');
        if (imageForm) {
            imageForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveImage();
            });
        }
    }

    bindUploadEvents() {
        const uploadArea = document.getElementById('uploadArea');
        const imageFile = document.getElementById('imageFile');
        const uploadContent = document.getElementById('uploadContent');

        if (!uploadArea || !imageFile) return;

        // 点击上传区域触发文件选择
        uploadArea.addEventListener('click', () => {
            if (!uploadArea.classList.contains('uploading')) {
                imageFile.click();
            }
        });

        // 拖拽上传
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFileSelect(files[0]);
            }
        });

        // 文件选择
        imageFile.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileSelect(e.target.files[0]);
            }
        });

        // 移除文件按钮
        const removeFileBtn = document.getElementById('removeFileBtn');
        if (removeFileBtn) {
            removeFileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeUploadedFile();
            });
        }
    }

    bindModalEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => {
            const modal = document.querySelector('.modal-overlay.show');
            if (e.key === 'Escape' && modal && modal.classList.contains('show')) {
                this.closeModal(modal);
            }
        });

        // 点击遮罩关闭模态框
        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    // 处理文件选择
    handleFileSelect(file) {
        // 验证文件类型
        const allowedTypes = ['.tiff', '.tif', '.jp2', '.img', '.hdf', '.nc', '.geotiff'];
        const fileName = file.name.toLowerCase();
        const isValidType = allowedTypes.some(type => fileName.endsWith(type.replace('.', '')));

        if (!isValidType) {
            Utils.showMessage('请选择支持的影像文件格式', 'error');
            return;
        }

        // 验证文件大小 (500MB)
        const maxSize = 500 * 1024 * 1024;
        if (file.size > maxSize) {
            Utils.showMessage('文件大小不能超过500MB', 'error');
            return;
        }

        this.uploadedFile = file;
        this.showUploadedFile(file);
        
        // 自动填充影像名称
        const nameInput = document.getElementById('imageName');
        if (nameInput && !nameInput.value) {
            nameInput.value = file.name.replace(/\.[^/.]+$/, ''); // 去掉扩展名
        }

        // 自动填充文件大小
        const sizeInput = document.getElementById('imageSize');
        if (sizeInput) {
            sizeInput.value = this.formatFileSize(file.size);
        }

        // 设置上传时间
        const uploadTimeInput = document.getElementById('imageUploadTime');
        if (uploadTimeInput) {
            uploadTimeInput.value = Utils.formatDate(new Date());
        }
    }

    // 显示已上传文件
    showUploadedFile(file) {
        const uploadContent = document.getElementById('uploadContent');
        const uploadedFile = document.getElementById('uploadedFile');
        const uploadedFileName = document.getElementById('uploadedFileName');
        const uploadedFileSize = document.getElementById('uploadedFileSize');

        if (uploadContent) uploadContent.style.display = 'none';
        if (uploadedFile) uploadedFile.style.display = 'block';
        if (uploadedFileName) uploadedFileName.textContent = file.name;
        if (uploadedFileSize) uploadedFileSize.textContent = this.formatFileSize(file.size);
    }

    // 移除已上传文件
    removeUploadedFile() {
        this.uploadedFile = null;
        
        const uploadContent = document.getElementById('uploadContent');
        const uploadedFile = document.getElementById('uploadedFile');
        const imageFile = document.getElementById('imageFile');

        if (uploadContent) uploadContent.style.display = 'block';
        if (uploadedFile) uploadedFile.style.display = 'none';
        if (imageFile) imageFile.value = '';

        // 清空自动填充的字段
        document.getElementById('imageName').value = '';
        document.getElementById('imageSize').value = '';
        document.getElementById('imageUploadTime').value = '';
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // 加载影像数据
    loadImageData() {
        const tableBody = document.getElementById('imageDataTableBody');
        if (!tableBody) return;

        let filteredData = [...this.imageData];

        // 搜索过滤
        const searchInput = document.getElementById('imageSearchInput');
        if (searchInput && searchInput.value.trim()) {
            const searchTerm = searchInput.value.trim().toLowerCase();
            filteredData = filteredData.filter(image => 
                image.name.toLowerCase().includes(searchTerm) ||
                image.type.toLowerCase().includes(searchTerm) ||
                image.crop.toLowerCase().includes(searchTerm)
            );
        }

        // 类型筛选
        const typeFilter = document.getElementById('imageTypeFilter');
        if (typeFilter && typeFilter.value) {
            filteredData = filteredData.filter(image => image.type === typeFilter.value);
        }

        if (filteredData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">暂无数据</td></tr>';
            return;
        }

        const html = filteredData.map(image => `
            <tr>
                <td>
                    <div class="image-name-cell">
                        <i class="fas fa-file-image image-icon"></i>
                        <span class="image-name" title="${image.name}">${this.truncateText(image.name, 25)}</span>
                    </div>
                </td>
                <td>
                    <span class="type-badge type-${this.getTypeClass(image.type)}">${image.type}</span>
                </td>
                <td>
                    <span class="crop-badge">${image.crop}</span>
                </td>
                <td>${Utils.formatDate(image.dataTime, 'MM-DD HH:mm')}</td>
                <td>${Utils.formatDate(image.uploadTime, 'MM-DD HH:mm')}</td>
                <td>
                    <span class="file-size">${image.size}</span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline" onclick="window.imageManager.downloadImage(${image.id})" title="下载">
                            <i class="fas fa-download"></i>
                        </button>
                        <button class="btn btn-sm btn-primary" onclick="window.imageManager.editImage(${image.id})" title="编辑">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="window.imageManager.deleteImage(${image.id})" title="删除">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');

        tableBody.innerHTML = html;
    }

    // 获取类型样式类名
    getTypeClass(type) {
        const typeMap = {
            'Landsat-8': 'landsat',
            'Sentinel-2': 'sentinel',
            'MODIS': 'modis',
            '高分2号': 'gf2',
            '高分1号': 'gf1',
            'WorldView': 'worldview',
            '资源3号': 'zy3',
            '吉林一号': 'jl1'
        };
        return typeMap[type] || 'default';
    }

    // 截断文本
    truncateText(text, maxLength) {
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }

    // 显示新增影像模态框
    showAddImageModal() {
        this.editingImageId = null;
        this.resetImageForm();
        document.getElementById('imageModalTitle').textContent = '新增影像数据';
        this.showModal('imageModal');
    }

    // 编辑影像
    editImage(id) {
        const image = this.imageData.find(i => i.id === id);
        if (!image) return;

        this.editingImageId = id;
        this.fillImageForm(image);
        document.getElementById('imageModalTitle').textContent = '编辑影像数据';
        this.showModal('imageModal');
    }

    // 下载影像
    downloadImage(id) {
        const image = this.imageData.find(i => i.id === id);
        if (!image) return;

        // 模拟下载过程
        Utils.showMessage(`开始下载 ${image.name}`, 'success');
        
        // 实际项目中这里应该是真实的下载逻辑
        console.log('下载影像:', image);
    }

    // 删除影像
    deleteImage(id) {
        const image = this.imageData.find(i => i.id === id);
        if (!image) return;

        if (confirm(`确定要删除影像 "${image.name}" 吗？此操作不可恢复。`)) {
            const index = this.imageData.findIndex(i => i.id === id);
            if (index !== -1) {
                this.imageData.splice(index, 1);
                Utils.showMessage('影像数据删除成功', 'success');
                this.loadImageData();
            }
        }
    }

    // 重置表单
    resetImageForm() {
        const form = document.getElementById('imageForm');
        if (form) {
            form.reset();
        }
        this.removeUploadedFile();
    }

    // 填充表单数据
    fillImageForm(image) {
        document.getElementById('imageName').value = image.name;
        document.getElementById('imageType').value = image.type;
        document.getElementById('imageCrop').value = image.crop;
        document.getElementById('imageDataTime').value = image.dataTime.replace(' ', 'T');
        document.getElementById('imageSize').value = image.size;
        document.getElementById('imageUploadTime').value = image.uploadTime;
        document.getElementById('imageRemark').value = image.remark || '';
    }

    // 保存影像数据
    saveImage() {
        const formData = {
            name: document.getElementById('imageName').value.trim(),
            type: document.getElementById('imageType').value,
            crop: document.getElementById('imageCrop').value,
            dataTime: document.getElementById('imageDataTime').value,
            size: document.getElementById('imageSize').value.trim(),
            uploadTime: document.getElementById('imageUploadTime').value.trim(),
            remark: document.getElementById('imageRemark').value.trim()
        };

        // 验证必填字段
        if (!formData.name || !formData.type || !formData.crop || !formData.dataTime) {
            Utils.showMessage('请填写所有必填字段', 'error');
            return;
        }

        // 新增时验证文件上传
        if (!this.editingImageId && !this.uploadedFile) {
            Utils.showMessage('请选择要上传的影像文件', 'error');
            return;
        }

        // 检查影像名称重复（编辑时排除自身）
        const existingImage = this.imageData.find(i => 
            i.name === formData.name && i.id !== this.editingImageId
        );
        if (existingImage) {
            Utils.showMessage('影像名称已存在', 'error');
            return;
        }

        const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

        if (this.editingImageId) {
            // 编辑模式
            const index = this.imageData.findIndex(i => i.id === this.editingImageId);
            if (index !== -1) {
                this.imageData[index] = {
                    ...this.imageData[index],
                    ...formData,
                    dataTime: formData.dataTime.replace('T', ' ')
                };
                Utils.showMessage('影像数据更新成功', 'success');
            }
        } else {
            // 新增模式
            const newId = Math.max(...this.imageData.map(i => i.id), 0) + 1;
            this.imageData.push({
                id: newId,
                ...formData,
                dataTime: formData.dataTime.replace('T', ' '),
                uploadTime: formData.uploadTime || now
            });
            Utils.showMessage('影像数据添加成功', 'success');
        }

        this.closeImageModal();
        this.loadImageData();
    }

    // 模态框控制
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal(modal) {
        if (typeof modal === 'string') {
            modal = document.getElementById(modal);
        }
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    closeImageModal() {
        this.editingImageId = null;
        this.removeUploadedFile();
        this.closeModal('imageModal');
    }
}

// 全局函数
function showAddImageModal() {
    if (window.imageManager) {
        window.imageManager.showAddImageModal();
    }
}

function closeImageModal() {
    if (window.imageManager) {
        window.imageManager.closeImageModal();
    }
}

function saveImage() {
    if (window.imageManager) {
        window.imageManager.saveImage();
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.imageManager = new ImageDataManager();
});
