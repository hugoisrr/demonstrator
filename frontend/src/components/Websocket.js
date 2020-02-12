import React, { useState, useContext } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import isEqual from "lodash/isEqual";
import { DataContext } from "./context";
import socketIOClient from "socket.io-client";

// const client = new W3CWebSocket("ws://192.168.0.99:2000");
const client = new W3CWebSocket("ws://localhost:2000");

function Websocket() {

  const [data] = useState("");
  const { setNewData, pushNewData, getData } = useContext(DataContext);

  client.onopen = () => {
    console.log("WebSocket Client Connected");
  };
  client.onmessage = message => {
    var data = getData();

    // setting the first values to conf
    if (data && data.conf.length === 0) {
      setNewData(JSON.parse(message.data));
    } else {
      if (!isEqual(JSON.parse(message.data), data)) {
        pushNewData(JSON.parse(message.data));
      }
    }
  };

  client.onerror = error => {
    console.log("Error", "Connection Error");
  };
  return null;
}

export default Websocket;
