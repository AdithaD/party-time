<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();

	let name = $state('');

	function changeName(): void {
		localStorage.setItem('name', name);
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>
<main class="relative min-h-screen bg-base-200">
	{@render children?.()}
</main>
