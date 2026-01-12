"use client"

import { useState } from "react"
import { AssessmentForm } from "@/components/AssessmentForm"
import { Dashboard } from "@/components/Dashboard"
import { predictRisk } from "@/lib/api"
import { PatientData, PredictionResponse } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Activity, Heart, ArrowRight } from "lucide-react"

export default function Home() {
  const [view, setView] = useState<'landing' | 'assessment' | 'results'>('landing')
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAssessmentSubmit = async (data: PatientData) => {
    setLoading(true);
    setError(null);
    setPatientData(data); // Store data for simulation
    try {
      const response = await predictRisk(data);
      setResult(response);
      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = () => {
    setView('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAssessment = () => {
    setResult(null);
    setPatientData(null);
    setError(null);
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans">
      <AnimatePresence mode="wait">
        
        {/* LANDING VIEW */}
        {view === 'landing' && (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 lg:px-8 py-6 pb-32 lg:pb-12 min-h-screen flex flex-col"
          >
             {/* Header */}
             <header className="flex items-center justify-between mb-8 lg:mb-12">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#A2D2C9] relative overflow-hidden flex items-center justify-center shrink-0 border-2 border-white shadow-sm">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-10 h-10" />
                        <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="font-serif font-bold text-xl text-[#1F1F1F]">Lumen</h3>
                        <p className="text-[10px] font-bold tracking-widest text-[#FF4D8C] uppercase">Connected</p>
                    </div>
                </div>
                <button className="w-12 h-12 rounded-full border border-[#EAE0D5] bg-white flex items-center justify-center text-[#1F1F1F] hover:bg-[#F9F6F2] transition-colors shadow-sm">
                    <Bell className="w-5 h-5" />
                </button>
             </header>

             {/* Main Content Grid */}
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center flex-1">
                
                {/* Left Column: Text & CTA */}
                <div className="order-2 lg:order-1 space-y-8">
                     <div className="space-y-4">
                        <motion.h1 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl lg:text-7xl font-serif font-bold text-[#1F1F1F] leading-[1.1]"
                        >
                            Your Health, <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4D8C] to-[#F59E0B]">Demystified.</span>
                        </motion.h1>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-[#8A817C] text-lg lg:text-xl max-w-lg leading-relaxed"
                        >
                            Advanced AI cardiovascular screening that helps you understand your heart health in seconds.
                        </motion.p>
                     </div>

                     {/* Active Sensors (Desktop Layout) */}
                     <div className="hidden lg:grid grid-cols-2 gap-6 max-w-lg">
                        <div className="bg-white p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold tracking-widest text-[#8A817C] uppercase">Heart Rate</span>
                                <div className="w-8 h-8 bg-[#FFF0F5] rounded-full flex items-center justify-center text-[#FF4D8C] group-hover:scale-110 transition-transform">
                                    <Heart className="w-4 h-4 fill-current" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-serif text-[#1F1F1F]">72</span>
                                <span className="text-sm text-[#8A817C] uppercase font-bold">BPM</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F6F4] text-[#00A991]">
                                <div className="w-2 h-2 rounded-full bg-[#00A991]"></div>
                                <span className="text-[10px] font-bold uppercase">Normal</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all duration-300 group">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-bold tracking-widest text-[#8A817C] uppercase">Blood Pressure</span>
                                <div className="w-8 h-8 bg-[#FFF7ED] rounded-full flex items-center justify-center text-[#F59E0B] group-hover:scale-110 transition-transform">
                                    <Activity className="w-4 h-4" />
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 mb-2">
                                <span className="text-5xl font-serif text-[#1F1F1F]">120</span>
                                <span className="text-xl text-[#8A817C]">/80</span>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#FF4D8C]">
                                <span className="text-[10px] font-bold uppercase">Optimal</span>
                            </div>
                        </div>
                     </div>

                     {/* Desktop CTA */}
                     <div className="hidden lg:block pt-4">
                         <Button 
                            onClick={startAssessment} 
                            className="h-16 px-10 rounded-full text-lg shadow-glow hover:shadow-xl hover:scale-105 transition-all duration-300"
                         >
                            <Activity className="mr-3 w-5 h-5" /> Start Assessment
                         </Button>
                     </div>
                </div>

                {/* Right Column: Visuals */}
                <div className="order-1 lg:order-2 relative">
                    <motion.div 
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="relative bg-white rounded-[3rem] p-4 shadow-2xl shadow-pink-100 border border-white h-[500px] lg:h-[600px] overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-gray-50 bg-[url('https://img.freepik.com/free-vector/human-body-structure-polygonal-wireframe-composition_1284-18751.jpg')] bg-cover bg-center opacity-90 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/90 pointer-events-none"></div>
                        
                        {/* Interactive Markers */}
                        <motion.div 
                            className="absolute top-[30%] left-[55%] cursor-pointer"
                            whileHover={{ scale: 1.1 }}
                        >
                            <div className="w-20 h-20 rounded-full border border-[#FF4D8C]/30 flex items-center justify-center animate-pulse">
                                <div className="w-12 h-12 rounded-full bg-[#FF4D8C]/10 flex items-center justify-center text-[#FF4D8C] backdrop-blur-md shadow-[0_0_20px_rgba(255,77,140,0.4)]">
                                    <Heart className="w-6 h-6 fill-current" />
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            className="absolute top-[25%] left-[30%] lg:left-[40%]"
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3 border border-white/50 hover:scale-105 transition-transform cursor-pointer">
                                <div>
                                    <span className="text-[10px] font-bold text-[#8A817C] uppercase block">Analysis</span>
                                    <span className="text-sm font-bold text-[#1F1F1F]">Myocardium</span>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-[#FF4D8C] flex items-center justify-center text-white shadow-glow">
                                    <span className="text-lg leading-none mb-0.5">+</span>
                                </div>
                            </div>
                        </motion.div>
                        
                        {/* Live ECG Overlay */}
                        <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 shadow-lg">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-xs font-bold tracking-widest text-[#8A817C] uppercase">Live Rhythm</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span className="text-xs font-bold text-green-600 uppercase">Sync</span>
                                </div>
                            </div>
                            <div className="h-16 w-full relative overflow-hidden">
                                <svg viewBox="0 0 300 100" className="w-full h-full overflow-visible preserve-3d">
                                    <path 
                                        d="M0,50 L30,50 L40,20 L50,80 L60,50 L90,50 L100,30 L110,70 L120,50 L150,50 L160,10 L170,90 L180,50 L210,50 L220,35 L230,65 L240,50 L270,50 L280,10 L290,90 L300,50" 
                                        fill="none" 
                                        stroke="#FF4D8C" 
                                        strokeWidth="2.5" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round"
                                        className="drop-shadow-md"
                                    />
                                </svg>
                                {/* Gradient Fade for Graph */}
                                <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-white pointer-events-none"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>

             </div>

             {/* Mobile Floating Action Button */}
             <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
                 <div className="absolute inset-0 bg-white/50 backdrop-blur-xl rounded-[2rem] -z-10 shadow-2xl"></div>
                 <Button 
                    onClick={startAssessment} 
                    className="w-full h-16 text-lg rounded-[1.5rem] shadow-glow"
                 >
                    <Activity className="mr-2 w-5 h-5" /> Analyze Symptoms
                 </Button>
             </div>
          </motion.div>
        )}

        {/* ASSESSMENT VIEW */}
        {view === 'assessment' && (
           <motion.div
             key="assessment"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="container mx-auto py-8 min-h-screen"
           >
              <AssessmentForm onSubmit={handleAssessmentSubmit} isLoading={loading} />
           </motion.div>
        )}

        {/* RESULTS VIEW */}
        {view === 'results' && result && patientData && (
            <motion.div
                key="results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="min-h-screen w-full"
            >
                <Dashboard 
                    originalData={patientData} 
                    result={result} 
                    onReset={resetAssessment} 
                />
            </motion.div>
        )}

      </AnimatePresence>
    </div>
  )
}