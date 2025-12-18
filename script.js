/**
 * TYPEFOUNDRY STUDIO - CORE LOGIC
 */

// ==============================================================
// 1. HERO CONFIGURATION (内容配置)
// ==============================================================
const HERO_CONFIG = [
    {
        label: "Qidian Sans",
        description: "探索可变字体的新边界",
        poster: "https://pic3.fukit.cn/autoupload/NWINCyTOTWqNUcPQazQq69iO_OyvX7mIgxFBfDMDErs/20251127/YAWh/1400X600/1-07.jpg/webp", 
        link: "fonts/zizaizhisans.html"
    },
    {
        label: "Type Tools",
        description: "提升创作效率的利器",
        poster: "https://pic3.fukit.cn/autoupload/NWINCyTOTWqNUcPQazQq69iO_OyvX7mIgxFBfDMDErs/20251127/xD17/1400X600/1-12.jpg/webp",
        link: "https://www.zizao.top/tools/txt"
    },
    {
        label: "Inspiration",
        description: "捕捉每一个创意瞬间",
        poster: "https://pic3.fukit.cn/autoupload/NWINCyTOTWqNUcPQazQq69iO_OyvX7mIgxFBfDMDErs/20251127/hfoR/680X600/1-09.jpg/webp",
        link: "https://hao.zizao.top"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollLogic(); 
    highlightCurrentPage();
    setupAccordion(); 
    setupAboutScrollSpy(); 
    setupGlobalImageViewer();
    injectBackToTop(); 
    initHeroSlider(); 
    initDocsNavigation();
});

// ================= 2. Theme Logic =================
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

