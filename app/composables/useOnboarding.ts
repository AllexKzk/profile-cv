import { effectScope, watch } from 'vue'

export const ONBOARDING_STORAGE_KEY = 'cv:onboarded'

let bootstrapped = false

export const useOnboarding = () => {
  const onboarded = useState<boolean>(ONBOARDING_STORAGE_KEY, () => true)
  const open = useState<boolean>('cv:onboarding:open', () => false)
  // false until client reads localStorage — used to keep curtain up
  const ready = useState<boolean>('cv:onboarding:ready', () => false)

  if (import.meta.client && !bootstrapped) {
    bootstrapped = true
    onNuxtReady(() => {
      const scope = effectScope(true)
      scope.run(() => {
        try {
          const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY)
          const flag = raw === 'true'
          onboarded.value = flag
          if (!flag) {
            open.value = true
          }
        }
        catch {
          // ignore
        }

        ready.value = true

        watch(onboarded, (val) => {
          try {
            window.localStorage.setItem(ONBOARDING_STORAGE_KEY, String(val))
          }
          catch {
            // ignore
          }
        })
      })
    })
  }

  const finish = () => {
    onboarded.value = true
    open.value = false
  }

  const reopen = () => {
    open.value = true
  }

  return { onboarded, open, ready, finish, reopen }
}
