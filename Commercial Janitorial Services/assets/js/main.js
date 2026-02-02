// Theme Switching Logic
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

const currentTheme = localStorage.getItem('theme') || 'light';
htmlElement.setAttribute('data-theme', currentTheme);
if (currentTheme === 'dark') {
    htmlElement.classList.add('dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const theme = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        htmlElement.setAttribute('data-theme', theme);
        htmlElement.classList.toggle('dark');
        localStorage.setItem('theme', theme);
    });
}

// RTL Switching Logic
const rtlToggle = document.getElementById('rtl-toggle');
if (rtlToggle) {
    rtlToggle.addEventListener('click', () => {
        const dir = htmlElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
        htmlElement.setAttribute('dir', dir);
        localStorage.setItem('dir', dir);
    });
}

const savedDir = localStorage.getItem('dir') || 'ltr';
htmlElement.setAttribute('dir', savedDir);

// Mobile Menu Logic
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileMenuClose = document.getElementById('mobile-menu-close');

if (mobileMenuBtn && mobileMenu) {
    // Open mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.remove('hidden');
    });

    // Close mobile menu
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }

    // Close menu when clicking on the backdrop
    mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu || e.target.classList.contains('backdrop-blur-sm')) {
            mobileMenu.classList.add('hidden');
        }
    });
}


// Sticky Header
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('bg-white/80', 'dark:bg-slate-900/80', 'backdrop-blur-md', 'shadow-sm');
    } else {
        header.classList.remove('bg-white/80', 'dark:bg-slate-900/80', 'backdrop-blur-md', 'shadow-sm');
    }
});

// Initialize AOS (Animate on Scroll) if available
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        once: true,
    });
}

// Notification Dropdown Logic
const notificationButtons = document.querySelectorAll('[id="notifications-toggle"]');
notificationButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.nextElementSibling;
        if (dropdown && dropdown.classList.contains('hidden')) {
            // Close other dropdowns first
            document.querySelectorAll('[id^="notifications-dropdown"]').forEach(d => d.classList.add('hidden'));
            dropdown.classList.remove('hidden');
        } else if (dropdown) {
            dropdown.classList.add('hidden');
        }
    });
});

// Close Dropdowns on Click Outside
document.addEventListener('click', (e) => {
    // Close Notification Dropdowns
    document.querySelectorAll('[id^="notifications-dropdown"]').forEach(dropdown => {
        if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
});

// Dashboard Sidebar Toggle
const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('toggleSidebar');

if (toggleSidebar && sidebar) {
    toggleSidebar.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('-translate-x-full');
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && !sidebar.contains(e.target) && !toggleSidebar.contains(e.target)) {
            sidebar.classList.add('-translate-x-full');
        }
    });
}
