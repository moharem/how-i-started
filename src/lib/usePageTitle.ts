import { useEffect } from 'react'
import { useLang } from '../i18n/LangContext'

/**
 * Sets the browser tab title: the given title, or the app name in the interface
 * language. Each page calls this, so the title also follows a language switch.
 */
export function usePageTitle(title?: string) {
  const { t } = useLang()
  useEffect(() => {
    document.title = title ?? t.appName
  }, [title, t])
}
