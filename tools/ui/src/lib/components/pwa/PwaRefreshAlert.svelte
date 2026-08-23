<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';

	let { forceReload, needRefresh: needRefreshProp, updateServiceWorker } = $props();
	let needRefresh = $derived(needRefreshProp ?? false);
</script>

{#if needRefresh}
	<Card.Root class="overflow-hidden gap-1 py-5">
		<Card.Header class="px-5">
			<Card.Title class="text-sm font-medium">アップデートがあります</Card.Title>
		</Card.Header>

		<Card.Content class="gap-6 grid px-5">
			<p class="text-xs text-muted-foreground">新しいバージョンが利用可能です。再読み込みして更新してください。</p>

			<Button
				class="justify-self-end-safe"
				size="sm"
				onclick={() => {
					updateServiceWorker();

					if (forceReload) {
						window.location.reload();
					}

					needRefresh = false;
				}}
			>
				再読み込み
			</Button>
		</Card.Content>
	</Card.Root>
{/if}
