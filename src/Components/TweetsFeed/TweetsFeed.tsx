import React, { useLayoutEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core";
import { Tweet as TweetType } from "../../types";

import { FixedSizeList as VirtuaList } from "react-window";
import Container from "@material-ui/core/Container";
import Tweet from "../Tweet";

const ROW_HEIGHT = 220;
const ROW_PADDING = 10;

type RowProps = {
  data: TweetType[];
  index: number;
  style: React.CSSProperties;
};

function Row({ data, index, style }: RowProps) {
  const tweetData = data[index];

  return (
    <div
      style={{
        ...style,
        height: (style.height as number) - ROW_PADDING,
        marginBottom: ROW_PADDING
      }}
    >
      {/* Component rendering tweet UI */}
      <Tweet {...tweetData} />
    </div>
  );
}

const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "center",
    "& .MuiCard-root": {
      height: ROW_HEIGHT,
      maxHeight: ROW_HEIGHT
    }
  }
}));

type TweetsFeedProps = {
  keepScrollPosition: boolean;
  tweets: TweetType[];
};

function TweetsFeed({ keepScrollPosition, tweets }: TweetsFeedProps) {
  const classes = useStyles();
  const listRef = useRef(null);
  const scrollOffsetRef = useRef(0);
  const itemsRef = useRef(tweets.length);

  // Effect to scroll to previous scrolled item
  useLayoutEffect(() => {
    if (!keepScrollPosition) return;

    if (listRef.current !== null && tweets.length && scrollOffsetRef.current) {
      const tweetsDiff = tweets.length - itemsRef.current;

      if (tweetsDiff > 0) {
        (listRef as any).current.scrollTo(
          scrollOffsetRef.current + tweetsDiff * (ROW_HEIGHT + ROW_PADDING)
        );
      }
    }

    itemsRef.current = tweets.length;
  }, [keepScrollPosition, tweets]);

  return (
    <Container className={classes.container} maxWidth="sm">
      <VirtuaList
        height={600}
        itemCount={tweets.length}
        itemData={tweets}
        itemKey={(index, data) => data[index].id}
        itemSize={ROW_HEIGHT + ROW_PADDING}
        onScroll={({ scrollDirection, scrollOffset }) => {
          scrollOffsetRef.current = scrollOffset;
        }}
        overscanCount={3}
        ref={listRef}
        width={"100%"}
      >
        {Row}
      </VirtuaList>
    </Container>
  );
}

export default TweetsFeed;
