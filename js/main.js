// ===================================
// Главный JavaScript файл
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация компонентов
    initMobileMenu();
    initHeaderScroll();
    initHeroSlider();
    initServicesSlider();
    initChatWidget();
    initContactForm();
    initPhoneMask();
    initScrollTop();
    initScrollAnimations();
    initSmoothScroll();
    initFeaturedProductsSlider();
    initFeaturedProductsTabs();
    initProductCards();
});

// ===================================
// Мобильное меню
// ===================================
function initMobileMenu() {
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const mobileOverlay = document.querySelector('.header__mobile-overlay');
    const mobileLinks = document.querySelectorAll('.header__mobile-link');
    
    if (!burger || !mobileMenu) return;
    
    // Функция закрытия меню
    function closeMenu() {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        if (mobileOverlay) {
            mobileOverlay.classList.remove('active');
        }
        document.body.classList.remove('menu-open');
    }
    
    // Открытие/закрытие меню
    burger.addEventListener('click', function() {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        if (mobileOverlay) {
            mobileOverlay.classList.toggle('active');
        }
        document.body.classList.toggle('menu-open');
    });
    
    // Закрытие меню при клике на overlay
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', closeMenu);
    }
    
    // Закрытие меню при клике на ссылку
    mobileLinks.forEach(function(link) {
        link.addEventListener('click', closeMenu);
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!mobileMenu.contains(e.target) && !burger.contains(e.target) && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
}

// ===================================
// Эффект прокрутки для header
// ===================================
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let lastScroll = 0;
    const scrollThreshold = 50;
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Добавляем класс scrolled при прокрутке вниз
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Добавляем плавную анимацию при наведении на логотип
    const logo = document.querySelector('.header__logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.02) rotate(1deg)';
        });
        
        logo.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
}

// ===================================
// Hero слайдер
// ===================================
function initHeroSlider() {
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

// ===================================
// Слайдер услуг
// ===================================
function initServicesSlider() {
    const track = document.querySelector('.services__track');
    if (!track) return;
    
    const cards = document.querySelectorAll('.services__card');
    const prevBtn = document.querySelector('.services__nav--prev');
    const nextBtn = document.querySelector('.services__nav--next');
    const dots = document.querySelectorAll('.services__dot');
    
    let currentPage = 0;
    let cardsPerPage = 4;
    
    // Определяем количество карточек на странице в зависимости от ширины экрана
    function updateCardsPerPage() {
        const width = window.innerWidth;
        if (width <= 480) {
            cardsPerPage = 1;
        } else if (width <= 768) {
            cardsPerPage = 2;
        } else if (width <= 1024) {
            cardsPerPage = 3;
        } else {
            cardsPerPage = 4;
        }
    }
    
    // Общее количество страниц
    function getTotalPages() {
        return Math.ceil(cards.length / cardsPerPage);
    }
    
    // Переход на страницу
    function goToPage(page) {
        const totalPages = getTotalPages();
        
        // Ограничиваем страницу
        if (page < 0) page = 0;
        if (page >= totalPages) page = totalPages - 1;
        
        currentPage = page;
        
        // Вычисляем смещение
        const cardWidth = cards[0].offsetWidth;
        const gap = 24; // gap между карточками
        const offset = -(cardWidth + gap) * cardsPerPage * currentPage;
        
        // Применяем трансформацию
        track.style.transform = `translateX(${offset}px)`;
        
        // Обновляем состояние кнопок
        updateButtons();
        
        // Обновляем индикаторы
        updateDots();
    }
    
    // Обновление состояния кнопок
    function updateButtons() {
        const totalPages = getTotalPages();
        
        if (prevBtn) {
            prevBtn.disabled = currentPage === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = currentPage >= totalPages - 1;
        }
    }
    
    // Обновление индикаторов
    function updateDots() {
        dots.forEach(function(dot, index) {
            if (index === currentPage) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Следующая страница
    function nextPage() {
        goToPage(currentPage + 1);
    }
    
    // Предыдущая страница
    function prevPage() {
        goToPage(currentPage - 1);
    }
    
    // События для кнопок
    if (prevBtn) {
        prevBtn.addEventListener('click', prevPage);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextPage);
    }
    
    // События для индикаторов
    dots.forEach(function(dot, index) {
        dot.addEventListener('click', function() {
            goToPage(index);
        });
    });
    
    // Свайпы на мобильных устройствах
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Свайп влево - следующая страница
                nextPage();
            } else {
                // Свайп вправо - предыдущая страница
                prevPage();
            }
        }
    }
    
    // Управление клавиатурой
    document.addEventListener('keydown', function(e) {
        const servicesSection = document.querySelector('.services');
        if (!servicesSection) return;
        
        const rect = servicesSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isInView) {
            if (e.key === 'ArrowLeft') {
                prevPage();
            } else if (e.key === 'ArrowRight') {
                nextPage();
            }
        }
    });
    
    // Обновление при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            updateCardsPerPage();
            goToPage(0); // Возвращаемся на первую страницу
        }, 250);
    });
    
    // Инициализация
    updateCardsPerPage();
    updateButtons();
    updateDots();
}

