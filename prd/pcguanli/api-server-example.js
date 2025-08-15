/**
 * PRD系统后端API服务器示例
 * 
 * 启动方式:
 * 1. 确保已安装 Node.js
 * 2. 运行: npm install express cors fs-extra
 * 3. 运行: node api-server-example.js
 * 4. 服务器将在 http://localhost:3000 启动（如端口被占用会自动寻找其他端口）
 */

// 检查必要的依赖
function checkDependencies() {
    const requiredPackages = ['express', 'cors', 'fs-extra'];
    const missingPackages = [];
    
    for (const pkg of requiredPackages) {
        try {
            require.resolve(pkg);
        } catch (error) {
            missingPackages.push(pkg);
        }
    }
    
    if (missingPackages.length > 0) {
        console.error('❌ 缺少必要的依赖包:');
        console.error(`   ${missingPackages.join(', ')}`);
        console.error('\n📦 请运行以下命令安装依赖:');
        console.error(`   npm install ${missingPackages.join(' ')}`);
        console.error('\n🔧 或者运行完整安装:');
        console.error('   npm install express cors fs-extra');
        process.exit(1);
    }
}

// 检查依赖
checkDependencies();

const express = require('express');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

// 文件监听和自动刷新功能
let fileWatcher = null;
const sseClients = new Set(); // 存储SSE连接的客户端

const app = express();
let PORT = process.env.PORT || 3000;
const ANNOTATIONS_FILE = path.join(__dirname, 'prd-docs', 'annotations.json');

// 中间件
app.use(cors()); // 允许跨域请求
app.use(express.json()); // 解析JSON请求体
app.use(express.static('.')); // 静态文件服务

// 管理端原型静态文件服务 - 处理相对路径问题
const prototypeDir = path.resolve(__dirname, '../../大屏原型');
const managementDir = path.resolve(__dirname, '../../管理端原型');

console.log('📁 大屏原型目录:', prototypeDir);
console.log('📁 管理端目录:', managementDir);

// 检查目录是否存在
if (fs.pathExistsSync(prototypeDir)) {
    // 使用英文别名避免中文路径问题
    app.use('/prototype', express.static(prototypeDir));
    app.use('/screen', express.static(prototypeDir));
    app.use('/大屏原型', express.static(prototypeDir));
    console.log('✅ 大屏原型静态文件服务已启用');
    console.log('   📂 可访问路径: /prototype/*, /screen/*, /大屏原型/*');
} else {
    console.warn('⚠️ 大屏原型目录不存在:', prototypeDir);
}

if (fs.pathExistsSync(managementDir)) {
    app.use('/management', express.static(managementDir));
    app.use('/admin', express.static(managementDir));
    app.use('/农情遥感系统管理端', express.static(managementDir));
    app.use('/管理端原型', express.static(managementDir));
    console.log('✅ 管理端原型静态文件服务已启用');
    console.log('   📂 可访问路径: /management/*, /admin/*, /农情遥感系统管理端/*, /管理端原型/*');
} else {
    console.warn('⚠️ 管理端目录不存在:', managementDir);
}

// 确保annotations.json文件存在并检查现有数据
async function ensureAnnotationsFile() {
    try {
        await fs.ensureDir(path.dirname(ANNOTATIONS_FILE));
        
        if (await fs.pathExists(ANNOTATIONS_FILE)) {
            // 文件存在，读取并显示统计信息
            const annotations = await fs.readJson(ANNOTATIONS_FILE);
            const stats = calculateAnnotationStats(annotations);
            console.log('📂 发现现有annotations.json文件');
            console.log(`📊 统计信息: ${stats.totalAnnotations}个批注，${stats.pageCount}个页面`);
            
            // 验证文件格式
            if (typeof annotations === 'object' && annotations !== null) {
                console.log('✅ 文件格式有效');
            } else {
                console.warn('⚠️ 文件格式异常，将创建备份');
                await createBackup();
            }
        } else {
            // 文件不存在，创建空文件
            await fs.writeJson(ANNOTATIONS_FILE, {}, { spaces: 2 });
            console.log('📝 创建了新的annotations.json文件');
        }
    } catch (error) {
        console.error('❌ 处理annotations.json失败:', error);
        // 尝试从备份恢复
        await tryRestoreFromBackup();
    }
}

