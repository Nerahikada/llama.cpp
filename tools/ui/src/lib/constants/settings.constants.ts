import { CLI_FLAGS } from './cli-flags.constants';
import { DEFAULT_MCP_CONFIG } from './mcp.constants';
import { SETTINGS_KEYS } from './settings-keys.constants';
import { TITLE_GENERATION } from './title-generation.constants';
import { FILE_GLOB_SEARCH_PICKERS } from './working-directory.constants';
import {
	Code,
	Database,
	Funnel,
	ListRestart,
	Monitor,
	Moon,
	PencilRuler,
	SlidersVertical,
	Sun
} from '@lucide/svelte';
import { SyncableParameterType } from '$lib/enums';
import { SettingsFieldType } from '$lib/enums/settings.enums';
import { ColorMode } from '$lib/enums/ui.enums';
import type {
	SettingsConfigValue,
	SettingsEntry,
	SettingsFieldConfig,
	SettingsSection,
	SettingsSectionEntry
} from '$lib/types';

/** Settings sections — slug is the routing identity, title is the display label. */
export const SETTINGS_SECTIONS = {
	AGENTIC: { slug: 'agentic', title: 'エージェント' },
	DEVELOPER: { slug: 'developer', title: '開発者' },
	DISPLAY: { slug: 'display', title: '表示' },
	GENERAL: { slug: 'general', title: '一般' },
	IMPORT_EXPORT: { slug: 'import-export', title: 'インポート / エクスポート' },
	SAMPLING_PENALTIES: { slug: 'sampling-penalties', title: 'サンプリングとペナルティ' },
	TOOLS: { slug: 'tools', title: 'ツール' }
} as const;

export const SETTINGS_SECTION_SLUGS = {
	AGENTIC: SETTINGS_SECTIONS.AGENTIC.slug,
	DEVELOPER: SETTINGS_SECTIONS.DEVELOPER.slug,
	DISPLAY: SETTINGS_SECTIONS.DISPLAY.slug,
	GENERAL: SETTINGS_SECTIONS.GENERAL.slug,
	IMPORT_EXPORT: SETTINGS_SECTIONS.IMPORT_EXPORT.slug,
	SAMPLING_PENALTIES: SETTINGS_SECTIONS.SAMPLING_PENALTIES.slug,
	TOOLS: SETTINGS_SECTIONS.TOOLS.slug
} as const;

export const SETTINGS_SECTION_TITLES = {
	AGENTIC: SETTINGS_SECTIONS.AGENTIC.title,
	DEVELOPER: SETTINGS_SECTIONS.DEVELOPER.title,
	DISPLAY: SETTINGS_SECTIONS.DISPLAY.title,
	GENERAL: SETTINGS_SECTIONS.GENERAL.title,
	IMPORT_EXPORT: SETTINGS_SECTIONS.IMPORT_EXPORT.title,
	SAMPLING_PENALTIES: SETTINGS_SECTIONS.SAMPLING_PENALTIES.title,
	TOOLS: SETTINGS_SECTIONS.TOOLS.title
} as const;

