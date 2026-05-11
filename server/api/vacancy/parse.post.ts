import { extractText, getDocumentProxy } from 'unpdf'
import { SKILLS_CATALOG, CATALOG_LABELS } from '~~/shared/skills-catalog'

const MAX_BYTES = 2 * 1024 * 1024
const MAX_CHARS = 12_000
const SUPPORTED_LOCALES = ['en', 'ru'] as const
type Locale = typeof SUPPORTED_LOCALES[number]

interface ParsedResult {
  matched: string[]
  adjacent: string[]
  missing: string[]
  score: number
  summary: string
}

interface OpenAIChatResponse {
  choices: Array<{ message: { content: string } }>
}

const localeLabel: Record<Locale, string> = {
  en: 'English',
  ru: 'Russian',
}

const buildSystemPrompt = (locale: Locale) => `You assess how well a candidate's skill catalog matches a job posting.
You receive:
  1. CATALOG — skills the candidate already has, grouped by category, each with aliases.
  2. POSTING — the raw text of a job posting (any language).

Return a JSON object with these fields:
- "matched": labels FROM CATALOG that the posting requires or implies (match label OR any alias, case-insensitive). These count as full hits.
- "adjacent": technologies/tools/libraries the posting requires that are NOT in CATALOG but are CLOSELY RELATED to the candidate's stack and quick to pick up (e.g. Redux/Pinia/Zustand for someone with React/Vue; Vitest/Jest for someone with TypeScript; tRPC/GraphQL for someone with Next.js/Nuxt). Use canonical names. Max 10.
- "missing": technologies the posting requires that are NEITHER in CATALOG NOR adjacent to the candidate's stack — true gaps (e.g. Java, Spring, Kotlin, Kubernetes for a frontend-only candidate). Use canonical names. Max 10.
- "score": integer 0-100 = overall fit. Weight critical requirements heavier than nice-to-haves. Rough anchors: 90+ near-perfect fit, 70-89 strong with minor gaps, 50-69 partial with notable gaps, 30-49 weak, <30 poor.
- "summary": ONE OR TWO short sentences in ${localeLabel[locale]} describing the fit. Mention key strengths and the biggest gap if any. No emojis, no markdown.

Hard rules:
- A skill appears in AT MOST ONE of matched/adjacent/missing.
- Never invent skills that are not literally in the posting (or clearly implied by it).
- Skip soft skills, spoken languages, seniority, company names, generic words ("development", "frontend").
- Output ONLY the JSON object matching the provided schema.`

const responseSchema = {
  type: 'object',
  additionalProperties: false,
  required: ['matched', 'adjacent', 'missing', 'score', 'summary'],
  properties: {
    matched: {
      type: 'array',
      items: { type: 'string', enum: CATALOG_LABELS },
    },
    adjacent: {
      type: 'array',
      maxItems: 10,
      items: { type: 'string' },
    },
    missing: {
      type: 'array',
      maxItems: 10,
      items: { type: 'string' },
    },
    score: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
    },
    summary: {
      type: 'string',
      maxLength: 400,
    },
  },
} as const

const dedupe = (arr: string[]) => {
  const seen = new Set<string>()
  const out: string[] = []
  for (const item of arr) {
    if (typeof item !== 'string' || !item.trim()) continue
    const key = item.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(item)
  }
  return out
}