// 计算批注统计信息
function calculateAnnotationStats(annotations) {
    let totalAnnotations = 0;
    let pageCount = 0;
    
    for (const [pageKey, pageAnnotations] of Object.entries(annotations)) {
        if (typeof pageAnnotations === 'object' && pageAnnotations !== null) {
            pageCount++;
            totalAnnotations += Object.keys(pageAnnotations).length;
        }
    }
    
    return { totalAnnotations, pageCount };
}

// 创建备份文件
async function createBackup() {
    try {
        const timestamp = Date.now();
        const backupFile = ANNOTATIONS_FILE.replace('.json', `-backup-${timestamp}.json`);
        await fs.copy(ANNOTATIONS_FILE, backupFile);
        console.log('📦 已创建备份文件:', path.basename(backupFile));
        return backupFile;
    } catch (error) {
        console.error('❌ 创建备份失败:', error);
        return null;
    }
}

// 尝试从备份恢复
async function tryRestoreFromBackup() {
    try {
        const backupDir = path.dirname(ANNOTATIONS_FILE);
        const files = await fs.readdir(backupDir);
        const backupFiles = files
            .filter(file => file.startsWith('annotations-backup-') && file.endsWith('.json'))
            .sort()
            .reverse(); // 最新的在前
        
        if (backupFiles.length > 0) {
            const latestBackup = path.join(backupDir, backupFiles[0]);
            console.log('🔄 尝试从备份恢复:', backupFiles[0]);
            
            const backupData = await fs.readJson(latestBackup);
            await fs.writeJson(ANNOTATIONS_FILE, backupData, { spaces: 2 });
            console.log('✅ 已从备份恢复数据');
        } else {
            console.log('⚠️ 未找到备份文件，创建空文件');
            await fs.writeJson(ANNOTATIONS_FILE, {}, { spaces: 2 });
        }
    } catch (error) {
        console.error('❌ 从备份恢复失败:', error);
        await fs.writeJson(ANNOTATIONS_FILE, {}, { spaces: 2 });
    }
}

// 自动刷新功能 - SSE (Server-Sent Events)

// SSE连接端点
app.get('/api/events', (req, res) => {
    // 设置SSE响应头
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // 创建客户端对象
    const clientId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    const client = {
        id: clientId,
        response: res,
        lastPing: Date.now()
    };

    // 添加到客户端列表
    sseClients.add(client);
    console.log(`📡 新的SSE客户端连接: ${clientId}, 当前连接数: ${sseClients.size}`);

    // 发送连接确认消息
    res.write(`data: ${JSON.stringify({
        type: 'connected',
        clientId: clientId,
        timestamp: new Date().toISOString(),
        message: '自动刷新连接已建立'
    })}\n\n`);

    // 定期发送心跳
    const heartbeat = setInterval(() => {
        if (res.writableEnded) {
            clearInterval(heartbeat);
            return;
        }
        
        client.lastPing = Date.now();
        res.write(`data: ${JSON.stringify({
            type: 'ping',
            timestamp: new Date().toISOString()
        })}\n\n`);
    }, 30000); // 每30秒发送心跳

    // 客户端断开连接处理
    req.on('close', () => {
        clearInterval(heartbeat);
        sseClients.delete(client);
        console.log(`📡 SSE客户端断开: ${clientId}, 当前连接数: ${sseClients.size}`);
    });

    req.on('error', (error) => {
        console.error(`❌ SSE客户端错误 ${clientId}:`, error);
        clearInterval(heartbeat);
        sseClients.delete(client);
    });
});

// 向所有SSE客户端广播消息
function broadcastToClients(eventType, data) {
    if (sseClients.size === 0) {
        console.log('📡 没有活跃的SSE客户端');
        return;
    }

    const message = {
        type: eventType,
        data: data,
        timestamp: new Date().toISOString()
    };

    const messageStr = `data: ${JSON.stringify(message)}\n\n`;
    let sentCount = 0;
    let errorCount = 0;

    sseClients.forEach(client => {
        try {
            if (!client.response.writableEnded) {
                client.response.write(messageStr);
                sentCount++;
            } else {
                // 清理已断开的连接
                sseClients.delete(client);
            }
        } catch (error) {
            console.error(`❌ 向客户端 ${client.id} 发送消息失败:`, error);
            sseClients.delete(client);
            errorCount++;
        }
    });

    console.log(`📡 广播 ${eventType} 事件: 成功 ${sentCount}, 失败 ${errorCount}, 活跃连接 ${sseClients.size}`);
}

