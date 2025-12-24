/**
 * TYPEFOUNDRY STUDIO - CORE LOGIC
 * Refined: 2025-12-18 (Complete & Exquisite Version)
 * Modified: Subtle Blur & Refined Typography Size
 */


// ==============================================================
// 2. MAIN INITIALIZATION
// ==============================================================

document.addEventListener('DOMContentLoaded', () => {
    // 通用初始化
    initTheme();
    initScrollLogic(); 
    highlightCurrentPage();
    setupAccordion(); 
    setupAboutScrollSpy(); 
    setupGlobalImageViewer();
    injectBackToTop(); 
    initDocsNavigation();
    
    // 页面特定初始化
    if (document.getElementById('hero-slides')) {
        initHeroSlider(); 
    }
    
    // 仅在字体列表页存在 products-grid 时初始化
    if (document.getElementById('products-grid')) {
        initProductGrid(); 
    }
});

// ================= 3. Theme Logic =================
function initTheme() {
    const isDark = localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    applyTheme(isDark);
}
function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateIcons(isDark);
}
function applyTheme(isDark) {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    updateIcons(isDark);
}
function updateIcons(isDark) {
    setTimeout(() => {
        const sunIcons = document.querySelectorAll('.icon-sun');
        const moonIcons = document.querySelectorAll('.icon-moon');
        sunIcons.forEach(icon => icon.style.display = isDark ? 'block' : 'none');
        moonIcons.forEach(icon => icon.style.display = isDark ? 'none' : 'block');
        
        const logos = document.querySelectorAll('.nav-logo');
        logos.forEach(logo => {
            logo.style.filter = isDark ? 'brightness(0) invert(1)' : 'none';
        });
    }, 50);
}

// ================= 4. Scroll & Nav Logic =================
function injectBackToTop() {
    if (document.getElementById('back-to-top')) return;
    const btn = document.createElement('button');
    btn.id = 'back-to-top';
    btn.className = 'back-to-top flex size-12 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200 cursor-pointer shadow-2xl';
    btn.innerHTML = '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>';
    btn.onclick = (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    document.body.appendChild(btn);
}

function initScrollLogic() {
    let lastScrollY = window.scrollY;
    const nav = document.getElementById('nav-placeholder');
    const filterBar = document.getElementById('filter-bar'); 

    if(nav) nav.classList.add('nav-transition');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const backToTop = document.getElementById('back-to-top');
        
        if (nav) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                nav.classList.add('nav-hidden');
                nav.classList.remove('nav-visible');
                if (filterBar) {
                    filterBar.classList.remove('top-20');
                    filterBar.classList.add('top-0');
                }
            } else {
                nav.classList.remove('nav-hidden');
                nav.classList.add('nav-visible');
                if (filterBar) {
                    filterBar.classList.remove('top-0');
                    filterBar.classList.add('top-20');
                }
            }
        }

        if (backToTop) {
            if (currentScrollY > 300) backToTop.classList.add('visible');
            else backToTop.classList.remove('visible');
        }
        lastScrollY = currentScrollY;
    });
}

function highlightCurrentPage() {
    setTimeout(() => {
        const path = window.location.pathname; 
        let page = '';
        
        if (path === '/' || path.endsWith('/index.html') || path.endsWith('/')) {
            page = 'home';
        } else if (path.includes('fonts')) {
            page = 'products'; 
        } else if (path.includes('licensing')) {
            page = 'licensing';
        } else if (path.includes('docs')) {
            page = 'docs';
        } else if (path.includes('about')) {
            page = 'about';
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('text-black', 'dark:text-white', 'opacity-100', 'font-bold');
            link.classList.add('text-gray-500', 'dark:text-neutral-500');

            if (link.dataset.page === page) {
                link.classList.remove('text-gray-500', 'dark:text-neutral-500');
                link.classList.add('text-black', 'dark:text-white', 'opacity-100', 'font-bold');
            }
        });
        
        document.querySelectorAll('.mobile-nav-link').forEach(link => {
             if (link.dataset.page === page) {
                link.classList.remove('text-gray-500'); 
                link.classList.add('text-black', 'dark:text-white');
            }
        });
    }, 100);
}

