# JavaScript Модули

## Структура

Проект разделен на логические модули для улучшения читаемости, поддержки и масштабируемости кода.

### Файлы модулей

```
js/
├── app.js                  # Главный файл - точка входа
├── utils.js                # Утилиты (debounce, throttle)
├── mobile-menu.js          # Мобильное меню
├── header.js               # Header скролл эффект
├── hero-slider.js          # Главный слайдер
├── services-slider.js      # Слайдер услуг
├── chat-widget.js          # Виджет чата с менеджером
├── form-validation.js      # Валидация форм и маска телефона
├── scroll.js               # Scroll функционал
├── products.js             # Популярные товары и карточки
└── main.js                 # Старая версия (fallback)
```

## Использование

### ES6 Модули (современные браузеры)

```html
<script type="module" src="js/app.js"></script>
```

### Fallback (старые браузеры)

```html
<script nomodule src="js/main.js" defer></script>
```

## Преимущества модульной структуры

✅ **Читаемость** - каждый файл отвечает за одну функциональность  
✅ **Поддержка** - легко найти и исправить баги  
✅ **Масштабируемость** - просто добавлять новые функции  
✅ **Переиспользование** - модули можно импортировать где угодно  
✅ **Тестирование** - легко писать unit-тесты для отдельных модулей  
✅ **WordPress готовность** - удобно интегрировать в WordPress  

## Добавление нового модуля

1. Создайте новый файл в папке `js/`
2. Экспортируйте функции с помощью `export`
3. Импортируйте в `app.js`
4. Вызовите функцию в DOMContentLoaded

Пример:

```javascript
// js/new-feature.js
export function initNewFeature() {
    // ваш код
}

// js/app.js
import { initNewFeature } from './new-feature.js';

document.addEventListener('DOMContentLoaded', function() {
    initNewFeature();
});
```

## Совместимость с браузерами

### ES6 Modules поддерживаются в:
- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 16+

### Fallback для старых браузеров:
Используется `nomodule` атрибут для загрузки `main.js` в старых браузерах, которые не поддерживают ES6 модули.

## Production Build

Для production рекомендуется:

1. **Минификация** - используйте Terser или UglifyJS
2. **Бандлинг** - используйте Webpack, Rollup или Vite
3. **Tree shaking** - удаление неиспользуемого кода
4. **Code splitting** - разделение на chunks для оптимальной загрузки

### Пример с Vite:

```bash
npm install --save-dev vite
npx vite build
```

## WordPress интеграция

При интеграции в WordPress используйте `wp_enqueue_script()`:

```php
// functions.php
function fabrica_enqueue_scripts() {
    // Модульный скрипт для современных браузеров
    wp_enqueue_script(
        'fabrica-app',
        get_template_directory_uri() . '/js/app.js',
        array(),
        '1.0.0',
        true
    );
    
    // Добавляем атрибут type="module"
    add_filter('script_loader_tag', 'add_module_attribute', 10, 2);
}
add_action('wp_enqueue_scripts', 'fabrica_enqueue_scripts');

function add_module_attribute($tag, $handle) {
    if ('fabrica-app' === $handle) {
        return str_replace('<script ', '<script type="module" ', $tag);
    }
    return $tag;
}
```
