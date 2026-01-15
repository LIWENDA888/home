/**
 * ==============================================================================
 *  🔴 全局配置区
 * ==============================================================================
 */

const SITE_CONFIG = {
    header: {
        logo: "https://pic3.fukit.cn/autoupload/NWINCyTOTWqNUcPQazQq69iO_OyvX7mIgxFBfDMDErs/20251218/mAPB/logo.svg",
        favicon: "https://pic3.fukit.cn/autoupload/NWINCyTOTWqNUcPQazQq69iO_OyvX7mIgxFBfDMDErs/20251123/AR9P/ico.ico",
    },

    // 2. 顶部导航菜单
    menu: [
        {
            type: 'dropdown', 
            name: '字体产品', 
            // 纯粹的 8 个选项
            items: [
                { title: '自在致黑 Zhisans', path: '/fonts/zhisans.html', tag: 'Variable', desc: '双轴可变现代黑体' },
                { title: '自在起点黑 Qidian', path: '/fonts/zhisans.html', tag: 'Free', desc: '回归阅读本质的开源黑体' },
                { title: '自在刻宋 Ke Serif', path: '/fonts/zizaikeserif.html', tag: 'New', desc: '极具张力的标题宋体' },
                { title: 'MOMO Mono', path: '#', tag: 'Dev', desc: '代码编程专用等宽字体' }, 
                { title: 'Zizai Sans Rounded', path: '#', tag: 'Coming', desc: '温润如玉的圆体探索' }, 
                { title: 'Neo Kai Script', path: '#', tag: 'Concept', desc: '新时代楷书试验场' }, 
                { title: 'Pixel Art 2025', path: '#', tag: 'Display', desc: '致敬复古游戏的像素体' }, 
                { title: 'View All Fonts', path: '/#featured', tag: '', desc: '查看全部字库列表' }, 
            ]
        },
        { type: 'link', name: '授权定制', path: '/licensing.html', id: 'licensing' },
        { type: 'link', name: '帮助中心', path: '/docs.html', id: 'docs' },
        { type: 'link', name: '关于我们', path: '/about.html', id: 'about' }
    ],

    footer: {
        socialTitle: "关注我们",
        socials: [
            { name: 'Douyin', link: '#', icon: 'https://pic3.fukit.cn/autoupload/NWINCyTOTWqNUcPQazQq69iO_OyvX7mIgxFBfDMDErs/20251123/25Zm/834X834/1-04.png/webp' },
            { name: 'Red',    link: '#', icon: 'https://pic3.fukit.cn/autoupload/NWINCyTOTWqNUcPQazQq69iO_OyvX7mIgxFBfDMDErs/20251123/MyKf/834X834/1-05.png/webp' },
            { name: 'Zcool',  link: '#', icon: 'https://pic3.fukit.cn/autoupload/NWINCyTOTWqNUcPQazQq69iO_OyvX7mIgxFBfDMDErs/20251123/6st1/834X834/1-06.png/webp' },
        ],
        linkGroups: [
            {
                title: "产品直达",
                links: [
                    { name: "自在致黑 Zhisans", path: "/fonts/zhisans.html" },
                    { name: "自在刻宋 Ke Serif", path: "/fonts/zizaikeserif.html" },
                    { name: "企业定制 Bespoke", path: "/licensing.html" }
                ]
            },
            {
                title: "支持与服务",
                links: [
                    { name: "授权说明 Licensing", path: "/licensing.html" },
                    { name: "常见问题 FAQ", path: "/docs.html?section=faq" },
                    { name: "联系我们 Contact", path: "/about.html#contact" }
                ]
            }
        ],
        copyright: "© 2025 ZIZAO.TOP. 自在造字. All rights reserved.",
        bottomLinks: [
            { name: "隐私政策", path: "#" },
            { name: "使用条款", path: "/docs.html?section=terms" },
            { name: "沪ICP备XXXXXXXX号", path: "https://beian.miit.gov.cn/" }
        ]
    }
};


/**
 * ==============================================================================
 *  ⚙️ 引擎区域
 * ==============================================================================
 */

