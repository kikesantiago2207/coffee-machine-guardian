import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// IMPORTS CORRECTOS PARA ESM
import fs from "fs";

export default defineConfig(({ mode }) => ({
  base: "/coffee-machine-guardian/", // Para GitHub Pages

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),
    mode === "development" && componentTagger(),

    // Plugin para copiar index.html → 404.html
    {
      name: "copy-404",
      closeBundle() {
        const indexPath = path.resolve("dist/index.html");
        const notFoundPath = path.resolve("dist/404.html");

        if (fs.existsSync(indexPath)) {
          fs.copyFileSync(indexPath, notFoundPath);
          console.log("✔ 404.html generado correctamente");
        } else {
          console.log("⚠ No se encontró dist/index.html");
        }
      },
    },
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
