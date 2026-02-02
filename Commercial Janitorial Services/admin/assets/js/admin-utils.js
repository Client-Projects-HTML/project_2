// Theme Toggle
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        // Optional: Save preference to localStorage
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }
});

// RTL Toggle
const rtlToggleBtn = document.getElementById('rtl-toggle');
if (rtlToggleBtn) {
    rtlToggleBtn.addEventListener('click', () => {
        const html = document.documentElement;
        const currentDir = html.getAttribute('dir');

        if (currentDir === 'rtl') {
            html.setAttribute('dir', 'ltr');
            rtlToggleBtn.textContent = 'RTL';
            localStorage.setItem('textDirection', 'ltr');
        } else {
            html.setAttribute('dir', 'rtl');
            rtlToggleBtn.textContent = 'LTR';
            localStorage.setItem('textDirection', 'rtl');
        }
    });

    // Load saved direction on page load
    const savedDirection = localStorage.getItem('textDirection');
    if (savedDirection === 'rtl') {
        document.documentElement.setAttribute('dir', 'rtl');
        rtlToggleBtn.textContent = 'LTR';
    }
}

// Notifications Dropdown Toggle
const notificationsToggle = document.getElementById('notifications-toggle');
const notificationsDropdowns = [
    document.getElementById('notifications-dropdown-admin'),
    document.getElementById('notifications-dropdown-settings'),
    document.getElementById('notifications-dropdown')
];

const notificationsDropdown = notificationsDropdowns.find(dropdown => dropdown !== null);

if (notificationsToggle && notificationsDropdown) {
    notificationsToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsDropdown.classList.toggle('hidden');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!notificationsToggle.contains(e.target) && !notificationsDropdown.contains(e.target)) {
            notificationsDropdown.classList.add('hidden');
        }
    });
}

// Sidebar Toggle for Mobile
const sidebar = document.getElementById('sidebar');
const toggleSidebar = document.getElementById('toggleSidebar');

if (toggleSidebar && sidebar) {
    toggleSidebar.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('-translate-x-full');
    });
}

// Close sidebar when clicking outside on mobile
if (sidebar && toggleSidebar) {
    document.addEventListener('click', (e) => {
        if (window.innerWidth < 1024 && !sidebar.contains(e.target) && !toggleSidebar.contains(e.target)) {
            sidebar.classList.add('-translate-x-full');
        }
    });
}