// ===================================
// Виджет чата с менеджером
// ===================================
function initChatWidget() {
    const chatWidget = document.getElementById('chatWidget');
    const chatButton = document.getElementById('chatButton');
    const chatClose = document.getElementById('chatClose');
    const chatCollapsed = document.getElementById('chatCollapsed');
    
    if (!chatWidget || !chatButton || !chatClose || !chatCollapsed) return;
    
    // Открытие чата (переход к форме обратной связи)
    chatButton.addEventListener('click', function() {
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Сворачивание виджета при клике на крестик
    chatClose.addEventListener('click', function(e) {
        e.stopPropagation();
        chatWidget.classList.add('minimized');
        
        // Сохраняем состояние в localStorage
        localStorage.setItem('chatWidgetMinimized', 'true');
    });
    
    // Разворачивание виджета при клике на свернутую кнопку
    chatCollapsed.addEventListener('click', function() {
        chatWidget.classList.remove('minimized');
        
        // Удаляем состояние из localStorage
        localStorage.removeItem('chatWidgetMinimized');
    });
    
    // Очищаем старое состояние, если оно было
    localStorage.removeItem('chatWidgetClosed');
    
    // Проверяем, был ли виджет свернут ранее
    if (localStorage.getItem('chatWidgetMinimized') === 'true') {
        chatWidget.classList.add('minimized');
    }
    
    // Показываем виджет через 3 секунды после загрузки
    setTimeout(function() {
        chatWidget.style.opacity = '1';
    }, 3000);
}

// ===================================
// Маска для телефона
// ===================================
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (!phoneInput) return;
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        // Ограничиваем длину
        if (value.length > 11) {
            value = value.slice(0, 11);
        }
        
        // Форматируем номер
        let formattedValue = '';
        
        if (value.length > 0) {
            formattedValue = '+7';
            
            if (value.length > 1) {
                formattedValue += ' (' + value.substring(1, 4);
            }
            if (value.length >= 5) {
                formattedValue += ') ' + value.substring(4, 7);
            }
            if (value.length >= 8) {
                formattedValue += '-' + value.substring(7, 9);
            }
            if (value.length >= 10) {
                formattedValue += '-' + value.substring(9, 11);
            }
        }
        
        e.target.value = formattedValue;
    });
    
    // Устанавливаем начальное значение
    phoneInput.addEventListener('focus', function(e) {
        if (e.target.value === '') {
            e.target.value = '+7';
        }
    });
    
    phoneInput.addEventListener('blur', function(e) {
        if (e.target.value === '+7') {
            e.target.value = '';
        }
    });
}

