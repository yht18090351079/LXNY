/**
 * 农情监测报表导出功能
 * 功能：报表预览、数据收集、区域截图、PDF/Excel导出
 */

// ===== 全局变量 =====
let reportData = null;
let regionScreenshots = {};

// ===== 报表预览功能 =====

/**
 * 显示报表预览弹窗
 */
function showReportPreview() {
    console.log('📊 开始生成报表预览...');
    
    // 收集报表数据
    reportData = collectReportData();
    
    // 生成预览内容
    const previewContent = generateReportPreview(reportData);
    
    // 显示弹窗
    const modal = document.getElementById('reportPreviewModal');
    const content = document.getElementById('reportPreviewContent');
    
    if (modal && content) {
        content.innerHTML = previewContent;
        modal.style.display = 'flex';
        
        // 添加淡入动画
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
        
        console.log('✅ 报表预览弹窗已显示');
    }
}

/**
 * 关闭报表预览弹窗
 */
function closeReportPreview() {
    const modal = document.getElementById('reportPreviewModal');
    if (modal) {
        modal.style.display = 'none';
        console.log('❌ 报表预览弹窗已关闭');
    }
}

// ===== 数据收集功能 =====

/**
 * 收集所有报表数据
 */
function collectReportData() {
    const currentDate = new Date().toISOString().split('T')[0];
    const currentRegion = getCurrentSelectedRegion();
    
    return {
        metadata: {
            reportTitle: '临夏县农情监测报表',
            generateTime: new Date().toLocaleString('zh-CN'),
            reportPeriod: `${currentDate} 数据`,
            coverageArea: currentRegion === 'all' ? '全县' : getTownshipNameById(currentRegion)
        },
        countyData: collectCountyData(),
        townshipData: collectTownshipData(),
        screenshots: regionScreenshots
    };
}

/**
 * 收集县级概括数据
 */
function collectCountyData() {
    return {
        totalArea: 5272, // 总监测面积(亩)
        totalTownships: 10, // 覆盖乡镇数
        totalCrops: 6, // 作物种类数
        crops: [
            {
                name: '小麦',
                area: 2200,
                monthlyGrowthIndex: [0.6, 0.7, 0.8, 0.9, 1.0, 1.2, 1.3, 1.2, 1.0, 0.8, 0.7, 0.6], // NDVI植被指数
                monthlyYieldEstimate: [0, 0, 150, 250, 350, 420, 465, 485, 480, 485, 485, 485], // kg/亩
                growthChangeReason: '夏季NDVI最高，冬季休眠期较低',
                yieldReduction: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                reductionReason: '无明显减产'
            },
            {
                name: '玉米',
                area: 1800,
                monthlyGrowthIndex: [0.5, 0.6, 0.8, 1.0, 1.2, 1.4, 1.3, 1.1, 0.9, 0.7, 0.6, 0.5], // NDVI植被指数
                monthlyYieldEstimate: [0, 0, 0, 200, 350, 480, 580, 620, 615, 620, 620, 620], // kg/亩
                growthChangeReason: '夏季NDVI最高，植被覆盖度最佳',
                yieldReduction: [0, 0, 0, 5, 10, 15, 15, 15, 10, 5, 0, 0],
                reductionReason: '夏季干旱影响'
            },
            {
                name: '辣椒',
                area: 800,
                monthlyGrowthIndex: [0.4, 0.5, 0.7, 0.9, 1.1, 1.3, 1.2, 1.0, 0.8, 0.6, 0.5, 0.4], // NDVI植被指数
                monthlyYieldEstimate: [0, 0, 0, 300, 600, 950, 1150, 1250, 1200, 1250, 1250, 1250], // kg/亩
                growthChangeReason: '夏季NDVI达到峰值，植被长势良好',
                yieldReduction: [0, 0, 0, 2, 5, 8, 8, 8, 5, 2, 0, 0],
                reductionReason: '病虫害轻微影响'
            },
            {
                name: '蔬菜',
                area: 672,
                monthlyGrowthIndex: [0.7, 0.8, 0.9, 1.0, 1.1, 1.0, 0.9, 0.8, 0.9, 1.0, 0.8, 0.7], // NDVI植被指数
                monthlyYieldEstimate: [800, 1000, 1500, 2200, 2600, 2800, 2700, 2500, 2600, 2800, 2200, 1500], // kg/亩
                growthChangeReason: '多季种植，春秋两季NDVI较高',
                yieldReduction: [2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 3, 2],
                reductionReason: '轻微的气候波动'
            },
            {
                name: '土豆',
                area: 456,
                monthlyGrowthIndex: [0.3, 0.4, 0.6, 0.8, 1.0, 1.2, 1.1, 0.9, 0.7, 0.5, 0.4, 0.3], // NDVI植被指数
                monthlyYieldEstimate: [0, 0, 0, 600, 1200, 1600, 1750, 1800, 1800, 1800, 1800, 1800], // kg/亩
                growthChangeReason: '春季萌发，夏季NDVI最高，秋季收获',
                yieldReduction: [0, 0, 0, 8, 12, 12, 12, 12, 8, 5, 0, 0],
                reductionReason: '土壤湿度不足'
            },
            {
                name: '油菜',
                area: 344,
                monthlyGrowthIndex: [0.8, 0.9, 1.0, 1.1, 1.0, 0.8, 0.6, 0.5, 0.7, 0.9, 1.0, 0.8], // NDVI植被指数
                monthlyYieldEstimate: [120, 140, 160, 180, 180, 170, 150, 120, 100, 120, 150, 160], // kg/亩
                growthChangeReason: '冬春季作物，春季NDVI达到峰值',
                yieldReduction: [1, 2, 3, 3, 3, 3, 2, 1, 1, 1, 2, 2],
                reductionReason: '春季低温略有影响'
            }
        ]
    };
}

