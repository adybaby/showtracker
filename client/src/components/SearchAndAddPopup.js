import React, { useState, useEffect, useRef } from "react";
import ShowList from "./ShowList";
import * as server from "../util/ServerInterface";

const SearchAndAddPopup = props => {
  const SEARCH_STATUS = {
    NO_SEARCH_DONE: "Enter a show name above and hit search",
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

  const searchBox = useRef(null);

  useEffect(() => {
    searchBox.current.focus();
  }, []);

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

  const handleSubmitSearch = event => {
    event.preventDefault();
    findShows();
  };

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
            ref={searchBox}
            onChange={handleSearchTermChange}
          />
          <input type="submit" value="Search" />
        </form>

        <div className="list">
          {searchStatus === SEARCH_STATUS.FOUND_SHOWS ? (
            <ShowList
              showList={resultsList}
              handleShowClicked={props.handleShowClicked}
            />
          ) : (
            <p>{searchStatus}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchAndAddPopup;
