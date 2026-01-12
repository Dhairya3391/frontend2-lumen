"use client"

import { Navbar } from "@/components/Navbar"
import { motion } from "framer-motion"
import { Heart, ShieldCheck, Zap, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F2]">
      {/* Navbar is already in Layout, but we'll leave content here */}
      
      <main className="container mx-auto px-4 py-12 lg:py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-serif font-bold text-[#1F1F1F] mb-6"
          >
            Why we built <span className="text-[#FF4D8C]">Lumen</span>.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-[#8A817C] leading-relaxed"
          >
            Making advanced cardiovascular risk assessment accessible, understandable, and less intimidating for everyone.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm"
            >
                <div className="w-12 h-12 bg-[#FFF0F5] rounded-full flex items-center justify-center text-[#FF4D8C] mb-6">
                    <Heart className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-4">Human-Centric Design</h3>
                <p className="text-[#8A817C] leading-relaxed">
                    Medical data is often complex and scary. We designed Lumen to be calm, clear, and reassuring. Instead of raw medical jargon, we use visual metaphors and plain language (like explaining Systolic vs Diastolic pressure) to help you understand your body better.
                </p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-8 rounded-[2rem] shadow-sm"
            >
                <div className="w-12 h-12 bg-[#E6F6F4] rounded-full flex items-center justify-center text-[#00A991] mb-6">
                    <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-4">Instant AI Analysis</h3>
                <p className="text-[#8A817C] leading-relaxed">
                    Powered by a Random Forest Machine Learning model, Lumen analyzes multiple health markers instantly. We don't just give you a number; we simulate how changes in your lifestyle—like weight loss or better sleep—can actually improve your heart age in real-time.
                </p>
            </motion.div>
        </div>

        <div className="max-w-4xl mx-auto bg-[#1F1F1F] rounded-[2.5rem] p-8 lg:p-12 text-white relative overflow-hidden">
             <div className="relative z-10 text-center">
                 <h2 className="text-3xl font-serif font-bold mb-6">Our Mission</h2>
                 <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
                     To democratize health insights. We believe that knowing your risk is the first step to preventing cardiovascular disease. Lumen provides a private, secure, and easy-to-use tool to start that conversation with your doctor.
                 </p>
                 <div className="flex justify-center gap-4">
                     <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                         <ShieldCheck className="w-4 h-4" />
                         <span className="text-sm font-bold">Privacy First</span>
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                         <Users className="w-4 h-4" />
                         <span className="text-sm font-bold">For Everyone</span>
                     </div>
                 </div>
             </div>
             {/* Decorative Background */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] -z-0"></div>
             <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#FF4D8C] rounded-full blur-[100px] opacity-20"></div>
        </div>

      </main>
    </div>
  )
}
