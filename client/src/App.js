import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShows } from "./actions/Shows";
import ShowList from "./components/ShowList";
import SearchAndAddPopup from "./components/SearchAndAddPopup";
import ShowCard from "./components/ShowCardListItem";
import ShowCalendar from "./components/ShowCalendar";
import ResponsiveDrawerLayout from "./components/ResponsiveDrawerLayout";
import Button from "@material-ui/core/Button";
import EpisodeFilter from "./components/EpisodeFilter";
import Divider from "@material-ui/core/Divider";

function App() {
  const [addShowVisible, setAddShowVisible] = useState(false);
  const shows = useSelector(state => state.shows);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  const openAddShowDialog = () => {
    setAddShowVisible(true);
  };

  return (
    <div>
      <CssBaseline />
      <ResponsiveDrawerLayout
        title="SHOW TRACKER"
        drawerPanel={
          <div>
            <div>
            <Divider />
            <Button
              color="inherit"
              onClick={openAddShowDialog}
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
      <SearchAndAddPopup open={addShowVisible} setOpen={setAddShowVisible}/>
    </div>
  );
}

export default App;