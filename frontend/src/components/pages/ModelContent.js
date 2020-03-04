import React, { Fragment, useContext } from 'react'
import ModelContext from '../../context/model/modelContext'
import WebsocketContext from '../../context/websocket/websocketContext'
import WorkStationCard from '../layout/WorkStationCard'
import { Spinner } from '../layout/Spinner'

export const ModelContent = () => {
	const modelContext = useContext(ModelContext)
	const websocketContext = useContext(WebsocketContext)

	const { data, wks } = modelContext
	// console.log('data:', data)

	const { modelWebsocket } = websocketContext

	const { open } = modelWebsocket

	if (open && wks.length > 0) {
		return (
			<Content>
				<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
					<h1 className='h3 mb-0 text-gray-800'>Model Content</h1>
					<div className='custom-control custom-switch'>
						<input
							type='checkbox'
							className='custom-control-input'
							id='customSwitch1'
						/>
						<label className='custom-control-label' htmlFor='customSwitch1'>
							Toggle this switch element
						</label>
					</div>
				</div>
				<div className='row'>
					{wks.map(workstation => (
						<div className='col-lg-4 col-md-4' key={workstation.ws_id}>
							<WorkStationCard
								workstation={workstation}
								data={workstation.ws_id === data.ws_id && data}
							/>
						</div>
					))}
				</div>
			</Content>
		)
	} else {
		return (
			<Content>
				<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
					<h1 className='h3 mb-0 text-gray-800'>Model Content</h1>
					<div className='custom-control custom-switch'>
						<input
							type='checkbox'
							className='custom-control-input'
							id='customSwitch1'
						/>
						<label className='custom-control-label' htmlFor='customSwitch1'>
							Toggle this switch element
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
