import js from "@eslint/js";
import globals from "globals";

// O app é um único index.html com script inline; o lint cobre só os .js/.mjs (testes).
export default [
  { ignores: ["node_modules/"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: true }], // catch vazio é intencional
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" }],
    },
  },
];