// ================= 3. Scroll & Nav Logic =================
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
    if(nav) nav.classList.add('nav-transition');

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        const backToTop = document.getElementById('back-to-top');
        
        if (nav) {
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                nav.classList.add('nav-hidden');
                nav.classList.remove('nav-visible');
            } else {
                nav.classList.remove('nav-hidden');
                nav.classList.add('nav-visible');
            }
            
            if (currentScrollY > 50) {
                nav.classList.remove('bg-white/0', 'dark:bg-black/0', 'border-white/0', 'dark:border-white/0');
                nav.classList.add('bg-white/90', 'dark:bg-neutral-950/90', 'border-gray-100', 'dark:border-neutral-900', 'backdrop-blur-md');
            } else {
                nav.classList.add('bg-white/0', 'dark:bg-black/0', 'border-white/0', 'dark:border-white/0');
                nav.classList.remove('bg-white/90', 'dark:bg-neutral-950/90', 'border-gray-100', 'dark:border-neutral-900', 'backdrop-blur-md');
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

// ================= 4. Docs Page Logic =================
function initDocsNavigation() {
    if (!document.getElementById('docs-content')) return;

    const buttons = document.querySelectorAll('.docs-nav-btn');
    const sections = document.querySelectorAll('.docs-section');
    
    const params = new URLSearchParams(window.location.search);
    const initialSection = params.get('section') || 'copyright';

    const activateSection = (id) => {
        buttons.forEach(btn => {
            if (btn.dataset.target === id) {
                btn.classList.add('active-doc-btn');
                btn.classList.remove('text-gray-500', 'dark:text-neutral-500');
            } else {
                btn.classList.remove('active-doc-btn');
                btn.classList.add('text-gray-500', 'dark:text-neutral-500');
            }
        });

        sections.forEach(sec => {
            if (sec.id === id) {
                sec.classList.remove('hidden');
                setTimeout(() => sec.classList.remove('opacity-0', 'translate-y-4'), 10);
            } else {
                sec.classList.add('hidden', 'opacity-0', 'translate-y-4');
            }
        });
    };

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('section', target);
            window.history.pushState({}, '', newUrl);
            activateSection(target);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    activateSection(initialSection);
}

// ================= 5. Bento Card Generator =================
function createBentoCard(item) {
    const href = item.link || '#';
    return `
        <a href="${href}" target="_blank" class="group relative isolate overflow-hidden rounded-2xl bg-gray-100 dark:bg-neutral-800 border border-transparent dark:border-neutral-800 ${item.colSpan || 'md:col-span-1'} ${item.rowSpan || 'md:row-span-1'} min-h-[300px] lg:min-h-[360px] block transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1 hover:border-black dark:hover:border-white">
            <div class="absolute inset-0 size-full overflow-hidden rounded-2xl">
                <img src="${item.imageUrl}" alt="${item.title}" class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-50"></div>
            </div>
            <div class="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                <div class="flex items-end justify-between">
                    <div class="transform transition-transform duration-500 ease-out group-hover:-translate-y-1 text-shadow-subtle">
                        <span class="mb-2 block text-xs font-bold uppercase tracking-widest text-white/90">${item.subtitle}</span>
                        <h3 class="text-2xl font-black text-white md:text-3xl lg:text-4xl tracking-tight">${item.title}</h3>
                    </div>
                    <div class="flex size-12 -translate-x-4 translate-y-4 items-center justify-center rounded-full bg-white text-black opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 shadow-lg">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7V17"></path></svg>
                    </div>
                </div>
            </div>
        </a>
    `;
}

// ================= 6. Image Viewer =================
function setupGlobalImageViewer() {
    const container = document.getElementById('image-viewer-container');
    const img = document.getElementById('p-image');
    const slider = document.getElementById('zoom-slider');
    const toggleBtn = document.getElementById('img-toggle-btn');
    
    if (!container || !img || !slider) return;

    let zoom = 1;
    let pan = { x: 0, y: 0 };
    let startPan = { x: 0, y: 0 };
    let isDragging = false;
    let viewMode = 'light';
    const lightSrc = img.src;
    const darkSrc = img.getAttribute('data-dark-src');

    slider.addEventListener('mousedown', (e) => e.stopPropagation());
    slider.addEventListener('touchstart', (e) => e.stopPropagation());

    if (!darkSrc && toggleBtn) toggleBtn.style.display = 'none';

    slider.addEventListener('input', (e) => {
        zoom = parseFloat(e.target.value);
        if (zoom === 1) pan = { x: 0, y: 0 };
        updateTransform();
        container.style.cursor = zoom > 1 ? 'grab' : 'default';
    });

    const constrainPan = (x, y, currentZoom) => {
        const width = container.offsetWidth;
        const height = container.offsetHeight;
        if (currentZoom <= 1) return { x: 0, y: 0 };
        const maxOverflowX = (width * currentZoom - width) / 2;
        const maxOverflowY = (height * currentZoom - height) / 2;
        return {
            x: Math.min(Math.max(x, -maxOverflowX), maxOverflowX),
            y: Math.min(Math.max(y, -maxOverflowY), maxOverflowY)
        };
    };

    container.addEventListener('mousedown', (e) => {
        if (zoom > 1) {
            isDragging = true;
            startPan = { x: e.clientX - pan.x, y: e.clientY - pan.y };
            container.style.cursor = 'grabbing';
        }
    });

    window.addEventListener('mousemove', (e) => {
        if (isDragging && zoom > 1) {
            e.preventDefault();
            const rawX = e.clientX - startPan.x;
            const rawY = e.clientY - startPan.y;
            pan = constrainPan(rawX, rawY, zoom);
            updateTransform();
        }
    });

    window.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = zoom > 1 ? 'grab' : 'default';
        }
    });
    
    container.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            container.style.cursor = 'default';
        }
    });

    function updateTransform() {
        img.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
    }

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

// ================= 7. Page Utils =================
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

