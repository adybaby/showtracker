import React from "react";
import Card from "@material-ui/core/Card";
import Button from "@material-ui/core/Button";
import ShowBanner from "./ShowBanner";
import { useDispatch } from "react-redux";
import { removeShow } from "../actions/Shows";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles/Styles";

const useStyles = makeStyles(theme => styles(theme));

const ShowCard = ({ show }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <ListItem key={show.id}>
      <Card className={classes.showCard} key={show.id}>
        <ShowBanner show={show} />
        <Typography color="textSecondary" className={classes.showCardBodyText}>
          {show.name}
        </Typography>
        <Divider />
        <Button
          size="small"
          color="primary"
          onClick={() => dispatch(removeShow(show.id))}
          className={classes.showCardButtonStyle}
        >
          REMOVE SHOW
        </Button>
      </Card>
    </ListItem>
  );
};

export default ShowCard;
