import { computed, effectScope, watch } from "vue";

export type Position = "hr" | "tech";

export interface Compatibility {
  score: number;
  summary: string;
  matched: string[];
  adjacent: string[];
  missing: string[];
}

export interface Tuning {
  position: Position;
  stack: string[];
  vacancyName?: string;
  compatibility?: Compatibility;
}

export const TUNING_STORAGE_KEY = "cv:tuning";

export const DEFAULT_TUNING: Tuning = {
  position: "hr",
  stack: [],
};

const toStringArray = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];

const normalizeCompatibility = (raw: unknown): Compatibility | undefined => {
  if (!raw || typeof raw !== "object") return undefined;
  const c = raw as Partial<Compatibility>;
  const score =
    typeof c.score === "number" && Number.isFinite(c.score)
      ? Math.max(0, Math.min(100, Math.round(c.score)))
      : undefined;
  if (score === undefined) return undefined;
  return {
    score,
    summary: typeof c.summary === "string" ? c.summary : "",
    matched: toStringArray(c.matched),
    adjacent: toStringArray(c.adjacent),
    missing: toStringArray(c.missing),
  };
};

const normalize = (raw: unknown): Tuning => {
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_TUNING };
  }
  const candidate = raw as Partial<Tuning>;
  return {
    position: candidate.position === "tech" ? "tech" : "hr",
    stack: toStringArray(candidate.stack),
    vacancyName:
      typeof candidate.vacancyName === "string"
        ? candidate.vacancyName
        : undefined,
    compatibility: normalizeCompatibility(candidate.compatibility),
  };
};

let bootstrapped = false;

export const useTuning = () => {
  const tuning = useState<Tuning>(TUNING_STORAGE_KEY, () => ({
    ...DEFAULT_TUNING,
  }));

  if (import.meta.client && !bootstrapped) {
    bootstrapped = true;
    onNuxtReady(() => {
      const scope = effectScope(true);
      scope.run(() => {
        try {
          const raw = window.localStorage.getItem(TUNING_STORAGE_KEY);
          if (raw) {
            tuning.value = normalize(JSON.parse(raw));
          }
        } catch {
          // corrupt storage — keep defaults
        }

        watch(
          tuning,
          (val) => {
            try {
              window.localStorage.setItem(
                TUNING_STORAGE_KEY,
                JSON.stringify(val),
              );
            } catch {
              // quota / privacy mode — ignore
            }
          },
          { deep: true },
        );
      });
    });
  }

  const isHR = computed(() => tuning.value.position === "hr");
  const isTech = computed(() => tuning.value.position === "tech");

  const isHighlighted = (tags: string[]) => {
    if (!tuning.value.stack.length) return false;
    const wanted = tuning.value.stack.map((s) => s.toLowerCase());
    return tags.some((tag) => wanted.includes(tag.toLowerCase()));
  };

  const isDisabled = (tags: string[]) => {
    if (!tuning.value.stack.length) return false;
    const wanted = tuning.value.stack.map((s) => s.toLowerCase());
    return !tags.some((tag) => wanted.includes(tag.toLowerCase()));
  };

  const reset = () => {
    tuning.value = { ...DEFAULT_TUNING };
  };

  return { tuning, isHR, isTech, isHighlighted, isDisabled, reset };
};
