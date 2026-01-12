import { PatientData, PredictionResponse, ModelInfo } from "./types";

const API_BASE_URL =
  "https://cardiovascular-disease-detector-backend.onrender.com";

export async function predictRisk(
  data: PatientData,
): Promise<PredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch prediction");
  }

  return response.json();
}

export async function getModelInfo(): Promise<ModelInfo> {
  const response = await fetch(`${API_BASE_URL}/model-info`);
  if (!response.ok) {
    throw new Error("Failed to fetch model info");
  }
  return response.json();
}
