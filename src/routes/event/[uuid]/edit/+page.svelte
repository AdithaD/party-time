<script lang="ts">
	import { dateToDatetimeLocalString } from '$lib/utils.js';
	import { int } from 'drizzle-orm/mysql-core';

	let { data } = $props();

	let newEvent = $state(data.event);
	let hasEdits = $state(false);
</script>

<div class="relative flex h-screen items-stretch justify-center">
	<div class="w-1/2 bg-base-100 p-16 shadow-2xl">
		<form class="space-y-4" method="POST" onchange={() => (hasEdits = true)}>
			<input name="event" value={data.event.id} hidden />
			<div class="flex flex-col gap-3">
				<label class="label" for="title">Title</label>
				<input name="title" class="input w-full" bind:value={newEvent.title} />
			</div>
			<div class="flex flex-col gap-3">
				<label class="label" for="location">Location</label>
				<input class="input w-full" name="location" id="location" bind:value={newEvent.location} />
			</div>
			<div class="flex justify-between space-x-8">
				<div class="flex flex-col gap-3">
					<label class="label" for="datetime-from">Start Time</label>
					<input
						class="input"
						type="datetime-local"
						name="datetime-from"
						id="datetime-from"
						value={data.event.scheduledTime
							? dateToDatetimeLocalString(data.event.scheduledTime)
							: ''}
					/>
				</div>
				<div class="flex flex-col gap-3">
					<label class="label" for="datetime-to">End Time</label>
					<input
						class="input"
						type="datetime-local"
						name="datetime-to"
						id="datetime-to"
						value={data.event.endTime ? dateToDatetimeLocalString(data.event.endTime) : ''}
					/>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<label class="label" for="description">Description</label>
				<textarea class="textarea w-full" name="description" bind:value={newEvent.description}
				></textarea>
			</div>
			<div class="flex justify-between">
				<a href={`/events/${data.event.id}`} class="btn btn-error">Cancel</a>
				<button type="submit" class="btn btn-primary">Save Changes</button>
			</div>
		</form>
	</div>
</div>
