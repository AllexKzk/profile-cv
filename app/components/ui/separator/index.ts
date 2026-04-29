import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Separator } from "./Separator.vue"

export const separatorVariants = cva(
  "shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
  {
    variants: {
      variant: {
        default: "bg-border",
        glass: "bg-white/20 dark:bg-white/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type SeparatorVariants = VariantProps<typeof separatorVariants>
