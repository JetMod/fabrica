// ===================================
// Мобильное меню
// ===================================

/**
 * Инициализация мобильного меню
 */
export function initMobileMenu() {
    const burger = document.querySelector('.header__burger');
    const mobileMenu = document.querySelector('.header__mobile-menu');
    const mobileOverlay = document.querySelector('.header__mobile-overlay');
    const mobileLinks = document.querySelectorAll('.header__mobile-link');
    
    if (!burger || !mobileMenu) return;
    
    // Гарантируем, что меню закрыто при загрузке страницы
    burger.classList.remove('active');
    mobileMenu.classList.remove('active');
    if (mobileOverlay) {
        mobileOverlay.classList.remove('active');
    }
    document.body.classList.remove('menu-open');
    
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
