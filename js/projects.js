// ===================================
// Карточки проектов
// ===================================

/**
 * Инициализация карточек проектов
 * Обработка кликов на карточки для перехода на страницу проекта
 */
export function initProjectCards() {
    // Карточки проектов на главной странице (projects__item)
    // Это div элементы, на которые нужно добавить обработчик клика
    const projectItems = document.querySelectorAll('.projects__item[data-project-id]');
    projectItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            const projectId = item.getAttribute('data-project-id');
            if (projectId) {
                window.location.href = 'project-single.html?id=' + encodeURIComponent(projectId);
            }
        });
    });

    // Карточки проектов на странице проектов (projects-gallery__item)
    // Они уже являются ссылками, но если нужно добавить обработку для не-ссылок
    const galleryItems = document.querySelectorAll('.projects-gallery__item:not(a)');
    galleryItems.forEach(function(item) {
        const projectId = item.getAttribute('data-project-id');
        if (projectId) {
            item.addEventListener('click', function(e) {
                window.location.href = 'project-single.html?id=' + encodeURIComponent(projectId);
            });
        }
    });
}
