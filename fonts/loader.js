/**
 * fonts/loader.js
 * 核心渲染引擎：处理路由、数据填充、搜索与筛选
 */

let currentFilter = 'All';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
    // 1. 获取 URL 参数
    let fontId = decodeURIComponent(window.location.search.substring(1));
    fontId = fontId.split('/')[0].split('&')[0];

    // 2. 路由判断
    if (!fontId || !FONT_DATABASE[fontId]) {
        renderListView(); // 显示列表
    } else {
        renderProductView(fontId); // 显示详情
    }
});

/**
 * 渲染列表视图 (List Mode)
 * 包含：自动生成 Tag、搜索逻辑、卡片渲染
 */
function renderListView() {
    document.title = "字体产品 - 自在造字";
    
    // DOM 切换
    const listView = document.getElementById('list-view');
    const productView = document.getElementById('product-view');
    if(listView) listView.classList.remove('hidden');
    if(productView) productView.classList.add('hidden');

    // === 1. 初始化过滤器 (从 Data 提取唯一 Tag) ===
    const filterContainer = document.getElementById('filter-container');
    const uniqueTags = new Set();
    Object.values(FONT_DATABASE).forEach(item => uniqueTags.add(item.meta.tag));
    
    // 生成 Tag 按钮 (保留 All 按钮)
    if (filterContainer && filterContainer.children.length === 1) { // 避免重复生成
        uniqueTags.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = "filter-btn px-4 py-3 rounded-full border border-gray-200 text-gray-500 bg-transparent text-xs font-bold transition-all hover:border-black hover:text-black dark:border-neutral-800 dark:text-neutral-500 dark:hover:border-white dark:hover:text-white";
            btn.textContent = tag;
            btn.dataset.tag = tag;
            btn.onclick = () => handleFilterClick(tag, btn);
            filterContainer.appendChild(btn);
        });
    }

    // === 2. 绑定搜索事件 ===
    const searchInput = document.getElementById('font-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            updateGrid();
        });
    }

    // === 3. 初始渲染网格 ===
    updateGrid();
}

/**
 * 处理筛选点击
 */
function handleFilterClick(tag, btnElement) {
    currentFilter = tag;
    
    // 更新按钮样式
    document.querySelectorAll('.filter-btn').forEach(btn => {
        // Reset Style
        btn.className = "filter-btn px-4 py-3 rounded-full border border-gray-200 text-gray-500 bg-transparent text-xs font-bold transition-all hover:border-black hover:text-black dark:border-neutral-800 dark:text-neutral-500 dark:hover:border-white dark:hover:text-white";
    });
    
    // Active Style
    btnElement.className = "filter-btn active-filter px-4 py-3 rounded-full border border-black bg-black text-white text-xs font-bold transition-all hover:opacity-80 dark:border-white dark:bg-white dark:text-black";
    
    updateGrid();
}

/**
 * 重置筛选
 */
function resetFilters() {
    currentSearch = '';
    currentFilter = 'All';
    document.getElementById('font-search').value = '';
    
    // 触发 All 按钮点击以重置 UI
    const allBtn = document.querySelector('.filter-btn[data-tag="All"]');
    if(allBtn) handleFilterClick('All', allBtn);
}

/**
 * 核心网格更新逻辑
 */
function updateGrid() {
    const listGrid = document.getElementById('font-list-grid');
    const emptyState = document.getElementById('empty-state');
    if (!listGrid) return;

    let hasResults = false;
    let html = '';

    Object.keys(FONT_DATABASE).forEach(key => {
        const item = FONT_DATABASE[key];
        
        // 匹配逻辑
        const matchesSearch = item.hero.title.toLowerCase().includes(currentSearch) || 
                              item.hero.enName.toLowerCase().includes(currentSearch);
        const matchesFilter = currentFilter === 'All' || item.meta.tag === currentFilter;

        if (matchesSearch && matchesFilter) {
            hasResults = true;
            // 获取封面图：优先用相册第一张，没有则用 Hero 图
            const coverImage = (item.gallery && item.gallery.length > 0) ? item.gallery[0] : item.hero.lightImg;

            html += `
            <a href="?${key}" class="group block relative bg-gray-50 dark:bg-neutral-900 rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div class="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-neutral-800">
                    <img src="${coverImage}" alt="${item.hero.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0">
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-xl font-black text-black dark:text-white">${item.hero.title}</h3>
                        <span class="inline-flex items-center px-2 py-0.5 rounded border border-gray-200 dark:border-neutral-700 text-[9px] font-bold uppercase tracking-widest text-gray-500">${item.meta.tag}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">${item.hero.description}</p>
                </div>
            </a>
            `;
        }
    });

    listGrid.innerHTML = html;

    // 空状态处理
    if (hasResults) {
        emptyState.classList.add('hidden');
        listGrid.classList.remove('hidden');
    } else {
        emptyState.classList.remove('hidden');
        listGrid.classList.add('hidden');
    }
}


