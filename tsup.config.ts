import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/error/index.ts",
    "src/core/engine.core.ts",
    "src/helper/types.helper.ts",
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