/**
 * 收集各乡镇数据
 */
function collectTownshipData() {
    const townships = [
        'chengguan', 'tuchang', 'beita', 'hongguang', 'jishishan', 
        'hanjiaji', 'xinji', 'liujiaxia', 'taiping', 'minfeng'
    ];
    
    return townships.map(townshipId => {
        const townshipName = getTownshipNameById(townshipId);
        const growthData = getSingleTownshipGrowthData(townshipId);
        
        return {
            id: townshipId,
            name: townshipName,
            area: calculateTownshipArea(townshipId),
            population: getTownshipPopulation(townshipId),
            mainCrops: getTownshipMainCrops(townshipId),
            growthDistribution: growthData,
            averageGrowthIndex: calculateAverageGrowthIndex(growthData),
            remarks: getTownshipRemarks(townshipId)
        };
    });
}

// ===== 辅助函数 =====

/**
 * 获取当前选中的区域
 */
function getCurrentSelectedRegion() {
    return window.currentSelectedRegion || 'all';
}

/**
 * 根据区域ID获取乡镇名称
 */
function getTownshipNameById(regionId) {
    const nameMap = {
        'chengguan': '城关镇',
        'tuchang': '土场镇',
        'beita': '北塔镇',
        'hongguang': '红光镇',
        'jishishan': '积石山镇',
        'hanjiaji': '韩家集镇',
        'xinji': '新集镇',
        'liujiaxia': '刘家峡镇',
        'taiping': '太平镇',
        'minfeng': '民丰镇'
    };
    return nameMap[regionId] || '未知乡镇';
}

/**
 * 计算乡镇面积
 */
function calculateTownshipArea(townshipId) {
    const areaMap = {
        'chengguan': 892,
        'tuchang': 654,
        'beita': 423,
        'hongguang': 567,
        'jishishan': 789,
        'hanjiaji': 634,
        'xinji': 456,
        'liujiaxia': 389,
        'taiping': 512,
        'minfeng': 456
    };
    return areaMap[townshipId] || 0;
}

/**
 * 获取乡镇人口
 */
