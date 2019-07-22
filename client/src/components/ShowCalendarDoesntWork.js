// There are problems with this function component:
// 1) The first useEffect Method keeps calling. so episodes must be changing somewhere, not sure where
// 2) the component doesn't know when a DB change has occured requring an update. i want to lift the fetch
// up to the parent component, to make showlist something which never makes server calls, only the parent.
// i don't yet understand how to get this component to update on state changes to the parent though.

import React, { useState, useEffect } from "react";
import * as Dates from "../Dates";
import { Container, Row, Col } from "reactstrap";

function ShowCalendar() {
  const [episodes, setEpisodes] = useState([]);
  const [filteredEpisodes, setFilteredEpisodes] = useState([]);
  const [showFutureOnly, setShowFutureOnly] = useState(true);
  const [showNextOnly, setShowNextOnly] = useState(true);
  const [noShowsAdded, setNoShowsAdded] = useState(false);

  useEffect(() => {
    console.log("fetching showcalendar");
    fetch("http://localhost:3000/getShowCalendar")
      .then(res => res.json())
      .then(data => {
        if (typeof data === "undefined" || data.length < 1) {
          setEpisodes([]);
          setFilteredEpisodes([]);
          setNoShowsAdded(true);
        } else {
          setEpisodes(data);
          setNoShowsAdded(false);
        }
      })
      .catch(console.log);
  }, [episodes]);  

  useEffect(() => {
    console.log("udpating filters");    
    let newFilteredList = episodes;

    if (showFutureOnly) {
      newFilteredList = filtereEpisodesByDate(newFilteredList, new Date());
    }

    if (showNextOnly) {
      newFilteredList = filtereEpisodesByNextEpisode(newFilteredList);
    }

    setFilteredEpisodes(newFilteredList);
  }, [episodes, showFutureOnly, showNextOnly]);

  const filtereEpisodesByDate = (episodesToFilter, startDate, endDate) => {
    let endDateDefined = typeof endDate !== "undefined";
    return episodesToFilter.filter(
      episode =>
        new Date(episode.firstAired) >= startDate &&
        (!endDateDefined || new Date(episode.firstAired) <= endDate)
    );
  };

  const filtereEpisodesByNextEpisode = episodesToFilter => {
    const filteredEpisodesByNextEpisode = [];
    const episodeMap = new Map();

    episodesToFilter.forEach(episode => {
      if (!episodeMap.has(episode.showName)) {
        episodeMap.set(episode.showName, "");
        filteredEpisodesByNextEpisode.push(episode);
      }
    });

    return filteredEpisodesByNextEpisode;
  };

  const buildEpisodeJSX = episode => {
    return (
      <p key={episode.key}>
        {episode.showName} (
        {episode.episodeName == null ? "Untitled" : episode.episodeName},{" "}
        {episode.shortName}) airs on{" "}
        {Dates.formatDate(new Date(episode.firstAired))}
      </p>
    );
  };

  if (filteredEpisodes.length < 1) {
    if (noShowsAdded) {
      return (
        <div>
          <h3>Show Calendar</h3>
          <p> No air dates found. Have you added any shows?</p>
        </div>
      );
    } else {
      return (
        <div>
          <h3>Show Calendar</h3>
          <p>Please wait whilst we fetch air dates from TVDB..</p>
        </div>
      );
    }
  } else {
    return (
      <div>
        <h3>Show Calendar</h3>
        <Container className="noPaddingContainer">
          <Row>
            <Col xs={5} lg={3}>
              <p>
                <input
                  type="checkbox"
                  onChange={ event => {
                    setShowFutureOnly(event.target.checked);
                  }}
                  defaultChecked={showFutureOnly}
                />
                Only show future air dates
              </p>
            </Col>
            <Col xs={7} lg={7}>
              <p>
                <input
                  type="checkbox"
                  onChange={event => {
                    setShowNextOnly(event.target.checked);
                  }}
                  defaultChecked={showNextOnly}
                />
                Only show the first episode (or first to come, if only showing
                future episodes)
              </p>
            </Col>
            <Col xs={0} lg={2} />
          </Row>
        </Container>
        {filteredEpisodes.map(episode => buildEpisodeJSX(episode))}
      </div>
    );
  }
}

export default ShowCalendar;