// 1. 渲染桌面导航 (圆点 + 箭头交互版 - 宽间距)
const renderDesktopNav = () => {
    return SITE_CONFIG.menu.map(item => {
        if (item.type === 'dropdown') {
            
            // 生成列表项 (p-4 增加内部呼吸感)
            const listItems = item.items.map(sub => `
                <a href="${sub.path}" class="group/item flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-200">
                    
                    <!-- 1. The Dot (装饰圆点) -->
                    <div class="flex items-center justify-center">
                        <div class="size-1.5 rounded-full bg-gray-200 dark:bg-neutral-700 group-hover/item:bg-black dark:group-hover/item:bg-white group-hover/item:scale-125 transition-all duration-300"></div>
                    </div>

                    <!-- 2. Text Content -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-1">
                            <span class="text-[13px] font-bold text-gray-900 dark:text-gray-200 group-hover/item:text-black dark:group-hover/item:text-white transition-colors">
                                ${sub.title}
                            </span>
                            ${sub.tag ? `<span class="text-[9px] font-mono font-bold uppercase tracking-wider text-gray-400 border border-gray-100 dark:border-neutral-700 rounded px-1 py-px group-hover/item:border-gray-300 dark:group-hover/item:border-neutral-500 transition-colors">${sub.tag}</span>` : ''}
                        </div>
                        <p class="text-[11px] text-gray-400 dark:text-neutral-500 line-clamp-1 group-hover/item:text-gray-500 dark:group-hover/item:text-neutral-400 transition-colors">
                            ${sub.desc}
                        </p>
                    </div>

                    <!-- 3. The Arrow (悬浮滑入) -->
                    <div class="opacity-0 -translate-x-3 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300 ease-out text-gray-400 group-hover/item:text-black dark:group-hover/item:text-white">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                    </div>

                </a>
            `).join('');

            return `
            <div class="group relative h-full flex items-center">
                
                <!-- Trigger Button -->
                <button class="relative z-20 text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black dark:text-neutral-400 dark:hover:text-white nav-link transition-colors flex items-center gap-1.5 h-full px-3">
                    ${item.name}
                    <svg class="w-2.5 h-2.5 opacity-50 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                
                <!-- Floating Card (宽版 w-[640px]) -->
                <div class="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-[640px] opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] z-50">
                    
                    <div class="bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur-xl rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-2xl shadow-black/10 dark:shadow-black/50 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                        <div class="p-8">
                            
                            <!-- Header Info -->
                            <div class="flex items-center justify-between mb-6 px-4 pb-4 border-b border-gray-50 dark:border-neutral-800/50">
                                <span class="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-neutral-500">Font Collection</span>
                                <span class="text-[10px] font-mono text-gray-300 dark:text-neutral-600">01 — 08</span>
                            </div>

                            <!-- 2列网格布局 (加大间距: gap-x-6 gap-y-4) -->
                            <div class="grid grid-cols-2 gap-x-6 gap-y-4">
                                ${listItems}
                            </div>
                            
                        </div>
                    </div>
                </div>

            </div>`;
        } else {
            return `<a href="${item.path}" class="text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black dark:text-neutral-400 dark:hover:text-white nav-link transition-colors h-full flex items-center px-3" data-page="${item.id || ''}">${item.name}</a>`;
        }
    }).join('');
};

// 2. 渲染移动端导航 (保持不变)
const renderMobileNav = () => {
    return SITE_CONFIG.menu.map(item => {
        if (item.type === 'dropdown') {
            const subItems = item.items.map(sub => `
                <a href="${sub.path}" class="pl-4 py-3 border-l border-gray-100 dark:border-neutral-800 text-lg font-medium text-gray-500 hover:text-black dark:hover:text-white transition-colors flex items-center justify-between">
                    ${sub.title.split(' ')[0]} <span class="text-[10px] uppercase opacity-50">${sub.tag}</span>
                </a>
            `).join('');
            return `
            <div class="mobile-nav-item" style="opacity: 0">
                <div class="flex items-center justify-between pb-2 mb-2 border-b border-gray-100 dark:border-neutral-900">
                    <span class="text-2xl font-black tracking-tight">${item.name}</span>
                </div>
                <div class="flex flex-col gap-1 pl-2">${subItems}</div>
            </div>`;
        } else {
            return `
            <a href="${item.path}" class="mobile-nav-item flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-900" style="opacity: 0">
                <span class="text-2xl font-black tracking-tight">${item.name}</span>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Link</span>
            </a>`;
        }
    }).join('');
};

const renderFooterSocials = () => SITE_CONFIG.footer.socials.map(s => `<a href="${s.link}" target="_blank" class="group block size-12 overflow-hidden rounded-xl transition-transform hover:scale-110"><img src="${s.icon}" alt="${s.name}" class="size-full object-cover grayscale group-hover:grayscale-0 transition-all"></a>`).join('');

