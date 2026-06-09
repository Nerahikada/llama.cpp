<script lang="ts">
	interface Props {
		isLoading: boolean;
	}

	let { isLoading }: Props = $props();
</script>

<div class="py-4 text-center text-sm text-muted-foreground">
	{#if isLoading}
		リソースを読み込み中...
	{:else}
		利用可能なリソースがありません
	{/if}
</div>
