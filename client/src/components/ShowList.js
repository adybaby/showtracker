import React from "react";

const Show = ({ show, handleShowClicked }) => {
  return (
    <button
      className="list-group-item"
      onClick={() => {
        handleShowClicked(show);
      }}
    >
      {show.name} ({show.id})
    </button>
  );
};

const ShowList = ({ showList, handleShowClicked }) => {
  let showJSX = [];

  if (typeof showList !== "undefined" && showList.length > 0) {
    showJSX = showList.map(show => (
      <Show show={show} key={show.id} handleShowClicked={handleShowClicked} />
    ));
  }

  return (
    <div className="list-group" style={{ marginTop: "30px" }}>
      {showJSX}
    </div>
  );
};

export default ShowList;
