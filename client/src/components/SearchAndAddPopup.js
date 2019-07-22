import React, { useState } from "react";
import ShowList from "./ShowList";

function SearchAndAddPopup(props) {
  const [resultsList, setResultsList] = useState([]);
  const [searching, setSearching] = useState(false);
  const [doneFirstSearch, setDoneFirstSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const findShows = showName => {
    try {
      setSearching(true);
      fetch("http://localhost:3000/findShow?name=" + showName)
        .then(data => {
          return data.json();
        })
        .then(results => {
          if (results.length > 0) {
            setResultsList(
              results.map(result => ({
                id: result.id,
                name: result.name
              }))
            );
          } else {
            setResultsList([]);
          }
          setSearching(false);
          setDoneFirstSearch(true);
        });
    } catch (err) {
      setSearching(false);
      setDoneFirstSearch(true);
      console.log(err);
    }
  };

  const handleSearchTermChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSubmitSearch = event => {
    event.preventDefault();
    findShows(searchTerm);
  };

  var results;
  if (resultsList.length < 1) {
    if (doneFirstSearch === false) {
      results = (
        <div>
          Type the name of a show and hit search. Click on a show to add it to
          your list. Hit X to close this popup.
        </div>
      );
    } else if (searching === true) {
      results = <div>Searching..</div>;
    } else {
      results = <div>No shows found.</div>;
    }
  } else {
    results = (
      <ShowList
        showList={resultsList}
        handleShowClicked={props.handleShowClicked}
      />
    );
  }

  return (
    <div className="popup">
      <div className="popup_inner">
        <button onClick={props.closePopup} className="float-right">
          X
        </button>

        <h1>Find and Add Shows</h1>

        <form onSubmit={handleSubmitSearch}>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          <input type="submit" value="Search" />
        </form>

        <div className="list">{results}</div>
      </div>
    </div>
  );
}

export default SearchAndAddPopup;