const renderFooterGroups = () => SITE_CONFIG.footer.linkGroups.map(group => `
    <div class="flex flex-col gap-2 text-right">
         <span class="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">${group.title}</span>
         ${group.links.map(link => `<a href="${link.path}" class="text-sm hover:underline text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">${link.name}</a>`).join('')}
    </div>
`).join('');

const renderBottomLinks = () => SITE_CONFIG.footer.bottomLinks.map(link => `<a href="${link.path}" class="hover:text-black dark:hover:text-white transition-colors">${link.name}</a>`).join('');

const SHARED_NAV_HTML = `
<div class="mx-auto flex h-20 max-w-[1800px] items-center justify-between px-6 lg:px-12 relative z-[110]">
    <a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity z-[110]">
        <img src="${SITE_CONFIG.header.logo}" alt="Logo" class="nav-logo h-7 w-auto object-contain">
    </a>
    <div class="hidden items-center gap-8 md:flex h-full">
        ${renderDesktopNav()}
        <div class="h-4 w-px bg-gray-200 dark:bg-neutral-800"></div>
        <button onclick="toggleTheme()" class="theme-toggle group flex size-8 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all text-gray-500 hover:text-black dark:text-neutral-400 dark:hover:text-white">
            <svg class="icon-sun w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <svg class="icon-moon w-4 h-4 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
        </button>
    </div>
    <button id="mobile-menu-btn" onclick="toggleMenu()" class="relative z-[110] flex flex-col justify-center gap-[6px] p-2 md:hidden group">
        <span class="h-[2px] w-6 rounded-full bg-black transition-transform duration-300 dark:bg-white origin-center" id="hamburger-top"></span>
        <span class="h-[2px] w-6 rounded-full bg-black transition-opacity duration-300 dark:bg-white" id="hamburger-mid"></span>
        <span class="h-[2px] w-6 rounded-full bg-black transition-transform duration-300 dark:bg-white origin-center" id="hamburger-bot"></span>
    </button>
</div>

<div id="mobile-menu" class="fixed inset-0 z-[100] bg-white dark:bg-neutral-950 transition-all duration-500 opacity-0 pointer-events-none translate-y-4 md:hidden flex flex-col h-[100dvh]">
    <div class="flex-1 flex flex-col px-6 pt-28 pb-8 overflow-y-auto no-scrollbar justify-between">
        <nav class="flex flex-col gap-6">
            <a href="/" class="mobile-nav-item flex items-center justify-between pb-2 border-b border-gray-100 dark:border-neutral-900" style="opacity: 0">
                <span class="text-2xl font-black tracking-tight">首页</span>
                <span class="text-xs font-bold text-gray-400 uppercase tracking-widest">Home</span>
            </a>
            ${renderMobileNav()}
        </nav>
        <div class="mt-8 mobile-nav-item" style="opacity: 0">
             <p class="text-[10px] font-bold uppercase tracking-widest text-gray-300 dark:text-neutral-700">${SITE_CONFIG.footer.copyright}</p>
        </div>
    </div>
</div>
`;

const SHARED_FOOTER_HTML = `
<div class="mx-auto max-w-[1800px] px-6 lg:px-12">
    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
        <div class="flex-1">
             <h3 class="mb-8 text-xs font-bold uppercase tracking-widest text-gray-400">${SITE_CONFIG.footer.socialTitle}</h3>
             <div class="flex flex-wrap gap-4">${renderFooterSocials()}</div>
        </div>
        <div class="flex flex-wrap gap-12 md:gap-24 justify-end">
            ${renderFooterGroups()}
        </div>
    </div>
    <div class="mt-20 flex flex-col md:flex-row items-center justify-between gap-8 border-t border-gray-100 pt-8 dark:border-neutral-900">
        <p class="text-xs text-gray-400">${SITE_CONFIG.footer.copyright}</p>
        <div class="flex gap-6 text-[10px] uppercase tracking-widest text-gray-400">
            ${renderBottomLinks()}
        </div>
    </div>
</div>
`;

document.addEventListener('DOMContentLoaded', () => {
    const navPlaceholder = document.getElementById('nav-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (navPlaceholder) navPlaceholder.innerHTML = SHARED_NAV_HTML;
    if (footerPlaceholder) footerPlaceholder.innerHTML = SHARED_FOOTER_HTML;
    
    let link = document.querySelector("link[rel~='icon']");
    if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
    link.href = SITE_CONFIG.header.favicon;
    
    const isDark = document.documentElement.classList.contains('dark');
    updateIcons(isDark);
});