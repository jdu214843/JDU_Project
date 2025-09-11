import { create } from 'zustand'

export const translations = {
  uz: {
    nav: { technologies: 'Texnologiyalar', help: 'Yordam', new: 'Yangi tahlil', dashboard: 'Kabinet', logout: 'Chiqish', login: 'Kirish', signup: 'Ro‘yxatdan o‘tish' },
    home: {
      title: 'EcoSoil',
      subtitle: 'AI asosida aqlli va barqaror dehqonchilik uchun tuproq tahlili.',
      desc: 'Tuproq ma’lumotlari va suratlarni yuklab, pH, sho‘rlanish, namlik kabi ko‘rsatkichlar hamda amaliy tavsiyalarni oling.',
      ctaPrimaryAuth: 'Yangi tahlilni boshlash',
      ctaPrimaryGuest: 'Boshlash',
      ctaSecondary: 'IoT sensorlarini ko‘rish',
      cards: {
        accurate: { title: 'Aniq natijalar', desc: 'AI ishlab chiqargan ko‘rsatkichlar va maslahatlar.' },
        iot: { title: 'IoT tayyor', desc: 'Zamonaviy agro sensorlar bilan integratsiya.' },
        friendly: { title: 'Fermer uchun qulay', desc: 'Oddiy jarayon va tushunarli hisobotlar.' },
      }
    },
    auth: {
      loginTitle: 'Qaytib kelganingizdan xursandmiz',
      email: 'Email',
      password: 'Parol',
      signIn: 'Kirish',
      noAccount: 'Hisobingiz yo‘qmi?',
      createOne: 'Ro‘yxatdan o‘ting',
      registerTitle: 'Hisob yarating',
      fullName: 'To‘liq ism',
      signUp: 'Ro‘yxatdan o‘tish',
      already: 'Hisobingiz bormi?',
      signInLink: 'Kirish',
    },
    analysisForm: {
      title: 'Yangi tuproq tahlili',
      steps: ['Umumiy ma’lumot', 'Qo‘shimcha ma’lumot', 'Rasmlar'],
      location: 'Manzil',
      area: 'Maydon (gektar)',
      soilType: 'Tuproq turi',
      cropType: 'Ekin turi',
      lastHarvestDate: 'Oxirgi hosil sanasi',
      irrigationMethod: 'Sug‘orish usuli',
      observations: 'Kuzatilgan alomatlar',
      upload: 'Rasmlarni yuklash (maks 5 ta)',
      back: 'Orqaga',
      next: 'Keyingisi',
      submit: 'Yuborish',
      submitting: 'Yuborilmoqda...',
      onlyImages: 'Faqat rasm fayllariga ruxsat beriladi (maks 5).',
    },
    processing: { title: 'Tahlil bajarilmoqda...', subtitle: 'AI tahlili ~1 daqiqa vaqt oladi.' },
    report: { title: 'Batafsil hisobot', back: 'Orqaga', share: 'Ulashish', pdf: 'PDF yuklab olish', copied: 'Link nusxa olindi' },
    detailed: {
      tabs: ['Umumiy', 'Tarkib', 'Tavsiyalar', 'AI tahlili', 'Tarix'],
      locationTitle: "Lokatsiya ma'lumotlari",
      weatherTitle: 'Ob-havo sharoiti',
      address: 'Manzil', area: 'Maydon', altitude: 'Balandlik', coords: 'Koordinatalar',
      salinityTitle: "Sho'rlanish tahlili",
      affected: "Ta'sirlangan hudud",
      salinityLevel: "Sho'rlanish darajasi",
      risk: 'Xavf darajasi',
      healthScore: 'Soil Health Score',
      aiConfidence: 'AI ishonch', phLevel: 'pH darajasi', moisture: 'Namlik',
      temperature: 'Harorat', wind: 'Shamol', humidity: 'Namlik', windUnit: 'km/soat',
    },
    weather: { sunny: 'Quyoshli', rainy: "Yomg'irli", cloudy: 'Bulutli', partly: 'Yarim bulutli' },
    composition: { title: 'Tuproq tarkibi', chemicalTitle: "Kimyoviy xususiyatlar", element: 'Element', amount: 'Miqdor', status: 'Holat', none: "Kimyoviy ma'lumotlar topilmadi", sand: 'Qum', clay: 'Gil', silt: 'Silt' },
    history: { title: "Sho'rlanish dinamikasi", subtitle: "So'nggi 4 oylik o'zgarishlar", none: "Tarixiy ma'lumotlar topilmadi" },
    share: { title: 'Hisobotni ulashish', enable: 'Ulashishni yoqish', enabled: 'Ulashish yoqilgan', disable: 'O‘chirish', link: 'Ulashish linki', copy: 'Linkni nusxalash', note: 'Linkga ega bo‘lgan istalgan kishi hisobotni ko‘ra oladi.' },
    results: {
      done: 'Tahlil yakunlandi!',
      summary: 'Umumiy natija',
      recommendations: 'Tavsiyalar',
      detail: 'Batafsil hisobot',
      new: 'Yangi tahlil',
      pdf: 'PDF yuklab olish',
      share: 'Ulashish',
    },
    dashboard: {
      tabs: ['Profil', 'Tarix', 'Sozlamalar', 'Maxfiylik'],
      farmer: 'Fermer',
      loadError: 'Dashboard ma’lumotlarini yuklashda xatolik',
    },
    profile: {
      title: 'Profil ma’lumotlari',
      email: 'Email manzil',
      phone: 'Telefon raqam',
      region: 'Viloyatingizni tanlang',
      bio: 'Bio',
      save: 'Saqlash',
      saving: 'Saqlanmoqda...',
      saved: 'Profil yangilandi',
      fullName: 'To‘liq ism',
    },
    settings: {
      saved: 'Sozlamalar saqlandi',
      email: 'Email bildirishnomalar', sms: 'SMS bildirishnomalar', marketing: 'Marketing xabarlari',
      language: 'Til',
      save: 'Saqlash', saving: 'Saqlanmoqda...'
    },
    help: {
      q1: 'Tahlil qancha vaqt oladi?', a1: 'Odatda ~1 daqiqa (AI jarayon simulyatsiya qilingan).',
      q2: 'Qanday rasmlarni yuklayman?', a2: 'Tuproq yuzasi va kichik qazilgan profilning aniq suratlari.',
      q3: 'Profilni tahrirlash mumkinmi?', a3: 'Ha, Dashboard → Profil bo‘limidan tahrirlang.',
    },
    tech: {
      title: "Zamonaviy Qishloq Xo'jaligi Texnikalari",
      subtitle: "IoT sensorlarimiz yordamida dala va issiqxonangizni aniq kuzating",
      tabs: { sensors: 'Sensorlar', services: 'Xizmatlar', pricing: 'Tariflar', faq: 'Savol-Javob' },
    },
    products: { details: 'Tafsilotlar', order: 'Buyurtma', more: "Batafsil ma'lumot" },
    sensor: { specs: 'Texnik xususiyatlar:', noData: "Ma'lumotlar topilmadi" },
    order: {
      title: 'Buyurtma berish', placed: 'Buyurtma berildi',
      product: 'Mahsulot',
      fullName: "To'liq ism", phone: 'Telefon', region: 'Viloyat', quantity: 'Soni', address: 'Manzil',
      cancel: 'Bekor qilish', submit: 'Buyurtma berish', submitting: 'Yuborilmoqda...', close: 'Yopish',
      success: "Buyurtmangiz qabul qilindi. Tez orada siz bilan bog'lanamiz.",
    },
    premium: { header: 'Premium', features: 'Premium Xususiyatlar', benefits: 'Premium bilan nimalarga erishasiz?', plans: 'Tariflar', choose: 'Tanlash' },
    checkout: { header: "To'lov", details: "To'lov ma'lumotlari", planDetails: 'Reja tafsilotlari', pay: "To'lovni amalga oshirish", activate: 'Faollashtirish' },
    payment: { successTitle: "To'lov amalga oshirildi", successMsg: 'Obuna faollashtirildi. Rahmat!' },
  },
  ru: {
    nav: { technologies: 'Технологии', help: 'Помощь', new: 'Новый анализ', dashboard: 'Кабинет', logout: 'Выйти', login: 'Войти', signup: 'Регистрация' },
    home: {
      title: 'EcoSoil',
      subtitle: 'Анализ почвы на базе ИИ для умного фермерства.',
      desc: 'Загрузите данные и фото почвы, чтобы получить pH, солёность, влажность и практические рекомендации.',
      ctaPrimaryAuth: 'Начать новый анализ',
      ctaPrimaryGuest: 'Начать',
      ctaSecondary: 'Посмотреть IoT сенсоры',
      cards: {
        accurate: { title: 'Точные данные', desc: 'Показатели и советы от ИИ.' },
        iot: { title: 'Готов к IoT', desc: 'Интеграция с современными сенсорами.' },
        friendly: { title: 'Удобно для фермера', desc: 'Простой процесс и понятные отчёты.' },
      }
    },
    auth: {
      loginTitle: 'С возвращением',
      email: 'Email', password: 'Пароль', signIn: 'Войти', noAccount: 'Нет аккаунта?', createOne: 'Зарегистрируйтесь',
      registerTitle: 'Создайте аккаунт', fullName: 'Полное имя', signUp: 'Зарегистрироваться', already: 'Уже есть аккаунт?', signInLink: 'Войти',
    },
    analysisForm: {
      title: 'Новый анализ почвы', steps: ['Общие сведения', 'Доп. сведения', 'Изображения'],
      location: 'Адрес', area: 'Площадь (га)', soilType: 'Тип почвы', cropType: 'Культура', lastHarvestDate: 'Дата последнего урожая',
      irrigationMethod: 'Метод орошения', observations: 'Наблюдаемые симптомы', upload: 'Загрузить изображения (макс 5)',
      back: 'Назад', next: 'Далее', submit: 'Отправить', submitting: 'Отправка...', onlyImages: 'Разрешены только изображения (макс 5).'
    },
    processing: { title: 'Выполняется анализ...', subtitle: 'Анализ ИИ займет около 1 минуты.' },
    report: { title: 'Детальный отчёт', back: 'Назад', share: 'Поделиться', pdf: 'Скачать PDF', copied: 'Ссылка скопирована' },
    detailed: {
      tabs: ['Общее', 'Состав', 'Рекомендации', 'Анализ ИИ', 'История'],
      locationTitle: 'Данные локации', weatherTitle: 'Погода', address: 'Адрес', area: 'Площадь', altitude: 'Высота', coords: 'Координаты',
      salinityTitle: 'Анализ засоленности', affected: 'Затронутая область', salinityLevel: 'Уровень засоленности', risk: 'Уровень риска',
      healthScore: 'Soil Health Score', aiConfidence: 'Доверие ИИ', phLevel: 'Уровень pH', moisture: 'Влажность',
      temperature: 'Температура', wind: 'Ветер', humidity: 'Влажность', windUnit: 'км/ч',
    },
    weather: { sunny: 'Солнечно', rainy: 'Дождь', cloudy: 'Облачно', partly: 'Переменная облачность' },
    composition: { title: 'Состав почвы', chemicalTitle: 'Химические свойства', element: 'Элемент', amount: 'Количество', status: 'Статус', none: 'Нет данных по химии', sand: 'Песок', clay: 'Глина', silt: 'Ил' },
    history: { title: 'Динамика засоленности', subtitle: 'Изменения за последние 4 месяца', none: 'Исторические данные не найдены' },
    share: { title: 'Поделиться отчётом', enable: 'Включить доступ', enabled: 'Доступ включён', disable: 'Выключить', link: 'Ссылка', copy: 'Скопировать ссылку', note: 'Любой, у кого есть ссылка, может просматривать отчёт.' },
    results: { done: 'Анализ завершён!', summary: 'Итоги', recommendations: 'Рекомендации', detail: 'Детальный отчёт', new: 'Новый анализ', pdf: 'Скачать PDF', share: 'Поделиться', helpers: { salinity: 'Диапазон 0–5%', ph: 'Шкала pH 0–14', moisture: 'Диапазон 0–100%' } },
    dashboard: { tabs: ['Профиль', 'История', 'Настройки', 'Конфиденциальность'], farmer: 'Фермер', loadError: 'Ошибка загрузки данных' },
    profile: { title: 'Данные профиля', email: 'Email', phone: 'Телефон', region: 'Выберите область', bio: 'Био', save: 'Сохранить', saving: 'Сохранение...', saved: 'Профиль обновлён', fullName: 'Полное имя' },
    settings: { saved: 'Настройки сохранены', email: 'Email-уведомления', sms: 'SMS-уведомления', marketing: 'Маркетинговые сообщения', language: 'Язык', save: 'Сохранить', saving: 'Сохранение...' },
    help: {
      q1: 'Сколько длится анализ?', a1: 'Около 1 минуты (симуляция обработки ИИ).',
      q2: 'Какие изображения загружать?', a2: 'Чёткие фото поверхности почвы и небольшого профиля.',
      q3: 'Можно ли редактировать профиль?', a3: 'Да, через Кабинет → Профиль.',
    },
    tech: { title: 'Современные агротехологии', subtitle: 'Точно контролируйте поля и теплицы с IoT', tabs: { sensors: 'Сенсоры', services: 'Сервисы', pricing: 'Тарифы', faq: 'FAQ' } },
    products: { details: 'Подробнее', order: 'Заказать', more: 'Подробнее' },
    sensor: { specs: 'Технические характеристики:', noData: 'Данные не найдены' },
    order: {
      title: 'Оформление заказа', placed: 'Заказ оформлен', product: 'Продукт',
      fullName: 'Полное имя', phone: 'Телефон', region: 'Регион', quantity: 'Количество', address: 'Адрес',
      cancel: 'Отмена', submit: 'Заказать', submitting: 'Отправка...', close: 'Закрыть', success: 'Ваш заказ принят. Мы скоро свяжемся с вами.'
    },
    premium: { header: 'Премиум', features: 'Премиум возможности', benefits: 'Что даёт Премиум?', plans: 'Тарифы', choose: 'Выбрать' },
    checkout: { header: 'Оплата', details: 'Платёжные данные', planDetails: 'Детали плана', pay: 'Оплатить', activate: 'Активировать' },
    payment: { successTitle: 'Оплата выполнена', successMsg: 'Подписка активирована. Спасибо!' },
  },
  en: {
    nav: { technologies: 'Technologies', help: 'Help', new: 'New Analysis', dashboard: 'Dashboard', logout: 'Logout', login: 'Login', signup: 'Sign Up' },
    home: {
      title: 'EcoSoil',
      subtitle: 'AI-powered soil analysis for smarter, sustainable farming.',
      desc: 'Upload soil data and photos for pH, salinity, moisture and actionable recommendations.',
      ctaPrimaryAuth: 'Start New Analysis',
      ctaPrimaryGuest: 'Get Started',
      ctaSecondary: 'Explore IoT Sensors',
      cards: {
        accurate: { title: 'Accurate Insights', desc: 'AI-generated metrics and advice.' },
        iot: { title: 'IoT Ready', desc: 'Integrates with modern agri sensors.' },
        friendly: { title: 'Farmer Friendly', desc: 'Simple workflow and clear reports.' },
      }
    },
    auth: {
      loginTitle: 'Welcome back', email: 'Email', password: 'Password', signIn: 'Sign In', noAccount: 'No account?', createOne: 'Create one',
      registerTitle: 'Create your account', fullName: 'Full Name', signUp: 'Sign Up', already: 'Already have an account?', signInLink: 'Sign in',
    },
    analysisForm: {
      title: 'New Soil Analysis', steps: ['General Info', 'Additional Info', 'Images'],
      location: 'Location', area: 'Area (hectares)', soilType: 'Soil Type', cropType: 'Crop Type', lastHarvestDate: 'Last Harvest Date',
      irrigationMethod: 'Irrigation Method', observations: 'Observed Symptoms', upload: 'Upload Images (max 5)',
      back: 'Back', next: 'Next', submit: 'Submit', submitting: 'Submitting...', onlyImages: 'Only image files are allowed (max 5).'
    },
    processing: { title: 'Processing Analysis...', subtitle: 'AI analysis takes about 1 minute.' },
    report: { title: 'Detailed Report', back: 'Back', share: 'Share', pdf: 'Download PDF', copied: 'Link copied' },
    detailed: {
      tabs: ['Overview', 'Composition', 'Recommendations', 'AI Analysis', 'History'],
      locationTitle: 'Location Info', weatherTitle: 'Weather', address: 'Address', area: 'Area', altitude: 'Altitude', coords: 'Coordinates',
      salinityTitle: 'Salinity Analysis', affected: 'Affected area', salinityLevel: 'Salinity level', risk: 'Risk level',
      healthScore: 'Soil Health Score', aiConfidence: 'AI Confidence', phLevel: 'pH level', moisture: 'Moisture',
      temperature: 'Temperature', wind: 'Wind', humidity: 'Humidity', windUnit: 'km/h',
    },
    weather: { sunny: 'Sunny', rainy: 'Rainy', cloudy: 'Cloudy', partly: 'Partly cloudy' },
    composition: { title: 'Soil composition', chemicalTitle: 'Chemical properties', element: 'Element', amount: 'Amount', status: 'Status', none: 'No chemical data', sand: 'Sand', clay: 'Clay', silt: 'Silt' },
    history: { title: 'Salinity dynamics', subtitle: 'Last 4 months changes', none: 'No history found' },
    share: { title: 'Share report', enable: 'Enable sharing', enabled: 'Sharing enabled', disable: 'Disable', link: 'Share link', copy: 'Copy link', note: 'Anyone with the link can view this report.' },
    results: { done: 'Analysis Completed!', summary: 'Summary', recommendations: 'Recommendations', detail: 'Detailed Report', new: 'New Analysis', pdf: 'Download PDF', share: 'Share' },
    dashboard: { tabs: ['Profile', 'History', 'Settings', 'Privacy'], farmer: 'Farmer', loadError: 'Failed to load dashboard data' },
    profile: { title: 'Profile Information', email: 'Email', phone: 'Phone Number', region: 'Select your region', bio: 'Bio', save: 'Save', saving: 'Saving...', saved: 'Profile updated', fullName: 'Full Name' },
    settings: { saved: 'Settings saved', email: 'Email notifications', sms: 'SMS notifications', marketing: 'Marketing messages', language: 'Language', save: 'Save', saving: 'Saving...' },
    help: {
      q1: 'How long does analysis take?', a1: 'About 1 minute (we simulate AI processing).',
      q2: 'What images should I upload?', a2: 'Clear photos of the soil surface and a small dug profile.',
      q3: 'Can I edit my profile?', a3: 'Yes, via Dashboard → Profile.',
    },
    tech: { title: 'Modern Agri Technologies', subtitle: 'Monitor fields and greenhouses with IoT', tabs: { sensors: 'Sensors', services: 'Services', pricing: 'Pricing', faq: 'FAQ' } },
    products: { details: 'Details', order: 'Order', more: 'Learn more' },
    sensor: { specs: 'Technical specifications:', noData: 'No data found' },
    order: {
      title: 'Place Order', placed: 'Order Placed', product: 'Product', fullName: 'Full Name', phone: 'Phone', region: 'Region', quantity: 'Quantity', address: 'Address',
      cancel: 'Cancel', submit: 'Place Order', submitting: 'Submitting...', close: 'Close', success: 'Your order has been received. We will contact you soon.'
    },
    premium: { header: 'Premium', features: 'Premium Features', benefits: 'What you get with Premium', plans: 'Plans', choose: 'Choose' },
    checkout: { header: 'Checkout', details: 'Payment details', planDetails: 'Plan details', pay: 'Pay', activate: 'Activate' },
    payment: { successTitle: 'Payment Successful', successMsg: 'Subscription activated. Thank you!' },
  }
}

export const useI18n = create((set, get) => ({
  locale: (typeof localStorage !== 'undefined' && localStorage.getItem('locale')) || 'uz',
  setLocale: (loc) => { try { localStorage.setItem('locale', loc) } catch {} set({ locale: loc }) },
  t: (key) => {
    const loc = get().locale
    const dict = translations[loc] || translations.uz
    const parts = String(key).split('.')
    let cur = dict
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
      else return key
    }
    return (cur !== undefined && cur !== null) ? cur : key
  },
}))
