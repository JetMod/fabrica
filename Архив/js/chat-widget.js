// ===================================
// Виджет чата с менеджером
// ===================================

/**
 * Инициализация виджета чата
 */
export function initChatWidget() {
    const chatWidget = document.getElementById('chatWidget');
    const chatButton = document.getElementById('chatButton');
    const chatClose = document.getElementById('chatClose');
    const chatCollapsed = document.getElementById('chatCollapsed');
    
    if (!chatWidget || !chatButton || !chatClose || !chatCollapsed) return;
    
    // Открытие чата теперь обрабатывается в chat-modal.js
    // Оставляем пустым, чтобы не конфликтовать с модальным окном
    
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
