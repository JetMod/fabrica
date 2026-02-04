// ===================================
// Популярные товары и карточки
// ===================================

import { debounce } from './utils.js';

// Состояние слайдера товаров
const featuredProductsSliderState = new WeakMap();

/**
 * Обновить слайдер товаров
 */
export function refreshFeaturedProductsSlider(tabContent, resetPage) {
    const state = featuredProductsSliderState.get(tabContent);
    if (state) {
        state.refresh(Boolean(resetPage));
    }
}

/**
 * Инициализация слайдера популярных товаров
 */
export function initFeaturedProductsSlider() {
    const tabContents = document.querySelectorAll('.featured-products__tab-content');
    if (tabContents.length === 0) return;
    
    tabContents.forEach(function(tabContent) {
        const grid = tabContent.querySelector('.featured-products__grid');
        if (!grid) return;
        
        const cards = grid.querySelectorAll('.product-card');
        const prevBtn = tabContent.querySelector('.featured-products__nav--prev');
        const nextBtn = tabContent.querySelector('.featured-products__nav--next');
        const dotsContainer = tabContent.querySelector('.featured-products__dots');
        
        let currentPage = 0;
        let cardsPerPage = 4;
        
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
        
        function getTotalPages() {
            return Math.ceil(cards.length / cardsPerPage);
        }
        
        function updateButtons() {
            const totalPages = getTotalPages();
            
            if (prevBtn) {
                prevBtn.disabled = currentPage === 0;
                prevBtn.style.opacity = currentPage === 0 ? '0.3' : '1';
            }
            
            if (nextBtn) {
                nextBtn.disabled = currentPage >= totalPages - 1;
                nextBtn.style.opacity = currentPage >= totalPages - 1 ? '0.3' : '1';
            }
        }
        
        function updateDots() {
            if (!dotsContainer) return;
            
            const dots = dotsContainer.querySelectorAll('.featured-products__dot');
            dots.forEach(function(dot, index) {
                if (index === currentPage) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        function renderDots() {
            if (!dotsContainer) return;
            
            const totalPages = getTotalPages();
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < totalPages; i += 1) {
                const dot = document.createElement('button');
                dot.className = 'featured-products__dot';
                dot.setAttribute('aria-label', `Страница ${i + 1}`);
                if (i === currentPage) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', function() {
                    goToPage(i);
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        function goToPage(page) {
            const totalPages = getTotalPages();
            if (totalPages === 0) return;
            
            if (page < 0) page = 0;
            if (page >= totalPages) page = totalPages - 1;
            
            currentPage = page;
            
            const cardWidth = cards[0].offsetWidth;
            const gapValue = parseFloat(getComputedStyle(grid).gap) || 24;
            const offset = -(cardWidth + gapValue) * cardsPerPage * currentPage;
            
            if (cardWidth > 0) {
                grid.style.transform = `translateX(${offset}px)`;
            }
            
            updateButtons();
            updateDots();
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
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        grid.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        grid.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextPage();
                } else {
                    prevPage();
                }
            }
        }, { passive: true });
        
        function refresh(resetPage) {
            updateCardsPerPage();
            if (resetPage) {
                currentPage = 0;
            }
            renderDots();
            goToPage(currentPage);
        }
        
        featuredProductsSliderState.set(tabContent, { refresh });
        refresh(true);
        
        const handleResizeProducts = debounce(function() {
            refresh(true);
        }, 250);
        
        window.addEventListener('resize', handleResizeProducts, { passive: true });
    });
}

/**
 * Инициализация табов популярных товаров
 */
export function initFeaturedProductsTabs() {
    const tabs = document.querySelectorAll('.featured-products__tab');
    const tabContents = document.querySelectorAll('.featured-products__tab-content');
    
    if (tabs.length === 0) return;
    
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Убираем активный класс со всех табов
            tabs.forEach(function(t) {
                t.classList.remove('active');
            });
            
            // Убираем активный класс со всех контентов
            tabContents.forEach(function(content) {
                content.classList.remove('active');
            });
            
            // Добавляем активный класс к выбранному табу
            this.classList.add('active');
            
            // Показываем соответствующий контент
            const targetContent = document.querySelector('[data-content="' + targetTab + '"]');
            if (targetContent) {
                targetContent.classList.add('active');
                refreshFeaturedProductsSlider(targetContent, true);
            }
        });
    });
}

/**
 * Инициализация карточек товаров
 */
export function initProductCards() {
    // Кнопки избранного
    const favoriteButtons = document.querySelectorAll('.product-card__favorite');
    
    favoriteButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            
            // Добавляем анимацию
            this.style.animation = 'none';
            setTimeout(function() {
                button.style.animation = '';
            }, 10);
        });
    });
    
    // Кнопки корзины
    const cartButtons = document.querySelectorAll('.product-card__cart');
    
    cartButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Анимация добавления в корзину
            this.style.transform = 'scale(0.9)';
            setTimeout(function() {
                button.style.transform = '';
            }, 200);
            
            // Здесь можно добавить логику добавления в корзину
            console.log('Товар добавлен в корзину');
        });
    });
}
