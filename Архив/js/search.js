// ===================================
// Поиск в шапке — переход на страницу результатов
// ===================================

/**
 * Инициализация поиска: по клику на кнопку или Enter в поле — переход на search.html?q=...
 */
export function initSearch() {
    function submitSearch(input) {
        if (!input) return;
        var query = (input.value || '').trim();
        if (!query) return;
        var url = 'search.html?q=' + encodeURIComponent(query);
        window.location.href = url;
    }

    // Десктоп: блок .header__search — input + button
    document.querySelectorAll('.header__search').forEach(function(block) {
        var input = block.querySelector('.header__search-input');
        var button = block.querySelector('.header__search-button');
        if (!input) return;
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                submitSearch(input);
            });
        }
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitSearch(input);
            }
        });
    });

    // Мобильное меню: блок .header__mobile-search — только input (Enter)
    document.querySelectorAll('.header__mobile-search .header__search-input').forEach(function(input) {
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                submitSearch(input);
            }
        });
    });
}
