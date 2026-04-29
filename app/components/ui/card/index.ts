import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Card } from "./Card.vue"
export { default as CardAction } from "./CardAction.vue"
export { default as CardContent } from "./CardContent.vue"
export { default as CardDescription } from "./CardDescription.vue"
export { default as CardFooter } from "./CardFooter.vue"
export { default as CardHeader } from "./CardHeader.vue"
export { default as CardTitle } from "./CardTitle.vue"

export const cardVariants = cva(
  "flex flex-col gap-2 rounded-xl border py-6 shadow-sm",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        glass:
          "border-white/20 bg-white/10 text-white backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export type CardVariants = VariantProps<typeof cardVariants>
