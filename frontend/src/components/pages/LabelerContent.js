import React, { useContext } from 'react'
import LabelerContext from '../../context/labeler/labelerContext'
import ContentAPI from '../layout/ContentAPI'
import WorkStationCard from '../layout/WorkStationCard'
import { client } from '../websockets/labelerWebsocket'
import { Spinner } from '../layout/Spinner'

const LabelerContent = ({ title }) => {
	const labelerContext = useContext(LabelerContext)

	const {
		wks,
		wksMap,
		websocketStatus,
		wksStatesColors,
		getLabelerWebsocketStatus,
	} = labelerContext

	const handleSwitch = ({ target }) => {
		if (!target.checked && websocketStatus === 'OPEN') {
			client.close()
			getLabelerWebsocketStatus('CLOSED')
		} else if (target.checked && websocketStatus !== 'OPEN') {
			window.location.reload()
			getLabelerWebsocketStatus('OPEN')
		}
	}

	// Verifies if there are Workstations and Data is been received
	if (wks.length > 0 && wksMap.size > 0 && wksStatesColors.size > 0) {
		return (
			<ContentAPI
				title={title}
				websocketStatus={websocketStatus}
				change={handleSwitch}
			>
				<div className='row'>
					{wks.map(workstation => {
						const statesColors = wksStatesColors.get(workstation.ws_id)
						const dataValues = wksMap.get(workstation.ws_id)
						return (
							<div className='col-lg-4 col-md-6' key={workstation.ws_id}>
								<WorkStationCard
									workstation={workstation}
									statesColors={statesColors}
									dataValues={dataValues}
								/>
							</div>
						)
					})}
				</div>
			</ContentAPI>
		)
	} else {
		return (
			<ContentAPI
				title={title}
				websocketStatus={websocketStatus}
				change={handleSwitch}
			>
				<Spinner />
			</ContentAPI>
		)
	}
}

LabelerContent.defaultProps = {
	title: 'Labeler Content',
}

export default React.memo(LabelerContent)
