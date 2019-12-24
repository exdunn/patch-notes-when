import React, { Component } from "react";
import "./App.css";
import ScrollContainer from "./ScrollContainer";
import { Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  state = { data: [], intervalIsSet: false, isLoading: true };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
  }

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("https://first-project-234822.appspot.com/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data, isLoading: false }));
  };

  getLoader() {
    return this.state.isLoading ? <Spinner animation="border" /> : null;
  }

  render() {
    const { data } = this.state;
    return (
      <div className="app-container">
        {this.getLoader()}
        <ScrollContainer data={data} />
      </div>
    );
  }
}

export default App;
