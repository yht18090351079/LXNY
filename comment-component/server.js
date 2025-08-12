const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;
const COMMENTS_FILE = './comments-data.json';

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('./')); // 提供静态文件服务

// 确保评论文件存在
async function ensureCommentsFile() {
    try {
        await fs.access(COMMENTS_FILE);
    } catch (error) {
        // 文件不存在，创建默认文件
        const defaultData = {
            comments: [],
            commentCounter: 0,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
        await fs.writeFile(COMMENTS_FILE, JSON.stringify(defaultData, null, 2));
        console.log('已创建默认评论文件');
    }
}

// 读取评论数据
app.get('/api/comments', async (req, res) => {
    try {
        const data = await fs.readFile(COMMENTS_FILE, 'utf8');
        const comments = JSON.parse(data);
        res.json(comments);
    } catch (error) {
        console.error('读取评论失败:', error);
        res.status(500).json({ error: '读取评论失败' });
    }
});

// 保存评论数据
app.post('/api/comments', async (req, res) => {
    try {
        const data = req.body;
        
        // 验证数据结构
        if (!data.comments || !Array.isArray(data.comments)) {
            return res.status(400).json({ error: '无效的数据格式' });
        }
        
        // 添加时间戳
        data.timestamp = new Date().toISOString();
        data.version = '1.0.0';
        
        // 写入文件
        await fs.writeFile(COMMENTS_FILE, JSON.stringify(data, null, 2));
        
        console.log(`✅ 已保存 ${data.comments.length} 条评论到文件`);
        
        res.json({
            success: true,
            message: '评论数据已保存',
            timestamp: data.timestamp,
            comments_count: data.comments.length
        });
        
    } catch (error) {
        console.error('保存评论失败:', error);
        res.status(500).json({ error: '保存评论失败' });
    }
});

// 备份评论数据
app.post('/api/comments/backup', async (req, res) => {
    try {
        const data = await fs.readFile(COMMENTS_FILE, 'utf8');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const backupFile = `./comments-backup-${timestamp}.json`;
        
        await fs.writeFile(backupFile, data);
        
        res.json({
            success: true,
            message: '备份已创建',
            backup_file: backupFile
        });
        
    } catch (error) {
        console.error('创建备份失败:', error);
        res.status(500).json({ error: '创建备份失败' });
    }
});

// 启动服务器
async function startServer() {
    try {
        await ensureCommentsFile();
        
        app.listen(PORT, () => {
            console.log(`🚀 评论系统服务器启动成功`);
            console.log(`📍 本地访问地址: http://localhost:${PORT}`);
            console.log(`📁 评论文件位置: ${path.resolve(COMMENTS_FILE)}`);
            console.log(`📋 API端点:`);
            console.log(`   GET  /api/comments - 获取评论数据`);
            console.log(`   POST /api/comments - 保存评论数据`);
            console.log(`   POST /api/comments/backup - 创建备份`);
        });
        
    } catch (error) {
        console.error('服务器启动失败:', error);
        process.exit(1);
    }
}

// 错误处理
process.on('uncaughtException', (error) => {
    console.error('未捕获的异常:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('未处理的Promise拒绝:', reason);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n📴 服务器正在关闭...');
    process.exit(0);
});

startServer();