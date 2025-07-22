import antfu from "@antfu/eslint-config";

export default antfu(
  {
    type: "app",
    typescript: true,
    formatters: false,
    stylistic: {
      indent: 2,
      semi: true,
      quotes: "double",
    },
  },
  {
    ignores: ["README.md"],
    rules: {
      "ts/no-redeclare": "off",
      "ts/consistent-type-definitions": ["error", "interface"],
      "ts/consistent-type-imports": "off",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "antfu/no-top-level-await": ["off"],
      "node/prefer-global/process": ["off"],
      "perfectionist/sort-imports": "off",
      "perfectionist/sort-exports": "off",
      "dot-notation": [
        "error",
        {
          allowKeywords: true,
          allowPattern: "^[a-zA-Z_$][0-9a-zA-Z_$]*$",
        },
      ],
      "style/no-tabs": "off",
      "no-use-before-define": [
        "error",
        {
          functions: false,
          variables: true,
          classes: false,
          allowNamedExports: false,
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "unicorn/filename-case": [
        "error",
        {
          cases: {
            kebabCase: true,
          },
          ignore: ["README.md"],
        },
      ],
    },
  },
);
