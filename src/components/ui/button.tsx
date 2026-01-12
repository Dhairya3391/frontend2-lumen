import * as React from "react"
import { cn } from "@/lib/utils"

const buttonVariants = {
  default: "bg-[#FF4D8C] text-white hover:bg-[#E63D7A] shadow-lg shadow-pink-200 hover:shadow-pink-300",
  destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  outline: "border-2 border-[#EAE0D5] bg-transparent hover:bg-[#F9F6F2] text-[#1F1F1F]",
  secondary: "bg-[#F0EBE6] text-[#1F1F1F] hover:bg-[#E5DDD5]",
  ghost: "hover:bg-[#F0EBE6] text-[#8A817C] hover:text-[#1F1F1F]",
  link: "text-[#FF4D8C] underline-offset-4 hover:underline",
}

const buttonSizes = {
  default: "h-12 px-8 py-3 rounded-full text-base",
  sm: "h-10 rounded-full px-4 text-sm",
  lg: "h-14 rounded-full px-10 text-lg",
  icon: "h-12 w-12 rounded-full",
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = "button"
    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D8C] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
