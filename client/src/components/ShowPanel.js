import React, { useState } from "react";
import ShowList from "./ShowList";
import ShowCard from "./ShowCard";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import SearchAndAddPopup from "./SearchAndAddPopup";

const ShowPanel = ({shows}) => {
  const [addShowVisible, setAddShowVisible] = useState(false);

  const openAddShowDialog = () => {
    setAddShowVisible(true);
  };

  return (
    <div style={{ width: "100%" }}>
      <Divider />
      <Button color="inherit" onClick={openAddShowDialog} size="large">
        Add Shows
      </Button>
      <Divider />
      <ShowList showList={shows} ShowComponent={ShowCard} />
      <SearchAndAddPopup open={addShowVisible} setOpen={setAddShowVisible} />
    </div>
  );
}

export default ShowPanel;
