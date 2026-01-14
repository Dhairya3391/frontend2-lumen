import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =
  "https://cardiovascular-disease-detector-backend.onrender.com";

export async function GET(request: NextRequest) {
  try {
    const startTime = Date.now();

    // Ping backend health endpoint
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: "GET",
    });

    const responseTime = Date.now() - startTime;
    const data = await response.json();

    if (!response.ok) {
      console.error("Backend health check failed:", response.status, data);
      return NextResponse.json(
        {
          success: false,
          error: "Backend returned error",
          status: response.status,
          timestamp: new Date().toISOString(),
        },
        { status: 500 },
      );
    }

    console.log(`✅ Backend is healthy - Response time: ${responseTime}ms`);

    return NextResponse.json({
      success: true,
      backend: data,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Failed to reach backend:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
