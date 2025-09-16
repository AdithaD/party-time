import { expect, test } from 'vitest';
import { bitfieldToDaysOfWeek, daysOfWeekToBitfield, getDaysInInterval } from './utils';
import { eachDayOfInterval } from 'date-fns';

test('utils: function daysOfWeekToBitfield: mon, wed, fri is 42', () => {
    expect(daysOfWeekToBitfield(new Set(['monday', 'wednesday', 'friday']))).toBe(42)
})

test('utils: function daysOfWeekToBitfield: mon, tue, wed, thu, fri is 62', () => {
    expect(daysOfWeekToBitfield(new Set(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']))).toBe(62)
})

test('utils: function bitfieldToDaysOfWeek: 62 is mon, tue, wed, thu, fri', () => {
    expect(bitfieldToDaysOfWeek(62)).toStrictEqual(new Set(['monday', 'tuesday', 'wednesday', 'thursday', 'friday']))
})

test('utils: function bitfieldToDaysOfWeek: 42 is mon, wed, fri', () => {
    expect(bitfieldToDaysOfWeek(42)).toStrictEqual(new Set(['monday', 'wednesday', 'friday']))
})

test('sun - sat, days of week 127', () => {
    const start = new Date(2025, 9, 14);
    const end = new Date(2025, 9, 20);
    const bitfield = 127;
    const allDays = eachDayOfInterval({ start, end }, {});


    expect(allDays).toStrictEqual(getDaysInInterval(start, end, bitfield));
})
