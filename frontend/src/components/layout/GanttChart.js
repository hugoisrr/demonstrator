import React, { Fragment, useContext, useRef } from 'react'
import ModelContext from '../../context/model/modelContext'
import { Spinner } from '../layout/Spinner'
import * as d3 from "d3";

export const GanttChart = ({ ws_id, data }) => {
	const modelContext = useContext(ModelContext)
  	var margin = { top: 20, right: 10, bottom: 30, left: 10 };
  	var width = 10 - margin.left - margin.right; //TODO: Dynamic
	var height = 200 - margin.top - margin.bottom; //fix
	// creating a non existing svg
	var svg = null;
	// input data for graph
	// array of length 30 filled with -1, adding state values from websocket	
	var i = 0
	var cardData = Array.from({ length: 30 }, () => data[i++]); //TODO: websocket data 
		
	
	// #################################################
	// find the element, take the reference and start next step in the chain
		var w= 10;
		var h= 50;
		var gantt_scale_Y = d3.scaleLinear()
		.domain([0, 2]) // input
		.range([0, 2]);
		//var gantt_scale_Y = d3.scaleLinear().domain([0,2]).range([0,2]);
		/* var gantt_scale_X = d3.scaleLinear()
		.domain([0, width])
		.range([0,60]); */

		//differentiate each svg graph according to its workstation id
		var svg = d3.select("#gantt_chart" + ws_id).selectAll("rect").remove()
		var svg = d3.select("#gantt_chart" + ws_id).selectAll("rect")
		.data(cardData)
		.enter()
		.append("rect")
		.attr("fill", function (d) {
			if (d == 0) {
				return "red"
			} else if (d == 1) {
				return "lightgreen"
			} else if (d == 2){
				return "lightblue"
			} else if (d == 3)
				return "yellow"
			})
			.attr("width", w ) //fix size
			.attr("height", function(d){
				if(d == -1){
					return 0}
				else return h
				}
			)	//fix size
			.attr("x", function(d,i){ // dynamic position
				return i*(w+1); // [index of array] * [width of rect] + [gap]
			})
			.attr("y", function(d){ // dynamic position
				return h+(h*d); // [height of rect] + ( [height of rect] * [array value] )
			})
	return (
		<Fragment>
			<div id='content'>
				<div>
					<svg id={"gantt_chart" + ws_id }
						ref={el => {
						if (!el) return;
						}} 
						style={{height: 300, width: window.width }}> 
					</svg>
				</div>
			</div>
		</Fragment>
	)
	// }
}

export default GanttChart