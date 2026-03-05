// ===================================
// Валидация форм
// ===================================

/**
 * Маска для телефона
 */
export function initPhoneMask() {
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

/**
 * Форма обратной связи
 */
export function initContactForm() {
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
