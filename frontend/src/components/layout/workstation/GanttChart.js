/**
 * GanttChart
 * Description - Using the D3 library, this component generates different rows for each
 * workstation state. Each row generate a rectangle with a width and height fixed.
 * The colors of each row is brought by the statesColors.
 */

import React, { Fragment } from 'react'
import * as d3 from 'd3'

export const GanttChart = ({ ws_id, data, statesColors }) => {
	// input data for graph
	// array of length 50 filled with -1, adding state values from websocket
	let i = 0
	let dataPoints = 50
	const cardData = Array.from({ length: dataPoints }, () => data[i++])

	/* Representing the svg width by getting the width of the parent div */
	var svg_width = 0
	var svg_parent = document.querySelector("#svg")
	if (svg_parent){
		svg_width = svg_parent.clientWidth
	}

	/* Rectangle size on each row 
	Width = existing space / maximum length of the data Points 
	Height has to be responsive in the future if we got more states for example */
	var width = svg_width / dataPoints
	const height = 50

	/* Scale */

	//differentiate each svg graph according to its workstation id
	let svg = d3
		.select('#gantt_chart' + ws_id)
		.selectAll('rect')
		.remove()
	svg = d3
		.select('#gantt_chart' + ws_id)
		.selectAll('rect')
		.data(cardData) //[0,2,1,1,1,0,0,0,0,1,1,1,2,2,2] length=12
		.enter()
		.append('rect') //value of cardData[0]=0
		.attr('fill', function(value) {
			if (value === 0) {
				return statesColors[0]
			} else if (value === 1) {
				return statesColors[1]
			} else if (value === 2) {
				return statesColors[2]
			} else if (value === 3) return statesColors[3]
		})
		.attr('width', width) 
		.attr('height', function(value) {
			if (value === -1) {
				return 0
			} else return height
		}) //fix size
		.attr('x', function(d, i) {
			// dynamic position
			return i * width // [index of array] * [width of rect]  
		})
		.attr('y', function(value) {
			// dynamic position
			return height + height * value // [height of rect] + ( [height of rect] * [array value] ) 50,100,150,...
		})
	return (
		<Fragment>
			<div className='text-center' id = 'svg'>
				<svg
					id={'gantt_chart' + ws_id}
					style={{
						height: 300,
						width: '100%',
						border: '1px solid white',
					}}
				></svg>
			</div>
		</Fragment>
	)
}

export default GanttChart
