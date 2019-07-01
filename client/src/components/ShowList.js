import React from "react";

const Show = ({ show, remove }) => {
  // Each Todo
  return (
    <button
      className="list-group-item"
      onClick={() => {
        remove(show.id);
      }}
    >
      {show.name} ({show.id})
    </button>
  );
};

const ShowList = ({ showList, remove }) => {
  // Map through the todos
  const showMap = showList.map((show) => {
    return (<Show show={show} key={show.id} remove={remove}/>)
  });

  return (<div className="list-group" style={{marginTop:'30px'}}>{showMap}</div>);
};

export default ShowList;
