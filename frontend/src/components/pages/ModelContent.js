/**
 * Model Content
 * Description - it verifies if data is been received, so it would render
 * the workstation cards, if data is not received it shows the Spinner. The
 * file receives as a props the title of the page, so then it's passed to the
 * ContentAPI as a prop
 *
 */

import React, { useContext } from 'react'
import ModelContext from '../../context/model/modelContext'
import ContentAPI from '../layout/ContentAPI'
import WorkStationCard from '../layout/WorkStationCard'
import { client } from '../websockets/modelWebsocket'
import { Spinner } from '../layout/Spinner'

const ModelContent = ({ title }) => {
	const modelContext = useContext(ModelContext)

	const {
		wks,
		wksMap,
		websocketStatus,
		wksStatesColors,
		getModelWebsocketStatus,
	} = modelContext

	const handleSwitch = ({ target }) => {
		if (!target.checked && websocketStatus === 'OPEN') {
			client.close()
			getModelWebsocketStatus('CLOSED')
		} else if (target.checked && websocketStatus !== 'OPEN') {
			window.location.reload()
			getModelWebsocketStatus('OPEN')
		}
	}

	// Verifies if there are Workstations and Data is been received, if not it renders a Spinner
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
							<div
								className='col-xl-6 col-lg-8 col-md-12'
								key={workstation.ws_id}
							>
								<WorkStationCard
									workstation={workstation}
									statesColors={statesColors}
									dataValues={dataValues}
									isLabeler={false}
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

ModelContent.defaultProps = {
	title: 'Model Content',
}

export default React.memo(ModelContent)
