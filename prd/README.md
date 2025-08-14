# PRD（产品需求文档）管理中心

本目录包含临夏农情遥感系统的所有产品需求文档和相关工具。

## 📁 目录结构

```
prd/
├── README.md              # 本文件，PRD管理说明
├── 大屏/                   # 数据可视化大屏PRD
│   ├── prd-system.html    # 主要PRD文档（生产环境）
│   ├── prd-system-dev.html    # 开发模式PRD文档
│   ├── prd-system-view-only.html # 只读模式PRD文档
│   ├── api-server-example.js   # 后端API服务器示例
│   ├── package.json       # Node.js依赖配置
│   ├── start-dev-server.sh    # 开发服务器启动脚本
│   ├── domestic-map-config.js # 国内地图配置
│   ├── operation-logs.json    # 操作日志
│   ├── sync-logs.json     # 同步日志
│   └── prd-docs/          # PRD相关文档
│       ├── annotations.json   # 批注数据
│       ├── 全局说明.md    # 全局说明文档
│       ├── 作物选择功能.md # 作物选择功能详细说明
│       ├── 作物分布监测.md # 作物分布监测功能
│       ├── 长势分析功能.md # 作物长势分析功能
│       ├── 气象监测功能.md # 气象监测功能
│       ├── 灾害定损功能.md # 灾害定损功能
│       ├── 产量预估功能.md # 产量预估功能
│       └── 设备监控功能.md # 设备监控功能
└── 管理端/                # 系统管理端PRD（待添加）
```

## 🚀 快速开始

### 查看PRD文档

1. **静态查看**：直接打开 `大屏/prd-system.html`
2. **开发模式**：运行 `大屏/start-dev-server.sh` 启动本地服务器
3. **只读模式**：打开 `大屏/prd-system-view-only.html`

### 开发服务器

```bash
# 进入大屏目录
cd prd/大屏

# 安装依赖
npm install

# 启动开发服务器
npm start
# 或者
./start-dev-server.sh
```

服务器启动后访问：
- PRD文档：http://localhost:3000/prd-system-dev.html
- API健康检查：http://localhost:3000/api/health

## 📝 PRD功能模块

### 大屏可视化系统

| 功能模块 | 文档位置 | 状态 |
|---------|---------|------|
| 作物选择功能 | `prd-docs/作物选择功能.md` | ✅ 完成 |
| 作物分布监测 | `prd-docs/作物分布监测.md` | ✅ 完成 |
| 长势分析功能 | `prd-docs/长势分析功能.md` | ✅ 完成 |
| 气象监测功能 | `prd-docs/气象监测功能.md` | ✅ 完成 |
| 灾害定损功能 | `prd-docs/灾害定损功能.md` | ✅ 完成 |
| 产量预估功能 | `prd-docs/产量预估功能.md` | ✅ 完成 |
| 设备监控功能 | `prd-docs/设备监控功能.md` | ✅ 完成 |

### 管理端系统

| 功能模块 | 文档位置 | 状态 |
|---------|---------|------|
| 用户管理 | 待添加 | 🔄 规划中 |
| 数据管理 | 待添加 | 🔄 规划中 |
| 设备管理 | 待添加 | 🔄 规划中 |
| 系统配置 | 待添加 | 🔄 规划中 |

## 🔧 技术支持

- **批注系统**：支持在线批注和协作编辑
- **版本控制**：自动备份和版本管理
- **实时同步**：多人协作实时同步
- **API接口**：完整的REST API支持

## 📞 联系方式

如有问题请联系开发团队或查看项目根目录的相关文档。

---

*最后更新：2024年8月14日*