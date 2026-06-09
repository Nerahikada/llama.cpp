<script lang="ts">
	import {
		SettingsChatDesktopSidebar,
		SettingsChatFields,
		SettingsChatImportExportTab,
		SettingsChatMobileHeader,
		SettingsChatToolsTab,
		SettingsFooter
	} from '$lib/components/app/settings';
	import { config, settingsStore } from '$lib/stores/settings.svelte';
	import {
		NUMERIC_FIELDS,
		POSITIVE_INTEGER_FIELDS,
		SETTINGS_CHAT_SECTIONS,
		SETTINGS_SECTION_TITLES,
		type SettingsSection
	} from '$lib/constants';
	import { RouterService } from '$lib/services/router.service';
	import { setMode } from 'mode-watcher';
	import { ColorMode } from '$lib/enums/ui.enums';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { setChatSettingsConfigContext } from '$lib/contexts';
	import { settingsReferrer } from '$lib/stores/settings-referrer.svelte';
	import { modelsStore } from '$lib/stores/models.svelte';
	import { isRouterMode } from '$lib/stores/server.svelte';
	interface Props {
		initialSection?: string;
		getSectionHref?: (section: SettingsSection) => string;
	}

	let { initialSection, getSectionHref }: Props = $props();

	let activeSlug = $derived(
		initialSection ?? (page.params as Record<string, string | undefined>).section ?? 'general'
	);

	let currentSection = $derived(
		SETTINGS_CHAT_SECTIONS.find((section) => section.slug === activeSlug) ||
			SETTINGS_CHAT_SECTIONS[0]
	);

	let localConfig: SettingsConfigType = $state({ ...config() });

	let mobileHeader: { updateCarousel: () => void } | undefined;

	let fetchInitiated = false;

	$effect(() => {
		if (isRouterMode() && currentSection.fields && !fetchInitiated) {
			fetchInitiated = true;

			void modelsStore
				.fetch()
				.then(() => modelsStore.fetchRouterModels())
				.then(() => modelsStore.fetchModalitiesForLoadedModels())
				.then(() => modelsStore.ensureFirstModelSelected());
		}
	});

	function handleThemeChange(newTheme: string) {
		localConfig.theme = newTheme;
		setMode(newTheme as ColorMode);
	}

	function handleConfigChange(key: string, value: string | boolean) {
		localConfig[key] = value;
	}

	function handleReset() {
		localConfig = { ...config() };
		setMode(localConfig.theme as ColorMode);
		mobileHeader?.updateCarousel();
	}

	function handleSave() {
		if (
			localConfig.customJson &&
			typeof localConfig.customJson === 'string' &&
			localConfig.customJson.trim()
		) {
			try {
				JSON.parse(localConfig.customJson);
			} catch (error) {
				alert('カスタムパラメータの JSON が無効です。形式を確認してもう一度お試しください。');
				console.error(error);
				return;
			}
		}

		const processedConfig = { ...localConfig };

		for (const field of NUMERIC_FIELDS) {
			if (processedConfig[field] !== undefined && processedConfig[field] !== '') {
				const numValue = Number(processedConfig[field]);
				if (!isNaN(numValue)) {
					if ((POSITIVE_INTEGER_FIELDS as readonly string[]).includes(field)) {
						processedConfig[field] = Math.max(1, Math.round(numValue));
					} else {
						processedConfig[field] = numValue;
					}
				} else {
					alert(`${field} の数値が無効です。有効な数値を入力してください。`);
					return;
				}
			}
		}

		settingsStore.updateMultipleConfig(processedConfig);
		goto(settingsReferrer.url);
	}

	export function reset() {
		localConfig = { ...config() };
	}

	setChatSettingsConfigContext({
		get localConfig() {
			return localConfig;
		},
		handleConfigChange,
		handleThemeChange
	});
</script>

<div
	class="mx-auto flex h-full max-h-[100dvh] w-full flex-col overflow-y-auto md:pl-8"
	in:fade={{ duration: 150 }}
>
	<div class="flex flex-1 flex-col gap-4 md:flex-row">
		<SettingsChatDesktopSidebar
			sections={SETTINGS_CHAT_SECTIONS}
			isActive={(section: SettingsSection) => section.slug === activeSlug}
			getHref={getSectionHref ??
				((section: SettingsSection) => RouterService.settings(section.slug))}
		/>

		<SettingsChatMobileHeader
			sections={SETTINGS_CHAT_SECTIONS}
			isActive={(section: SettingsSection) => section.slug === activeSlug}
			getHref={getSectionHref ??
				((section: SettingsSection) => RouterService.settings(section.slug))}
			bind:this={mobileHeader}
		/>

		<div class="mx-auto max-w-3xl flex-1">
			<div class="space-y-6 p-4 md:p-6 md:pt-28">
				<div class="grid">
					<div class="mb-6 flex items-center gap-2 border-b border-border/30 pb-6 md:flex">
						<currentSection.icon class="h-5 w-5" />
						<h3 class="text-lg font-semibold">{currentSection.title}</h3>
					</div>

					{#if currentSection.title === SETTINGS_SECTION_TITLES.TOOLS}
						<SettingsChatToolsTab />
					{:else if currentSection.title === SETTINGS_SECTION_TITLES.IMPORT_EXPORT}
						<SettingsChatImportExportTab />
					{:else if currentSection.fields}
						<div class="space-y-6">
							<SettingsChatFields
								fields={currentSection.fields}
								{localConfig}
								onConfigChange={handleConfigChange}
								onThemeChange={handleThemeChange}
							/>
						</div>
					{/if}
				</div>

				<div class="mt-8 border-t border-border/30 pt-6">
					<p class="text-xs text-muted-foreground">設定はブラウザの localStorage に保存されます</p>
				</div>
			</div>

			<SettingsFooter onReset={handleReset} onSave={handleSave} />
		</div>
	</div>
</div>
