// ===================================
// FAQ Аккордеон для страницы услуги
// ===================================

/**
 * Инициализация FAQ аккордеона
 */
export function initServiceFAQ() {
    const faqItems = document.querySelectorAll('.service-faq__item');
    
    if (!faqItems.length) return;
    
    // Функция для установки высоты элемента
    function setHeight(item, isOpen) {
        const answerWrapper = item.querySelector('.service-faq__answer-wrapper');
        if (!answerWrapper) return;
        
        if (isOpen) {
            // Сначала убираем ограничение высоты для измерения
            answerWrapper.style.maxHeight = 'none';
            const height = answerWrapper.scrollHeight;
            // Возвращаем ограничение и устанавливаем реальную высоту
            answerWrapper.style.maxHeight = '';
            // Используем requestAnimationFrame для плавной анимации
            requestAnimationFrame(() => {
                answerWrapper.style.maxHeight = height + 'px';
            });
        } else {
            answerWrapper.style.maxHeight = '0px';
        }
    }
    
    // Устанавливаем начальное состояние для активных элементов
    faqItems.forEach((item) => {
        const button = item.querySelector('.service-faq__button');
        const answerWrapper = item.querySelector('.service-faq__answer-wrapper');
        
        if (!button || !answerWrapper) return;
        
        // Если элемент уже активен в HTML, устанавливаем правильную высоту
        if (item.classList.contains('service-faq__item--active')) {
            // Небольшая задержка для правильной инициализации
            setTimeout(() => {
                setHeight(item, true);
            }, 10);
        } else {
            answerWrapper.style.maxHeight = '0px';
        }
    });
    
    faqItems.forEach((item) => {
        const button = item.querySelector('.service-faq__button');
        const answerWrapper = item.querySelector('.service-faq__answer-wrapper');
        
        if (!button || !answerWrapper) return;
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = item.classList.contains('service-faq__item--active');
            
            // Закрываем все остальные элементы
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    const otherButton = otherItem.querySelector('.service-faq__button');
                    
                    otherItem.classList.remove('service-faq__item--active');
                    if (otherButton) {
                        otherButton.setAttribute('aria-expanded', 'false');
                    }
                    setHeight(otherItem, false);
                }
            });
            
            // Переключаем текущий элемент
            if (isActive) {
                item.classList.remove('service-faq__item--active');
                button.setAttribute('aria-expanded', 'false');
                setHeight(item, false);
            } else {
                item.classList.add('service-faq__item--active');
                button.setAttribute('aria-expanded', 'true');
                setHeight(item, true);
            }
        });
        
        // Обработка клавиатуры для доступности
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
    });
}
