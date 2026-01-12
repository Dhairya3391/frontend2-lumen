"use client";

import { PredictionResponse } from "@/lib/types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { RefreshCcw, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

interface ResultCardProps {
  result: PredictionResponse;
  onReset: () => void;
}

export function ResultCard({ result, onReset }: ResultCardProps) {
  const percentage = Math.round(result.probability * 100);

  let color = "text-green-500";
  let bgColor = "bg-green-500";
  let borderColor = "border-green-500";
  let Icon = CheckCircle;

  if (result.risk_level === "Moderate") {
    color = "text-yellow-500";
    bgColor = "bg-yellow-500";
    borderColor = "border-yellow-500";
    Icon = AlertTriangle;
  } else if (result.risk_level === "High") {
    color = "text-red-500";
    bgColor = "bg-red-500";
    borderColor = "border-red-500";
    Icon = XCircle;
  }

  // Circular progress calculation
  const radius = 60;
  const stroke = 8;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - result.probability * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className={`overflow-hidden border-t-8 ${borderColor} shadow-lg`}>
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl font-bold">
            Assessment Complete
          </CardTitle>
          <CardDescription>Based on the provided metrics</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-6">
          <div className="relative flex items-center justify-center mb-6">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="transform -rotate-90"
            >
              <circle
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset: 0 }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className="text-slate-100"
              />
              <motion.circle
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                stroke="currentColor"
                fill="transparent"
                strokeWidth={stroke}
                strokeDasharray={circumference + " " + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className={color}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className={`text-3xl font-bold ${color}`}>
                {percentage}%
              </span>
              <span className="text-xs text-slate-500 font-medium uppercase">
                Risk
              </span>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full ${bgColor} bg-opacity-10 mb-4`}
          >
            <Icon className={`h-5 w-5 ${color}`} />
            <span className={`font-semibold ${color}`}>
              {result.risk_level} Risk
            </span>
          </div>

          <p className="text-center text-slate-600 px-4 leading-relaxed">
            {result.message}
          </p>
        </CardContent>
        <CardFooter className="bg-slate-50 flex justify-center py-6 border-t border-slate-100">
          <Button onClick={onReset} variant="outline" className="w-full">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Start New Assessment
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
