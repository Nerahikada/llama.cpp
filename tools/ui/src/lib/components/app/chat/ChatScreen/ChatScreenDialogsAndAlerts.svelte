<script lang="ts">
	import { Trash2 } from '@lucide/svelte';
	import { ErrorDialogType } from '$lib/enums';
	import {
		DialogChatError,
		DialogConfirmation,
		DialogEmptyFileAlert,
		DialogFileUploadError
	} from '$lib/components/app';

	let {
		showDeleteDialog,
		handleDeleteConfirm,
		showEmptyFileDialog,
		emptyFileNames,
		activeErrorDialog,
		handleErrorDialogOpenChange,
		fileUpload
	} = $props();
</script>

<DialogFileUploadError
	bind:open={fileUpload.showFileErrorDialog}
	fileErrorData={fileUpload.fileErrorData}
/>

<DialogConfirmation
	bind:open={showDeleteDialog}
	title="会話を削除"
	description="この会話を削除してもよろしいですか？この操作は元に戻せず、この会話内のすべてのメッセージが完全に削除されます。"
	confirmText="削除"
	cancelText="キャンセル"
	variant="destructive"
	icon={Trash2}
	onConfirm={handleDeleteConfirm}
	onCancel={() => (showDeleteDialog = false)}
/>

<DialogEmptyFileAlert
	bind:open={showEmptyFileDialog}
	emptyFiles={emptyFileNames}
	onOpenChange={(open) => {
		if (!open) {
			emptyFileNames = [];
		}
	}}
/>

<DialogChatError
	message={activeErrorDialog?.message ?? ''}
	contextInfo={activeErrorDialog?.contextInfo}
	onOpenChange={handleErrorDialogOpenChange}
	open={Boolean(activeErrorDialog)}
	type={activeErrorDialog?.type ?? ErrorDialogType.SERVER}
/>
