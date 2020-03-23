import React, { Fragment, useContext, useRef } from 'react'
import ModelContext from '../../context/model/modelContext'
import { Spinner } from '../layout/Spinner'
import * as d3 from "d3";
export const ModelContent = () => {
	const modelContext = useContext(ModelContext)
	const { data, wks, loading } = modelContext
	// const loadingRef = useRef(true)
	// if (loading && loadingRef.current) {
	// 	console.log('loading:', loading)
	// 	loadingRef.current = false
	// 	return <Spinner />
	// } else if (!loadingRef.current) {
	// #################################################
	//  old data format
	// 	[{"id": 10, "name": "Drill"}, {"id": 11, "name": "Laser"}, {"id": 12, "name": "Hammer"}]
	//  {"id": 10, "state": 1, "stateName": "spindle"}
	//  {"id": 10, "state": 1, "stateName": "spindle"}
	//  {"id": 10, "state": 1, "stateName": "spindle"}
	//  new data format
	//  [{"ws_id": 0, "ws_name": "engraving machine", "states": {"0": "null", "1": "spindle", "2": "engraving"}}, {"ws_id": 1, "ws_name": "drill", "states": {"0": "null", "1": "moving", "2": "drilling", "3": "playing"}}]
	//  {"ws_id": 1, "state_key": 2}
	//  {"ws_id": 1, "state_key": 2}
	//  {"ws_id": 1, "state_key": 2}
  	var margin = { top: 20, right: 10, bottom: 30, left: 10 };
  	var width = 500 - margin.left - margin.right; //TODO: Dynamic
	var height = 200 - margin.top - margin.bottom; //fix
	const ganttBox = {
		border: '3px solid green'
	};
	// creating a non existing svg
	var svg = null;
	// input data for graph
	// create a array of the leght 60 with zeros in it
	// add new value at the end of the array
	var cardData = Array.from({length: 60}, () => Math.floor(Math.random() * 3)); //TODO: websocket data
	// #################################################
	// find the element, take the reference and start next step in the chain
		var w= 10;
		var h= 50;
		var gantt_scale_Y = d3.scaleLinear().domain([0,2]).range([0,2]);
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
	// colored boxes in a line - chart
	var gantt = d3.select("#gantt_div").selectAll("div").remove();
	var gantt = d3.select("#gantt_div").selectAll("div")
		.data(cardData)
		.enter()
		.append("div")
		.attr("class","bar")
		.style("background", function(d){
			if(d == 0){
				return "red";
			}else if(d == 1){
				return "lightgreen"
			}else
				return "lightblue"
		})
		.style("width", "20px")
		.style("height", "20px")
		.style("margin-right", "4px")
		.style("display", "inline-block")
	return (
		<Fragment>
			<div id='content'>
				<div className='container-fluid'>
					<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
						<h1 className='h3 mb-0 text-gray-800'>Model Content</h1>
						<div className='custom-control custom-switch'>
							<input
								type='checkbox'
								className='custom-control-input'
								id='customSwitch1'
							/>
							<label className='custom-control-label' htmlFor='customSwitch1'>
								Toggle this switch element
							</label>
						</div>
					</div>
					<h3 className='h4 mb-4 text-gray-200 my-4'>{wks}</h3>
					<h3 className='h4 mb-4 text-gray-200 my-4'>{data}</h3>
				</div>
				<div style={ganttBox} >
					<svg id="gantt_chart" 
						ref={el => {
        				if (!el) return;
        				}} 
	  					style={{height: 600, width: window.innerWidth}}>
					</svg>
				</div>
				<div id="gantt_div"></div>
			</div>
		</Fragment>
	)
	// }
}