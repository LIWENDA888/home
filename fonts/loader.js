/**
 * fonts/loader.js
 * 核心渲染引擎
 */

// 🔴 修改点1：固定域名 URL 前缀
const URL_PREFIX = "https://www.zizao.top/fonts/";

let currentFilter = 'All';
let currentSearch = '';

document.addEventListener('DOMContentLoaded', () => {
    let fontId = decodeURIComponent(window.location.search.substring(1));
    fontId = fontId.split('/')[0].split('&')[0];

    if (!fontId || !FONT_DATABASE[fontId]) {
        renderListView();
    } else {
        renderProductView(fontId);
    }
});

function renderListView() {
    document.title = "字体产品 - 自在造字";
    
    const listView = document.getElementById('list-view');
    const productView = document.getElementById('product-view');
    if(listView) listView.classList.remove('hidden');
    if(productView) productView.classList.add('hidden');

    const filterContainer = document.getElementById('filter-container');
    const uniqueTags = new Set();
    
    Object.values(FONT_DATABASE).forEach(item => {
        if (Array.isArray(item.meta.tags)) {
            item.meta.tags.forEach(tag => uniqueTags.add(tag));
        }
    });
    
    if (filterContainer && filterContainer.children.length === 1) { 
        let sortedTags = Array.from(uniqueTags);
        const freeIndex = sortedTags.indexOf("免费");
        if (freeIndex > -1) {
            sortedTags.splice(freeIndex, 1);
            sortedTags.sort();
            sortedTags.unshift("免费");
        } else {
            sortedTags.sort();
        }

        sortedTags.forEach(tag => {
            const btn = document.createElement('button');
            btn.className = "filter-btn shrink-0 px-5 py-2.5 rounded-full border border-gray-200 text-gray-500 bg-transparent text-xs font-bold transition-all hover:border-black hover:text-black dark:border-neutral-800 dark:text-neutral-500 dark:hover:border-white dark:hover:text-white whitespace-nowrap";
            btn.textContent = tag;
            btn.onclick = () => handleFilterClick(tag, btn);
            filterContainer.appendChild(btn);
        });
    }

    const searchInput = document.getElementById('font-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            updateGrid();
        });
    }

    updateGrid();
}

function handleFilterClick(tag, btnElement) {
    currentFilter = tag;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.className = "filter-btn shrink-0 px-5 py-2.5 rounded-full border border-gray-200 text-gray-500 bg-transparent text-xs font-bold transition-all hover:border-black hover:text-black dark:border-neutral-800 dark:text-neutral-500 dark:hover:border-white dark:hover:text-white whitespace-nowrap";
    });
    
    btnElement.className = "filter-btn shrink-0 active-filter px-5 py-2.5 rounded-full border border-black bg-black text-white text-xs font-bold transition-all hover:opacity-80 dark:border-white dark:bg-white dark:text-black whitespace-nowrap";
    
    updateGrid();
}

function resetFilters() {
    currentSearch = '';
    currentFilter = 'All';
    document.getElementById('font-search').value = '';
    const allBtn = document.querySelector('.filter-btn[data-tag="All"]');
    if(allBtn) handleFilterClick('All', allBtn);
}

function updateGrid() {
    const listGrid = document.getElementById('font-list-grid');
    const emptyState = document.getElementById('empty-state');
    if (!listGrid) return;

    let hasResults = false;
    let html = '';

    Object.keys(FONT_DATABASE).forEach(key => {
        const item = FONT_DATABASE[key];
        
        const matchesSearch = item.hero.title.toLowerCase().includes(currentSearch) || 
                              item.hero.enName.toLowerCase().includes(currentSearch);
        
        const itemTags = Array.isArray(item.meta.tags) ? item.meta.tags : [item.meta.tags];
        const matchesFilter = currentFilter === 'All' || itemTags.includes(currentFilter);

        if (matchesSearch && matchesFilter) {
            hasResults = true;
            const coverImage = (item.gallery && item.gallery.length > 0) ? item.gallery[0] : item.hero.lightImg;
            const displayTag = itemTags[0]; 

            // 🔴 修改点2：拼接完整 URL 并添加 target="_blank"
            const fullUrl = `${URL_PREFIX}?${key}`;

            html += `
            <a href="${fullUrl}" target="_blank" class="group block relative bg-gray-50 dark:bg-neutral-900 rounded-[1.5rem] overflow-hidden border border-gray-100 dark:border-neutral-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div class="aspect-[4/3] overflow-hidden bg-gray-200 dark:bg-neutral-800">
                    <img src="${coverImage}" alt="${item.hero.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0">
                </div>
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <h3 class="text-xl font-black text-black dark:text-white">${item.hero.title}</h3>
                        <span class="inline-flex items-center px-2 py-0.5 rounded border border-gray-200 dark:border-neutral-700 text-[9px] font-bold uppercase tracking-widest text-gray-500">${displayTag}</span>
                    </div>
                    <p class="text-xs text-gray-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">${item.hero.description}</p>
                </div>
            </a>
            `;
        }
    });

    listGrid.innerHTML = html;

    if (hasResults) {
        emptyState.classList.add('hidden');
        listGrid.classList.remove('hidden');
    } else {
        emptyState.classList.remove('hidden');
        listGrid.classList.add('hidden');
    }
}

function renderProductView(id) {
    const data = FONT_DATABASE[id];
    const listView = document.getElementById('list-view');
    const productView = document.getElementById('product-view');

    if(listView) listView.classList.add('hidden');
    if(productView) productView.classList.remove('hidden');

    document.title = data.meta.title;
    
    const itemTags = Array.isArray(data.meta.tags) ? data.meta.tags : [data.meta.tags];
    safeText('f-tag', itemTags[0]);
    safeText('f-badge', data.meta.badge);

    safeHTML('f-title', data.hero.title);
    safeText('f-enName', data.hero.enName);
    safeText('f-desc', data.hero.description);

    const imgEl = document.getElementById('p-image');
    if (imgEl) {
        imgEl.src = data.hero.lightImg;
        imgEl.setAttribute('data-dark-src', data.hero.darkImg);
        if (document.documentElement.classList.contains('dark')) {
            imgEl.src = data.hero.darkImg;
        }
    }

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

    const galleryContainer = document.getElementById('f-gallery-container');
    if (galleryContainer) {
        galleryContainer.innerHTML = data.gallery.map((src, index) => `
            <div class="relative w-full z-${30 - index} ${index > 0 ? '-mt-px' : ''}">
                <img src="${src}" class="block w-full h-auto hover:scale-[1.01] transition-transform duration-700 ease-in-out ${index === 0 ? 'origin-bottom' : 'origin-top'}" loading="lazy" />
            </div>
        `).join('');
    }

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