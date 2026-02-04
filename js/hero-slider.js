// ===================================
// Hero слайдер
// ===================================

/**
 * Инициализация главного слайдера
 */
export function initHeroSlider() {
    const slider = document.querySelector('.hero__slider');
    if (!slider) return;
    
    const slides = document.querySelectorAll('.hero__slide');
    const prevBtn = document.querySelector('.hero__nav-prev');
    const nextBtn = document.querySelector('.hero__nav-next');
    const dots = document.querySelectorAll('.hero__dot');
    const counterCurrent = document.querySelector('.hero__counter-current');
    
    let currentSlide = 0;
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 секунд
    
    // Функция переключения слайда
    function goToSlide(index) {
        // Убираем активный класс со всех слайдов
        slides.forEach(function(slide) {
            slide.classList.remove('active');
        });
        
        // Убираем активный класс со всех точек
        dots.forEach(function(dot) {
            dot.classList.remove('active');
        });
        
        // Добавляем активный класс к нужному слайду
        currentSlide = index;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        
        // Обновляем счетчик
        if (counterCurrent) {
            const slideNumber = (currentSlide + 1).toString().padStart(2, '0');
            counterCurrent.textContent = slideNumber;
        }
        
        // Перезапускаем автопрокрутку
        resetAutoplay();
    }
    
    // Следующий слайд
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        goToSlide(next);
    }
    
    // Предыдущий слайд
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prev);
    }
    
    // Автопрокрутка
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }
    
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }
    
    // События для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
        });
    }
    
    // События для точек
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToSlide(index);
        });
    });
    
    // Управление клавиатурой
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
    
    // Пауза автопрокрутки при наведении на слайдер
    slider.addEventListener('mouseenter', stopAutoplay);
    slider.addEventListener('mouseleave', startAutoplay);
    
    // Свайпы на мобильных устройствах
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующий слайд
                nextSlide();
            } else {
                // Свайп вправо - предыдущий слайд
                prevSlide();
            }
        }
    }
    
    // Запускаем автопрокрутку
    startAutoplay();
}
