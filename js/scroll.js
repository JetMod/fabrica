// ===================================
// Функционал скролла
// ===================================

import { throttle } from './utils.js';

/**
 * Кнопка "Наверх"
 */
export function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    // Показываем/скрываем кнопку при скролле (с throttle для производительности)
    const handleScrollTopVisibility = throttle(function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }, 200);
    
    window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });
    
    // Прокрутка наверх при клике
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Анимации при скролле
 */
export function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in, .fade-in-left, .fade-in-right, .scale-in');
    
    if (animatedElements.length === 0) return;
    
    // Настройки Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Опционально: отключаем наблюдение после анимации
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми элементами
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
}

/**
 * Плавная прокрутка к якорям
 */
export function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Игнорируем пустые якоря
            if (href === '#' || href === '#!') {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Получаем высоту header
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Вычисляем позицию с учетом header
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}