function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    const top = document.getElementById('hamburger-top');
    const mid = document.getElementById('hamburger-mid');
    const bot = document.getElementById('hamburger-bot');
    const nav = document.getElementById('nav-placeholder');
    
    if (!menu) return;
    
    const isOpen = menu.classList.contains('is-open');
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    if (!isOpen) {
        menu.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        menu.classList.add('is-open', 'opacity-100', 'pointer-events-auto', 'translate-y-0');
        document.body.style.overflow = 'hidden'; 
        document.body.style.paddingRight = `${scrollbarWidth}px`;
        if (nav) nav.style.borderRight = `${scrollbarWidth}px solid transparent`;

        if(top && mid && bot) {
            top.classList.add('rotate-45', 'translate-y-[8px]');
            mid.classList.add('opacity-0');
            bot.classList.add('-rotate-45', '-translate-y-[8px]');
        }

        const items = document.querySelectorAll('.mobile-nav-item');
        items.forEach((item, idx) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
                item.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 100 + (idx * 60));
        });
    } else {
        menu.classList.remove('is-open', 'opacity-100', 'pointer-events-auto', 'translate-y-0');
        menu.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        document.body.style.overflow = ''; 
        document.body.style.paddingRight = '';
        if (nav) nav.style.borderRight = '';

        if(top && mid && bot) {
            top.classList.remove('rotate-45', 'translate-y-[8px]');
            mid.classList.remove('opacity-0');
            bot.classList.remove('-rotate-45', '-translate-y-[8px]');
        }
        
        const items = document.querySelectorAll('.mobile-nav-item');
        items.forEach((item) => { item.style.transition = 'none'; });
    }
}

// ================= 5. Bento Card Generator (Subtle Blur & Smaller Text) =================
function createBentoCard(item) {
    const href = item.link || '#';
    return `
        <a href="${href}" target="_blank" class="group relative isolate overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-800 border border-transparent dark:border-neutral-800 ${item.colSpan || 'md:col-span-1'} ${item.rowSpan || 'md:row-span-1'} min-h-[300px] lg:min-h-[360px] block transition-all duration-500 ease-out hover:shadow-2xl">
            <div class="absolute inset-0 size-full overflow-hidden rounded-2xl">
                <img src="${item.imageUrl}" alt="${item.title}" class="size-full object-cover transition-all duration-700 ease-out group-hover:scale-105 group-hover:blur-[1px]" />
                
                <div class="absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
            </div>
            
            <div class="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                <div class="flex items-end justify-between">
                    <div class="transform translate-y-4 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 text-shadow-subtle">
                        <span class="mb-2 block text-xs font-bold uppercase tracking-widest text-white/90">${item.subtitle}</span>
                        <h3 class="text-xl font-black text-white md:text-2xl lg:text-3xl tracking-tight">${item.title}</h3>
                    </div>
                    
                    <div class="flex size-12 translate-y-4 opacity-0 transition-all duration-500 ease-out delay-75 group-hover:translate-y-0 group-hover:opacity-100 items-center justify-center rounded-full bg-white text-black shadow-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"></path></svg>
                    </div>
                </div>
            </div>
        </a>
    `;
}

