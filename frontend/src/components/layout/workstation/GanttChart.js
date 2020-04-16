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
	// array of length 30 filled with -1, adding state values from websocket
	let i = 0
	const cardData = Array.from({ length: 30 }, () => data[i++])

	/* Rectangle size on each row */
	const width = 10
	const height = 50

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
		.attr('width', width) //fix size
		.attr('height', function(value) {
			if (value === -1) {
				return 0
			} else return height
		}) //fix size
		.attr('x', function(d, i) {
			// dynamic position
			return i * (width + 1) // [index of array] * [width of rect] + [gap] 0,11,22,33,44,...
		})
		.attr('y', function(value) {
			// dynamic position
			return height + height * value // [height of rect] + ( [height of rect] * [array value] ) 50,100,150,...
		})
	return (
		<Fragment>
			<div className='text-center'>
				<svg
					id={'gantt_chart' + ws_id}
					style={{
						height: 300,
						width: window.width,
						border: '1px solid white',
					}}
				></svg>
			</div>
		</Fragment>
	)
}

export default GanttChart
