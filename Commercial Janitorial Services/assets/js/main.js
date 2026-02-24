// Theme and RTL Toggle Functionality - Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    const htmlElement = document.documentElement;

    // ========== THEME TOGGLE FUNCTIONALITY ==========
    const themeToggles = document.querySelectorAll('#theme-toggle');
    const initialTheme = localStorage.getItem('theme') || 'light';
    applyTheme(initialTheme);

    function applyTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
        } else {
            htmlElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
        updateThemeIcons(theme);
    }

    function updateThemeIcons(theme) {
        themeToggles.forEach(toggle => {
            const moonIcon = toggle.querySelector('.fa-moon');
            const sunIcon = toggle.querySelector('.fa-sun');
            if (moonIcon && sunIcon) {
                if (theme === 'dark') {
                    moonIcon.classList.add('hidden');
                    sunIcon.classList.remove('hidden');
                } else {
                    moonIcon.classList.remove('hidden');
                    sunIcon.classList.add('hidden');
                }
            }
        });
    }

    // Update theme icons on initial load
    updateThemeIcons(initialTheme);

    themeToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(newTheme);
        });
    });

    // ========== RTL TOGGLE FUNCTIONALITY ==========
    const rtlToggles = document.querySelectorAll('#rtl-toggle');
    const savedDir = localStorage.getItem('dir') || 'ltr';
    htmlElement.setAttribute('dir', savedDir);

    function updateRtlButtons() {
        rtlToggles.forEach(toggle => {
            const isRtl = htmlElement.getAttribute('dir') === 'rtl';
            toggle.textContent = isRtl ? 'LTR' : 'RTL';
            toggle.setAttribute('title', isRtl ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
        });
    }

    // Update RTL buttons on page load
    updateRtlButtons();

    rtlToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const currentDir = htmlElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';

            htmlElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
            updateRtlButtons();
            updateDropdownPositions();

            // ========== RE-SYNC SIDEBAR STATE ==========
            const sidebar = document.getElementById('sidebar');
            const backdrop = document.getElementById('sidebar-backdrop');

            if (sidebar) {
                // Detect if it was open or closed
                // It's closed if it has any translation class
                const isClosed = sidebar.classList.contains('-translate-x-full') ||
                    sidebar.classList.contains('translate-x-full') ||
                    sidebar.classList.contains('rtl:translate-x-full');

                // Clear ALL translation classes to start fresh
                sidebar.classList.remove('-translate-x-full', 'translate-x-full', 'rtl:translate-x-full');

                if (isClosed) {
                    // It was closed, re-apply the correct hidden class for the new direction
                    if (newDir === 'rtl') {
                        sidebar.classList.add('translate-x-full');
                    } else {
                        sidebar.classList.add('-translate-x-full');
                    }
                    // Ensure backdrop is hidden if sidebar is closed
                    if (backdrop) {
                        backdrop.classList.add('hidden', 'opacity-0');
                    }
                } else {
                    // It was open, keep it open (no translation classes needed)
                    // Ensure backdrop is visible on mobile if sidebar is open
                    if (backdrop && window.innerWidth < 1024) {
                        backdrop.classList.remove('hidden');
                        setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
                    }
                }
            }

            // Trigger custom event for other scripts
            window.dispatchEvent(new CustomEvent('rtlChanged', { detail: { direction: newDir } }));
        });
    });

    // ========== DROPDOWN POSITIONING FOR RTL ==========
    function updateDropdownPositions() {
        const isRtl = htmlElement.getAttribute('dir') === 'rtl';
        const dropdowns = document.querySelectorAll('[id^="notifications-dropdown"], .dropdown-menu');

        dropdowns.forEach(dropdown => {
            if (isRtl) {
                dropdown.classList.remove('right-0');
                dropdown.classList.add('left-0');
            } else {
                dropdown.classList.remove('left-0');
                dropdown.classList.add('right-0');
            }
        });
    }

    // Initial position update
    updateDropdownPositions();
    // Update dropdown positions on RTL change
    window.addEventListener('rtlChanged', updateDropdownPositions);
    updateDropdownPositions();

    // ========== MOBILE MENU LOGIC ==========
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });

        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        }

        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu || e.target.classList.contains('backdrop-blur-sm')) {
                mobileMenu.classList.add('hidden');
            }
        });
    }

    // ========== LOGIN DROPDOWN LOGIC ==========
    const loginToggle = document.getElementById('login-dropdown-toggle');
    const loginDropdown = document.getElementById('login-dropdown');

    if (loginToggle && loginDropdown) {
        loginToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            loginDropdown.classList.toggle('hidden');
            const icon = loginToggle.querySelector('.fa-chevron-down');
            if (icon) icon.classList.toggle('rotate-180');
        });
    }

    const mobileLoginToggle = document.getElementById('mobile-login-toggle');
    const mobileLoginDropdown = document.getElementById('mobile-login-dropdown');

    if (mobileLoginToggle && mobileLoginDropdown) {
        mobileLoginToggle.addEventListener('click', () => {
            mobileLoginDropdown.classList.toggle('hidden');
            const icon = mobileLoginToggle.querySelector('.fa-chevron-down');
            if (icon) icon.classList.toggle('rotate-180');
        });
    }

    // ========== HOME DROPDOWN LOGIC ==========
    const homeToggle = document.getElementById('home-dropdown-toggle');
    const homeDropdown = document.getElementById('home-dropdown');

    if (homeToggle && homeDropdown) {
        // Toggle on click
        homeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            homeDropdown.classList.toggle('hidden');
            const icon = homeToggle.querySelector('.fa-chevron-down');
            if (icon) icon.classList.toggle('rotate-180');
        });

        // Optional: Show on hover for desktop
        const homeContainer = document.getElementById('home-menu-container');
        if (homeContainer) {
            homeContainer.addEventListener('mouseenter', () => {
                if (window.innerWidth >= 1024) {
                    homeDropdown.classList.remove('hidden');
                    const icon = homeToggle.querySelector('.fa-chevron-down');
                    if (icon) icon.classList.add('rotate-180');
                }
            });
            homeContainer.addEventListener('mouseleave', () => {
                if (window.innerWidth >= 1024) {
                    homeDropdown.classList.add('hidden');
                    const icon = homeToggle.querySelector('.fa-chevron-down');
                    if (icon) icon.classList.remove('rotate-180');
                }
            });
        }
    }

    const mobileHomeToggle = document.getElementById('mobile-home-toggle');
    const mobileHomeDropdown = document.getElementById('mobile-home-dropdown');

    if (mobileHomeToggle && mobileHomeDropdown) {
        mobileHomeToggle.addEventListener('click', () => {
            mobileHomeDropdown.classList.toggle('hidden');
            const icon = mobileHomeToggle.querySelector('.fa-chevron-down');
            if (icon) icon.classList.toggle('rotate-180');
        });
    }

    // ========== STICKY HEADER ==========
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('shadow-md');
            } else {
                header.classList.remove('shadow-md');
            }
        });
    }

    // ========== INITIALIZE AOS ==========
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
        });
    }

    // ========== NOTIFICATION DROPDOWN LOGIC ==========
    const notificationButtons = document.querySelectorAll('[id="notifications-toggle"]');
    notificationButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const dropdown = btn.nextElementSibling;
            if (dropdown && dropdown.classList.contains('hidden')) {
                document.querySelectorAll('[id^="notifications-dropdown"]').forEach(d => d.classList.add('hidden'));
                dropdown.classList.remove('hidden');
            } else if (dropdown) {
                dropdown.classList.add('hidden');
            }
        });
    });

    // ========== CLOSE DROPDOWNS ON CLICK OUTSIDE ==========
    document.addEventListener('click', (e) => {
        const allDropdowns = document.querySelectorAll('[id^="notifications-dropdown"], #login-dropdown, #home-dropdown');
        allDropdowns.forEach(dropdown => {
            if (!dropdown.classList.contains('hidden') && !dropdown.contains(e.target)) {
                dropdown.classList.add('hidden');

                // Reset toggle icons
                if (dropdown.id === 'login-dropdown') {
                    const toggle = document.getElementById('login-dropdown-toggle');
                    const icon = toggle ? toggle.querySelector('.fa-chevron-down') : null;
                    if (icon) icon.classList.remove('rotate-180');
                }
                if (dropdown.id === 'home-dropdown') {
                    const toggle = document.getElementById('home-dropdown-toggle');
                    const icon = toggle ? toggle.querySelector('.fa-chevron-down') : null;
                    if (icon) icon.classList.remove('rotate-180');
                }
            }
        });
    });

    // ========== DASHBOARD SIDEBAR TOGGLE ==========
    const sidebar = document.getElementById('sidebar');
    const toggleSidebar = document.getElementById('toggleSidebar');

    if (toggleSidebar && sidebar) {
        // Create backdrop for mobile sidebar if it doesn't exist
        let backdrop = document.getElementById('sidebar-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.id = 'sidebar-backdrop';
            backdrop.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-40 hidden transition-all duration-300 opacity-0';
            document.body.appendChild(backdrop);
        }

        function toggleSidebarState() {
            const isRtl = document.documentElement.getAttribute('dir') === 'rtl';

            // Check if sidebar is currently open
            // It's open if it DOES NOT have the hidden classes
            const isHidden = isRtl ?
                (sidebar.classList.contains('translate-x-full') || sidebar.classList.contains('rtl:translate-x-full')) :
                sidebar.classList.contains('-translate-x-full');

            if (isHidden) {
                // Open it: Remove ALL possible translation classes
                sidebar.classList.remove('-translate-x-full', 'translate-x-full', 'rtl:translate-x-full');
                backdrop.classList.remove('hidden');
                setTimeout(() => backdrop.classList.remove('opacity-0'), 10);
            } else {
                // Close it: Add the correct one for current direction
                if (isRtl) {
                    sidebar.classList.add('translate-x-full');
                } else {
                    sidebar.classList.add('-translate-x-full');
                }
                backdrop.classList.add('opacity-0');
                setTimeout(() => backdrop.classList.add('hidden'), 300);
            }
        }

        toggleSidebar.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSidebarState();
        });

        const closeSidebarBtn = document.getElementById('closeSidebar');
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleSidebarState();
            });
        }

        backdrop.addEventListener('click', () => {
            const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
            if (isRtl) {
                sidebar.classList.add('translate-x-full');
            } else {
                sidebar.classList.add('-translate-x-full');
            }
            backdrop.classList.add('opacity-0');
            setTimeout(() => backdrop.classList.add('hidden'), 300);
        });

        // Close sidebar when clicking on a link (mobile only)
        sidebar.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth < 1024) {
                    const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
                    if (isRtl) {
                        sidebar.classList.add('translate-x-full');
                    } else {
                        sidebar.classList.add('-translate-x-full');
                    }
                    backdrop.classList.add('opacity-0');
                    setTimeout(() => backdrop.classList.add('hidden'), 300);
                }
            });
        });
    }

    // ========== TABLE SORTING FUNCTIONALITY ==========
    const sortButtons = document.querySelectorAll('[data-sort]');
    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const table = btn.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const sortKey = btn.dataset.sort;
            const isAscending = btn.classList.toggle('asc');

            rows.sort((a, b) => {
                const aVal = a.querySelector(`[data-${sortKey}]`)?.textContent || '';
                const bVal = b.querySelector(`[data-${sortKey}]`)?.textContent || '';
                return isAscending
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            });

            rows.forEach(row => tbody.appendChild(row));

            // Update sort icons
            sortButtons.forEach(b => {
                const icon = b.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-sort-asc', 'fa-sort-desc', 'fa-sort');
                }
            });
            const icon = btn.querySelector('i');
            if (icon) {
                icon.className = isAscending ? 'fa-solid fa-sort-up ml-1' : 'fa-solid fa-sort-down ml-1';
            }
        });
    });

    // ========== SEARCH FUNCTIONALITY ==========
    const searchInputs = document.querySelectorAll('[data-search]');
    searchInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const targetTable = document.querySelector(e.target.dataset.search);
            if (targetTable) {
                const rows = targetTable.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const text = row.textContent.toLowerCase();
                    row.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });

    // ========== MODAL FUNCTIONALITY ==========
    const modalTriggers = document.querySelectorAll('[data-modal]');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modalId = trigger.dataset.modal;
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        });
    });

    const modalClosers = document.querySelectorAll('[data-modal-close]');
    modalClosers.forEach(closer => {
        closer.addEventListener('click', () => {
            const modal = closer.closest('.modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    });

    // Close modals on backdrop click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    });

    // ========== TOAST NOTIFICATIONS ==========
    window.showToast = function (message, type = 'info') {
        const container = document.getElementById('toast-container') || createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast toast-${type} p-4 rounded-lg shadow-lg mb-2 flex items-center gap-3 animate-fade-in`;

        const icons = {
            success: 'fa-check-circle text-green-500',
            error: 'fa-exclamation-circle text-red-500',
            warning: 'fa-exclamation-triangle text-yellow-500',
            info: 'fa-info-circle text-blue-500'
        };

        toast.innerHTML = `
            <i class="fa-solid ${icons[type]}"></i>
            <span class="text-gray-700 dark:text-gray-200">${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('opacity-0', 'transition-opacity');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed top-4 right-4 z-50';
        document.body.appendChild(container);
        return container;
    }

    // ========== PAGINATION ==========
    const paginationButtons = document.querySelectorAll('[data-page]');
    paginationButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.page;
            const table = document.querySelector('[data-pagination]');
            if (table) {
                // Simulate pagination change
                table.classList.add('opacity-50');
                setTimeout(() => {
                    table.classList.remove('opacity-50');
                    if (window.showToast) {
                        window.showToast(`Navigated to ${target}`, 'info');
                    }
                }, 200);
            }
        });
    });

    // ========== THEME/RTL PERSISTENCE ACROSS PAGES ==========
    // Apply saved preferences immediately to prevent flash
    (function applySavedPreferences() {
        const theme = localStorage.getItem('theme') || 'light';
        const dir = localStorage.getItem('dir') || 'ltr';

        htmlElement.setAttribute('data-theme', theme);
        htmlElement.classList.toggle('dark', theme === 'dark');
        htmlElement.setAttribute('dir', dir);
    })();

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });
    // ========== FAQ ACCORDION ==========
    const faqItems = document.querySelectorAll('.faq-trigger');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const container = item.parentElement;
            const answer = container.querySelector('p');
            const icon = item.querySelector('i');

            if (answer) {
                const isHidden = answer.classList.contains('hidden');

                // Close other FAQs in the same group
                const group = container.parentElement;
                if (group) {
                    group.querySelectorAll('p').forEach(p => p.classList.add('hidden'));
                    group.querySelectorAll('i.fa-chevron-down').forEach(i => i.classList.remove('rotate-180'));
                }

                if (isHidden) {
                    answer.classList.remove('hidden');
                    if (icon) icon.classList.add('rotate-180');
                } else {
                    answer.classList.add('hidden');
                    if (icon) icon.classList.remove('rotate-180');
                }
            }
        });
    });

    // ========== BOOKING FORM ==========
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Show success notification
            showToast('Your appointment request has been sent successfully!', 'success');
            // Reset the form
            bookingForm.reset();
        });
    }

    // ========== NEWSLETTER FORM ==========
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="email"]');
            if (input && input.value) {
                showToast('Thank you for subscribing to our newsletter!', 'success');
                input.value = '';
            } else {
                showToast('Please enter a valid email address.', 'warning');
            }
        });
    });
});
