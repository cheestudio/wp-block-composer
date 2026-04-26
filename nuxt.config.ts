// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	modules: [
		'@nuxt/eslint',
		'@nuxt/ui',
		'@pinia/nuxt',
		'@nuxtjs/mdc',
		'motion-v/nuxt'
	],
	components: [
		{
			path: '~/components', 
			pathPrefix: false,
		},
	],
	mdc: {
		highlight: {
			theme: 'monokai',
			langs: ['ts', 'js', 'json', 'php'],
			wrapperStyle: "#0e121a"
		}
	},
	app: {
		pageTransition: { name: 'page', mode: 'out-in' },
	},
	// devtools: {
	// 	enabled: true
	// },
	css: ['~/assets/css/main.css'],
	debug: false,
	runtimeConfig: {
		// Server-only — never exposed to client
		anthropicApiKey: '',
		glmApiKey: '',
		claudeModel: 'claude-sonnet-4-20250514',
		claudeMaxTokens: 8000,
		bundleDir: './.bundles',
		bundleTtlMs: 3600000,
		public: {}
	},

	typescript: {
		strict: true
	},

	compatibilityDate: '2025-01-15',

})
