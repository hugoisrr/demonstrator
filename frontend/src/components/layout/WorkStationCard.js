import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import drillImage from '../../assets/img/drill.png'
import engravingImage from '../../assets/img/engravingMachine.png'
import ProgressBar from './ProgressBar'

const WorkStationCard = ({ workstation: { ws_id, ws_name, states }, data }) => {
	const [currentState, setState] = useState('null')

	// Set current state name of each workstation
	useEffect(() => {
		data.forEach(element => {
			for (const [stateId, stateName] of Object.entries(states)) {
				if (element === parseInt(stateId)) setState(stateName)
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
				<h1 className='display-3 text-center bold'>{currentState}</h1>
				<hr />
				<ProgressBar states={states} data={data} />
			</div>
		</div>
	)
}

WorkStationCard.propTypes = {
	workstation: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
}

export default WorkStationCard
