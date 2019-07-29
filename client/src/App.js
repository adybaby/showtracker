import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "reactstrap";
import "./App.css";
import ShowList from "./components/ShowList";
import SearchAndAddPopup from "./components/SearchAndAddPopup";
import ShowCalendar from "./components/ShowCalendar";
import AppBar from "./components/AppBar";

function App() {
  const [showList, setShowList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [awaitingFetchShowList, setAwaitingFetchShowList] = useState(true);
 
  useEffect(() => {
    console.log("useEffect called");
    setAwaitingFetchShowList(true);
    fetch("http://localhost:3000/listShows")
      .then(res => res.json())
      .then(data => {
        console.log("got new shows");
        setShowList(data.map(show => ({ id: show.id, name: show.name })));
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setAwaitingFetchShowList(false);
      });
  }, []);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const handleAddShow = (showId, showName) => {
    const duplicate = showList.some(elem => {
      return (
        JSON.stringify({ id: showId.toString(), name: showName }) ===
        JSON.stringify(elem)
      );
    });

    if (!duplicate) {
      try {
        fetch(
          "http://localhost:3000/addShow?id=" + showId + "&name=" + showName
        )
          .then(data => {
            return data.json();
          })
          .then(show => {
            setShowList([...showList, { id: show.id, name: show.name }]);
          });
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleRemoveShow = showId => {
    try {
      fetch("http://localhost:3000/removeShow?id=" + showId)
        .then(data => {
          return data.json();
        })
        .then(removedShowId => {
          setShowList(showList.filter(show => show.id !== removedShowId));
        });
    } catch (err) {
      console.log(err);
    }
  };

  let listBody;

  if (awaitingFetchShowList) {
    listBody = <p>Populating show list..</p>;
  } else if (showList.length < 1) {
    listBody = <p>No shows added. Click Add Show above to add shows.</p>;
  } else
    listBody = (
      <ShowList showList={showList} handleShowClicked={handleRemoveShow} />
    );

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
              {listBody}
            </Col>
          </Col>
          <Col xs={7} lg={9} xl={10}>
            <ShowCalendar showList={showList} />
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
