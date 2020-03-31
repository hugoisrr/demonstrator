import React, { Fragment } from 'react'
import * as d3 from 'd3'

export const GanttChart = ({ ws_id, data }) => {
	// input data for graph
	// array of length 30 filled with -1, adding state values from websocket
	let i = 0
	const cardData = Array.from({ length: 30 }, () => data[i++])
	console.log('cardData:', cardData)

	// find the element, take the reference and start next step in the chain
	const w = 10
	const h = 50

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
		.attr('fill', function(d) {
			if (d === 0) {
				return 'red'
			} else if (d === 1) {
				return 'lightgreen'
			} else if (d === 2) {
				return 'lightblue'
			} else if (d === 3) return 'yellow'
		})
		.attr('width', w) //fix size
		.attr('height', function(d) {
			if (d === -1) {
				return 0
			} else return h
		}) //fix size
		.attr('x', function(d, i) {
			// dynamic position
			return i * (w + 1) // [index of array] * [width of rect] + [gap] 0,11,22,33,44,...
		})
		.attr('y', function(d) {
			// dynamic position
			return h + h * d // [height of rect] + ( [height of rect] * [array value] ) 50,100,150,...
		})
	return (
		<Fragment>
			<div id='content'>
				<div>
					<svg
						id={'gantt_chart' + ws_id}
						style={{ height: 300, width: window.width }}
					></svg>
				</div>
			</div>
		</Fragment>
	)
}

export default GanttChart
