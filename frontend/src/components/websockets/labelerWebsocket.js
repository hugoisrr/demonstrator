import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import LabelerContext from '../../context/labeler/labelerContext'
import WebsocketContext from '../../context/websocket/websocketContext'

//const client = new W3CWebSocket('ws://172.21.30.241:3000')
export const client = new W3CWebSocket('ws://localhost:3000')

const LabelerWebsocket = () => {
	const labelerContext = useContext(LabelerContext)
	const { getLabelerData, getLabelerWks } = labelerContext
	const websocketContext = useContext(WebsocketContext)
	const { websocketLabelerOpen } = websocketContext

	client.onerror = () => {
		console.error('Connection Error with WebSocket Labeler')
	}

	client.onopen = () => {
		console.log('WebSocket Labeler Client Connected')
		websocketLabelerOpen()
	}

	client.onmessage = message => {
		message = JSON.parse(message.data)
		if (Array.isArray(message) && message.length > 0) {
			getLabelerWks(message)
		} else if (typeof message === 'object') {
			getLabelerData(message)
		}
	}

	client.onclose = () => {
		console.log('WebSocket Labeler Client Closed')
	}

	return null
}

export default LabelerWebsocket
