import React, { Fragment, useContext, useRef } from 'react'
import ModelContext from '../../context/model/modelContext'
import { Spinner } from '../layout/Spinner'
import * as d3 from "d3";

// svg_x (int) -> as wide as the parent div/card
// svg_y (int) -> hight can be fix
// states_length (int) -> how many states
// states_colors[] -> color matching to each states
// state_history[(int)] -> last X data points
// state_history_length (int) -> X -> length of the history


export const GanttChart = ({ ws_id, data }) => {
	const modelContext = useContext(ModelContext)
  
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
		//var gantt_scale_Y = d3.scaleLinear().domain([0,2]).range([0,2]);
		/* var gantt_scale_X = d3.scaleLinear()
		.domain([0, width])
		.range([0,60]); */

		//differentiate each svg graph according to its workstation id
		svg = d3.select("#gantt_chart" + ws_id).selectAll("rect").remove()
		svg = d3.select("#gantt_chart" + ws_id).selectAll("rect")
		.data(cardData) //[0,2,1,1,1,0,0,0,0,1,1,1,2,2,2] length=12
		.enter()
		.append("rect") //value of cardData[0]=0
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
				return i*(w+1); // [index of array] * [width of rect] + [gap] 0,11,22,33,44,...
			})
			.attr("y", function(d){ // dynamic position
				return h+(h*d); // [height of rect] + ( [height of rect] * [array value] ) 50,100,150,...
			})
	return (
		<Fragment>
			<div id='content'>
				<div>
					<svg id={"gantt_chart" + ws_id }
						style={{height: 300, width: window.width }}> 
					</svg>
				</div>
			</div>
		</Fragment>
	)
	// }
}

export default GanttChart