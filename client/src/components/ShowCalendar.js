import React, { Component } from "react";
import * as Dates from "../Dates";
import { Container, Row, Col } from "reactstrap";

class ShowCalendar extends Component {
  state = {
    showCalendar: [],
    filteredShowCalendar: [],
    showFutureOnly: true,
    showNexttOnly: true,
    noShowsAdded: false,
  };

  componentDidMount() {
    this.updateShowCalendar();
  }

  updateShowCalendar() {
    this.setState({showCalendar:[], filteredShowCalendar:[]});
    fetch("http://localhost:3000/getShowCalendar")
      .then(res => res.json())
      .then(data => {
        if (typeof data === "undefined" || data.length < 1) {
          this.setState({ noShowsAdded: true });
        } else {
          this.setState({ showCalendar: data, noShowsAdded: false });
          this.updateFilteredShowCalendar(
            this.state.showFutureOnly,
            this.state.showNexttOnly
          );
        }
      })
      .catch(console.log);
  }

  getFilteredShowListByDate(showList, startDate, endDate) {
    let filteredShowList = [];
    let endDateDefined = typeof endDate !== "undefined";

    for (const show of showList) {
      let showDate = new Date(show.firstAired);
      if (showDate >= startDate && (!endDateDefined || showDate <= endDate)) {
        filteredShowList.push(show);
      }
    }

    return filteredShowList;
  }

  getFilteredShowListByNextEpisode(showList) {
    let filteredShowList = [];
    let showMap = new Map();

    for (const show of showList) {
      if (!showMap.has(show.showName)) {
        showMap.set(show.showName, "");
        filteredShowList.push(show);
      }
    }

    return filteredShowList;
  }

  updateFilteredShowCalendar(showFutureOnly, showNexttOnly) {
    let filteredList = this.state.showCalendar;

    if (showFutureOnly) {
      filteredList = this.getFilteredShowListByDate(filteredList, new Date());
    }

    if (showNexttOnly) {
      filteredList = this.getFilteredShowListByNextEpisode(filteredList);
    }

    this.setState({ filteredShowCalendar: filteredList });
  }

  handleFutureOnlyChange = event => {
    this.setState({ showFutureOnly: event.target.checked });
    this.updateFilteredShowCalendar(
      event.target.checked,
      this.state.showNexttOnly
    );
  };

  handleNextOnlyChange = event => {
    this.setState({ showNexttOnly: event.target.checked });
    this.updateFilteredShowCalendar(
      this.state.showFutureOnly,
      event.target.checked
    );
  };

  buildShowJSX(show) {
    return (
      <p>
        {show.showName} (
        {show.episodeName == null ? "Untitled" : show.episodeName},{" "}
        {show.shortName}) airs on {Dates.formatDate(new Date(show.firstAired))}
      </p>
    );
  }

  render() {
    let showList = [];
    if (this.state.filteredShowCalendar.length < 1) {
      if (this.state.noShowsAdded) {
        return (
          <div>
            <h3>Show Calendar</h3>
            <p> No air dates found. Have you added any shows?</p>
            <p>{showList}</p>
          </div>
        );
      } else {
        return (
          <div>
            <h3>Show Calendar</h3>
            <p>Please wait whilst we build your show calendar..</p>
            <p>{showList}</p>
          </div>
        );
      }
    } else {
      for (const show of this.state.filteredShowCalendar) {
        showList.push(this.buildShowJSX(show));
      }
      return (
        <div>
          <h3>Show Calendar</h3>
          <Container className="noPaddingContainer">
            <Row>
              <Col xs={5} lg={3}>
                <p>
                  <input
                    type="checkbox"
                    onChange={this.handleFutureOnlyChange}
                    defaultChecked={this.state.showFutureOnly}
                  />
                  Only show future air dates
                </p>
              </Col>
              <Col xs={5} lg={3}>
                <p>
                  <input
                    type="checkbox"
                    onChange={this.handleNextOnlyChange}
                    defaultChecked={this.state.showNexttOnly}
                  />
                  Only show next episode
                </p>
              </Col>
              <Col xs={2} lg={6} />
            </Row>
          </Container>
          {showList}
        </div>
      );
    }
  }
}

export default ShowCalendar;
