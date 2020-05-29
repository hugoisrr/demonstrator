/**
 * WorkstationCard
 * Description - The first useEffect() runs only once because of the empty array, and it
 * randomly sets the color of each state. The second useEffect() runs for every data received,
 * then it verifies the state_id received from the data and sets the current staet and it's color.
 *  */

import React from 'react'
import PropTypes from 'prop-types'
import drillImage from '../../assets/img/drill.png'
import engravingImage from '../../assets/img/engravingMachine.png'
import { CurrentState } from './workstation/CurrentState'
import ProgressBar from './workstation/ProgressBar'
import GanttChart from './workstation/GanttChart'

const WorkStationCard = ({
	workstation: { ws_id, ws_name, states },
	statesColors,
	dataValues,
	isLabeler,
}) => {
	return (
		<div className='card shadow mb-4 workstationcard'>
			<div className='card-header py-3'>
				<div className='row'>
					<h2 id='cardName' className='m-0 font-weight bold col-6'>
						{ws_name}
					</h2>
					<h3 className='text-right col-6'>ID: {ws_id}</h3>
				</div>
			</div>
			<div className='card-body'>
				<div className='text-center'>
					<img
						src={ws_id === 0 ? engravingImage : drillImage} //implement it for more than 2 ws
						alt=''
						className='img-fluid px-3 px-sm-4 mt-3 mb-4'
						style={{ height: '9rem' }}
					/>
				</div>
				<h3>State:</h3>
				<CurrentState
					statesColors={Object.values(statesColors)}
					dataValues={dataValues}
					states={states}
				/>
				<hr />
				<h3>Historical data:</h3>
				<GanttChart
					ws_id={ws_id}
					data={dataValues}
					statesColors={Object.values(statesColors)}
				/>
				<hr />
				<ProgressBar
					wsId={ws_id}
					states={states}
					data={dataValues}
					statesColors={Object.values(statesColors)}
					isLabeler={isLabeler}
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
