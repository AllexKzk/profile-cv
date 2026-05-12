import { extractText, getDocumentProxy } from 'unpdf'
import { CATALOG_LABELS, LABEL_BY_ALIAS } from '~~/shared/skills-catalog'
import {
  buildSystemPrompt,
  buildUserPayload,
  normalizeLocale,
  responseSchema,
  type Locale,
  type ParsedResult,
} from '~~/server/utils/vacancyPrompt'

const MAX_BYTES = 2 * 1024 * 1024
const MAX_CHARS = 12_000

interface OpenAIChatResponse {
  choices: Array<{ message: { content: string } }>
}

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
            { role: 'user', content: buildUserPayload(posting) },
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
  const rawMatched = dedupe(Array.isArray(parsed.matched) ? parsed.matched : []).filter(s => allowed.has(s))

  // Safety net: if the model put a known alias into adjacent/missing
  // (e.g. "JavaScript" while TypeScript is a catalog item),
  // pull it out and add the canonical label to matched instead.
  const rescuedFromAlias: string[] = []
  const stripAliases = (arr: string[]): string[] =>
    arr.filter((s) => {
      const canonical = LABEL_BY_ALIAS[s.toLowerCase()]
      if (canonical) {
        rescuedFromAlias.push(canonical)
        return false
      }
      return true
    })

  const adjacentDeduped = stripAliases(dedupe(Array.isArray(parsed.adjacent) ? parsed.adjacent : []))
  const missingDeduped = stripAliases(dedupe(Array.isArray(parsed.missing) ? parsed.missing : []))

  const matched = [...new Set([...rawMatched, ...rescuedFromAlias])]
  const matchedLower = new Set(matched.map(s => s.toLowerCase()))

  const adjacent = adjacentDeduped
    .filter(s => !matchedLower.has(s.toLowerCase()))
    .slice(0, 10)
  const adjacentLower = new Set(adjacent.map(s => s.toLowerCase()))

  const missing = missingDeduped
    .filter(s => !matchedLower.has(s.toLowerCase()) && !adjacentLower.has(s.toLowerCase()))
    .slice(0, 10)

  const scoreNum = typeof parsed.score === 'number' ? parsed.score : Number(parsed.score)
  const score = Number.isFinite(scoreNum)
    ? Math.max(0, Math.min(100, Math.round(scoreNum)))
    : 0

  const summary = typeof parsed.summary === 'string' ? parsed.summary.trim().slice(0, 700) : ''

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
