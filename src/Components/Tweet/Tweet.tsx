import React from "react";

import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import { Tweet as TweetProps } from "../../types";

function Tweet({ username, timeStamp, image, text }: TweetProps) {
  return (
    <Card>
      <CardHeader
        avatar={
          <Avatar aria-label="profile-img" src={image}>
            R
          </Avatar>
        }
        title={username}
        subheader={new Date(timeStamp).toLocaleString()}
      />
      <CardContent>
        <Typography variant="body1" color="textSecondary" component="p">
          {text}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Tweet;