// 文件监听功能
function setupFileWatcher() {
    try {
        // 如果已有监听器，先关闭
        if (fileWatcher) {
            fileWatcher.close();
        }

        // 监听annotations.json文件变化
        fileWatcher = fs.watch(ANNOTATIONS_FILE, { persistent: true }, (eventType, filename) => {
            if (filename && eventType === 'change') {
                console.log(`📂 检测到文件变化: ${filename} (${eventType})`);
                
                // 延迟一点再广播，避免文件写入过程中的不完整数据
                setTimeout(async () => {
                    try {
                        // 读取最新的批注数据
                        const latestAnnotations = await fs.readJson(ANNOTATIONS_FILE);
                        const stats = calculateAnnotationStats(latestAnnotations);
                        
                        // 广播更新事件
                        broadcastToClients('annotations_updated', {
                            annotations: latestAnnotations,
                            stats: stats,
                            filename: filename,
                            eventType: eventType
                        });

                        console.log(`🔄 已广播批注数据更新: ${stats.totalAnnotations}个批注，${stats.pageCount}个页面`);
                    } catch (error) {
                        console.error('❌ 读取更新的文件失败:', error);
                        broadcastToClients('error', {
                            message: '读取更新的文件失败',
                            error: error.message
                        });
                    }
                }, 100);
            }
        });

        console.log('👁️ 文件监听器已启动，监听:', ANNOTATIONS_FILE);
    } catch (error) {
        console.error('❌ 设置文件监听器失败:', error);
    }
}

// API路由

// 处理根目录的index.html请求 - 重定向到大屏原型
app.get('/index.html', (req, res) => {
    res.redirect('/prototype/index.html');
});

// 根路径 - 显示欢迎页面
app.get('/', (req, res) => {
    res.json({
        welcome: 'PRD系统API服务器',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        message: '欢迎使用临夏农情遥感系统PRD API服务器',
        links: {
            'API接口列表': '/api',
            '健康检查': '/api/health',
            'PRD开发模式': '/prd-system-dev.html',
            'PRD生产模式': '/prd-system.html',
            '大屏原型': '/大屏原型/index.html'
        },
        documentation: {
            'API基础地址': `http://localhost:${PORT || 3000}/api`,
            '使用方式': '在PRD系统中设置 window.PRD_API_BASE_URL',
            '开发模式': '添加 ?mode=dev 参数'
        }
    });
});

// API根路径 - 显示可用接口列表
app.get('/api', (req, res) => {
    res.json({
        name: 'PRD系统API服务器',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
            'GET /api/health': '健康检查',
            'GET /api/annotations': '获取所有批注数据',
            'POST /api/annotations': '保存所有批注数据', 
            'POST /api/annotations/update': '增量更新单个批注',
            'POST /api/annotations/sync': '实时同步批注',
            'GET /api/sync-logs': '获取同步日志',
            'GET /api/operation-logs': '获取操作日志',
            'GET /api/annotations/stats': '获取批注统计信息'
        },
        usage: {
            development: 'window.PRD_API_BASE_URL = "http://localhost:' + (PORT || 3000) + '/api"',
            production: '配置实际的API服务器地址'
        }
    });
});

// 健康检查接口
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        mode: 'development'
    });
});

// 获取所有批注数据
app.get('/api/annotations', async (req, res) => {
    try {
        const annotations = await fs.readJson(ANNOTATIONS_FILE);
        console.log('📥 批注数据已发送到客户端');
        res.json(annotations);
    } catch (error) {
        console.error('❌ 读取批注数据失败:', error);
        res.status(500).json({ 
            error: '读取批注数据失败', 
            details: error.message 
        });
    }
});

