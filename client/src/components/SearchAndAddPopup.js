import React, { Component } from "react";
import ShowList from "./ShowList";

class SearchAndAddPopup extends Component {
  constructor(props) {
    super(props);
    this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
    this.handleSubmitSearch = this.handleSubmitSearch.bind(this);
  }

  state = {
    resultsList: [],
    searching: false,
    doneFirstSearch: false,
    searchTerm: ""
  };

  handleSearchTermChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  handleSubmitSearch(event) {
    event.preventDefault();
    this.findShows(this.state.searchTerm);
  }

  render() {
    var results;
    if (this.state.resultsList.length < 1) {
      if (this.state.doneFirstSearch === false) {
        results = (
          <div>
            Type the name of a show and hit search. Click on a show to add it to
            your list. Hit X to close this popup.
          </div>
        );
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

          <form onSubmit={this.handleSubmitSearch}>
            <input
              type="text"
              value={this.state.searchTerm}
              onChange={this.handleSearchTermChange}
            />
            <input type="submit" value="Search" />
          </form>

          {results}
        </div>
      </div>
    );
  }

  findShows(showName) {
    try {
      this.setState({ searching: true });
      fetch("http://localhost:3000/findShow?name=" + showName)
        .then(data => {
          return data.json();
        })
        .then(data => {
          return JSON.parse(data.body);
        })
        .then(results => {
          this.setState({ resultsList: [] });
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
