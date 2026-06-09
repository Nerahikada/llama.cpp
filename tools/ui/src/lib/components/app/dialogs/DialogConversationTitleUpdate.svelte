<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		open: boolean;
		currentTitle: string;
		newTitle: string;
		onConfirm: () => void;
		onCancel: () => void;
	}

	let { open = $bindable(), currentTitle, newTitle, onConfirm, onCancel }: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>会話のタイトルを更新しますか?</AlertDialog.Title>

			<AlertDialog.Description>
				最初のメッセージの内容に合わせて会話のタイトルを更新しますか?
			</AlertDialog.Description>
		</AlertDialog.Header>

		<div class="space-y-4 pt-2 pb-6">
			<div class="space-y-2">
				<p class="text-sm font-medium text-muted-foreground">現在のタイトル:</p>

				<p class="rounded-md bg-muted/50 p-3 text-sm font-medium">{currentTitle}</p>
			</div>

			<div class="space-y-2">
				<p class="text-sm font-medium text-muted-foreground">新しいタイトル:</p>

				<p class="rounded-md bg-muted/50 p-3 text-sm font-medium">{newTitle}</p>
			</div>
		</div>

		<AlertDialog.Footer>
			<Button variant="outline" onclick={onCancel}>現在のタイトルを維持</Button>

			<Button onclick={onConfirm}>タイトルを更新</Button>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
