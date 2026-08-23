import { FolderOpen, MessageSquare, Zap } from '@lucide/svelte';
import { FILE_TYPE_ICONS } from '$lib/constants';
import {
	AttachmentAction,
	AttachmentItemEnabledWhen,
	AttachmentItemVisibleWhen,
	AttachmentMenuItemId
} from '$lib/enums';
import type { AttachmentMenuItem } from '$lib/types';

/**
 * File attachment menu items shown in both the desktop dropdown and mobile sheet.
 * The "Tools" submenu is handled separately by each component.
 */
export const ATTACHMENT_FILE_ITEMS: AttachmentMenuItem[] = [
	{
		action: AttachmentAction.FILE_UPLOAD,
		class: 'images-button',
		disabledTooltip: '画像の処理にはビジョンモデルが必要です',
		enabledWhen: AttachmentItemEnabledWhen.HAS_VISION_MODALITY,
		icon: FILE_TYPE_ICONS.image,
		id: AttachmentMenuItemId.IMAGES,
		label: '画像'
	},
	{
		action: AttachmentAction.FILE_UPLOAD,
		class: 'audio-button',
		disabledTooltip: '音声ファイルの処理には音声モデルが必要です',
		enabledWhen: AttachmentItemEnabledWhen.HAS_AUDIO_MODALITY,
		icon: FILE_TYPE_ICONS.audio,
		id: AttachmentMenuItemId.AUDIO,
		label: '音声ファイル'
	},
	{
		action: AttachmentAction.FILE_UPLOAD,
		class: 'video-button',
		disabledTooltip: '動画ファイルの処理には動画モデルが必要です',
		enabledWhen: AttachmentItemEnabledWhen.HAS_VIDEO_MODALITY,
		icon: FILE_TYPE_ICONS.video,
		id: AttachmentMenuItemId.VIDEO,
		label: '動画ファイル'
	},
	{
		action: AttachmentAction.FILE_UPLOAD,
		enabledWhen: AttachmentItemEnabledWhen.ALWAYS,
		icon: FILE_TYPE_ICONS.text,
		id: AttachmentMenuItemId.TEXT,
		label: 'テキストファイル'
	},
	{
		action: AttachmentAction.FILE_UPLOAD,
		disabledTooltip:
			'PDF はテキストに変換されます。画像ベースの PDF は正しく動作しない場合があります。',
		enabledWhen: AttachmentItemEnabledWhen.ALWAYS,
		hasEnabledTooltip: true,
		icon: FILE_TYPE_ICONS.pdf,
		id: AttachmentMenuItemId.PDF,
		label: 'PDF ファイル'
	}
];

export const ATTACHMENT_EXTRA_ITEMS: AttachmentMenuItem[] = [];

export const ATTACHMENT_PROMPT_ITEMS: AttachmentMenuItem[] = [
	{
		action: AttachmentAction.SYSTEM_PROMPT_CLICK,
		enabledWhen: AttachmentItemEnabledWhen.ALWAYS,
		hasEnabledTooltip: true,
		icon: MessageSquare,
		id: AttachmentMenuItemId.SYSTEM_MESSAGE,
		label: 'システムメッセージ'
	},
	{
		action: AttachmentAction.MCP_PROMPT_CLICK,
		enabledWhen: AttachmentItemEnabledWhen.ALWAYS,
		icon: Zap,
		id: AttachmentMenuItemId.MCP_PROMPT,
		label: 'MCP プロンプト',
		visibleWhen: AttachmentItemVisibleWhen.HAS_MCP_PROMPTS_SUPPORT
	}
];

export const ATTACHMENT_MCP_ITEMS: AttachmentMenuItem[] = [
	{
		action: AttachmentAction.MCP_RESOURCES_CLICK,
		enabledWhen: AttachmentItemEnabledWhen.ALWAYS,
		icon: FolderOpen,
		id: AttachmentMenuItemId.MCP_RESOURCES,
		label: 'MCP リソース',
		visibleWhen: AttachmentItemVisibleWhen.HAS_MCP_RESOURCES_SUPPORT
	}
];

export const ATTACHMENT_TOOLTIP_TEXT = 'ファイル、プロンプト、ツール、または MCP サーバーを追加';
