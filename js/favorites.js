// ===================================
// Избранное (localStorage, без регистрации)
// ===================================

const FAVORITES_KEY = 'fabrica_favorites';

/**
 * Получить массив ID избранных товаров
 */
export function getFavorites() {
    try {
        const raw = localStorage.getItem(FAVORITES_KEY);
        if (!raw) return [];
        const ids = JSON.parse(raw);
        return Array.isArray(ids) ? ids : [];
    } catch (e) {
        return [];
    }
}

/**
 * Записать массив ID в localStorage
 */
export function setFavorites(ids) {
    try {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
        window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { ids } }));
    } catch (e) {
        console.warn('Favorites: localStorage error', e);
    }
}

/**
 * Добавить или убрать товар из избранного
 */
export function toggleFavorite(productId) {
    const ids = getFavorites();
    const index = ids.indexOf(String(productId));
    if (index === -1) {
        ids.push(String(productId));
    } else {
        ids.splice(index, 1);
    }
    setFavorites(ids);
    return ids.includes(String(productId));
}

/**
 * Проверить, в избранном ли товар
 */
export function isFavorite(productId) {
    return getFavorites().includes(String(productId));
}

const HEART_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="2" fill="none"/></svg>';

/**
 * Инициализация кнопок «В избранное» на карточках и на странице товара
 */
export function initFavorites() {
    // Карточки товаров: ищем кнопку и родителя с data-product-id
    document.querySelectorAll('.product-card__favorite').forEach(function(btn) {
        const card = btn.closest('[data-product-id]');
        if (!card) return;
        const productId = card.getAttribute('data-product-id');
        if (!productId) return;

        if (isFavorite(productId)) {
            btn.classList.add('active');
        }

        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const nowActive = toggleFavorite(productId);
            btn.classList.toggle('active', nowActive);
        });
    });

    // Страница товара: кнопка #addToFavorites (данные с data-product-id на body или .product-main)
    const pageProductId = document.body.getAttribute('data-product-id') ||
        document.querySelector('.product-main')?.getAttribute('data-product-id');
    const addToFavBtn = document.getElementById('addToFavorites');
    if (addToFavBtn && pageProductId) {
        if (isFavorite(pageProductId)) {
            addToFavBtn.classList.add('active');
        }
        addToFavBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const nowActive = toggleFavorite(pageProductId);
            addToFavBtn.classList.toggle('active', nowActive);
        });
    }
}
