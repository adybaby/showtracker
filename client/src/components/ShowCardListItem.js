import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import ShowBanner from "./ShowBanner";
import { useDispatch } from "react-redux";
import { removeShow } from "../actions/Shows";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  card: {
    maxWidth: 345
  },
  media: {
    height: 140
  },
  bodyText: {
    marginLeft: 8,
    marginTop: 2,
    marginBottom: 2,
    fontSize: 13
  },
  buttonStyle: {
    float: "right"
  }
}));

const ShowCard = ({ show }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <ListItem key={show.id}>
      <Card className={classes.card} key={show.id}>
        <ShowBanner show={show} />
        <Typography color="textSecondary" className={classes.bodyText}>
          {show.name}
        </Typography>
        <Divider />
        <Button
          size="small"
          color="primary"
          onClick={() => dispatch(removeShow(show.id))}
          className="buttonStyle"
        >
          REMOVE SHOW
        </Button>
      </Card>
    </ListItem>
  );
};

export default ShowCard;
