import List from "@material-ui/core/List";
import React from "react";

const ShowList = ({ showList, ShowComponent }) =>
  showList.length > 0 ? (
    <List>
      {showList
        .sort((a, b) => a.name < b.name)
        .map(show => (
          <ShowComponent key={show.id} show={show} />
        ))}
    </List>
  ) : null;

export default ShowList;
