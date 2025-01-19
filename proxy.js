import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";

const app = express();

// Enable CORS for all requests
app.use(cors());

// Proxy setup
app.use(
  "/api",
  createProxyMiddleware({
    target: "https://api.ambeedata.com",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // Strip "/api" from the path
    },
    onProxyReq: (proxyReq, req, res) => {
      // Set CORS headers explicitly
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    },
  })
);

const PORT = 5002;
app.listen(PORT, () => {
  console.log(`Proxy running on http://localhost:${PORT}`);
});
