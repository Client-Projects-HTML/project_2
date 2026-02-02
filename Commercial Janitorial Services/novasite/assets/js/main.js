// NovaSite Main JS
document.addEventListener('DOMContentLoaded', () => {
    // Header Scroll Effect
    const header = document.querySelector('.header-main');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('glass', 'py-4');
            header.classList.remove('py-6');
        } else {
            header.classList.remove('glass', 'py-4');
            header.classList.add('py-6');
        }
    });

    // Animate numbers
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        let start = 0;
        const increment = target / (duration / 16);

        const updateCount = () => {
            start += increment;
            if (start < target) {
                stat.innerText = Math.ceil(start);
                requestAnimationFrame(updateCount);
            } else {
                stat.innerText = target;
            }
        };
        updateCount();
    });

    // Mobile Menu Toggle
    const menuBtn = document.getElementById('menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('hidden');
        });
    }
});
