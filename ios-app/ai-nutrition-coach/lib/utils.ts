export const truncateText = (prompt: string, maxLength: number = 75) => {
  return prompt.length > maxLength
    ? prompt.slice(0, maxLength).trim() + "..."
    : prompt;
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
};

export const pluralize = (
  singularWord: string,
  count: number,
  pluralWord?: string
) => {
  if (count === 1) {
    return singularWord;
  }

  return pluralWord || `${singularWord}s`;
};

export const getTimeOfDay = (): string => {
  const hours = new Date().getHours();
  if (hours < 12) return "morning";
  if (hours < 16) return "afternoon";
  return "evening";
};