// 保存所有批注数据
app.post('/api/annotations', async (req, res) => {
    try {
        const newAnnotations = req.body;
        let backupFile = null;
        
        // 验证数据格式
        if (!newAnnotations || typeof newAnnotations !== 'object') {
            return res.status(400).json({ 
                error: '无效的批注数据格式',
                details: '数据必须是有效的JSON对象'
            });
        }
        
        // 仅在重要时备份（可选）
        if (await fs.pathExists(ANNOTATIONS_FILE)) {
            // backupFile = await createBackup(); // 禁用全量保存时的自动备份
            
            // 读取现有数据进行对比
            const existingAnnotations = await fs.readJson(ANNOTATIONS_FILE);
            const existingStats = calculateAnnotationStats(existingAnnotations);
            const newStats = calculateAnnotationStats(newAnnotations);
            
            console.log('📊 数据对比:');
            console.log(`   原有: ${existingStats.totalAnnotations}个批注，${existingStats.pageCount}个页面`);
            console.log(`   新的: ${newStats.totalAnnotations}个批注，${newStats.pageCount}个页面`);
            
            // 检测是否有删除操作
            for (const [pageKey, pageAnnotations] of Object.entries(existingAnnotations)) {
                if (!newAnnotations[pageKey]) {
                    console.log(`🗑️ 页面被删除: ${pageKey}`);
                } else {
                    for (const elementId of Object.keys(pageAnnotations)) {
                        if (!newAnnotations[pageKey][elementId]) {
                            console.log(`🗑️ 批注被删除: ${pageKey}/${elementId}`);
                        }
                    }
                }
            }
            
            // 检测新增操作
            for (const [pageKey, pageAnnotations] of Object.entries(newAnnotations)) {
                if (!existingAnnotations[pageKey]) {
                    console.log(`✨ 新页面: ${pageKey}`);
                } else {
                    for (const elementId of Object.keys(pageAnnotations)) {
                        if (!existingAnnotations[pageKey][elementId]) {
                            console.log(`✨ 新批注: ${pageKey}/${elementId} - ${pageAnnotations[elementId].name}`);
                        }
                    }
                }
            }
        }
        
        // 保存新数据，保持格式化
        await fs.writeJson(ANNOTATIONS_FILE, newAnnotations, { spaces: 2 });
        console.log('💾 批注数据已保存到文件');
        
        // 记录操作日志
        const operationLog = {
            timestamp: new Date().toISOString(),
            operation: 'save_all',
            stats: calculateAnnotationStats(newAnnotations),
            backup: backupFile ? path.basename(backupFile) : null
        };
        
        await logOperation(operationLog);
        
        res.json({ 
            success: true, 
            timestamp: new Date().toISOString(),
            backup: backupFile ? path.basename(backupFile) : null,
            stats: operationLog.stats
        });
    } catch (error) {
        console.error('❌ 保存批注数据失败:', error);
        res.status(500).json({ 
            error: '保存批注数据失败', 
            details: error.message 
        });
    }
});

// 增量更新单个批注
app.post('/api/annotations/update', async (req, res) => {
    try {
        const { pageKey, elementId, annotation, action = 'update' } = req.body;
        
        if (!pageKey || !elementId) {
            return res.status(400).json({
                error: '缺少必要参数',
                details: '需要提供 pageKey 和 elementId'
            });
        }
        
        // 读取现有数据
        let annotations = {};
        if (await fs.pathExists(ANNOTATIONS_FILE)) {
            annotations = await fs.readJson(ANNOTATIONS_FILE);
        }
        
        // 确保页面键存在
        if (!annotations[pageKey]) {
            annotations[pageKey] = {};
        }
        
        let operationType = '';
        let oldAnnotation = null;
        
        if (action === 'delete') {
            // 删除批注
            oldAnnotation = annotations[pageKey][elementId];
            delete annotations[pageKey][elementId];
            operationType = '删除';
            console.log(`🗑️ 删除批注: ${pageKey}/${elementId} - ${oldAnnotation?.name || 'Unknown'}`);
        } else {
            // 创建或更新批注
            oldAnnotation = annotations[pageKey][elementId];
            annotations[pageKey][elementId] = {
                ...annotation,
                elementId: elementId,
                timestamp: new Date().toLocaleString('zh-CN'),
                lastModified: new Date().toISOString()
            };
            
            operationType = oldAnnotation ? '更新' : '创建';
            console.log(`${operationType === '创建' ? '✨' : '✏️'} ${operationType}批注: ${pageKey}/${elementId} - ${annotation.name}`);
        }
        
        // 禁用自动备份 - 只在删除操作时备份
        let backupFile = null;
        if (action === 'delete') {
            backupFile = await createBackup();
        }
        
        await fs.writeJson(ANNOTATIONS_FILE, annotations, { spaces: 2 });
        
        // 广播更新事件到所有客户端
        broadcastToClients('annotation_updated', {
            operation: operationType,
            pageKey,
            elementId,
            annotation: {
                name: annotation?.name || oldAnnotation?.name,
                content: annotation?.content || oldAnnotation?.content
            },
            timestamp: new Date().toISOString()
        });
        
        // 记录操作日志
        const operationLog = {
            timestamp: new Date().toISOString(),
            operation: action,
            pageKey,
            elementId,
            annotation: {
                name: annotation?.name || oldAnnotation?.name,
                content: annotation?.content || oldAnnotation?.content
            },
            backup: backupFile ? path.basename(backupFile) : null
        };
        
        await logOperation(operationLog);
        
        res.json({
            success: true,
            operation: operationType,
            elementId,
            pageKey,
            timestamp: new Date().toISOString(),
            backup: backupFile ? path.basename(backupFile) : null
        });
        
    } catch (error) {
        console.error('❌ 增量更新失败:', error);
        res.status(500).json({
            error: '增量更新失败',
            details: error.message
        });
    }
});

