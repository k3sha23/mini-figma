# mini-figma

Учебный редактор в духе Figma: канвас, фигуры, слои, undo/redo.

React 19 + TypeScript + Vite + Tailwind CSS v4.

## Возможности

- Канвас: сетка, зум колесом, панорама удержанием `Space`
- Фигуры: прямоугольник (`R`), эллипс (`O`), курсор (`V`)
- Перетаскивание, выделение, цвета
- Слои и панель свойств
- История: `Ctrl+Z` / `Ctrl+Shift+Z`

## Запуск

```sh
npm install
npm run dev
```

Или `start.cmd` на Windows (установит зависимости и запустит dev-сервер).

## Сборка и проверки

```sh
npm run build
npm run lint
```

Дизайн-токены: [DESIGN.md](./DESIGN.md).
