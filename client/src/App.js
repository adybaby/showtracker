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
    showPopup: false
  };

  constructor(props) {
    super(props);
    this.calendar = React.createRef();
  }

  componentDidMount() {
    fetch("http://localhost:3000/listShows")
      .then(res => res.json())
      .then(data => {
        this.setState({ showList: data });
      })
      .catch(console.log);
  }

  togglePopup() {
    this.setState({
      showPopup: !this.state.showPopup
    });
    this.calendar.current.updateShowCalendar();      
  }

  render() {
    return (
      <div>
        <Container fluid className="noPaddingContainer">
          <Row>
            <Col>
              <AppBar title="Title" />
            </Col>
          </Row>
          <Row>
            <Col xs={5} lg={3}>
              <Col>
                <button onClick={this.togglePopup.bind(this)}>Add Shows</button>

                {this.state.showList.length < 1 ? (
                  "No shows added.  Click Add Show above to add shows."
                ) : (
                  <ShowList
                    showList={this.state.showList}
                    handleShowClicked={this.handleRemoveShow.bind(this)}
                  />
                )}
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

  handleAddShow(showId, showName) {
    try {
      fetch("http://localhost:3000/addShow?id=" + showId + "&name=" + showName)
        .then(data => {
          return data.json();
        })
        .then(show => {
          console.log(show);
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
}

export default App;
