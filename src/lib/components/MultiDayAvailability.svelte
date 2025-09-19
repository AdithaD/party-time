<script lang="ts">
	import { eachDayOfInterval, getDay } from 'date-fns';
	import DayAvailability from './DayAvailability.svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import { getDaysInInterval } from '$lib/utils';

	type Props = {
		start: Date;
		end: Date;
		daysOfWeek: number;
		daysPerPage: number;
		userId: string;
		submitFn: (timestamps: number[]) => void;
		timestamps: Map<number, { id: string; name: string }[]>;
	};

	let { start, end, daysOfWeek, daysPerPage, timestamps, userId, submitFn }: Props = $props();

	const days = $derived(getDaysInInterval(start, end, daysOfWeek));

	$inspect(daysOfWeek);

	let windowStartDay = $state(0);
	let daysInPage = $derived(
		days.slice(windowStartDay, Math.min(days.length, windowStartDay + daysPerPage))
	);

	let mouseMode = $state<'select' | 'deselect'>('select');
	let selected = $state<SvelteSet<number>>(
		new SvelteSet(
			timestamps
				.entries()
				.filter(([timestamp, users]) => users.find((u) => u.id == userId) != undefined)
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
			disabled={windowStartDay >= days.length - daysPerPage}
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
	<button onclick={() => submitFn(selected.values().toArray())} class="btn w-full btn-primary"
		>Save Availablility</button
	>
</div>
