import React from "react";
import List from "@material-ui/core/List";

const ShowList = ({ showList, ShowComponent }) => (
  <List>
    {showList.map(show => (
      <ShowComponent key={show.id} show={show} />
    ))}
  </List>
);

export default ShowList;
