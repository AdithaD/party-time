<script lang="ts">
	import { eachDayOfInterval } from 'date-fns';
	import DayAvailability from './DayAvailability.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { saveAvailability } from './data.remote';

	type Props = {
		startDay: Date;
		endDay: Date;
		daysPerPage: number;
		userId: string;
		timestamps: Map<number, string[]>;
	};

	let { startDay, endDay, daysPerPage, timestamps, userId }: Props = $props();

	const days = eachDayOfInterval({ start: startDay, end: endDay });

	let windowStartDay = $state(0);
	$inspect(windowStartDay);
	let daysInPage = $derived(
		days.slice(windowStartDay, Math.min(days.length, windowStartDay + daysPerPage))
	);

	let mouseMode = $state<'select' | 'deselect'>('select');
	let selected = $state<SvelteSet<number>>(
		new SvelteSet(
			timestamps
				.entries()
				.filter(([timestamp, users]) => users.includes(userId))
				.map(([timestamp, user]) => timestamp)
		)
	);
</script>

<div>
	<div class="mb-4 flex gap-4">
		<button
			class="btn flex-grow btn-xs"
			disabled={windowStartDay == 0}
			onclick={() => (windowStartDay = Math.max(0, windowStartDay - 1))}>Prev</button
		>
		<button
			class="btn flex-grow btn-xs"
			disabled={windowStartDay == days.length - daysPerPage}
			onclick={() => (windowStartDay = Math.min(days.length - daysPerPage, windowStartDay + 1))}
		>
			Next
		</button>
	</div>
	<div class="mb-4 flex space-x-1">
		{#each daysInPage as day (day.getTime())}
			<DayAvailability
				class="w-0 flex-grow"
				date={day}
				startHour={8}
				endHour={20}
				interval={1}
				{timestamps}
				bind:selected
				bind:mouseMode
			/>
		{/each}
	</div>
	<button
		onclick={() => saveAvailability(selected.values().toArray())}
		class="btn w-full btn-primary">Save Availablility</button
	>
</div>
