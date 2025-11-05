# TaskTracker

Приложение для управления задачами с поддержкой kanbam-досок. 
Тестовое для https://github.com/avito-tech/tech-internship/tree/main/Tech%20Internships/Frontend/Frontend-trainee-assignment-spring-2025

## Описание проекта

TaskTracker — это веб-приложение для управления задачами, организованными по доскам. Пользователи могут:

- Просматривать список досок и созданных задач
- Управлять задачами в формате Kanban-доски с колонками: Backlog, In Progress, Done
- Редактировать задачи через боковую панель (drawer)

Приложение подключается к REST API бэкенда для получения и обновления данных.

## Запуск проекта

### Локальная разработка

1. Установка зависимостией:
```bash
npm install
```

2. Запуск бэкенд сервера (по умолчанию ожидается на `http://localhost:8080`)

3. Запуск dev-сервера:
```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`

### Docker

Запуск всего стека (frontend + backend) через Docker Compose:

```bash
docker-compose up --build
```

Frontend будет доступен на `http://localhost:3000`, backend — на `http://localhost:8080`


## Стек технологий

- **React 19** — UI библиотека
- **TypeScript** — типизация
- **Vite** — сборщик и dev-сервер
- **Redux Toolkit** — управление состоянием (drawer, локальное состояние)
- **TanStack Query (React Query)** — управление серверным состоянием и кеширование
- **React Router DOM** — маршрутизация
- **Material-UI (MUI)** — UI компоненты и иконки
- **Tailwind CSS** — стилизация
- **dnd-kit** — drag-and-drop функциональность
- **react-window** — виртуализация длинных списков
- **Jest + React Testing Library** — тестирование

## Архитектура

### Структура проекта

```
src/
├── api/              # API клиенты (boardApi, taskApi, usersApi)
├── board/            # Компоненты Kanban-доски
├── boards/           # Список досок
├── components/       # Переиспользуемые компоненты (Header, LoadingSpinner, TabsRouter)
├── context/          # React Context (ThemeContext)
├── drawer/           # Боковая панель для редактирования задач
├── hooks/            # Кастомные хуки (useBoards, useTasks, useUsers, redux)
├── issues/           # Список всех задач
├── store/            # Redux store (drawerSlice)
├── theme/            # Тема MUI
└── types/            # TypeScript типы
```

### Управление состоянием

- **React Query** — для всех данных с сервера (boards, tasks, users). Обеспечивает кеширование, автоматический refetch, оптимистичные обновления
- **Redux Toolkit** — для UI состояния (открытие/закрытие drawer, флаг для refetch)
- **Context API** — для темы приложения (light/dark)

### Маршрутизация

- `/` — редирект на `/issues`
- `/issues` — список всех задач
- `/boards` — список досок
- `/board/:id` — Kanban-доска с задачами

### Слои и зависимости

- **UI (components)**: `Header`, `TabsRouter`, таблицы/списки в `boards/`, `board/`, `issues/`.
- **Логика представления (hooks)**: инкапсулируют доступ к API и кеш (React Query), обработку мутаций.
- **Доступ к данным (api)**: изолированные клиенты `boardApi.ts`, `taskApi.ts`.
- **Глобальное UI‑состояние (store)**: `drawerSlice` в `store/` для управления боковой панелью.
- **Тема (context + theme)**: `ThemeContext` + MUI `ThemeProvider`.

Зависимости направлены сверху вниз: components → hooks → api.

<!-- ### Поток данных: пример drag-and-drop

1. Пользователь перетаскивает карточку задачи между колонками в `BoardTable`.
2. Срабатывает `useUpdateTaskStatus` → вызов `taskApi.updateTaskStatus` (PUT `/api/v1/tasks/updateStatus/:id`).
3. По `onSuccess` инвалидируется список задач в кэше React Query → компоненты получают актуальные данные.
4. Для обновления задач конкретной доски используется ручной `refetch` из `Board`, триггерится через `refetchState` в `drawerSlice`. -->

### Маршруты: контейнеры (данные) и представление (UI)

- **`/issues`**
  - Контейнер данных: `issues/Issues.tsx` (использует `useTasks` для загрузки задач)
  - Представление: `issues/IssuesList.tsx` (поиск, сортировка, виртуальный список), `issues/IssuesItem.tsx`
  - Дополнительно: `components/LoadingSpinner.tsx` для загрузки, `store/drawerSlice.ts` (открытие дроуэра из элемента)

- **`/boards`**
  - Контейнер данных: `boards/Boards.tsx` (использует `useBoards` для загрузки списка досок)
  - Представление: `boards/BoardsList.tsx` (поиск, сортировка, виртуальный список), `boards/BoardsItem.tsx`

- **`/board/:id`**
  - Контейнер данных: `board/Board.tsx` (использует `useBoard` для задач выбранной доски и `useBoards` для метаданных; слушает `refetchState` из `drawerSlice` и делает `refetch`)
  - Представление: `board/BoardTable.tsx` (колонки статусов, DnD, уведомления), `board/BoardTableCard.tsx`, `board/Droppable.tsx`
  - Мутации: `hooks/useTasks.ts` → `useUpdateTaskStatus` (перенос задачи меняет статус через API)

- **`/`**
  - Редирект в `App.tsx` на `/issues`

## Особенности реализации

### Drag-and-Drop

Используется библиотека `@dnd-kit` для перемещения задач между колонками статусов.

### Виртуализация

Списки задач виртуализированы через `react-window` для оптимизации рендеринга при большом количестве элементов.

### API клиенты

Все API вызовы централизованы в модулях `boardApi.ts`, `taskApi.ts`, `usersApi.ts`. Базовый URL хардкодится как `http://localhost:8080` (см. раздел "Проблемы и компромиссы").

### Обработка ошибок

- `ErrorBoundary` компонент для перехвата React ошибок
- Обработка ошибок API через React Query (показываются через Snackbar)

## Проблемы



1. **Виртуализация доски и drag-and-drop** — в `Board.tsx` есть TODO: виртуализация таблицы доски и убрать бесконечный drag за пределы таблицы
2. **UX drawer** — при закрытии drawer id сбрасывается, из-за чего на мгновение показывается форма создания задачи вместо закрытия
3. **Мониторинг ошибок** — нет интеграции с Sentry или другим сервисом для отслеживания ошибок в production



