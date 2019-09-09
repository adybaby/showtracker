import React, { useState, useEffect } from "react";
import * as server from "../util/ServerInterface";

const ShowBanner = ({ show }) => {
  const [imageSrc, setImageSrc] = useState();

  useEffect(() => {
    server.banner(show.id).then(imageUrl => {
        setImageSrc(imageUrl);
    });
  },[show.id, show.name]);

  return <img src={imageSrc} alt={show.name+ " banner"} className="responsive"/>;
};

export default ShowBanner;
