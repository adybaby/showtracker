import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { addShow, removeShow, loadShows } from "./actions/Shows";
import * as STATUS from "./actions/ActionStatuses";
import ShowList from "./components/ShowList";
import SearchAndAddPopup from "./components/SearchAndAddPopup";
import ShowCalendar from "./components/ShowCalendar";
import AppBar from "./components/AppBar";

function App() {
  const [showPopup, setShowPopup] = useState(false);
  const shows = useSelector(state => state.shows);
  const loadShowsStatus = useSelector(state => state.loadShowsStatus);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadShows());
  }, [dispatch]);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleAddShow = show => {
    dispatch(addShow(show));
  };

  const handleRemoveShow = show => {
    dispatch(removeShow(show.id));
  };

  return (
    <div>
      <Container fluid>
        <Row>
          <Col>
            <AppBar title="Title" />
          </Col>
        </Row>
        <Row>
          <Col xs={5} lg={3} xl={2}>
            <Col>
              <button onClick={togglePopup}>Add Shows</button>
              {loadShowsStatus === STATUS.LOAD_SHOWS.FOUND_SHOWS ? (
                <ShowList
                  showList={shows}
                  handleShowClicked={handleRemoveShow}
                />
              ) : (
                <p>loadShowsStatus</p>
              )}
            </Col>
          </Col>
          <Col xs={7} lg={9} xl={10}>
            <ShowCalendar />
          </Col>
        </Row>
      </Container>

      {showPopup ? (
        <SearchAndAddPopup
          handleShowClicked={handleAddShow}
          closePopup={togglePopup}
        />
      ) : null}
    </div>
  );
}

export default App;
