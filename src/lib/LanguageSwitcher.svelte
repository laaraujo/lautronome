<script lang="ts">
	import { Popover } from '@skeletonlabs/skeleton-svelte';
	import { i18n, type Lang } from '$lib/i18n.svelte';

	let open = $state(false);

	const options: ReadonlyArray<{ value: Lang; label: string }> = [
		{ value: 'en', label: 'English' },
		{ value: 'es', label: 'Español' }
	];

	const currentLabel = $derived(options.find((o) => o.value === i18n.lang)?.label ?? '');

	function pick(lang: Lang) {
		i18n.set(lang);
		open = false;
	}
</script>

<Popover
	{open}
	onOpenChange={(e) => (open = e.open)}
	positioning={{ placement: 'bottom-end', gutter: 8 }}
>
	<Popover.Trigger
		class="btn btn-sm preset-tonal-surface inline-flex items-center gap-1.5"
		aria-label={i18n.dict.language}
	>
		<span>{currentLabel}</span>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2.2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="size-3.5 transition-transform duration-150"
			class:rotate-180={open}
			aria-hidden="true"
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	</Popover.Trigger>
	<Popover.Positioner>
		<Popover.Content
			class="card preset-filled-surface-100-900 z-10 min-w-40 p-1 shadow-lg"
		>
			<ul role="listbox" aria-label={i18n.dict.language} class="flex flex-col gap-0.5">
				{#each options as opt (opt.value)}
					<li>
						<button
							type="button"
							role="option"
							aria-selected={i18n.lang === opt.value}
							class="btn w-full justify-start {i18n.lang === opt.value
								? 'preset-filled-primary-500'
								: 'hover:preset-tonal-surface'}"
							onclick={() => pick(opt.value)}
						>
							{opt.label}
						</button>
					</li>
				{/each}
			</ul>
		</Popover.Content>
	</Popover.Positioner>
</Popover>
