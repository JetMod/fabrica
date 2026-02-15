// ===================================
// Модальное окно обратной связи
// ===================================

/**
 * Инициализация модального окна обратной связи
 */
export function initCallbackModal() {
    const modal = document.getElementById('callbackModal');
    const openButtons = document.querySelectorAll('[href="#contact-form"], [data-callback-modal]');
    const closeButton = document.getElementById('callbackModalClose');
    const overlay = modal?.querySelector('.callback-modal__overlay');
    const form = document.getElementById('callbackForm');
    const successMessage = document.getElementById('callbackSuccess');
    
    if (!modal) return;

    // Функция открытия модального окна
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');
        
        // Фокус на первом поле
        const firstInput = modal.querySelector('#callbackName');
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 100);
        }
    }

    // Функция закрытия модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modal.setAttribute('aria-hidden', 'true');
        
        // Сброс формы и скрытие сообщения об успехе
        if (form) {
            form.reset();
            form.classList.remove('hidden');
        }
        if (successMessage) {
            successMessage.classList.remove('show');
        }
        
        // Очистка ошибок
        const errorElements = modal.querySelectorAll('.callback-modal__error');
        errorElements.forEach(el => el.textContent = '');
        
        const errorInputs = modal.querySelectorAll('.callback-modal__input.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }

    // Обработчики открытия модального окна
    // Используем capture phase для приоритета перед другими обработчиками
    openButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Проверяем, является ли это ссылкой на #contact-form или имеет data-атрибут
            if (href === '#contact-form' || this.hasAttribute('data-callback-modal')) {
                e.preventDefault();
                e.stopPropagation(); // Останавливаем всплытие события
                openModal();
            }
        }, true); // Используем capture phase для приоритета
    });

    // Обработчик закрытия по кнопке
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Закрытие по клику на overlay
    if (overlay) {
        overlay.addEventListener('click', closeModal);
    }

    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Предотвращение закрытия при клике на контент
    const content = modal.querySelector('.callback-modal__content');
    if (content) {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Инициализация маски телефона для модального окна
    initCallbackPhoneMask();

    // Инициализация валидации формы
    initCallbackFormValidation();
}

/**
 * Маска для телефона в модальном окне
 */
function initCallbackPhoneMask() {
    const phoneInput = document.getElementById('callbackPhone');
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
 * Валидация формы обратной связи
 */
function initCallbackFormValidation() {
    const form = document.getElementById('callbackForm');
    if (!form) return;
    
    const nameInput = document.getElementById('callbackName');
    const phoneInput = document.getElementById('callbackPhone');
    const successMessage = document.getElementById('callbackSuccess');
    
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
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            const error = validateName(this.value);
            const errorElement = document.getElementById('callbackNameError');
            
            if (error && errorElement) {
                showError(this, errorElement, error);
            } else if (errorElement) {
                hideError(this, errorElement);
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('blur', function() {
            const error = validatePhone(this.value);
            const errorElement = document.getElementById('callbackPhoneError');
            
            if (error && errorElement) {
                showError(this, errorElement, error);
            } else if (errorElement) {
                hideError(this, errorElement);
            }
        });
    }
    
    // Отправка формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Валидация всех полей
        const nameError = nameInput ? validateName(nameInput.value) : '';
        const phoneError = phoneInput ? validatePhone(phoneInput.value) : '';
        
        const nameErrorElement = document.getElementById('callbackNameError');
        const phoneErrorElement = document.getElementById('callbackPhoneError');
        
        // Показываем ошибки
        if (nameError && nameInput && nameErrorElement) {
            showError(nameInput, nameErrorElement, nameError);
        } else if (nameInput && nameErrorElement) {
            hideError(nameInput, nameErrorElement);
        }
        
        if (phoneError && phoneInput && phoneErrorElement) {
            showError(phoneInput, phoneErrorElement, phoneError);
        } else if (phoneInput && phoneErrorElement) {
            hideError(phoneInput, phoneErrorElement);
        }
        
        // Если есть ошибки, останавливаем отправку
        if (nameError || phoneError) {
            return;
        }
        
        // Здесь будет отправка данных на сервер
        console.log('Отправка формы обратной связи:', {
            name: nameInput?.value || '',
            phone: phoneInput?.value || ''
        });
        
        // Показываем сообщение об успехе
        if (form) {
            form.classList.add('hidden');
        }
        if (successMessage) {
            successMessage.classList.add('show');
        }
        
        // Автоматически закрываем модальное окно через 3 секунды
        setTimeout(function() {
            const modal = document.getElementById('callbackModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                modal.setAttribute('aria-hidden', 'true');
                
                // Сброс формы
                form.reset();
                form.classList.remove('hidden');
                successMessage.classList.remove('show');
                
                // Очистка ошибок
                const errorElements = modal.querySelectorAll('.callback-modal__error');
                errorElements.forEach(el => el.textContent = '');
                
                const errorInputs = modal.querySelectorAll('.callback-modal__input.error');
                errorInputs.forEach(input => input.classList.remove('error'));
            }
        }, 3000);
    });
}
