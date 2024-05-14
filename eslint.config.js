/* eslint-disable no-undef */
import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

export default [
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  pluginReactConfig,
  eslintPluginPrettierRecommended,
];

