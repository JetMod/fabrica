// ===================================
// Страница «Избранное» — загрузка и отрисовка списка
// ===================================

import { getFavorites, initFavorites } from './favorites.js';

const HEART_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
const REQUEST_SVG = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4h16v12H2V4zm0 0l8 5 8-5M2 16V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function buildCard(product) {
    const statusClass = product.status === 'available' ? 'product-card__status--available' : 'product-card__status--order';
    const statusText = product.status === 'available' ? 'В наличии' : 'Под заказ';
    const badgeHtml = product.badge
        ? '<div class="product-card__badge' + (product.badge === 'Тренд' ? ' product-card__badge--trend' : '') + '">' + product.badge + '</div>'
        : '';
    const priceOldHtml = product.priceOld ? '<span class="product-card__price-old">' + product.priceOld + '</span>' : '';
    return (
        '<a href="' + (product.link || 'product.html') + '" class="product-card" data-product-id="' + product.id + '">' +
            '<div class="product-card__image">' +
                '<img src="' + product.image + '" alt="' + escapeHtml(product.title) + '" class="product-card__img">' +
                '<button class="product-card__favorite active" aria-label="Удалить из избранного">' + HEART_SVG + '</button>' +
                badgeHtml +
            '</div>' +
            '<div class="product-card__info">' +
                '<h3 class="product-card__title">' + escapeHtml(product.title) + '</h3>' +
                '<div class="product-card__status ' + statusClass + '">' + statusText + '</div>' +
                '<div class="product-card__footer">' +
                    '<div class="product-card__price">' +
                        '<span class="product-card__price-current">' + product.price + '</span>' +
                        priceOldHtml +
                    '</div>' +
                    '<span class="product-card__request" aria-label="Узнать цену">' + REQUEST_SVG + '</span>' +
                '</div>' +
            '</div>' +
        '</a>'
    );
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function renderFavorites(productsMap, ids) {
    const grid = document.getElementById('favorites-grid');
    const empty = document.getElementById('favorites-empty');
    if (!grid) return;

    const idsToShow = ids.filter(function(id) { return productsMap[id]; });
    if (idsToShow.length === 0) {
        grid.innerHTML = '';
        if (empty) empty.hidden = false;
        return;
    }
    if (empty) empty.hidden = true;
    grid.innerHTML = idsToShow.map(function(id) {
        return buildCard(productsMap[id]);
    }).join('');
    initFavorites();
}

function run() {
    const grid = document.getElementById('favorites-grid');
    if (!grid) return;

    fetch('data/products.json')
        .then(function(r) { return r.json(); })
        .then(function(products) {
            const productsMap = {};
            products.forEach(function(p) {
                productsMap[p.id] = p;
            });
            const ids = getFavorites();
            renderFavorites(productsMap, ids);
            window.addEventListener('favoritesUpdated', function(e) {
                renderFavorites(productsMap, e.detail.ids);
            });
        })
        .catch(function(err) {
            console.warn('Favorites: failed to load products', err);
            const empty = document.getElementById('favorites-empty');
            if (empty) empty.hidden = false;
        });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
} else {
    run();
}
