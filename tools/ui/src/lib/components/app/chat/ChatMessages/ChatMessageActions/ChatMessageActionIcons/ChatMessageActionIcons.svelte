<script lang="ts">
	import { ArrowRight, Copy, Edit, GitBranch, RefreshCw, Trash2 } from '@lucide/svelte';
	import {
		ActionIcon,
		ChatMessageActionIconsBranchingControls,
		DialogConfirmation
	} from '$lib/components/app';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Switch } from '$lib/components/ui/switch';
	import { getChatMessageActionsContext, getChatMessageEditContext } from '$lib/contexts';
	import { MessageRole } from '$lib/enums';
	import { conversationsStore } from '$lib/stores';

	interface Props {
		role: MessageRole.USER | MessageRole.ASSISTANT;
		justify: 'start' | 'end';
		actionsPosition: 'left' | 'right';
		onRegenerate?: () => void;
		onContinue?: () => void;
		showRawOutputSwitch?: boolean;
		rawOutputEnabled?: boolean;
		onRawOutputToggle?: (enabled: boolean) => void;
	}

	let {
		actionsPosition,
		justify,
		onContinue,
		onRawOutputToggle,
		onRegenerate,
		rawOutputEnabled = false,
		role,
		showRawOutputSwitch = false
	}: Props = $props();

	const messageActions = getChatMessageActionsContext();
	const editCtx = getChatMessageEditContext();

	let showForkDialog = $state(false);
	let forkName = $state('');
	let forkIncludeAttachments = $state(true);

	function handleConfirmDelete() {
		messageActions.confirmDelete();
		messageActions.setShowDeleteDialog(false);
	}

	function handleOpenForkDialog() {
		const conv = conversationsStore.activeConversation;

		forkName = `${conv?.name ?? '会話'} のフォーク`;
		forkIncludeAttachments = true;
		showForkDialog = true;
	}

	function handleConfirmFork() {
		messageActions.forkConversation?.({
			includeAttachments: forkIncludeAttachments,
			name: forkName.trim()
		});
		showForkDialog = false;
	}
</script>

<div class="relative {justify === 'start' ? 'mt-2' : ''} flex h-6 items-center justify-between">
	<div
		class="{actionsPosition === 'left'
			? 'left-0'
			: 'right-0'} flex items-center gap-2 opacity-100 transition-opacity"
	>
		{#if messageActions.siblingInfo && messageActions.siblingInfo.totalSiblings > 1}
			<ChatMessageActionIconsBranchingControls />
		{/if}

		<div
			class="pointer-events-auto inset-0 flex items-center gap-1 opacity-100 transition-all duration-150"
		>
			<ActionIcon icon={Copy} onclick={messageActions.copy} tooltip="コピー" />

			<ActionIcon icon={Edit} onclick={editCtx.startEdit} tooltip="編集" />

			{#if role === MessageRole.ASSISTANT && onRegenerate}
				<ActionIcon icon={RefreshCw} onclick={() => onRegenerate()} tooltip="再生成" />
			{/if}

			{#if role === MessageRole.ASSISTANT && onContinue}
				<ActionIcon icon={ArrowRight} onclick={onContinue} tooltip="続行" />
			{/if}

			{#if messageActions.forkConversation}
				<ActionIcon icon={GitBranch} onclick={handleOpenForkDialog} tooltip="会話をフォーク" />
			{/if}

			<ActionIcon icon={Trash2} onclick={messageActions.requestDelete} tooltip="削除" />
		</div>
	</div>

	{#if showRawOutputSwitch}
		<div class="flex items-center gap-2">
			<span class="text-xs text-muted-foreground">生の出力を表示</span>

			<Switch
				checked={rawOutputEnabled}
				onCheckedChange={(checked) => onRawOutputToggle?.(checked)}
			/>
		</div>
	{/if}
</div>

<DialogConfirmation
	cancelText="キャンセル"
	confirmText={messageActions.deletionInfo && messageActions.deletionInfo.totalCount > 1
		? `${messageActions.deletionInfo.totalCount} 件のメッセージを削除`
		: '削除'}
	description={messageActions.deletionInfo && messageActions.deletionInfo.totalCount > 1
		? `${messageActions.deletionInfo.userMessages} 件のユーザーメッセージと ${messageActions.deletionInfo.assistantMessages} 件のアシスタントの応答を含む ${messageActions.deletionInfo.totalCount} 件のメッセージを削除します。このブランチ内のすべてのメッセージとその応答が完全に削除されます。この操作は元に戻せません。`
		: 'このメッセージを削除してもよろしいですか？この操作は元に戻せません。'}
	icon={Trash2}
	onCancel={() => messageActions.setShowDeleteDialog(false)}
	onConfirm={handleConfirmDelete}
	open={messageActions.showDeleteDialog}
	title="メッセージを削除"
	variant="destructive"
/>

<DialogConfirmation
	bind:open={showForkDialog}
	cancelText="キャンセル"
	confirmText="フォーク"
	description="このメッセージから分岐した新しい会話を作成します。"
	icon={GitBranch}
	onCancel={() => (showForkDialog = false)}
	onConfirm={handleConfirmFork}
	title="会話をフォーク"
>
	<div class="flex flex-col gap-4 py-2">
		<div class="flex flex-col gap-2">
			<Label for="fork-name">タイトル</Label>

			<Input
				bind:value={forkName}
				class="text-foreground"
				id="fork-name"
				placeholder="フォーク名を入力"
				type="text"
			/>
		</div>

		<div class="flex items-center gap-2">
			<Checkbox
				checked={forkIncludeAttachments}
				id="fork-attachments"
				onCheckedChange={(checked) => {
					forkIncludeAttachments = checked === true;
				}}
			/>

			<Label class="cursor-pointer text-sm font-normal" for="fork-attachments">
				すべての添付ファイルを含める
			</Label>
		</div>
	</div>
</DialogConfirmation>
