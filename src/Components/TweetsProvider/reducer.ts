// 3 actions covered:
// 1. Start / trigger a fetch
// 2. End a fetch
// 3. Add tweets
// 4. Reset hold tweets

import { Tweet } from "../../types";

type State = {
  isFetching: boolean;
  lastId: number | null;
  firstId: number | null;
  tweets: Tweet[];
  reverseMode: boolean;
};

type ActionType = AddTweetsAction | FetchActions | ChangeModeAction;

export const initialState: State = {
  firstId: null,
  isFetching: true,
  lastId: null,
  tweets: [],
  reverseMode: false
};

const ADD_TWEETS = "add";
const ADD_TWEETS_REVERSE = "add-reverse";
const CHANGE_MODE = "change-mode";
const END_FETCHING = "end-fetching";
const START_FETCHING = "start-fetching";
const RESET_TWEETS = "reset";

type AddTweetsAction = {
  type: typeof ADD_TWEETS | typeof ADD_TWEETS_REVERSE;
  payload: Tweet[];
};

type ChangeModeAction = {
  type: typeof CHANGE_MODE;
  payload: boolean;
};

type FetchActions = {
  type:
    | typeof END_FETCHING
    | typeof START_FETCHING
    | typeof RESET_TWEETS
    | typeof CHANGE_MODE;
};

export function addTweets(tweets: Tweet[]): ActionType {
  return { type: ADD_TWEETS, payload: tweets };
}

export function addTweetsReverse(tweets: Tweet[]): ActionType {
  return { type: ADD_TWEETS_REVERSE, payload: tweets };
}

export function changeAppMode(reverseMode: boolean): ChangeModeAction {
  return { type: CHANGE_MODE, payload: reverseMode };
}

export function endFetching(): ActionType {
  return { type: END_FETCHING };
}

export function startFetching(): ActionType {
  return { type: START_FETCHING };
}

export function resetTweets(): ActionType {
  return { type: RESET_TWEETS };
}

export function reducer(state: State, action: ActionType): State {
  switch (action.type) {
    case ADD_TWEETS:
      const tweets = action.payload;

      let newState;

      if (tweets.length) {
        if (state.lastId === null) {
          // Case for initial fetch
          // and when tweets are reset too...
          const { id: lastId } = tweets[0];
          const { id: firstId } = tweets[tweets.length - 1];

          newState = {
            firstId,
            lastId,
            tweets
          };
        } else {
          // Filter any repeated tweets
          const newTweets = tweets.filter(
            ({ id }) => id > (state.lastId as number)
          );

          if (newTweets.length) {
            const { id: lastId } = newTweets[0];

            newState = {
              lastId,
              tweets: [...newTweets, ...state.tweets]
            };
          }
        }
      }

      return { ...state, ...newState, isFetching: false };

    case ADD_TWEETS_REVERSE: {
      const tweets = action.payload;

      if (tweets.length) {
        // Filter any repeated tweets
        // const newTweets = tweets.filter(
        //   ({ id }) => id > (state.lastId as number)
        // );

        const { id: firstId } = tweets[tweets.length - 1];

        return {
          ...state,
          firstId,
          tweets: [...state.tweets, ...tweets]
        };
      }

      return state;
    }

    case CHANGE_MODE:
      return { ...state, reverseMode: action.payload };

    case END_FETCHING:
      return { ...state, isFetching: false };

    case START_FETCHING:
      return { ...state, isFetching: true };

    case RESET_TWEETS:
      return { ...state, lastId: null };

    default:
      return state;
  }
}
