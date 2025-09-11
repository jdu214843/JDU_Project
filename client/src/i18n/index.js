import { create } from 'zustand'

const dict = {
  uz: {
    nav: { technologies: 'Texnologiyalar', help: 'Yordam', new: 'Yangi tahlil', dashboard: 'Kabinet', logout: 'Chiqish', login: 'Kirish', signup: 'Ro‘yxatdan o‘tish' },
    processing: { title: 'Tahlil bajarilmoqda...', subtitle: 'AI tahlili ~1 daqiqa vaqt oladi.' },
    report: { title: 'Batafsil hisobot', back: 'Orqaga', share: 'Ulashish', pdf: 'PDF yuklab olish', copied: 'Link nusxa olindi' },
    share: { title: 'Hisobotni ulashish', enable: 'Ulashishni yoqish', enabled: 'Ulashish yoqilgan', disable: 'O‘chirish', link: 'Ulashish linki', copy: 'Linkni nusxalash', note: 'Linkga ega bo‘lgan istalgan kishi hisobotni ko‘ra oladi.' },
  },
  ru: {
    nav: { technologies: 'Технологии', help: 'Помощь', new: 'Новый анализ', dashboard: 'Кабинет', logout: 'Выйти', login: 'Войти', signup: 'Регистрация' },
    processing: { title: 'Анализ выполняется...', subtitle: 'AI анализ займет около 1 минуты.' },
    report: { title: 'Детальный отчет', back: 'Назад', share: 'Поделиться', pdf: 'Скачать PDF', copied: 'Ссылка скопирована' },
    share: { title: 'Поделиться отчетом', enable: 'Включить доступ', enabled: 'Доступ включен', disable: 'Выключить', link: 'Ссылка для доступа', copy: 'Скопировать ссылку', note: 'Любой, у кого есть ссылка, сможет просмотреть отчет.' },
  },
  en: {
    nav: { technologies: 'Technologies', help: 'Help', new: 'New Analysis', dashboard: 'Dashboard', logout: 'Logout', login: 'Login', signup: 'Sign Up' },
    processing: { title: 'Processing Analysis...', subtitle: 'AI analysis takes about 1 minute.' },
    report: { title: 'Detailed Report', back: 'Back', share: 'Share', pdf: 'Download PDF', copied: 'Link copied' },
    share: { title: 'Share report', enable: 'Enable sharing', enabled: 'Sharing enabled', disable: 'Disable', link: 'Share link', copy: 'Copy link', note: 'Anyone with the link can view this report.' },
  }
}

export const useI18n = create((set, get) => ({
  locale: 'uz',
  setLocale: (loc) => set({ locale: loc }),
  t: (key) => {
    const loc = get().locale
    const parts = String(key).split('.')
    let cur = dict[loc] || dict.uz
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) cur = cur[p]
      else return key
    }
    return typeof cur === 'string' ? cur : key
  },
}))
