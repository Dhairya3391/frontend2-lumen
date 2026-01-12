"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PatientData } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { RangeSlider } from "@/components/ui/RangeSlider"
import { SelectionCard } from "@/components/ui/SelectionCard"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ArrowRight, Activity, Cigarette, Wine, Check, Heart, User, Ruler, Armchair } from "lucide-react"
import { cn } from "@/lib/utils"

// Schema
const formSchema = z.object({
  age: z.coerce.number().min(30).max(70),
  gender: z.coerce.number().refine((val) => val === 1 || val === 2),
  height: z.coerce.number().min(140).max(210),
  weight: z.coerce.number().min(35).max(200),
  ap_hi: z.coerce.number().min(80).max(200),
  ap_lo: z.coerce.number().min(50).max(150),
  cholesterol: z.coerce.number().refine((val) => [1, 2, 3].includes(val)),
  gluc: z.coerce.number().refine((val) => [1, 2, 3].includes(val)),
  smoke: z.coerce.number().refine((val) => [0, 1].includes(val)),
  alco: z.coerce.number().refine((val) => [0, 1].includes(val)),
  active: z.coerce.number().refine((val) => [0, 1].includes(val)),
})

type FormValues = z.infer<typeof formSchema>

interface AssessmentFormProps {
  onSubmit: (data: PatientData) => void;
  isLoading: boolean;
}

const STEPS = [
  { id: 'personal', title: 'Personal Profile', subtitle: 'Basic demographics' },
  { id: 'activity', title: 'Daily Activity', subtitle: 'Establish your baseline' },
  { id: 'vitals', title: 'Vital Signs', subtitle: 'Current measurements' },
  { id: 'labs', title: 'Lab Results', subtitle: 'Blood work indicators' },
  { id: 'habits', title: 'Lifestyle Habits', subtitle: 'Risk factors' },
]

