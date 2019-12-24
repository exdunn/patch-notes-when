import React, { Component } from "react";
import { Card, CardBody, CardTitle, CardText } from "reactstrap";
import "./CardButton.css";

class CardButton extends Component {
  render() {
    return (
      <div>
        <Card className="card-button" onClick={this.props.onClick}>
          <CardBody>
            <CardTitle>
              <h4>{this.props.title}</h4>
            </CardTitle>
            <CardText>{this.props.body}</CardText>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default CardButton;
