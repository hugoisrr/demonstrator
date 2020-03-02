import { useContext } from 'react'
import { w3cwebsocket as W3CWebSocket } from 'websocket'
import LabelContext from '../../context/label/labelContext'
import WebsocketContext from '../../context/websocket/websocketContext'

//const client = new W3CWebSocket('ws://172.21.30.241:3000')
export const client = new W3CWebSocket('ws://localhost:3000')

const LablerWebsocket = () => {
	const labelContext = useContext(LabelContext)
	const { getLabelData, getLabelWks } = labelContext
	const websocketContext = useContext(WebsocketContext)
	const { websocketLabelOpen } = websocketContext

	client.onerror = () => {
		console.error('Connection Error with WebSocket Labler')
	}

	client.onopen = () => {
		console.log('WebSocket Labler Client Connected')
		websocketLabelOpen()
	}

	client.onmessage = message => {
		message = JSON.parse(message.data)
		if (Array.isArray(message) && message.length > 0) {
			getLabelWks(message)
		} else if (typeof message === 'object') {
			getLabelData(message)
		}
	}

	client.onclose = () => {
		console.log('WebSocket Model Client Closed')
	}

	return null
}

export default LablerWebsocket
