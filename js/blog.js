// Фильтрация статей блога
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.blog-filters__button');
    const blogCards = document.querySelectorAll('.blog-card');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    let currentCategory = 'all';
    let visibleCount = 9; // Начальное количество видимых статей

    // Функция фильтрации статей
    function filterArticles(category) {
        blogCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                if (index < visibleCount) {
                    card.classList.remove('hidden');
                    card.style.display = '';
                } else {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }
            } else {
                card.classList.add('hidden');
                card.style.display = 'none';
            }
        });

        // Показываем/скрываем кнопку "Показать еще"
        const visibleCards = Array.from(blogCards).filter(card => {
            const cardCategory = card.getAttribute('data-category');
            return (category === 'all' || cardCategory === category) && !card.classList.contains('hidden');
        });

        if (loadMoreBtn) {
            if (visibleCards.length >= visibleCount) {
                loadMoreBtn.style.display = 'flex';
            } else {
                loadMoreBtn.style.display = 'none';
            }
        }
    }

    // Обработчики кликов на кнопки фильтров
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('blog-filters__button--active'));
            
            // Добавляем активный класс к нажатой кнопке
            this.classList.add('blog-filters__button--active');
            
            // Получаем категорию из data-атрибута
            currentCategory = this.getAttribute('data-category');
            
            // Сбрасываем счетчик видимых статей
            visibleCount = 9;
            
            // Фильтруем статьи
            filterArticles(currentCategory);
        });
    });

    // Кнопка "Показать еще"
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            visibleCount += 9;
            filterArticles(currentCategory);
        });
    }

    // Инициализация при загрузке страницы
    filterArticles('all');
});
