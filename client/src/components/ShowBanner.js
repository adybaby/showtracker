import React, { useState, useEffect } from "react";
import * as server from "../util/ServerInterface";

const ShowBanner = ({ show }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    server
      .banner(show.id)
      .then(imageUrl => {
        setImageSrc(imageUrl);
      })
      .catch(err => {
        setImageSrc("");
      });
  }, [show.id, show.name]);

  return imageSrc === "" ? null : (
    <img src={imageSrc} alt={show.name + " banner"} className="responsive" />
  );
};

export default ShowBanner;
