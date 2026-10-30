import type { Lang } from './lang'

const ar = {
  appName: 'بدأت إزاي؟',
  tagline:
    'قصص حقيقية عن بدايات أصحاب المشاريع: كان معاهم كام، جابوه منين، وأخدوا قد إيه لحد أول مكسب.',
  comingSoon: 'القصص جاية قريب.',
  loading: 'بنحمّل القصص...',
  loadError: 'مقدرناش نحمّل القصص. اتأكد من النت وجرب تاني.',
  retry: 'جرب تاني',
  anonymous: 'بدون اسم',
  sample: 'قصة تجريبية (مش حقيقية)',
  startedWith: 'فلوس البداية',
  firstRevenue: 'أول إيراد بعد',
  listSeparator: '، ',
  /** Egyptian Arabic counting: شهر، شهرين، 3 شهور، 11 شهر */
  months: (n: number): string => {
    if (n === 0) return 'أقل من شهر'
    if (n === 1) return 'شهر'
    if (n === 2) return 'شهرين'
    if (n <= 10) return `${n} شهور`
    return `${n} شهر`
  },
  switchTo: 'English',
  notFound: 'الصفحة دي مش موجودة.',
  backHome: 'ارجع للرئيسية',
}

const en: typeof ar = {
  appName: 'How I Started',
  tagline:
    'Real stories of how founders started: how much money they had, where it came from, and how long it took to make the first revenue.',
  comingSoon: 'Stories are coming soon.',
  loading: 'Loading stories...',
  loadError: 'Could not load the stories. Check your connection and try again.',
  retry: 'Try again',
  anonymous: 'Anonymous founder',
  sample: 'Sample (fictional)',
  startedWith: 'Starting money',
  firstRevenue: 'First revenue after',
  listSeparator: ', ',
  months: (n: number): string => {
    if (n === 0) return 'less than a month'
    return n === 1 ? '1 month' : `${n} months`
  },
  switchTo: 'عربي',
  notFound: 'This page does not exist.',
  backHome: 'Back to home',
}

export type Dictionary = typeof ar
export const dictionaries: Record<Lang, Dictionary> = { ar, en }
