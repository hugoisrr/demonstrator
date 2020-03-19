import React, { useContext } from 'react'
import DeviceContext from '../../context/device/deviceContext'
import ContentAPI from '../layout/ContentAPI'
import { client } from '../websockets/deviceWebsocket'
import { Spinner } from '../layout/Spinner'

const DeviceContent = ({ title }) => {
	const deviceContext = useContext(DeviceContext)

	const {
		wks,
		wksMap,
		currentDevice,
		websocketStatus,
		getDeviceWebsocketStatus,
	} = deviceContext

	console.log('currentDevice:', currentDevice)

	const handleSwitch = ({ target }) => {
		if (!target.checked && websocketStatus === 'OPEN') {
			client.close()
			getDeviceWebsocketStatus('CLOSED')
		} else if (target.checked && websocketStatus !== 'OPEN') {
			window.location.reload()
			getDeviceWebsocketStatus('OPEN')
		}
	}

	// Verifies if there are Workstations and Data is been received, if not it renders a Spinner
	if (wks.length > 0 && wksMap.size > 0) {
		return (
			<ContentAPI
				title={title}
				websocketStatus={websocketStatus}
				change={handleSwitch}
				dropdown={true}
			>
				<div className='row'>
					<h1>Hola</h1>
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

DeviceContent.defaultProps = {
	title: 'Device Content',
}

export default DeviceContent
