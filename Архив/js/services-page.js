// ===================================
// Страница услуг - Фильтрация
// ===================================

/**
 * Инициализация фильтрации услуг
 */
(function() {
    'use strict';
    
    const filters = document.querySelectorAll('.services-filter');
    const serviceCards = document.querySelectorAll('.service-card');
    const grid = document.getElementById('servicesGrid');
    
    if (!filters.length || !serviceCards.length || !grid) return;
    
    // Обработка клика по фильтру
    filters.forEach(filter => {
        filter.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            
            // Обновляем активное состояние фильтров
            filters.forEach(f => f.classList.remove('services-filter--active'));
            this.classList.add('services-filter--active');
            
            // Фильтруем карточки
            let visibleCount = 0;
            serviceCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = '';
                    visibleCount++;
                    
                    // Анимация появления
                    card.style.animation = 'none';
                    setTimeout(() => {
                        card.style.animation = 'fadeInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';
                    }, 10);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Плавная прокрутка к сетке после фильтрации
            if (visibleCount > 0) {
                setTimeout(() => {
                    grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        });
    });
    
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
})();
