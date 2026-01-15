/**
 * TYPEFOUNDRY STUDIO - CORE LOGIC
 */

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
    
    // 如果存在产品网格（Fonts页），则初始化
    if (document.getElementById('products-grid')) {
        initProductGrid(); 
    }
    
    // 初始化首页轮播图 (新增)
    initHeroCarousel();
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
            // 向下滚动隐藏导航，向上滚动显示
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


// ================= 6. Product Grid Logic (Fonts Page) =================
function initProductGrid() {
    const grid = document.getElementById('products-grid');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-input');
    const heroCountLabel = document.getElementById('hero-total-count'); 
    const categoryBtns = document.querySelectorAll('.cat-btn');
    const filterPill = document.getElementById('filter-pill');
    
    let activeCategory = '全部';
    let searchQuery = '';
    let isAnimating = false;

    function renderGrid() {
        if (!grid) return;
        
        if (heroCountLabel) {
            heroCountLabel.textContent = `当前上线 ${ALL_PRODUCTS.length} 款字体`;
        }

        grid.innerHTML = ALL_PRODUCTS.map((item, index) => {
            const catString = item.categories.join(' '); 

            return `
            <a href="${item.link || '#'}" 
               target="_blank" 
               data-title="${item.title.toLowerCase()}" 
               data-subtitle="${item.subtitle.toLowerCase()}"
               data-categories="${catString}" 
               class="product-card group relative flex flex-col gap-3 app-enter" 
               style="animation-delay: ${index * 50}ms">
                
                <div class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-900 isolate">
                    <img src="${item.imageUrl}" 
                         alt="${item.title}" 
                         loading="lazy"
                         class="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105 will-change-transform" />
                    
                    <div class="absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/2 dark:group-hover:bg-white/5"></div>
                    <div class="absolute inset-0 border border-black/5 dark:border-white/10 rounded-2xl pointer-events-none"></div>

                    <div class="absolute top-3 right-3 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                        <span class="inline-flex items-center px-2.5 py-1 rounded-full bg-white/90 text-black text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm dark:bg-black/90 dark:text-white border border-black/5 dark:border-white/10">
                           ${item.badge}
                        </span>
                    </div>
                </div>
                
                <div class="px-1 flex items-center justify-between">
                    <div>
                        <h3 class="text-sm font-bold text-gray-900 dark:text-white leading-tight">${item.title}</h3>
                        <p class="text-[11px] font-medium text-gray-400 dark:text-neutral-500 mt-0.5 tracking-wide">${item.subtitle}</p>
                    </div>
                    
                    <div class="size-6 rounded-full bg-transparent flex items-center justify-center text-gray-300 group-hover:text-black dark:text-neutral-700 dark:group-hover:text-white transition-colors duration-300">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </div>
                </div>
            </a>
            `;
        }).join('');
    }

    async function updateFilter() {
        if (!grid || isAnimating) return;
        isAnimating = true;

        grid.classList.add('opacity-0', 'translate-y-4', 'scale-[0.98]');
        await new Promise(resolve => setTimeout(resolve, 200));

        const cards = Array.from(document.querySelectorAll('.product-card'));
        let visibleCount = 0;

        cards.forEach(card => {
            const title = card.dataset.title;
            const subtitle = card.dataset.subtitle;
            const itemCats = card.dataset.categories;
            
            const matchSearch = title.includes(searchQuery) || subtitle.includes(searchQuery);
            const matchCat = !activeCategory || activeCategory === '全部' || itemCats.includes(activeCategory);

            if (matchSearch && matchCat) {
                card.style.display = 'flex';
                card.style.animation = 'none';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        if (visibleCount === 0) {
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
            grid.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            emptyState.classList.remove('flex');
            grid.classList.remove('hidden');
        }

        grid.classList.remove('opacity-0', 'translate-y-4', 'scale-[0.98]');
        
        const visibleCards = cards.filter(c => c.style.display !== 'none');
        visibleCards.forEach((card, index) => {
            void card.offsetWidth;
            card.style.animation = `appEnter 0.6s cubic-bezier(0.2, 0.9, 0.2, 1) ${index * 0.05}s backwards`;
        });

        if (heroCountLabel) {
            heroCountLabel.textContent = `当前上线 ${visibleCount} 款字体`;
        }

        setTimeout(() => { isAnimating = false; }, 300);
    }

    function movePillTo(element) {
        if (!filterPill) return;
        if (!element) {
            filterPill.style.opacity = '0';
            return;
        }
        filterPill.style.opacity = '1';
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
            
            if (searchQuery.length > 0) {
                activeCategory = null; 
                categoryBtns.forEach(b => { 
                    b.classList.remove('text-black', 'dark:text-white', 'font-bold'); 
                    b.classList.add('text-gray-500', 'font-medium'); 
                });
                movePillTo(null);
            } else {
                activeCategory = '全部';
                const allBtn = categoryBtns[0];
                movePillTo(allBtn);
                allBtn.classList.remove('text-gray-500', 'font-medium');
                allBtn.classList.add('text-black', 'dark:text-white', 'font-bold');
            }

            clearTimeout(window.searchDebounce);
            window.searchDebounce = setTimeout(updateFilter, 150);
        });
    }

    categoryBtns.forEach(btn => btn.addEventListener('click', (e) => {
        if (searchInput) {
            searchInput.value = '';
            searchQuery = '';
        }
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
        if (activeCategory) {
            const activeBtn = Array.from(categoryBtns).find(b => b.dataset.category === activeCategory);
            if(activeBtn) movePillTo(activeBtn);
        }
    });

    renderGrid();
}

// ================= 7. Image Viewer (Detailed Page) =================
function setupGlobalImageViewer() {
    const container = document.getElementById('image-viewer-container');
    const img = document.getElementById('p-image');
    const slider = document.getElementById('zoom-slider');
    const toggleBtn = document.getElementById('img-toggle-btn');
    
    if (!container || !img) return;

    let zoom = 1;
    let pan = { x: 0, y: 0 };
    let startPan = { x: 0, y: 0 };
    let isDragging = false;
    let initialPinchDistance = null;
    let initialZoom = 1;
    let lastTouchPos = { x: 0, y: 0 };

    const lightSrc = img.src;
    const darkSrc = img.getAttribute('data-dark-src');
    let viewMode = 'light';

    function updateTransform() {
        zoom = Math.min(Math.max(1, zoom), 3);
        
        if (zoom <= 1) {
            pan = { x: 0, y: 0 }; 
        } else {
            const width = container.offsetWidth;
            const height = container.offsetHeight;
            const maxOverflowX = (width * zoom - width) / 2;
            const maxOverflowY = (height * zoom - height) / 2;
            pan.x = Math.min(Math.max(pan.x, -maxOverflowX), maxOverflowX);
            pan.y = Math.min(Math.max(pan.y, -maxOverflowY), maxOverflowY);
        }
        img.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
        if (slider) slider.value = zoom;
        container.style.cursor = zoom > 1 ? 'grab' : 'default';
    }

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
            e.preventDefault(); 
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

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault(); 
            initialPinchDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            initialZoom = zoom;
        } else if (e.touches.length === 1 && zoom > 1) {
            lastTouchPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2 && initialPinchDistance) {
            e.preventDefault();
            const currentDistance = Math.hypot(
                e.touches[0].pageX - e.touches[1].pageX,
                e.touches[0].pageY - e.touches[1].pageY
            );
            zoom = initialZoom * (currentDistance / initialPinchDistance);
            updateTransform();
        } else if (e.touches.length === 1 && zoom > 1) {
            e.preventDefault();
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            pan.x += currentX - lastTouchPos.x;
            pan.y += currentY - lastTouchPos.y;
            lastTouchPos = { x: currentX, y: currentY };
            updateTransform();
        }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
        if (e.touches.length < 2) initialPinchDistance = null;
    });

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