const callLLM = async (posting: string, locale: Locale): Promise<ParsedResult> => {
  const config = useRuntimeConfig()
  if (!config.llmApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'llm_not_configured' })
  }

  const userPayload = JSON.stringify({
    catalog: SKILLS_CATALOG.map(g => ({
      group: g.titleKey,
      skills: g.items.map(i => ({ label: i.label, aliases: i.aliases })),
    })),
    posting,
  })

  const headers: Record<string, string> = {
    Authorization: `Bearer ${config.llmApiKey}`,
    'Content-Type': 'application/json',
  }
  if (config.llmReferer) headers['HTTP-Referer'] = config.llmReferer
  if (config.llmTitle) headers['X-Title'] = config.llmTitle

  let res: OpenAIChatResponse
  try {
    res = await $fetch<OpenAIChatResponse>(
      `${config.llmBaseUrl}/chat/completions`,
      {
        method: 'POST',
        headers,
        body: {
          model: config.llmModel,
          temperature: 0,
          response_format: {
            type: 'json_schema',
            json_schema: {
              name: 'vacancy_compatibility',
              strict: true,
              schema: responseSchema,
            },
          },
          messages: [
            { role: 'system', content: buildSystemPrompt(locale) },
            { role: 'user', content: userPayload },
          ],
        },
      },
    )
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'llm_unavailable' })
  }

  const content = res?.choices?.[0]?.message?.content
  if (!content) {
    throw createError({ statusCode: 502, statusMessage: 'llm_empty_response' })
  }

  let parsed: Partial<ParsedResult>
  try {
    parsed = JSON.parse(content) as Partial<ParsedResult>
  }
  catch {
    throw createError({ statusCode: 502, statusMessage: 'llm_invalid_json' })
  }

  const allowed = new Set(CATALOG_LABELS)
  const matched = dedupe(Array.isArray(parsed.matched) ? parsed.matched : []).filter(s => allowed.has(s))
  const matchedLower = new Set(matched.map(s => s.toLowerCase()))

  const adjacentRaw = dedupe(Array.isArray(parsed.adjacent) ? parsed.adjacent : [])
    .filter(s => !matchedLower.has(s.toLowerCase()))
  const adjacent = adjacentRaw.slice(0, 10)
  const adjacentLower = new Set(adjacent.map(s => s.toLowerCase()))

  const missing = dedupe(Array.isArray(parsed.missing) ? parsed.missing : [])
    .filter(s => !matchedLower.has(s.toLowerCase()) && !adjacentLower.has(s.toLowerCase()))
    .slice(0, 10)

  const scoreNum = typeof parsed.score === 'number' ? parsed.score : Number(parsed.score)
  const score = Number.isFinite(scoreNum)
    ? Math.max(0, Math.min(100, Math.round(scoreNum)))
    : 0

  const summary = typeof parsed.summary === 'string' ? parsed.summary.trim().slice(0, 400) : ''

  return { matched, adjacent, missing, score, summary }
}

type SourceKind = 'pdf' | 'text'

const detectKind = (filename: string | undefined, mime: string | undefined): SourceKind | null => {
  const name = (filename ?? '').toLowerCase()
  const type = (mime ?? '').toLowerCase()
  if (type === 'application/pdf' || name.endsWith('.pdf')) return 'pdf'
  if (
    type.startsWith('text/')
    || name.endsWith('.txt')
    || name.endsWith('.md')
    || name.endsWith('.markdown')
  ) return 'text'
  return null
}

const extractPdfText = async (data: Uint8Array): Promise<string> => {
  try {
    const pdf = await getDocumentProxy(data)
    const extracted = await extractText(pdf, { mergePages: true })
    return String(extracted.text ?? '')
  }
  catch {
    throw createError({ statusCode: 422, statusMessage: 'pdf_unreadable' })
  }
}

const extractPlainText = (data: Uint8Array): string => {
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(data)
  }
  catch {
    throw createError({ statusCode: 422, statusMessage: 'text_unreadable' })
  }
}

const normalizeLocale = (value: unknown): Locale => {
  if (typeof value !== 'string') return 'en'
  const short = value.toLowerCase().split('-')[0] ?? ''
  return (SUPPORTED_LOCALES as readonly string[]).includes(short) ? (short as Locale) : 'en'
}

export default defineEventHandler(async (event) => {
  const form = await readMultipartFormData(event)
  const file = form?.find(f => f.name === 'file')
  const localeField = form?.find(f => f.name === 'locale')
  const locale = normalizeLocale(localeField?.data?.toString('utf-8'))

  if (!file?.data) {
    throw createError({ statusCode: 400, statusMessage: 'no_file' })
  }
  if (file.data.byteLength > MAX_BYTES) {
    throw createError({ statusCode: 413, statusMessage: 'file_too_large' })
  }

  const kind = detectKind(file.filename, file.type)
  if (!kind) {
    throw createError({ statusCode: 400, statusMessage: 'unsupported_format' })
  }

  const bytes = new Uint8Array(file.data.buffer, file.data.byteOffset, file.data.byteLength)
  const rawText = kind === 'pdf'
    ? await extractPdfText(bytes)
    : extractPlainText(bytes)

  const trimmed = rawText.slice(0, MAX_CHARS).trim()
  if (!trimmed) {
    throw createError({ statusCode: 422, statusMessage: 'file_empty' })
  }

  const result = await callLLM(trimmed, locale)
  return {
    ...result,
    vacancyName: file.filename ?? `vacancy.${kind === 'pdf' ? 'pdf' : 'txt'}`,
  }
})
