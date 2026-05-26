/** @type {import('tailwindcss').Config} */
const boilerplateConfig = require('./src/core/theme/tailwind/tailwind.config')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: boilerplateConfig.theme,
  plugins: boilerplateConfig.plugins || []
}
