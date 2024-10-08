export const parseDate = (date: string | null) => {
  if (!date) {
    return null;
  }
  const [ year, month, day ] = date.split(' ')[0].split('-');
  const [ hour, minute, second ] = date.split(' ')[1].split(':');
  return new Date(
    +year,
    +month - 1,
    +day,
    +hour,
    +minute,
    +second
  );
}
