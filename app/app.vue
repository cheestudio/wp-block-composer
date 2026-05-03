<script setup lang="ts">
useHead({
	meta: [
		{ name: "viewport", content: "width=device-width, initial-scale=1" },
		{ name: "apple-mobile-web-app-title", content: "WP Block Composer" }
	],
	link: [
		{ rel: "icon", type: "image/png", href: "/favicon-96x96.png", sizes: "96x96" },
		{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
		{ rel: "shortcut icon", href: "/favicon.ico" },
		{ rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
		{ rel: "manifest", href: "/site.webmanifest" }
	],
	htmlAttrs: {
		lang: "en",
	}
});

useSeoMeta({
  title: 'WP Block Composer',
  description: 'Explore, compose and generate custom WordPress Blocks',
	ogImage: "/opengraph.png",
	twitterImage: "/opengraph.png",
	twitterCard: "summary_large_image",
	robots: 'index, follow',
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
