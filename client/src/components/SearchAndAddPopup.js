import React, { Component } from "react";
import ShowList from "./ShowList";

class SearchAndAddPopup extends Component {
  state = {
    resultsList: []
  };

  constructor(props) {
    super(props);
    this.input = "";
  }

  render() {
    return (
      <div className="popup">
        <div className="popup_inner">

        <button onClick={this.props.closePopup} className="float-right">X</button>

          <h1>Search for show</h1>

          <input
            ref={node => {
              this.input = node;
            }}
          />

          <button onClick={event => this.handleFindShow(this.input.value)}>
            Search
          </button>

          <ShowList
            showList={this.state.resultsList}
            handleShowClicked={this.props.handleShowClicked}
            noShowsMessage={"No shows found. Type in the name of a show above and hit Search"}            
          />
        </div>
      </div>
    );
  }

  handleFindShow(showName) {
    try {
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
              this.state.resultsList.push({ id: show.id, name: show.seriesName });
            }

            this.setState(this.state);
          }
        });
    } catch (err) {
      console.log(err);
    }
  }
}

export default SearchAndAddPopup;
