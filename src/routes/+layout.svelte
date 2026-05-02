<script lang="ts">
	import { onMount } from 'svelte';
	import { pwaInfo } from 'virtual:pwa-info';
	import './layout.css';
	import { i18n } from '$lib/i18n.svelte';

	let { children } = $props();

	const webManifestLink = $derived(pwaInfo ? pwaInfo.webManifest.linkTag : '');

	onMount(async () => {
		i18n.init();
		const { registerSW } = await import('virtual:pwa-register');
		registerSW({ immediate: true });
	});
</script>

<svelte:head>{@html webManifestLink}</svelte:head>
{@render children()}
