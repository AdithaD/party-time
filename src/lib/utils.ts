import { clsx, type ClassValue } from "clsx";
import { eachDayOfInterval, getDay } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

export function datetimeLocalToDate(datetimeLocal: string): Date {
	const [date, time] = datetimeLocal.split('T');
	const [year, month, day] = date.split('-').map((x) => parseInt(x));
	const [hours, minutes] = time.split(':').map((x) => parseInt(x));

	return new Date(year, month - 1, day, hours, minutes);
}

export function dateToDatetimeLocalString(date: Date): string {
	const normalisedDate = date;
	normalisedDate.setMinutes(normalisedDate.getMinutes() - normalisedDate.getTimezoneOffset());

	return normalisedDate.toISOString().slice(0, 16);
}

export const daysOfWeek = [
	'sunday',
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday',
	'saturday',
] as const;

export type DaysOfWeek = typeof daysOfWeek[number];

export type EventAvailability = {
	start: Date,
	end: Date,
	daysOfWeek: number,
}

export function daysOfWeekToBitfield(days: Set<DaysOfWeek>): number {
	return days.values().reduce((acc, val) => {
		const index = daysOfWeek.indexOf(val);
		return acc += 1 << index;
	}, 0)
}

export function bitfieldToDaysOfWeek(bitfield: number): Set<DaysOfWeek> {
	const acc: Set<DaysOfWeek> = new Set();

	let value = bitfield;
	for (let i = daysOfWeek.length - 1; i >= 0; i--) {
		const bitValue = 1 << i;

		if (bitValue <= value) {
			acc.add(daysOfWeek[i])
			value -= bitValue;
		}
	}

	return acc;
}

export function getDaysInInterval(start: Date, end: Date, bitfield: number) {
	return eachDayOfInterval({ start, end }, {}).filter((day) => {
		const mask = 1 << getDay(day);
		return (bitfield & mask) == mask
	});
}

export const ALL_DAYS = (1 << 7) - 1;