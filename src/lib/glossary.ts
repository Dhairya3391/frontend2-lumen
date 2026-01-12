export type GlossaryTerm = {
  term: string;
  definition: string;
  category: "General" | "Vitals" | "Lifestyle" | "Conditions";
};

export const medicalGlossary: GlossaryTerm[] = [
  {
    term: "BMI (Body Mass Index)",
    definition: "A measure of body fat based on height and weight. Used to screen for weight categories that may lead to health problems.",
    category: "General"
  },
  {
    term: "Systolic Blood Pressure",
    definition: "The top number in a blood pressure reading. It measures the force your heart exerts on the walls of your arteries each time it beats.",
    category: "Vitals"
  },
  {
    term: "Diastolic Blood Pressure",
    definition: "The bottom number in a blood pressure reading. It measures the force your heart exerts on the walls of your arteries between beats.",
    category: "Vitals"
  },
  {
    term: "Cholesterol",
    definition: "A waxy substance found in your blood. High levels can increase your risk of heart disease.",
    category: "Conditions"
  },
  {
    term: "Glucose",
    definition: "A type of sugar measuring the amount of sugar in your blood. High levels can indicate diabetes.",
    category: "Conditions"
  },
  {
    term: "Cardiovascular Disease (CVD)",
    definition: "A group of disorders of the heart and blood vessels, including coronary heart disease, cerebrovascular disease, and rheumatic heart disease.",
    category: "General"
  },
  {
    term: "Active Lifestyle",
    definition: "Engaging in regular physical activity, which strengthens the heart and improves blood circulation.",
    category: "Lifestyle"
  },
  {
    term: "Smoking",
    definition: "A major risk factor for cardiovascular disease. It damages the lining of the arteries and increases blood pressure.",
    category: "Lifestyle"
  },
  {
    term: "Alcohol Intake",
    definition: "Excessive alcohol consumption can lead to high blood pressure, heart failure, and stroke.",
    category: "Lifestyle"
  }
];
