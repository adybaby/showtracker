import React from "react";

const Show = ({ show, handleShowClicked }) => {
  // Each Show
  return (
    <button
      className="list-group-item"
      onClick={() => {
        handleShowClicked(show.id, show.name);
      }}
    >
      {show.name} ({show.id})
    </button>
  );
};

const ShowList = ({ showList, handleShowClicked, noShowsMessage }) => {
  // Map through the show
  let showMap = [];

  if (typeof showList !== "undefined" && showList.length > 0) {
    showMap = showList.map(show => {
      return (
        <Show show={show} key={show.id} handleShowClicked={handleShowClicked} />
      );
    });
  } else {
    return (
      <div className="list-group" style={{ marginTop: "30px" }}>
        {noShowsMessage}
      </div>
    );
  }

  return (
    <div className="list-group" style={{ marginTop: "30px" }}>
      {showMap}
    </div>
  );
};

export default ShowList;
