<script lang="ts">
	let { eventId }: { eventId: string } = $props();

	let id = $props.id();
	let optionCount = $state(2);
</script>

<form method="POST" action="?/postPoll" class="flex flex-col items-stretch space-y-4">
	<input name="event" value={eventId} hidden />
	<label for="{id}-poll-title" class="label">Title</label>
	<input id="{id}-poll-title" name="title" placeholder="Poll Title" class="input w-full" min="1" />
	<div class="flex justify-between">
		<p class="label">Options</p>
		<button type="button" class="btn btn-neutral" onclick={() => (optionCount += 1)}
			>Add Option</button
		>
	</div>
	{#each Array(optionCount).keys() as i}
		<input
			id="{id}-option-{i}"
			name="option"
			placeholder="Enter option {i + 1}"
			min="1"
			class="input w-full"
		/>
	{/each}
	<button class="btn w-full btn-primary" type="submit">Post Poll</button>
</form>
