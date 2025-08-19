/**
 * 地理数据管理页面JavaScript
 */

// 全局变量
let gisData = [];
let filteredGisData = [];
let currentPage = 1;
const itemsPerPage = 20;

// 页面初始化
document.addEventListener("DOMContentLoaded", function() {
    initializePage();
    loadGisData();
    setupEventListeners();
    updateTime();
    setInterval(updateTime, 1000);
});

function initializePage() {
    initializeSidebar();
    console.log("地理数据管理页面初始化完成");
}

function loadGisData() {
    gisData = generateMockGisData();
    filteredGisData = [...gisData];
    updateGisStatistics();
    renderGisTable();
    updatePagination();
}

function generateMockGisData() {
    const data = [];
    for (let i = 1; i <= 47; i++) {
        data.push({
            id: i,
            name: `数据集_${i.toString().padStart(3, "0")}`,
            type: ["boundary", "landuse", "terrain", "water", "transport"][Math.floor(Math.random() * 5)],
            format: ["shapefile", "geojson", "kml"][Math.floor(Math.random() * 3)],
            size: (Math.random() * 100 + 0.5).toFixed(1),
            features: Math.floor(Math.random() * 10000) + 100,
            lastUpdate: "2024-01-15",
            status: ["active", "inactive", "processing"][Math.floor(Math.random() * 3)]
        });
    }
    return data;
}

function updateGisStatistics() {
    updateElementText("totalLayers", gisData.length);
    updateElementText("totalFeatures", gisData.reduce((sum, item) => sum + item.features, 0).toLocaleString());
}

function renderGisTable() {
    const tbody = document.getElementById("gisDataTableBody");
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredGisData.length);
    const pageData = filteredGisData.slice(startIndex, endIndex);
    
    tbody.innerHTML = pageData.map(data => `
        <tr>
            <td><input type="checkbox" value="${data.id}"></td>
            <td>${data.name}</td>
            <td><span class="data-type-badge ${data.type}">${getDataTypeText(data.type)}</span></td>
            <td><span class="format-badge">${data.format.toUpperCase()}</span></td>
            <td><span class="file-size">${data.size} MB</span></td>
            <td><span class="feature-count">${data.features.toLocaleString()}</span></td>
            <td>${data.lastUpdate}</td>
            <td><span class="status-badge ${data.status}">${getStatusText(data.status)}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn view" onclick="viewGisDetail(${data.id})" title="查看详情">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn download" onclick="downloadGisData(${data.id})" title="下载">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join("");
}

function setupEventListeners() {
    window.addEventListener("resize", () => {
        console.log("窗口大小已调整");
    });
}

function updatePagination() {
    const totalRecords = filteredGisData.length;
    updateElementText("gisPageStart", (currentPage - 1) * itemsPerPage + 1);
    updateElementText("gisPageEnd", Math.min(currentPage * itemsPerPage, totalRecords));
    updateElementText("totalGisRecords", totalRecords.toLocaleString());
}

// 功能函数
function showAddGisModal() { const modal = document.getElementById("addGisModal"); if (modal) modal.classList.add("show"); }
function closeAddGisModal() { const modal = document.getElementById("addGisModal"); if (modal) modal.classList.remove("show"); }
function saveGisLayer() { showNotification("图层保存功能开发中...", "info"); closeAddGisModal(); }
function viewGisDetail(id) { showNotification(`查看数据集 ${id} 详情`, "info"); }
function closeGisDetailModal() { const modal = document.getElementById("gisDetailModal"); if (modal) modal.classList.remove("show"); }
function downloadGisData(id) { showNotification(`下载数据集 ${id}`, "info"); }
function refreshGisData() { loadGisData(); showNotification("数据刷新完成", "success"); }
function importGisData() { showAddGisModal(); }
function searchDatasets() { showNotification("搜索功能开发中...", "info"); }
function changeGisPage(action, pageNum) { if (action === "page") currentPage = pageNum; renderGisTable(); updatePagination(); }
function toggleSelectAllGisData() { console.log("切换全选状态"); }
function handleFileSelect(event) { console.log("文件选择:", event.target.files); }

// 图层管理函数
function refreshLayers() { showNotification("图层已刷新", "success"); }
function expandAllLayers() { showNotification("已展开所有图层", "info"); }
function collapseAllLayers() { showNotification("已收起所有图层", "info"); }
function addLayerGroup() { showNotification("添加图层分组功能开发中...", "info"); }
function importLayer() { document.getElementById("gisFileInput")?.click(); }

// 地图工具函数
function zoomToExtent() { showNotification("正在缩放到全图范围...", "info"); }
function toggleMeasure() { showNotification("测量工具功能开发中...", "info"); }
function toggleDraw() { showNotification("绘制工具功能开发中...", "info"); }
function exportMap() { showNotification("地图导出功能开发中...", "info"); }

// 质量监控函数
function runQualityCheck() { showNotification("质量检查完成", "success"); }
function generateQualityReport() { showNotification("质量报告生成完成", "success"); }
function refreshTypeDistribution() { showNotification("图表已刷新", "success"); }
function exportChart(type) { showNotification(`导出${type}图表`, "success"); }

// 辅助函数
function getDataTypeText(type) {
    const typeMap = { boundary: "行政边界", landuse: "土地利用", terrain: "地形地貌", water: "水系分布", transport: "交通网络" };
    return typeMap[type] || type;
}

function getStatusText(status) {
    const statusMap = { active: "活跃", inactive: "非活跃", processing: "处理中", error: "错误" };
    return statusMap[status] || status;
}

function updateElementText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString("zh-CN");
    updateElementText("current-time", timeString);
    updateElementText("last-update", "刚刚");
}

 
 

 
 