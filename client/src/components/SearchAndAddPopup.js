import React, { Component } from "react";
import ShowList from "./ShowList";

class SearchAndAddPopup extends Component {
  state = {
    resultsList: [],
    searching: false,
    doneFirstSearch: false
  };

  constructor(props) {
    super(props);
    this.input = "";
  }

  render() {
    var results;
    if (this.state.resultsList.length < 1) {
      if (this.state.doneFirstSearch === false) {
        results = <div>Type the name of a show and hit search.</div>;
      } else if (this.state.searching === true) {
        results = <div>Searching..</div>;
      } else {
        results = <div>No shows found.</div>;
      }
    } else {
      results = (
        <ShowList
          showList={this.state.resultsList}
          handleShowClicked={this.props.handleShowClicked}
        />
      );
    }

    return (
      <div className="popup">
        <div className="popup_inner">
          <button onClick={this.props.closePopup} className="float-right">
            X
          </button>

          <h1>Search for show</h1>

          <input
            ref={node => {
              this.input = node;
            }}
          />

          <button onClick={event => this.handleFindShow(this.input.value)}>
            Search
          </button>
          {results}
        </div>
      </div>
    );
  }

  handleFindShow(showName) {
    try {
      this.setState({ searching: true });
      this.setState({ resultsList: [] });
      fetch("http://localhost:3000/findShow?name=" + showName)
        .then(data => {
          return data.json();
        })
        .then(data => {
          return JSON.parse(data.body);
        })
        .then(results => {
          if (typeof results.data != "undefined" && results.data.length > 0) {
            for (const show of results.data) {
              this.state.resultsList.push({
                id: show.id,
                name: show.seriesName
              });
            }
            this.setState(this.state);
          }
          this.setState({ searching: false });
          this.setState({ doneFirstSearch: true });
        });
    } catch (err) {
      this.setState({ searching: false });
      this.setState({ doneFirstSearch: true });
      console.log(err);
    }
  }
}

export default SearchAndAddPopup;