// ================= 6. Product Grid Logic (EXQUISITE VERSION) =================
function initProductGrid() {
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const countLabel = document.getElementById('result-count');
    const categoryBtns = document.querySelectorAll('.cat-btn');
    const filterPill = document.getElementById('filter-pill');
    
    let activeCategory = '全部';
    let searchQuery = '';

    function renderGrid() {
        grid.innerHTML = ALL_PRODUCTS.map((item, index) => {
            const delay = index * 50; 
            const href = item.link || '#';
            
            // 标签样式：Mono字体，极小字号，边框+透明背景，突显参数感
            const tagsHtml = item.tags ? item.tags.map(tag => 
                `<span class="inline-flex items-center rounded-[4px] border border-gray-100 bg-gray-50 px-1.5 py-0.5 text-[9px] font-mono text-gray-500 dark:border-neutral-800 dark:bg-neutral-900/50 dark:text-neutral-500 transition-colors group-hover:border-gray-200 dark:group-hover:border-neutral-700">${tag}</span>`
            ).join('') : '';

            return `
            <a href="${href}" 
               target="_blank" 
               data-title="${item.title.toLowerCase()}" 
               data-subtitle="${item.subtitle.toLowerCase()}"
               data-category="${item.category}"
               class="product-card group relative flex flex-col overflow-hidden rounded-xl bg-white border border-gray-100 dark:bg-neutral-950 dark:border-neutral-800/60 transition-all duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:hover:shadow-[0_8px_30px_rgb(255,255,255,0.02)] hover:border-gray-300 dark:hover:border-neutral-600 animate-fade-up-init" 
               style="animation-delay: ${delay}ms">
                
                <div class="relative aspect-[16/10] w-full overflow-hidden bg-gray-50 dark:bg-neutral-900">
                    <img src="${item.imageUrl}" 
                         alt="${item.title}" 
                         loading="lazy"
                         decoding="async"
                         class="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 will-change-transform" />
                    
                    <div class="absolute top-2.5 left-2.5">
                        <span class="inline-flex items-center rounded-md bg-white/70 backdrop-blur-md border border-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-black/80 shadow-sm dark:bg-black/60 dark:text-white/90 dark:border-white/10">
                           ${item.category}
                        </span>
                    </div>
                </div>
                
                <div class="flex flex-1 flex-col p-4">
                    <div class="flex items-start justify-between gap-4 mb-3">
                        <div class="min-w-0">
                            <h3 class="text-[15px] font-semibold text-gray-900 dark:text-white leading-snug mb-0.5 truncate pr-2 group-hover:text-black dark:group-hover:text-white transition-colors tracking-tight">${item.title}</h3>
                            <p class="text-[10px] font-medium text-gray-400 dark:text-neutral-500 uppercase tracking-widest font-sans truncate">${item.subtitle}</p>
                        </div>
                        
                        <div class="flex size-6 shrink-0 items-center justify-center rounded-full border border-gray-100 bg-transparent text-gray-300 transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white dark:border-neutral-800 dark:text-neutral-600 dark:group-hover:border-white dark:group-hover:bg-white dark:group-hover:text-black">
                            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"></path></svg>
                        </div>
                    </div>

                    <div class="mt-auto flex flex-wrap gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                         ${tagsHtml}
                    </div>
                </div>
            </a>
            `;
        }).join('');
        
        updateFilter();
    }

    function updateFilter() {
        const cards = document.querySelectorAll('.product-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.dataset.title;
            const subtitle = card.dataset.subtitle;
            const category = card.dataset.category;
            const matchSearch = title.includes(searchQuery) || subtitle.includes(searchQuery);
            const matchCat = activeCategory === '全部' || category === activeCategory;

            if (matchSearch && matchCat) {
                card.style.display = 'flex';
                card.classList.remove('animate-fade-up-init');
                void card.offsetWidth; 
                card.classList.add('animate-fade-in');
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (countLabel) countLabel.textContent = `共 ${visibleCount} 款字体`;

        if (visibleCount === 0) {
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
            grid.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            emptyState.classList.remove('flex');
            grid.classList.remove('hidden');
        }
    }

    function movePillTo(element) {
        if (!filterPill) return;
        const padding = 4; 
        const width = element.offsetWidth;
        const left = element.offsetLeft;
        filterPill.style.willChange = 'transform, width';
        filterPill.style.width = `${width}px`;
        filterPill.style.transform = `translateX(${left - padding}px)`; 
    }

    if(categoryBtns.length > 0) {
        setTimeout(() => movePillTo(categoryBtns[0]), 50);
    }

    if(searchInput) {
        searchInput.addEventListener('input', (e) => { 
            searchQuery = e.target.value.toLowerCase(); 
            updateFilter(); 
        });
    }

    categoryBtns.forEach(btn => btn.addEventListener('click', (e) => {
        movePillTo(e.target);
        categoryBtns.forEach(b => { 
            b.classList.remove('text-black', 'dark:text-white', 'font-bold'); 
            b.classList.add('text-gray-500', 'font-medium'); 
        });
        btn.classList.remove('text-gray-500', 'font-medium'); 
        btn.classList.add('text-black', 'dark:text-white', 'font-bold');
        activeCategory = btn.dataset.category; 
        updateFilter();
    }));

    window.addEventListener('resize', () => {
        const activeBtn = Array.from(categoryBtns).find(b => b.dataset.category === activeCategory);
        if(activeBtn) movePillTo(activeBtn);
    });

    renderGrid();
}

// ================= 7. Image Viewer & Modal (Mobile Optimized) =================
function setupGlobalImageViewer() {
    const container = document.getElementById('image-viewer-container');
    const img = document.getElementById('p-image');
    const slider = document.getElementById('zoom-slider');
    const toggleBtn = document.getElementById('img-toggle-btn');
    
    if (!container || !img) return;

    // 状态变量
    let zoom = 1;
    let pan = { x: 0, y: 0 };
    
    // 鼠标拖拽变量
    let startPan = { x: 0, y: 0 };
    let isDragging = false;

    // 触摸手势变量
    let initialPinchDistance = null;
    let initialZoom = 1;
    let lastTouchPos = { x: 0, y: 0 };

    const lightSrc = img.src;
    const darkSrc = img.getAttribute('data-dark-src');
    let viewMode = 'light';

    // === 通用逻辑：更新变换 ===
    function updateTransform() {
        // 限制 zoom 范围
        zoom = Math.min(Math.max(1, zoom), 3);
        
        // 限制 pan 范围 (确保不出界)
        if (zoom <= 1) {
            pan = { x: 0, y: 0 }; // 缩回 1.0 时自动归位
        } else {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            const maxOverflowX = (width * zoom - width) / 2;
            const maxOverflowY = (height * zoom - height) / 2;
            pan.x = Math.min(Math.max(pan.x, -maxOverflowX), maxOverflowX);
            pan.y = Math.min(Math.max(pan.y, -maxOverflowY), maxOverflowY);
        }

        // 应用变换
        img.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
        
        // 同步更新 Slider (如果存在)
        if (slider) slider.value = zoom;
        
        // 更新光标状态
        container.style.cursor = zoom > 1 ? 'grab' : 'default';
    }

    // === 桌面端：滑杆与鼠标逻辑 ===
    if (slider) {
        slider.addEventListener('mousedown', (e) => e.stopPropagation());
        slider.addEventListener('touchstart', (e) => e.stopPropagation());
        
        slider.addEventListener('input', (e) => {
            zoom = parseFloat(e.target.value);
            updateTransform();
        });
    }

    container.addEventListener('mousedown', (e) => {
        if (zoom > 1) {
            isDragging = true;
            startPan = { x: e.clientX - pan.x, y: e.clientY - pan.y };
            container.style.cursor = 'grabbing';
            e.preventDefault(); // 防止默认拖拽图片行为
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging && zoom > 1) {
            e.preventDefault();
            pan.x = e.clientX - startPan.x;
            pan.y = e.clientY - startPan.y;
            updateTransform();
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = zoom > 1 ? 'grab' : 'default';
        }
    });
    
    container.addEventListener('mouseleave', () => { isDragging = false; });

    // === 移动端：触摸逻辑 (Touch Events) ===
    
    // 辅助函数：计算两指距离
    function getDistance(touches) {
        return Math.hypot(
            touches[0].pageX - touches[1].pageX,
            touches[0].pageY - touches[1].pageY
        );
    }

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            // --- 双指开始：缩放 ---
            e.preventDefault(); // 阻止浏览器默认缩放
            initialPinchDistance = getDistance(e.touches);
            initialZoom = zoom;
        } else if (e.touches.length === 1) {
            // --- 单指开始：准备拖拽 ---
            // 只有当已经放大时，才记录坐标，否则允许页面滚动
            if (zoom > 1) {
                lastTouchPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && initialPinchDistance) {
            // --- 双指移动：缩放 ---
            e.preventDefault();
            const currentDistance = getDistance(e.touches);
            // 计算新的缩放比例
            const scaleFactor = currentDistance / initialPinchDistance;
            zoom = initialZoom * scaleFactor;
            updateTransform();
        } else if (e.touches.length === 1 && zoom > 1) {
            // --- 单指移动：拖拽 (仅在放大状态下) ---
            e.preventDefault(); // 阻止页面滚动，专注于看图
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            // 计算位移差
            const deltaX = currentX - lastTouchPos.x;
            const deltaY = currentY - lastTouchPos.y;
            
            pan.x += deltaX;
            pan.y += deltaY;
            
            lastTouchPos = { x: currentX, y: currentY };
            updateTransform();
        }
        // 如果 zoom === 1 且单指滑动，不调用 preventDefault，允许用户滑动页面
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
        // 手指离开时，清理状态
        if (e.touches.length < 2) {
            initialPinchDistance = null;
        }
    });

    // === 其他：背景切换 ===
    if (!darkSrc && toggleBtn) toggleBtn.style.display = 'none';
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            viewMode = viewMode === 'light' ? 'dark' : 'light';
            if (darkSrc) img.src = viewMode === 'light' ? lightSrc : darkSrc;
            container.style.backgroundColor = viewMode === 'light' ? '#f9fafb' : '#0f0f0f';
        });
    }
}

