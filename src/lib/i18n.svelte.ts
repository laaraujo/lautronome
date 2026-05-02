export type Lang = 'en' | 'es' | 'fr' | 'pt' | 'zh' | 'hi';

const STORAGE_KEY = 'lang';

const dictionaries = {
	en: {
		page_title: 'Lautronome — metronome & timer',
		meta_description: 'A metronome with a built-in interval timer',
		subtitle: 'A metronome with a built-in interval timer',
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
		made_by: 'By',
		toggle_dark: 'Toggle dark mode',
		language: 'Language'
	},
	es: {
		page_title: 'Lautronome — metrónomo y temporizador',
		meta_description: 'Un metrónomo con temporizador de intervalos integrado',
		subtitle: 'Un metrónomo con temporizador de intervalos integrado',
		ready: 'Listo',
		round: 'Ronda',
		breakPhase: 'Descanso',
		bpm: 'BPM',
		round_x_of_y: (current: number | string, total: string) => `Ronda ${current} / ${total}`,
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
		made_by: 'Por',
		toggle_dark: 'Cambiar modo oscuro',
		language: 'Idioma'
	},
	fr: {
		page_title: 'Lautronome — métronome et minuteur',
		meta_description: "Un métronome avec minuteur d'intervalles intégré",
		subtitle: "Un métronome avec minuteur d'intervalles intégré",
		ready: 'Prêt',
		round: 'Round',
		breakPhase: 'Pause',
		bpm: 'BPM',
		round_x_of_y: (current: number | string, total: string) => `Round ${current} / ${total}`,
		settings: 'Paramètres',
		tempo: 'Tempo (BPM)',
		beats_per_measure: 'Pulsations par mesure',
		accent_first_beat: 'Accentuer le premier temps',
		round_duration: 'Durée du round (s)',
		break_duration: 'Durée de la pause (s)',
		number_of_rounds: 'Nombre de rounds',
		infinite: 'Infini',
		start: 'Démarrer',
		stop: 'Arrêter',
		made_by: 'Par',
		toggle_dark: 'Basculer le mode sombre',
		language: 'Langue'
	},
	pt: {
		page_title: 'Lautronome — metrónomo e temporizador',
		meta_description: 'Um metrónomo com temporizador de intervalos integrado',
		subtitle: 'Um metrónomo com temporizador de intervalos integrado',
		ready: 'Pronto',
		round: 'Ronda',
		breakPhase: 'Pausa',
		bpm: 'BPM',
		round_x_of_y: (current: number | string, total: string) => `Ronda ${current} / ${total}`,
		settings: 'Definições',
		tempo: 'Tempo (BPM)',
		beats_per_measure: 'Batidas por compasso',
		accent_first_beat: 'Acentuar a primeira batida',
		round_duration: 'Duração da ronda (s)',
		break_duration: 'Duração da pausa (s)',
		number_of_rounds: 'Número de rondas',
		infinite: 'Infinito',
		start: 'Iniciar',
		stop: 'Parar',
		made_by: 'Por',
		toggle_dark: 'Alternar modo escuro',
		language: 'Idioma'
	},
	zh: {
		page_title: 'Lautronome — 节拍器与计时器',
		meta_description: '内置间隔计时器的节拍器',
		subtitle: '内置间隔计时器的节拍器',
		ready: '准备',
		round: '回合',
		breakPhase: '休息',
		bpm: 'BPM',
		round_x_of_y: (current: number | string, total: string) => `第 ${current} / ${total} 回合`,
		settings: '设置',
		tempo: '速度 (BPM)',
		beats_per_measure: '每小节拍数',
		accent_first_beat: '强调第一拍',
		round_duration: '回合时长（秒）',
		break_duration: '休息时长（秒）',
		number_of_rounds: '回合数',
		infinite: '无限',
		start: '开始',
		stop: '停止',
		made_by: '作者',
		toggle_dark: '切换深色模式',
		language: '语言'
	},
	hi: {
		page_title: 'Lautronome — मेट्रोनोम और टाइमर',
		meta_description: 'अंतराल टाइमर के साथ मेट्रोनोम',
		subtitle: 'अंतराल टाइमर के साथ मेट्रोनोम',
		ready: 'तैयार',
		round: 'राउंड',
		breakPhase: 'विराम',
		bpm: 'BPM',
		round_x_of_y: (current: number | string, total: string) => `राउंड ${current} / ${total}`,
		settings: 'सेटिंग्स',
		tempo: 'टेम्पो (BPM)',
		beats_per_measure: 'प्रति माप बीट्स',
		accent_first_beat: 'पहली बीट पर ज़ोर',
		round_duration: 'राउंड अवधि (सेकंड)',
		break_duration: 'विराम अवधि (सेकंड)',
		number_of_rounds: 'राउंड की संख्या',
		infinite: 'अनंत',
		start: 'शुरू',
		stop: 'रोकें',
		made_by: 'द्वारा',
		toggle_dark: 'डार्क मोड बदलें',
		language: 'भाषा'
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
			if (saved && saved in dictionaries) {
				detected = saved;
			} else if (typeof navigator !== 'undefined') {
				const navLang = (navigator.language || '').toLowerCase();
				if (navLang.startsWith('es')) detected = 'es';
				else if (navLang.startsWith('fr')) detected = 'fr';
				else if (navLang.startsWith('pt')) detected = 'pt';
				else if (navLang.startsWith('zh')) detected = 'zh';
				else if (navLang.startsWith('hi')) detected = 'hi';
				else detected = 'en';
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
