<script lang="ts">
	import { serverStore } from '$lib/stores';

	interface Props {
		isEmpty: boolean;
	}

	let { isEmpty = false }: Props = $props();
</script>

<div
	class={[
		'pointer-events-none mb-4 hidden px-4 text-center text-balance',
		isEmpty && 'mb-[calc(50dvh-8rem)] md:mb-8 pointer-events-auto block!'
	]}
>
	<h1 class="mb-2 text-2xl font-semibold tracking-tight md:text-3xl">こんにちは</h1>

	<p class="text-muted-foreground md:text-lg">
		{serverStore.props?.modalities?.audio
			? '音声を録音、メッセージを入力'
			: 'メッセージを入力'}、またはファイルをアップロードして始めましょう
	</p>
</div>
