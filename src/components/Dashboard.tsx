"use client"

import { useState, useEffect, useCallback } from "react"
import { PatientData, PredictionResponse } from "@/lib/types"
import { predictRisk } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { MoreHorizontal, ArrowLeft, RefreshCw, Activity, TrendingDown, TrendingUp, Zap } from "lucide-react"
import { RangeSlider } from "@/components/ui/RangeSlider"
import { cn } from "@/lib/utils"

interface DashboardProps {
  originalData: PatientData;
  result: PredictionResponse;
  onReset: () => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100 } }
}

const NumberCounter = ({ value }: { value: number }) => {
    return (
        <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={value}
        >
            {value}
        </motion.span>
    )
}

export function Dashboard({ originalData, result: initialResult, onReset }: DashboardProps) {
  const [currentResult, setCurrentResult] = useState(initialResult)
  const [simulatedData, setSimulatedData] = useState(originalData)
  const [isSimulating, setIsSimulating] = useState(false)
  const [debouncedData, setDebouncedData] = useState(originalData)

  // Debounce simulation updates
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedData(simulatedData)
    }, 500)
    return () => clearTimeout(timer)
  }, [simulatedData])

  // Re-run prediction when data changes
  useEffect(() => {
    const runSimulation = async () => {
        // Simple check to avoid re-fetching if data hasn't effectively changed from initial
        // (In a real app, deep compare or just let it run)
        if (JSON.stringify(debouncedData) === JSON.stringify(originalData)) {
            setCurrentResult(initialResult)
            setIsSimulating(false)
            return
        }

        setIsSimulating(true)
        try {
            const newResult = await predictRisk(debouncedData)
            setCurrentResult(newResult)
        } catch (error) {
            console.error("Simulation failed", error)
        } finally {
            setIsSimulating(false)
        }
    }

    runSimulation()
  }, [debouncedData, originalData, initialResult])

  const percentage = Math.round(currentResult.probability * 100)
  const heartAge = 38 + Math.round(currentResult.probability * 25) // Mock formula
  const riskColor = currentResult.risk_level === "High" ? "#FF4D8C" : currentResult.risk_level === "Moderate" ? "#F59E0B" : "#10B981"
  
  // Calculate difference from original
  const riskDiff = Math.round((currentResult.probability - initialResult.probability) * 100)

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-[#F9F6F2] p-6 lg:p-12"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Header & Main Actions */}
        <div className="lg:col-span-12 flex justify-between items-center mb-4">
            <Button variant="ghost" onClick={onReset} className="hover:bg-white/50">
                <ArrowLeft className="mr-2 w-5 h-5" /> Back to Assessment
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" className="hidden sm:flex bg-white/50">
                   <RefreshCw className="mr-2 w-4 h-4" /> Reset Simulation
                </Button>
            </div>
        </div>

        {/* LEFT COLUMN: VISUALS (8 cols) */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* Heart Age Card */}
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Activity className="w-64 h-64 text-[#FF4D8C]" />
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="text-center md:text-left">
                         <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F9F6F2] text-[#8A817C] text-sm font-bold uppercase tracking-widest mb-4"
                         >
                            <Zap className="w-4 h-4 text-[#FF4D8C]" /> AI Health Analysis
                         </motion.div>
                         <h2 className="text-4xl md:text-5xl font-serif text-[#1F1F1F] mb-4">
                            Your Heart Age
                         </h2>
                         <p className="text-[#8A817C] max-w-xs mx-auto md:mx-0 text-lg">
                            Estimated based on your biometrics and lifestyle factors relative to healthy benchmarks.
                         </p>
                    </div>

                    <div className="relative">
                         {/* Circular Gauge */}
                         <div className="w-64 h-64 lg:w-80 lg:h-80 rounded-full border-[20px] border-[#F5F5F5] flex items-center justify-center relative bg-white shadow-inner">
                            <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                                <motion.circle
                                    cx="50%"
                                    cy="50%"
                                    r="44%" // Adjusted for responsive sizing
                                    stroke={riskColor}
                                    strokeWidth="20"
                                    fill="none"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: currentResult.probability }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="drop-shadow-lg"
                                />
                            </svg>
                            <div className="text-center">
                                <motion.div 
                                    key={heartAge}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-8xl font-serif text-[#1F1F1F] leading-none tracking-tighter"
                                >
                                    {heartAge}
                                </motion.div>
                                <p className="text-[#8A817C] font-bold uppercase tracking-widest mt-2">Years Old</p>
                            </div>
                         </div>
                         {/* Badge */}
                         <motion.div 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white shadow-xl py-3 px-6 rounded-2xl flex items-center gap-3 border border-[#F0F0F0]"
                         >
                            <span className="text-sm font-bold text-[#1F1F1F] whitespace-nowrap">Actual Age</span>
                            <div className="w-px h-4 bg-gray-200"></div>
                            <span className="text-xl font-serif text-[#FF4D8C]">{simulatedData.age}</span>
                         </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Risk Horizon Graph */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#1F1F1F] text-white rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                     {/* Gradient BG */}
                     <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a]"></div>
                     
                     <div className="relative z-10">
                        <h3 className="text-lg font-bold opacity-80 mb-1">10-Year Risk</h3>
                        <div className="flex items-end gap-3 mb-8">
                             <div className="text-6xl font-serif">
                                <NumberCounter value={percentage} />%
                             </div>
                             {riskDiff !== 0 && (
                                 <div className={cn("flex items-center gap-1 mb-2 px-2 py-1 rounded-lg text-sm font-bold", riskDiff > 0 ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400")}>
                                     {riskDiff > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                     {Math.abs(riskDiff)}%
                                 </div>
                             )}
                        </div>
                        
                        <div className="h-32 w-full">
                             {/* Animated Line Graph */}
                             <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                                <defs>
                                    <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#FF4D8C" />
                                        <stop offset="100%" stopColor="#F59E0B" />
                                    </linearGradient>
                                </defs>
                                <motion.path
                                    d={`M0,40 Q25,35 50,${40 - (percentage * 0.4)} T100,${40 - (percentage * 0.8)}`}
                                    fill="none"
                                    stroke="url(#lineGradient)"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1, d: `M0,40 Q25,35 50,${40 - (percentage * 0.4)} T100,${40 - (percentage * 0.8)}` }}
                                    transition={{ duration: 1.5, ease: "easeInOut" }}
                                />
                             </svg>
                        </div>
                     </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-white flex flex-col justify-center">
                    <h3 className="text-lg font-bold text-[#1F1F1F] mb-6">Key Risk Factors</h3>
                    <div className="space-y-4">
                        {[
                            { label: "Blood Pressure", val: simulatedData.ap_hi > 130 ? "High" : "Optimal", status: simulatedData.ap_hi > 130 ? "warning" : "good" },
                            { label: "BMI", val: (simulatedData.weight / ((simulatedData.height/100)**2)).toFixed(1), status: "neutral" },
                            { label: "Lifestyle", val: simulatedData.active ? "Active" : "Sedentary", status: simulatedData.active ? "good" : "warning" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-[#F9F6F2]">
                                <span className="text-[#8A817C] font-medium">{item.label}</span>
                                <span className={cn(
                                    "font-serif font-bold text-lg",
                                    item.status === "good" ? "text-green-600" : item.status === "warning" ? "text-amber-600" : "text-[#1F1F1F]"
                                )}>{item.val}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>

        {/* RIGHT COLUMN: SIMULATION (4 cols) */}
        <div className="lg:col-span-4">
            <motion.div variants={itemVariants} className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-pink-500/5 h-full border border-white sticky top-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full bg-[#FFF0F5] flex items-center justify-center text-[#FF4D8C]">
                        <RefreshCw className={cn("w-5 h-5", isSimulating && "animate-spin")} />
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-xl text-[#1F1F1F]">Simulation</h3>
                        <p className="text-xs text-[#8A817C] uppercase tracking-widest">Adjust to see impact</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-[#1F1F1F]">Weight Goal</label>
                            <span className="text-sm font-serif text-[#FF4D8C]">{simulatedData.weight} kg</span>
                        </div>
                        <RangeSlider 
                            label=""
                            value={simulatedData.weight}
                            min={40}
                            max={150}
                            onChange={(e) => setSimulatedData({...simulatedData, weight: Number(e.target.value)})}
                        />
                        <p className="text-xs text-[#8A817C]">Reducing weight can significantly lower cardiovascular strain.</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-[#F0F0F0]">
                        <div className="flex justify-between">
                            <label className="text-sm font-bold text-[#1F1F1F]">Systolic BP</label>
                            <span className="text-sm font-serif text-[#FF4D8C]">{simulatedData.ap_hi} mmHg</span>
                        </div>
                        <RangeSlider 
                            label=""
                            value={simulatedData.ap_hi}
                            min={90}
                            max={180}
                            onChange={(e) => setSimulatedData({...simulatedData, ap_hi: Number(e.target.value)})}
                        />
                        <p className="text-xs text-[#8A817C]">Lower sodium intake and better sleep can improve this metric.</p>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-[#F0F0F0]">
                        <label className="text-sm font-bold text-[#1F1F1F] block mb-2">Lifestyle Changes</label>
                        
                        <button 
                            onClick={() => setSimulatedData(prev => ({ ...prev, active: prev.active ? 0 : 1 }))}
                            className={cn(
                                "w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-300",
                                simulatedData.active ? "border-[#10B981] bg-[#ECFDF5]" : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Activity className={cn("w-5 h-5", simulatedData.active ? "text-[#10B981]" : "text-gray-400")} />
                                <span className={cn("font-medium", simulatedData.active ? "text-[#065F46]" : "text-gray-600")}>
                                    Regular Exercise
                                </span>
                            </div>
                            <div className={cn(
                                "w-12 h-6 rounded-full relative transition-colors duration-300",
                                simulatedData.active ? "bg-[#10B981]" : "bg-gray-300"
                            )}>
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
                                    simulatedData.active ? "left-7" : "left-1"
                                )} />
                            </div>
                        </button>

                        <button 
                            onClick={() => setSimulatedData(prev => ({ ...prev, smoke: prev.smoke ? 0 : 1 }))}
                            className={cn(
                                "w-full p-4 rounded-xl flex items-center justify-between border-2 transition-all duration-300",
                                simulatedData.smoke === 0 ? "border-[#10B981] bg-[#ECFDF5]" : "border-red-200 bg-red-50"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <Zap className={cn("w-5 h-5", simulatedData.smoke === 0 ? "text-[#10B981]" : "text-red-400")} />
                                <span className={cn("font-medium", simulatedData.smoke === 0 ? "text-[#065F46]" : "text-red-700")}>
                                    Smoke Free
                                </span>
                            </div>
                            <div className={cn(
                                "w-12 h-6 rounded-full relative transition-colors duration-300",
                                simulatedData.smoke === 0 ? "bg-[#10B981]" : "bg-red-300"
                            )}>
                                <div className={cn(
                                    "absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300",
                                    simulatedData.smoke === 0 ? "left-7" : "left-1"
                                )} />
                            </div>
                        </button>
                    </div>

                </div>
            </motion.div>
        </div>

      </div>
    </motion.div>
  )
}
