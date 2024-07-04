import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";


export default [
  {
    languageOptions: { 
      sourceType: 'commonjs',
      ecmaVersion: 2021
    }
  },
  pluginJs.configs.recommended,
  eslintConfigPrettier
];