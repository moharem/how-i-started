import { createContext, useContext } from 'react'
import { type Dictionary, dictionaries } from './dictionary'
import type { Lang } from './lang'

type LangValue = { lang: Lang; t: Dictionary }

export const LangContext = createContext<LangValue>({ lang: 'ar', t: dictionaries.ar })

export function useLang(): LangValue {
  return useContext(LangContext)
}
