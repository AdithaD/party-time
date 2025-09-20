<script lang="ts">
	import { dateToDatetimeLocalString, daysOfWeek } from '$lib/utils.js';

	let { data, form } = $props();

	type DaysOfWeek = (typeof daysOfWeek)[number];

	let selectedDaysOfWeek = $state<DaysOfWeek[]>([]);

	let newEvent = $state(data.event);
	let hasEdits = $state(false);

	let selectedType = $state<'days' | 'range'>('days');
</script>

<div class="relative flex h-screen items-stretch justify-center">
	<div class="w-1/2 bg-base-100 p-16 shadow-2xl">
		<form class="space-y-4" action="?/edit" method="POST" onchange={() => (hasEdits = true)}>
			<input name="event" value={data.event.id} hidden />
			<div class="flex flex-col gap-3">
				<label class="label" for="title">Title</label>
				<input name="title" class="input w-full" bind:value={newEvent.title} />
				<div class="text-error">{form?.zodError?.fieldErrors.title}</div>
			</div>
			<div class="flex flex-col gap-3">
				<label class="label" for="location">Location</label>
				<input class="input w-full" name="location" id="location" bind:value={newEvent.location} />
				<div class="text-error">{form?.zodError?.fieldErrors.location}</div>
			</div>
			<div class="flex flex-col justify-between space-x-8 xl:flex-row">
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
					<div class="text-error">{form?.zodError?.fieldErrors.dateTimeFrom}</div>
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
					<div class="text-error">{form?.zodError?.fieldErrors.dateTimeTo}</div>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<label class="label" for="description">Description</label>
				<textarea class="textarea w-full" name="description" bind:value={newEvent.description}
				></textarea>
				<div class="text-error">{form?.zodError?.fieldErrors.description}</div>
			</div>
			<div class="flex flex-col gap-4">
				<h2 class="label">Availability</h2>
				<div class="flex items-center gap-4">
					<input
						class="radio"
						type="radio"
						value="days"
						name="availabilityType"
						bind:group={selectedType}
					/>
					<label class="label" for="availabilityDays">Amount of Days</label>
					<input
						class="input input-sm"
						value="7"
						type="number"
						placeholder="7 days"
						name="availabilityDays"
						disabled={selectedType != 'days'}
					/>
				</div>
				<div class="items-center gap-4 lg:flex">
					<input
						class="radio"
						type="radio"
						value="range"
						name="availabilityType"
						bind:group={selectedType}
					/>
					<div class="label">Date Range</div>
					<input
						class="input input-sm"
						type="date"
						name="availabilityFrom"
						disabled={selectedType != 'range'}
					/>
					<div>-</div>
					<input
						class="input input-sm"
						type="date"
						name="availabilityTo"
						disabled={selectedType != 'range'}
					/>
				</div>
				<div
					class="grid grid-cols-4 grid-rows-2 justify-between gap-4 2xl:grid-cols-7 2xl:grid-rows-1"
				>
					{#each daysOfWeek as day}
						<div
							class="items-center-safe rounded-box border border-neutral transition-colors hover:border-primary
							{selectedDaysOfWeek.includes(day) ? 'border-primary ' : ''}"
						>
							<input
								class="checkbox border-0"
								id="day-{day}"
								type="checkbox"
								value={day}
								name="daysOfWeek"
								bind:group={selectedDaysOfWeek}
								hidden
							/>
							<label
								for="day-{day}"
								class="label w-full px-4 py-2 text-center text-xs text-white capitalize"
								>{day}</label
							>
						</div>
					{/each}
				</div>
				<div class="flex justify-between gap-4">
					<button
						type="button"
						class="btn flex-grow btn-neutral"
						onclick={() => (selectedDaysOfWeek = [...daysOfWeek])}>All</button
					>
					<button
						type="button"
						class="btn flex-grow btn-neutral"
						onclick={() =>
							(selectedDaysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])}
						>Weekdays</button
					>
					<button
						type="button"
						class="btn flex-grow btn-neutral"
						onclick={() => (selectedDaysOfWeek = ['saturday', 'sunday'])}>Weekends</button
					>
					<button
						type="button"
						class="btn flex-grow btn-neutral"
						onclick={() => (selectedDaysOfWeek = [])}>None</button
					>
				</div>
			</div>
			<div class="divider my-8"></div>
			<div class="flex justify-between">
				<a href={`/event/${data.eventId}`} class="btn btn-error">Cancel</a>
				<button formaction="?/deleteEvent" class="btn btn-outline btn-error">Delete</button>
				<button type="submit" class="btn btn-primary">Save Changes</button>
			</div>
		</form>
	</div>
</div>
