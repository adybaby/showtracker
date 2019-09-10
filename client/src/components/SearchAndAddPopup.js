import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { useDispatch } from "react-redux";
import { addShow } from "../actions/Shows";
import * as server from "../util/ServerInterface";
import ShowList from "./ShowList";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../Styles";

const useStyles = makeStyles(theme => (styles(theme)));

const SearchAndAddPopup = ({ open, setOpen }) => {
  const classes = useStyles();  
  const dispatch = useDispatch();

  const SEARCH_STATUS = {
    NO_SEARCH_DONE: "Search results will be shown here",
    IN_PROGRESS: "Searching for shows..",
    FOUND_SHOWS: "Found Shows",
    NO_SHOWS_FOUND: "No shows were found.",
    ERROR: "Error Searching for Shows"
  };
  const [resultsList, setResultsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState(
    SEARCH_STATUS.NO_SEARCH_DONE
  );

  const findShows = () => {
    setSearchStatus(SEARCH_STATUS.IN_PROGRESS);
    server.findShows(
      searchTerm,
      data => {
        if (data.length > 0) {
          setResultsList(data);
          setSearchStatus(SEARCH_STATUS.FOUND_SHOWS);
        } else {
          setResultsList([]);
          setSearchStatus(SEARCH_STATUS.NO_SHOWS_FOUND);
        }
      },
      () => {
        setSearchStatus(SEARCH_STATUS.ERROR);
      }
    );
  };

  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  const Result = ({ show }) => (
    <div>
      <Divider />
      <ListItem
        color="inherited"
        button
        key={show.id}
        onClick={() => dispatch(addShow(show))}
      >
        <ListItemText primary={show.name} />
      </ListItem>
    </div>
  );

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="add-show-dialog"
    >
      <div className={classes.dialogContent}>
        <DialogTitle id="add-show-dialog">Add Shows</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name of a show and click search or hit Enter. Click on a
            show to add it to your list.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Show Name"
            type="showName"
            value={searchTerm}
            fullWidth
            onChange={event => handleSearchTermChange(event)}
            onKeyPress={event => {
              if (event.key === "Enter") findShows();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Close
          </Button>
          <Button onClick={findShows} color="primary">
            Search
          </Button>
        </DialogActions>
      </div>
      <DialogContent>
        {searchStatus === SEARCH_STATUS.FOUND_SHOWS ? (
          <ShowList showList={resultsList} ShowComponent={Result} />
        ) : (
          <DialogContentText>{searchStatus}</DialogContentText>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchAndAddPopup;
