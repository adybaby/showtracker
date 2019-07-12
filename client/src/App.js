import React, { Component } from "react";
import { Container, Row, Col } from "reactstrap";
import "./App.css";
import ShowList from "./components/ShowList";
import SearchAndAddPopup from "./components/SearchAndAddPopup";
import ShowCalendar from "./components/ShowCalendar";
import AppBar from "./components/AppBar";

class App extends Component {
  state = {
    showList: [],
    showCalendar: [],
    showPopup: false,
    showAdded: false,
    retrievedShows: false
  };

  constructor(props) {
    super(props);
    this.calendar = React.createRef();
  }

  componentDidMount() {
    fetch("http://localhost:3000/listShows")
      .then(res => res.json())
      .then(data => {
        const showIdsAndNames = [];
        for (const show of data) {
          showIdsAndNames.push({ id: show.id, name: show.name });
        }
        this.setState({ showList: showIdsAndNames });
        this.setState({ retrievedShows: true });
      })
      .catch(console.log);
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
    if (this.state.showAdded) {
      this.setState({ showAdded: false });
      this.calendar.current.updateShowCalendar();
    }
  }

  handleAddShow(showId, showName) {
    const duplicate = this.state.showList.some(elem => {
      return (
        JSON.stringify({ id: showId.toString(), name: showName }) ===
        JSON.stringify(elem)
      );
    });

    if (!duplicate) {
      try {
        fetch(
          "http://localhost:3000/addShow?id=" + showId + "&name=" + showName
        )
          .then(data => {
            return data.json();
          })
          .then(show => {
            this.state.showList.push({ id: show.id, name: show.name });
            this.setState({ showAdded: true });
          });
      } catch (err) {
        console.log(err);
      }
    }
  }

  handleRemoveShow(showId) {
    try {
      fetch("http://localhost:3000/removeShow?id=" + showId)
        .then(data => {
          return data.json();
        })
        .then(removedShowId => {
          const remainder = this.state.showList.filter(
            show => show.id !== removedShowId
          );
          this.setState({ showList: remainder });
          this.calendar.current.updateShowCalendar();
        });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    let showList = <p>Populating show list.."</p>
    if (this.state.retrievedShows && this.state.showList.length < 1) {
      showList = <p>No shows added. Click Add Show above to add shows.</p>
    } else {
      showList = (
        <ShowList
          showList={this.state.showList}
          handleShowClicked={this.handleRemoveShow.bind(this)}
        />
      );
    }

    return (
      <div>
        <Container fluid>
          <Row>
            <Col>
              <AppBar title="Title" />
            </Col>
          </Row>
          <Row>
            <Col xs={5} lg={3}>
              <Col>
                <button onClick={this.togglePopup.bind(this)}>Add Shows</button>
                {showList}
              </Col>
            </Col>
            <Col xs={7} lg={9}>
              <ShowCalendar ref={this.calendar} />
            </Col>
          </Row>
        </Container>

        {this.state.showPopup ? (
          <SearchAndAddPopup
            handleShowClicked={this.handleAddShow.bind(this)}
            closePopup={this.togglePopup.bind(this)}
          />
        ) : null}
      </div>
    );
  }
}

export default App;
