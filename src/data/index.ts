import axios, { AxiosPromise } from "axios";
import { Tweet } from "../types";

const TWEETS_REQUEST_COUNT = 50;

const MAX_REQUEST_RETRY_COUNT = 3;

const API_BASE =
  "https://magiclab-twitter-interview.herokuapp.com/daniel-fernandez";

let retry = 0;

axios.interceptors.response.use(undefined, function(error) {
  const { response } = error;

  if (response && response.status === 503 && retry <= MAX_REQUEST_RETRY_COUNT) {
    // if server error retry if not max retries attemped to prevent infinite loops
    retry += 1;

    return axios(error.config).then(res => {
      retry = 0;

      return res;
    });
  }

  return Promise.reject(error);
});

export function fetchTweets(lastId: number | null): AxiosPromise<Tweet[]> {
  let queryParams = `?count=${TWEETS_REQUEST_COUNT}`;

  if (lastId !== null) {
    queryParams += `&afterId=${lastId}`;
  }

  return axios({
    method: "get",
    url: `${API_BASE}/api${queryParams}`
  });
}

export function resetDB(): AxiosPromise {
  return axios({
    method: "get",
    url: `${API_BASE}/reset`
  });
}
