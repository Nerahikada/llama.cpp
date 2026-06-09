<script lang="ts">
	import { Eye } from '@lucide/svelte';
	import { ActionIcon, ActionIconCopyToClipboard } from '$lib/components/app';
	import { FileTypeText } from '$lib/enums';

	interface Props {
		code: string;
		language: string;
		disabled?: boolean;
		onPreview?: (code: string, language: string) => void;
	}

	let { code, language, disabled = false, onPreview }: Props = $props();

	const showPreview = $derived(language?.toLowerCase() === FileTypeText.HTML);
</script>

<div class="code-block-actions">
	<ActionIconCopyToClipboard
		text={code}
		canCopy={!disabled}
		ariaLabel={disabled ? 'コードが未完成です' : 'コードをコピー'}
	/>

	{#if showPreview}
		<ActionIcon
			icon={Eye}
			tooltip={disabled ? 'コードが未完成です' : 'コードをプレビュー'}
			{disabled}
			onclick={() => onPreview!(code, language)}
		/>
	{/if}
</div>
