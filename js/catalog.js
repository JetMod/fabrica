// Фильтрация товаров в каталоге
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.catalog-filters__button');
    const productItems = document.querySelectorAll('.catalog-products__item');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    
    // Обработка клика по фильтрам
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс со всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('catalog-filters__button--active'));
            
            // Добавляем активный класс к нажатой кнопке
            this.classList.add('catalog-filters__button--active');
            
            // Получаем категорию из data-атрибута
            const selectedCategory = this.getAttribute('data-category');
            
            // Фильтруем товары
            productItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                
                if (selectedCategory === 'all' || itemCategory === selectedCategory) {
                    item.classList.remove('hidden');
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    
                    // Анимация появления
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });
    
    // Обработка кнопки "Показать еще"
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Здесь можно добавить логику загрузки дополнительных товаров
            // Например, через AJAX запрос или показать скрытые элементы
            console.log('Загрузка дополнительных товаров...');
            
            // Пример: можно добавить класс для показа скрытых товаров
            // const hiddenItems = document.querySelectorAll('.catalog-products__item.hidden-more');
            // hiddenItems.forEach((item, index) => {
            //     setTimeout(() => {
            //         item.classList.remove('hidden-more');
            //     }, index * 100);
            // });
        });
    }
});
