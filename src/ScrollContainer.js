import React, { Component } from "react";
import Popup from "./Popup";
import "./ScrollContainer.css";
import { Spinner } from "react-bootstrap";
import $ from "jquery";

const Forums = {
  PATCH_NOTES: "patchNotes",
  ANNOUNCEMENTS: "announcements"
};

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

  handlePatchClick = () => {
    let newItems = this.state.items;
    newItems[this.state.forum] = 10;
    this.setState({
      forum: Forums.PATCH_NOTES,
      items: newItems
    });
  };

  handleAnnouncementsClick = () => {
    let newItems = this.state.items;
    newItems[this.state.forum] = 10;
    this.setState({
      forum: Forums.ANNOUNCEMENTS,
      items: newItems
    });
  };

  getLoader() {
    return this.state.loading ? (
      <Spinner animation="border" className="load-spinner" />
    ) : null;
  }

  render() {
    return (
      <div className="container popups" ref="myscroll">
        <div className="tab-buttons">
          <button className="patch-tab-button" onClick={this.handlePatchClick}>
            Patch Notes
          </button>
          <button
            className="forum-tab-button"
            onClick={this.handleAnnouncementsClick}
          >
            Announcements
          </button>
        </div>
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