// ===================================
// Форма обратной связи
// ===================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const messageInput = document.getElementById('message');
    const successMessage = document.getElementById('successMessage');
    
    // Валидация имени
    function validateName(value) {
        if (!value || value.trim().length < 2) {
            return 'Введите имя (минимум 2 символа)';
        }
        return '';
    }
    
    // Валидация телефона
    function validatePhone(value) {
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length !== 11) {
            return 'Введите полный номер телефона';
        }
        return '';
    }
    
    // Показать ошибку
    function showError(input, errorElement, message) {
        input.classList.add('error');
        errorElement.textContent = message;
    }
    
    // Скрыть ошибку
    function hideError(input, errorElement) {
        input.classList.remove('error');
        errorElement.textContent = '';
    }
    
    // Валидация в реальном времени
    nameInput.addEventListener('blur', function() {
        const error = validateName(this.value);
        const errorElement = document.getElementById('nameError');
        
        if (error) {
            showError(this, errorElement, error);
        } else {
            hideError(this, errorElement);
        }
    });
    
    phoneInput.addEventListener('blur', function() {
        const error = validatePhone(this.value);
        const errorElement = document.getElementById('phoneError');
        
        if (error) {
            showError(this, errorElement, error);
        } else {
            hideError(this, errorElement);
        }
    });
    
    // Отправка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация всех полей
        const nameError = validateName(nameInput.value);
        const phoneError = validatePhone(phoneInput.value);
        
        const nameErrorElement = document.getElementById('nameError');
        const phoneErrorElement = document.getElementById('phoneError');
        
        // Показываем ошибки
        if (nameError) {
            showError(nameInput, nameErrorElement, nameError);
        } else {
            hideError(nameInput, nameErrorElement);
        }
        
        if (phoneError) {
            showError(phoneInput, phoneErrorElement, phoneError);
        } else {
            hideError(phoneInput, phoneErrorElement);
        }
        
        // Если есть ошибки, останавливаем отправку
        if (nameError || phoneError) {
            return;
        }
        
        // Здесь будет отправка данных на сервер
        console.log('Отправка формы:', {
            name: nameInput.value,
            phone: phoneInput.value,
            message: messageInput.value
        });
        
        // Показываем сообщение об успехе
        successMessage.classList.add('show');
        
        // Очищаем форму
        form.reset();
        
        // Скрываем сообщение через 5 секунд
        setTimeout(function() {
            successMessage.classList.remove('show');
        }, 5000);
    });
}

// ===================================
// Кнопка "Наверх"
// ===================================
function initScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    if (!scrollTopBtn) return;
    
    // Показываем/скрываем кнопку при скролле
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // Прокрутка наверх при клике
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===================================
// Анимации при скролле
// ===================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll, .fade-in, .fade-in-left, .fade-in-right, .scale-in');
    
    if (animatedElements.length === 0) return;
    
    // Настройки Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Опционально: отключаем наблюдение после анимации
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Наблюдаем за всеми элементами
    animatedElements.forEach(function(element) {
        observer.observe(element);
    });
}

