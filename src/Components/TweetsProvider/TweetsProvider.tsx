import { useEffect, useReducer } from "react";
import { Tweet } from "../../types";
import {
  endFetching,
  initialState,
  reducer,
  resetTweets,
  startFetching,
  addTweets
} from "./reducer";
import { resetDB, fetchTweets } from "../../data";

type TweetsProviderProps = {
  children: (tweets: Tweet[]) => JSX.Element;
  delay: number | null;
};

function TweetsProvider({ children, delay }: TweetsProviderProps) {
  const [{ isFetching, lastId, tweets }, dispatch] = useReducer(
    reducer,
    initialState
  );

  // Effect to trigger tweet fetches
  useEffect(() => {
    let ignore = false;

    async function fetch() {
      try {
        const newTweets = (await fetchTweets(lastId)).data;

        if (!ignore) {
          dispatch(addTweets(newTweets));
        }
      } catch (error) {
        if (!ignore) {
          dispatch(endFetching());
        }
      }
    }

    if (isFetching) {
      // Only set fetch if no fetch already in process
      fetch();

      return () => {
        ignore = true;
      };
    }
  }, [isFetching, lastId]);

  // Effect to schedule trigger fetch interval
  useEffect(() => {
    if (delay !== null) {
      const intervalId = setInterval(() => {
        dispatch(startFetching());
      }, delay);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [delay]);

  // Effect to reset the DB
  useEffect(() => {
    async function reset() {
      try {
        await resetDB();

        dispatch(resetTweets());
      } catch (error) {}
    }

    if (lastId && lastId >= 10000) {
      reset();
    }
  }, [lastId]);

  if (tweets.length) {
    return children(tweets);
  }

  return null;
}

export default TweetsProvider;
