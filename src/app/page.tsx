"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { AssessmentForm } from "@/components/AssessmentForm";
import { Dashboard } from "@/components/Dashboard";
import { predictRisk, checkHealth } from "@/lib/api";
import { PatientData, PredictionResponse } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Heart, RefreshCw, X } from "lucide-react";

// Data Source: Hardcoded locally for this prototype.
// In a real app, this could come from a CMS or API.
const HEALTH_QUOTES = [
  "A healthy outside starts from the inside.",
  "Take care of your body. It's the only place you have to live.",
  "Walking is man's best medicine.",
  "The groundwork of all happiness is health.",
  "Prevention is better than cure.",
  "Movement is a celebration of what your body can do.",
  "Rest is not idleness, it's a vital part of renewal.",
  "Your heart is the engine of your life. Keep it tuned.",
  "Eat food, not too much, mostly plants.",
  "Health is not about the weight you lose, but the life you gain.",
  "A good laugh and a long sleep are the best cures in the doctor's book.",
  "Physical fitness is the first requisite of happiness.",
  "To enjoy the glow of good health, you must exercise.",
  "Let food be thy medicine and medicine be thy food.",
  "Wellness is the complete integration of body, mind, and spirit.",
  "Every step you take is a step away from heart disease.",
  "Listen to your heart, it knows the rhythm of your life.",
  "Happiness is the highest form of health.",
  "Invest in your health, it pays the best dividends.",
  "Small changes make a big difference over time.",
  "Your body hears everything your mind says.",
  "Don't wish for a good body, work for it.",
  "Self-care is not selfish. You cannot serve from an empty vessel.",
  "Strength does not come from physical capacity. It comes from an indomitable will.",
  "Calm mind, strong heart.",
];

const HEALTH_GREETINGS = [
  "Champion",
  "Thriver",
  "Wellness Warrior",
  "Friend",
  "Athlete",
  "Visionary",
];

