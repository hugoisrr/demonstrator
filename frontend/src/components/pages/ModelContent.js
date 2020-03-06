import React, { Fragment, useContext, useState, useEffect } from 'react'
import ModelContext from '../../context/model/modelContext'
import WorkStationCard from '../layout/WorkStationCard'
import { client } from '../websockets/modelWebsocket'
import { Spinner } from '../layout/Spinner'

export const ModelContent = () => {
	const [websocketState, setWebsocketState] = useState('')
	// console.log(typeof client.readyState)

	useEffect(() => {
		if (client.CLOSING) {
			setWebsocketState('CLOSING')
		} else if (client.CLOSED) {
			setWebsocketState('CLOSED')
		} else if (client.CONNECTING) {
			setWebsocketState('CONNECTING')
		}
		// eslint-disable-next-line
	}, [])

	const handleChange = e => {
		const target = e.target
		if (target.checked) {
			client.close()
		}
	}
	const modelContext = useContext(ModelContext)

	const { data, wks } = modelContext
	console.log(client.readyState)

	if (client.readyState === 1 && wks.length > 0) {
		return (
			<Content>
				<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
					<h1 className='h3 mb-0 text-gray-800'>Model Content</h1>
					<div className='custom-control custom-switch'>
						<form>
							<input
								type='checkbox'
								className='custom-control-input'
								id='modelSwitch'
								value='open'
								onChange={handleChange}
							/>
							<label className='custom-control-label' htmlFor='modelSwitch'>
								Websocket switch{' '}
								<span className='badge badge-success'>OPEN</span>
							</label>
						</form>
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
	} else if (client.readyState === 3) {
		return (
			<Content>
				<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
					<h1 className='h3 mb-0 text-gray-800'>Model Content</h1>
					<div className='custom-control custom-switch'>
						<input
							type='checkbox'
							className='custom-control-input'
							id='modelSwitch'
						/>
						<label className='custom-control-label' htmlFor='modelSwitch'>
							Websocket switch{' '}
							<span className='badge badge-success'>{websocketState}</span>
						</label>
					</div>
				</div>
				<Spinner />
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
							id='modelSwitch'
						/>
						<label className='custom-control-label' htmlFor='modelSwitch'>
							Websocket switch{' '}
							<span className='badge badge-success'>{websocketState}</span>
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