// ===================================
// Плавная прокрутка к якорям
// ===================================
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Игнорируем пустые якоря
            if (href === '#' || href === '#!') {
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Получаем высоту header
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Вычисляем позицию с учетом header
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Слайдер популярных товаров
// ===================================
const featuredProductsSliderState = new WeakMap();

function refreshFeaturedProductsSlider(tabContent, resetPage) {
    const state = featuredProductsSliderState.get(tabContent);
    if (state) {
        state.refresh(Boolean(resetPage));
    }
}

function initFeaturedProductsSlider() {
    const tabContents = document.querySelectorAll('.featured-products__tab-content');
    if (tabContents.length === 0) return;
    
    tabContents.forEach(function(tabContent) {
        const grid = tabContent.querySelector('.featured-products__grid');
        if (!grid) return;
        
        const cards = grid.querySelectorAll('.product-card');
        const prevBtn = tabContent.querySelector('.featured-products__nav--prev');
        const nextBtn = tabContent.querySelector('.featured-products__nav--next');
        const dotsContainer = tabContent.querySelector('.featured-products__dots');
        
        let currentPage = 0;
        let cardsPerPage = 4;
        
        function updateCardsPerPage() {
            const width = window.innerWidth;
            if (width <= 480) {
                cardsPerPage = 1;
            } else if (width <= 768) {
                cardsPerPage = 2;
            } else if (width <= 1024) {
                cardsPerPage = 3;
            } else {
                cardsPerPage = 4;
            }
        }
        
        function getTotalPages() {
            return Math.ceil(cards.length / cardsPerPage);
        }
        
        function updateButtons() {
            const totalPages = getTotalPages();
            
            if (prevBtn) {
                prevBtn.disabled = currentPage === 0;
                prevBtn.style.opacity = currentPage === 0 ? '0.3' : '1';
            }
            
            if (nextBtn) {
                nextBtn.disabled = currentPage >= totalPages - 1;
                nextBtn.style.opacity = currentPage >= totalPages - 1 ? '0.3' : '1';
            }
        }
        
        function updateDots() {
            if (!dotsContainer) return;
            
            const dots = dotsContainer.querySelectorAll('.featured-products__dot');
            dots.forEach(function(dot, index) {
                if (index === currentPage) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
        
        function renderDots() {
            if (!dotsContainer) return;
            
            const totalPages = getTotalPages();
            dotsContainer.innerHTML = '';
            
            for (let i = 0; i < totalPages; i += 1) {
                const dot = document.createElement('button');
                dot.className = 'featured-products__dot';
                dot.setAttribute('aria-label', `Страница ${i + 1}`);
                if (i === currentPage) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', function() {
                    goToPage(i);
                });
                dotsContainer.appendChild(dot);
            }
        }
        
        function goToPage(page) {
            const totalPages = getTotalPages();
            if (totalPages === 0) return;
            
            if (page < 0) page = 0;
            if (page >= totalPages) page = totalPages - 1;
            
            currentPage = page;
            
            const cardWidth = cards[0].offsetWidth;
            const gapValue = parseFloat(getComputedStyle(grid).gap) || 24;
            const offset = -(cardWidth + gapValue) * cardsPerPage * currentPage;
            
            if (cardWidth > 0) {
                grid.style.transform = `translateX(${offset}px)`;
            }
            
            updateButtons();
            updateDots();
        }
        
        function nextPage() {
            goToPage(currentPage + 1);
        }
        
        function prevPage() {
            goToPage(currentPage - 1);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevPage);
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', nextPage);
        }
        
        let touchStartX = 0;
        let touchEndX = 0;
        
        grid.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        grid.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextPage();
                } else {
                    prevPage();
                }
            }
        }, { passive: true });
        
        function refresh(resetPage) {
            updateCardsPerPage();
            if (resetPage) {
                currentPage = 0;
            }
            renderDots();
            goToPage(currentPage);
        }
        
        featuredProductsSliderState.set(tabContent, { refresh });
        refresh(true);
        
        let resizeTimeout;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                refresh(true);
            }, 250);
        });
    });
}

// ===================================
// Табы популярных товаров
// ===================================
function initFeaturedProductsTabs() {
    const tabs = document.querySelectorAll('.featured-products__tab');
    const tabContents = document.querySelectorAll('.featured-products__tab-content');
    
    if (tabs.length === 0) return;
    
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Убираем активный класс со всех табов
            tabs.forEach(function(t) {
                t.classList.remove('active');
            });
            
            // Убираем активный класс со всех контентов
            tabContents.forEach(function(content) {
                content.classList.remove('active');
            });
            
            // Добавляем активный класс к выбранному табу
            this.classList.add('active');
            
            // Показываем соответствующий контент
            const targetContent = document.querySelector('[data-content="' + targetTab + '"]');
            if (targetContent) {
                targetContent.classList.add('active');
                refreshFeaturedProductsSlider(targetContent, true);
            }
        });
    });
}

// ===================================
// Интерактивность карточек товаров
// ===================================
function initProductCards() {
    // Кнопки избранного
    const favoriteButtons = document.querySelectorAll('.product-card__favorite');
    
    favoriteButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            
            // Добавляем анимацию
            this.style.animation = 'none';
            setTimeout(function() {
                button.style.animation = '';
            }, 10);
        });
    });
    
    // Кнопки корзины
    const cartButtons = document.querySelectorAll('.product-card__cart');
    
    cartButtons.forEach(function(button) {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Анимация добавления в корзину
            this.style.transform = 'scale(0.9)';
            setTimeout(function() {
                button.style.transform = '';
            }, 200);
            
            // Здесь можно добавить логику добавления в корзину
            console.log('Товар добавлен в корзину');
        });
    });
}
