/**
 * WorkstationCard
 * Description - The first useEffect() runs only once because of the empty array, and it
 * randomly sets the color of each state. The second useEffect() runs for every data received,
 * then it verifies the state_id received from the data and sets the current staet and it's color.
 * Then for the ProgressBar component it receives the objects, data, and the array of colors.
 */

import React from 'react'
import PropTypes from 'prop-types'
import drillImage from '../../assets/img/drill.png'
import engravingImage from '../../assets/img/engravingMachine.png'
import { CurrentState } from './workstation/CurrentState'
import ProgressBar from './workstation/ProgressBar'

const WorkStationCard = ({
	workstation: { ws_id, ws_name, states },
	statesColors,
	dataValues,
}) => {
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
				<CurrentState
					statesColors={Object.values(statesColors)}
					dataValues={dataValues}
					states={states}
				/>
				<hr />
				<ProgressBar
					wsId={ws_id}
					states={states}
					data={dataValues}
					statesColors={Object.values(statesColors)}
				/>
				<div className='d-sm-flex align-items-center my-2 justify-content-center'>
					{Object.keys(statesColors).map((state, index) => {
						return (
							<span
								className='badge badge-info mx-2'
								key={index}
								style={{
									backgroundColor: Object.values(statesColors)[index],
									color: 'darkslategray',
								}}
							>
								{state}
							</span>
						)
					})}
				</div>
			</div>
		</div>
	)
}

WorkStationCard.propTypes = {
	workstation: PropTypes.object.isRequired,
	statesColors: PropTypes.object.isRequired,
	dataValues: PropTypes.array.isRequired,
}

export default WorkStationCard
