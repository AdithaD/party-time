<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';

	let { data } = $props();
	console.log(data);
</script>

<div class="flex h-screen items-stretch justify-center">
	<div class="w-1/2 space-y-8 bg-white p-16 shadow-2xl">
		<div class="flex justify-between">
			<h1 class="text-4xl font-bold">{data.event.title}</h1>
			<Button>Register</Button>
		</div>
		<div class="space-y-4">
			<div class="flex space-x-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
					/>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
					/>
				</svg>
				<div>Location</div>
			</div>
			<div class="flex space-x-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
					class="size-6"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
					/>
				</svg>

				<div>Date</div>
			</div>
		</div>
		<div>
			<h2 class="mb-2 font-semibold">Description</h2>
			<p>{data.event.description}</p>
		</div>
		<div>
			<h2 class="mb-2 font-semibold">Polls</h2>
			<div></div>
		</div>
	</div>
</div>