function openDownloadModal() { document.getElementById('download-modal')?.classList.remove('hidden'); }
function closeDownloadModal() { document.getElementById('download-modal')?.classList.add('hidden'); }
function initDocsNavigation() {
    const params = new URLSearchParams(window.location.search);
    const target = params.get('section');
}

// ================= 8. HERO SLIDER =================
function initHeroSlider() {
    const slidesContainer = document.getElementById('hero-slides');
    const menuContainer = document.getElementById('hero-menu');
    const imageLink = document.getElementById('hero-image-link');
    
    if (!slidesContainer || !menuContainer) return;

    let activeIndex = 0;
    let autoPlayInterval;

    slidesContainer.innerHTML = HERO_CONFIG.map((slide, index) => `
        <div class="hero-slide absolute inset-0 size-full transition-all duration-[1500ms] cubic-bezier(0.19, 1, 0.22, 1) ${index === 0 ? 'opacity-100 z-10 scale-100' : 'opacity-0 z-0 scale-105'}" data-index="${index}">
            <img src="${slide.poster}" alt="${slide.label}" class="size-full object-cover select-none" draggable="false">
        </div>
    `).join('');

    const renderMenu = () => {
        menuContainer.innerHTML = HERO_CONFIG.map((slide, index) => {
            const isActive = index === activeIndex;
            return `
            <button class="hero-menu-item group flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full backdrop-blur-md transition-all duration-300
                ${isActive 
                    ? 'bg-white text-black shadow-xl scale-105 border border-transparent' 
                    : 'bg-black/30 text-white/90 border border-white/20 hover:bg-black/50'}" 
                data-index="${index}">
                
                <span class="text-[10px] font-bold uppercase tracking-widest ${isActive ? 'opacity-100' : 'opacity-70'}">0${index + 1}</span>
                <span class="text-xs md:text-sm font-bold whitespace-nowrap tracking-wide">${slide.label}</span>
                
            </button>
            `;
        }).join('');
        
        document.querySelectorAll('.hero-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const newIndex = parseInt(item.dataset.index);
                if (newIndex !== activeIndex) {
                    resetAutoPlay();
                    switchSlide(newIndex);
                }
            });
        });
    };

    const switchSlide = (index) => {
        activeIndex = index;
        const config = HERO_CONFIG[index];

        const slides = document.querySelectorAll('.hero-slide');
        slides.forEach((s, idx) => {
            if (idx === index) {
                s.classList.remove('opacity-0', 'z-0', 'scale-105');
                s.classList.add('opacity-100', 'z-10', 'scale-100');
            } else {
                s.classList.remove('opacity-100', 'z-10', 'scale-100');
                s.classList.add('opacity-0', 'z-0', 'scale-105');
            }
        });

        if (imageLink) imageLink.href = config.link;
        renderMenu();
    };

    const startAutoPlay = () => {
        autoPlayInterval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % HERO_CONFIG.length;
            switchSlide(nextIndex);
        }, 5000); 
    };

    const resetAutoPlay = () => {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    };

    renderMenu();
    switchSlide(0);
    startAutoPlay();
}

