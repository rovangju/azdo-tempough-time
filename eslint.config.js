import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

const interfacesOnly = {
  rules: {
    "interfaces-only": {
      meta: {
        type: "problem",
        messages: {
          unexpected: "This file may contain only type-only imports and exported interfaces.",
        },
      },
      create(context) {
        return {
          Program(node) {
            for (const statement of node.body) {
              const typeOnlyImport = statement.type === "ImportDeclaration"
                && (statement.importKind === "type"
                  || (statement.specifiers.length > 0
                    && statement.specifiers.every((specifier) => specifier.importKind === "type")));
              const exportedInterface = statement.type === "ExportNamedDeclaration"
                && statement.declaration?.type === "TSInterfaceDeclaration";

              if (!typeOnlyImport && !exportedInterface) {
                context.report({ node: statement, messageId: "unexpected" });
              }
            }
          },
        };
      },
    },
  },
};

export default tseslint.config(
  { ignores: ["dist", "coverage", "artifacts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      curly: ["error", "all"],
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    },
  },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["src/domain.ts", "src/ports/**/*.ts"],
    plugins: {
      architecture: interfacesOnly,
    },
    rules: {
      "architecture/interfaces-only": "error",
    },
  },
);
