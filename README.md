<div align="center">

# ⚡ Alexander Luchinovich — Portfolio

<p align="center">
  <strong>Frontend Developer · Angular & React Specialist · UI/UX Craftsman</strong>
</p>

[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-00BC7D?style=for-the-badge&logo=github&logoColor=white)](https://usagi-dead.github.io/portfolio/)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

<br />

[**Посмотреть сайт (Live Demo)**](https://usagi-dead.github.io/portfolio/) · [**Telegram**](https://t.me/usagi_dead) · [**Behance**](https://www.behance.net/usagi-dead) · [**GitHub**](https://github.com/usagi-dead)

</div>

---

## 🌟 О проекте / Overview

Интерактивное цифровое портфолио в тёмной эстетике JetBrains / WebStorm с глубоким вниманием к деталям, плавной кинематографичной анимацией и безупречным мобильным UX. 

Проект разработан с нуля с использованием новейшего стека (**React 19**, **Tailwind CSS v4**, **TypeScript**, **Vite**) и демонстрирует инженерный подход к созданию сложных, производительных интерфейсов.

---

## ✨ Ключевые особенности / Key Features

### 🖥️ JetBrains-Style Code Editor Hero
* **Симуляция IDE:** интерактивный редактор кода с вкладками (`about.ts`, `skills.ts`, `contacts.ts`), нумерацией строк, подсветкой синтаксиса и статус-баром Git.
* **Встроенный терминал:** полноценный терминал с командой сборки (`tsc -b && vite build`), индикацией компиляции, кнопками Run / Stop и интерактивным перезапуском анимации загрузки.

### 🐧 CachyOS / Linux Boot Preloader
* Аутентичный ретро-прелоадер в стиле загрузки Linux ядра (CachyOS), сканирующий подсистемы и выводящий статус инициализации перед первым показом портфолио. Сохраняет состояние в `sessionStorage`.

### 📱 Интерактивные витрины проектов (Project Showcases)
* **Car Auction (В2В / B2C онлайн-аукцион):** 
  * 16:9 адаптивный вьюпорт с выравниванием по верхнему краю (`object-top`).
  * Тач-свайпы пальцем на смартфонах и клавиши переключения экранов.
  * Персональный акцентный цвет `#00BC7D`.
* **ShavaBear (Telegram Mini App):**
  * Трёхмерный подиум с трио смартфонов.
  * Интерактивная статусная панель с кинематографичной сменой названий экранов.
  * Умное снятие фокуса на мобильных при повторном тапе, скролле страницы или клике снаружи.
  * Акцентный цвет `#6ED209`.
* **Offliner (Каталог комплектующих ПК):**
  * Параметрическая витрина с предиктивным поиском и поддержкой свайпов.
  * Акцентный цвет `#025ADD`.

### 🔍 Полноэкранный просмотр (Advanced Lightbox)
* Аппаратно-ускоренный зум (100% → 300%) с поддержкой клавиатуры (`+`, `−`, `0`, `Esc`, `←`, `→`).
* Сегментированное управление масштабом в шапке и свободное панорамирование (Pan/Drag) зажатой мышью или тачем.
* Изоляция неактивных экранов — отсутствие визуальных артефактов и просвечивающих рамок соседних слайдов.

### 🌐 Двуязычность (i18n) & UX
* Мгновенное переключение языка (**RU / EN**) с мягким кроссфейдом контента и сохранением предпочтения в `localStorage`.
* Курсорное фоновое свечение (**Spotlight Glow**), автоматически адаптирующееся под акцент каждого проекта и отключаемое на тач-устройствах.
* Скачивание актуальных резюме (CV) на русском и английском языках.

---

## 🛠️ Стек технологий / Tech Stack

| Категория | Технологии |
|---|---|
| **Core** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Стилизация** | [Tailwind CSS v4](https://tailwindcss.com/) (нативный CSS @theme, кастомные keyframes, zero-runtime) |
| **Сборка** | [Vite 8](https://vitejs.dev/) |
| **Иконки** | [Lucide React](https://lucide.dev/) |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) → [GitHub Pages](https://pages.github.com/) |

---

## 📂 Структура проекта / Project Structure

```text
portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Автоматический деплой на GitHub Pages
├── public/
│   ├── projects/               # Оптимизированные WebP скриншоты проектов
│   ├── Alexander_Luchinovich_CV_*.pdf # Резюме (RU / EN)
│   └── favicon.*               # Фавиконы и иконки PWA
├── src/
│   ├── components/
│   │   ├── editor/             # Герой-блок: редактор кода и терминал
│   │   ├── layout/             # Header, Footer, навигация
│   │   ├── projects/           # Карточки, слайдеры, MobileTrioShowcase
│   │   └── ui/                 # Lightbox, Spotlight, Glow, Links, Badges
│   ├── data/
│   │   ├── profile.ts          # Данные разработчика, стек, контакты
│   │   └── projects.ts         # Детальные описания и метаданные проектов
│   ├── hooks/                  # Кастомные React хуки (useScroll, etc.)
│   ├── types/                  # TypeScript интерфейсы и типы
│   ├── App.tsx                 # Главный компонент приложения
│   ├── index.css               # Tailwind CSS v4, темы и анимации
│   └── main.tsx                # Точка входа React
├── vite.config.ts              # Конфигурация Vite с base: './'
└── package.json
```

---

## 🚀 Быстрый старт / Local Setup

### Требования
* **Node.js** версии 20+
* **npm** или **pnpm**

### Установка и запуск

1. **Клонируйте репозиторий:**
   ```bash
   git clone https://github.com/usagi-dead/portfolio.git
   cd portfolio
   ```

2. **Установите зависимости:**
   ```bash
   npm install
   ```

3. **Запустите локальный сервер разработки:**
   ```bash
   npm run dev
   ```
   Приложение откроется по адресу `http://localhost:5173/`.

4. **Сборка для продакшена:**
   ```bash
   npm run build
   ```

---

## 📬 Контакты / Contact

* **Telegram:** [@usagi_dead](https://t.me/usagi_dead)
* **GitHub:** [github.com/usagi-dead](https://github.com/usagi-dead)
* **Behance:** [behance.net/usagi-dead](https://www.behance.net/usagi-dead)
* **Email:** [luchinovich2006@gmail.com](mailto:luchinovich2006@gmail.com)

---

<div align="center">
  <sub>Разработано с заботой об эстетике и производительности © Alexander Luchinovich</sub>
</div>
