import { defineConfig, Options } from "tsup";

const build: Options = {
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  entry: ["src/index.ts"],
  outDir: "dist",
  external: ["react"],
};

export default defineConfig(build);