export default function Home() {
  const [view, setView] = useState<"landing" | "assessment" | "results">(
    "landing",
  );
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [patientData, setPatientData] = useState<PatientData | null>(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<string | null>(null);

  // Interactive States
  const [activeQuote, setActiveQuote] = useState<string | null>(null);
  const [avatarSeed, setAvatarSeed] = useState("Felix");
  const [greeting, setGreeting] = useState("User");
  const [showHistory, setShowHistory] = useState(false);
  const [showMyocardiumInfo, setShowMyocardiumInfo] = useState(false);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Live Simulated Data
  // Initialize with fixed values to avoid hydration mismatch
  const [heartRate, setHeartRate] = useState(75);
  const [bpSystolic, setBpSystolic] = useState(120);
  const [bpDiastolic, setBpDiastolic] = useState(80);

  // History Data for Graphs
  const [hrHistory, setHrHistory] = useState<number[]>(() =>
    Array.from({ length: 15 }, () => 75),
  );
  const [bpHistory, setBpHistory] = useState<number[]>(() =>
    Array.from({ length: 15 }, () => 120),
  );

  // Initialize Random Data on Mount
  useEffect(() => {
    // Randomize Avatar
    const seeds = ["Felix", "Aneka", "Jocelyn", "Robert", "Create", "Lumen"];
    setAvatarSeed(seeds[Math.floor(Math.random() * seeds.length)]);

    // Randomize Greeting
    setGreeting(
      HEALTH_GREETINGS[Math.floor(Math.random() * HEALTH_GREETINGS.length)],
    );

    // Randomize Vitals on client load
    setHeartRate(Math.floor(Math.random() * (100 - 60 + 1)) + 60);
    setBpSystolic(Math.floor(Math.random() * (130 - 110 + 1)) + 110);
    setBpDiastolic(Math.floor(Math.random() * (85 - 70 + 1)) + 70);
    setHrHistory(
      Array.from(
        { length: 15 },
        () => Math.floor(Math.random() * (100 - 60 + 1)) + 60,
      ),
    );
    setBpHistory(
      Array.from(
        { length: 15 },
        () => Math.floor(Math.random() * (140 - 110 + 1)) + 110,
      ),
    );

    // Check backend health
    const checkBackendHealth = async () => {
      const isHealthy = await checkHealth();
      setIsBackendConnected(isHealthy);
    };
    checkBackendHealth();
  }, []);

  // Simulate Live Vitals
  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate Heart Rate
      setHeartRate((prev) => {
        const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const newValue = Math.min(Math.max(prev + change, 55), 110); // Clamp
        setHrHistory((h) => [...h.slice(1), newValue]); // Update history
        return newValue;
      });

      // Fluctuate BP
      if (Math.random() > 0.4) {
        setBpSystolic((prev) => {
          const change = Math.floor(Math.random() * 3) - 1;
          const newValue = prev + change;
          setBpHistory((h) => [...h.slice(1), newValue]); // Update history (tracking systolic)
          return newValue;
        });
        setBpDiastolic((prev) => {
          const change = Math.floor(Math.random() * 3) - 1;
          return prev + change;
        });
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  // Helper to generate SVG path from data
  const generateSparkline = (data: number[], min: number, max: number) => {
    if (data.length === 0) return "";
    const width = 100;
    const height = 40;
    const stepX = width / (data.length - 1);

    const points = data.map((val, i) => {
      const x = i * stepX;
      const normalizedY = ((val - min) / (max - min)) * (height - 10);
      const y = height - 5 - normalizedY;
      return `${x},${y}`;
    });

    return `M${points.join(" L")}`;
  };

  const handleAssessmentSubmit = async (data: PatientData) => {
    setLoading(true);
    setError(null);
    setPatientData(data);
    try {
      const response = await predictRisk(data);
      setResult(response);
      setView("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An unexpected error occurred.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = () => {
    setView("assessment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetAssessment = () => {
    setResult(null);
    setPatientData(null);
    setError(null);
    setView("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const triggerEasterEgg = () => {
    const randomQuote =
      HEALTH_QUOTES[Math.floor(Math.random() * HEALTH_QUOTES.length)];
    setActiveQuote(randomQuote);
    setTimeout(() => setActiveQuote(null), 5000);
  };

  const cycleAvatar = () => {
    const seeds = ["Felix", "Aneka", "Jocelyn", "Robert", "Create", "Lumen"];
    const next = seeds[(seeds.indexOf(avatarSeed) + 1) % seeds.length];
    setAvatarSeed(next);
  };

  return (
    <div className="min-h-screen bg-[#F9F6F2] font-sans">
      <AnimatePresence mode="wait">
        {/* LANDING VIEW */}
        {view === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-4 lg:px-8 py-6 pb-32 lg:pb-12 min-h-screen flex flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between mb-8 lg:mb-12 relative z-20">
              <div
                className="flex items-center gap-3 cursor-pointer group"
                onClick={cycleAvatar}
                title="Click to switch user profile"
              >
                <div className="w-12 h-12 rounded-full bg-[#A2D2C9] relative overflow-hidden flex items-center justify-center shrink-0 border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                  <Image
                    src={`https://api.dicebear.com/7.x/avataaars/png?seed=${avatarSeed}&size=96`}
                    alt="User"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                  <div
                    className={`absolute bottom-1 right-1 w-3 h-3 border-2 border-white rounded-full ${
                      isBackendConnected
                        ? "bg-green-500"
                        : "bg-gray-400 animate-pulse"
                    }`}
                  ></div>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#1F1F1F] group-hover:text-[#FF4D8C] transition-colors">
                    Hello, {greeting}
                  </h3>
                  <p
                    className={`text-[10px] font-bold tracking-widest uppercase ${
                      isBackendConnected
                        ? "text-[#00A991]"
                        : "text-[#8A817C]"
                    }`}
                  >
                    {isBackendConnected ? "Connected" : "Connecting..."}
                  </p>
                </div>
              </div>

              <div className="relative">
                <button
                  onClick={triggerEasterEgg}
                  className="w-12 h-12 rounded-full border border-[#EAE0D5] bg-white flex items-center justify-center text-[#FF4D8C] hover:bg-[#FFF0F5] hover:scale-110 transition-all shadow-sm"
                >
                  <Heart className="w-5 h-5 fill-current animate-pulse" />
                </button>
                <AnimatePresence>
                  {activeQuote && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute top-14 right-0 w-64 p-4 bg-white rounded-2xl shadow-xl border border-pink-100 z-50 text-center"
                    >
                      <p className="font-serif text-[#1F1F1F] italic text-sm">
                        &quot;{activeQuote}&quot;
                      </p>
                      <div className="absolute -top-2 right-4 w-4 h-4 bg-white rotate-45 border-t border-l border-pink-100"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                    Your Health, <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-[#FF4D8C] to-[#F59E0B]">
                      Demystified.
                    </span>
                  </motion.h1>
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-[#8A817C] text-lg lg:text-xl max-w-lg leading-relaxed"
                  >
                    Advanced AI cardiovascular screening that helps you
                    understand your heart health in seconds.
                  </motion.p>
                </div>

                {/* Active Sensors (Desktop Layout) */}
                <div className="hidden lg:block max-w-lg">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold tracking-widest text-[#8A817C] uppercase">
                      Active Sensors
                    </span>
                    <button
                      onClick={() => setShowHistory(!showHistory)}
                      className="text-[10px] font-bold text-[#FF4D8C] hover:text-[#E63D7A] uppercase tracking-widest flex items-center gap-1"
                    >
                      {showHistory ? "View Live" : "View History"}
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    {/* Heart Rate Card */}
                    <div className="bg-white p-6 rounded-4xl border border-white shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden h-40">
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-xs font-bold tracking-widest text-[#8A817C] uppercase">
                          Heart Rate
                        </span>
                        <Heart className="w-4 h-4 text-[#FF4D8C] fill-current animate-pulse" />
                      </div>

                      {showHistory ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center p-4 pt-8"
                        >
                          {/* Dynamic Sparkline */}
                          <svg
                            viewBox="0 0 100 40"
                            className="w-full h-full overflow-visible"
                          >
                            <path
                              d={generateSparkline(hrHistory, 50, 120)}
                              fill="none"
                              stroke="#FF4D8C"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-5xl font-serif text-[#1F1F1F] tabular-nums">
                              {heartRate}
                            </span>
                            <span className="text-sm text-[#8A817C] uppercase font-bold">
                              BPM
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F6F4] text-[#00A991]">
                            <div className="w-2 h-2 rounded-full bg-[#00A991]"></div>
                            <span className="text-[10px] font-bold uppercase">
                              Normal
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    {/* BP Card */}
                    <div className="bg-white p-6 rounded-4xl border border-white shadow-sm hover:shadow-md transition-all duration-300 group h-40 relative">
                      <div className="flex justify-between items-start mb-2 relative z-10">
                        <span className="text-xs font-bold tracking-widest text-[#8A817C] uppercase">
                          Blood Pressure
                        </span>
                        <Activity className="w-4 h-4 text-[#F59E0B]" />
                      </div>

                      {showHistory ? (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 flex items-center justify-center p-4 pt-8"
                        >
                          {/* Dynamic Sparkline */}
                          <svg
                            viewBox="0 0 100 40"
                            className="w-full h-full overflow-visible"
                          >
                            {/* Systolic Trend */}
                            <path
                              d={generateSparkline(bpHistory, 100, 160)}
                              fill="none"
                              stroke="#F59E0B"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            {/* Baseline reference line */}
                            <line
                              x1="0"
                              y1="20"
                              x2="100"
                              y2="20"
                              stroke="#F59E0B"
                              strokeWidth="1"
                              strokeDasharray="4 4"
                              opacity="0.3"
                            />
                          </svg>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-5xl font-serif text-[#1F1F1F] tabular-nums">
                              {bpSystolic}
                            </span>
                            <span className="text-xl text-[#8A817C] tabular-nums">
                              /{bpDiastolic}
                            </span>
                          </div>
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF0F5] text-[#FF4D8C]">
                            <span className="text-[10px] font-bold uppercase">
                              Optimal
                            </span>
                          </div>
                        </motion.div>
                      )}
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
                  className="relative bg-white rounded-[3rem] p-4 shadow-2xl shadow-pink-100 border border-white h-125 lg:h-150 overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gray-50 bg-[url('https://img.freepik.com/free-vector/human-body-structure-polygonal-wireframe-composition_1284-18751.jpg')] bg-cover bg-center opacity-90 mix-blend-multiply transition-transform duration-1000 group-hover:scale-105"></div>
                  <div className="absolute inset-0 bg-linear-to-b from-white/60 via-transparent to-white/90 pointer-events-none"></div>

                  {/* Interactive Markers */}
                  <motion.div
                    className="absolute top-[30%] left-[55%] cursor-pointer"
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setShowMyocardiumInfo(!showMyocardiumInfo)}
                  >
                    <div className="w-20 h-20 rounded-full border border-[#FF4D8C]/30 flex items-center justify-center animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-[#FF4D8C]/10 flex items-center justify-center text-[#FF4D8C] backdrop-blur-md shadow-[0_0_20px_rgba(255,77,140,0.4)]">
                        <Heart className="w-6 h-6 fill-current" />
                      </div>
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {showMyocardiumInfo && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="absolute top-[15%] left-[65%] w-48 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-xl border border-white/50 z-20"
                      >
                        <button
                          onClick={() => setShowMyocardiumInfo(false)}
                          className="absolute top-2 right-2 text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <h4 className="text-sm font-bold text-[#FF4D8C] mb-1">
                          Myocardium
                        </h4>
                        <p className="text-[10px] text-slate-600 leading-relaxed">
                          The muscular middle layer of the heart wall. It pumps
                          blood through the circulatory system.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div
                    className="absolute top-[25%] left-[30%] lg:left-[40%]"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div
                      onClick={() => setShowMyocardiumInfo(true)}
                      className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg flex items-center gap-3 border border-white/50 hover:scale-105 transition-transform cursor-pointer"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-[#8A817C] uppercase block">
                          Analysis
                        </span>
                        <span className="text-sm font-bold text-[#1F1F1F]">
                          Myocardium
                        </span>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-[#FF4D8C] flex items-center justify-center text-white shadow-glow">
                        <span className="text-lg leading-none mb-0.5">+</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Live ECG Overlay */}
                  <div className="absolute bottom-8 left-8 right-8 bg-white/80 backdrop-blur-xl p-6 rounded-4xl border border-white/50 shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold tracking-widest text-[#8A817C] uppercase">
                        Live Rhythm
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-green-600 uppercase">
                          Sync
                        </span>
                      </div>
                    </div>
                    <div className="h-16 w-full relative overflow-hidden">
                      {/* Moving ECG Animation */}
                      <div className="absolute inset-0 flex w-[200%] animate-ecg-scroll">
                        {/* First Cycle */}
                        <div className="w-1/2 h-full">
                          <svg
                            viewBox="0 0 300 100"
                            className="w-full h-full overflow-visible"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0,50 L30,50 L40,20 L50,80 L60,50 L90,50 L100,30 L110,70 L120,50 L150,50 L160,10 L170,90 L180,50 L210,50 L220,35 L230,65 L240,50 L270,50 L280,10 L290,90 L300,50"
                              fill="none"
                              stroke="#FF4D8C"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                              className="drop-shadow-md"
                            />
                          </svg>
                        </div>
                        {/* Second Cycle (Exact Duplicate) */}
                        <div className="w-1/2 h-full">
                          <svg
                            viewBox="0 0 300 100"
                            className="w-full h-full overflow-visible"
                            preserveAspectRatio="none"
                          >
                            <path
                              d="M0,50 L30,50 L40,20 L50,80 L60,50 L90,50 L100,30 L110,70 L120,50 L150,50 L160,10 L170,90 L180,50 L210,50 L220,35 L230,65 L240,50 L270,50 L280,10 L290,90 L300,50"
                              fill="none"
                              stroke="#FF4D8C"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              vectorEffect="non-scaling-stroke"
                              className="drop-shadow-md"
                            />
                          </svg>
                        </div>
                      </div>
                      {/* Gradient Fade for Graph */}
                      <div className="absolute inset-0 bg-linear-to-r from-white via-transparent to-white pointer-events-none z-10"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Mobile Floating Action Button */}
            <div className="lg:hidden fixed bottom-6 left-4 right-4 z-50">
              <div className="absolute inset-0 bg-white/50 backdrop-blur-xl rounded-4xl -z-10 shadow-2xl"></div>
              <Button
                onClick={startAssessment}
                className="w-full h-16 text-lg rounded-3xl shadow-glow"
              >
                <Activity className="mr-2 w-5 h-5" /> Analyze Symptoms
              </Button>
            </div>
          </motion.div>
        )}

        {/* ASSESSMENT VIEW */}
        {view === "assessment" && (
          <motion.div
            key="assessment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="container mx-auto py-8 min-h-screen"
          >
            <AssessmentForm
              onSubmit={handleAssessmentSubmit}
              isLoading={loading}
            />
          </motion.div>
        )}

        {/* RESULTS VIEW */}
        {view === "results" && result && patientData && (
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
  );
}