export const SETTINGS_REGISTRY: SettingsSectionEntry[] = [
	// General
	{
		icon: SlidersVertical,
		settings: [
			{
				defaultValue: ColorMode.SYSTEM,
				help: 'インターフェースのカラーテーマを選択します。システム（デバイスの設定に従います）、ライト、ダークから選べます。',
				key: SETTINGS_KEYS.THEME,
				label: 'テーマ',
				options: [
					{ icon: Monitor, label: 'システム', value: ColorMode.SYSTEM },
					{ icon: Sun, label: 'ライト', value: ColorMode.LIGHT },
					{ icon: Moon, label: 'ダーク', value: ColorMode.DARK }
				],
				type: SettingsFieldType.SELECT
			},
			{
				defaultValue: '',
				help: `サーバーで <code> ${CLI_FLAGS.API_KEY} </code> オプションを使用している場合は API キーを設定してください。`,
				isPrivate: true,
				key: SETTINGS_KEYS.API_KEY,
				label: 'API キー',
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: '',
				help: 'モデルの振る舞いを定義する最初のメッセージです。',
				key: SETTINGS_KEYS.SYSTEM_MESSAGE,
				label: 'システムメッセージ',
				type: SettingsFieldType.TEXTAREA
			},
			{
				defaultValue: true,
				help: '各会話の先頭にシステムメッセージを表示します。',
				key: SETTINGS_KEYS.SHOW_SYSTEM_MESSAGE,
				label: 'システムメッセージを表示',
				standaloneField: false,
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: 2500,
				help: '長いテキストを貼り付けると、ファイルに変換されます。このパラメーターの値でファイルの長さを制御できます。値 0 で無効になります。',
				key: SETTINGS_KEYS.PASTE_LONG_TEXT_TO_FILE_LEN,
				label: '長いテキストをファイル化する文字数',
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: true,
				help: 'Enter でメッセージを送信し、Shift + Enter で改行します。無効の場合は Ctrl/Cmd + Enter で送信します。',
				key: SETTINGS_KEYS.SEND_ON_ENTER,
				label: 'Enter でメッセージを送信',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: '音声モダリティに対応したモデルで、テキストエリアが空のときに送信ボタンの代わりにマイクボタンを自動的に表示します。',
				key: SETTINGS_KEYS.AUTO_MIC_ON_EMPTY,
				label: '入力が空のときにマイクを表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'アシスタントメッセージに「続ける」ボタンを有効化します（推論モデルを含む）。',
				isExperimental: true,
				key: SETTINGS_KEYS.ENABLE_CONTINUE_GENERATION,
				label: '「続ける」ボタンを有効化',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: '会話のタイトルの生成方法を選択します。最初の空でない行を使う方法は高速で決定的なルールを使い、LLM オプションは最初のメッセージのやり取りからモデルが生成したタイトルを使います。',
				key: SETTINGS_KEYS.TITLE_GENERATION_USE_FIRST_LINE,
				label: '会話のタイトル',
				radioOptions: [
					{
						key: SETTINGS_KEYS.TITLE_GENERATION_USE_FIRST_LINE,
						label: '会話のタイトルに最初の空でない行を使用',
						value: 'firstLine'
					},
					{
						isExperimental: true,
						key: SETTINGS_KEYS.TITLE_GENERATION_USE_LLM,
						label: 'LLM でタイトルを生成',
						value: 'llm'
					}
				],
				type: SettingsFieldType.RADIO
			},
			{
				defaultValue: TITLE_GENERATION.DEFAULT_PROMPT,
				dependsOn: SETTINGS_KEYS.TITLE_GENERATION_USE_LLM,
				help: 'タイトル生成プロンプトの任意のテンプレートです。ユーザーメッセージには {{USER}}、アシスタントメッセージには {{ASSISTANT}} を使用します。',
				key: SETTINGS_KEYS.TITLE_GENERATION_PROMPT,
				label: 'LLM タイトル生成プロンプト',
				type: SettingsFieldType.TEXTAREA
			},
			{
				defaultValue: false,
				help: '会話タイトルのラジオボタンに対応する項目です。専用の UI フィールドを持たずに保存・同期されます。',
				key: SETTINGS_KEYS.TITLE_GENERATION_USE_LLM,
				label: 'LLM でタイトルを生成',
				standaloneField: false,
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'テキストの添付ファイルを含むメッセージをコピーするときに、添付ファイルとして貼り戻せる特殊な形式ではなく、単一のプレーンテキスト文字列に結合します。',
				key: SETTINGS_KEYS.COPY_TEXT_ATTACHMENTS_AS_PLAIN_TEXT,
				label: 'テキストの添付ファイルをプレーンテキストとしてコピー',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'PDF をテキストではなく画像として解析します。ビジョン非対応のモデルでは自動的にテキスト処理にフォールバックします。',
				key: SETTINGS_KEYS.PDF_AS_IMAGE,
				label: 'PDF を画像として解析',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: 0,
				help: 'これより大きい画像は、サーバーに送信する前にリサイズされます。0 で無効になります。',
				key: SETTINGS_KEYS.MAX_IMAGE_RESOLUTION,
				label: '画像の最大解像度（メガピクセル）',
				type: SettingsFieldType.INPUT
			}
		],
		slug: SETTINGS_SECTION_SLUGS.GENERAL,
		title: SETTINGS_SECTION_TITLES.GENERAL
	},
	// Display
	{
		icon: Monitor,
		settings: [
			{
				defaultValue: true,
				help: '各アシスタントメッセージの下に生成統計（tokens/second、トークン数、所要時間）を表示します。',
				key: SETTINGS_KEYS.SHOW_MESSAGE_STATS,
				label: 'メッセージの生成統計を表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				dependsOn: SETTINGS_KEYS.SHOW_MESSAGE_STATS,
				help: 'エージェント応答の各ターンの下に、ターンごとの統計（トークン、所要時間）を表示します。「メッセージの生成統計を表示」が有効な場合のみ表示されます。',
				key: SETTINGS_KEYS.SHOW_AGENTIC_TURN_STATS,
				label: 'エージェントの各ターンの統計を表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'メッセージの生成時に、思考プロセスを既定で展開します。',
				key: SETTINGS_KEYS.SHOW_THOUGHT_IN_PROGRESS,
				label: '進行中の思考を表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: '実行中にツール呼び出しの詳細を自動的に展開し、完了後も展開したままにします。',
				key: SETTINGS_KEYS.ALWAYS_SHOW_TOOL_CALL_CONTENT,
				label: 'ツール呼び出しの内容を常に表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'チャット内でユーザーメッセージを Markdown 書式で表示します。オフにすると入力したままの状態でメッセージを保持します。@メンションのバッジはどちらの場合も表示されます。',
				key: SETTINGS_KEYS.RENDER_USER_CONTENT_AS_MARKDOWN,
				label: 'ユーザーの内容を Markdown で表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: '推論・思考ブロックの内容をプレーンテキストではなく書式付きの Markdown で表示します。',
				key: SETTINGS_KEYS.RENDER_THINKING_AS_MARKDOWN,
				label: '思考を Markdown で表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'コードブロックを高さの制限に関わらず、常に本来の高さいっぱいに表示します。',
				key: SETTINGS_KEYS.FULL_HEIGHT_CODE_BLOCKS,
				label: 'コードブロックを全高で表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'メッセージのストリーミング中の自動スクロールを無効化し、表示位置を手動で操作できるようにします。',
				key: SETTINGS_KEYS.DISABLE_AUTO_SCROLL,
				label: '自動スクロールを無効化',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'デスクトップでサイドバーを自動的に隠さず、常に表示したままにします。',
				key: SETTINGS_KEYS.ALWAYS_SHOW_SIDEBAR_ON_DESKTOP,
				label: 'デスクトップでサイドバーを常に表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: '開いているチャットを、会話の上部にブラウザー風のタブとして 1 つずつ表示します。無効の場合は一度に 1 つのチャットのみ表示されます。',
				key: SETTINGS_KEYS.CONVERSATION_TABS,
				label: '会話タブ',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'バッジ付きの解析済み名称ではなく、生のモデル識別子全体（例: "ggml-org/GLM-4.7-Flash-GGUF:Q8_0"）を表示します。',
				key: SETTINGS_KEYS.SHOW_RAW_MODEL_NAMES,
				label: '生のモデル名を表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'インターフェース全体で、モデル名の横に量子化バッジ（例: Q8_0、Q4_K_M）を表示します。',
				key: SETTINGS_KEYS.SHOW_MODEL_QUANTIZATION,
				label: 'モデルの量子化情報を表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: true,
				help: 'インターフェース全体で、モデル名の横にモデルタグ（例: "vision"、"reasoning"）を表示します。',
				key: SETTINGS_KEYS.SHOW_MODEL_TAGS,
				label: 'モデルタグを表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'モデルセレクターのトリガーボタンに組織名を表示します。',
				key: SETTINGS_KEYS.SHOW_MODEL_ORG_NAME_IN_TRIGGER,
				label: 'モデルセレクターのトリガーに組織名を表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'インターフェースの右下に現在のビルドバージョンを表示します。',
				key: SETTINGS_KEYS.SHOW_BUILD_VERSION,
				label: 'ビルドバージョン情報を表示',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'ファイルやフォルダーの @メンションバッジに、ファイル名やフォルダー名だけでなくファイルシステムのフルパスを表示します。',
				key: SETTINGS_KEYS.SHOW_FULL_PATH_IN_MENTIONS,
				label: 'メンションにフルパスを表示',
				type: SettingsFieldType.CHECKBOX
			}
		],
		slug: SETTINGS_SECTION_SLUGS.DISPLAY,
		title: SETTINGS_SECTION_TITLES.DISPLAY
	},
	// MCP Servers (non-UI config object)
	{
		icon: PencilRuler,
		settings: [
			{
				defaultValue: '[]',
				help: 'MCP サーバーを JSON のリストとして設定します。編集するには MCP クライアント設定セクションのフォームを使用してください。',
				key: SETTINGS_KEYS.MCP_SERVERS,
				label: 'MCP サーバー',
				standaloneField: false,
				type: SettingsFieldType.INPUT
			}
		],
		slug: SETTINGS_SECTION_SLUGS.TOOLS,
		title: SETTINGS_SECTION_TITLES.TOOLS
	},
	// Tools
	{
		icon: ListRestart,
		settings: [
			{
				defaultValue: 10,
				help: '停止するまでのツール実行サイクルの最大回数です（無限ループを防止します）。',
				isPositiveInteger: true,
				key: SETTINGS_KEYS.AGENTIC_MAX_TURNS,
				label: 'エージェントのターン数',
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: DEFAULT_MCP_CONFIG.requestTimeoutSeconds,
				help: '個々の MCP ツール呼び出しのタイムアウトです。',
				isPositiveInteger: true,
				key: SETTINGS_KEYS.MCP_REQUEST_TIMEOUT_SECONDS,
				label: 'MCP リクエストのタイムアウト（秒）',
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: FILE_GLOB_SEARCH_PICKERS.DEFAULT_SEARCH_DEPTH,
				help: '@メンションのファイル検索が作業ディレクトリの下に何階層まで降りるかを指定します。値を大きくすると深くネストされたファイルも見つかりますが、大きなツリーでは時間がかかります。',
				isPositiveInteger: true,
				key: SETTINGS_KEYS.MENTION_SEARCH_MAX_DEPTH,
				label: 'メンション検索の深さ',
				max: FILE_GLOB_SEARCH_PICKERS.MAX_SEARCH_DEPTH,
				min: 1,
				placeholder: `${FILE_GLOB_SEARCH_PICKERS.DEFAULT_SEARCH_DEPTH}`,
				type: SettingsFieldType.INPUT
			}
		],
		slug: SETTINGS_SECTION_SLUGS.AGENTIC,
		title: SETTINGS_SECTION_TITLES.AGENTIC
	},
	// Import/Export
	{
		icon: Database,
		settings: [],
		slug: SETTINGS_SECTION_SLUGS.IMPORT_EXPORT,
		title: SETTINGS_SECTION_TITLES.IMPORT_EXPORT
	},
	// Sampling
	{
		icon: Funnel,
		settings: [
			{
				defaultValue: undefined,
				help: '出力トークンの確率分布に影響を与えることで、生成されるテキストのランダム性を制御します。高いほどランダムに、低いほど焦点が絞られます。',
				key: SETTINGS_KEYS.TEMPERATURE,
				label: 'Temperature',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.TEMPERATURE
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'temperature サンプラーのアドオンです。動的な temperature の範囲に加える値で、トークンのエントロピーによって確率を調整します。',
				key: SETTINGS_KEYS.DYNATEMP_RANGE,
				label: 'Dynamic temperature range',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DYNATEMP_RANGE
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'temperature サンプラーのアドオンです。最も確率の高いトークンに基づいて、確率の再分配を滑らかにします。',
				key: SETTINGS_KEYS.DYNATEMP_EXPONENT,
				label: 'Dynamic temperature exponent',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DYNATEMP_EXPONENT
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: '上位 k 個のトークンのみを保持します。',
				key: SETTINGS_KEYS.TOP_K,
				label: 'Top K',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.TOP_K },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: '累積確率が少なくとも p 以上になるトークンに制限します。',
				key: SETTINGS_KEYS.TOP_P,
				label: 'Top P',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.TOP_P },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: '最も確率の高いトークンの確率を基準として、トークンが考慮される最小確率に基づいてトークンを制限します。',
				key: SETTINGS_KEYS.MIN_P,
				label: 'Min P',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.MIN_P },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'XTC サンプラーは上位トークンを除外します。このパラメーターはトークンを除外する確率を制御します。0 で XTC を無効化します。',
				key: SETTINGS_KEYS.XTC_PROBABILITY,
				label: 'XTC probability',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.XTC_PROBABILITY
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'XTC サンプラーは上位トークンを除外します。このパラメーターは、そのトークンを除外するために必要なトークンの確率を制御します。',
				key: SETTINGS_KEYS.XTC_THRESHOLD,
				label: 'XTC threshold',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.XTC_THRESHOLD
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: '対数確率とエントロピーの差に基づいてトークンを並べ替えて制限します。',
				key: SETTINGS_KEYS.TYP_P,
				label: 'Typical P',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.TYP_P },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: '出力あたりのトークンの最大数です。-1 で無制限になります。',
				key: SETTINGS_KEYS.MAX_TOKENS,
				label: 'Max tokens',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.MAX_TOKENS
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: '',
				help: 'サンプラーが適用される順序を簡略化した形で指定します。既定は "top_k;typ_p;top_p;min_p;temperature" です: top_k->typ_p->top_p->min_p->temperature',
				key: SETTINGS_KEYS.SAMPLERS,
				label: 'Samplers',
				sync: { paramType: SyncableParameterType.STRING, serverKey: SETTINGS_KEYS.SAMPLERS },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: false,
				help: 'バックエンドベースのサンプラーを有効化します。有効にすると、対応するサンプラーがアクセラレーターのバックエンドで実行され、サンプリングが高速になります。',
				key: SETTINGS_KEYS.BACKEND_SAMPLING,
				label: 'Backend sampling',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: undefined,
				help: '繰り返しにペナルティを与える際に考慮する直近 n 個のトークンです。',
				key: SETTINGS_KEYS.REPEAT_LAST_N,
				label: 'Repeat last N',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.REPEAT_LAST_N
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: '生成されるテキスト内のトークン列の繰り返しを制御します。',
				key: SETTINGS_KEYS.REPEAT_PENALTY,
				label: 'Repeat penalty',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.REPEAT_PENALTY
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'トークンが出力に出現したかどうかに基づいてトークンを制限します。',
				key: SETTINGS_KEYS.PRESENCE_PENALTY,
				label: 'Presence penalty',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.PRESENCE_PENALTY
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'トークンが出力に出現する頻度に基づいてトークンを制限します。',
				key: SETTINGS_KEYS.FREQUENCY_PENALTY,
				label: 'Frequency penalty',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.FREQUENCY_PENALTY
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'DRY サンプリングは、長いコンテキストにわたっても生成テキストの繰り返しを減らします。このパラメーターは DRY サンプリングの乗数を設定します。',
				key: SETTINGS_KEYS.DRY_MULTIPLIER,
				label: 'DRY multiplier',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DRY_MULTIPLIER
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'DRY サンプリングは、長いコンテキストにわたっても生成テキストの繰り返しを減らします。このパラメーターは DRY サンプリングの基準値を設定します。',
				key: SETTINGS_KEYS.DRY_BASE,
				label: 'DRY base',
				sync: { paramType: SyncableParameterType.NUMBER, serverKey: SETTINGS_KEYS.DRY_BASE },
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'DRY サンプリングは、長いコンテキストにわたっても生成テキストの繰り返しを減らします。このパラメーターは DRY サンプリングで許容される長さを設定します。',
				key: SETTINGS_KEYS.DRY_ALLOWED_LENGTH,
				label: 'DRY allowed length',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DRY_ALLOWED_LENGTH
				},
				type: SettingsFieldType.INPUT
			},
			{
				defaultValue: undefined,
				help: 'DRY サンプリングは、長いコンテキストにわたっても生成テキストの繰り返しを減らします。このパラメーターは直近 n 個のトークンに対する DRY ペナルティを設定します。',
				key: SETTINGS_KEYS.DRY_PENALTY_LAST_N,
				label: 'DRY penalty last N',
				sync: {
					paramType: SyncableParameterType.NUMBER,
					serverKey: SETTINGS_KEYS.DRY_PENALTY_LAST_N
				},
				type: SettingsFieldType.INPUT
			}
		],
		slug: SETTINGS_SECTION_SLUGS.SAMPLING_PENALTIES,
		title: SETTINGS_SECTION_TITLES.SAMPLING_PENALTIES
	},
	// Developer
	{
		icon: Code,
		settings: [
			{
				defaultValue: false,
				help: '各応答の後に会話を再送信して、サーバーの KV キャッシュを事前に埋めます。応答を読んでいる間にプロンプトがすでにエンコードされるため、次のターンが高速になります。',
				key: SETTINGS_KEYS.PRE_ENCODE_CONVERSATION,
				label: '応答後に KV キャッシュを事前に埋める',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'reasoning_format=none を送信して、サーバーが思考トークンを別のフィールドに抽出せず、インラインで返すようにします。',
				key: SETTINGS_KEYS.DISABLE_REASONING_PARSING,
				label: '推論内容の解析を無効化',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: '送信前に、以前のメッセージから思考を取り除きます。オフの場合、思考は reasoning_content フィールドを通じて送り返され、モデルはターンをまたいで自身の思考の連鎖を参照できます。',
				key: SETTINGS_KEYS.EXCLUDE_REASONING_FROM_CONTEXT,
				label: 'コンテキストから推論を除外',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'Markdown 書式の内容ではなくプレーンテキストとしてメッセージを表示する切り替えボタンを表示します。',
				key: SETTINGS_KEYS.SHOW_RAW_OUTPUT_SWITCH,
				label: '生出力の切り替えを有効化',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				help: 'モデルに run_javascript ツールを公開します。コードは不透明なオリジンを持つサンドボックス化された iframe 内の Web Worker で実行され、WebUI とその API から隔離され、厳格なタイムアウトが設定されます。',
				key: SETTINGS_KEYS.JS_SANDBOX_ENABLED,
				label: 'JavaScript サンドボックスツール',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: false,
				dependsOn: SETTINGS_KEYS.JS_SANDBOX_ENABLED,
				help: 'サンドボックスに nerdamer を事前読み込みして記号計算を行います: 簡約、微分、積分、求解など。「JavaScript サンドボックスツール」を有効にする必要があります。',
				key: SETTINGS_KEYS.SYMBOLIC_MATH_ENABLED,
				label: '記号計算 (nerdamer)',
				type: SettingsFieldType.CHECKBOX
			},
			{
				defaultValue: '',
				help: 'API に送信するカスタム JSON パラメーターです。有効な JSON 形式である必要があります。',
				key: SETTINGS_KEYS.CUSTOM_JSON,
				label: 'Custom JSON',
				type: SettingsFieldType.TEXTAREA
			},
			{
				defaultValue: '',
				help: '実行時にページに注入される CSS です。ここで設定するか、--ui-config の customCss フィールドを介してサーバー側で配信します。',
				key: SETTINGS_KEYS.CUSTOM_CSS,
				label: 'Custom CSS',
				type: SettingsFieldType.TEXTAREA
			}
		],
		slug: SETTINGS_SECTION_SLUGS.DEVELOPER,
		title: SETTINGS_SECTION_TITLES.DEVELOPER
	}
];

