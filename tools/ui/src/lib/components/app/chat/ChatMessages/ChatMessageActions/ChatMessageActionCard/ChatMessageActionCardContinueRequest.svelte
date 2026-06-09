<script lang="ts">
	import { RotateCw } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';
	import ChatMessageActionCard from './ChatMessageActionCard.svelte';

	interface Props {
		onDecision: (shouldContinue: boolean) => void;
	}

	let { onDecision }: Props = $props();
</script>

<ChatMessageActionCard icon={RotateCw}>
	{#snippet message()}
		エージェントのターン上限に達しました。続行しますか？
	{/snippet}

	{#snippet actions()}
		<Button size="sm" onclick={() => onDecision(true)}>続行</Button>

		<Button
			variant="destructive"
			size="sm"
			class="text-destructive hover:text-destructive"
			onclick={() => onDecision(false)}
		>
			停止
		</Button>
	{/snippet}
</ChatMessageActionCard>
