/**
 * Device Websocket
 * Description - Implementation of Websocket through API methods, the file imports
 * methods from the Context, to set the status of the Websocket, to get the Workstations,
 * set the dictionary data structure and new incoming data from the websocket.
 * The file also export the client so the frontend would have control over the Websocket.
 */

//Recieve data from Device API and pass it to the context
import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import DeviceContext from '../../context/device/deviceContext'
import SidebarContext from '../../context/sidebar/sidebarContext'

//const client = new W3CWebSocket('ws://172.21.30.241:2000')
export const client = new W3CWebSocket('ws://localhost:2000')

const DeviceWebsocket = () => {
	//Define the context to use
	const deviceContext = useContext(DeviceContext)
	const sidebarContext = useContext(SidebarContext)
	//Declare context functions
	const {
		getDeviceWks,
		setUpDeviceMap,
		setDataInDeviceMap,
		getDeviceWebsocketStatus,
	} = deviceContext

	const { getWksIds, setDataInWksIdsMap } = sidebarContext

	client.onerror = () => {
		console.error('Connection Error with WebSocket Device')
		getDeviceWebsocketStatus('ERROR')
	}

	client.onopen = () => {
		console.log('WebSocket Device Client Connected')
		getDeviceWebsocketStatus('CONNECTING')
	}

	client.onmessage = message => {
		//Message is recieved as a string and gets parsed into JSON
		message = JSON.parse(message.data)
		//If message is an array
		if (Array.isArray(message) && message.length > 0) {
			//Passing initial data array into the context
			getDeviceWks(message)
			setUpDeviceMap(message)
			getWksIds(message)
		} else if (typeof message === 'object') {
			setDataInDeviceMap(message)
			setDataInWksIdsMap(message, 'device')
			getDeviceWebsocketStatus('OPEN')
		}
	}

	client.onclose = () => {
		console.log('WebSocket device Client Closed')
		getDeviceWebsocketStatus('CLOSED')
	}

	return null
}

export default DeviceWebsocket
