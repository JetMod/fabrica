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
    const dotsContainer = document.querySelector('.services__dots');
    
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
        return Math.max(1, Math.ceil(cards.length / cardsPerPage));
    }
    
    // Переход на страницу
    function goToPage(page) {
        const totalPages = getTotalPages();
        
        // Ограничиваем страницу
        if (page < 0) page = 0;
        if (page >= totalPages) page = totalPages - 1;
        
        currentPage = page;
        
        // Вычисляем смещение
        if (cards.length > 0 && cards[0].offsetWidth > 0) {
            const cardWidth = cards[0].offsetWidth;
            // Определяем gap в зависимости от ширины экрана
            const width = window.innerWidth;
            let gap;
            if (width <= 480) {
                gap = 12;
            } else if (width <= 768) {
                gap = 16;
            } else if (width <= 1024) {
                gap = 20;
            } else {
                gap = 24;
            }
            const offset = -(cardWidth + gap) * cardsPerPage * currentPage;
            track.style.transform = `translateX(${offset}px)`;
        }
        
        updateButtons();
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
    
    // Создание индикаторов по количеству страниц
    function renderDots() {
        if (!dotsContainer) return;
        const totalPages = getTotalPages();
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i += 1) {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'services__dot' + (i === currentPage ? ' active' : '');
            dot.setAttribute('data-slide', String(i));
            dot.setAttribute('aria-label', 'Страница ' + (i + 1));
            dot.addEventListener('click', function() {
                goToPage(i);
            });
            dotsContainer.appendChild(dot);
        }
    }
    
    // Обновление индикаторов
    function updateDots() {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.services__dot');
        dots.forEach(function(dot, index) {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function nextPage() {
        goToPage(currentPage + 1);
    }
    
    function prevPage() {
        goToPage(currentPage - 1);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevPage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextPage);
    }
    
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
        const oldCardsPerPage = cardsPerPage;
        updateCardsPerPage();
        
        // Если изменилось количество карточек на странице, пересчитываем текущую страницу
        if (oldCardsPerPage !== cardsPerPage) {
            const totalPages = getTotalPages();
            // Ограничиваем текущую страницу, если она стала недоступной
            if (currentPage >= totalPages) {
                currentPage = Math.max(0, totalPages - 1);
            }
        }
        
        renderDots();
        goToPage(currentPage);
    }, 250);
    
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Инициализация
    updateCardsPerPage();
    renderDots();
    goToPage(0);
}
