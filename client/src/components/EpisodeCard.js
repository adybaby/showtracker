import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { formatDate } from "../util/Dates";

const useStyles = makeStyles({
  card: {
    width: "100%"
  },
  bodyText: {
    fontSize: 14
  }
});

const EpisodeCard = ({ episode }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography
          className={classes.bodyText}
          color="textSecondary"
          gutterBottom
        >
          {formatDate(episode.firstAired)}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {episode.showName}
        </Typography>
        <Typography className={classes.bodyText} color="textSecondary">
          {episode.episodeName} ({episode.shortName})
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EpisodeCard;