// ================= 10. Hero Carousel Logic (New) =================
let currentSlide = 0;
let slideInterval;
const totalSlides = 3; 

function initHeroCarousel() {
    if (!document.getElementById('hero-carousel')) return;
    
    startSlideTimer();
    
    const container = document.getElementById('hero-carousel');
    container.addEventListener('mouseenter', stopSlideTimer);
    container.addEventListener('mouseleave', startSlideTimer);
}

function switchHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    
    currentSlide = index;

    slides.forEach((slide, i) => {
        const img = slide.querySelector('.slide-img');
        if (i === currentSlide) {
            slide.classList.remove('opacity-0', 'z-10');
            slide.classList.add('opacity-100', 'z-20');
            if(img) {
                // 重置并重新开始缩放动画
                img.style.transition = 'none';
                img.style.transform = 'scale(1)';
                setTimeout(() => {
                    img.style.transition = 'transform 8s linear';
                    img.style.transform = 'scale(1.1)';
                }, 50);
            }
        } else {
            slide.classList.remove('opacity-100', 'z-20');
            slide.classList.add('opacity-0', 'z-10');
            if(img) img.style.transform = 'scale(1)';
        }
    });

    dots.forEach((dot, i) => {
        if (i === currentSlide) {
            dot.classList.remove('opacity-50', 'w-2');
            dot.classList.add('opacity-100', 'w-8');
        } else {
            dot.classList.remove('opacity-100', 'w-8');
            dot.classList.add('opacity-50', 'w-2');
        }
    });
}

function nextHeroSlide() { switchHeroSlide(currentSlide + 1); }
function prevHeroSlide() { switchHeroSlide(currentSlide - 1); }

function startSlideTimer() {
    stopSlideTimer();
    slideInterval = setInterval(nextHeroSlide, 5000); 
}

function stopSlideTimer() {
    if (slideInterval) clearInterval(slideInterval);
}