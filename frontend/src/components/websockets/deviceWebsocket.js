//Recieve data from Device API and pass it to the context
import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import DeviceContext from '../../context/device/deviceContext'
import WebsocketContext from '../../context/websocket/websocketContext'

//const client = new W3CWebSocket('ws://172.21.30.241:2000')
export const client = new W3CWebSocket('ws://localhost:2000')

const DeviceWebsocket = () => {
	//Define the context to use
	const deviceContext = useContext(DeviceContext)
	//Declare context functions
	const {
		getDeviceData,
		getDeviceWks,
		pushToDictionary,
		startDictionary,
		pushToDictionaryTemp,
	} = deviceContext
	//Websocket context call
	const websocketContext = useContext(WebsocketContext)
	//Websocket open function declaration
	const { websocketDeviceOpen } = websocketContext

	client.onerror = () => {
		console.error('Connection Error with WebSocket Device')
	}

	client.onopen = () => {
		console.log('WebSocket Device Client Connected')
		websocketDeviceOpen()
	}

	client.onmessage = message => {
		//Message is recieved as a string and gets parsed into JSON
		message = JSON.parse(message.data)
		//If message is an array
		if (Array.isArray(message) && message.length > 0) {
			//Passing initial data array into the context
			getDeviceWks(message)
		} else if (typeof message === 'object') {
			startDictionary()
			//pushToDictionaryTemp(message)
			getDeviceData(message)
			pushToDictionary(message)
			//Passing frequent data objects into the context
		}
	}

	client.onclose = () => {
		console.log('WebSocket device Client Closed')
	}

	return null
}

export default DeviceWebsocket
