import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });
export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Keep visibility on weakly typed areas without blocking CI.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