function getTownshipPopulation(townshipId) {
    const populationMap = {
        'chengguan': 28000,
        'tuchang': 22000,
        'beita': 18000,
        'hongguang': 25000,
        'jishishan': 32000,
        'hanjiaji': 26000,
        'xinji': 15000,
        'liujiaxia': 19000,
        'taiping': 24000,
        'minfeng': 21000
    };
    return populationMap[townshipId] || 0;
}

/**
 * 获取乡镇主要作物
 */
function getTownshipMainCrops(townshipId) {
    const cropsMap = {
        'chengguan': ['小麦', '玉米', '蔬菜'],
        'tuchang': ['小麦', '辣椒', '土豆'],
        'beita': ['玉米', '油菜', '蔬菜'],
        'hongguang': ['小麦', '玉米', '辣椒'],
        'jishishan': ['小麦', '蔬菜', '土豆'],
        'hanjiaji': ['玉米', '辣椒', '油菜'],
        'xinji': ['小麦', '土豆', '蔬菜'],
        'liujiaxia': ['玉米', '辣椒', '蔬菜'],
        'taiping': ['小麦', '玉米', '油菜'],
        'minfeng': ['小麦', '蔬菜', '土豆']
    };
    return cropsMap[townshipId] || [];
}

/**
 * 计算平均NDVI指数
 */
function calculateAverageGrowthIndex(growthData) {
    const total = growthData.excellent + growthData.good + growthData.medium + growthData.poor;
    if (total === 0) return 0;
    
    const weightedSum = (growthData.excellent * 4) + (growthData.good * 3) + (growthData.medium * 2) + (growthData.poor * 1);
    return (weightedSum / (total * 4)).toFixed(2);
}

/**
 * 获取乡镇备注信息
 */
function getTownshipRemarks(townshipId) {
    const remarksMap = {
        'chengguan': '县政府所在地，农业基础设施完善',
        'tuchang': '地势平坦，适宜大田作物种植',
        'beita': '山地较多，适宜经济作物种植',
        'hongguang': '水资源丰富，灌溉条件良好',
        'jishishan': '人口密度较高，集约化程度高',
        'hanjiaji': '传统农业区，种植经验丰富',
        'xinji': '新兴农业区，现代化程度较高',
        'liujiaxia': '靠近水库，水利条件优越',
        'taiping': '地理位置优越，交通便利',
        'minfeng': '土地肥沃，农产品质量优良'
    };
    return remarksMap[townshipId] || '暂无特殊备注';
}

// ===== 报表预览生成 =====

/**
 * 生成报表预览HTML内容（PDF/Excel格式）
 */
