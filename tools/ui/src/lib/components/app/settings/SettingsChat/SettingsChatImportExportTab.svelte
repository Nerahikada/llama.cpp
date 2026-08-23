<script lang="ts">
	import SettingsChatImportExportSection from './SettingsChatImportExportSection.svelte';
	import { Download, Trash2, Upload } from '@lucide/svelte';
	import {
		DialogConfirmation,
		DialogConversationSelection,
		DialogExportSettings
	} from '$lib/components/app';
	import SettingsGroup from '$lib/components/app/settings/SettingsGroup.svelte';
	import { ConversationSelectionMode, FileExtensionText, HtmlInputType } from '$lib/enums';
	import { ConversationTransferService } from '$lib/services';
	import { conversationsStore, settingsStore } from '$lib/stores';
	import { createMessageCountMap } from '$lib/utils';
	import { fade } from 'svelte/transition';
	import { toast } from 'svelte-sonner';

	let exportedConversations = $state<DatabaseConversation[]>([]);
	let importedConversations = $state<DatabaseConversation[]>([]);
	let showExportSummary = $state(false);
	let showImportSummary = $state(false);

	let showExportDialog = $state(false);
	let showImportDialog = $state(false);
	let availableConversations = $state<DatabaseConversation[]>([]);
	let messageCountMap = $state<Map<string, number>>(new Map());
	let fullImportData = $state<Array<{ conv: DatabaseConversation; messages: DatabaseMessage[] }>>(
		[]
	);

	// Delete functionality state
	let showDeleteDialog = $state(false);

	// Settings import/export state
	let showSettingsExportSummary = $state(false);
	let showSettingsImportSummary = $state(false);
	let showSettingsExportDialog = $state(false);
	let includeSensitiveData = $state(false);

	function handleSettingsExport() {
		showSettingsExportDialog = true;
		includeSensitiveData = false;
	}

	function handleSettingsExportConfirm() {
		showSettingsExportDialog = false;

		try {
			const data = settingsStore.exportSettings(includeSensitiveData);
			const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');

			a.href = url;
			a.download = `llama_settings_${new Date().toISOString().split('T')[0]}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			showSettingsExportSummary = true;
			showSettingsImportSummary = false;
			toast.success('設定をエクスポートしました');
		} catch (err) {
			console.error('Failed to export settings:', err);
			toast.error('設定のエクスポートに失敗しました');
		}
	}

	function handleSettingsExportCancel() {
		showSettingsExportDialog = false;
	}

	function handleSettingsImport() {
		try {
			const input = document.createElement('input');

			input.type = HtmlInputType.FILE;
			input.accept = FileExtensionText.JSON;

			input.onchange = async (e) => {
				const file = (e.target as HTMLInputElement)?.files?.[0];

				if (!file) return;

				try {
					const text = await file.text();
					const data = JSON.parse(text);

					if (!data || typeof data !== 'object' || !data.config) {
						toast.error('無効な設定ファイルです: config がありません');

						return;
					}

					settingsStore.importSettings(data);

					showSettingsImportSummary = true;
					showSettingsExportSummary = false;
					toast.success('設定をインポートしました');
				} catch (err) {
					console.error('Failed to import settings:', err);
					toast.error('設定のインポートに失敗しました');
				}
			};

			input.click();
		} catch (err) {
			console.error('Failed to open file picker:', err);
			toast.error('ファイル選択ダイアログを開けませんでした');
		}
	}

	async function handleExportClick() {
		try {
			const allConversations = conversationsStore.conversations;

			if (allConversations.length === 0) {
				toast.info('エクスポートする会話がありません');

				return;
			}

			const conversationsWithMessages = await Promise.all(
				allConversations.map(async (conv: DatabaseConversation) => {
					const messages = await conversationsStore.getConversationMessages(conv.id);

					return { conv, messages };
				})
			);

			messageCountMap = createMessageCountMap(conversationsWithMessages);
			availableConversations = allConversations;
			showExportDialog = true;
		} catch (err) {
			console.error('Failed to load conversations:', err);
			alert('会話の読み込みに失敗しました');
		}
	}

	async function handleExportConfirm(selectedConversations: DatabaseConversation[]) {
		try {
			const allData: ExportedConversation[] = await Promise.all(
				selectedConversations.map(async (conv) => {
					const messages = await conversationsStore.getConversationMessages(conv.id);

					return { conv: $state.snapshot(conv), messages: $state.snapshot(messages) };
				})
			);

			if (allData.length === 1) {
				ConversationTransferService.downloadConversationFile(allData[0]);
			} else {
				ConversationTransferService.downloadConversationsArchive(allData);
			}

			exportedConversations = selectedConversations;
			showExportSummary = true;
			showImportSummary = false;
			showExportDialog = false;
		} catch (err) {
			console.error('Export failed:', err);
			alert('会話のエクスポートに失敗しました');
		}
	}

	async function handleImportClick() {
		try {
			const input = document.createElement('input');

			// No `accept` filter: iOS resolves each entry to a UTI and has none for
			// `.jsonl`, which greys out exported conversations in the file picker.
			// `parseImportFile` detects the format from the file contents instead.
			input.type = HtmlInputType.FILE;

			input.onchange = async (e) => {
				const file = (e.target as HTMLInputElement)?.files?.[0];

				if (!file) return;

				try {
					const importedData = await ConversationTransferService.parseImportFile(file);

					if (importedData.length === 0) {
						throw new Error('ファイル内に会話が見つかりませんでした');
					}

					fullImportData = importedData;
					availableConversations = importedData.map((item) => item.conv);
					messageCountMap = createMessageCountMap(importedData);
					showImportDialog = true;
				} catch (err: unknown) {
					const message = err instanceof Error ? err.message : '不明なエラー';

					console.error('Failed to parse file:', err);
					alert(`ファイルの解析に失敗しました: ${message}`);
				}
			};

			input.click();
		} catch (err) {
			console.error('Import failed:', err);
			alert('会話のインポートに失敗しました');
		}
	}

	async function handleImportConfirm(selectedConversations: DatabaseConversation[]) {
		try {
			const selectedIds = new Set(selectedConversations.map((c) => c.id));
			const selectedData = $state
				.snapshot(fullImportData)
				.filter((item) => selectedIds.has(item.conv.id));
			const { imported, skipped } = await conversationsStore.importConversationsData(selectedData);

			// A conversation already in the database is left untouched, so the summary
			// lists what was written and the toast accounts for the rest.
			if (skipped.length > 0) {
				toast.info(
					`${skipped.length} 件の会話は既にライブラリにあるためスキップしました`
				);
			}

			importedConversations = imported;
			showImportSummary = true;
			showExportSummary = false;
			showImportDialog = false;
		} catch (err) {
			console.error('Import failed:', err);
			alert('会話のインポートに失敗しました。ファイル形式を確認してください。');
		}
	}

	async function handleDeleteAllClick() {
		try {
			const allConversations = conversationsStore.conversations;

			if (allConversations.length === 0) {
				toast.info('削除する会話がありません');

				return;
			}

			showDeleteDialog = true;
		} catch (err) {
			console.error('Failed to load conversations for deletion:', err);
			toast.error('会話の読み込みに失敗しました');
		}
	}

	async function handleDeleteAllConfirm() {
		try {
			await conversationsStore.deleteAll();

			showDeleteDialog = false;
		} catch (err) {
			console.error('Failed to delete conversations:', err);
		}
	}

	function handleDeleteAllCancel() {
		showDeleteDialog = false;
	}
</script>

<div class="space-y-12" in:fade={{ duration: 150 }}>
	<SettingsGroup title="会話">
		<SettingsChatImportExportSection
			title="エクスポート"
			description="会話を JSONL ファイルの ZIP としてダウンロードします。すべてのメッセージ、添付ファイル、会話履歴が含まれます。"
			IconComponent={Download}
			buttonText="会話をエクスポート"
			onclick={handleExportClick}
			summary={{ items: exportedConversations, show: showExportSummary, verb: 'エクスポートしました' }}
		/>

		<SettingsChatImportExportSection
			title="インポート"
			description="以前にエクスポートした ZIP または JSONL ファイルから 1 つ以上の会話をインポートします。既存の会話とマージされます。"
			IconComponent={Upload}
			buttonText="会話をインポート"
			onclick={handleImportClick}
			summary={{ items: importedConversations, show: showImportSummary, verb: 'インポートしました' }}
		/>

		<SettingsChatImportExportSection
			title="すべて削除"
			description="すべての会話とそのメッセージを完全に削除します。この操作は元に戻せません。バックアップを残したい場合は、先に会話をエクスポートすることを検討してください。"
			IconComponent={Trash2}
			buttonText="すべての会話を削除"
			onclick={handleDeleteAllClick}
			titleClass="text-destructive"
			buttonVariant="destructive"
			buttonClass="text-destructive-foreground justify-start justify-self-start bg-destructive hover:bg-destructive/80 md:w-auto"
		/>
	</SettingsGroup>

	<SettingsGroup title="設定">
		<SettingsChatImportExportSection
			title="エクスポート"
			description="チャットの設定と環境設定を JSON ファイルとしてエクスポートします。"
			IconComponent={Download}
			buttonText="設定をエクスポート"
			onclick={handleSettingsExport}
			summary={{ items: [], show: showSettingsExportSummary, verb: 'エクスポートしました' }}
		/>

		<SettingsChatImportExportSection
			title="インポート"
			description="以前にエクスポートした JSON ファイルからチャット設定をインポートします。既存の設定とマージされます。"
			IconComponent={Upload}
			buttonText="設定をインポート"
			onclick={handleSettingsImport}
			summary={{ items: [], show: showSettingsImportSummary, verb: 'インポートしました' }}
		/>
	</SettingsGroup>
</div>

<DialogExportSettings
	bind:open={showSettingsExportDialog}
	bind:includeSensitiveData
	onConfirm={handleSettingsExportConfirm}
	onCancel={handleSettingsExportCancel}
/>

<DialogConversationSelection
	conversations={availableConversations}
	{messageCountMap}
	mode={ConversationSelectionMode.EXPORT}
	bind:open={showExportDialog}
	onCancel={() => (showExportDialog = false)}
	onConfirm={handleExportConfirm}
/>

<DialogConversationSelection
	conversations={availableConversations}
	{messageCountMap}
	mode={ConversationSelectionMode.IMPORT}
	bind:open={showImportDialog}
	onCancel={() => (showImportDialog = false)}
	onConfirm={handleImportConfirm}
/>

<DialogConfirmation
	bind:open={showDeleteDialog}
	title="すべての会話を削除"
	description="すべての会話を削除してもよろしいですか？この操作は元に戻せず、すべての会話とメッセージが完全に削除されます。"
	confirmText="すべて削除"
	cancelText="キャンセル"
	variant="destructive"
	icon={Trash2}
	onConfirm={handleDeleteAllConfirm}
	onCancel={handleDeleteAllCancel}
/>
