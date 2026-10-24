export interface NightThird {
  label: string;
  partNumber: 1 | 2 | 3;
  startMinutes: number;
  endMinutes: number;
}

export interface TahajjudCalculation {
  maghribMinutes: number;
  fajrMinutes: number;
  totalNightMinutes: number;
  totalNightHoursDecimal: number;
  oneThirdMinutes: number;
  oneThirdHoursDecimal: number;
  islamicMidnightMinutes: number;
  lastThirdStartMinutes: number;
  thirds: [NightThird, NightThird, NightThird];
}

const MINUTES_IN_DAY = 24 * 60; // 1440

/**
 * Parses an "HH:MM" 24-hour time string into total minutes from 00:00.
 */
export function parseTimeToMinutes(timeStr: string): number | null {
  if (!timeStr || !/^\d{2}:\d{2}$/.test(timeStr)) {
    return null;
  }
  const [hoursStr, minutesStr] = timeStr.split(':');
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if (
    Number.isNaN(hours) ||
    Number.isNaN(minutes) ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59
  ) {
    return null;
  }

  return hours * 60 + minutes;
}

/**
 * Normalizes minutes into the 0..1439 range (wrapping around 24h midnight).
 */
export function normalizeMinutes(minutes: number): number {
  return ((Math.round(minutes) % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
}

/**
 * Formats minutes from midnight into either 12-hour (e.g., "3:15 AM") or 24-hour (e.g., "03:15") format.
 */
export function formatTime(minutesFromMidnight: number, use24Hour = false): string {
  const normalized = normalizeMinutes(minutesFromMidnight);
  const hours24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const paddedMins = String(mins).padStart(2, '0');

  if (use24Hour) {
    return `${String(hours24).padStart(2, '0')}:${paddedMins}`;
  }

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${paddedMins} ${period}`;
}

/**
 * Formats a duration in minutes into a human-readable string (e.g., "10h 30m" or "3h 30m").
 */
export function formatDuration(durationMinutes: number): {
  hours: number;
  minutes: number;
  formatted: string;
  detailed: string;
} {
  const rounded = Math.round(durationMinutes);
  const hours = Math.floor(rounded / 60);
  const minutes = rounded % 60;

  const formatted =
    hours > 0 && minutes > 0
      ? `${hours}h ${minutes}m`
      : hours > 0
        ? `${hours}h 0m`
        : `${minutes}m`;

  const detailedParts: string[] = [];
  if (hours > 0) {
    detailedParts.push(`${hours} ${hours === 1 ? 'hour' : 'hours'}`);
  }
  if (minutes > 0 || hours === 0) {
    detailedParts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }

  return {
    hours,
    minutes,
    formatted,
    detailed: detailedParts.join(' '),
  };
}

/**
 * Core calculation for the Last Third of the Night (Tahajjud time):
 * 1. Find the total duration between Maghrib (sunset) and Fajr (dawn), handling midnight crossover.
 * 2. Divide that total duration by 3.
 * 3. Subtract one-third duration from the Fajr start time.
 */
export function calculateTahajjud(
  maghribStr: string,
  fajrStr: string
): TahajjudCalculation | null {
  const maghribMinutes = parseTimeToMinutes(maghribStr);
  const fajrMinutes = parseTimeToMinutes(fajrStr);

  if (maghribMinutes === null || fajrMinutes === null) {
    return null;
  }

  // Step 1: Total duration from Maghrib to Fajr (wrapping past midnight if Fajr <= Maghrib)
  let totalNightMinutes = fajrMinutes - maghribMinutes;
  if (totalNightMinutes <= 0) {
    totalNightMinutes += MINUTES_IN_DAY;
  }

  // Step 2: Divide the total duration by 3
  const oneThirdMinutes = totalNightMinutes / 3;

  // Step 3: Subtract one-third of the night from Fajr start time
  const lastThirdStartMinutes = normalizeMinutes(fajrMinutes - oneThirdMinutes);

  // Also calculate first and second thirds & Islamic midnight (half of the night)
  const firstThirdEnd = normalizeMinutes(maghribMinutes + oneThirdMinutes);
  const islamicMidnightMinutes = normalizeMinutes(maghribMinutes + totalNightMinutes / 2);

  return {
    maghribMinutes,
    fajrMinutes,
    totalNightMinutes,
    totalNightHoursDecimal: Number((totalNightMinutes / 60).toFixed(2)),
    oneThirdMinutes,
    oneThirdHoursDecimal: Number((oneThirdMinutes / 60).toFixed(2)),
    islamicMidnightMinutes,
    lastThirdStartMinutes,
    thirds: [
      {
        label: 'First Third',
        partNumber: 1,
        startMinutes: maghribMinutes,
        endMinutes: firstThirdEnd,
      },
      {
        label: 'Second Third',
        partNumber: 2,
        startMinutes: firstThirdEnd,
        endMinutes: lastThirdStartMinutes,
      },
      {
        label: 'Last Third (Tahajjud)',
        partNumber: 3,
        startMinutes: lastThirdStartMinutes,
        endMinutes: fajrMinutes,
      },
    ],
  };
}