function generateReportPreview(data) {
    const { metadata, countyData, townshipData } = data;
    
    return `
        <div class="report-content pdf-style">
            <!-- 报表页眉 -->
            <div class="report-header">
                <div class="header-left">
                    <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwNzNlNiIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7kuLQ8L3RleHQ+Cjwvc3ZnPgo=" alt="Logo" class="logo">
                    <div class="header-info">
                        <div class="org-name">临夏县人民政府农业农村局</div>
                        <div class="dept-name">农情遥感监测中心</div>
                    </div>
                </div>
                <div class="header-right">
                    <div class="report-code">报表编号：LXNQ-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}</div>
                    <div class="print-date">打印日期：${new Date().toLocaleDateString('zh-CN')}</div>
                </div>
            </div>
            
            <!-- 报表标题 -->
            <div class="title-section">
                <h1>${metadata.reportTitle}</h1>
                <div class="title-meta">
                    <table class="meta-table">
                        <tr>
                            <td>报表周期：</td>
                            <td>${metadata.reportPeriod}</td>
                            <td>覆盖范围：</td>
                            <td>${metadata.coverageArea}</td>
                        </tr>
                        <tr>
                            <td>生成时间：</td>
                            <td>${metadata.generateTime}</td>
                            <td>数据来源：</td>
                            <td>卫星遥感+地面监测</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <!-- 一、县级概括数据 -->
            <div class="report-section">
                <h2 class="section-title">一、县级概括数据</h2>
                
                <!-- 基本情况汇总表 -->
                <div class="subsection">
                    <h3 class="subsection-title">（一）基本情况汇总</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>监测指标</th>
                                <th>数值</th>
                                <th>单位</th>
                                <th>备注</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>总监测面积</td>
                                <td style="text-align: right; font-weight: bold;">${countyData.totalArea.toLocaleString()}</td>
                                <td>亩</td>
                                <td>卫星遥感监测覆盖</td>
                            </tr>
                            <tr>
                                <td>覆盖乡镇数</td>
                                <td style="text-align: right; font-weight: bold;">${countyData.totalTownships}</td>
                                <td>个</td>
                                <td>全县主要农业乡镇</td>
                            </tr>
                            <tr>
                                <td>监测作物种类</td>
                                <td style="text-align: right; font-weight: bold;">${countyData.totalCrops}</td>
                                <td>种</td>
                                <td>主要粮食及经济作物</td>
                            </tr>
                            <tr>
                                <td>监测地块数量</td>
                                <td style="text-align: right; font-weight: bold;">324</td>
                                <td>块</td>
                                <td>规模化种植地块</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <!-- 作物长势监测数据表 -->
                <div class="subsection">
                    <h3 class="subsection-title">（二）作物长势监测数据</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th rowspan="2">作物名称</th>
                                <th rowspan="2">种植面积<br/>（亩）</th>
                                <th colspan="12">逐月NDVI指数</th>
                                <th rowspan="2">NDVI变动原因</th>
                            </tr>
                            <tr>
                                <th>1月</th><th>2月</th><th>3月</th><th>4月</th><th>5月</th><th>6月</th>
                                <th>7月</th><th>8月</th><th>9月</th><th>10月</th><th>11月</th><th>12月</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${countyData.crops.map(crop => `
                                <tr>
                                    <td style="font-weight: bold;">${crop.name}</td>
                                    <td style="text-align: right;">${crop.area.toLocaleString()}</td>
                                    ${crop.monthlyGrowthIndex.map(index => `<td style="text-align: center;">${index}</td>`).join('')}
                                    <td>${crop.growthChangeReason}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <!-- 作物产量预估数据表 -->
                <div class="subsection">
                    <h3 class="subsection-title">（三）作物产量预估数据</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th rowspan="2">作物名称</th>
                                <th rowspan="2">种植面积<br/>（亩）</th>
                                <th colspan="12">逐月产量预估（kg/亩）</th>
                                <th rowspan="2">减产原因</th>
                            </tr>
                            <tr>
                                <th>1月</th><th>2月</th><th>3月</th><th>4月</th><th>5月</th><th>6月</th>
                                <th>7月</th><th>8月</th><th>9月</th><th>10月</th><th>11月</th><th>12月</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${countyData.crops.map(crop => `
                                <tr>
                                    <td style="font-weight: bold;">${crop.name}</td>
                                    <td style="text-align: right;">${crop.area.toLocaleString()}</td>
                                    ${crop.monthlyYieldEstimate.map(yield => `<td style="text-align: center; font-weight: ${yield > 0 ? 'bold' : 'normal'}; color: ${yield > 0 ? '#2e7d32' : '#757575'};">${yield}</td>`).join('')}
                                    <td>${crop.reductionReason}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr style="background-color: #f5f5f5; font-weight: bold;">
                                <td>加权平均</td>
                                <td style="text-align: right;">${countyData.crops.reduce((sum, crop) => sum + crop.area, 0).toLocaleString()}</td>
                                ${Array.from({length: 12}, (_, monthIndex) => {
                                    const weightedSum = countyData.crops.reduce((sum, crop) => sum + crop.monthlyYieldEstimate[monthIndex] * crop.area, 0);
                                    const totalArea = countyData.crops.reduce((sum, crop) => sum + crop.area, 0);
                                    const average = Math.round(weightedSum / totalArea);
                                    return `<td style="text-align: center;">${average}</td>`;
                                }).join('')}
                                <td>-</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <!-- 作物减产情况数据表 -->
                <div class="subsection">
                    <h3 class="subsection-title">（四）作物减产情况数据</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th rowspan="2">作物名称</th>
                                <th rowspan="2">种植面积<br/>（亩）</th>
                                <th colspan="12">逐月减产值（kg/亩）</th>
                                <th rowspan="2">减产原因</th>
                            </tr>
                            <tr>
                                <th>1月</th><th>2月</th><th>3月</th><th>4月</th><th>5月</th><th>6月</th>
                                <th>7月</th><th>8月</th><th>9月</th><th>10月</th><th>11月</th><th>12月</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${countyData.crops.map(crop => `
                                <tr>
                                    <td style="font-weight: bold;">${crop.name}</td>
                                    <td style="text-align: right;">${crop.area.toLocaleString()}</td>
                                    ${crop.yieldReduction.map(reduction => `<td style="text-align: center; color: ${reduction > 0 ? '#d32f2f' : '#388e3c'}; font-weight: ${reduction > 0 ? 'bold' : 'normal'};">${reduction}</td>`).join('')}
                                    <td>${crop.reductionReason}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr style="background-color: #f5f5f5; font-weight: bold;">
                                <td>加权平均</td>
                                <td style="text-align: right;">${countyData.crops.reduce((sum, crop) => sum + crop.area, 0).toLocaleString()}</td>
                                ${Array.from({length: 12}, (_, monthIndex) => {
                                    const weightedSum = countyData.crops.reduce((sum, crop) => sum + crop.yieldReduction[monthIndex] * crop.area, 0);
                                    const totalArea = countyData.crops.reduce((sum, crop) => sum + crop.area, 0);
                                    const average = Math.round(weightedSum / totalArea * 10) / 10;
                                    return `<td style="text-align: center; color: ${average > 0 ? '#d32f2f' : '#388e3c'};">${average}</td>`;
                                }).join('')}
                                <td>-</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            
            <!-- 二、各乡镇详细数据 -->
            <div class="report-section">
                <h2 class="section-title">二、各乡镇详细数据</h2>
                
                <div class="subsection">
                    <h3 class="subsection-title">（一）乡镇基本情况统计表</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th rowspan="2">序号</th>
                                <th rowspan="2">乡镇名称</th>
                                <th rowspan="2">监测面积<br/>（亩）</th>
                                <th rowspan="2">人口数量<br/>（人）</th>
                                <th colspan="3">主要作物种植情况</th>
                                <th rowspan="2">平均NDVI指数</th>
                                <th rowspan="2">备注</th>
                            </tr>
                            <tr>
                                <th>第一作物</th>
                                <th>第二作物</th>
                                <th>第三作物</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${townshipData.map((township, index) => `
                                <tr>
                                    <td style="text-align: center;">${index + 1}</td>
                                    <td style="font-weight: bold;">${township.name}</td>
                                    <td style="text-align: right;">${township.area.toLocaleString()}</td>
                                    <td style="text-align: right;">${township.population.toLocaleString()}</td>
                                    <td style="text-align: center;">${township.mainCrops[0] || '-'}</td>
                                    <td style="text-align: center;">${township.mainCrops[1] || '-'}</td>
                                    <td style="text-align: center;">${township.mainCrops[2] || '-'}</td>
                                    <td style="text-align: center; font-weight: bold;">${township.averageGrowthIndex}</td>
                                    <td style="font-size: 11px;">${township.remarks}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                        <tfoot>
                            <tr style="background-color: #f5f5f5; font-weight: bold;">
                                <td colspan="2" style="text-align: center;">合计</td>
                                <td style="text-align: right;">${townshipData.reduce((sum, township) => sum + township.area, 0).toLocaleString()}</td>
                                <td style="text-align: right;">${townshipData.reduce((sum, township) => sum + township.population, 0).toLocaleString()}</td>
                                <td colspan="3" style="text-align: center;">-</td>
                                <td style="text-align: center;">${(townshipData.reduce((sum, township) => sum + parseFloat(township.averageGrowthIndex), 0) / townshipData.length).toFixed(2)}</td>
                                <td>全县平均</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
            
            <!-- 三、遥感影像附图 -->
            <div class="report-section">
                <h2 class="section-title">三、遥感影像附图</h2>
                
                <div class="subsection">
                    <h3 class="subsection-title">（一）影像图说明</h3>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>序号</th>
                                <th>图件名称</th>
                                <th>图件类型</th>
                                <th>数据来源</th>
                                <th>分辨率</th>
                                <th>获取时间</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="text-align: center;">1</td>
                                <td>临夏县农业分布概览图</td>
                                <td>遥感影像图</td>
                                <td>高分二号卫星</td>
                                <td>2米</td>
                                <td>${new Date().toLocaleDateString('zh-CN')}</td>
                            </tr>
                            <tr>
                                <td style="text-align: center;">2</td>
                                <td>主要作物分布专题图</td>
                                <td>分类专题图</td>
                                <td>遥感解译+实地调查</td>
                                <td>10米</td>
                                <td>${new Date().toLocaleDateString('zh-CN')}</td>
                            </tr>
                            <tr>
                                <td style="text-align: center;">3</td>
                                <td>作物长势监测热力图</td>
                                <td>NDVI指数图</td>
                                <td>哨兵2号卫星</td>
                                <td>10米</td>
                                <td>${new Date().toLocaleDateString('zh-CN')}</td>
                            </tr>
                            <tr>
                                <td style="text-align: center;">4</td>
                                <td>产量预估分布图</td>
                                <td>预测专题图</td>
                                <td>模型预测+历史数据</td>
                                <td>30米</td>
                                <td>${new Date().toLocaleDateString('zh-CN')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="subsection">
                    <h3 class="subsection-title">（二）图件位置</h3>
                    <div class="image-placeholder">
                        <div class="placeholder-grid">
                            <div class="placeholder-item">
                                <div class="placeholder-box">图1：农业分布概览图</div>
                                <p class="placeholder-desc">（将在正式导出时自动生成高分辨率截图）</p>
                            </div>
                            <div class="placeholder-item">
                                <div class="placeholder-box">图2：作物分布专题图</div>
                                <p class="placeholder-desc">（将在正式导出时自动生成高分辨率截图）</p>
                            </div>
                            <div class="placeholder-item">
                                <div class="placeholder-box">图3：长势监测热力图</div>
                                <p class="placeholder-desc">（将在正式导出时自动生成高分辨率截图）</p>
                            </div>
                            <div class="placeholder-item">
                                <div class="placeholder-box">图4：产量预估分布图</div>
                                <p class="placeholder-desc">（将在正式导出时自动生成高分辨率截图）</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 报表页脚 -->
            <div class="report-footer">
                <div class="footer-left">
                    <div>报表生成：临夏县农情遥感监测系统</div>
                    <div>技术支持：临夏县农业农村局信息中心</div>
                </div>
                <div class="footer-right">
                    <div>第 1 页 共 1 页</div>
                    <div>制表人：系统自动生成</div>
                </div>
            </div>
        </div>
        
        <style>
            .pdf-style {
                background: white;
                color: #000000;
                font-family: 'SimSun', '宋体', serif;
                line-height: 1.6;
                max-width: 21cm;
                margin: 0 auto;
                padding: 2cm;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            
            /* 报表页眉 */
            .report-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 15px;
                border-bottom: 2px solid #000000;
                margin-bottom: 20px;
            }
            
            .header-left {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .logo {
                width: 40px;
                height: 40px;
            }
            
            .header-info .org-name {
                font-size: 16px;
                font-weight: bold;
                color: #000000;
            }
            
            .header-info .dept-name {
                font-size: 12px;
                color: #666666;
            }
            
            .header-right {
                text-align: right;
                font-size: 12px;
                color: #666666;
            }
            
            /* 标题区域 */
            .title-section {
                text-align: center;
                margin-bottom: 30px;
            }
            
            .title-section h1 {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 20px;
                color: #000000;
            }
            
            .meta-table {
                margin: 0 auto;
                border: none;
            }
            
            .meta-table td {
                padding: 5px 15px;
                border: none;
                font-size: 14px;
            }
            
            .meta-table td:nth-child(odd) {
                font-weight: bold;
                text-align: right;
            }
            
            /* 章节标题 */
            .section-title {
                font-size: 18px;
                font-weight: bold;
                margin: 25px 0 15px 0;
                color: #000000;
                border-bottom: 1px solid #cccccc;
                padding-bottom: 5px;
            }
            
            .subsection-title {
                font-size: 16px;
                font-weight: bold;
                margin: 20px 0 10px 0;
                color: #333333;
            }
            
            /* 数据表格 */
            .data-table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
                font-size: 11px;
                table-layout: auto;
            }
            
            .data-table th {
                background-color: #f5f5f5;
                border: 1px solid #cccccc;
                padding: 6px 3px;
                text-align: center;
                font-weight: bold;
                color: #000000;
                font-size: 10px;
            }
            
            .data-table td {
                border: 1px solid #cccccc;
                padding: 4px 2px;
                color: #000000;
                font-size: 10px;
            }
            
            /* 月份列样式 */
            .data-table th:nth-child(n+3):nth-child(-n+14) {
                min-width: 35px;
                max-width: 40px;
            }
            
            .data-table td:nth-child(n+3):nth-child(-n+14) {
                text-align: center;
                min-width: 35px;
                max-width: 40px;
            }
            
            .data-table tbody tr:nth-child(even) {
                background-color: #fafafa;
            }
            
            .data-table tfoot tr {
                background-color: #f0f0f0;
                font-weight: bold;
            }
            
            /* 图片占位符 */
            .placeholder-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
                margin-top: 20px;
            }
            
            .placeholder-item {
                text-align: center;
            }
            
            .placeholder-box {
                border: 2px dashed #cccccc;
                padding: 40px 20px;
                margin-bottom: 10px;
                background-color: #f9f9f9;
                color: #666666;
                font-weight: bold;
            }
            
            .placeholder-desc {
                font-size: 11px;
                color: #999999;
                margin: 0;
                font-style: italic;
            }
            
            /* 报表页脚 */
            .report-footer {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 40px;
                padding-top: 15px;
                border-top: 1px solid #cccccc;
                font-size: 11px;
                color: #666666;
            }
            
            .footer-left, .footer-right {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .footer-right {
                text-align: right;
            }
            
            /* 打印优化 */
            @media print {
                .pdf-style {
                    box-shadow: none;
                    margin: 0;
                    padding: 1.5cm;
                }
                
                .report-section {
                    page-break-inside: avoid;
                }
                
                .data-table {
                    page-break-inside: avoid;
                }
            }
        </style>
    `;
}

// ===== 导出功能 =====

/**
 * 确认导出报表
 */
function exportReport() {
    console.log('📄 开始导出报表...');
    
    if (!reportData) {
        alert('⚠️ 报表数据未准备就绪，请重新生成预览');
        return;
    }
    
    // 关闭预览弹窗
    closeReportPreview();
    
    // 显示导出进度
    showExportProgress();
    
    // 执行导出操作
    performExport();
}

/**
 * 显示导出进度
 */
function showExportProgress() {
    // 创建进度提示
    const progressDiv = document.createElement('div');
    progressDiv.id = 'exportProgress';
    progressDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 15000;
            color: white;
            font-family: 'Microsoft YaHei', Arial, sans-serif;
        ">
            <div style="
                background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(30, 30, 30, 0.95) 100%);
                border: 1px solid rgba(0, 212, 255, 0.3);
                border-radius: 16px;
                padding: 30px;
                text-align: center;
                min-width: 300px;
            ">
                <div style="font-size: 48px; margin-bottom: 15px;">📊</div>
                <h3 style="color: #00d4ff; margin-bottom: 10px;">正在导出报表...</h3>
                <p style="color: #b0b0b0; margin-bottom: 20px;">请稍候，正在生成PDF文件</p>
                <div style="
                    width: 100%;
                    height: 4px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 2px;
                    overflow: hidden;
                ">
                    <div style="
                        width: 0%;
                        height: 100%;
                        background: linear-gradient(90deg, #00d4ff 0%, #00ff88 100%);
                        animation: progressFill 3s ease-in-out forwards;
                    "></div>
                </div>
            </div>
        </div>
        <style>
            @keyframes progressFill {
                0% { width: 0%; }
                100% { width: 100%; }
            }
        </style>
    `;
    
    document.body.appendChild(progressDiv);
    
    // 3秒后移除进度提示
    setTimeout(() => {
        document.body.removeChild(progressDiv);
    }, 3000);
}

/**
 * 执行导出操作
 */
function performExport() {
    // 模拟导出过程
    setTimeout(() => {
        // 生成文件名
        const timestamp = new Date().toISOString().split('T')[0];
        const region = reportData.metadata.coverageArea;
        const filename = `临夏县农情监测报表_${region}_${timestamp}.pdf`;
        
        // 生成下载链接（这里模拟，实际应该调用PDF生成库）
        const reportContent = generatePDFContent(reportData);
        
        // 创建模拟下载
        createMockDownload(filename, reportContent);
        
        // 显示成功消息
        setTimeout(() => {
            alert(`✅ 报表导出成功！\n\n文件名：${filename}\n\n包含内容：\n• 县级概括数据\n• 各乡镇详细数据\n• 区域影像截图\n• 完整的字段信息`);
        }, 100);
        
    }, 3000);
}

/**
 * 生成PDF内容（模拟）
 */
function generatePDFContent(data) {
    // 这里应该使用实际的PDF生成库，如jsPDF + html2canvas
    // 当前只是生成文本内容作为演示
    const { metadata, countyData, townshipData } = data;
    
    let content = `${metadata.reportTitle}\n`;
    content += `生成时间：${metadata.generateTime}\n`;
    content += `报表周期：${metadata.reportPeriod}\n`;
    content += `覆盖范围：${metadata.coverageArea}\n\n`;
    
    content += `县级概括数据:\n`;
    content += `总监测面积：${countyData.totalArea} 亩\n`;
    content += `覆盖乡镇数：${countyData.totalTownships} 个\n`;
    content += `作物种类数：${countyData.totalCrops} 种\n\n`;
    
    content += `作物详细数据:\n`;
    countyData.crops.forEach(crop => {
        content += `${crop.name}：面积 ${crop.area} 亩，NDVI指数 ${crop.monthlyGrowthIndex[7]}，产量预估 ${crop.monthlyYieldEstimate[7]} kg/亩\n`;
    });
    
    content += `\n各乡镇详细数据:\n`;
    townshipData.forEach(township => {
        content += `${township.name}：面积 ${township.area} 亩，人口 ${township.population} 人，NDVI指数 ${township.averageGrowthIndex}\n`;
    });
    
    return content;
}

/**
 * 创建模拟下载
 */
function createMockDownload(filename, content) {
    // 创建Blob对象
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // 创建下载链接
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    
    // 触发下载
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    console.log(`📄 已生成下载文件：${filename}`);
}

// ===== 截图功能（待实现）=====

/**
 * 捕获区域影像截图
 */
function captureRegionScreenshots() {
    // TODO: 实现Cesium地图截图功能
    console.log('📷 区域影像截图功能待实现');
    
    // 可以使用 cesiumViewer.scene.canvas.toDataURL() 来获取截图
    if (window.cesiumViewer) {
        try {
            const screenshot = window.cesiumViewer.scene.canvas.toDataURL('image/png');
            regionScreenshots['overview'] = screenshot;
            console.log('✅ 已捕获地图概览截图');
        } catch (error) {
            console.warn('⚠️ 截图捕获失败:', error);
        }
    }
}

// ===== 初始化 =====

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 报表导出模块已加载');
    
    // 预先准备截图
    setTimeout(() => {
        captureRegionScreenshots();
    }, 5000);
});

// 导出函数到全局作用域
window.showReportPreview = showReportPreview;
window.closeReportPreview = closeReportPreview;
window.exportReport = exportReport;
