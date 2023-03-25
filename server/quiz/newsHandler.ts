import axios from "axios";
import { getDateFromTimePeriod } from "./timeValues";
import { NewsData } from "../../types/NewsData";

export const getNewsArticlesFromTimePeriod = async (
  timePeriod: string = ""
): Promise<NewsData[] | null> => {
  const acceptableInput: string[] = ["day", "week", "month", "year"];
  if (acceptableInput.includes(timePeriod) === false) {
    return null;
  }
  const isoDate: string = getDateFromTimePeriod(timePeriod)!.toISOString();
  let response: NewsAPIResponse | null = await fetchData(isoDate);
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