// ================= 8. HERO SLIDER (REFACTORED - TECH DESIGN) =================
function initHeroSlider() {
    const slidesContainer = document.getElementById('hero-slides');
    const controlsContainer = document.getElementById('hero-controls-mini');
    
    // 文本元素
    const titleDisplay = document.getElementById('hero-title-display');
    const descDisplay = document.getElementById('hero-dynamic-desc');
    const indexBg = document.getElementById('hero-index-bg');
    const ctaBtn = document.getElementById('hero-cta-btn');
    
    if (!slidesContainer || !controlsContainer) return;

    // 清理可能存在的硬编码遮罩
    if (slidesContainer.parentElement) {
        const siblings = slidesContainer.parentElement.children;
        for (let el of siblings) {
            if (el.id !== 'hero-slides' && el.tagName === 'DIV' && el.className.includes('absolute') && el.className.includes('z-')) {
                 // 保持结构干净
            }
        }
    }

    let activeIndex = 0;
    const totalSlides = HERO_CONFIG.length;
    let autoPlayTimer;

    // 1. 渲染图片 (Slides)
    slidesContainer.innerHTML = HERO_CONFIG.map((slide, index) => `
        <div class="hero-slide absolute inset-0 size-full transition-all duration-1000 cubic-bezier(0.22, 1, 0.36, 1) ${index === 0 ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}" data-index="${index}">
            <img 
                src="${slide.poster}" 
                alt="${slide.label}"
                class="size-full object-cover select-none"
                draggable="false"
            >
            <div class="absolute inset-0 bg-black/5 dark:bg-black/20"></div> 
        </div>
    `).join('');

    // 2. 渲染控制条 (Mini Controls)
    controlsContainer.innerHTML = HERO_CONFIG.map((slide, index) => `
        <button class="hero-mini-btn relative flex-1 bg-white border border-gray-200 dark:bg-neutral-800 dark:border-neutral-700 rounded-lg overflow-hidden group hover:border-black dark:hover:border-white transition-colors cursor-pointer" data-index="${index}">
            <div class="absolute inset-x-0 bottom-0 h-1 bg-gray-200 dark:bg-neutral-700">
                <div class="hero-progress-bar h-full bg-black dark:bg-white w-0"></div>
            </div>
            <span class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">0${index + 1}</span>
        </button>
    `).join('');

    const miniButtons = document.querySelectorAll('.hero-mini-btn');

    // 3. 切换逻辑
    const switchSlide = (index) => {
        activeIndex = index;
        const slides = document.querySelectorAll('.hero-slide');
        const slideData = HERO_CONFIG[index];

        // A. 图片切换 (带缩放效果)
        slides.forEach((s, idx) => {
            if (idx === index) {
                s.classList.remove('opacity-0', 'scale-105', 'z-0');
                s.classList.add('opacity-100', 'scale-100', 'z-10');
            } else {
                s.classList.remove('opacity-100', 'scale-100', 'z-10');
                s.classList.add('opacity-0', 'scale-105', 'z-0');
            }
        });

        // B. 文本更新 (带淡入淡出动画)
        const updateText = (element, text) => {
            if(!element) return;
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            setTimeout(() => {
                element.innerText = text;
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300); // 300ms 与 CSS transition 匹配
        };

        if(titleDisplay) updateText(titleDisplay, slideData.label);
        if(descDisplay) updateText(descDisplay, slideData.description);
        if(indexBg) indexBg.innerText = `0${index + 1}`;
        if(ctaBtn) ctaBtn.href = slideData.link;

        // C. 进度条更新
        miniButtons.forEach((btn, idx) => {
            const bar = btn.querySelector('.hero-progress-bar');
            const span = btn.querySelector('span');
            
            // 重置
            bar.style.transition = 'none';
            bar.style.width = '0%';
            span.classList.remove('text-black', 'dark:text-white');
            span.classList.add('text-gray-400');

            if (idx === index) {
                span.classList.remove('text-gray-400');
                span.classList.add('text-black', 'dark:text-white');
                
                // 强制重绘
                void bar.offsetWidth; 
                
                // 启动动画
                bar.style.transition = 'width 5s linear';
                bar.style.width = '100%';
            }
        });
    };

    // 4. 事件绑定
    miniButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            resetTimer();
            switchSlide(parseInt(btn.dataset.index));
        });
    });

    // 5. 定时器逻辑
    const startTimer = () => {
        autoPlayTimer = setInterval(() => {
            const next = (activeIndex + 1) % totalSlides;
            switchSlide(next);
        }, 5000); 
    };

    const resetTimer = () => {
        clearInterval(autoPlayTimer);
        startTimer();
    };

    // 初始化
    switchSlide(0);
    startTimer();
}