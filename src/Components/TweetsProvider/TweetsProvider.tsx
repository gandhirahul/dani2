import { useEffect, useReducer } from "react";
import { Tweet } from "../../types";
import {
  changeAppMode,
  endFetching,
  initialState,
  reducer,
  resetTweets,
  startFetching,
  addTweets,
  addTweetsReverse
} from "./reducer";
import { resetDB, fetchTweets, fetchTweetsReverse } from "../../data";

type TweetsProviderProps = {
  children: (tweets: Tweet[]) => JSX.Element;
  delay: number | null;
};

function TweetsProvider({ children, delay }: TweetsProviderProps) {
  const [
    { firstId, isFetching, lastId, reverseMode, tweets },
    dispatch
  ] = useReducer(reducer, initialState);

  // Effect to trigger tweet fetches
  useEffect(() => {
    let ignore = false;

    async function fetch() {
      if (!reverseMode) {
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
      } else {
        if (firstId !== null) {
          console.log("fetch reverse");
          try {
            const newTweets = (await fetchTweetsReverse(firstId)).data;

            if (!ignore) {
              dispatch(addTweetsReverse(newTweets));
            }
          } catch (error) {
            if (!ignore) {
              dispatch(endFetching());
            }
          }
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
  }, [isFetching, lastId, firstId, reverseMode]);

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

  const changeMode = (isReverse: boolean): void => {
    dispatch(changeAppMode(isReverse));
  };

  if (tweets.length) {
    return children(tweets, changeMode);
  }

  return null;
}

export default TweetsProvider;
