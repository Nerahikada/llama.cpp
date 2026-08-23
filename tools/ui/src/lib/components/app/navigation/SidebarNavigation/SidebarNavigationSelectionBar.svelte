<script lang="ts">
	import { Download, Pin, PinOff, Trash2, X } from '@lucide/svelte';
	import { ActionIcon, DialogConfirmation } from '$lib/components/app';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { TooltipSide } from '$lib/enums';

	interface Props {
		class?: string;
		selectedCount: number;
		visibleCount: number;
		allVisibleSelected: boolean;
		someVisibleSelected: boolean;
		someSelectedPinned: boolean;
		pinStateIsMixed: boolean;
		onSelectAllToggle: () => void;
		onBulkPinToggle: () => void;
		onBulkExport: () => void;
		onBulkDelete: () => void;
		onClose: () => void;
	}

	let {
		allVisibleSelected,
		class: className = '',
		onBulkDelete,
		onBulkExport,
		onBulkPinToggle,
		onClose,
		onSelectAllToggle,
		pinStateIsMixed,
		selectedCount,
		someSelectedPinned,
		someVisibleSelected,
		visibleCount
	}: Props = $props();

	let showDeleteDialog = $state(false);

	function handleDeleteClick() {
		showDeleteDialog = true;
	}

	function handleDeleteConfirm() {
		showDeleteDialog = false;
		onBulkDelete();
	}

	function handleDeleteCancel() {
		showDeleteDialog = false;
	}

	const hasSelection = $derived(selectedCount > 0);
	const isMasterChecked = $derived(allVisibleSelected);
	const isMasterIndeterminate = $derived(!allVisibleSelected && someVisibleSelected);

	const pinTooltip = $derived(
		hasSelection
			? pinStateIsMixed
				? '混在した選択状態では利用できません'
				: someSelectedPinned
					? selectedCount === 1
						? 'ピン留めを解除'
						: 'すべてのピン留めを解除'
					: selectedCount === 1
						? 'ピン留め'
						: 'すべてピン留め'
			: 'ピン留め'
	);

	const pinDisabled = $derived(!hasSelection || pinStateIsMixed);
</script>

<div
	role="toolbar"
	aria-label="選択した会話への一括操作"
	class="flex items-center gap-1.5 rounded-xl border border-border/50 bg-background/50 px-2 py-1.5 shadow-sm backdrop-blur-xl {className}"
>
	<label class="flex min-w-0 cursor-pointer items-center gap-2">
		<Checkbox
			checked={isMasterChecked}
			indeterminate={isMasterIndeterminate}
			onCheckedChange={onSelectAllToggle}
			aria-label={isMasterChecked ? 'すべての選択を解除' : 'すべて選択'}
		/>

		<span class="truncate text-xs font-medium text-muted-foreground">
			{selectedCount} / {visibleCount} 件選択中
		</span>
	</label>

	<div class="ml-auto flex items-center gap-0.75">
		<ActionIcon
			icon={someSelectedPinned ? PinOff : Pin}
			tooltip={pinTooltip}
			tooltipSide={TooltipSide.TOP}
			disabled={pinDisabled}
			ariaLabel={pinTooltip}
			size="sm"
			iconSize="h-3.5 w-3.5"
			class="h-7 w-7 rounded-md bg-transparent backdrop-blur-none hover:bg-accent! {pinDisabled
				? 'cursor-not-allowed'
				: ''} {!pinDisabled ? 'opacity-100' : 'opacity-40'}"
			onclick={onBulkPinToggle}
		/>

		<ActionIcon
			icon={Download}
			tooltip={hasSelection ? 'エクスポート' : 'エクスポート'}
			tooltipSide={TooltipSide.TOP}
			disabled={!hasSelection}
			ariaLabel="選択項目をエクスポート"
			size="sm"
			iconSize="h-3.5 w-3.5"
			class="h-7 w-7 rounded-md bg-transparent backdrop-blur-none hover:bg-accent! {hasSelection
				? 'opacity-100'
				: 'opacity-40'}"
			onclick={onBulkExport}
		/>

		<ActionIcon
			icon={Trash2}
			tooltip="選択項目を削除"
			tooltipSide={TooltipSide.TOP}
			disabled={!hasSelection}
			ariaLabel="選択項目を削除"
			size="sm"
			iconSize="h-3.5 w-3.5 text-destructive"
			class="h-7 w-7 rounded-md bg-transparent backdrop-blur-none hover:bg-destructive/10! dark:hover:bg-destructive/20! disabled:hover:bg-transparent {hasSelection
				? 'opacity-100'
				: 'opacity-40'}"
			onclick={handleDeleteClick}
		/>

		<div class="mx-1 h-4 w-px bg-border" aria-hidden="true"></div>

		<ActionIcon
			icon={X}
			tooltip="一括選択モードを終了"
			tooltipSide={TooltipSide.TOP}
			ariaLabel="一括選択モードを終了"
			size="sm"
			iconSize="h-3.5 w-3.5"
			class="h-7 w-7 rounded-md bg-transparent backdrop-blur-none hover:bg-accent!"
			onclick={onClose}
		/>
	</div>
</div>

<DialogConfirmation
	bind:open={showDeleteDialog}
	title="{selectedCount} 件の会話を削除"
	description="この操作は取り消せません。選択した会話とそのメッセージ、フォークを含めてすべて完全に削除されます。"
	confirmText={selectedCount === 1 ? '削除' : `${selectedCount} 件を削除`}
	cancelText="キャンセル"
	variant="destructive"
	icon={Trash2}
	onConfirm={handleDeleteConfirm}
	onCancel={handleDeleteCancel}
/>
