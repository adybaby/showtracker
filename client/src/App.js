import React, { Component } from "react";
import "./App.css";
import ShowList from "./components/ShowList";
import AddShowForm from "./components/AddShowForm";

class App extends Component {
  state = {
    showList: [],
    showCalendar: []
  };

  componentDidMount() {
    fetch("http://localhost:3000/listShows")
      .then(res => res.json())
      .then(data => {
        this.setState({ showList: data });
      })
      .catch(console.log);
  }

  render() {
    return (
      <div>
        <AddShowForm addShow={this.handleAddShow.bind(this)} />
        <ShowList
          showList={this.state.showList}
          remove={this.handleRemoveShow.bind(this)}
        />
        ;
      </div>
    );
  }

  handleAddShow(showId, showName) {
    try {
      fetch("http://localhost:3000/addShow?id=" + showId + "&name=" + showName)
        .then(data => {
          return data.json();
        })
        .then(show => {
          this.state.showList.push(show);
          this.setState(this.state);
        });
    } catch (err) {
      console.log(err);
    }
  }

  handleRemoveShow(showId) {
    try {
      fetch("http://localhost:3000/removeShow?id=" + showId)
      .then(data => {
        return data.json();
      })
      .then(
        removedShowId => {
          const remainder = this.state.showList.filter(
            show => show.id !== removedShowId
          );
          this.setState({ showList: remainder });
          this.logState();
        }
      );
    } catch (err) {
      console.log(err);
    }
  }

  logState() {
    this.state.showList.forEach(show => {
      console.log(show);
    });
  }
}

export default App;
