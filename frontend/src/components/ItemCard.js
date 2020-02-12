import React, { useState, useEffect, useRef } from "react";
import { ProgressBar } from "./ProgressBar";
import { DataContext } from "./context";
import * as d3 from "d3";
export const ItemCard = props => {

  const [progress, setProgress] = useState([10, 10, 10]);

  var cardData = [];
  var margin = { top: 20, right: 10, bottom: 30, left: 10 };
  var width = 500 - margin.left - margin.right;
  var height = 200 - margin.top - margin.bottom;

  // D3 Graph configuration
  var xScale = d3.scaleLinear([0, width]).domain([0, 60]);
  var yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, 3]);

  var xAxis = d3
    .axisBottom(xScale)
    .tickSize(1)
    .ticks(6);

  var yAxis = d3
    .axisLeft(yScale)
    .tickSize(1)
    .ticks(3);
  var svg = null;

  const generateCardData = () => {
    var idData = [];
    props.data.values.map(item => {
      if (item && item[0] !== undefined) {
        if (item[0].id == props.id) idData = item;
      }
    });
    return idData;
  };
  cardData = generateCardData();

  const updateGraph = () => {
    svg
      .selectAll(".bar")
      .remove()
      .exit()
      .data(cardData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d, i) => {
        return xScale(i);
      })
      .attr("fill", "#4e73df")
      .attr("width", xScale(1))
      .attr("y", d => {
        if (yScale(d.state) < 200) {
          return yScale(d.state + 1);
        } else {
          return yScale(100);
        }
      })
      .attr("height", d => {
        return height - yScale(1);
      });
    svg.select(".x-axis").call(xAxis);
    svg.select(".y-axis").call(yAxis);
  };

  const doOnMount = () => {
    d3.select(`#graph${props.index} > svg`).remove();
    svg = d3
      .select(`#graph${props.index}`)
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width + margin.left + margin.right} 400`)
      .classed("svg-content-responsive", true)

      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("g")
      .attr("transform", "translate(" + 0 + "," + height + ")")
      .attr("class", "x-axis")
      .call(xAxis);
    svg
      .append("g")
      .attr("transform", "translate(" + 0 + "," + 0 + ")")
      .attr("class", "y-axis")
      .call(yAxis);
    updateGraph();
  };

  const didMountRef = useRef(false);

  useEffect(() => {

    if (didMountRef.current) {
      doOnMount();
      if (cardData.length > 0) {
        setProgress(prevProgress => {
          var tempArr = prevProgress;
          var position = cardData[cardData.length - 1].state;
          tempArr[position] += 1;
          return tempArr;
        });
      }
    } else didMountRef.current = true;
  });

  return (
    <div className="card shadow mb-4">
      <div className="card-header py-3">
        <div className="row">
          <h6 className="m-0 font-weight-bold text-primary col-6">
            {props.item.name}
          </h6>
          <small className="text-muted text-right col-6">ID: {props.id}</small>
        </div>
      </div>
      <div className="card-body">
        <div className="text-center">
          <img
            className="img-fluid px-3 px-sm-4 mt-3 mb-4"
            style={{ height: "9rem" }}
            src={props.image}
            alt=""
          />
        </div>
        <h6>State:</h6>
        <h1 className="m-0 font-weight-bold display-3" id="currentState1">
          {cardData.length > 0 ? cardData[cardData.length - 1].stateName : null}
        </h1>
        <ProgressBar progress={progress} />
        <div className="svg-container" id={`graph${props.index}`}></div>
      </div>
    </div>
  );
};
