import List from "@material-ui/core/List";
import React from "react";

const ShowList = ({ showList, ShowComponent }) => {
  return showList.length > 0 ? (
    <List>
      {showList
        .sort((a, b) => {
          const x = a.name.toLowerCase();
          const y = b.name.toLowerCase();
          return x < y ? -1 : x > y ? 1 : 0;
        })
        .map(show => {
          return <ShowComponent key={show.id} show={show} />;
        })}
    </List>
  ) : null;
};

export default ShowList;
