import type { Lang } from './lang'

const ar = {
  appName: 'بدأت إزاي؟',
  tagline:
    'قصص حقيقية عن بدايات أصحاب المشاريع: كان معاهم كام، جابوه منين، وأخدوا قد إيه لحد أول مكسب.',
  comingSoon: 'القصص جاية قريب.',
  switchTo: 'English',
  notFound: 'الصفحة دي مش موجودة.',
  backHome: 'ارجع للرئيسية',
}

const en: typeof ar = {
  appName: 'How I Started',
  tagline:
    'Real stories of how founders started: how much money they had, where it came from, and how long it took to make the first revenue.',
  comingSoon: 'Stories are coming soon.',
  switchTo: 'عربي',
  notFound: 'This page does not exist.',
  backHome: 'Back to home',
}

export type Dictionary = typeof ar
export const dictionaries: Record<Lang, Dictionary> = { ar, en }
