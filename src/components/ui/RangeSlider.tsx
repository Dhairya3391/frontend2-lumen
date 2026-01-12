import * as React from "react";
import { cn } from "@/lib/utils";

interface RangeSliderProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  value: number;
  min: number;
  max: number;
  unit?: string;
  valueLabel?: string;
  description?: string;
}

export const RangeSlider = React.forwardRef<HTMLInputElement, RangeSliderProps>(
  (
    {
      className,
      label,
      value,
      min,
      max,
      unit,
      valueLabel,
      description,
      ...props
    },
    ref,
  ) => {
    // Calculate percentage for gradient background
    const percentage = Math.min(
      Math.max(((value - min) / (max - min)) * 100, 0),
      100,
    );

    return (
      <div className={cn("w-full space-y-3", className)}>
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <label className="text-sm font-bold text-[#1F1F1F]">{label}</label>
            {description && (
              <span className="text-xs text-[#8A817C] mt-0.5 max-w-[200px] leading-tight">
                {description}
              </span>
            )}
          </div>
          <div className="text-right">
            <span className="text-2xl font-serif text-[#1F1F1F] font-medium">
              {value}
            </span>
            {unit && (
              <span className="text-xs text-[#8A817C] ml-1 uppercase font-bold">
                {unit}
              </span>
            )}
            {valueLabel && (
              <span className="text-base font-serif text-[#1F1F1F] ml-2">
                {valueLabel}
              </span>
            )}
          </div>
        </div>

        <div className="relative h-6 flex items-center group">
          <input
            type="range"
            min={min}
            max={max}
            value={value}
            ref={ref}
            className="absolute w-full h-2 bg-[#EAE0D5] rounded-full appearance-none cursor-pointer focus:outline-none focus:ring-0 z-10"
            style={{
              background: `linear-gradient(to right, #FF4D8C 0%, #FF4D8C ${percentage}%, #EAE0D5 ${percentage}%, #EAE0D5 100%)`,
            }}
            {...props}
          />
          <div
            className="absolute h-5 w-5 bg-white rounded-full border-2 border-[#FF4D8C] shadow-md pointer-events-none transition-transform duration-100 ease-out group-hover:scale-110 z-20"
            style={{ left: `calc(${percentage}% - 10px)` }}
          />
        </div>
      </div>
    );
  },
);
RangeSlider.displayName = "RangeSlider";
