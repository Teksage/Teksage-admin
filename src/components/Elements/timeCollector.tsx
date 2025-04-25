import dayjs from 'dayjs';

export const formatTimeRange = (datetimeRange: string): string => {
  const [start, end] = datetimeRange.split(' - ');
  return `${dayjs(start).format('h:mm A')} - ${dayjs(end).format('h:mm A')}`;
};
