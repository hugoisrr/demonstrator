import { useContext, useRef, useState } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import DeviceContext from '../../context/device/deviceContext'

const client = new W3CWebSocket('ws://172.21.30.241:2000')

const DeviceWebsocket = () => {
	const deviceContext = useContext(DeviceContext)
	const { getDeviceData, getDeviceWks } = deviceContext
	const [wks, setWks] = useState()
	const ref = useRef(true)

	client.onerror = () => {
		console.error('Connection Error with WebSocket Device')
	}

	client.onopen = () => {
		console.log('WebSocket Device Client Connected')
	}

	client.onmessage = message => {
		if (message.data.length > 0 && ref.current) {
			setWks(message.data)
			ref.current = false
		} else if (!ref.current) {
			getDeviceData(message.data)
		}
		getDeviceWks(wks)
	}

	return null
}

export default DeviceWebsocket
