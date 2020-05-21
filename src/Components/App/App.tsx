import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import TweetsFeed from "../TweetsFeed";
import TweetsProvider from "../TweetsProvider";

import "./App.css";

function App() {
  const [delay, setDelay] = React.useState(2000);

  return (
    // <ErrorBoundary> Error fallback component
    // <TweetsProvider> Component encapsulating app state and fetching logic and providing tweets data
    // <TweetsFeed> Component in charge to render tweets and provide performance optimization
    <ErrorBoundary>
      <TweetsProvider delay={delay}>
        {(tweets, changeMode) => (
          <TweetsFeed
            changeMode={changeMode}
            keepScrollPosition
            tweets={tweets}
            setDelay={setDelay}
          />
        )}
      </TweetsProvider>
    </ErrorBoundary>
  );
}

export default App;
