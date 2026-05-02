<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';

	let checked = $state(false);

	$effect(() => {
		if (typeof document === 'undefined') return;
		const mode = document.documentElement.getAttribute('data-mode') || 'light';
		checked = mode === 'dark';
	});

	function onCheckedChange(event: { checked: boolean }) {
		const mode = event.checked ? 'dark' : 'light';
		document.documentElement.setAttribute('data-mode', mode);
		try {
			localStorage.setItem('mode', mode);
		} catch {
			/* ignore (e.g. private mode) */
		}
		checked = event.checked;
	}
</script>

<Switch {checked} {onCheckedChange} aria-label="Toggle dark mode">
	<Switch.Control>
		<Switch.Thumb>
			<Switch.Context>
				{#snippet children(switch_)}
					{#if switch_().checked}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-3"
							aria-hidden="true"
						>
							<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
						</svg>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2.2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="size-3"
							aria-hidden="true"
						>
							<circle cx="12" cy="12" r="4" />
							<path d="M12 2v2" />
							<path d="M12 20v2" />
							<path d="m4.93 4.93 1.41 1.41" />
							<path d="m17.66 17.66 1.41 1.41" />
							<path d="M2 12h2" />
							<path d="M20 12h2" />
							<path d="m6.34 17.66-1.41 1.41" />
							<path d="m19.07 4.93-1.41 1.41" />
						</svg>
					{/if}
				{/snippet}
			</Switch.Context>
		</Switch.Thumb>
	</Switch.Control>
	<Switch.HiddenInput />
</Switch>
