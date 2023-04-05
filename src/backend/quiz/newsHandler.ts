import axios from "axios";
import { getDateFromTimePeriod } from "./timeValues";
import { NewsData } from "../../types/NewsData";

export const getNewsArticlesFromTimePeriod = async (
  timePeriod = ""
): Promise<NewsData[] | null> => {
  const acceptableInput: string[] = ["day", "week", "month", "year"];
  if (acceptableInput.includes(timePeriod) === false) {
    return null;
  }
  const isoDate: string = getDateFromTimePeriod(timePeriod)!.toISOString();
  const response: NewsAPIResponse | null = await fetchData(isoDate);
  if (response && response["articles"]) {
    const data = response["articles"] as NewsData[];
    return data;
  } else {
    console.error("return null here");
    return null;
  }
};

interface NewsAPIResponse {
  articles: NewsData[];
}

const fetchData = async (time: string): Promise<NewsAPIResponse | null> => {
  const dateNowISO = new Date(Date.now()).toISOString(); // ISO 8601
  // const options = {
  //   method: "GET",
  //   url: "https://api.worldnewsapi.com/search-news",
  //   params: {
  //     "source-countries": "au",
  //     number: 10,
  //     "api-key": process.env.VITE_NEWS_API_KEY,
  //     "earliest-publish-date": time,
  //     "latest-publish-date": dateNowISO,
  //   },
  // };
  const options = {
    method: "GET",
    url: "https://newsapi.org/v2/everything",
    params: {
      "source-countries": "au",
      number: 10,
      apiKey: process.env.VITE_NEWS_API_KEY,
      from: time,
      to: dateNowISO,
      sortBy: "popularity",
      pageSize: 10,
      // country: "au",
      domains: "abc.net.au,smh.com.au,theaustralian.com.au,9news.com.au/",
    },
  };
  const response = await axios.request(options);
  if (response === undefined) {
    console.error("fetchData, news was undefined");
    return null;
  }
  return response.data;
};
