<script lang="ts">
	import { Pencil, RefreshCw, Trash2 } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		isHealthChecking: boolean;
		onEdit: () => void;
		onRefresh: () => void;
		onDelete: () => void;
	}

	let { isHealthChecking, onDelete, onEdit, onRefresh }: Props = $props();
</script>

<div class="flex shrink-0 items-center gap-1">
	<Button variant="ghost" size="icon" class="h-7 w-7" onclick={onEdit} aria-label="編集">
		<Pencil class="h-3.5 w-3.5" />
	</Button>

	<Button
		variant="ghost"
		size="icon"
		class="h-7 w-7"
		onclick={onRefresh}
		disabled={isHealthChecking}
		aria-label="更新"
	>
		<RefreshCw class="h-3.5 w-3.5" />
	</Button>

	<Button
		variant="ghost"
		size="icon"
		class="hover:text-destructive-foreground h-7 w-7 text-destructive hover:bg-destructive/10"
		onclick={onDelete}
		aria-label="削除"
	>
		<Trash2 class="h-3.5 w-3.5" />
	</Button>
</div>
