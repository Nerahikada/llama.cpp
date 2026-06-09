<script lang="ts">
	import { Video } from '@lucide/svelte';

	interface Props {
		currentItem: { name?: string } | null;
		videoSrc: string | null;
	}

	let { currentItem, videoSrc }: Props = $props();
</script>

<div class="flex flex-1 items-center justify-center p-8">
	<div class="w-full max-w-md text-center">
		<Video class="mx-auto mb-4 h-16 w-16 text-white/50" />

		{#if videoSrc}
			<video controls class="mb-4 w-full" src={videoSrc}>
				<track kind="captions" src="" />
				お使いのブラウザは video 要素に対応していません。
			</video>
		{:else}
			<p class="mb-4 text-white/70">動画プレビューを利用できません</p>
		{/if}

		<p class="text-sm text-white/50">{currentItem?.name || '動画'}</p>
	</div>
</div>
