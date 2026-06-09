<script lang="ts">
	import { Eye, Mic, Video } from '@lucide/svelte';
	import { ModelModality } from '$lib/enums';

	interface Props {
		modalities: ModelModality[];
		class?: string;
	}

	let { modalities, class: className = '' }: Props = $props();
</script>

{#each modalities as modality (modality)}
	{#if modality === ModelModality.VISION || modality === ModelModality.AUDIO || modality === ModelModality.VIDEO}
		<span
			class={[
				'inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium',
				className
			]}
		>
			{#if modality === ModelModality.VISION}
				<Eye class="h-3 w-3" />

				ビジョン (画像)
			{:else if modality === ModelModality.VIDEO}
				<Video class="h-3 w-3" />

				ビジョン (動画)
			{:else}
				<Mic class="h-3 w-3" />

				音声
			{/if}
		</span>
	{/if}
{/each}
