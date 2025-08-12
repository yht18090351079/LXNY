/**
 * 评论系统组件 - 类似 Axure/墨刀 的评论功能
 * 支持在页面任意位置添加评论标记，管理评论状态
 */
class CommentSystem {
    constructor(options = {}) {
        this.options = {
            container: options.container || document.body,
            autoSave: options.autoSave !== false,
            apiBaseUrl: options.apiBaseUrl || 'http://localhost:3000/api',
            jsonFilePath: options.jsonFilePath || './comments-data.json',
            defaultAuthor: options.defaultAuthor || '匿名用户',
            ...options
        };
        
        this.comments = [];
        this.commentCounter = 0;
        this.isCommentMode = false;
        this.commentsVisible = false;
        this.selectedComment = null;
        this.currentEditingComment = null;
        
        // 异步初始化
        this.init().catch(error => {
            console.error('评论系统初始化失败:', error);
        });
    }
    
    async init() {
        await this.loadComments();
        this.bindEvents();

        this.setDefaultAuthor();
        this.startPositionUpdater();
        
        // 确保初始化完成后快速更新所有标记位置
        setTimeout(() => {
            if (window.commentDebug) {
                console.log('🔄 系统初始化完成，更新所有标记位置...');
            }
            this.updateAllMarkerPositions();
        }, 100);
    }
    
    setDefaultAuthor() {
        const authorInput = document.getElementById('comment-author');
        if (authorInput) {
            authorInput.value = this.options.defaultAuthor;
        }
    }
    
