export type Lang = 'en' | 'es';

const STORAGE_KEY = 'lang';

const dictionaries = {
	en: {
		page_title: 'Lautronome — metronome & timer',
		meta_description: 'A metronome with a built-in interval timer for practice rounds.',
		subtitle: 'A metronome with a built-in interval timer.',
		ready: 'Ready',
		round: 'Round',
		breakPhase: 'Break',
		bpm: 'BPM',
		round_x_of_y: (current: number | string, total: string) => `Round ${current} / ${total}`,
		settings: 'Settings',
		tempo: 'Tempo (BPM)',
		beats_per_measure: 'Beats per measure',
		accent_first_beat: 'Accent first beat',
		round_duration: 'Round duration (sec)',
		break_duration: 'Break duration (sec)',
		number_of_rounds: 'Number of rounds',
		infinite: 'Infinite',
		start: 'Start',
		stop: 'Stop',
		footer: 'Built with SvelteKit, Skeleton UI & the Web Audio API.',
		toggle_dark: 'Toggle dark mode',
		language: 'Language'
	},
	es: {
		page_title: 'Lautronome — metrónomo y temporizador',
		meta_description: 'Un metrónomo con temporizador de intervalos integrado para rondas de práctica.',
		subtitle: 'Un metrónomo con temporizador de intervalos integrado.',
		ready: 'Listo',
		round: 'Ronda',
		breakPhase: 'Descanso',
		bpm: 'BPM',
		round_x_of_y: (current: number | string, total: string) => `Round ${current} / ${total}`,
		settings: 'Ajustes',
		tempo: 'Tempo (BPM)',
		beats_per_measure: 'Pulsos por compás',
		accent_first_beat: 'Acentuar primer pulso',
		round_duration: 'Duración de ronda (s)',
		break_duration: 'Duración de descanso (s)',
		number_of_rounds: 'Número de rondas',
		infinite: 'Infinito',
		start: 'Empezar',
		stop: 'Detener',
		footer: 'Hecho con SvelteKit, Skeleton UI y la Web Audio API.',
		toggle_dark: 'Cambiar modo oscuro',
		language: 'Idioma'
	}
} as const satisfies Record<Lang, Record<string, unknown>>;

export type Dict = (typeof dictionaries)[Lang];

class I18n {
	/**
	 * Default language is 'en' so server-prerendered HTML matches the initial
	 * client render (no hydration mismatch). The actual user preference is
	 * applied in `init()` which runs after mount.
	 */
	lang = $state<Lang>('en');
	dict: Dict = $derived(dictionaries[this.lang]);

	init(): void {
		if (typeof document === 'undefined') return;
		let detected: Lang = 'en';
		try {
			const saved = localStorage.getItem(STORAGE_KEY) as Lang | null;
			if (saved === 'en' || saved === 'es') {
				detected = saved;
			} else if (typeof navigator !== 'undefined') {
				const navLang = (navigator.language || '').toLowerCase();
				detected = navLang.startsWith('es') ? 'es' : 'en';
			}
		} catch {
			/* ignore */
		}
		if (detected !== this.lang) {
			this.lang = detected;
		}
		document.documentElement.setAttribute('lang', detected);
	}

	set(lang: Lang): void {
		this.lang = lang;
		try {
			localStorage.setItem(STORAGE_KEY, lang);
		} catch {
			/* ignore */
		}
		if (typeof document !== 'undefined') {
			document.documentElement.setAttribute('lang', lang);
		}
	}
}

export const i18n = new I18n();
