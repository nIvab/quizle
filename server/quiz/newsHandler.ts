import { NewsData } from "../../types/NewsData";
import axios from "axios";

export const getNewsArticlesFromTimePeriod = async (
  timePeriod: string = ""
): Promise<NewsData[] | null> => {
  const week: number = 7 * 24 * 60 * 60 * 1000;
  let response: NewsAPIResponse | null = null;
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
      console.error(
        `err: default time period, time period passed to getNewsArticlesFromTimePeriod: ${timePeriod}`
      );
      return null;
  }
  if (response && response["news"]) {
    const data = response["news"] as NewsData[];
    return data;
  } else {
    console.error("return null here");
    return null;
  }
};

interface NewsAPIResponse {
  news: NewsData[];
}

const fetchData = async (time: string): Promise<NewsAPIResponse | null> => {
  const dateNowISO = new Date(Date.now()).toISOString(); // ISO 8601
  const options = {
    method: "GET",
    url: "https://api.worldnewsapi.com/search-news",
    params: {
      "source-countries": "au",
      number: 10,
      "api-key": import.meta.env.VITE_NEWS_API_KEY,
      "earliest-publish-date": time,
      "latest-publish-date": dateNowISO,
    },
  };
  const response = await axios.request(options);
  if (response === undefined) {
    console.error("fetchData, news was undefined");
    return null;
  }
  return response.data;
};
