import React, { Component } from "react";
import Popup from "./Popup";
import "./ScrollContainer.css";
import $ from "jquery";

const Forums = {
  PATCH_NOTES: "patchNotes",
  ANNOUNCEMENTS: "announcements"
};

class ScrollContainer extends Component {
  state = {
    items: 10,
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
    setTimeout(() => {
      this.setState({ items: this.state.items + 5, loading: false });
    }, 500);
  }

  handlePatchClick = () => {
    this.setState({
      forum: Forums.PATCH_NOTES,
      items: (this.state.forum = Forums.PATCH_NOTES ? this.state.items : 10)
    });
  };

  handleAnnouncementsClick = () => {
    this.setState({
      forum: Forums.ANNOUNCEMENTS,
      items: this.state.forum == Forums.ANNOUNCEMENTS ? this.state.items : 10
    });
  };

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
            Announcements{" "}
          </button>
        </div>
        {this.props.data[this.state.forum]
          .slice(0, this.state.items)
          .map(data => (
            <Popup title={data.title} html={data.html} text={data.text} />
          ))}
      </div>
    );
  }
}

export default ScrollContainer;
