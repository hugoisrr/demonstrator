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
		dictionary,
		websocketStatus,
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
	if (wks.length > 0 && Object.keys(dictionary).length > 0) {
		return (
			<ContentAPI
				title={title}
				websocketStatus={websocketStatus}
				change={handleSwitch}
			>
				<div className='row'>
					{wks.map(workstation => {
						return (
							<div className='col-lg-4 col-md-4' key={workstation.ws_id}>
								<WorkStationCard
									workstation={workstation}
									data={dictionary[workstation.ws_id]}
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

export default ModelContent
