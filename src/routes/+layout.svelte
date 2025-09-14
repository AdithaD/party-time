<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Button from '$lib/components/ui/button/button.svelte';

	let { children } = $props();

	let name = $state('');

	function changeName(): void {
		localStorage.setItem('name', name);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<main class="relative min-h-screen bg-pink-100">
	{@render children?.()}
	<div class="absolute bottom-10 flex w-screen justify-center">
		<div
			class="flex w-1/4 items-center justify-between rounded-2xl border-2 bg-amber-50 p-4 shadow-md"
		>
			<div>Currently editing as</div>
			<input class="border-2 bg-white" type="text" bind:value={name} />
			<Button onclick={changeName}>Save</Button>
		</div>
	</div>
</main>
