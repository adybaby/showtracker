import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import styles from "../styles/Styles";
import { formatDate } from "../util/Dates";

const useStyles = makeStyles(theme => styles(theme));

const EpisodeCard = ({ episode }) => {
  const classes = useStyles();

  return (
    <Card className={classes.episodeCard}>
      <CardContent>
        <Typography
          className={classes.episodeCardBodyText}
          color="textSecondary"
          gutterBottom
        >
          {formatDate(episode.firstAired)}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          {episode.showName}
        </Typography>
        <Typography
          className={classes.episodeCardBodyText}
          color="textSecondary"
        >
          {episode.episodeName} ({episode.shortName})
        </Typography>
      </CardContent>
    </Card>
  );
};

export default EpisodeCard;
