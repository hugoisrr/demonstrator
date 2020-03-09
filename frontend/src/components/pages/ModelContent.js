import React, { Fragment, useContext } from 'react'
import ModelContext from '../../context/model/modelContext'
import WorkStationCard from '../layout/WorkStationCard'
import { Spinner } from '../layout/Spinner'

export const ModelContent = () => {
	const modelContext = useContext(ModelContext)

	const { wks, dictionary, websocketStatus } = modelContext
	// console.log('websocketStatus:', websocketStatus)

	// Verifies if there are Workstations and Data is been received
	if (wks.length > 0 && Object.keys(dictionary).length > 0) {
		return (
			<Content>
				<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
					<h1 className='h3 mb-0 text-gray-600'>Model Content</h1>
					<div className='custom-control custom-switch'>
						<form>
							<input
								type='checkbox'
								className='custom-control-input'
								id='modelSwitch'
								value='open'
							/>
							<label className='custom-control-label' htmlFor='modelSwitch'>
								Websocket switch{' '}
								<span className='badge badge-success'>OPEN</span>
							</label>
						</form>
					</div>
				</div>
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
			</Content>
		)
	} else {
		return (
			<Content>
				<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
					<h1 className='h3 mb-0 text-gray-600'>Model Content</h1>
					<div className='custom-control custom-switch'>
						<input
							type='checkbox'
							className='custom-control-input'
							id='modelSwitch'
						/>
						<label className='custom-control-label' htmlFor='modelSwitch'>
							Websocket switch <span className='badge badge-success'>OPEN</span>
						</label>
					</div>
				</div>
				<Spinner />
			</Content>
		)
	}
}

const Content = props => {
	return (
		<Fragment>
			<div id='content'>
				<div className='container-fluid'>{props.children}</div>
			</div>
		</Fragment>
	)
}