function getAllSettings(): SettingsEntry[] {
	const result: SettingsEntry[] = [];

	for (const section of SETTINGS_REGISTRY) {
		result.push(...section.settings);
	}

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

/** Sidebar sections + field configs (as consumed by UI). */
function toSettingsSection(section: SettingsSectionEntry): SettingsSection {
	return {
		fields: section.settings
			.filter((s) => s.standaloneField !== false)
			.map((s) => ({
				dependsOn: s.dependsOn,
				help: s.help,
				isExperimental: s.isExperimental,
				isPositiveInteger: s.isPositiveInteger,
				isPrivate: s.isPrivate,
				key: s.key,
				label: s.label,
				max: s.max,
				min: s.min,
				options: s.options as SettingsFieldConfig['options'],
				placeholder: s.placeholder,
				radioOptions: s.radioOptions,
				type: s.type
			})),
		icon: section.icon,
		slug: section.slug,
		title: section.title
	};
}

/** Sidebar sections in custom display order (the registry array order). */
export const SETTINGS_CHAT_SECTIONS: SettingsSection[] = SETTINGS_REGISTRY.map(toSettingsSection);

/** INPUT-type settings whose value is a number. */
export const NUMERIC_FIELDS = getAllSettings()
	.filter((s) => s.type === SettingsFieldType.INPUT && typeof s.defaultValue !== 'string')
	.map((s) => s.key) as readonly string[];

/** Numeric fields clamped to >= 1 and rounded. */
export const POSITIVE_INTEGER_FIELDS = getAllSettings()
	.filter((s) => s.isPositiveInteger)
	.map((s) => s.key) as readonly string[];
