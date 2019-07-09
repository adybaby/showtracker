import React, { Component } from "react";

class ShowCalendar extends Component {
  state = { showCalendar: [], showFutureOnly: true };

  componentDidMount() {
    this.updateShowList();
  }

  updateShowList() {
    fetch(
      "http://localhost:3000/getShowCalendar?futureOnly=" +
        this.state.showFutureOnly
    )
      .then(res => res.json())
      .then(data => {
        this.setState({ showCalendar: data });
      })
      .catch(console.log);
  }

  handleCheckboxChange = event => {
    this.setState({ showFutureOnly: event.target.checked });
    this.updateShowList();
  };

  render() {
    let showList = [];
    for (const show of this.state.showCalendar) {
      showList.push(
        <p>
          {show.showName} ({show.episodeName}, {show.shortName}) airs on{" "}
          {show.firstAired}
        </p>
      );
    }
    return (
      <div>
        <h3>Show Calendar</h3>
        <p>
          <input
            type="checkbox"
            onChange={this.handleCheckboxChange}
            defaultChecked={true}
          />{" "}
          Only show future air dates{" "}
        </p>
        <p>{showList}</p>
      </div>
    );
  }
}
export default ShowCalendar;
