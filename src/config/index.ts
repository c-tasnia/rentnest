import "dotenv/config";

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "dev-secret",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  sslcz: {
    storeId: process.env.SSLCZ_STORE_ID || "",
    storePassword: process.env.SSLCZ_STORE_PASSWORD || "",
    isLive: process.env.SSLCZ_IS_LIVE === "true",
  },
};
