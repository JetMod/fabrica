// ===================================
// FAQ аккордеон
// ===================================

/**
 * Инициализация FAQ аккордеона
 */
export function initFAQ() {
    const faqItems = document.querySelectorAll('[data-faq]');
    
    if (faqItems.length === 0) {
        return;
    }
    
    faqItems.forEach(item => {
        const trigger = item.querySelector('[data-faq-trigger]');
        const answer = item.querySelector('.business-faq__answer');
        
        if (!trigger || !answer) {
            return;
        }
        
        trigger.addEventListener('click', () => {
            const isOpen = item.hasAttribute('data-open');
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            
            // Закрываем все остальные элементы (опционально - можно убрать для множественного открытия)
            // faqItems.forEach(otherItem => {
            //     if (otherItem !== item) {
            //         closeFAQItem(otherItem);
            //     }
            // });
            
            if (isOpen) {
                closeFAQItem(item, trigger, answer);
            } else {
                openFAQItem(item, trigger, answer);
            }
        });
        
        // Обработка клавиатуры
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            }
        });
    });
}

/**
 * Открыть FAQ элемент
 */
function openFAQItem(item, trigger, answer) {
    // Сначала убираем hidden, чтобы можно было измерить высоту
    answer.removeAttribute('hidden');
    
    // Небольшая задержка для правильного расчета высоты
    requestAnimationFrame(() => {
        const height = answer.scrollHeight;
        item.setAttribute('data-open', '');
        trigger.setAttribute('aria-expanded', 'true');
        answer.style.maxHeight = height + 'px';
    });
}

/**
 * Закрыть FAQ элемент
 */
function closeFAQItem(item, trigger, answer) {
    // Сохраняем текущую высоту для плавной анимации
    const height = answer.scrollHeight;
    answer.style.maxHeight = height + 'px';
    
    // Небольшая задержка перед началом анимации закрытия
    requestAnimationFrame(() => {
        item.removeAttribute('data-open');
        trigger.setAttribute('aria-expanded', 'false');
        answer.style.maxHeight = '0';
        
        // После завершения анимации скрываем элемент
        setTimeout(() => {
            if (!item.hasAttribute('data-open')) {
                answer.setAttribute('hidden', '');
                answer.style.maxHeight = '';
            }
        }, 400);
    });
}
