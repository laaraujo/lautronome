import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			includeAssets: [
				'robots.txt',
				'favicon.ico',
				'favicon-16x16.png',
				'favicon-32x32.png',
				'apple-touch-icon.png'
			],
			manifest: {
				name: 'Lautronome',
				short_name: 'Lautronome',
				description: 'A metronome with a built-in interval timer for practice.',
				theme_color: '#3b6cf3',
				background_color: '#ffffff',
				display: 'standalone',
				orientation: 'portrait',
				categories: ['music', 'productivity', 'utilities'],
				icons: [
					{ src: 'android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
					{ src: 'android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
					{
						src: 'android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				globPatterns: [
					'client/**/*.{js,css,ico,png,svg,webp,woff,woff2,xml,txt,webmanifest}'
				],
				navigateFallbackDenylist: [/\/_/, /\/[^/?]+\.[^/]+$/]
			},
			devOptions: {
				enabled: false
			}
		})
	]
});
