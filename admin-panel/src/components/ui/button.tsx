import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-medium transition-all outline-none select-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 gap-2",
  {
    variants: {
      variant: {
        default: 
          "bg-indigo-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.4)] border border-indigo-700 hover:bg-indigo-500",
        secondary:
          "bg-zinc-800 text-zinc-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_2px_rgba(0,0,0,0.4)] border border-zinc-700 hover:bg-zinc-700",
        destructive:
          "bg-red-600 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_1px_2px_rgba(0,0,0,0.4)] border border-red-700 hover:bg-red-500",
        outline:
          "border border-zinc-700 bg-transparent text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 shadow-sm",
        ghost:
          "text-zinc-300 hover:bg-zinc-800/80 hover:text-zinc-100",
        link: "text-indigo-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 rounded-lg text-sm [&_svg]:size-4",
        sm: "h-8 px-3 rounded-md text-xs [&_svg]:size-3.5",
        icon: "size-9 rounded-lg [&_svg]:size-4",
        "icon-sm": "size-8 rounded-md [&_svg]:size-3.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
