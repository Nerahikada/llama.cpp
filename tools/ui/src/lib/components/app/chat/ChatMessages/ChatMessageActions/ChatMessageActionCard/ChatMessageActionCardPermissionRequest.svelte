<script lang="ts">
	import { ChevronDown, ShieldQuestion } from '@lucide/svelte';
	import { ChatMessageActionCard } from '$lib/components/app';
	import { Button } from '$lib/components/ui/button';
	import * as ButtonGroup from '$lib/components/ui/button-group';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { ToolSource, ToolPermissionDecision } from '$lib/enums';
	import { TOOL_SERVER_LABELS } from '$lib/constants';
	import { toolsStore } from '$lib/stores/tools.svelte';

	interface Props {
		toolName: string;
		serverLabel: string;
		onDecision: (decision: ToolPermissionDecision) => void;
	}

	let { toolName, serverLabel, onDecision }: Props = $props();
</script>

<ChatMessageActionCard icon={ShieldQuestion}>
	{#snippet message()}
		{#if serverLabel}
			<span class="font-semibold">{serverLabel}</span> の
		{/if}

		<span class="font-semibold">{toolName}</span>

		の使用を許可しますか？
	{/snippet}

	{#snippet actions()}
		<DropdownMenu.Root>
			<ButtonGroup.Root
				class="overflow-hidden rounded-md bg-foreground text-white shadow-sm dark:bg-secondary dark:text-foreground"
			>
				<Button
					class="rounded-none! shadow-none!"
					size="sm"
					onclick={() => onDecision(ToolPermissionDecision.ONCE)}
				>
					今回のみ許可
				</Button>

				<ButtonGroup.Separator />

				<DropdownMenu.Trigger>
					<Button size="sm" class="rounded-none! !ps-2 shadow-none!">
						<ChevronDown class="h-3.5 w-3.5" />
					</Button>
				</DropdownMenu.Trigger>
			</ButtonGroup.Root>

			<DropdownMenu.Content align="start" class="min-w-[8rem]">
				<DropdownMenu.Item onclick={() => onDecision(ToolPermissionDecision.ALWAYS)}>
					<pre>{toolName}</pre>
					ツールを常に許可
				</DropdownMenu.Item>
				{#if serverLabel}
					<DropdownMenu.Item onclick={() => onDecision(ToolPermissionDecision.ALWAYS_SERVER)}>
						{serverLabel} のすべてのツールを常に許可
					</DropdownMenu.Item>
				{:else}
					{@const source = toolsStore.getToolSource(toolName)}
					{@const providerName =
						source === ToolSource.BUILTIN
							? TOOL_SERVER_LABELS[ToolSource.BUILTIN]
							: source === ToolSource.CUSTOM
								? TOOL_SERVER_LABELS[ToolSource.CUSTOM]
								: 'MCP ツール'}
					<DropdownMenu.Item onclick={() => onDecision(ToolPermissionDecision.ALWAYS_SERVER)}>
						{providerName} のすべてのツールを承認
					</DropdownMenu.Item>
				{/if}
			</DropdownMenu.Content>
		</DropdownMenu.Root>

		<Button
			variant="destructive"
			size="sm"
			class="text-destructive hover:text-destructive"
			onclick={() => onDecision(ToolPermissionDecision.DENY)}
		>
			拒否
		</Button>
	{/snippet}
</ChatMessageActionCard>
