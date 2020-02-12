import React, { Component } from "react";
import { ItemCard } from "./ItemCard";
import { DataContext } from "./context";
import { thresholdFreedmanDiaconis } from "d3";

export default class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      conf: props.data.conf
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.data !== state.data || props.conf !== state.conf) {
      return {
        data: props.data,
        conf: props.data.conf
      };
    }
    return null;
  }

  render() {
    return (
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content" className="my-4">
          <div className="container-fluid">
            <h1 className="h3 mb-4 text-gray-800">
              Datenformat aus Edge Device
            </h1>
            <div className="row">
              {this.state.conf.map((item, index) => {
                return (
                  <div key={index} className="col-lg-4 col-md-4">
                    <ItemCard
                      id={item.id}
                      index={index}
                      image={"img/drill.png"}
                      data={this.state.data}
                      item={item}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
