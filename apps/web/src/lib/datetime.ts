const formatter = new Intl.DateTimeFormat(undefined, {
  hour: 'numeric',
  minute: '2-digit'
});

export const formatTimeRange = (start: string, end: string) => {
  return `${formatter.format(new Date(start))} – ${formatter.format(new Date(end))}`;
};

export const formatDateHeading = (start: string) => {
  const formatterWithDate = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  return formatterWithDate.format(new Date(start));
};
