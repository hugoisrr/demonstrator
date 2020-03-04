import React from 'react'
import PropTypes from 'prop-types'
import drillImage from '../../assets/img/drill.png'
import engravingImage from '../../assets/img/engravingMachine.png'

const WorkStationCard = ({ workstation: { ws_id, ws_name, states }, data }) => {
	const statesArray = Object.values(states)
	let statesBuffer = new ArrayBuffer(16)
	let stateView = new DataView(statesBuffer)
	if (typeof data.state_key === 'number') {
		console.log(data.state_key)
	}
	return (
		<div className='card shadow mb-4'>
			<div className='card-header py-3'>
				<div className='row'>
					<h5
						id='cardName'
						className='m-0 font-weight bold col-6'
						style={{ textTransform: 'uppercase' }}
					>
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
				<h1 className='display-3 text-center bold'>Engraving</h1>
				<h4>{data.ws_id}</h4>
			</div>
		</div>
	)
}

WorkStationCard.propTypes = {
	workstation: PropTypes.object.isRequired,
	data: PropTypes.object.isRequired,
}

export default WorkStationCard