// 实时同步单个批注（广播用）
app.post('/api/annotations/sync', async (req, res) => {
    try {
        const { annotation, action, timestamp } = req.body;
        
        console.log(`🔄 实时同步: ${action} - ${annotation?.name || '未知批注'} at ${timestamp}`);
        
        // 这里可以添加实时同步逻辑
        // 例如: WebSocket广播、数据库更新等
        
        // 记录同步日志
        const syncLog = {
            timestamp: timestamp || new Date().toISOString(),
            action,
            annotation: {
                name: annotation?.name,
                elementId: annotation?.elementId,
                pageKey: annotation?.pageKey
            }
        };
        
        await logSync(syncLog);
        
        res.json({ 
            success: true, 
            syncId: `sync_${Date.now()}`,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('❌ 实时同步失败:', error);
        res.status(500).json({ 
            error: '实时同步失败', 
            details: error.message 
        });
    }
});

// 记录操作日志
async function logOperation(operationLog) {
    try {
        const logFile = path.join(__dirname, 'operation-logs.json');
        let logs = [];
        
        if (await fs.pathExists(logFile)) {
            logs = await fs.readJson(logFile);
        }
        
        logs.push(operationLog);
        
        // 只保留最近200条操作日志
        if (logs.length > 200) {
            logs = logs.slice(-200);
        }
        
        await fs.writeJson(logFile, logs, { spaces: 2 });
    } catch (error) {
        console.error('❌ 记录操作日志失败:', error);
    }
}

// 记录同步日志
async function logSync(syncLog) {
    try {
        const logFile = path.join(__dirname, 'sync-logs.json');
        let logs = [];
        
        if (await fs.pathExists(logFile)) {
            logs = await fs.readJson(logFile);
        }
        
        logs.push(syncLog);
        
        // 只保留最近100条同步日志
        if (logs.length > 100) {
            logs = logs.slice(-100);
        }
        
        await fs.writeJson(logFile, logs, { spaces: 2 });
    } catch (error) {
        console.error('❌ 记录同步日志失败:', error);
    }
}

// 获取同步日志
app.get('/api/sync-logs', async (req, res) => {
    try {
        const logFile = path.join(__dirname, 'sync-logs.json');
        if (await fs.pathExists(logFile)) {
            const logs = await fs.readJson(logFile);
            res.json(logs);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('❌ 读取同步日志失败:', error);
        res.status(500).json({ 
            error: '读取同步日志失败', 
            details: error.message 
        });
    }
});

// 获取操作日志
app.get('/api/operation-logs', async (req, res) => {
    try {
        const logFile = path.join(__dirname, 'operation-logs.json');
        if (await fs.pathExists(logFile)) {
            const logs = await fs.readJson(logFile);
            res.json(logs);
        } else {
            res.json([]);
        }
    } catch (error) {
        console.error('❌ 读取操作日志失败:', error);
        res.status(500).json({ 
            error: '读取操作日志失败', 
            details: error.message 
        });
    }
});

// 批注数据统计
app.get('/api/annotations/stats', async (req, res) => {
    try {
        const annotations = await fs.readJson(ANNOTATIONS_FILE);
        
        let totalAnnotations = 0;
        let pageCount = 0;
        const pageStats = {};
        
        for (const [pageKey, pageAnnotations] of Object.entries(annotations)) {
            pageCount++;
            const count = Object.keys(pageAnnotations).length;
            totalAnnotations += count;
            pageStats[pageKey] = count;
        }
        
        res.json({
            totalAnnotations,
            pageCount,
            pageStats,
            lastModified: (await fs.stat(ANNOTATIONS_FILE)).mtime
        });
    } catch (error) {
        console.error('❌ 获取统计数据失败:', error);
        res.status(500).json({ 
            error: '获取统计数据失败', 
            details: error.message 
        });
    }
});

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('💥 服务器错误:', error);
    res.status(500).json({
        error: '内部服务器错误',
        details: error.message,
        timestamp: new Date().toISOString()
    });
});

// 404处理
app.use((req, res) => {
    res.status(404).json({
        error: '接口不存在',
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString()
    });
});

// 检查端口是否可用
function checkPortAvailable(port) {
    return new Promise((resolve) => {
        const server = require('net').createServer();
        server.listen(port, () => {
            server.once('close', () => resolve(true));
            server.close();
        });
        server.on('error', () => resolve(false));
    });
}

// 寻找可用端口
async function findAvailablePort(startPort = 3000, maxAttempts = 10) {
    for (let i = 0; i < maxAttempts; i++) {
        const port = startPort + i;
        const available = await checkPortAvailable(port);
        if (available) {
            return port;
        }
    }
    throw new Error(`无法找到可用端口，已尝试 ${startPort} 到 ${startPort + maxAttempts - 1}`);
}

// 启动服务器
async function startServer() {
    try {
        await ensureAnnotationsFile();
        
        // 启动文件监听器
        setupFileWatcher();
        
        // 检查并寻找可用端口
        const isPortAvailable = await checkPortAvailable(PORT);
        if (!isPortAvailable) {
            console.log(`⚠️ 端口 ${PORT} 已被占用，正在寻找可用端口...`);
            PORT = await findAvailablePort(PORT);
            console.log(`✅ 找到可用端口: ${PORT}`);
        }
        
        const server = app.listen(PORT, () => {
            console.log(`
🚀 PRD系统API服务器已启动

📡 服务地址: http://localhost:${PORT}
📁 静态文件: http://localhost:${PORT}/prd-system-dev.html
🔗 API接口:
   • 健康检查: GET  /api/health
   • 获取批注:   GET  /api/annotations
   • 保存批注:   POST /api/annotations
   • 增量更新:   POST /api/annotations/update
   • 实时同步:   POST /api/annotations/sync
   • 同步日志:   GET  /api/sync-logs
   • 操作日志:   GET  /api/operation-logs
   • 数据统计:   GET  /api/annotations/stats
   • 自动刷新:   GET  /api/events (SSE)

🔄 自动刷新功能:
   • 文件监听器已启动，监听批注数据变化
   • 客户端可通过 /api/events 接收实时更新
   • 支持 Server-Sent Events (SSE) 协议

💡 在PRD系统中使用开发模式:
   • 添加参数: ?mode=dev
   • 或设置API地址: window.PRD_API_BASE_URL = 'http://localhost:${PORT}/api'

按 Ctrl+C 停止服务器
            `);
        });

        // 处理服务器错误
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ 端口 ${PORT} 被占用，请尝试其他端口或关闭占用该端口的进程`);
            } else {
                console.error('❌ 服务器错误:', error);
            }
            process.exit(1);
        });

    } catch (error) {
        console.error('❌ 服务器启动失败:', error);
        process.exit(1);
    }
}

// 优雅关闭
function gracefulShutdown() {
    console.log('\n👋 正在关闭服务器...');
    
    // 关闭文件监听器
    if (fileWatcher) {
        fileWatcher.close();
        console.log('👁️ 文件监听器已关闭');
    }
    
    // 关闭所有SSE连接
    sseClients.forEach(client => {
        try {
            client.response.end();
        } catch (error) {
            // 忽略关闭错误
        }
    });
    sseClients.clear();
    console.log('📡 所有SSE连接已关闭');
    
    process.exit(0);
}

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// 启动服务器
console.log('🔧 正在启动PRD系统API服务器...');
startServer().catch((error) => {
    console.error('💥 服务器启动过程中发生致命错误:', error);
    process.exit(1);
});