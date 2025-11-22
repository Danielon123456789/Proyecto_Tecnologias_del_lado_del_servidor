import js from "@eslint/js";
import parser from "@typescript-eslint/parser";
import tsplugin from "@typescript-eslint/eslint-plugin";
import securityPlugin from "eslint-plugin-security";

export default [
  {
    ignores: [
      "dist",
      "node_modules",
      "public",
      "*.js",
      "coverage",
      "src/__tests__" // opcional: ignora tests si no quieres analizarlos
    ],
  },

  js.configs.recommended,

  {
    files: ["src/**/*.ts"],

    languageOptions: {
      parser: parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        sourceType: "module",
      },
      globals: {
        // Node globals
        process: "readonly",
        console: "readonly",

        // Jest globals (para evitar 200+ errores en tests)
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        beforeAll: "readonly",
        afterEach: "readonly",
        afterAll: "readonly",
      },
    },

    plugins: {
      "@typescript-eslint": tsplugin,
      security: securityPlugin,
    },

    rules: {
      // Reglas de TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // Reglas de seguridad
      "security/detect-eval-with-expression": "error",
      "security/detect-non-literal-require": "warn",

      // General
      "no-console": "off",
    },
  }
];
