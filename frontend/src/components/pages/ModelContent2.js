import React, { Fragment, useContext, useState, useEffect } from 'react'
import ModelContext from '../../context/model/modelContext'
import WorkStationCard from '../layout/WorkStationCard'
import { client } from '../websockets/modelWebsocket'
import { Spinner } from '../layout/Spinner'

export const ModelContent2 = () => {
	const [websocketState, setWebsocketState] = useState('')

	let numState = client.readyState

	useEffect(() => {
		console.log('numState:', numState)
		switch (numState) {
			case 0:
				setWebsocketState('CONNECTING')
				break
			case 1:
				setWebsocketState('OPEN')
				break
			case 2:
				setWebsocketState('CLOSING')
				break
			case 3:
				setWebsocketState('CLOSED')
				break
			default:
				setWebsocketState('')
				break
		}
	}, [numState])

	const handleChange = e => {
		const target = e.target
		console.log(target.checked)
		if (!target.checked && numState === 1) {
			client.close()
			setWebsocketState('CLOSED')
		} else if (target.checked && numState !== 1) {
			window.location.reload()
		}

		// if (!target.checked) {
		// 	client.close()
		// }
		// console.log(client.readyState)
	}
	const modelContext = useContext(ModelContext)

	const { data, wks } = modelContext

	return (
		<Content>
			<div className='d-sm-flex align-items-center justify-content-between mb-4 my-4'>
				<h1 className='h3 mb-0 text-gray-800'>Model Content</h1>
				<SwitchToggle stateName={websocketState} change={handleChange} />
			</div>
		</Content>
	)
}

const SwitchToggle = ({ stateName, change }) => {
	// console.log('stateName:', stateName)
	return (
		<div className='custom-control custom-switch'>
			<input
				type='checkbox'
				className='custom-control-input'
				id='modelSwitch'
				checked={stateName === 'OPEN' && 'true'}
				onChange={change}
			/>
			<label className='custom-control-label' htmlFor='modelSwitch'>
				Websocket switch{' '}
				<span className='badge badge-success'>{stateName}</span>
			</label>
		</div>
	)
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
