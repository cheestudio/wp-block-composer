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
	ssr: true,
	debug: false,
	runtimeConfig: {
		// Server-only — never exposed to client
		anthropicApiKey: '',
		glmApiKey: '',
		bundleDir: './.bundles',
		bundleTtlMs: 3600000,
		public: {
			gtagId: 'G-KWCRSCBW2D',
			siteUrl: 'https://wpblockcomposer.app',
		}
	},

	typescript: {
		strict: true
	},

	compatibilityDate: '2025-01-15',

})
