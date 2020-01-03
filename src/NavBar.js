import React, { Component } from "react";

import { Forums } from "./enums";
import "./NavBar.css";

class NavBar extends Component {
  state = {};
  render() {
    const pages = ["home", "about", "portfolio"];
    const navLinks = pages.map(page => {
      return <a href={"#" + page}>{page}</a>;
    });

    return (
      <ul className="nav nav-pills nav-bar">
        <li>
          <a
            className="nav-tab"
            onClick={() => this.props.handleTabClick(Forums.PATCH_NOTES)}
          >
            Patch Notes
          </a>
        </li>
        <li>
          <a
            className="nav-tab"
            onClick={() => this.props.handleTabClick(Forums.ANNOUNCEMENTS)}
          >
            Announcements
          </a>
        </li>
      </ul>
    );
  }
}

export default NavBar;
