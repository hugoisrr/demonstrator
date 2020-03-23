import React, { Fragment, useContext, useRef } from 'react'
import ModelContext from '../../context/model/modelContext'
import { Spinner } from '../layout/Spinner'
import * as d3 from "d3";

export const TestContent = ({data, states}) => {
	const modelContext = useContext(ModelContext)
  	var margin = { top: 20, right: 10, bottom: 30, left: 10 };
  	var width = 10 - margin.left - margin.right; //TODO: Dynamic
	var height = 200 - margin.top - margin.bottom; //fix
	const ganttBox = {
		border: '3px solid green'
	};
	// creating a non existing svg
	var svg = null;
	// input data for graph
	// create a array of the leght 60 with zeros in it
	// add new value at the end of the array
	//var cardData = Array.from({ length: 60 }, () => Math.floor(Math.random() * 3)); //TODO: websocket data
	
	var cardData = Array.from(data);
	// #################################################
	// find the element, take the reference and start next step in the chain
		var w= 10;
		var h= 50;
		//var gantt_scale_Y = d3.scaleLinear().domain([0,2]).range([0,2]);
		// var gantt_scale_X = d3.scaleLinear().domain(document.getElementById("gantt_chart").width).range([0,60]);
		var svg = d3.select("#gantt_chart").selectAll("rect").remove()
		var svg = d3.select("#gantt_chart").selectAll("rect")
			.data(cardData)
			.enter()
			.append("rect")
			.attr("fill", function(d){
				if(d == 0){
					return "red";
				}else if(d == 1){
					return "lightgreen"
				}else
					return "lightblue"
			})
			.attr("width", w) //fix size
			.attr("height", h)	//fix size
			.attr("x", function(d,i){ // dynamic position
				return i*(w+1); // [index of array] * [width of rect] + [gap]
			})
			.attr("y", function(d){ // dynamic position
				return h+(h*d); // [height of rect] + ( [height of rect] * [array value] )
			})
	return (
		<Fragment>
			<div id='content'>
				<div style={ganttBox} >
					<svg id="gantt_chart" 
						ref={el => {
        				if (!el) return;
        				}} 
	  					style={{height: 300, width: 335 }}> //innerWidth ?
					</svg>
				</div>
			</div>
		</Fragment>
	)
	// }
}

export default TestContent