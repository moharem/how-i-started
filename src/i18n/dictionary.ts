import type { StoryQuestion } from '../data/story'
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
  allStories: 'كل القصص',
  loadingStory: 'بنحمّل القصة...',
  storyLoadError: 'مقدرناش نحمّل القصة. اتأكد من النت وجرب تاني.',
  storyNotFound: 'القصة دي مش موجودة أو لسه متنشرتش.',
  startingPoint: 'نقطة البداية',
  moneySource: 'الفلوس جت منين',
  yearStarted: 'سنة البداية',
  workMode: 'اشتغل عليه',
  keptJob: 'فضل في شغله؟',
  yes: 'أيوه',
  no: 'لأ',
  teamAtStart: 'الفريق في البداية',
  firstProfit: 'أول مكسب بعد',
  profitNotYet: 'لسه',
  profitNever: 'موصلش للمكسب',
  industry: 'المجال',
  location: 'المكان',
  outsideEgypt: 'برّه مصر',
  egp: (amount: string): string => `${amount} جنيه`,
  today: 'النهارده',
  outcome: 'الوضع',
  teamNow: 'الفريق دلوقتي',
  stageNow: 'وصل لفين',
  /** Egyptian Arabic counting: فرد واحد، فردين، 3 أفراد، 11 فرد */
  people: (n: number): string => {
    if (n === 0) return 'ولا حد'
    if (n === 1) return 'فرد واحد'
    if (n === 2) return 'فردين'
    if (n <= 10) return `${n} أفراد`
    return `${n} فرد`
  },
  questions: {
    q_had: 'كان معاك إيه لما بدأت (فلوس، مهارات، معارف)؟',
    q_first_spend: 'صرفت أول فلوس على إيه؟',
    q_hardest: 'إيه أصعب لحظة في أول سنة؟',
    q_first_customer: 'جبت أول زبون إزاي؟',
    q_advice: 'تقول إيه لحد بيبدأ بفلوس قليلة؟',
  } satisfies Record<StoryQuestion, string>,
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
  allStories: 'All stories',
  loadingStory: 'Loading the story...',
  storyLoadError: 'Could not load the story. Check your connection and try again.',
  storyNotFound: 'This story does not exist or is not published.',
  startingPoint: 'Starting point',
  moneySource: 'Money came from',
  yearStarted: 'Year started',
  workMode: 'Worked on it',
  keptJob: 'Kept their job?',
  yes: 'Yes',
  no: 'No',
  teamAtStart: 'Team at the start',
  firstProfit: 'First profit after',
  profitNotYet: 'Not yet',
  profitNever: 'Never reached',
  industry: 'Industry',
  location: 'Location',
  outsideEgypt: 'Outside Egypt',
  egp: (amount: string): string => `${amount} EGP`,
  today: 'Today',
  outcome: 'Status',
  teamNow: 'Team now',
  stageNow: 'Where it is now',
  people: (n: number): string => {
    if (n === 0) return 'nobody'
    return n === 1 ? '1 person' : `${n} people`
  },
  questions: {
    q_had: 'What did you have when you started (money, skills, contacts)?',
    q_first_spend: 'What did you spend the first money on?',
    q_hardest: 'What was the hardest moment in the first year?',
    q_first_customer: 'How did you get your first customer?',
    q_advice: 'What would you tell someone starting with little money?',
  },
}

export type Dictionary = typeof ar
export const dictionaries: Record<Lang, Dictionary> = { ar, en }
