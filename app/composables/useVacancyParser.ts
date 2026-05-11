import { ref } from 'vue'

export interface VacancyParseResult {
  matched: string[]
  adjacent: string[]
  missing: string[]
  score: number
  summary: string
  vacancyName: string
}

type Status = 'idle' | 'loading' | 'error' | 'success'

export const useVacancyParser = () => {
  const status = ref<Status>('idle')
  const error = ref<string | null>(null)

  const parse = async (file: File, locale = 'en'): Promise<VacancyParseResult | null> => {
    status.value = 'loading'
    error.value = null

    const fd = new FormData()
    fd.append('file', file)
    fd.append('locale', locale)

    try {
      const res = await $fetch<VacancyParseResult>('/api/vacancy/parse', {
        method: 'POST',
        body: fd,
      })
      status.value = 'success'
      return res
    }
    catch (e: unknown) {
      const message
        = (e as { data?: { statusMessage?: string }, statusMessage?: string })?.data?.statusMessage
          ?? (e as { statusMessage?: string })?.statusMessage
          ?? 'parse_failed'
      error.value = message
      status.value = 'error'
      return null
    }
  }

  const reset = () => {
    status.value = 'idle'
    error.value = null
  }

  return { status, error, parse, reset }
}
