import { SKILLS_CATALOG, CATALOG_LABELS } from "~~/shared/skills-catalog";

export const SUPPORTED_LOCALES = ["en", "ru"] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

export interface ParsedResult {
  matched: string[];
  adjacent: string[];
  missing: string[];
  score: number;
  summary: string;
}

const localeLabel: Record<Locale, string> = {
  en: "English",
  ru: "Russian",
};

export const buildSystemPrompt = (
  locale: Locale,
) => `You assess how well a candidate's skill catalog matches a job posting.
You receive:
  1. CATALOG — skills the candidate already has, grouped by category, each with a label and an aliases array.
  2. POSTING — the raw text of a job posting (any language).

Return a JSON object with these fields:
- "matched": labels FROM CATALOG that the posting requires or implies. Match a CATALOG entry whenever the posting text contains the label OR ANY of its aliases (case-insensitive, whole-word). The aliases list is authoritative — every wording variant listed there is considered the same skill. Always emit the canonical CATALOG label, never the alias form.
- "adjacent": technologies/tools/libraries the posting requires that are NOT covered by any CATALOG entry's label or aliases, but are CLOSELY RELATED to the candidate's stack and quick to pick up (e.g. Redux/Pinia/Zustand alongside React/Vue; Vitest/Jest alongside TypeScript; tRPC/GraphQL alongside Next.js/Nuxt). Use canonical names. Max 10.
- "missing": technologies the posting requires that are NEITHER covered by CATALOG (label or alias) NOR adjacent to the candidate's stack — true gaps (e.g. Java, Spring, Kotlin, Kubernetes for a frontend-only candidate). Use canonical names. Max 10.
- "score": integer 0-100 = overall fit. Weight critical requirements heavier than nice-to-haves. Rough anchors: 90+ near-perfect fit, 70-89 strong with minor gaps, 50-69 partial with notable gaps, 30-49 weak, <30 poor.
- "summary": 2 to 4 sentences in ${localeLabel[locale]} describing the fit. Mention key strengths, notable adjacent skills, and the biggest gap (if any). Natural tone, no emojis, no markdown, no lists.

Hard rules:
- A skill appears in AT MOST ONE of matched/adjacent/missing.
- ALIAS RULE (most important): every string listed in any CATALOG entry's "aliases" array is treated as THE SAME skill as the canonical label. The mention is fully accounted for by emitting the canonical label in "matched". NEVER place the alias string — or any other synonym from the same aliases array — into "adjacent" or "missing". Adjacent/missing only contain skills that are NOT present in any catalog entry's label OR aliases.
- SUBSET RULE: if a posting term is a subset, dialect, or older flavor of a matched skill, it does NOT belong in missing or adjacent. Examples (non-exhaustive): JavaScript / JS / ES6 / ECMAScript when TypeScript is matched; SCSS when SASS is matched; Vue / Vue.js / VueJS when Vue 3 is matched; React / React.js / ReactJS when React 18 is matched; Nuxt / Nuxt.js / NuxtJS when Nuxt 3 is matched.
- Never invent skills that are not literally in the posting (or clearly implied by it).
- Skip soft skills, spoken languages (English, Russian, etc.), seniority levels, company names, and generic words ("development", "frontend", "backend").
- Output ONLY the JSON object matching the provided schema.

Worked example:
  CATALOG contains: { label: "TypeScript", aliases: ["typescript", "ts", "javascript", "js", "es6", "ecmascript"] }.
  POSTING says: "Strong JavaScript skills, TypeScript a plus, experience with Redux".
  CORRECT output: matched: ["TypeScript"], adjacent: ["Redux"], missing: [].
  WRONG (do not do this): matched: ["TypeScript"], adjacent: ["JavaScript", "Redux"] — "JavaScript" is in TypeScript's aliases, so it MUST NOT appear in adjacent.

FINAL CHECK before responding: iterate through your drafted "adjacent" and "missing" arrays. For each item, lowercase it and check: does this exact string appear (case-insensitive) in ANY CATALOG entry's label or aliases? If yes — DELETE that item from adjacent/missing and make sure the canonical label is present in "matched". Only then emit the JSON.`;

export const responseSchema = {
  type: "object",
  additionalProperties: false,
  required: ["matched", "adjacent", "missing", "score", "summary"],
  properties: {
    matched: {
      type: "array",
      items: { type: "string", enum: CATALOG_LABELS },
    },
    adjacent: {
      type: "array",
      maxItems: 10,
      items: { type: "string" },
    },
    missing: {
      type: "array",
      maxItems: 10,
      items: { type: "string" },
    },
    score: {
      type: "integer",
      minimum: 0,
      maximum: 100,
    },
    summary: {
      type: "string",
      maxLength: 700,
    },
  },
} as const;

export const buildUserPayload = (posting: string) =>
  JSON.stringify({
    catalog: SKILLS_CATALOG.map((g) => ({
      group: g.titleKey,
      skills: g.items.map((i) => ({ label: i.label, aliases: i.aliases })),
    })),
    posting,
  });

export const normalizeLocale = (value: unknown): Locale => {
  if (typeof value !== "string") return "en";
  const short = value.toLowerCase().split("-")[0] ?? "";
  return (SUPPORTED_LOCALES as readonly string[]).includes(short)
    ? (short as Locale)
    : "en";
};
