import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from "dotenv";
import tailwindcss from "tailwindcss";

dotenv.config({ path: "./config.env" });
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  css: {
    postcss: {
        plugins: [tailwindcss()],
    },   
}, 
});