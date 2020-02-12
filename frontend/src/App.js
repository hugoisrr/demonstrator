import React, { Component, Fragment } from "react";
import "./App.css";
import { Sidebar } from "./components/Sidebar";
import Content from "./components/Content";
import Websocket from "./components/Websocket";
import { DataContext } from "./components/context";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}
  componentWillUpdate() {}

  componentDidUpdate() {}
  render() {
    return (
      <div className="App">
        <Websocket />
        <div id="wrapper">
          <DataContext.Consumer>
            {cdata => {
              return (
                <Fragment>
                  <Sidebar ids={cdata.data.conf} />
                  <Content data={cdata.data} />
                </Fragment>
              );
            }}
          </DataContext.Consumer>
        </div>
      </div>
    );
  }
}
App.contextType = DataContext;
export default App;
