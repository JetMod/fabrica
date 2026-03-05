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

// Синхронизация высоты карточек блога на главной странице
document.addEventListener('DOMContentLoaded', function() {
    function syncBlogCardsHeight() {
        // Работаем только на экранах <= 768px
        if (window.innerWidth > 768) {
            return;
        }
        
        const blogGrid = document.querySelector('.blog__grid');
        if (!blogGrid) return;
        
        const cards = blogGrid.querySelectorAll('.blog__card');
        if (cards.length === 0) return;
        
        // Сбрасываем высоту для пересчета
        cards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // Находим максимальную высоту
        let maxHeight = 0;
        cards.forEach(card => {
            const height = card.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        
        // Применяем максимальную высоту ко всем карточкам
        if (maxHeight > 0) {
            cards.forEach(card => {
                card.style.height = maxHeight + 'px';
            });
        }
    }
    
    // Вызываем при загрузке
    syncBlogCardsHeight();
    
    // Вызываем при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            syncBlogCardsHeight();
        }, 250);
    });
    
    // Вызываем после загрузки изображений
    window.addEventListener('load', function() {
        setTimeout(syncBlogCardsHeight, 100);
    });
});

// Синхронизация высоты карточек ценностей на главной странице
document.addEventListener('DOMContentLoaded', function() {
    function syncValuesCardsHeight() {
        // Работаем только на экранах <= 768px
        if (window.innerWidth > 768) {
            return;
        }
        
        const valuesGrid = document.querySelector('.about__values-grid');
        if (!valuesGrid) return;
        
        const cards = valuesGrid.querySelectorAll('.about__value-card');
        if (cards.length === 0) return;
        
        // Сбрасываем высоту для пересчета
        cards.forEach(card => {
            card.style.height = 'auto';
        });
        
        // Находим максимальную высоту
        let maxHeight = 0;
        cards.forEach(card => {
            const height = card.offsetHeight;
            if (height > maxHeight) {
                maxHeight = height;
            }
        });
        
        // Применяем максимальную высоту ко всем карточкам
        if (maxHeight > 0) {
            cards.forEach(card => {
                card.style.height = maxHeight + 'px';
            });
        }
    }
    
    // Вызываем при загрузке
    syncValuesCardsHeight();
    
    // Вызываем при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            syncValuesCardsHeight();
        }, 250);
    });
    
    // Вызываем после загрузки изображений
    window.addEventListener('load', function() {
        setTimeout(syncValuesCardsHeight, 100);
    });
});
