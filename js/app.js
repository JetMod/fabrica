// ===================================
// Главный файл приложения
// ===================================

// Импорт модулей
import { initMobileMenu } from './mobile-menu.js';
import { initHeaderScroll } from './header.js';
import { initHeroSlider } from './hero-slider.js';
import { initServicesSlider } from './services-slider.js';
import { initChatWidget } from './chat-widget.js';
import { initPhoneMask, initContactForm } from './form-validation.js';
import { initScrollTop, initScrollAnimations, initSmoothScroll } from './scroll.js';
import { initFeaturedProductsSlider, initFeaturedProductsTabs, initProductCards } from './products.js';
import { initFavorites } from './favorites.js';
import { initSearch } from './search.js';
import { initCallbackModal } from './callback-modal.js';
import { initChatModal } from './chat-modal.js';
import { initFAQ } from './faq.js';
import { initProjectCards } from './projects.js';

/**
 * Инициализация всех компонентов при загрузке страницы
 */
document.addEventListener('DOMContentLoaded', function() {
    // Инициализация компонентов
    initMobileMenu();
    initHeaderScroll();
    initHeroSlider();
    initServicesSlider();
    initChatWidget();
    initChatModal();
    initContactForm();
    initPhoneMask();
    initCallbackModal();
    initScrollTop();
    initScrollAnimations();
    initSmoothScroll();
    initFeaturedProductsSlider();
    initFeaturedProductsTabs();
    initProductCards();
    initProjectCards();
    initFavorites();
    initSearch();
    initFAQ();
    
    // Отложенная инициализация неприоритетных компонентов
    if ('requestIdleCallback' in window) {
        requestIdleCallback(function() {
            console.log('✓ Все компоненты инициализированы');
        });
    }
    
    console.log('✓ ФАБРИКА интерьера - сайт загружен');
});
