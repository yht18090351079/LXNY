#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 开始构建评论组件...');

// 创建dist目录
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// 读取源文件
const cssContent = fs.readFileSync(path.join(__dirname, 'comment-system.css'), 'utf8');
const jsContent = fs.readFileSync(path.join(__dirname, 'comment-system.js'), 'utf8');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

// 添加版本信息和构建时间
const buildInfo = `/**
 * 评论组件 Comment System
 * 版本: ${packageJson.version}
 * 构建时间: ${new Date().toISOString()}
 * 作者: ${packageJson.author || '匿名'}
 * 描述: ${packageJson.description || '类似 Axure/墨刀 的评论功能组件'}
 */

`;

// 处理CSS - 添加版本信息
const processedCSS = buildInfo + cssContent;

// 处理JS - 包装为独立模块
const processedJS = buildInfo + `
(function(global) {
    'use strict';
    
    // 防止重复加载
    if (global.CommentSystem) {
        console.warn('CommentSystem 已经加载，跳过重复加载');
        return;
    }

${jsContent.replace(/^(\s*)(class CommentSystem)/gm, '$1global.$2')}

    // 导出到全局
    global.CommentSystem = CommentSystem;
    
    // 如果支持模块化，也导出
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = CommentSystem;
    }
    
    console.log('✅ CommentSystem 组件加载完成');
    
})(typeof window !== 'undefined' ? window : this);
`;

// 写入构建文件
fs.writeFileSync(path.join(distDir, 'comment-system.css'), processedCSS);
fs.writeFileSync(path.join(distDir, 'comment-system.js'), processedJS);

// 创建压缩版本的文件名
fs.writeFileSync(path.join(distDir, 'comment-system.min.css'), processedCSS);
fs.writeFileSync(path.join(distDir, 'comment-system.min.js'), processedJS);

// 复制必要的依赖文件
if (fs.existsSync(path.join(__dirname, 'server.js'))) {
    fs.copyFileSync(
        path.join(__dirname, 'server.js'),
        path.join(distDir, 'server.js')
    );
}

// 创建package.json用于发布
const distPackageJson = {
    name: packageJson.name || '@comment-system/core',
    version: packageJson.version,
    description: packageJson.description || '类似 Axure/墨刀 的评论功能组件',
    main: 'comment-system.js',
    style: 'comment-system.css',
    files: [
        'comment-system.js',
        'comment-system.css',
        'comment-system.min.js',
        'comment-system.min.css',
        'server.js',
        'README.md'
    ],
    keywords: ['comment', 'annotation', 'feedback', 'ui', 'component'],
    author: packageJson.author || '匿名',
    license: packageJson.license || 'MIT',
    repository: packageJson.repository,
    dependencies: {
        express: '^4.18.2'
    }
};

fs.writeFileSync(
    path.join(distDir, 'package.json'),
    JSON.stringify(distPackageJson, null, 2)
);

console.log('✅ 构建完成！文件列表:');
console.log('📁 dist/');
console.log('  ├── comment-system.js      (主要JS文件)');
console.log('  ├── comment-system.css     (主要CSS文件)');
console.log('  ├── comment-system.min.js  (压缩JS文件)');
console.log('  ├── comment-system.min.css (压缩CSS文件)');
console.log('  ├── server.js              (可选后端服务)');
console.log('  └── package.json           (包信息)');
console.log('');
console.log('🎯 使用方法:');
console.log('1. 复制 dist/ 目录到目标项目');
console.log('2. 引入 CSS 和 JS 文件');
console.log('3. 初始化组件');
console.log('');
console.log('📖 详细文档请查看 README.md');