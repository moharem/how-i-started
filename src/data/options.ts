// Fixed option lists. The keys must match the check constraints in
// supabase/migrations (see "Synced constants" in AGENTS.md).
import type { Lang } from '../i18n/lang'

type Labels<K extends string> = Record<K, Record<Lang, string>>

export const STORY_STATUSES = ['pending', 'published', 'unpublished'] as const
export type StoryStatus = (typeof STORY_STATUSES)[number]

export const LOCATION_TYPES = ['egypt', 'abroad'] as const
export type LocationType = (typeof LOCATION_TYPES)[number]

export const INDUSTRIES = {
  food: { ar: 'أكل ومشروبات', en: 'Food & drinks' },
  fashion: { ar: 'موضة وملابس', en: 'Fashion' },
  tech: { ar: 'تكنولوجيا', en: 'Tech' },
  services: { ar: 'خدمات', en: 'Services' },
  retail: { ar: 'تجارة وبيع', en: 'Retail' },
  education: { ar: 'تعليم', en: 'Education' },
  health_beauty: { ar: 'صحة وتجميل', en: 'Health & beauty' },
  crafts: { ar: 'حرف وهاند ميد', en: 'Crafts & handmade' },
  other: { ar: 'مجال تاني', en: 'Other' },
} satisfies Labels<string>
export type Industry = keyof typeof INDUSTRIES

export const GOVERNORATES = {
  cairo: { ar: 'القاهرة', en: 'Cairo' },
  giza: { ar: 'الجيزة', en: 'Giza' },
  alexandria: { ar: 'الإسكندرية', en: 'Alexandria' },
  qalyubia: { ar: 'القليوبية', en: 'Qalyubia' },
  sharqia: { ar: 'الشرقية', en: 'Sharqia' },
  dakahlia: { ar: 'الدقهلية', en: 'Dakahlia' },
  gharbia: { ar: 'الغربية', en: 'Gharbia' },
  monufia: { ar: 'المنوفية', en: 'Monufia' },
  beheira: { ar: 'البحيرة', en: 'Beheira' },
  kafr_el_sheikh: { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' },
  damietta: { ar: 'دمياط', en: 'Damietta' },
  port_said: { ar: 'بورسعيد', en: 'Port Said' },
  ismailia: { ar: 'الإسماعيلية', en: 'Ismailia' },
  suez: { ar: 'السويس', en: 'Suez' },
  faiyum: { ar: 'الفيوم', en: 'Faiyum' },
  beni_suef: { ar: 'بني سويف', en: 'Beni Suef' },
  minya: { ar: 'المنيا', en: 'Minya' },
  asyut: { ar: 'أسيوط', en: 'Asyut' },
  sohag: { ar: 'سوهاج', en: 'Sohag' },
  qena: { ar: 'قنا', en: 'Qena' },
  luxor: { ar: 'الأقصر', en: 'Luxor' },
  aswan: { ar: 'أسوان', en: 'Aswan' },
  red_sea: { ar: 'البحر الأحمر', en: 'Red Sea' },
  new_valley: { ar: 'الوادي الجديد', en: 'New Valley' },
  matrouh: { ar: 'مطروح', en: 'Matrouh' },
  north_sinai: { ar: 'شمال سيناء', en: 'North Sinai' },
  south_sinai: { ar: 'جنوب سيناء', en: 'South Sinai' },
} satisfies Labels<string>
export type Governorate = keyof typeof GOVERNORATES

export const CAPITAL_RANGES = {
  zero: { ar: 'من غير فلوس', en: 'No money' },
  under_10k: { ar: 'أقل من 10 آلاف جنيه', en: 'Under 10k EGP' },
  '10k_50k': { ar: 'من 10 لـ 50 ألف جنيه', en: '10k to 50k EGP' },
  '50k_200k': { ar: 'من 50 لـ 200 ألف جنيه', en: '50k to 200k EGP' },
  '200k_1m': { ar: 'من 200 ألف لمليون جنيه', en: '200k to 1M EGP' },
  '1m_plus': { ar: 'أكتر من مليون جنيه', en: 'Over 1M EGP' },
} satisfies Labels<string>
export type CapitalRange = keyof typeof CAPITAL_RANGES

export const MONEY_SOURCES = {
  savings: { ar: 'تحويشة', en: 'Savings' },
  family_friends: { ar: 'العيلة والأصحاب', en: 'Family & friends' },
  loan: { ar: 'قرض', en: 'Loan' },
  investor: { ar: 'مستثمر', en: 'Investor' },
  none: { ar: 'من غير فلوس', en: 'No money' },
  mixed: { ar: 'أكتر من مصدر', en: 'Mixed' },
} satisfies Labels<string>
export type MoneySource = keyof typeof MONEY_SOURCES

export const WORK_MODES = {
  full_time: { ar: 'متفرغ', en: 'Full-time' },
  side: { ar: 'جنب الشغل', en: 'Side project' },
} satisfies Labels<string>
export type WorkMode = keyof typeof WORK_MODES

export const OUTCOMES = {
  profitable: { ar: 'شغال وبيكسب', en: 'Running and profitable' },
  not_profitable_yet: { ar: 'شغال ولسه مكسبش', en: 'Running, not profitable yet' },
  pivoted: { ar: 'غيّر الفكرة', en: 'Pivoted' },
  closed: { ar: 'قفل', en: 'Closed' },
} satisfies Labels<string>
export type Outcome = keyof typeof OUTCOMES
