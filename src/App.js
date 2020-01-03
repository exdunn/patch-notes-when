import React, { Component } from "react";
import "./App.css";
import ScrollContainer from "./ScrollContainer";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const SERVER_URL = "https://first-project-234822.appspot.com";
const LOCAL_HOST = "http://localhost:8080";

class App extends Component {
  state = {
    data: { patchNotes: [], announcements: [] },
    intervalIsSet: false,
    loading: true
  };

  componentDidMount() {
    Promise.all([
      new Promise((res, rej) => {
        this.getPatchNotesFromDb();
      }),
      new Promise((res, rej) => {
        this.getNewsFromDb();
      })
    ]).then(() => {
      this.setState({ loading: false });
    });
  }

  getPatchNotesFromDb = () => {
    fetch(SERVER_URL + "/api/getPatchNotes?limit=20")
      .then(data => data.json())
      .then(res => {
        let newData = this.state.data;
        newData.patchNotes = res.data;
        this.setState({ data: newData });
      });
  };

  getNewsFromDb = () => {
    fetch(SERVER_URL + "/api/getNews?limit=20")
      .then(data => data.json())
      .then(res => {
        let newData = this.state.data;
        newData.announcements = res.data;
        this.setState({ data: newData });
      });
  };

  getLoader() {
    return this.state.loading ? <Spinner animation="border" /> : null;
  }

  render() {
    return (
      <div className="app-container">
        {this.getLoader()}
        <ScrollContainer data={this.state.data} />
      </div>
    );
  }
}

export default App;
