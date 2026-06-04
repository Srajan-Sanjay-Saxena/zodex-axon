import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/core/index.ts",
    "src/error/index.ts",
    "src/utils/index.ts",
    "src/res/response.master.controller.ts",
  ],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  splitting: true,
  esbuildOptions(options) {
    options.alias = {
      "@core": "./src/core",
      "@error": "./src/error",
      "@utils": "./src/utils",
      "@helper": "./src/helper",
      "@res": "./src/res",
    };
  },
});