export function AssessmentForm({ onSubmit, isLoading }: AssessmentFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState(0)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      age: 50,
      gender: 1, // Default Female
      height: 165,
      weight: 70,
      ap_hi: 120,
      ap_lo: 80,
      cholesterol: 1,
      gluc: 1,
      smoke: 0,
      alco: 0,
      active: 1
    }
  })

  const formValues = watch()

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setDirection(1)
      setCurrentStep(c => c + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      handleSubmit(onSubmit)()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(c => c - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 50 : -50,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 50 : -50,
      opacity: 0,
    }),
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-0 pb-20">
      
      {/* Header / Progress - Sticky */}
      <div className="mb-12 sticky top-0 bg-[#F9F6F2]/90 backdrop-blur-md z-20 pt-8 pb-4 border-b border-[#EAE0D5]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
              <button 
                onClick={prevStep} 
                disabled={currentStep === 0}
                className="w-10 h-10 rounded-full border border-[#EAE0D5] bg-white flex items-center justify-center hover:bg-slate-50 disabled:opacity-0 transition-all"
              >
                <ArrowLeft className="w-5 h-5 text-[#1F1F1F]" />
              </button>
              <div>
                  <h2 className="text-2xl font-serif font-bold text-[#1F1F1F]">
                    {STEPS[currentStep].title}
                  </h2>
                  <p className="text-sm text-[#8A817C] hidden sm:block">
                    {STEPS[currentStep].subtitle}
                  </p>
              </div>
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-[#FF4D8C] bg-[#FFF0F5] px-3 py-1 rounded-full">
            Step {currentStep + 1}/{STEPS.length}
          </span>
        </div>

        <div className="relative h-1.5 bg-[#EAE0D5] rounded-full overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#FF4D8C] to-[#F59E0B]"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            {/* STEP 1: PERSONAL */}
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white">
                    <div className="flex items-center gap-3 mb-6">
                        <User className="w-6 h-6 text-[#FF4D8C]" />
                        <h3 className="font-bold text-lg text-[#1F1F1F]">Demographics</h3>
                    </div>
                    <div className="space-y-8">
                        <RangeSlider
                            label="Age"
                            min={30}
                            max={70}
                            value={formValues.age}
                            onChange={(e) => setValue('age', Number(e.target.value))}
                            unit="years"
                        />
                        
                        <div>
                            <label className="text-xs font-bold uppercase tracking-widest text-[#1F1F1F] mb-4 block">Gender</label>
                            <div className="grid grid-cols-2 gap-4">
                                <SelectionCard
                                title="Female"
                                selected={formValues.gender === 1}
                                onClick={() => setValue('gender', 1)}
                                className="justify-center text-center flex-col py-6"
                                />
                                <SelectionCard
                                title="Male"
                                selected={formValues.gender === 2}
                                onClick={() => setValue('gender', 2)}
                                className="justify-center text-center flex-col py-6"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Visual Context or Helper */}
                <div className="hidden md:flex items-center justify-center p-8 bg-[#FFF0F5] rounded-[2rem] opacity-50">
                     <div className="text-center">
                        <User className="w-24 h-24 text-[#FF4D8C] mx-auto mb-4 opacity-50" />
                        <p className="text-[#FF4D8C] font-serif italic text-lg">"Accurate demographics are crucial for baselining risk factors."</p>
                     </div>
                </div>
              </div>
            )}

            {/* STEP 2: ACTIVITY */}
            {currentStep === 1 && (
              <div className="max-w-2xl mx-auto space-y-6">
                 <div className="text-center mb-8">
                    <h3 className="font-serif text-2xl text-[#1F1F1F] mb-2">How active are you?</h3>
                    <p className="text-[#8A817C]">Select the option that best describes your typical week.</p>
                 </div>
                 
                <SelectionCard
                  title="Sedentary Lifestyle"
                  description="Mostly sitting (desk job, driving). Less than 30 mins of moderate activity per week."
                  icon={<div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500"><Armchair className="w-5 h-5"/></div>}
                  selected={formValues.active === 0}
                  onClick={() => { setValue('active', 0); setTimeout(nextStep, 400); }}
                  className="w-full"
                />
                <SelectionCard
                  title="Active Lifestyle"
                  description="Regular exercise (3+ times/week), walking daily, or a physically demanding job."
                  icon={<div className="w-10 h-10 bg-[#E6F6F4] rounded-full flex items-center justify-center text-[#00A991]"><Activity className="w-5 h-5"/></div>}
                  selected={formValues.active === 1}
                  onClick={() => { setValue('active', 1); setTimeout(nextStep, 400); }}
                  className="w-full"
                />
              </div>
            )}

            {/* STEP 3: VITALS */}
            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Ruler className="w-6 h-6 text-[#FF4D8C]" />
                        <h3 className="font-bold text-lg text-[#1F1F1F]">Body Metrics</h3>
                    </div>
                    <RangeSlider
                        label="Height"
                        min={140}
                        max={210}
                        value={formValues.height}
                        onChange={(e) => setValue('height', Number(e.target.value))}
                        unit="cm"
                    />
                    <RangeSlider
                        label="Weight"
                        min={35}
                        max={150}
                        value={formValues.weight}
                        onChange={(e) => setValue('weight', Number(e.target.value))}
                        unit="kg"
                    />
                </div>

                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white space-y-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="w-6 h-6 text-[#FF4D8C]" />
                        <h3 className="font-bold text-lg text-[#1F1F1F]">Blood Pressure</h3>
                    </div>
                    
                    <RangeSlider
                        label="Systolic Pressure"
                        description="Pressure when your heart beats (squeezes)."
                        min={80}
                        max={200}
                        value={formValues.ap_hi}
                        onChange={(e) => setValue('ap_hi', Number(e.target.value))}
                        unit="mmHg"
                    />
                    <RangeSlider
                        label="Diastolic Pressure"
                        description="Pressure between beats (when heart rests)."
                        min={50}
                        max={150}
                        value={formValues.ap_lo}
                        onChange={(e) => setValue('ap_lo', Number(e.target.value))}
                        unit="mmHg"
                    />
                </div>
              </div>
            )}

            {/* STEP 4: LABS */}
            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-[#1F1F1F] mb-2 block">Cholesterol Level</label>
                    <p className="text-xs text-[#8A817C] mb-4">Total cholesterol levels indicating fat in your blood.</p>
                    <div className="grid gap-3">
                        <SelectionCard
                            title="Normal"
                            description="< 200 mg/dL. Healthy level."
                            selected={formValues.cholesterol === 1}
                            onClick={() => setValue('cholesterol', 1)}
                        />
                        <SelectionCard
                            title="Above Normal"
                            description="200-239 mg/dL. Borderline high."
                            selected={formValues.cholesterol === 2}
                            onClick={() => setValue('cholesterol', 2)}
                        />
                         <SelectionCard
                            title="Well Above Normal"
                            description="≥ 240 mg/dL. High risk."
                            selected={formValues.cholesterol === 3}
                            onClick={() => setValue('cholesterol', 3)}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <label className="text-sm font-bold uppercase tracking-widest text-[#1F1F1F] mb-2 block">Glucose Level</label>
                    <p className="text-xs text-[#8A817C] mb-4">Fasting blood sugar levels indicating diabetes risk.</p>
                    <div className="grid gap-3">
                        <SelectionCard
                            title="Normal"
                            description="< 100 mg/dL. Healthy range."
                            selected={formValues.gluc === 1}
                            onClick={() => setValue('gluc', 1)}
                        />
                        <SelectionCard
                            title="Above Normal"
                            description="100-125 mg/dL. Pre-diabetes range."
                            selected={formValues.gluc === 2}
                            onClick={() => setValue('gluc', 2)}
                        />
                         <SelectionCard
                            title="Well Above Normal"
                            description="≥ 126 mg/dL. Diabetes range."
                            selected={formValues.gluc === 3}
                            onClick={() => setValue('gluc', 3)}
                        />
                    </div>
                </div>
              </div>
            )}

            {/* STEP 5: HABITS */}
            {currentStep === 4 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#FFF0F5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF4D8C]">
                            <Cigarette className="w-8 h-8" />
                        </div>
                        <h3 className="font-serif text-xl font-bold">Smoking Status</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectionCard
                            title="Non-Smoker"
                            icon={<Check className="w-5 h-5"/>}
                            selected={formValues.smoke === 0}
                            onClick={() => setValue('smoke', 0)}
                            className="justify-center flex-col py-6"
                        />
                         <SelectionCard
                            title="Smoker"
                            icon={<Cigarette className="w-5 h-5"/>}
                            selected={formValues.smoke === 1}
                            onClick={() => setValue('smoke', 1)}
                            className="justify-center flex-col py-6"
                        />
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-white h-full flex flex-col justify-center">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-[#FFF0F5] rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF4D8C]">
                            <Wine className="w-8 h-8" />
                        </div>
                        <h3 className="font-serif text-xl font-bold">Alcohol Consumption</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <SelectionCard
                            title="None / Rare"
                            icon={<Check className="w-5 h-5"/>}
                            selected={formValues.alco === 0}
                            onClick={() => setValue('alco', 0)}
                            className="justify-center flex-col py-6"
                        />
                         <SelectionCard
                            title="Frequent"
                            icon={<Wine className="w-5 h-5"/>}
                            selected={formValues.alco === 1}
                            onClick={() => setValue('alco', 1)}
                            className="justify-center flex-col py-6"
                        />
                    </div>
                 </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Actions - Floating on Desktop */}
      <div className="mt-12 flex justify-end">
        <Button 
            onClick={nextStep} 
            className="w-full md:w-auto md:min-w-[200px] shadow-glow h-14 text-lg rounded-full"
            disabled={isLoading}
            size="lg"
        >
          {isLoading ? "Analyzing..." : currentStep === STEPS.length - 1 ? "Generate Report" : "Continue"}
          {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
        </Button>
      </div>
    </div>
  )
}