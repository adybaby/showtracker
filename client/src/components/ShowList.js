import React from "react";
import List from "@material-ui/core/List";

export default function ShowList({ showList, ShowComponent }) {
  return (
    <List>
      {showList.map(show => (
          <ShowComponent show={show}/>
      ))}
    </List>
  );
}