/**
 * 渲染详情视图 (Product Mode)
 * 逻辑与之前保持一致
 */
function renderProductView(id) {
    const data = FONT_DATABASE[id];
    const listView = document.getElementById('list-view');
    const productView = document.getElementById('product-view');

    if(listView) listView.classList.add('hidden');
    if(productView) productView.classList.remove('hidden');

    // Meta
    document.title = data.meta.title;
    safeText('f-tag', data.meta.tag);
    safeText('f-badge', data.meta.badge);

    // Hero
    safeHTML('f-title', data.hero.title);
    safeText('f-enName', data.hero.enName);
    safeText('f-desc', data.hero.description);

    // Image
    const imgEl = document.getElementById('p-image');
    if (imgEl) {
        imgEl.src = data.hero.lightImg;
        imgEl.setAttribute('data-dark-src', data.hero.darkImg);
        if (document.documentElement.classList.contains('dark')) {
            imgEl.src = data.hero.darkImg;
        }
    }

    // Stats
    safeText('f-designer', data.stats.designer);
    safeText('f-license', data.stats.license);
    const axesContainer = document.getElementById('f-axes');
    if (axesContainer) {
        if (data.stats.axes && data.stats.axes.length > 0) {
            axesContainer.innerHTML = data.stats.axes.map(axis => `
                <span class="inline-flex items-center px-2 py-0.5 rounded bg-gray-200 dark:bg-neutral-800 text-[10px] font-bold text-gray-600 dark:text-gray-300" title="${axis.code}">${axis.name}</span>
            `).join('');
        } else {
            axesContainer.innerHTML = '<span class="text-xs text-gray-400">-</span>';
        }
    }

    // Features
    const featuresGrid = document.getElementById('f-features-grid');
    if (featuresGrid) {
        featuresGrid.innerHTML = data.features.map(feat => `
            <div class="group bg-gray-50 dark:bg-neutral-900/50 rounded-[2rem] p-8 lg:p-12 transition-colors duration-300 hover:bg-gray-100 dark:hover:bg-neutral-800">
                <div class="size-14 rounded-2xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center mb-8 shadow-sm transition-transform duration-300 group-hover:scale-110">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${feat.icon}"></path></svg>
                </div>
                <h3 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">${feat.title}</h3>
                <p class="text-gray-500 dark:text-neutral-400 leading-relaxed group-hover:text-gray-600 dark:group-hover:text-neutral-300 transition-colors">${feat.desc}</p>
            </div>
        `).join('');
    }

    // Gallery
    const galleryContainer = document.getElementById('f-gallery-container');
    if (galleryContainer) {
        galleryContainer.innerHTML = data.gallery.map((src, index) => `
            <div class="relative w-full z-${30 - index} ${index > 0 ? '-mt-px' : ''}">
                <img src="${src}" class="block w-full h-auto hover:scale-[1.01] transition-transform duration-700 ease-in-out ${index === 0 ? 'origin-bottom' : 'origin-top'}" loading="lazy" />
            </div>
        `).join('');
    }

    // Download Info
    safeText('dl-version', data.download.version);
    safeText('dl-type', data.download.type);
    safeText('dl-date', data.download.date);
    const dlFiles = document.getElementById('dl-files');
    if (dlFiles && data.download.files) {
        dlFiles.innerHTML = data.download.files.map(file => `
            <label class="cursor-pointer group relative flex items-center justify-between rounded-xl border border-gray-200 p-5 hover:border-black dark:border-neutral-800 dark:hover:border-white transition-all bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md">
                <div class="flex items-center gap-4">
                    <input type="checkbox" checked disabled class="accent-black w-5 h-5">
                    <div><p class="font-bold text-sm">${file.name}</p><p class="text-xs text-gray-500 mt-0.5">${file.desc}</p></div>
                </div>
                <span class="text-xs font-mono text-gray-400">${file.size}</span>
            </label>
        `).join('');
    }
    const dlBtn = document.getElementById('dl-confirm-btn');
    if(dlBtn) dlBtn.onclick = () => window.open(data.download.link, '_blank');
}

function safeText(id, text) { const el = document.getElementById(id); if(el) el.textContent = text || ''; }
function safeHTML(id, html) { const el = document.getElementById(id); if(el) el.innerHTML = html || ''; }