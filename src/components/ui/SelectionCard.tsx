import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface SelectionCardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  selected: boolean
  onClick: () => void
  className?: string
}

export function SelectionCard({
  title,
  description,
  icon,
  selected,
  onClick,
  className,
}: SelectionCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-3xl p-6 transition-all duration-300 flex items-center gap-4 border-2 relative overflow-hidden",
        selected 
          ? "bg-white border-[#FF4D8C] shadow-lg shadow-pink-100" 
          : "bg-white border-transparent shadow-sm hover:border-[#EAE0D5]",
        className
      )}
    >
      {/* Icon Container */}
      {icon && (
        <div className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center transition-colors",
          selected ? "bg-[#FFF0F5] text-[#FF4D8C]" : "bg-[#F5F5F5] text-[#8A817C]"
        )}>
          {icon}
        </div>
      )}

      {/* Text Content */}
      <div className="flex-1 min-w-0">
        <h3 className={cn(
          "text-lg font-serif font-semibold mb-1 truncate",
          selected ? "text-[#1F1F1F]" : "text-[#4A4A4A]"
        )}>
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[#8A817C] leading-relaxed break-words">
            {description}
          </p>
        )}
      </div>

      {/* Radio Indicator */}
      <div className={cn(
        "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
        selected ? "border-[#FF4D8C] bg-[#FF4D8C]" : "border-[#E0E0E0]"
      )}>
        {selected && <div className="h-2.5 w-2.5 bg-white rounded-full" />}
      </div>
    </motion.div>
  )
}
