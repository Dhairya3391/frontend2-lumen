export interface PatientData {
  age: number;
  gender: number; // 1=female, 2=male
  height: number; // cm
  weight: number; // kg
  ap_hi: number; // systolic
  ap_lo: number; // diastolic
  cholesterol: number; // 1, 2, 3
  gluc: number; // 1, 2, 3
  smoke: number; // 0, 1
  alco: number; // 0, 1
  active: number; // 0, 1
}

export interface PredictionResponse {
  prediction: number;
  probability: number;
  risk_level: string;
  message: string;
}

export interface ModelInfo {
    model_type: string;
    features: string[];
    n_features: number;
    description: string;
}