// ================= 9. Utils (Accordion & ScrollSpy) =================
function setupAccordion() {
    document.querySelectorAll('.accordion-btn').forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const icon = button.querySelector('.accordion-icon');
            const isOpen = content.classList.contains('accordion-open');
            
            document.querySelectorAll('.accordion-content').forEach(c => { 
                c.classList.remove('accordion-open'); 
                c.classList.add('accordion-closed'); 
            });
            document.querySelectorAll('.accordion-icon').forEach(i => i.classList.remove('rotate-45'));
            
            if (!isOpen) { 
                content.classList.remove('accordion-closed'); 
                content.classList.add('accordion-open'); 
                icon.classList.add('rotate-45'); 
            }
        });
    });
}

function setupAboutScrollSpy() {
    if (!window.location.pathname.includes('about')) return;
    
    const sections = ['vision', 'business', 'philosophy', 'clients', 'contact'];
    const navItems = document.querySelectorAll('.about-nav-btn');
    
    const onScroll = () => {
        let current = '';
        const scrollPosition = window.scrollY;
        
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 50) {
            current = sections[sections.length - 1];
        } else {
            sections.forEach(id => { 
                const el = document.getElementById(id); 
                if (el && scrollPosition >= (el.offsetTop - 400)) {
                    current = id; 
                }
            });
        }
        
        navItems.forEach(btn => {
            btn.classList.remove('text-black', 'dark:text-white', 'opacity-100');
            btn.classList.add('text-gray-400', 'font-medium');
            
            if (btn.getAttribute('href') === '#' + current) {
                btn.classList.add('text-black', 'dark:text-white', 'opacity-100');
                btn.classList.remove('text-gray-400');
            }
        });
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); 
}