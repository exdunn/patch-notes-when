import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import $ from "jquery";

import Popup from "./Popup";
import { Forums } from "./enums";
import "./ScrollContainer.css";

const LIMIT = 10;

class ScrollContainer extends Component {
  state = {
    items: { patchNotes: 10, announcements: 10 },
    loading: false,
    forum: Forums.PATCH_NOTES
  };

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

    let newItems = this.state.items;
    newItems[this.state.forum] += 5;

    if (
      this.state.items[this.state.forum] >
      this.props.data[this.state.forum].length
    ) {
      this.props.handleScroll[this.state.forum](
        this.state.items[this.state.forum],
        LIMIT
      ).then(() => {
        this.setState({
          items: newItems,
          loading: false
        });
      });
    } else {
      setTimeout(() => {
        this.setState({ items: newItems, loading: false });
      }, 500);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.forum !== this.state.forum) {
      let newItems = this.state.items;
      newItems[this.state.forum] = 10;
      this.setState({
        forum: nextProps.forum,
        items: newItems
      });
    }
  }

  getLoader() {
    return this.state.loading ? (
      <Spinner animation="border" className="load-spinner" />
    ) : null;
  }

  render() {
    return (
      <div className="container popups" ref="myscroll">
        {this.props.data[this.state.forum]
          .slice(0, this.state.items[this.state.forum])
          .map(data => (
            <Popup title={data.title} html={data.html} text={data.text} />
          ))}
        <div> {this.getLoader()}</div>
      </div>
    );
  }
}

export default ScrollContainer;
