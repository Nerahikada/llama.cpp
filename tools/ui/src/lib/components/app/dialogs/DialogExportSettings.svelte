<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import Label from '$lib/components/ui/label/label.svelte';
	import { Shield, ShieldOff } from '@lucide/svelte';

	let {
		open = $bindable(),
		includeSensitiveData = $bindable(false),
		onCancel,
		onConfirm
	}: {
		open: boolean;
		includeSensitiveData: boolean;
		onCancel: () => void;
		onConfirm: () => void;
	} = $props();

	function handleOpenChange(newOpen: boolean) {
		if (!newOpen) {
			onCancel();
		}
	}
</script>

<AlertDialog.Root {open} onOpenChange={handleOpenChange}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title class="flex items-center gap-2">
				{#if includeSensitiveData}
					<ShieldOff class="h-5 w-5 text-destructive" />
				{:else}
					<Shield class="h-5 w-5 text-destructive" />
				{/if}
				設定をエクスポート
			</AlertDialog.Title>

			<AlertDialog.Description>
				{#if includeSensitiveData}
					<p class="text-amber-500">
						警告: このエクスポートには、API キーや MCP サーバーのカスタムヘッダー (認証トークンなど)
						といった機密データが含まれます。信頼できない相手とこのファイルを共有しないでください。
					</p>
				{:else}
					<p>
						認証情報を保護するため、機密データ (API キー、MCP サーバーのカスタムヘッダー)
						はエクスポートに含まれません。
					</p>
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="flex items-center gap-2 py-2">
			<Checkbox id="include-sensitive" bind:checked={includeSensitiveData} />

			<Label
				for="include-sensitive"
				class="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{#if includeSensitiveData}
					<span class="text-destructive">機密データを含める (非推奨)</span>
				{:else}
					<span>機密データを含める</span>
				{/if}
			</Label>
		</div>

		<AlertDialog.Footer>
			<AlertDialog.Cancel onclick={onCancel}>キャンセル</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={onConfirm}
				class="bg-destructive text-white hover:bg-destructive/80"
			>
				{#if includeSensitiveData}
					このままエクスポート
				{:else}
					機密データを除いてエクスポート
				{/if}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
