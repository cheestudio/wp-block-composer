export default defineNuxtPlugin((nuxtApp) => {
	const conf = useRuntimeConfig();
	const gtagId = conf.public.gtagId;

	function gtag() {
		window.dataLayer.push(arguments);
	}

	window.dataLayer = window.dataLayer || [];

	gtag("js", new Date());
	gtag("config", gtagId);

	useHead({
		script: [
			{
				src: `https://www.googletagmanager.com/gtag/js?id=${gtagId}`,
				async: true,
			}
		]
	})
});