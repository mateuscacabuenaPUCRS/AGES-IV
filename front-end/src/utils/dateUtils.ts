/**
 * Formats a date using UTC to avoid timezone conversion issues
 * Returns format: DD/MM/YYYY
 */
function formatDate(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Use UTC methods to avoid timezone conversion
  const day = String(dateObj.getUTCDate()).padStart(2, "0");
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0");
  const year = dateObj.getUTCFullYear();

  return `${day}/${month}/${year}`;
}

/**
 * Formats a complete date using UTC to avoid timezone conversion issues
 * Returns format: D de MMMM de YYYY (e.g., "1 de Janeiro de 2025")
 */
function formatCompleteDate(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const monthNames = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  // Use UTC methods to avoid timezone conversion
  const day = dateObj.getUTCDate();
  const month = monthNames[dateObj.getUTCMonth()];
  const year = dateObj.getUTCFullYear();

  return `${day} de ${month} de ${year}`;
}

/**
 * Formats time from a date using UTC
 * Returns format: HH:mm
 */
function formatTime(date: Date | string) {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  // Use UTC methods to avoid timezone conversion
  const hours = String(dateObj.getUTCHours()).padStart(2, "0");
  const minutes = String(dateObj.getUTCMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
}

export const dateUtils = {
  formatDate,
  formatCompleteDate,
  formatTime,
};
