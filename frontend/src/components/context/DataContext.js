import React, { createContext, useState } from "react";
import PropTypes from "prop-types";

export const Context = createContext({});

export const Provider = props => {
  const { data: initialData, children } = props;

  // Use State to keep the values
  // conf = [{id: 1, name: "Drill"}]
  // values = [[{id; 1, state: 0, stateName: "running"}],[],[]]

  var test = new Array(60).fill(0);
  const [data, setData] = useState({
    conf: [],
    values: [
      test.map(item => {
        var obj = {
          id: 10,
          state: -1
        };
        return obj;
      }),
      [],
      []
    ]
  });

  const setNewData = newData => {
    setData(data => {
      data.conf = newData;

      var arr = [];
      Object.keys(data).map(key => {
        arr[key] = data[key];
      });
      return arr;
    });
  };

  const getData = () => {
    return data;
  };

  const pushNewData = newData => {
    // search in the conf file for the position in the array
    var found = data.conf.findIndex(item => item.id === newData.id);

    //push new date to the certain array
    setData(data => {
      if (data.values[found].length >= 60) {
        data.values[found].shift();
      }
      var obj = {
        id: newData.id,
        state: newData.state,
        stateName: newData.stateName
      };
      data.values[found].push(obj);

      var arr = [];
      Object.keys(data).map(key => {
        arr[key] = data[key];
      });
      return arr;
    });
  };

  // Make the context object:
  const dataContext = {
    data,
    setData,
    setNewData,
    pushNewData,
    getData
  };

  // pass the value in provider and return
  return <Context.Provider value={dataContext}>{children}</Context.Provider>;
};

export const { Consumer } = Context;

Provider.propTypes = {
  data: PropTypes.array
};

Provider.defaultProps = {
  data: []
};
