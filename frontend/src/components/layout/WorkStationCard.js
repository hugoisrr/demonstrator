/**
 * WorkstationCard
 * Description - The first useEffect() runs only once because of the empty array, and it
 * randomly sets the color of each state. The second useEffect() runs for every data received,
 * then it verifies the state_id received from the data and sets the current staet and it's color.
 * Then for the ProgressBar component it receives the objects, data, and the array of colors.
 */

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import drillImage from '../../assets/img/drill.png'
import engravingImage from '../../assets/img/engravingMachine.png'
import ProgressBar from './ProgressBar'
import TestContent from '../pages/TestContent'

import { getRandColor } from '../../assets/libs/helperFunctions'

const WorkStationCard = ({ workstation: { ws_id, ws_name, states }, data }) => {
	const [currentState, setState] = useState('null')
	const [statesColors, setStatesColors] = useState({})
	const [color, setColor] = useState()

	const styleObj = {
		color: color
	}

	const styleDiv = {
		'white-space': 'nowrap',
		'text-overflow': 'ellipsis',
		'overflow': 'hidden',
		'display': 'inherit'}
	// Get a random color for each state
	useEffect(() => {
		const colorStates = {}
		Object.values(states).forEach(state => {
			colorStates[state] = getRandColor(5)
		})
		setStatesColors(colorStates)
	}, [])

	// Set current state name and state's color of each workstation
	useEffect(() => {
		data.forEach(element => {
			for (const [stateId, stateName] of Object.entries(states)) {
				if (element === parseInt(stateId)) {
					setState(stateName)
					setColor(Object.values(statesColors)[stateId])
				}
			}
		})
	})

	return (
		<div className='card shadow mb-4 workstationcard'>
			<div className='card-header py-3'>
				<div className='row'>
					<h5 id='cardName' className='m-0 font-weight bold col-6'>
						{ws_name}
					</h5>
					<small className='text-right text-muted col-6'>ID: {ws_id}</small>
				</div>
			</div>
			<div className='card-body'>
				<div className='text-center'>
					<img
						src={ws_id === 0 ? engravingImage : drillImage}
						alt=''
						className='img-fluid px-3 px-sm-4 mt-3 mb-4'
						style={{ height: '9rem' }}
					/>
				</div>
				<h6 style={{ color: 'white' }}>State:</h6>
				<div style={styleDiv}>
				<h1 className='display-3 text-center bold' style={styleObj}>
					{currentState}
					</h1>
				</div>
				<hr />
				
				<ProgressBar
					states={states}
					data={data}
					statesColors={Object.values(statesColors)}
				/>
				<TestContent states={states} data={data}/>
			</div>
		</div>
	)
}

WorkStationCard.propTypes = {
	workstation: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
}

export default WorkStationCard
