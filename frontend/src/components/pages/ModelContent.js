import React, { useContext } from 'react'
import ModelContext from '../../context/model/modelContext'
import ContentAPI from '../layout/ContentAPI'
import WorkStationCard from '../layout/WorkStationCard'
import { Spinner } from '../layout/Spinner'

const ModelContent = ({ title }) => {
	const modelContext = useContext(ModelContext)

	const { wks, dictionary, websocketStatus } = modelContext

	const handleSwitch = ({ target }) => {
		console.log(target.checked)
	}

	// Verifies if there are Workstations and Data is been received
	if (wks.length > 0 && Object.keys(dictionary).length > 0) {
		return (
			<ContentAPI
				title={title}
				websocketStatus={websocketStatus}
				change={handleSwitch}
			>
				<div className='row'>
					{wks.map(workstation => {
						console.table()
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
			<ContentAPI>
				<Spinner />
			</ContentAPI>
		)
	}
}

ModelContent.defaultProps = {
	title: 'Model Content',
}

export default ModelContent
