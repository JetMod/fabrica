// ===================================
// Модальное окно чата
// ===================================

/**
 * Инициализация модального окна чата
 */
export function initChatModal() {
    const modal = document.getElementById('chatModal');
    const chatWidget = document.getElementById('chatWidget');
    const chatWidgetContent = document.querySelector('.chat-widget__content');
    const openButtons = document.querySelectorAll('#chatButton, #chatCollapsed');
    const closeButton = document.getElementById('chatModalClose');
    const closeHeaderButton = document.querySelector('.chat-modal__close-header');
    const overlay = modal?.querySelector('.chat-modal__overlay');
    const form = document.getElementById('chatForm');
    const successMessage = document.getElementById('chatSuccess');
    
    if (!modal) return;

    // Функция открытия модального окна
    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        modal.setAttribute('aria-hidden', 'false');
        
        // Фокус на первом поле
        const firstInput = modal.querySelector('#chatName');
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
        const errorElements = modal.querySelectorAll('.chat-modal__error');
        errorElements.forEach(el => el.textContent = '');
        
        const errorInputs = modal.querySelectorAll('.chat-modal__input.error, .chat-modal__textarea.error');
        errorInputs.forEach(input => input.classList.remove('error'));
    }

    // Обработчик клика на всю область виджета чата
    if (chatWidgetContent) {
        chatWidgetContent.addEventListener('click', function(e) {
            // Игнорируем клик на кнопку закрытия
            if (e.target.closest('#chatClose')) {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    }

    // Обработчики открытия модального окна через кнопки
    openButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            openModal();
        });
    });

    // Обработчик закрытия по кнопке
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    // Обработчик закрытия по кнопке в заголовке
    if (closeHeaderButton) {
        closeHeaderButton.addEventListener('click', closeModal);
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
    const content = modal.querySelector('.chat-modal__content');
    if (content) {
        content.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }

    // Инициализация маски телефона для модального окна
    initChatPhoneMask();

    // Инициализация валидации формы
    initChatFormValidation();
}

/**
 * Маска для телефона в модальном окне чата
 */
function initChatPhoneMask() {
    const phoneInput = document.getElementById('chatPhone');
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
 * Валидация формы чата
 */
function initChatFormValidation() {
    const form = document.getElementById('chatForm');
    if (!form) return;
    
    const nameInput = document.getElementById('chatName');
    const phoneInput = document.getElementById('chatPhone');
    const messageInput = document.getElementById('chatMessage');
    const successMessage = document.getElementById('chatSuccess');
    
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
    
    // Валидация сообщения (необязательное поле)
    function validateMessage(value) {
        // Сообщение необязательно, но если заполнено, должно быть минимум 5 символов
        if (value && value.trim().length > 0 && value.trim().length < 5) {
            return 'Сообщение должно содержать минимум 5 символов';
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
            const errorElement = document.getElementById('chatNameError');
            
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
            const errorElement = document.getElementById('chatPhoneError');
            
            if (error && errorElement) {
                showError(this, errorElement, error);
            } else if (errorElement) {
                hideError(this, errorElement);
            }
        });
    }
    
    if (messageInput) {
        messageInput.addEventListener('blur', function() {
            const error = validateMessage(this.value);
            const errorElement = document.getElementById('chatMessageError');
            
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
        const messageError = messageInput ? validateMessage(messageInput.value) : '';
        
        const nameErrorElement = document.getElementById('chatNameError');
        const phoneErrorElement = document.getElementById('chatPhoneError');
        const messageErrorElement = document.getElementById('chatMessageError');
        
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
        
        if (messageError && messageInput && messageErrorElement) {
            showError(messageInput, messageErrorElement, messageError);
        } else if (messageInput && messageErrorElement) {
            hideError(messageInput, messageErrorElement);
        }
        
        // Если есть ошибки в обязательных полях, останавливаем отправку
        if (nameError || phoneError || messageError) {
            return;
        }
        
        // Здесь будет отправка данных на сервер
        console.log('Отправка сообщения в чат:', {
            name: nameInput?.value || '',
            phone: phoneInput?.value || '',
            message: messageInput?.value || ''
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
            const modal = document.getElementById('chatModal');
            if (modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
                modal.setAttribute('aria-hidden', 'true');
                
                // Сброс формы
                form.reset();
                form.classList.remove('hidden');
                successMessage.classList.remove('show');
                
                // Очистка ошибок
                const errorElements = modal.querySelectorAll('.chat-modal__error');
                errorElements.forEach(el => el.textContent = '');
                
                const errorInputs = modal.querySelectorAll('.chat-modal__input.error, .chat-modal__textarea.error');
                errorInputs.forEach(input => input.classList.remove('error'));
            }
        }, 3000);
    });
}
