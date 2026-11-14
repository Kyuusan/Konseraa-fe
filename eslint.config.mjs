import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Vendored Animate UI registry code, installed as-is through the shadcn CLI.
    // Its controlled-state patterns trip the React Compiler rules; the compiler
    // simply skips these components, so they are excluded instead of rewritten.
    files: [
      "src/components/animate-ui/**",
      "src/hooks/use-auto-height.tsx",
      "src/hooks/use-controlled-state.tsx",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
