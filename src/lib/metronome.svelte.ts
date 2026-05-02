export type MetronomePhase = 'idle' | 'work' | 'break';

interface QueuedBeat {
	beatInMeasure: number;
	ctxTime: number;
}

/**
 * Metronome engine with built-in interval timer.
 *
 * Audio scheduling uses the Web Audio API "lookahead" pattern (Chris Wilson):
 * a coarse JS timer wakes every 25ms and schedules any clicks due in the next
 * 100ms via AudioContext.currentTime, which is sample-accurate. This avoids
 * the drift you'd get from setInterval-driven playback.
 *
 * The class uses Svelte 5 runes ($state) for reactive UI fields and plain
 * private fields for the audio engine internals.
 */
export class Metronome {
	bpm = $state(100);
	beatsPerMeasure = $state(4);
	accentFirstBeat = $state(false);
	workSeconds = $state(60);
	breakSeconds = $state(30);
	totalRounds = $state(4);
	infiniteRounds = $state(false);

	phase = $state<MetronomePhase>('idle');
	currentRound = $state(0);
	currentBeat = $state(0);
	phaseRemainingMs = $state(0);
	phaseTotalMs = $state(0);

	#ctx: AudioContext | null = null;
	#scheduleInterval: ReturnType<typeof setInterval> | null = null;
	#uiInterval: ReturnType<typeof setInterval> | null = null;
	#phaseTimeout: ReturnType<typeof setTimeout> | null = null;
	#nextBeatTime = 0;
	#beatCounter = 0;
	#phaseEndsAtCtx = 0;
	#phaseEndsAtPerf = 0;
	#queuedBeats: QueuedBeat[] = [];

	get isRunning(): boolean {
		return this.phase !== 'idle';
	}

	start(): void {
		if (this.phase !== 'idle') return;
		if (typeof window === 'undefined') return;
		this.#ctx ??= new AudioContext();
		void this.#ctx.resume();
		this.currentRound = 1;
		this.#uiInterval = setInterval(() => this.#uiTick(), 50);
		this.#startWorkPhase();
	}

	stop(): void {
		this.#clearTimers();
		this.phase = 'idle';
		this.currentRound = 0;
		this.currentBeat = 0;
		this.phaseRemainingMs = 0;
		this.phaseTotalMs = 0;
		this.#queuedBeats = [];
	}

	toggle(): void {
		if (this.phase === 'idle') this.start();
		else this.stop();
	}

	#startWorkPhase(): void {
		const ctx = this.#ctx;
		if (!ctx) return;
		this.phase = 'work';
		this.currentBeat = 0;
		this.#beatCounter = 0;
		this.#queuedBeats = [];

		const startOffset = 0.1;
		this.#nextBeatTime = ctx.currentTime + startOffset;
		this.#phaseEndsAtCtx = ctx.currentTime + this.workSeconds + startOffset;
		this.#phaseEndsAtPerf = performance.now() + this.workSeconds * 1000;
		this.phaseTotalMs = this.workSeconds * 1000;
		this.phaseRemainingMs = this.workSeconds * 1000;

		this.#scheduleInterval = setInterval(() => this.#scheduler(), 25);
		this.#phaseTimeout = setTimeout(() => this.#endWorkPhase(), this.workSeconds * 1000);
	}

	#endWorkPhase(): void {
		if (this.#scheduleInterval) clearInterval(this.#scheduleInterval);
		this.#scheduleInterval = null;
		this.currentBeat = 0;
		this.#queuedBeats = [];

		const isLast = !this.infiniteRounds && this.currentRound >= this.totalRounds;
		if (isLast) {
			this.stop();
			return;
		}
		if (this.breakSeconds > 0) {
			this.#startBreakPhase();
		} else {
			this.currentRound += 1;
			this.#startWorkPhase();
		}
	}

	#startBreakPhase(): void {
		this.phase = 'break';
		this.currentBeat = 0;
		this.#phaseEndsAtPerf = performance.now() + this.breakSeconds * 1000;
		this.phaseTotalMs = this.breakSeconds * 1000;
		this.phaseRemainingMs = this.breakSeconds * 1000;
		this.#phaseTimeout = setTimeout(() => this.#endBreakPhase(), this.breakSeconds * 1000);
	}

	#endBreakPhase(): void {
		this.currentRound += 1;
		this.#startWorkPhase();
	}

	#scheduler(): void {
		const ctx = this.#ctx;
		if (!ctx) return;
		const lookaheadHorizon = ctx.currentTime + 0.1;
		while (this.#nextBeatTime < lookaheadHorizon) {
			if (this.#nextBeatTime >= this.#phaseEndsAtCtx) break;
			const beatInMeasure = (this.#beatCounter % this.beatsPerMeasure) + 1;
			const accent = this.accentFirstBeat && beatInMeasure === 1;
			this.#scheduleClick(this.#nextBeatTime, accent);
			this.#queuedBeats.push({ beatInMeasure, ctxTime: this.#nextBeatTime });
			this.#nextBeatTime += 60 / this.bpm;
			this.#beatCounter += 1;
		}
	}

	#scheduleClick(when: number, accent: boolean): void {
		const ctx = this.#ctx;
		if (!ctx) return;
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = 'square';
		osc.frequency.value = accent ? 1500 : 900;
		gain.gain.setValueAtTime(0, when);
		gain.gain.linearRampToValueAtTime(accent ? 0.5 : 0.3, when + 0.001);
		gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);
		osc.connect(gain).connect(ctx.destination);
		osc.start(when);
		osc.stop(when + 0.06);
	}

	#uiTick(): void {
		const ctx = this.#ctx;
		if (!ctx) return;
		while (this.#queuedBeats.length > 0 && this.#queuedBeats[0].ctxTime <= ctx.currentTime) {
			const beat = this.#queuedBeats.shift();
			if (beat) this.currentBeat = beat.beatInMeasure;
		}
		this.phaseRemainingMs = Math.max(0, this.#phaseEndsAtPerf - performance.now());
	}

	#clearTimers(): void {
		if (this.#scheduleInterval) clearInterval(this.#scheduleInterval);
		if (this.#uiInterval) clearInterval(this.#uiInterval);
		if (this.#phaseTimeout) clearTimeout(this.#phaseTimeout);
		this.#scheduleInterval = null;
		this.#uiInterval = null;
		this.#phaseTimeout = null;
	}
}
