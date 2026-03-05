// ===================================
// Страница результатов поиска — загрузка и отрисовка
// ===================================

import { initFavorites } from './favorites.js';

const HEART_SVG = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
const REQUEST_SVG = '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 4h16v12H2V4zm0 0l8 5 8-5M2 16V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function buildCard(product) {
    var statusClass = product.status === 'available' ? 'product-card__status--available' : 'product-card__status--order';
    var statusText = product.status === 'available' ? 'В наличии' : 'Под заказ';
    var badgeHtml = product.badge
        ? '<div class="product-card__badge' + (product.badge === 'Тренд' ? ' product-card__badge--trend' : '') + '">' + product.badge + '</div>'
        : '';
    var priceOldHtml = product.priceOld ? '<span class="product-card__price-old">' + product.priceOld + '</span>' : '';
    return (
        '<a href="' + (product.link || 'product.html') + '" class="product-card" data-product-id="' + product.id + '">' +
            '<div class="product-card__image">' +
                '<img src="' + product.image + '" alt="' + escapeHtml(product.title) + '" class="product-card__img">' +
                '<button class="product-card__favorite" aria-label="В избранное">' + HEART_SVG + '</button>' +
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
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getQueryFromUrl() {
    var params = new URLSearchParams(window.location.search);
    return (params.get('q') || '').trim();
}

function run() {
    var grid = document.getElementById('search-results-grid');
    var empty = document.getElementById('search-results-empty');
    var titleEl = document.getElementById('search-results-title');
    var query = getQueryFromUrl();

    if (!grid) return;

    if (titleEl) {
        titleEl.textContent = query ? 'Результаты поиска: «' + escapeHtml(query) + '»' : 'Поиск';
    }

    // Подставить запрос в поле поиска в шапке
    if (query) {
        document.querySelectorAll('.header__search-input').forEach(function(input) {
            input.value = query;
        });
    }

    if (!query) {
        if (empty) {
            empty.hidden = false;
            empty.querySelector('.search-empty__title').textContent = 'Введите запрос';
            empty.querySelector('.search-empty__text').textContent = 'Введите слово или фразу в поле поиска в шапке сайта.';
        }
        grid.innerHTML = '';
        return;
    }

    var qLower = query.toLowerCase();

    fetch('data/products.json')
        .then(function(r) { return r.json(); })
        .then(function(products) {
            var filtered = products.filter(function(p) {
                return (p.title || '').toLowerCase().indexOf(qLower) !== -1;
            });
            if (filtered.length === 0) {
                grid.innerHTML = '';
                if (empty) {
                    empty.hidden = false;
                    empty.querySelector('.search-empty__title').textContent = 'Ничего не найдено';
                    empty.querySelector('.search-empty__text').textContent = 'По запросу «' + escapeHtml(query) + '» товаров нет. Попробуйте другое слово или перейдите в каталог.';
                }
                return;
            }
            if (empty) empty.hidden = true;
            grid.innerHTML = filtered.map(function(p) { return buildCard(p); }).join('');
            initFavorites();
        })
        .catch(function(err) {
            console.warn('Search: failed to load products', err);
            if (empty) {
                empty.hidden = false;
                empty.querySelector('.search-empty__title').textContent = 'Ошибка загрузки';
                empty.querySelector('.search-empty__text').textContent = 'Не удалось загрузить данные. Попробуйте позже.';
            }
        });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
} else {
    run();
}
