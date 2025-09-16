import { clsx, type ClassValue } from "clsx";
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