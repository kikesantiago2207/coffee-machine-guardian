export default defineConfig(({ mode }) => ({
  base: "/coffee-machine-guardian/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        404: "index.html",
      }
    }
  },
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
