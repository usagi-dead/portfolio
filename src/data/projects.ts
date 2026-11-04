import type { ProjectItem } from '../types/portfolio';

export const PROJECTS: ProjectItem[] = [
  {
    id: 'car-auction',
    title: 'Car Auction',
    subtitle: {
      en: 'B2B/B2C damaged & salvage vehicle auction platform',
      ru: 'Онлайн-аукцион аварийных и страховых авто (B2B / B2C)',
    },
    date: {
      en: 'June 2026 – Present',
      ru: 'Июнь 2026 – Н.в.',
    },
    stack: ['Angular', 'TypeScript', 'RxJS', 'Signals', 'Tailwind CSS', 'Figma'],
    image: '/projects/car-auction.webp',
    accentColor: '#00BC7D',
    accentRgb: '0, 188, 125',
    screens: [
      {
        src: '/projects/car-auction.webp',
        title: {
          en: 'Screen 01 · Live Auction Marketplace',
          ru: 'Экран 01 · Витрина активных аукционов',
        },
        caption: {
          en: 'Live vehicle catalog with real-time countdown timers, lot bidding statuses, and dynamic price feeds.',
          ru: 'Каталог лотов с обратным отсчетом времени, статусами торгов и динамическим обновлением текущих цен в реальном времени.',
        },
      },
      {
        src: '/projects/car-auction-2.webp',
        title: {
          en: 'Screen 02 · Vehicle Inspection & Bidding Terminal',
          ru: 'Экран 02 · Инспекция автомобиля и терминал ставок',
        },
        caption: {
          en: 'Comprehensive technical damage assessment, dynamic bid history chart, and instant quick-bid increments.',
          ru: 'Детальный отчет эксперта о повреждениях, интерактивный график истории ставок и панель быстрого повышения шага аукциона.',
        },
      },
      {
        src: '/projects/car-auction-3.webp',
        title: {
          en: 'Screen 03 · Bidder Dashboard & Lot Tracking',
          ru: 'Экран 03 · Личный кабинет и трекер ставок',
        },
        caption: {
          en: 'Personal bidder dashboard: real-time outbid alerts, winning bid tracker, and quick re-bid management.',
          ru: 'Персональный хаб участника: мониторинг статуса лидирующих ставок, предупреждения о перебитой цене и быстрый переход к торгам.',
        },
      },
    ],
    links: [
      { label: 'Figma', url: 'https://www.behance.net/usagi-dead' },
      { label: 'GitHub', url: 'https://github.com/uselessBit/auction-platform' },
    ],
  },
  {
    id: 'shavabear',
    title: 'ShavaBear',
    subtitle: {
      en: 'Telegram Mini App for street food ordering & delivery',
      ru: 'Telegram Mini App для доставки еды и стритфуда',
    },
    date: {
      en: 'June 2025',
      ru: 'Июнь 2025',
    },
    stack: ['React', 'TypeScript', 'Redux', 'Chakra UI'],
    image: '/projects/shavabear-1.webp',
    layout: 'mobile-trio',
    accentColor: '#6ED209',
    accentRgb: '110, 210, 9',
    screens: [
      {
        src: '/projects/shavabear-1.webp',
        title: {
          en: 'Screen 01 · Dynamic Menu, Promo Stories & Categories',
          ru: 'Экран 01 · Динамическое меню, сторис и категории блюд',
        },
        caption: {
          en: 'Telegram Mini App main feed with interactive promo stories, loyalty balance, and category navigation.',
          ru: 'Главный экран витрины Telegram Mini App с промо-сторис, балансом бонусных баллов и быстрой фильтрацией по категориям.',
        },
      },
      {
        src: '/projects/shavabear-2.webp',
        title: {
          en: 'Screen 02 · Item Customizer & Ingredient Management',
          ru: 'Экран 02 · Карточка блюда и кастомизация ингредиентов',
        },
        caption: {
          en: 'Interactive portion selector (300/400/500g) with modular ingredient removal and instant price recalculation.',
          ru: 'Конфигуратор порции: переключение веса (300/400/500 г) и возможность тонко исключать отдельные ингредиенты и соусы в один клик.',
        },
      },
      {
        src: '/projects/shavabear-3.webp',
        title: {
          en: 'Screen 03 · Shopping Cart & Fast Checkout',
          ru: 'Экран 03 · Корзина и оформление заказа',
        },
        caption: {
          en: 'Streamlined shopping cart with quantity controls and seamless Telegram Pay checkout trigger.',
          ru: 'Лаконичный экран корзины с управлением количеством позиций и бесшовным переходом к оплате через Telegram.',
        },
      },
    ],
    links: [
      { label: 'Bot', url: 'https://t.me/shavabearbot' },
      { label: 'Figma', url: 'https://www.behance.net/usagi-dead' },
      { label: 'GitHub', url: 'https://github.com/uselessBit/shawa-bear-tg-mini-app' },
    ],
  },
  {
    id: 'offliner',
    title: 'Offliner',
    subtitle: {
      en: 'PC hardware catalog & component marketplace',
      ru: 'Онлайн-каталог комплектующих для ПК и электроники',
    },
    date: {
      en: 'May 2024',
      ru: 'Май 2024',
    },
    stack: ['React', 'TypeScript', 'REST API', 'SCSS'],
    image: '/projects/offliner.webp',
    accentColor: '#025ADD',
    accentRgb: '2, 90, 221',
    screens: [
      {
        src: '/projects/offliner.webp',
        title: {
          en: 'Screen 01 · Home Feed & Hot Deals',
          ru: 'Экран 01 · Главная страница и акционные предложения',
        },
        caption: {
          en: 'Homepage with contextual weather widget, featured hardware deals, and visual component category grid.',
          ru: 'Главная витрина с погодным виджетом, промо-предложениями со скидками и навигационной матрицей категорий комплектующих.',
        },
      },
      {
        src: '/projects/offliner-2.webp',
        title: {
          en: 'Screen 02 · Hardware Catalog with Parametric Filters',
          ru: 'Экран 02 · Каталог видеокарт с многоуровневыми фильтрами',
        },
        caption: {
          en: 'Product listing with granular parametric filtering: VRAM, TDP, slot dimensions, and interface pinouts.',
          ru: 'Сетка товаров с глубокой фильтрацией по объему памяти, энергопотреблению, слотам и разъемам подключения.',
        },
      },
      {
        src: '/projects/offliner-3.webp',
        title: {
          en: 'Screen 03 · Instant Live Search Modal',
          ru: 'Экран 03 · Быстрый предиктивный поиск',
        },
        caption: {
          en: 'Live predictive search modal with instant spec previews and direct add-to-cart functionality.',
          ru: 'Модальное окно поиска с живой выдачей товаров, ключевыми характеристиками и добавлением в корзину без перехода на отдельную страницу.',
        },
      },
    ],
    links: [
      { label: 'GitHub', url: 'https://github.com/usagi-dead/offliner' },
    ],
  },
];
