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
			<ActionIcon icon={Copy} tooltip="コピー" onclick={messageActions.copy} />

			<ActionIcon icon={Edit} tooltip="編集" onclick={editCtx.startEdit} />

			{#if role === MessageRole.ASSISTANT && onRegenerate}
				<ActionIcon icon={RefreshCw} tooltip="再生成" onclick={() => onRegenerate()} />
			{/if}

			{#if role === MessageRole.ASSISTANT && onContinue}
				<ActionIcon icon={ArrowRight} tooltip="続行" onclick={onContinue} />
			{/if}

			{#if messageActions.forkConversation}
				<ActionIcon icon={GitBranch} tooltip="会話をフォーク" onclick={handleOpenForkDialog} />
			{/if}

			<ActionIcon icon={Trash2} tooltip="削除" onclick={messageActions.requestDelete} />
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
	open={messageActions.showDeleteDialog}
	title="メッセージを削除"
	description={messageActions.deletionInfo && messageActions.deletionInfo.totalCount > 1
		? `${messageActions.deletionInfo.userMessages} 件のユーザーメッセージと ${messageActions.deletionInfo.assistantMessages} 件のアシスタントの応答を含む ${messageActions.deletionInfo.totalCount} 件のメッセージを削除します。このブランチ内のすべてのメッセージとその応答が完全に削除されます。この操作は元に戻せません。`
		: 'このメッセージを削除してもよろしいですか？この操作は元に戻せません。'}
	confirmText={messageActions.deletionInfo && messageActions.deletionInfo.totalCount > 1
		? `${messageActions.deletionInfo.totalCount} 件のメッセージを削除`
		: '削除'}
	cancelText="キャンセル"
	variant="destructive"
	icon={Trash2}
	onConfirm={handleConfirmDelete}
	onCancel={() => messageActions.setShowDeleteDialog(false)}
/>

<DialogConfirmation
	bind:open={showForkDialog}
	title="会話をフォーク"
	description="このメッセージから分岐した新しい会話を作成します。"
	confirmText="フォーク"
	cancelText="キャンセル"
	icon={GitBranch}
	onConfirm={handleConfirmFork}
	onCancel={() => (showForkDialog = false)}
>
	<div class="flex flex-col gap-4 py-2">
		<div class="flex flex-col gap-2">
			<Label for="fork-name">タイトル</Label>

			<Input
				id="fork-name"
				class="text-foreground"
				placeholder="フォーク名を入力"
				type="text"
				bind:value={forkName}
			/>
		</div>

		<div class="flex items-center gap-2">
			<Checkbox
				id="fork-attachments"
				checked={forkIncludeAttachments}
				onCheckedChange={(checked) => {
					forkIncludeAttachments = checked === true;
				}}
			/>

			<Label for="fork-attachments" class="cursor-pointer text-sm font-normal">
				すべての添付ファイルを含める
			</Label>
		</div>
	</div>
</DialogConfirmation>
