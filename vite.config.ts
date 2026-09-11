import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base =
    process.env.VITE_BASE_PATH || env.VITE_BASE_PATH || "/BarTallyWebsite/";
  if (!/^\/(?:[^/?#]+\/)*$/.test(base) || base.includes("..")) {
    throw new Error(
      "VITE_BASE_PATH must be an absolute path with a trailing slash, such as /BarTallyWebsite/ or /.",
    );
  }

  return {
    base,
    plugins: [react()],
    build: {
      target: "es2022",
      sourcemap: false,
    },
    server: { strictPort: true },
    preview: { strictPort: true },
  };
});