    bindEvents() {
        // 工具栏事件
        document.getElementById('toggle-comment-mode')?.addEventListener('click', () => {
            this.toggleCommentMode();
        });
        
        document.getElementById('toggle-comments-visibility')?.addEventListener('click', () => {
            this.toggleCommentsVisibility();
        });
        
        document.getElementById('open-comment-list')?.addEventListener('click', () => {
            this.openPanel();
        });
        
        // 面板事件
        document.getElementById('close-panel')?.addEventListener('click', () => {
            this.closePanel();
        });
        
        // 模态框事件
        document.getElementById('close-modal')?.addEventListener('click', () => {
            this.closeModal();
        });
        
        document.getElementById('save-comment')?.addEventListener('click', () => {
            this.saveComment();
        });
        
        document.getElementById('cancel-comment')?.addEventListener('click', () => {
            this.closeModal();
        });
        
        // 弹窗事件
        document.getElementById('comment-detail-popup')?.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // 点击页面其他地方关闭弹窗
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.comment-popup') && !e.target.closest('.comment-marker')) {
                this.closePopup();
            }
        });
        
        // 页面点击事件（添加评论）
        this.options.container.addEventListener('click', (e) => {
            if (window.commentDebug) {
                console.log('🖱️ 页面点击事件:', {
                    isCommentMode: this.isCommentMode,
                    targetElement: e.target,
                    isCommentSystem: !!e.target.closest('#comment-system')
                });
            }
            
            if (this.isCommentMode && !e.target.closest('#comment-system')) {
                if (window.commentDebug) {
                    console.log('✅ 准备添加评论到位置:', e.clientX, e.clientY);
                }
                this.addCommentAtPosition(e.clientX, e.clientY);
            } else if (!this.isCommentMode) {
                console.log('⚠️ 评论模式未激活 - 请先点击"评论模式"按钮');
            }
        });
        
        // ESC键关闭弹窗（保留基本的ESC关闭功能）
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
                this.closePopup();
            }
        });
        
        // 模态框点击外部关闭
        document.getElementById('comment-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'comment-modal') {
                this.closeModal();
            }
        });
    }
    
    toggleCommentMode() {
        this.isCommentMode = !this.isCommentMode;
        const btn = document.getElementById('toggle-comment-mode');
        
        if (window.commentDebug) {
            console.log('🔄 切换评论模式:', this.isCommentMode ? '激活' : '关闭');
        }
        
        if (this.isCommentMode) {
            btn.classList.add('active');
            btn.querySelector('.btn-text').textContent = '退出评论';
            this.options.container.style.cursor = 'crosshair';
            console.log('✅ 评论模式已激活 - 现在可以点击页面添加评论');
        } else {
            btn.classList.remove('active');
            btn.querySelector('.btn-text').textContent = '评论模式';
            this.options.container.style.cursor = 'default';
            console.log('❌ 评论模式已关闭');
        }
    }
    
    toggleCommentsVisibility() {
        this.commentsVisible = !this.commentsVisible;
        const btn = document.getElementById('toggle-comments-visibility');
        const markers = document.querySelectorAll('.comment-marker');
        
        markers.forEach(marker => {
            if (this.commentsVisible) {
                marker.classList.remove('hidden');
            } else {
                marker.classList.add('hidden');
            }
        });
        
        btn.querySelector('.btn-text').textContent = this.commentsVisible ? '隐藏评论' : '显示评论';
    }
    
    addCommentAtPosition(x, y) {
        // 找到点击位置的目标元素
        const targetElement = document.elementFromPoint(x, y);
        if (!targetElement || targetElement.closest('#comment-system')) {
            return; // 如果点击的是评论系统本身，不添加评论
        }
        
        // 计算相对于目标元素的偏移量
        const targetRect = targetElement.getBoundingClientRect();
        const offsetX = x - targetRect.left;
        const offsetY = y - targetRect.top;
        
        // 生成元素的唯一标识符
        const elementSelector = this.generateElementSelector(targetElement);
        
        this.currentEditingComment = {
            id: null,
            targetElement: elementSelector,
            offsetX: offsetX,
            offsetY: offsetY,
            isNew: true
        };
        
        this.showModal('添加评论');
    }
    
    showModal(title, comment = null) {
        console.log('🔧 尝试显示模态框:', title);
        
        const modal = document.getElementById('comment-modal');
        const modalTitle = document.getElementById('modal-title');
        const authorInput = document.getElementById('comment-author');
        const contentInput = document.getElementById('comment-content');
        const prioritySelect = document.getElementById('comment-priority');
        
        if (!modal) {
            console.error('❌ 找不到模态框元素: #comment-modal');
            return;
        }
        
        console.log('✅ 模态框元素存在，设置内容...');
        
        modalTitle.textContent = title;
        
        if (comment) {
            authorInput.value = comment.author;
            contentInput.value = comment.content;
            prioritySelect.value = comment.priority;
        } else {
            authorInput.value = this.options.defaultAuthor;
            contentInput.value = '';
            prioritySelect.value = 'normal';
        }
        
        console.log('🎭 添加visible类显示模态框...');
        modal.classList.add('visible');
        contentInput.focus();
        
        console.log('✅ 模态框应该已显示，当前类名:', modal.className);
    }
    
    closeModal() {
        const modal = document.getElementById('comment-modal');
        modal.classList.remove('visible');
        this.currentEditingComment = null;
    }
    
    saveComment() {
        const authorInput = document.getElementById('comment-author');
        const contentInput = document.getElementById('comment-content');
        const prioritySelect = document.getElementById('comment-priority');
        
        const author = authorInput.value.trim();
        const content = contentInput.value.trim();
        const priority = prioritySelect.value;
        
        if (!content) {
            alert('请输入评论内容');
            return;
        }
        
        if (this.currentEditingComment.isNew) {
            // 添加新评论
            const comment = {
                id: ++this.commentCounter,
                targetElement: this.currentEditingComment.targetElement,
                offsetX: this.currentEditingComment.offsetX,
                offsetY: this.currentEditingComment.offsetY,
                author: author || this.options.defaultAuthor,
                content: content,
                priority: priority,
                status: 'unresolved',
                timestamp: new Date().toISOString(),
                replies: []
            };
            
            this.comments.push(comment);
            this.createMarker(comment);
        } else {
            // 编辑现有评论
            const comment = this.comments.find(c => c.id === this.currentEditingComment.id);
            if (comment) {
                comment.author = author || this.options.defaultAuthor;
                comment.content = content;
                comment.priority = priority;
                
                this.updateMarker(comment);
            }
        }
        
        this.updateCommentsList();

        this.saveToStorage();
        this.closeModal();
    }
    
    createMarker(comment) {
        const marker = document.createElement('div');
        marker.className = 'comment-marker';
        marker.dataset.commentId = comment.id;
        marker.textContent = comment.id;
        
        // 设置z-index，确保层级正确
        marker.style.zIndex = 1000 + comment.id;
        
        this.updateMarkerStyle(marker, comment);
        this.updateMarkerPosition(marker, comment);
        
        marker.addEventListener('click', (e) => {
            e.stopPropagation();
            // 临时提升z-index到最高层
            marker.style.zIndex = 10000;
            this.showCommentPopup(comment, e.clientX, e.clientY);
        });
        
        document.getElementById('comment-markers').appendChild(marker);
        
        if (!this.commentsVisible) {
            marker.classList.add('hidden');
        }
        
        // 添加到位置更新队列
        this.addToPositionUpdateQueue(comment.id);
    }
    
    updateMarker(comment) {
        const marker = document.querySelector(`[data-comment-id="${comment.id}"]`);
        if (marker) {
            this.updateMarkerStyle(marker, comment);
        }
    }
    
    updateMarkerStyle(marker, comment) {
        marker.className = 'comment-marker';
        
        if (comment.status === 'resolved') {
            marker.classList.add('resolved');
        }
        
        if (comment.priority === 'high') {
            marker.classList.add('high-priority');
        } else if (comment.priority === 'urgent') {
            marker.classList.add('urgent-priority');
        }
        
        if (!this.commentsVisible) {
            marker.classList.add('hidden');
        }
    }
    
    showCommentPopup(comment, x, y) {
        console.log('显示评论弹窗:', comment, 'at', x, y);
        const popup = document.getElementById('comment-detail-popup');
        
        if (!popup) {
            console.error('找不到评论弹窗元素 #comment-detail-popup');
            return;
        }
        
        const popupContent = popup.querySelector('.popup-content');
        
        // 更新弹窗内容
        this.updatePopupContent(comment);
        
        // 显示弹窗
        popup.classList.add('visible');
        console.log('弹窗类名:', popup.className);
        
        // 使用固定定位，居中显示
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        
        // 居中显示弹窗
        popup.style.left = '50%';
        popup.style.top = '50%';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
        
        this.selectedComment = comment;
        this.bindPopupEvents(comment);
    }
    
    updatePopupContent(comment) {
        console.log('更新弹窗内容:', comment);
        const popup = document.getElementById('comment-detail-popup');
        
        // 检查必要的元素是否存在
        const numberEl = popup.querySelector('.comment-number');
        const authorEl = popup.querySelector('.comment-author');
        const timeEl = popup.querySelector('.comment-time');
        
        console.log('弹窗元素检查:', {
            popup: !!popup,
            numberEl: !!numberEl,
            authorEl: !!authorEl,
            timeEl: !!timeEl
        });
        
        // 更新标题信息
        if (numberEl) numberEl.textContent = `#${comment.id}`;
        if (authorEl) authorEl.textContent = comment.author;
        if (timeEl) timeEl.textContent = this.formatTime(comment.timestamp);
        
        // 更新内容
        popup.querySelector('.comment-content-display').textContent = comment.content;
        
        // 更新优先级标签
        const priorityBadge = popup.querySelector('.priority-badge');
        
        priorityBadge.className = `priority-badge ${comment.priority}`;
        priorityBadge.textContent = this.getPriorityText(comment.priority);
        

    }
    

    
    bindPopupEvents(comment) {
        const popup = document.getElementById('comment-detail-popup');
        
        // 关闭按钮
        const closeBtn = popup.querySelector('.close-popup-btn');
        if (closeBtn) {
            closeBtn.onclick = () => {
                this.closePopup();
            };
        }
        
        // 编辑按钮
        const editBtn = popup.querySelector('.edit-btn');
        if (editBtn) {
            editBtn.onclick = () => {
                this.editComment(comment);
            };
        }
        
        // 删除按钮
        const deleteBtn = popup.querySelector('.delete-btn');
        if (deleteBtn) {
            deleteBtn.onclick = () => {
                this.deleteComment(comment);
            };
        }
    }
    
    editComment(comment) {
        console.log('✏️ 编辑评论:', comment.id);
        
        this.currentEditingComment = {
            id: comment.id,
            targetElement: comment.targetElement,
            offsetX: comment.offsetX,
            offsetY: comment.offsetY,
            isNew: false
        };
        
        this.showModal('编辑评论', comment);
        this.closePopup();
    }
    
    deleteComment(comment) {
        if (confirm(`确定要删除评论 #${comment.id} 吗？\n\n"${comment.content}"`)) {
            console.log('🗑️ 删除评论:', comment.id);
            
            // 删除标记
            const marker = document.querySelector(`[data-comment-id="${comment.id}"]`);
            if (marker) {
                marker.remove();
            }
            
            // 从数组中删除
            this.comments = this.comments.filter(c => c.id !== comment.id);
            
            // 更新界面
            this.updateCommentsList();
            this.saveToStorage();
            this.closePopup();
            
            console.log('✅ 评论删除成功');
        }
    }
    
    closePopup() {
        const popup = document.getElementById('comment-detail-popup');
        popup.classList.remove('visible');
        
        // 恢复所有标记的z-index
        if (this.selectedComment) {
            const marker = document.querySelector(`[data-comment-id="${this.selectedComment.id}"]`);
            if (marker) {
                marker.style.zIndex = 1000 + this.selectedComment.id;
            }
        }
        
        this.selectedComment = null;
    }
    
    updateCommentsList() {
        const commentsList = document.getElementById('comments-list');
        
        if (this.comments.length === 0) {
            commentsList.innerHTML = `
                <div class="no-comments">
                    <div class="no-comments-icon">💬</div>
                    <div>暂无评论</div>
                </div>
            `;
            return;
        }
        
        commentsList.innerHTML = '';
        
        // 按创建时间倒序排列
        const sortedComments = [...this.comments].sort((a, b) => 
            new Date(b.timestamp) - new Date(a.timestamp)
        );
        
        sortedComments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment-item';
            commentElement.dataset.commentId = comment.id;
            
            commentElement.innerHTML = `
                <div class="comment-header">
                    <div class="comment-header-left">
                        <span class="comment-number">#${comment.id}</span>
                        <div class="comment-meta">
                            <span class="comment-author">${comment.author}</span>
                            <span class="comment-time">${this.formatTime(comment.timestamp)}</span>
                        </div>
                    </div>

                </div>
                <div class="comment-content">${comment.content}</div>
                <div class="comment-footer">
                    <div class="comment-badges">
                        <span class="priority-badge ${comment.priority}">
                            ${this.getPriorityText(comment.priority)}
                        </span>
                    </div>
                    <div class="comment-actions">
                        <button class="action-btn edit-btn" title="编辑">✏️</button>
                        <button class="action-btn delete-btn" title="删除">🗑️</button>
                    </div>
                </div>
            `;
            
            // 绑定事件
            commentElement.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    const marker = document.querySelector(`[data-comment-id="${comment.id}"]`);
                    if (marker) {
                        const rect = marker.getBoundingClientRect();
                        this.showCommentPopup(comment, rect.right + 10, rect.top);
                    }
                }
            });
            
            // 绑定操作按钮事件
            const editBtn = commentElement.querySelector('.edit-btn');
            const deleteBtn = commentElement.querySelector('.delete-btn');
            
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editComment(comment);
            });
            
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteComment(comment);
            });
            
            commentsList.appendChild(commentElement);
        });
    }
    

    
    openPanel() {
        const panel = document.getElementById('comment-panel');
        panel.classList.add('visible');
        this.updateCommentsList();
    }
    
    closePanel() {
        const panel = document.getElementById('comment-panel');
        panel.classList.remove('visible');
    }
    
    getPriorityText(priority) {
        const priorityTexts = {
            low: '低',
            normal: '普通',
            high: '高',
            urgent: '紧急'
        };
        return priorityTexts[priority] || '普通';
    }
    
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // 1分钟内
            return '刚刚';
        } else if (diff < 3600000) { // 1小时内
            return Math.floor(diff / 60000) + '分钟前';
        } else if (diff < 86400000) { // 1天内
            return Math.floor(diff / 3600000) + '小时前';
        } else if (diff < 604800000) { // 1周内
            return Math.floor(diff / 86400000) + '天前';
        } else {
            return date.toLocaleDateString('zh-CN') + ' ' + 
                   date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
        }
    }
    
    saveToStorage() {
        // 自动保存到JSON文件
        this.saveToJsonFileAuto();
    }
    
    async saveToJsonFileAuto() {
        // 自动保存到Node.js服务器
        const data = {
            comments: this.comments,
            commentCounter: this.commentCounter,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        
        try {
            const response = await fetch(`${this.options.apiBaseUrl}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ 评论已自动保存到服务器:', result.message);
                // 清理缓存
                localStorage.removeItem('comment-system-cache');
                return true;
            } else {
                throw new Error(`服务器响应错误: ${response.status}`);
            }
        } catch (error) {
            // 备用方案：保存到localStorage作为缓存
            localStorage.setItem('comment-system-cache', JSON.stringify(data));
            console.log('⚠️ 无法连接到服务器，已保存到本地缓存');
            
            if (window.commentDebug) {
                console.warn('自动保存失败:', error.message);
                console.log('请确保Node.js服务器正在运行: npm start');
            }
            return false;
        }
    }
    
    async saveToJsonFile() {
        const data = {
            comments: this.comments,
            commentCounter: this.commentCounter,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        
        const jsonString = JSON.stringify(data, null, 2);
        
        try {
            // 使用File System Access API保存到指定位置
            if ('showSaveFilePicker' in window) {
                const fileHandle = await window.showSaveFilePicker({
                    suggestedName: 'comments-data.json',
                    startIn: 'downloads',
                    types: [{
                        description: 'JSON files',
                        accept: { 'application/json': ['.json'] }
                    }]
                });
                
                const writable = await fileHandle.createWritable();
                await writable.write(jsonString);
                await writable.close();
                
                // 清理缓存
                localStorage.removeItem('comment-system-cache');
                
                console.log('评论数据已保存到JSON文件');
                return true;
            } else {
                // 备用方案：下载文件
                const blob = new Blob([jsonString], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'comments-data.json';
                a.style.display = 'none';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                
                // 清理缓存
                localStorage.removeItem('comment-system-cache');
                
                console.log('评论数据已下载，请将文件保存到 comment-component 文件夹');
                return true;
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log('用户取消了保存操作');
                return false;
            }
            console.error('保存JSON文件失败:', error);
            alert('保存失败: ' + error.message);
            return false;
        }
    }
    
    async loadComments() {
        // 从Node.js服务器加载评论数据
        console.log('开始从服务器加载评论数据...');
        
        try {
            const response = await fetch(`${this.options.apiBaseUrl}/comments`, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            });
            
            console.log('服务器响应状态:', response.status, response.statusText);
            
            if (response.ok) {
                const data = await response.json();
                console.log('从服务器获取的数据:', data);
                
                this.comments = data.comments || [];
                this.commentCounter = data.commentCounter || 0;
                
                // 清理和修复数据
                this.comments = this.comments.map(comment => {
                    return this.cleanCommentData(comment);
                }).filter(comment => comment !== null);
                
                // 重新创建标记
                this.comments.forEach(comment => {
                    this.createMarker(comment);
                });
                
                // 快速更新位置，确保页面元素已完全渲染
                setTimeout(() => {
                    this.updateAllMarkerPositions();
                }, 100);
                
                console.log(`✅ 从服务器成功加载了 ${this.comments.length} 条评论`);
            } else {
                throw new Error(`服务器响应错误: ${response.status}`);
            }
        } catch (error) {
            console.warn('❌ 无法从服务器加载数据:', error.message);
            console.log('尝试从本地缓存加载...');
            
            // 备用方案：从localStorage加载
            this.loadFromCache();
        }
        
        console.log('📌 最终评论数量:', this.comments.length);
        console.log('📌 评论计数器:', this.commentCounter);
    }
    
    loadFromCache() {
        // 只在JSON文件不存在时才从缓存加载
        const cached = localStorage.getItem('comment-system-cache');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                this.comments = data.comments || [];
                this.commentCounter = data.commentCounter || 0;
                
                // 清理和修复数据
                this.comments = this.comments.map(comment => {
                    return this.cleanCommentData(comment);
                }).filter(comment => comment !== null);
                
                // 重新创建标记
                this.comments.forEach(comment => {
                    this.createMarker(comment);
                });
                
                console.log(`从缓存加载了 ${this.comments.length} 条评论（未保存到文件）`);
                
                // 提醒用户保存
                if (this.comments.length > 0) {
                    setTimeout(() => {
                        console.warn('提醒：您有未保存到文件的评论数据，请点击"保存到文件"按钮');
                    }, 2000);
                }
            } catch (e) {
                console.error('缓存数据解析失败:', e);
            }
        } else {
            console.log('没有找到任何评论数据');
        }
    }
    
    // 清理评论数据
    cleanCommentData(comment) {
        if (!comment || typeof comment !== 'object') {
            return null;
        }
        
        // 修复targetElement字段
        if (comment.targetElement && typeof comment.targetElement === 'object') {
            if (comment.targetElement.path) {
                comment.targetElement = comment.targetElement.path;
            } else {
                console.warn('删除无效的评论数据:', comment);
                return null;
            }
        }
        
        // 确保必要字段存在
        if (!comment.id || !comment.targetElement || typeof comment.targetElement !== 'string') {
            console.warn('删除不完整的评论数据:', comment);
            return null;
        }
        
        // 确保数值字段正确
        comment.offsetX = Number(comment.offsetX) || 0;
        comment.offsetY = Number(comment.offsetY) || 0;
        
        return comment;
    }
    
    // 公共API方法
    exportComments() {
        return {
            comments: this.comments,
            exportTime: new Date().toISOString(),
            version: '1.0.0'
        };
    }
    
    importComments(data) {
        if (data && data.comments && Array.isArray(data.comments)) {
            // 清除现有评论
            this.clearAllComments();
            
            // 导入新评论
            this.comments = data.comments;
            this.commentCounter = Math.max(...this.comments.map(c => c.id), 0);
            
            // 重新创建标记
            this.comments.forEach(comment => {
                this.createMarker(comment);
            });
            
            this.updateCommentsList();
    
            this.saveToStorage();
        }
    }
    
    clearAllComments() {
        // 删除所有标记
        document.getElementById('comment-markers').innerHTML = '';
        
        // 清空数据
        this.comments = [];
        this.commentCounter = 0;
        
        this.updateCommentsList();

        this.saveToStorage();
    }
    
    getCommentById(id) {
        return this.comments.find(c => c.id === id);
    }
    
    getCommentsByStatus(status) {
        return this.comments.filter(c => c.status === status);
    }
    
    getCommentsByPriority(priority) {
        return this.comments.filter(c => c.priority === priority);
    }
    
    // 生成元素的唯一选择器
    generateElementSelector(element) {
        if (element.id) {
            return `#${element.id}`;
        }
        
        // 尝试使用类名选择器
        if (element.className) {
            const classes = element.className.split(' ').filter(c => c.trim());
            if (classes.length > 0) {
                const classSelector = '.' + classes.join('.');
                // 检查是否唯一
                try {
                    const elements = document.querySelectorAll(classSelector);
                    if (elements.length === 1) {
                        return classSelector;
                    }
                } catch (e) {
                    // 忽略选择器错误
                }
            }
        }
        
        // 生成基于位置的选择器
        let path = [];
        let current = element;
        
        while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
            let selector = current.nodeName.toLowerCase();
            
            // 优先使用ID
            if (current.id) {
                selector = `#${current.id}`;
                path.unshift(selector);
                break;
            }
            
            // 添加类名（但要处理特殊字符）
            if (current.className) {
                const classes = current.className.split(' ')
                    .filter(c => c.trim() && !/[^\w-]/.test(c))
                    .slice(0, 2); // 只取前两个类名
                if (classes.length > 0) {
                    selector += '.' + classes.join('.');
                }
            }
            
            // 添加nth-child来确保唯一性
            if (current.parentNode) {
                const siblings = Array.from(current.parentNode.children);
                const sameTagSiblings = siblings.filter(s => s.nodeName === current.nodeName);
                if (sameTagSiblings.length > 1) {
                    const index = sameTagSiblings.indexOf(current) + 1;
                    selector += `:nth-child(${index})`;
                }
            }
            
            path.unshift(selector);
            current = current.parentNode;
            
            // 限制路径深度
            if (path.length >= 5) {
                break;
            }
        }
        
        return path.join(' > ');
    }
    
    // 根据选择器找到元素
    findElementBySelector(selector) {
        // 如果selector是对象，尝试提取path属性
        if (typeof selector === 'object' && selector !== null) {
            if (selector.path) {
                selector = selector.path;
            } else {
                console.warn('无效的选择器对象:', selector);
                return null;
            }
        }
        
        // 如果selector不是字符串，返回null
        if (typeof selector !== 'string') {
            console.warn('选择器必须是字符串:', selector);
            return null;
        }
        
        try {
            const element = document.querySelector(selector);
            if (!element) {
                console.warn('元素不存在:', selector);
            }
            return element;
        } catch (e) {
            console.warn('选择器语法错误:', selector, e);
            return null;
        }
    }
    
    // 更新标记位置
    updateMarkerPosition(marker, comment) {
        const targetElement = this.findElementBySelector(comment.targetElement);
        if (!targetElement) {
            marker.style.display = 'none';
            if (window.commentDebug) {
                console.log(`评论 #${comment.id} 的目标元素不存在: ${comment.targetElement}`);
            }
            return;
        }
        
        marker.style.display = 'flex';
        const rect = targetElement.getBoundingClientRect();
        
        // 使用fixed定位，直接基于视口位置
        const finalX = rect.left + comment.offsetX;
        const finalY = rect.top + comment.offsetY;
        
        marker.style.position = 'fixed';
        marker.style.left = finalX + 'px';
        marker.style.top = finalY + 'px';
        
        // 调试信息
        if (window.commentDebug) {
            console.log(`评论 #${comment.id} 位置更新:`, {
                targetElement: comment.targetElement,
                elementFound: !!targetElement,
                targetRect: rect,
                offsetX: comment.offsetX,
                offsetY: comment.offsetY,
                finalX: finalX,
                finalY: finalY
            });
        }
    }
    
    // 启动位置更新器
    startPositionUpdater() {
        // 初始化节流变量
        this.scrollRAF = null;
        this.resizeRAF = null;
        
        // 监听窗口滚动 - 使用requestAnimationFrame优化
        window.addEventListener('scroll', () => {
            if (this.scrollRAF) return;
            this.scrollRAF = requestAnimationFrame(() => {
                this.updateAllMarkerPositions();
                this.scrollRAF = null;
            });
        }, { passive: true });
        
        // 监听窗口大小变化 - 使用requestAnimationFrame优化
        window.addEventListener('resize', () => {
            if (this.resizeRAF) return;
            this.resizeRAF = requestAnimationFrame(() => {
                this.updateAllMarkerPositions();
                this.resizeRAF = null;
            });
        });
        
        // 使用ResizeObserver监听元素大小变化 - 立即更新
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateAllMarkerPositions();
            });
            this.resizeObserver.observe(document.body);
        }
        
        // 使用MutationObserver监听DOM变化 - 减少延迟
        if (window.MutationObserver) {
            this.mutationObserver = new MutationObserver(() => {
                // 减少延迟，提高响应速度
                clearTimeout(this.updateTimeout);
                this.updateTimeout = setTimeout(() => {
                    this.updateAllMarkerPositions();
                }, 16); // 约60fps的响应速度
            });
            
            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'style', 'transform']
            });
        }
    }
    
    // 更新所有标记位置
    updateAllMarkerPositions() {
        this.comments.forEach(comment => {
            const marker = document.querySelector(`[data-comment-id="${comment.id}"]`);
            if (marker) {
                this.updateMarkerPosition(marker, comment);
            }
        });
    }
    
    // 添加到位置更新队列
    addToPositionUpdateQueue(commentId) {
        // 立即更新一次
        const comment = this.comments.find(c => c.id === commentId);
        if (comment) {
            const marker = document.querySelector(`[data-comment-id="${commentId}"]`);
            if (marker) {
                this.updateMarkerPosition(marker, comment);
            }
        }
    }
    
    // 检查是否有未保存的数据
    hasUnsavedData() {
        const cached = localStorage.getItem('comment-system-cache');
        return !!cached;
    }
    
    // 获取缓存数据的时间戳
    getCacheTimestamp() {
        const cached = localStorage.getItem('comment-system-cache');
        if (cached) {
            try {
                const data = JSON.parse(cached);
                return data.timestamp;
            } catch (e) {
                return null;
            }
        }
        return null;
    }
    
    // 清理资源
    cleanup() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.mutationObserver) {
            this.mutationObserver.disconnect();
        }
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
        }
    }
}

// 初始化评论系统
document.addEventListener('DOMContentLoaded', function() {
    // 创建全局实例
    window.commentSystem = new CommentSystem({
        container: document.body,
        defaultAuthor: '测试用户',
        autoSave: true,
        jsonFilePath: './comments-data.json'
    });
    
    // 添加双击打开评论面板功能
    document.getElementById('total-comments')?.addEventListener('dblclick', function() {
        window.commentSystem.openPanel();
    });
    
    document.getElementById('unresolved-comments')?.addEventListener('dblclick', function() {
        window.commentSystem.openPanel();
    });
});