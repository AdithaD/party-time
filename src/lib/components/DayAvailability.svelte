<script lang="ts">
	import { multipleNamesToString } from '$lib/utils';
	import { addHours, format } from 'date-fns';
	import { max } from 'drizzle-orm';
	import { SvelteSet } from 'svelte/reactivity';

	type Props = {
		date: Date;
		startHour: number;
		endHour: number;
		interval: number;
		selected: SvelteSet<number>;
		timestamps: Map<number, { id: string; name: string }[]>;
		mouseMode: 'select' | 'deselect';
		class: string;
	};

	let {
		date,
		startHour,
		endHour,
		interval,
		timestamps,
		mouseMode = $bindable(),
		selected = $bindable(),
		class: className = ''
	}: Props = $props();

	const mostUsersForTimestamp = timestamps
		.values()
		.reduce((acc, val) => Math.max(acc, val.length), 0);

	const intervalCount = (endHour - startHour) / interval;

	const startDateTime = getDateWithHour();

	function getDateWithHour() {
		const newDate = date;
		newDate.setHours(startHour, 0, 0, 0);
		return newDate;
	}

	function getTime(index: number) {
		return addHours(startDateTime, index * interval);
	}

	function getKey(index: number) {
		return getTime(index).getTime();
	}

	function amountOfUsers(timestamp: number) {
		return timestamps.get(getKey(timestamp))?.length ?? 0;
	}

	function getNameString(timestamp: number) {
		const names = timestamps.get(getKey(timestamp))?.map((v) => v.name);

		if (names) {
			return multipleNamesToString(names, 3);
		} else {
			return '';
		}
	}

	function getOpacity(timestamp: number) {
		return amountOfUsers(timestamp) / mostUsersForTimestamp;
	}

	function onTimeMouseOver(
		index: number,
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) {
		if (event.buttons == 1 || event.buttons == 3) {
			applyMouseMode(index);
		}
	}

	function applyMouseMode(index: number) {
		const key = getKey(index);
		switch (mouseMode) {
			case 'select':
				selected.add(key);
				break;
			case 'deselect':
				selected.delete(key);
				break;
		}
	}

	function onTimeKeyDown(
		index: number,
		event: KeyboardEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) {
		if (event.key == 'Enter') {
			applyMouseMode(index);
		}
	}

	function onMouseDown(
		index: number,
		event: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) {
		if (event.button == 0) {
			mouseMode = selected.has(getKey(index)) ? 'deselect' : 'select';
			applyMouseMode(index);
		}
	}
</script>

<div class="flex flex-col space-y-1 {className}">
	<div class="text-center wrap-break-word">{format(date, 'EEE dd MMM')}</div>
	{#each Array(intervalCount).keys() as i}
		<div class="tooltip" data-tip={getNameString(i)}>
			<button
				class="btn h-8 w-full rounded-none {selected.has(getKey(i)) ? 'border-accent' : ''}"
				style="background: oklch(70% 0.213 47.604 / {getOpacity(i)});"
				onmouseover={(event) => onTimeMouseOver(i, event)}
				onmousedown={(event) => onMouseDown(i, event)}
				onfocus={() => {}}
				onkeydown={(event) => onTimeKeyDown(i, event)}
			>
				{format(getTime(i), 'HH:mm')} ({amountOfUsers(i)})
			</button>
		</div>
	{/each}
</div>
