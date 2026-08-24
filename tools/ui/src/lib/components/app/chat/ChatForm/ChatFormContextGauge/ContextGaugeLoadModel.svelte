<script lang="ts">
	import { Loader2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		modelId: string | null;
		isLoading: boolean;
		onLoad: () => void;
	}

	let { isLoading, modelId, onLoad }: Props = $props();
</script>

{#if modelId !== null && !isLoading}
	<div class="flex flex-col gap-2 border-t border-border/50 pt-2 text-xs text-muted-foreground">
		<span>利用可能なコンテキスト長はモデルの読み込み後に表示されます。</span>
		<Button size="sm" variant="secondary" class="self-start" onclick={onLoad}>モデルを読み込む</Button>
	</div>
{:else if isLoading}
	<div class="flex items-center gap-2 border-t border-border/50 pt-2 text-xs text-muted-foreground">
		<Loader2 class="h-3.5 w-3.5 animate-spin" />
		<span>モデルを読み込み中...</span>
	</div>
{/if}
