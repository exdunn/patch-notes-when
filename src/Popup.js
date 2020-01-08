import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import CardButton from "./CardButton";
import "./Popup.css";

class Popup extends Component {
  state = { show: false };

  toggle = () => {
    this.setState({
      show: !this.state.show
    });
  };

  render() {
    return (
      <div>
        <CardButton
          onClick={this.toggle}
          title={this.props.title}
          body={this.props.text.substring(0, 500).trim() + "..."}
        />
        <Modal
          isOpen={this.state.show}
          modalTransition={{ timeout: 200 }}
          backdropTransition={{ timeout: 200 }}
          toggle={this.toggle}
          size="xl"
        >
          <ModalHeader toggle={this.toggle}>
            <a
              href={
                "https://www.pathofexile.com/forum/view-thread/" +
                this.props.thread_num
              }
              target="_"
            >
              {this.props.title}
            </a>
          </ModalHeader>
          <ModalBody>
            <div dangerouslySetInnerHTML={{ __html: this.props.html }}></div>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default Popup;
