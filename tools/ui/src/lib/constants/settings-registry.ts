import { ColorMode } from '$lib/enums/ui.enums';
import { SettingsFieldType } from '$lib/enums/settings.enums';
import { SyncableParameterType } from '$lib/enums';
import {
	Funnel,
	AlertTriangle,
	Code,
	Monitor,
	ListRestart,
	Sliders,
	PencilRuler,
	Database,
	Monitor as MonitorIcon,
	Sun,
	Moon
} from '@lucide/svelte';
import type { Component } from 'svelte';
import type {
	SettingsConfigValue,
	SyncableParameter,
	SettingsEntry,
	SettingsSectionTitle,
	SettingsSectionEntry,
	SettingsSection
} from '$lib/types';
import { CLI_FLAGS, DEFAULT_MCP_CONFIG } from '$lib/constants';
import McpLogo from '$lib/components/app/mcp/McpLogo.svelte';
import { SETTINGS_KEYS } from './settings-keys';
import { ROUTES, SETTINGS_SECTION_SLUGS } from './routes';
import { TITLE_GENERATION } from './title-generation';

export const SETTINGS_SECTION_TITLES = {
	GENERAL: '一般',
	DISPLAY: '表示',
	SAMPLING: 'サンプリング',
	PENALTIES: 'ペナルティ',
	AGENTIC: 'エージェント',
	TOOLS: 'ツール',
	MCP: 'MCP',
	IMPORT_EXPORT: 'インポート/エクスポート',
	DEVELOPER: '開発者'
} as const;

const STANDALONE_SECTIONS: { title: SettingsSectionTitle; slug: string; icon: Component }[] = [
	{ title: SETTINGS_SECTION_TITLES.TOOLS, slug: SETTINGS_SECTION_SLUGS.TOOLS, icon: PencilRuler },
	{
		title: SETTINGS_SECTION_TITLES.IMPORT_EXPORT,
		slug: SETTINGS_SECTION_SLUGS.IMPORT_EXPORT,
		icon: Database
	}
];

const COLOR_MODE_OPTIONS: Array<{ value: string; label: string; icon: Component }> = [
	{ value: ColorMode.SYSTEM, label: 'システム', icon: MonitorIcon },
	{ value: ColorMode.LIGHT, label: 'ライト', icon: Sun },
	{ value: ColorMode.DARK, label: 'ダーク', icon: Moon }
];

