<script lang="ts">
	import { onMount } from 'svelte';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { i18n } from '$lib/i18n.svelte';

	let { children } = $props();

	onMount(() => {
		i18n.init();
	});
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
