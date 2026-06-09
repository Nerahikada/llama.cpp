<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { ConversationSelection } from '$lib/components/app';

	interface Props {
		conversations: DatabaseConversation[];
		messageCountMap?: Map<string, number>;
		mode: 'export' | 'import';
		onCancel: () => void;
		onConfirm: (selectedConversations: DatabaseConversation[]) => void;
		open?: boolean;
	}

	let {
		conversations,
		messageCountMap = new Map(),
		mode,
		onCancel,
		onConfirm,
		open = $bindable(false)
	}: Props = $props();

	let conversationSelectionRef: ConversationSelection | undefined = $state();

	let previousOpen = $state(false);

	$effect(() => {
		if (open && !previousOpen && conversationSelectionRef) {
			conversationSelectionRef.reset();
		} else if (!open && previousOpen) {
			onCancel();
		}

		previousOpen = open;
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Portal>
		<Dialog.Overlay class="z-[1000000]" />

		<Dialog.Content class="z-[1000001] max-w-2xl">
			<Dialog.Header>
				<Dialog.Title>
					{mode === 'export' ? 'エクスポート' : 'インポート'}する会話を選択
				</Dialog.Title>

				<Dialog.Description>
					{#if mode === 'export'}
						エクスポートする会話を選択してください。選択した会話は JSON
						ファイルとしてダウンロードされます。
					{:else}
						インポートする会話を選択してください。選択した会話は既存の会話と統合されます。
					{/if}
				</Dialog.Description>
			</Dialog.Header>

			<ConversationSelection
				bind:this={conversationSelectionRef}
				{conversations}
				{messageCountMap}
				{mode}
				{onCancel}
				{onConfirm}
			/>
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>
