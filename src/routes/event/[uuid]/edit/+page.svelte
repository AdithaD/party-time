<script lang="ts">
	import {
		bitfieldToDaysOfWeek,
		dateToDatetimeLocalString,
		daysOfWeek,
		minifyDayOfWeek
	} from '$lib/utils.js';
	import { Checkbox, Label } from 'bits-ui';
	import { format } from 'date-fns';

	let { data, form } = $props();

	type DaysOfWeek = (typeof daysOfWeek)[number];

	let selectedDaysOfWeek = $state<DaysOfWeek[]>(
		bitfieldToDaysOfWeek(data.event.availability.daysOfWeek).values().toArray()
	);

	let newEvent = $state(data.event);
	let hasEdits = $state(false);

	let selectedType = $state<'days' | 'range'>('range');
</script>

<div class="relative flex min-h-screen items-stretch justify-center">
	<div class="w-full bg-base-100 p-16 shadow-2xl xl:w-1/2">
		<form class="space-y-4" action="?/edit" method="POST" onchange={() => (hasEdits = true)}>
			<input name="event" value={data.event.id} hidden />
			<div class="flex flex-col gap-3">
				<label class="label" for="title">Title</label>
				<input id="title" name="title" class="input w-full" bind:value={newEvent.title} />
				<div class="text-error">{form?.zodError?.fieldErrors.title}</div>
			</div>
			<div class="flex flex-col gap-3">
				<label class="label" for="location">Location</label>
				<input id="location" class="input w-full" name="location" bind:value={newEvent.location} />
				<div class="text-error">{form?.zodError?.fieldErrors.location}</div>
			</div>
			<div class="flex flex-col justify-between xl:flex-row xl:space-x-8">
				<div class="flex flex-col gap-3">
					<label class="label" for="datetime-from">Start Time</label>
					<input
						class="input"
						type="datetime-local"
						name="datetimeFrom"
						id="datetime-from"
						value={data.event.scheduledTime
							? dateToDatetimeLocalString(data.event.scheduledTime)
							: ''}
					/>
					<div class="text-error">{form?.zodError?.fieldErrors.datetimeFrom}</div>
				</div>
				<div class="flex flex-col gap-3">
					<label class="label" for="datetime-to">End Time</label>
					<input
						class="input"
						type="datetime-local"
						name="datetimeTo"
						id="datetime-to"
						value={data.event.endTime ? dateToDatetimeLocalString(data.event.endTime) : ''}
					/>
					<div class="text-error">{form?.zodError?.fieldErrors.datetimeTo}</div>
				</div>
			</div>
			<div class="flex flex-col gap-3">
				<label class="label" for="description">Description</label>
				<textarea
					id="description"
					class="textarea w-full"
					name="description"
					bind:value={newEvent.description}
				></textarea>
				<div class="text-error">{form?.zodError?.fieldErrors.description}</div>
			</div>
			<div class="flex flex-col gap-4">
				<h2 class="label">Availability</h2>
				<div class="flex items-center gap-4">
					<input
						id="availabilityType-days"
						class="radio"
						type="radio"
						value="days"
						name="availabilityType"
						aria-label="radio select for days availability type"
						bind:group={selectedType}
					/>
					<label class="label" for="availabilityDays">Amount of Days</label>
					<input
						id="availabilityDays"
						class="input input-sm"
						value="7"
						type="number"
						placeholder="7 days"
						name="availabilityDays"
						disabled={selectedType != 'days'}
					/>
				</div>
				<div class="flex flex-col gap-4 lg:flex-row lg:items-center">
					<div class="flex gap-4">
						<input
							id="availabilityType-range"
							class="radio"
							type="radio"
							value="range"
							name="availabilityType"
							aria-label="radio select for range availability type"
							bind:group={selectedType}
						/>
						<div class="label">Date Range</div>
					</div>
					<label for="availabilityFrom" class="input input-sm"
						><span class="label">From</span>
						<input
							id="availabilityFrom"
							class=""
							type="date"
							name="availabilityFrom"
							value={format(data.event.availability.start, 'yyyy-MM-dd')}
							aria-label="availabilityFrom"
							disabled={selectedType != 'range'}
						/>
					</label>
					<div class="hidden lg:block">-</div>
					<label for="availabilityTo" class="input input-sm"
						><span class="label">To</span>
						<input
							id="availabilityTo"
							class=""
							type="date"
							name="availabilityTo"
							value={format(data.event.availability.end, 'yyyy-MM-dd')}
							aria-label="availabilityTo"
							disabled={selectedType != 'range'}
						/>
					</label>
				</div>
				<Checkbox.Group
					class="grid grid-cols-4 grid-rows-2 justify-between gap-4 2xl:grid-cols-7 2xl:grid-rows-1"
					name="daysOfWeek"
					bind:value={selectedDaysOfWeek}
				>
					{#each daysOfWeek as day}
						<Checkbox.Root
							id="day-{day}"
							aria-labelledby="{day}-label"
							class=""
							name="hello"
							value={day}
						>
							{#snippet children({ checked, indeterminate })}
								<Label.Root
									id="{day}-label"
									for="day-{day}"
									class="label block w-full rounded-lg border px-2 py-1 text-center capitalize transition-colors {checked
										? 'border-primary text-primary'
										: ''}"
								>
									<div class="lg:hidden">
										{minifyDayOfWeek(day)}
									</div>
									<div class="hidden lg:block">
										{day}
									</div>
								</Label.Root>
							{/snippet}
						</Checkbox.Root>
					{/each}
				</Checkbox.Group>
				<div class="flex justify-between gap-4">
					<button
						type="button"
						class="btn flex-grow btn-neutral"
						onclick={() => (selectedDaysOfWeek = [...daysOfWeek])}>All</button
					>
					<button
						type="button"
						class="btn hidden flex-grow btn-neutral lg:block"
						onclick={() =>
							(selectedDaysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'])}
						>Weekdays</button
					>
					<button
						type="button"
						class="btn hidden flex-grow btn-neutral lg:block"
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
			<div class="flex flex-row-reverse justify-between gap-4">
				<button type="submit" class="btn flex-2 btn-primary">Save Changes</button>
				<a href={`/event/${data.eventId}`} class="btn flex-1 btn-neutral">Cancel</a>
			</div>
			<button formaction="?/deleteEvent" class="btn mt-4 w-full btn-outline btn-error"
				>Delete</button
			>
		</form>
	</div>
</div>