const SETTINGS_REGISTRY: Record<string, SettingsSectionEntry> = {
	[SETTINGS_SECTION_SLUGS.GENERAL]: {
		title: SETTINGS_SECTION_TITLES.GENERAL,
		slug: SETTINGS_SECTION_SLUGS.GENERAL,
		icon: Sliders,
		settings: [
			{
				key: SETTINGS_KEYS.THEME,
				label: 'テーマ',
				help: 'インターフェースのカラーテーマを選択します。システム（デバイスの設定に従います）、ライト、ダークから選べます。',
				defaultValue: ColorMode.SYSTEM,
				type: SettingsFieldType.SELECT,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				options: COLOR_MODE_OPTIONS,
				sync: { serverKey: SETTINGS_KEYS.THEME, paramType: SyncableParameterType.STRING }
			},
			{
				key: SETTINGS_KEYS.API_KEY,
				label: 'API キー',
				help: `サーバーで <code> ${CLI_FLAGS.API_KEY} </code> オプションを使用している場合は API キーを設定してください。`,
				defaultValue: '',
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.GENERAL
			},
			{
				key: SETTINGS_KEYS.SYSTEM_MESSAGE,
				label: 'システムメッセージ',
				help: 'モデルの振る舞いを定義する最初のメッセージです。',
				defaultValue: '',
				type: SettingsFieldType.TEXTAREA,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				sync: {
					serverKey: SETTINGS_KEYS.SYSTEM_MESSAGE,
					paramType: SyncableParameterType.STRING
				}
			},
			{
				key: SETTINGS_KEYS.PASTE_LONG_TEXT_TO_FILE_LEN,
				label: '長文をファイルに変換する文字数',
				help: '長いテキストを貼り付けると、ファイルに変換されます。このパラメータの値を設定することでファイルに変換する文字数を制御できます。値が 0 の場合は無効になります。',
				defaultValue: 2500,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				sync: {
					serverKey: SETTINGS_KEYS.PASTE_LONG_TEXT_TO_FILE_LEN,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.SEND_ON_ENTER,
				label: 'Enter キーでメッセージを送信',
				help: 'Enter キーでメッセージを送信し、Shift + Enter で改行します。無効にした場合は Ctrl/Cmd + Enter を使用します。',
				defaultValue: true,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				sync: {
					serverKey: SETTINGS_KEYS.SEND_ON_ENTER,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.COPY_TEXT_ATTACHMENTS_AS_PLAIN_TEXT,
				label: 'テキスト添付ファイルをプレーンテキストとしてコピー',
				help: 'テキスト添付ファイルを含むメッセージをコピーする際、添付ファイルとして貼り付け直せる特殊な形式ではなく、単一のプレーンテキスト文字列に結合します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				sync: {
					serverKey: SETTINGS_KEYS.COPY_TEXT_ATTACHMENTS_AS_PLAIN_TEXT,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.ENABLE_CONTINUE_GENERATION,
				label: '「続行」ボタンを有効化',
				help: '推論モデルを含むアシスタントメッセージで「続行」ボタンを有効にします。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				isExperimental: true,
				sync: {
					serverKey: SETTINGS_KEYS.ENABLE_CONTINUE_GENERATION,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.PDF_AS_IMAGE,
				label: 'PDF を画像として解析',
				help: 'PDF をテキストではなく画像として解析します。ビジョン非対応モデルの場合は自動的にテキスト処理にフォールバックします。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				sync: {
					serverKey: SETTINGS_KEYS.PDF_AS_IMAGE,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.ASK_FOR_TITLE_CONFIRMATION,
				label: '会話タイトルを変更する前に確認する',
				help: '最初のメッセージを編集する際、会話タイトルを自動的に変更する前に確認します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				sync: {
					serverKey: SETTINGS_KEYS.ASK_FOR_TITLE_CONFIRMATION,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.TITLE_GENERATION_USE_FIRST_LINE,
				label: '会話タイトルに最初の空でない行を使用',
				help: '会話タイトルの生成に、プロンプトの最初の空でない行のみを使用します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				sync: {
					serverKey: SETTINGS_KEYS.TITLE_GENERATION_USE_FIRST_LINE,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.TITLE_GENERATION_USE_LLM,
				label: 'LLM で会話タイトルを生成',
				help: '最初のメッセージのやり取りに基づいて、LLM で会話タイトルを自動生成します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.GENERAL,
				isExperimental: true
			},
			{
				key: SETTINGS_KEYS.TITLE_GENERATION_PROMPT,
				label: 'LLM タイトル生成プロンプト',
				help: 'タイトル生成プロンプトの任意のテンプレートです。ユーザーメッセージには {{USER}}、アシスタントメッセージには {{ASSISTANT}} を使用します。',
				defaultValue: TITLE_GENERATION.DEFAULT_PROMPT,
				type: SettingsFieldType.TEXTAREA,
				section: SETTINGS_SECTION_SLUGS.GENERAL
			},
			{
				key: SETTINGS_KEYS.MAX_IMAGE_RESOLUTION,
				label: '最大画像解像度（メガピクセル）',
				help: 'これより大きい画像は、サーバーに送信する前にリサイズされます。0 に設定すると無効になります。',
				defaultValue: 0,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.GENERAL
			}
		]
	},
	[SETTINGS_SECTION_SLUGS.DISPLAY]: {
		title: SETTINGS_SECTION_TITLES.DISPLAY,
		slug: SETTINGS_SECTION_SLUGS.DISPLAY,
		icon: Monitor,
		settings: [
			{
				key: SETTINGS_KEYS.SHOW_MESSAGE_STATS,
				label: 'メッセージ生成の統計を表示',
				help: '各アシスタントメッセージの下に生成統計（トークン/秒、トークン数、所要時間）を表示します。',
				defaultValue: true,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.SHOW_MESSAGE_STATS,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.SHOW_THOUGHT_IN_PROGRESS,
				label: '思考過程を表示',
				help: 'メッセージの生成中、思考過程をデフォルトで展開します。',
				defaultValue: true,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.SHOW_THOUGHT_IN_PROGRESS,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.SHOW_TOOL_CALL_IN_PROGRESS,
				label: 'ツール呼び出しを表示',
				help: '実行中にツール呼び出しの詳細を自動的に展開し、完了後も展開したままにします。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.SHOW_TOOL_CALL_IN_PROGRESS,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.KEEP_STATS_VISIBLE,
				label: '生成後も統計を表示し続ける',
				help: '生成が終了した後も処理統計を表示し続けます。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.KEEP_STATS_VISIBLE,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.AUTO_MIC_ON_EMPTY,
				label: '入力が空のときにマイクを表示',
				help: '音声モダリティに対応したモデルで、テキストエリアが空のときに送信ボタンの代わりにマイクボタンを自動的に表示します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				isExperimental: true,
				sync: {
					serverKey: SETTINGS_KEYS.AUTO_MIC_ON_EMPTY,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.RENDER_USER_CONTENT_AS_MARKDOWN,
				label: 'ユーザーの内容を Markdown で表示',
				help: 'チャット内でユーザーメッセージを Markdown 形式で表示します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.RENDER_USER_CONTENT_AS_MARKDOWN,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.FULL_HEIGHT_CODE_BLOCKS,
				label: 'コードブロックの高さ制限を解除',
				help: '高さ制限を無視して、コードブロックを常に本来の高さで表示します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.FULL_HEIGHT_CODE_BLOCKS,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.DISABLE_AUTO_SCROLL,
				label: '自動スクロールを無効化',
				help: 'メッセージのストリーミング中の自動スクロールを無効にし、表示位置を手動で制御できるようにします。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.DISABLE_AUTO_SCROLL,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.ALWAYS_SHOW_SIDEBAR_ON_DESKTOP,
				label: 'デスクトップで常にサイドバーを表示',
				help: 'デスクトップで自動的に隠す代わりに、サイドバーを常に表示し続けます。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.ALWAYS_SHOW_SIDEBAR_ON_DESKTOP,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.SHOW_RAW_MODEL_NAMES,
				label: 'モデル名を生のまま表示',
				help: 'バッジ付きの解析されたモデル名の代わりに、完全な生のモデル識別子（例: "ggml-org/GLM-4.7-Flash-GGUF:Q8_0"）を表示します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.SHOW_RAW_MODEL_NAMES,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.SHOW_MODEL_QUANTIZATION,
				label: 'モデルの量子化情報を表示',
				help: 'インターフェース全体で、モデル名の横に量子化バッジ（例: Q8_0、Q4_K_M）を表示します。',
				defaultValue: true,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.SHOW_MODEL_QUANTIZATION,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.SHOW_MODEL_TAGS,
				label: 'モデルタグを表示',
				help: 'インターフェース全体で、モデル名の横にモデルタグ（例: "vision"、"reasoning"）を表示します。',
				defaultValue: true,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.SHOW_MODEL_TAGS,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.ALWAYS_SHOW_AGENTIC_TURNS,
				label: '会話でエージェントのターンを常に表示',
				help: '会話メッセージ内のエージェントループのターンを常に展開して表示します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DISPLAY,
				sync: {
					serverKey: SETTINGS_KEYS.ALWAYS_SHOW_AGENTIC_TURNS,
					paramType: SyncableParameterType.BOOLEAN
				}
			}
		]
	},
	[SETTINGS_SECTION_SLUGS.SAMPLING]: {
		title: SETTINGS_SECTION_TITLES.SAMPLING,
		slug: SETTINGS_SECTION_SLUGS.SAMPLING,
		icon: Funnel,
		settings: [
			{
				key: SETTINGS_KEYS.TEMPERATURE,
				label: '温度',
				help: '出力トークンの確率分布に影響を与えることで、生成されるテキストのランダム性を制御します。高いほどランダムに、低いほど集中的になります。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: {
					serverKey: SETTINGS_KEYS.TEMPERATURE,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.DYNATEMP_RANGE,
				label: '動的温度の範囲',
				help: '温度サンプラーのアドオンです。トークンのエントロピーによって確率を調整する動的温度の範囲に加算される値です。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: {
					serverKey: SETTINGS_KEYS.DYNATEMP_RANGE,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.DYNATEMP_EXPONENT,
				label: '動的温度の指数',
				help: '温度サンプラーのアドオンです。最も確率の高いトークンに基づいて確率分布を調整します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: {
					serverKey: SETTINGS_KEYS.DYNATEMP_EXPONENT,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.TOP_K,
				label: 'Top K',
				help: '上位 k 個のトークンのみを保持します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: { serverKey: SETTINGS_KEYS.TOP_K, paramType: SyncableParameterType.NUMBER }
			},
			{
				key: SETTINGS_KEYS.TOP_P,
				label: 'Top P',
				help: '累積確率が少なくとも p になるトークンのみに制限します',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: { serverKey: SETTINGS_KEYS.TOP_P, paramType: SyncableParameterType.NUMBER }
			},
			{
				key: SETTINGS_KEYS.MIN_P,
				label: 'Min P',
				help: '最も可能性の高いトークンの確率に対して、トークンが考慮される最小確率に基づいてトークンを制限します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: { serverKey: SETTINGS_KEYS.MIN_P, paramType: SyncableParameterType.NUMBER }
			},
			{
				key: SETTINGS_KEYS.XTC_PROBABILITY,
				label: 'XTC 確率',
				help: 'XTC サンプラーは上位トークンを除外します。このパラメータはトークンを除外する確率そのものを制御します。0 で XTC を無効にします。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: {
					serverKey: SETTINGS_KEYS.XTC_PROBABILITY,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.XTC_THRESHOLD,
				label: 'XTC しきい値',
				help: 'XTC サンプラーは上位トークンを除外します。このパラメータは、トークンを除外するために必要なトークン確率を制御します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: {
					serverKey: SETTINGS_KEYS.XTC_THRESHOLD,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.TYP_P,
				label: 'Typical P',
				help: '対数確率とエントロピーの差に基づいてトークンをソートして制限します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: { serverKey: SETTINGS_KEYS.TYP_P, paramType: SyncableParameterType.NUMBER }
			},
			{
				key: SETTINGS_KEYS.MAX_TOKENS,
				label: '最大トークン数',
				help: '出力あたりの最大トークン数です。無制限にするには -1 を使用します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: {
					serverKey: SETTINGS_KEYS.MAX_TOKENS,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.SAMPLERS,
				label: 'サンプラー',
				help: 'サンプラーを適用する順序を簡略化した形式で指定します。デフォルトは "top_k;typ_p;top_p;min_p;temperature" です: top_k->typ_p->top_p->min_p->temperature',
				defaultValue: '',
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: { serverKey: SETTINGS_KEYS.SAMPLERS, paramType: SyncableParameterType.STRING }
			},
			{
				key: SETTINGS_KEYS.BACKEND_SAMPLING,
				label: 'バックエンドサンプリング',
				help: 'バックエンドベースのサンプラーを有効にします。有効にすると、対応するサンプラーがアクセラレータバックエンド上で実行され、サンプリングが高速になります。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.SAMPLING,
				sync: {
					serverKey: SETTINGS_KEYS.BACKEND_SAMPLING,
					paramType: SyncableParameterType.BOOLEAN
				}
			}
		]
	},
	[SETTINGS_SECTION_SLUGS.PENALTIES]: {
		title: SETTINGS_SECTION_TITLES.PENALTIES,
		slug: SETTINGS_SECTION_SLUGS.PENALTIES,
		icon: AlertTriangle,
		settings: [
			{
				key: SETTINGS_KEYS.REPEAT_LAST_N,
				label: '繰り返しを考慮する直近トークン数',
				help: '繰り返しにペナルティを課す際に考慮する直近 n トークン',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.PENALTIES,
				sync: {
					serverKey: SETTINGS_KEYS.REPEAT_LAST_N,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.REPEAT_PENALTY,
				label: '繰り返しペナルティ',
				help: '生成されるテキスト内のトークン列の繰り返しを制御します',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.PENALTIES,
				sync: {
					serverKey: SETTINGS_KEYS.REPEAT_PENALTY,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.PRESENCE_PENALTY,
				label: '出現ペナルティ',
				help: 'トークンが出力に現れたかどうかに基づいてトークンを制限します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.PENALTIES,
				sync: {
					serverKey: SETTINGS_KEYS.PRESENCE_PENALTY,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.FREQUENCY_PENALTY,
				label: '頻度ペナルティ',
				help: 'トークンが出力に現れる頻度に基づいてトークンを制限します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.PENALTIES,
				sync: {
					serverKey: SETTINGS_KEYS.FREQUENCY_PENALTY,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.DRY_MULTIPLIER,
				label: 'DRY 乗数',
				help: 'DRY サンプリングは、長いコンテキストにわたっても生成テキストの繰り返しを減らします。このパラメータは DRY サンプリングの乗数を設定します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.PENALTIES,
				sync: {
					serverKey: SETTINGS_KEYS.DRY_MULTIPLIER,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.DRY_BASE,
				label: 'DRY 基準値',
				help: 'DRY サンプリングは、長いコンテキストにわたっても生成テキストの繰り返しを減らします。このパラメータは DRY サンプリングの基準値を設定します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.PENALTIES,
				sync: { serverKey: SETTINGS_KEYS.DRY_BASE, paramType: SyncableParameterType.NUMBER }
			},
			{
				key: SETTINGS_KEYS.DRY_ALLOWED_LENGTH,
				label: 'DRY 許容長',
				help: 'DRY サンプリングは、長いコンテキストにわたっても生成テキストの繰り返しを減らします。このパラメータは DRY サンプリングの許容長を設定します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.PENALTIES,
				sync: {
					serverKey: SETTINGS_KEYS.DRY_ALLOWED_LENGTH,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.DRY_PENALTY_LAST_N,
				label: 'DRY ペナルティの直近トークン数',
				help: 'DRY サンプリングは、長いコンテキストにわたっても生成テキストの繰り返しを減らします。このパラメータは直近 n トークンに対する DRY ペナルティを設定します。',
				defaultValue: undefined,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.PENALTIES,
				sync: {
					serverKey: SETTINGS_KEYS.DRY_PENALTY_LAST_N,
					paramType: SyncableParameterType.NUMBER
				}
			}
		]
	},
	[SETTINGS_SECTION_SLUGS.AGENTIC]: {
		title: SETTINGS_SECTION_TITLES.AGENTIC,
		slug: SETTINGS_SECTION_SLUGS.AGENTIC,
		icon: ListRestart,
		settings: [
			{
				key: SETTINGS_KEYS.AGENTIC_MAX_TURNS,
				label: 'エージェントのターン数',
				help: '停止するまでのツール実行サイクルの最大数です（無限ループを防ぎます）。',
				defaultValue: 10,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.AGENTIC,
				isPositiveInteger: true,
				sync: {
					serverKey: SETTINGS_KEYS.AGENTIC_MAX_TURNS,
					paramType: SyncableParameterType.NUMBER
				}
			},
			{
				key: SETTINGS_KEYS.AGENTIC_MAX_TOOL_PREVIEW_LINES,
				label: 'ツールプレビューあたりの最大行数',
				help: 'ツール出力プレビューに表示される行数（直近 N 行）です。エージェントループの完了後は、これらのプレビューと最終的な LLM の応答のみが保持されます。',
				defaultValue: 25,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.AGENTIC,
				isPositiveInteger: true,
				sync: {
					serverKey: SETTINGS_KEYS.AGENTIC_MAX_TOOL_PREVIEW_LINES,
					paramType: SyncableParameterType.NUMBER
				}
			}
		]
	},
	[SETTINGS_SECTION_SLUGS.DEVELOPER]: {
		title: SETTINGS_SECTION_TITLES.DEVELOPER,
		slug: SETTINGS_SECTION_SLUGS.DEVELOPER,
		icon: Code,
		settings: [
			{
				key: SETTINGS_KEYS.PRE_ENCODE_CONVERSATION,
				label: '応答後に KV キャッシュを先読み',
				help: '各応答の後、会話を再送信してサーバーの KV キャッシュを先読みします。応答を読んでいる間にプロンプトがエンコードされるため、次のターンが高速になります。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DEVELOPER
			},
			{
				key: SETTINGS_KEYS.DISABLE_REASONING_PARSING,
				label: '推論内容の解析を無効化',
				help: 'reasoning_format=none を送信して、サーバーが思考トークンを別フィールドに抽出する代わりにインラインで返すようにします。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DEVELOPER
			},
			{
				key: SETTINGS_KEYS.EXCLUDE_REASONING_FROM_CONTEXT,
				label: 'コンテキストから推論を除外',
				help: '送信前に以前のメッセージから思考を取り除きます。オフの場合、思考は reasoning_content フィールドを通じて送り返され、モデルはターンをまたいで自身の思考の連鎖を参照できます。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DEVELOPER,
				sync: {
					serverKey: SETTINGS_KEYS.EXCLUDE_REASONING_FROM_CONTEXT,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.ENABLE_THINKING,
				label: '思考を有効化',
				help: 'リクエストごとにモデルの思考・推論を有効にします。オフの場合、モデルは思考フェーズをスキップして直接応答します。',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DEVELOPER
			},
			{
				key: SETTINGS_KEYS.SHOW_RAW_OUTPUT_SWITCH,
				label: '生出力の切り替えを有効化',
				help: 'Markdown 形式の内容の代わりにメッセージをプレーンテキストで表示する切り替えボタンを表示します',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DEVELOPER,
				sync: {
					serverKey: SETTINGS_KEYS.SHOW_RAW_OUTPUT_SWITCH,
					paramType: SyncableParameterType.BOOLEAN
				}
			},
			{
				key: SETTINGS_KEYS.JS_SANDBOX_ENABLED,
				label: 'JavaScript sandbox tool',
				help: 'Expose a run_javascript tool to the model. Code runs in a Web Worker inside a sandboxed iframe with an opaque origin, isolated from the WebUI and its API, with a hard timeout.',
				defaultValue: false,
				type: SettingsFieldType.CHECKBOX,
				section: SETTINGS_SECTION_SLUGS.DEVELOPER
			},
			{
				key: SETTINGS_KEYS.CUSTOM_JSON,
				label: 'カスタム JSON',
				help: 'API に送信するカスタム JSON パラメータです。有効な JSON 形式である必要があります。',
				defaultValue: '',
				type: SettingsFieldType.TEXTAREA,
				section: SETTINGS_SECTION_SLUGS.DEVELOPER
			},
			{
				key: SETTINGS_KEYS.CUSTOM_CSS,
				label: 'カスタム CSS',
				help: '実行時にページに挿入される CSS です。ここで設定するか、--ui-config の customCss フィールドを通じてサーバー側で配信します。',
				defaultValue: '',
				type: SettingsFieldType.TEXTAREA,
				section: SETTINGS_SECTION_SLUGS.DEVELOPER,
				sync: {
					serverKey: SETTINGS_KEYS.CUSTOM_CSS,
					paramType: SyncableParameterType.STRING
				}
			}
		]
	},
	[SETTINGS_SECTION_SLUGS.MCP]: {
		title: SETTINGS_SECTION_TITLES.MCP,
		slug: SETTINGS_SECTION_SLUGS.MCP,
		icon: McpLogo,
		settings: [
			{
				key: SETTINGS_KEYS.MCP_REQUEST_TIMEOUT_SECONDS,
				label: 'リクエストタイムアウト（秒）',
				help: '個々の MCP ツール呼び出しのデフォルトのタイムアウトです。サーバーごとに上書きできます。',
				defaultValue: DEFAULT_MCP_CONFIG.requestTimeoutSeconds,
				type: SettingsFieldType.INPUT,
				section: SETTINGS_SECTION_SLUGS.MCP,
				isPositiveInteger: true
			}
		]
	}
} as const;

const NON_UI_SETTINGS: SettingsEntry[] = [
	{
		key: SETTINGS_KEYS.SHOW_SYSTEM_MESSAGE,
		label: 'システムメッセージを表示',
		help: '各会話の先頭にシステムメッセージを表示します。',
		defaultValue: true,
		type: SettingsFieldType.CHECKBOX,
		sync: {
			serverKey: SETTINGS_KEYS.SHOW_SYSTEM_MESSAGE,
			paramType: SyncableParameterType.BOOLEAN
		}
	},
	{
		key: SETTINGS_KEYS.MCP_SERVERS,
		label: 'MCP サーバー',
		help: 'MCP サーバーを JSON リストとして構成します。編集するには MCP クライアント設定セクションのフォームを使用してください。',
		defaultValue: '[]',
		type: SettingsFieldType.INPUT,
		sync: { serverKey: SETTINGS_KEYS.MCP_SERVERS, paramType: SyncableParameterType.STRING }
	}
	// {
	// 	key: SETTINGS_KEYS.PY_INTERPRETER_ENABLED,
	// 	label: 'Python interpreter enabled',
	// 	help: 'Enable Python interpreter using Pyodide. Allows running Python code in markdown code blocks.',
	// 	defaultValue: false,
	// 	type: SettingsFieldType.CHECKBOX,
	// 	isExperimental: true,
	// 	sync: { serverKey: SETTINGS_KEYS.PY_INTERPRETER_ENABLED, paramType: SyncableParameterType.BOOLEAN }
	// }
];

function getAllSettings(): SettingsEntry[] {
	const result: SettingsEntry[] = [];
	for (const section of Object.values(SETTINGS_REGISTRY)) {
		result.push(...section.settings);
	}
	result.push(...NON_UI_SETTINGS);
	return result;
}

/** Flat config object stored in localStorage. */
export const SETTING_CONFIG_DEFAULT: Record<string, SettingsConfigValue> = Object.fromEntries(
	getAllSettings().map((s) => [s.key, s.defaultValue])
) as Record<string, SettingsConfigValue>;

/** Help text for every setting (including non-UI). */
export const SETTING_CONFIG_INFO: Record<string, string> = Object.fromEntries(
	getAllSettings().map((s) => [s.key, s.help])
) as Record<string, string>;

/** Theme select options. */
export const SETTINGS_COLOR_MODES_CONFIG = COLOR_MODE_OPTIONS;

export type { SettingsSectionTitle } from '$lib/types';
export type { SettingsSection } from '$lib/types';

/** Sidebar sections + field configs (as consumed by UI). */
export const SETTINGS_CHAT_SECTIONS: SettingsSection[] = [
	...Object.values(SETTINGS_REGISTRY).map((section) => ({
		title: section.title,
		slug: section.slug,
		icon: section.icon,
		fields: section.settings.map((s) => ({
			key: s.key,
			label: s.label,
			type: s.type,
			isExperimental: s.isExperimental,
			isPositiveInteger: s.isPositiveInteger,
			help: s.help,
			options: s.options
		}))
	})),
	...STANDALONE_SECTIONS
];

/** INPUT-type settings whose value is a number. */
export const NUMERIC_FIELDS = getAllSettings()
	.filter((s) => s.type === SettingsFieldType.INPUT && typeof s.defaultValue !== 'string')
	.map((s) => s.key) as readonly string[];

/** Numeric fields clamped to ≥ 1 and rounded. */
export const POSITIVE_INTEGER_FIELDS = getAllSettings()
	.filter((s) => s.isPositiveInteger)
	.map((s) => s.key) as readonly string[];

/** Derived for the parameter sync service. */
export const SYNCABLE_PARAMETERS: SyncableParameter[] = getAllSettings()
	.filter((s) => s.sync !== undefined)
	.map((s) => ({
		key: s.key,
		serverKey: s.sync!.serverKey,
		type: s.sync!.paramType,
		canSync: true
	}));

export const SETTINGS_FALLBACK_EXIT_ROUTE = ROUTES.START;

export { SETTINGS_KEYS } from './settings-keys';
