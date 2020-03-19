import React, { useContext } from 'react'
import DeviceContext from '../../context/device/deviceContext'
import ContentAPI from '../layout/ContentAPI'
import { client } from '../websockets/deviceWebsocket'
import { Spinner } from '../layout/Spinner'
import { DeviceGraphs } from '../layout/DeviceGraphs'

const DeviceContent = ({ title }) => {
	const deviceContext = useContext(DeviceContext)

	const {
		wks,
		wksMap,
		currentDevice,
		websocketStatus,
		getDeviceWebsocketStatus,
	} = deviceContext

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
				dropdown
			>
				<div className='row'>
					{currentDevice === null ?  <SelectDevice>Select Device</SelectDevice> : <DeviceGraphs currentDevice={currentDevice} wks={wks} wksMap={wksMap} />}
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

const SelectDevice = ({children}) => {
	return (
	<div className="text-center col-12 center-block mt-5">
		<h5 style={{color: 'lightGray'}}>{children}</h5>
	</div>
	)
}

export default DeviceContent
