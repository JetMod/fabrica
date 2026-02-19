// Карусель изображений товара
document.addEventListener('DOMContentLoaded', function() {
    const mainSlides = document.querySelectorAll('.product-gallery__main-slide');
    const thumbs = document.querySelectorAll('.product-gallery__thumb');
    const prevBtn = document.querySelector('.product-gallery__nav--prev');
    const nextBtn = document.querySelector('.product-gallery__nav--next');
    const mainImage = document.getElementById('mainImage');
    let currentSlide = 0;

    // Функция показа слайда
    function showSlide(index) {
        // Убираем активный класс со всех слайдов
        mainSlides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });

        // Обновляем активную миниатюру
        thumbs.forEach((thumb, i) => {
            if (i === index) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });

        currentSlide = index;
    }

    // Клик по миниатюре
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', function() {
            showSlide(index);
        });
    });

    // Кнопка "Назад"
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            const newIndex = currentSlide === 0 ? mainSlides.length - 1 : currentSlide - 1;
            showSlide(newIndex);
        });
    }

    // Кнопка "Вперёд"
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            const newIndex = currentSlide === mainSlides.length - 1 ? 0 : currentSlide + 1;
            showSlide(newIndex);
        });
    }

    // Клавиатурная навигация
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && prevBtn) {
            prevBtn.click();
        } else if (e.key === 'ArrowRight' && nextBtn) {
            nextBtn.click();
        }
    });

    // Избранное обрабатывается в favorites.js (initFavorites из app.js)
});
