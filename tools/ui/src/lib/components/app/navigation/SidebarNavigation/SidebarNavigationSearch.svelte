<script lang="ts">
	import { SearchInput } from '$lib/components/app';

	interface Props {
		value?: string;
		placeholder?: string;
		onInput?: (value: string) => void;
		class?: string;
	}

	let {
		class: className,
		onInput,
		placeholder = '会話を検索...',
		value = $bindable('')
	}: Props = $props();
</script>

<div class="mb-4 px-2 {className}">
	<SearchInput bind:value {placeholder} {onInput} />
</div>
