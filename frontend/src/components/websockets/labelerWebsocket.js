import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import LabelerContext from '../../context/labeler/labelerContext'

//const client = new W3CWebSocket('ws://172.21.30.241:3000')
export const client = new W3CWebSocket('ws://localhost:3000')

const LabelerWebsocket = () => {
	const labelerContext = useContext(LabelerContext)
	const {
		getLabelerData,
		getLabelerWks,
		pushToDictionary,
		startDictionary,
		getLabelerWebsocketStatus,
	} = labelerContext

	client.onerror = () => {
		console.error('Connection Error with WebSocket Labeler')
		getLabelerWebsocketStatus('ERROR')
	}

	client.onopen = () => {
		console.log('WebSocket Labeler Client Connected')
		getLabelerWebsocketStatus('CONNECTING')
	}

	client.onmessage = message => {
		message = JSON.parse(message.data)
		if (Array.isArray(message) && message.length > 0) {
			getLabelerWks(message)
		} else if (typeof message === 'object') {
			startDictionary()
			getLabelerData(message)
			pushToDictionary(message)
			getLabelerWebsocketStatus('OPEN')
		}
	}

	client.onclose = () => {
		console.log('WebSocket Labeler Client Closed')
		getLabelerWebsocketStatus('CLOSED')
	}

	return null
}

export default LabelerWebsocket
