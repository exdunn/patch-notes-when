import React, { Component } from "react";
import Popup from "./Popup";
import "./ScrollContainer.css";
import $ from "jquery";

class ScrollContainer extends Component {
  state = { items: 10, loading: false };

  componentDidMount() {
    window.addEventListener("scroll", () => {
      if (
        $(window).scrollTop() + $(window).height() >=
          this.refs.myscroll.scrollHeight &&
        !this.state.loading
      ) {
        this.loadMore();
      }
    });
  }

  loadMore() {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ items: this.state.items + 5, loading: false });
    }, 500);
  }

  render() {
    return (
      <div className="container popups" ref="myscroll">
        {this.props.data.slice(0, this.state.items).map(data => (
          <Popup title={data.title} html={data.html} text={data.text} />
        ))}
      </div>
    );
  }
}

export default ScrollContainer;
