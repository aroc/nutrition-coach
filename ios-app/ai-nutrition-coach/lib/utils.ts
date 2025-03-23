import { SunData } from '../types';

export const truncateText = (prompt: string, maxLength: number = 75) => {
  return prompt.length > maxLength ? prompt.slice(0, maxLength).trim() + '...' : prompt;
};

export const timeAgo = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) {
    return `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `${days} days ago`;
  }

  const weeks = Math.floor(days / 7);
  return `${weeks} weeks ago`;
}

export const pluralize = (singularWord: string, count: number, pluralWord?: string) => {
  if (count === 1) {
    return singularWord;
  }

  return pluralWord || `${singularWord}s`;
}

export const getTimeOfDay = (): string => {
  const hours = new Date().getHours();
  if (hours < 12) return 'morning';
  if (hours < 16) return 'afternoon';
  return 'evening';
};

// Example data: {"results":{"date":"2024-12-23","sunrise":"7:25:37 AM","sunset":"4:51:47 PM","first_light":"5:49:38 AM","last_light":"6:27:46 PM","dawn":"6:55:37 AM","dusk":"5:21:47

const ONE_MINUTE_IN_MS = 60 * 1000;
const ONE_HOUR_IN_MS = 60 * ONE_MINUTE_IN_MS;

// We want to show:
// Sun rising at X when it's over 1h past sunset, and before sunrise
// Sun rose at X for the first hour after sunrise
// Sun setting at X when it's past 2pm and before sunset
// Sun set at X for the first hour after sunset
export const getSunMessage = (sunData: SunData): { label: string, type: 'sunrise' | 'sunset' } => {
  const now = new Date();
  const sunrise = new Date(`${now.toDateString()} ${sunData.sunrise}`);
  const sunset = new Date(`${now.toDateString()} ${sunData.sunset}`);

  // Remove seconds from time strings and convert AM/PM to lowercase
  const sunriseTime = sunData.sunrise.replace(/:\d{2}\s/, ' ').toLowerCase();
  const sunsetTime = sunData.sunset.replace(/:\d{2}\s/, ' ').toLowerCase();

  const oneHourAfterSunset = new Date(sunset.getTime() + ONE_HOUR_IN_MS);
  const oneHourAfterSunrise = new Date(sunrise.getTime() + ONE_HOUR_IN_MS);

  // Within first hour after sunrise
  if (now >= sunrise && now <= oneHourAfterSunrise) {
    return {
      label: `Sun rose at ${sunriseTime}`,
      type: 'sunrise'
    };
  }

  // Past 2pm and before sunset
  if (now > oneHourAfterSunrise && now < sunset) {
    return {
      label: `Sun setting at ${sunsetTime}`, 
      type: 'sunset'
    };
  }

  // Within first hour after sunset
  if (now >= sunset && now <= oneHourAfterSunset) {
    return {
      label: `Sun set at ${sunsetTime}`,
      type: 'sunset'  
    };
  }

  // Over 1h past sunset and before sunrise (show next sunrise)
  return {
    label: `Sun rising at ${sunriseTime}`,
    type: 'sunrise'
  };
}
