import React, { Component } from "react";

const Show = ({ show, handleShowClicked }) => {
  return (
    <button
      className="list-group-item"
      onClick={() => {
        handleShowClicked(show.id, show.name);
      }}
    >
      {show.name} ({show.id})
    </button>
  );
};

class ShowList extends Component {

  state = {
    shows: []
  };

  componentDidMount(){
    this.updateShows(this.props.showList);
  }

  updateShows(showList)
  {
    let shows = [];
    for (const show of showList) {
      shows.push(
        <Show
          show={show}
          key={show.id}
          handleShowClicked={this.props.handleShowClicked}
        />
      );
    }
    this.setState({ shows: shows });
  }

  render() {

    if (this.state.shows.length > 0) {
      return (
        <div className="list-group" style={{ marginTop: "30px" }}>
          {this.state.shows}
        </div>
      );
    } else {
      return (
        <div className="list-group" style={{ marginTop: "30px" }}>
          {this.props.noShowsMessage}
        </div>
      );
    }
  }
}

export default ShowList;
