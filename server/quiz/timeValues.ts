const week = 7 * 24 * 60 * 60 * 1000;
const day = week / 7;
const month = week * 4;
const year = week * 52;

export const timeValues = {
  day: day,
  week: week,
  month: month,
  // year: year,
};

export const getDateFromTimePeriod = (timePeriod: string): Date | null => {
  let date: Date | null;
  switch (timePeriod) {
    case "day":
      date = new Date(Date.now() - timeValues.day);
      break;
    case "week":
      date = new Date(Date.now() - timeValues.week);
      break;
    case "month":
      date = new Date(Date.now() - timeValues.month);
      break;
    // case "year":
    //   date = new Date(Date.now() - timeValues.year);
    //   break;
    default:
      console.error(
        `err: default time period, time period passed to getNewsArticlesFromTimePeriod: ${timePeriod}`
      );
      date = null;
  }
  return date;
};
