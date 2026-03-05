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
        
        /**
         * Определяет количество видимых карточек на основе реальной ширины контейнера
         * Это гарантирует синхронизацию с CSS медиа-запросами
         */
        function updateCardsPerPage() {
            if (cards.length === 0) {
                cardsPerPage = 1;
                return;
            }
            
            const wrapper = tabContent.querySelector('.featured-products__slider-wrapper');
            if (!wrapper) {
                cardsPerPage = 4;
                return;
            }
            
            const wrapperWidth = wrapper.offsetWidth;
            const firstCard = cards[0];
            const cardWidth = firstCard.offsetWidth;
            const computedGap = parseFloat(getComputedStyle(grid).gap) || 24;
            
            // Рассчитываем сколько карточек помещается в контейнер
            // Формула: (ширина контейнера + gap) / (ширина карточки + gap)
            if (cardWidth > 0) {
                const visibleCards = Math.floor((wrapperWidth + computedGap) / (cardWidth + computedGap));
                cardsPerPage = Math.max(1, Math.min(visibleCards, cards.length));
            } else {
                // Fallback на основе ширины окна
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
        }
        
        function getGap() {
            const computedGap = parseFloat(getComputedStyle(grid).gap) || 24;
            return computedGap;
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
            // Убеждаемся, что cardsPerPage актуален перед расчетом
            updateCardsPerPage();
            
            const totalPages = getTotalPages();
            if (totalPages === 0) return;
            
            if (page < 0) page = 0;
            if (page >= totalPages) page = totalPages - 1;
            
            currentPage = page;
            
            if (cards.length === 0) return;
            
            const cardWidth = cards[0].offsetWidth;
            const gapValue = getGap();
            
            // Рассчитываем смещение: перемещаем на количество карточек * текущая страница
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
            // Двойной requestAnimationFrame для гарантированного пересчета размеров после применения CSS
            requestAnimationFrame(function() {
                requestAnimationFrame(function() {
                    updateCardsPerPage();
                    if (resetPage) {
                        currentPage = 0;
                    }
                    renderDots();
                    goToPage(currentPage);
                });
            });
        }
        
        featuredProductsSliderState.set(tabContent, { refresh });
        
        // Инициализация с задержкой для корректного расчета размеров после загрузки CSS
        setTimeout(function() {
            refresh(true);
        }, 150);
        
        const handleResizeProducts = debounce(function() {
            // При изменении размера окна нужно пересчитать все заново
            refresh(true);
        }, 250);
        
        window.addEventListener('resize', handleResizeProducts, { passive: true });
        
        // Также слушаем изменения размера через ResizeObserver для более точного отслеживания
        if (typeof ResizeObserver !== 'undefined') {
            const resizeObserver = new ResizeObserver(function(entries) {
                for (let i = 0; i < entries.length; i += 1) {
                    handleResizeProducts();
                }
            });
            
            const wrapper = tabContent.querySelector('.featured-products__slider-wrapper');
            if (wrapper) {
                resizeObserver.observe(wrapper);
            }
        }
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
                // Небольшая задержка для пересчета размеров после показа контента
                setTimeout(function() {
                    refreshFeaturedProductsSlider(targetContent, true);
                }, 50);
            }
        });
    });
}

/**
 * Инициализация карточек товаров
 * (кнопки избранного обрабатываются в favorites.js)
 */
export function initProductCards() {
    // Кнопки «Узнать цену» — открывают модальное окно обратного звонка (data-callback-modal)
    const requestButtons = document.querySelectorAll('.product-card__request');
    requestButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Останавливаем всплытие, чтобы не открывалась страница товара
            this.style.transform = 'scale(0.9)';
            setTimeout(function() { button.style.transform = ''; }, 200);
            // Открытие модалки обратного звонка обрабатывается в callback-modal.js по [data-callback-modal]
        });
    });

    // Клик на карточку товара — переход на страницу товара
    const productCards = document.querySelectorAll('.product-card[data-product-id]');
    productCards.forEach(function(card) {
        card.addEventListener('click', function(e) {
            // Проверяем, не был ли клик на интерактивном элементе (кнопка, ссылка)
            const target = e.target;
            const isInteractive = target.closest('button') || 
                                 target.closest('a') || 
                                 target.closest('.product-card__favorite') ||
                                 target.closest('.product-card__request');
            
            if (isInteractive) {
                return; // Не обрабатываем клик, если он был на интерактивном элементе
            }

            const productId = card.getAttribute('data-product-id');
            if (productId) {
                window.location.href = 'product.html?id=' + encodeURIComponent(productId);
            }
        });
    });
}