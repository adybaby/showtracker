import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addShow, fetchShows } from "./actions/Shows";
import ShowList from "./components/ShowList";
import SearchAndAddPopup from "./components/SearchAndAddPopup";
import ShowCard from "./components/ShowCardListItem";
import ShowCalendar from "./components/ShowCalendar";
import ResponsiveDrawerLayout from "./components/ResponsiveDrawerLayout";
import Button from "@material-ui/core/Button";
import EpisodeFilter from "./components/EpisodeFilter";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  addShow: {
    marginLeft: theme.spacing(0)
  }
}));

function App() {
  const classes = useStyles();

  const [showPopup, setShowPopup] = useState(false);
  const shows = useSelector(state => state.shows);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  const toggleAddShow = () => {
    setShowPopup(!showPopup);
  };

  const handleAddShow = show => {
    dispatch(addShow(show));
  };

  return (
    <div>
      <CssBaseline />
      <ResponsiveDrawerLayout
        title="SHOW TRACKER"
        drawerPanel={
          <div>
            <Divider />
            <Button
              color="inherit"
              onClick={toggleAddShow}
              className={classes.addShow}
              size="large"
            >
              Add Shows
            </Button>
            <Divider />
            <ShowList
              showList={shows}
              ShowComponent = {ShowCard}
            />
          </div>
        }
        mainPanel={<ShowCalendar />}
        toolbarItems={[
          <EpisodeFilter key="episodeFilter"/>,
          <Button key ="loginbutton" color="inherit" onClick={() => alert("Not yet implemented")}>
            Login
          </Button>
        ]}
      />

      {showPopup ? (
        <SearchAndAddPopup
          handleShowClicked={handleAddShow}
          closePopup={toggleAddShow}
        />
      ) : null}
    </div>
  );
}

export default App;

