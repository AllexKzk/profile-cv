import { computed, effectScope, watch } from 'vue'

export type Position = 'hr' | 'tech'

export interface Tuning {
  position: Position
  stack: string[]
  vacancyName?: string
}

export const TUNING_STORAGE_KEY = 'cv:tuning'

export const DEFAULT_TUNING: Tuning = {
  position: 'hr',
  stack: [],
}

const normalize = (raw: unknown): Tuning => {
  if (!raw || typeof raw !== 'object') {
    return { ...DEFAULT_TUNING }
  }
  const candidate = raw as Partial<Tuning>
  return {
    position: candidate.position === 'tech' ? 'tech' : 'hr',
    stack: Array.isArray(candidate.stack)
      ? candidate.stack.filter((s): s is string => typeof s === 'string')
      : [],
    vacancyName: typeof candidate.vacancyName === 'string' ? candidate.vacancyName : undefined,
  }
}

let bootstrapped = false

export const useTuning = () => {
  const tuning = useState<Tuning>(TUNING_STORAGE_KEY, () => ({ ...DEFAULT_TUNING }))

  if (import.meta.client && !bootstrapped) {
    bootstrapped = true
    onNuxtReady(() => {
      const scope = effectScope(true)
      scope.run(() => {
        try {
          const raw = window.localStorage.getItem(TUNING_STORAGE_KEY)
          if (raw) {
            tuning.value = normalize(JSON.parse(raw))
          }
        }
        catch {
          // corrupt storage — keep defaults
        }

        watch(
          tuning,
          (val) => {
            try {
              window.localStorage.setItem(TUNING_STORAGE_KEY, JSON.stringify(val))
            }
            catch {
              // quota / privacy mode — ignore
            }
          },
          { deep: true },
        )
      })
    })
  }

  const isHR = computed(() => tuning.value.position === 'hr')
  const isTech = computed(() => tuning.value.position === 'tech')

  const isHighlighted = (tags: string[]) => {
    if (!tuning.value.stack.length) return false
    const wanted = tuning.value.stack.map(s => s.toLowerCase())
    return tags.some(tag => wanted.includes(tag.toLowerCase()))
  }

  const reset = () => {
    tuning.value = { ...DEFAULT_TUNING }
  }

  return { tuning, isHR, isTech, isHighlighted, reset }
}
