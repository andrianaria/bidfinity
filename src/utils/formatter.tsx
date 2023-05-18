// utility.js

export function formatCurrency(amount: number, currencyCode: string) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(amount);
}

export function formatTime(timeInSeconds: number) {
  const hours = Math.floor(timeInSeconds / 3600);
  const minutes = Math.floor((timeInSeconds % 3600) / 60);
  const seconds = timeInSeconds % 60;

  let formattedTime = '';

  if (hours > 0) {
    formattedTime += `${hours}h`;
  }

  if (minutes > 0) {
    formattedTime += `${minutes}m`;
  }

  if (seconds > 0 || formattedTime === '') {
    formattedTime += `${seconds}s`;
  }

  return formattedTime;
}

export function formatDateTime(dateTime: string) {
  const date = new Date(dateTime);
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Jakarta',
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedDate = formatter.format(date);
  return formattedDate;
}
