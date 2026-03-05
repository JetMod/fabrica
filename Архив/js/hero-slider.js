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
    
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    let currentSlide = 0;
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 секунд
    let lastSwipeTime = 0;
    const swipeCooldown = 400; // мс — защита от случайных свайпов при скролле
    
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
        
        // Перезапускаем автопрокрутку (только на десктопе)
        if (!isMobile) {
            resetAutoplay();
        }
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
    
    // Свайпы на мобильных устройствах (только горизонтальные — вертикальный скролл не переключает слайды)
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    
    slider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
        if (!isMobile) stopAutoplay();
    }, { passive: true });
    
    slider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
        if (!isMobile) startAutoplay();
    }, { passive: true });
    
    function handleSwipe() {
        const now = Date.now();
        if (isMobile && (now - lastSwipeTime) < swipeCooldown) return; // кулдаун — не срабатывать при быстрых касаниях при скролле
        
        const swipeThreshold = isMobile ? 80 : 50; // на мобильном выше порог — только явный свайп
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        const absDiffX = Math.abs(diffX);
        const absDiffY = Math.abs(diffY);
        
        // Свайп только если горизонтальное движение доминирует над вертикальным
        if (absDiffX > swipeThreshold && absDiffX > absDiffY) {
            lastSwipeTime = now;
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }
    
    // Запускаем автопрокрутку только на десктопе
    if (!isMobile) startAutoplay();
}
