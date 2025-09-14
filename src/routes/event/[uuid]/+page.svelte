<script lang="ts">
	let { data } = $props();
	console.log(data);
</script>

<div class="flex h-screen items-stretch justify-center">
	<div class="w-1/2 bg-white p-16 shadow-2xl">
		<h1 class="text-4xl font-bold">{data.event.title}</h1>
		<p>{data.event.description}</p>
	</div>
</div>
