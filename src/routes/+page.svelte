<script lang="ts">
	import { onDestroy } from 'svelte';
	import { Slider, Switch, Progress } from '@skeletonlabs/skeleton-svelte';
	import { Metronome } from '$lib/metronome.svelte';
	import { i18n } from '$lib/i18n.svelte';
	import Lightswitch from '$lib/Lightswitch.svelte';
	import LanguageSwitcher from '$lib/LanguageSwitcher.svelte';

	const m = new Metronome();

	onDestroy(() => m.stop());

	const beatsPerMeasureOptions = [2, 3, 4, 6, 8] as const;

	const phaseProgressPct = $derived(
		m.phaseTotalMs > 0 ? ((m.phaseTotalMs - m.phaseRemainingMs) / m.phaseTotalMs) * 100 : 0
	);

	const totalLabel = $derived(m.infiniteRounds ? '∞' : String(m.totalRounds));

	const phaseAccent = $derived(
		m.phase === 'work'
			? 'text-primary-500'
			: m.phase === 'break'
				? 'text-warning-500'
				: 'text-surface-500'
	);

	function formatMs(ms: number): string {
		const total = Math.max(0, Math.ceil(ms / 1000));
		const mm = Math.floor(total / 60);
		const ss = total % 60;
		return `${mm}:${ss.toString().padStart(2, '0')}`;
	}

	function clampInt(value: number, min: number, max: number): number {
		if (Number.isNaN(value)) return min;
		return Math.max(min, Math.min(max, Math.round(value)));
	}
</script>

<svelte:head>
	<title>{i18n.dict.page_title}</title>
	<meta name="description" content={i18n.dict.meta_description} />
</svelte:head>

