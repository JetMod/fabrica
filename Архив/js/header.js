// ===================================
// Header скролл эффект
// ===================================

import { throttle } from './utils.js';

/**
 * Инициализация эффекта прокрутки для header
 */
export function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    const scrollThreshold = 50;
    
    // Используем throttle для оптимизации
    const handleScroll = throttle(function() {
        const currentScroll = window.pageYOffset;
        
        // Добавляем класс scrolled при прокрутке вниз
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, 100);
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Добавляем плавную анимацию при наведении на логотип
    const logo = document.querySelector('.header__logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02) rotate(1deg)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
}
