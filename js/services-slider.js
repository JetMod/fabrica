// ===================================
// Слайдер услуг
// ===================================

import { debounce } from './utils.js';

/**
 * Инициализация слайдера услуг
 */
export function initServicesSlider() {
    const track = document.querySelector('.services__track');
    if (!track) return;
    
    const cards = document.querySelectorAll('.services__card');
    const prevBtn = document.querySelector('.services__nav--prev');
    const nextBtn = document.querySelector('.services__nav--next');
    const dots = document.querySelectorAll('.services__dot');
    
    let currentPage = 0;
    let cardsPerPage = 4;
    
    // Определяем количество карточек на странице в зависимости от ширины экрана
    function updateCardsPerPage() {
        const width = window.innerWidth;
        if (width <= 480) {
            cardsPerPage = 1;
        } else if (width <= 768) {
            cardsPerPage = 2;
        } else if (width <= 1024) {
            cardsPerPage = 3;
        } else {
            cardsPerPage = 4;
        }
    }
    
    // Общее количество страниц
    function getTotalPages() {
        return Math.ceil(cards.length / cardsPerPage);
    }
    
    // Переход на страницу
    function goToPage(page) {
        const totalPages = getTotalPages();
        
        // Ограничиваем страницу
        if (page < 0) page = 0;
        if (page >= totalPages) page = totalPages - 1;
        
        currentPage = page;
        
        // Вычисляем смещение
        const cardWidth = cards[0].offsetWidth;
        const gap = 24; // gap между карточками
        const offset = -(cardWidth + gap) * cardsPerPage * currentPage;
        
        // Применяем трансформацию
        track.style.transform = `translateX(${offset}px)`;
        
        // Обновляем состояние кнопок
        updateButtons();
        
        // Обновляем индикаторы
        updateDots();
    }
    
    // Обновление состояния кнопок
    function updateButtons() {
        const totalPages = getTotalPages();
        
        if (prevBtn) {
            prevBtn.disabled = currentPage === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentPage >= totalPages - 1;
        }
    }
    
    // Обновление индикаторов
    function updateDots() {
        dots.forEach(function(dot, index) {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Следующая страница
    function nextPage() {
        goToPage(currentPage + 1);
    }
    
    // Предыдущая страница
    function prevPage() {
        goToPage(currentPage - 1);
    }
    
    // События для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', prevPage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextPage);
    }
    
    // События для индикаторов
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToPage(index);
        });
    });
    
    // Свайпы на мобильных устройствах
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующая страница
                nextPage();
            } else {
                // Свайп вправо - предыдущая страница
                prevPage();
            }
        }
    }
    
    // Управление клавиатурой
    document.addEventListener('keydown', function(e) {
        const servicesSection = document.querySelector('.services');
        if (!servicesSection) return;
        
        const rect = servicesSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isInView) {
            if (e.key === 'ArrowLeft') {
                prevPage();
            } else if (e.key === 'ArrowRight') {
                nextPage();
            }
        }
    });
    
    // Обновление при изменении размера окна (с debounce)
    const handleResize = debounce(function() {
        updateCardsPerPage();
        goToPage(0); // Возвращаемся на первую страницу
    }, 250);
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Инициализация
    updateCardsPerPage();
    updateButtons();
    updateDots();
}
