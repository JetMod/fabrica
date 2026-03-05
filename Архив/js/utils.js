// ===================================
// Утилиты
// ===================================

/**
 * Debounce функция для оптимизации событий с задержкой
 * @param {Function} func - Функция для выполнения
 * @param {Number} wait - Задержка в миллисекундах
 * @returns {Function} - Обернутая функция
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = function() {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle функция для оптимизации частых событий
 * @param {Function} func - Функция для выполнения
 * @param {Number} limit - Минимальная задержка между вызовами
 * @returns {Function} - Обернутая функция
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(function() { inThrottle = false; }, limit);
        }
    };
}
