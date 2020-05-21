import React from "react";
import ErrorBoundary from "../ErrorBoundary";
import TweetsFeed from "../TweetsFeed";
import TweetsProvider from "../TweetsProvider";

import "./App.css";

function App() {
  return (
    // <ErrorBoundary> Error fallback component
    // <TweetsProvider> Component encapsulating app state and fetching logic and providing tweets data
    // <TweetsFeed> Component in charge to render tweets and provide performance optimization
    <ErrorBoundary>
      <TweetsProvider delay={2000}>
        {tweets => <TweetsFeed keepScrollPosition tweets={tweets} />}
      </TweetsProvider>
    </ErrorBoundary>
  );
}

export default App;
