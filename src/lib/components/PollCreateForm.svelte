<script lang="ts">
	let { eventId, onCancelForm }: { eventId: string; onCancelForm(): void } = $props();

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
	<div class="mt-4 flex gap-4">
		<button class="btn mb-4 w-min flex-1/4 btn-neutral" onclick={onCancelForm}> Cancel </button>
		<button class="btn flex-3/4 btn-primary" type="submit">Post Poll</button>
	</div>
</form>
