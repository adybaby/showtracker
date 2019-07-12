import React from "react";

const Show = ({ show, handleShowClicked }) => {
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

const ShowList = ({ showList, handleShowClicked }) => {
  let showJSX = [];

  if (typeof showList !== "undefined" && showList.length > 0) {
    for (const show of showList) {
      showJSX.push(
        <Show show={show} key={show.id} handleShowClicked={handleShowClicked} />
      );
    }
  }

  return (
    <div className="list-group" style={{ marginTop: "30px" }}>
      {showJSX}
    </div>
  );
};

export default ShowList;
