import * as React from "react"
import { cn } from "@/lib/utils"

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  value: number
  min: number
  max: number
  unit?: string
  valueLabel?: string
}

export const RangeSlider = React.forwardRef<HTMLInputElement, RangeSliderProps>(
  ({ className, label, value, min, max, unit, valueLabel, ...props }, ref) => {
    // Calculate percentage for gradient background
    const percentage = ((value - min) / (max - min)) * 100

    return (
      <div className={cn("w-full space-y-4", className)}>
        <div className="flex justify-between items-end">
          <label className="text-xs font-bold uppercase tracking-widest text-[#1F1F1F]">
            {label}
          </label>
          <div className="text-right">
            <span className="text-2xl font-serif text-[#1F1F1F]">{value}</span>
            {unit && <span className="text-xs text-[#8A817C] ml-1 uppercase">{unit}</span>}
            {valueLabel && <span className="text-base font-serif text-[#1F1F1F] ml-2">{valueLabel}</span>}
          </div>
        </div>
        
        <div className="relative h-6 flex items-center">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            ref={ref}
            className="absolute w-full h-2 bg-[#EAE0D5] rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF4D8C]/20 z-10"
            style={{
              background: `linear-gradient(to right, #FF4D8C 0%, #FF4D8C ${percentage}%, #EAE0D5 ${percentage}%, #EAE0D5 100%)`
            }}
            {...props}
          />
          {/* Custom thumb style via CSS module or global css would be ideal, but inline styles for webkit-slider-thumb are tricky in React. 
              We'll rely on the standard styling but we need to ensure global css targets the range input to look like the design. 
           */}
           <div 
             className="absolute h-6 w-6 bg-[#FF4D8C] rounded-full border-4 border-white shadow-md pointer-events-none transition-all duration-75 ease-out"
             style={{ left: `calc(${percentage}% - 12px)` }}
           />
        </div>
      </div>
    )
  }
)
RangeSlider.displayName = "RangeSlider"
