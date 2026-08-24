<script lang="ts">
	import { parseReadFileMeta } from './parsers/read-file';
	import ToolCallBlock from './ToolCallBlock.svelte';
	import { SyntaxHighlightedCode } from '$lib/components/app';
	import { CODE_BLOCK, MAX_HEIGHT_CODE_BLOCK } from '$lib/constants';
	import type { AgenticSection } from '$lib/types';

	interface Props {
		section: AgenticSection;
		open: boolean;
		isStreaming: boolean;
		onToggle?: () => void;
	}

	let { isStreaming, onToggle, open, section }: Props = $props();

	const readFileMeta = $derived(parseReadFileMeta(section));
</script>

<ToolCallBlock {section} {open} {isStreaming} meta={readFileMeta} {onToggle}>
	{#snippet titleSnippet()}
		<span class="text-muted-foreground">ファイルを読み込み </span>
		<span class="font-mono">{readFileMeta?.fileName}</span>
		{#if readFileMeta?.lineRange}
			<span class="text-muted-foreground"
				>&nbsp;({readFileMeta.lineRange.start}-{readFileMeta.lineRange.end} 行目)</span
			>
		{/if}
	{/snippet}

	{#snippet children(_meta, _ctx)}
		{#if section.toolResult}
			<SyntaxHighlightedCode
				code={section.toolResult}
				language={readFileMeta?.language ?? CODE_BLOCK.DEFAULT_LANGUAGE}
				maxHeight={MAX_HEIGHT_CODE_BLOCK}
			/>
		{:else}
			<div class="rounded bg-muted/20 p-2 text-xs text-muted-foreground/70 italic">
				ファイル内容を待機中...
			</div>
		{/if}
	{/snippet}
</ToolCallBlock>
