import { defineConfig } from 'vite'
import EslintPlugin from 'vite-plugin-eslint'
import StylelintPlugin from 'vite-plugin-stylelint'

export default defineConfig({
	plugins: [StylelintPlugin(), EslintPlugin()]
})
