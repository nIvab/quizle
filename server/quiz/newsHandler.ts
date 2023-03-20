import { data } from "autoprefixer";

export type NewsData = {
  id: number;
  title: string;
  text: string;
  summary: string;
  url: string;
  image: string;
  author: string;
  language: string;
  source_country: string;
  sentiment: number;
};

export const getNewsArticlesFromTimePeriod = async (
  timePeriod: string = ""
): Promise<NewsData[] | null> => {
  const week: number = 7 * 24 * 60 * 60 * 1000;
  let response: JSON | null = null;
  switch (timePeriod) {
    case "day":
      const day: number = week / 7;
      const dateDayAgo: string = new Date(Date.now() - day).toISOString();
      response = await fetchData(dateDayAgo);
      break;
    case "week":
      const dateWeekAgo: string = new Date(Date.now() - week).toISOString();
      response = await fetchData(dateWeekAgo);
      break;
    case "month":
      const month: number = week * 4;
      const dateMonthAgo: string = new Date(Date.now() - month).toISOString();
      response = await fetchData(dateMonthAgo);
      break;
    case "year":
      const year: number = week * 52;
      const dateYearAgo: string = new Date(Date.now() - year).toISOString();
      response = await fetchData(dateYearAgo);
      break;
    default:
      throw console.error();
      return null;
  }
  if (response !== null) {
    const data = response["news"] as NewsData[];
    return data;
  } else {
    return null;
  }
};

const fetchData = async (time: string): Promise<JSON | null> => {
  const dateNowISO = new Date(Date.now()).toISOString(); // ISO 8601
  const endpoint: string = `https://api.worldnewsapi.com/search-news?source-countries=au?number=10?earliest-publish-date=${time}?latest-publish-date=${dateNowISO}`;
  const response: Response = await fetch(endpoint);
  const { data, errors } = await response.json();
  if (errors) {
    console.error(errors);
    return null;
  }
  return data;
};