<main class="mx-auto flex min-h-screen w-full max-w-2xl flex-col gap-6 p-4 sm:p-8">
	<header
		class="flex flex-col-reverse gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
	>
		<div class="flex flex-col gap-1">
			<h1 class="h1 font-bold tracking-tight">Lautronome</h1>
			<p class="text-surface-500 text-sm">{i18n.dict.subtitle}</p>
		</div>
		<div class="flex items-center gap-3 self-end sm:self-auto">
			<LanguageSwitcher />
			<Lightswitch />
		</div>
	</header>

	<!-- Status card -->
	<section class="card preset-filled-surface-100-900 flex flex-col gap-4 p-6">
		<div class="flex items-baseline justify-end">
			<span class="text-surface-500 text-xs tracking-widest uppercase">
				{m.phase === 'idle'
					? i18n.dict.round_x_of_y("-", totalLabel)
					: i18n.dict.round_x_of_y(m.currentRound, totalLabel)}
			</span>
		</div>

		<div class="flex flex-col items-center gap-2 py-4">
			<div class="font-mono text-7xl font-bold tabular-nums {phaseAccent}">
				{m.phase === 'idle' ? `${m.bpm}` : formatMs(m.phaseRemainingMs)}
			</div>
			<div class="text-surface-500 text-sm">
				{m.phase === 'idle' ? i18n.dict.bpm : `${m.bpm} ${i18n.dict.bpm}`}
			</div>
		</div>

		<!-- Beat dots -->
		<div class="flex justify-center gap-2">
			{#each Array.from({ length: m.beatsPerMeasure }) as _, i (i)}
				{@const beatNum = i + 1}
				{@const active = m.phase === 'work' && m.currentBeat === beatNum}
				{@const accent = beatNum === 1}
				<div
					class="size-3 rounded-full transition-all duration-100"
					class:bg-primary-500={active}
					class:bg-surface-300-700={!active && !accent}
					class:bg-surface-400-600={!active && accent}
					class:scale-150={active}
				></div>
			{/each}
		</div>

		<!-- Phase progress bar -->
		<Progress value={phaseProgressPct} max={100} class="grid gap-2">
			<Progress.Track class="bg-surface-200-800 h-1.5">
				<Progress.Range class={m.phase === 'break' ? 'bg-warning-500' : 'bg-primary-500'} />
			</Progress.Track>
		</Progress>

		<button
			type="button"
			class="btn h-14 w-full text-lg font-semibold {m.isRunning
				? 'preset-filled-error-500'
				: 'preset-filled-primary-500'}"
			onclick={() => m.toggle()}
		>
			{m.isRunning ? i18n.dict.stop : i18n.dict.start}
		</button>
	</section>

	<!-- Settings card -->
	<section class="card preset-filled-surface-100-900 flex flex-col gap-6 p-6">
		<h2 class="h3 font-semibold">{i18n.dict.settings}</h2>

		<!-- BPM -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<label class="text-sm font-medium" for="bpm-input">{i18n.dict.tempo}</label>
				<input
					id="bpm-input"
					type="number"
					min="30"
					max="300"
					class="input preset-tonal-surface w-24 text-right"
					value={m.bpm}
					oninput={(e) => (m.bpm = clampInt(+e.currentTarget.value, 30, 300))}
				/>
			</div>
			<Slider
				value={[m.bpm]}
				min={30}
				max={240}
				step={1}
				onValueChange={(d) => (m.bpm = d.value[0])}
			>
				<Slider.Control>
					<Slider.Track class="bg-surface-200-800">
						<Slider.Range class="bg-primary-500" />
					</Slider.Track>
					<Slider.Thumb index={0} class="ring-primary-500">
						<Slider.HiddenInput />
					</Slider.Thumb>
				</Slider.Control>
			</Slider>
		</div>

		<!-- Beats per measure -->
		<div class="flex flex-col gap-2">
			<span class="text-sm font-medium">{i18n.dict.beats_per_measure}</span>
			<div class="flex gap-2">
				{#each beatsPerMeasureOptions as n (n)}
					<button
						type="button"
						class="btn flex-1 {m.beatsPerMeasure === n
							? 'preset-filled-primary-500'
							: 'preset-tonal-surface'}"
						disabled={m.isRunning}
						onclick={() => (m.beatsPerMeasure = n)}
					>
						{n}
					</button>
				{/each}
			</div>
		</div>

		<!-- Accent first beat -->
		<div class="flex items-center justify-between gap-3">
			<span class="text-sm font-medium">{i18n.dict.accent_first_beat}</span>
			<Switch
				checked={m.accentFirstBeat}
				onCheckedChange={(d) => (m.accentFirstBeat = d.checked)}
			>
				<Switch.Control>
					<Switch.Thumb />
				</Switch.Control>
				<Switch.HiddenInput />
			</Switch>
		</div>

		<!-- Round / break durations -->
		<div class="grid grid-cols-2 gap-4">
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium">{i18n.dict.round_duration}</span>
				<input
					type="number"
					min="1"
					max="3600"
					class="input preset-tonal-surface"
					value={m.workSeconds}
					disabled={m.isRunning}
					oninput={(e) => (m.workSeconds = clampInt(+e.currentTarget.value, 1, 3600))}
				/>
			</label>
			<label class="flex flex-col gap-1.5">
				<span class="text-sm font-medium">{i18n.dict.break_duration}</span>
				<input
					type="number"
					min="0"
					max="3600"
					class="input preset-tonal-surface"
					value={m.breakSeconds}
					disabled={m.isRunning}
					oninput={(e) => (m.breakSeconds = clampInt(+e.currentTarget.value, 0, 3600))}
				/>
			</label>
		</div>

		<!-- Rounds -->
		<div class="flex flex-col gap-2">
			<div class="flex items-center justify-between">
				<label class="text-sm font-medium" for="rounds-input">{i18n.dict.number_of_rounds}</label>
				<div class="flex items-center gap-3">
					<span class="text-surface-500 text-xs">{i18n.dict.infinite}</span>
					<Switch
						checked={m.infiniteRounds}
						disabled={m.isRunning}
						onCheckedChange={(d) => (m.infiniteRounds = d.checked)}
					>
						<Switch.Control>
							<Switch.Thumb />
						</Switch.Control>
						<Switch.HiddenInput />
					</Switch>
				</div>
			</div>
			<input
				id="rounds-input"
				type="number"
				min="1"
				max="99"
				class="input preset-tonal-surface"
				value={m.totalRounds}
				disabled={m.isRunning || m.infiniteRounds}
				oninput={(e) => (m.totalRounds = clampInt(+e.currentTarget.value, 1, 99))}
			/>
		</div>
	</section>

	<footer class="text-surface-500 mt-auto pt-4 text-center text-xs">
		{i18n.dict.made_by}
		<a
			href="https://github.com/laaraujo/"
			target="_blank"
			rel="noopener noreferrer"
			class="text-primary-500 hover:underline"
		>
			Lautaro Araujo
		</a>
	</footer>
</main>
