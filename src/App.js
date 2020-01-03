import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import $ from "jquery";

import ScrollContainer from "./ScrollContainer";
import NavBar from "./NavBar";
import { Forums } from "./enums";
import "./App.css";

const SERVER_URL = "https://first-project-234822.appspot.com";
const LOCAL_HOST = "http://localhost:8080";

class App extends Component {
  state = {
    data: { patchNotes: [], announcements: [] },
    intervalIsSet: false,
    loading: true,
    forum: Forums.PATCH_NOTES
  };

  componentDidMount() {
    Promise.all([this.getPatchNotesFromDb(), this.getNewsFromDb()]).then(() => {
      this.setState({ loading: false });
    });
  }

  getPatchNotesFromDb = (skip = 0, limit = 20) => {
    return new Promise((resolve, reject) => {
      fetch(SERVER_URL + `/api/getPatchNotes?limit=${limit}?&skip=${skip}`)
        .then(data => data.json())
        .then(res => {
          let newData = this.state.data;
          newData.patchNotes = newData.patchNotes.concat(res.data);
          this.setState({ data: newData });
          resolve("Patch-notes loaded.");
        });
    });
  };

  getNewsFromDb = (skip = 0, limit = 20) => {
    return new Promise((resolve, reject) => {
      fetch(SERVER_URL + `/api/getNews?limit=${limit}?&skip=${skip}`)
        .then(data => data.json())
        .then(res => {
          let newData = this.state.data;
          newData.announcements = newData.announcements.concat(res.data);
          this.setState({ data: newData });
          resolve("News loaded.");
        });
    });
  };

  getLoader() {
    return this.state.loading ? <Spinner animation="border" /> : null;
  }

  handleForumTabClick = forum => {
    this.setState({ forum });
    $("html, body").animate({ scrollTop: 0 }, "fast");
    return false;
  };

  render() {
    return (
      <div>
        <NavBar handleTabClick={this.handleForumTabClick} />
        <div className="app-container">
          {this.getLoader()}
          <ScrollContainer
            data={this.state.data}
            handleScroll={{
              patchNotes: this.getPatchNotesFromDb,
              announcements: this.getNewsFromDb
            }}
            forum={this.state.forum}
          />
        </div>
      </div>
    );
  }
}

export default App;
