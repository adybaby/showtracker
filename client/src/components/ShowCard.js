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
import { addShowFilter, removeShowFilter } from "../actions/Episodes";
import Checkbox from "@material-ui/core/Checkbox";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import { useAuth0 } from "../react-auth0-wrapper";

const useStyles = makeStyles(theme => styles(theme));

const ShowCard = ({ show }) => {
  const { user } = useAuth0();
  const classes = useStyles();
  const dispatch = useDispatch();

  const handleChange = name => event => {
    if (event.target.checked) {
      dispatch(addShowFilter(show.id));
    } else {
      dispatch(removeShowFilter(show.id));
    }
  };

  return (
    <ListItem key={show.id}>
      <Card className={classes.showCard}>
        <ShowBanner show={show} />
        <Typography color="textSecondary" className={classes.showCardBodyText}>
          {show.name}
        </Typography>
        <Divider />
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon fontSize="small" />}
          color="primary"
          onChange={handleChange()}
          value="checkedA"
          inputProps={{
            "aria-label": "primary checkbox"
          }}
        />
        <Button
          size="small"
          color="primary"
          onClick={() => dispatch(removeShow(user, show.id))}
          className={classes.showCardButtonStyle}
        >
          REMOVE SHOW
        </Button>
      </Card>
    </ListItem>
  );
};

export default ShowCard;
