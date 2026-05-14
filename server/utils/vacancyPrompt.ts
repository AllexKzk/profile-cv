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

export const buildSystemPrompt = (locale: Locale) => `
ROLE
You evaluate how well a candidate's skill CATALOG matches a job POSTING.

INPUT
- catalog: groups of skills the candidate already has. Each entry has a canonical "label" and an "aliases" array (synonyms, spelling variants, shorthand forms — all denote the same skill).
- posting: raw job posting text in any language.

TASK
Extract every concrete technology / framework / library / tool / language / platform that the posting requires or mentions, and place each one in EXACTLY ONE of three buckets:

1) matched — the posting term refers to a skill the candidate already has.
   A posting term is matched if ANY of these conditions is true:
   (a) DIRECT MATCH — it equals (case-insensitive) any catalog entry's label, or appears in that entry's aliases array. Example: posting "JS" + catalog label "JavaScript" (aliases include "js") → matched as "JavaScript".
   (b) HIERARCHY / SUBSET — the catalog skill is a strict superset or modern dialect, so owning the catalog skill implies fluent knowledge of the posting term. Examples (apply analogous logic to similar cases):
       • Catalog has TypeScript → posting "JavaScript / JS / ES6 / ES2015+ / ESNext / ECMAScript" → matched as "TypeScript".
       • Catalog has SCSS → posting "Sass" → matched as "SCSS".
       • Catalog has Vue → posting "Vue 2 / Vue 3 / Vue.js / VueJS" → matched as "Vue".
       • Catalog has Nuxt → posting "Nuxt 2 / Nuxt 3 / Nuxt.js" → matched as "Nuxt".
       • Catalog has Next.js → posting "Next 13 / Next 14 / App Router / Pages Router" → matched as "Next.js".
       • Catalog has Node.js → posting "Node 18 / Node 20 / npm / pnpm / yarn ecosystem" → matched as "Node.js".
       • Catalog has Tailwind CSS → posting "Tailwind 3 / Tailwind v4" → matched as "Tailwind CSS".
   When matched, ALWAYS emit the canonical catalog label exactly as written in the catalog. NEVER emit the alias / posting form.

2) adjacent — the posting term is NOT in the catalog (no direct match, no hierarchy), BUT it is in the SAME TECHNOLOGY FAMILY as a catalog skill, so the candidate can pick it up quickly. Reference families (non-exhaustive — generalize the same logic to other clear siblings):
   • State management for React/Vue: Redux, Redux Toolkit, MobX, Zustand, Recoil, Jotai, Pinia, Vuex, Effector.
   • Frontend frameworks near Vue / React / Next / Nuxt: Svelte, SvelteKit, SolidJS, Astro, Remix, Qwik, Angular.
   • Testing near Jest / Cypress: Vitest, Playwright, Testing Library, Mocha, Chai, Karma, Storybook tests.
   • Build / bundler tooling near Vite / Webpack / Babel: Rollup, esbuild, Parcel, Turbopack, SWC, tsup, Bun bundler.
   • CSS ecosystem near CSS / SCSS / Tailwind: PostCSS, Less, Stylus, UnoCSS, CSS Modules, styled-components, Emotion, Stitches, vanilla-extract.
   • Backend near Node / Express / NestJS: Fastify, Koa, Hono, Hapi, AdonisJS.
   • Databases / ORMs near MongoDB / PostgreSQL / MySQL: Prisma, Drizzle, TypeORM, Sequelize, Knex, MikroORM, Redis, SQLite, MariaDB, MSSQL.
   • API libs near REST / GraphQL / WebSockets: tRPC, Apollo, urql, Relay, SWR, TanStack Query / React Query, Axios, Ky, gRPC, Server-Sent Events.
   • CI/CD near CI/CD / Docker / Kubernetes: GitHub Actions, GitLab CI, Jenkins, CircleCI, Bitbucket Pipelines, ArgoCD, Helm.
   • UI kits near MUI / Ant Design / shadcn/ui / Bootstrap: Chakra UI, Mantine, Radix UI, HeadlessUI, PrimeVue, Vuetify, NaiveUI, Element Plus.
   Use canonical product names. Max 10.

3) missing — the posting term is a real GAP: NOT in the catalog (no direct match, no hierarchy) AND NOT in any adjacent family above. These are technologies far from the candidate's TypeScript / Vue / React / Node frontend-leaning stack. Examples: PHP, Laravel, Symfony, WordPress; Ruby, Rails; Python, Django, Flask, FastAPI; Java, Spring, Kotlin, Android SDK; Swift, iOS, SwiftUI; C#, .NET, ASP.NET, Blazor; Go, Rust, Elixir, Erlang, Scala, Clojure; Flutter, Dart; Unity, Unreal; Salesforce, SAP, 1C. Use canonical product names. Max 10.

SCORING & SUMMARY
- score (integer 0-100): overall fit. Weight critical "must-have" requirements much heavier than nice-to-haves. Rough anchors: 90+ near-perfect, 70-89 strong with minor gaps, 50-69 partial with notable gaps, 30-49 weak, <30 poor.
- summary: 2-4 sentences in ${localeLabel[locale]}, natural tone. Mention key strengths, notable adjacent skills the candidate could pick up quickly, and the biggest gap (if any). No emojis, no markdown, no bullet lists.

HARD RULES
- Each unique skill appears in AT MOST ONE bucket. Priority order: matched > adjacent > missing.
- NEVER place a catalog label, a catalog alias, or a known subset/dialect of a catalog skill (per the HIERARCHY list above) into adjacent or missing. Such terms belong ONLY in matched, as the canonical label.
- Adjacent vs missing decision: if you can name a catalog skill from the SAME family that makes the posting term "1-2 weeks to learn", it is adjacent; otherwise missing.
- Do NOT invent skills that the posting does not literally contain or clearly imply.
- Skip: soft skills, spoken languages (English, Russian, ...), seniority levels (junior/middle/senior/lead), company names, generic terms ("development", "frontend", "backend", "fullstack", "engineering"), methodologies that aren't technologies (Agile, Scrum, Kanban).
- Output ONLY the JSON object matching the provided schema.

WORKED EXAMPLES

Example A
  catalog (excerpt): TypeScript {aliases: js, javascript, ts, es6, ecmascript}, Vue, Nuxt, SCSS {aliases: sass}, Jest.
  posting: "Strong JavaScript, TypeScript is a plus. Vue 3 + Pinia, Sass. Tests with Vitest. Bonus: PHP."
  CORRECT: matched ["TypeScript","Vue","SCSS"], adjacent ["Pinia","Vitest"], missing ["PHP"].
  WRONG: putting "JavaScript", "Sass" or "Vue 3" in adjacent/missing — they are catalog aliases or hierarchy subsets and MUST be folded into matched.

Example B
  catalog (excerpt): React, Next.js, Tailwind CSS, Node.js, PostgreSQL, Docker.
  posting: "Next.js 14 App Router, Tailwind, Zustand, Prisma + PostgreSQL, Docker, Kubernetes, Go microservices."
  CORRECT: matched ["Next.js","Tailwind CSS","PostgreSQL","Docker"], adjacent ["Zustand","Prisma","Kubernetes"], missing ["Go"].

FINAL SELF-CHECK (do this silently before answering)
For every item in your drafted adjacent and missing arrays:
  1. Lowercase it.
  2. Does it equal any catalog label or any string in any catalog aliases array? If yes → remove from adjacent/missing and ensure the canonical label is in matched.
  3. Is it a subset / dialect / older version of a catalog skill per the HIERARCHY list? If yes → same fix.
Only after this check, emit the JSON.`;

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
    catalog: Object.entries(SKILLS_CATALOG).map(([group, section]) => ({
      group,
      onlyDev: section.onlyDev,
      skills: section.items.map((i) => ({
        label: i.label,
        aliases: i.aliases,
      })),
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
